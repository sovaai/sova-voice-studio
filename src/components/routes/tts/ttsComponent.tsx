import Draft, {
  genKey,
  CharacterMetadata,
  Editor,
  ContentState,
  EditorState,
  ContentBlock,
} from 'draft-js';
import { fromJS, OrderedMap, Map, List, Repeat } from 'immutable';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Scrollbar from 'react-scrollbars-custom';

import TtsCustomBlock from './ttsCustomBlock';
import { ReactComponent as SendIcon } from '../../../assets/images/send__btn_pink.svg';
import {
  replaceUserDict,
  requestTTSDictionary,
  requestTTSModels,
} from '../../requests/ttsRequests';
import Dropdown from 'react-dropdown';

const TtsComponent = memo(
  ({ dictionariesImmutable, handleStateUpdate, groupName = false, selectedModel }: any) => {
    const [editorReadOnly, setValue] = useState(false);
    const editor = useRef<Editor>(null);

    const focusEditor = useCallback(() => {
      if (editor.current) editor.current.focus();
    }, [editor]);

    const [editorState, setEditorState] = useState(dictionariesImmutable);

    const ttsBlockRenderer = (contentBlock: ContentBlock) => {
      return {
        component: TtsCustomBlock,
        editable: true,
        props: {
          editorReadOnly,
          setValue,
          setEditorState,
          groupName,
          selectedModel,
        },
      };
    };

    const handleEditorChanges = (changedEditorState: EditorState) => {
      handleStateUpdate({ items: changedEditorState, groupName });
      setEditorState(changedEditorState);
    };

    useEffect(() => {
      if (editorState !== dictionariesImmutable) {
        setEditorState(dictionariesImmutable);
      }
    }, [dictionariesImmutable]);

    const [collapsed, changeCollapsed] = useState(false);

    return (
      <div className="w-full h-full mb-8" onClick={focusEditor}>
        {groupName && (
          <div className="my-8">
            <h1
              className={`tts__group-header cursor-pointer text-xl ${
                collapsed ? 'mb-8' : 'mb-4'
              } capitalize`}
              contentEditable={false}
              onClick={() => changeCollapsed(!collapsed)}
            >
              {groupName}
            </h1>
          </div>
        )}
        {!collapsed && (
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={handleEditorChanges}
            blockRendererFn={ttsBlockRenderer}
            readOnly={editorReadOnly}
          />
        )}
      </div>
    );
  }
);

TtsComponent.displayName = 'TtsComponent';

const TtsSelectModel = memo(({ setSelectedMode }: any) => {
  const [options, setOptions] = useState([{ value: '', label: '' }]);
  const [selectedOption, setSelectedOption] = useState(null);

  const requestModels = async () => {
    const models = await requestTTSModels();

    const modelsOptions = models.response.map((value: any) => {
      return { value, label: value };
    });
    setSelectedMode(modelsOptions[0]);
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
      value={options[0]}
      onChange={handleSelectOption}
      options={options}
    />
  );
});

const TTS = () => {
  const [dictionaries, updateDictionaries] = useState();

  const [selectedModel, setSelectedMode] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const dictionary = await requestTTSDictionary({ selectedModel });
      updateDictionaries(dictionary.response);
    };

    getData();
  }, [selectedModel]);

  const createContentBlock = useCallback(({ value, key, contentBlockArray }: any) => {
    contentBlockArray.push(
      new ContentBlock({
        key: genKey(),
        type: 'atomic',
        characterList: List(Repeat(CharacterMetadata.create(), value.length)),
        text: value,
        data: Map({
          key,
        }),
      })
    );
  }, []);

  const contentBlocksArray = useCallback(
    dictionaries => {
      const contentBlockArray: any = [];

      dictionaries.forEach((value: any, key: any) => {
        return createContentBlock({ key, value, contentBlockArray });
      });

      return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlockArray));
    },
    [createContentBlock]
  );

  const [fullState, updateFullState] = useState(false as any);

  /*   const dictionariesImmutable = useMemo(
    () => OrderedMap(fromJS(dictionaries)).filter((value: any) => value.length),
    [dictionaries]
  );

  const dictionariesImmutableGroups = useMemo(
    () => OrderedMap(fromJS(dictionaries)).filter((value: any) => !value.length),
    [dictionaries]
  ); */

  useEffect(() => {
    if (dictionaries) {
      updateFullState({
        items: contentBlocksArray(
          OrderedMap(fromJS(dictionaries)).filter((value: any) => value.length)
        ) as any,
        groups: OrderedMap(fromJS(dictionaries))
          .filter((value: any) => !value.length)
          .map(value => contentBlocksArray(value)) as any,
      });
    }
  }, [dictionaries, contentBlocksArray]);

  const handleStateUpdate = (updateValue: any) => {
    const { groupName, items } = updateValue;
    if (groupName) {
      return updateFullState((prevState: any) => ({
        ...prevState,
        groups: fullState.groups.update(groupName, () => items),
      }));
    }

    updateFullState((prevState: any) => ({ ...prevState, items }));
  };

  const createJSON = async () => {
    const items = fullState.items
      .getCurrentContent()
      .getBlockMap()
      .mapEntries(([key, value]: any) => {
        return [[value.getIn(['data', 'key'])], value.get('text')];
      })
      .toJS();
    const groups = fullState.groups
      .map((groupValue: any, key: any) => {
        return groupValue
          .getCurrentContent()
          .getBlockMap()
          .mapEntries(([key, value]: any) => {
            return [[value.getIn(['data', 'key'])], value.get('text')];
          })
          .toJS();
      })
      .toJS();

    const replaceResponse = await replaceUserDict({
      user_dict: { ...groups, ...items },
      selectedModel,
    });

    console.log(replaceResponse);
  };

  return (
    <section className="tts-page relative section flex flex-col items-center w-full h-full mx-auto z-10">
      <TtsSelectModel setSelectedMode={setSelectedMode} />
      {fullState && (
        <>
          <Scrollbar>
            {fullState.groups.entrySeq().map(([key, value]: any, index: any) => {
              return (
                <TtsComponent
                  key={`${index}-${key}`}
                  dictionariesImmutable={value}
                  groupName={key}
                  handleStateUpdate={handleStateUpdate}
                  selectedModel={selectedModel}
                />
              );
            })}
            <TtsComponent
              dictionariesImmutable={fullState.items}
              handleStateUpdate={handleStateUpdate}
              selectedModel={selectedModel}
            />
          </Scrollbar>
          <button
            className="tts-btn_update flex items-center button absolute outline-none"
            onClick={createJSON}
          >
            Отправить
            <SendIcon />
          </button>
        </>
      )}
    </section>
  );
};

export default TTS;
