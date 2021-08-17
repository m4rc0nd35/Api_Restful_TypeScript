/* 
* Create 2021-05-13
* By M4rc0nd35 
*/
import express, { Request, Response, Router } from "express";
import { body, param, validationResult } from 'express-validator';
import { User } from '../Controllers/User';
import Token from '../middleware/Token';

export class UserRoutes extends User {
	userRouter: express.Router;
	txtNotSpace: string;

	constructor() {
		super();
		this.userRouter = Router();

		/* Messages validator custom */
		this.txtNotSpace = 'Space not accept!';
	}

	authRouter(): void {
		this.userRouter.post("/user/auth",
			body('username').isLength({ min: 6, max: 10 }).withMessage('6~10 Digit´s'),
			body('password').isLength({ min: 6, max: 10 }).withMessage('6~10 Digit´s'),
			async (req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						res.status(400).json(errors);

					/* Controller */
					const user = await this.authUserCtl(req.body);
					/* Response */
					res.status(202).send({ message: 'Authentication success!', access_token: user });

				} catch (e) { /* exception */
					res.status(401).send({ message: e.message });
				}
			});
	}

	listRouter(): void {
		this.userRouter.get("/user/list", Token.checkToken, async (req: Request, res: Response) => {
			try {
				/* Controller */
				const users = await this.readUsersCtl();
				res.status(202).send({ message: "user data", data: users });

			} catch (e) { /* exception */
				res.status(204).send({ message: e.message });
			}
		});
	}

	registerRouter(): void {
		this.userRouter.post("/user/register",
			body('username').isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('password').isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('name').isLength({ min: 3, max: 60 }),
			body('email').isEmail().isLength({ min: 3, max: 60 }),
			body('address').isLength({ min: 5, max: 60 }),
			body('phone').optional().isMobilePhone('pt-BR'),
			async (req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* Controller */
					const user = await this.createUserCtl(req.body);

					res.status(202).send({ message: "Register success!", user});

				} catch (e) { /* exception */
					res.status(406).send({ message: e.message });
				}
			});
	}

	updateRouter(): void {
		this.userRouter.put("/user/update/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /user/update/:idUser'),
			body('username').not(),
			body('password').optional().isString().isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('name').optional().isString().isLength({ min: 3, max: 60 }),
			body('email').optional().isEmail().isLength({ min: 3, max: 60 }),
			body('address').optional().isString().isLength({ min: 5, max: 60 }),
			body('phone').optional().isMobilePhone('pt-BR'),
			async (req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* Controller */
					const affected = await this.updateUserCtl(Number(req.params.idUser), req.body)

					res.status(202).send({ message: "Update success!", affected });

				} catch (e) {
					res.status(406).send({ message: e.message });
				}
			});
	}

	deleteRouter(): void {
		this.userRouter.delete("/user/delete/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /user/delete/:idUser'),
			async (req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* Controller */
					const affected = await this.deleteUserCtl(Number(req.params.idUser));
					res.status(202).send({ message: "Delete success!", affected });

				} catch (e) {
					res.status(406).send({ message: e.message });
				}
			});
	}
}