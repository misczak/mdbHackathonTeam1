exports = async function(query, path){
  
  var aggPipeline = context.functions.execute("buildSearchPipeline", query, path);
  console.log("AGG PIPELINE");
  console.log(JSON.stringify(aggPipeline));
  
  var collection = context.services.get("mongodb-atlas").db("bodega_buddy").collection("catalogMenu");
  
  const searchResults = await collection.aggregate(aggPipeline);

  return searchResults;
};