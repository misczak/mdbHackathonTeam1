exports = async function(long, lat){
  
  var aggPipeline = context.functions.execute("buildGeoPipeline", long, lat);
  console.log("AGG PIPELINE");
  console.log(JSON.stringify(aggPipeline));
  
  var collection = context.services.get("mongodb-atlas").db("bodega_buddy").collection("storeCatalog");
  
  const searchResults = await collection.aggregate(aggPipeline);

  return searchResults;
};


  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    collection.findOne({ owner_id: context.user.id }).then((doc) => {
      // do something with doc
    });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */