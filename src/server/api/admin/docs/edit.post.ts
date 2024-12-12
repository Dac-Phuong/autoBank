import type { IAuth } from "~~/types"
import logAdmin from "../../../utils/logAdmin"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, name, category, display } = body
    if(!_id || !name || !category ) throw 'Dữ liệu đầu vào không hợp lệ'

    const checkCat = await DB.Category.findOne({ _id: category }).select('name')
    if(!checkCat) throw 'Danh mục không tồn tại'

    const checkDocs = await DB.Docs.findOne({ _id: _id }).select('name')
    if(!checkDocs) throw 'Tài liệu không tồn tại'

    if(checkDocs.name != name){
      const docs = await DB.Docs.findOne({name: name }).select('name')
      if(!!docs) throw 'Tên tài liệu tồn tại'
    }
    console.log(body);
    
    delete body['_id']
    await DB.Docs.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin tài liệu <b>${name}</b>`)

    return resp(event, { message: 'Sửa tài liệu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})