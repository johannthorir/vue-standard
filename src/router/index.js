import Vue from 'vue';
import Router from 'vue-router';
import Standard from '@/components/Standard';

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Standard
        }
    ]
})
