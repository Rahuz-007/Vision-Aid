module.exports = {
    apps: [
        {
            name: 'vision-aid-api',
            script: './server.js',
            instances: 'max', // Use all available CPU cores
            exec_mode: 'cluster', // Enable cluster mode for load balancing
            watch: false, // Don't watch files in production
            max_memory_restart: '1G', // Restart if memory exceeds 1GB

            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },

            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },

            // Logging
            error_file: './logs/pm2-error.log',
            out_file: './logs/pm2-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,

            // Restart configuration
            autorestart: true,
            max_restarts: 10,
            min_uptime: '10s', // Minimum uptime before considered started
            restart_delay: 4000, // Delay between restarts

            // Health check
            kill_timeout: 5000, // Time to wait before force killing
            listen_timeout: 3000, //Time to wait for app to listen

            // Process versioning
            increment_var: 'PORT',

            // Cron restart (optional - restart once a day at 3 AM)
            cron_restart: '0 3 * * *',
        }
    ],

    deploy: {
        production: {
            user: 'node',
            host: 'your-server-ip',
            ref: 'origin/main',
            repo: 'git@github.com:your-username/vision-aid.git',
            path: '/var/www/vision-aid',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-deploy-local': '',
        },
    },
};
