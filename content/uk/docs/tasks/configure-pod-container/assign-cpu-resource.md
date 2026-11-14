---
title: Призначення ресурсів CPU контейнерам і Podʼам
content_type: task
weight: 20
---

<!-- overview -->

Ця сторінка показує, як призначити контейнеру *запит* (request) та *обмеження* (limit) CPU. Контейнери не можуть використовувати більше CPU, ніж налаштоване обмеження. Якщо в системі є вільний процесорний час, контейнеру гарантовано виділяється стільки CPU, скільки він запитує.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Для виконання прикладів завдання ваш кластер повинен мати щонайменше 1 доступний для використання CPU.

Деякі кроки на цій сторінці потребують запуску [metrics-server](https://github.com/kubernetes-sigs/metrics-server) у вашому кластері. Якщо у вас уже працює metrics-server, ці кроки можна пропустити.

Якщо ви використовуєте {{< glossary_tooltip term_id="minikube" >}}, виконайте таку команду, щоб увімкнути metrics-server:

```shell
minikube addons enable metrics-server
```

Щоб перевірити, чи працює metrics-server (або інший постачальник API метрик ресурсів, `metrics.k8s.io`), виконайте таку команду:

```shell
kubectl get apiservices
```

Якщо API метрик ресурсів доступне, вивід міститиме посилання на `metrics.k8s.io`.

```
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть {{< glossary_tooltip term_id="namespace" text="простір імен" >}}, щоб ресурси, які ви створюєте в цій вправі, були ізольовані від решти кластера.

```shell
kubectl create namespace cpu-example
```

## Встановлення запиту й обмеження CPU {#specify-a-cpu-request-and-a-cpu-limit}

Щоб вказати запит CPU для контейнера, додайте поле `resources.requests.cpu` до маніфесту ресурсів контейнера. Щоб вказати обмеження CPU, додайте `resources.limits.cpu`.

У цій вправі ви створюєте Pod з одним контейнером. Контейнер має запит 0,5 CPU та обмеження 1 CPU. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/resource/cpu-request-limit.yaml" options="hl_lines=10-14" %}}

Розділ `args` файлу конфігурації задає аргументи для контейнера під час його запуску. Аргумент `-cpus "2"` вказує контейнеру спробувати використовувати 2 CPU.

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

Вивід показує, що єдиний контейнер у Podʼі має запит CPU 500 milliCPU та обмеження CPU 1 CPU.

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

Цей приклад виводу показує, що Pod використовує 974 milliCPU, що трохи менше за обмеження в 1 CPU, вказане в конфігурації Podʼа.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Нагадаємо, що, встановивши `-cpu "2"`, ви налаштували контейнер на спробу використовувати 2 CPU, але контейнеру дозволено використовувати лише близько 1 CPU. Використання CPU контейнером пригальмовується (throttling), оскільки контейнер намагається використати більше ресурсів CPU, ніж дозволяє його обмеження.

{{< note >}}
Інше можливе пояснення того, що використання CPU нижче 1.0, — на вузлі може бути недостатньо доступних ресурсів CPU. Нагадаємо, що передумови цієї вправи вимагають, щоб у вашому кластері був щонайменше 1 доступний для використання CPU. Якщо ваш контейнер працює на вузлі, що має лише 1 CPU, контейнер не може використовувати більше 1 CPU незалежно від обмеження CPU, вказаного для контейнера.
{{< /note >}}

## Одиниці CPU {#cpu-units}

Ресурс CPU вимірюється в одиницях *CPU*. Один CPU у Kubernetes еквівалентний:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 гіперпотоку на bare-metal процесорі Intel з Hyperthreading

Дробові значення дозволені. Контейнеру, який запитує 0,5 CPU, гарантовано вдвічі менше CPU, ніж контейнеру, який запитує 1 CPU. Для позначення «мілі» можна використовувати суфікс m. Наприклад, 100m CPU, 100 milliCPU і 0,1 CPU — це одне й те саме. Точність, вища за 1m, не допускається.

CPU завжди запитується як абсолютна кількість, ніколи як відносна; 0,1 — це однакова кількість CPU на одноядерній, двоядерній або 48-ядерній машині.

Видаліть свій Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Запит CPU, завеликий для ваших вузлів {#specify-a-cpu-request-that-is-too-big-for-your-nodes}

Запити й обмеження CPU повʼязані з контейнерами, але корисно уявляти, що запит і обмеження CPU має Pod. Запит CPU для Podʼа — це сума запитів CPU всіх контейнерів у Podʼі. Так само обмеження CPU для Podʼа — це сума обмежень CPU всіх контейнерів у Podʼі.

Планування Podʼа ґрунтується на запитах. Pod призначається для запуску на вузол, лише якщо на вузлі достатньо доступних ресурсів CPU, щоб задовольнити запит CPU Podʼа.

У цій вправі ви створюєте Pod із запитом CPU настільки великим, що він перевищує місткість будь-якого вузла у вашому кластері. Ось файл конфігурації Podʼа з одним контейнером. Контейнер запитує 100 CPU, що, найімовірніше, перевищує місткість будь-якого вузла у вашому кластері.

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" options="hl_lines=10-14" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Перегляньте статус Podʼа:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

Вивід показує, що статус Podʼа — Pending. Тобто Pod не призначено для запуску на жодному вузлі, і він залишатиметься в стані Pending безстроково:


```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Перегляньте детальну інформацію про Pod, включаючи події:

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

Вивід показує, що контейнер не можна запланувати через нестачу ресурсів CPU на вузлах:

```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Видаліть свій Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## Якщо ви не вказуєте обмеження CPU {#if-you-do-not-specify-a-cpu-limit}

Якщо ви не вказуєте обмеження CPU для контейнера, то можлива одна з таких ситуацій:

* Контейнер не має верхньої межі ресурсів CPU, які він може використовувати. Контейнер може використати всі ресурси CPU, доступні на вузлі, де він працює.

* Контейнер працює в просторі імен, що має стандартне обмеження CPU, і контейнеру автоматично призначається це стандартне обмеження. Адміністратори кластера можуть використовувати [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/), щоб задати стандартне значення обмеження CPU.

## Якщо ви вказуєте обмеження CPU, але не вказуєте запит CPU {#if-you-specify-a-cpu-limit-but-do-not-specify-a-cpu-request}

Якщо ви вказуєте обмеження CPU для контейнера, але не вказуєте запит CPU, Kubernetes автоматично призначає запит CPU, що дорівнює обмеженню. Аналогічно, якщо контейнер вказує власне обмеження памʼяті, але не вказує запит памʼяті, Kubernetes автоматично призначає запит памʼяті, що дорівнює обмеженню.

## Навіщо потрібні запити й обмеження CPU {#motivation-for-cpu-requests-and-limits}

Налаштувавши запити й обмеження CPU контейнерів, що працюють у вашому кластері, можна ефективно використовувати ресурси CPU, доступні на вузлах кластера. Тримаючи запит CPU Podʼа низьким, ви даєте Podʼу добрі шанси бути запланованим. Маючи обмеження CPU, більше за запит CPU, ви досягаєте двох речей:

* Pod може мати сплески активності, під час яких він використовує ресурси CPU, що випадково виявилися доступними.
* Кількість ресурсів CPU, яку Pod може використати під час сплеску, обмежена певною розумною величиною.

## Очищення {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace cpu-example
```

## {{% heading "whatsnext" %}} {#what-s-next}

### Для розробників застосунків {#for-app-developers}

* [Призначення ресурсів памʼяті контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Призначення ресурсів CPU і памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/)

* [Зміна розміру ресурсів CPU та памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/resize-pod-resources/)

### Для адміністраторів кластерів {#for-cluster-administrators}

* [Налаштування стандартних запитів і обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [Налаштування стандартних запитів і обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [Налаштування мінімальних і максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Налаштування мінімальних і максимальних обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [Налаштування квоти для Podʼів у просторі імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [Налаштування квот для API-обʼєктів](/docs/tasks/administer-cluster/quota-api-object/)
* [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/)
