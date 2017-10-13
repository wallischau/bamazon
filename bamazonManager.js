var mysql = require('mysql');
var func = require('./shared.js');
var inq = require('inquirer');
inq.prompt([
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
]).then(function(user) {
	// console.log(user);
	//extract code
	var code = user.action.substring(1,3);
	console.log(code);
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
	}//.then
});

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
		console.log('here');
		// console.log(func);
		func.displaySale(connection);
		// connection.end();
	});
}//viewProduct

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
		console.log('here2');
		// console.log(func);
		func.displayLow(connection);
		// connection.end();
	});
}//viewLowInventory

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
			console.log(user.id, user.quantity);
			var connection = mysql.createConnection({
				host: 'localhost',
				port: 3306,
				user: 'root',
				password: 'monKee!1',
				database: 'bamazon'
			});
			connection.connect(function(err) {
				if (err) throw err;
				console.log('here3');
				// console.log(func);
				func.addToInventory(connection, user.quantity, user.id);
				// connection.end();
			});

		});//.then

}//addInventory

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
			console.log(user);
			var connection = mysql.createConnection({
				host: 'localhost',
				port: 3306,
				user: 'root',
				password: 'monKee!1',
				database: 'bamazon'
			});
			connection.connect(function(err) {
				if (err) throw err;
				console.log('here4');
				// console.log(func);
				func.addNewProduct(connection, user.id, user.pname, user.department, user.price, user.quantity);
				// connection.end();
			});

		});//.then
}//addNewProduct