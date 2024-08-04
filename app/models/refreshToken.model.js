module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return RefreshToken;
};
