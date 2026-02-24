export type Screen = 'setup' | 'count' | 'report' | 'history' | 'history-detail';

export type Candidate = {
  id: string;
  name: string;
};

export type HistoryRecord = {
  id: string;
  time: number;
  candidates: Candidate[];
  votes: Record<string, number>;
  ballotCount: number;
};

export type BallotState = {
  candidates: Candidate[];
  votes: Record<string, number>;
  ballotCount: number;
  /** Approved candidate IDs for each counted ballot, in order. Used to undo. */
  ballotLog: string[][];
  history: HistoryRecord[];
};

export type BallotAction =
  | { type: 'SET_CANDIDATES'; payload: Candidate[] }
  | { type: 'COUNT_BALLOT'; payload: string[] }
  | { type: 'UNDO_BALLOT' }
  | { type: 'SAVE_HISTORY' }
  | { type: 'DELETE_HISTORY'; payload: string }
  | { type: 'RESET' };

/** Navigation state — 'history-detail' carries the record to display */
export type NavState = { screen: Exclude<Screen, 'history-detail'> } | { screen: 'history-detail'; record: HistoryRecord };

