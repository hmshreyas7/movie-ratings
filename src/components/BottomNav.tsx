import {
  DateRange,
  Equalizer,
  MovieFilter,
  Schedule,
} from '@material-ui/icons';
import React, { forwardRef } from 'react';

interface BottomNavProps {
  selectedTab: number;
  onTabChange: (tabIndex: number) => void;
}

function BottomNav(props: BottomNavProps, ref: any) {
  const tabInfo = [
    {
      icon: <Equalizer />,
      text: 'Distribution',
    },
    {
      icon: <Schedule />,
      text: 'Runtime',
    },
    {
      icon: <MovieFilter />,
      text: 'Genre',
    },
    {
      icon: <DateRange />,
      text: 'Decade',
    },
  ];
  const { selectedTab, onTabChange } = props;

  const getClassName = (index: number) => {
    let className = 'bottom-nav-item';
    className += index === selectedTab ? ' bottom-nav-selected-item' : '';

    return className;
  };

  return (
    <div ref={ref} className='bottom-nav'>
      {tabInfo.map((tab, index) => {
        return (
          <div
            key={index}
            className={getClassName(index)}
            onClick={() => onTabChange(index)}
          >
            {tab.icon}
            <p>{tab.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default forwardRef(BottomNav);
