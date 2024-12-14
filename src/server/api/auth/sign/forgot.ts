import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IDBUser
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(!!auth.block) throw 'Tài khoản của bạn đang bị khóa'

    const runtimeConfig = useRuntimeConfig()
    const { oldPass, newPass, confirmPass } = await readBody(event)
    if(!oldPass || !newPass || !confirmPass) throw 'Vui lòng nhập đủ thông tin'

    if (oldPass.length < 6 || oldPass.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!oldPass.match(/\s/g)) throw 'Mật khẩu không được có khoảng cách'

    if (newPass.length < 6 || newPass.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!newPass.match(/\s/g)) throw 'Mật khẩu không được có khoảng cách'

    if (confirmPass.length < 6 || confirmPass.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!confirmPass.match(/\s/g)) throw 'Mật khẩu không được có khoảng cách'


    const user = await DB.User.findOne({ _id: auth._id}).select('password block type') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(user.type == 100) throw 'Không thể lấy lại mật khẩu của quản trị viên'
    if(!!user.block) throw 'Tài khoản đang bị khóa, không thể lấy lại mật khẩu'
    if(md5(oldPass) != user.password) throw 'Mật khẩu hiện tại không đúng'
    if (newPass != confirmPass) throw 'Mật khẩu không khớp'

    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.password = md5(newPass)
    user.token = token
    await user.save()
 
    // const IP = getRequestIP(event, { xForwardedFor: true })
    // logUser(event, user._id, `Thao tác lấy lại <b>mật khẩu</b> tài khoản bằng IP <b>${IP}</b>`)

    return resp(event, { message: 'Đổi mật khẩu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})