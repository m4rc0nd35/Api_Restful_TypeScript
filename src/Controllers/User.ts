/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
import { createConnection, Connection } from "typeorm";
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
	
	async loginCtl(userAuth: IUserAuth): Promise<IUserAuth> {

		return new Promise((resolve, reject) => {
			createConnection().then(async connection => {
				/* Get Users */
				let userAuthDB = connection.getRepository(Users);
				/* search data user on DB */
				const users = await userAuthDB.findOne({
					username: userAuth.username,
					password: userAuth.password
				});

				/* Case User true */
				if (users) {
					/* Append data user to interface */
					const userAuthReturn: IUserAuth = {
						username: users.username,
						name: users.name,
						token: "ABCDEFGHIJ"
					}
					resolve(userAuthReturn);
				} else
					reject("Unauthorized!");

				connection.close();

			}).catch(error => {
				reject(error);
			});
		});
	}

	async changePasswordCtl(id: number, newPassword: string): Promise<boolean> {
		
		return true;
	}

	forGotPasswordCtl(email: string): boolean {
		return true;
	}

	async register(dataUser: IUser): Promise<boolean> {
		return new Promise((resolve, reject) => {
			createConnection().then(async connection => {
				/* Get repository */
				let userRegisterDB = connection.getRepository(Users);

				/* write data user on DB */
				const user = new Users();
				user.username = dataUser.username;
				user.password = dataUser.password;
				user.name = dataUser.name;
				user.email = dataUser.email;
				user.address = dataUser.address;
				user.phone = Number(dataUser.phone);
				await userRegisterDB.manager.save(user);
				connection.close();
				resolve(true);

			}).catch(error => {
				console.log(error);
				reject(error.detail);
			});
		});
	}
}