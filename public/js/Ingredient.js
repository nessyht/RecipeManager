class unit {

}


export class Ingredient {
    constructor(name, quantity, unit, notes = null) {
        this.baseQuantity = quantity;
        this.baseUnit = unit;
        this.baseName = name;
        this.baseNotes = notes;

        this.reset();
    }

    scaleIngredient(multiplier) {
        this.reset()
        this.quantity = (this.baseQuantity * multiplier).toFixed(2);
        this.scaleUnit();
    }

    reset() {
        this.quantity = this.baseQuantity;
        this.unit = this.baseUnit;
        this.name = this.baseName;
        this.notes = this.baseNotes;
    }

    render() {
        const listItem = document.createElement('li');
        listItem.textContent = `${this.quantity} ${this.unit} ${this.name}`;
        listItem.dataset.text = `${this.quantity} ${this.unit} ${this.name}`;
        listItem.classList.add('tts-enabled'); // Mark for TTS
        return listItem;
    }
    static conversionDict = {
        'g': { threshold: 1000, comp: (a, threshold) => a >= threshold, conversionFactor: 1 / 1000, targetUnit: 'kg' }, // g to kg
        'kg': { threshold: 1, comp: (a, threshold) => a < threshold, conversionFactor: 1000, targetUnit: 'g' },  // kg to g (when quantity is less than 1)
        'ml': { threshold: 1000, comp: (a, threshold) => a >= threshold, conversionFactor: 1 / 1000, targetUnit: 'l' }, // ml to l
        'l': { threshold: 1, comp: (a, threshold) => a < threshold, conversionFactor: 1000, targetUnit: 'ml' }, // l to ml
    };

    scaleUnit() {
        const unitData = Ingredient.conversionDict[this.unit];
        if (unitData) {

            // Check if conversion is necessary (e.g., if the quantity satisfies the threshold)
            if (unitData.comp(this.quantity, unitData.threshold)) {
                this.quantity = (this.quantity * unitData.conversionFactor);
                this.unit = unitData.targetUnit;
            }
        }
    }

}
