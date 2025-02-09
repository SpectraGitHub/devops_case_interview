enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface FetcherError {
  status: number;
  ok: boolean;
  body: string | object;
}

export const fetcher = async <T>(request: Request) => {
  return fetch(request)
    .then<Promise<T>>(async (res) => {
      if (!res.ok) {
        try {
          const body = await res.json();
          return Promise.reject({
            status: res.status,
            ok: false,
            body: JSON.stringify(body),
          });
        } catch (e) {
          return Promise.reject({
            status: res.status,
            ok: false,
            body: "An unexpected error occured",
          });
        }
      }

      if (res.status === 204) {
        return Promise.resolve("Deleted");
      }

      return res.json();
    })
    .catch(async (err) => {
      if (err.ok !== undefined && err.ok === false) {
        return Promise.reject({
          ...err,
        });
      }

      console.error(err);

      return Promise.reject({
        status: 1,
        ok: false,
        body: { detail: err.message },
      });
    });
};

export const httpGet = async <T>(
  url: string,
  headers: HeadersInit = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  };

  const requestArgs: RequestInit = {
    method: Method.GET,
    headers: { ...defaultHeaders, ...headers },
  };
  return fetcher<T>(new Request(url, requestArgs));
};

export const httpPost = async <T>(
  url: string,
  body?: string,
  headers: HeadersInit = {}
) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (body) {
    const encoder = new TextEncoder();
    defaultHeaders["Content-Length"] = encoder.encode(body).length.toString();
  }

  const requestArgs: RequestInit = {
    method: Method.POST,
    headers: { ...defaultHeaders, ...headers },
    body,
  };
  return fetcher<T>(new Request(url, requestArgs));
};

export const httpPut = async <T>(
  url: string,
  body?: string,
  headers: HeadersInit = {}
) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (body) {
    const encoder = new TextEncoder();
    defaultHeaders["Content-Length"] = encoder.encode(body).length.toString();
  }

  const requestArgs: RequestInit = {
    method: Method.PUT,
    headers: { ...defaultHeaders, ...headers },
    body,
  };
  return fetcher<T>(new Request(url, requestArgs));
};

export const httpPatch = async <T>(
  url: string,
  body?: string,
  headers: HeadersInit = {}
) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (body) {
    const encoder = new TextEncoder();
    defaultHeaders["Content-Length"] = encoder.encode(body).length.toString();
  }

  const requestArgs: RequestInit = {
    method: Method.PATCH,
    headers: { ...defaultHeaders, ...headers },
    body,
  };
  return fetcher<T>(new Request(url, requestArgs));
};

export const httpDelete = async <T>(
  url: string,
  body?: string,
  headers: HeadersInit = {}
) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (body) {
    const encoder = new TextEncoder();
    defaultHeaders["Content-Length"] = encoder.encode(body).length.toString();
  }

  const requestArgs: RequestInit = {
    method: Method.DELETE,
    headers: { ...defaultHeaders, ...headers },
    body,
  };
  return fetcher<T>(new Request(url, requestArgs));
};
