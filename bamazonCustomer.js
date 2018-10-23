const mysql = require("mysql");
const inquirer = require('inquirer');

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
    console.log("connected as id " + connection.threadId + "\n");
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
    // connection.end();

});

// ----- below are the functions for data layer

// function for query product
function queryProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        displayProducts(res);
        askWhichToChoose(res);
        connection.end();
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
function updateProduct() {
    console.log("Updating quantities...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: 100
            },
            {
                item_id: 10
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
        }
    );

    // logs the actual query being run
    console.log(query.sql);
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
        console.log(`You have chosen: 
(${item.department_name}) - ${item.product_name} -  $${item.price} each.`);

        askHowMany();

    })
}

// function to ask how many to buy
function askHowMany() {
    inquirer.prompt([{
        type: 'input',
        message: 'How Many Do You Want to Buy?',
        name: 'number'
    }]).then(response => {

        let num = parseInt(response.number);
        console.log(`Awesome, you want to buy ${num}.`);
    })
}
