
import Usuario from "../models/Usuario.js";
import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ["id", "nome", "email", "createdAt"],
            order: [["createdAt", "DESC"]],
        });

        res.render("usuarios", { usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao listar usuários.");
    }
};

const salvar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            req.flash("error", "Preencha todos os campos.");
            return res.redirect("/usuarios");
        }

        const existente = await Usuario.findOne({
            where: { email },
        });

        if (existente) {
            req.flash("error", "E-mail já cadastrado.");
            return res.redirect("/usuarios");
        }

const salt = randomBytes(16).toString("hex");
const hash = await scryptAsync(senha, salt, 64);

await Usuario.create({
  nome,
  email,
  senha: `${salt}:${hash.toString("hex")}`,
});
        req.flash("success", "Usuário cadastrado com sucesso!");
        res.redirect("/usuarios");
} catch (error) {
    console.error("ERRO AO CADASTRAR USUÁRIO:");
    console.error(error);

    res.status(500).send(error.message);
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
        console.error(error);
        res.status(500).send("Erro ao excluir usuário.");
    }
};

export default { listar, salvar, excluir };
