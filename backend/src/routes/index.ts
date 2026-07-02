import Router from 'express';

const router = Router();

// Definir una ruta en el objeto router
router.get('/status', (req, res) => {
  res.send('Servidor en funcionamiento');
});

export default router;