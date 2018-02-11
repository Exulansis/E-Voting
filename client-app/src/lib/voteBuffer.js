import Web3 from 'web3';

const voteBufferTempl = {
  initialized: true,
  lastPush: null,
  votes: [],
};

function initVoteBuffer() {
  localStorage.setItem('voteBuffer', JSON.stringify(voteBufferTempl));
  return JSON.parse(localStorage.getItem('voteBuffer'));
}

function voteBufferExists() {
  const voteBuffer = JSON.parse(localStorage.getItem('voteBuffer'));
  return voteBuffer && voteBuffer.initialized;
}

export function getBufferedVotes() {
  return JSON.parse(localStorage.getItem('voteBuffer')).votes;
}

export function createVoteBuffer() {
  if (voteBufferExists()) {
    localStorage.removeItem('voteBuffer');
  }

  return initVoteBuffer();
}

export function getVoteBuffer() {
  if (voteBufferExists()) {
    return JSON.parse(localStorage.getItem('voteBuffer'));
  }

  return createVoteBuffer();
}

function updateBuffer(newBuffer) {
  localStorage.setItem('voteBuffer', JSON.stringify(newBuffer));
}

export function clearBufferedVotes() {
  const voteBuffer = getVoteBuffer();
  voteBuffer.votes = [];
  updateBuffer(voteBuffer);
}

export function addVoteToBuffer(candidateId, mnemonic) {
  if (!candidateId || !mnemonic) {
    console.error('scary error');
  }
  const voteBuffer = getVoteBuffer();
  voteBuffer.votes.push({
    candidateId,
    mnemonic: new Web3().utils.sha3(mnemonic),
  });

  updateBuffer(voteBuffer);
}
