const inquirer = require("inquirer");
const chalk = require("chalk");
const output = require("./output");
const index = require("./index");
const storeAvail = require("./storeAvailability");

function listener(tasks, changes) {
  changes.deletions.forEach((index) => {
    // Deleted objects cannot be accessed directly,
    // but we can update a UI list, etc. knowing the index.
    output.watchResult("Catalog Item Deleted", "A task has been deleted.");
  });

  changes.insertions.forEach((index) => {
    let insertedTask = tasks[index];
    output.watchResult("Catalog Item Created", JSON.stringify(insertedTask, null, 2));
  });

  changes.modifications.forEach((index) => {
		var ui = new inquirer.ui.BottomBar();
    let modifiedTask = tasks[index];
    //output.watchResult("Catalog Item Modified", JSON.stringify(modifiedTask, null, 2));
		ui.updateBottomBar(
			chalk.white.bold(modifiedTask.menuItemName + " CHANGED. Status is now " + modifiedTask.status));
  });
}

function psaListener(psa, changes) {
	changes.modifications.forEach((index) => {
		var ui = new inquirer.ui.BottomBar();
    let modifiedPSA = psa[index];
    //output.watchResult("Catalog Item Modified", JSON.stringify(modifiedTask, null, 2));
		ui.updateBottomBar(
			chalk.white.bold(modifiedPSA.menuItemName + " CHANGED. Status is now " + modifiedPSA.status));
  });

}

async function watchForChanges() {
  const realm = await index.getRealm(index.globalPartitionKey);
  const tasks = realm.objects("catalogMenu");
  tasks.addListener(listener);
}

async function watchForStoreAvailChanges() {
  const realm = await index.getRealm();
  const psa = realm.objects("ProductStoreAvailability");
  psa.addListener(psaListener);
}

module.exports.watchForChanges = watchForChanges;
module.exports.watchForStoreAvailChanges = watchForStoreAvailChanges;
