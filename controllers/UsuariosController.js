import { Op } from "sequelize";
import Usuario from "../models/Usuario.js";
import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// Gera o hash da senha (a senha nunca é salva em texto puro no banco)
const gerarHash = async (senha) => {
    const salt = randomBytes(16).toString("hex");
    const hash = await scryptAsync(senha, salt, 64);
    return `${salt}:${hash.toString("hex")}`;
};

const listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ["id", "nome", "email", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.render("usuarios/usuarios", { usuarios });
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).send("Erro ao listar usuários.");
    }
};

const novo = (req, res) => {
    res.render("usuarios/new");
};

const salvar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            req.flash("error", "Preencha todos os campos.");
            return res.redirect("/usuarios/novo");
        }

        if (senha.length < 8) {
            req.flash("error", "A senha deve ter pelo menos 8 caracteres.");
            return res.redirect("/usuarios/novo");
        }

        const existente = await Usuario.findOne({ where: { email } });
        if (existente) {
            req.flash("error", "E-mail já cadastrado.");
            return res.redirect("/usuarios/novo");
        }

        await Usuario.create({ nome, email, senha: await gerarHash(senha) });
        req.flash("success", "Usuário cadastrado com sucesso!");
        res.redirect("/usuarios");
    } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        res.status(500).send("Erro ao cadastrar usuário.");
    }
};

// Recupera o usuário pelo id e exibe o formulário de edição (sem enviar a senha para a tela)
const editar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: ["id", "nome", "email"],
        });

        if (!usuario) {
            req.flash("error", "Usuário não encontrado.");
            return res.redirect("/usuarios");
        }

        res.render("usuarios/edit", { usuario });
    } catch (error) {
        console.error("Erro ao recuperar usuário:", error);
        res.status(500).send("Erro ao recuperar usuário.");
    }
};

const atualizar = async (req, res) => {
    try {
        const { id, nome, email, senha } = req.body;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            req.flash("error", "Usuário não encontrado.");
            return res.redirect("/usuarios");
        }

        if (!nome || !email) {
            req.flash("error", "Preencha nome e e-mail.");
            return res.redirect(`/usuarios/${id}/edit`);
        }

        // Procura outro usuário (id diferente) com o mesmo e-mail
        const existente = await Usuario.findOne({
            where: { email, id: { [Op.ne]: id } },
        });
        if (existente) {
            req.flash("error", "E-mail já cadastrado.");
            return res.redirect(`/usuarios/${id}/edit`);
        }

        const dados = { nome, email };

        // A senha só é alterada se o campo for preenchido
        if (senha) {
            if (senha.length < 8) {
                req.flash("error", "A senha deve ter pelo menos 8 caracteres.");
                return res.redirect(`/usuarios/${id}/edit`);
            }
            dados.senha = await gerarHash(senha);
        }

        await usuario.update(dados);
        req.flash("success", "Usuário atualizado com sucesso!");
        res.redirect("/usuarios");
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).send("Erro ao atualizar usuário.");
    }
};

const excluir = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            req.flash("error", "Usuário não encontrado.");
            return res.redirect("/usuarios");
        }

        await usuario.destroy();
        req.flash("success", "Usuário excluído com sucesso!");
        res.redirect("/usuarios");
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).send("Erro ao excluir usuário.");
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
