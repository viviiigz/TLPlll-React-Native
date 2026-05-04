import express from 'express';

const router = express.Router();

import * as catalogoController from '../controllers/catalogo.controller.js';

router.get('/maquillajes', catalogoController.getAllMaquillajes);
router.get('/maquillajes/:id', catalogoController.getMaquillajeById);
router.post('/maquillajes', catalogoController.createMaquillaje);
router.put('/maquillajes/:id', catalogoController.updateMaquillaje);
router.delete('/maquillajes/:id', catalogoController.deleteMaquillaje);

export default router;