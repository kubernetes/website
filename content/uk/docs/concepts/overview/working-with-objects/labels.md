---
title: Мітки та Селектори
content_type: concept
weight: 40
---

<!-- overview -->

_Мітки_ — це пари ключ/значення, які прикріплені до {{< glossary_tooltip text="обʼєктів" term_id="object" >}}, таких як Pod. Мітки призначені для використання для вказівки визначних атрибутів обʼєктів, які мають значення та стосуються користувачів, але безпосередньо не вбачають семантику для основної системи. Мітки можуть бути використані для організації та вибору підмножини обʼєктів. Мітки можуть бути прикріплені до обʼєктів при їх створенні та пізніше додані та змінені в будь-який час. Кожен обʼєкт може мати набір унікальних міток ключ/значення. Кожен ключ повинен бути унікальним для даного обʼєкта.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Мітки дозволяють є ефективними для запитів та спостережень та є ідеальними для використання в інтерфейсах користувача та інтерфейсах командного рядка. Інформацію, що не є ідентифікуючою, слід записувати за допомогою [анотацій](/docs/concepts/overview/working-with-objects/annotations/).

<!-- body -->

## Мотивація {#motivation}

Мітки дозволяють користувачам звʼязувати свої власні організаційні структури з обʼєктами системи у вільний спосіб, не вимагаючи зберігання цих звʼязків в клієнтах.

Розгортання Service та конвеєрів обробки пакетів часто є багатомірними сутностями (наприклад, кілька розділів чи розгортань, кілька шляхів релізів, кілька рівнів, кілька мікросервісів на кожному рівні). Управління часто потребує наскрізних операцій, які порушують інкапсуляцію строго ієрархічних уявлень, особливо жорстких ієрархій, визначених інфраструктурою, а не користувачами.

Приклади міток:

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

Це приклади [загальновживаних міток](/docs/concepts/overview/working-with-objects/common-labels/); ви вільні розробляти свої власні домовленості. Памʼятайте, що ключ мітки повинен бути унікальним для даного обʼєкта.

## Синтаксис та набір символів {#syntax-and-character-set}

_Мітки_ — це пари ключ/значення. Дійсні ключі міток мають два сегменти: необовʼязковий префікс та назву, розділені слешем (`/`). Сегмент назви є обовʼязковим і має бути не більше 63 символів, починатися та закінчуватися буквено-цифровим символом (`[a-z0-9A-Z]`) з дефісами (`-`), підкресленнями (`_`), крапками (`.`), та буквено-цифровими символами між ними. Префікс є необовʼязковим. Якщо вказаний, префікс повинен бути піддоменом DNS: серією DNS-міток, розділених крапками (`.`), не довше 253 символів загалом, за яким слідує слеш (`/`).

