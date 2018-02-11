import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import assignStore from '@/store';
import { create, getContract } from '@/lib/ethManager';
import { getBufferedVotes, clearBufferedVotes } from '@/lib/voteBuffer';

const store = assignStore();
create();
const ethContract = getContract();

function periodic() {
  const timeInterval = 60 * 1000;
  setTimeout(() => {
    ethContract.pushBufferedVotes(getBufferedVotes())
      .then(() => {
        clearBufferedVotes();
      })
      .catch(err => console.error(err));

    periodic();
  }, timeInterval);
}

periodic();

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
