import { Request } from 'express';

export interface IAuthenticatedUserPayload {
  id: string;
  username: string;
}

export interface IAuthenticatedUserRequest extends Request {
  user: IAuthenticatedUserPayload;
}
