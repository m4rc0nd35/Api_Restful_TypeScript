import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';

export default class Token {
	static tokens:  string;
	
	static checkToken(req: Request, res: Response, next: NextFunction): void {
		// this.tokens = '';
		try {
			/* case already exists */
			if (req.headers.authorization && process.env.SECRET_KEY) {
				const token = req.headers.authorization.split(' ')[1];
				const stoken = verify(token, process.env.SECRET_KEY);
				next();
			} else
				res.status(401).send({ mensagem: 'Token not exists' });

		} catch (error) {
			res.status(401).send(error);
		}
	}
	
	static decodeToken(): string | object {
			return this.tokens;
	}
}

// export default class Token {

// 	static checkToken(req: Request, res: Response, next: NextFunction): void {
// 		try {
// 			/* case already exists */
// 			if (req.headers.authorization && process.env.SECRET_KEY) {
// 				const token = req.headers.authorization.split(' ')[1];
// 				const decode = verify(token, process.env.SECRET_KEY);
// 				// req.push(decode);
// 				console.log(req);
// 				next();
// 			} else
// 				res.status(401).send({ mensagem: 'Token not exists' });

// 		} catch (error) {
// 			res.status(401).send(error);
// 		}
// 	}
// 	// static decodeToken(token: string): object {
// 	// 	if(process.env.SECRET_KEY)
// 	// 		return verify(token, process.env.SECRET_KEY);
// 	// }
// }

