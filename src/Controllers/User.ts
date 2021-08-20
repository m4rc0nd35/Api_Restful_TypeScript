/* 
* Created 2021-05-13
* By M4rc0nd35 
*/
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { UserService } from '../Services/User';

interface IFuncUser {
	authUserCtl(req: Request, res: Response): Promise<void>;
	readUserCtl(req: Request, res: Response): Promise<void>;
	createUserCtl(req: Request, res: Response): Promise<void>;
	updateUserCtl(req: Request, res: Response): Promise<void>;
	deleteUserCtl(req: Request, res: Response): Promise<void>;
}

export class UserControlle implements IFuncUser {

	async authUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* validations input´s */
			const errors = validationResult(req);
			if (!errors.isEmpty())
				res.status(400).json(errors);

			/* Controller */
			const user = await new UserService().authUserService(req.body);
			/* Response */
			res.status(202).send({ message: 'Authentication success!', access_token: user });

		} catch (e) { /* exception */
			res.status(401).send({ message: e.message });
		}
	}

	async readUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* Controller */
			const users = await new UserService().readUsersService();
			res.status(202).send({ message: "user data", data: users });

		} catch (e) { /* exception */
			res.status(204).send({ message: "e.message" });
		}
	}

	async createUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* validations input´s */
			const errors = validationResult(req);
			if (!errors.isEmpty())
				res.status(400).json(errors);

			/* Controller */
			const user = await new UserService().createUserService(req.body);

			res.status(202).send({ message: "Register success!", user });

		} catch (e) { /* exception */
			res.status(406).send({ message: e.message });
		}
	}

	async updateUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* validations input´s */
			const errors = validationResult(req);
			if (!errors.isEmpty())
				res.status(400).json(errors);

			/* Controller */
			const affected = await new UserService().updateUserService(Number(req.params.idUser), req.body)

			res.status(202).send({ message: "Update success!", affected });

		} catch (e) {
			res.status(406).send({ message: e.message });
		}
	}

	async deleteUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* validations input´s */
			const errors = validationResult(req);
			if (!errors.isEmpty())
				res.status(400).json(errors);

			/* Controller */
			const affected = await new UserService().deleteUserService(Number(req.params.idUser));
			res.status(202).send({ message: "Delete success!", affected });

		} catch (e) {
			res.status(406).send({ message: e.message });
		}
	}
}