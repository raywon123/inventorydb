const mysql = require("mysql");
const inquirer = require('inquirer');
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

const Table = require('table-layout');

var connection = mysql.createConnection({
    // host: "192.168.1.13",
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "testuser",

    // Your password
    password: "test123",

    // database
    database: "bamazon"
});


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
function queryProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        displayProducts(res);
        askToContinue();

    });
}

// function for create product
function createProduct() {
    console.log("Inserting a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: "Samsung Flat 55 4k TV",
            department_name: "Electronic",
            price: 547.99,
            stock_quantity: 50
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
        }
    );

    // logs the actual query being run
    console.log(query.sql);
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
        product_name: 'Product Name .......................................',
        department_name: 'Department ...',
        price: 'Price',
        stock_quantity: 'Quantity'
    };

    let col = new Table(columnName);
    let table = new Table(obj, { maxWidth: 100 });
    console.log(col.toString());
    console.log(table.toString());
}

// -- below are the functions for inquirer

// function to ask which item to buy
function askWhichToChoose(res) {
    inquirer.prompt([{
        type: 'input',
        message: 'Which Item Do You Want to Buy? (Please enter ID number)',
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
       (${item.department_name}) - ${item.product_name} -  ${formatter.format(item.price)} each
       `);

            askHowMany(item);
        }

    })
}

// function to ask how many to buy
function askHowMany(item) {
    inquirer.prompt([{
        type: 'input',
        message: 'How Many Do You Want to Buy?',
        name: 'number',
        validate: function (value) {
            var valid = false;
            if (!isNaN(parseFloat(value)) && parseFloat(value) > 0) {
                valid = true;
            }
            return valid || "Please enter a positive number and not a 0.";
        }
    }]).then(response => {

        let num = parseInt(response.number);
        let total = item.price * num;
        let inventory = item.stock_quantity - num;
        if (inventory > 0) {
            confirmOrder(item.item_id, inventory, total);
        }
        else {
            console.log(`Insufficient quantities to fill your order. We have ${item.stock_quantity} in stock.`);
            askHowMany(item);
        }
    })
}

// function to ask for order confirmation
function confirmOrder(id, num, total) {

    inquirer.prompt([{
        type: 'confirm',
        message: `Confirm Order: Total Cost is ${formatter.format(total)} :`,
        name: 'buy'
    }]).then(response => {

        if (response.buy) {
            console.log(`
        Order Confirmed. Your confirmation number is XXXXXXXXXXXX.
            `);
            updateProduct(id, num);
            // -- hook for adding customer order table
            // createOrder(cust_id, prod_id, prod_price, num);
        }
        else {
            console.log("Order Cancelled");
            askToContinue();
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
            "Add New Product"
        ]
    }]).then(response => {

        switch (response.myChoice) {

            case "View Products For Sale":
               queryProducts();
               
            default: 
               break;
        }
        // if (response.myChoice === "View Products For Sale") {     
        //     queryProducts();
        // }
        // if (response.myChoice === "View Low Inventory") {     
        //     queryProducts();
        // }
        // if (response.myChoice === "View Low Inventory") {     
        //     queryProducts();
        // }
        // if (response.myChoice === "View Low Inventory") {     
        //     queryProducts();
        // }
    })
}