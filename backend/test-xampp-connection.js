require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('=== Testing XAMPP MariaDB Connection ===');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: console.log,
  }
);

async function testConnection() {
  try {
    console.log('\n🔄 Testing connection...');
    await sequelize.authenticate();
    console.log('✅ Connection successful!');

    console.log('\n🔄 Testing database sync...');
    await sequelize.sync();
    console.log('✅ Database sync successful!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);

    if (error.original && error.original.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database "event_db" tidak ditemukan.');
      console.log('   Silakan buat database "event_db" di phpMyAdmin terlebih dahulu.');
    } else if (error.original && error.original.code === 'ECONNREFUSED') {
      console.log('\n💡 XAMPP MySQL service tidak berjalan.');
      console.log('   Silakan start MySQL service di XAMPP Control Panel.');
    }

    process.exit(1);
  }
}

testConnection();
