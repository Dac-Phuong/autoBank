import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event) as IAuth
    if (!user) throw 'Vui lòng đăng nhập'

    const list = await DB.Category.aggregate([
      {
        $lookup: {
          from: 'Docs', 
          localField: '_id', 
          foreignField: 'category', 
          as: 'docs', 
        },
      },
      {
        $addFields: {
          docs: {
            $filter: {
              input: '$docs',
              as: 'doc',
              cond: { $eq: ['$$doc.display', true] }, 
            },
          },
        },
      },
      {
        $project: {
          name: 1, 
          docs: {
            name: 1, 
            content: 1,
            createdAt: 1, 
          },
        },
      },
      {
        $sort: {
          'docs.createdAt': -1,
        },
      },
    ]).exec();
    
    return resp(event, { result: list })

  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

