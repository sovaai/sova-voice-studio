import { fromJS, isImmutable, OrderedMap } from 'immutable';
import { nanoid } from 'nanoid';
import React, { memo, useMemo, useState } from 'react';

import ttsConfig from '../../../../samples/ttsConfig.json';
import DictionaryGroup from './ttsDictionaryGroup';
import DictionaryItem from './ttsDictionaryItem';

const TtsComponent = memo(() => {
  const dictionariesImmutable = useMemo(
    () =>
      OrderedMap(fromJS(ttsConfig)).map((value: any, key: any) => {
        if (isImmutable(value))
          return fromJS([
            value.map((valueInner: any, keyInner: any) => [valueInner, nanoid()]),
            nanoid(),
          ]);

        return [value, nanoid()];
      }),
    []
  );
  const [dictionariesToBeUsed, changeDictionariesToBeUsed] = useState(dictionariesImmutable);

  const [jsonObject, setJSON] = useState<any>();

  const handleDictionaryCreate = ({ dictionaryKey, groupName }: any) => {
    return changeDictionariesToBeUsed(
      dictionariesToBeUsed.setIn(groupName ? [groupName, 0, dictionaryKey] : [dictionaryKey], [
        dictionaryKey,
        nanoid(),
      ])
    );
  };

  const handleDictionaryRemove = ({ dictionaryKey, groupName }: any) => {
    changeDictionariesToBeUsed(
      dictionariesToBeUsed.deleteIn(groupName ? [groupName, 0, dictionaryKey] : [dictionaryKey])
    );
  };

  const handleDictionariesUpdate = ({ dictionaryKey, dictValue, groupName }: any) => {
    return changeDictionariesToBeUsed(
      dictionariesToBeUsed.updateIn(
        groupName ? [groupName, 0, dictionaryKey] : [dictionaryKey],
        value => {
          value[0] = dictValue;
          return value;
        }
      )
    );
  };

  const handleDictionaryKeyUpdate = ({ dictionaryKey, keyValue, groupName }: any) => {
    if (groupName) {
      return changeDictionariesToBeUsed(
        dictionariesToBeUsed.updateIn([groupName], value => {
          return value.update(0, (item: any) =>
            item.mapKeys((key: any) => {
              if (key === dictionaryKey) return keyValue;
              return key;
            })
          );
        })
      );
    }

    return changeDictionariesToBeUsed(
      dictionariesToBeUsed.mapKeys((key: any) => {
        if (key === dictionaryKey) return keyValue;
        return key;
      })
    );
  };

  const getJSON = () => {
    const object = dictionariesToBeUsed
      .map(value => {
        if (isImmutable(value))
          return value
            .get(0)
            .map((innerValue: any) => innerValue[0])
            .toJS();
        return value[0];
      })
      .toJS();

    setJSON(JSON.stringify(object, undefined, 2));
  };

  return (
    <section className="tts-page section flex flex-col items-center w-full h-full mx-auto z-10">
      <button className="btn btn-blue" onClick={getJSON}>
        JSON
      </button>

      <div className="w-full">
        {/*         {dictionariesToBeUsed.entrySeq().map(([key, value]: any) => {
          const commonMethods = {
            handleDictionariesUpdate: handleDictionariesUpdate,
            handleDictionaryRemove: handleDictionaryRemove,
            handleDictionaryKeyUpdate: handleDictionaryKeyUpdate,
          };

          if (isImmutable(value))
            return (
              <DictionaryGroup
                key={value.get(1)}
                groupName={key}
                dictionaries={value.get(0)}
                handleDictionaryCreate={handleDictionaryCreate}
                {...commonMethods}
              />
            );

          return (
            <DictionaryItem
              key={value[1]}
              dictionaryKey={key}
              dictionaryValue={value}
              {...commonMethods}
            />
          );
        })} */}
      </div>
      <button
        className="btn btn-blue"
        onClick={() =>
          handleDictionaryCreate({ dictionaryKey: `новый ключ ${dictionariesToBeUsed.size}+1` })
        }
      >
        Добавить
      </button>
      <pre>{jsonObject}</pre>
    </section>
  );
});

TtsComponent.displayName = 'TtsComponent';

export default TtsComponent;
