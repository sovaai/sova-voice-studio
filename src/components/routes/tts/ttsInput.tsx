import { SelectionState, Modifier, EditorState } from 'draft-js';
import React, { memo, useRef, useState } from 'react';
import { useInput } from '../../../hooks/useInput';

const TtsInput = memo(({ block, setValue, setEditorState, groupName }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const blockData = block.getData();
  const key = blockData.get('key');

  const { value: keyValue, bind: bindKeyValue, setValue: setKeyValue } = useInput(
    key || `${groupName ? groupName : ''} название словаря - ${block.getKey()}`
  );

  const handleBlur = () => {
    setEditorState((prevState: EditorState) => {
      const selectionState = SelectionState.createEmpty(block.getKey());
      const currentContentState = prevState.getCurrentContent();
      const newContentState = Modifier.setBlockData(
        currentContentState,
        selectionState,
        blockData.update('key', () => keyValue)
      );
      const newEditorState = EditorState.acceptSelection(
        EditorState.createWithContent(newContentState),
        selectionState
      );

      return newEditorState;
    });
    changeInputDisabled(true);
    setValue(false);
  };

  const handleMouseDown = (e: React.SyntheticEvent) => {
    setValue(true);
  };

  const handleMouseUp = () => {
    changeInputDisabled(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const [inputDisabled, changeInputDisabled] = useState(true);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      contentEditable={false}
      className="flex items-center justify-between w-1/2"
    >
      <input
        className="tts__input text-gray-500 bg-gray-100 p-2"
        ref={inputRef}
        {...bindKeyValue}
        onBlur={handleBlur}
        disabled={inputDisabled}
      />
    </div>
  );
});

TtsInput.displayName = 'TtsInput';

export default TtsInput;
