module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      script: './server/index.mjs',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
