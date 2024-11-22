import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { account, password, email, phone } = await readBody(event)
    if (!account) throw 'Vui lòng nhập tài khoản'
    if (account.length < 6 || account.length > 15) throw 'Tài khoản trong khoảng 6-15 ký tự'
    if (!!account.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(account)) throw 'Tài khoản không có ký tự đặc biệt và viết hoa'
    if (!!account.includes('admin') || !!account.includes('smod') || !!account.includes('robot')) throw 'Tài khoản không hợp lệ'

    if (!email) throw 'Vui lòng nhập Email'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'

    if (!phone) throw 'Vui lòng nhập số điện thoại'
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'

    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    // Check User
    const userCheck = await DB.User
    .findOne({ 
      $or: [
        { account: account },
        { phone: phone },
        { email: email }
      ]
    })
    .select('account email phone') as IDBUser
    
    if(!!userCheck){
      if(userCheck.account == account) throw 'Tài khoản đã tồn tại'
      if(userCheck.phone == phone) throw 'Số điện thoại đã tồn tại'
      if(userCheck.email == email) throw 'Địa chỉ Email đã tồn tại'
    }

    // Create
    const user = await DB.User.create({
      account: account,
      password: md5(password),
      phone: phone,
      email: email,
    })

    // Make Token And Cookie
    const token = jwt.sign({
        _id : user._id
      }, runtimeConfig.apiSecret, { expiresIn: '360d' })
    setCookie(event, 'token-auth', token, runtimeConfig.public.COOKIE_CONFIG)
    user.token = token
    await user.save()

    return resp(event, { message: 'Đăng ký thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
