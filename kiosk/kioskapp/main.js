const inquirer = require("inquirer");
const users = require("./users");
const output = require("./output");
const projects = require("./projects");
const shoppingCart = require("./shoppingCart");
const watch = require("./watch");

/*
const Choices = {
  ShowProjects: "Show all of my projects",
  SelectProject: "Select a project",
  LogOut: "Log out / Quit",
};
*/
var ui;

const Choices = {
  Checkout: "Review Shopping Cart/Checkout",
  SelectItem: "Add Item To Cart",
	WatchCatalogChanges: "Turn On Catalog Change Noficiations",
  LogOut: "Log out / Quit",
};

async function mainMenu() {
	ui = ui == undefined ? new inquirer.ui.BottomBar() : ui;

	ui.log.write("Main Menu");
	
  try {
    const answers = await inquirer.prompt({
      type: "rawlist",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [...Object.values(Choices), new inquirer.Separator()],
    });

    switch (answers.mainMenu) {
      case Choices.Checkout: {
        await shoppingCart.checkOut();
        return mainMenu();
      }
    case Choices.SelectItem: {
				ui.updateBottomBar("Shopping");
        await shoppingCart.selectCategory();
				return mainMenu();
      }
		case Choices.WatchCatalogChanges : {
			await watch.watchForChanges();
//			await watch.watchForStoreAvailChanges();
			output.result("Change notifications on.");
			return mainMenu();
		}
      case Choices.LogOut: {
        const loggedOut = await users.logOut();
        if (!loggedOut) {
          output.error("Error logging out");
        } else output.result("You have been logged out. Use Ctrl-C to quit.");
				return;
      }
      default: {
        return mainMenu();
      }
    }
  } catch (err) {
    output.error(err.message);
    return;
  }
}


exports.mainMenu = mainMenu;
exports.ui = ui;
