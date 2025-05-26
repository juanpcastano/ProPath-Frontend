import { generateUUID } from "../services/uuidGenerator";

describe("Creación de path", () => {
  it("debe generar un UUID único para el path", () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
    expect(uuid1).toHaveLength(36);
  });
});