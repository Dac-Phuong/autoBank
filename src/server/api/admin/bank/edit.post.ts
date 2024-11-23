import { defineEventHandler } from 'h3'
import type { IAuth } from "~~/types";

export default defineEventHandler(async (event) => {
try {
  const user = (await getAuth(event)) as IAuth;
  if (user.type !== 100) throw "Bạn không phải quản trị viên";
  const body = await readBody(event);

  const { _id, name } = body;
  if (!_id) throw "Dữ liệu đầu vào không hợp lệ";
  if(!name) throw "Vui nhập tên ngân hàng"

  const check = await DB.Bank.findOne({ _id: _id }).select("name");
  if (!check) throw "Ngân hàng không tồn tại";

  if (name && name != check.name) {
    const slug = formatVNString(event, name, "-");
    const checkName = await DB.Bank.findOne({ name }).select("_id");
    if (!!checkName) throw "Tên ngân hàng đã tồn tại";
    body.slug = slug;
  }
  
  delete body['_id']
  await DB.Bank.findOneAndUpdate({ _id: _id }, body,{ new: true });
  return resp(event, { message: "Sửa thành công" });
} catch (error) {
  return resp(event, { code: 400, message: error.toString() });
}
})
