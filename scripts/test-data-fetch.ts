// npx tsx scripts/test-data-fetch.js

import * as process from 'node:process'
import fetchData from '../src/fetchData'

(async () => {
  const [, , email, password] = process.argv

  if (!email || !password) {
    console.log('Email or password not provided')
    return process.exit(1)
  }
  const data = await fetchData({
    email,
    password,
  });

  console.log(data)
})();
