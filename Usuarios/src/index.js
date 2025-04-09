import app from './app.js';
import {connectDB} from './db.js';

connectDB();
app.listen(5001)
console.log('server listening on port', 5001);