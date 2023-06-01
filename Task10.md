# Домашнее задание по теме "DCS"

## Установка кластера etcd

Установка etcd поизведена в соотвествии с [инструкцией](https://facsiaginsa.com/etcd/how-to-setup-etcd-cluster).
Состояние кластера etcd:

![etcd status](./task10-status.PNG)

Команды получения состояния кластера:

```
etcdctl member list -w table
ENDPOINTS=$(etcdctl member list | grep -o '[^ ]\+:2379' | paste -s -d,)
etcdctl endpoint status --endpoints=$ENDPOINTS -w table

```

## Проверка чтения/записи

Ниже представлен скриншот выполнения команд записи и чтения:

![etcd put get](./task10-put-get.PNG)

Чтение на другом узле:

![etcd put get](./task10-put-get-another.PNG)

## Проверка отказоустойчивости

Остановил узел (nosql0), являющийся лидером. Состояние кластера, с новым лидером:

![etcd put get](./task10-status-after-fault.PNG)

Чтение и запись выполняются (на узле nosql1):

![etcd put get after fault](./task10-put-get-after-fault.PNG)

Восстановление узла (nosql0):

![etcd put get after fault restore node](./task10-status-after-fault-restore.PNG)

Проверка консистетности данных на восстановлённом узле:

![etcd put get after fault data](./task10-status-after-fault-data.PNG)

Значение по ключу keyAfterFault было записано после отключения узла, и
успешно прочитано на восстановленном узле.
