const mysql = require("mysql");
const inquirer = require('inquirer');
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

var connection = mysql.createConnection({
    host: "192.168.1.13",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "testuser",

    // Your password
    password: "test123",
    database: "bamazon"
});


// -- database connect
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");

    // -- before
    queryProducts();

    // -- create product
    // createProduct();

    // -- update product
    // updateProduct();

    // -- delete product
    // deleteProduct();

    // -- after
    // queryProducts();
    
});

// ----- below are the functions for data layer

// function for query product
function queryProducts() {
    console.log("    ~~  Welcome To Amazing Online Store! ~~")
    console.log("        Showing All Products For Sale ...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        displayProducts(res);
        askWhichToChoose(res);
       
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

// function to display products
const displayProducts = (obj) => {
    // console.log(obj.length);
    obj.forEach(e => {
        console.log(
            `${e.item_id} | ${e.department_name} | ${e.product_name}  | $${e.price}  | ${e.stock_quantity}`);
    })
}

// -- below are the functions for inquirer

// function to ask which item to buy
function askWhichToChoose(res) {
    inquirer.prompt([{
        type: 'input',
        message: 'Which Item Do You Want to Buy?',
        name: 'id'
    }]).then(response => {

        let arrayid = parseInt(response.id) - 1;
        let item = res[arrayid];
        console.log(`
       You have chosen: 
       (${item.department_name}) - ${item.product_name} -  ${formatter.format(item.price)} each.
       `);

        askHowMany(item);

    })
}

// function to ask how many to buy
function askHowMany(item) {
    inquirer.prompt([{
        type: 'input',
        message: 'How Many Do You Want to Buy?',
        name: 'number'
    }]).then(response => {

        let num = parseInt(response.number);
        let total = item.price * num;
        let inventory = item.stock_quantity - num;
        if (inventory > 0) {
            confirmSale(item.item_id, inventory, total);
        }
        else {
            console.log(`Insufficient quantities to fill your order. We have ${item.stock_quantity} in stock.`);
            askHowMany(item);
        }
    })
}

// function to ask how many to buy
function confirmSale(id, num, total) {

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

// function to continue to shop
function askToContinue() {

    inquirer.prompt([{
        type: 'confirm',
        message: 'Do You Want To Continue Shopping?',
        name: 'decision'
    }]).then(response => {

        if (response.decision) {
            console.log('Great, Welcome Back.');
            queryProducts();
        }
        else {
            console.log("Thank You For Shopping. Come Back Next Time. Good-bye.");
            connection.end();
            process.exit();
        }
    })
}