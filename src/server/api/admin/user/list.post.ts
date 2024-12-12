import type { IAuth } from "~~/types";
import resp from "../../../utils/resp";

export default defineEventHandler(async (event) => {
  try {
    const auth = (await getAuth(event)) as IAuth;
    if (auth.type < 1) throw "Bạn không phải quản trị viên cao cấp";
    const { size, current, sort, search } = await readBody(event);
    if (!size || !current || !search) throw "Dữ liệu phân trang sai";
    if (!sort.column || !sort.direction) throw "Dữ liệu sắp xếp sai";
    const sorting: any = {};
    const match: any = {};
    if(!!search.key){
      if(search.by == 'ACCOUNT') match['account'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'MAIL') match['email'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'PHONE') match['phone'] = { $regex : search.key, $options : 'i' }
    }
    sorting[sort.column] = sort.direction == "desc" ? -1 : 1;

    const list = await DB.User.aggregate([
      { $match: match },
      {
        $project: {
          account: 1,
          email: 1,
          block: 1,
          type: 1,
          phone:1,
          coin: "$currency.coin",
          createdAt: 1,
        },
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size },
    ]);
    const total = await DB.User.countDocuments(match);
    return resp(event, { result: { list, total } });
  } catch (error:any) {
    return resp(event, { code: 500, message: error.toString() });
  }
});
