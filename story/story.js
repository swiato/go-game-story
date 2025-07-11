class Utils {
    static renderPassage(elementId, passageName) {
        if (!window.story.passage) {
            console.log(`RenderPassage '${passageName}' in element '${elementId}'`);
            return;
        }

        const html = window.story.passage(passageName).render();
        const element = document.getElementById(elementId);
        element.innerHTML = html;
        const links = element.querySelectorAll('a');
        links.forEach(link => {
            const target = link.getAttribute('data-passage');
            link.removeAttribute('data-passage');

            link.addEventListener('click', function (event) {
                event.preventDefault();
                if (target) {
                    Utils.renderPassage(elementId, target);
                }
            });
        });
    }

    static visit(passageId) {
        const passage = window.story.passage(passageId);

        if (!passage.visited) {
            passage.visited = 1;
        } else {
            passage.visited++;
        }
    }

    static visited(passageId) {
        const passage = window.story.passage(passageId);
        return passage.visited;
    }
}

class Challenge {
    constructor(name, title, description, autoResponse, strictPlay, reviewMode, wonPassage, lostPassage) {
        this.name = name;
        this.title = title;
        this.description = description;
        this.autoResponse = autoResponse;
        this.strictPlay = strictPlay;
        this.reviewMode = reviewMode;
        this.wonPassage = wonPassage;
        this.lostPassage = lostPassage;
    }
}

const s = window.story.state;

s.player = {
    skills: new Set(),
    sanity: 3,
    currentChallenge: {},
    nextDialogue: ''
};

