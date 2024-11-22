import md5 from 'md5'
import type {IAuth , IDBUser} from '~~/types'
export default defineEventHandler(async (event) => {
    try {
        const auth = await getAuth(event) as IAuth
        if (auth.type != 100) throw "Bạn không phải quản trị viên cao cấp";

        const { _id, email,phone, password, type, block } = await readBody(event)
        if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
        if(type < 0 || type > 100) throw 'Dữ liệu quyền hạn không hợp lệ'
        if(email && !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g)) throw 'Định dạng email không đúng'

        if(phone && !phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)) throw 'Số điện thoại không hợp lệ'
        
        const user = await DB.User.findOne({ _id: _id }).select('account email phone type') as IDBUser
        if(!user) throw 'Người dùng không tồn tại'

        const update : any = { type: type }
        if(!! email && user.email != email) {
            const check = await DB.User.findOne({ email: email }).select('_id')
            if(!!check) throw 'Email đã tồn tại'
            update['email'] = email
        }
        if(!! phone && user.phone != phone) {
            const check = await DB.User.findOne({ phone: phone }).select('_id')
            if(!!check) throw 'Số điện thoại đã tồn tại'
            update['phone'] = phone
        }
        if(!!password){
            update['password'] = md5(password)
        }
        if(user.type != type) {
            update['type'] = type
        }
        if(user.block != type) {
            update['block'] = block
        }
        await DB.User.findOneAndUpdate({ _id: _id }, update, { new: true })
        return resp(event, { message: 'Sửa thông tin thành công' })
    } catch (e: any) {
        return resp(event, { code: 400, message: e.toString() })
    }
})