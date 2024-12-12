import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config
    .findOne()
    .select(`
      -about -privacy -terms 
      -facebook.client_secret 
      -zalo.client_secret 
      -tiktok.client_secret
      -google.client_secret
      -product
    `) as IDBConfig

    if(!config) throw 'Không tìm thấy cấu hình trang'
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})