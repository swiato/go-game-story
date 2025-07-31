class StateMachine {
    constructor(states, initialState) {
        this.states = states;
        this.currentState = this.states[initialState];
        this.currentState.onEnter();
    }

    changeState(state) {
        const next = this.states[state];

        if (!next) {
            console.log(`No such state as '${state}'!`);
            return;
        }

        this.currentState.onExit();
        this.currentState = next;
        this.currentState.onEnter();
    }
}

class State {
    constructor(context) {
        this.context = context;
    }

    onEnter() {
        throw new Error("onEnter() must be implemented by subclasses");
    }

    onExit() {
        throw new Error("onExit() must be implemented by subclasses");
    }
}

class IdleState extends State {
    onEnter() {
        this.context.restart.disabled = true;
        this.context.reset.disabled = true;
        this.context.next.disabled = true;
        this.context.undo.disabled = true;
        this.context.hint.disabled = false;
        this.context.hint.checked = false;

        this.context.setCaptures(0, 0);
        this.context.showSanity();

        this.context.hideSkill();

        this.context.puzzleController.addEventListener('played', this.context.onPlayed);
        this.context.puzzleController.addEventListener('dialogueStarted', this.context.onDialogueStarted)
    }

    onExit() {
        this.context.puzzleController.removeEventListener('played', this.context.onPlayed);
        this.context.puzzleController.removeEventListener('dialogueStarted', this.context.onDialogueStarted)
    }
}

class PlayingState extends State {
    onEnter() {
        this.context.restart.disabled = false;
        this.context.reset.disabled = false;
        this.context.next.disabled = true;
        this.context.undo.disabled = false;
        this.context.hint.disabled = false;
        this.context.hint.checked = false;

        this.context.puzzleController.addEventListener('played', this.onPlayed);
        this.context.puzzleController.addEventListener('loaded', this.context.onLoaded);
        this.context.puzzleController.addEventListener('waiting', this.onWaiting);
        this.context.puzzleController.addEventListener('solved', this.onSolved);
        this.context.puzzleController.addEventListener('failed', this.onFailed);
        this.context.puzzleController.addEventListener('skillUnlocked', this.onSkillUnlocked);
        this.context.puzzleController.addEventListener('dialogueStarted', this.context.onDialogueStarted)

    }

    onExit() {
        this.context.puzzleController.removeEventListener('played', this.onPlayed);
        this.context.puzzleController.removeEventListener('loaded', this.context.onLoaded);
        this.context.puzzleController.removeEventListener('waiting', this.onWaiting);
        this.context.puzzleController.removeEventListener('solved', this.onSolved);
        this.context.puzzleController.removeEventListener('failed', this.onFailed);
        this.context.puzzleController.removeEventListener('skillUnlocked', this.onSkillUnlocked);
        this.context.puzzleController.removeEventListener('dialogueStarted', this.context.onDialogueStarted)
    }

    onPlayed = (event) => {
        this.context.setCaptures(event.detail.blackCaptures, event.detail.whiteCaptures);
    };

    onSolved = () => {
        this.context.stateMachine.changeState('solved');
    };

    onFailed = () => {
        this.context.stateMachine.changeState('failed');
    };

    onWaiting = () => {
        this.context.stateMachine.changeState('waiting');
    };

    onSkillUnlocked = (event) => {
        this.context.showSkill(event.detail.skill);
        s.player.skills.add(event.detail.skill);
    };
}

class WaitingState extends State {
    onEnter() {
        this.context.restart.disabled = true;
        this.context.reset.disabled = true;
        this.context.next.disabled = true;
        this.context.undo.disabled = true;
        this.context.hint.disabled = true;

        this.context.puzzleController.addEventListener('played', this.context.onPlayed);
    }

    onExit() {
        this.context.puzzleController.removeEventListener('played', this.context.onPlayed);
    }
}

class SolvedState extends State {
    onEnter() {
        this.context.restart.disabled = true;
        this.context.reset.disabled = true;
        this.context.next.disabled = false;
        this.context.undo.disabled = true;
        this.context.hint.disabled = true;

        this.context.setProgress(this.context.puzzleController.currentPuzzleIndex + 1);
        this.context.show(this.context.solved);

        this.context.puzzleController.addEventListener('loaded', this.context.onLoaded);
        this.context.puzzleController.addEventListener('won', this.onWon);
    }

