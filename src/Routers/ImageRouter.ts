import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { S3 } from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 } from 'uuid';
import path from 'path';
import Token from '../middleware/Token';
import { ImageCtl } from '../Controllers/ImageCtl';

declare global {
    namespace Express {
        namespace Multer {
            interface File {
				key: string;
			}
		}
	}
}

type ErrorCatch = {
	message: string;
}

export class ImageRouter extends ImageCtl {
	ImageRouter: express.Router;
	upload: multer.Multer;
	s3conn: S3;

	constructor() {
		super();
		this.ImageRouter = express.Router();

		this.s3conn = new S3({
			accessKeyId: process.env.ACCESS_KEY_ID,
			secretAccessKey: process.env.SECRET_ACCESS_KEY,
			region: process.env.REGION
		});

		this.upload = multer({
			limits: { fileSize: Number(process.env.LIMIT_FILE_SIZE) },
			storage: multerS3({
				s3: this.s3conn,
				bucket: String(process.env.BUCKET),
				acl: process.env.BUCKET_ACL,
				key: (req, file, callback) => {
					if (file.mimetype == 'image/jpeg')
						callback(null, v4() + path.extname(file.originalname));
					else
						callback({ message: "Type file error!" });
				}
			})
		});
	}

	uploadRouter(): void {
		this.ImageRouter.post("/file/upload", Token.checkToken,
			this.upload.single("image"),
			async (req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					/* insert database */
					const img = await this.insertImage(
						Number(req.payload.id),
						String(req.file?.key)
					);

					res.status(200).send(req.file);

				} catch (e: any) { /* exception */
					return res.status(403).send({ message: e.message });
				}
			});
	}

	listImagesRouter(): void {
		this.ImageRouter.get("/file/list/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /file/delete/:idUser'),
			async (req: Request, res, Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					const img = await this.listImages({ id_user: Number(req.params.idUser) });
					res.status(200).send(img);

				} catch (e: any) {
					res.status(406).send({ message: e.message });
				}
			});
	}

	deleteRouter(): void {
		this.ImageRouter.get("/file/delete/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /file/delete/:idUser'),
			async (req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					const img = await this.listImages({ id_user: Number(req.params.idUser) });

					/* config aws S3 */
					await this.s3conn.deleteObjects({
						Bucket: String(process.env.BUCKET),
						Delete: {
							Objects: img.map(keys => {
								return { Key: String(keys.key_image) };
							}),
							Quiet: false
						}
					}, async (err, data) => {
						if (err) // an error occurred
							return res.status(406).send({ message: "Denied by aws!" });

						// successful response
						const affected = await this.deleteImages({ id_user: Number(req.params.idUser) });

						res.status(200).send({ affected, aws: data });
					});

				} catch (e: any) { /* exception */
					return res.status(406).send({ message: e.message });
				}
			});
	}
}