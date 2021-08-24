import { Application } from './app';
import { ConnectDB } from './Controllers/ConnectDB'

new ConnectDB().create();
new Application().serverOn(parseInt(process.env.PORT || '8080'));