import Vuex from 'vuex';
import Vue from 'vue';
import { initiate, getContract } from '@/lib/ethManager';
import { getVoteBuffer, addVoteToBuffer } from '@/lib/voteBuffer';
import Web3 from 'web3';

export default () => {
  Vue.use(Vuex);

  return new Vuex.Store({
    state: {
      candidates: [],
      contractAddress: '',
      addressFinalized: false,
      privKey: '',
    },
    mutations: {
      fetchCandidates(state, { candidates }) {
        state.candidates = candidates;
      },

      changeContractAddress(state, { address }) {
        state.contractAddress = address;
      },

      finalizeAddress(state) {
        localStorage.setItem('contractAddress', state.contractAddress);
        initiate(state.contractAddress);
        state.addressFinalized = true;
      },
    },
    actions: {
      async addVote(context, { candidateId, passportNr, mnemonic, router }) {
        const ethManager = getContract();
        getVoteBuffer();
        try {
          await ethManager.registerPassportHash(passportNr);
          addVoteToBuffer(candidateId, mnemonic);
          router.push(`/success/${mnemonic}`);
        } catch (err) {
          console.log(err);
          router.push('/failure/');
        }
      },

      async fetchCandidates(context) {
        const ethAgent = getContract();
        const candidates = await ethAgent.getCandidates();
        const result = candidates.map((cand) => {
          // Converting from Hex, and removing padding zeros
          const name = (new Web3().utils.hexToAscii(cand.candidateName)).replace(/\0/g, '');
          const id = cand.candidateId;
          return { name, id };
        });

        context.commit({
          type: 'fetchCandidates',
          candidates: result,
        });
      },
    },
  });
};
