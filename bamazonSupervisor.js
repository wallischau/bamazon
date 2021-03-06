/* App: bamazon Superviser                            */
/* Author: Wallis Chau                                */
/* Date: 10/10/17                                     */
/* Description: List inventory by department          */
/*              Add new department                    */

var mysql = require('mysql');
var inq = require('inquirer');
// var func = require('./shared.js');
require('console.table');
var colors = require('colors');


var question = [
	{
	type: 'list',
	name: 'action',
	message: 'Select action:',
	choices: ['(VD) View PRoduct Sales by Department',
			  '(ND) Create New Department',
			  'Exit?'
			  ]
	}
];//question

function answerHandling(user) {
	// console.log(user);
	var act = user.action.substring(1,3);
	switch (act) {
		case 'VD':
			// console.log('VP');
			displaySaleByDepartment();
			break;
		case 'ND':
			// console.log('NP');
			createNewDepartment();
			break;
		default:
			return;
	}
}

inq.prompt(question).then(answerHandling);

var displayProductSaleByDept = function(connection) {
	console.log('\nDisplay sales by departments:'.yellow);
	var query = connection.query("SELECT department_id, p.department_name, over_head_costs, sum(p.product_sales) AS product_sales, (product_sales - over_head_costs) AS total_profit from products AS p INNER JOIN departments  AS d on p.department_name = d.department_name GROUP BY p.department_name", function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		inq.prompt(question).then(answerHandling);
		connection.end();
	});//query
}//displayProductSaleByDept	

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
		// console.log(func);
		displayProductSaleByDept(connection);
		// connection.end();
	});
}//displaySaleByDepartment


function validateNewDept(id, department, overhead) {
	if ((id === 'q') || (overhead === 'q')) {
		return 1;
	}
	if ((id === '') || (department === '') || ( overhead < 0) || (overhead === '')) {
		return 2;
	}
	else
		return 0;
}

var createNewDept = function(connection, id, department, overheadCost) {
	console.log('\nAdd to Department...'.yellow);
	var query = connection.query("INSERT INTO departments(department_id, department_name, over_head_costs) VALUES ? ",
		 [[[id, department, overheadCost]]]
		 , function(err, res) {
		if (err) {
			console.log("invalid entry".red);
			inq.prompt(question).then(answerHandling);
			connection.end();
			return;
		} 
		// console.log(res);
		console.log('create completed \n============\n'.green);
		inq.prompt(question).then(answerHandling);
		connection.end();
	});//query
}//createNewDept	 

function createNewDepartment() {
	inq.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Department ID: ("q" to go back)',
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
			name: 'departmentName',
			message: 'Department name: '
		},
		{
			type: 'input',
			name: 'overHeadCost',
			message: 'Over head cost: ("q" to go back)',
			validate: function(value) {
					if ((isNaN(value) === true) && (value !== 'q')) {
					console.log(" \n Please enter number id or 'q'");
					return false;
				}
				else 
					return true;
			}
		}		
		])
		.then(function(user) {
			// console.log(user);
			var status = validateNewDept(user.id, user.department, user.overHeadCost);
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
				// console.log(func);
				createNewDept(connection, user.id, user.departmentName, user.overHeadCost);
				// connection.end();
			});

		});//.then
}//createNewDepartment