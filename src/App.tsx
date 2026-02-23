import { useState } from 'react';
import Setup from './screens/Setup';
import Counting from './screens/Counting';
import Report from './screens/Report';

export default function App() {
  const [screen, setScreen] = useState<'setup' | 'count' | 'report'>('setup');

  if (screen === 'setup') return <Setup go={setScreen} />;
  if (screen === 'count') return <Counting go={setScreen} />;
  return <Report go={setScreen} />;
}

