import { readFileSync } from 'fs';
import { Redis } from 'ioredis';

const redis = new Redis({
    port: 6379,
    host: "10.106.101.133",
    // Uncomment for testing Pipeline Mode
    //enableAutoPipelining: true
});

const raw = readFileSync('city_inspections.json');
const data = JSON.parse(raw);

console.log(`Keys quantity:${data.length}`);

//
// Command Mode
//
// Load string type data
//
//console.time();
// for(let i = 0; i < data.length; i++) {
//     await redis.set("city:" + data[i].id + ":certificate", data[i].certificate_number);
//     await redis.set("city:" + data[i].id + ":businessname", data[i].business_name);
//     await redis.set("city:" + data[i].id + ":date", data[i].date);
//     await redis.set("city:" + data[i].id + ":result", data[i].result);
//     await redis.set("city:" + data[i].id + ":sector", data[i].sector);
// }
//console.timeEnd();

//
// Load hset type data
//
//console.time();
// for(let i = 0; i < data.length; i++) {
//     await redis.hset("city:" + data[i].id,
//         {
//             certificate: data[i].certificate_number,
//             businessname: data[i].business_name,
//             date: data[i].date,
//             result: data[i].result,
//             sector: data[i].sector
//         }
//     );
// }
//console.timeEnd();

//
// Pipeline Mode
//
// const pipeline = redis.pipeline();
//
// Load string type data
//
// for(let i = 0; i < data.length; i++) {
//     await pipeline.set("city:" + data[i].id + ":certificate", data[i].certificate_number);
//     await pipeline.set("city:" + data[i].id + ":businessname", data[i].business_name);
//     await pipeline.set("city:" + data[i].id + ":date", data[i].date);
//     await pipeline.set("city:" + data[i].id + ":result", data[i].result);
//     await pipeline.set("city:" + data[i].id + ":sector", data[i].sector);
// }
//
// Load hset type data
//
// for(let i = 0; i < data.length; i++) {
//     await pipeline.hset("city:" + data[i].id,
//         {
//             certificate: data[i].certificate_number,
//             businessname: data[i].business_name,
//             date: data[i].date,
//             result: data[i].result,
//             sector: data[i].sector
//         }
//     );
// }
//
//console.time();
//await pipeline.exec();
//console.timeEnd();
//

//
// Data reading timings
//
//console.time();
//for(let i = 0; i < 10000; i++) {
//    await redis.get("city:10021-2015-ENFO:certificate");
//}
//console.timeEnd();
//
//console.time();
//for(let i = 0; i < 10000; i++) {
//    await redis.hgetall("city:10021-2015-ENFO");
//}
//console.timeEnd();
