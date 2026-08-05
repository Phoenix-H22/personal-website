module.exports = {
  apps: [
    {
      name: "alkady.dev",
      cwd: "/var/www/alkady_dev_usr/data/www/alkady.dev",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3010",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
