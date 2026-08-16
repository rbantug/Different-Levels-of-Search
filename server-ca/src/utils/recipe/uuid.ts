import { randomUUID } from "crypto";

const identity = Object.freeze({
  makeId: randomUUID,
  isValid: (id: string) => id.length === 24,
});

export default identity;
