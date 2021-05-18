/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
import http from 'http';
import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { UserRoutes } from './Routers/User';
import { headerConfig } from './middleware/headers'
// import "reflect-metadata";
import {createConnection} from "typeorm";


class AppControler extends UserRoutes {
	app: express.Express;
	server: http.Server;

	constructor() {
		super();
		// Objects init
		this.app = express();
		this.server = http.createServer(this.app);

		// Methods init
		this.header();
		this.middlewares();
		this.routes();
		this.errorHandler();
		this.notFoundHandler();
		// this.connectDB();

		// Routers init
		this.authRouter();
		this.getRouter();
		this.listRouter();
		this.registerRouter();
		this.updateRouter();
		this.deleteRouter();
	}

	header(): void {
		this.app.use(headerConfig);
	}

	middlewares(): void {
		this.app.use(express.json());
	}

	errorHandler(): void {
		this.app.use(errorHandler);
	}

	notFoundHandler(): void {
		this.app.use(notFoundHandler);
	}

	routes(): void {
		this.app.use('/', this.userRouter);
	}

	connectDB(): void {
		createConnection({
			type: "postgres",
			host: "168.138.132.48",
			port: 5432,
			username: "postgres",
			password: "321654dust",
			database: "postgres",
			entities: [
				__dirname + "/entity/*.ts"
			],
			synchronize: true,
		}).then(connection => {
			// here you can start to work with your entities
		}).catch(error => console.log(error));
	}

	serverOn(port: number) {
		this.server.listen(port, '0.0.0.0', () => {
			console.log(`Server listening on port ${port}`);
		});
	}
}

const instance = new AppControler();
instance.serverOn(parseInt(process.env.PORT || '8080'));
