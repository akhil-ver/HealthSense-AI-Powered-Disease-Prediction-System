import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
  },
  bloodType: {
    type: DataTypes.STRING,
  },
  height: {
    type: DataTypes.FLOAT,
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  medicalHistory: {
    type: DataTypes.TEXT,
  }
});
