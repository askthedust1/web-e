import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).end('Method Not Allowed')
    }

    const { url } = req.body || {}
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url' })
    }

    const response = await fetch(url)
    if (!response.ok) {
      return res
        .status(response.status)
        .end(`Upstream error: ${response.statusText}`)
    }

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition')

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.setHeader('Content-Type', contentType)
    if (contentDisposition) {
      res.setHeader('Content-Disposition', contentDisposition)
    }
    res.status(200).send(buffer)
  } catch (err: any) {
    console.error('Download proxy error', err)
    res.status(500).json({ error: 'Download failed' })
  }
}
