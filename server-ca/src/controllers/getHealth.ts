import type { HttpResponse } from "../services/express/expressCallback.js";

export default function makeGetHealth() {
  return function getHealth(): HttpResponse {
    return {
      statusCode: 200,
      body: {
        status: "ok",
      },
    };
  };
}
