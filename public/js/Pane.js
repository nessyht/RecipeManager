export class Pane {

    constructor(recipe) {
        this.recipe = recipe;
        this.element = null;
        this.textSize = 'medium'; // Default text size
    }

    render(container) {
        // Remove the first pane if there are already two panes open
        // TODO: make this more flexible
        if (container.children.length >= 2) {
            container.removeChild(container.firstChild);
        }

        // Create the pane container
        const pane = document.createElement('div');
        pane.className = `pane ${this.textSize}`;
        pane.innerHTML = `
        <div class="pane-header">
            <button class="close-btn">✖</button>
            <div class="text-size-buttons">
                <button class="text-small">A-</button>
                <button class="text-medium">A</button>
                <button class="text-large">A+</button>
            </div>
            <input class="custom-scale-slider" type="range" min="0.5" max="20" step="0.5">
            <div class="custom-scale-container">
                <button data-scale="0.5">x0.5</button>
                <button data-scale="1">reset</button>
                <button data-scale="2">x2</button>
                <button data-scale="3">x3</button>
            </div>
            <div class="custom-scale-box">
                <input class="custom-scale-input" type="text" placeholder="Standard Rezept">
                <button class="custom-scale-btn">Anpassen</button>
            </div>
        </div>
        `;
        // <div class="pane-header">
        //     <button class="close-btn">✖</button>
        //     <div class="text-size-buttons">
        //         <button class="text-small">A-</button>
        //         <button class="text-medium">A</button>
        //         <button class="text-large">A+</button>
        //     </div>
        //     <div class="scaling-buttons">
        //         <div class="custom-scale-container">
        //             <button data-scale="0.5">x0.5</button>
        //             <button data-scale="1">reset</button>
        //             <button data-scale="2">x2</button>
        //             <button data-scale="3">x3</button>
        //             <input class="custom-scale-slider" type="range" min="0.5", max="20" step="0.5">
        //             <div>
        //                 <input class="custom-scale-input" type="text" placeholder="How much?">
        //                 <button class="custom-scale-btn">Custom</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        const paneContent = document.createElement('div');
        paneContent.className = "pane-content";

        // Append the rendered recipe
        paneContent.appendChild(this.recipe.render());
        pane.appendChild(paneContent);

        // Append to the container
        container.appendChild(pane);
        this.element = pane;

        // Add event listeners for interactivity
        this.addEventListeners();
    }

    addTTSEventListeners() {
        // Text-to-Speech for elements with the `tts-enabled` class
        this.element.querySelectorAll('.tts-enabled').forEach(item => {
            item.addEventListener('click', () => this.textToSpeech(item)); // {capture: true, once: true}
        });

    }

    addIngredientEventListeners() {
        this.element.querySelectorAll('.quantity-input').forEach(item => {
            item.addEventListener('blur', () => {
                console.log(item, item.parentElement, item.parentElement.id, item.value, item.dataset.unit);

                const derivedScalingValue = this.recipe.get_scaling_from_ingredient(item.parentElement.id, item.value, item.dataset.unit);
                console.log(derivedScalingValue);
                this.scaleRecipe(derivedScalingValue);
            }); // {capture: true, once: true}
        });
    }

    showScale(multiplier) {
        console.log(multiplier)

        this.element.querySelector('.custom-scale-input').value = `${multiplier}`
    }

    addEventListeners() {
        // Close button
        this.element.querySelector('.close-btn').addEventListener('click', () => {
            this.element.remove();
        });

        // Text size buttons
        this.element.querySelector('.text-small').addEventListener('click', () => this.setTextSize('smaller'));
        this.element.querySelector('.text-medium').addEventListener('click', () => this.setTextSize('reset'));
        this.element.querySelector('.text-large').addEventListener('click', () => this.setTextSize('larger'));


        this.addTTSEventListeners();
        this.addIngredientEventListeners();
        // Scaling buttons
        this.element.querySelectorAll('.custom-scale-container button').forEach(button => {
            button.addEventListener('click', event => this.scaleRecipe(event.target.dataset.scale));
        });

        // Custom scale button
        this.element.querySelector('.custom-scale-slider').addEventListener('input', input => {
            const multiplier_val = this.element.querySelector('.custom-scale-slider').value;
            this.scaleRecipe(multiplier_val);
        });

        this.element.querySelector('.custom-scale-btn').addEventListener('click', () => {
            const customScaleInput = this.element.querySelector('.custom-scale-input');
            const customScaleValue = customScaleInput.value;

            console.log(customScaleValue);
            if (customScaleValue && !isNaN(customScaleValue)) {
                this.scaleRecipe(customScaleValue);
            }
        });
    }

    // TODO: Mark active option
    setTextSize(size) {
        this.textSize = size;
        this.element.className = `pane ${this.textSize}`;
    }


    // TODO: Mark active option
    scaleRecipe(multiplier) {
        console.log(multiplier)
        multiplier = parseFloat(multiplier);
        if (isNaN(multiplier)) return;

        this.recipe.scaleRecipe(multiplier);

        // Reremder the recipe to reflect the new quantities
        const recipeContainer = this.element.querySelector('.recipe-container');

        recipeContainer.replaceWith(this.recipe.render());
        this.showScale(multiplier);
        this.addTTSEventListeners();
        this.addIngredientEventListeners();
    }

    textToSpeech(item) {
        var text_to_speak = null;
        if (item.classList.contains("recipe-heading")) {
            text_to_speak = this.recipe.get_tts_text()
        } else if (item.classList.contains("ingredients-heading")) {
            text_to_speak = this.recipe.ingredients_reading_text()
        } else if (item.classList.contains("instructions-heading")) {
            text_to_speak = this.recipe.instructions_reading_text()
        } else {
            text_to_speak = item.dataset.text;
        }

        const utterance = new SpeechSynthesisUtterance(text_to_speak);
        utterance.lang = "de-DE";
        speechSynthesis.speak(utterance);
    }
}
