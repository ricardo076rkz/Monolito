import express from 'express';
import ContatosController from '../controllers/api/ContatosController.js';
import ProdutosController from '../controllers/api/ProdutosController.js';

const router = express.Router();

// Rotas de contatos
router.get('/contatos', ContatosController.listar);
router.get('/contatos/:id', ContatosController.buscar);
router.post('/contatos', ContatosController.salvar);
router.put('/contatos/:id', ContatosController.atualizar);
router.delete('/contatos/:id', ContatosController.excluir);

// Rotas de produtos
router.get('/produtos', ProdutosController.listar);
router.get('/produtos/:id', ProdutosController.buscar);
router.post('/produtos', ProdutosController.salvar);
router.put('/produtos/:id', ProdutosController.atualizar);
router.delete('/produtos/:id', ProdutosController.excluir);

export default router;
