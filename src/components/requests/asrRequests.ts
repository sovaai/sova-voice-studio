import axios from 'axios';

const { REACT_APP_ASR_PATH, REACT_APP_REQUEST_TIMEOUT } = process.env;

const baseURL = REACT_APP_ASR_PATH || 'http://localhost:4000/';
const timeout = Number.parseInt(REACT_APP_REQUEST_TIMEOUT ? REACT_APP_REQUEST_TIMEOUT : '20000');

const instance = axios.create({
  baseURL,
  timeout,
});

const requesASRModelUpdate = async ({ content, selectedModel = false }: any) => {
  const result = await instance.post('update_model/', {
    model_name: selectedModel?.label || 'vosk-small.arpa',
    texts: content,
  });

  return result.data;
};

const requesASRModelGet = async () => {
  const result = await instance.get('get_models/');

  return result.data;
};

export { requesASRModelUpdate, requesASRModelGet };
