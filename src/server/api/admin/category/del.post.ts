import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'


    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.Category.findOne({ _id: _id }).select('name key _id')
    if(!category) throw 'Danh mục không tồn tại'
    
    const docs = await DB.Docs.countDocuments({ category: _id })
    if(docs > 0) throw 'Không thể xóa danh mục đã có docs'

    await DB.Category.deleteOne({ _id: _id })
    logAdmin(event, `Xóa danh mục <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa danh mục thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})