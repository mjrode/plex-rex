module.exports = (sequelize, DataTypes) => {
  const PlexLibrary = sequelize.define(
    'PlexLibrary',
    {
      title: {type: DataTypes.STRING, unique: true},
      type: DataTypes.STRING,
      views: DataTypes.INTEGER,
      rating_key: DataTypes.INTEGER,
      metadata_path: DataTypes.STRING,
      summary: DataTypes.TEXT,
      rating: DataTypes.FLOAT,
      year: DataTypes.INTEGER,
      genre: DataTypes.STRING,
    },
    {},
  );
  // eslint-disable-next-line no-unused-vars
  PlexLibrary.associate = function(models) {
    PlexLibrary.belongsTo(models.User);
  };
  return PlexLibrary;
};
