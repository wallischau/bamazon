var mysql = require('mysql');
// var func = require('./shared.js');
var inq = require('inquirer');
require('console.table');

function listMenu(user) {
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

inq.prompt(question).then(listMenu);

var displayItemForSale = function(connection, done) {
	console.log('\nSale list:');
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		inq.prompt(question).then(listMenu);
		connection.end();
		done = true;
		return done;
	});//query
}//displayItemForsale

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

var displayLowInventory = function(connection) {
	console.log('\nLow inventory list:');
	var query = connection.query("SELECT item_id, product_name, department_name, stock_quantity FROM products WHERE stock_quantity < ?", 
		[5], function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		inq.prompt(question).then(listMenu);
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

var addToInventory = function(connection, quantity, id) {
	console.log('\nAdd to Inventory...');
	// console.log(id, quantity);
	var query = connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantity, id], function(err, res) {
		if (err) throw err;
		// console.log(res);
		// console.table(res);
		if (res.affectedRows === 0) {
			console.log('invalid entry');
		}
		else {
			console.log(res.affectedRows + ' rows added');
		}
		inq.prompt(question).then(listMenu);
		connection.end();
	});//query
}//addToInventory	 

function addInventory() {
	inq.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Item ID: ',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
			}
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'Quantity: ',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
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

function validate(id, name, department, price, quantity) {
	if ((id === '') || (name === '') || (department === '') || ( price < 0) || (quantity < 0)) {
		return false;
	}
	else
		return true;
}

var addNewProd = function(connection, id, name, department, price, quantity) {
	console.log('\nAdd new product...');
	// console.log(id, name, department, price, quantity);
	var query = connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ? ",
		 [[[id, name, department, price, quantity]]]
		 , function(err, res) {
		if (err) throw err;
		// console.log(res);
		if (res.affectedRows === 0) {
			console.log('invalid entry');
		}
		else {
			console.log(res.affectedRows + ' rows added');
		}
		inq.prompt(question).then(listMenu);
		connection.end();
	});//query
}//addNewProduct	 

function addNewProduct() {
	inq.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Item ID: ',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
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
			message: 'Price: ',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
			}
		},		
		{
			type: 'input',
			name: 'quantity',
			message: 'Quantity: ',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
			}
		}		
		])
		.then(function(user) {
			// console.log(user);
			if(!validate(user.id, user.name, user.department, user.price, user.quantity)) {
				console.log('Invalid input');
				inq.prompt(question).then(listMenu);
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