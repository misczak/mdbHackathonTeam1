exports = function(productID, stockStatus){
  
  var collection = context.services.get("mongodb-atlas").db("bodega_buddy").collection("catalogMenu");
  const query = {"productID": productID};
  const update = {"$set": { "status": stockStatus } };
  const options = {"upsert": false };
  
  collection.updateOne(query, update, options)
    .then(result => {
      const {matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        return "Updated stock status";
      }
    })
    .catch(err => console.error(`Failed to update stock status: ${err}`));
};