---
title: Покрокове керівництво HorizontalPodAutoscaler
content_type: task
weight: 100
min-kubernetes-server-version: 1.23
---

<!-- overview -->

[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (скорочено HPA) автоматично оновлює ресурс робочого навантаження (наприклад, {{< glossary_tooltip text="Deployment" term_id="deployment" >}} або {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}) з метою автоматичного масштабування робочого навантаження відповідно до попиту.

Горизонтальне масштабування означає, що на збільшене навантаження відповідають розгортанням додаткових {{< glossary_tooltip text="Podʼів" term_id="pod" >}}. Це відрізняється від _вертикального_ масштабування, яке для Kubernetes означало б призначення додаткових ресурсів (наприклад, памʼяті або CPU) Podʼам, що вже працюють для робочого навантаження.

Якщо навантаження зменшується, а кількість Podʼів перевищує налаштований мінімум, HorizontalPodAutoscaler дає ресурсу робочого навантаження (Deployment, StatefulSet або іншому подібному ресурсу) команду зменшити масштаб.

У цьому документі розглянуто приклад увімкнення HorizontalPodAutoscaler для автоматичного керування масштабом прикладного вебзастосунку. Це робоче навантаження — Apache httpd, що виконує певний код PHP.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} Якщо ви використовуєте старіший випуск Kubernetes, зверніться до версії документації для цього випуску (дивіться [доступні версії документації](/docs/home/supported-doc-versions/)).

Щоб виконати цей посібник, вам також потрібен кластер із розгорнутим і налаштованим [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme). Kubernetes Metrics Server збирає метрики ресурсів із {{<glossary_tooltip term_id="kubelet" text="kubelets">}} у вашому кластері й надає ці метрики через [Kubernetes API](/docs/concepts/overview/kubernetes-api/), використовуючи [APIService](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), щоб додати нові види ресурсів, які представляють показники метрик.

