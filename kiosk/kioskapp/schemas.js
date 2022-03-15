const TaskSchema = {
  // TODO: Define the data model for tasks.
	name: "Task",
  properties: {
    _id: "objectId",
    name: "string",
    owner: "string?",
    status: "string",
  },
  primaryKey: "_id",

};

const UserSchema = {
  // TODO: Define the data model for users.
  name: "User",
  properties: {
    _id: "string",
    memberOf: "Project[]",
    name: "string",
  },
  primaryKey: "_id",

};

const ProjectSchema = {
  // TODO: Define the data model for projects.
	name: "Project",
  embedded: true,
  properties: {
    name: "string?",
    partition: "string?",
  },

};

const CartSchema = {
	name : "Cart",
	properties : {
		_id: "objectId",
		user: "string",
		complete: "bool",
		total: "decimal128",
		items: {
			type: "list",
			objectType: "catalogMenu"
		},
	},
	primaryKey: "_id",
}

const MenuItemSchema = {
	name: "catalogMenu",
	properties : {
		_id: "objectId",
		productID: "int",
		menuItemName: "string",
		menuItemPrice: "decimal128",
		category: "string",
		ingredients: "string[]",
		status: "string",
	},
	primaryKey: "_id",
	
};

exports.ProjectSchema = ProjectSchema;
exports.TaskSchema = TaskSchema;
exports.UserSchema = UserSchema;
exports.MenuItemSchema = MenuItemSchema;
exports.CartSchema = CartSchema;
