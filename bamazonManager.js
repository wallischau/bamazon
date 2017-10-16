/* App: bamazon Manager                               */
/* Author: Wallis Chau                                */
/* Date: 10/10/17                                     */
/* Description: List product inventory                */
/*              View low inventory product            */
/*              Add inventory                         */
/*              Add new product                       */


var mysql = require('mysql');
// var func = require('./shared.js');
var inq = require('inquirer');
require('console.table');
var colors = require('colors');

//answer handing
function answerHandling(user) {
	var code = user.action.substring(1,3);
	// console.log(code);
	switch (code) {
		case 'VP':
			viewProduct();
			break;
		case 'VL':
			viewLowInventory();
			break;
		case 'AI':
			addInventory();
			break;
		case 'AP':
			addNewProduct();
			break;
		default:
			return;
	}
}

//question prompt
var question = [
	{
		type: 'list',
		message: 'Menu:',
		name: 'action',
		choices: [
		'(VP) View Products for Sale',
		'(VL) View Low Inventory',
		'(AI) Add to Inventory',
		'(AP) Add New Product',
		'Exit?'
		]
	}
];

inq.prompt(question).then(answerHandling);

//display item for sale
var displayItemForSale = function(connection) {
	console.log('\nSale list:'.yellow);
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		inq.prompt(question).then(answerHandling);
		connection.end();
	});//query
}//displayItemForsale

//display products for sale
function viewProduct() {
	var connection = mysql.createConnection({
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'monKee!1',
		database: 'bamazon'
	});
	connection.connect(function(err) {
		if (err) throw err;
		// console.log('here');
		displayItemForSale(connection);
		// connection.end();
	});
}//viewProduct

//display low inventory
var displayLowInventory = function(connection) {
	console.log('\nLow inventory list:'.yellow);
	var query = connection.query("SELECT item_id, product_name, department_name, stock_quantity FROM products WHERE stock_quantity < ?", 
		[5], function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		inq.prompt(question).then(answerHandling);
		connection.end();
	});//query
}//displayItemForsale	

function viewLowInventory() {
	var connection = mysql.createConnection({
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'monKee!1',
		database: 'bamazon'
	});
	connection.connect(function(err) {
		if (err) throw err;
		// console.log('here2');
		displayLowInventory(connection);
		// connection.end();
	});
}//viewLowInventory

//add stock inventory
var addToInventory = function(connection, quantity, id) {
	//validate 
	if ((id === 'q') || (quantity === 'q')) {
		console.log('\n------------\n');
		inq.prompt(question).then(answerHandling);
		connection.end();
		return;
	}
	console.log('\nAdd to Inventory...'.yellow);
	// console.log(id, quantity);
	var query = connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantity, id], function(err, res) {
		if (err) throw err;
		// console.log(res);
		// console.table(res);
		if (res.affectedRows === 0) {
			console.log('!!!invalid entry!!!'.red);
		}
		else {
			console.log(`Item ${id} updated. \n================\n`.green);
		}
		inq.prompt(question).then(answerHandling);
		connection.end();
	});//query
}//addToInventory	 

function addInventory() {
	inq.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Item ID: ("q" to go back)',
			validate: function(value) {
				if ((isNaN(value) === true) && (value !== 'q')) {
					console.log(" \n Please enter number id or 'q'");
					return false;
				}
				else 
					return true;
			}
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'Quantity: ("q" to go back)',
			validate: function(value) {
				if ((isNaN(value) === true) && (value !== 'q')) {
					console.log(" \n Please enter number number or 'q'");
					return false;
				}
				else 
					return true;
			}
		}		
		])
		.then(function(user) {
			// console.log(user.id, user.quantity);
			var connection = mysql.createConnection({
				host: 'localhost',
				port: 3306,
				user: 'root',
				password: 'monKee!1',
				database: 'bamazon'
			});
			connection.connect(function(err) {
				if (err) throw err;
				// console.log('here3');
				addToInventory(connection, user.quantity, user.id);
				// connection.end();
			});

		});//.then
}//addInventory

//validate input 
function validateNewProd(id, name, department, price, quantity) {
	if ((id === 'q') || (price === 'q') || (quantity === 'q')) {
		return 1;
	}
	if ((id === '') || (name === '') || (department === '') || ( price < 0) || (price === '') || (quantity < 0) || (quantity === '')) {
		return 2;
	}
	else
		return 0;
}

//add new product
var addNewProd = function(connection, id, name, department, price, quantity) {
	console.log('\nAdd new product...'.yellow);
	// console.log(id, name, department, price, quantity);
	var query = connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ? ",
		 [[[id, name, department, price, quantity]]]
		 , function(err, res) {
		if (err) throw err;
		// console.log(res);
		if (res.affectedRows === 0) {
			console.log('invalid entry'.red);
		}
		else {
			// console.log('Item ' + id + ' added. \n================\n');
			console.log(`Item ${id} added. \n================\n`.green);
		}
		inq.prompt(question).then(answerHandling);
		connection.end();
	});//query
}//addNewProduct	 

//add new product
function addNewProduct() {
	inq.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Item ID: (\'q\' to go back) ',
			validate: function(value) {
				if ((isNaN(value) === true) && (value !== 'q')) {
					console.log(" \n Please enter number id or 'q'");
					return false;
				}
				else 
					return true;
			}
		},
		{
			type: 'input',
			name: 'pname',
			message: 'Product name: '
		},
		{
			type: 'input',
			name: 'department',
			message: 'Department: '
		},
		{
			type: 'input',
			name: 'price',
			message: 'Price: (\'q\' to go back)',
			validate: function(value) {
				if ((isNaN(value) === true) && (value !== 'q')) {
					console.log(" \n Please enter number or 'q'");
					return false;
				}
				else 
					return true;
			}
		},		
		{
			type: 'input',
			name: 'quantity',
			message: 'Quantity: (\'q\' to go back)',
			validate: function(value) {
				if ((isNaN(value) === true) && (value !== 'q')) {
					console.log(" \n Please enter number or 'q'");
					return false;
				}
				else 
					return true;
			}
		}		
		])
		.then(function(user) {
			// console.log(user);
			var status = validateNewProd(user.id, user.name, user.department, user.price, user.quantity);
			if (status > 0) {
				if (status === 2)
					console.log('!!!Invalid input!!!\n'.red);
				else
					console.log('==============\n');
				inq.prompt(question).then(answerHandling);
				return;
			}
			var connection = mysql.createConnection({
				host: 'localhost',
				port: 3306,
				user: 'root',
				password: 'monKee!1',
				database: 'bamazon'
			});
			connection.connect(function(err) {
				if (err) throw err;
				// console.log('here4');
				// console.log(func);
				addNewProd(connection, user.id, user.pname, user.department, user.price, user.quantity);
				// connection.end();
			});
		});//.then
}//addNewProduct