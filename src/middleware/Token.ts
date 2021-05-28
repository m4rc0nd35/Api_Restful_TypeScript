import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';

export default class Token {
	static tokens:  string;
	
	static checkToken(req: Request, res: Response, next: NextFunction): void {
		try {
			/* case already exists */
			if (req.headers.authorization && process.env.SECRET_KEY) {
				const token = req.headers.authorization.split(' ')[1];
				const payload = verify(token, process.env.SECRET_KEY);
				req.payload = payload; // add "payload?: object | string;" in req > @type > http.d.ts > class IncomingMessage
				next();
			} else
				res.status(401).send({ mensagem: 'Token not exists or enviroment secret key' });

		} catch (error) {
			res.status(401).send(error);
		}
	}
	
	static decodeToken(): string | object {
			return this.tokens;
	}
}
