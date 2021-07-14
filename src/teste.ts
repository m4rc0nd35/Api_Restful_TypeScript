interface Aves {
	setLocalizacao(ts: string): void;
	setAltitude(t: number): void;
	renderizar(): void;
}

class Papagaio implements Aves {

	constructor() {
		console.log('OK');
	}

	setLocalizacao(ts: string): void {
		console.log(ts);
	}

	public setAltitude(): void {
		//Faz alguma coisa   
	}

	public renderizar() {
		//Faz alguma coisa
	}

	protected getName(): void {
		//
	}
}

class Base extends Papagaio {
	greet() {
		console.log("Hello, world!");
		this.setLocalizacao('OK PASSOU');
	}

}

class Derived extends Base {

	greet(name?: string) {
		if (name === undefined) {
			super.greet();
		} else {
			console.log(`Hello, ${name.toUpperCase()}`);
		}
		this.renderizar();
	}
}

const d = new Derived();
d.greet();
d.greet("reader");