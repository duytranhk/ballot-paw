import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Counting from "../screens/Counting";
import { renderWithContext } from "../test/renderWithContext";

vi.mock("../utils/haptics", () => ({ vibrate: vi.fn() }));

const candidates = [
  { id: "a", name: "Alice" },
  { id: "b", name: "Bob" },
  { id: "c", name: "Charlie" },
];

const baseState = {
  candidates,
  votes: { a: 0, b: 0, c: 0 },
  ballotCount: 0,
  ballotLog: [],
};

describe("Counting screen", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    navigate.mockClear();
  });

  it("renders the first ballot number", () => {
    renderWithContext(<Counting navigate={navigate} />, baseState);
    expect(screen.getByText("Phiếu bầu số 1")).toBeInTheDocument();
  });

  it("renders all candidate names", () => {
    renderWithContext(<Counting navigate={navigate} />, baseState);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("hides the Previous button on the first ballot", () => {
    renderWithContext(<Counting navigate={navigate} />, baseState);
    expect(screen.queryByText(/PHIẾU TRƯỚC/)).not.toBeInTheDocument();
  });

  it("toggles a candidate to approved when clicked", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    const aliceBtn = screen.getByText("Alice").closest("button")!;
    await user.click(aliceBtn);
    expect(aliceBtn).toHaveClass("bg-green-100");
  });

  it("toggles a candidate back to approved when clicked twice", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    const aliceBtn = screen.getByText("Alice").closest("button")!;
    await user.click(aliceBtn);
    await user.click(aliceBtn);
    expect(aliceBtn).not.toHaveClass("bg-green-100");
  });

  it("shows error when clicking next with no candidates approved", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    await user.click(screen.getByText("PHIẾU KẾ TIẾP ▶"));
    expect(screen.getByText(/không hợp lệ/)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("advances to next ballot when at least one candidate is approved", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    await user.click(screen.getByText("Alice").closest("button")!);
    await user.click(screen.getByText("PHIẾU KẾ TIẾP ▶"));
    // ballot count should now be 1, so heading shows ballot 2
    expect(screen.getByText("Phiếu bầu số 2")).toBeInTheDocument();
  });

  it("shows Previous button after counting one ballot", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    await user.click(screen.getByText("Alice").closest("button")!);
    await user.click(screen.getByText("PHIẾU KẾ TIẾP ▶"));
    expect(screen.getByText(/PHIẾU TRƯỚC/)).toBeInTheDocument();
  });

  it("restores previous ballot state when clicking Previous", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    // count ballot 1: approved Alice
    await user.click(screen.getByText("Alice").closest("button")!);
    await user.click(screen.getByText("PHIẾU KẾ TIẾP ▶"));
    // go back
    await user.click(screen.getByText(/PHIẾU TRƯỚC/));
    // back to ballot 1, Alice should be approved again
    expect(screen.getByText("Phiếu bầu số 1")).toBeInTheDocument();
    expect(screen.getByText("Alice").closest("button")).toHaveClass("bg-green-100");
  });

  it("shows finish confirm modal when clicking KẾT THÚC", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    // disapprove someone so the standard confirmation modal is shown
    await user.click(screen.getByText("Alice").closest("button")!);
    await user.click(screen.getByText("KẾT THÚC KIỂM PHIẾU"));
    expect(screen.getByText("Kết thúc kiểm phiếu?")).toBeInTheDocument();
  });

  it("shows different modal message when finishing with unchecked ballot", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    // do NOT disapprove anyone, then finish
    await user.click(screen.getByText("KẾT THÚC KIỂM PHIẾU"));
    expect(screen.getByText(/chưa được kiểm/)).toBeInTheDocument();
  });

  it("cancels the finish modal without navigating", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    await user.click(screen.getByText("Alice").closest("button")!);
    await user.click(screen.getByText("KẾT THÚC KIỂM PHIẾU"));
    await user.click(screen.getByText("Huỷ"));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates to report after confirming finish with approved candidates", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    await user.click(screen.getByText("Alice").closest("button")!);
    await user.click(screen.getByText("KẾT THÚC KIỂM PHIẾU"));
    await user.click(screen.getByText("Kết thúc"));
    expect(navigate).toHaveBeenCalledWith("report");
  });

  it("navigates to report after confirming finish with no approved candidates (unchecked ballot skipped)", async () => {
    const user = userEvent.setup();
    renderWithContext(<Counting navigate={navigate} />, baseState);
    // do NOT approve anyone
    await user.click(screen.getByText("KẾT THÚC KIỂM PHIẾU"));
    await user.click(screen.getByText("Kết thúc"));
    expect(navigate).toHaveBeenCalledWith("report");
  });
});
