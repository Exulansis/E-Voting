import { mapState } from 'vuex';

export default {
  computed: mapState(['contractAddress']),

  methods: {
    updateAddress(e) {
      const value = typeof e === 'string'
        ? e
        : e.target.value

      this.$store.commit({
        type: 'changeContractAddress',
        address: value,
      })
    },

    validateString() {
      return this.contractAddress.match(/^(0x|0X)?[a-fA-F0-9]{40}$/);
    },

    submit() {
      if (!this.validateString()) return;
      this.$store.commit({
        type: 'finalizeAddress' 
      })
      this.$router.push('/welcome');
    },
  },

  mounted() {
    const storedValue = localStorage.getItem('contractAddress');

    if (!this.contractAddress && storedValue) {
      this.updateAddress(storedValue);
      this.submit();
    }

    if (this.contractAddress) {
      this.$router.push('/welcome');
    }
  },
};
