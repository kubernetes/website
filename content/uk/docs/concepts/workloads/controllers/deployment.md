---
title: Deployment
api_metadata:
- apiVersion: "apps/v1"
  kind: "Deployment"
feature:
  title: Автоматизоване розгортання та згортання
  description: >
    Kubernetes поступово впроваджує зміни до вашого застосунку або його конфігурації, одночасно відстежуючи його стан, щоб переконатися, що він не припиняє роботу всіх робочів екземплярів застосунку одночасно. Якщо щось піде не так, Kubernetes відкотить зміни за вас. Скористайтесь перевагами зростаючої екосистеми рішень для розгортання.
description: >-
  Deployment керує набором екземплярів Podʼів та їх робочими навантаженнями, як правило, тими, що не зберігають стан.
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

_Розгортання (Deployment)_ забезпечує декларативні оновлення для {{< glossary_tooltip text="Podʼів" term_id="pod" >}} та {{< glossary_tooltip term_id="replica-set" text="ReplicaSets" >}}.

Ви описуєте _бажаний стан_ у Deployment, і {{< glossary_tooltip term_id="controller" >}} Deployment змінює фактичний стан на бажаний стан з контрольованою швидкістю. Ви можете визначити Deployment для створення нових ReplicaSets або видалення існуючих Deployment та прийняття всіх їхніх ресурсів новими Deployment.

{{< note >}}
Не керуйте ReplicaSets, що належать Deployment. Розгляньте можливість створення тікета в основному репозиторії Kubernetes, якщо ваш випадок використання не врахований нижче.
{{< /note >}}

<!-- body -->

## Сценарії використання {#use-cases}

Наступні сценарії є типовими для Deployment:

