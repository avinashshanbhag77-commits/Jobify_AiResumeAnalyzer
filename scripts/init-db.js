const mongoose = require('mongoose');
// Running with node --env-file=.env scripts/init-db.js

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGO_URI is not defined in .env');
    process.exit(1);
}

// Define Schemas (Copying simplified versions to avoid TS compilation issues for this script)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    password: String,
    image: String,
}, { timestamps: true });

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    parsedContent: { type: String, required: true },
    analysisResult: Object,
}, { timestamps: true });

async function initDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to:', mongoose.connection.name);

        if (mongoose.connection.name !== 'resumeanalyzer') {
            console.warn('WARNING: Connected to database "' + mongoose.connection.name + '" but expected "resumeanalyzer". Please check MONGO_URI.');
        }

        // Register Models
        const User = mongoose.model('User', UserSchema);
        const Resume = mongoose.model('Resume', ResumeSchema);

        // Create Collections (by creating indexes or temporary documents)
        console.log('Initializing User collection...');
        await User.createCollection();
        await User.syncIndexes();
        console.log('User collection ready.');

        console.log('Initializing Resume collection...');
        await Resume.createCollection();
        await Resume.syncIndexes();
        console.log('Resume collection ready.');

        console.log('Database verification complete.');
        process.exit(0);
    } catch (error) {
        console.error('Database Initialization Failed:', error);
        process.exit(1);
    }
}

initDB();
