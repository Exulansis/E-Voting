import Vue from 'vue';
import Router from 'vue-router';
import Provision from '@/components/provision/Provision';
import Dashboard from '@/components/dashboard/Dashboard';
import Welcome from '@/components/welcome/Welcome';
import Success from '@/components/success/Success';
import Failure from '@/components/failure/Failure';
import Vote from '@/components/vote/Vote';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Provision',
      component: Provision,
    }, {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
    }, {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    }, {
      path: '/vote/:id',
      name: 'Vote',
      component: Vote,
    }, {
      path: '/success/:mnemonic',
      name: 'Success',
      component: Success,
    }, {
      path: '/failure',
      name: 'Failure',
      component: Failure,
    },
  ],
});
