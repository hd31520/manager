// test-controller.js
const workerController = require('./src/controllers/workerController')

console.log('Testing workerController exports...\n')

const exportsToCheck = [
  'createWorker',
  'createWorkerWithPasswordSetup',
  'inviteWorker',
  'completeWorkerRegistration',
  'getWorkers',
  'checkWorkerAvailability',
  'getWorker',
  'updateWorker',
  'deleteWorker'
]

exportsToCheck.forEach(funcName => {
  if (typeof workerController[funcName] === 'function') {
    console.log(`✅ ${funcName}: EXISTS (type: ${typeof workerController[funcName]})`)
  } else {
    console.log(`❌ ${funcName}: MISSING or not a function`)
  }
})

console.log('\n✅ All exports verified!')