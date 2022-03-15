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

const Choices = {
  Checkout: "Review Shopping Cart/Checkout",
  SelectItem: "Select An Item",
	WatchCatalogChanges: "Turn On Catalog Change Noficiations",
  LogOut: "Log out / Quit",
};

async function mainMenu() {
	
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
        await shoppingCart.selectCategory();
				return mainMenu();
      }
		case Choices.WatchCatalogChanges : {
			await watch.watchForChanges();
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
