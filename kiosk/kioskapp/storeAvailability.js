const Realm = require("realm");
const bson = require("bson");
const index = require("./index");
const output = require("./output");

let storeAvail = null;
let storeID = 4927;

function getPartitionKey () {
	return "store=" + storeID;

}

getStoreAvail = async () => {

	let sAvail;
	if (storeAvail != null) {
		sAvail = storeAvail;
	} else {
		try {
			const realm = await index.getRealm(getPartitionKey());
			
			const stores = realm.objects("storeCatalog");
			sAvail = stores[0];

			if (!sAvail) {
				output.error("No store found with ID: " + storeID);
				sAvail = null
			}
			else {
				storeAvail = sAvail;
			}
		} catch (err) {
			output.error(err.message);
		}
	}

	return sAvail;
}


exports.checkProductAvailability = async (productID) =>  {

	const sAvail = await getStoreAvail();
	//output.result("searching for productID: " + productID);

	//output.result(JSON.stringify(sAvail, null, 2));
	const availability = Array.from(sAvail.items).find((psa) => {
//		output.result(JSON.stringify(psa, null, 2));
		return psa.productID == parseInt(productID) && psa.status == "instock"
	});
	output.result("availability is: " + availability);
//	output.result("availability length is: " + availability.length);

	return availability != undefined ? true : false;
}

exports.getStoreItemAvail = async () => {
	const sAvail = await getStoreAvail();

	return sAvail.items;
}

exports.storeID = storeID;
