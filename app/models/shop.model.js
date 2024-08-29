module.exports = (sequelize, Sequelize) => {
  const Shop = sequelize.define("shop", {
    name: {
      type: Sequelize.STRING,
    },
    accountId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  Shop.associate = function (models) {
    Shop.belongsTo(models.account, {
      foreignKey: "accountId",
      as: "account",
    });

    Shop.hasMany(models.product, {
      foreignKey: "shopId",
      as: "products",
    });
  };

  return Shop;
};
