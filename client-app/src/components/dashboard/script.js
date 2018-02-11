import { mapState } from 'vuex';
import { getContract } from '@/lib/ethManager'

export default {
  name: 'Dashboard',
  computed: mapState([
    'candidates',
    'contractAddress',
    'addressFinalized'
  ]),
  methods: {
    vote(id) {
      this.$router.push(`/vote/${id}`);
    },
  },
  mounted() {
    if (!this.addressFinalized) {
      this.$router.push('/');
    }

    this.$store.dispatch('fetchCandidates');
  },
};
