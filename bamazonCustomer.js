/* App: bamazon customer                            */
/* Author: Wallis Chau                              */
/* Date: 10/10/17                                   */
/* Description: List items for sale and place order */
/*              selected by user, update inventory  */

var mysql = require("mysql");
require('console.table');
var inq = require('inquirer');
var colors = require('colors');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
	password: 'monKee!1',
	database: 'bamazon'
});

//setup mysql connection
connection.connect(function(err) {
	if (err) throw err;
	// console.log('connected as id ' + connection.threadId);
	displayItemForSale();
});

//process answer
var answerHandling = function(resp) {
	// console.log(resp.inputId);
	// console.log(resp.quantity);
	//check for exit condition
	if ((resp.inputId === 'q') || (resp.quantity === 'q')) {
		connection.end();
		return;
	}
	//query the item
	placePurchase(resp);
}//answerHandling

//list questions
var question = [
	{
		type: 'input',
		name: 'inputId',
		message: 'Please enter product ID to purchase, (\'q\' to exit):',
		validate: function(value) {
			if ((isNaN(value) === true) && (value !== 'q')) {
				console.log(" \n Please enter valid id or 'q'");
				return false;
			}
			else 
				return true;
		}
	},
	{
		type: 'input',
		name: 'quantity',
		message: 'Number of units (\'q\' to quit):',
		validate: function(value) {
			if ((isNaN(value) === true) && (value !== 'q')) {
				console.log(" \n Please enter valid quantity or 'q'");
				return false;
			}
			else 
				return true;
		}
	}
];//question

//display items for sale
var displayItemForSale = function() {
	console.log('Sale list:'.yellow);
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
		if (err) throw err;
		//check if item is sold out
		// console.log(res);
		for (var i in res) {
			if (res[i].stock_quantity === 0) {
				//remove that item
				res.splice(i, 1);
			}
			//delete property from printing
			delete res[i].stock_quantity;

		}
		console.table(res);
		

		inq.prompt(question).then(answerHandling);

	});//query
}//displayItemForsale	 

//place purchase and update inventory
function placePurchase(resp) {
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity, product_sales FROM products WHERE item_id = ?", [resp.inputId], function(err, res) {
		if (err) throw err;
		// console.log(res);
		if (res.length === 0) {
			console.log('!!!Id not found!!!\n'.red);
			displayItemForSale();
			// inq.prompt(question).then(answerHandling);
			// connection.end();
			return;
		}
		if (res[0].stock_quantity >= resp.quantity) {
			//update inventory
			// console.log('ok');
			updateStock(resp.inputId, resp.quantity, res[0].stock_quantity, res[0].price, res[0].product_sales);
		} else {
			//insufficient
			console.log('insufficient stock. \n=========================\n'.red);
			displayItemForSale();
			// inq.prompt(question).then(answerHandling);
			// connection.end();
		}
	});//query
}//placePurchase

//update inventory
function updateStock(id, quantity, stock, price, totalSales) {
	var sales = quantity * price;
	var query = connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [stock - quantity, totalSales + sales, id], function(err, res) {
		if (err) throw err;
		// console.log(res.affectedRows,' row(s) updated');
		// console.log(' stock updated');
		console.log('Purschase complete'.green);
		console.log('here');
		console.log(`Total cost: ${sales} \n=========================\n`.green);
		displayItemForSale();
		// inq.prompt(question).then(answerHandling);
		// connection.end();
	});//query
}

