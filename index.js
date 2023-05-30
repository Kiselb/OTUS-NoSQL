import { createClient } from 'redis';
import { readFileSync } from 'fs';
import { Redis } from 'ioredis';

//const client = createClient({ url: 'redis://10.106.101.133:6379'});
//
//client.on('error', err => console.log('Redis Client Error', err));
//
//await client.connect();
//
//await client.set('key', 'value');
//const value = await client.get('key');
//await client.disconnect();
//
//console.log(value);

const redis = new Redis({
    port: 6379,
    host: "10.106.101.133",
    //enableAutoPipelining: true
});

const raw = readFileSync('city_inspections.json');
const data = JSON.parse(raw);

console.log(`Keys quantity:${data.length}`);
//console.time();

// for(let i = 0; i < data.length; i++) {
//     await redis.set("city:" + data[i].id + ":certificate", data[i].certificate_number);
//     await redis.set("city:" + data[i].id + ":businessname", data[i].business_name);
//     await redis.set("city:" + data[i].id + ":date", data[i].date);
//     await redis.set("city:" + data[i].id + ":result", data[i].result);
//     await redis.set("city:" + data[i].id + ":sector", data[i].sector);
// }

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

// const pipeline = redis.pipeline();

// for(let i = 0; i < data.length; i++) {
//     await pipeline.set("city:" + data[i].id + ":certificate", data[i].certificate_number);
//     await pipeline.set("city:" + data[i].id + ":businessname", data[i].business_name);
//     await pipeline.set("city:" + data[i].id + ":date", data[i].date);
//     await pipeline.set("city:" + data[i].id + ":result", data[i].result);
//     await pipeline.set("city:" + data[i].id + ":sector", data[i].sector);
// }

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

console.time();
//await pipeline.exec();

for(let i = 0; i < 10000; i++) {
    await redis.get("city:10021-2015-ENFO:certificate");
}

//for(let i = 0; i < 10000; i++) {
//    await redis.hgetall("city:10021-2015-ENFO");
//}

console.timeEnd();
