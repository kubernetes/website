---
title: Пакування ресурсів
content_type: concept
weight: 80
---

<!-- overview -->

У [scheduling-plugin](/docs/reference/scheduling/config/#scheduling-plugins) `NodeResourcesFit` kube-scheduler є дві стратегії оцінювання, які підтримують пакування ресурсів: `MostAllocated` та `RequestedToCapacityRatio`.

<!-- body -->

## Включення пакування ресурсів за допомогою стратегії MostAllocated {#enabling-bin-packing-using-mostallocated-strategy}

Стратегія `MostAllocated` оцінює вузли на основі використання ресурсів, віддаючи перевагу тим, у яких використання вище. Для кожного типу ресурсів ви можете встановити коефіцієнт, щоб змінити його вплив на оцінку вузла.

Щоб встановити стратегію `MostAllocated` для втулка `NodeResourcesFit`, використовуйте [конфігурацію планувальника](/docs/reference/scheduling/config) подібну до наступної:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: cpu
          weight: 1
        - name: memory
          weight: 1
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        type: MostAllocated
    name: NodeResourcesFit
```

Щоб дізнатися більше про інші параметри та їх стандартну конфігурацію, див. документацію API для [`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).

## Включення пакування ресурсів за допомогою стратегії RequestedToCapacityRatio {#enabling-bin-packing-using-requestedtocapacityratio}

Стратегія `RequestedToCapacityRatio` дозволяє користувачам вказати ресурси разом з коефіцієнтами для кожного ресурсу для оцінювання вузлів на основі відношення запиту до потужності. Це дозволяє користувачам пакувати розширені ресурси, використовуючи відповідні параметри для покращення використання рідкісних ресурсів у великих кластерах. Вона віддає перевагу вузлам згідно з налаштованою функцією виділених ресурсів. Поведінку `RequestedToCapacityRatio` в функції оцінювання `NodeResourcesFit` можна керувати за допомогою поля [scoringStrategy](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-ScoringStrategy). У межах поля `scoringStrategy` ви можете налаштувати два параметри: `requestedToCapacityRatio` та `resources`. Параметр `shape` в `requestedToCapacityRatio` дозволяє користувачу налаштувати функцію як найменш чи найбільш затребувані на основі значень `utilization` та `score`. Параметр `resources` охоплює як `name` ресурсу, що оцінюється, так і `weight` для кожного ресурсу.

Нижче наведено приклад конфігурації, яка встановлює поведінку пакування ресурсів  `intel.com/foo` та `intel.com/bar` за допомогою поля `requestedToCapacityRatio`.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - args:
      scoringStrategy:
        resources:
        - name: intel.com/foo
          weight: 3
        - name: intel.com/bar
          weight: 3
        requestedToCapacityRatio:
          shape:
          - utilization: 0
            score: 0
          - utilization: 100
            score: 10
        type: RequestedToCapacityRatio
    name: NodeResourcesFit
```

Посилання на файл `KubeSchedulerConfiguration` з прапорцем kube-scheduler `--config=/path/to/config/file` передасть конфігурацію планувальнику.

Щоб дізнатися більше про інші параметри та їх стандартну конфігурацію, див. документацію API для [`NodeResourcesFitArgs`](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-NodeResourcesFitArgs).

### Налаштування функції оцінювання {#tuning-the-score-function}

Параметр `shape` використовується для вказівки поведінки функції `RequestedToCapacityRatio`.

```yaml
shape:
  - utilization: 0
    score: 0
  - utilization: 100
    score: 10
```

Вищезазначені аргументи надають вузлу `score` 0, якщо `utilization` дорівнює 0%, та 10 для `utilization` 100%, що дозволяє пакування ресурсів. Щоб увімкнути найменш затребувані значення оцінки, значення оцінки має бути оберненим наступним чином.

```yaml
shape:
  - utilization: 0
    score: 10
  - utilization: 100
    score: 0
```

`resources` є необовʼязковим параметром, який типово має значення:

```yaml
resources:
  - name: cpu
    weight: 1
  - name: memory
    weight: 1
```

Він може бути використаний для додавання розширених ресурсів наступними чином:

```yaml
resources:
  - name: intel.com/foo
    weight: 5
  - name: cpu
    weight: 3
  - name: memory
    weight: 1
```

Параметр `weight` є необовʼязковим та встановлений у 1, якщо він не вказаний. Також, він може бути встановлений у відʼємне значення.

### Оцінка вузла для розподілу потужностей {#node-scoring-for-resource-allocation}

Цей розділ призначений для тих, хто бажає зрозуміти внутрішні деталі цієї функціональності. Нижче наведено приклад того, як обчислюється оцінка вузла для заданого набору значень.

Запитані ресурси:

```none
intel.com/foo : 2
memory: 256MB
cpu: 2
```

Коефіцієнти ресурсів:

```none
intel.com/foo : 5
memory: 1
cpu: 3
```

FunctionShapePoint {{0, 0}, {100, 10}}

Специфікація вузла 1:

```none
Available:
  intel.com/foo: 4
  memory: 1 GB
  cpu: 8

Used:
  intel.com/foo: 1
  memory: 256MB
  cpu: 1
```

Оцінка вузла:

```none
intel.com/foo  = resourceScoringFunction((2+1),4)
               = (100 - ((4-3)*100/4))
               = (100 - 25)
               = 75                       # запитано + використано = 75% * доступно
               = rawScoringFunction(75)
               = 7                        # floor(75/10)

memory         = resourceScoringFunction((256+256),1024)
               = (100 -((1024-512)*100/1024))
               = 50                       # запитано + використано = 50% * доступно
               = rawScoringFunction(50)
               = 5                        # floor(50/10)

cpu            = resourceScoringFunction((2+1),8)
               = (100 -((8-3)*100/8))
               = 37.5                     # запитано + використано = 37.5% * доступно
               = rawScoringFunction(37.5)
               = 3                        # floor(37.5/10)

NodeScore   =  ((7 * 5) + (5 * 1) + (3 * 3)) / (5 + 1 + 3)
            =  5
```

Специфікація вузла 2:

```none
Available:
  intel.com/foo: 8
  memory: 1GB
  cpu: 8
Used:
  intel.com/foo: 2
  memory: 512MB
  cpu: 6
```

Оцінка вузла:

```none
intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 50)
               =  50
               =  rawScoringFunction(50)
               = 5

memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

cpu            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  ((5 * 5) + (7 * 1) + (10 * 3)) / (5 + 1 + 3)
            =  7

```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [фреймворк планування](/docs/concepts/scheduling-eviction/scheduling-framework/)
- Дізнайтеся більше про [конфігурацію планувальника](/docs/reference/scheduling/config/)
