const { db } = require('../services/firebase');

class UserPreferences {
    static collectionName = 'user_preferences';

    static async getOrCreate(userId) {
        try {
            if (!userId) {
                throw new Error('UserId is required');
            }
            const docRef = db.collection(this.collectionName).doc(userId);
            const doc = await docRef.get();

            if (!doc.exists) {
                // Create default preferences - matching the schema structure
                const defaultPreferences = {
                    userId,
                    accessibility: {
                        highContrast: false,
                        largeText: false,
                        reduceMotion: false,
                        voiceFeedback: true
                    },
                    detection: {
                        autoDetect: false,
                        confidenceThreshold: 0.5,
                        saveHistory: true
                    },
                    notifications: {
                        email: true,
                        push: false
                    },
                    theme: {
                        mode: 'dark',
                        accentColor: '#3B82F6'
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                await docRef.set(defaultPreferences);
                return defaultPreferences;
            }

            return doc.data();
        } catch (error) {
            throw error;
        }
    }

    static async findOneAndUpdate(query, update, options = {}) {
        // Note: This matches the Mongoose signature for compatibility
        // query is { userId: ... }
        const userId = query.userId;
        if (!userId) throw new Error('UserId is required for update');

        try {
            const docRef = db.collection(this.collectionName).doc(userId);

            // Ensure updatedAt is set
            const updateData = {
                ...update,
                updatedAt: new Date().toISOString()
            };

            // In Firestore, set with merge: true acts like upsert
            await docRef.set(updateData, { merge: true });

            if (options.new) {
                const updatedDoc = await docRef.get();
                return updatedDoc.data();
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async findOneAndDelete(query) {
        const userId = query.userId;
        if (!userId) throw new Error('UserId is required for delete');

        try {
            await db.collection(this.collectionName).doc(userId).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async create(data) {
        const userId = data.userId;
        if (!userId) {
            // If no userId provided, generate one? Or error?
            // For preferences, heavily linked to user.
            throw new Error('UserId is required for create');
        }

        const docRef = db.collection(this.collectionName).doc(userId);

        const newPrefs = {
            accessibility: {
                highContrast: false,
                largeText: false,
                reduceMotion: false,
                voiceFeedback: true
            },
            detection: {
                autoDetect: false,
                confidenceThreshold: 0.5,
                saveHistory: true
            },
            notifications: {
                email: true,
                push: false
            },
            theme: {
                mode: 'dark',
                accentColor: '#3B82F6'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...data
        };

        await docRef.set(newPrefs);
        return newPrefs;
    }
}

module.exports = UserPreferences;
