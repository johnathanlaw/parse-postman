const fs = require("fs");

fs.readFile("./example.postman_collection.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("Error reading file:", err);
        return;
    }

    try {
        const data = JSON.parse(jsonString);

        const collectionName = data.info.name;
        console.log(`Collection: ${collectionName}`);

        const exportData =
        {
            "connectorName": collectionName,
            "endpoints": [],
            "version": "0.0.1"
        };

        for (let i in data.item) {
            const item = data.item[i];

            const endpointId = crypto.randomUUID();
            const endpointName = item.name;
            const endpointMethod = item.request.method;
            const endpointURL = item.request.url.raw;

            const endpoint =
            {
                "endpointId": endpointId,
                "endpointName": endpointName,
                "connectorName": collectionName,
                "description": "",
                "endpointUri": endpointURL,
                "httpRequestType": endpointMethod,
                "pagingEnabled": false,
                "pagingType": null,
                "schemaType": "UNFLATTENED_NO_REPEAT_ELEMENT",
                "authEnabled": false,
                "authType": "",
                "authScheme": "",
                "authParameterType": "",
                "pagingSizeParameter": null,
                "pagingSize": null,
                "nextAbsoluteUriDataKey": null,
                "baseUriDataKey": null,
                "pagingOffsetParameter": null,
                "pagingTotalItemsParameter": null,
                "nextCursorKey": null,
                "nextCursorParameter": null,
                "pageNumberParameter": null,
                "lastPageKey": null,
                "params": []
            };

            exportData.endpoints.push(endpoint);
        }

        const outputFile = `${collectionName}.json`;
        fs.writeFileSync(outputFile, JSON.stringify(exportData));
        console.log(`Written ${outputFile}`);
    } catch (err) {
        console.log("Error parsing JSON:", err);
    }
});