    onExit() {
        this.context.hide(this.context.solved);
        this.context.puzzleController.removeEventListener('loaded', this.context.onLoaded);
        this.context.puzzleController.removeEventListener('won', this.onWon);
    }

    onWon = (event) => {
        s.player.nextDialogue = event.detail.passage;
        this.context.stateMachine.changeState('won');
    };
}

class FailedState extends State {
    onEnter() {
        this.context.restart.disabled = false;
        this.context.reset.disabled = false;
        this.context.next.disabled = true;
        this.context.undo.disabled = true;
        this.context.hint.disabled = true;

        this.context.showSanity();
        this.context.show(this.context.failed);
        this.context.puzzleController.addEventListener('loaded', this.context.onLoaded);
        this.context.puzzleController.addEventListener('lost', this.onLost);
    }

    onExit() {
        this.context.hide(this.context.failed);
        this.context.puzzleController.removeEventListener('loaded', this.context.onLoaded);
        this.context.puzzleController.removeEventListener('lost', this.onLost);
    }

    onLost = (event) => {
        s.player.nextDialogue = event.detail.passage;
        this.context.stateMachine.changeState('lost');
    };
}

class WonState extends State {
    onEnter() {
        this.context.restart.disabled = true;
        this.context.reset.disabled = true;
        this.context.next.disabled = true;
        this.context.undo.disabled = true;
        this.context.hint.disabled = true;

        this.context.show(this.context.won);
        this.context.showNextPassage();
    }

    onExit() {
        this.context.hide(this.context.won);
        this.context.hideNextPassage();
    }
}

class LostState extends State {
    onEnter() {
        this.context.restart.disabled = true;
        this.context.reset.disabled = true;
        this.context.next.disabled = true;
        this.context.undo.disabled = true;
        this.context.hint.disabled = true;

        this.context.show(this.context.lost);
        this.context.showNextPassage();
    }

    onExit() {
        this.context.hide(this.context.lost);
        this.context.hideNextPassage();
    }
}

class BoardController {
    constructor(context, puzzleController) {
        this.context = context;
        this.puzzleController = puzzleController;
        this.challenge = this.puzzleController.challenge;

        this.progress = this.context.getElementById('progress');
        this.blackCaptures = this.context.getElementById('black-captures');
        this.whiteCaptures = this.context.getElementById('white-captures');
        this.sanity = this.context.getElementById('sanity');
        this.sanityContainer = this.context.getElementById('sanity-container');
        this.hint = this.context.getElementById('hint');
        this.hintContainer = this.context.getElementById('hint-container');
        this.skill = this.context.getElementById('skill');
        this.skillContainer = this.context.getElementById('skill-container');
        this.restart = this.context.getElementById('restart');
        this.reset = this.context.getElementById('reset');
        this.next = this.context.getElementById('next');
        this.undo = this.context.getElementById('undo');
        this.solved = this.context.getElementById('solved');
        this.failed = this.context.getElementById('failed');
        this.won = this.context.getElementById('won');
        this.lost = this.context.getElementById('lost');
        this.nextPassage = this.context.getElementById('next-passage');

        this.title = this.context.getElementById('title');
        this.description = this.context.getElementById('description');

        this.title.innerText = this.challenge.title;
        this.description.innerText = this.challenge.description;

        if (this.challenge.strictPlay) {
            this.hide(this.hintContainer);
        } else {
            this.show(this.hintContainer);
        }

        this.setProgress(0);

        this.hint.addEventListener('click', () => this.puzzleController.toggleHint(this.hint.checked));
        this.next.addEventListener('click', () => this.puzzleController.nextPuzzle());
        this.reset.addEventListener('click', () => this.puzzleController.loadPuzzle());
        this.restart.addEventListener('click', () => this.puzzleController.restartPuzzle());
        this.undo.addEventListener('click', () => this.puzzleController.undoMove());

        const states = {
            idle: new IdleState(this),
            playing: new PlayingState(this),
            waiting: new WaitingState(this),
            solved: new SolvedState(this),
            failed: new FailedState(this),
            won: new WonState(this),
            lost: new LostState(this),
        };

        this.stateMachine = new StateMachine(states, 'idle');

        this.puzzleController.loadPuzzle();
    }

