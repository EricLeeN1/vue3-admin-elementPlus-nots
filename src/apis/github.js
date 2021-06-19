import request from '@/utils/axios';

export function getLists(params) {
  return request({
    url: '/users/XPoet',
    method: 'get',
    params
  })
}