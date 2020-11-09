import { EditorBlock } from 'draft-js';
import React, { memo } from 'react';
import { requestTTS } from '../../requests/ttsRequests';
import TtsInput from './ttsInput';
import { ReactComponent as IconPlay } from '../../../assets/images/icon__play.svg';

const TtsCustomBlock = memo((props: any) => {
  const { block, blockProps, contentState } = props;
  const { setValue, setEditorState, groupName, selectedModel } = blockProps;

  const handleSynthezieRequest = async () => {
    const result = await requestTTS({ selectedModel: selectedModel.label, text: block.getText() });
    const base64Audio = await result.response[0].response_audio;
    const snd = new Audio(`data:audio/x-wav;base64,${base64Audio}`);

    snd.play();
  };

  return (
    <div className="tts-item flex items-center justify-between mb-4">
      <TtsInput
        block={block}
        contentState={contentState}
        setValue={setValue}
        setEditorState={setEditorState}
        groupName={groupName}
      />

      <div className="w-1/2 bg-gray-100 p-2 mr-4">
        <EditorBlock {...props} />
      </div>
      <button onClick={handleSynthezieRequest}>
        <IconPlay />
      </button>
    </div>
  );
});

TtsCustomBlock.displayName = 'TtsCustomBlock';

export default TtsCustomBlock;
