const POSTMAN_FILE_EXTENSION = '.postman_collection.json';

function createVariableObject(varArray) {
    let obj = {};

    for (let o in varArray) {
        const { key, value } = varArray[o];
        obj[key] = value;
    }

    return obj;
}

function replaceVariables(inputString, data) {
    const regex = /\{\{(\w+)\}\}/g;
    return inputString.replace(regex, (_, variableName) => {
      return data[variableName] || ""; // Replace with an empty string if the variable is not found
    });
}

function processItem(collectionName, items, varObj) {
    /*
    * Items are a nested structure
    * See https://schema.postman.com/collection/json/v2.1.0/draft-07/collection.json
    * Item is an array of `definitions/item` or `definitions/item-group`
    * If it's an actual item it has a `request` otherwise it might be a group.
    */

    let endpointArray = [];

    for (let i in items) {
        const item = items[i];

        if (!item?.request) {
            // This is an item-group, iterate
            console.log('Item Group!', item.item);
            endpointArray = endpointArray.concat(processItem(collectionName, item.item, varObj));
        }
        else {
            console.log('Item!', item);
            const endpointId = crypto.randomUUID();
            const endpointName = item.name;
            const endpointMethod = item.request.method;
            let endpointURL = item.request.url.raw;

            // Variables are denoted like so, {{var}}
            if (endpointURL.includes('{{'))
            {
                console.log(`Variable seen in endpoint, ${endpointName}`);
                endpointURL = replaceVariables(endpointURL, varObj);
            }

            const endpoint =
            {
                'endpointId': endpointId,
                'endpointName': endpointName,
                'connectorName': collectionName,
                'endpointUri': endpointURL,
                'httpRequestType': endpointMethod,
            };

            endpointArray.push(endpoint);
        }
    }

    console.log('Completed Iteration!', endpointArray);
    return endpointArray;
}

function readPostmanFile(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        if (!file.type?.startsWith('application/json')) {
            console.log('File is not a JSON file!', file.type, file);
            return;
        }

        if (!file.name?.endsWith(POSTMAN_FILE_EXTENSION)) {
            console.log('Does not appear to be a Postman Collection!', file.name, file);
            return;
        }

        const data = JSON.parse(event.target.result);
        const collectionName = data.info.name;
        const varObj = createVariableObject(data.variable);

        console.log(`Collection: ${collectionName}`);
        console.log('Data:', data);
        console.log('varObj:', varObj);

        const exportData =
        {
            'connectorName': collectionName,
            'endpoints': [],
            'version': '0.0.1'
        };

        console.log('Data.item:', data.item);
        exportData.endpoints = processItem(collectionName, data.item, varObj);

        if (exportData.endpoints.length === 0) {
            console.log('No endpoints detected. Is your collection v2.1.0?');
            return;
        }

        const outputFile = `${collectionName}.json`;

        console.log(`Created ${outputFile}`);
        createDownloadLink({ filename: outputFile, data: exportData });
    });

    reader.readAsText(file);
}

function createDownloadLink(file) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(file.data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');

    a.href = url;
    a.download = file.filename;
    a.innerHTML = file.filename;

    document.getElementById('download').replaceChildren(a);
}