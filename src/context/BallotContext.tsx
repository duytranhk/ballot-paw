import { createContext } from 'react';
import type { BallotAction, BallotState } from '../types';

export type BallotContextValue = {
  state: BallotState;
  dispatch: React.Dispatch<BallotAction>;
};

export const BallotContext = createContext<BallotContextValue | null>(null);

