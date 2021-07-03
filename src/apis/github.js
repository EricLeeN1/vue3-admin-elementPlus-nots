import request from '@/request'

export function getUserInfos(params) {
  return request({
    url: '/users/EricLeeN1',
    method: 'get',
    params
  })
}

export function transactionList(params = { page: 1, per_page: 5 }) {
  return request({
    url: '/api/users/EricLeeN1/repos',
    method: 'get',
    params
  })
}

// export function logout(params = { page: 1, per_page: 5 }) {
//   return request({
//     url: '/users/EricLeeN1/repos',
//     method: 'get',
//     params
//   })
// }
