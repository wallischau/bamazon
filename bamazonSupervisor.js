var mysql = require('mysql');
var inq = require('inquirer');
var func = require('./shared.js');

inq.prompt([
	{
	type: 'list',
	name: 'action',
	message: 'Select action:',
	choices: ['(VP) View PRoduct Sales by Department',
			  '(NP) Create New Department']
	}
]).then(function(user) {
	console.log(user);
	var act = user.action.substring(1,3);
	switch (act) {
		case 'VP':
			console.log('VP');
			displaySaleByDepartment();
			break;
		case 'NP':
			console.log('NP');
			createNewDepartment();
			break;
		default:
	}
});//.then

function displaySaleByDepartment() {
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
		func.displayProductSaleByDept(connection);
		// connection.end();
	});
}//displaySaleByDepartment

function createNewDepartment() {
	inq.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Department ID: ',
			validate: function(value) {
				return ((isNaN(value) === false)? true: false); 
			}
		},
		{
			type: 'input',
			name: 'departmentName',
			message: 'Department name: '
		},
		{
			type: 'input',
			name: 'overHeadCost',
			message: 'Over head cost: ',
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
				func.createNewDept(connection, user.id, user.departmentName, user.overHeadCost);
				// connection.end();
			});

		});//.then
}//createNewDepartment