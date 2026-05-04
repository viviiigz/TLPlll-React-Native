import express from 'express';
import cors from 'cors';
import routesCatalogo from './routes/catalogo.routes.js';

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routesCatalogo);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});