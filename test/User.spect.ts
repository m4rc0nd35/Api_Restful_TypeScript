import 'reflect-metadata';
import request from "supertest";
import { Application } from "../src/app";
import { createConnection } from "typeorm";
import { Users } from "../src/entity/Users";
import { Image } from "../src/entity/Image";

describe("Integretion test user", () => {
	let init = false;
	let access_token: string;
	let txtNotSpace = 'Space not accept!';
	let instance: Application;

	let username = 'testuser';
	let password = '123456';

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

	it("Should create user!", async () => {
		const result = await request(instance.app)
			.post("/user/register")
			.set('Accept', 'application/json')
			.send({
				username,
				password,
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

	it("Should authenticate user!", async () => {
		const result = await request(instance.app)
			.post("/user/auth")
			.set('Accept', 'application/json')
			.send({
				username,
				password
			})
			.expect('Content-Type', /json/)
			.expect(202);
		access_token = result.body.access_token;

		expect(result.body.message).toEqual("Authentication success!");
		expect(result.body).toHaveProperty("access_token");
	});

	it("Should read user!", async () => {
		const result = await request(instance.app)
			.get("/user/list")
			.set('authorization', 'Bearer ' + access_token)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(202);
	});
});