import EthAgent from '@/lib/ethAgent';
import VoteBuffer from '@/lib/voteBuffer';
import { getContract } from '@/lib/ethManager'

export default {
  name: 'Vote',
  data() {
    return {
      mnemonic: '',
      passportNr: '12345'
    };
  },
  methods: {
    handleClick() {
      const randomSuffix = Math.random().toString(36).substring(2, 5);
      this.mnemonic += randomSuffix;
      this.vote();
    },

    vote() {
      const candidateId = this.$route.params.id
      this.$store.dispatch({
        type: 'addVote',
        candidateId,
        mnemonic: this.mnemonic,
        passportNr: this.passportNr,
        router: this.$router,
      });
    },
  },
};
