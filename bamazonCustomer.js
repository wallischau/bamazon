var mysql = require("mysql");
require('console.table');
var inq = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: 'monKee!1',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id ' + connection.threadId);
	displayItemForSale(true);
});


var displayItemForSale = function() {
	console.log('sale list');
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
		if (err) throw err;
		//check if item is sold out
		// console.log(res);
		for (var i in res) {
			// console.table(res[i].item_id + ' ' + res[i].product_name + ' ' + res[i].price);
			if (res[i].stock_quantity === 0) {
				//remove that item
				res.splice(i, 1);
			}
			//delete property from printing
			delete res[i].stock_quantity;

		}
		console.table(res);
		
		var question = [
		{
			type: 'input',
			name: 'inputId',
			message: 'Please enter product ID to purchase',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
			}
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many unit?',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
			}
		}
		];//question

		var listMenu = function(resp) {
			console.log(resp.inputId);
			console.log(resp.quantity);
			//query the item
			placePurchase(resp);
		}

		inq.prompt(question).then(listMenu);

	});//query
}//displayItemForsale	 


function placePurchase(resp) {
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity, product_sales FROM products WHERE item_id = ?", [resp.inputId], function(err, res) {
		if (err) throw err;
		// console.log(res);
		if (res.length === 0) {
			console.log('id not found\n');
			connection.end();
			return;
		}
		if (res[0].stock_quantity >= resp.quantity) {
			//update inventory
			// console.log('ok');
			updateStock(resp.inputId, resp.quantity, res[0].stock_quantity, res[0].price, res[0].product_sales);
		} else {
			//insufficient
			console.log('insufficient stock.');
			connection.end();
		}
	});//query
}//placePurchase

function updateStock(id, quantity, stock, price, totalSales) {
	var sales = quantity * price;
	var query = connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [stock - quantity, totalSales + sales, id], function(err, res) {
		if (err) throw err;
		// console.log(res.affectedRows,' row(s) updated');
		// console.log(' stock updated');
		console.log('Purschase complete');
		console.log('Total cost: ' + sales );
		connection.end();
	});//query
}

