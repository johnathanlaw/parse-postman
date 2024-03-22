const fs = require("fs");

fs.readFile("./example.postman_collection.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }

  try {
    const data = JSON.parse(jsonString);
    console.log(`Collection: ${data.info.name}`);
    for (let i in data.item) {
        const item = data.item[i]
        //console.log(`Data ${i}`, item);
        console.log('ITEM START');
        console.log(`Name: ${item.name}`);
        console.log(`Method: ${item.request.method}`);
        console.log(`Headers: ${item.request.header}`);
        console.log(`URL: ${item.request.url.raw}`);
        console.log('ITEM END\n');
        /*
        All that matters here are:
        request.method
        request.header
        request.url.raw
        request.body (can we send request bodies?)
        */
    }

    //console.log("Data:", data);
  } catch (err) {
    console.log("Error parsing JSON:", err);
  }
});