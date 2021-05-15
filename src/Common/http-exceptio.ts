/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
export default class HttpException extends Error {
	statusCode?: number;
	status?: number;
	message: string;
	error: string | null;
  
	constructor(statusCode: number, message: string, error?: string) {
	  super(message);
  
	  this.statusCode = statusCode;
	  this.message = message;
	  this.error = error || null;
	}
  }