# Домашнее задание на тему "Сценарии применения графовой базы данных"

## Сценарий 1. Описание конструкции машин и механизмов
Предлагается использовать графовую модель для описания конструкции (сборки) машин и механизмов.
Идея заключается в следующем. Каждый механизм состоит из узлов и деталей. Каждый
узел состоит из более мелких узлов и деталей. И так далее до конечных деталей.

Деталь от узла концептуально отличается только одним - узел может включать в себя иные детали,
а деталь самодостаточна - не может включать в себя другие детали.

Что это даст, какие преимущества? Любой сложный механим по сути - это иерархия, корнем которой,
является собственно механизм. Вершины (промежуточные узлы) иерархии - узлы, из которых формируется механизм.
Вершины-листья - детали. Полный обход графа даст полный перечень (название и количество) необходимых деталей и/или узлов 
для сборки изделия. Если каждый узел снабдить свойством "трудоёмкость" - время необходимое для изготовления детали или
сборки узла (измеряется в секундах), то можно вычислить трудоемкость всего изделия. Дополнительно, можно в свойствах
указать стоимость узла или детали, если таковые являются покупными, что позволит вычислить величину финансовых затрат
на покупные изделия. Можно добавить расход материалов на изготовление той или иной детали. В общем, можно создать
описание конечного изделия на основании которого, можно автоматизировать процесс учёта и планирования производства.

Таким образом можно определить следующие метки для узлов графа:

- **Product** - собственно изделие (механизм, машина)
- **Unit** - узел
- **Part** - деталь

Связи:

- **Included** - деталь/узел включён в другой узел

Следует отметить, что такая графовая база данных описания состава изделий, в каком-то смысле, может быть шардирована.
Это можно реализовать разнесением описаний состава изделий по разным серверам. Ведь в данном случае не один общий граф, а набор
независимых графов для каждого изделия.

## Сценарий 2. Социальные сети. Распространение информации
Описываемый ниже сценарий касается не собственно социальной сети, а части позволяющей отследить движение сообщений.
Цель конструкции - как распространяются сообщения (слухи). Изначально, кто-то публикует некоторое сообщение. Далее, подписчики
передают сообщения своим знакомым, те в свою очередь - своим, и так далее. И хотелось бы понять пути распространения сообщения.

Так же, хотелось бы решить и обратную задачу - кто является источником сообщения. Предлагается следующая конструкция.

Узлы:

- **User**. Пользователь социальной сети;
- **Message**. Сообщение, которое опубликовано впервые. Здесь важно: именно опубликованное, а не переданное исходное далее по сети сообщение, т.е. не repost;
- **Repost**. Сообщение, переданное далее по сети (repost). Является копией исходного сообщения или repost-сообщения, repost'ом которого является. Важно различать исходное сообщение и последующие переданные сообщения. Это важно поскольку нам надо знать кто продвинул сообщение по сети. Т.е. получается цепочка repost'ов с каждым из которых связан пользователь, сделавший данный repost.

Связи:

- **PublishBy**. Связь между узлом **User** и узлом **Message**;
- **TransferBy**. Связь между узлом **User**, сделавшим repost и **Repost**;
- **TransferTo**. Связь между узлом **Repost** и узлами **User** - кому сделан repost;
- **Repost**. Связь между узлом **Message**/**Repost** (сообщение, которое repost'или) и узлом **Repost**;
- **Origin**. Связь обратная связи **Repost**.

Таким образом можно получить подграф распространения конкретного сообщения и определить круг лиц, участвующих в распространении сообщения.
Имея обратную связь в цепочке repost'ов можно определить источник сообщения.
