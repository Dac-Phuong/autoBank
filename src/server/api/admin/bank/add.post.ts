import { defineEventHandler } from "h3";
import formatVNString from "../../../utils/formatVNString";
import { IAuth } from "~~/types";
export default defineEventHandler(async (event) => {
  try {
    const user = (await getAuth(event)) as IAuth;
    if (user.type !== 100) throw "Bạn không phải quản trị viên";
    const body = await readBody(event);
    const { name, image } = body;
    if (!name || !image ) throw "Vui lòng nhập đầy đủ dữ liệu";
    if (!name.match(/^[a-zA-Z0-9\s]+$/)) throw "Dữ liệu ngân hàng sai";

    const check = await DB.Bank.findOne({ name }).select("_id");
    if (!!check) throw "Tên ngân hàng đã tồn tại";

    const key = formatVNString(event, name, "-");
    body.key = key;

    await DB.Bank.create(body);
    return resp(event, { message: "Thêm thành công" });
  } catch (error:any) {
    return resp(event, { code: 400, message: error.toString() });
  }
});
