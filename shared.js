require('console.table');
var inq = require('inquirer');

var displayItemForSale = function(connection) {
	console.log('Sale list:');
	var query = connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		connection.end();
	});//query
}//displayItemForsale

var displayLowInventory = function(connection) {
	console.log('Low inventory list:');
	var query = connection.query("SELECT item_id, product_name, department_name, stock_quantity FROM products WHERE stock_quantity < ?", 
		[5], function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		connection.end();
	});//query
}//displayItemForsale	

var addToInventory = function(connection, quantity, id) {
	console.log('Add to Inventory...');
	console.log(id, quantity);
	var query = connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantity, id], function(err, res) {
		if (err) throw err;
		// console.log(res);
		// console.table(res);
		console.log(res.affectedRows + ' rows');
		connection.end();
	});//query
}//addToInventory	 

var addNewProduct = function(connection, id, name, department, price, quantity) {
	console.log('Add to Inventory...');
	console.log(id, name, department, price, quantity);
	var query = connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ? ",
		 [[[id, name, department, price, quantity]]]
		 , function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.log(res.affectedRows + ' rows');
		connection.end();
	});//query
}//addNewProduct	 

var displayProductSaleByDept = function(connection) {
	console.log('Display sales by departments:');
	var query = connection.query("SELECT department_id, p.department_name, over_head_costs, sum(p.product_sales) AS product_sales, (product_sales - over_head_costs) AS total_profit from products AS p INNER JOIN departments  AS d on p.department_name = d.department_name GROUP BY p.department_name", function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		connection.end();
	});//query
}//displayProductSaleByDept	

var createNewDept = function(connection, id, department, overheadCost) {
	console.log('Add to Department...');
	var query = connection.query("INSERT INTO departments(department_id, department_name, over_head_costs) VALUES ? ",
		 [[[id, department, overheadCost]]]
		 , function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.log(res.affectedRows + ' rows');
		connection.end();
	});//query
}//createNewDept	 

module.exports = {
	displaySale: displayItemForSale,
	displayLow: displayLowInventory,
	addToInventory: addToInventory,
	addNewProduct: addNewProduct,
	displayProductSaleByDept: displayProductSaleByDept,
	createNewDept: createNewDept 
}
