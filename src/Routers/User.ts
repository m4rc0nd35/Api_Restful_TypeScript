/* 
* Create 2021-05-13
* By M4rc0nd35 
*/
import express, { Request, Response } from "express";
import { User } from '../Controllers/User';

export class UserRoutes extends User {
	userRouter: express.Router;

	constructor() {
		super();
		this.userRouter = express.Router();
	}

	authRouter(): void {
		// this.login("teste", "teste");
		this.userRouter.post("/auth", (req: Request, res: Response) => {
			try {
				console.log(req.body);
				this.loginCtl('marcondes', '321654');
				res.status(202).send({ message: "Autenticado com sucesso!" });
			} catch (e) {
				res.status(501).send({ message: "try catch" });
			}
		});
	}
	
	getDataRouter(): void {
		this.userRouter.get("/user/:id", (req: Request, res: Response) => {
			console.log(req.params.id);
			try {
				res.status(202).send({ message: "user data" });
			} catch (e) {
				res.status(501).send({ message: "try catch" });
			}
		});
	}
	
	registerRouter(): void {
		this.userRouter.post("/register", (req: Request, res: Response) => {
			try {
				console.log(req.body);
				res.status(202).send({ message: "Register success!" });
			} catch (e) {
				res.status(501).send({ message: "try catch" });
			}
		});
	}
	
	updateRouter(): void {
		this.userRouter.put("/update", (req: Request, res: Response) => {
			try {
				console.log(req.body);
				res.status(202).send({ message: "Update success!" });
			} catch (e) {
				res.status(501).send({ message: "try catch" });
			}
		});
	}
	
	deleteRouter(): void {
		this.userRouter.delete("/delete", (req: Request, res: Response) => {
			try {
				console.log(req.body);
				res.status(202).send({ message: "Delete success!" });
			} catch (e) {
				res.status(501).send({ message: "try catch" });
			}
		});
	}
}