    onPlayed = (event) => {
        this.setCaptures(event.detail.blackCaptures, event.detail.whiteCaptures);
        this.stateMachine.changeState('playing');
    };

    onLoaded = () => {
        this.stateMachine.changeState('idle');
    };

    onDialogueStarted = (event) => {
        this.showDialogue(event.detail.dialogue);
    };

    showDialogue(dialogue) {
        GoGame.startDialogue(dialogue);
    }

    setProgress(value) {
        this.progress.innerText = `${value}/${this.puzzleController.puzzles.length}`;
    }

    setCaptures(blackCaptures, whiteCaptures) {
        this.blackCaptures.innerText = blackCaptures;
        this.whiteCaptures.innerText = whiteCaptures;
    }

    showSanity() {
        if (this.puzzleController.challenge.reviewMode) {
            return;
        }

        this.show(this.sanityContainer);
        this.sanity.innerText = this.puzzleController.sanity;
    }

    showNextPassage() {
        this.show(this.nextPassage);
    }

    hideNextPassage() {
        this.hide(this.nextPassage);
    }

    showSkill(skill) {
        this.skill.innerText = skill;
        this.show(this.skillContainer);
    }

    hideSkill() {
        this.hide(this.skillContainer);
        this.skill.innerText = '';
    }

    hide(element) {
        element.classList.add('hidden');
    }

    show(element) {
        element.classList.remove('hidden');
    }
}

class PuzzleController extends EventTarget {
    constructor(board, player, puzzles) {
        super();

        this.record;
        this.board = board;
        this.puzzles = puzzles;
        this.sanity = player.sanity;
        this.player = JGO.BLACK;
        this.currentPuzzleIndex = 0;
        this.challenge = player.currentChallenge;
        this.failed = false;
        this.gameOver = false;

        this.board.addEventListener('move', this.#onBoardMove);
        this.board.setStrictPlay(this.challenge.strictPlay);
    }

    nextPuzzle() {
        this.currentPuzzleIndex++;
        this.#loadPuzzle(this.currentPuzzleIndex);
    }

    loadPuzzle() {
        this.#loadPuzzle(this.currentPuzzleIndex);
    }

    restartPuzzle() {
        this.currentPuzzleIndex = 0;
        this.#loadPuzzle(this.currentPuzzleIndex);
    }

    undoMove() {
        if (this.record.current.parent === null) {
            return;
        }

        this.hideHint();
        this.record.previous();
        this.board.undoMove();
        if (this.challenge.strictPlay) {
            this.showHint();
        }
    }

    toggleHint(on) {
        if (on) {
            this.showHint();
        } else {
            this.hideHint();
        }
    }

    showHint() {
        if (this.board.player != this.player) {
            return;
        }

        const validMoves = this.#getValidMoves(this.board.player);
        this.board.showHint(validMoves);
    }

    hideHint() {
        let hintedMoves = [...this.#getValidMoves(this.board.player), ...this.#getValidMoves(this.board.otherPlayer())];
        this.board.hideHint(hintedMoves);
    }

    disable(value) {
        this.board.disable(value);
    }

    #loadPuzzle(index) {
        const puzzle = this.puzzles[index];
        this.#loadRecord(puzzle);
        const record = new JGO.Record();
        record.jboard = this.record.jboard.clone();
        this.board.load(record);
        this.failed = false;

        if (this.challenge.strictPlay) {
            this.showHint();
        }

        this.#emitLoadedEvent();
        this.#handleComment(this.record.current.info?.comment);
    }

    #loadRecord(sgf) {
        const record = JGO.sgf.load(sgf, false);

        if (typeof record == 'string') {
            alert('Error loading SGF: ' + record);
            return;
        }

        if (!(record instanceof JGO.Record)) {
            alert('Empty SGF or multiple games in one SGF not supported!');
            return;
        }

        this.record = record;
    }

    #onBoardMove = (event) => {
        if (this.gameOver || this.failed) {
            return;
        }

        this.hideHint();

        this.#emitPlayedEvent(event);

        const answer = this.#findPuzzleAnswer(event.detail.move);

