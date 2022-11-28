import { Sequelize } from "sequelize";
// const config = require("./config.json");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost", //"host.docker.internal",
  username: "root",
  password: "",
  database: "test_a",
  // dialect: config.dialect,
  // host: config.host,
  // username: config.username,
  // password: config.password,
  // database: config.database,
});

export default sequelize;
