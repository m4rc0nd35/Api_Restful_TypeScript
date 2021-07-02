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
			(req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);
						
					this.insertImage(req.payload.id, String(req.file.key))
						.then(resolve => {
							return res.status(200).send(req.file);
						}).catch(reject => {
							return res.status(401).json(reject);
						})
				} catch (e) { /* exception */
					return res.status(500).send({ message: e.message });
				}
			});
	}

	listImagesRouter(): void {
		this.ImageRouter.get("/file/list/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /file/delete/:idUser'),
			(req: Request, res, Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					this.listImages({ id_user: Number(req.params.idUser) }).then(result => {
						res.status(200).send(result);
					}).catch(error => {
						res.status(406).send({ message: error });
					});
				} catch (e) {
					res.status(500).send({ message: e.message });
				}
			});
	}

	deleteRouter(): void {
		this.ImageRouter.get("/file/delete/:idUser", Token.checkToken,
			param('idUser').isNumeric().withMessage('Need /file/delete/:idUser'),
			(req: Request, res: Response) => {
				try {
					/* validations input´s */
					const errors = validationResult(req);
					if (!errors.isEmpty())
						return res.status(400).json(errors);

					this.listImages({ id_user: Number(req.params.idUser) }).then(result => {
						/* config aws S3 */
						this.s3conn.deleteObjects({
							Bucket: String(process.env.BUCKET),
							Delete: {
								Objects: result.map(keys => {
									return { Key: String(keys.key_image) };
								}),
								Quiet: false
							}
						}, (err, data) => {
							if (err) // an error occurred
								return res.status(406).send({ message: "Denied by aws!" });
							else { // successful response
								this.deleteImages({ id_user: Number(req.params.idUser) }).then(affected => {
									return res.status(200).send({ affected: affected, aws: data });
								}).catch(error => {
									res.status(406).send({ message: error });
								})
							}
						});

					}).catch(error => {
						res.status(406).send({ message: error });
					});
				} catch (e) { /* exception */
					return res.status(500).send({ message: e.message });
				}
			});
	}
}