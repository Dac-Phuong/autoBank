import type { IAuth } from "~~/types"
import resp from "../../../utils/resp"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.Category
    .aggregate([
      {
        $lookup: {
          from: "Docs",
          localField: "_id",
          foreignField: "category",
          as: "docsList"
        }
      },
      {
        $project: {
          name: 1,
          key: 1,
          color:1,
          updatedAt: 1,
          createdAt: 1,
          image:1,
          count: { 
            $size: '$docsList'
          }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Category.countDocuments()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})