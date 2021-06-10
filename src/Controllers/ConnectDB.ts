import { createConnection } from "typeorm";
import { Users } from "../entity/Users";
import { Image } from "../entity/Image";

export class ConnectDB {

	constructor() {
		/* new connection database */
		createConnection({
			type: "postgres",
			host: String(process.env.HOST_DB),
			port: Number(process.env.PORT_DB) | 5432,
			username: String(process.env.USER_DB),
			password: String(process.env.PWD_DB),
			database: String(process.env.DATABASE),
			entities: [
				Users,
				Image
			],
			synchronize: true,
			logging: false
		}).then(cnn => {
			console.log('Connection SQL:', cnn.options);
		}).catch(console.log)
	}
}