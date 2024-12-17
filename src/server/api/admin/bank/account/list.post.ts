import type { IAuth } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const auth = (await getAuth(event)) as IAuth;
    if (auth.type !== 100) throw "Bạn không phải quản trị viên";

    const { size, current, sort, search } = await readBody(event);
    if (!size || !current || !search) throw "Dữ liệu phân trang sai";
    if (!sort.column || !sort.direction) throw "Dữ liệu sắp xếp sai";

    const sorting: any = {};
    const match: any = {};

    if (!!search.key) {
      if (search.by == "NAME") match["name"] = { $regex: search.key.toLowerCase(), $options: "i" };
    }

    sorting[sort.column] = sort.direction == "desc" ? -1 : 1;

    const list = await DB.BankAccount.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "Bank",
          localField: "bank",
          foreignField: "_id",
          as: "bank"
        }
      },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          account: 1,
          time: 1,
          number: 1,
          password: 1,
          status: 1,
          updatedAt: 1,
          createdAt: 1,
          option: 1,
          start_date: 1,
          expired_date: 1,
          bank: {
            name: 1,
            options: 1
          },
          user: {
            account: 1,
            username: 1
          }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])
    const total = await DB.BankAccount.countDocuments(match);
    return resp(event, { result: { list, total } });
  } catch (error:any) {
    return resp(event, { code: 500, message: error.toString() });
  }
});

