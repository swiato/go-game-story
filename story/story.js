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