//prueba unitaria para validar horas
import React from "react";
import { render } from "@testing-library/react";
import Login from "../Pages/Login/Login";
import { screen, fireEvent } from "@testing-library/react";

test("muestra error en campos vacíos", () => {
  render(<Login />);
  
  const submitButton = screen.getByRole("button", { name: /Iniciar sesión/i });
  fireEvent.click(submitButton);
  
  const errorMessage = screen.getByText(/Por favor, completa todos los campos/i);
  expect(errorMessage).toBeInTheDocument();
});