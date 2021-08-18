/* 
* Created 2021-05-13 
* By M4rc0nd35 
*/
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => response.status(404).send({message: "Resource not found"});