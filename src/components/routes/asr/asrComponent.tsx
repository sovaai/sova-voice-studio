import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  genKey,
} from 'draft-js';
import { List, Repeat, Map } from 'immutable';
import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { asrConfig } from '../../../samples/asrConfig';
import Scrollbar from 'react-scrollbars-custom';
import { requesASRModelGet, requesASRModelUpdate } from '../../requests/asrRequests';
import { ReactComponent as SendIcon } from '../../../assets/images/send__btn.svg';
import AsrCustomBlock from './asrBlock';
import Notification from './asrNotification';
import Dropdown from 'react-dropdown';

const AsrSelectModel = memo(({ setSelectedMode }: any) => {
  const [options, setOptions] = useState([{ value: '', label: '' }]);
  const [selectedOption, setSelectedOption] = useState(null);

  const requestModels = async () => {
    const models = await requesASRModelGet();
    const modelsOptions = Object.entries(models).map(([label, path]: any) => {
      return { value: path, label };
    });
    setOptions(modelsOptions);
  };

  useEffect(() => {
    requestModels();
  }, []);

  const handleSelectOption = (arg: any) => {
    setSelectedMode(arg);
    setSelectedOption(arg);
  };

  return (
    <Dropdown
      className="w-1/2 absolute bg-white z-50 cursor-pointer"
      placeholder="Select a model"
      onChange={handleSelectOption}
      options={options}
    />
  );
});

const AsrComponent = memo(() => {
  const [editorReadOnly, setValue] = useState(false);
  const asrInitialItems = useMemo(() => asrConfig, []);
  const editor = useRef<Editor>(null);

  const [selectedModel, setSelectedMode] = useState(null);

  const [showNotification, updateShowNotification] = useState('');

  const focusEditor = useCallback(() => {
    if (editor.current) editor.current.focus();
  }, [editor]);

  useEffect(() => focusEditor(), [focusEditor]);

  const createContentBlock = useCallback(({ value, frequency }: CreateContentBlockProps) => {
    //@ts-ignore
    return new ContentBlock({
      key: genKey(),
      type: 'atomic',
      characterList: List(Repeat(CharacterMetadata.create(), value.length)),
      text: value,
      data: Map({
        frequency,
      }),
    });
  }, []);

  const contentBlocksArray = useMemo(() => {
    return asrInitialItems.map(({ value, frequency }: any) => {
      return createContentBlock({ value, frequency });
    });
  }, [asrInitialItems, createContentBlock]);

  const [editorState, setEditorState] = useState(
    EditorState.moveFocusToEnd(
      EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocksArray))
    )
  );

  const defaultFrequency = Map({
    frequency: 0.1,
  });

  const asrBlockRenderer = (contentBlock: ContentBlock) => {
    return {
      component: AsrCustomBlock,
      editable: true,
      props: {
        editorState,
        editorReadOnly,
        setValue,
        setEditorState,
        editor,
        defaultFrequency,
      },
    };
  };

  const updateAsrModel = async () => {
    const content = editorState
      .getCurrentContent()
      .getBlockMap()
      .map(value => {
        return { text: value.get('text'), probability: +value.getIn(['data', 'frequency']) };
      })
      .toList()
      .toJSON();

    const result = await requesASRModelUpdate({ content, selectedModel });
    updateShowNotification(`Обновлено: ${result.response}`);
  };

  return (
    <section className="asr-page relative section flex flex-col items-center h-full w-full mx-auto z-10">
      <AsrSelectModel setSelectedMode={setSelectedMode} />
      <Notification
        showNotification={showNotification}
        updateShowNotification={updateShowNotification}
      />
      <div className="w-full h-full mb-8" onClick={focusEditor}>
        <Scrollbar>
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={editorState => setEditorState(editorState)}
            blockRendererFn={asrBlockRenderer}
            readOnly={editorReadOnly}
          />
        </Scrollbar>
      </div>
      <button
        className="asr-btn_update flex items-center button absolute outline-none"
        onClick={updateAsrModel}
      >
        Обновить
        <SendIcon />
      </button>
    </section>
  );
});

AsrComponent.displayName = 'AsrComponent';

export default AsrComponent;
