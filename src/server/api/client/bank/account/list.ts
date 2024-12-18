import type { IAuth } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { size, current, sort, key, search } = await readBody(event)
    if (!size || !current || !key) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const bank = await DB.Bank.findOne({ key: key }).select('_id')
    if (!bank) throw 'Không tìm thấy ngân hàng'
    
    const match: any = { bank: bank._id, user: auth._id }
 
    if (!!search.key) {
      const regex = new RegExp(search.key.toLowerCase(), 'i');
      const $or = [
        { account: { $regex: regex } },
        { username: { $regex: regex } },
      ];
      match.$or = $or;
    }

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.BankAccount.aggregate([
      { $match: match },
      {$lookup: {
        from: "Bank",
        localField: "bank",
        foreignField: "_id",
        as: "bank"
      }},
      {
        $project: {
          account: 1,
          time: 1,
          username: 1,
          password: 1,
          status: 1,
          updatedAt: 1,
          createdAt: 1,
          option: 1,
          path:1,
          start_date:1,
          expired_date: 1,
          bank: {
            name: 1,
            options: 1
          }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])
    const total = await DB.BankAccount.countDocuments(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})



