/* 
* Create 2021-05-13
* By M4rc0nd35 
*/
import express, { Request, Response } from "express";
import { body, validationResult } from 'express-validator';
import { resolve } from "path";
import { User } from '../Controllers/User';

export class UserRoutes extends User {
	userRouter: express.Router;

	constructor() {
		super();
		this.userRouter = express.Router();
	}

	authRouter(): void {
		this.userRouter.post("/user/auth", 
		body('username').isString().isLength({ min: 6, max: 10 }), 
		body('password').isString().isLength({ min: 6, max: 10 }),
		(req: Request, res: Response) => {
			try {
				const errors = validationResult(req);
				if (!errors.isEmpty()) /* validations input´s */
					return res.status(400).json(errors);
					
				this.loginCtl(req.body).then((resolve) => {
					return res.status(202).send({ message: resolve });
				}).catch((reject => {
					return res.status(401).send({ message: reject });
				}));
			} catch (e) { /* exception */
				return res.status(501).send({ message: e.message });
			}
		});
	}
	
	getRouter(): void {
		this.userRouter.get("/user/get/:idUser", (req: Request, res: Response) => {
			console.log(req.params.id);
			try {
				res.status(202).send({ message: "user data" });
			} catch (e) { /* exception */
				res.status(501).send({ message: e.message });
			}
		});
	}
	
	listRouter(): void {
		this.userRouter.get("/list", (req: Request, res: Response) => {
			console.log(req.params.id);
			try {
				res.status(202).send({ message: "user data" });
			} catch (e) { /* exception */
				res.status(501).send({ message: e.message });
			}
		});
	}
	
	registerRouter(): void {
		this.userRouter.post("/user/register", 
		body('username').isString().isLength({ min: 6, max: 10 }),
		body('password').isString().isLength({ min: 6, max: 10 }),
		body('name').isString().isLength({ min: 3, max: 60 }),
		body('email').isEmail().isLength({ min: 3, max: 60 }),
		body('address').isString().isLength({ min: 5, max: 60 }),
		body('phone').optional().isMobilePhone('pt-BR'),
		(req: Request, res: Response) => {
			try {
				const errors = validationResult(req);
				if (!errors.isEmpty()) /* validations input´s */
					return res.status(400).json(errors);
				
				if(this.register(req.body)) /* send to controller write data base */
					res.status(202).send({ message: "Register success!" });
				else
					res.status(406).send({ message: "Not register success!" });
			} catch (e) { /* exception */
				res.status(501).send({ message: "Exception /user/register"});
			}
		});
	}
	
	updateRouter(): void {
		this.userRouter.put("/user/update/:idUser", (req: Request, res: Response) => {
			try {
				console.log(req.params.idUser);
				res.status(202).send({ message: "Update success!" });
			} catch (e) {
				res.status(501).send({ message: e.message});
			}
		});
	}
	
	deleteRouter(): void {
		this.userRouter.delete("/user/delete/:idUser", (req: Request, res: Response) => {
			try {
				console.log(req.params.idUser);
				res.status(202).send({ message: "Delete success!" });
			} catch (e) {
				res.status(501).send({ message: e.message });
			}
		});
	}
}