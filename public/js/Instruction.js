export class Instruction {
    constructor(text) {
        this.text = text;
    }

    render() {
        const listItem = document.createElement('li');
        listItem.textContent = this.text;
        listItem.dataset.text = this.text;
        listItem.classList.add('tts-enabled'); // Mark for TTS
        return listItem;
    }
}
