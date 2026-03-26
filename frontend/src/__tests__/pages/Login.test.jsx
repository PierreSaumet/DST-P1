import { render } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";

vi.mock("../../components/Login/Form", () => ({
  default: () => <div>Form</div>,
}));

describe("Login", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
  });
});
