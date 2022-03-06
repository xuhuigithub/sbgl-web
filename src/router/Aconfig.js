import { LayoutAuth, LayoutDefault, LayoutChat, LayoutMedia, RouteWrapper } from '@/components/layouts'

export const publicRoute = [
  {
    path: '*',
    component: () => import('@/views/error/NotFound.vue'),
  },
  {
    path: '/auth',
    component: LayoutAuth,
    meta: {
      title: 'Login',
    },
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          title: 'Login',
        },
        component: () => import('@/views/auth/Login.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    meta: {
      title: 'Not Found',
    },
    component: () => import('@/views/error/NotFound.vue'),
  },

  {
    path: '/500',
    name: '500',
    meta: {
      title: 'Server Error',
    },
    component: () => import('@/views/error/Error.vue'),
  },
]

export const protectedRoute = [
  {
    path: '/',
    component: LayoutDefault,
    meta: {
      title: 'home',
      icon: '',
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          icon: 'mdi-view-dashboard',
        },
        component: () => import('@/views/ADashboard.vue'),
      },
            //asset
            {
              path: '/asset',
              component: RouteWrapper,
              meta: {
                title: '资产',
                icon: 'mdi-dots-square',
              },
              redirect: '/asset/list',
              children: [
                {
                  path: '/asset/list',
                  name: 'asset.list',
                  meta: {
                    title: '资产',
                    icon: 'mdi-alpha-c',
                  },
                  component: () => import('@/views/asset/AssetList.vue'),
                },
                  // asset detail
                {
                  path: '/asset/detail/:sn',
                  name: 'asset.detail',
                  meta: {
                    title: '资产详情',
                    icon: 'mdi-alpha-c',
                    hidden: true
                  },
                  component: () => import('@/views/asset/AssetDetail.vue'),
                },
                {
                  path: '/cabinet/list',
                  name: 'cabinet.list',
                  meta: {
                    title: '机柜',
                    icon: 'mdi-alpha-b',
                    needPermissions: ['cabinet_list']
                  },
                  component: () => import('@/views/asset/CabinetList.vue'),
                },
              ]
            },
            //user
            {
              path: '/user',
              component: RouteWrapper,
              meta: {
                title: '用户',
                icon: 'mdi-account',
                needPermissions: ['user_list','user_create','user_delete','user_update']
              },
              redirect: '/user/list',
              children: [
                {
                  path: '/user/list',
                  name: 'user.list',
                  meta: {
                    title: '用户列表',
                    icon: 'mdi-alpha-u',
                    needPermissions: ['user_list','user_create','user_delete','user_update']
                  },
                  component: () => import('@/views/user/UserList.vue'),
                }
              ],
            },
                        //集成部署
                        {
                          path: '/exec',
                          component: RouteWrapper,
                          meta: {
                            title: '集成部署',
                            icon: 'mdi-account',
                            needPermissions: ['user_list','user_create','user_delete','user_update']
                          },
                          redirect: '/exec/detail',
                          children: [
                            {
                              path: '/exec/detail',
                              name: 'exec.detail',
                              meta: {
                                title: '集成部署',
                                icon: 'mdi-alpha-u',
                                needPermissions: ['user_list','user_create','user_delete','user_update']
                              },
                              component: () => import('@/views/exec/ExecDetail.vue'),
                            }
                          ],
                        },
{
        path: '/403',
        name: 'Forbidden',
        meta: {
          title: 'access_denied',
          hidden: true,
        },
        component: () => import('@/views/error/Deny.vue'),
      },
    ],
  },
  //media
  {
    path: '/media',
    meta: {
      title: 'media',
      icon: 'mdi-image',
    },
    name: 'media',
    component: LayoutMedia,
    redirect: '/media/file',
    children: [
      {
        path: '/media/file',
        name: 'media.index',
        meta: {
          title: 'media manager',
          icon: 'mdi-view',
        },
        component: () => import('@/views/media/MediaView.vue'),
      },
      {
        path: '/media/:type',
        name: 'media.type',
        meta: {
          title: 'media manager',
          icon: 'mdi-view',
        },
        props: true,
        component: () => import('@/views/media/MediaView.vue'),
      },
    ],
  },
  // chat app
  {
    path: '/chat',
    name: 'Chat',
    component: LayoutChat,
    redirect: {
      path: '/chat/messaging',
    },
    meta: {
      title: 'Chat',
      icon: 'chat_bubble',
    },
    children: [
      {
        path: '/chat/messaging/:uuid?',
        name: 'ChatMessaging',
        props: true,
        component: () => import('@/views/chat/ChatMessaging.vue'),
      },
    ],
  },
]
