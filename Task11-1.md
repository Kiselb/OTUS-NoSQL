# Домашнее задание на тему "Сравнение с неграфовыми БД"

В данной работе будет проводится сравнение с MS SQL Server. В [книге](https://dmkpress.com/catalog/computer/databases/978-5-97060-201-0/),
посвящённой neo4j, упоминается, что возникновение neo4j было обусловлено, в том числе, и неудачными попытками реализовать графовую модель
средствами реляционной базы данных. Под средствами реляционной СУБД не подразумеваются специализированные расширения СУБД поддержки графовых моделей. Для MS SQL Server такие [средства](https://www.red-gate.com/simple-talk/databases/sql-server/t-sql-programming-sql-server/sql-server-graph-databases-part-1-introduction/) реализованы и поддерживаются с 2017 года. Но, вполне возможно реализовать простые случаи графов нативными средствами реляционной СУБД. Например, иерархические структуры - деревья. Запросы для работы с деревьями вполне понятны и просты, благодаря рекурсивным *CTE (common table expressions)*. Но в целом, реализовать
нативными средствами реляционной СУБД полноценную поддержку графовой модели, с обеспечением хорошего уровня производительности для графов с миллиардами узлов, вряд ли
возможно. Преодоление семантического разрыва между табличной и графовой парадигмами может превратится в трудно разрешимую задачу. 

## Базовые таблицы

### Таблица узлов

Таблица узлов содержит идентификаторы узлов, входящих в описание графа. Узлы вынесены в отдельную таблицу поскольку
необходимо иметь возможность задавать метки (здесь используется тип узла) и свойства для каждого конкретного узла.

```

CREATE TABLE [dbo].[GRAPH_Nodes](
	[NodeID] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_GRAPH_Nodes] PRIMARY KEY CLUSTERED 
(
	[NodeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

```

### Таблица типов узлов (меток узлов)

Таблица типов узлов - это возможные метки для узлов в графе. Один узел может быть помечен несколькими метками - т.е. связан с несколькими различными типами (таблица **GRAPH_NodeTypesNodes** - см. ниже)

```

CREATE TABLE [dbo].[GRAPH_NodeTypes](
	[NodeTypeID] [int] NOT NULL,
	[NodeTypeName] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_GRAPH_NodeTypes] PRIMARY KEY CLUSTERED 
(
	[NodeTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_GRAPH_NodeTypes] UNIQUE NONCLUSTERED 
(
	[NodeTypeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

```

### Таблица связанных типов (меток) с узлами

Таблица содержит метки конкретных узлов

```

CREATE TABLE [dbo].[GRAPH_NodeTypesNodes](
	[NodeID] [int] NOT NULL,
	[NodeTypeID] [int] NOT NULL,
 CONSTRAINT [PK_GRAPH_NodeTypesNodes] PRIMARY KEY CLUSTERED 
(
	[NodeID] ASC,
	[NodeTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[GRAPH_NodeTypesNodes]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_NodeTypesNodes_GRAPH_Nodes] FOREIGN KEY([NodeID])
REFERENCES [dbo].[GRAPH_Nodes] ([NodeID])
GO

ALTER TABLE [dbo].[GRAPH_NodeTypesNodes] CHECK CONSTRAINT [FK_GRAPH_NodeTypesNodes_GRAPH_Nodes]
GO

ALTER TABLE [dbo].[GRAPH_NodeTypesNodes]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_NodeTypesNodes_GRAPH_NodeTypes] FOREIGN KEY([NodeTypeID])
REFERENCES [dbo].[GRAPH_NodeTypes] ([NodeTypeID])
GO

ALTER TABLE [dbo].[GRAPH_NodeTypesNodes] CHECK CONSTRAINT [FK_GRAPH_NodeTypesNodes_GRAPH_NodeTypes]
GO

```
### Таблица типов свойств узлов

Таблица содержит допустимые типы свойств узлов. За скобками остался вопрос о типе свойства: *int*, *bit*, *nvarchar* и т.д. Я не стал это реализовывать, поскольку схема базы данных и без того получается развесистой. В данной релизации предполагается, что значения свойств имеют тип *nvarchar(4000)*.

```

CREATE TABLE [dbo].[GRAPH_NodeProperties](
	[PropertyID] [int] IDENTITY(1,1) NOT NULL,
	[PropertyName] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_GRAPH_NodeProperties] PRIMARY KEY CLUSTERED 
(
	[PropertyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

```

### Таблица свойств конкретных узлов

Таблица содержит конкретные значения свойств конкретных узлов

```

CREATE TABLE [dbo].[GRAPH_NodeProperiesNodes](
	[NodeID] [int] NOT NULL,
	[PropertyID] [int] NOT NULL,
	[PropertyValue] [nvarchar](4000) NOT NULL,
 CONSTRAINT [PK_GRAPH_NodeProperiesNodes] PRIMARY KEY CLUSTERED 
(
	[NodeID] ASC,
	[PropertyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[GRAPH_NodeProperiesNodes]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_NodeProperiesNodes_GRAPH_NodeProperties] FOREIGN KEY([PropertyID])
REFERENCES [dbo].[GRAPH_NodeProperties] ([PropertyID])
GO

ALTER TABLE [dbo].[GRAPH_NodeProperiesNodes] CHECK CONSTRAINT [FK_GRAPH_NodeProperiesNodes_GRAPH_NodeProperties]
GO

```

### Таблица типов связей

```

CREATE TABLE [dbo].[GRAPH_LinkTypes](
	[LinkTypeID] [int] IDENTITY(1,1) NOT NULL,
	[LinkTypeName] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_GRAPH_LinkTypes] PRIMARY KEY CLUSTERED 
(
	[LinkTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_GRAPH_LinkTypes] UNIQUE NONCLUSTERED 
(
	[LinkTypeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

```

### Таблица допустимых свойств связей

```

CREATE TABLE [dbo].[GRAPH_LinkProperties](
	[PropertyID] [int] IDENTITY(1,1) NOT NULL,
	[PropertyName] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_GRAPH_LinkProperties] PRIMARY KEY CLUSTERED 
(
	[PropertyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_GRAPH_LinkProperties] UNIQUE NONCLUSTERED 
(
	[PropertyName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

```
### Таблица значений конкретных свойств конкретных связей

Поле LinkID - конкретная связь между конкрентными узлами графа (таблица **GRAPH_Links** - см. ниже)

```

CREATE TABLE [dbo].[GRAPH_LinkPropertiesLinks](
	[LinkID] [int] NOT NULL,
	[PropertyID] [int] NOT NULL,
	[PropertyValue] [nvarchar](4000) NOT NULL,
 CONSTRAINT [PK_GRAPH_LinkPropertiesLinks] PRIMARY KEY CLUSTERED 
(
	[LinkID] ASC,
	[PropertyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[GRAPH_LinkPropertiesLinks]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_LinkPropertiesLinks_GRAPH_LinkProperties] FOREIGN KEY([PropertyID])
REFERENCES [dbo].[GRAPH_LinkProperties] ([PropertyID])
GO

ALTER TABLE [dbo].[GRAPH_LinkPropertiesLinks] CHECK CONSTRAINT [FK_GRAPH_LinkPropertiesLinks_GRAPH_LinkProperties]
GO

```

### Таблица графов

Ключ таблицы поле *LinkID* - идентификатор связи между узлами графа: *OriginNodeID* и *TargetNodeID*. Поле *LinkTypeID* - тип (метка) связи. У связи может быть только одна метка.
Свойства узлов, задаваемых полями *OriginNodeID* и *TargetNodeID*, определяются в таблице **GRAPH_NodeProperiesNodes**.

```

CREATE TABLE [dbo].[GRAPH_Links](
	[LinkID] [int] IDENTITY(1,1) NOT NULL,
	[OriginNodeID] [int] NOT NULL,
	[TargetNodeID] [int] NOT NULL,
	[LinkTypeID] [int] NOT NULL,
 CONSTRAINT [PK_GRAPH_Links] PRIMARY KEY CLUSTERED 
(
	[LinkID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[GRAPH_Links]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_Links_GRAPH_LinkTypes] FOREIGN KEY([LinkTypeID])
REFERENCES [dbo].[GRAPH_LinkTypes] ([LinkTypeID])
GO

ALTER TABLE [dbo].[GRAPH_Links] CHECK CONSTRAINT [FK_GRAPH_Links_GRAPH_LinkTypes]
GO

ALTER TABLE [dbo].[GRAPH_Links]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_Links_GRAPH_Nodes] FOREIGN KEY([OriginNodeID])
REFERENCES [dbo].[GRAPH_Nodes] ([NodeID])
GO

ALTER TABLE [dbo].[GRAPH_Links] CHECK CONSTRAINT [FK_GRAPH_Links_GRAPH_Nodes]
GO

ALTER TABLE [dbo].[GRAPH_Links]  WITH CHECK ADD  CONSTRAINT [FK_GRAPH_Links_GRAPH_Nodes1] FOREIGN KEY([TargetNodeID])
REFERENCES [dbo].[GRAPH_Nodes] ([NodeID])
GO

ALTER TABLE [dbo].[GRAPH_Links] CHECK CONSTRAINT [FK_GRAPH_Links_GRAPH_Nodes1]
GO

```

### Схема базы данных

Ниже представлена схема Базы Данных

![graph schema](./Task11-1-schema.PNG)


## Сравнение команд по работе с данными

### Добавление двух узлов и связи между ними

Ниже приведена последовательность команд для создания двух узлов и связи, предполагается, что граф пуст.
Узлы: Alice, Bob. Связь: Alice MANAGES Bob.

```

BEGIN TRANSACTION

DECLARE @NodeTypeID INT

-- Создание типа (метки) узла WORKER - сотрудник
INSERT INTO dbo_GRAPH_NodeTypes (NodeTypeName) VALUES ('WORKER')
SET NodeTypeID = SCOPE_IDENTITY()

-- Создания свойства узла NAME - имя сторудника
DECLARE @PropertyID INT

INSERT INTO dbo_GRAPH_NodeProperties (PropertyName) VALUES('NAME')
SET @PropertyID = SCOPE_IDENTITY()

-- Создание узла Alice
DECLARE @NodeOriginID INT

INSERT INTO dbo_GRAPH_Nodes DEFAULT VALUES
SET @NodeOriginID = SCOPE_IDENTITY()

INSERT INTO dbo_GRAPH_NodeTypesNodes (NodeID, NodeTypeID) VALUES (@NodeOriginID, @NodeTypeID)
INSERT INTO dbo_GRAPH_NodeProperiesNodes (NodeID, PropertyID, PropertyValue) VALUES (@NodeOriginID, @PropertyID, 'Alice')

-- Создание узла Bob
DECLARE @NodeTargetID INT

INSERT INTO dbo_GRAPH_Nodes DEFAULT VALUES
SET @NodeTargetID = SCOPE_IDENTITY()

INSERT INTO dbo_GRAPH_NodeTypesNodes (NodeID, NodeTypeID) VALUES (@NodeTargetID, @NodeTypeID)
INSERT INTO dbo_GRAPH_NodeProperiesNodes (NodeID, PropertyID, PropertyValue) VALUES (@NodeTargetID, @PropertyID, 'Bob')

-- Создание связи Alice - MANAGES -> Bob (Alice управлет Bob'ом)
DECLARE @LinkTypeID INT

INSERT INTO dbo_GRAPH_LinkTypes (LinkTypeName) VALUES ('MANAGES')
SET @LinkTypeID = SCOPE_IDENTITY()

DECLARE @LinkID INT

INSERT INTO dbo_GRAPH_Links (OriginNodeID, TargetNodeID, LinkTypeID) VALUES (@OriginNodeID, @TargetNodeID, @LinkTypeID)
SET @LinkID = SCOPE_IDENTITY()

COMMIT TRANSACTION

```

Да, многословно получилось. А всего-то требуется добавить одно ребро графа: Alice - MANAGES -> Bob (Alice управлет Bob'ом).
В Neo4j всё намного проще:

```

CREATE  (alice: WORKER { name: 'Alice' }),
        (bob: WORKER { name: 'Bob' }),
        (alice)-[:MANAGES]->(bob)

```

### Выборка данных

Попробуем выбрать всех сотрудников, которыми руководят все подчинённые Alice (выбрать подчинённых подчинённым Alice). Т.е. предположим,
что у нас есть многоуровневая иерархия Руководитель-Подчинённый (WORKER-MANAGES->WORKER-MANAGES->WORKER- ...).

```

DECLARE @AliceNodeID INT

SELECT
    @AliceNodeID = NodeID
FROM
    dbo_GRAPH_Nodes N
    INNER JOIN dbo_GRAPH_NodeTypesNodes NT ON NT.NodeID = N.NodeID
    INNER JOIN dbo_GRAPH_NodeTypes T ON T.NodeTypeID = NT.NodeTypeID
    INNER JOIN dbo_GRAPH_NodeProperiesNodes NP ON NP.NodeID = N.NodeID
    INNER JOIN dbo_GRAPH_NodeProperties P ON P.PropertyID = NP.PropertyID
WHERE
    T.NodeTypeName = 'WORKER'
    AND P.PropertyName = 'NAME'
    AND NP.PropertyValue = 'Alice'

SELECT
    L1.TargetNodeID, NP.PropertyValue
FROM
    dbo_GRAPH_Links L0
    INNER JOIN dbo_GRAPH_Links L1 ON L1.OriginNodeID = L0.TargetNodeID
    INNER JOIN dbo_GRAPH_NodeTypesNodes NT ON NT.NodeID = L1.NodeID
    INNER JOIN dbo_GRAPH_NodeTypes T ON T.NodeTypeID = NT.NodeTypeID
    INNER JOIN dbo_GRAPH_NodeProperiesNodes NP ON NP.NodeID = L1.NodeID
    INNER JOIN dbo_GRAPH_NodeProperties P ON P.PropertyID = NP.PropertyID
    INNER JOIN dbo_GRAPH_LinkTypes LT0 ON LT0.LinkTypeID = L0.LinkTypeID
    INNER JOIN dbo_GRAPH_LinkTypes LT1 ON LT1.LinkTypeID = L1.LinkTypeID
WHERE
    L0.OriginNodeID = @AliceNodeID
    AND T.NodeTypeName = 'WORKER'
    AND P.PropertyName = 'NAME'
    AND LT0.LinkTypeName = 'MANAGES'
    AND LT1.LinkTypeName = 'MANAGES'

```

Опять же, в Neo4j гораздо проще:

```

MATCH (:WORKER {name: 'Alice'})-[:MANAGES]->(:WORKER)-[:MANAGES]->(workers:WORKER)
RETURN workers.name

```

А что делать, если необходимо получить всех сотрудников поддерева относительно *Alice*?
Ведь глубина связей заранее не известна. В Neo4j задача решается просто:

```

MATCH (:WORKER {name: 'Alice'})-[:MANAGES*]->(workers:WORKER)
RETURN workers.name

```

Можно попробовать сформулировать рекурсивный запрос с помощью рекурсивного *CTE (common table expressions)*. Это будет выглядеть примерно так:

```

WITH workers_cte (NodeID)
AS (
    SELECT @AliceNodeID AS NodeID
    UNION ALL
    SELECT L.TargetNodeID AS NodeID
    FROM
        dbo_GRAPH_Links L
        INNER JOIN workers_cte C ON C.NodeID = L.OriginNodeID
        INNER JOIN dbo_GRAPH_LinkTypes LT ON LT.LinkTypeID = L.LinkTypeID
    WHERE
        L.LinkTypeName = 'MANAGES'
)
SELECT
    NP.Name
FROM
    workers_cte N
    INNER JOIN dbo_GRAPH_NodeTypesNodes NT ON NT.NodeID = N.NodeID
    INNER JOIN dbo_GRAPH_NodeTypes T ON T.NodeTypeID = NT.NodeTypeID
    INNER JOIN dbo_GRAPH_NodeProperiesNodes NP ON NP.NodeID = N.NodeID
    INNER JOIN dbo_GRAPH_NodeProperties P ON P.PropertyID = NP.PropertyID
WHERE
    T.NodeTypeName = 'WORKER'
    AND P.PropertyName = 'NAME'
OPTION (MAXRECURSION 0);

```

Но этот запрос работает только в одну сторону - вниз по иерархии. Для получения всего подграфа, независимо от направления связи,
данный запрос не подходит. Если в графе есть циклы, то и в этом случае запрос не подойдёт - зациклится и никогда не завершится.

## Выводы

Попытка реализовать графовую базу данных нативными средствами реляционной СУБД возможна для решения конкретных специфичных задач, например,
древовидных структур. Общего решения, по моему мнению, быть не может. Поэтому, если предметная область хорошо описывается графовой моделью, то
следует использовать графовую базу данных.
