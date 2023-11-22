export default function getQuery(url, key) {
  let query = {}
  const pairs = decodeURIComponent(url).split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[pair[0]] = pair[1]
  }
  console.log('query', query)
  return query[key] // 返回对象
}
