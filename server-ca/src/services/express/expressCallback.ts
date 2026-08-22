import type { Request, Response, NextFunction, RequestHandler } from "express";

interface HttpRequest {
  body: unknown;
  params: Record<string, string | string[]>;
  query: Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
}

interface HttpResponse {
  statusCode: number;
  body?: unknown;
  headers?: Record<string, string>;
}

type Controller<Input> = (input: Input) => HttpResponse | Promise<HttpResponse>;

type RequestMapper<Input> = (req: Request) => Input;

export default function expressCallback<Input>({
  controller,
  mapRequest,
}: {
  controller: Controller<Input>;
  mapRequest: RequestMapper<Input>;
}): RequestHandler {
  return async function expressHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const input = mapRequest(req);

      const httpResponse = await controller(input);

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
