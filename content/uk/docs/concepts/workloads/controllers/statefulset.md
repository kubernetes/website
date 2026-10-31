---
title: StatefulSets
api_metadata:
- apiVersion: "apps/v1"
  kind: "StatefulSet"
content_type: concept
description: >-
  StatefulSet запускає групу Podʼів і зберігає стійку ідентичність для кожного з цих Podʼів. Це корисно для керування застосунками, які потребують постійного сховища або стабільної, унікальної мережевої ідентичності.
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

StatefulSet — це обʼєкт API робочого навантаження, який використовується для керування застосунками зі збереженням стану.

{{< glossary_definition term_id="statefulset" length="all" >}}

<!-- body -->

## Використання StatefulSets {#using-statefulsets}

StatefulSets є цінним інструментом для застосунків, які потребують одного або кількох із таких елементів:

* Стабільних, унікальних мережевих ідентифікаторів.
* Стабільного, постійного сховища.
* Упорядкованого, плавного розгортання та масштабування.
* Упорядкованих, автоматизованих поетапних оновлень.

Тут «стабільний» означає збереження під час (пере)планування Podʼів. Якщо застосунок не потребує стабільних ідентифікаторів або упорядкованого розгортання, видалення чи масштабування, вам слід розгортати його за допомогою обʼєкта робочого навантаження, який забезпечує набір реплік без збереження стану (stateless). [Deployment](/docs/concepts/workloads/controllers/deployment/) або [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) можуть краще підійти для ваших stateless-потреб.

## Обмеження {#limitations}

