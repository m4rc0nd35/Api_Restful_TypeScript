/* 
* Created 2021-05-13
* By M4rc0nd35 
*/
import { getConnectionManager } from "typeorm";
import { Image } from "../entity/Image";

interface IImage {
	id?: number;
	id_user?: number;
	key_image?: string;
}

export class ImageCtl {

	async insertImage(id_user: number, file_name: string): Promise<boolean> {
		// return new Promise((resolve, reject) => {
		try {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let imageRegisterRipository = connection.getRepository(Image);

			/* write data user */
			const img = await imageRegisterRipository.insert({
				id_user: id_user,
				key_image: file_name
			});

			if (!img)
				throw new Error(img);

			return true;

		} catch (error) {
			return false;
		}
	}

	async listImages(idUser: IImage): Promise<IImage[]> {
		try {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let imageListRipository = connection.getRepository(Image);

			/* get all users */
			const img = await imageListRipository.find(idUser);

			if (!img.length)
				throw new Error("Not data!");

			return img;

		} catch (e) {
			throw new Error((e as Error).message);
		}

	}

	async deleteImages(iobj: IImage): Promise<number> {
		try {
			const connection = getConnectionManager().get("default");
			/* Get repository */
			let userRepository = connection.getRepository(Image);

			/* delete data user by id */
			const img = await userRepository.delete(iobj);
			if (!img.affected)
				throw new Error("Not data!");
				
			return Number(img.affected);
		} catch (e) {
			throw new Error((e as Error).message);
		}
	}
}