        if (answer > -1) {
            this.#advancePuzzle(answer);
        } else {
            this.#handleFailure();
        }
    };

    #findPuzzleAnswer = (move) => {
        const currentNode = this.record.getCurrentNode();

        const answers = currentNode.children.length;
        for (let answerIndex = 0; answerIndex < answers; answerIndex++) {
            let answer = currentNode.children[answerIndex];

            if (answer?.changes.find(change => move.equals(change.c))) {
                return answerIndex;
            }
        }

        return -1;
    }

    #advancePuzzle(answer) {
        const currentNode = this.record.next(answer);

        if (this.challenge.strictPlay) {
            this.showHint();
        }

        this.#handleComment(currentNode.info.comment);

        if (this.failed) {
            return;
        }

        if (currentNode.children.length == 0) {
            this.#handleSuccess();
        } else {
            this.#setAutoResponse();
        }
    }

    #handleComment(comment) {
        if (!comment) {
            return;
        }

        let obj;

        try {
            obj = JSON.parse(comment);
        } catch (e) {
            console.log(e);
            return;
        }

        if (obj.skill) {
            this.#emitSkillUnlockedEvent(obj.skill);
        }

        if (obj.dialogue) {
            this.#emitDialogueStartedEvent(obj.dialogue);
        }

        if (obj.failed) {
            this.#handleFailure();
        }
    }

    #setAutoResponse() {
        if (!this.challenge.autoResponse) {
            return;
        }

        if (this.player == this.board.player) {
            return;
        }

        const validMoves = this.#getValidMoves(this.board.player);
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        const move = validMoves[randomIndex];

        this.board.disable(true);
        this.board.setStrictPlay(false);
        this.#emitWaitingEvent();

        setTimeout(() => {
            this.board.disable(false);
            this.board.playMove(move);
            this.board.setStrictPlay(this.challenge.strictPlay);
        }, 500);
    }

    #getValidMoves(player) {
        const moves = this.record.current.children
            .flatMap(child => child.changes)
            .filter(change => 'type' in change)
            .filter(change => change.type == player)
            .map(change => change.c);

        return moves;
    }

    #handleSuccess() {
        this.#emitSolvedEvent();

        if (this.currentPuzzleIndex + 1 >= this.puzzles.length) {
            this.gameOver = true;
            this.#emitWonEvent();
        }
    }

    #handleFailure() {
        this.failed = true;
        this.sanity--;
        this.#emitFailedEvent();

        if (this.challenge.reviewMode) {
            return;
        }

        if (this.sanity <= 0) {
            this.gameOver = true;
            this.#emitLostEvent();
        }
    }

    #emitLoadedEvent() {
        this.dispatchEvent(new CustomEvent('loaded', { detail: { puzzleIndex: this.currentPuzzleIndex } }));
    }

    #emitPlayedEvent(event) {
        this.dispatchEvent(new CustomEvent('played', event));
    }

    #emitWaitingEvent() {
        this.dispatchEvent(new CustomEvent('waiting'));
    }

    #emitDialogueStartedEvent(dialogue) {
        this.dispatchEvent(new CustomEvent('dialogueStarted', { detail: { dialogue: dialogue } }));
    }

    #emitSkillUnlockedEvent(skill) {
        this.dispatchEvent(new CustomEvent('skillUnlocked', { detail: { skill: skill } }));
    }

    #emitSolvedEvent() {
        this.dispatchEvent(new CustomEvent('solved'));
    }

    #emitFailedEvent() {
        this.dispatchEvent(new CustomEvent('failed'));
    }

    #emitWonEvent() {
        this.dispatchEvent(new CustomEvent('won', { detail: { passage: this.challenge.wonPassage } }));
    }

    #emitLostEvent() {
        this.dispatchEvent(new CustomEvent('lost', { detail: { passage: this.challenge.lostPassage } }));
    }
}

class Board extends EventTarget {
    ko;
    lastMove;
    lastHover;
    lastX = -1;
    lastY = -1;
    boardSize = 9;
    disabled;
    strictPlay;

    constructor() {
        super();
        this.#createBoard();
        this.#initializeBoard();
    }

    load(record) {
        this.player = JGO.BLACK;
        this.record = record;
        this.board = this.record.jboard;
        this.notifier.changeBoard(this.board);
    }