Якщо префікс відсутній, ключ мітки вважається приватним для користувача. Автоматизовані компоненти системи (наприклад, `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, або інші засоби автоматизації від інших сторін), які додають мітки до обʼєктів користувача, повинні вказати префікс.

Префікси `kubernetes.io/` та `k8s.io/` є [зарезервованими](/docs/reference/labels-annotations-taints/) для основних компонентів Kubernetes.

Дійсне значення мітки:

* повинно бути не більше 63 символів (може бути порожнім),
* крім порожнього значення, повинно починатися та закінчуватися буквено-цифровим символом (`[a-z0-9A-Z]`),
* може містити дефіси (`-`), підкреслення (`_`), крапки (`.`), та буквено-цифрові символи між ними.

Наприклад, ось маніфест для Pod із двома мітками `environment: production` та `app: nginx`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## Селектори міток {#label-selectors}

На відміну від [назв та UID](/docs/concepts/overview/working-with-objects/names/), мітки не забезпечують унікальності. Загалом, ми очікуємо, що багато обʼєктів матимуть ті ж самі мітки.

За допомогою _селектора міток_ користувач може ідентифікувати набір обʼєктів. Селектор міток є основним примітивом гуртування в Kubernetes.

На цей момент API підтримує два типи селекторів: _equality-based_ та _set-based_. Селектор міток може складатися з кількох _вимог_, які розділені комами. У випадку кількох вимог всі повинні бути задоволені, таким чином кома виступає логічним
оператором _AND_ (`&&`).

{{< note >}}
Для деяких типів API, таких як ReplicaSets, селектори міток двох екземплярів не повинні перетинатися в одному просторі імен, бо контролер може вважати це конфліктною інструкцією та не визначити, скільки реплік повинно бути присутньо.
{{< /note >}}

{{< caution >}}
Для умов на основі рівності і на основі множини немає логічного оператора _OR_ (`||`). Переконайтеся, що ваші вирази фільтрації структуровані відповідно.
{{< /caution >}}

### _Equality-based_ вимоги {#equality-based-requirement}

Вимоги _Equality-_ чи _inequality-based_ дозволяють фільтрувати обʼєкти за ключами та значеннями міток. Відповідні обʼєкти повинні задовольняти всі вказані обмеження міток, хоча вони можуть мати додаткові мітки також. Допускаються три види операторів: `=`, `==`, `!=`. Перший та другий представляють _рівність_ (_equality_) і є синонімами, тоді як останній представляє _нерівність_ (_inequality_).
Наприклад:

```ini
environment = production
tier != frontend
```

Перший вибирає всі ресурси з ключем `environment` та значенням `production`. Другий вибирає всі ресурси з ключем `tier` та значеннями відмінним від `frontend`, та всі ресурси без міток з ключем `tier`. Можна використовувати оператор коми для фільтрації ресурсів у `production`, іншими словами, `environment=production,tier!=frontend`.

Один зі сценаріїв використання вимог на основі рівності використовується для Podʼів, які вказують критерії вибору вузлів. Наприклад, зразок Podʼа нижче вибирає вузли з міткою `accelerator` зі значенням "`accelerator=nvidia-tesla-p100`".

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### _Set-based_ вимоги {#set-based-requirements}

Вимоги на основі множини дозволяють фільтрувати ключі за набором значень. Підтримуються три види операторів: `in`, `notin` та `exists` (тільки ідентифікатор ключа). Наприклад:

```ini
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

* Перший приклад вибирає всі ресурси з ключем, рівним `environment` та значенням
  рівним `production` або `qa`.
* Другий приклад вибирає всі ресурси з ключем, рівним `tier` та значеннями іншими
  ніж `frontend` та `backend`, та всі ресурси без міток з ключем `tier`.
* Третій приклад вибирає всі ресурси, включаючи мітку з ключем `partition`;
  значення не перевіряються.
* Четвертий приклад вибирає всі ресурси без мітки з ключем `partition`;
  значення не перевіряються.

Так само розділювач коми діє як _AND_ оператор. Таким чином, фільтрування ресурсів з ключем `partition` (без значення) та з `environment` відмінним від `qa` може бути досягнуто за допомогою `partition,environment notin (qa)`. Вимоги на основі множини є загальною формою вимог на основі рівності, оскільки `environment=production` еквівалентно `environment in (production)`; так само для `!=` та `notin`.

Вимоги на основі множини можна комбінувати з вимогами на основі рівності. Наприклад: `partition in (customerA, customerB),environment!=qa`.

## API

### Фільтрація LIST та WATCH {#list-and-watch-filtering}

Для операцій **list** і **watch** ви можете вказати селектори міток для фільтрації наборів обʼєктів що повертаються; фільтр задається за допомогою параметра запиту. (Щоб дізнатися докладніше про watch у Kubernetes, прочитайте [ефективне виявлення змін](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)).
Обидві вимоги дозволені (тут подано так, як вони з'являться у рядку URL-запиту):

* вимоги на основі рівності: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* вимоги на основі множини: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Обидва стилі селекторів міток можуть бути використані для переліку чи перегляду ресурсів через клієнта REST. Наприклад, спрямовуючись до `apiserver` за допомогою `kubectl` та використовуючи вимогу на основі рівності, можна написати:

```shell
kubectl get pods -l environment=production,tier=frontend
```

чи використовуючи вимогу на основі множини:

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

Як вже зазначалося, вимоги на основі множини є більш виразними. Наприклад, вони можуть реалізувати оператор _OR_ в значеннях:

```shell
kubectl get pods -l 'environment in (production, qa)'
```

чи обмежувати відʼємний збіг за допомогою оператора _notin_:

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### Посилання в API-обʼєктах {#set-reference-in-api-objects}

Деякі обʼєкти Kubernetes, такі як [`services`](/docs/concepts/services-networking/service/) та [`replicationcontrollers`](/docs/concepts/workloads/controllers/replicationcontroller/), також використовують селектори міток для вказівки наборів інших ресурсів, таких як [Podʼи](/docs/concepts/workloads/pods/).

#### Service та ReplicationController {#service-and-replicationcontroller}

Множина Podʼів, яку `service` вибирає, визначається селектором міток. Так само, популяція Podʼів, якою `replicationcontroller` повинен керувати,
також визначається селектором міток.

Селектори міток для обох обʼєктів визначаються в файлах `json` або `yaml` за допомогою звʼязування та підтримуються лише _equality-based_ селектори:

```json
"selector": {
    "component" : "redis",
}
```

або

```yaml
selector:
  component: redis
```

Цей селектор (відповідно у форматі `json` або `yaml`) еквівалентний `component=redis` або `component in (redis)`.

#### Ресурси, які підтримують вимоги на основі множин {#resources-that-support-set-based-requirements}

Нові ресурси, такі як [`Job`](/docs/concepts/workloads/controllers/job/), [`Deployment`](/docs/concepts/workloads/controllers/deployment/), [`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/), та [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/), також підтримують вимоги на основі множин.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - { key: tier, operator: In, values: [cache] }
    - { key: environment, operator: NotIn, values: [dev] }
```

`matchLabels` — це звʼязування з парами `{key,value}`. Одна пара `{key,value}` у
звʼязці `matchLabels` еквівалентна елементу `matchExpressions`, де поле `key` — це "key", оператор — "In", а масив `values` містить лише "value". `matchExpressions` - це список вимог селектора для вибору Podʼів. Допустимі оператори включають In, NotIn, Exists, та DoesNotExist. Масив values повинен бути непорожнім у випадку In та NotIn. Всі вимоги, як з `matchLabels`, так і з `matchExpressions`, йдуть разом
з логічною операцією AND — всі вони повинні бути задоволені для збігу.

#### Вибір множини вузлів {#selecting-sets-of-nodes}

Одним з варіантів використання селекторів на мітках є обмеження множини вузлів, на які може бути заплановано Pod. Дивіться документацію щодо [вибору вузла](/docs/concepts/scheduling-eviction/assign-pod-node/) для отримання докладнішої інформації.

## Ефективне використання міток {#using-labels-effectively}

Ви можете застосовувати одну мітку до будь-яких ресурсів, але це не завжди є найкращою практикою. Є багато сценаріїв, де слід використовувати кілька міток для розрізнення наборів ресурсів один від одного.

Наприклад, різні застосунки можуть використовувати різні значення для мітки `app`, але багаторівневий застосунок, такий як [приклад гостьової книги](https://github.com/kubernetes/examples/tree/master/web/guestbook/), додатково повинен відрізняти кожний рівень. Фронтенд може мати наступні мітки:

```yaml
labels:
  app: guestbook
  tier: frontend
```

тоді як Redis master та replica можуть мати різні мітки `tier`, і, можливо, навіть
додаткову мітку `role`:

```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```

та

```yaml
labels:
  app: guestbook
  tier: backend
  role: replica
```

Мітки дозволяють розрізняти ресурси по будь-якому виміру, зазначеному міткою:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```none
NAME                           READY  STATUS    RESTARTS   AGE   APP         TIER       ROLE
guestbook-fe-4nlpb             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-ght6d             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-jpy62             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1    Running   0          1m    guestbook   backend    master
guestbook-redis-replica-2q2yf  1/1    Running   0          1m    guestbook   backend    replica
guestbook-redis-replica-qgazl  1/1    Running   0          1m    guestbook   backend    replica
my-nginx-divi2                 1/1    Running   0          29m   nginx       <none>     <none>
my-nginx-o0ef1                 1/1    Running   0          29m   nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=replica
```

```none
NAME                           READY  STATUS   RESTARTS  AGE
guestbook-redis-replica-2q2yf  1/1    Running  0         3m
guestbook-redis-replica-qgazl  1/1    Running  0         3m
```

## Оновлення міток {#updating-labels}

Іноді вам може знадобитися переозначити наявні Podʼи та інші ресурси перед створенням нових ресурсів. Це можна зробити за допомогою `kubectl label`. Наприклад, якщо ви хочете позначити всі свої NGINX Podʼи як рівень фронтенду, виконайте:

```shell
kubectl label pods -l app=nginx tier=fe
```

```none
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Спочатку фільтруються всі Podʼи з міткою "app=nginx", а потім вони позначаються як "tier=fe". Щоб переглянути Podʼи, які ви позначили, виконайте:

```shell
kubectl get pods -l app=nginx -L tier
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

Це виводить всі Podʼи "app=nginx", з додатковим стовпчиком міток рівня Podʼів (вказаним за допомогою `-L` або `--label-columns`).

Для отримання додаткової інформації, будь ласка, див. [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## {{% heading "whatsnext" %}}

* Дізнайтеся, як [додати мітку до вузла](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
* Знайдіть [Відомі мітки, Анотації та Ознаки](/docs/reference/labels-annotations-taints/)
* Перегляньте [Рекомендовані мітки](/docs/concepts/overview/working-with-objects/common-labels/)
* [Застосовуйте стандарти безпеки для Podʼів з мітками простору імен](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
* Прочитайте блог про [Написання контролера для міток Podʼа](/blog/2021/06/21/writing-a-controller-for-pod-labels/)
