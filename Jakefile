const { spawn } = require('child_process')

function execCmd(cmd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, { shell: true, stdio: 'inherit' })
    child.on('close', code => {
      if (code !== 0) {
        reject(code)
      } else {
        resolve()
      }
    })
    child.on('error', reject)
  })
}

namespace('be', () => {
  desc('Build server')
  task('build', async () => {
    await execCmd('npm --prefix server install && npm --prefix server run build')
  })

  desc('Start server')
  task('run', ['build'], async () => {
    await execCmd('npm --prefix server start')
  })

  desc('Test server')
  task('test', ['build'], async () => {
    await execCmd('npm --prefix server run lint')
    await execCmd('npm --prefix server test -- --all --watchAll=false --ci')
    await execCmd('npm --prefix server run test:e2e -- --all --watchAll=false --ci')
  })
})

namespace('fe', () => {
  desc('Build client')
  task('build', async () => {
    await execCmd('npm --prefix client install && CI=true npm --prefix client run build')
  })

  desc('Start client')
  task('run', ['build'], async () => {
    await execCmd('npm --prefix client start')
  })

  desc('Test client')
  task('test', ['build'], async () => {
    await execCmd('npm --prefix client test -- --all --watchAll=false --ci')
  })
})

desc('Start client and server')
task('run', ['fe:run', 'be:run'], {
  concurrency: 3,
})
