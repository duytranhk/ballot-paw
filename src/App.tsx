import { useState } from 'react';
import type { HistoryRecord, NavState } from './types';
import Setup from './screens/Setup';
import Counting from './screens/Counting';
import Report from './screens/Report';
import History from './screens/History';
import HistoryDetail from './screens/HistoryDetail';

export default function App() {
  const [nav, setNav] = useState<NavState>({ screen: 'setup' });

  const navigate = (screen: NavState['screen']) => setNav({ screen } as NavState);
  const openRecord = (record: HistoryRecord) => setNav({ screen: 'history-detail', record });

  switch (nav.screen) {
    case 'setup':
      return <Setup navigate={navigate} />;
    case 'count':
      return <Counting navigate={navigate} />;
    case 'report':
      return <Report navigate={navigate} />;
    case 'history':
      return <History navigate={navigate} onOpenRecord={openRecord} />;
    case 'history-detail':
      return <HistoryDetail record={nav.record} navigate={navigate} />;
  }
}

