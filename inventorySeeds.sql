DROP DATABASE IF EXISTS bamazon;

create database bamazon;

use bamazon;

create table products (
   item_id int not null primary key auto_increment,
   product_name  varchar(100) not null unique,
   department_name varchar(50),
   price decimal(8,2) NOT NULL,
   stock_quantity int
);

insert into products (
product_name, department_name, price, stock_quantity)
values 
("Web Design with HTML, CSS, JavaScript and jQuery Set", "Books", "56.86", "556"),
("OCA Oracle Database SQL Exam Guide", "Books", "34.59", "120" ),
("Fantastic Beasts", "Movies", "15.00", "749"),
("Black Panther", "Movies", "33.49", "1190"),
("AVENGERS: INFINITY WAR", "Movies", "33.49", "2200"),
("Instant Pot", "Home & Kitchen", "119.95", "201"),
("Electric Kettle", "Home & Kitchen", "99.95", "392"),
("Cuisinart Programmable Thermal Coffeemaker", "Home & Kitchen", "94.55", "122"),
("Bluetooth Headphones", "Electronic", "25.99", "82"),
("TaoTronics Bluetooth Transmitter and Receiver", "Electronic", "41.99", "62");
