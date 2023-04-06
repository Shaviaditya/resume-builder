const { DataTypes } = require('sequelize');
const {sequelize} = require("."); // your sequelize instance
const bcrypt = require('bcrypt');
const User = sequelize.define('users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255], // added maximum length limit
    },
  },
}, {
  hooks: {
    // Before hook before creating new users
    beforeCreate: async (users) => {
      const salt = await bcrypt.genSalt();
      users.password = await bcrypt.hash(users.password, salt);
    },
  },
});

User.login = async function(username, email, password) {
  const users = await User.findOne({ where: { username } });
  if (users) {
    const auth = await bcrypt.compare(password, users.password);
    if (auth) {
      return users;
    }
    throw new Error('Incorrect password');
  }
  throw new Error('Incorrect Details');
};

// After hook after creating new users
User.afterCreate((users) => {
  console.log('The new users created is:', users.toJSON());
});

module.exports = User;
