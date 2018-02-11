import EthAgent from '@/lib/ethAgent';
import { getContract } from '@/lib/ethManager'

export default {
  name: 'Success',
  methods: {
    handleClick() {
      this.$router.push('/');
    },
  },
};
