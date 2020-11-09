import React, { memo, useEffect } from 'react';
import { useInput } from '../../../../hooks/useInput';
import { requestTTS } from '../../../requests/ttsRequests';

const DictionaryItem = memo(
  ({
    dictionaryKey,
    dictionaryValue,
    handleDictionaryRemove,
    handleDictionariesUpdate,
    handleDictionaryKeyUpdate,
    groupName = null,
  }: any) => {
    const { value: dictValue, bind } = useInput(dictionaryValue[0]);
    const { value: keyValue, bind: bindKeyInput } = useInput(dictionaryKey);

    useEffect(() => {
      if (dictionaryKey !== keyValue)
        handleDictionaryKeyUpdate({ dictionaryKey, keyValue, groupName });
    }, [dictionaryKey, keyValue, groupName, handleDictionaryKeyUpdate]);

    useEffect(() => {
      if (dictValue !== dictionaryValue[0]) {
        handleDictionariesUpdate({ dictionaryKey, dictValue, groupName });
      }
    }, [dictionaryKey, dictionaryValue, dictValue, groupName, handleDictionariesUpdate]);

    const handleSynthezieRequest = async () => {
      const result = await requestTTS({ voice: 'Natasha', text: dictValue });
      const base64Audio = await result.response[0].response_audio;
      const snd = new Audio(`data:audio/x-wav;base64,${base64Audio}`);

      snd.play();
    };

    return (
      <div className="flex mb-2 border">
        <button
          className="btn btn-red mr-4"
          onClick={() => handleDictionaryRemove({ dictionaryKey, groupName })}
        >
          -
        </button>
        <input className="mr-10 w-1/2 p-2" placeholder="Значение словаря" {...bindKeyInput} />
        <input className="mr-10 w-1/2 p-2" placeholder="Значение словаря" {...bind} />
        <button onClick={handleSynthezieRequest} className="btn btn-blue">
          Play
        </button>
      </div>
    );
  }
);

DictionaryItem.displayName = 'DictionaryItem';

export default DictionaryItem;
