export default {
  name: 'Welcome',
  data() {
    return {
      message: 'Welcome, please scan your paper.',
      loading: false,
    };
  },
  methods: {
    mockScan() {
      this.loading = true;
      setTimeout(() => {
        this.$router.push('/dashboard');
      }, 3000);
    },
  },
  mounted() {
    setTimeout(() => {
      this.mockScan();
    }, 3000);
  },
};
