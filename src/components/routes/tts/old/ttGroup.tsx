import React, { memo, useState } from 'react';

const TtsCroup = memo(({ children }) => {
  const getName = () => {
    if (children) {
      const childrenWithExtraProp = React.Children.toArray(children);
      const title = Object(childrenWithExtraProp[0]).props.children.props.block.getIn([
        'data',
        'key',
      ]);
      return title;
    }

    return 'Название группы';
  };

  const [collapsed, changeCollapsed] = useState(false);
  const [groupName, setGroupName] = useState(getName());

  return (
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
      {!collapsed && <ul>{children}</ul>}
    </div>
  );
});

TtsCroup.displayName = 'TtsCroup';

export default TtsCroup;
