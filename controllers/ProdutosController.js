import { Op } from "sequelize";
import Produto from "../models/Produto.js";

// Valida os dados do formulário. Retorna a mensagem de erro ou null se estiver tudo certo.
const validar = (dados) => {
    const { referencia, descricao, preco, estoque } = dados;

    if (!referencia || !descricao || preco === "" || estoque === "") {
        return "Preencha todos os campos.";
    }

    if (
        !Number.isFinite(Number(preco)) ||
        Number(preco) < 0 ||
        !Number.isInteger(Number(estoque)) ||
        Number(estoque) < 0
    ) {
        return "Preço ou estoque inválido.";
    }

    return null;
};

const listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({ order: [["createdAt", "DESC"]] });
        res.render("produtos/produtos", { produtos });
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).send("Erro ao listar produtos.");
    }
};

const novo = (req, res) => {
    res.render("produtos/new");
};

const salvar = async (req, res) => {
    try {
        const { referencia, descricao, preco, estoque } = req.body;

        const erro = validar(req.body);
        if (erro) {
            req.flash("error", erro);
            return res.redirect("/produtos/novo");
        }

        const existente = await Produto.findOne({ where: { referencia } });
        if (existente) {
            req.flash("error", "Referência já cadastrada.");
            return res.redirect("/produtos/novo");
        }

        await Produto.create({ referencia, descricao, preco, estoque });
        req.flash("success", "Produto cadastrado com sucesso!");
        res.redirect("/produtos");
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        res.status(500).send("Erro ao cadastrar produto.");
    }
};

// Recupera o produto pelo id e exibe o formulário de edição
const editar = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            req.flash("error", "Produto não encontrado.");
            return res.redirect("/produtos");
        }

        res.render("produtos/edit", { produto });
    } catch (error) {
        console.error("Erro ao recuperar produto:", error);
        res.status(500).send("Erro ao recuperar produto.");
    }
};

const atualizar = async (req, res) => {
    try {
        const { id, referencia, descricao, preco, estoque } = req.body;

        const produto = await Produto.findByPk(id);

        if (!produto) {
            req.flash("error", "Produto não encontrado.");
            return res.redirect("/produtos");
        }

        const erro = validar(req.body);
        if (erro) {
            req.flash("error", erro);
            return res.redirect(`/produtos/${id}/edit`);
        }

        // Procura outro produto (id diferente) com a mesma referência
        const existente = await Produto.findOne({
            where: { referencia, id: { [Op.ne]: id } },
        });
        if (existente) {
            req.flash("error", "Referência já cadastrada.");
            return res.redirect(`/produtos/${id}/edit`);
        }

        await produto.update({ referencia, descricao, preco, estoque });
        req.flash("success", "Produto atualizado com sucesso!");
        res.redirect("/produtos");
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).send("Erro ao atualizar produto.");
    }
};

const excluir = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);

        if (!produto) {
            req.flash("error", "Produto não encontrado.");
            return res.redirect("/produtos");
        }

        await produto.destroy();
        req.flash("success", "Produto excluído com sucesso!");
        res.redirect("/produtos");
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        res.status(500).send("Erro ao excluir produto.");
    }
};

export default {
    listar,
    novo,
    salvar,
    editar,
    atualizar,
    excluir
};
