const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const { error } = require('console');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Application Server running');
});

async function readFileFromData(path) {
    try {
        const fileData = await fs.promises.readFile(path, 'utf8');
        // console.log('Files data', fileData);
        return fileData;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function writeDataToFile(path, data) {
    try {
        await fs.promises.writeFile(path, JSON.stringify(data));
        // console.log('Data written to file!');
    } catch (error) {
        console.error(error.message);
        throw error
    }
}

async function getDataFromApi(url) {
    try {
        const apiResponse = await axios.get(url);
        // .log('apiResponse : ', apiResponse.data);
        return apiResponse.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function runScript(){
    const filePath = 'api_response_data.json';
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const apiResult = await getDataFromApi(url);
    await writeDataToFile(filePath, apiResult);
    const fileData = await readFileFromData(filePath);
    console.info(JSON.parse(fileData));
    return fileData
}

const port = 3000;

app.listen(port, () => {
    console.log(`Server runs on ${port}`);
    runScript();
});
module.exports = {
    runScript
  };