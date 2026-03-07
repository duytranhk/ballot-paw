/* eslint-disable react-refresh/only-export-components */
import { render } from "@testing-library/react";
import { type ReactNode, useEffect, useReducer } from "react";
import { BallotContext } from "../context/BallotContext";
import type { BallotAction, BallotState } from "../types";

const defaultState: BallotState = {
  candidates: [],
  votes: {},
  ballotCount: 0,
  ballotLog: [],
  history: [],
};

function reducer(state: BallotState, action: BallotAction): BallotState {
  switch (action.type) {
    case "SET_CANDIDATES":
      return {
        ...state,
        candidates: action.payload,
        votes: Object.fromEntries(action.payload.map((c) => [c.id, 0])),
        ballotCount: 0,
        ballotLog: [],
      };
    case "COUNT_BALLOT": {
      const updated = { ...state.votes };
      action.payload.forEach((id) => {
        updated[id] = (updated[id] ?? 0) + 1;
      });
      return {
        ...state,
        votes: updated,
        ballotCount: state.ballotCount + 1,
        ballotLog: [...state.ballotLog, action.payload],
      };
    }
    case "UNDO_BALLOT": {
      const last = state.ballotLog[state.ballotLog.length - 1];
      if (!last) return state;
      const updated = { ...state.votes };
      last.forEach((id) => {
        updated[id] = Math.max(0, (updated[id] ?? 0) - 1);
      });
      return {
        ...state,
        votes: updated,
        ballotCount: state.ballotCount - 1,
        ballotLog: state.ballotLog.slice(0, -1),
      };
    }
    case "SAVE_HISTORY":
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
    case "DELETE_HISTORY":
      return {
        ...state,
        history: state.history.filter((h) => h.id !== action.payload),
      };
    case "RESET":
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

function TestProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: BallotState;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // suppress localStorage side-effects in tests
  useEffect(() => {}, [state]);
  return <BallotContext.Provider value={{ state, dispatch }}>{children}</BallotContext.Provider>;
}

export function renderWithContext(ui: ReactNode, initialState: Partial<BallotState> = {}) {
  const state: BallotState = { ...defaultState, ...initialState };
  return render(<TestProvider initialState={state}>{ui}</TestProvider>);
}
