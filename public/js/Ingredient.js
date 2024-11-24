export class Ingredient {
    constructor(quantity, unit, name) {
        this.baseQuantity = quantity;
        this.baseUnit = unit;
        this.baseName = name;
        this.reset();
    }

    scaleIngredient(multiplier) {
        this.quantity = (this.baseQuantity * multiplier).toFixed(2);
        console.log(this.quantity, this.baseQuantity, multiplier);
    }

    reset() {
        this.quantity = this.baseQuantity;
        this.unit = this.baseUnit;
        this.name = this.baseName;
    }

    render() {
        const listItem = document.createElement('li');
        listItem.textContent = `${this.quantity} ${this.unit} ${this.name}`;
        listItem.dataset.text = `${this.quantity} ${this.unit} ${this.name}`;
        listItem.classList.add('tts-enabled'); // Mark for TTS
        return listItem;
    }
}
