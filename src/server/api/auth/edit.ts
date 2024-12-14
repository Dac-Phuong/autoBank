import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const data = await readBody(event)
    const {username, email, phone, address, cccd  } = data

    const user = await DB.User
    .findOne({ _id: auth._id }) 
    .select('email phone username address cccd') as IDBUser

    if(!!user.email && user.email != email) throw 'Không thể cập nhật lại Email'
    if(!!user.phone && user.phone != phone) throw 'Không thể cập nhật lại Số Điên Thoại'

    if(!user.email && !!email){
      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'
      const userCheck = await DB.User.findOne({ email: email }).select('_id') as IDBUser
      if(userCheck) throw 'Số điện thoại đã được sử dụng'
    }
    if(!user.phone && !!phone){
      if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'
      const userCheck = await DB.User.findOne({ phone: phone }).select('_id') as IDBUser
      if(userCheck) throw 'Số điện thoại đã được sử dụng'
    }
    
    // Update
    await DB.User.updateOne({ _id: auth._id }, {
      username: username ? username.toString() : '',
      email: email ? email.toString() : '',
      phone: phone ? phone.toString() : '',
      cccd: cccd ? cccd.toString() : '',
      address: address ? address.toString() : '',
    })
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})