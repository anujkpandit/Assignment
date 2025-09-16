import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    fatherNumber: { type: String, required: true },
    // Link to the user who created this profile
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