* Сховище для певного Podʼа має бути виділене [PersistentVolume Provisioner](/docs/concepts/storage/dynamic-provisioning/) на основі запитаного _storage class_ або попередньо виділене адміністратором.
* Видалення та/або масштабування StatefulSet вниз _не_ призведе до видалення томів, повʼязаних з StatefulSet. Це зроблено для забезпечення безпеки даних, яка загалом є важливішою, ніж автоматичне очищення всіх повʼязаних ресурсів StatefulSet.
* Наразі для StatefulSets обовʼязково потрібний [Headless Service](/docs/concepts/services-networking/service/#headless-services), щоб відповідати за мережеву ідентичність Podʼів. Ви відповідаєте за створення цього Service.
* StatefulSets не надають жодних гарантій щодо завершення роботи Podʼів під час видалення StatefulSet. Для досягнення упорядкованого та плавного завершення роботи Podʼів у StatefulSet можна зменшити масштаб StatefulSet до 0 перед видаленням.
* Під час використання [поетапних оновлень](#rolling-updates) зі стандартною [політикою керування Podʼами](#pod-management-policies) (`OrderedReady`) можна потрапити в несправний стан, який вимагає [ручного втручання для виправлення](#forced-rollback).

## Компоненти {#components}

Наведений нижче приклад демонструє компоненти StatefulSet.

{{% code_sample file="controllers/statefulset.yaml" %}}

{{< note >}}
Цей приклад використовує режим доступу `ReadWriteOnce` для простоти. Для промислового використання проєкт Kubernetes рекомендує натомість використовувати режим доступу `ReadWriteOncePod`.
{{< /note >}}

У вищенаведеному прикладі:

* Headless Service із назвою `nginx` використовується для керування мережевим доменом.
* StatefulSet із назвою `web` має Spec, який вказує на те, що буде запущено 3 репліки контейнера nginx в унікальних Podʼах.
* `volumeClaimTemplates` забезпечуватиме стабільне сховище за допомогою [PersistentVolumes](/docs/concepts/storage/persistent-volumes/), виділених PersistentVolume Provisioner.

Назва обʼєкта StatefulSet повинна бути дійсною [DNS-міткою](/docs/concepts/overview/working-with-objects/names#dns-label-names).

### Селектор Podʼів {#pod-selector}

Ви повинні встановити поле `.spec.selector` StatefulSet так, щоб воно збігалося з мітками його `.spec.template.metadata.labels`. Якщо не вказати відповідний селектор Podʼів, під час створення StatefulSet виникне помилка валідації.

### Шаблони заявок на томи {#volume-claim-templates}

Ви можете встановити поле `.spec.volumeClaimTemplates`, щоб створити [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims). Це забезпечить стабільне сховище для StatefulSet, якщо:

* StorageClass, вказаний для заявки на том, налаштовано на використання [динамічного виділення](/docs/concepts/storage/dynamic-provisioning/).
* Кластер вже містить PersistentVolume з правильним StorageClass та достатньою кількістю доступного місця для зберігання.

### Мінімальний час готовності {#minimum-ready-seconds}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

`.spec.minReadySeconds` є необовʼязковим полем, яке вказує мінімальну кількість секунд, протягом яких новостворений Pod повинен працювати та бути готовим без збоїв будь-якого з його контейнерів, щоб вважатися доступним. Це використовується для перевірки прогресу розгортання під час використання стратегії [поетапного оновлення](#rolling-updates). Це поле стандартно дорівнює 0 (Pod вважатиметься доступним одразу після готовності). Докладніше про те, коли Pod вважається готовим, див. [Проби контейнера](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

## Ідентичність Podʼа {#pod-identity}

Podʼи StatefulSet мають унікальну ідентичність, яка складається з порядкового номера, стабільного мережевого ідентифікатора та стабільного сховища. Ця ідентичність залишається прикріпленою до Podʼа незалежно від того, на який вузол його (пере)заплановано.

### Порядковий індекс {#ordinal-index}

Для StatefulSet з N [реплік](#replicas) кожному Podʼу в StatefulSet буде призначено цілочисельний порядковий номер, унікальний у наборі. Стандартно Podʼам буде призначено порядкові номери від 0 до N-1. Контролер StatefulSet також додасть мітку Podʼа з цим індексом: `apps.kubernetes.io/pod-index`.

### Початковий порядковий номер {#start-ordinal}

{{< feature-state feature_gate_name="StatefulSetStartOrdinal" >}}

`.spec.ordinals` — це необовʼязкове поле, яке дозволяє налаштувати цілочисельні порядкові номери, призначені кожному Podʼу. Стандартно воно встановлено в `nil`. У межах цього поля ви можете налаштувати такі параметри:

* `.spec.ordinals.start`: Якщо встановлено поле `.spec.ordinals.start`, Podʼам будуть призначені порядкові номери від `.spec.ordinals.start` до `.spec.ordinals.start + .spec.replicas - 1`.

### Стабільний мережевий ідентифікатор {#stable-network-id}

Кожен Pod у StatefulSet отримує імʼя хоста з назви StatefulSet та порядкового номера Podʼа. Шаблон для створеного імені хоста має вигляд `$(назва statefulset)-$(порядковий номер)`. У наведеному вище прикладі буде створено три Podʼи з назвами `web-0,web-1,web-2`. StatefulSet може використовувати [Headless Service](/docs/concepts/services-networking/service/#headless-services) для керування доменом своїх Podʼів. Домен, яким керує цей Service, має вигляд: `$(назва сервісу).$(простір імен).svc.cluster.local`, де "cluster.local" — це домен кластера. Під час створення кожен Pod отримує відповідний DNS-піддомен, який має вигляд: `$(назва Podʼа).$(домен керівного сервісу)`, де керівний сервіс визначається полем `serviceName` у StatefulSet.

Залежно від того, як налаштований DNS у вашому кластері, ви, можливо, не зможете одразу знайти DNS-імʼя нового Podʼа. Це можливо, коли інші клієнти в кластері вже відправили запити на імʼя хоста Podʼа до його створення. Негативне кешування (звичайне для DNS) означає, що результати попередніх невдалих пошуків запамʼятовуються та використовуються повторно навіть після того, як Pod вже працює, принаймні кілька секунд.

Якщо вам потрібно виявити Podʼи негайно після їх створення, у вас є кілька варіантів:

* Запитуйте API Kubernetes безпосередньо (наприклад, використовуючи watch), а не покладаючись на DNS-запити.
* Зменште час кешування у вашому постачальнику DNS Kubernetes (зазвичай це означає редагування ConfigMap для CoreDNS, який зараз кешує протягом 30 секунд).

Як зазначено в розділі [Обмеження](#limitations), ви відповідаєте за створення [Headless Service](/docs/concepts/services-networking/service/#headless-services), відповідального за мережеву ідентичність Podʼів.

Ось деякі приклади варіантів вибору домену кластера, назви Service, назви StatefulSet та того, як це впливає на DNS-імена Podʼів StatefulSet.

| Домен кластера | Service (ns/назва) | StatefulSet (ns/назва) | Домен StatefulSet               | DNS Podʼа                                    | Імʼя хоста Podʼа |
| -------------- | ----------------- | ---------------------- | ------------------------------- | -------------------------------------------- | ---------------- |
| cluster.local  | default/nginx     | default/web            | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1}     |
| cluster.local  | foo/nginx         | foo/web                | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1}     |
| kube.local     | foo/nginx         | foo/web                | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1}     |

{{< note >}}
Домен кластера буде встановлено як `cluster.local`, якщо не буде [інших налаштувань](/docs/concepts/services-networking/dns-pod-service/).
{{< /note >}}

### Стабільне сховище {#stable-storage}

Для кожного запису VolumeClaimTemplate, визначеного в StatefulSet, кожен Pod отримує один PersistentVolumeClaim. У прикладі з nginx кожен Pod отримує один PersistentVolume з StorageClass `my-storage-class` та 1 GiB виділеного сховища. Якщо StorageClass не вказано, використовуватиметься стандартний StorageClass. Коли Pod (пере)планується на вузол, його `volumeMounts` монтує PersistentVolumes, повʼязані із його PersistentVolume Claims. Зауважте, що PersistentVolumes, повʼязані із PersistentVolume Claims Podʼів, не видаляються під час видалення Podʼів чи StatefulSet. Це слід робити вручну.

### Мітка назви Podʼа {#pod-name-label}

Коли {{<glossary_tooltip text="контролер" term_id="controller">}} StatefulSet створює Pod, він додає мітку `statefulset.kubernetes.io/pod-name`, яка дорівнює назві Podʼа. Ця мітка дозволяє прикріплювати Service до конкретного Podʼа в StatefulSet.

### Мітка індексу Podʼа {#pod-index-label}

{{< feature-state feature_gate_name="PodIndexLabel" >}}

Коли {{<glossary_tooltip text="контролер" term_id="controller">}} StatefulSet створює Pod, новий Pod отримує мітку `apps.kubernetes.io/pod-index`. Значення цієї мітки — це порядковий індекс Podʼа. Ця мітка дозволяє спрямовувати трафік до певного індексу Podʼа, фільтрувати логи/метрики за допомогою мітки індексу Podʼа тощо. Зверніть увагу, що функціональна можливість `PodIndexLabel` для цієї функції стандартно увімкнена та заблокована; щоб вимкнути її, користувачам доведеться використовувати емуляцію сервера версії v1.31.

## Гарантії розгортання та масштабування {#deployment-and-scaling-guarantees}

* Для StatefulSet із N реплік під час розгортання Podʼи створюються послідовно, у порядку від {0..N-1}.
* Під час видалення Podʼів вони завершуються у зворотному порядку, від {N-1..0}.
* Перед тим як застосувати масштабування до Podʼа, всі його попередники повинні бути в стані Running та Ready. Якщо встановлено [`.spec.minReadySeconds`](#minimum-ready-seconds), попередники повинні бути доступними (готовими принаймні протягом `minReadySeconds`).
* Перед тим як Pod буде завершено, всі його наступники повинні бути повністю зупинені.

StatefulSet не повинен вказувати `pod.Spec.TerminationGracePeriodSeconds` рівним 0. Така практика небезпечна і настійно не рекомендується. Докладніше дивіться в розділі [примусове видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

Коли створюється наведений вище приклад nginx, три Podʼи будуть розгорнуті в порядку web-0, web-1, web-2. web-1 не буде розгорнуто, поки web-0 не буде в стані [Running та Ready](/docs/concepts/workloads/pods/pod-lifecycle/), і web-2 не буде розгорнуто, поки web-1 не буде в стані Running та Ready. Якщо web-0 зазнає збою після того, як web-1 перейде в стан Running та Ready, але до запуску web-2, web-2 не буде запущено, поки web-0 не буде успішно перезапущено і він не перейде в стан Running та Ready.

Якщо користувач масштабує розгорнутий приклад, застосовуючи патч до StatefulSet так, щоб `replicas=1`, спочатку буде завершено web-2. web-1 не буде завершено, поки web-2 повністю не зупиниться і не буде видалений. Якщо web-0 зазнає збою після того, як web-2 вже завершено і повністю зупинено, але перед завершенням web-1, web-1 не буде завершено, поки web-0 не перейде в стан Running та Ready.

### Політики керування Podʼами {#pod-management-policies}

StatefulSet дозволяє послабити його гарантії послідовності, зберігаючи при цьому його гарантії унікальності та ідентичності за допомогою поля `.spec.podManagementPolicy`.

#### Політика керування Podʼами "OrderedReady" {#orderedready-pod-management}

`OrderedReady` є типовим значенням політики керування Podʼами для StatefulSet. Вона реалізує поведінку, описану в розділі [Гарантії розгортання та масштабування](#deployment-and-scaling-guarantees).

#### Політика керування Podʼами "Parallel" {#parallel-pod-management}

`Parallel` вказує контролеру StatefulSet запускати або завершувати всі Podʼи паралельно і не чекати, поки Podʼи перейдуть у стан Running та Ready або повністю завершаться, перед запуском або завершенням іншого Podʼа.

Для операцій масштабування це означає, що всі Podʼи створюються або завершуються одночасно.

Для поетапних оновлень, коли [`.spec.updateStrategy.rollingUpdate.maxUnavailable`](#maximum-unavailable-pods) більше 1, контролер StatefulSet завершує і створює до `maxUnavailable` Podʼів одночасно (також відоме як «bursting»). Це може прискорити оновлення, але може призвести до того, що Podʼи стануть готовими в неправильному порядку, що може бути неприйнятним для застосунків, які вимагають суворого порядку.

## Стратегії оновлення {#update-strategies}

Поле `.spec.updateStrategy` обʼєкта StatefulSet дозволяє налаштовувати та вимикати автоматизовані поетапні оновлення для контейнерів, міток, ресурсів (запити/обмеження) та анотацій для Podʼів у StatefulSet. Є три можливих значення:

`OnDelete`
: Коли поле `.spec.updateStrategy.type` StatefulSet встановлено в `OnDelete`, контролер StatefulSet не буде автоматично оновлювати Podʼи в StatefulSet. Користувачам необхідно вручну видаляти Podʼи, щоб спричинити створення контролером нових Podʼів, які відображають зміни, внесені в `.spec.template` StatefulSet.

`RollingUpdate`
: Стратегія оновлення `RollingUpdate` реалізує автоматизовані поетапні оновлення для Podʼів у StatefulSet. Це значення є стандартною стратегією оновлення.

`Recreate`
: {{< feature-state feature_gate_name="StatefulSetRecreateStrategy" >}} Стратегія оновлення `Recreate` видаляє всі Podʼи StatefulSet перед створенням нових Podʼів, які відображають зміни, внесені в `.spec.template` StatefulSet. Використання цієї стратегії вимагає увімкнення функціональної можливості [`StatefulSetRecreateStrategy`](/docs/reference/command-line-tools-reference/feature-gates/#StatefulSetRecreateStrategy). Див. [Recreate](#recreate) для деталей.

## Поетапні оновлення {#rolling-updates}

Коли поле `.spec.updateStrategy.type` StatefulSet встановлено на `RollingUpdate`, контролер StatefulSet буде видаляти та знову створювати кожен Pod у StatefulSet. Він буде продовжувати в тому ж порядку, як Podʼи завершують роботу (від найбільшого індексу до найменшого), оновлюючи кожен Pod по одному.

Панель управління Kubernetes чекає, доки оновлений Pod буде переведений в стан Running та Ready, перш ніж оновити його попередника. Якщо ви встановили `.spec.minReadySeconds` (див. [Мінімальний час готовності](#minimum-ready-seconds)), панель управління також чекає вказану кількість секунд після того, як Pod стане готовим, перш ніж перейти далі.

### Поетапні оновлення частинами {#partitions}

Стратегію оновлення `RollingUpdate` можна поділити на частини, вказавши `.spec.updateStrategy.rollingUpdate.partition`. Якщо вказано розділ, всі Podʼи з індексом, який більший або рівний розділу, будуть оновлені при оновленні `.spec.template` StatefulSet. Усі Podʼи з індексом, який менший за розділ, не будуть оновлені та, навіть якщо вони будуть видалені, вони будуть створені заново з попередньою версією. Якщо `.spec.updateStrategy.rollingUpdate.partition` StatefulSet більше, ніж `.spec.replicas`, оновлення `.spec.template` не буде розповсюджуватися на його Podʼи. У більшості випадків вам не знадобиться використовувати розділ, але він корисний, якщо ви хочете підготувати оновлення, розгорнути канарку або виконати розгортання за фазами.

### Максимальна кількість недоступних Podʼів {#maximum-unavailable-pods}

{{< feature-state for_k8s_version="v1.35" state="beta" >}}

Ви можете контролювати максимальну кількість Podʼів, які можуть бути недоступні під час оновлення, вказавши поле `.spec.updateStrategy.rollingUpdate.maxUnavailable`. Значення може бути абсолютним числом (наприклад, `5`) або відсотком від бажаних Podʼів (наприклад, `10%`). Абсолютне число обчислюється з відсоткового значення заокругленням вгору. Це поле не може бути 0. Стандартне значення — 1.

Це поле застосовується до всіх Podʼів у діапазоні від `0` до `replicas - 1`. Якщо є будь-який недоступний Pod у діапазоні від `0` до `replicas - 1`, він буде враховуватися в `maxUnavailable`.

{{< note >}}
Поле `maxUnavailable` перебуває на стадії бета і є стандартно увімкненим.
{{< /note >}}

### Примусове відкочування {#forced-rollback}

Під час використання [поетапних оновлень](#rolling-updates) зі стандартною [політикою керування Podʼами](#pod-management-policies) (`OrderedReady`) можна потрапити в несправний стан, який вимагає ручного втручання для виправлення.

Якщо ви оновлюєте шаблон Podʼа до конфігурації, яка ніколи не досягає стану Running та Ready (наприклад, через поганий бінарний файл або помилку конфігурації на рівні застосунку), StatefulSet припинить розгортання і залишиться у стані очікування.

У цьому стані недостатньо повернути шаблон Podʼа до справної конфігурації. Через [відомий дефект](https://github.com/kubernetes/kubernetes/issues/67250), StatefulSet продовжуватиме очікувати, доки неробочий Pod стане готовим (що ніколи не відбувається), перед тим як спробувати повернути його до робочої конфігурації.

Після повернення до шаблону вам також слід видалити будь-які Podʼи, які StatefulSet вже намагався запустити з поганою конфігурацією. Після цього StatefulSet почне перестворювати Podʼи, використовуючи відновлений шаблон.

## Recreate

{{< feature-state feature_gate_name="StatefulSetRecreateStrategy" >}}

Коли поле `.spec.updateStrategy.type` StatefulSet встановлено на `Recreate`, контролер StatefulSet видаляє всі Podʼи StatefulSet одночасно та чекає, доки вони повністю завершать роботу, перш ніж створювати будь-які нові Podʼи з оновленого `.spec.template`. На відміну від [`RollingUpdate`](#rolling-updates), стара та нова ревізії Podʼа ніколи не працюють одночасно, тому ця стратегія призводить до простою протягом усього оновлення. Це дзеркально відображає стратегію `Recreate` для Deployment і є корисною для застосунків, які не можуть запускати дві версії одночасно, наприклад, для робочих навантажень, які потребують ексклюзивного доступу до спільного ресурсу або використовують формат на диску, несумісний між версіями.

Видалення завжди прибирає всі Podʼи разом, незалежно від [політики керування Podʼами](#pod-management-policies). Після того, як всі Podʼи завершать роботу, нові Podʼи створюються відповідно до цієї політики: з `OrderedReady` (стандартно) Podʼи перестворюються по одному, у порядку зростання індексів, чекаючи, доки кожен стане Running та Ready, перш ніж створювати наступний; з `Parallel` всі Podʼи перестворюються одночасно.

Оскільки це альфа-функція, ви повинні увімкнути функціональну можливість [`StatefulSetRecreateStrategy`](/docs/reference/command-line-tools-reference/feature-gates/#StatefulSetRecreateStrategy) на kube-controller-manager та kube-apiserver, щоб використовувати цю стратегію.

## Історія ревізій {#revision-history}

ControllerRevision — це ресурс API Kubernetes, який використовується контролерами, такими як контролер StatefulSet, для відстеження історичних змін конфігурації.

StatefulSets використовують ControllerRevisions для ведення історії ревізій, що дозволяє виконувати відкочування і відстежувати версії.

### Як StatefulSets відстежують зміни за допомогою ControllerRevisions {#how-statefulsets-track-changes-using-controllerrevisions}

Коли ви оновлюєте шаблон Podʼа StatefulSet (`spec.template`), контролер StatefulSet:

1. Готує новий обʼєкт ControllerRevision
2. Зберігає знімок шаблону Podʼа і метаданих
3. Присвоює інкрементний номер ревізії

#### Ключові властивості {#key-properties}

Дивіться [ControllerRevision](/docs/reference/kubernetes-api/workload-resources/controller-revision-v1/), щоб дізнатися більше про ключові властивості та інші деталі.

---

### Керування історією ревізій {#managing-revision-history}

Керуйте збереженими ревізіями за допомогою `.spec.revisionHistoryLimit`:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: webapp
spec:
  revisionHistoryLimit: 5  # Зберігати останні 5 ревізій
  # ... інші поля spec ...
```

* **Стандартно**: 10 ревізій зберігаються, якщо не вказано інше
* **Очищення**: найстаріші ревізії прибирає збір сміття, коли перевищено обмеження

#### Виконання відкочування {#performing-rollbacks}

Ви можете повернутися до попередньої конфігурації за допомогою:

```bash
# Переглянути історію ревізій
kubectl rollout history statefulset/webapp

# Відкотитися до певної ревізії
kubectl rollout undo statefulset/webapp --to-revision=3
```

Це:

* Застосує шаблон Podʼа з ревізії 3
* Створить новий ControllerRevision з оновленим номером ревізії

#### Перевірка ControllerRevisions {#inspecting-controllerrevisions}

Щоб переглянути повʼязані ControllerRevisions:

```bash
# Перелічити всі ревізії для StatefulSet
kubectl get controllerrevisions -l app.kubernetes.io/name=webapp

# Переглянути детальну конфігурацію конкретної ревізії
kubectl get controllerrevision/webapp-3 -o yaml
```

#### Найкращі практики {#best-practices}

##### Політика зберігання {#retention-policy}

* Встановіть `revisionHistoryLimit` в діапазоні **5–10** для більшості робочих навантажень.
* Збільшуйте значення тільки в разі потреби в **глибокій історії відкочування**.

##### Моніторинг {#monitoring}

* Регулярно перевіряйте ревізії за допомогою:

  ```bash
  kubectl get controllerrevisions
  ```

* Налаштуйте сповіщення про **швидке зростання кількості ревізій**.

##### Уникайте {#avoid}

* Ручного редагування обʼєктів ControllerRevision.
* Використання ревізій як механізму резервного копіювання (використовуйте справжні інструменти резервного копіювання).
* Встановлення `revisionHistoryLimit: 0` (вимикає можливість відкочування).

## Збереження PersistentVolumeClaim {#persistentvolumeclaim-retention}

{{< feature-state feature_gate_name="StatefulSetAutoDeletePVC" >}}

Необовʼязкове поле `.spec.persistentVolumeClaimRetentionPolicy` контролює, чи і як видаляються PVC під час життєвого циклу StatefulSet. Вам потрібно увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `StatefulSetAutoDeletePVC` на API-сервері та controller manager, щоб використовувати це поле. Після увімкнення ви можете налаштувати дві політики для кожного StatefulSet:

`whenDeleted`
: Налаштовує поведінку збереження томів, яка застосовується під час видалення StatefulSet.

`whenScaled`
: Налаштовує поведінку збереження томів, яка застосовується під час зменшення кількості реплік у StatefulSet, наприклад, під час зменшення масштабу набору.

Для кожної політики, яку ви можете налаштувати, ви можете встановити значення `Delete` або `Retain`.

`Delete`
: PVC, створені за допомогою `volumeClaimTemplate` StatefulSet, видаляються для кожного Podʼа, на який впливає політика. З політикою `whenDeleted` всі PVC від `volumeClaimTemplate` видаляються після того, як їхні Podʼи були видалені. З політикою `whenScaled` видаляються лише PVC, що відповідають реплікам Podʼа, які прибираються під час зменшення масштабу, після того, як їхні Podʼи були видалені.

`Retain` (стандартно)
: PVC від `volumeClaimTemplate` не змінюються, коли їх Pod видаляється. Це поведінка до цієї нової функції.

Майте на увазі, що ці політики застосовуються **лише** тоді, коли Podʼи прибираються через видалення StatefulSet або зменшення його масштабу. Наприклад, якщо Pod, повʼязаний із StatefulSet, зазнає збою через відмову вузла, і панель управління створює Pod-замінник, StatefulSet зберігає наявний PVC. Наявний том не зазнає впливу, і кластер приєднає його до вузла, де має запуститися новий Pod.

Стандартно для політик встановлено `Retain`, відповідно до поведінки StatefulSet до цієї нової функції.

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

{{<glossary_tooltip text="Контролер" term_id="controller">}} StatefulSet додає [посилання на власника](/docs/concepts/overview/working-with-objects/owners-dependents/#owner-references-in-object-specifications) до своїх PVC, які потім видаляються {{<glossary_tooltip text="збирачем сміття" term_id="garbage-collection">}} після завершення Podʼа. Це дозволяє Podʼу чисто демонтувати всі томи перед видаленням PVC (і перед видаленням PV і тому, що лежать в їх основі, залежно від політики збереження). Коли ви встановлюєте політику `whenDeleted` у `Delete`, посилання на власника на екземпляр StatefulSet додається до всіх PVC, повʼязані із цим StatefulSet.

Політика `whenScaled` повинна видаляти PVC тільки під час зменшення масштабу Podʼа, а не під час видалення Podʼа з іншої причини. Під час узгодження контролер StatefulSet порівнює очікувану кількість реплік із фактичними Podʼами, що присутні на кластері. Будь-який Pod StatefulSet, ідентифікатор якого більший за кількість реплік, засуджується та позначається для видалення. Якщо політика `whenScaled` є `Delete`, засуджені Podʼи спочатку встановлюються власниками відповідних PVC шаблону StatefulSet, перед видаленням Podʼа. Це призводить до того, що PVC видаляються збирачем сміття лише після завершення засуджених Podʼів.

Це означає, що якщо контролер виходить з ладу і перезапускається, жоден Pod не буде видалено до того моменту, поки його посилання на власника не буде відповідно оновлено згідно з політикою. Якщо засуджений Pod видаляється примусово, коли контролер вимкнено, посилання на власника може бути або встановлене, або ні, залежно від того, коли відбулася аварія контролера. Для оновлення посилань на власника може знадобитися кілька циклів узгодження, тому деякі засуджені Podʼи можуть мати встановлені посилання на власника, а інші — ні. З цієї причини ми рекомендуємо зачекати, поки контролер знову запуститься, що перевірить посилання на власника перед завершенням роботи Podʼів. Якщо це неможливо, оператор повинен перевірити посилання на власника на PVC, щоб забезпечити видалення очікуваних обʼєктів при примусовому видаленні Podʼів.

### Репліки {#replicas}

`.spec.replicas` — це необовʼязкове поле, яке вказує кількість бажаних Podʼів. Стандартно воно дорівнює 1.

Якщо ви вручну масштабуєте StatefulSet через `kubectl scale statefulset statefulset --replicas=X`, а потім оновлюєте цей StatefulSet на основі маніфесту (наприклад, за допомогою `kubectl apply -f statefulset.yaml`), то застосування цього маніфесту перезапише попереднє ручне масштабування.

Якщо [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (або будь-який подібний API для горизонтального масштабування) керує масштабуванням StatefulSet, не встановлюйте `.spec.replicas`. Замість цього дозвольте {{<glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes автоматично керувати полем `.spec.replicas`.

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [Podʼи](/docs/concepts/workloads/pods).
* Дізнайтеся, як використовувати StatefulSets
  * Спробуйте приклад [розгортання stateful-застосунку](/docs/tutorials/stateful-application/basic-stateful-set/).
  * Спробуйте приклад [розгортання Cassandra зі StatefulSets](/docs/tutorials/stateful-application/cassandra/).
  * Спробуйте приклад [запуску реплікованого stateful-застосунку](/docs/tasks/run-application/run-replicated-stateful-application/).
  * Дізнайтеся, як [масштабувати StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
  * Дізнайтеся, що включає в себе [видалення StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
  * Дізнайтеся, як [налаштувати Pod для використання тому для зберігання](/docs/tasks/configure-pod-container/configure-volume-storage/).
  * Дізнайтеся, як [налаштувати Pod для використання PersistentVolume для зберігання](/docs/tutorials/configuration/configure-persistent-volume-storage/).
* `StatefulSet` є ресурсом верхнього рівня в REST API Kubernetes. Ознайомтесь із визначенням обʼєкта {{< api-reference page="apps/stateful-set-v1" >}}, щоб зрозуміти API для StatefulSets.
* Дізнайтеся про [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) та як його можна використовувати для керування доступністю застосунків під час переривань роботи.
