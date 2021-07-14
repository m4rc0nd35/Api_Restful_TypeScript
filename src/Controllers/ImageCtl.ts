import { getConnectionManager } from "typeorm";
import { Image } from "../entity/Image";

interface IImage {
	id?: number;
	id_user?: number;
	key_image?: string;
}

export class ImageCtl {

	insertImage(id_user: number, file_name: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let imageRegisterRipository = connection.getRepository(Image);

			/* write data user */
			imageRegisterRipository.insert({
				id_user:id_user,
				key_image: file_name
			}).then(result => {
				resolve(true);
			}).catch(error => {
				reject(error.detail);
			});
		})
	}
	
	listImages(idUser: IImage): Promise<IImage[]> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let imageListRipository = connection.getRepository(Image);

			/* get all users */
			imageListRipository.find(idUser).then(result => {
				if (result)
					resolve(result);
				else
					reject("Not data");
			}).catch(error => {
				reject("Not data");
			});
		});
	}
	
	deleteImages(iobj: IImage): Promise<number> {
		return new Promise((resolve, reject) => {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let userRepository = connection.getRepository(Image);

			/* delete data user by id */
			userRepository.delete(iobj).then(result => {
				resolve(Number(result.affected));
			}).catch(error => {
				reject(error.detail);
			});
		});
	}
}