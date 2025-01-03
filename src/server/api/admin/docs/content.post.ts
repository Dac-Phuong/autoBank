import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, content } = await readBody(event)
    if(!_id || !content) throw 'Dữ liệu đầu vào không đủ'

    const docs = await DB.Docs.findOne({ _id: _id }).select('name')
    if(!docs) throw 'Tin tức không tồn tại'

    await DB.Docs.updateOne({ 
      _id: _id 
    },{ 
      content: content, 
      updater: auth._id 
    })

    logAdmin(event, `Sửa nội dung tin tức <b>${docs.name}</b>`)

    return resp(event, { message: 'Cập nhật nội dung thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})