* [Створення Deployment для розгортання набору ReplicaSet](#creating-a-deployment). ReplicaSet створює Podʼи у фоновому режимі. Перевірте стан розгортання, щоб переконатися, чи воно успішне чи ні.
* [Оголошення нового стану Podʼів](#updating-a-deployment) шляхом оновлення PodTemplateSpec в Deployment. Створюється новий ReplicaSet, і Deployment поступово нарощує кількість його елементів, водночас зменшуючи старий ReplicaSet, забезпечуючи контрольовану заміну Podʼів. Кожен новий ReplicaSet оновлює ревізію Deployment.
* [Відкат до попередньої ревізії Deployment](#rolling-back-a-deployment), якщо поточний стан Deployment нестабільний. Кожен відкат оновлює ревізію Deployment.
* [Масштабування Deployment для обробки більшого навантаження](#scaling-a-deployment).
* [Призупинення Deployment](#pausing-and-resuming-a-deployment), щоб застосувати кілька виправлень до його PodTemplateSpec, а потім відновити його для початку нового розгортання.
* [Використання стану Deployment](#deployment-status) як індикатора того, що розгортання зупинилося.
* [Очищення старих ReplicaSets](#clean-up-policy), які вам більше не потрібні.

## Створення Deployment {#creating-a-deployment}

Розглянемо приклад Deployment. Він створює ReplicaSet для запуску трьох Podʼів `nginx`:

{{% code_sample file="controllers/nginx-deployment.yaml" %}}

В цьому прикладі:

* Створюється Deployment з назвою`nginx-deployment`, назва вказується в полі `.metadata.name`. Ця назва буде основою для ReplicaSets та Podʼів які буде створено потім. Дивіться [Написання Deployment Spec](#writing-a-deployment-spec) для отримання додаткових відомостей.
* Deployment створює ReplicaSet, який створює три реплікованих Podʼи, кількість зазначено у полі `.spec.replicas`.
* Поле `.spec.selector` визначає як створений ReplicaSet відшукує Podʼи для керування. В цьому випадку вибирається мітка, яка визначена в шаблоні Pod, `app: nginx`. Однак можливі складніші правила вибору, якщо шаблон Pod задовольняє це правило.

  {{< note >}}
  Поле `.spec.selector.matchLabels` є масивом пар {key,value}. Одна пара {key,value} у `matchLabels` еквівалентна елементу `matchExpressions`, де поле `key` — "key", `operator` — "In", а масив `values` містить лише "value". Всі умови, як від `matchLabels`, так і від `matchExpressions`, повинні бути виконані для отримання збігу.
  {{< /note >}}

* Поле `.spec.template` має наступні вкладені поля:
  * Podʼи позначаються міткою `app: nginx` з поля `.metadata.labels`.
  * Шаблон специфікації Podʼа, поле `.spec`, вказує на те, що Podʼи використовують один контейнер, `nginx`, який використовує образ `nginx` з [Docker Hub](https://hub.docker.com/) версія якого – 1.14.2.
  * Створюється один контейнер, який отримує назву `nginx`, яка вказана в полі `.spec.containers[0].name`.

Перед тим, як почати, переконайтеся, що ваш кластер Kubernetes працює. Дотримуйтесь наведених нижче кроків для створення Deployment:

1. Створіть Deployment скориставшись командою:

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

2. Виконайте `kubectl get deployments` для перевірки створення Deployment.

   Якщо Deployment все ще створюється, ви побачите вивід подібний цьому:

   ```none
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```

   Коли ви досліджуєте Deploymentʼи у вашому кластері, показуються наступні поля:
   * `NAME` — містить назву Deploymentʼів у просторі імен.
   * `READY` — показує скільки реплік застосунку доступно користувачам. Значення відповідає шаблону наявно/бажано.
   * `UP-TO-DATE` — показує кількість реплік, які були оновлені для досягнення бажаного стану.
   * `AVAILABLE` — показує скільки реплік доступно користувачам.
   * `AGE` — показує час впродовж якого застосунок працює.

   Notice how the number of desired replicas is 3 according to `.spec.replicas` field.

3. Для перевірки стану розгортання Deployment, виконайте `kubectl rollout status deployment/nginx-deployment`.

   Має бути подібний вивід:

   ```none
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

4. Запустіть `kubectl get deployments` знов через кілька секунд. Має бути подібний вивід:

   ```none
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```

   Бачите, що Deployment створив три репліки, і всі репліки актуальні (вони містять останній шаблон Pod) та доступні.

5. Для перевірки ReplicaSet (`rs`), створених Deployment, виконайте `kubectl get rs`. Має бути подібний вивід:

   ```none
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```

   Вивід ReplicaSet має наступні поля:

   * `NAME` — перелік назв ReplicaSets в просторі імен.
   * `DESIRED` — показує бажану кількість _реплік_ застосунку, яку ви вказали при створенні Deployment. Це — _бажаний стан_.
   * `CURRENT` — показує поточну кількість реплік, що працюють на поточний момент.
   * `READY` — показує скільки реплік застосунку доступно користувачам.
   * `AGE` — показує час впродовж якого застосунок працює.

   Зверніть увагу, що назва ReplicaSet завжди складається як `[DEPLOYMENT-NAME]-[HASH]`. Ця назва буде основою для назв Podʼів, які буде створено потім.

   Рядок `HASH` є відповідником мітки `pod-template-hash` в ReplicaSet.

6. Для ознайомлення з мітками, які було створено для кожного Pod, виконайте `kubectl get pods --show-labels`.
   Вивід буде схожим на це:

   ```none
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```

   Створений ReplicaSet таким чином переконується, що в наявності є три Podʼи  `nginx`.

{{< note >}}
Ви маєте зазначити відповідний селектор та мітки шаблону Pod в Deployment (тут, `app: nginx`).

Не використовуйте однакові мітки або селектори з іншими контролерами (включаючи інші Deployments та StatefulSets). Kubernetes не завадить вам це зробити, і якщо кілька контролерів мають селектори, що збігаються, ці контролери можуть конфліктувати та поводитись непередбачувано.
{{< /note >}}

### Мітка pod-template-hash {#pod-template-hash-label}

{{< caution >}}
Не змінюйте цю мітку.
{{< /caution >}}

Мітка `pod-template-hash` додається контролером Deployment до кожного ReplicaSet, який створює або бере під нагляд Deployment.

Ця мітка забезпечує унікальність дочірніх ReplicaSets Deploymentʼа. Вона генерується шляхом хешування `PodTemplate` ReplicaSet, і отриманий хеш використовується як значення мітки, яке додається до селектора ReplicaSet, міток шаблону Podʼа, а також до всіх наявних Podʼів, які можуть бути у ReplicaSet.

## Оновлення Deployment {#updating-a-deployment}

{{< note >}}
Оновлення Deployment викликається тільки в тому випадку, якщо шаблон Deployment Podʼа (тобто `.spec.template`) змінився, наприклад, якщо оновлено мітки чи образ контейнера шаблону. Інші оновлення, такі як масштабування Deployment, не викликають розгортання.
{{< /note >}}

Дотримуйтеся поданих нижче кроків для оновлення вашого Deployment:

1. Оновіть Podʼи nginx, щоб використовувати образ `nginx:1.16.1` замість `nginx:1.14.2`.

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```

   або використовуйте наступну команду:

   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```

   де `deployment/nginx-deployment` вказує на Deployment, `nginx` — на контейнер, який буде оновлено, і `nginx:1.16.1` — на новий образ та його теґ.

   Вивід буде схожий на:

   ```none
   deployment.apps/nginx-deployment image updated
   ```

   Альтернативно, ви можете відредагувати розгортання і змінити `.spec.template.spec.containers[0].image` з `nginx:1.14.2` на `nginx:1.16.1`:

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   Вивід буде схожий на:

   ```none
   deployment.apps/nginx-deployment edited
   ```

2. Щоб перевірити статус розгортання, виконайте:

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   Вивід буде схожий на це:

   ```none
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```

   або

   ```none
   deployment "nginx-deployment" successfully rolled out
   ```

Отримайте більше деталей про ваш оновлений Deployment:

* Після успішного розгортання можна переглянути Deployment за допомогою `kubectl get deployments`. Вивід буде схожий на це:

  ```none
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

* Виконайте `kubectl get rs`, щоб перевірити, що Deployment оновив Podʼи, створивши новий ReplicaSet та масштабував його до 3 реплік, а також зменшивши розмір старого ReplicaSet до 0 реплік.

  ```shell
  kubectl get rs
  ```

  Вивід схожий на це:

  ```none
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

* Виклик `get pods` повинен тепер показати лише нові Podʼи:

  ```shell
  kubectl get pods
  ```

  Вивід буде схожий на це:

  ```none
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  Наступного разу, коли вам потрібно буде оновити ці Podʼи, вам достатньо буде знову оновити шаблон Podʼа в Deployment.

  Deployment забезпечує, що тільки певна кількість Podʼів буде відключена під час оновлення. Типово це забезпечує, що принаймні 75% відомої кількості Podʼів будуть активними (максимум недоступних 25%).

  Deployment також забезпечує, що тільки певна кількість Podʼів буде створена поверх відомої кількості Podʼів. Типово це забезпечує, що як максимум буде активно 125% відомої кількості Podʼів (25% максимального збільшення).

  Наприклад, якщо ви ретельно досліджуєте Deployment вище, ви побачите, що спочатку було створено новий Pod, потім видалено старий Pod і створено ще один новий. Старі Podʼи не прибираються допоки не зʼявиться достатня кількість нових, і не створюються нові Podʼи допоки не буде прибрано достатню кількість старих. Deployment переконується, що принаймні 3 Podʼи доступні, і що вони не перевищують 4 Podʼа. У випадку розгортання з 4 репліками кількість Podʼів буде між 3 і 5.

* Отримайте деталі вашого розгортання:

  ```shell
  kubectl describe deployments
  ```

  Вивід буде схожий на це:

  ```none
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.16.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
  ```

  Тут ви бачите, що при створенні Deployment спочатку було створено ReplicaSet (nginx-deployment-2035384211) та масштабовано його до 3 реплік безпосередньо. Коли ви оновили Deployment, було створено новий ReplicaSet (nginx-deployment-1564180365) та масштабовано його до 1, потім Deployment дочекався, коли він запуститься. Потім було зменшено розмір старого ReplicaSet
  до 2 і масштабовано новий ReplicaSet до 2, таким чином, щоб принаймні 3 Podʼа були доступні, і не більше 4 Podʼів в будь-який момент. Потім було продовжено масштабування нового та старого ReplicaSet, з однаковою стратегією поетапного оновлення. У кінці вас буде 3 доступні репліки в новому ReplicaSet, і старий ReplicaSet зменшений до 0.

{{< note >}}
Kubernetes не враховує Podʼи, які завершують роботу, коли розраховує кількість `availableReplicas`, яка повинна бути між `replicas - maxUnavailable` та `replicas + maxSurge`. Внаслідок цього ви можете помітити, що під час розгортання є більше Podʼів, ніж очікувалося, і що загальні ресурси, які використовує Deployment, перевищують `replicas + maxSurge` до того моменту, поки не мине `terminationGracePeriodSeconds` для Podʼів, що завершують роботу.
{{< /note >}}

### Rollover (або кілька одночасних оновлень) {#rollover-aka-multiple-updates-in-flight}

Кожного разу, коли контролер Deployment виявляє новий Deployment, створюється ReplicaSet для запуску необхідних Podʼів. Якщо Deployment оновлюється, поточний ReplicaSet, який контролює Podʼи, мітки яких відповідають `.spec.selector`, але шаблон яких не відповідає `.spec.template`, зменшується. Врешті-решт новий ReplicaSet масштабується до `.spec.replicas`, а всі старі ReplicaSets масштабуються в 0.

Якщо ви оновите Deployment під час вже поточного процесу розгортання, Deployment створить новий ReplicaSet відповідно до оновлення і почне масштабувати його, і розвертати ReplicaSet, який він раніше масштабував — він додасть його до списку старих ReplicaSets та почне зменшувати його.

Наприклад, припустимо, ви створюєте Deployment для створення 5 реплік `nginx:1.14.2`, але потім оновлюєте Deployment для створення 5 реплік `nginx:1.16.1`, коли вже створено тільки 3 репліки `nginx:1.14.2`. У цьому випадку Deployment негайно починає
знищувати 3 Podʼи `nginx:1.14.2`, які вже створено, і починає створювати
Podʼи `nginx:1.16.1`. Deployment не чекає, доки буде створено 5 реплік `nginx:1.14.2`, перш ніж змінити напрямок.

### Оновлення селектора міток {#label-selector-updates}

Зазвичай не рекомендується вносити оновлення до селектора міток, і рекомендується планувати ваші селектори наперед. У будь-якому випадку, якщо вам потрібно виконати оновлення селектора міток, дійте з великою обережністю і переконайтеся, що ви розумієте всі його наслідки.

{{< note >}}
В API-версії `apps/v1` селектор міток Deployment є незмінним після створення.
{{< /note >}}

* Додавання селектора вимагає оновлення міток шаблону Podʼа в специфікації Deployment новою міткою, інакше буде повернуто помилку перевірки. Ця зміна не є такою, що перетинається з наявними мітками, що означає, що новий селектор не вибирає ReplicaSets та Podʼи, створені за допомогою старого селектора, що призводить до залишення всіх старих ReplicaSets та створення нового ReplicaSet.
* Оновлення селектора змінює поточне значення ключа селектора — призводить до такого ж результату, як і додавання.
* Вилучення селектора вилучає наявний ключ з селектора Deployment — не вимагає будь-яких змін у мітках шаблону Podʼа. Наявні ReplicaSets не залишаються сиротами, і новий ReplicaSet не створюється, але слід зауважити, що вилучена мітка все ще існує в будь-яких наявних Podʼах і ReplicaSets.

## Відкат Deployment {#rolling-back-a-deployment}

Іноді вам може знадобитися відкотити Deployment, наприклад, коли Deployment нестабільний, наприклад цикл постійних помилок. Типово, вся історія Deployment зберігається в системі, щоб ви могли відкотити його в будь-який час (ви можете змінити це, змінивши обмеження історії ревізій).

{{< note >}}
Ревізія Deployment створюється, коли спрацьовує Deployment. Це означає, що нова ревізія створюється тільки тоді, коли змінюється шаблон Podʼа Deployment (`.spec.template`), наприклад, якщо ви оновлюєте мітки або образи контейнера в шаблоні. Інші оновлення, такі як масштабування Deployment, не створюють ревізію Deployment, щоб ви могли одночасно використовувати ручне або автоматичне масштабування. Це означає, що при відкаті до попередньої ревізії повертається лише частина шаблону Podʼа Deployment.
{{< /note >}}

* Припустимо, ви припустилися помилки при оновленні Deployment, вказавши назву образу як `nginx:1.161` замість `nginx:1.16.1`:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161
  ```

  Вивід буде подібний до цього:

  ```none
  deployment.apps/nginx-deployment image updated
  ```

* Розгортання застрягає. Ви можете перевірити це, перевіривши стан розгортання:

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  Вивід буде подібний до цього:

  ```none
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

* Натисніть Ctrl-C, щоб зупинити спостереження за станом розгортання. Щодо деталей розгортання, що застрягло, [читайте тут](#deployment-status).

* Ви бачите, що кількість старих реплік (додаючи кількість реплік від `nginx-deployment-1564180365` та `nginx-deployment-2035384211`) — 3, а кількість нових реплік (від `nginx-deployment-3066724191`) — 1.

  ```shell
  kubectl get rs
  ```

  Вивід буде подібний до цього:

  ```none
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

* При перегляді створених Podʼів ви бачите, що 1 Pod, створений новим ReplicaSet, застряг у циклі завантаження образу.

  ```shell
  kubectl get pods
  ```

  Вивід буде подібний до цього:

  ```none
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  Контролер Deployment автоматично зупиняє невдале розгортання та припиняє масштабування нового ReplicaSet. Це залежить від параметрів rollingUpdate (`maxUnavailable`), які ви вказали. Стандартно Kubernetes встановлює значення 25%.
  {{< /note >}}

* Отримання опису розгортання:

  ```shell
  kubectl describe deployment
  ```

  Вивід буде подібний до цього:

  ```none
  Name:           nginx-deployment
  Namespace:      default
  CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
  Labels:         app=nginx
  Selector:       app=nginx
  Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
  StrategyType:       RollingUpdate
  MinReadySeconds:    0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
    Containers:
     nginx:
      Image:        nginx:1.161
      Port:         80/TCP
      Host Port:    0/TCP
      Environment:  <none>
      Mounts:       <none>
    Volumes:        <none>
  Conditions:
    Type           Status  Reason
    ----           ------  ------
    Available      True    MinimumReplicasAvailable
    Progressing    True    ReplicaSetUpdated
  OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
  NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
  Events:
    FirstSeen LastSeen    Count   From                    SubObjectPath   Type        Reason              Message
    --------- --------    -----   ----                    -------------   --------    ------              -------
    1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  ```

  Для виправлення цього вам потрібно відкотитиcm до попередньої ревізії Deployment, яка є стабільною.

### Перевірка історії розгортання Deployment {#checking-rollout-history-of-a-deployment}

Виконайте наведені нижче кроки, щоб перевірити історію розгортань:

1. По-перше, перевірте ревізії цього Deployment:

   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```

   Вивід буде подібний до цього:

   ```none
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           <none>
   2           <none>
   3           <none>
   ```

   `CHANGE-CAUSE` копіюється з анотації Deployment `kubernetes.io/change-cause` до його ревізій при створенні. Ви можете вказати повідомлення `CHANGE-CAUSE`:

   * Анотуючи Deployment командою `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`
   * Ручним редагуванням маніфесту ресурсу.
   * Використовуючи інструменти, які автоматично встановлюють анотації.

  {{< note >}}
  У старих версіях Kubernetes можна було використовувати прапорець `--record` з командами kubectl для автоматичного заповнення поля `CHANGE-CAUSE`. Цей прапорець є застарілим і буде видалений у майбутніх версіях.
  {{< /note >}}

2. Щоб переглянути деталі кожної ревізії, виконайте:

   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   Вивід буде подібний до цього:

   ```none
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Containers:
      nginx:
       Image:      nginx:1.16.1
       Port:       80/TCP
        QoS Tier:
           cpu:      BestEffort
           memory:   BestEffort
       Environment Variables:      <none>
     No volumes.
   ```

### Відкат до попередньої ревізії {#rolling-back-to-a-previous-revision}

Виконайте наведені нижче кроки, щоб відкотити Deployment з поточної версії на попередню версію, яка є версією 2.

1. Тепер ви вирішили скасувати поточне розгортання та повернутися до попередньої ревізії:

   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   Вивід буде подібний до цього:

   ```none
   deployment.apps/nginx-deployment rolled back
   ```

   Замість цього ви можете виконати відкат до певної ревізії, вказавши її параметром `--to-revision`:

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   Вивід буде подібний до цього:

   ```none
   deployment.apps/nginx-deployment rolled back
   ```

   Для отримання додаткових відомостей про команди, повʼязані з розгортаннями, читайте [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).

   Deployment тепер повернуто до попередньої стабільної ревізії. Як ви можете бачити, контролер розгортань генерує подію `DeploymentRollback` щодо відкату до ревізії 2.

2. Перевірте, чи відкат був успішним і Deployment працює як очікується, виконавши:

   ```shell
   kubectl get deployment nginx-deployment
   ```

   Вивід буде подібний до цього:

   ```none
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```

3. Отримайте опис розгортання:

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   Вивід подібний до цього:

   ```none
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
   Selector:               app=nginx
   Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
     Labels:  app=nginx
     Containers:
      nginx:
       Image:        nginx:1.16.1
       Port:         80/TCP
       Host Port:    0/TCP
       Environment:  <none>
       Mounts:       <none>
     Volumes:        <none>
   Conditions:
     Type           Status  Reason
     ----           ------  ------
     Available      True    MinimumReplicasAvailable
     Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
   Events:
     Type    Reason              Age   From                   Message
     ----    ------              ----  ----                   -------
     Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
     Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
     Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
   ```

### Масштабування Deployment {#scaling-a-deployment}

Ви можете масштабувати Deployment за допомогою наступної команди:

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```

Вивід буде подібний до цього:

```none
deployment.apps/nginx-deployment scaled
```

Припускаючи, що [горизонтальне автомасштабування Pod](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) увімкнено у вашому кластері, ви можете налаштувати автомасштабування для вашого Deployment і вибрати мінімальну та максимальну кількість Podʼів, які ви хочете запустити на основі використання ЦП вашими поточними Podʼами.

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80
```

Вивід буде подібний до цього:

```none
deployment.apps/nginx-deployment scaled
```

### Пропорційне масштабування {#proportional-scaling}

Deployment RollingUpdate підтримує виконання кількох версій застосунку одночасно. Коли ви або автомасштабування масштабуєте Deployment RollingUpdate, яке знаходиться в процесі розгортання (будь-то в процесі або призупинено), контролер Deployment балансує додаткові репліки в наявних активних ReplicaSets (ReplicaSets з Podʼами), щоб помʼякшити ризик. Це називається _пропорційним масштабуванням_.

Наприклад, ви використовуєте Deployment з 10 репліками, [maxSurge](#max-surge)=3 та [maxUnavailable](#max-unavailable)=2.

* Переконайтеся, що в вашому Deployment працює 10 реплік.

  ```shell
  kubectl get deploy
  ```

  Вивід буде подібний до цього:

  ```none
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* Ви оновлюєте образ, який, як виявляється, неможливо знайти в межах кластера.

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  Вивід подібний до цього:

  ```none
  deployment.apps/nginx-deployment image updated
  ```

* Оновлення образу розпочинає новий rollout з ReplicaSet nginx-deployment-1989198191, але воно блокується через вимогу `maxUnavailable`, яку ви вказали вище. Перевірте стан rollout:

  ```shell
  kubectl get rs
  ```

  Вивід буде подібний до цього:

  ```none
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

* Потім надходить новий запит на масштабування для Deployment. Автомасштабування збільшує репліки Deployment до 15. Контролер Deployment повинен вирішити, куди додати цих нових 5 реплік. Якби ви не використовували пропорційне масштабування, всі 5 реплік були б додані в новий ReplicaSet. З пропорційним масштабуванням ви розподіляєте додаткові репліки між всіма ReplicaSets. Більші частки йдуть в ReplicaSets з найбільшою кількістю реплік, а менші частки йдуть в ReplicaSets з меншою кількістю реплік. Залишки додаються до ReplicaSet з найбільшою кількістю реплік. ReplicaSets з нульовою кількістю реплік не масштабуються.

У нашому прикладі вище 3 репліки додаються до старого ReplicaSet, а 2 репліки — до нових ReplicaSet. Процес розгортання повинен остаточно перемістити всі репліки в новий ReplicaSet, за умови, що нові репліки стають справними. Для підтвердження цього виконайте:

```shell
kubectl get deploy
```

Вивід буде подібний до цього:

```none
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```

Статус rollout підтверджує, як репліки були додані до кожного ReplicaSet.

```shell
kubectl get rs
```

Вивід буде подібний до цього:

```none
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

### Призупинення та відновлення розгортання Deployment {#pausing-and-resuming-a-deployment}

При оновленні Deployment або плануванні оновлення ви можете призупинити розгортання для цього Deployment перед тим, як запустити одне чи кілька оновлень. Коли ви готові застосувати зміни, ви відновлюєте розгортання для Deployment. Цей підхід дозволяє вам застосовувати кілька виправлень між призупиненням та відновленням без зайвих розгортань.

* Наприклад, з Deployment, яке було створено:

  Отримайте деталі Deployment:

  ```shell
  kubectl get deploy
  ```

  Вивід буде подібний до цього:

  ```none
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```

  Отримайте стан розгортання:

  ```shell
  kubectl get rs
  ```

  Вивід буде подібний до цього:

  ```none
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* Зробіть паузу за допомогою наступної команди:

  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  Вивід буде подібний до цього:

  ```none
  deployment.apps/nginx-deployment paused
  ```

* Потім оновіть образ в Deployment:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  Вивід буде подібний до цього:

  ```none
  deployment.apps/nginx-deployment image updated
  ```

* Зверніть увагу, що новий rollout не розпочався:

  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  Вивід буде подібний до цього:

  ```none
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```

* Отримайте стан розгортання, щоб перевірити, що існуючий ReplicaSet не змінився:

  ```shell
  kubectl get rs
  ```

  Вивід буде подібний до цього:

  ```none
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

* Ви можете робити стільки оновлень, скільки вам потрібно, наприклад, оновіть ресурси, які будуть використовуватися:

  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  Вивід буде подібний до цього:

  ```none
  deployment.apps/nginx-deployment resource requirements updated
  ```

  Початковий стан Deployment перед призупиненням його rollout продовжить свою роботу, але нові оновлення до Deployment не матимуть жодного впливу, поки розгортання Deployment призупинено.

* У кінці відновіть розгортання Deployment і спостерігайте, як новий ReplicaSet зʼявляється з усіма новими оновленнями:

  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  Вивід буде подібний до цього:

  ```none
  deployment.apps/nginx-deployment resumed
  ```

* Спостерігайте за статусом розгортання, доки воно не завершиться.

  ```shell
  kubectl get rs --watch
  ```

  Вивід буде подібний до цього:

  ```none
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   2         2         2         2m
  nginx-3926361531   2         2         0         6s
  nginx-3926361531   2         2         1         18s
  nginx-2142116321   1         2         2         2m
  nginx-2142116321   1         2         2         2m
  nginx-3926361531   3         2         1         18s
  nginx-3926361531   3         2         1         18s
  nginx-2142116321   1         1         1         2m
  nginx-3926361531   3         3         1         18s
  nginx-3926361531   3         3         2         19s
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         20s
  ```

* Отримайте статус останнього розгортання:

  ```shell
  kubectl get rs
  ```

  Вивід буде подібний до цього:

  ```none
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```

{{< note >}}
Ви не можете відкотити призупинене розгортання Deployment, доки ви його не відновите.
{{< /note >}}

### Статус Deployment {#deployment-status}

Deployment переходить через різні стани протягом свого життєвого циклу. Він може бути [d процесі](#progressing-deployment), коли виконується розгортання нового ReplicaSet, може бути [завершеним](#complete-deployment) або [невдалим](#failed-deployment).

### Deployment в процесі {#progressing-deployment}

Kubernetes позначає Deployment як _в процесі_ (progressing), коли виконується одне з наступних завдань:

* Deployment створює новий ReplicaSet.
* Deployment масштабує вгору свій новий ReplicaSet.
* Deployment масштабує вниз свої старі ReplicaSet(s).
* Нові Podʼи стають готовими або доступними (готові принаймні [MinReadySeconds](#min-ready-seconds)).

Коли розгортання стає "в процесі" (progressing), контролер Deployment додає умову із наступними атрибутами до `.status.conditions` Deployment:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

Ви можете відстежувати хід розгортання за допомогою `kubectl rollout status`.

### Завершений Deployment {#complete-deployment}

Kubernetes позначає Deployment як _завершений_ (complete), коли він має наступні характеристики:

* Всі репліки, повʼязані з Deployment, були оновлені до останньої версії, яку ви вказали. Це означає, що всі запитані вами оновлення були завершені.
* Всі репліки, повʼязані з Deployment, доступні.
* Не працюють жодні старі репліки для Deployment.

Коли розгортання стає "завершеним" (complete), контролер Deployment встановлює умову із наступними атрибутами до `.status.conditions` Deployment:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

Ця умова `Progressing` буде зберігати значення статусу `"True"` до тих пір, поки не буде запущено нове розгортання. Умова залишається незмінною навіть тоді, коли змінюється доступність реплік (це не впливає на умову `Available`).

Ви можете перевірити, чи завершено Deployment, використовуючи `kubectl rollout status`. Якщо Deployment завершився успішно, `kubectl rollout status` повертає код виходу нуль (успіх).

```shell
kubectl rollout status deployment/nginx-deployment
```

Вивід буде схожий на наступний:

```none
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```

і код виходу з `kubectl rollout` дорівнює 0 (успіх):

```shell
echo $?
```

```none
0
```

### Невдалий Deployment {#failed-deployment}

Ваш Deployment може застрягти під час намагання розгорнути свій новий ReplicaSet і ніколи не завершитися. Це може статися через наступне:

* Недостатні квоти
* Збій проб readiness
* Помилки підтягування образів
* Недостатні дозволи
* Обмеження лімітів
* Неправильна конфігурація середовища виконання застосунку

Один із способів виявлення цього стану — це вказати параметр граничного терміну в специфікації вашого розгортання: ([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` вказує кількість секунд, протягом яких контролер Deployment чекатиме, перш ніж вказати (в статусі Deployment), що прогрес розгортання зупинився.

Наступна команда `kubectl` встановлює специфікацію з `progressDeadlineSeconds`, щоб змусити контролер повідомляти про відсутність прогресу розгортання для Deployment після 10 хвилин:

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```

Вивід буде схожий на наступний:

```none
deployment.apps/nginx-deployment patched
```

Після того як граничний термін закінчився, контролер Deployment додає DeploymentCondition з наступними атрибутами до `.status.conditions` Deployment:

* `type: Progressing`
* `status: "False"`
* `reason: ProgressDeadlineExceeded`

Ця умова також може зазнати невдачі на ранніх етапах, і тоді вона встановлюється в значення статусу `"False"` з причинами, такими як `ReplicaSetCreateError`. Крім того, термін не враховується більше після завершення розгортання.

Дивіться [Домовленості API Kubernetes](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) для отримання додаткової інформації щодо умов статусу.

{{< note >}}
Kubernetes не вживає ніяких заходів стосовно до зупиненого Deployment, крім як звітувати про умову статусу з `reason: ProgressDeadlineExceeded`. Оркестратори вищого рівня можуть використовувати це і відповідним чином діяти, наприклад, відкотити Deployment до його попередньої версії.
{{< /note >}}

{{< note >}}
Якщо ви призупините розгортання Deployment, Kubernetes не перевірятиме прогрес відносно вашого вказаного терміну. Ви можете безпечно призупинити розгортання Deployment в середині процесу розгортання та відновити його, не викликаючи
умову виходу за граничним терміном.
{{< /note >}}

Ви можете зіткнутися з тимчасовими помилками у Deployment, або через низький таймаут, який ви встановили, або через будь-який інший вид помилок, який можна розглядати як тимчасовий. Наприклад, допустімо, що у вас недостатні квоти. Якщо ви
опишете Deployment, ви помітите наступний розділ:

```shell
kubectl describe deployment nginx-deployment
```

Вивід буде схожий на наступний:

```none
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

Якщо ви виконаєте `kubectl get deployment nginx-deployment -o yaml`, статус Deployment схожий на це:

```none
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    last

UpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

В решті решт, коли граничний термін прогресу Deployment буде перевищений, Kubernetes оновить статус і причину умови Progressing:

```none
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Ви можете вирішити проблему недостатньої квоти, зменшивши масштаб вашого Deployment, зменшивши масштаб інших контролерів, які ви можете виконувати, або збільшивши квоту у вашому просторі імен. Якщо ви задовольните умови квоти
і контролер Deployment завершить розгортання, ви побачите, що статус Deployment оновлюється успішною умовою (`status: "True"` та `reason: NewReplicaSetAvailable`).

```none
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`type: Available` з `status: "True"` означає, що у вас є мінімальна доступність Deployment. Мінімальна доступність визначається параметрами, вказаними в стратегії розгортання. `type: Progressing` з `status: "True"` означає, що ваш Deployment або знаходиться в середині розгортання і прогресує, або він успішно завершив свій прогрес, і доступна мінімально необхідна нова кількість реплік (див. причину умови для конкретики — у нашому випадку `reason: NewReplicaSetAvailable` означає, що Deployment завершено).

Ви можете перевірити, чи Deployment не вдався за допомогою `kubectl rollout status`. `kubectl rollout status` повертає код виходу, відмінний від нуля, якщо Deployment перевищив граничний термін виконання.

```shell
kubectl rollout status deployment/nginx-deployment
```

Вивід буде схожий на наступний:

```none
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```

і код виходу з `kubectl rollout` дорівнює 1 (позначає помилку):

```shell
echo $?
```

```none
1
```

### Операції з невдалим Deployment {#operations-on-a-failed-deployment}

Всі дії, які застосовуються до завершеного Deployment, також застосовуються до невдалого Deployment. Ви можете масштабувати його вгору/вниз, відкотити на попередню ревізію або навіть призупинити, якщо вам потрібно застосувати кілька корекцій у шаблоні Pod Deployment.

### Політика очищення {#clean-up-policy}

Ви можете встановити поле `.spec.revisionHistoryLimit` у Deployment, щоб вказати, скільки старих ReplicaSets для цього Deployment ви хочете зберегти. Решта буде видалена як сміття в фоновому режимі. Типове значення становить 10.

{{< note >}}
Якщо явно встановити це поле на 0, буде виконано очищення всієї історії вашого Deployment, і цей Deployment не зможе виконати відкат.
{{< /note >}}

Очищення починається лише після того, як Deployment досягне стану [завершення](/docs/concepts/workloads/controllers/deployment/#complete-deployment). Якщо ви встановите `.spec.revisionHistoryLimit` у 0, будь-яке розгортання все одно спричинить створення нового ReplicaSet до того, як Kubernetes видалить старий.

Навіть з ненульовим лімітом історії ревізій ви можете мати більше ReplicaSets, ніж ви налаштували. Наприклад, якщо у podʼах відбувається аварійне завершення, і з часом запускається декілька подій оновлення, ви можете мати більше ReplicaSets, ніж встановлено `.spec.revisionHistoryLimit`, оскільки Deployment ніколи не досягає завершеного стану.

## Canary Deployment

Якщо ви хочете впроваджувати релізи для підмножини користувачів чи серверів, використовуючи Deployment, ви можете створити кілька Deployment, один для кожного релізу, слідуючи шаблону Canary, описаному в [управлінні ресурсами](/docs/concepts/workloads/management/#canary-deployments).

## Написання специфікації Deployment {#writing-a-deployment-spec}

Як і з усіма іншими конфігураціями Kubernetes, у Deployment потрібні поля `.apiVersion`, `.kind` і `.metadata`. Для загальної інформації щодо роботи з файлами конфігурацій дивіться документи [розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/), [налаштування контейнерів](/docs/tasks/run-application/configure-pod-container/) та [використання kubectl для управління ресурсами](/docs/concepts/overview/working-with-objects/object-management/).

Коли панель управління створює нові Podʼи для Deployment, `.metadata.name` Deployment є частиною основи для найменування цих Podʼів. Назва Deployment повинна бути дійсним значенням [DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names), але це може призводити до неочікуваних результатів для імен хостів Podʼів. Для найкращої сумісності імʼя повинно відповідати більш обмеженим правилам [DNS-мітки](/docs/concepts/overview/working-with-objects/names#dns-label-names).

Deployment також потребує розділу [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Шаблон Pod {#pod-template}

`.spec.template` та `.spec.selector` — єдині обовʼязкові поля `.spec`.

`.spec.template` — це [шаблон Pod](/docs/concepts/workloads/pods/#pod-templates). Він має точно таку ж схему, як і {{< glossary_tooltip text="Pod" term_id="pod" >}}, за винятком того, що він вкладений і не має `apiVersion` або `kind`.

Крім обовʼязкових полів для Pod, шаблон Pod в Deployment повинен вказати відповідні мітки та відповідну політику перезапуску. Щодо міток, переконайтеся, що вони не перекриваються з іншими контролерами. Дивіться [селектор](#selector).

Дозволяється лише [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy), рівне `Always`, що є стандартним значенням, якщо не вказано інше.

### Репліки {#replicas}

`.spec.replicas` — це необовʼязкове поле, яке вказує кількість бажаних Podʼів. Стандартно встановлено значення 1.

Якщо ви вручну масштабуєте Deployment, наприклад, через `kubectl scale deployment deployment --replicas=X`, а потім ви оновлюєте цей Deployment на основі маніфесту (наприклад: виконуючи `kubectl apply -f deployment.yaml`), то застосування цього маніфесту перезаписує ручне масштабування, яке ви раніше вказали.

Якщо [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (або будь-який аналогічний API для горизонтального масштабування) відповідає за масштабування Deployment, не встановлюйте значення в `.spec.replicas`.

Замість цього дозвольте панелі управління Kubernetes автоматично керувати полем `.spec.replicas`.

### Селектор {#selector}

`.spec.selector` — обовʼязкове поле, яке вказує [селектор міток](/docs/concepts/overview/working-with-objects/labels/) для Podʼів, які створює цей Deployment.

`.spec.selector` повинно відповідати `.spec.template.metadata.labels`, або воно буде відхилено API.

В API-версії `apps/v1` `.spec.selector` та `.metadata.labels` не встановлюють стандартні значення на основі `.spec.template.metadata.labels`, якщо вони не встановлені. Таким чином, їх слід встановлювати явно. Також слід зазначити, що `.spec.selector` неможливо змінити після створення Deployment в `apps/v1`.

Deployment може примусово завершити Podʼи, мітки яких відповідають селектору, якщо їх шаблон відмінний від `.spec.template` або якщо загальна кількість таких Podʼів перевищує `.spec.replicas`. Запускає нові Podʼи з `.spec.template`, якщо кількість Podʼів менше, ніж бажана кількість.

{{< note >}}
Вам не слід створювати інші Podʼи, мітки яких відповідають цьому селектору, або безпосередньо, створюючи інший Deployment, або створюючи інший контролер, такий як ReplicaSet або ReplicationController. Якщо ви це зробите, перший Deployment вважатиме, що він створив ці інші Podʼи. Kubernetes не забороняє вам робити це.
{{< /note >}}

Якщо у вас є кілька контролерів із подібними селекторами, контролери будуть конфліктувати між собою і не будуть вести себе коректно.

### Стратегія {#strategy}

`.spec.strategy` визначає стратегію, якою замінюються старі Podʼи новими. `.spec.strategy.type` може бути "Recreate" або "RollingUpdate". Типовим значенням є "RollingUpdate".

#### Перестворення Deployment {#recreate-deployment}

Всі поточні Podʼи примусово зупиняються та вилучаються, перш ніж створюються нові, коли `.spec.strategy.type==Recreate`.

{{< note >}}
Це гарантує тільки завершення роботи Podʼи до створення для оновлення. Якщо ви оновлюєте Deployment, всі Podʼи старої ревізії будуть негайно завершені. Успішне видалення очікується перед створенням будь-якого Podʼи нової ревізії. Якщо ви вручну видаляєте Pod, життєвий цикл керується ReplicaSet, і заміщення буде створено негайно (навіть якщо старий Pod все ще перебуває в стані Terminating). Якщо вам потрібна гарантія "at most" для ваших Podʼів, вам слід розглянути використання [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
{{< /note >}}

#### Оновлення Deployment {#rolling-update-deployment}

Deployment оновлює Podʼи в режимі поетапного оновлення (поступово прибираючи старі ReplicaSets і додаючи нові), коли `.spec.strategy.type==RollingUpdate`. Ви можете вказати `maxUnavailable` та `maxSurge`, щоб контролювати процес поетапного оновлення.

##### Максимально недоступний {#max-unavailable}

`.spec.strategy.rollingUpdate.maxUnavailable` — це необовʼязкове поле, яке вказує максимальну кількість Podʼів, які можуть бути недоступні під час процесу оновлення. Значення може бути абсолютним числом (наприклад, 5) або відсотком від бажаної кількості Podʼів (наприклад, 10%). Абсолютне число обчислюється з відсотком, округленим вниз. Значення не може бути 0, якщо `MaxSurge` дорівнює 0. Станадартне значення — 25%.

Наприклад, якщо це значення встановлено на 30%, старий ReplicaSet може бути масштабований до 70% від бажаної кількості Podʼів негайно, коли починається поетапне оновлення. Як тільки нові Podʼи готові, старий ReplicaSet може бути ще більше масштабований вниз, а після цього може бути збільшено масштаб нового ReplicaSet, забезпечуючи, що загальна кількість Podʼів, доступних у будь-який час під час оновлення, становить принаймні 70% від бажаної кількості Podʼів.

##### Максимальний наплив {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge` — це необовʼязкове поле, яке вказує максимальну кількість Podʼів, які можуть бути створені понад бажану кількість Podʼів. Значення може бути абсолютним числом (наприклад, 5) або відсотком від бажаної кількості Podʼів (наприклад, 10%). Абсолютне число обчислюється з відсотком, округленим вгору. Значення не може бути 0, якщо `MaxUnavailable` дорівнює 0. Станадартне значення - 25%.

Наприклад, якщо це значення встановлено на 30%, новий ReplicaSet може бути масштабований негайно, коли починається поетапне оновлення, таким чином, щоб загальна кількість старих і нових Podʼів не перевищувала 130% від бажаної кількості Podʼів. Як тільки старі Podʼи буде вилучено, новий ReplicaSet може бути масштабований ще більше, забезпечуючи, що загальна кількість Podʼів, які працюють в будь-який час під час оновлення, становить найбільше 130% від бажаної кількості Podʼів.

Ось кілька прикладів оновлення Deployment за допомогою `maxUnavailable` та `maxSurge`:

{{< tabs name="tab_with_md" >}}
{{% tab name="Max Unavailable" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
 ```

{{% /tab %}}
{{% tab name="Max Surge" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
 ```

{{% /tab %}}
{{% tab name="Гібрид" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
 ```

{{% /tab %}}
{{< /tabs >}}

### Час Progress Deadline {#progress-deadline-seconds}

`.spec.progressDeadlineSeconds` — це необовʼязкове поле, яке вказує кількість секунд, протягом яких ви хочете чекати, поки ваш Deployment продовжиться, перш ніж система повідомить, що Deployment має [помилку](#failed-deployment) — відображається як умова з `type: Progressing`, `status: "False"` та `reason: ProgressDeadlineExceeded` в статусі ресурсу. Контролер Deployment буде продовжувати
повторювати спроби Deployment. Станадартно це значення становить 600. У майбутньому, коли буде реалізовано автоматичний відкат, контролер Deployment відкотить Deployment, як тільки він виявить таку умову.

Якщо вказано це поле, воно повинно бути більше, ніж значення `.spec.minReadySeconds`.

### Час Min Ready {#min-ready-seconds}

`.spec.minReadySeconds` — це необовʼязкове поле, яке вказує мінімальну кількість секунд, протягом яких новий створений Pod повинен бути готовим, і жоден з його контейнерів не повинен виходити з ладу, щоб його вважалим доступним. Стандартно  це значення становить 0 (Pod буде вважатися доступним, як тільки він буде готовий). Щоб дізнатися більше про те, коли Pod вважається готовим, див. [Проби контейнерів](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Podʼи, які завершуть роботу {#terminating-pods}

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

Ви можете завершення роботи поділ якщо ви увімкнули [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/#DeploymentReplicaSetTerminatingReplicas) `DeploymentReplicaSetTerminatingReplicas` в [API server](/docs/reference/command-line-tools-reference/kube-apiserver/) та в [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)

Видалення або зменшення кількості podʼів може зайняти тривалий час, і впродовж цього періоду вони можуть споживати додаткові ресурси. Як наслідок, загальна кількість усіх podʼів може тимчасово перевищити `.spec.replicas`. Закінчення роботи podʼів можна відстежувати за допомогою поля `.status.terminatingReplicas` в Deployment.

### Ліміт історії ревізій {#revision-history-limit}

Історія ревізій Deployment зберігається в ReplicaSets, якими він керує.

`.spec.revisionHistoryLimit` — це необовʼязкове поле, яке вказує кількість старих ReplicaSets, які слід зберігати для можливості відкату. Ці старі ReplicaSets витрачають ресурси в `etcd` та заважають виводу `kubectl get rs`. Конфігурація кожного ревізії Deployment зберігається в його ReplicaSets; отже, після видалення старого ReplicaSet ви втрачаєте можливість відкотитися до цієї ревізії Deployment. Стандартно буде збережено 10 старих ReplicaSets, але ідеальне значення залежить від частоти та стабільності нових Deployment.

Зокрема, встановлення цього поля рівним нулю означає, що всі старі ReplicaSets з 0 реплік буде очищено. У цьому випадку нове розгортання Deployment не може бути скасовано, оскільки його історія ревізій очищена.

### Пауза {#paused}

`.spec.paused` — це необовʼязкове булеве поле для призупинення та відновлення Deployment. Єдиний відмінок між призупиненим Deployment і тим, який не призупинений, полягає в тому, що будь-які зміни в PodTemplateSpec призупиненого Deployment не викличуть нових розгортань, поки він призупинений. Deployment типово не призупинений при створенні.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Podʼи](/docs/concepts/workloads/pods).
* [Запустіть stateless застосунок за допомогою Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
* Прочитайте {{< api-reference page="workload-resources/deployment-v1" >}}, щоб зрозуміти API Deployment.
* Прочитайте про [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) та як ви можете використовувати його для управління доступністю застосунку під час розладу.
* Використовуйте kubectl для [створення Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/).
