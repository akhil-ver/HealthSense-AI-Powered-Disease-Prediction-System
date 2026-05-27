import { User } from './User.js';
import { Patient } from './Patient.js';
import { HealthRecord } from './HealthRecord.js';
import { Prediction } from './Prediction.js';
import { Appointment } from './Appointment.js';
import { sequelize } from './index.js';

// Define Associations
User.hasOne(Patient, { foreignKey: 'userId', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId' });

Patient.hasMany(HealthRecord, { foreignKey: 'patientId', onDelete: 'CASCADE' });
HealthRecord.belongsTo(Patient, { foreignKey: 'patientId' });

Patient.hasMany(Prediction, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Prediction.belongsTo(Patient, { foreignKey: 'patientId' });

User.hasMany(Appointment, { as: 'DoctorAppointments', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'Doctor', foreignKey: 'doctorId' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

export {
  sequelize,
  User,
  Patient,
  HealthRecord,
  Prediction,
  Appointment
};
