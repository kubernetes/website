---
title: Виділення ресурсів CPU контейнерам та Podʼам
content_type: task
weight: 20
---

<!-- overview -->

Ця сторінка показує, як вказати *запит* та *ліміт* CPU для контейнера. Контейнери не можуть використовувати більше CPU, ніж налаштований ліміт. При наявності вільного часу процесора контейнера гарантується виділення стільки CPU, скільки він запитує.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Кожен вузол у вашому кластері повинен мати принаймні 1 CPU.

Деякі кроки на цій сторінці вимагають запуску служби [metrics-server](https://github.com/kubernetes-sigs/metrics-server) у вашому кластері. Якщо у вас запущено metrics-server,
ви можете пропустити ці кроки.

Якщо ви використовуєте {{< glossary_tooltip term_id="minikube" >}}, виконайте таку команду, щоб увімкнути metrics-server:

```shell
minikube addons enable metrics-server
```

Щоб перевірити, чи запущений metrics-server, або інший постачальник API ресурсів метрик (`metrics.k8s.io`), виконайте таку команду:

```shell
kubectl get apiservices
```

Якщо API ресурсів метрик доступне, у виводі буде міститися посилання на `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть {{< glossary_tooltip term_id="namespace" text=" простір імен">}}, щоб ресурси, які ви створюєте у цьому завданні, були відокремлені від інших ресурсів у вашому кластері.

```shell
kubectl create namespace cpu-example
```

## Визначте запит ЦП та ліміт ЦП {#specify-a-cpu-request-and-a-cpu-limit}

Для вказання запиту ЦП для контейнера включіть поле `resources.requests.cpu` в маніфест ресурсів Контейнера. Щоб вказати ліміт ЦП, включіть `resources.limits.cpu`.

У цьому завданні ви створюєте Pod, у якого є один контейнер. Контейнер має запит на 0,5 CPU та ліміт 1 CPU. Ось файл конфігурації для Podʼа:

{{% code_sample file="pods/resource/cpu-request-limit.yaml" options="hl_lines=10-14" %}}

Секція `args` у файлі конфігурації надає аргументи для контейнера при його запуску. Аргумент `-cpus "2"` каже Контейнеру спробувати використовувати 2 CPU.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Перевірте, що Pod працює:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

Вивід показує, що один контейнер у Podʼі має запит ЦП 500 міліCPU  та ліміт ЦП 1 CPU.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Використовуйте `kubectl top`, щоб отримати метрики для Podʼа:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

У цьому прикладі виводу показано, що Pod використовує 974 міліCPU, що незначно менше, ніж ліміт 1 CPU, вказане в конфігурації Podʼа.

```none
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Нагадуємо, що, встановивши `-cpu "2"`, ви налаштували контейнер на спробу використати 2 CPU, але контейнер може використовувати лише близько 1 CPU. Використання ЦП контейнером обмежується, оскільки контейнер намагається використовувати більше ресурсів ЦП, ніж його ліміт.

{{< note >}}
Інше можливе пояснення того, що використання ЦП менше 1.0, — це те, що на вузлі може не бути
достатньо ресурсів ЦП. Пригадайте, що передумовами для цієї вправи є наявність у вашому кластері принаймні 1 CPU для використання. Якщо ваш контейнер запускається на вузлі з лише 1 CPU, контейнер не може використовувати більше ніж 1 CPU, незалежно від ліміту ЦП, вказаного для контейнера.
{{< /note >}}

## Одиниці ЦП {#cpu-units}

Ресурс ЦП вимірюється в *одиницях ЦП*. Одна одиниця ЦП в Kubernetes еквівалентна:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread на процесорі Intel з гіперпотоками

Дозволені дробові значення. Контейнер, який запитує 0,5 ЦП, гарантовано отримує половину ЦП порівняно з контейнером, який запитує 1 ЦП. Ви можете використовувати суфікс m для позначення мілі. Наприклад, 100m ЦП, 100 міліЦП і 0,1 ЦП — це все одне й те саме. Точність, більша за 1m, не допускається.

ЦП завжди запитується як абсолютна кількість, ніколи як відносна кількість; 0.1 — це та сама кількість ЦП на одноядерному, двоядерному або 48-ядерному компʼютері.

Видаліть свій Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Визначте запит ЦП, який перевищує можливості ваших вузлів {#specify-a-cpu-request-that-is-too-big-for-your-nodes}

Запити та ліміти ЦП повʼязані з контейнерами, але корисно вважати Pod таким, що має запит ЦП та ліміти. Запит ЦП для Podʼа — це сума запитів ЦП для всіх контейнерів у Podʼі. Так само, ліміти ЦП для Podʼа — це сума обмежень ЦП для всіх контейнерів у Podʼі.

Планування Podʼа базується на запитах. Pod буде запланований для запуску на вузлі тільки у випадку, якщо на вузлі є достатньо ресурсів ЦП для задоволення запиту ЦП Podʼа.

У цьому завданні ви створюєте Pod, який має запит ЦП такий великий, що він перевищує можливості будь-якого вузла у вашому кластері. Ось файл конфігурації для Podʼа, який має один контейнер. Контейнер запитує 100 ЦП, що ймовірно перевищить можливості будь-якого вузла у вашому кластері.

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" options="hl_lines=10-14" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Перегляньте статус Podʼа:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

Вивід показує, що статус Podʼа — Pending. Тобто Pod не був запланований для запуску на будь-якому вузлі, і він буде залишатися в стані Pending нескінченно:


```none
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Перегляньте детальну інформацію про Pod, включаючи події:

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

Вивід показує, що контейнер не може бути запланований через недостатні ресурси ЦП на вузлах:

```none
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Видаліть свій Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## Якщо ви не вказуєте ліміт ЦП {#if-you-do-not-specify-a-cpu-limit}

Якщо ви не вказуєте ліміт ЦП для контейнера, то застосовується одне з наступного:

* Контейнер не має верхньої межі ресурсів ЦП, які він може використовувати. Контейнер
може використовувати всі доступні ресурси ЦП на вузлі, на якому він працює.

* Контейнер працює в просторі імен, який має стандартний ліміт ЦП, і контейнеру автоматично призначається цей стандартний ліміт. Адміністратори кластера можуть використовувати [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/) для зазначення стандартних значень лімітів ЦП.

## Якщо ви вказуєте ліміт ЦП, але не вказуєте запит ЦП {#if-you-specify-a-cpu-limit-but-not-specify-a-cpu-request}

Якщо ви вказуєте ліміт ЦП для контейнера, але не вказуєте запит ЦП, Kubernetes автоматично призначає запит ЦП, який збігається з лімітом. Аналогічно, якщо контейнер вказує свій власний ліміт памʼяті, але не вказує запит памʼяті, Kubernetes автоматично призначає запит памʼяті, який збігається з лімітом.

## Для чого вказувати запит та ліміт ЦП {#motivation-for-cpu-requests-and-limits}

Налаштувавши запити та ліміти ЦП контейнерів, що працюють у вашому кластері, ви можете ефективно використовувати доступні ресурси ЦП на вузлах вашого кластера. Зберігаючи низький запит ЦП для Podʼа, ви забезпечуєте хороші шанси на його планування. Маючи ліміти ЦП, який перевищує запит ЦП, ви досягаєте двох речей:

* Pod може мати періоди підвищеної активності, коли він використовує доступні ресурси ЦП.
* Кількість ресурсів ЦП, які Pod може використовувати під час такої активності, обмежена розумною кількістю.

## Очищення {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace cpu-example
```

## {{% heading "whatsnext" %}}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Зміна обсягів CPU та памʼяті, призначених для контейнерів](/docs/tasks/configure-pod-container/resize-container-resources/)

* [Зміна розміру ресурсів CPU та памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/resize-pod-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

* [Налаштування стандартних запитів та лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Налаштування стандартних запитів та лімітів ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Налаштування мінімальних та максимальних лімітів памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Налаштування мінімальних та максимальних лімітів ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Налаштування квот на памʼять та ЦП для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Налаштування квоти для Podʼів у просторі імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [Налаштування квот для API-обʼєктів](/docs/tasks/administer-cluster/quota-api-object/)
* [Зміна розміру ресурсів ЦП та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/)
