
export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event)
    if(!user) throw 'Vui lòng đăng nhập'
    const list = await DB.Gate.find({ display: true }).select('key name person number qrcode image createdAt updatedAt')
    
    return resp(event, { result: list })
  }
  catch (e: any) {
    return resp(event, { result: [] })
  }
})