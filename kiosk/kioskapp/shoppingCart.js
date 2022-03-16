const inquirer = require("inquirer");
const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");
const users = require("./users");
const main = require("./main");
const tasks = require("./tasks");
const manageTeam = require("./manageTeam");
const cart = require("./cart");

let categories;
const goBackMenuItemName = "<-Go Back->";

getCategories = async () => {

	if (categories == undefined) {
		try {
			let categorySet = new Set()
			const realm = await index.getRealm(index.globalPartitionKey);
			const catResult = realm.objects("catalogMenu").reduce(
				(previousValue, curItem) => {
					categorySet.add(curItem.category);
					return categorySet;
				});
			//output.result(catResult);

			categories = Array.from(catResult);
		} catch (err) {
			output.error(err.message);
		}
	}

	return categories;

  //output.header("CATEGORIES:");
  //output.result(JSON.stringify(tasks, null, 2));

};

getItems = async (category) => {

	try {
		const realm = await index.getRealm(index.globalPartitionKey);
		const filter = "category == '" + category + "' AND status == 'instock'";
		const items = realm.objects("catalogMenu").filtered(filter);

		return items;
	} catch (err) {
		output.error(err.message);
	}
};




selectItem = async (category) => {

	const items = await getItems(category);
	output.header("AVAILABLE ITEMS IN " + category);
	const itemNames = items.map((i) => i.menuItemName);

	try {
    const { selectedItemName } = await inquirer.prompt({
      type: "rawlist",
      name: "selectedItemName",
      message: "Select an item in this category:",
      choices: [...itemNames, goBackMenuItemName, new inquirer.Separator()],
    });

		if (selectedItemName != goBackMenuItemName) {
			const selectedItem = items.find((i) => i.menuItemName === selectedItemName);
			await cart.addItem(selectedItem);
		
			output.result("Item has been added to your cart");
			//output.result(JSON.stringify(selectedItem, null, 2));
			//output.result(JSON.stringify(await cart.getBasket(), null, 2));
		}

		return exports.selectCategory();
		
	} catch (err) {
		output.error(err.message);
	}

};

printCart = async () => {

	const items = await cart.getItems();


	output.header("Shopping cart contents: ");
	//items.forEach(item => output.result(item.menuItemName));
	output.table(items.map((item) => {
		const row = {name: item.menuItemName, category: item.category, sku: item.productID};
		return row;
	}));
}

printCartSummary = async () => {

	// output.header("[Shopping Cart] " +
	// 							await cart.getItemCount() +
	// 							" Items; $" +
	// 							await cart.getTotal());

	output.header("[Shopping Cart] " +
								await cart.getItemCount() +
 								" Items:");
}



exports.selectCategory = async () => {
  const cats = await getCategories();

	await printCartSummary();

	output.header("PRODUCT CATEGORIES");

	try {
    const { selectedCategory } = await inquirer.prompt({
      type: "rawlist",
      name: "selectedCategory",
      message: "Select a product category:",
      choices: [...cats, goBackMenuItemName, new inquirer.Separator()],
    });

		if (selectedCategory == goBackMenuItemName) {
			return main.mainMenu();
		}
    else {
			return await selectItem(selectedCategory);
		}
  } catch (err) {
    output.error(err.message);
  }
};

const Choices = {
  CheckOut: "Check out",
	KeepShopping: "Keep shopping",
  MainMenu: "Return to main menu",
};

exports.checkOut = async () => {

	if (await cart.getItemCount() > 0) {
		await printCart();

		try {
			const answers = await inquirer.prompt({
				type: "rawlist",
				name: "checkoutMenu",
				message: "What would you like to do?",
				choices: [...Object.values(Choices), new inquirer.Separator()],
			});

			switch (answers.checkoutMenu) {
			case Choices.CheckOut: {
				await cart.checkOut();
				output.result(">>>>>Checkout Complete<<<<<")
				return main.mainMenu()
      }
			case Choices.KeepShopping: {
				return exports.selectCategory()
			}
			case Choices.MainMenu: {
				return main.mainMenu();
			}
			default: {
				return main.mainMenu();
			}
			}
		} catch (err) {
			output.error(err.message);
			return;
		}
	} else {
		output.result("Cart is empty");
		output.result("No action required.");
		return main.mainMenu();
	}
}


