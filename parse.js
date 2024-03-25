const POSTMAN_FILE_EXTENSION = '.postman_collection.json';

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
        console.log(`Collection: ${collectionName}`);

        const exportData =
        {
            'connectorName': collectionName,
            'endpoints': [],
            'version': '0.0.1'
        };

        for (let i in data.item) {
            const item = data.item[i];

            const endpointId = crypto.randomUUID();
            const endpointName = item.name;
            const endpointMethod = item.request.method;
            const endpointURL = item.request.url.raw;

            const endpoint =
            {
                'endpointId': endpointId,
                'endpointName': endpointName,
                'connectorName': collectionName,
                'endpointUri': endpointURL,
                'httpRequestType': endpointMethod,
            };

            exportData.endpoints.push(endpoint);
        }

        const outputFile = `${collectionName}.json`;

        console.log(`Would have created ${outputFile}`);
        console.log(exportData);
    });

    reader.readAsText(file);
}