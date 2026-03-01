const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createAdmin() {
    await mongoose.connect('mongodb://localhost:27017/cutio');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    const existingAdmin = await db.collection('users').findOne({ role: 'ADMIN' });
    if (existingAdmin) {
        console.log('Admin already exists! Phone:', existingAdmin.phoneNumber);
        process.exit(0);
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const result = await db.collection('users').insertOne({
        firstName: 'System',
        lastName: 'Admin',
        phoneNumber: '9999999999',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    console.log('Created new Admin user:', result.insertedId);
    process.exit(0);
}

createAdmin().catch(console.error);
