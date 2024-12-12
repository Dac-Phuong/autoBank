import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const gates = await DB.Gate.find({ display: true }).select('key qrcode image createdAt updatedAt')
    return resp(event, { result: gates })
  }
  catch (e: any) {
    return resp(event, { result: [] })
  }
})