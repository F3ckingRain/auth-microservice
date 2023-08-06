export type RequestBody<T> = {
  method: "POST" | "GET";
  url: string;
  body: T;
};

export type RequestHeaders = {
  frm: string;
  fronturl: string;
};

type Request<T> = {
  body: RequestBody<T>;
  headers: RequestHeaders;
};

export type SignRequest = Request<{ phone: string }>;
