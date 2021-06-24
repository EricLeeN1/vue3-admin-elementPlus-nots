import request from '@/utils/axios'

export function getUserInfos(params) {
  return request({
    url: '/users/EricLeeN1',
    method: 'get',
    params
  })
}

export function transactionList(params = { page: 1, per_page: 5 }) {
  return request({
    url: '/users/EricLeeN1/repos',
    method: 'get',
    params
  })
}
