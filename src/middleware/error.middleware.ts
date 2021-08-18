/* 
* Created 2021-05-13 
* By M4rc0nd35 
*/
import HttpException from '../Common/http-exceptio';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || error.status || 500;

  response.status(status).send({message:error.message});
};