    disable(value) {
        this.disabled = value;
    }

    setStrictPlay(on) {
        this.strictPlay = on;
    }

    playMove = (coord) => {
        if (this.disabled) {
            return;
        }

        if (this.strictPlay && this.board.getMark(coord) != JGO.MARK.SELECTED) {
            return;
        }

        this.#hideHover();

        const play = this.board.playMove(coord, this.player, this.ko);

        if (!play.success) {
            alert('Illegal move: ' + play.errorMsg);
            return;
        }

        const node = this.record.createNode(true);
        node.info.captures[this.player] += play.captures.length;
        node.setType(coord, this.player);
        node.setType(play.captures, JGO.CLEAR);

        if (this.lastMove)
            node.setMark(this.lastMove, JGO.MARK.NONE);
        if (this.ko)
            node.setMark(this.ko, JGO.MARK.NONE);

        node.setMark(coord, JGO.MARK.CIRCLE);
        this.lastMove = coord;

        if (play.ko)
            node.setMark(play.ko, JGO.MARK.CIRCLE);
        this.ko = play.ko;


        const lastPlayer = this.player;
        this.player = this.otherPlayer();

        const event = {
            move: this.lastMove,
            player: lastPlayer,
            blackCaptures: node.info.captures[JGO.BLACK],
            whiteCaptures: node.info.captures[JGO.WHITE]
        };

        this.#emitMoveEvent(event);
    };

    undoMove() {
        this.record.previous();
        this.player = this.otherPlayer();
    }

    showHint(moves) {
        this.board.setMark(moves, JGO.MARK.SELECTED);
    }

    hideHint(moves) {
        moves = moves.filter(move => this.board.getMark(move) == JGO.MARK.SELECTED);
        this.board.setMark(moves, JGO.MARK.NONE);
    }

    otherPlayer() {
        return this.player == JGO.BLACK ? JGO.WHITE : JGO.BLACK;
    }

    #createBoard() {
        this.player = JGO.BLACK;
        this.record = new JGO.Record(this.boardSize);
        this.board = this.record.jboard;
    }

    #initializeBoard() {
        const blackWhite = {
            textures: false,
            margin: { normal: 40, clipped: 40 },
            boardShadow: false,
            border: { color: 'black', lineWidth: 2 },
            padding: { normal: 0, clipped: 0 },
            grid: {
                color: 'black', x: 50, y: 50, smooth: 0.0,
                borderWidth: 1.5, lineWidth: 1.2
            },
            stars: { radius: 3, points: 5 },
            coordinates: { color: 'black', font: 'normal 18px sanf-serif' },
            stone: { radius: 24, dimAlpha: 0.6 },
            shadow: false,
            mark: {
                lineWidth: 1.5, blackColor: 'white', whiteColor: 'black',
                clearColor: 'black', font: 'normal 24px sanf-serif'
            }
        };

        const setup = new JGO.Setup(this.board, blackWhite);
        setup.create('board', (canvas) => {
            canvas.addListener('click', this.playMove);
            canvas.addListener('mousemove', this.#showHover);
            canvas.addListener('mouseout', this.#hideHover);
        });

        this.notifier = setup.getNotifier();
    }

    #showHover = (coord) => {
        if (this.disabled) {
            return;
        }

        if (coord.i == -1 || coord.j == -1 || (coord.i == this.lastX && coord.j == this.lastY)) {
            return;
        }

        if (this.lastHover) {
            this.board.setType(new JGO.Coordinate(this.lastX, this.lastY), JGO.CLEAR);
        }

        this.lastX = coord.i;
        this.lastY = coord.j;

        if (this.board.getType(coord) == JGO.CLEAR) {
            this.board.setType(coord, this.player == JGO.WHITE ? JGO.DIM_WHITE : JGO.DIM_BLACK);
            this.lastHover = true;
        } else {
            this.lastHover = false;
        }
    };

    #hideHover = () => {
        if (this.disabled) {
            return;
        }

        if (this.lastHover)
            this.board.setType(new JGO.Coordinate(this.lastX, this.lastY), JGO.CLEAR);

        this.lastHover = false;
    };

    #emitMoveEvent(event) {
        this.dispatchEvent(new CustomEvent('move', { detail: event }));
    }
}