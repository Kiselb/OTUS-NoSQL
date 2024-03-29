# Домашнее задание на тему "Облака"

## Настройка MongoDB-кластера в YandexCloud

Настройка MongoDB-кластера произведена в соответствии с (инструкцией)[https://cloud.yandex.ru/docs/managed-mongodb/operations/cluster-list].

Кластер собран из 3-х нешардированных реплик. Подключение к кластеру осуществлялось с помощью MongoDB Compass Community.
На скриншотах ниже представлено состояние кластера.

![cluster](./task14-yc-cluster.PNG)

![cluster](./task14-yc-hosts.PNG)

![cluster](./task14-cluster-state.PNG)

## Загрузка данных

Загрузил данные о книгах с предложенного [ресурса](https://github.com/ozlerhakan/mongodb-json-files). Загрузку произвёл средствами
импорта данных MongoDB Compass Community. Состояние после загрузки:

![cluster books](./task14-cluster-books.PNG)

Надо признать, что загрузка данных прошла достаточно быстро.

## Запросы на выборку
### Запрос на выборку книг по JavaScript, выпущенных начиная с 01.01.2013 включительно

![mongodb-find-books](./task14-find-01.PNG)

### Запрос на выборку книг, автором которых, является Robi Sen

![mongodb-find-books](./task14-find-02.PNG)

Запросы выполняются мгновенно, заметного замедления выполнения запросов не наблюдалось.
