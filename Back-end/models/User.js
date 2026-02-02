const { db } = require('../services/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    static collectionName = 'users';

    constructor(data) {
        this._id = data.id || data._id; // Firestore docs have IDs
        this.email = data.email;
        this.name = data.name;
        this.password = data.password;
        this.isVerified = data.isVerified || false;
        this.verificationToken = data.verificationToken;
        this.verificationExpires = data.verificationExpires;
        this.resetToken = data.resetToken;
        this.resetExpires = data.resetExpires;
        this.avatar = data.avatar;
        this.googleId = data.googleId;
        this.githubId = data.githubId;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastLogin = data.lastLogin;

        // Internal flag to track if password was modified
        this._passwordModified = false;
    }

    // Simulate Mongoose's save()
    async save() {
        try {
            if (this._passwordModified && this.password) {
                const salt = await bcrypt.genSalt(10);
                this.password = await bcrypt.hash(this.password, salt);
                this._passwordModified = false;
            }

            // If no ID, generate one or use email as ID? 
            // Mongoose uses ObjectIds. Firestore auto-ids are good.
            // But we need to update 'this._id' if it's new.

            let docRef;
            if (this._id) {
                docRef = db.collection(User.collectionName).doc(this._id);
            } else {
                docRef = db.collection(User.collectionName).doc();
                this._id = docRef.id;
            }

            // Convert to plain object and remove undefined values
            const userObject = { ...this };
            delete userObject._passwordModified;

            // Sanitise: Firestore does not accept 'undefined'
            Object.keys(userObject).forEach(key => {
                if (userObject[key] === undefined) {
                    delete userObject[key];
                }
            });

            console.log('Saving user to Firestore:', { id: this._id, email: this.email });

            await docRef.set(userObject, { merge: true });
            return this;
        } catch (err) {
            console.error('Error saving user:', err);
            throw err;
        }
    }

    static async findOne(query) {
        try {
            // Very basic query implementation
            // Supporting { email: '...' }
            let ref = db.collection(this.collectionName);

            if (query.email) {
                ref = ref.where('email', '==', query.email);
            } else if (query.googleId) {
                ref = ref.where('googleId', '==', query.googleId);
            } else if (query.githubId) {
                ref = ref.where('githubId', '==', query.githubId);
            }

            const snapshot = await ref.limit(1).get();
            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            const userData = doc.data();
            userData._id = doc.id; // Ensure ID is present

            const user = new User(userData);
            // If we need password (select: true), we have it. 
            // Mongoose hid it by default. Here we just loaded it.
            return user;
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        try {
            if (!id) return null;
            const doc = await db.collection(this.collectionName).doc(id).get();
            if (!doc.exists) return null;

            const userData = doc.data();
            userData._id = doc.id;
            return new User(userData);
        } catch (err) {
            throw err;
        }
    }

    static async findByIdAndUpdate(id, update, options) {
        try {
            const docRef = db.collection(this.collectionName).doc(id);
            await docRef.set(update, { merge: true });

            if (options.new) {
                const doc = await docRef.get();
                const userData = doc.data();
                userData._id = doc.id;
                return new User(userData);
            }
            return null;
        } catch (err) {
            throw err;
        }
    }

    static async findByCredentials(email, password) {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('Invalid login credentials');
        }

        // In our simplistic model, user.password is the hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid login credentials');
        }
        return user;
    }

    async comparePassword(candidatePassword) {
        if (!this.password) return false;
        return await bcrypt.compare(candidatePassword, this.password);
    }

    generateAuthToken() {
        const token = jwt.sign(
            {
                userId: this._id,
                email: this.email,
                name: this.name
            },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '24h' }
        );
        return token;
    }
}

module.exports = User;