Щоб дізнатися, як розгорнути Metrics Server, дивіться [документацію metrics-server](https://github.com/kubernetes-sigs/metrics-server#deployment).

Якщо ви використовуєте {{< glossary_tooltip term_id="minikube" >}}, виконайте таку команду, щоб увімкнути metrics-server:

```shell
minikube addons enable metrics-server
```

<!-- steps -->

## Запустіть сервер php-apache і відкрийте до нього доступ {#run-and-expose-php-apache-server}

Щоб продемонструвати HorizontalPodAutoscaler, ви спочатку запустите Deployment, який запускає контейнер з образом `hpa-example`, і відкриєте до нього доступ як до {{< glossary_tooltip term_id="service">}} за допомогою такого маніфесту:

{{% code_sample file="application/php-apache.yaml" %}}

Для цього виконайте таку команду:

```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```
deployment.apps/php-apache created
service/php-apache created
```

## Створіть HorizontalPodAutoscaler {#create-horizontal-pod-autoscaler}

Тепер, коли сервер працює, створіть автомасштабувальник за допомогою `kubectl`. У цьому допоможе підкоманда [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale), що є частиною `kubectl`.

Незабаром ви виконаєте команду, яка створить HorizontalPodAutoscaler, що підтримує від 1 до 10 реплік Podʼів, керованих Deployment php-apache, який ви створили на першому кроці цих інструкцій.

Загалом, {{<glossary_tooltip text="контролер" term_id="controller">}} HPA збільшуватиме й зменшуватиме кількість реплік (оновлюючи Deployment), щоб підтримувати середнє використання CPU на рівні 50% по всіх Podʼах. Потім Deployment оновлює ReplicaSet — так працюють усі Deployments у Kubernetes — а потім ReplicaSet додає або вилучає Podʼи відповідно до змін у його `.spec`.

Оскільки кожен Pod запитує 200 мілі-ядер через `kubectl run`, це означає середнє використання CPU 100 мілі-ядер. Докладніше про алгоритм дивіться в розділі [Деталі алгоритму](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/#algorithm-details).

Створіть HorizontalPodAutoscaler:

```shell
kubectl autoscale deployment php-apache --cpu=50% --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

Ви можете перевірити поточний статус щойно створеного HorizontalPodAutoscaler, виконавши:

```shell
# Можна використовувати "hpa" або "horizontalpodautoscaler"; працюють обидві назви.
kubectl get hpa
```

Вивід подібний до такого:

```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s
```

(якщо ви бачите інші HorizontalPodAutoscalers з іншими назвами, це означає, що вони вже існували, і зазвичай це не проблема).

Зверніть увагу, що поточне споживання CPU становить 0%, оскільки немає клієнтів, що надсилають запити на сервер (стовпець ``TARGET`` показує середнє значення по всіх Podʼах, керованих відповідним Deployment).

## Збільшення навантаження {#increase-load}

Далі подивіться, як автомасштабувальник реагує на збільшене навантаження. Для цього ви запустите інший Pod, який діятиме як клієнт. Контейнер у клієнтському Podʼі працює в нескінченному циклі, надсилаючи запити до сервісу php-apache.

```shell
# Виконайте це в окремому терміналі,
# щоб навантаження продовжувалося, і ви могли продовжити роботу з рештою кроків
kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

Тепер виконайте:

```shell
# натисніть Ctrl+C, щоб припинити перегляд, коли будете готові
kubectl get hpa php-apache --watch
```

Приблизно за хвилину ви маєте побачити вище навантаження на CPU; наприклад:

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

а потім більше реплік. Наприклад:

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        7          3m
```

Тут споживання CPU зросло до 305% від запиту. У результаті Deployment було змінено до 7 реплік:

```shell
kubectl get deployment php-apache
```

Ви маєте побачити, що кількість реплік збігається з числом із HorizontalPodAutoscaler

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
Стабілізація кількості реплік може зайняти кілька хвилин. Оскільки обсяг навантаження ніяк не контролюється, кінцева кількість реплік може відрізнятися від цього прикладу.
{{< /note >}}

## Зупиніть генерування навантаження {#stop-load}

Щоб завершити приклад, припиніть надсилати навантаження.

У терміналі, де ви створили Pod з образом `busybox`, зупиніть генерування навантаження, натиснувши `<Ctrl> + C`.

Потім перевірте результат (приблизно за хвилину):

```shell
# натисніть Ctrl+C, щоб припинити перегляд, коли будете готові
kubectl get hpa php-apache --watch
```

Вивід подібний до такого:

```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

і Deployment також показує, що його масштаб зменшився:

```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

Щойно використання CPU впало до 0, HPA автоматично зменшив кількість реплік назад до 1.

Автоматичне масштабування реплік може зайняти кілька хвилин.

<!-- discussion -->

## Автомасштабування за кількома метриками та власними метриками {#autoscaling-on-multiple-metrics-and-custom-metrics}

Ви можете додати інші метрики для автомасштабування Deployment `php-apache`, використовуючи версію API `autoscaling/v2`.

Спочатку отримайте YAML вашого HorizontalPodAutoscaler у формі `autoscaling/v2`:

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

Відкрийте файл `/tmp/hpa-v2.yaml` у редакторі, і ви побачите такий YAML:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
```

Зверніть увагу, що поле `targetCPUUtilizationPercentage` замінено масивом під назвою `metrics`. Метрика використання CPU є *метрикою ресурсу*, оскільки вона подана як відсоток ресурсу, вказаного в контейнерах Podʼа. Зверніть увагу, що ви можете вказати інші метрики ресурсів, крім CPU. Стандартно єдина інша підтримувана метрика ресурсу — це `memory`. Ці ресурси не змінюють назв від кластера до кластера й мають бути доступними завжди, доки доступний API `metrics.k8s.io`.

Ви також можете вказувати метрики ресурсів у безпосередніх значеннях, а не у відсотках від запитаного значення, використовуючи `target.type` зі значенням `AverageValue` замість `Utilization` і встановлюючи відповідне поле `target.averageValue` замість `target.averageUtilization`.

```
  metrics:
  - type: Resource
    resource:
      name: memory
      target:
        type: AverageValue
        averageValue: 500Mi
```

Є ще два типи метрик, обидва вважаються *власними метриками*: метрики Podʼів і метрики обʼєктів. Ці метрики можуть мати назви, специфічні для кластера, і потребують розширенішого налаштування моніторингу кластера.

Перший із цих альтернативних типів метрик — це *метрики Podʼів*. Ці метрики описують Podʼи, усереднюються по Podʼах і порівнюються з цільовим значенням для визначення кількості реплік. Вони працюють майже так само, як метрики ресурсів, за винятком того, що підтримують *лише* тип `target` `AverageValue`.

Метрики Podʼів вказуються за допомогою такого блоку метрики:

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

Другий альтернативний тип метрики — це *метрики обʼєктів*. Ці метрики описують інший обʼєкт у тому самому просторі імен, а не Podʼи. Метрики не обовʼязково отримуються з обʼєкта; вони лише описують його. Метрики обʼєктів підтримують типи `target` `Value` і `AverageValue`. Для `Value` ціль порівнюється безпосередньо з метрикою, отриманою з API. Для `AverageValue` значення, отримане з API власних метрик, ділиться на кількість Podʼів перед порівнянням із ціллю. Наведений нижче приклад — це подання метрики `requests-per-second` у YAML.

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

Якщо ви надаєте кілька таких блоків метрик, HorizontalPodAutoscaler розглядатиме кожну метрику по черзі. HorizontalPodAutoscaler обчислить запропоновану кількість реплік для кожної метрики, а потім вибере найбільшу.

Наприклад, якщо ваша система моніторингу збирає метрики мережевого трафіку, ви можете оновити наведене вище визначення за допомогою `kubectl edit`, щоб воно мало такий вигляд:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

Тоді ваш HorizontalPodAutoscaler намагатиметься забезпечити, щоб кожен Pod споживав приблизно 50% запитаного CPU, обслуговував 1000 пакетів за секунду, а всі Podʼи за Ingress main-route разом обслуговували 10000 запитів за секунду.

### Автомасштабування за конкретнішими метриками {#autoscaling-on-more-specific-metrics}

Багато конвеєрів метрик дають змогу описувати метрики або за назвою, або за набором додаткових дескрипторів, які називаються _мітками_. Для всіх типів метрик, крім метрик ресурсів (Podʼів, обʼєктів і зовнішніх, описаних нижче), ви можете вказати додатковий селектор міток, який передається вашому конвеєру метрик. Наприклад, якщо ви збираєте метрику `http_requests` з міткою `verb`, можна вказати такий блок метрики, щоб масштабувати лише за запитами GET:

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

Цей селектор використовує той самий синтаксис, що й повні селектори міток Kubernetes. Конвеєр моніторингу визначає, як згорнути кілька серій в одне значення, якщо назва й селектор відповідають кільком серіям. Селектор є адитивним і не може вибирати метрики, що описують обʼєкти, які **не є** цільовим обʼєктом (цільові Podʼи для типу `Pods` та описаний обʼєкт для типу `Object`).

### Автомасштабування за метриками, що не стосуються обʼєктів Kubernetes {#autoscaling-on-metrics-not-related-to-kubernetes-objects}

Застосунки, що працюють у Kubernetes, можуть потребувати автомасштабування за метриками, які не мають очевидного звʼязку з жодним обʼєктом у кластері Kubernetes, наприклад метриками, що описують розміщений сервіс, який не має прямої кореляції з просторами імен Kubernetes. У Kubernetes 1.10 і новіших версіях цей випадок можна вирішити за допомогою *зовнішніх метрик*.

Використання зовнішніх метрик потребує знання вашої системи моніторингу; налаштування подібне до потрібного для власних метрик. Зовнішні метрики дають змогу автоматично масштабувати кластер на основі будь-якої метрики, доступної у вашій системі моніторингу. Надайте блок `metric` з `name` і `selector`, як вище, і використовуйте тип метрики `External` замість `Object`. Якщо `metricSelector` відповідає кільком часовим рядам, HorizontalPodAutoscaler використовує суму їхніх значень. Зовнішні метрики підтримують цільові типи `Value` і `AverageValue`, які працюють точно так само, як і для типу `Object`.

Наприклад, якщо ваш застосунок обробляє завдання з розміщеного сервісу черг, ви можете додати такий розділ до маніфесту HorizontalPodAutoscaler, щоб вказати, що потрібен один обробник на кожні 30 невиконаних завдань.

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector:
        matchLabels:
          queue: "worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

Коли це можливо, краще використовувати цільові типи власних метрик замість зовнішніх метрик, оскільки адміністраторам кластера легше захистити API власних метрик. API зовнішніх метрик потенційно дає доступ до будь-якої метрики, тому адміністратори кластера мають бути обережними, відкриваючи доступ до нього.

## Додаток: стани статусу Horizontal Pod Autoscaler {#appendix-horizontal-pod-autoscaler-status-conditions}

Використовуючи форму `autoscaling/v2` HorizontalPodAutoscaler, ви зможете бачити *стани статусу*, які Kubernetes встановлює на HorizontalPodAutoscaler. Ці стани статусу вказують, чи може HorizontalPodAutoscaler масштабуватися і чи є наразі якісь обмеження.

Стани показано в полі `status.conditions`. Щоб побачити стани, що впливають на HorizontalPodAutoscaler, можна використати `kubectl describe hpa`:

```shell
kubectl describe hpa cm-test
```

```
Name:                           cm-test
Namespace:                      prom
Labels:                         <none>
Annotations:                    <none>
CreationTimestamp:              Fri, 16 Jun 2017 18:09:22 +0000
Reference:                      ReplicationController/cm-test
Metrics:                        ( current / target )
  "http_requests" on pods:      66m / 500m
Min replicas:                   1
Max replicas:                   4
ReplicationController pods:     1 current / 1 desired
Conditions:
  Type                  Status  Reason                  Message
  ----                  ------  ------                  -------
  AbleToScale           True    ReadyForNewScale        the last scale time was sufficiently old as to warrant a new scale
  ScalingActive         True    ValidMetricFound        the HPA was able to successfully calculate a replica count from pods metric http_requests
  ScalingLimited        False   DesiredWithinRange      the desired replica count is within the acceptable range
Events:
```

Для цього HorizontalPodAutoscaler видно кілька станів у справному статусі. Перший, `AbleToScale`, вказує, чи може HPA отримувати й оновлювати масштаби, а також чи не завадять масштабуванню умови, повʼязані з backoff. Другий, `ScalingActive`, вказує, чи увімкнено HPA (тобто кількість реплік цілі не дорівнює нулю) і чи може він обчислювати бажані масштаби. Якщо він `False`, це зазвичай вказує на проблеми з отриманням метрик. Нарешті, останній стан, `ScalingLimited`, вказує, що бажаний масштаб обмежено максимумом або мінімумом HorizontalPodAutoscaler. Це ознака того, що вам може знадобитися збільшити або зменшити обмеження мінімальної чи максимальної кількості реплік у вашому HorizontalPodAutoscaler.

## Кількості {#quantities}

Усі метрики в HorizontalPodAutoscaler і в API метрик вказуються за допомогою спеціальної нотації цілих чисел, відомої в Kubernetes як {{< glossary_tooltip term_id="quantity" text="кількість">}}. Наприклад, кількість `10500m` у десятковій нотації записується як `10.5`. API метрик за можливості повертають цілі числа без суфікса, а інакше зазвичай повертають кількості в міліодиницях. Це означає, що значення вашої метрики може коливатися між `1` і `1500m`, або між `1` і `1.5` у десятковій нотації.

## Інші можливі сценарії {#other-possible-scenarios}

### Декларативне створення автомасштабувальника {#creating-the-autoscaler-declaratively}

Замість того щоб створювати HorizontalPodAutoscaler імперативно командою `kubectl autoscale`, можна створити його декларативно за допомогою такого маніфесту:

{{% code_sample file="application/hpa/php-apache.yaml" %}}

Потім створіть автомасштабувальник, виконавши таку команду:

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```
