import type { IAuth } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { size, current, sort, slug } = await readBody(event)
    if (!size || !current || !slug) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    const bank = await DB.Bank.findOne({ slug: slug }).select('_id')
    if (!bank) throw 'Không tìm thấy ngân hàng'
    
    const match: any = { bank: bank._id }
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.BankAccount.aggregate([
      { $match: match },
      {
        $project: {
          name: 1,
          number: 1,
          status: 1,
          updatedAt: 1,
          createdAt: 1,
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

