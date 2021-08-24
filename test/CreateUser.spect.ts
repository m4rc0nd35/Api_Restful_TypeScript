import 'reflect-metadata';
import request from "supertest";
import { Application } from "../src/app";
import { createConnection } from "typeorm";
import { Users } from "../src/entity/Users";
import { Image } from "../src/entity/Image";

describe("Integretion test user", () => {
	let init = false;
	let token: string;
	let txtNotSpace = 'Space not accept!';
	let instance: Application;
	
	beforeEach(async () => {
		if (!init) {
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
			
			instance = new Application();
			init = true;
		}
	});

	it("Deve criar um usuário", async () => {
		const result = await request(instance.app)
			.post("/user/register")
			.set('Accept', 'application/json')
			.send({
				username: "marcosss",
				password: "123456",
				name: "Jean Marcondes",
				email: "dev1@devcloud.com.br",
				address: "Rua X Parnamirim/RN",
				phone: "84988984868"
			})
			.expect('Content-Type', /json/)
			.expect(202);

		expect(result.body.user).toHaveProperty("id");
		expect(result.body.user).toHaveProperty("created_at");
	});
});