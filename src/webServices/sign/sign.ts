export type SignRes = {
  access_token: string;
};

export type SignPayload = {
  wallet: string;
  signature: string;
};

export type SignForm = Pick<SignPayload, 'signature'>;

export type SignAction = {
  type: string;
  payload: SignPayload;
};
