const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all recipes from the "Recipes" folder
app.get('/api/recipes', (req, res) => {
    const recipesDir = path.join(__dirname, 'recipes');

    // Read all CSV files in the "Recipes" directory
    fs.readdir(recipesDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to load recipes' });
        }

        // Filter for CSV files and parse them
        const csvFiles = files.filter(file => file.endsWith('.csv'));
        const recipeData = [];

        csvFiles.forEach(file => {
            const filePath = path.join(recipesDir, file);
            const item = path.basename(file, '.csv'); // Use file name as category

            // Read and parse each CSV file
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const lines = data.trim().split('\n');

                const recipe = lines.map(line => {
                    const [ingredient, quantity, unit, notes] = line.split(',');
                    return { // split(';').map(item => item.trim())
                        ingredient: ingredient ? ingredient.trim() : 'Unnamed',
                        quantity: quantity ? quantity.trim() : 'stueck',
                        unit: unit ? unit.trim() : '',
                        notes: notes ? notes.trim() : '',
                    };
                });

                recipeData.push({ item, recipe });
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
            }
        });

        // Send the parsed recipe data as JSON
        res.json(recipeData);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
