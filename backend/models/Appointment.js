import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointmentDate: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled'),
    defaultValue: 'Pending',
  },
  notes: DataTypes.TEXT,
});
