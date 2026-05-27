import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bmi: DataTypes.FLOAT,
  systolicBP: DataTypes.INTEGER,
  diastolicBP: DataTypes.INTEGER,
  heartRate: DataTypes.INTEGER,
  oxygenLevel: DataTypes.INTEGER,
  sleepHours: DataTypes.FLOAT,
  screenTime: DataTypes.FLOAT,
  mood: DataTypes.STRING,
  stressScore: DataTypes.INTEGER,
  stabilityScore: DataTypes.INTEGER,
  stabilityZone: DataTypes.STRING
});
