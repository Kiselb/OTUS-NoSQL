let cassandra = require('cassandra-driver');

async function wrireRow(client, id, app_name, env, hostname, log_datetime, log_level, log_message) {
    try {
        const query = 'INSERT INTO applications.logs (id, app_name, env, hostname, log_datetime, log_level, log_message) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await client.execute(query,
            [id, app_name, env, hostname, log_datetime, log_level, log_message],
            { prepare: true }
            )
            .then(result => result)
            .catch((err) => {console.log('ERROR:', err);});
    } catch(error) {
        console.log(`Error: ${error}`);
    }
}
async function writeBlock() {
    let contactPoints = ['nosql3.group.legion.ru'];
    let localDataCenter = 'datacenter1';
    let client = new cassandra.Client({contactPoints: contactPoints, localDataCenter: localDataCenter, keyspace:'applications'});

    let id = 1000;
    let log_timestamp = 1684148238051

    try {
        for(let app_index = 0; app_index < 100; app_index++) {
            for(let env_index = 0; env_index < 10; env_index++) {
                for(let host_index = 0; host_index < 100; host_index++) {
                    for(let fact_index = 0; fact_index < 10; fact_index++) {
                        for(let log_level_index = 0; log_level_index < 5; log_level_index++) {
                            await wrireRow(client, id, 'app_' + app_index, 'env_' + env_index, 'host_' + host_index, new Date(log_timestamp), 'LEVEL_' + log_level_index, 'app_' + app_index + 'env_' + env_index + 'host_' + host_index)
                            id = id + 1;
                            log_timestamp = log_timestamp + 750;
                        }
                    }
                }
            }
        }
    } catch(error) {
        console.log(`Error: ${error}`);
    } finally {
        client.shutdown();
    }
}

writeBlock();
