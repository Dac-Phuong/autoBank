import type { IAuth } from "~~/types";
import resp from "../../../utils/resp";

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
      if (search.by == "NAME")
        match["name"] = { $regex: search.key.toLowerCase(), $options: "i" };
    }
    sorting[sort.column] = sort.direction == "desc" ? -1 : 1;

    const list = await DB.Bank.aggregate([
      { $match: match },
      {
        $project: {
          name: 1,
          image: 1,
          status: 1,
          key: 1,
          display: 1,
          updatedAt: 1,
          options:1
        },
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size },
    ]);
    const total = await DB.Bank.countDocuments(match);
    return resp(event, { result: { list, total } });
  } catch (error:any) {
    return resp(event, { code: 500, message: error.toString() });
  }
});
