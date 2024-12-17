import type { IAuth } from "~~/types"
import resp from "../../../utils/resp"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    const match: any = {display: true}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.Bank
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "BankAccount",
          let: { bankId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$bank", "$$bankId"] },
                    { $eq: ["$user", auth._id] }
                  ]
                }
              }
            }
          ],
          as: "listAccount"
        }
      },
      {
        $project: {
          name: 1,
          key: 1,
          image: 1,
          status: 1,
          updatedAt: 1,
          createdAt: 1,
          count: { 
            $size: '$listAccount'
          }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Bank.countDocuments()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})