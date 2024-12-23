import { Recipe } from './Recipe.js';
import { Pane } from './Pane.js';

/* DUMMY DATA */
const categoriesData = {
    "Lunch": ["Spaghetti"],
    "Schnecken": ["Zimtschnecken", "Kardamom schnecken"],
    "Cakes": []
}

const recipesData = [
    new Recipe(
        'Spaghetti',
        [
            { quantity: 200, unit: 'g', name: 'Spaghetti' },
            { quantity: 1, unit: 'cup', name: 'Tomato Sauce' },
            { quantity: 2, unit: 'tbsp', name: 'Olive Oil' }
        ],
        ['Boil water and cook the spaghetti. Boil water and cook the spaghetti. Boil water and cook the spaghetti.', 'Heat tomato sauce.', 'Mix and serve.']
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
            data.forEach(({ item, recipe }) => {
                recipesData.push(new Recipe(
                    item,
                    recipe,
                    []
                ));
            });
        })
        .catch(error => console.error('Error loading recipes:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // loadCategories();
    loadRecipes();

    const paneContainer = document.getElementById('pane-container');
    function openRecipe(recipe) {
        const pane = new Pane(recipe);
        pane.render(paneContainer);
    }


    const categoryList = document.getElementById('category-list');
    for (let category in categoriesData) {
        const recipes = categoriesData[category];
        if (recipes.length == 0) {
            continue;
        }
        const categoryElement = document.createElement('li');
        categoryElement.classList.add('category');

        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        categoryHeader.classList.add('category-header');
        categoryHeader.classList.add('collapsible');

        const recipeList = document.createElement('ul');
        recipeList.classList.add('recipe-list');

        for (let index in recipesData) {
            const recipeItem = recipesData[index];

            if (recipes.includes(recipeItem.name)) {
                const listItem = document.createElement('li');
                listItem.textContent = recipeItem.name;
                listItem.addEventListener('click', () => openRecipe(recipeItem));
                recipeList.appendChild(listItem);
            }
        }

        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(recipeList);

        categoryList.appendChild(categoryElement);
    }

    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            console.log("clicked")
            this.classList.toggle("active");

            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

});
