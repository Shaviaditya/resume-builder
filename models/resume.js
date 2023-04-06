const { DataTypes } = require('sequelize');
const {sequelize} = require("."); // your sequelize instance
const User = require('./user'); // assuming you have a User model

const Resume = sequelize.define('resumes', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  education: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  experience: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  timestamps: true,
});

Resume.belongsTo(User);
User.hasMany(Resume);

module.exports = Resume;
