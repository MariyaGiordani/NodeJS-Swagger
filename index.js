import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import SwaggerUI from 'swagger-ui-express';
import SwaggerJsDoc from 'swagger-jsdoc';
import { router } from './routes/books.js';

const PORT = process.env.PORT || 3080;

const adapter = new JSONFile('db.json');
const defaultData = { books: [] };
const db = new Low(adapter, defaultData);

db.write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:3080",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = SwaggerJsDoc(options);

const app = express();

app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/books", router);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));