import Web3 from 'web3';
import ballotAbi from '@/contracts/Ballot.json';

const ETH_ENDPOINT = 'http://localhost:8545';

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter -= 1;

    // And swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


export default class ethAgent {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(ETH_ENDPOINT));
    this.initiated = false;
    this.ballotContract = null;
  }

  initContract(address) {
    if (!this.initiated) {
      this.ballotContract = new this.web3.eth.Contract(ballotAbi.abi, address);
      this.initiated = true;
    }
  }

  async getCandidates() {
    const toBeResolved = [];
    const total = await this.ballotContract.methods.getNrOfCandidates().call();

    for (let i = 0; i < total; i += 1) {
      toBeResolved.push(this.getCandidate(i));
    }

    return Promise.all(toBeResolved);
  }

  async getCandidate(id) {
    if (!this.initiated) {
      throw new Error('Initiate First');
    }

    const candidateInfo = await this.ballotContract.methods.getCandidateById(id).call();
    return candidateInfo;
  }

  async pushBufferedVotes(votes) {
    if (!votes.length) {
      return Promise.resolve();
    }
    return Promise.all(shuffle(votes).map(v =>
      this.vote(v.candidateId, v.mnemonic),
    ));
  }

  async registerPassportHash(passNr) {
    try {
      const hash = this.web3.utils.sha3(passNr);
      console.log('SENDING HASH!', hash);
      await this.ballotContract.methods.registerPassportHash(hash);
    } catch (err) {
      console.warn(err);
    }
  }

  async vote(id, mnem) {
    if (!this.initiated) {
      throw new Error('Initiate First');
    }

    // TODO Move out of here
    try {
      await this.ballotContract.methods.startBallot();
    } catch (err) {
      console.warn(err);
    }

    // TODO From config
    const from = '0xab7fcaeb4dfcc37309f7370438f0710713dbbcbe';
    const gas = 4712388;

    // TODO NEEDS TO BE IN HEX?
    const mnemonic = this.web3.utils.toHex(mnem);
    return this.ballotContract.methods.vote(mnemonic, id).send({ from, gas });
  }
}
