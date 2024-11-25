import { defineEventHandler } from 'h3';
import resp from "../../../utils/resp"

export default defineEventHandler(async (event) => {
    try {
        const gates = await DB.Gate.find({ display: false }).select('-key -qrcode -createdAt -updatedAt')
        return resp(event, { result: gates })
    }
    catch (e: any) {
        return resp(event, { result: [] })
    }
})