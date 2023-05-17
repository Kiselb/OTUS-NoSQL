# Домашнее задание по теме "Знакомство с ElasticSearch"

## Установка

Установку произвёл локально с использованием docker:
```

docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ELASTIC_USERNAME=elastic -e ELASTIC_PASSWORD=******** elasticsearch:7.5.2

```

Postman коллекция:
```

https://www.postman.com/kiselb/workspace/otus/collection/13026852-b6fd888e-ef5a-48c8-8f2a-e67bed0c03f9

```

Проверка работоспособности запрос GET UP.
