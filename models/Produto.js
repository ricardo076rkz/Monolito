import { DataTypes } from "sequelize";
import { sequelize } from "../core/sequelize.js";

const Produto = sequelize.define("produto", {
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default Produto;
