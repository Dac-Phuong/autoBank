import type {IAuth , IDBUser} from '~~/types'
export default defineEventHandler(async (event) => {
    try {
        const auth = await getAuth(event) as IAuth
        if (auth.type < 1) throw "Bạn không phải quản trị viên cao cấp";
        const { _id, coin, wheel, reason } = await readBody(event)
        if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
        if(!reason) throw 'Vui lòng nhập lý do'
        if(!!isNaN(parseInt(coin)) || parseInt(coin) < 0 ) throw 'Dữ liệu tiền tệ không hợp lệ'
        if(!!isNaN(parseInt(wheel)) || parseInt(wheel) < 0 ) throw 'Dữ liệu tiền tệ không hợp lệ'
        const user = await DB.User.findOne({ _id: _id }).select('currency') as IDBUser
        if(!user) throw 'Người dùng không tồn tại'
        await DB.User.findOneAndUpdate({ _id: _id }, { '$inc': { 'currency.coin': parseInt(coin), 'currency.wheel': parseInt(wheel) } }, { new: true }).select('currency') as IDBUser
        return resp(event, { message: 'Sửa tiền tệ thành công' })
    } catch (e: any) {
        return resp(event, { code: 400, message: e.toString() })
    }
})