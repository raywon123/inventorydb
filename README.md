## InventoryDB

[Youtube Demo - Customer View](
https://youtu.be/Jx_MD4fHYok )

[Youtube Demo - Manager View](
https://youtu.be/732CbFewPKQ )

[My Portfolio Page](
https://raywon123.github.io/portfolio.html )

## What it does:

This program simulates a store front operation. There are two programs: one for the customer and one for the manager. Both will update the product inventory stores in the database. The program is written in node.js and using MySQL as a database.

## Run the programs:

  Customer View:

        $ node bamazonCustomer.js

  Manager View:

        $ node bamazonManager.js

## Detail description:

 ### Customer View:
     
  a) A typical sale.
       It will show all products on sale.
       Then the customer chooses the product and quantity.
       Then it will ask for confirmation.
       Then it will put in the order and deduct the quantity in inventory.


   ![alt text](/images/customer1-order.png?raw=true "A Typical Sale") 

   b) Case when there is not enough quantity.

   ![alt text](/images/customer2-not.png?raw=true "Not enough quantity") 
  
   c) Customer cancels order.

   ![alt text](/images/customer3-cancel.png?raw=true "Customer cancels") 

  ### Manager View:

   a) Showing the Manager Menu:

   ![alt text](/images/manager1-menu.png?raw=true "Menu") 

   b) View the inventory.

   ![alt text](/images/manager2-view.png?raw=true "Inventory View") 

   c) Find low inventory product (less than 5).

   ![alt text](/images/manager3-low.png?raw=true "Low Quantity") 
  
   d) Update quantity

   ![alt text](/images/manager4-update.png?raw=true "Update Quantity") 
    
  e) Enter a new product into database

   ![alt text](/images/manager5-new.png?raw=true "New Product") 
    
-----------------------------------------------------------------------

## npm packages used: 

* mysql
* inquirer
* table-layout
* formatter

## Technology:

* Using MySQL database
* Using inquirer and add validation functions

-----------------------------------------------------------------------

## Future Improvement:

#### Customer View:

* Create customer profile table to track name and address.

* Create customer order table to track orders. Use foreign key constraint for the products table. Use foreign key constraint for the customer profile table. And adding
timestamp in the table.

* Add continue to show option if products have more 10 products on sale.

* Format the display different using choices.

* Create a shopping cart to keep all the orders all at once before checkout.

* Tune the console output table to be a better format.

#### Manager View:

 * Adding update price feature

 * Adding remove product feature

 * Tune the console output table to be a better format.
