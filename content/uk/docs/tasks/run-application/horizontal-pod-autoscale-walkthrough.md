---
title: Покрокове керівництво HorizontalPodAutoscaler
content_type: task
weight: 100
min-kubernetes-server-version: 1.23
---

<!-- overview -->

[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (HPA)
автоматично оновлює ресурс робочого навантаження (наприклад, {{< glossary_tooltip text="Deployment" term_id="deployment" >}} або {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), з метою автоматичного масштабування робочого навантаження, щоб відповідати попиту.

Горизонтальне масштабування означає, що відповідь на збільшене навантаження полягає в розгортанні додаткових {{< glossary_tooltip text="Podʼів" term_id="pod" >}}. Це відрізняється від _вертикального_ масштабування, що для Kubernetes означає призначення додаткових ресурсів (наприклад: памʼять або CPU) для Podʼів, які вже працюють для робочого навантаження.

Якщо навантаження зменшується, а кількість Podʼів перевищує налаштований мінімум, HorizontalPodAutoscaler інструктує ресурс робочого навантаження (Deployment, StatefulSet
або інший схожий ресурс) зменшити масштаб.

Цей документ детально розглядає приклад увімкнення HorizontalPodAutoscaler для автоматичного управління масштабуванням для прикладу вебзастосунку. Це приклад навантаження — Apache httpd, що виконує деякий код PHP.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} Якщо ви використовуєте старі версії Kubernetes, зверніться до документації для цієї версії (див. [доступні версії документації](/docs/home/supported-doc-versions/)).

Для виконання рекомендацій цього посібника, вам також потрібно використовувати кластер, в якому розгорнутий і налаштований [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme). Сервер метрик Kubernetes збирає метрики ресурсів з {{<glossary_tooltip term_id="kubelet" text="kubelets">}} у вашому кластері та використовує ці метрики через [Kubernetes API](/docs/concepts/overview/kubernetes-api/), використовуючи [APIService](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/), щоб додати нові види ресурсів, які представляють метричні показники.

Щоб дізнатися, як розгорнути Metrics Server, див. [документацію metrics-server](https://github.com/kubernetes-sigs/metrics-server#deployment).

Якщо ви використовуєте {{< glossary_tooltip term_id="minikube" >}}, виконайте наступну команду для ввімкнення metrics-server:

```shell
minikube addons enable metrics-server
```

<!-- steps -->

## Запустіть та надайте доступ до сервера php-apache {#run-and-expose-php-apache-server}

Для демонстрації HorizontalPodAutoscaler ви спочатку запустите Deployment, який запускає контейнер за допомогою образу `hpa-example`, та експонуєте його як {{< glossary_tooltip term_id="service">}} за допомогою наступного маніфесту:

{{% code_sample file="application/php-apache.yaml" %}}

Для цього виконайте наступну команду:

```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```none
deployment.apps/php-apache створено
service/php-apache створено
```

## Створіть HorizontalPodAutoscaler {#create-horizontal-pod-autoscaler}

Тепер, коли сервер працює, створіть автомасштабувальник за допомогою `kubectl`. Підкоманда [`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale), частина `kubectl`, допоможе зробити це.

За мить ви виконаєте команду, яка створить HorizontalPodAutoscaler, що підтримує від 1 до 10 реплік контрольованих Podʼів за допомогою Deployment php-apache, який ви створили на першому етапі цих інструкцій.

Грубо кажучи, контролер {{<glossary_tooltip text="контролер" term_id="controller">}} HPA збільшує або зменшує кількість реплік (шляхом оновлення Deployment) для підтримки середнього використання процесора на рівні 50% по всіх Podʼах. Deployment потім оновлює ReplicaSet — це частина всіх Deployment у Kubernetes — і потім ReplicaSet додає або видаляє Podʼи на основі змін у його `.spec`.

Оскільки кожен Pod запитує 200 мілі-ядер за допомогою `kubectl run`, це означає середнє використання процесора 100 мілі-ядер. Див. [Деталі алгоритму](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/#algorithm-details) для отримання додаткової інформації щодо алгоритму.

Створіть HorizontalPodAutoscaler:

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```none
horizontalpodautoscaler.autoscaling/php-apache масштабовано
```

Ви можете перевірити поточний стан нового HorizontalPodAutoscaler, виконавши:

```shell
# Ви можете використовувати "hpa" або "horizontalpodautoscaler"; обидва імені працюють добре.
kubectl get hpa
```

Вивід схожий на:

```none
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s
```

(якщо ви бачите інші HorizontalPodAutoscalers з різними іменами, це означає, що вони вже існували, і це зазвичай не проблема).

Зверніть увагу, що поточне використання ЦП становить 0%, оскільки немає клієнтів, що відправляють запити на сервер (стовпець «TARGET» показує середнє значення по всіх Podʼах, що контролюються відповідним розгортанням).

## Збільшення навантаження {#increase-load}

Далі перегляньте, як автомасштабувальник реагує на збільшене навантаження. Для цього ви запустите інший Pod, який буде виступати в ролі клієнта. Контейнер всередині Podʼа клієнта працює у нескінченному циклі, надсилаючи запити до служби php-apache.

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

Протягом хвилини ви повинні побачити вище навантаження процесора; наприклад:

```none
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

а потім більше реплік. Наприклад:

```none
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        7          3m
```

Тут споживання ЦП збільшилося до 305% від запиту. В результаті Deployment був змінений до 7 реплік:

```shell
kubectl get deployment php-apache
```

Ви повинні побачити, що кількість реплік відповідає цифрі з HorizontalPodAutoscaler

```none
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
Може знадобитися кілька хвилин, щоб стабілізувалася кількість реплік. Оскільки обсяг навантаження не контролюється, може статися так, що кінцева кількість реплік буде відрізнятися від цього прикладу.
{{< /note >}}

## Зупиніть генерування навантаження {#stop-load}

Для завершення прикладу припиніть надсилання навантаження.

У терміналі, де ви створили Pod, який працює з образом `busybox`, зупиніть генерування навантаження, натиснувши `<Ctrl> + C`.

Потім перевірте результат (через хвилину чи так):

```shell
# натисніть Ctrl+C, щоб припинити перегляд, коли будете готові
kubectl get hpa php-apache --watch
```

Вивід схожий на:

```none
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

і Deployment також показує, що він зменшився:

```shell
kubectl get deployment php-apache
```

```none
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

Як тільки використання CPU знизилося до 0, HPA автоматично зменшив кількість реплік до 1.

Автоматичне масштабування реплік може зайняти кілька хвилин.

<!-- discussion -->

## Автомасштабування за допомогою кількох метрик та власних метрик {#autoscaling-with-multiple-metrics-and-custom-metrics}

Ви можете вводити додаткові метрики для використання при автомасштабуванні Deployment `php-apache`, використовуючи версію API `autoscaling/v2`.

Спочатку отримайте YAML вашого HorizontalPodAutoscaler у формі `autoscaling/v2`:

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

Відкрийте файл `/tmp/hpa-v2.yaml` у редакторі, і ви побачите YAML, що виглядає наступним чином:

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

Зверніть увагу, що поле `targetCPUUtilizationPercentage` було замінено масивом під назвою `metrics`. Метрика використання ЦП є _ресурсною метрикою_, оскільки вона представлена як відсоток ресурсу, вказаного в контейнерах Podʼа. Зверніть увагу, що ви можете вказати інші ресурсні метрики крім ЦП. Стандартно, єдиним іншим підтримуваним типом ресурсної метрики є `memory`. Ці ресурси не змінюють назви з кластера на кластер і завжди повинні бути доступними, поки API `metrics.k8s.io` доступне.

Ви також можете вказати ресурсні метрики у вигляді безпосередніх значень, а не як відсотки від запитаного значення, використовуючи `target.type` `AverageValue` замість `Utilization`, і встановлюючи відповідне поле `target.averageValue` замість `target.averageUtilization`.

```yaml
  metrics:
  - type: Resource
    resource:
      name: memory
      target:
        type: AverageValue
        averageValue: 500Mi
```

Є ще два інші типи метрик, які обидва вважаються _власними метриками_: метрики Podʼів і метрики обʼєктів. Ці метрики можуть мати назви, які специфічні для кластера, і вимагають більш розширеної настройки моніторингу кластера.

Перший з цих альтернативних типів метрик — це _метрики Podʼів_. Ці метрики описують Podʼи і вони усереднюються разом по Podʼах і порівнюються з цільовим значенням для визначення кількості реплік. Вони працюють так само як ресурсні метрики, за винятком того, що вони _тільки_ підтримують тип `target` `AverageValue`.

Метрики Podʼів вказуються за допомогою блоку метрики, подібного до цього:

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

Другий альтернативний тип метрики — це _метрики обʼєктів_. Ці метрики описують інший обʼєкт в тому ж просторі імен, замість опису Podʼів. Метрики не обовʼязково отримуються з обʼєкта; вони лише описують його. Метрики обʼєктів підтримують типи `target` як `Value` і `AverageValue`. З `Value` ціль порівнюється безпосередньо з метрикою отриманою з API. З `AverageValue` значення, повернене з API власних метрик, ділиться на кількість Podʼів перед порівнянням з цільовим значенням. Ось приклад YAML представлення метрики `requests-per-second`.

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

Якщо ви надаєте кілька таких блоків метрик, HorizontalPodAutoscaler буде розглядати кожну метрику по черзі. HorizontalPodAutoscaler розраховуватиме запропоновані кількості реплік для кожної метрики, а потім вибере той, який має найбільшу кількість реплік.

Наприклад, якщо ваша система моніторингу збирає метрики про мережевий трафік, ви можете оновити визначення вище за допомогою `kubectl edit` так, щоб воно виглядало наступним чином:

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

Тоді ваш HorizontalPodAutoscaler намагатиметься забезпечити, щоб кожен Pod витрачав приблизно 50% від своєї запитаної CPU, обслуговував 1000 пакетів за секунду та всі Podʼи за головним маршрутом Ingress обслуговували в загальному 10000 запитів за секунду.

### Автомасштабування за більш конкретними метриками {#scaling-on-more-specific-metrics}

Багато систем метрик дозволяють описувати метрики або за назвою, або за набором додаткових описів, які називаються _мітками_ (_labels_). Для всіх типів метрик, крім ресурсних (Podʼів, обʼєктів і зовнішніх, описаних нижче), ви можете вказати додатковий селектор міток, який передається вашій системі метрик. Наприклад, якщо ви збираєте метрику `http_requests` з міткою `verb`, ви можете вказати наступний блок метрики, щоб масштабувати тільки на запити GET:

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

Цей селектор використовує такий же синтаксис, як і повні селектори міток Kubernetes. Система моніторингу визначає, як зведені кілька серій в одне значення, якщо імʼя та селектор відповідають кільком серіям. Селектор є додатковим, і не може вибирати метрики, що описують обʼєкти, які **не є** цільовим обʼєктом (цільові Podʼи у випадку типу `Pods`, та описаний обʼєкт у випадку типу `Object`).

### Автомасштабування за метриками, що не стосуються обʼєктів Kubernetes {#autoscaling-on-metrics-not-related-to-kubernetes-objects}

Застосунки, які працюють на Kubernetes, можуть потребувати автоматичного масштабування на основі метрик, які не мають очевидного стосунку до будь-якого обʼєкта в кластері Kubernetes, наприклад, метрики, що описують хостову службу з жодною прямою кореляцією з просторами імен Kubernetes. У Kubernetes 1.10 і пізніших версіях ви можете вирішити цей випадок використовуючи _зовнішні метрики_.

Для використання зовнішніх метрик потрібно знання вашої системи моніторингу; налаштування аналогічно необхідному при використанні власних метрик. Зовнішні метрики дозволяють автоматично масштабувати ваш кластер на основі будь-якої метрики, доступної в вашій системі моніторингу. Надайте блок `metric` з `name` та `selector`, як вище, і використовуйте тип метрики `External` замість `Object`. Якщо кілька часових рядів відповідають `metricSelector`, то сума їх значень використовується HorizontalPodAutoscaler. Зовнішні метрики підтримують як типи цілей `Value`, так і `AverageValue`, які працюють точно так само, як коли ви використовуєте тип `Object`.

Наприклад, якщо ваш додаток обробляє завдання з хостової служби черги, ви можете додати наступний розділ до вашого маніфесту HorizontalPodAutoscaler, щоб вказати, що вам потрібен один робочий процес на кожні 30 невиконаних завдань.

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

Коли це можливо, краще використовувати типи цілей власних метрик замість зовнішніх метрик, оскільки для адміністраторів кластера легше захистити API власних метрик. Зовнішнє API метрик потенційно дозволяє доступ до будь-якої метрики, тому адміністратори кластера повинні бути обережні при його використанні.

## Додаток: Умови стану горизонтального автомасштабування Podʼів {#apendix-horizontal-pod-autoscaler-conditions}

При використанні форми `autoscaling/v2` HorizontalPodAutoscaler ви зможете бачити _умови стану_, встановлені Kubernetes на HorizontalPodAutoscaler. Ці умови стану вказують, чи може або не може HorizontalPodAutoscaler масштабуватися, а також чи є в цей час будь-які обмеження.

Умови зʼявляються у полі `status.conditions`. Щоб побачити умови, які впливають на HorizontalPodAutoscaler, ми можемо використати `kubectl describe hpa`:

```shell
kubectl describe hpa cm-test
```

```none
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

Для цього HorizontalPodAutoscaler ви можете побачити кілька умов у справному стані. Перше, `AbleToScale`, вказує, чи може або не може HPA отримувати та оновлювати масштаби, а також чи будь-які умови затримки повʼязані з масштабуванням. Друге, `ScalingActive`, вказує, чи увімкнений HPA (тобто кількість реплік цілі не дорівнює нулю) та чи може розраховувати потрібні масштаби. Якщо це `False`, це, як правило, вказує на проблеми з отриманням метрик. Нарешті, остання умова, `ScalingLimited`, вказує на те, що потрібний масштаб був обмежений максимальним або мінімальним значенням HorizontalPodAutoscaler. Це свідчить про те, що ви можливо захочете збільшити або зменшити мінімальну або максимальну кількість реплік на вашому HorizontalPodAutoscaler.

## Кількості {#quantities}

Усі метрики в HorizontalPodAutoscaler та API метрик вказуються за спеціальною цільною числовою нотацією, відомою в Kubernetes як {{< glossary_tooltip term_id="quantity" text="кількість">}}. Наприклад, кількість `10500m` буде записана як `10.5` у десятковій нотації. API метрик повертатимуть цілі числа без суфікса, якщо це можливо, і зазвичай повертають кількості в міліодиницях у протилежному випадку. Це означає, що ви можете бачити зміну вашого значення метрики між `1` і `1500m`, або між `1` і `1.5`, коли воно записане в десятковій нотації.

## Інші можливі сценарії {#other-possible-scenarios}

### Створення автомасштабування декларативно {#creating-the-autoscaler-declaratively}

Замість використання команди `kubectl autoscale` для створення HorizontalPodAutoscaler імперативно, ми можемо використати наступний маніфест, щоб створити його декларативно:

{{% code_sample file="application/hpa/php-apache.yaml" %}}

Потім створіть автомасштабування, виконавши наступну команду:

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```none
horizontalpodautoscaler.autoscaling/php-apache created
```
