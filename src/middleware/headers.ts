/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
import { Request, Response, NextFunction } from 'express';

export const headerConfig = (
	req: Request, 
	res: Response, 
	next: NextFunction
) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
	next();
}