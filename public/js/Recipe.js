import { Ingredient } from './Ingredient.js';
import { Instruction } from './Instruction.js';

export class Recipe {
    constructor(name, ingredients, instructions) {
        this.name = name;
        this.ingredients = ingredients.map(({ name, quantity, unit, notes }) => {
            return new Ingredient(name, quantity, unit, notes || null);
        });

        this.instructions = instructions.map(
            text => new Instruction(text)
        ); // Array of Instruction objects
    }

    scaleRecipe(multiplier) {
        this.ingredients.forEach(ingredient => {
            ingredient.scaleIngredient(multiplier);
        });
    }

    resetRecipeScaling() {
        this.ingredients.forEach(ingredient => {
            ingredient.reset();
        });
    }

    ingredients_reading_text() {
        var ingredient_tts_text = "";
        this.ingredients.forEach((ingredient) => {
            console.log(ingredient);
            ingredient_tts_text += ingredient.quantity + " " + ingredient.unit + ", " + ingredient.name + ", ";
        });

        return ingredient_tts_text
    }

    instructions_reading_text() {
        var instructions_tts_text = "";
        this.instructions.forEach((instruction) => {
            console.log(instruction);
            instructions_tts_text += instruction.text + ", ";
        });

        return instructions_tts_text
    }

    reading_text() {
        return this.ingredients_reading_text() + ", " + this.instructions_reading_text();
    }

    render() {
        const container = document.createElement('div');
        container.className = "recipe-container";

        // Render recipe name
        const title = document.createElement('h2');
        title.classList.add("recipe-heading");
        title.classList.add("tts-enabled");
        title.textContent = this.name;
        container.appendChild(title);

        // Render ingredients
        const ingredientsSection = document.createElement('div');
        ingredientsSection.innerHTML = '<h3 class="ingredients-heading tts-enabled" data-text="Ingredients">Ingredients</h3>';
        const ingredientsList = document.createElement('ul');
        this.ingredients.forEach(ingredient => {
            ingredientsList.appendChild(ingredient.render());
        });
        ingredientsSection.appendChild(ingredientsList);
        container.appendChild(ingredientsSection);

        // Render instructions
        const instructionsSection = document.createElement('div');
        instructionsSection.innerHTML = '<h3 class="instructions-heading tts-enabled">Instructions</h3>';
        const instructionsList = document.createElement('ol');
        this.instructions.forEach(instruction => {
            instructionsList.appendChild(instruction.render());
        });
        instructionsSection.appendChild(instructionsList);
        container.appendChild(instructionsSection);

        return container;
    }
}
