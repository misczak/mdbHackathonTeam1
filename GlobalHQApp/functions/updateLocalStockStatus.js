exports = function(storeID, productID, stockStatus){
  var collection = context.services.get("mongodb-atlas").db("bodega_buddy").collection("storeCatalog");
  const query = {"storeID": storeID, "items.productID": productID};
  const update = {"$set": { "items.$.status": stockStatus } };
  const options = {"upsert": false };
  
  collection.updateOne(query, update, options)
    .then(result => {
      const {matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        return "Updated local stock status";
      }
    })
    .catch(err => console.error(`Failed to update local stock status: ${err}`));
};