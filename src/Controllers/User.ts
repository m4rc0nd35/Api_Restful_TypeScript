/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
import { getConnectionManager } from "typeorm";
import { sign } from 'jsonwebtoken';
import { Users } from "../entity/Users";

interface IUserAuth {
	username: string;
	password?: string;
	name: string;
	token: string;
}

interface IUser {
	username: string;
	password: string
	name: string;
	email: string;
	address: string;
	phone?: number;
}

export class User {

	loginCtl(userAuth: IUserAuth): Promise<string> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get Users */
			let userAuthDB = connection.getRepository(Users);
			/* search data user on DB */
			userAuthDB.findOne({
				username: userAuth.username,
				password: userAuth.password
			}).then((result) => {
				if (result) {
					/* create new token */
					resolve(sign({
						id: result.id,
						name: result.name,
						email: result.email
					},
						String(process.env.SECRET_KEY), {
						expiresIn: 6000
					}));
				} else
					reject("Unauthorized");

			}).catch(error => {
				reject("Unauthorized");
			});
		});
	}

	listCtl(): Promise<Users[]> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let userListRipository = connection.getRepository(Users);

			/* get all users */
			userListRipository.find().then(result => {
				if (result)
					resolve(result);
				else
					reject("Not data");
			}).catch(error => {
				reject("Not data");
			});
		});
	}

	registerCtl(dataUser: IUser): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let userRegisterRipository = connection.getRepository(Users);

			/* write data user */
			userRegisterRipository.insert({
				username: dataUser.username,
				password: dataUser.password,
				name: dataUser.name,
				email: dataUser.email,
				address: dataUser.address,
				phone: Number(dataUser.phone)
			}).then(result => {
				resolve(true);
			}).catch(error => {
				reject(error.detail);
			});
		});
	}

	updateCtl(id: number, userData: IUser): Promise<number> {
		return new Promise((resolve, rejct) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let userUpdateRipository = connection.getRepository(Users);

			/* update data user by id */
			userUpdateRipository.update(id, userData).then(result => {
				resolve(Number(result.affected));
			}).catch(error => {
				rejct(error.detail);
			})
		});
	}

	deleteCtl(id: number): Promise<number> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let userRepository = connection.getRepository(Users);

			/* delete data user by id */
			userRepository.delete(id).then(result => {
				resolve(Number(result.affected));
			}).catch(error => {
				reject(error.detail);
			});
		});
	}
}