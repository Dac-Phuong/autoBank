import { defineEventHandler } from "h3";
import type { IAuth } from "~~/types";

export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IAuth;
    if (user.type !== 100) throw "Bạn không phải quản trị viên";

    const { _id } = await readBody(event);
    if (!_id) throw "Dữ liệu không hợp lệ";

    const check = await DB.Bank.findOne({ _id: _id });
    if (!check) throw "Ngân hàng không tồn tại";

    // if (check.image) {
    //   await deleteImage(check.image);
    // }
    await DB.Bank.findOneAndDelete({ _id: _id });
    return resp(event, { message: "Xóa thành công" });
  } catch (error) {
    return resp(event, { code: 400, message: error.toString() });
  }
});

