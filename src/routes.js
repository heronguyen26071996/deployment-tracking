import React from 'react'
import Loadable from 'react-loadable'
const Loading = () => <div>Loading...</div>
const LoadableLogin = Loadable({
    loader() {
        return import('./components/Login')
    },
    loading: Loading
})

const LoadableHome = Loadable({
    loader() {
        return import('./components/Home')
    },
    loading: Loading
})

const LoadableContact = Loadable({
    loader() {
        return import('./components/Products')
    },
    loading: Loading
})
const LoadableView = Loadable({
    loader() {
        return import('./components/Report')
    },
    loading: Loading
})
const LoadableEdit = Loadable({
    loader() {
        return import('./components/Contact')
    },
    loading: Loading
})
const routes = [
    {
        path: '/home',
        exact: true,
        main: () => <LoadableHome />
    },

    {
        path: '/add',
        exact: true,
        main: () => <LoadableContact />
    },
    {
        path: '/login',
        exact: true,
        main: () => <LoadableLogin />
    }
    ,
    {
        path: '/view',
        exact: true,
        main: () => <LoadableView />
    }
    ,
    {
        path: '/edt/:id',
        exact: true,
        main: () => <LoadableEdit />
    }
]

export default routes
