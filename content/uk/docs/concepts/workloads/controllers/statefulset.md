---
title: StatefulSets
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
content_type: concept
description: >-
  StatefulSet — це обʼєкт робочого навантаження API, який використовується для управління застосунками зі збереженням стану. Він запускає групу Podʼів і зберігає стійку ідентичність для кожного з цих Podʼів. Це корисно для керування
  застосунками, які потребують постійного сховища або стабільної, унікальної мережевої ідентичності.
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

StatefulSet — це обʼєкт робочого навантаження API, який використовується для управління застосунками зі збереженням стану.

{{< glossary_definition term_id="statefulset" length="all" >}}

<!-- body -->

## Використання StatefulSets {#using-statefulsets}

StatefulSets є цінним інструментом для застосунків, які потребують однієї або декількох речей з наступного:

* Стабільних, унікальних мережевих ідентифікаторів.
* Стабільного, постійного сховища.
* Упорядкованого, відповідного розгортання та масштабування.
* Упорядкованих, автоматизованих поступових (rolling) оновлень.

У випадку відсутності потреби в стабільних ідентифікаторах або упорядкованому розгортанні, видаленні чи масштабуванні, вам слід розгортати свою програму за допомогою робочого обʼєкта, який забезпечує набір реплік без збереження стану (stateless). [Deployment](/docs/concepts/workloads/controllers/deployment/) або [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) можуть бути більш придатними для ваших потреб.

## Обмеження {#limitations}

