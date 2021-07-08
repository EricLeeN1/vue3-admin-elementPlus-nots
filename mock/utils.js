export const resultSuccess = (res, msg = 'ok') => {
  return {
    code: 1,
    res,
    msg
  }
}

export const pagination = (page, pageSize, lists) => {
  const offset = (page - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= lists.length
      ? lists.slice(offset, lists.length)
      : lists.slice(offset, offset + Number(pageSize))
  return ret
}

export const resultPageSuccess = (data = {}, msg = 'ok') => {
  const pageData = pagination(data.page, data.pageSize, data.list)
  return {
    ...resultSuccess({
      items: pageData,
      total: data.list.length
    }),
    msg
  }
}

export const resultError = (msg = 'Request failed', { code = -1, res = null } = {}) => {
  return {
    code,
    res,
    msg
  }
}
