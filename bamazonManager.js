const mysql = require("mysql");
const inquirer = require('inquirer');
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

const Table = require('table-layout');

var connection = mysql.createConnection({
    host: "192.168.1.13",
    // host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "testuser",

    // Your password
    password: "test123",

    // database
    database: "bamazon"
});


// -- main program
// -- database connect
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");

    console.log("\n    ~~  Welcome To Amazing Online Store! (Manager View) ~~\n");
    displayChoices();

    // -- select from database
    // queryProducts();

    // -- insert product into database
    // createProduct();

    // -- update product to database
    // updateProduct();

    // -- delete product from database
    // deleteProduct();

});

// ----- below are the functions for data layer

// function for query product
function queryProducts(isQuery) {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        displayProducts(res);
        if (isQuery) {
            askToContinue();
        }
        else {
            askWhichToChoose(res);
        }

    });
}

// function for query product
function queryLowInv() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        displayProducts(res);
        askToContinue();

    });
}

// function for create product
function createProduct(name, department, price, quantity) {
    console.log("Inserting a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: quantity
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            askToContinue();
        }
    );

    // logs the actual query being run
    // console.log(query.sql);
    query.sql;
}

// function for update product
function updateProduct(id, num) {
    // console.log("Updating quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: num
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) throw err;
            // console.log(res.affectedRows + " products updated!\n");
            askToContinue();
        }
    );

    // logs the actual query being run
    // console.log(query.sql);
    query.sql;
}

// function for delete product 
function deleteProduct() {
    console.log("Deleting ...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        {
            item_id: 13
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products deleted!\n");
        }
    );
}

// function to display products - using 'table-layout' npm package
const displayProducts = (obj) => {

    // obj.forEach(e => {
    //     console.log(
    //         `${e.item_id} | ${e.department_name} | ${e.product_name}  | $${e.price}  | ${e.stock_quantity}`);
    // })

    let columnName = {
        item_id: 'ID',
        product_name: 'Product Name',
        department_name: 'Department',
        price: 'Price',
        stock_quantity: 'Quantity'
    };

    let col = new Table(columnName, { maxWidth: 100 });
    let table = new Table(obj, { maxWidth: 100 });
    // let table = new Table(obj, { maxWidth: 100, padding: {left: "  "} });
    // let table = new Table(obj, { columns: [{item_id: {padding: {left: "   "}}}] });
    console.log("");
    console.log(col.toString());
    console.log("------------------------------------------------------------------------------------------");
    console.log(table.toString());


}

// -- below are the functions for inquirer

// function to ask which item to buy
function askWhichToChoose(res) {
    inquirer.prompt([{
        type: 'input',
        message: 'Which Item Do You Want to Update The Quantity? (Please enter ID number)',
        name: 'id'
    }]).then(response => {

        let arrayid = parseInt(response.id) - 1;
        if (res[arrayid] == null) {
            console.log("You have chosen an incorrect product ID. Please Try again.");
            askWhichToChoose(res);
        }
        else {
            let item = res[arrayid];
            console.log(`
       You have chosen: 
       (${item.department_name}) - ${item.product_name} - Quantity: ${item.stock_quantity}
       `);

            askUpdateQuantity(item);
        }

    })
}


// function to ask if continue to shop
function askToContinue() {

    inquirer.prompt([{
        type: 'confirm',
        message: 'Do You Want To Continue?',
        name: 'decision'
    }]).then(response => {

        if (response.decision) {
            console.log('Great, Welcome Back.');
            displayChoices();
        }
        else {
            console.log("Good-bye.");
            connection.end();
            process.exit();
        }
    })
}

// function to show choices when begin
function displayChoices() {

    inquirer.prompt([{
        type: "list",
        message: "Menu Options: ",
        name: "myChoice",
        choices: [
            "View Products For Sale",
            "View Low Inventory",
            "Add To Inventory",
            "Add A New Product"
        ]
    }]).then(response => {

        let isQuery = true;

        switch (response.myChoice) {

            case "View Products For Sale":
                isQuery = true;
                queryProducts(isQuery);
                break;

            case "View Low Inventory":
                queryLowInv();
                break;

            case "Add To Inventory":
                isQuery = false;
                queryProducts(isQuery);
                break;

            case "Add A New Product":
                askAboutNewItem();
                break;

            default:
                break;
        }

    })
}


// function to ask for update quantity
function askUpdateQuantity(item) {
    inquirer.prompt([{
        type: 'input',
        message: 'How Many Do You Want to Add?',
        name: 'number',
        validate: function (value) {
            var valid = false;
            if (!isNaN(parseFloat(value)) && parseFloat(value) > -1) {
                valid = true;
            }
            return valid || "Please enter a positive number.";
        }
    }]).then(response => {

        let num = parseInt(response.number);
        let inventory = item.stock_quantity + num;
        if (inventory < 10000) {
            confirmUpdate(item.item_id, inventory);
        }
        else {
            console.log(`There will be too much (> 10,000) in inventory. We have ${item.stock_quantity} in stock and you are adding ${num}.`);
            askUpdateQuantity(item);
        }
    })
}

// function to ask for order confirmation
function confirmUpdate(id, num) {

    inquirer.prompt([{
        type: 'confirm',
        message: `Confirm Adding To Inventory - The Final Quantity is ${num} :`,
        name: 'isUpdated'
    }]).then(response => {

        if (response.isUpdated) {
            console.log(`
        The database has been updated. Your tracking number is XXXXXXXXXXXX.
            `);
            updateProduct(id, num);
            // -- hook for adding vendor order table
            // createVendorOrder(vendor_id, prod_id, prod_price, num);
        }
        else {
            console.log("Cancelled");
            askToContinue();
        }
    })
}

// function to ask about a new product that is to be added to database
function askAboutNewItem() {
    inquirer.prompt([{
        type: 'input',
        message: 'Product Name?',
        name: 'name'
    },
    {
        type: "list",
        message: "Department Options (Choose One Below): ",
        name: "department",
        choices: [
            "Books",
            "Movies",
            "Home & Kitchen",
            "Electronic"
        ]
    },   
    {
        type: 'input',
        message: 'Price?',
        name: 'price',
        validate: function (value) {
            var valid = false;
            if (!isNaN(parseFloat(value)) && parseFloat(value) > -1) {
                valid = true;
            }
            return valid || "Please enter a positive number.";
        }
    },
    {
        type: 'input',
        message: 'Quantity?',
        name: 'quantity',
        validate: function (value) {
            var valid = false;
            if (!isNaN(parseFloat(value)) && parseFloat(value) > -1) {
                valid = true;
            }
            return valid || "Please enter a positive number.";
        }
    }]).then(res => {

        createProduct(res.name, res.department, res.price, res.quantity);

    })
}

