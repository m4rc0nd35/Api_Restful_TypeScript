/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
import http from 'http';
import express from 'express';
import { createConnection } from "typeorm";
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { UserRoutes } from './Routers/User';
import { headerConfig } from './middleware/headers'

class AppMain extends UserRoutes {
	app: express.Express;
	server: http.Server;

	constructor() {
		super();
		// Objects init
		this.app = express();
		this.server = http.createServer(this.app);

		// Methods init
		this.header();
		this.routes();
		this.middlewares();
		
		/* new connection database */
		createConnection().then(cnn => {
			console.log('SQL:', cnn.options);
		}).catch(console.log)

		// Routers init
		this.authRouter();
		this.listRouter();
		this.registerRouter();
		this.updateRouter();
		this.deleteRouter();
	}

	header(): void {
		this.app.use(headerConfig);
		this.app.use(express.json());
	}

	middlewares(): void {
		this.app.use(errorHandler);
		this.app.use(notFoundHandler);
	}

	routes(): void {
		this.app.use('/', this.userRouter);
	}

	serverOn(port: number) {
		this.server.listen(port, '0.0.0.0', () => {
			console.log(`Server listening on port ${port}`);
		});
	}
}

const instance = new AppMain();
instance.serverOn(parseInt(process.env.PORT || '8080'));