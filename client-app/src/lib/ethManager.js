import EthAgent from '@/lib/ethAgent';

export function create() {
  if (global.ethAgent) {
    throw new Error('Already created');
  }
  global.ethAgent = new EthAgent();
}

export function initiate(address) {
  if (!global.ethAgent) {
    throw new Error('Not created');
  }
  global.ethAgent.initContract(address);
}

export function getContract() {
  if (!global.ethAgent) {
    throw new Error('Not created');
  }
  return global.ethAgent;
}
