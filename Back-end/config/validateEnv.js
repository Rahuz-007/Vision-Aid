/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before server starts
 * CRITICAL: Application will not start if validation fails in production
 */

const validateEnv = () => {
    const IS_PRODUCTION = process.env.NODE_ENV === 'production';
    const IS_TEST = process.env.NODE_ENV === 'test';

    // Define required environment variables and their rules
    const requiredEnvVars = {
        JWT_SECRET: {
            min: 32,
            required: true,
            description: 'Secret key for JWT token signing'
        },
        SESSION_SECRET: {
            min: 32,
            required: true,
            description: 'Secret key for session encryption'
        },
        FRONTEND_URL: {
            required: true,
            description: 'Frontend application URL for CORS'
        },
    };

    // Additional production-only requirements
    if (IS_PRODUCTION) {
        requiredEnvVars.MONGODB_URI = {
            required: true,
            description: 'MongoDB connection string'
        };
        requiredEnvVars.SENTRY_DSN = {
            required: false,
            recommended: true,
            description: 'Sentry error tracking DSN'
        };
    }

    const errors = [];
    const warnings = [];

    // Validate each environment variable
    Object.entries(requiredEnvVars).forEach(([key, rules]) => {
        const value = process.env[key];

        // Check if required variable is missing
        if (rules.required && !value) {
            if (IS_TEST && key === 'MONGODB_URI') {
                // Allow missing MongoDB in test environment
                return;
            }
            errors.push(`❌ ${key} is required but not set - ${rules.description}`);
            return;
        }

        // Check minimum length requirement
        if (rules.min && value && value.length < rules.min) {
            errors.push(
                `❌ ${key} must be at least ${rules.min} characters (current: ${value.length})`
            );
        }

        // Check recommended variables
        if (rules.recommended && !value && IS_PRODUCTION) {
            warnings.push(
                `⚠️  ${key} is recommended for production - ${rules.description}`
            );
        }
    });

    // Check for default/weak secrets
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.includes('change')) {
        errors.push('❌ JWT_SECRET contains "change" - this appears to be a default value');
    }

    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.includes('change')) {
        errors.push('❌ SESSION_SECRET contains "change" - this appears to be a default value');
    }

    // Display results
    if (errors.length > 0) {
        console.error('\n┌──────────────────────────────────────────────────────┐');
        console.error('│  🚨 ENVIRONMENT VALIDATION FAILED                    │');
        console.error('└──────────────────────────────────────────────────────┘\n');
        errors.forEach(err => console.error(err));
        console.error('\n💡 To fix:');
        console.error('   1. Copy .env.example to .env');
        console.error('   2. Generate secrets: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
        console.error('   3. Update .env with generated values\n');

        if (IS_PRODUCTION) {
            process.exit(1);
        } else {
            console.error('⚠️  Running in development mode - continuing despite errors\n');
        }
    }

    if (warnings.length > 0 && IS_PRODUCTION) {
        console.warn('\n┌──────────────────────────────────────────────────────┐');
        console.warn('│  ⚠️  ENVIRONMENT WARNINGS                            │');
        console.warn('└──────────────────────────────────────────────────────┘\n');
        warnings.forEach(warn => console.warn(warn));
        console.warn('');
    }

    if (errors.length === 0) {
        console.log('✅ Environment validation passed');
        if (IS_PRODUCTION) {
            console.log('🔒 Running in PRODUCTION mode');
        } else if (IS_TEST) {
            console.log('🧪 Running in TEST mode');
        } else {
            console.log('🔧 Running in DEVELOPMENT mode');
        }
    }

    return errors.length === 0;
};

module.exports = { validateEnv };
