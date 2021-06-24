import request from '@/utils/axios'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(params) {
  return request({
    url: '/users/EricLeeN1/repos',
    method: 'get',
    params
  })
}
