# bamazon app
Node JS CLI application.
Description: This application has 3 parts, customer, manager and supervisor modes.

Customer mode:

Command: node bamazonCustomer.js

* This app lists items for sale.
(customer_screen1_init)
![Alt text](screenshot/customer_screen1_init.jpg?raw=true "customer_screen1_init")

* User enters item_id to purchase and quantity.  The app processes request and return status.
(customer_screen2_purchase)
![Alt text](screenshot/customer_screen2_purchaset.jpg?raw=true "customer_screen2_purchase")

* If item quantity is not sufficent, user got notified
(customer_screen3_insufficient)
![Alt text](screenshot/customer_screen3_insufficient.jpg?raw=true "customer_screen3_insufficient")

* IF user enters invalid input, app returns to menu

* If user enters 'q' in all questions, app terminates.
(customer_screen4_quit)
![Alt text](screenshot/customer_screen4_quit.jpg?raw=true "customer_screen4_quit")



Manager mode:

* This app lists manager menu, selectable with up/down arrow keys.  The menu is displayed again after action is handled until user selects Exit.
(manager_screen1_init)
![Alt text](screenshot/manager_screen1_init.jpg?raw=true "manager_screen1_init")

* User selects View Product for Sale.  The app displays items with stock counts.
(manager_screen2_list_products)
![Alt text](screenshot/manager_screen2_list_products.jpg?raw=true "manager_screen2_list_products")

* User selects View Low Inventory. App displays item with less than 5 units in stock.
(manager_screen3_low_count)
![Alt text](screenshot/manager_screen3_low_count.jpg?raw=true "manager_screen3_low_count")

* User selects Add to Inventory.  App prompts user for ID and quantity and updates.
(manager_screen4_add_inventory)
![Alt text](screenshot/manager_screen4_add_inventory.jpg?raw=true "manager_screen4_add_inventory")

* User selects Add New Product. App prompts user for product info and adds.
(manager_screen_add_new_product)
![Alt text](screenshot/manager_screen_add_new_product.jpg?raw=true "manager_screen_add_new_product")

* IF user enters invalid input, app returns to menu

* User selects Exit. App terminates.



Supervisor mode:

* This app lists supervisor menu, selectable with up/down arrow keys.  The menu is displayed again after action is handled until user selects Exit.
(supervisor_screen1_init)
![Alt text](screenshot/supervisor_screen1_init.jpg?raw=true "supervisor_screen1_init")

* User selects View Product Sale by Department. App displays products grouped by departments.
(supervisor_screen2_list_produts)
![Alt text](screenshot/supervisor_screen2_list_produts.jpg?raw=true "supervisor_screen2_list_produts")

* User selects Create New Department.  App prompts user into and adds department.
(supervisor_screen3_add_dept)
![Alt text](screenshot/supervisor_screen3_add_dept.jpg?raw=true "supervisor_screen3_add_dept")

* User selects Exit. App terminates.
