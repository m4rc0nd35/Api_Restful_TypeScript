import { createConnection } from "typeorm";
import { Users } from "../entity/Users";
import { Image } from "../entity/Image";

export class ConnectDB {

	async create(): Promise<Boolean> {
		/* new connection database */
		const cnn = await createConnection({
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
		});

		if (!cnn)
			return false;

		console.log('Connection :', cnn.options.type);
		
		return true;
	}
}