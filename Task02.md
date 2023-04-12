# Домашнее задание по теме "Базовые возможности MongoDB"
## Установка MongoDB
Установку производил согласно [инструкции](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/). Предложенный
в материалах к занятию скрипт установки выполнить не удалось. Видимо, из-за различий в версии ОС. Ниже на скриншотах
представлено состояние сервиса mongod и запущенная консоль mongosh.

![mongod status](./task02-mongod.PNG)

![mongosh](./task02-mongosh.PNG)

Для подключения и работы с MongoDB я использовал MongoDB Compass Community:

![mongo-compass-community](./task02-mongodb-compass.PNG)

Загрузил данные о книгах с предложенного [ресурса](https://github.com/ozlerhakan/mongodb-json-files). Загрузку произвёл средствами
импорта данных MongoDB Compass Community. Состояние после загрузки:

![mongodb-compass-community-books](./task02-mongodb-books.PNG)

## Запросы на выборку
### Запрос на выборку книг по JavaScript, выпущенных начиная с 01.01.2013 включительно

![mongodb-find-books](./task02-find-01.PNG)

### Запрос на выборку книг, автором которых, является Robi Sen

![mongodb-find-books](./task02-find-02.PNG)

План выполнения запроса:

![mongodb-find-books](./task02-find-02-plan.PNG)

После добавления индекса по полю Authors, план выглядит так:

![mongodb-find-books](./task02-find-02-index.PNG)

Видно, что после создания индекса по полю Authors, актуальное время выполнения запроса поиска книг по автору
изменилось драматически: с 24ms до 0ms.

## Запрос на обновление

Изменение названия книги с _id: 2. Исходное название: "Android in Action, Second Edition",
после обновления: "Android in Action, 2-nd Edition"

![mongodb-update-books](./task02-update-01.PNG)
