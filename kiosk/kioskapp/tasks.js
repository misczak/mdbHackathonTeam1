const inquirer = require("inquirer");
const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");
const users = require("./users");

exports.getTasks = async (partition) => {
	output.result("getTasks Parition: " + partition);

  //TODO: Call the objects() method and pass in the name of the collection.
	const realm = await index.getRealm(partition);
  const tasks = realm.objects("Task");

  output.header("MY TASKS:");
  output.result(JSON.stringify(tasks, null, 2));
};

exports.getTask = async (partition) => {
  const realm = await index.getRealm(partition);
  try {
    const task = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "What is the task ID (_id)?",
      },
    ]);
    //TODO: Call the objectForPrimaryKey() method to get a task by its ID.
		let result = realm.objectForPrimaryKey("Task", new bson.ObjectID(task.id));

    if (result !== undefined) {
      output.header("Here is the task you requested:");
      output.result(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    output.error(err.message);
  }
};

exports.createTask = async (partition) => {
  const realm = await index.getRealm(partition);
  try {
    output.header("*** CREATE NEW TASK ***");
    const task = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What is the task text?",
      },
      {
        type: "rawlist",
        name: "status",
        message: "What is the task status?",
        choices: ["Open", "In Progress", "Closed"],
        default: function () {
          return "Open";
        },
      },
    ]);
    let result;
    realm.write(() => {
      result = realm.create("Task", {
        _id: new bson.ObjectID(),
        _partition: partition,
        name: task.name,
        status: task.status.replace(/\s/g, ""), // Removes space from "In Progress",
      });
    });

    output.header("New task created");
    output.result(JSON.stringify(result, null, 2));
  } catch (err) {
    output.error(err.message);
  }
};

exports.deleteTask = async (partition) => {
  const realm = await index.getRealm(partition);
  output.header("DELETE A TASK");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the task ID (_id)?",
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to delete this task?",
    },
  ]);

  if (answers.confirm) {
    //TODO: Call the objectForPrimaryKey() method to get a task by its ID and assign it to task.
    let task = realm.objectForPrimaryKey("Task", new bson.ObjectID(answers.id));
    realm.write(() => {
      //TODO: Call the delete() function.
			realm.delete(task);
      output.result("Task deleted.");
    });
    return;
  }
};

exports.editTask = async (partition) => {
  output.header("CHANGE A TASK");
	output.result("editTask Parition: " + partition);
  let answers = await inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the task ID (_id)?",
    },
    {
      type: "input",
      name: "key",
      message: "What is the field you want to change?",
    },
    {
      type: "input",
      name: "value",
      message: "What is the new value?",
    },
  ]);

  let changeResult = await modifyTask(answers, partition);
  output.result("Task updated.");
  output.result(changeResult);
  return;
};

exports.changeStatus = async (partition) => {
  output.header("Update Task Status");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the task ID (_id)?",
    },
    {
      type: "rawlist",
      name: "value",
      message: "What is the new status?",
      choices: ["Open", "In Progress", "Closed"],
    },
  ]);

  answers.key = "status";
  let changeResult = await modifyTask(answers, partition);
  output.result("Task updated.");
  output.result(changeResult);
  return;
};

async function modifyTask(answers, partition) {
	output.result("modifyTask Parition: " + partition);
  const realm = await index.getRealm(partition);
  let task;
  try {
    realm.write(() => {
      //TODO: Call the objectForPrimaryKey() method to get the task by ID and
      //change the task object's status.
			task = realm.objectForPrimaryKey("Task", new bson.ObjectID(answers.id));
      task[answers.key] = answers.value;
    });
    return JSON.stringify(task, null, 2);
  } catch (err) {
    return output.error(err.message);
  }
}
