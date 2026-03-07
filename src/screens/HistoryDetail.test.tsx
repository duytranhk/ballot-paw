import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HistoryDetail from "../screens/HistoryDetail";
import { renderWithContext } from "../test/renderWithContext";
import type { HistoryRecord } from "../types";

vi.mock("../utils/share", () => ({
  buildResultText: vi.fn(() => "shared text"),
  shareResult: vi.fn(),
}));

const record: HistoryRecord = {
  id: "rec1",
  time: new Date("2025-06-15T08:30:00").getTime(),
  candidates: [
    { id: "a", name: "Alice" },
    { id: "b", name: "Bob" },
  ],
  votes: { a: 4, b: 2 },
  ballotCount: 6,
};

describe("HistoryDetail screen", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    navigate.mockClear();
  });

  it("renders heading", () => {
    renderWithContext(<HistoryDetail record={record} navigate={navigate} />);
    expect(screen.getByText("KẾT QUẢ KIỂM PHIẾU")).toBeInTheDocument();
  });

  it("shows total ballot count", () => {
    renderWithContext(<HistoryDetail record={record} navigate={navigate} />);
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("shows candidate names", () => {
    renderWithContext(<HistoryDetail record={record} navigate={navigate} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("navigates to history when clicking back", async () => {
    const user = userEvent.setup();
    renderWithContext(<HistoryDetail record={record} navigate={navigate} />);
    await user.click(screen.getByText("QUAY LẠI"));
    expect(navigate).toHaveBeenCalledWith("history");
  });

  it("calls shareResult when sharing", async () => {
    const { shareResult } = await import("../utils/share");
    const user = userEvent.setup();
    renderWithContext(<HistoryDetail record={record} navigate={navigate} />);
    await user.click(screen.getByText("CHIA SẺ KẾT QUẢ"));
    expect(shareResult).toHaveBeenCalled();
  });
});
