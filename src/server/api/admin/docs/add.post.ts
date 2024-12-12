import type { IAuth } from "~~/types";
import logAdmin from "../../../utils/logAdmin";

export default defineEventHandler(async (event) => {
  try {
    const auth = (await getAuth(event)) as IAuth;
    if (auth.type !== 100) throw "Bạn không phải quản trị viên";

    const body = await readBody(event);
    const { category, name, display } = body;

    if (!category || !name ) throw "Dữ liệu đầu vào không hợp lệ";

    const categoryCheck = await DB.Category.findOne({ _id: category }).select("_id name");
    if (!categoryCheck) throw "Danh mục không tồn tại";

    const check = await DB.Docs.findOne({ name: name }).select("_id");
    if (!!check) throw "Tên tài liệu đã tồn tại";

    await DB.Docs.create(body);
    logAdmin(event, `Thêm tài liệu <b>${name}</b>`);

    return resp(event, { message: "Thêm tài liệu thành công" });
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() });
  }
});
