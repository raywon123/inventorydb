var mysql = require("mysql");

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
    queryProducts();
    connection.end();
});

// ----- belows are the functions for data layer

// function for query product
function queryProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        displayProducts(res);
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
let displayProducts = (obj) => {
    // console.log(obj.length);
    obj.forEach(e => {
        console.log(
           `${e.item_id} | ${e.product_name}  | ${e.price}  | ${e.stock_quantity}`);
    })
}
