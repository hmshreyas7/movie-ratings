import { ReportProblem } from '@material-ui/icons';
import React from 'react';

function NoData() {
  return (
    <div className='no-data-info'>
      <ReportProblem fontSize='large' />
      <h2>Nothing to see here</h2>
    </div>
  );
}

export default NoData;
