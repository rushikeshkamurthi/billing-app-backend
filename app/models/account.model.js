module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("accounts", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Account;
};
