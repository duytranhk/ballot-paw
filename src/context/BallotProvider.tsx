import React, { useEffect, useReducer } from 'react';
import { BallotContext } from './BallotContext';

type Candidate = { id: string; name: string };

type State = {
  candidates: Candidate[];
  votes: Record<string, number>;
  ballotCount: number;
  history: HistoryRecord[];
};

type HistoryRecord = {
  id: string;
  time: number;
  candidates: Candidate[];
  votes: Record<string, number>;
  ballotCount: number;
};

const initialState: State = {
  candidates: [],
  votes: {},
  ballotCount: 0,
  history: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: { type: string; payload?: any }): State {
  switch (action.type) {
    case 'SET_CANDIDATES':
      return {
        ...state,
        candidates: action.payload,
        votes: Object.fromEntries(action.payload.map((c: Candidate) => [c.id, 0])),
        ballotCount: 0,
      };
    case 'COUNT_BALLOT': {
      const updated = { ...state.votes };
      action.payload.forEach((candidateId: string) => {
        updated[candidateId] = (updated[candidateId] || 0) + 1;
      });
      return {
        ...state,
        votes: updated,
        ballotCount: state.ballotCount + 1,
      };
    }
    case 'SAVE_HISTORY':
      return {
        ...state,
        history: [
          {
            id: crypto.randomUUID(),
            time: Date.now(),
            candidates: state.candidates,
            votes: state.votes,
            ballotCount: state.ballotCount,
          },
          ...(state.history || []),
        ],
      };
    case 'RESET':
      return {
        ...state,
        votes: Object.fromEntries(state.candidates.map((c) => [c.id, 0])),
        ballotCount: 0,
      };
    default:
      return state;
  }
}

export function BallotProvider({ children }: { children: React.ReactNode }) {
  const saved = localStorage.getItem('ballot');
  const [state, dispatch] = useReducer(reducer, saved ? JSON.parse(saved) : initialState);

  useEffect(() => {
    console.log(state);
    localStorage.setItem('ballot', JSON.stringify(state));
  }, [state]);

  return <BallotContext.Provider value={{ state, dispatch }}>{children}</BallotContext.Provider>;
}

