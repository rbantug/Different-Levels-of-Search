import type { Request, Response, NextFunction, RequestHandler } from "express";

export interface HttpResponse {
  statusCode: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export type Controller<Input> = (input: Input) => HttpResponse | Promise<HttpResponse>;

type RequestMapper<Input> = (req: Request) => Input;

export default function expressCallback<Input>({
  controller,
  mapRequest,
}: {
  controller: Controller<Input>;
  mapRequest?: RequestMapper<Input>;
}): RequestHandler {
  return async function expressHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const input = mapRequest ? mapRequest(req) : undefined;

      const httpResponse = await controller(input as Input);

      if (httpResponse.headers) {
        for (const [key, value] of Object.entries(httpResponse.headers)) {
          res.setHeader(key, value);
        }
      }

      if (httpResponse.statusCode === 204) {
        return res.status(204).send();
      }

      return res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      next(error);
    }
  };
}
