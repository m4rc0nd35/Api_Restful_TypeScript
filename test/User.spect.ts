import 'reflect-metadata';
import request from "supertest";
import { Application } from "../src/app";
import { createConnection } from "typeorm";
import { Users } from "../src/entity/Users";
import { Image } from "../src/entity/Image";

describe("Integration test user", () => {
	let init = false;
	let access_token: string;
	let txtNotSpace = 'Space not accept!';
	let instance: Application;
	let userId: Number;

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
				name: "Teste da silva",
				email: "dev@devcloud.com.br",
				address: "Rua X city/RN",
				phone: "84999999999"
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
			.auth(access_token, { type: "bearer" })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);

		userId = result.body.data[0].id;
		expect(result.body.data[0].username).toEqual(username);
	});

	it("Shouldn´t update user account, without userid param!", async () => {
		const result = await request(instance.app)
		.put("/user/update/")
		.auth(access_token, { type: "bearer" })
		.send({
			password: "321654",
			name: "joão melão"
		})
		.expect(404);
	});
	
	it("Shouldn´t update user account, userid not exists on database!", async () => {
		const result = await request(instance.app)
		.put("/user/update/1")
		.auth(access_token, { type: "bearer" })
		.send({
			password: "321654",
			name: "joão melão"
		})
		.expect(406);
	});
	
	it("Shouldn´t update user account, without access token!", async () => {
		const result = await request(instance.app)
		.put("/user/update/1")
		.send({
			password: "321654",
			name: "joão melão"
		})
		.expect(401);
	});
	
	it("Should update user account!", async () => {
		const result = await request(instance.app)
		.put("/user/update/"+userId)
		.auth(access_token, { type: "bearer" })
		.send({
			password: "321654",
			name: "joão melão"
		})
		.expect(202);
		
		expect(result.body.affected).toEqual(1);
	});
	
	it("Shouldn´t delete user, without access token!", async () =>{
		const result = await request(instance.app)
		.delete("/user/delete/1")
		.expect(401);
	});
	
	it("Shouldn´t delete user, without userid param!", async () =>{
		const result = await request(instance.app)
		.delete("/user/delete/")
		.auth(access_token, { type: "bearer"})
		.expect(404);
	});
	
	it("Shouldn´t delete user, userid not exists on database!", async () =>{
		const result = await request(instance.app)
		.delete("/user/delete/1")
		.auth(access_token, { type: "bearer"})
		.expect(406);
	});
	
	it("Should delete user!", async () =>{
		const result = await request(instance.app)
		.delete("/user/delete/"+userId)
		.auth(access_token, { type: "bearer"})
		.expect(202);
		
		expect(result.body.affected).toEqual(1);
	});
});