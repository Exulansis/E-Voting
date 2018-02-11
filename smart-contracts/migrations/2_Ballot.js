const Ballot = artifacts.require('./Ballot.sol');
const config = require('../../config.json');

module.exports = function(deployer) {
  const {dev, addresses, candidates} = config

  console.log(addresses.stations)
  deployer.deploy(Ballot, addresses.stations).then(() => {
    if (dev) devProvision()
  })

  // DEV FUNCTIONS
  const devProvision = () => {
    Ballot.deployed().then(inst => {
      console.log('Received deployed instance, adding candidates')
      process.env['CONTRACT_ADDRESS'] = Ballot.address

      Promise.all(candidates.map(c => {
        inst.addCandidate(c).then(console.log(`Candidate ${c} added`))
      }))
      return inst
    }).then(inst => {
      inst.addVotingStation('0x05')
    })
/* 
        inst.startBallot().then(() => console.log('Ballot started'))
      }
*/
  }
};
