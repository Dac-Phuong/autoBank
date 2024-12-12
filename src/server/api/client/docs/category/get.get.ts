import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event) as IAuth
    if (!user) throw 'Vui lý đăng nhập'

    const category = await DB.Category.find({ display: true }).select('name')
    return resp(event, { result: category })

  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
