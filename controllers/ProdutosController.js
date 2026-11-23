
import Produto from "../models/Produto.js";

const listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.render("produtos", { produtos });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao listar produtos.");
    }
};

const salvar = async (req, res) => {
    try {
        const { referencia, descricao, preco, estoque } = req.body;

        if (
            !referencia ||
            !descricao ||
            preco === "" ||
            estoque === ""
        ) {
            req.flash("error", "Preencha todos os campos.");
            return res.redirect("/produtos");
        }

        if (
            !Number.isFinite(Number(preco)) ||
            Number(preco) < 0 ||
            !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0
        ) {
            req.flash("error", "Preço ou estoque inválido.");
            return res.redirect("/produtos");
        }

        await Produto.create({
            referencia,
            descricao,
            preco,
            estoque,
        });

        req.flash("success", "Produto cadastrado com sucesso!");
        res.redirect("/produtos");
    } catch (error) {
        console.error(error);

        if (error.name === "SequelizeUniqueConstraintError") {
            req.flash("error", "Referência já cadastrada.");
            return res.redirect("/produtos");
        }

        res.status(500).send("Erro ao cadastrar produto.");
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
        console.error(error);
        res.status(500).send("Erro ao excluir produto.");
    }
};

export default { listar, salvar, excluir };
