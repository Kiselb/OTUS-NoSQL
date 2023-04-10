# Домашнее задание по лекции "CAP теорема"

## [MongoDB](https://www.mongodb.com/)

MongoDB - это документальная СУБД с поддержкой ACID транзакций. Поддержка
[ACID-транзакций](https://habr.com/ru/articles/555920/) добавленна начиная с версии 4.0 в 2018 году.
Лучшие практики использования транзакций в MongoDB описаны [здесь](https://www.mongodb.com/basics/acid-transactions).

Отказоустойчивость обеспечивается средствами кластера среверов реплик (не менее трёх серверов)
на основе асинхронной репликации по схеме Main-Follower. Асинхронная, означает, что main сервер
получает от follower'а только подтверждение о приёме данных и не дожидается, когда follower
обновит свою реплику. Операции записи осуществляются только через Main-сервер. Чтение осуществляется
также через Main-сервер, но возможен вариант чтения через follower'а, при соответствующих настройках.

По-молчанию, MongoDB является строго согласованной системой (CP-система, в терминалогии CAP-теоремы).
Это изначально заложено при проектировании MongoDB как отказустойчивого
кластера. В качестве консенсус-алгоритма используется [RAFT](https://medium.com/geekculture/raft-consensus-algorithm-and-leader-election-in-mongodb-vs-coachroachdb-19b767c87f95).

Следует отметить, что MongoDB обладает свойством ["настраиваемой согласованности"](https://www.instaclustr.com/blog/cassandra-vs-mongodb/).
Требования согласованности определяются при проектировании прикладной системы. Т.е. MongoDB позволяет управлять уровнем
согласованность-доступность в зависимости от требований приложения. Основным критерием, по которому определяется
уровень согласованности-доступности является понимание соотношения нагрузок на систему по операциям чтения и записи в рамках
разрабатываемого приложения. Если при конфигурировании MongoDB указано, что возможно чтение с follower'ов
то система перестаёт быть строго согласованной - получаем AP-систему. Это связано с тем, что запись по-прежнему
осуществляется через Main, но в силу задержки, вызванной временнем репликации, данные на follower'е
обновятся с запозданием.

## [MS SQL](https://www.microsoft.com/ru-ru/sql-server/sql-server-2019)

Microsoft SQL Server является CA-системой. MS SQL является реляционной СУБД. Изначально MS SQL разрабатывался как система,
обеспечивающая, в том числе, строгую консистетность, отсюда полная поддержка ACID-транзакций. Для поддержки доступности используется пропиетарный
механизм [Server Always On Availability Groups](https://www.sqlshack.com/configure-sql-server-replication-for-a-database-in-sql-server-always-on-availability-groups/), базирующийся на механизме репликации.
В последних версиях добавлены возможности работы с [XML-](https://learn.microsoft.com/ru-ru/sql/relational-databases/xml/xml-data-sql-server?view=sql-server-ver16) и [JSON-](https://learn.microsoft.com/ru-ru/sql/relational-databases/json/json-data-sql-server?view=sql-server-ver16) документами, с поддержкой навигации внутри документов.
В каком-то смысле, MS SQL приобрёл свойства документальной СУБД. Дополнительно, в MS SQL поддержаны [графовые типы данных](https://learn.microsoft.com/ru-ru/sql/relational-databases/graphs/sql-graph-architecture?view=sql-server-ver16).

## [Cassandra](https://cassandra.apache.org/_/index.html)

[Cassandra](https://cassandra.apache.org/_/cassandra-basics.html) - это нереляционная отказоустойчивая распределенная СУБД, рассчитанная на создание высокомасштабируемых и надёжных хранилищ огромных массивов данных, представленных в виде хэша ([столбец-ориентированная СУБД](https://www.techtarget.com/searchdatamanagement/definition/columnar-database)). Модель данных используемых Cassandra описана [здесь](https://www.bigdataschool.ru/wiki/cassandra).

Cassandra – это децентрализованная распределенная система, состоящая из нескольких узлов, по которым распределены данные.
При этом не поддерживается концепция main/follower. Для обмена иформацией между узлами используется протокол GOSSIP.

В Cassandra используется протокол консенсуса [Paxos](https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/dml/dmlLtwtTransactions.html?hl=paxos) для реализации облегченных транзакций, которые могут обрабатывать параллельные операции.

Аналогично MongoDB, Cassandra обладает свойством "настраиваемой согласованности". По-умолчанию
Cassandra является AP-системой. Но как уазано в [статье](https://www.instaclustr.com/blog/cassandra-vs-mongodb/),
Cassandra может быть настроена как строго согласованная (CP-система) за счёт настройки уровней согласованности.

Следует отметить, что в Cassandra планируется реализовать ACID-транзакции с использованием нового протокола консенсуса Accord.
Более подробно написано [здесь](https://www.datanami.com/2022/10/14/cassandra-to-get-acid-transactions-via-new-accord-consensus-protocol/#:~:text=Google%20Cloud%20Spanner%20uses%20Paxos,database%20%E2%80%9Ctable%E2%80%9D%20level).
