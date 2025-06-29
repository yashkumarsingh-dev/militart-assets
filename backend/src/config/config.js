require("dotenv").config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./dev.sqlite3",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
