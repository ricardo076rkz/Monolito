
import { Op } from 'sequelize';
import Produto from '../../models/Produto.js';

const validar = (dados) => {
    const referencia = String(dados.referencia ?? '').trim();
    const descricao = String(dados.descricao ?? '').trim();
    const preco = String(dados.preco ?? '').trim();
    const estoque = String(dados.estoque ?? '').trim();

    if (!referencia || !descricao || preco === '' || estoque === '') {
        return 'Preencha todos os campos.';
    }

    const precoNumero = Number(preco);
    const estoqueNumero = Number(estoque);

    if (
        !Number.isFinite(precoNumero) ||
        precoNumero < 0 ||
        !Number.isInteger(estoqueNumero) ||
        estoqueNumero < 0
    ) {
        return 'Preço ou estoque inválido.';
    }

    return null;
};

const listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.json(produtos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro ao listar produtos.'
        });
    }
};

const buscar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        return res.json(produto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro ao buscar produto.'
        });
    }
};

const salvar = async (req, res) => {
    try {
        const erro = validar(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const referencia = String(req.body.referencia).trim();

        const existente = await Produto.findOne({
            where: { referencia }
        });

        if (existente) {
            return res.status(409).json({
                erro: 'Referência já cadastrada.'
            });
        }

        const produto = await Produto.create({
            referencia,
            descricao: String(req.body.descricao).trim(),
            preco: Number(req.body.preco),
            estoque: Number(req.body.estoque)
        });

        return res.status(201).json(produto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro ao cadastrar produto.'
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        const erro = validar(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const referencia = String(req.body.referencia).trim();

        const existente = await Produto.findOne({
            where: {
                referencia,
                id: { [Op.ne]: produto.id }
            }
        });

        if (existente) {
            return res.status(409).json({
                erro: 'Referência já cadastrada.'
            });
        }

        await produto.update({
            referencia,
            descricao: String(req.body.descricao).trim(),
            preco: Number(req.body.preco),
            estoque: Number(req.body.estoque)
        });

        return res.json(produto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro ao atualizar produto.'
        });
    }
};

const excluir = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        await produto.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro ao excluir produto.'
        });
    }
};

export default {
    listar,
    buscar,
    salvar,
    atualizar,
    excluir
};
