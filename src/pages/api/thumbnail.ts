import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'mxschmitt-chrome-aws-lambda';
import { getAbsoluteURL } from 'utils/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await chromium.font("https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf")
  const browser = await chromium.playwright().launch({
    executablePath: await chromium.executablePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: chromium.args,
  })

  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 630
    }
  });
  const url = getAbsoluteURL(req.query["path"] as string || "")
  await page.goto(url, {
    timeout: 15 * 1000
  })
  const data = await page.screenshot({
    type: "png"
  })
  await browser.close()
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate")
  res.setHeader('Content-Type', 'image/png')
  res.end(data)
}