* Місце для зберігання для певного Podʼа повинно буде виділене чи вже виділено  [PersistentVolume Provisioner](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/README.md) на основі запиту _storage class_, або виділено адміністратором наперед.
* Видалення та/або масштабування StatefulSet вниз _не_ призведе до видалення томів, повʼязаних з StatefulSet. Це зроблено для забезпечення безпеки даних, яка загалом є важливішою, ніж автоматичне очищення всіх повʼязаних ресурсів StatefulSet.
* Наразі для StatefulSets обовʼязково потрібний [Headless Service](/docs/concepts/services-networking/service/#headless-services) щоб відповідати за мережевий ідентифікатор Podʼів. Вам слід створити цей Сервіс самостійно.
* StatefulSets не надають жодних гарантій щодо припинення роботи Podʼів при видаленні StatefulSet. Для досягнення упорядкованого та відповідного завершення роботи Podʼів у StatefulSet  можливо зменшити масштаб StatefulSet до 0 перед видаленням.
* При використанні [Поступових Оновлень](#rolling-updates) використовуючи стандартну [Політику Керування Podʼів](#pod-management-policies) (`OrderedReady`), можливе потрапляння в стан, що вимагає [ручного втручання для виправлення](#forced-rollback).

## Компоненти {#components}

Наведений нижче приклад демонструє компоненти StatefulSet.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # повинно відповідати .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # типово 1
  minReadySeconds: 10 # типово 0
  template:
    metadata:
      labels:
        app: nginx # повинно відповідати .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.24
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

{{< note >}}
Цей приклад використовує режим доступу `ReadWriteOnce`, для спрощення. Для
промислового використання проєкт Kubernetes рекомендує використовувати режим доступу
`ReadWriteOncePod`.
{{< /note >}}

У вищенаведеному прикладі:

* Використовується Headless Service, з назвою `nginx`, для управління мережевим доменом.
* StatefulSet, названий `web`, має Spec, який вказує на те, що буде запущено 3 репліки контейнера nginx в унікальних Podʼах.
* `volumeClaimTemplates` буде забезпечувати стійке зберігання за допомогою [PersistentVolumes](/docs/concepts/storage/persistent-volumes/), виділених PersistentVolume Provisioner.

Назва обʼєкта StatefulSet повинна бути дійсною [DNS міткою](/docs/concepts/overview/working-with-objects/names#dns-label-names).

### Селектор Podʼів {#pod-selector}

Вам слід встановити поле `.spec.selector` StatefulSet, яке збігається з міткам його
`.spec.template.metadata.labels`. Нездатність вказати відповідний селектор Pod призведе до помилки перевірки під час створення StatefulSet.

### Шаблони заявок на місце для зберігання {#volume-claim-templates}

Ви можете встановити поле `.spec.volumeClaimTemplates`, щоб створити [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims). Це забезпечить стійке зберігання для StatefulSet, якщо:

* Для заявки на том встановлено StorageClass, який налаштований на використання [динамічного виділення](/docs/concepts/storage/dynamic-provisioning/).
* Кластер вже містить PersistentVolume з правильним StorageClass та достатньою кількістю доступного місця для зберігання.

### Мінімальний час готовності {#minimum-ready-seconds}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

`.spec.minReadySeconds` є необовʼязковим полем, яке вказує мінімальну кількість секунд, протягом яких новий створений Pod повинен працювати та бути готовим, без виходу будь-яких його контейнерів з ладу, щоб вважатися доступним. Це використовується для перевірки прогресу розгортання при використанні стратегії [Поступового Оновлення](#rolling-updates). Це поле станлартно дорівнює 0 (Pod вважатиметься доступним одразу після готовності). Дізнайтеся більше про те, коли
Pod вважається готовим, див. [Проби Контейнера](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

## Ідентичність Podʼа {#pod-identity}

Podʼи StatefulSet мають унікальну ідентичність, яка складається з порядкового номера, стабільного мережевого ідентифікатора та стійкого сховища. Ця ідентичність залишається прикріпленою до Podʼа, незалежно від того, на якому вузлі він перепланований чи знову запланований.

### Порядковий індекс {#ordinal-index}

Для StatefulSet з N [реплік](#replicas) кожному Podʼу в StatefulSet буде призначено ціле число, яке є унікальним у наборі. Стандартно Podʼам буде призначено порядкові номери від 0 до N-1. Контролер StatefulSet також додасть мітку Podʼа з цим індексом: `apps.kubernetes.io/pod-index`.

### Початковий порядковий номер {#start-ordinal}

{{< feature-state feature_gate_name="StatefulSetStartOrdinal" >}}

`.spec.ordinals` — це необовʼязкове поле, яке дозволяє налаштувати цілочисельні порядкові номери, призначені кожному Pod. Стандартно воно встановлено в `nil`. В межах цього поля ви можете налаштувати наступні параметри:

* `.spec.ordinals.start`: Якщо встановлено поле `.spec.ordinals.start`, Podʼам будуть призначені порядкові номери від `.spec.ordinals.start` до
  `.spec.ordinals.start + .spec.replicas - 1`.

### Стабільний мережевий ідентифікатор {#stable-network-id}

Кожен Pod в StatefulSet виводить назву свого хосту з імені StatefulSet та порядкового номера Podʼа. Шаблон для створеного імені хосту має вигляд `$(імʼя statefulset)-$(порядковий номер)`. У вищезазначеному прикладі буде створено три Podʼа з іменами `web-0,web-1,web-2`. StatefulSet може використовувати [Headless Service](/docs/concepts/services-networking/service/#headless-services)  для управління доменом своїх Podʼів. Домен, яким управляє цей сервіс, має вигляд: `$(імʼя сервісу).$(простір імен).svc.cluster.local`, де "cluster.local" — це кластерний домен. При створенні кожного Podʼа він отримує відповідний DNS-піддомен, який має вигляд: `$(імʼя Podʼа).$(головний домен сервісу)`, де головний сервіс визначається полем `serviceName` в StatefulSet.

Залежно від того, як налаштований DNS у вашому кластері, ви можливо не зможете одразу знаходити DNS-імʼя для нового Podʼа. Це можливо, коли інші клієнти в кластері вже відправили запити на імʼя хосту Podʼа до його створення. Негативне кешування (зазвичай для DNS) означає, що результати попередніх невдалих пошуків запамʼятовуються та використовуються, навіть після того, як Pod вже працює, принаймні кілька секунд.

Якщо вам потрібно виявити Podʼи негайно після їх створення, у вас є кілька варіантів:

* Запитуйте API Kubernetes безпосередньо (наприклад, використовуючи режим спостереження), а не покладаючись на DNS-запити.
* Зменште час кешування в вашому постачальнику DNS Kubernetes (зазвичай це означає редагування ConfigMap для CoreDNS, який зараз кешує протягом 30 секунд).

Як зазначено в розділі [Обмеження](#limitations), ви відповідаєте за створення
[Headless Service](/docs/concepts/services-networking/service/#headless-services), відповідального за мережевий ідентифікатор Podʼів.

Ось деякі приклади варіантів вибору кластерного домену, імені сервісу,
імені StatefulSet та того, як це впливає на DNS-імена Podʼів StatefulSet.

| Домен кластера | Сервіс (ns/імʼя)  | StatefulSet (ns/імʼя)  | Домен StatefulSet               | DNS Podʼа                                    | Імʼя хоста Podʼа |
| -------------- | ----------------- | ---------------------- | ------------------------------- | -------------------------------------------- | ---------------- |
| cluster.local  | default/nginx     | default/web            | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1}     |
| cluster.local  | foo/nginx         | foo/web                | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1}     |
| kube.local     | foo/nginx         | foo/web                | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1}     |

{{< note >}}
Кластерний домен буде встановлено як `cluster.local`, якщо не буде
[інших налаштувань](/docs/concepts/services-networking/dns-pod-service/).
{{< /note >}}

### Стійке сховище {#stable-storage}

Для кожного вхідного запису `volumeClaimTemplates`, визначеного в StatefulSet, кожен Pod отримує один PersistentVolumeClaim. У прикладі з nginx кожен Pod отримує один PersistentVolume з StorageClass `my-storage-class` та 1 ГБ зарезервованого сховища. Якщо не вказано StorageClass, то використовуватиметься стандартний розмір сховища. Коли Pod переплановується на вузлі, його `volumeMounts` монтує PersistentVolumes, повʼязані із його PersistentVolume Claims. Зазначте, що PersistentVolumes, повʼязані із PersistentVolume Claims Podʼів, не видаляються при видаленні Podʼів чи StatefulSet. Це слід робити вручну.

### Мітка імені Podʼа {#pod-name-label}

Коли StatefulSet {{<glossary_tooltip text="контролер" term_id="controller">}} створює Pod, він додає мітку `statefulset.kubernetes.io/pod-name`, яка дорівнює назві Podʼа. Ця мітка дозволяє прикріплювати Service до конкретного Podʼа в StatefulSet.

### Мітка індексу Podʼа {#pod-index-label}

{{< feature-state feature_gate_name="PodIndexLabel" >}}

Коли StatefulSet {{<glossary_tooltip text="контролер" term_id="controller">}} створює Pod, новий Pod має мітку `apps.kubernetes.io/pod-index`. Значення цієї мітки — це порядковий індекс Podʼа. Ця мітка дозволяє спрямовувати трафік до певного індексу під, фільтрувати логи/метрику за допомогою мітки індексу podʼа тощо. Зауважте, що стандартно функціональна можливість `PodIndexLabel` увімкнена і заблокована для цієї функції, для того, щоб вимкнути її, користувачам доведеться використовувати емуляцію сервера версії v1.31.

## Гарантії розгортання та масштабування {#deployment-and-scaling-guarantees}

* Для StatefulSet із N реплік, при розгортанні Podʼи створюються послідовно, у порядку від {0..N-1}.
* При видаленні Podʼів вони закінчуються у зворотньому порядку, від {N-1..0}.
* Перед тим як застосувати масштабування до Podʼа, всі його попередники повинні бути запущені та готові. Якщо встановлено [`.spec.minReadySeconds`](#minimum-ready-seconds), попередники повинні бути доступними (готовими принаймні протягом `minReadySeconds`).
* Перед тим як Pod буде припинено, всі його наступники повинні бути повністю зупинені.

StatefulSet не повинен вказувати `pod.Spec.TerminationGracePeriodSeconds` рівним 0. Це практика небезпечна і настійно не рекомендується. Для отримання додаткової інформації, зверніться до [примусового видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

Коли створюється приклад nginx вище, три Podʼа будуть розгорнуті в порядку web-0, web-1, web-2. web-1 не буде розгорнуто, поки web-0 не буде [запущений і готовий](/docs/concepts/workloads/pods/pod-lifecycle/), і web-2 не буде розгорнуто, поки
web-1 не буде запущений і готовий. Якщо web-0 виявиться несправним, після того, як web-1 стане запущеним і готовим, але до запуску web-2, web-2 не буде запущено, поки web-0 успішно перезапуститься і стане запущеним і готовим.

Якщо користувач масштабує розгорнутий приклад, застосовуючи патчи до StatefulSet так, так щоб `replicas=1`, спочатку буде припинено web-2. web-1 не буде припинено, поки web-2 повністю не завершить свою роботу та буде видалено. Якщо web-0 виявиться невдалим після того, як web-2 вже був припинений і повністю завершено, але перед видаленням web-1, web-1 не буде припинено, поки web-0 не стане запущеним і готовим.

### Політики управління Podʼами {#pod-management-policies}

StatefulSet дозволяє зменшити його гарантії послідовності, зберігаючи при цьому його гарантії унікальності та ідентичності за допомогою поля `.spec.podManagementPolicy`.

#### Політика управління Podʼами "OrderedReady"  {#orderedready-pod-management}

`OrderedReady` є типовим значенням політики управління Podʼами для StatefulSet. Вона реалізує поведінку, описану в розділі [Гарантії розгортання та масштабування](#deployment-and-scaling-guarantees).

#### Політика управління Podʼами "Parallel" {#parallel-pod-management}

`Parallel` вказує контролеру StatefulSet запускати або припиняти всі Podʼи паралельно, і не чекати, поки Podʼи стануть запущеними та готовими або повністю припиняться перед запуском або видаленням іншого Podʼа.

Для операцій масштабування це означає, що всі Podʼи створюються або припиняються одночасно.

Для послідовних оновлень, коли [`.spec.updateStrategy.rollingUpdate.maxUnavailable`](#maximum-unavailable-pods) більше 1, контролер StatefulSet припиняє роботу і створює до `maxUnavailable` Pods одночасно (також відоме як «bursting»). Це може прискорити оновлення, але може призвести до того, що Podʼи стануть готовими в неправильному порядку, що може бути неприйнятним для застосунків, які вимагають суворого порядку.

## Стратегії оновлення {#update-strategies}

Поле `.spec.updateStrategy` обʼєкта StatefulSet дозволяє налаштовувати
та вимикати автоматизовані поетапні оновлення для контейнерів, міток, ресурсів (запити/обмеження) та анотацій для Podʼів у StatefulSet. Є два можливих значення:

`OnDelete`
: Коли поле `.spec.updateStrategy.type` StatefulSet встановлено в `OnDelete`,   контролер StatefulSet не буде автоматично оновлювати Podʼи в StatefulSet. Користувачам необхідно вручну видаляти Podʼи, щоб спричинити створення контролером нових Podʼів, які відображають зміни, внесені в `.spec.template` StatefulSet.

`RollingUpdate`
: Стратегія оновлення `RollingUpdate` реалізує автоматизовані, поточні оновлення для Podʼів у StatefulSet. Це значення є стандартною стратегією оновлення.

## Поточні оновлення {#rolling-updates}

Коли поле `.spec.updateStrategy.type` StatefulSet встановлено на `RollingUpdate`,
контролер StatefulSet буде видаляти та знову створювати кожен Pod у StatefulSet. Він буде продовжувати в тому ж порядку, як Podʼи завершують роботу (від найбільшого індексу до найменшого), оновлюючи кожен Pod по одному.

Панель управління Kubernetes чекає, доки оновлений Pod буде переведений в стан Running та Ready, перш ніж оновити його попередника. Якщо ви встановили `.spec.minReadySeconds` (див. [Мінімальна кількість секунд готовності](#minimum-ready-seconds)), панель управління також чекає вказану кількість секунд після того, як Pod стане готовим, перш ніж перейти далі.

### Поточні оновлення частинами {#partitions}

Стратегію оновлення `RollingUpdate` можна поділити на розділи, вказавши `.spec.updateStrategy.rollingUpdate.partition`. Якщо вказано розділ, всі Podʼи з індексом, який більший або рівний розділу, будуть оновлені при оновленні `.spec.template` StatefulSet. Усі Podʼи з індексом, який менший за розділ, не будуть оновлені та, навіть якщо вони будуть видалені, вони будуть відновлені на попередню версію. Якщо `.spec.updateStrategy.rollingUpdate.partition` StatefulSet більше, ніж `.spec.replicas`, оновлення `.spec.template` не буде розповсюджуватися на його Podʼи. У більшості випадків вам не знадобиться використовувати розподіл, але вони корисні, якщо ви хочете розгортати оновлення, робити канаркові оновлення або виконати поетапне оновлення.

### Максимальна кількість недоступних Podʼів {#maximal-unavailable-pods}

{{< feature-state for_k8s_version="v1.35" state="beta" >}}

Ви можете контролювати максимальну кількість Podʼів, які можуть бути недоступні під час оновлення, вказавши поле `.spec.updateStrategy.rollingUpdate.maxUnavailable`. Значення може бути абсолютним числом (наприклад, `5`) або відсотком від бажаних Podʼів (наприклад, `10%`). Абсолютне число обчислюється з відсоткового значення заокругленням вгору. Це поле не може бути 0. Стандартне значення — 1.

Це поле застосовується до всіх Podʼів у діапазоні від `0` до `replicas - 1`. Якщо є будь-який недоступний Pod у діапазоні від `0` до `replicas - 1`, він буде враховуватися в `maxUnavailable`.

{{< note >}}
Поле `maxUnavailable` знаходиться на етапі бета-тестування і є стандартно увімкненим.
{{< /note >}}

### Примусовий відкат {#forced-rollback}

При використанні [поступових оновлень](#rolling-updates) зі стандартною [політикою управління Podʼами](#pod-management-policies) (`OrderedReady`), існує можливість потрапити в становище, яке вимагає ручного втручання для виправлення.

Якщо ви оновлюєте шаблон Podʼа до конфігурації, яка ніколи не стає в стан Running and Ready (наприклад, через поганий бінарний файл або помилку конфігурації на рівні застосунку), StatefulSet припинить розгортання і залишиться у стані очікування.

У цьому стані недостатньо повернути шаблон Podʼа до справної конфігурації. Через [відомий дефект](https://github.com/kubernetes/kubernetes/issues/67250), StatefulSet продовжуватиме очікувати, доки неробочий Pod стане готовим (що ніколи не відбувається), перед тим як спробувати повернути його до робочої конфігурації.

Після повернення до шаблону вам також слід видалити будь-які Podʼи, які StatefulSet вже намагався запустити з поганою конфігурацією. Після цього StatefulSet почне перестворювати Podʼи, використовуючи відновлений шаблон.

## Історія змін {#revision-history}

ControllerRevision — це ресурс API Kubernetes, який використовується контролерами, такими як контролер StatefulSet, для відстеження історичних змін конфігурації.

StatefulSets використовують ControllerRevisions для ведення історії змін, що дозволяє здійснювати відкат і відстежувати версії.

### Як StatefulSets відстежують зміни за допомогою ControllerRevisions {#how-statefulsets-track-changes-using-controllerrevisions}

Коли ви оновлюєте шаблон Pod StatefulSet (`spec.template`), контролер StatefulSet:

1. Готує новий обʼєкт ControllerRevision
2. Зберігає знімок шаблону Pod і метаданих
3. Присвоює інкрементний номер ревізії

#### Ключові властивості {#key-properties}

Дивіться [ControllerRevision](/docs/reference/kubernetes-api/workload-resources/controller-revision-v1/), щоб дізнатися більше про ключові властивості та інші деталі.

---

### Управління історією змін {#managing-revision-history}

Керуйте збереженими змінами за допомогою `.spec.revisionHistoryLimit`:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: webapp
spec:
  revisionHistoryLimit: 5  # Зберігати останні 5 версій
  # ... інші поля spec ...
```

* **Default**: 10 версій зберігаються, якщо не вказано інше
* **Cleanup**: Найстаріші версії видаляються, коли перевищують обмеження

#### Виконання відкату {#performing-rollbacks}

Ви можете повернутися до попередньої конфігурації за допомогою:

```bash
# Переглянути історію змін
kubectl rollout history statefulset/webapp

# Повернення до певної версії
kubectl rollout undo statefulset/webapp --to-revision=3
```

Це дозволить:

* Застосувати шаблон Pod з ревізії 3
* Створити нову ревізію контролера з оновленим номером ревізії

#### Перевірка ControllerRevisions {#inspecting-ControllerRevisions}

Щоб переглянути повʼязані ControllerRevisions:

```bash
# Перелічити всі зміни для StatefulSet
kubectl get controllerrevisions -l app.kubernetes.io/name=webapp

# Переглянути детальну конфігурацію конкретної версії
kubectl get controllerrevision/webapp-3 -o yaml
```

#### Поради {#best-practices}

##### Політика зберігання {#retention-policy}

* Встановіть `revisionHistoryLimit` в діапазоні **5–10** для більшості робочих навантажень.
* Збільшуйте значення тільки в разі потреби в **глибокій історії відкату**.

##### Моніторинг {#monitoring}

* Регулярно перевіряйте зміни за допомогою:

  ```bash
  kubectl get controllerrevisions
  ```

* Повідомляйте про **швидке зростання кількості ревізій**.

##### Уникайте {#avoid}

* Ручного редагування обʼєктів ControllerRevision.
* Використання ревізій як механізму резервного копіювання (використовуйте спеціальні інструменти для резервного копіювання).
* Встановлення `revisionHistoryLimit: 0` (відключає можливість відкату).

## Збереження PersistentVolumeClaim {#persistentvolumeclaim-retention}

{{< feature-state feature_gate_name="StatefulSetAutoDeletePVC" >}}

Необовʼязкове поле `.spec.persistentVolumeClaimRetentionPolicy` контролює, чи і як видаляються PVC під час життєвого циклу StatefulSet. Вам потрібно увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `StatefulSetAutoDeletePVC` на сервері API та менеджері контролера, щоб використовувати це поле. Після активації ви можете налаштувати дві політики для кожного StatefulSet:

`whenDeleted`
: Налаштовує поведінку зберігання тому, яке застосовується при видаленні StatefulSet

`whenScaled`
: Налаштовує поведінку зберігання тому, яке застосовується при зменшенні кількості реплік у StatefulSet, наприклад, при масштабуванні вниз.

Для кожної політики, яку ви можете налаштувати, ви можете встановити значення `Delete` або `Retain`.

`Delete`
: PVC, створені за допомогою `volumeClaimTemplate` StatefulSet, видаляються для кожного Podʼа, який впливає на політику. З політикою `whenDeleted` всі PVC від `volumeClaimTemplate` видаляються після того, як їх Podʼи були видалені. З політикоюю `whenScaled`, лише PVC, що відповідають реплікам Podʼа, які зменшуються видаляються після того, як їх Podʼи були видалені.

`Retain` (стандартно)
: PVC від `volumeClaimTemplate` не змінюються, коли їх Pod видаляється. Це поведінка до цієї нової функції.

Звертайте увагу, що ці політики **застосовуються лише** при вилученні Podʼів через видалення або масштабування StatefulSet. Наприклад, якщо Pod, повʼязаний із StatefulSet, зазнає відмови через відмову вузла, і панель управління створює замінний Pod, StatefulSet зберігає поточний PVC. Поточний том не піддається впливу, і кластер прикріплює його до вузла, де має запуститися новий Pod.

Станадртно для політик встановлено `Retain`, відповідно до поведінки StatefulSet до цієї нової функції.

Ось приклад політики:

```yaml
apiVersion: apps/v1
kind: StatefulSet
...
spec:
  persistentVolumeClaimRetentionPolicy:
    whenDeleted: Retain
    whenScaled: Delete
...
```

Контролер StatefulSet додає [посилання на власника](/docs/concepts/overview/working-with-objects/owners-dependents/#owner-references-in-object-specifications) до своїх PVC, які потім видаляються {{<glossary_tooltip text="збирачем сміття" term_id="garbage-collection">}} після завершення Podʼа. Це дозволяє Podʼу чисто демонтувати всі томи перед видаленням PVC (і перед видаленням PV та обсягу, залежно від політики збереження). Коли ви встановлюєте `whenDeleted` політику `Delete`, посилання власника на екземпляр StatefulSet поміщається на всі PVC, повʼязані із цим StatefulSet.

Політика `whenScaled` повинна видаляти PVC тільки при зменшенні розміру Podʼа, а не при видаленні Podʼа з іншої причини. Під час узгодження контролер StatefulSet порівнює очікувану кількість реплік із фактичними Podʼами, що присутні на кластері. Будь-який Pod StatefulSet, ідентифікатор якого більший за кількість реплік, засуджується та позначається для видалення. Якщо політика `whenScaled` є `Delete`, засуджені Podʼи спочатку встановлюються власниками для відповідних PVC зразків StatefulSet, перед видаленням Podʼа. Це призводить до того, що PVC видаляються збирачем сміття тільки після видалення таких Podʼів.

Це означає, що якщо контролер виходить з ладу і перезапускається, жоден Pod не буде видалено до того моменту, поки його посилання на власника не буде відповідно оновлено згідно з політикою. Якщо засуджений Pod видаляється примусово, коли контролер вимкнено, посилання на власника може бути або встановлене, або ні, залежно від того, коли відбулася аварія контролера. Для оновлення посилань на власника може знадобитися кілька циклів врегулювання, тому деякі засуджені Podʼи можуть мати встановлені посилання на власника, а інші — ні. З цієї причини ми рекомендуємо зачекати, поки контролер знову запуститься, що перевірить посилання на власника перед завершенням роботи Podʼів. Якщо це неможливо, оператор повинен перевірити посилання на власника на PVC, щоб забезпечити видалення очікуваних обʼєктів при примусовому видаленні Podʼів.

### Репліки {#replicas}

`.spec.replicas` — це необовʼязкове поле, яке вказує кількість бажаних Podʼів. Стандартно воно дорівнює 1.

Якщо ви масштабуєте StatefulSet, наприклад, через `kubectl scale statefulset statefulset --replicas=X`, а потім оновлюєте цей StatefulSet на основі маніфесту (наприклад, за допомогою `kubectl apply -f statefulset.yaml`), то застосування цього маніфесту перезапише попереднє ручне масштабування.

Якщо [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (або будь-який подібний API для горизонтального масштабування) керує масштабуванням StatefulSet, не встановлюйте `.spec.replicas`. Замість цього дозвольте {{<glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes автоматично керувати полем `.spec.replicas`.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [Podʼи](/docs/concepts/workloads/pods).
* Дізнайтеся, як використовувати StatefulSets
  * Спробуйте приклад [розгортання stateful застосунків](/docs/tutorials/stateful-application/basic-stateful-set/).
  * Спробуйте приклад [розгортання Cassandra з Stateful Sets](/docs/tutorials/stateful-application/cassandra/).
  * Спробуйте приклад [запуску реплікованого stateful застосунку](/docs/tasks/run-application/run-replicated-stateful-application/).
  * Дізнайтеся, як [масштабувати StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
  * Дізнайтеся, що включає в себе [видалення StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
  * Дізнайтеся, як [налаштувати Pod для використання тома для зберігання](/docs/tasks/configure-pod-container/configure-volume-storage/).
  * Дізнайтеся, як [налаштувати Pod для використання PersistentVolume для зберігання](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).
* `StatefulSet` є ресурсом верхнього рівня в API REST Kubernetes. Ознайомтесь з визначеням обʼєкта {{< api-reference page="workload-resources/stateful-set-v1" >}} для розуміння API.
* Дізнайтеся про [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) та як його можна використовувати для управління доступністю застосунків під час відключень.
