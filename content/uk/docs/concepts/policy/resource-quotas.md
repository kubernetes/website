---
title: Квоти ресурсів
api_metadata:
- apiVersion: "v1"
  kind: "ResourceQuota"
content_type: concept
weight: 20
---

<!-- overview -->

Коли декілька користувачів або команд спільно використовують кластер з фіксованою кількістю вузлів, є можливість, що одна команда може використовувати більше, ніж свою справедливу частку ресурсів.

_Квоти ресурсів_ є інструментом для адміністраторів для розвʼязання цієї проблеми.

Квота ресурсів, визначена обʼєктом `ResourceQuota`, надає обмеження, які обмежують загальне споживання ресурсів у  {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}. ResourceQuota також може обмежувати [кількість обʼєктів, які можуть бути створені в просторі імен](#quota-on-object-count) за типом API, так само як й загальний обсяг {{< glossary_tooltip text="ресурсів інфраструктури" term_id="infrastructure-resource" >}} які можуть бути спожиті обʼєктами API у цьому просторі імен.

{{< caution >}}
Neither contention nor changes to quota will affect already created resources.
{{< /caution >}}

<!-- body -->

## Як працює ResourceQuotas в Kubernetes{#how-kubernetes-resourcequotas-work}

ResourceQuotas працюють наступним чином:

- Різні команди працюють у різних просторах імен. Це може бути забезпечено з використанням [RBAC](/docs/reference/access-authn-authz/rbac/) або будь-яким іншим механізмом [авторизації](/docs/reference/access-authn-authz/authorization/).

- Адміністратор кластера створює принаймні одну квоту ресурсів для кожного простору імен.
  - Щоб переконатися, що вимоги залишаються в силі, адміністратор кластера повинен також обмежити доступ до видалення або оновлення наприклад, визначивши [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).

- Користувачі створюють ресурси (Podʼи, Serviceʼи тощо) у просторі імен, і система квот відстежує використання, щоб забезпечити, що воно не перевищує жорсткі обмеження ресурсів, визначені в ResourceQuota.

  Ви можете застосувати [діапазон](#quota-scopes) до ResourceQuota, щоб обмежити сферу її застосування,

- Якщо створення або оновлення ресурсу порушує обмеження квоти, запит буде відхилено панеллю управління з HTTP кодом стану `403 Forbidden` з повідомленням, яке пояснює обмеження, що було б порушено.

- Якщо квоти включені в простір імен для {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}}, таких як `cpu` та `memory`, користувачі повинні вказати запити або ліміти для цих значень під час визначення Podʼів; інакше, система квот може відхилити створення Podʼа.

  Дивіться [посібник](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/) по квотам ресурсів для прикладу того, як уникнути цієї проблеми.

{{< note >}}

- Ви можете визначити [LimitRange](/docs/concepts/policy/limit-range/), щоб встановити стандартне значення для Podʼів, які не потребують обчислювальних ресурсів (щоб користувачам не потрібно було памʼятати про це).

{{< /note >}}

Часто ви не створюєте Podʼи безпосередньо; наприклад, ви зазвичай створюєте обʼєкт [керування робочим навантаженням](/docs/concepts/workloads/controllers/), такий як {{< glossary_tooltip term_id="deployment" >}}. Якщо ви створюєте Deployment, який намагається використати більше ресурсів, ніж доступно, створення Deployment (або іншого обʼєкта керування робочим навантаженням) буде **успішним**, але Deployment може бути не в змозі отримати доступ до всіх керовані ним Podʼи для свого існування. У цьому випадку ви можете перевірити стан Deployment, наприклад, за допомогою `kubectl describe`, щоб дізнатися, що сталося.

- Для ресурсів `cpu` та `memory`, квоти ресурсів забезпечують, що **кожен** (новий) Pod у цьому просторі імен встановлює ліміт для цього ресурсу. Якщо ви встановлюєте квоту ресурсів у просторі імен для `cpu` або `memory`, ви, і інші клієнти, **повинні** вказати або `requests`, або `limits` для цього ресурсу, для кожного нового Podʼа, який ви створюєте. Якщо ви цього не робите, панель управління може відхилити допуск для цього Podʼа.
- Для інших ресурсів: ResourceQuota працює та ігнорує Podʼи в просторі імен, які не встановлюють ліміт або запит для цього ресурсу. Це означає, що ви можете створити новий Pod без обмеження/запиту тимчасового сховища, якщо квота ресурсів обмежує тимчасове сховище цього простору імен. Ви можете використовувати [LimitRange](/docs/concepts/policy/limit-range/) для автоматичного встановлення стандартних запитів для цих ресурсів.

Назва обʼєкта ResourceQuota повинна бути дійсним [піддоменом DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Приклади політик, які можна створити за допомогою просторів імен та квот, такі:

- У кластері з місткістю 32 ГБ ОЗП та 16 ядрами, дозвольте команді A використовувати 20 ГБ та 10 ядер, дозвольте команді B використовувати 10 ГБ та 4 ядра, і залиште 2 ГБ та 2 ядра у резерві на майбутнє.
- Обмежте простір імен "testing" використанням 1 ядра та 1 ГБ ОЗП. Дозвольте простору імен "production" використовувати будь-який обсяг.

У випадку, коли загальна місткість кластера менше суми квот просторів імен, може виникнути конфлікт за ресурси. Це обробляється за принципом "хто перший прийшов, той і молотить" (FIFO).

## Увімкнення квоти ресурсів {#enabling-resource-quota}

Підтримка квоти ресурсів є типово увімкненою для багатьох дистрибутивів Kubernetes. Вона увімкнена, коли прапорець `--enable-admission-plugins=` {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}ʼа має `ResourceQuota` серед своїх аргументів.

Квота ресурсів застосовується в певному просторі імен, коли у цьому просторі імен є
ResourceQuota.

## Типи квот на ресурси {#types-of-resource-quota}

Механізм ResourceQuota дозволяє застосовувати різні види обмежень. У цьому розділі описано типи обмежень, які можна застосовувати.

## Квота на інфраструктурні ресурси {#compute-resource-quota}

Ви можете обмежити загальну суму [обчислювальних ресурсів](/docs/concepts/configuration/manage-resources-containers/), які можуть бути запитані в певному просторі імен.

Підтримуються наступні типи ресурсів:

| Назва ресурсу | Опис |
| ------------- | ---- |
| `limits.cpu` | У всіх Podʼах у незавершеному стані сума лімітів CPU не може перевищувати це значення. |
| `limits.memory` | У всіх Podʼах у незавершеному стані сума лімітів памʼяті не може перевищувати це значення. |
| `requests.cpu` | У всіх Podʼах у незавершеному стані сума запитів CPU не може перевищувати це значення. |
| `requests.memory` | У всіх Podʼах у незавершеному стані сума запитів памʼяті не може перевищувати це значення. |
| `hugepages-<size>` | У всіх Podʼах у незавершеному стані кількість запитів великих сторінок зазначеного розміру не може перевищувати це значення. |
| `cpu` | Те саме, що і `requests.cpu` |
| `memory` | Те саме, що і `requests.memory` |

### Квота для розширених ресурсів {#quota-for-extended-resources}

Крім ресурсів, згаданих вище, в релізі 1.10 було додано підтримку квоти для [розширених ресурсів](/docs/concepts/configuration/manage-resources-containers/#extended-resources).

Оскільки перевищення не дозволяється для розширених ресурсів, немає сенсу вказувати як `requests`, так і `limits` для одного й того ж розширеного ресурсу у квоті. Таким чином, для розширених ресурсів дозволяються лише елементи квоти з префіксом `requests.`.

Візьмімо ресурс GPU як приклад. Якщо імʼя ресурсу — `nvidia.com/gpu`, і ви хочете обмежити загальну кількість запитаних GPU в просторі імен до 4, ви можете визначити квоту так:

- `requests.nvidia.com/gpu: 4`

Дивіться [Перегляд та встановлення квот](#viewing-and-setting-quotas) для більш детальної інформації.

## Квота ресурсів зберігання {#quota-for-storage}

Ви можете обмежити загальну суму [ресурсів зберігання](/docs/concepts/storage/persistent-volumes/), які можуть бути запитані в певному просторі імен.

Крім того, ви можете обмежити споживання ресурсів зберігання на основі повʼязаного [StorageClass](/docs/concepts/storage/storage-classes/).

| Назва ресурсу | Опис |
| --------------| ---- |
| `requests.storage` | У всіх запитах на постійний том, сума запитів зберігання не може перевищувати це значення. |
| `persistentvolumeclaims` | Загальна кількість [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims), які можуть існувати у просторі імен. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | У всіх запитах на постійний том, повʼязаних з `<storage-class-name>`, сума запитів зберігання не може перевищувати це значення. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | У всіх запитах на постійний том, повʼязаних з `<storage-class-name>`, загальна кількість [запитів на постійні томи](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims), які можуть існувати у просторі імен. |

Наприклад ви хочете обмежити зберігання з StorageClass `gold` окремо від StorageClass `bronze`, ви можете визначити квоту так:

- `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
- `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

#### Квота для локального тимчасового зберігання {#quota-for-local-ephemeral-storage}

{{< feature-state for_k8s_version="v1.8" state="alpha" >}}

| Назва ресурсу | Опис |
| ------------- | ---- |
| `requests.ephemeral-storage` | У всіх Podʼах у просторі імен, сума запитів на локальне тимчасове сховище не може перевищувати це значення. |
| `limits.ephemeral-storage` | У всіх Podʼах у просторі імен, сума лімітів на локальне тимчасове сховище не може перевищувати це значення. |
| `ephemeral-storage` | Те саме, що і `requests.ephemeral-storage`. |

{{< note >}}
При використанні середовища виконання контейнерів CRI, логи контейнера будуть зараховуватися до квоти тимчасового сховища. Це може призвести до неочікуваного видалення Podʼів, які вичерпали свої квоти на сховище.

Дивіться [Архітектура логів](/docs/concepts/cluster-administration/logging/) для деталей.
{{< /note >}}

## Квота на кількість обʼєктів {#quota-on-object-count}

Ви можете встановити квоту на *загальну кількість одного конкретного типу {{< glossary_tooltip text="ресурса" term_id="api-resource" >}}* у API Kubernetes, використовуючи наступний синтаксис:

- `count/<resource>.<group>` для ресурсів API з груп non-core
- `count/<resource>` для ресурсів API з групи core

Наприклад, PodTemplate API входить до групи основних API, тому якщо ви хочете обмежити кількість обʼєктів PodTemplate в просторі імен, використовуйте `count/podtemplates`.

Такі типи квот корисні для захисту від вичерпання сховища панелі управління. Наприклад, ви можете обмежити кількість Secrets на сервері, враховуючи їх великий розмір. Занадто багато Secrets у кластері можуть фактично заважати запуску серверів і контролерів. Ви можете встановити квоту для Jobs, щоб захиститися від неправильно налаштованого CronJob. CronJobs, які створюють занадто багато завдань в просторі імен, можуть призвести до відмови в обслуговуванні.

Якщо ви визначаєте квоту таким чином, вона застосовується до API Kubernetes, які є частиною API-сервера, та до будь-яких власних ресурсів, що підтримуються CustomResourceDefinition. Наприклад, щоб створити квоту на власний ресурс `widgets` в API-групі `example.com`, використовуйте `count/widgets.example.com`. Якщо ви використовуєте [агрегацію API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) для додавання додаткових власних API, які не визначені як CustomResourceDefinitions, основна панель управління Kubernetes не застосовує квоту для агрегованого API. Очікується, що сервер розширення API забезпечить застосування квоти, якщо це доречно для власного API користувача.

##### Загальний синтаксис {#resource-quota-object-count-generic}

Це список загальних прикладів типів обʼєктів, які ви можете захотіти підпорядкувати квоті на кількість обʼєктів, перелічені рядками конфігурації, які ви будете використовувати.

- `count/pods`
- `count/persistentvolumeclaims`
- `count/services`
- `count/secrets`
- `count/configmaps`
- `count/deployments.apps`
- `count/replicasets.apps`
- `count/statefulsets.apps`
- `count/jobs.batch`
- `count/cronjobs.batch`

##### Спеціалізований синтаксис {#resource-quota-object-count-specialized}

Існує інший синтаксис, який дозволяє встановити такий же тип квоти для певних ресурсів.

Підтримуються наступні типи:

| Назва ресурсу | Опис |
| ------------- | ---- |
| `configmaps` | Загальна кількість ConfigMaps, які можуть існувати в просторі імен. |
| `persistentvolumeclaims` | Загальна кількість [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims), які можуть існувати в просторі імен. |
| `pods` | Загальна кількість Podʼів у просторі імен, що не перебувають в стані завершення роботи. Pod вважається таким, якщо `.status.phase in (Failed, Succeeded)` є true. |
| `replicationcontrollers` | Загальна кількість ReplicationControllers, які можуть існувати в просторі імен. |
| `resourcequotas` | Загальна кількість ResourceQuotas, які можуть існувати в просторі імен. |
| `services` | Загальна кількість Services, які можуть існувати в просторі імен. |
| `services.loadbalancers` | Загальна кількість Services типу `LoadBalancer`, які можуть існувати в просторі імен. |
| `services.nodeports` | Загальна кількість `NodePorts`, виділених Services типу `NodePort` чи `LoadBalancer`, які можуть існувати в просторі імен. |
| `secrets` | Загальна кількість Secrets, які можуть існувати в просторі імен. |

Наприклад, квота `pods` рахує та обмежує максимальну кількість `Pod`ʼів, створених у одному просторі імен, що не перебувають в стані завершення роботи. Ви можете встановити квоту `pods` у просторі імен, щоб уникнути випадку, коли користувач створює багато невеликих Podʼів і вичерпує запаси IP-адрес Podʼів кластері.

Ви можете знайти більше прикладів у розділі [Перегляд і налаштування квот](#viewing-and-setting-quotas).

## Області дії квоти {#quota-scopes}

Кожна квота може мати повʼязаний набір `scopes`. Квота вимірюватиме використання ресурсу лише в тому випадку, якщо вона відповідає перетину перерахованих областей.

Коли до квоти додається область, вона обмежує кількість ресурсів, які вона підтримує, тими, які стосуються цієї області. Ресурси, вказані у квоті поза дозволеним набором, призводять до помилки перевірки.

| Область | Опис |
| ----- | ----------- |
| `Terminating` | Відповідає Podʼам, де `.spec.activeDeadlineSeconds` >= `0` |
| `NotTerminating` | Відповідає Podʼам, де `.spec.activeDeadlineSeconds` є `nil` |
| `BestEffort` | Відповідає Podʼам, які мають найкращий рівень якості обслуговування. |
| `NotBestEffort` | Відповідає Podʼам, які не мають найкращого рівня якості обслуговування. |
| `PriorityClass` | Відповідає Podʼам, які посилаються на вказаний [клас пріоритету](/docs/concepts/scheduling-eviction/pod-priority-preemption). |
| `CrossNamespacePodAffinity` | Відповідає Podʼам, які мають міжпросторові [(anti)affinity](/docs/concepts/scheduling-eviction/assign-pod-node). |
| `VolumeAttributesClass` | Відповідає persistentvolumeclaims, які посилаються на вказані [класи атрибутів тому](/docs/concepts/storage/volume-attributes-classes). |

Область `BestEffort` обмежує квоту відстеження наступним ресурсом:

- `pods`

Області `Terminating`, `NotTerminating`, `NotBestEffort` та `PriorityClass` обмежують квоту відстеження наступними ресурсами:

- `pods`
- `cpu`
- `memory`
- `requests.cpu`
- `requests.memory`
- `limits.cpu`
- `limits.memory`

Зверніть увагу, що ви не можете вказати як `Terminating`, так і `NotTerminating` області в одній й тій же квоті, і ви також не можете вказати як `BestEffort`, так і `NotBestEffort` області в одній й тій же квоті.

Селектор області підтримує наступні значення у полі `operator`:

- `In`
- `NotIn`
- `Exists`
- `DoesNotExist`

При використанні одного з наступних значень як `scopeName` при визначенні `scopeSelector`, оператор повинен бути `Exists`.

- `Terminating`
- `NotTerminating`
- `BestEffort`
- `NotBestEffort`

Якщо оператором є `In` або `NotIn`, поле `values` повинно мати щонайменше одне значення. Наприклад:

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values:
          - middle
```

Якщо оператором є `Exists` або `DoesNotExist`, поле `values` *НЕ* повинно бути
вказане.

### Квота ресурсів за PriorityClass {#resource-quota-per-priorityclass}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Podʼи можуть бути створені з певним [пріоритетом](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority). Ви можете контролювати використання ресурсів системи для Podʼів з урахуванням їх пріоритету, використовуючи поле `scopeSelector` у специфікації квоти.

Квота має збіг та використовується лише якщо `scopeSelector` у специфікації квоти вибирає Pod.

Коли квота обмежена класом пріоритету за допомогою поля `scopeSelector`, обʼєкт квоти обмежується відстеженням лише наступних ресурсів:

- `pods`
- `cpu`
- `memory`
- `ephemeral-storage`
- `limits.cpu`
- `limits.memory`
- `limits.ephemeral-storage`
- `requests.cpu`
- `requests.memory`
- `requests.ephemeral-storage`

У цьому прикладі створюється обʼєкт квоти та відповідною до нього підходить до Podʼів з певними пріоритетами. Приклад працює наступним чином:

- Podʼи в кластері мають один з трьох класів пріоритету: "низький", "середній", "високий".
- Для кожного пріоритету створюється один обʼєкт квоти.

Збережіть наступний YAML у файл `quota.yaml`.

{{% code_sample file="policy/quota.yaml" %}}

Застосуйте YAML за допомогою `kubectl create`.

```shell
kubectl create -f ./quota.yaml
```

```none
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

Перевірте, що значення `Used` квоти дорівнює `0` за допомогою `kubectl describe quota`.

```shell
kubectl describe quota
```

```n
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     1k
memory      0     200Gi
pods        0     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

Створіть Pod із пріоритетом "high". Збережіть наступний YAML у файл `high-priority-pod.yaml`.

{{% code_sample file="policy/high-priority-pod.yaml" %}}

Застосуйте його за допомогою `kubectl create`.

```shell
kubectl create -f ./high-priority-pod.yaml
```

Перевірте, що статистика "Used" для квоти пріоритету "high", `pods-high`, змінилася і що для інших двох квот стан не змінився.

```shell
kubectl describe quota
```

```none
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         500m  1k
memory      10Gi  200Gi
pods        1     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

### Квота Pod Affinity між просторами імен {#cross-namespace-pod-affinity-quota}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Оператори можуть використовувати область квоти `CrossNamespacePodAffinity`, щоб обмежити, які простори імен можуть мати Podʼи з термінами спорідненості, які перетинають простори імен. Зокрема, вона контролює, яким Podʼам дозволено встановлювати поля `namespaces` або `namespaceSelector` у термінах спорідненості (Pod Affinity).

Бажано уникати використання термінів спорідненості, які перетинають простори імен, оскільки Pod з обмеженнями анти-спорідненості може заблокувати Podʼи з усіх інших просторів імен від планування в області відмов.

За допомогою цієї області оператори можуть запобігти певним просторам імен (наприклад, `foo-ns` у наведеному нижче прикладі) використання Podʼів, які використовують спорідненість між просторами імен, створивши обʼєкт квоти ресурсів в цьому просторі імен з областю `CrossNamespacePodAffinity` та жорстким обмеженням 0:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: disable-cross-namespace-affinity
  namespace: foo-ns
spec:
  hard:
    pods: "0"
  scopeSelector:
    matchExpressions:
    - scopeName: CrossNamespacePodAffinity
      operator: Exists
```

Якщо оператори хочуть заборонити стандартне використання `namespaces` та `namespaceSelector`, і дозволити це лише для певних просторів імен, вони можуть налаштувати `CrossNamespacePodAffinity` як обмежений ресурс, встановивши прапорець kube-apiserver --admission-control-config-file на шлях до наступного конфігураційного файлу:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: CrossNamespacePodAffinity
        operator: Exists
```

За такої конфігурації Podʼи можуть використовувати `namespaces` та `namespaceSelector` у термінах спорідненості тільки якщо простір імен, в якому вони створені, має обʼєкт квоти ресурсів з областю `CrossNamespacePodAffinity` та жорстким обмеженням, більшим або рівним кількості Podʼів, що використовують ці поля.

### Квота ресурсів на VolumeAttributesClass {#resource-quota-per-volumeattributesclass}

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

PersistentVolumeClaims можна створити за допомогою певного [класу атрибутів тома](/docs/concepts/storage/volume-attributes-classes/), і їх можна змінювати після створення. Ви можете керувати споживанням PVC ресурсів сховища на основі асоційованих класів атрибутів тома за допомогою поля `scopeSelector` у специфікації квот.

PVC посилається на асоційований клас атрибутів тома за допомогою наступних полів:

- `spec.volumeAttributesClassName`
- `status.currentVolumeAttributesClassName`
- `status.modifyVolumeStatus.targetVolumeAttributesClassName`

Квота зіставляється і споживається тільки якщо `scopeSelector` в специфікації квоти вибирає PVC.

Коли квота обмежується для класу атрибутів тому за допомогою поля `scopeSelector`, обʼєкт квоти обмежується для відстеження лише наступних ресурсів:

- `persistentvolumeclaims`
- `requests.storage`.

Цей приклад створює обʼєкт квоти і зіставляє його з PVC за певними класами атрибутів тома. Приклад працює наступним чином:

- PVC у кластері мають принаймні один з трьох класів атрибутів обсягу: "gold", "silver", "copper".
- Для кожного класу атрибутів тому створюється один обʼєкт квоти.

Збережіть наступний YAML-файл у файлі `quota-vac.yaml`.

{{% code_sample file="policy/quota-vac.yaml" %}}

Застосуйте YAML за допомогою `kubectl create`.

```shell
kubectl create -f ./quota-vac.yaml
```

```console
resourcequota/pvcs-gold created
resourcequota/pvcs-silver created
resourcequota/pvcs-copper created
```

Переконайтесь, що Використана (`Used`) квота є `0` за допомогою `kubectl describe quota`.

```shell
kubectl describe quota
```

```none
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

Створіть PVC з отрибутами класу тому "gold". Збережіть наступний YAML у файл `gold-vac-pvc.yaml`.

{{% code_sample file="policy/gold-vac-pvc.yaml" %}}

Застосуйте його командою `kubectl create`.

```shell
kubectl create -f ./gold-vac-pvc.yaml
```

Перевірте, що в "Used" вказано квоту отрибуту класу тому "gold", `pvcs-gold` змінився, а інші квоти залишились без змін.

```shell
kubectl describe quota
```

```none
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

Після того, як PVC привʼязано, можна змінювати бажаний клас атрибутів тому. Давайте змінимо його на "silver" за допомогою kubectl patch.

```shell
kubectl patch pvc gold-vac-pvc --type='merge' -p '{"spec":{"volumeAttributesClassName":"silver"}}'
```

Переконайтеся, що значення "Used" для "silver" атрибутів класу тома квоти, `pvcs-silver` змінилося, `pvcs-copper` не змінилося, а `pvcs-gold` може залишитися незмінним або бути вивільненим, що залежить від статусу PVC.

```shell
kubectl describe quota
```

```none
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

Змінимо її на "copper" за допомогою kubectl patch.

```shell
kubectl patch pvc gold-vac-pvc --type='merge' -p '{"spec":{"volumeAttributesClassName":"copper"}}'
```

Перевіримо, що значення "Used" для "copper" атрибутів класу тома квоти, `pvcs-copper` змінилося, `pvcs-silver` та `pvcs-gold` можуть залишитися незмінним або бути вивільненими, що залежить від статусу PVC.

```shell
kubectl describe quota
```

```none
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   30Gi
```

Виведіть маніфест PVC за допомогою наступної команди:

```shell
kubectl get pvc gold-vac-pvc -o yaml
```

Результат може бути наступним:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gold-vac-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: default
  volumeAttributesClassName: copper
status:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 2Gi
  currentVolumeAttributesClassName: gold
  phase: Bound
  modifyVolumeStatus:
    status: InProgress
    targetVolumeAttributesClassName: silver
  storageClassName: default
```

Зачекайте, поки зміни тому завершаться, а потім перевірте квоту ще раз.

```shell
kubectl describe quota
```

```none
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   30Gi
```

## Запити у порівнянні з лімітами {#requests-vs-limits}

При розподілі обчислювальних ресурсів кожен контейнер може вказати значення запиту та ліміту для CPU або памʼяті. Квоту можна налаштувати для обмеження будь-якого значення.

Якщо для квоти вказано значення для `requests.cpu` або `requests.memory`, то це вимагає, щоб кожен вхідний контейнер явно вказував запити для цих ресурсів. Якщо для квоти вказано значення для `limits.cpu` або `limits.memory`, то це вимагає, щоб кожен вхідний контейнер вказував явний ліміт для цих ресурсів.

## Перегляд і налаштування квот {#viewing-and-setting-quotas}

Kubectl підтримує створення, оновлення та перегляд квот:

```shell
kubectl create namespace myspace
```

```shell
cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "1"
    requests.memory: "1Gi"
    limits.cpu: "2"
    limits.memory: "2Gi"
    requests.nvidia.com/gpu: 4
EOF
```

```shell
kubectl create -f ./compute-resources.yaml --namespace=myspace
```

```shell
cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
```

```shell
kubectl create -f ./object-counts.yaml --namespace=myspace
```

```shell
kubectl get quota --namespace=myspace
```

```none
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```none
Name:                    compute-resources
Namespace:               myspace
Resource                 Used  Hard
--------                 ----  ----
limits.cpu               0     2
limits.memory            0     2Gi
requests.cpu             0     1
requests.memory          0     1Gi
requests.nvidia.com/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```none
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
pods                    0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

Kubectl також підтримує квоту на кількість обʼєктів для всіх стандартних обʼєктів в просторі імен за допомогою синтаксису `count/<resource>.<group>`:

```shell
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.apps=2,count/replicasets.apps=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl create deployment nginx --image=nginx --namespace=myspace --replicas=2
```

```shell
kubectl describe quota --namespace=myspace
```

```none
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.apps        1     2
count/pods                    2     3
count/replicasets.apps        1     4
count/secrets                 1     4
```

## Квоти та місткість кластера {#quotas-and-cluster-capacity}

ResourceQuotas є незалежними від місткості кластера. Вони виражені в абсолютних одиницях. Таким чином, якщо ви додаєте вузли до свого кластера, це автоматично *не* надає кожному простору імен можливість використовувати більше ресурсів.

Іноді бажані складніші політики, такі як:

- Пропорційне розподілення спільних ресурсів кластера серед кількох команд.
- Дозвіл кожному орендареві збільшувати використання ресурсів за потреби, але мати щедру квоту, щоб уникнути випадкового вичерпання ресурсів.
- Виявлення попиту з одного простору імен, додавання вузли та збільшення квоти.

Такі політики можна реалізувати, використовуючи `ResourceQuotas` як будівельні блоки, написавши "контролер", який спостерігає за використанням квоти та налаштовує межі квоти кожного простору імен згідно з іншими сигналами.

Зверніть увагу, що квота ресурсів розподіляє загальні ресурси кластера, але не створює обмежень щодо вузлів: Podʼи з кількох просторів імен можуть працювати на одному вузлі.

## Типове обмеження споживання Priority Class {#limmit-priority-class-consumption-by-default}

Може бути бажаним, щоб Podʼи з певного пріоритету, наприклад, "cluster-services", дозволялися в просторі імен, лише якщо існує відповідний обʼєкт квоти.

За допомогою цього механізму оператори можуть обмежувати використання певних високопріоритетних класів до обмеженої кількості просторів імен, і не кожний простір імен зможе стандартно споживати ці класи пріоритету.

Для цього потрібно використовувати прапорець `--admission-control-config-file` `kube-apiserver` для передачі шляху до наступного конфігураційного файлу:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

Потім створіть обʼєкт квоти ресурсів у просторі імен `kube-system`:

{{% code_sample file="policy/priority-class-resourcequota.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/policy/priority-class-resourcequota.yaml -n kube-system
```

```none
resourcequota/pods-cluster-services created
```

У цьому випадку створення Podʼа буде дозволено, якщо:

1. Параметр `priorityClassName` Podʼа не вказано.
1. Параметр `priorityClassName` Podʼа вказано на значення, відмінне від `cluster-services`.
1. Параметр `priorityClassName` Podʼа встановлено на `cluster-services`, він має бути створений в просторі імен `kube-system` і пройти перевірку обмеження ресурсів.

Запит на створення Podʼа буде відхилено, якщо його `priorityClassName` встановлено на `cluster-services` і він має бути створений в просторі імен, відмінному від `kube-system`.

## {{% heading "whatsnext" %}}

- Перегляньте [детальний приклад використання квоти ресурсів](/docs/tasks/administer-cluster/quota-api-object/).
- Прочитайте про [довідник API](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/) ResourceQuota.
- Дізнайтеся про [LimitRanges](/docs/concepts/policy/limit-range/)
- Ви можете прочитати історичний [ResourceQuota design document](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_resource_quota.md) для отримання додаткової інформації.
- Ви також можете ознайомитися з [Проєктним документом підтримки квот для класів пріоритетів](https://git.k8s.io/design-proposals-archive/scheduling/pod-priority-resourcequota.md).
