import { Recipe } from './Recipe.js';
import { Pane } from './Pane.js';

document.addEventListener('DOMContentLoaded', () => {
    const recipes = [
        new Recipe(
            'Spaghetti',
            [
                { quantity: 200, unit: 'g', name: 'Spaghetti' },
                { quantity: 1, unit: 'cup', name: 'Tomato Sauce' },
                { quantity: 2, unit: 'tbsp', name: 'Olive Oil' }
            ],
            ['Boil water and cook the spaghetti.', 'Heat tomato sauce.', 'Mix and serve.']
        ),
        new Recipe(
            'Zimtschnecken',
            [
                { quantity: 200, unit: 'g', name: 'Zimt' },
                { quantity: 2000, unit: 'g', name: 'Mehl' },
                { quantity: 1, unit: 'st', name: 'Eier' },
                { quantity: 1, unit: 'kg', name: 'Zucker' }
            ],
            ['Boil water and cook the spaghetti.', 'Heat tomato sauce.', 'Mix and serve.']
        ),
        new Recipe(
            'Kardamom schnecken',
            [
                { quantity: 200, unit: 'g', name: 'Kardamom' },
                { quantity: 2000, unit: 'g', name: 'Mehl' },
                { quantity: 1, unit: 'st', name: 'Eier' },
                { quantity: 1, unit: 'kg', name: 'Zucker' }
            ],
            ['Boil water and cook the spaghetti.', 'Heat tomato sauce.', 'Mix and serve.']
        ),
    ];

    const recipeList = document.getElementById('recipe-list');
    const paneContainer = document.getElementById('pane-container');

    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.textContent = recipe.name;
        listItem.addEventListener('click', () => openRecipe(recipe));
        recipeList.appendChild(listItem);
    });

    function openRecipe(recipe) {
        const pane = new Pane(recipe);
        pane.render(paneContainer);
    }
});
