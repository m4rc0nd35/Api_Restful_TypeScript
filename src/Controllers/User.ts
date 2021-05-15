/* 
* Create 2021-05-13 
* By M4rc0nd35 
*/
export class User {
	
	loginCtl(username: string, password: string): boolean {
		console.log('username', username);
		console.log('password', password);
		return true;
	}
	
	changePasswordCtl(id: number, newPassword: string): boolean {
		console.log('');
		
		return true;
	}
	
	forGotPasswordCtl(email: string): boolean{
		return true;
	}
}