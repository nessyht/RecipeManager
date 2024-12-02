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
                <div class="scaling-buttons">
                    <button data-scale="0.5">x0.5</button>
                    <button data-scale="1">x1</button>
                    <button data-scale="2">x2</button>
                    <button data-scale="3">x3</button>
                    <button class="custom-scale-btn">Custom</button>
                    </div>
                    </div>
                    `;

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

    addEventListeners() {
        // Close button
        this.element.querySelector('.close-btn').addEventListener('click', () => {
            this.element.remove();
        });

        // Text size buttons
        this.element.querySelector('.text-small').addEventListener('click', () => this.setTextSize('small'));
        this.element.querySelector('.text-medium').addEventListener('click', () => this.setTextSize('medium'));
        this.element.querySelector('.text-large').addEventListener('click', () => this.setTextSize('large'));


        // Text-to-Speech for elements with the `tts-enabled` class
        this.element.querySelectorAll('.tts-enabled').forEach(item => {
            item.addEventListener('click', () => this.textToSpeech(item.dataset.text));
        });

        // Scaling buttons
        this.element.querySelectorAll('.scaling-buttons button').forEach(button => {
            button.addEventListener('click', event => this.scaleRecipe(event.target.dataset.scale));
        });
        // Custom scale button
        this.element.querySelector('.custom-scale-btn').addEventListener('click', () => {
            const customScale = prompt('Enter a custom multiplier (e.g., 1.5):');
            if (customScale && !isNaN(customScale)) {
                this.scaleRecipe(customScale);
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
        multiplier = parseFloat(multiplier);
        if (isNaN(multiplier)) return;

        this.recipe.scaleRecipe(multiplier);

        // Reremder the recipe to reflect the new quantities
        const recipeContainer = this.element.querySelector('.recipe-container');

        recipeContainer.replaceWith(this.recipe.render());
        this.addEventListeners();
    }

    textToSpeech(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }
}
