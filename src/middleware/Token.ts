import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			payload: {
				id: Number,
				name: string,
				email: string
			}
		}
	}
}

export default class Token {

	static checkToken(req: Request, res: Response, next: NextFunction): void {
		try {
			/* case already exists */
			if (req.headers.authorization && process.env.SECRET_KEY) {
				const token = req.headers.authorization.split(' ')[1];
				const payload = verify(token, process.env.SECRET_KEY);
				req.payload = JSON.parse(JSON.stringify(payload));
				next();
			} else
				res.status(401).send({ mensagem: 'Token not exists or enviroment secret key' });

		} catch (error) {
			res.status(401).send(error);
		}
	}
}
