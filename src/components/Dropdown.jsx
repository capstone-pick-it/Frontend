import React, { useEffect, useState } from 'react';
import more1 from '../assets/images/more1.svg';

const Dropdown = ({ title, list = [], value, onChange, variant = "default" }) => {
  const [more, setMore] = useState(false);

  // value가 있으면 부모가 넘긴 값을 우선 사용하고, 없으면 첫 번째 항목 사용
  const [selected, setSelected] = useState(value || list[0]);

  // 부모에서 value가 바뀌면 Dropdown 내부 선택값도 같이 동기화
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const moreClick = () => {
    setMore(!more);
  };

  const handleItemClick = (item) => {
    setSelected(item);
    setMore(false);
    
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <div className={`Dropdown_Wrap ${variant}`}>
      <div className="title">{title}</div>

      <div className="dropdown_container">
        <div className="dropdown" onClick={moreClick}>
          <div className="option">{selected}</div>
          <img src={more1} alt="" className={more ? 'open' : ''} />
        </div>

        {more && (
          <ul className="list">
            {list.map((item, index) => (
              <li key={index} onClick={() => handleItemClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;