import express, { Application} from 'express';
import routes from './routes';

// Inicializar la aplicación Express
const app: Application = express();

// Middlewares globales
app.use(express.json());

// Ejemplo de ruta para verificar el estado del servidor
app.use('/api', routes);

export default app;