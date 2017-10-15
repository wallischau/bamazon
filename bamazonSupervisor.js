var mysql = require('mysql');
var inq = require('inquirer');
// var func = require('./shared.js');
require('console.table');


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

function listMenu(user) {
	// console.log(user);
	var act = user.action.substring(1,3);
	switch (act) {
		case 'VD':
			console.log('VP');
			displaySaleByDepartment();
			break;
		case 'ND':
			console.log('NP');
			createNewDepartment();
			break;
		default:
			return;
	}
}

inq.prompt(question).then(listMenu);

var displayProductSaleByDept = function(connection) {
	console.log('\nDisplay sales by departments:');
	var query = connection.query("SELECT department_id, p.department_name, over_head_costs, sum(p.product_sales) AS product_sales, (product_sales - over_head_costs) AS total_profit from products AS p INNER JOIN departments  AS d on p.department_name = d.department_name GROUP BY p.department_name", function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.table(res);
		inq.prompt(question).then(listMenu);
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


function validate(id, department, overhead) {
	if ((id === '') || (department === '') || ( overhead < 0)) {
		return false;
	}
	else
		return true;
}

var createNewDept = function(connection, id, department, overheadCost) {
	console.log('\nAdd to Department...');
	var query = connection.query("INSERT INTO departments(department_id, department_name, over_head_costs) VALUES ? ",
		 [[[id, department, overheadCost]]]
		 , function(err, res) {
		if (err) throw err;
		// console.log(res);
		console.log(res.affectedRows + ' rows');
		inq.prompt(question).then(listMenu);
		connection.end();
	});//query
}//createNewDept	 

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
			// console.log(user);
			if(!validate(user.id, user.department, user.overHeadCost)) {
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
				// console.log(func);
				createNewDept(connection, user.id, user.departmentName, user.overHeadCost);
				// connection.end();
			});

		});//.then
}//createNewDepartment