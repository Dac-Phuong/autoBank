import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBUser } from "~~/types"
import resp from '../../../utils/resp'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()

    const { password, account} = await readBody(event)
    if (!password || !account) throw 'Vui lòng nhập đầy đủ thông tin'
    
    const user = await DB.User.findOne({
      $or: [
        { password: password },
        { account: account }
      ]
    }).select('account password type block token email') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(user.password != md5(password)) throw 'Mật khẩu không chính xác'
    if(user.block) throw 'Tài khoản của bạn bị đã khóa'
    // Create Token and Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})