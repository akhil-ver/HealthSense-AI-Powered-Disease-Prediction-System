import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Prediction = sequelize.define('Prediction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  diseaseRiskLevel: DataTypes.STRING,
  predictedConditions: DataTypes.JSON,
  wellnessPlan: DataTypes.JSON,
  aiExplanation: DataTypes.TEXT,
});
