import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Hidden">
        body
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("exposes an accessible dialog labelled by its title", () => {
    render(
      <Modal isOpen onClose={() => {}} title="New Contact">
        body
      </Modal>
    );
    const dialog = screen.getByRole("dialog", { name: "New Contact" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("calls onClose from the close button", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="T">
        body
      </Modal>
    );
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="T">
        body
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="T">
        body
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });
});
