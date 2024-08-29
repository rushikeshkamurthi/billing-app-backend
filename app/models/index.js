const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.account = require("../models/account.model.js")(sequelize, Sequelize);
db.shop = require("../models/shop.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);

// Associations
db.account.hasMany(db.user, { as: "users" });
db.user.belongsTo(db.account, { foreignKey: "accountId", as: "account" });

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.account.hasMany(db.shop, { as: "shops" });
db.shop.belongsTo(db.account, { foreignKey: "accountId", as: "account" });

db.shop.hasMany(db.product, { as: "products" });
db.product.belongsTo(db.shop, { foreignKey: "shopId", as: "shop" });

db.user.belongsToMany(db.role, { through: "user_roles" });
db.role.belongsToMany(db.user, { through: "user_roles" });

module.exports = db;
