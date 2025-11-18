module.exports = (sequelize, DataTypes) => {
const CertificateIssued = sequelize.define('CertificateIssued', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  certificate_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  certificate_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  issued_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  downloaded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'certificates_issued',
  timestamps: true,
  createdAt: 'issued_date',
  updatedAt: false
});

// Associations
CertificateIssued.associate = (models) => {
  CertificateIssued.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
  CertificateIssued.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

return CertificateIssued;
};
