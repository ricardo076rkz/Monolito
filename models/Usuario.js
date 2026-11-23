import { DataTypes } from "sequelize";
import { sequelize } from "../core/sequelize.js";

const Usuario = sequelize.define("usuario", {
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
},
});

export default Usuario;
