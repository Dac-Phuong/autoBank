export default defineEventHandler(async (event) => {
  try {
    const {_id} = await readBody(event)
    const gate = await DB.Gate.findOne({ _id: _id }).select('name person number qrcode')
    return resp(event, { result: gate })
  }
  catch (e: any) {
    return resp(event, { result: [] })
  }
})
