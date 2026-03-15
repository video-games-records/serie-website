module.exports = {
  apps: [
    {
      name: 'vgr-serie',
      script: './server/index.mjs',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
