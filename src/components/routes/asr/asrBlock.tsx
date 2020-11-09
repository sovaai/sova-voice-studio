import { SelectionState, Modifier, EditorState, EditorBlock } from 'draft-js';
import React, { memo, useEffect } from 'react';
import { useInput } from '../../../hooks/useInput';

const AsrCustomBlock = memo((props: any) => {
  const { block, blockProps, contentState } = props;
  const { setValue, editorState, setEditorState, editor, defaultFrequency } = blockProps;

  const blockData = block.getData();
  const frequency = blockData.get('frequency');

  const {
    value: frequencySelectedValue,
    bind: bindRangeSlider,
    setValue: setRangeSliderValue,
  } = useInput(frequency);

  const handleMouseDown = () => {
    editor.current.blur();
    setValue(true);
  };

  const handleMouseUp = () => {
    setValue(false);
    const newSelectionState = SelectionState.createEmpty(block.getKey());
    const newContentState = Modifier.setBlockData(
      contentState,
      newSelectionState,
      blockData.update('frequency', () => frequencySelectedValue)
    );
    const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');

    setEditorState(EditorState.moveFocusToEnd(newEditorState));
  };

  useEffect(() => {
    if (!frequency) {
      const newSelectionState = editorState.getSelection();
      const newContentState = Modifier.setBlockData(
        contentState,
        newSelectionState,
        defaultFrequency
      );

      const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');
      setEditorState(EditorState.moveFocusToEnd(newEditorState));
    }
  }, []);

  useEffect(() => {
    if (!frequencySelectedValue) setRangeSliderValue(frequency);
  }, [frequencySelectedValue, frequency, setRangeSliderValue]);

  return (
    <div className="asr-item flex items-center justify-between mb-4">
      <div className="w-1/2">
        <EditorBlock {...props} />
      </div>
      <div contentEditable={false} className="flex items-center justify-between">
        <input
          className="frequency__input ml-20"
          contentEditable={false}
          type="range"
          min="0.1"
          max="1"
          {...bindRangeSlider}
          step="0.1"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <span contentEditable={false} className="frequency ml-4">
          {frequencySelectedValue}
        </span>
      </div>
    </div>
  );
});

AsrCustomBlock.displayName = 'AsrCustomBlock';

export default AsrCustomBlock;
