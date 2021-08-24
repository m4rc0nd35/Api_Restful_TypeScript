/* 
* Created 2021-05-13 
* By M4rc0nd35 
*/
import http from 'http';
import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { UserRoutes } from './Routers/User';
import { headerConfig } from './middleware/headers';
import { ImageRouter } from './Services/ImageRouter';

export class Application {
	app: express.Express;
	server: http.Server;
	image: ImageRouter;
	user: UserRoutes;

	constructor() {
		// Objects init
		this.app = express();
		this.server = http.createServer(this.app);
		this.user = new UserRoutes();
		this.image = new ImageRouter();

		// Methods init
		this.header();
		this.app.use(headerConfig);
		this.routes();
		this.middlewares();		

		// Routers init
		this.user.authUserRoute();
		this.user.readUserRoute();
		this.user.createUserRoute();
		this.user.updateUserRoute();
		this.user.deleteUserRoute();
		this.image.uploadRouter();
		this.image.deleteRouter();
		this.image.listImagesRouter();
	}

	header(): void {
		this.app.use(express.json());
	}

	middlewares(): void {
		this.app.use(errorHandler);
		this.app.use(notFoundHandler);
	}

	routes(): void {
		this.app.use('/', this.user.userRouter);
		this.app.use('/', this.image.ImageRouter);
	}

	serverOn(port: number) {
		this.server.listen(port, '0.0.0.0', () => {
			console.log(`Server listening on port ${port}`);
		});
	}
}
