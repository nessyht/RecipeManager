const express = require('express');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');
const { json } = require('stream/consumers');
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


function parseCSV(csv) {
    // Split the CSV into lines and clean them
    const lines = csv.split("\n").map(line => line.trim()).filter(line => line !== "");

    let categoriesData = {};
    let currentCategory = '';
    let currentRecipe = '';
    let ingredients = [];
    let instructions = [];

    // Loop through each line
    lines.forEach(line => {
        // Skip empty lines (if any)
        if (line === '') return;

        // If the line is a recipe name (e.g., "Tomatenschnecke"), detect it as a category or recipe
        if (!line.includes(",") && !line.startsWith("Zutat") && line.length > 2) {
            if (currentRecipe) {
                // Store the previous recipe before moving to the next one
                if (!categoriesData[currentCategory]) categoriesData[currentCategory] = [];
                categoriesData[currentCategory].push({
                    [currentRecipe]: {
                        ingredients,
                        instructions
                    }
                });
            }
            // Detect the new category or recipe (for now, we’ll assume all recipes go under "Schnecken")
            currentCategory = ""; // Or dynamically infer the category if needed
            currentRecipe = line; // Current recipe name (e.g., "Tomatenschnecke")
            ingredients = []; // Reset the ingredients array
            instructions = []; // Reset instructions
        }
        // If the line contains "Zutat", skip as it’s just the header for ingredients
        else if (line.startsWith("Zutat")) {
            return;
        }
        // Parse ingredients (lines with at least 3 comma-separated values: name, quantity, unit, note)
        else {
            const columns = line.split(",").map(col => col.trim());
            if (columns.length >= 4) {
                const name = columns[0];
                const quantity = parseFloat(columns[1]) || null;
                const unit = columns[2] || "";
                const note = columns[3] || "";
                ingredients.push({ name, quantity, unit, note });
            }
        }
    });

    // Don't forget to add the last recipe to the categoriesData
    if (currentRecipe) {
        if (!categoriesData[currentCategory]) categoriesData[currentCategory] = [];
        categoriesData[currentCategory].push({
            [currentRecipe]: {
                ingredients,
                instructions
            }
        });
    }

    return categoriesData;
}

// Function to parse a sheet and extract tables
function parseSheet(sheet) {
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    const tables = [];

    let currentTable = null;
    const nullEnd = 10;
    let nullCount = 0;

    console.log(sheet);
    // Iterate through the rows of data
    data.forEach((row, rowIndex) => {

        // console.log(rowIndex, row);
        let startNewTable = false;
        let currentRowTable = [];

        // Iterate through each cell in the row
        row.forEach((cell, colIndex) => {
            if (cell !== null) {
                if (currentRowTable.length === 0 || row[colIndex - 1] === null) {
                    // Start of a new table in the row
                    if (currentRowTable.length > 0) {
                        tables.push(currentRowTable);  // Push previous table
                    }
                    currentRowTable = [cell];  // Start a new table
                } else {
                    // Continue adding to the current table
                    currentRowTable.push(cell);
                }
            } else if (currentRowTable.length > 0) {
                // If we encounter an empty cell, we finish the current table if it exists
                console.log(currentRowTable);
                tables.push(currentRowTable);
                if (currentRowTable.every((inVal) => inVal === 0)) {
                    nullCount += 1;
                    if (nullCount == nullEnd) {
                        console.log("Last row", rowIndex - 10);
                        return;
                    }
                } else {
                    nullCount = 0;
                }
                currentRowTable = [];
            }
        });

        // If the row ends with a table, we need to push it
        if (currentRowTable.length > 0) {
            tables.push(currentRowTable);
        }
    });


    // Convert tables into dictionaries with column names and data
    const tableData = tables.map(table => {
        const columns = table[0];  // The first row as column names
        const rows = table.slice(1);  // The rest of the rows as data
        console.log(table);
        // Convert rows to objects with column names as keys
        const tableDict = rows.map(row => {
            const rowData = {};
            row.forEach((cell, index) => {
                rowData[columns[index]] = cell;
            });
            return rowData;
        });

        return {
            columns,
            data: tableDict
        };
    });

    return tableData;
}


const sheetData = {};
// Function to parse a single .xlsx file
function parseExcelFile(filePath) {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Parse the .xlsx file into a workbook object
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });


    // Iterate through each sheet in the workbook
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];

        const tables = parseSheet(sheet);  // Parse the tables in the sheet
        sheetData[sheetName] = tables;

        // Convert sheet to JSON format
        // const jsonData = XLSX.utils.sheet_to_json(sheet);
        // console.log(`Data from sheet: ${sheetName} in file: ${filePath}`);
        // for (const key of jsonData) {
        //     const value = jsonData[key];
        //     console.log(key, value);
        // };
    });

}

// Function to read and parse all .xlsx files in the folder
function parseExcelFilesInFolder(folderPath) {
    // Read the folder contents
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        // Filter only .xlsx files
        const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));

        // Iterate over each .xlsx file
        xlsxFiles.forEach(file => {
            const filePath = path.join(folderPath, file);
            parseExcelFile(filePath);
        });
    });
}

// const folderPath = "recipes"
// parseExcelFilesInFolder(folderPath);
// console.log(sheetData);
// const parsedData = parseCSV(csvData);
// Output categoriesData
// console.log(JSON.stringify(parsedData, null, 2));




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
