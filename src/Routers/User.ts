/* 
* Create 2021-05-13
* By M4rc0nd35 
*/
import express, { Request, Response } from "express";
import { body, param, validationResult } from 'express-validator';
import { User } from '../Controllers/User';
import Token from '../middleware/Token';

export class UserRoutes extends User {
	userRouter: express.Router;
	txtNotSpace: string;

	constructor() {
		super();
		this.userRouter = express.Router();

		/* Messages validator custom */
		this.txtNotSpace = 'Space not accept!';
	}

	authRouter(): void {
		this.userRouter.post("/user/auth",
			body('username').isLength({ min: 6, max: 10 }).withMessage('6~10 Digit´s'),
			body('password').isLength({ min: 6, max: 10 }).withMessage('6~10 Digit´s'),
			(req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						res.status(400).json(errors);

					/* Controller */
					this.loginCtl(req.body).then((resolve) => {
						res.status(202).send({ message: 'Authentication success!', access_token: resolve });
					}).catch((reject => {
						res.status(401).send({ message: reject });
					}));
				} catch (e) { /* exception */
					res.status(500).send({ message: e.message });
				}
			});
	}

	listRouter(): void {
		this.userRouter.get("/user/list", Token.checkToken, (req: Request, res: Response) => {
			try {
				this.listCtl().then(result => {
					res.status(202).send({ message: "user data", data: result });
				}).catch(error => {
					res.status(204).send({ message: error });
				})
			} catch (e) { /* exception */
				res.status(500).send({ message: e.message });
			}
		});
	}

	registerRouter(): void {
		this.userRouter.post("/user/register", Token.checkToken,
			body('username').isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('password').isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('name').isLength({ min: 3, max: 60 }),
			body('email').isEmail().isLength({ min: 3, max: 60 }),
			body('address').isLength({ min: 5, max: 60 }),
			body('phone').optional().isMobilePhone('pt-BR'),
			(req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* Controller */
					this.registerCtl(req.body).then((resolve) => {
						res.status(202).send({ message: "Register success!" });
					}).catch((reject => {
						res.status(406).send({ message: reject });
					}));
				} catch (e) { /* exception */
					res.status(500).send({ message: "Exception /user/register" });
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
			(req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* Controller */
					this.updateCtl(Number(req.params.idUser), req.body).then(affected => {
						res.status(202).send({ message: "Update success!", affected: affected });
					}).catch(error => {
						res.status(406).send({ message: error });
					})
				} catch (e) {
					res.status(500).send({ message: e.message });
				}
			});
	}

	deleteRouter(): void {
		this.userRouter.delete("/user/delete/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /user/delete/:idUser'),
			(req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* Controller */
					this.deleteCtl(Number(req.params.idUser)).then(affected => {
						res.status(202).send({ message: "Delete success!", affected: affected });
					}).catch(error => {
						res.status(406).send({ message: error });
					})
				} catch (e) {
					res.status(500).send({ message: e.message });
				}
			});
	}
}