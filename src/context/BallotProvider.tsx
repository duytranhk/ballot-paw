import React, { useEffect, useReducer } from 'react';
import { BallotContext } from './BallotContext';
import type { BallotAction, BallotState } from '../types';

const initialState: BallotState = {
  candidates: [],
  votes: {},
  ballotCount: 0,
  ballotLog: [],
  history: [],
};

function loadPersistedState(): BallotState {
  try {
    const saved = localStorage.getItem('ballot');
    return saved ? (JSON.parse(saved) as BallotState) : initialState;
  } catch {
    return initialState;
  }
}

function reducer(state: BallotState, action: BallotAction): BallotState {
  switch (action.type) {
    case 'SET_CANDIDATES':
      return {
        ...state,
        candidates: action.payload,
        votes: Object.fromEntries(action.payload.map((c) => [c.id, 0])),
        ballotCount: 0,
        ballotLog: [],
      };
    case 'COUNT_BALLOT': {
      const updated = { ...state.votes };
      action.payload.forEach((candidateId) => {
        updated[candidateId] = (updated[candidateId] ?? 0) + 1;
      });
      return {
        ...state,
        votes: updated,
        ballotCount: state.ballotCount + 1,
        ballotLog: [...state.ballotLog, action.payload],
      };
    }
    case 'UNDO_BALLOT': {
      const lastApproved = state.ballotLog[state.ballotLog.length - 1];
      if (!lastApproved) return state;
      const updated = { ...state.votes };
      lastApproved.forEach((candidateId) => {
        updated[candidateId] = Math.max(0, (updated[candidateId] ?? 0) - 1);
      });
      return {
        ...state,
        votes: updated,
        ballotCount: state.ballotCount - 1,
        ballotLog: state.ballotLog.slice(0, -1),
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
          ...state.history,
        ],
      };
    case 'DELETE_HISTORY':
      return {
        ...state,
        history: state.history.filter((h) => h.id !== action.payload),
      };
    case 'RESET':
      return {
        ...state,
        votes: Object.fromEntries(state.candidates.map((c) => [c.id, 0])),
        ballotCount: 0,
        ballotLog: [],
      };
    default:
      return state;
  }
}

export function BallotProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadPersistedState);

  useEffect(() => {
    localStorage.setItem('ballot', JSON.stringify(state));
  }, [state]);

  return <BallotContext.Provider value={{ state, dispatch }}>{children}</BallotContext.Provider>;
}

