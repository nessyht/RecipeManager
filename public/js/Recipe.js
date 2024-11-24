import { Ingredient } from './Ingredient.js';
import { Instruction } from './Instruction.js';

export class Recipe {
    constructor(name, ingredients, instructions) {
        this.name = name;
        this.ingredients = ingredients.map(
            ({ quantity, unit, name }) => new Ingredient(quantity, unit, name)
        ); // Array of Ingredient objects
        this.instructions = instructions.map(
            text => new Instruction(text)
        ); // Array of Instruction objects
    }

    scaleRecipe(multiplier) {
        this.ingredients.forEach(ingredient => {
            ingredient.scaleIngredient(multiplier);
        });
        console.log(this.ingredients);
    }

    resetRecipeScaling() {
        this.ingredients.forEach(ingredient => {
            ingredient.reset();
        });
    }

    render() {
        const container = document.createElement('div');
        container.className = "recipe-container";

        // Render recipe name
        const title = document.createElement('h2');
        title.textContent = this.name;
        container.appendChild(title);

        // Render ingredients
        const ingredientsSection = document.createElement('div');
        ingredientsSection.innerHTML = '<h3>Ingredients</h3>';
        const ingredientsList = document.createElement('ul');
        this.ingredients.forEach(ingredient => {
            ingredientsList.appendChild(ingredient.render());
        });
        ingredientsSection.appendChild(ingredientsList);
        container.appendChild(ingredientsSection);

        // Render instructions
        const instructionsSection = document.createElement('div');
        instructionsSection.innerHTML = '<h3>Instructions</h3>';
        const instructionsList = document.createElement('ol');
        this.instructions.forEach(instruction => {
            instructionsList.appendChild(instruction.render());
        });
        instructionsSection.appendChild(instructionsList);
        container.appendChild(instructionsSection);

        return container;
    }
}
