import type { IAuth } from "~~/types"
import logAdmin from "../../../utils/logAdmin"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'


    const body = await readBody(event)
    const { _id, name, } = body
    if(!_id || !name ) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.Category.findOne({ _id: _id }).select('name key')
    if(!category) throw 'Danh mục không tồn tại'
    
    if(category.name != name){
      const key = formatVNString(event, name, '-')
      const getByName = await DB.Category.findOne({ name: name }).select('_id')
      if(!!getByName) throw 'Tên danh mục đã tồn tại'
      body.key = key
    }
    
    delete body['_id']
    await DB.Category.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin danh mục tin tức <b>${category.name}</b>`)

    return resp(event, { message: 'Sửa danh mục thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})