import axios from 'axios';

const { REACT_APP_TTS_PATH, REACT_APP_REQUEST_TIMEOUT } = process.env;

const baseURL = REACT_APP_TTS_PATH || 'http://localhost:4000/';
const timeout = Number.parseInt(REACT_APP_REQUEST_TIMEOUT ? REACT_APP_REQUEST_TIMEOUT : '20000');

const ttsInstance = axios.create({
  baseURL,
  timeout,
});

const requestTTS = async ({ text, selectedModel = 'Natasha' }: any) => {
  const formData = new FormData();

  formData.append('text', text);
  formData.append('voice', selectedModel);
  formData.append('options', 'speed_factor=1');

  const result = await ttsInstance.post('synthesize/', formData);

  return result.data;
};

const requestTTSDictionary = async ({ selectedModel }: any) => {
  const result = await ttsInstance.post('get_user_dict/', {
    voice: selectedModel?.label || 'Natasha',
  });
  return result.data;
};

const requestTTSModels = async () => {
  const result = await ttsInstance.post('get_models/');
  return result.data;
};

/* const requestTTS; */

const replaceUserDict = async ({ user_dict, selectedModel }: any) => {
  const result = await ttsInstance.post('replace_user_dict/', {
    voice: selectedModel.label,
    user_dict,
  });
  return result.data;
};

export { requestTTS, requestTTSDictionary, replaceUserDict, requestTTSModels };
