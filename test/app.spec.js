const sinon = require('sinon');
const assert = require('assert');
const axios = require('axios');
const fs = require('fs').promises;
const { runScript } = require('./../app');

describe('runScript()', () => {
  let axiosGetStub;
  let fsWriteFileStub;
  let fsReadFileStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
    fsWriteFileStub = sinon.stub(fs, 'writeFile');
    fsReadFileStub = sinon.stub(fs, 'readFile');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Should run the script successfully', async () => {
    const apiResponse = [{ id: 1, title: 'Test Title', body: 'Test Body' }];
    const filePath = 'api_response_data.json';

    axiosGetStub.resolves({ data: apiResponse });
    fsWriteFileStub.resolves();
    fsReadFileStub.resolves(JSON.stringify(apiResponse));

    await runScript();

    sinon.assert.calledOnce(axiosGetStub);
    sinon.assert.calledWith(axiosGetStub, 'https://jsonplaceholder.typicode.com/posts');

    sinon.assert.calledOnce(fsWriteFileStub);
    sinon.assert.calledWith(fsWriteFileStub, filePath, JSON.stringify(apiResponse));

    sinon.assert.calledOnce(fsReadFileStub);
    sinon.assert.calledWith(fsReadFileStub, filePath, 'utf8');
  });

  it('Should throw error if axios.get() fails', async () => {
    axiosGetStub.rejects(new Error('Failed to fetch data from API'));
    fsWriteFileStub.resolves();
    fsReadFileStub.resolves();

    await assert.rejects(async () => {
      await runScript();
    });
  });

  it('Should throw error if fs.writeFile() fails', async () => {
    const apiResponse = [{ id: 1, title: 'Test Title', body: 'Test Body' }];

    axiosGetStub.resolves({ data: apiResponse });
    fsWriteFileStub.rejects(new Error('Failed to write data to file'));
    fsReadFileStub.resolves();

    await assert.rejects(async () => {
      await runScript();
    });
  });

  it('Should throw error if fs.readFile() fails', async () => {
    const apiResponse = [{ id: 1, title: 'Test Title', body: 'Test Body' }];
    const filePath = 'api_response_data.json';

    axiosGetStub.resolves({ data: apiResponse });
    fsWriteFileStub.resolves();
    fsReadFileStub.rejects(new Error('Failed to read data from file'));

    await assert.rejects(async () => {
      await runScript();
    });
  });
});