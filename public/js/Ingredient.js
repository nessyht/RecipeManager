class unit {
    constructor(id, tts, conversion) {
        this.id = id;
        this.tts = tts;
        this.conversion = conversion;
        this.threshold = conversion.threshold;
        this.conversion_comp = conversion.comp;
        this.conversion_factor = this.conversion_factor;
        this.targetUnit = this.targetUnit;
    }
}

const gram = new unit("g", "gram", { threshold: 1000, comp: (a, threshold) => a >= threshold, conversionFactor: 1 / 1000, targetUnit: 'kg' })

export class Ingredient {
    constructor(name, quantity, unit, notes = null) {
        this.baseQuantity = quantity;
        this.baseUnit = unit;
        this.baseName = name;
        this.baseNotes = notes;
        this.id = Math.random().toString(24);
        this.reset();
    }

    static conversionDict = {
        'g': { threshold: 1000, comp: (a, threshold) => a >= threshold, conversionFactor: 1 / 1000, targetUnit: 'kg' }, // g to kg
        'kg': { threshold: 1, comp: (a, threshold) => a < threshold, conversionFactor: 1000, targetUnit: 'g' },  // kg to g (when quantity is less than 1)
        'ml': { threshold: 1000, comp: (a, threshold) => a >= threshold, conversionFactor: 1 / 1000, targetUnit: 'l' }, // ml to l
        'l': { threshold: 1, comp: (a, threshold) => a < threshold, conversionFactor: 1000, targetUnit: 'ml' }, // l to ml
    };

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

    get_scaling(com_val, comp_unit) {
        if (this.baseUnit == comp_unit) {
            return com_val / this.baseQuantity;
        } else {
            const unitData = Ingredient.conversionDict[comp_unit];
            if (unitData) {
                return (com_val * unitData.conversionFactor) / this.baseQuantity;
            }
        }
    }

    unit_to_speech() {
        switch (this.unit) {
            case "g":
                return "Gramm";
            case "l":
                return "Liter";
            case "st":
                return "Stück";
            case "tbsp":
                return "Esslöffel";
            case "tsp":
                return "Teelöffel";
            default:
                return this.unit;
        }
    }

    quantity_tts() {
        return `${parseFloat(parseFloat(this.quantity.toString()).toFixed(4))}`;
    }

    get_tts_text() {
        return this.quantity_tts() + " " + this.unit_to_speech() + " " + this.name;
    }

    render() {
        this.scaleUnit();

        const listItem = document.createElement('li');
        listItem.id = this.id;
        listItem.innerHTML = `
            <input type="text" class="quantity-input" data-unit="${this.unit}" value="${this.quantity_tts()}">
            <span class="unit">${this.unit}</span>
            <span class="description">${this.name}</span>
        `
        // listItem.textContent = `${parseFloat(parseFloat(this.quantity.toString()).toFixed(4))} ${this.unit} ${this.name} `;
        listItem.dataset.text = this.get_tts_text();
        listItem.classList.add('ingredient'); // Mark for TTS
        // listItem.classList.add('tts-enabled'); // Mark for TTS
        return listItem;
    }


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
