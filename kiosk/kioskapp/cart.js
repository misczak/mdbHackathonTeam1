
const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");
const users = require("./users");


let basket = null;

createBasket = async () => {

	const userId = users.getAuthedUserId();
//	const realm = await index.getRealm("user=" + userId);
	const realm = await index.getRealm(index.globalPartitionKey);

	let newCart;
	try {
		//output.result("Creating new basket");
		realm.write(() => {
			newCart = realm.create("Cart", {
				_id : new bson.ObjectID(),
				user: users.getAuthedUserId(),
				complete: false,
				total: new bson.Decimal128(0.0),
				_partition: "partition=all",
			});
		});

		//output.result("Created new basket");
		return newCart;
	} catch (err) {
		output.error(err.message);
	}
		
}

exports.getBasket = async () => {

	let cart;
	
	if (basket != null && basket.complete == false) {
		cart = basket;
	}
	else {
		try {
//		output.result("Querying realm for basket");
		const userId = users.getAuthedUserId();
//		const realm = await index.getRealm("user=" + userId);
		const realm = await index.getRealm(index.globalPartitionKey);
	
		const carts = realm.objects("Cart").filtered("complete == false AND user == '" + userId + "'");
//		output.result(JSON.stringify(carts, null, 2));
			cart = carts[0] ? carts[0] : await createBasket();
		} catch (err) {
			output.error(err.message);
		}
	}

	return cart;
}

exports.addItem = async (item) => {

	const userId = users.getAuthedUserId();
//	const realm = await index.getRealm("user=" + userId);
	const realm = await index.getRealm(index.globalPartitionKey);
	
	const cart = await exports.getBasket();
	
	try {
		realm.write(() => {
			//cart.total = new bson.Decimal128(cart.total) + new bson.Decimal128(item.menuItemPrice);
			cart.items.push(item)

		});
	} catch (err) {
		output.error(err.message);
	}
}


exports.checkOut = async () => {

	const realm = await index.getRealm(index.globalPartitionKey);
	const cart = await exports.getBasket();

	try {
		realm.write(() => {
			cart.complete = true;
		});
	} catch (err) {
		output.error(err.message);
	}
};

exports.getItems = async () => {
	const cart = await exports.getBasket();

	return cart.items.length > 0 ? Array.from(cart.items) : [];
};

//Doesn't work
exports.getTotal = async () => {
	const items = await exports.getItems()

	let total = new bson.Decimal128(0.0);
	if (items.length > 0) {
		items.forEach(item => {
			total = total + item.menuItemPrice;
		});
	}

	return new bson.Double(total);
};

exports.getItemCount = async () => {
	const cart = await exports.getBasket();
//	output.result(JSON.stringify(cart, null, 2));
//	output.result("Item Count: " + cart.items.length);

	return cart.items.length;
};
