import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Setup from "../screens/Setup";
import { renderWithContext } from "../test/renderWithContext";

vi.mock("../utils/haptics", () => ({ vibrate: vi.fn() }));

describe("Setup screen", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    navigate.mockClear();
  });

  it("renders title and input", () => {
    renderWithContext(<Setup navigate={navigate} />);
    expect(screen.getByText("ĐẾM PHIẾU BẦU")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập tên ứng viên")).toBeInTheDocument();
  });

  it("adds a candidate by clicking + THÊM", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.type(screen.getByPlaceholderText("Nhập tên ứng viên"), "Alice");
    await user.click(screen.getByText("+ THÊM"));
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("adds a candidate by pressing Enter", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.type(screen.getByPlaceholderText("Nhập tên ứng viên"), "Bob{Enter}");
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("does not add an empty candidate", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.click(screen.getByText("+ THÊM"));
    expect(screen.queryAllByRole("button", { name: /Xoá/i })).toHaveLength(0);
  });

  it("removes a candidate", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.type(screen.getByPlaceholderText("Nhập tên ứng viên"), "Charlie{Enter}");
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    // the delete button is the svg button next to the name
    const deleteBtn = screen.getAllByRole("button").find((b) => b.querySelector("svg"));
    await user.click(deleteBtn!);
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("shows error when starting without candidates", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.click(screen.getByText("BẮT ĐẦU KIỂM PHIẾU"));
    expect(screen.getByText(/Vui lòng nhập ít nhất 1 ứng viên/)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates to count when starting with candidates", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.type(screen.getByPlaceholderText("Nhập tên ứng viên"), "Dana{Enter}");
    await user.click(screen.getByText("BẮT ĐẦU KIỂM PHIẾU"));
    expect(navigate).toHaveBeenCalledWith("count");
  });

  it("navigates to history when clicking the history button", async () => {
    const user = userEvent.setup();
    renderWithContext(<Setup navigate={navigate} />);
    await user.click(screen.getByText("XEM LỊCH SỬ KIỂM PHIẾU"));
    expect(navigate).toHaveBeenCalledWith("history");
  });

  it("pre-fills existing candidates from state", () => {
    renderWithContext(<Setup navigate={navigate} />, {
      candidates: [{ id: "1", name: "Eve" }],
    });
    expect(screen.getByText("Eve")).toBeInTheDocument();
  });
});
