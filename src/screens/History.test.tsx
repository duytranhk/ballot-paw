import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import History from "../screens/History";
import { renderWithContext } from "../test/renderWithContext";
import type { HistoryRecord } from "../types";

const record1: HistoryRecord = {
  id: "r1",
  time: new Date("2025-01-01T10:00:00").getTime(),
  candidates: [{ id: "a", name: "Alice" }],
  votes: { a: 3 },
  ballotCount: 3,
};

const record2: HistoryRecord = {
  id: "r2",
  time: new Date("2025-01-02T10:00:00").getTime(),
  candidates: [{ id: "b", name: "Bob" }],
  votes: { b: 5 },
  ballotCount: 5,
};

describe("History screen", () => {
  const navigate = vi.fn();
  const onOpenRecord = vi.fn();

  beforeEach(() => {
    navigate.mockClear();
    onOpenRecord.mockClear();
  });

  it("shows empty state message when there is no history", () => {
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />);
    expect(screen.getByText("Chưa có dữ liệu kiểm phiếu")).toBeInTheDocument();
  });

  it("renders history records", () => {
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />, {
      history: [record1, record2],
    });
    expect(screen.getByText("3 phiếu")).toBeInTheDocument();
    expect(screen.getByText("5 phiếu")).toBeInTheDocument();
  });

  it("calls onOpenRecord when clicking a record row", async () => {
    const user = userEvent.setup();
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />, {
      history: [record1],
    });
    await user.click(screen.getByText("3 phiếu"));
    expect(onOpenRecord).toHaveBeenCalledWith(record1);
  });

  it("shows delete confirm modal when clicking delete icon", async () => {
    const user = userEvent.setup();
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />, {
      history: [record1],
    });
    await user.click(screen.getByLabelText("Xoá"));
    expect(screen.getByText("Xoá lịch sử kiểm phiếu?")).toBeInTheDocument();
  });

  it("dismisses delete modal on cancel", async () => {
    const user = userEvent.setup();
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />, {
      history: [record1],
    });
    await user.click(screen.getByLabelText("Xoá"));
    await user.click(screen.getByText("Huỷ"));
    expect(screen.queryByText("Xoá lịch sử kiểm phiếu?")).not.toBeInTheDocument();
  });

  it("deletes the record on confirm", async () => {
    const user = userEvent.setup();
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />, {
      history: [record1],
    });
    await user.click(screen.getByLabelText("Xoá"));
    await user.click(screen.getByText("Xoá"));
    expect(screen.queryByText("3 phiếu")).not.toBeInTheDocument();
  });

  it("navigates to setup when clicking back", async () => {
    const user = userEvent.setup();
    renderWithContext(<History navigate={navigate} onOpenRecord={onOpenRecord} />);
    await user.click(screen.getByText("QUAY LẠI"));
    expect(navigate).toHaveBeenCalledWith("setup");
  });
});
