import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config.findOne().select(`name description image.og`) as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    const [user, product, order] = await Promise.all([
      DB.User.countDocuments(),
      DB.Product.countDocuments(),
      DB.Order.countDocuments(),
    ])
    return resp(event, { result: { config, user, product, order } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})