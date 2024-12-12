import type { IAuth } from "~~/types"
import logAdmin from "../../../utils/logAdmin"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const docs = await DB.Docs.findOne({ _id: _id }).select('name')
    if(!docs) throw 'Tài liệu không tồn tại'

    await DB.Category.deleteOne({ _id: _id })
    logAdmin(event, `Xóa tài liệu sản phẩm <b>${docs.name}</b>`)

    return resp(event, { message: 'Xóa tài liệu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})