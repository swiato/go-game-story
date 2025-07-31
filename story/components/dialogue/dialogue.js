class Dialogue {
    startDialogue(passageName) {
        if(!window.story.passage(passageName)) {
            console.log(`Passage '${passageName}' doesn't exist!`);
            return;
        }

        const dialogueHtml = window.story.passage('components.dialogue').render();
        const passage = document.getElementsByTagName('tw-passage')[0];
        passage.insertAdjacentHTML('beforeend', dialogueHtml);
        this.#renderDialogue(passageName);
    }

    // static handleInput(ev) {
    //     console.log(ev);
    //     if (ev.code === 'Enter' || ev.code === 'Space') {
    //         if (Utils.target) {
    //             Utils.showDialogue('dialogue-box', Utils.target);
    //         }
    //     }
    // }

    #renderDialogue(passageName) {
        const dialogue = window.story.passage(passageName);
        window.dialogue = dialogue;

        if(!dialogue.visited) {
           dialogue.visited = 0;
        }

        const html = dialogue.render();

        dialogue.visited++;

        const dialogueOverlay = document.getElementById('dialogue-overlay');
        const dialogueText = document.getElementById('dialogue-text');
        const choiceBox = document.getElementById('choice-box');
        const dialogueBox = document.getElementById('dialogue-box');
        const dialogueNext = document.getElementById('dialogue-next');
        dialogueText.innerHTML = html;
        const links = [...dialogueText.querySelectorAll('a')];

        if (links.length == 0) {
            dialogueBox.onclick = () => dialogueOverlay.remove();
        } else if (links.length == 1) {
            const link = links[0];
            const target = link.getAttribute('data-passage');
            if (!target) {
                return;
            }
            link.remove();

            dialogueBox.onclick = () => {
                const tags = window.story.passage(target).tags;

                if (tags.includes('scene')) {
                    window.story.show(target);
                } else {
                    this.#renderDialogue(target);
                }
            };
        } else {
            const choices = links.map(link => {
                const target = link.getAttribute('data-passage');

                const choiceButton = document.createElement('div');
                choiceButton.className = 'choice-button';
                choiceButton.textContent = link.textContent;
                choiceButton.onclick = () => {
                    const tags = window.story.passage(target).tags;

                    if (tags.includes('dialogue')) {
                        this.#renderDialogue(target);
                    } else {
                        window.story.show(target);
                    }

                    choiceBox.innerHTML = '';
                    dialogueNext.classList.remove('hidden');
                };

                link.remove();

                return choiceButton;
            });

            dialogueBox.onclick = () => {
                dialogueBox.onclick = () => { };
                choices.forEach(choice => choiceBox.appendChild(choice));
                dialogueNext.classList.add('hidden');
            };
        }
    }
}