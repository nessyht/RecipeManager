export class Instruction {
    constructor(text) {
        this.text = text;
    }

    render() {
        const listItem = document.createElement('li');
        listItem.textContent = this.text;
        listItem.dataset.text = this.get_tts_text();
        listItem.classList.add('tts-enabled'); // Mark for TTS
        return listItem;
    }

    get_tts_text() {
        return this.text;
    }
}
