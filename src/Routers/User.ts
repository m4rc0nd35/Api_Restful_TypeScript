/* 
* Created 2021-05-13
* By M4rc0nd35 
*/
import { Router } from "express";
import { body, param } from 'express-validator';
import { UserControlle } from '../Controllers/User';
import Token from '../middleware/Token';

interface IUserRoutes {
	authUserRoute(): void;
	readUserRoute(): void;
	createUserRoute(): void;
	updateUserRoute(): void;
	deleteUserRoute(): void;
}

export class UserRoutes implements IUserRoutes {
	userRouter: Router;
	txtNotSpace: string;
	userController: UserControlle;

	constructor() {
		this.userController = new UserControlle();
		this.userRouter = Router();
		/* Messages validator custom */
		this.txtNotSpace = 'Space not accept!';
	}

	authUserRoute(): void {
		try {
			this.userRouter.post("/user/auth",
				body('username').isLength({ min: 6, max: 10 }).withMessage('6~10 Digit´s'),
				body('password').isLength({ min: 6, max: 10 }).withMessage('6~10 Digit´s'),
				this.userController.authUserCtl
			);
		} catch (error) {
			console.log('error')
		}
	}

	readUserRoute(): void {
		this.userRouter.get("/user/list",
			Token.checkToken,
			this.userController.readUserCtl
		);
	}

	createUserRoute(): void {
		this.userRouter.post("/user/register",
			body('username').isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('password').isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('name').isLength({ min: 3, max: 60 }),
			body('email').isEmail().isLength({ min: 3, max: 60 }),
			body('address').isLength({ min: 5, max: 60 }),
			body('phone').optional().isMobilePhone('pt-BR'),
			this.userController.createUserCtl
		);
	}

	updateUserRoute(): void {
		this.userRouter.put("/user/update/:idUser",
			Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /user/update/:idUser'),
			body('username').not(),
			body('password').optional().isString().isLength({ min: 6, max: 10 }).not().matches(/( )/).withMessage(this.txtNotSpace),
			body('name').optional().isString().isLength({ min: 3, max: 60 }),
			body('email').optional().isEmail().isLength({ min: 3, max: 60 }),
			body('address').optional().isString().isLength({ min: 5, max: 60 }),
			body('phone').optional().isMobilePhone('pt-BR'),
			this.userController.updateUserCtl
		);
	}

	deleteUserRoute(): void {
		this.userRouter.delete("/user/delete/:idUser",
			Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /user/delete/:idUser'),
			this.userController.deleteUserCtl
		);
	}
}