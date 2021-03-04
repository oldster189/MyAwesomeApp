import Link from 'next/link'
import { useEffect } from 'react'
import Layout from '../components/Layout'
const UUID = require('uuid-v4')
const crypto = require('crypto')
import data from './users/data.json'
import axios from 'axios'

const IndexPage = () => {
  const genHeader = (ChannelID, ChannelSecret, URL, RequestDetail, nonce) => {
    if (typeof RequestDetail !== 'string') {
      RequestDetail = JSON.stringify(RequestDetail)
    }
    const data = ChannelSecret + URL + RequestDetail + nonce
    const signature = crypto
      .createHmac('SHA256', ChannelSecret)
      .update(data)
      .digest('base64')
      .toString()
    return {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': ChannelID,
      'X-LINE-Authorization-Nonce': nonce,
      'X-LINE-Authorization': signature,
    }
  }

  useEffect(() => {
    const postRequire = async (body: any, header: any) => {
      try {
        const url = 'https://sandbox-api-pay.line.me/v3/payments/request'
        const res = await axios.post<any>(url, body, { headers: header })
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

    const ChannelID = '1655722010'
    const ChannelSecret = '983c65e6083813b2a521a93d47a5a0cb'
    const URL = '/v3/payments/request'
    const RequestDetail = data
    const paynonce = UUID()

    const header = genHeader(ChannelID, ChannelSecret, URL, RequestDetail, paynonce)
    postRequire(RequestDetail, header)
    console.log(header)
  }, [])

  return (
    <Layout title='Home | Next.js + TypeScript Example'>
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href='/about'>
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

export default IndexPage
