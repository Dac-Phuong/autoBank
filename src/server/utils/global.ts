import moment from 'moment';

const FPR = "c7a1beebb9400375bb187daa33de9659";

function getRefNo(username: string): string {
    return `${username}-${getTimeNow()}-98156`;
}

function getTimeNow(): string {
    return moment().format("YYYYMMDDHHmmss") + moment().millisecond().toString().slice(0, -1);
}

function generateDeviceId(): string {
    return `s1rmi184-mbib-0000-0000-${getTimeNow()}`;
}

const defaultHeaders: Record<string, string> = {
    'Cache-Control': 'no-cache',
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Origin": "https://online.mbbank.com.vn",
    "Referer": "https://online.mbbank.com.vn/",
    "Content-Type": "application/json; charset=UTF-8",
    app: "MB_WEB",
};

export {
    getRefNo,
    getTimeNow,
    generateDeviceId,
    defaultHeaders,
    FPR
};
