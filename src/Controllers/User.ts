import { rejects } from "assert/strict";
import { resolve } from "path";

/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
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
			if(userAuth.username === 'marcondes' && userAuth.password === '321654'){
				resolve({
					username: 'marcondes',
					name: "Jean Marcondes",
					token: "sd4sd6f54s6d5f4sd654f6d"
				});
			}else
				reject("Unauthorized!");
		});
	}
	
	async changePasswordCtl(id: number, newPassword: string): Promise<boolean> {
		return true;
	}
	
	forGotPasswordCtl(email: string): boolean{
		return true;
	}
	
	async register(dataUser: IUser): Promise<boolean> {
		try {
			return new Promise((resolve, reject) => {
				resolve(true);
			});
		} catch (error) {
			return false;
		}
	}
}