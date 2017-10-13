DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price DECIMAL(6,2),
    stock_quantity INTEGER(4),
    PRIMARY KEY (item_id)
    );


INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(101, 'C++ for beginner', 'book', 20.0, 10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(102, 'JavaScript for beginner', 'book', 20.0, 10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(103, 'MySQL for beginner', 'book', 25.0, 3);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(104, 'Web design fundamental', 'book', 40.0, 5);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(105, 'HTML and CSS cheatsheet', 'book', 5.0, 10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(106, 'Javascript OOP approach', 'book', 15.0, 4);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(201, 'notebook', 'supply', 1.5, 20);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(202, 'notebook', 'supply', 1.5, 20);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(203, 'pen 10 count', 'supply', 3.0, 10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(204, 'highlight 4x', 'supply', 6.0, 4);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
	(205, 'paper 100 sheet', 'supply', 1.2, 20);
    
SELECT * FROM products;    

CREATE TABLE departments (
	department_id INTEGER(3) UNIQUE,
    department_name VARCHAR(20),
    over_head_costs DECIMAL(5,2));

ALTER TABLE products ADD product_sales DECIMAL(6,2) DEFAULT 0;


insert into departments  values (1, 'book', 100);
insert into departments  values (2, 'supply', 100);
insert into departments  values (3, 'electronic', 100);
delete from departments where department_id = 3;
select * from departments;

select sum(p.product_sales), p.department_name, d.over_head_costs from 
	products as p inner join departments  as d on 
	p.department_name = d.department_name group by p.department_name;

select department_id, p.department_name, over_head_costs, 
sum(p.product_sales) as product_sales, 
(product_sales - over_head_costs) as total_profit 
from products as p inner join departments  
as d on p.department_name = d.department_name group by p.department_name;