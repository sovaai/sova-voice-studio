import React, { memo, useState } from 'react';
import DictionaryItem from './ttsDictionaryItem';

const DictionaryGroup = memo(
  ({
    groupName,
    dictionaries,
    handleDictionariesUpdate,
    handleDictionaryRemove,
    handleDictionaryKeyUpdate,
    handleDictionaryCreate,
  }: any) => {
    const [groupCollapsed, changeGroupCollapsedStatus] = useState(true);

    const handleGroupCollapse = () => changeGroupCollapsedStatus(!groupCollapsed);
    const handleDictionaryAdd = () =>
      handleDictionaryCreate({
        dictionaryKey: `${dictionaries.size + 1}-${groupName}`,
        groupName,
      });

    return (
      <div className="flex flex-col m-4">
        <div
          onClick={handleGroupCollapse}
          className="flex items-center m-2 cursor-pointer select-none"
        >
          <span className="group-header__span text-xl capitalize mr-4">
            {groupCollapsed ? '+' : '-'}
          </span>
          <h2 className="text-xl capitalize">{groupName}</h2>
        </div>
        {!groupCollapsed && (
          <>
            <div className="flex flex-col">
              {dictionaries.entrySeq().map(([key, value]: any) => (
                <DictionaryItem
                  key={value[1]}
                  dictionaryKey={key}
                  dictionaryValue={value}
                  groupName={groupName}
                  handleDictionaryRemove={handleDictionaryRemove}
                  handleDictionariesUpdate={handleDictionariesUpdate}
                  handleDictionaryKeyUpdate={handleDictionaryKeyUpdate}
                />
              ))}
            </div>
            <button className="btn btn-blue" onClick={handleDictionaryAdd}>
              Добавить
            </button>
          </>
        )}
      </div>
    );
  }
);

DictionaryGroup.displayName = 'DictionaryGroup';

export default DictionaryGroup;