s.puzzleSets = {
    test: [
        `(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AB[dg][eg][cf][de][ee]AW[df][ef](;B[ff]C[{
  "failed": true
}]GB[1])(;B[fe];W[ff];B[gf];W[fg];B[fh];W[gg];B[hg];W[gh];B[gi];W[hh];B[ih];W[hi];B[ii]C[{
  "failed": false,
  "dialogue": "start",
  "skill": "ladder"
}]GB[1]))`,
    ],
    capturing01intro: [
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-07-09]AW[df][ef]AB[ee][de][cf][dg][eg]C[{"dialogue":"i1w7w9rfqFUoGh4wyNc1kd"}];B[ff]C[{"dialogue":"h8wPdxCSczo2LLuBhW8Mg3"}])',
    ],
    capturing01puzzles: [
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AB[dg][eg][cf][de][ee]AW[df][ef];B[ff])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AB[ci][dh][fi]AW[di][ei];B[eh])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AE[bg]AB[cf][de][ee][fe][dg][eg][fg]AW[df][ef][ff];B[gf])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AB[ag][ci]AW[ah][ai][bi];B[bh])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AE[ah]AB[ag][bg][cf][ae]AW[af][bf];B[be])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AB[dh][eh][fg][ef][cf][cg]AW[df][dg][eg];B[de])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AB[cf][dg][eg][ce][dd][ee]AW[de][df][ef];B[ff])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AE[dc][ec][cd][fe]AB[ce][dg][eg][ff][cf][dd][ed]AW[de][ee][df][ef]PL[B];B[fe])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AB[cf][ce][cd][dc][ed][ef][dg]AW[ee][de][dd][df];B[fe])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AB[cf][de][ed][fd][ff][eg][dg]AW[df][ef][ee][fe];B[ge])'
    ],
    saving01intro: [
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-07-10]AB[df][ef]AW[ee][de][cf][dg][eg]C[{"dialogue":"vcvM9FhvzBa6qk8jH8mbit"}](;B[fg];W[ff]C[{"dialogue":"wYgFJBk1K4EPy3FN7rAz3y", "failed":true}])(;B[ff]C[{"dialogue":"bQibLUeND8DLdz4J7hWMFB"}]))'
    ],
    saving01puzzles: [
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]AW[cf][de][ee][dg][eg]AB[df][ef]PL[B];B[ff])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[cf][ce][dd][ed][ef][dg]AB[df][de][ee];B[fe])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[ci][ch][ei][eh]AB[di][dh];B[dg])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[cf][de][dg][eg][ff][ed][fd]AB[df][ef][ee][fe];B[ge])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[ag][bg][cf][ce][ae]AB[af][bf][be];B[bd])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[cg][dh][eg][ef][ee][cf][ce]AB[dg][df][de];B[dd])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[ci][dh][fh][gi]AB[di][ei][fi][eh];B[eg])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[cg][cf][dh][eh][fh][gg][ff][ef]AB[df][dg][eg][fg];B[de])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[cf][dg][eg][fg][gf][ce][dd][ee]AB[ff][ef][df][de];B[fe])',
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-05-28]PL[B]AW[ce][dd][df][ec][fd][eg][ff]AB[ed][ee][fe][de][ef];B[ge])'
    ],
    atarigo01: [
        '(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[9]DT[2025-07-11]AB[ee][fd]AW[fe][ed]C[{"dialogue":"uRNMgWqiAHs4c6r9nrUMTU"}](;B[ef](;W[gd](;B[ge];W[fc]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[fc];W[ec](;B[ge];W[ff];B[fg];W[gf](;B[hf];W[he]C[{"dialogue":"gNn38eethP4KSnH2FivaYB", "failed":true}])(;B[he](;W[hf](;B[hc](;W[gc];B[gb];W[fb]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;W[hd];B[id];W[ie]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))(;B[hd];W[gc];B[gb];W[fb]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gc];W[hd];B[id];W[ie]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[if];W[hd];B[ie](;W[ig];B[hg];W[id]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;W[id](;B[hg];W[ig]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gg];W[ig]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[ig];W[hg];B[ih];W[hh](;B[hi];W[ii]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;B[ii];W[hi]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])))))(;W[gg](;B[hc];W[gc];B[gb];W[fb]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[hd];W[gc];B[gb];W[fb]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gc];W[hd];B[id];W[hc];B[hb];W[ic];B[ib]C[{"dialogue":"rzPbYaqoEMeMqT7Kyi6jEQ"}])))(;B[hd];W[he]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))(;B[gc];W[hc];B[ge](;W[ff];B[hd]C[{"dialogue":"qXHoaCyZnD9Xagztmp8LeR"}])(;W[hd];B[ff]C[{"dialogue":"qXHoaCyZnD9Xagztmp8LeR"}]))))(;W[fc](;B[ge];W[gd]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gd];W[ec];B[gf](;W[ge];B[he];W[ff];B[fg]C[{"dialogue":"tFhCvmwuPuDK3BFwcqYMbW"}])(;W[ff];B[fg];W[ge];B[he]C[{"dialogue":"tFhCvmwuPuDK3BFwcqYMbW"}])))(;W[ff];B[ge];W[gd](;B[gf];W[fc]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[fc];W[gf](;B[gc];W[he]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[he];W[hd];B[hf];W[hg](;B[ig];W[ie](;B[if];W[ih]C[{"dialogue":"2AvLLTr8dHXNeh6WAhr68Z", "failed": true}])(;B[gg];W[if]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))(;B[gg];W[fg](;B[fh];W[gh]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[hh];W[gh]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gh];W[ie](;B[if];W[ig]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;B[hh];W[if]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])))(;B[fg];W[gg];B[ig];W[ie](;B[gh];W[if]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[if];W[ih]C[{"dialogue":"2AvLLTr8dHXNeh6WAhr68Z", "failed":true}]))(;B[id];W[ic](;B[hc];W[ie]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[ie];W[hc](;B[ig];W[if]C[{"dialogue":"883Gm5JtqtCzKQoMXtbmFB", "failed": true}])(;B[if];W[ig]C[{"dialogue":"4HzawPwmSbe19rG8e4jzcz", "failed": true}]))))))(;W[ec];B[ge];W[ff]C[{"dialogue":"cnRiiavpSSXhVnt9AAhKze"}](;B[gf];W[fg](;B[eg];W[gg];B[hg](;W[gd];B[fc];W[fb];B[gc];W[hd](;B[hc];W[hf];B[he];W[ie]C[{"dialogue":"4HzawPwmSbe19rG8e4jzcz", "failed": true}])(;B[fh];W[gh];B[gi];W[hh];B[ih];W[hi];B[ii]C[{"dialogue":"rzPbYaqoEMeMqT7Kyi6jEQ"}])(;B[gh];W[fh];B[eh];W[fi](;B[gi];W[ei];B[di]C[{"dialogue":"fQsQZScy6m6wv5rQwy2Kch"}])(;B[ei](;W[gi];B[hi]C[{"dialogue":"fQsQZScy6m6wv5rQwy2Kch"}])(;W[hh];B[gi]C[{"dialogue":"fQsQZScy6m6wv5rQwy2Kch"}]))))(;W[hh](;B[gh];W[fh](;B[eh];W[gi]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gi](;W[fi];B[hi];W[ii]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;W[hi](;B[fi];W[ei]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;B[eh];W[fi]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])))(;B[ih];W[gi]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))(;B[fh];W[gh](;B[eh];W[hf](;B[ig](;W[if];B[ih];W[ii]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;W[ih];B[if];W[ie]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}]))(;B[he];W[ig]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))(;B[hf];W[eh](;B[fi](;W[ei];B[gi];W[hi]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;W[gi];B[ei];W[di]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}]))(;B[dh];W[fi]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])))))(;B[gg];W[eg];B[dg](;W[df];B[de];W[cf];B[eh];W[fh];B[gh];W[fi](;B[ei];W[gi];B[hi]C[{"dialogue":"fQsQZScy6m6wv5rQwy2Kch"}])(;B[gi](;W[ei];B[di]C[{"dialogue":"fQsQZScy6m6wv5rQwy2Kch"}])(;W[dh];B[ei]C[{"dialogue":"fQsQZScy6m6wv5rQwy2Kch"}])))(;W[dh];B[fh];W[eh](;B[ch](;W[gh](;B[fi](;W[gi];B[ei];W[di]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed": true}])(;W[ei];B[di]C[{"dialogue":"amKtKc9ercMjiP15rmXJC5"}]))(;B[hh];W[fi]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))(;W[df](;B[de];W[cg]C[{"dialogue":"g5QiEbZewWCQiUXf1MPs6v", "failed": true}])(;B[cg];W[de]C[{"dialogue":"g5QiEbZewWCQiUXf1MPs6v", "failed": true}])))(;B[gh];W[df](;B[de];W[cg]C[{"dialogue":"g5QiEbZewWCQiUXf1MPs6v", "failed": true}])(;B[cg];W[de]C[{"dialogue":"g5QiEbZewWCQiUXf1MPs6v", "failed": true}]))(;B[cg];W[gh](;B[hh];W[fi]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[fi](;W[gi];B[ei];W[di]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;W[ei];B[gi];W[hi]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}]))))))(;B[fg];W[gf];B[hf];W[gg];B[gh];W[hg];B[ig];W[hh];B[hi];W[ih];B[ii]C[{"dialogue":"rzPbYaqoEMeMqT7Kyi6jEQ"}]))(;W[ge](;B[dd];W[ec];B[dc];W[fc];B[gd];W[hd];B[gc];W[gb];B[hc];W[ic];B[hb];W[ha];B[ib];W[ia]C[{"dialogue":"8DkfLDG73b1cenKjmuerim", "failed":true}])(;B[gd];W[hd];B[he];W[hf](;B[gf];W[ie]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[hc]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[ie](;W[if](;B[hc]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[id];W[ic]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}]))(;W[id];B[if];W[ig]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}]))(;B[ff];W[ie]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))))(;B[ge];W[ff](;B[ef];W[gf];B[hf](;W[gd](;B[he];W[fc]C[{"dialogue":"maNqtcAVjDEwxHKgREkcTk", "failed": true}])(;B[fc];W[he]C[{"dialogue":"maNqtcAVjDEwxHKgREkcTk", "failed": true}]))(;W[he](;B[hd];W[gd]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gd];W[hg](;B[hd];W[if]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[gg];W[if]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[if](;W[ig](;B[hd];W[ie]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}])(;B[ie];W[id]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}]))(;W[ie](;B[ig];W[ih]C[{"dialogue":"dFzS2QPF4riiDHM6MLujo6", "failed":true}])(;B[gg];W[ig]C[{"dialogue":"tV3M9xoKJLMognpFi9Nef5", "failed":true}]))))))(;B[fc];W[de];B[ef];W[eg];B[df];W[cf];B[dg];W[dh];B[cg];W[bg];B[ch];W[ci];B[bh];W[ah];B[bi];W[ai]C[{"dialogue":"8DkfLDG73b1cenKjmuerim", "failed":true}])(;B[ec];W[dd](;B[dc];W[de];B[ef];W[eg];B[df];W[cf];B[dg];W[dh];B[cg];W[bg];B[ch];W[ci];B[bh];W[ah];B[bi];W[ai]C[{"dialogue":"8DkfLDG73b1cenKjmuerim", "failed":true}])(;B[gc];W[df](;B[de];W[ce];B[ef];W[eg]C[{"dialogue":"h3eBpsdNoxV7PxVgrw1sCn", "failed": true}])(;B[ef];W[eg];B[de];W[ce]C[{"dialogue":"h3eBpsdNoxV7PxVgrw1sCn", "failed": true}])))))'
    ]
};

const GoGame = {};
window.GoGame = GoGame;

GoGame.Challenge = Challenge;
GoGame.Utils = Utils;

GoGame.startChallenge = function (document) {
    const board = new Board();
    const challenge = s.player.currentChallenge;
    const puzzles = s.puzzleSets[challenge.name];
    const puzzleController = new PuzzleController(board, s.player, puzzles);

    new ChallengeController(document, puzzleController);
}