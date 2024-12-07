import { Recipe } from './Recipe.js';
import { Pane } from './Pane.js';

/* DUMMY DATA */
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
/* DUMMY DATA */

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');    // trim leading/trailing white space
    str = str.toLowerCase();                // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '')   // remove any non-alphanumeric characters
        .replace(/\s+/g, '-')               // replace spaces with hyphens
        .replace(/-+/g, '-');               // remove consecutive hyphens
    return str;
}

// Load recipes from the server
function loadRecipes() {
    fetch('/api/recipes')
        .then(response => response.json())
        .then(data => {
            // console.log("recipes arrived", data.length, data);

            data.forEach(({ item, recipe }) => {
                // console.log("items:", item, recipe);
                recipes.push(new Recipe(
                    item,
                    recipe,
                    []
                ));
            });

            // // Automatically switch to the first category if available
            // const firstCategory = Object.keys(recipeCategories)[0];
            // if (firstCategory) switchTab(firstCategory);
        })
        // .then(() => {

        // })
        .catch(error => console.error('Error loading recipes:', error));
}

document.addEventListener('DOMContentLoaded', () => {

    loadRecipes();

    const paneContainer = document.getElementById('pane-container');
    function openRecipe(recipe) {
        const pane = new Pane(recipe);
        pane.render(paneContainer);
    }
    const recipeList = document.getElementById('recipe-list');
    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.textContent = recipe.name;
        listItem.addEventListener('click', () => openRecipe(recipe));
        recipeList.appendChild(listItem);
    });

});
