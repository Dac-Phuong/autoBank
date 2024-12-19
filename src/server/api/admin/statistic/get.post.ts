import { IDBUser } from "~~/types";
import moment from 'moment';

export default defineEventHandler(async (event) => {
  try {
    const auth = (await getAuth(event)) as IDBUser
    if (auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const { type } = await readBody(event)
    if (!type) throw 'Dữ liệu đầu vào không hợp lệ'

    let startDate: Date, endDate: Date;

    switch (type) {
      case 'today':
        startDate = moment().startOf('day').toDate();
        endDate = moment().endOf('day').toDate();
        break;

      case 'yesterday':
        startDate = moment().subtract(1, 'days').startOf('day').toDate();
        endDate = moment().subtract(1, 'days').endOf('day').toDate();
        break;

      case 'month':
        startDate = moment().startOf('month').toDate();
        endDate = moment().endOf('month').toDate();
        break;

      case 'lastMonth':
        startDate = moment().subtract(1, 'months').startOf('month').toDate();
        endDate = moment().subtract(1, 'months').endOf('month').toDate();
        break;

      default:
        startDate = moment().startOf('day').toDate();
        endDate = moment().endOf('day').toDate();
        break;
    }
    const total = await DB.Payment.find({ status: 1, createdAt: { $gte: startDate, $lt: endDate } }).then(payments => payments.reduce((sum, item: any) => sum + item.money, 0));
    const payment = await DB.Payment.find({ createdAt: { $gte: startDate, $lt: endDate } }).countDocuments();
    const user = await DB.User.find().countDocuments();
    const service = await DB.BankAccount.find().countDocuments();

    const dataChart: any = {
      labels: [],
      data: []
    };

    const listDate = Array.from({ length: 10 }, (_, i) => moment().subtract(9 - i, 'days').startOf('day').toDate());
    
    const startDate1 = moment(listDate[0]).startOf('day').toDate();
    const endDate1 = moment(listDate[listDate.length - 1]).endOf('day').toDate();
    
    const dataPayment = await DB.Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate1,
            $lte: endDate1
          },
          status: 1
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          total: { $sum: "$money" }
        }
      }
    ]);

    const paymentMap = new Map(dataPayment.map((item) => [item._id, item.total]));
      
    listDate.forEach((item) => {
      const date = moment(item).format('YYYY-MM-DD');
      const total = paymentMap.get(date) || 0;

      dataChart.labels.push(date);
      dataChart.data.push(total);
    });

    const data = {
      total,
      payment,
      user,
      service,
      dataChart
    }
    return resp(event, { result: data })
  } catch (error: any) {
    return resp(event, { code: 400, message: error.toString() })
  }
})
