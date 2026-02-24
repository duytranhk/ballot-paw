/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Setup from './screens/Setup';
import Counting from './screens/Counting';
import Report from './screens/Report';
import History from './screens/History';
import HistoryDetail from './screens/HistoryDetail';

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [record, setRecord] = useState<any>(null);
  let ScreenComponent = null;
  if (screen === 'setup') ScreenComponent = <Setup go={setScreen} />;
  if (screen === 'count') ScreenComponent = <Counting go={setScreen} />;
  if (screen === 'report') ScreenComponent = <Report go={setScreen} />;
  if (screen === 'history')
    ScreenComponent = (
      <History
        go={setScreen}
        open={(r: any) => {
          setRecord(r);
          setScreen('detail');
        }}
      />
    );
  if (screen === 'detail') ScreenComponent = <HistoryDetail record={record} go={setScreen} />;
  return ScreenComponent;
}

