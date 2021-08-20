/* 
* Created 2021-05-13 
* By M4rc0nd35 
*/
import { getConnectionManager } from "typeorm";
import { sign } from 'jsonwebtoken';
import { Users } from "../entity/Users";
import { compare, hash } from "bcryptjs";

interface IUserAuth {
	username: string;
	password: string;
	name: string;
	token: string;
}

interface IUser {
	username: string;
	password: string;
	name: string;
	email: string;
	address: string;
	phone?: number;
}

export class UserService {
	
	async authUserService({ username, password }: IUserAuth): Promise<string> {
		console.log("authUserService")
		const connection = getConnectionManager().get("default");
		/* Get Users */
		let userAuthDB = connection.getRepository(Users);

		/* search data user on DB */
		const userFind = await userAuthDB.findOne({ username });

		if (!userFind)
			throw new Error("Email/Password incorrect!");

		const userMatch = await compare(password, userFind.password || "adjhasbd7&&7%4¨%46");
		if (!userMatch)
			throw new Error("Email/Password incorrect!");

		/* create new token */
		return sign({
			id: userFind.id,
			name: userFind.name,
			email: userFind.email
		},
			String(process.env.SECRET_KEY), {
			expiresIn: 60000
		});
	}

	async readUsersService(): Promise<Users[]> {
		// return new Promise((resolve, reject) => {
		const connection = getConnectionManager().get("default");
		/* Get repository */
		let userListRipository = connection.getRepository(Users);

		/* get all users */
		const readUser = await userListRipository.find();//.then(result => {
		for (const user of readUser)
			delete user.password;

		if (!readUser)
			throw new Error("Not data!");

		return readUser;
	}

	async createUserService({ username, password, name, email, address, phone }: IUser): Promise<Object> {
		const connection = getConnectionManager().get("default");
		/* Get repository */
		let userRegisterRipository = connection.getRepository(Users);

		const pwdHash = await hash(password, 8);

		/* write data user */
		
		const user = await userRegisterRipository.insert({
			username,
			password: pwdHash,
			name,
			email,
			address,
			phone
		});

		delete user.generatedMaps[0].password;

		return user.generatedMaps[0];
	}

	async updateUserService(id: number, userData: IUser): Promise<number> {
		const connection = getConnectionManager().get("default");
		/* Get repository */
		let userUpdateRipository = connection.getRepository(Users);

		/* update data user by id */
		const user = await userUpdateRipository.update(id, userData);

		if (!user.affected)
			throw new Error("Not update");

		return Number(user.affected)
	}

	async deleteUserService(id: number): Promise<number> {
		const connection = getConnectionManager().get("default");
		/* Get repository */
		let userRepository = connection.getRepository(Users);

		/* delete data user by id */
		const user = await userRepository.delete(id);

		if (!user.affected)
			throw new Error("Not deleted");

		return Number(user.affected);
	}
}