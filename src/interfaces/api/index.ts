import { ProductsController } from '../controllers/products';
import { ProductsImagesController } from '../controllers/productsImages';
import { CustomersController } from '../controllers/customers';
import { OrdersController } from '../controllers/orders';
import { PaymentsController	 } from '../controllers/payments';
import { OrdersItensController } from '../controllers/ordersItens';

import { DbConnection } from '../../domain/interfaces/dbconnection';
import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';

import { Global } from '../adapters';
import { swaggerSpec } from '../../infrastructure/swagger/swagger';
import path from 'path';

export class FastfoodApp {
	private _dbconnection: DbConnection;
	private _app = express();

	constructor(dbconnection: DbConnection) {
		this._dbconnection = dbconnection;
		this._app = express();
	}

	start() {
		this._app.use(bodyParser.json());
		this._app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
			res.setHeader('Connection', 'keep-alive');
    		res.setHeader('Keep-Alive', 'timeout=30');
			if (err instanceof SyntaxError && err.message.includes('JSON')) {
				const errorGlobal: any = Global.error(`O body não esta em formato JSON, verifique e tente novamente.`, 400);
				return res.status(errorGlobal.statusCode || 404).send(errorGlobal);
			} else {
			next();
			}
		});
		  
		const port = process.env.PORT || 8080;

		this._app.get('/swagger.json', (req: Request, res: Response) => {
			res.setHeader('Content-Type', 'application/json');
			res.send(swaggerSpec);
		});

		const swaggerUi = require('swagger-ui-express');
		this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

		this.routes();
		const server = this._app.listen(port, () => {
			console.log(`Fiap app listening on port ${port}`);
			if(process.env.CI){
				process.exit(0)
			}
		});
		server.keepAliveTimeout = 30 * 1000;
		server.headersTimeout = 35 * 1000;
	}

	routes() {
		this.routesApp();
		this.routesProducts();
		this.routesProductsImages();
		this.routesCustomers();
		this.routesOrders();
		this.routesPayment();
	}

	routesApp(){

		this._app.get('/', async (req: Request, res: Response) => {
			const filePath = path.join(path.resolve(__dirname, '../../'), 'SimulationPage.html');
			res.sendFile(filePath);
		});

	}
	routesProducts(){

		/**
		* @swagger
		* /products:
		*   get:
		*     summary: Retorna a listagem de produtos cadastrados
		*     tags:
 		*       - Products
		*     parameters:
		*       - name: category
		*         in: query
		*         description: categoria do produto (opcional)
  		*         required: false
  		*         schema:
  		*           type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: array
		*                   items:
		*                     type: object
		*                     properties:
		*                       _id:
		*                         type: string
		*                       _name:
		*                         type: string
		*                       _price:
		*                         type: number
		*                       _category:
		*                         type: string
		*                       _description:
		*                         type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/products', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { category } = req.query;
			const products = await ProductsController.getProducts(
				category,
				this._dbconnection
			);

			res.status(products.statusCode || 404).send(products);
		});

		/**
		* @swagger
		* /products/:id:
		*   get:
		*     summary: Retorna um produto cadastrados
		*     tags:
 		*       - Products
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _price:
		*                       type: number
		*                     _category:
		*                       type: string
		*                     _description:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/products/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products = await ProductsController.getProductsById(
				id,
				this._dbconnection
			);
			res.status(products.statusCode || 404).send(products);
		});

		/**
		* @swagger
		* /products:
		*   post:
		*     summary: Cadastra um novo produto
		*     tags:
 		*       - Products
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               price:
		*                 type: number
		*               category:
		*                 type: string
		*               description:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _price:
		*                       type: number
		*                     _category:
		*                       type: string
		*                       enum: [ACCOMPANIMENT, DESSERT, DRINK, SNACK]
		*                     _description:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post('/products', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { name, price, category, description } = req.body;

			const products = await ProductsController.setProduct(
				name,
				price,
				category,
				description,
				this._dbconnection
			);
			res.status(products.statusCode || 404).send(products);
		});

		/**
		* @swagger
		* /products/:id:
		*   put:
		*     summary: Atualiza um produto especifico
		*     tags:
 		*       - Products
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               price:
		*                 type: number
		*               category:
		*                 type: string
		*               description:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _price:
		*                       type: number
		*                     _category:
		*                       type: string
		*                       enum: [ACCOMPANIMENT, DESSERT, DRINK, SNACK]
		*                     _description:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.put('/products/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;
			const { name, price, category, description } = req.body;

			const products = await ProductsController.updateProduct(
				id,
				name,
				price,
				category,
				description,
				this._dbconnection
			);
			res.status(products.statusCode || 404).send(products);
		});

		/**
		* @swagger
		* /products/:id:
		*   delete:
		*     summary: Remove um produto especifico
		*     tags:
 		*       - Products
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.delete('/products/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products = await ProductsController.removeProductsById(
				id,
				this._dbconnection
			);
			res.status(products.statusCode || 404).send(products);
		});

	}

	routesProductsImages(){

		/**
		* @swagger
		* /products/:id/images:
		*   get:
		*     summary: Retorna as imagens de um produto cadastrado
		*     tags:
 		*       - ProductsImages
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado as imagesns
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: array
		*                   items:
		*                     type: object
		*                     properties:
		*                       _id:
		*                         type: string
		*                       _productId:
		*                         type: string
		*                       _name:
		*                         type: string
		*                       _size:
		*                         type: number
		*                       _type:
		*                         type: string
		*                       _base64:
		*                         type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/products/:id/images', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products =
				await ProductsImagesController.getProductsImagesByProductId(
					{
						productId: id,
					},
					this._dbconnection
				);
			res.send(products);
		});

		/**
		* @swagger
		* /products/:id/images:
		*   post:
		*     summary: Cadastra uma imagem dentro de um produto
		*     tags:
 		*       - ProductsImages
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser cadastrado a imagem
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               size:
		*                 type: number
		*               type:
		*                 type: string
		*               base64:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _price:
		*                       type: number
		*                     _category:
		*                       type: string
		*                       enum: [ACCOMPANIMENT, DESSERT, DRINK, SNACK]
		*                     _description:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post(
			'/products/:id/images',
			async (req: Request, res: Response) => {
				res.setHeader('Content-type', 'application/json');
				const { id } = req.params;
				const { name, size, type, base64 } = req.body;

				const products = await ProductsImagesController.setProductImage(
					id,
					name,
					size,
					type,
					base64,
					this._dbconnection
				);
				res.send(products);
			}
		);

		/**
		* @swagger
		* /products/:id/images/:imageId:
		*   get:
		*     summary: Retorna uma imagen especifica de um produto cadastrado
		*     tags:
 		*       - ProductsImages
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado a imagem
		*       - in: path
		*         name: imageId
		*         required: true
		*         schema:
		*           type: string
		*         description: id da imagem a ser localizada dentro do produto
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: array
		*                   items:
		*                     type: object
		*                     properties:
		*                       _id:
		*                         type: string
		*                       _productId:
		*                         type: string
		*                       _name:
		*                         type: string
		*                       _size:
		*                         type: number
		*                       _type:
		*                         type: string
		*                       _base64:
		*                         type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get(
			'/products/:id/images/:imageId',
			async (req: Request, res: Response) => {
				res.setHeader('Content-type', 'application/json');
				const { id, imageId } = req.params;

				const products =
					await ProductsImagesController.getProductsImagesByProductId(
						{
							_id: imageId,
							productId: id,
						},
						this._dbconnection
					);
				res.send(products);
			}
		);

		/**
		* @swagger
		* /products/:id/images/:imageId:
		*   put:
		*     summary: Atualiza uma imagem dentro de um produto
		*     tags:
 		*       - ProductsImages
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado a imagem
		*       - in: path
		*         name: imageId
		*         required: true
		*         schema:
		*           type: string
		*         description: id da imagem a ser atualizada dentro do produto
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               size:
		*                 type: number
		*               type:
		*                 type: string
		*               base64:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _price:
		*                       type: number
		*                     _category:
		*                       type: string
		*                       enum: [ACCOMPANIMENT, DESSERT, DRINK, SNACK]
		*                     _description:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.put(
			'/products/:id/images/:imageId',
			async (req: Request, res: Response) => {
				res.setHeader('Content-type', 'application/json');
				const { id, imageId } = req.params;
				const { name, size, type, base64 } = req.body;

				const products =
					await ProductsImagesController.updateProductImage(
						imageId,
						id,
						name,
						size,
						type,
						base64,
						this._dbconnection
					);
				res.send(products);
			}
		);

		/**
		* @swagger
		* /products/:id/images/:imageId:
		*   delete:
		*     summary: Remove uma imagem dentro de produto especifico
		*     tags:
 		*       - ProductsImages
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do produto a ser localizado
		*       - in: path
		*         name: imageId
		*         required: true
		*         schema:
		*           type: string
		*         description: id da imagem a ser removida dentro do produto
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.delete(
			'/products/:id/images/:imageId',
			async (req: Request, res: Response) => {
				res.setHeader('Content-type', 'application/json');
				const { id, imageId } = req.params;

				const products =
					await ProductsImagesController.removeProductsImagesById(
						imageId,
						this._dbconnection
					);
				res.send(products);
			}
		);
	}

	routesCustomers(){
		/**
		* @swagger
		* /customers:
		*   get:
		*     summary: Retorna a listagem de clientes cadastrados
		*     tags:
 		*       - Customers
		*     parameters:
		*       - name: cpf
		*         in: query
		*         description: cpf (opcional)
  		*         required: false
  		*         schema:
  		*           type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: array
		*                   items:
		*                     type: object
		*                     properties:
		*                       _id:
		*                         type: string
		*                       _name:
		*                         type: string
		*                       _mail:
		*                         type: string
		*                       _cpf:
		*                         type: number
		*                       _birthdate:
		*                         type: date
		*                       _subscription:
		*                         type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/customers', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { cpf } = req.query;
			const products = await CustomersController.getCustomers(
				cpf,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /customers/:id:
		*   get:
		*     summary: Retorna um cliente cadastrados
		*     tags:
 		*       - Customers
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do cliente a ser localizado
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _mail:
		*                       type: string
		*                     _cpf:
		*                       type: number
		*                     _birthdate:
		*                       type: date
		*                     _subscription:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/customers/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products = await CustomersController.getCustomersById(
				id,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /customers:
		*   post:
		*     summary: Cadastra um novo cliente
		*     tags:
 		*       - Customers
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               mail:
		*                 type: string
		*               cpf:
		*                 type: number
		*               birthdate:
		*                 type: date
		*               subscription:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _mail:
		*                       type: string
		*                     _cpf:
		*                       type: number
		*                     _birthdate:
		*                       type: date
		*                     _subscription:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post('/customers', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { name, mail, cpf, birthdate, subscription } = req.body;

			const products = await CustomersController.setCustomer(
				name,
				mail,
				cpf,
				birthdate,
				subscription,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /customers/:id:
		*   put:
		*     summary: Atualiza um cliente especifico
		*     tags:
 		*       - Customers
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do cliente a ser atualizado
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               mail:
		*                 type: string
		*               cpf:
		*                 type: number
		*               birthdate:
		*                 type: date
		*               subscription:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _name:
		*                       type: string
		*                     _mail:
		*                       type: string
		*                     _cpf:
		*                       type: number
		*                     _birthdate:
		*                       type: date
		*                     _subscription:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.put('/customers/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;
			const { name, mail, cpf, birthdate, subscription } = req.body;

			const products = await CustomersController.updateCustomer(
				id,
				name,
				mail,
				cpf,
				birthdate,
				subscription,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /customers/:id:
		*   delete:
		*     summary: Remove um cliente especifico
		*     tags:
 		*       - Customers
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do cliente a ser removido
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.delete('/customers/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products = await CustomersController.removeCustomersById(
				id,
				this._dbconnection
			);
			res.send(products);
		});
	}

	routesOrders(){

		/**
		* @swagger
		* /orders:
		*   post:
		*     summary: Cadastra um novo pedido
		*     tags:
 		*       - Orders
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               customerId:
		*                 type: string
		*               orderItens:
		*                 type: array
		*                 items:
		*                   type: object
		*                   properties:
		*                     productId:
		*                       type: string
		*                     quantity:
		*                       type: number
		*                     obs:
		*                       type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _protocol:
		*                       type: number
		*                     _customerId:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _payment:
		*                       type: string
		*                     _itens:
		*                        type: array
		*                        items:
		*                          type: object
		*                          properties:
		*                            _id:
		*                              type: string
		*                            _orderId:
		*                              type: string
		*                            _productId:
		*                              type: string
		*                            _price:
		*                              type: number
		*                            _quantity:
		*                              type: number
		*                            _obs:
		*                              type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post('/orders', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { customerId, orderItens, status } = req.body;

			const order = await OrdersController.setOrder(
				customerId,
				orderItens,
				this._dbconnection
			);
			res.send(order);
		});

		/**
		* @swagger
		* /orders/open:
		*   get:
		*     summary: Retorna os pedidos com suas descrições, ordenados por recebimento e status, podendo ser alterado via parametro se ordena por recebimento ou status individualmente também.
		*     tags:
 		*       - Orders
		*     parameters:
		*       - in: query
		*         name: column
		*         required: false
		*         schema:
		*           type: string
		*           enum:
 		*             - status
 		*             - created_at
		*         description: coluna a ser ordenada
		*       - in: query
		*         name: order
		*         required: false
		*         schema:
		*           type: string
		*           enum:
 		*             - asc
 		*             - desc
		*         description: tipo de ordenação (asc ou desk)
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: array
		*                   items:
		*                     type: object
		*                     properties:
		*                       _id:
		*                         type: string
		*                       _protocol:
		*                         type: number
		*                       _customerId:
		*                         type: string
		*                       _status:
		*                         type: string
		*                       _payment:
		*                         type: string
		*                       _itens:
		*                          type: array
		*                          items:
		*                            type: object
		*                            properties:
		*                              _id:
		*                                type: string
		*                              _orderId:
		*                                type: number
		*                              _productId:
		*                                type: string
		*                              _price:
		*                                type: number
		*                              _quantity:
		*                                type: number
		*                              _obs:
		*                                type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/orders/open', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { status } = req.params;

			const products = await OrdersController.getOrdersByOpen(
				status,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /orders/status/:status:
		*   get:
		*     summary: Retorna os pedidos por status
		*     tags:
 		*       - Orders
		*     parameters:
		*       - in: path
		*         name: status
		*         required: true
		*         schema:
		*           type: string
		*         description: status do pedido a ser listado
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: array
		*                   items:
		*                     type: object
		*                     properties:
		*                       _id:
		*                         type: string
		*                       _protocol:
		*                         type: number
		*                       _customerId:
		*                         type: string
		*                       _status:
		*                         type: string
		*                       _payment:
		*                         type: string
		*                       _itens:
		*                          type: array
		*                          items:
		*                            type: object
		*                            properties:
		*                              _id:
		*                                type: string
		*                              _orderId:
		*                                type: number
		*                              _productId:
		*                                type: string
		*                              _price:
		*                                type: number
		*                              _quantity:
		*                                type: number
		*                              _obs:
		*                                type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/orders/status/:status', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { status } = req.params;

			const products = await OrdersController.getOrdersByStatus(
				status,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /orders/:id:
		*   put:
		*     summary: Atualiza o status de um pedido
		*     tags:
 		*       - Orders
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do pedido a ser atualizado
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               status:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _protocol:
		*                       type: number
		*                     _customerId:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _payment:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.put('/orders/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;
			const { status, payment } = req.body;

			const products = await OrdersController.updateOrder(
				id,
				null,
				status,
				payment || null,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /orders/:id/payment:
		*   put:
		*     summary: Atualiza o pagamento de um pedido
		*     tags:
 		*       - Orders
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do pedido a ser atualizado
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               payment:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _protocol:
		*                       type: number
		*                     _customerId:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _payment:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.put('/orders/:id/payment', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;
			const { payment } = req.body;

			const products = await OrdersController.updatePaymentOrder(
				id,
				payment,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /orders/:id:
		*   get:
		*     summary: Retorna os pedidos por id
		*     tags:
 		*       - Orders
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do pedido a ser listado
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _protocol:
		*                       type: number
		*                     _customerId:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _itens:
		*                        type: array
		*                        items:
		*                          type: object
		*                          properties:
		*                            _id:
		*                              type: string
		*                            _orderId:
		*                              type: number
		*                            _productId:
		*                              type: string
		*                            _price:
		*                              type: number
		*                            _quantity:
		*                              type: number
		*                            _obs:
		*                              type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.get('/orders/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products = await OrdersController.getOrdersById(
				id,
				this._dbconnection
			);
			res.send(products);
		});

		/**
		* @swagger
		* /orders/:id:
		*   delete:
		*     summary: Remove um pedido especifico
		*     tags:
 		*       - Orders
		*     parameters:
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: id do pedido a ser removido
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.delete('/orders/:id', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { id } = req.params;

			const products = await OrdersController.removeOrdersById(
				id,
				this._dbconnection
			);
			res.send(products);
		});
	}
	
	routesPayment(){
		/**
		* @swagger
		* /payment:
		*   post:
		*     summary: Efetua pedido de pagamento para o broker
		*     tags:
 		*       - Payment
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               orderId:
		*                 type: string
		*               broker:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _orderId:
		*                       type: number
		*                     _broker:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _description:
		*                       type: string
		*                     _webhook:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post('/payment', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { broker, orderId, description } = req.body;
			const payment = await PaymentsController.setPayment(
				orderId,
				broker,
				'WAITING',
				description,
				`${req.protocol}://${req.get('host')}`, 
				this._dbconnection
			);
			res.send(payment);
		});

		/**
		* @swagger
		* /payment/webhook/fake/:paymentId:
		*   post:
		*     summary: Recebe evento de status de pagamento de um pedido vindo de um fake payment
		*     tags:
 		*       - Payment
		*     parameters:
		*       - in: path
		*         name: paymentId
		*         required: true
		*         schema:
		*           type: string
		*         description: id do pagamento
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               orderId:
		*                 type: string
		*               broker:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _orderId:
		*                       type: number
		*                     _broker:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _description:
		*                       type: string
		*                     _webhook:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post('/payment/webhook/fake/:paymentId', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { paymentId } = req.params;
			const { status,description } = req.body;
			const payment = await PaymentsController.updatePayment(
				paymentId,
				null,
				null,
				status,
				description,
				this._dbconnection
			);
			res.send(payment);
		});


		/**
		* @swagger
		* /payment/webhook/mercadopago/:paymentId:
		*   post:
		*     summary: Recebe evento de status de pagamento de um pedido vindo do mercadopago
		*     tags:
 		*       - Payment
		*     parameters:
		*       - in: path
		*         name: paymentId
		*         required: true
		*         schema:
		*           type: string
		*         description: id do pagamento
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               orderId:
		*                 type: string
		*               broker:
		*                 type: string
		*     responses:
		*       200:
		*         description: Successful response
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 data:
		*                   type: object
		*                   properties:
		*                     _id:
		*                       type: string
		*                     _orderId:
		*                       type: number
		*                     _broker:
		*                       type: string
		*                     _status:
		*                       type: string
		*                     _description:
		*                       type: string
		*                     _webhook:
		*                       type: string
		*       404:
		*         description: Products not found
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 status:
		*                   type: string
		*                 message:
		*                   type: string
		*/
		this._app.post('/payment/webhook/mercadopago/:paymentId', async (req: Request, res: Response) => {
			res.setHeader('Content-type', 'application/json');
			const { paymentId } = req.params;
			const { action,id } = req.body;
			const payment = await PaymentsController.updatePayment(
				paymentId,
				null,
				null,
				action,
				id,
				this._dbconnection
			);
			res.send(payment);
		});
	}
}
