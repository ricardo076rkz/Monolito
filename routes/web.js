import express from 'express';
const router = express.Router();
import ContatosController from '../controllers/ContatosController.js';
import UsuariosController from "../controllers/UsuariosController.js";
import ProdutosController from "../controllers/ProdutosController.js";

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contatos", ContatosController.listar);
router.get("/contatos/novo", ContatosController.novo);
router.post("/contatos/salvar", ContatosController.salvar);
router.get("/contatos/:id/edit", ContatosController.editar);
router.post("/contatos/atualizar", ContatosController.atualizar);
router.post("/contatos/:id/excluir", ContatosController.excluir);

router.get("/usuarios", UsuariosController.listar);
router.post("/usuarios/salvar", UsuariosController.salvar);
router.post("/usuarios/:id/excluir", UsuariosController.excluir);
router.get("/produtos", ProdutosController.listar);
router.post("/produtos/salvar", ProdutosController.salvar);
router.post("/produtos/:id/excluir", ProdutosController.excluir);

export default router;