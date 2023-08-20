export type SignRes = {
  access_token: string;
};

export type SignPayload = {
  signature: string;
};

export type SignAction = {
  type: string;
  payload: SignPayload;
};
