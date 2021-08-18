/* 
* Create 2021-05-13
* By M4rc0nd35 
*/
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { UserService } from '../Services/User';

export class UserControlle {

	async authUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* validations input´s */
			const errors = validationResult(req);
			if (!errors.isEmpty())
				res.status(400).json(errors);

			/* Controller */
			const userSrv = new UserService();
			const user = await userSrv.authUserService(req.body);
			/* Response */
			res.status(202).send({ message: 'Authentication success!', access_token: user });

		} catch (e) { /* exception */
			res.status(401).send({ message: e.message });
		}
	}

	async readUserCtl(req: Request, res: Response): Promise<void> {
		try {
			/* Controller */
			const userSrv = new UserService();
			const users = await userSrv.readUsersService();
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
			const userSrv = new UserService();
			const user = await userSrv.createUserService(req.body);

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
			const userSrv = new UserService();
			const affected = await userSrv.updateUserService(Number(req.params.idUser), req.body)

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
			const userSrv = new UserService();
			const affected = await userSrv.deleteUserService(Number(req.params.idUser));
			res.status(202).send({ message: "Delete success!", affected });

		} catch (e) {
			res.status(406).send({ message: e.message });
		}
	}
}