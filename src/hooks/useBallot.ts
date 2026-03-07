import { useContext } from "react";
import { BallotContext } from "../context/BallotContext";

export function useBallot() {
  const ctx = useContext(BallotContext);
  if (!ctx) throw new Error("useBallot must be used within <BallotProvider>");
  return ctx;
}
