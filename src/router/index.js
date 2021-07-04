import { createRouter, createWebHistory } from 'vue-router'
/* Layout */
import Layout from '@/layout/index.vue'

/* Router Modules */
import componentsRouter from './modules/components'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index.vue'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index.vue'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index.vue'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  componentsRouter,
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help'
    },
    children: [
      // {
      //   path: 'create',
      //   component: () => import('@/views/example/create'),
      //   name: 'CreateArticle',
      //   meta: { title: 'Create Article', icon: 'edit' }
      // },
      // {
      //   path: 'edit/:id(\\d+)',
      //   component: () => import('@/views/example/edit'),
      //   name: 'EditArticle',
      //   meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
      //   hidden: true
      // },
      {
        path: 'list',
        component: () => import('@/views/example/list.vue'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },
  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index.vue'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },
  // TODO 错误路由需处理跳转多加/问题
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index.vue'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },
  // TODO Excel部分继续完成
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel.vue'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      }
      // {
      //   path: 'export-selected-excel',
      //   component: () => import('@/views/excel/select-excel'),
      //   name: 'SelectExcel',
      //   meta: { title: 'Export Selected' }
      // },
      // {
      //   path: 'export-merge-header',
      //   component: () => import('@/views/excel/merge-header'),
      //   name: 'MergeHeader',
      //   meta: { title: 'Merge Header' }
      // },
      // {
      //   path: 'upload-excel',
      //   component: () => import('@/views/excel/upload-excel'),
      //   name: 'UploadExcel',
      //   meta: { title: 'Upload Excel' }
      // }
    ]
  },
  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index.vue'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },
  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index.vue'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      },
      {
        path: 'download',
        component: () => import('@/views/pdf/download.vue'),
        hidden: true
      }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index.vue'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },
  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index.vue'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/EricLeeN1/vue3-admin-element-nots.git',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  // 打算直接使用未匹配的路径名称导航到该路径，这是必要的
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/404', hidden: true }
]

const baseOptions = { history: createWebHistory(), routes: constantRoutes }

const router = createRouter(baseOptions)

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter(baseOptions)
  router.matcher = newRouter.matcher // reset router
}

export default router
