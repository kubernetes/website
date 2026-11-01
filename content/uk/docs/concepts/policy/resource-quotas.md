---
title: Квоти ресурсів
api_metadata:
- apiVersion: "v1"
  kind: "ResourceQuota"
content_type: concept
weight: 20
---

<!-- overview -->

Коли кілька користувачів або команд спільно використовують кластер із фіксованою кількістю вузлів, існує ризик, що одна команда використає більше за свою справедливу частку ресурсів.

_Квоти ресурсів_ — це інструмент, за допомогою якого адміністратори розвʼязують цю проблему.

Квота ресурсів, визначена обʼєктом ResourceQuota, задає обмеження загального споживання ресурсів у кожному {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}. ResourceQuota також може обмежувати [кількість обʼєктів, які можна створити в просторі імен](#quota-on-object-count), за типом API, а також загальний обсяг {{< glossary_tooltip text="інфраструктурних ресурсів" term_id="infrastructure-resource" >}}, які можуть споживати обʼєкти API в цьому просторі імен.

{{< caution >}}
Ані конкуренція, ані зміни до квоти не вплинуть на вже створені ресурси.
{{< /caution >}}

<!-- body -->

## Як працюють ResourceQuotas у Kubernetes {#how-kubernetes-resourcequotas-work}

ResourceQuotas працюють так:

- Різні команди працюють у різних просторах імен. Цей поділ можна забезпечити за допомогою [RBAC](/docs/reference/access-authn-authz/rbac/) або будь-якого іншого механізму [авторизації](/docs/reference/access-authn-authz/authorization/).

- Адміністратор кластера створює принаймні одну ResourceQuota для кожного простору імен.
  - Щоб ці вимоги залишалися чинними, адміністратор кластера також повинен обмежити доступ до видалення або оновлення цієї ResourceQuota, наприклад, визначивши [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).

- Користувачі створюють ресурси (Podʼи, Services тощо) у просторі імен, а система квот відстежує використання, щоб воно не перевищувало жорстких обмежень ресурсів, визначених у ResourceQuota.

  Ви можете застосувати до ResourceQuota [область дії](#quota-scopes), щоб обмежити, де вона застосовується.

- Якщо створення або оновлення ресурсу порушує обмеження квоти, панель управління відхиляє цей запит із кодом стану HTTP `403 Forbidden`. Помилка містить повідомлення з поясненням обмеження, яке було б порушено.

- Якщо квоти увімкнено в просторі імен для таких {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}}, як `cpu` та `memory`, користувачі повинні вказувати запити або обмеження для цих значень під час визначення Podʼа; інакше система квот може відхилити створення Podʼа.

  [Покроковий навчальний матеріал](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/) щодо квот ресурсів показує приклад того, як уникнути цієї проблеми.

{{< note >}}

- Ви можете визначити [LimitRange](/docs/concepts/policy/limit-range/), щоб примусово встановлювати стандартні значення для Podʼів, які не задають вимог до обчислювальних ресурсів (щоб користувачам не доводилося памʼятати про це).

{{< /note >}}

Часто ви не створюєте Podʼи безпосередньо; наприклад, ви зазвичай створюєте обʼєкт [керування робочим навантаженням](/docs/concepts/workloads/controllers/), такий як {{< glossary_tooltip term_id="deployment" >}}. Якщо ви створюєте Deployment, який намагається використати більше ресурсів, ніж доступно, створення Deployment (або іншого обʼєкта керування робочим навантаженням) буде **успішним**, але Deployment може бути не в змозі забезпечити існування всіх керованих ним Podʼів. У цьому випадку ви можете перевірити стан Deployment, наприклад, за допомогою `kubectl describe`, щоб дізнатися, що сталося.

- Для ресурсів `cpu` та `memory` ResourceQuotas вимагають, щоб **кожен** (новий) Pod у цьому просторі імен встановлював обмеження для цього ресурсу. Якщо ви застосовуєте квоту ресурсів у просторі імен для `cpu` або `memory`, ви та інші клієнти **повинні** вказувати `requests` або `limits` для цього ресурсу для кожного нового Podʼа, який ви надсилаєте. Якщо ви цього не зробите, панель управління може відхилити допуск цього Podʼа.
- Для інших ресурсів: ResourceQuota працює та ігнорує Podʼи в просторі імен, які не встановлюють обмеження або запит для цього ресурсу. Це означає, що ви можете створити новий Pod без обмеження/запиту тимчасового сховища, якщо квота ресурсів обмежує тимчасове сховище цього простору імен.

Ви можете використовувати [LimitRange](/docs/concepts/policy/limit-range/) для автоматичного встановлення стандартного запиту для цих ресурсів.

Назва обʼєкта ResourceQuota має бути дійсною [назвою DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Приклади політик, які можна створити за допомогою просторів імен та квот:

- У кластері місткістю 32 GiB RAM і 16 ядер дозвольте команді A використовувати 20 GiB і 10 ядер, дозвольте команді B використовувати 10 GiB і 4 ядра, а 2 GiB і 2 ядра залиште в резерві для майбутнього розподілу.
- Обмежте простір імен "testing" використанням 1 ядра та 1 GiB RAM. Дозвольте простору імен "production" використовувати будь-який обсяг.

У випадку, коли загальна місткість кластера менша за суму квот просторів імен, може виникнути конкуренція за ресурси. Це обробляється за принципом «перший прийшов — перший обслужений».

## Увімкнення квоти ресурсів {#enabling-resource-quota}

Підтримка ResourceQuota стандартно увімкнена в багатьох дистрибутивах Kubernetes. Вона увімкнена, коли прапорець `--enable-admission-plugins=` {{< glossary_tooltip text="API-сервера" term_id="kube-apiserver" >}} має `ResourceQuota` серед своїх аргументів.

Квота ресурсів застосовується в певному просторі імен, коли у цьому просторі імен є
ResourceQuota.

## Типи квот ресурсів {#types-of-resource-quota}

Механізм ResourceQuota дозволяє застосовувати різні види обмежень. У цьому розділі описано типи обмежень, які можна застосовувати.

### Квота на інфраструктурні ресурси {#compute-resource-quota}

Ви можете обмежити загальну суму [обчислювальних ресурсів](/docs/concepts/configuration/manage-resources-containers/), які можна запитати в певному просторі імен.

Підтримуються такі типи ресурсів:

| Назва ресурсу | Опис |
| ------------- | ---- |
| `limits.cpu` | Для всіх Podʼів у нетермінальному стані сума обмежень CPU не може перевищувати це значення. |
| `limits.memory` | Для всіх Podʼів у нетермінальному стані сума обмежень памʼяті не може перевищувати це значення. |
| `requests.cpu` | Для всіх Podʼів у нетермінальному стані сума запитів CPU не може перевищувати це значення. |
| `requests.memory` | Для всіх Podʼів у нетермінальному стані сума запитів памʼяті не може перевищувати це значення. |
| `hugepages-<size>` | Для всіх Podʼів у нетермінальному стані кількість запитів великих сторінок зазначеного розміру не може перевищувати це значення. |
| `cpu` | Те саме, що і `requests.cpu` |
| `memory` | Те саме, що і `requests.memory` |

### Квота для розширених ресурсів {#quota-for-extended-resources}

Крім згаданих вище ресурсів, у випуску 1.10 було додано підтримку квот для [розширених ресурсів](/docs/concepts/configuration/manage-resources-containers/#extended-resources).

Оскільки overcommit для розширених ресурсів не дозволяється, немає сенсу вказувати і `requests`, і `limits` для одного й того самого розширеного ресурсу у квоті. Тому для розширених ресурсів дозволені лише елементи квоти з префіксом `requests.`.

Візьмімо як приклад ресурс GPU: якщо назва ресурсу — `nvidia.com/gpu` і ви хочете обмежити загальну кількість запитаних GPU в просторі імен до 4, ви можете визначити квоту так:

- `requests.nvidia.com/gpu: 4`

Докладніше дивіться в розділі [Перегляд та встановлення квот](#viewing-and-setting-quotas).

### Квота для запитів на ресурси DRA {#quota-for-dra-resource-claims}

Запити на ресурси DRA (Dynamic Resource Allocation) можуть запитувати ресурси DRA за класом пристроїв. Наприклад, для класу пристроїв із назвою `examplegpu`, якщо ви хочете обмежити загальну кількість GPU, запитаних у просторі імен, до 4, ви можете визначити квоту так:

- `examplegpu.deviceclass.resource.k8s.io/devices: 4`

Коли увімкнено [виділення розширених ресурсів за допомогою DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#extended-resource), той самий клас пристроїв із назвою `examplegpu` можна запитувати через розширений ресурс або явно, коли в полі ExtendedResourceName класу пристроїв задано, скажімо, `example.com/gpu`, тоді ви можете визначити квоту так:

- `requests.example.com/gpu: 4`

або неявно, використовуючи похідну назву розширеного ресурсу від назви класу пристроїв `examplegpu`, тоді ви можете визначити квоту так:

- `requests.deviceclass.resource.kubernetes.io/examplegpu: 4`

Усі пристрої, запитані через запити на ресурси або розширені ресурси, враховуються у всіх трьох наведених вище квотах. Квота розширеного ресурсу, наприклад `requests.example.com/gpu: 4`, також враховує пристрої, надані втулком пристроїв.

Докладніше дивіться в розділі [Перегляд та встановлення квот](#viewing-and-setting-quotas).

### Квота для сховища {#quota-for-storage}

Ви можете обмежити загальний обсяг [сховища](/docs/concepts/storage/persistent-volumes/) для томів, який можна запитати в певному просторі імен.

Крім того, ви можете обмежити споживання ресурсів сховища на основі повʼязаного [StorageClass](/docs/concepts/storage/storage-classes/).

| Назва ресурсу | Опис |
| --------------| ---- |
| `requests.storage` | Для всіх PersistentVolumeClaims сума запитів на сховище не може перевищувати це значення. |
| `persistentvolumeclaims` | Загальна кількість [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims), які можуть існувати у просторі імен. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Для всіх PersistentVolumeClaims, повʼязаних із `<storage-class-name>`, сума запитів на сховище не може перевищувати це значення. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Для всіх PersistentVolumeClaims, повʼязаних із `<storage-class-name>`, загальна кількість [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims), які можуть існувати у просторі імен. |

Наприклад, якщо ви хочете встановити квоту для сховища зі StorageClass `gold` окремо від StorageClass `bronze`, ви можете визначити квоту так:

- `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
- `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

#### Квота для локального тимчасового сховища {#quota-for-local-ephemeral-storage}

{{< feature-state for_k8s_version="v1.8" state="alpha" >}}

| Назва ресурсу | Опис |
| ------------- | ---- |
| `requests.ephemeral-storage` | Для всіх Podʼів у просторі імен сума запитів на локальне тимчасове сховище не може перевищувати це значення. |
| `limits.ephemeral-storage` | Для всіх Podʼів у просторі імен сума обмежень на локальне тимчасове сховище не може перевищувати це значення. |
| `ephemeral-storage` | Те саме, що і `requests.ephemeral-storage`. |

{{< note >}}
Під час використання середовища виконання контейнерів CRI логи контейнерів зараховуються до квоти тимчасового сховища. Це може призвести до неочікуваного виселення Podʼів, які вичерпали свої квоти сховища.

Докладніше дивіться в розділі [Архітектура логів](/docs/concepts/cluster-administration/logging/).
{{< /note >}}

### Квота на кількість обʼєктів {#quota-on-object-count}

Ви можете встановити квоту на *загальну кількість одного конкретного типу {{< glossary_tooltip text="ресурсу" term_id="api-resource" >}}* в API Kubernetes, використовуючи такий синтаксис:

- `count/<resource>.<group>` для ресурсів із груп API, що не належать до основної (non-core)
- `count/<resource>` для ресурсів з основної групи API (core)

Наприклад, API PodTemplate входить до основної групи API, тому, якщо ви хочете обмежити кількість обʼєктів PodTemplate у просторі імен, використовуйте `count/podtemplates`.

Такі типи квот корисні для захисту від вичерпання сховища панелі управління. Наприклад, ви можете обмежити кількість Secrets на сервері, враховуючи їхній великий розмір. Занадто велика кількість Secrets у кластері може фактично завадити запуску серверів і контролерів. Ви можете встановити квоту для Jobs, щоб захиститися від неправильно налаштованого CronJob. CronJobs, які створюють занадто багато Jobs у просторі імен, можуть призвести до відмови в обслуговуванні.

Якщо ви визначаєте квоту таким чином, вона застосовується до API Kubernetes, які є частиною API-сервера, та до будь-яких власних ресурсів, що підтримуються CustomResourceDefinition. Наприклад, щоб створити квоту на власний ресурс `widgets` у групі API `example.com`, використовуйте `count/widgets.example.com`. Якщо ви використовуєте [агрегацію API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) для додавання власних API, які не визначені як CustomResourceDefinitions, основна панель управління Kubernetes не застосовує квоту до агрегованого API. Очікується, що сервер розширення API забезпечуватиме застосування квоти, якщо це доречно для цього власного API.

##### Загальний синтаксис {#resource-quota-object-count-generic}

Нижче наведено список поширених прикладів типів обʼєктів, які ви можете захотіти підпорядкувати квоті на кількість обʼєктів, перелічених за рядками конфігурації, які ви будете використовувати.

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

Існує інший синтаксис для встановлення такого самого типу квоти, який працює лише для певних типів API. Підтримуються такі типи:

| Назва ресурсу | Опис |
| ------------- | ---- |
| `configmaps` | Загальна кількість ConfigMaps, які можуть існувати в просторі імен. |
| `persistentvolumeclaims` | Загальна кількість [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims), які можуть існувати в просторі імен. |
| `pods` | Загальна кількість Podʼів у нетермінальному стані, які можуть існувати в просторі імен. Pod перебуває в термінальному стані, якщо `.status.phase in (Failed, Succeeded)` є true. |
| `replicationcontrollers` | Загальна кількість ReplicationControllers, які можуть існувати в просторі імен. |
| `resourcequotas` | Загальна кількість ResourceQuotas, які можуть існувати в просторі імен. |
| `services` | Загальна кількість Services, які можуть існувати в просторі імен. |
| `services.loadbalancers` | Загальна кількість Services типу `LoadBalancer`, які можуть існувати в просторі імен. |
| `services.nodeports` | Загальна кількість `NodePorts`, виділених Services типу `NodePort` чи `LoadBalancer`, які можуть існувати в просторі імен. |
| `secrets` | Загальна кількість Secrets, які можуть існувати в просторі імен. |

Наприклад, квота `pods` рахує та обмежує максимальну кількість `pods`, створених в одному просторі імен, які не є термінальними. Ви можете встановити квоту `pods` у просторі імен, щоб уникнути випадку, коли користувач створює багато невеликих Podʼів і вичерпує запас IP-адрес Podʼів у кластері.

Більше прикладів можна знайти в розділі [Перегляд та встановлення квот](#viewing-and-setting-quotas).

## Перегляд та встановлення квот {#viewing-and-setting-quotas}

kubectl підтримує створення, оновлення та перегляд квот:

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

kubectl також підтримує квоту на кількість обʼєктів для всіх стандартних ресурсів простору імен, використовуючи синтаксис `count/<resource>.<group>`:

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

## Квота та місткість кластера {#quota-and-cluster-capacity}

ResourceQuotas не залежать від місткості кластера. Вони виражаються в абсолютних одиницях. Отже, якщо ви додаєте вузли до свого кластера, це *не* дає автоматично кожному простору імен можливості споживати більше ресурсів.

Іноді можуть знадобитися більш складні політики, такі як:

- Пропорційно розподіляти загальні ресурси кластера між кількома командами.
- Дозволяти кожному орендарю збільшувати використання ресурсів за потреби, але мати щедре обмеження, щоб запобігти випадковому вичерпанню ресурсів.
- Виявляти попит з боку одного простору імен, додавати вузли та збільшувати квоту.

Такі політики можна реалізувати, використовуючи `ResourceQuotas` як будівельні блоки, написавши «контролер», який стежить за використанням квот і коригує жорсткі обмеження квот кожного простору імен відповідно до інших сигналів.

Зверніть увагу, що квота ресурсів розподіляє сукупні ресурси кластера, але не створює обмежень щодо вузлів: Podʼи з кількох просторів імен можуть працювати на одному вузлі.

## Області дії квоти {#quota-scopes}

Кожна квота може мати повʼязаний набір `scopes`. Квота вимірюватиме використання ресурсу лише тоді, коли він відповідає перетину перелічених областей дії.

Коли до квоти додається область дії, вона обмежує кількість підтримуваних ресурсів тими, що стосуються цієї області дії. Ресурси, вказані у квоті поза дозволеним набором, призводять до помилки перевірки.

Kubernetes {{< skew currentVersion >}} підтримує такі області дії:

| Область | Опис |
| ----- | ----------- |
| [`BestEffort`](#quota-scope-best-effort) | Відповідає Podʼам із якістю обслуговування best-effort. |
| [`CrossNamespacePodAffinity`](#cross-namespace-pod-affinity-scope) | Відповідає Podʼам, які мають [правила (анти)спорідненості](/docs/concepts/scheduling-eviction/assign-pod-node) Podʼів між просторами імен. |
| [`NotBestEffort`](#quota-scope-non-best-effort) | Відповідає Podʼам, які не мають якості обслуговування best-effort. |
| [`NotTerminating`](#quota-scope-non-terminating) | Відповідає Podʼам, де `.spec.activeDeadlineSeconds` є `nil`. |
| [`PriorityClass`](#resource-quota-per-priorityclass) | Відповідає Podʼам, які посилаються на вказаний [клас пріоритету](/docs/concepts/scheduling-eviction/pod-priority-preemption). |
| [`Terminating`](#quota-scope-terminating) | Відповідає Podʼам, де `.spec.activeDeadlineSeconds` >= `0`. |
| [`VolumeAttributesClass`](#quota-scope-volume-attributes-class) | Відповідає PersistentVolumeClaims, які посилаються на вказаний [клас атрибутів тому](/docs/concepts/storage/volume-attributes-classes). |

ResourceQuotas із заданою областю дії також можуть мати необовʼязкове поле `scopeSelector`. Ви визначаєте один або кілька _виразів відповідності_, які вказують `operators` і, якщо це доречно, набір `values` для відповідності. Наприклад:

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: BestEffort # Відповідає Podʼам із якістю обслуговування best-effort
        operator: Exists # необовʼязково; для області дії BestEffort "Exists" мається на увазі
```

`scopeSelector` підтримує такі значення в полі `operator`:

- `In`
- `NotIn`
- `Exists`
- `DoesNotExist`

Якщо оператором є `In` або `NotIn`, поле `values` повинно мати щонайменше одне значення. Наприклад:

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values:
          - middle
```

Якщо оператором є `Exists` або `DoesNotExist`, поле `values` *НЕ* повинно бути вказане.

### Область дії для Podʼів Best effort {#quota-scope-best-effort}

Ця область дії відстежує лише квоту, спожиту Podʼами. Вона відповідає лише Podʼам, які мають [клас QoS](/docs/concepts/workloads/pods/pod-qos/) [best-effort](/docs/concepts/workloads/pods/pod-qos/#besteffort).

`operator` для `scopeSelector` повинен бути `Exists`.

### Область дії для Podʼів Not-best-effort {#quota-scope-non-best-effort}

Ця область дії відстежує лише квоту, спожиту Podʼами. Вона відповідає лише Podʼам, які мають [клас QoS](/docs/concepts/workloads/pods/pod-qos/) [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed) або [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable).

`operator` для `scopeSelector` повинен бути `Exists`.

### Область дії для Podʼів Non-terminating {#quota-scope-non-terminating}

Ця область дії відстежує лише квоту, спожиту Podʼами, які не завершуються. `operator` для `scopeSelector` повинен бути `Exists`.

Pod вважається таким, що не завершується, якщо поле `.spec.activeDeadlineSeconds` не встановлено.

Ви можете використовувати ResourceQuota з цією областю дії для керування такими ресурсами:

* `count.pods`
* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

### Область дії Podʼів Terminating {#quota-scope-terminating}

Ця область дії відстежує лише квоту, спожиту Podʼами, які завершуються. `operator` для `scopeSelector` повинен бути `Exists`.

Pod вважається таким, що _завершується_, якщо поле `.spec.activeDeadlineSeconds` встановлено на будь-яке число.

Ви можете використовувати ResourceQuota з цією областю дії для керування такими ресурсами:

* `count.pods`
* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

### Область дії спорідненості Podʼів між просторами імен {#cross-namespace-pod-affinity-scope}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Ви можете використовувати [область дії квоти](#quota-scopes) `CrossNamespacePodAffinity`, щоб обмежити, які простори імен можуть мати Podʼи з правилами спорідненості, що охоплюють кілька просторів імен. Зокрема, вона контролює, яким Podʼам дозволено встановлювати поля `namespaces` або `namespaceSelector` у [правилах (анти)спорідненості](/docs/concepts/scheduling-eviction/assign-pod-node) Podʼів.

Може бути бажаним не дозволяти користувачам використовувати правила спорідненості між просторами імен, оскільки Pod з обмеженнями антиспорідненості може не дати Podʼам з усіх інших просторів імен бути запланованими в домені відмов.

За допомогою цієї області дії ви (як адміністратор кластера) можете заборонити певним просторам імен (наприклад, `foo-ns` у наведеному нижче прикладі) мати Podʼи, які використовують спорідненість Podʼів між просторами імен. Для цього створіть у цьому просторі імен обʼєкт ResourceQuota з областю дії `CrossNamespacePodAffinity` та жорстким обмеженням 0:

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

Якщо ви хочете стандартно заборонити використання `namespaces` та `namespaceSelector` і дозволити його лише для певних просторів імен, ви можете налаштувати `CrossNamespacePodAffinity` як обмежений ресурс, встановивши для прапорця kube-apiserver `--admission-control-config-file` шлях до такого конфігураційного файлу:

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

За такої конфігурації Podʼи можуть використовувати `namespaces` та `namespaceSelector` у спорідненості Podʼів лише тоді, коли простір імен, у якому вони створені, має обʼєкт квоти ресурсів з областю дії `CrossNamespacePodAffinity` та жорстким обмеженням, більшим або рівним кількості Podʼів, що використовують ці поля.

### Область дії PriorityClass {#resource-quota-per-priorityclass}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

ResourceQuota з областю дії PriorityClass відповідає лише тим Podʼам, які мають певний [клас пріоритету](/docs/concepts/scheduling-eviction/pod-priority-preemption), і лише якщо будь-який `scopeSelector` у специфікації квоти вибирає певний Pod.

Podʼи можна створювати з певним [пріоритетом](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority). Ви можете контролювати споживання системних ресурсів Podʼом на основі його пріоритету, використовуючи поле `scopeSelector` у специфікації квоти.

Коли область дії квоти задано для PriorityClass за допомогою поля `scopeSelector`, ResourceQuota може відстежувати (і обмежувати) лише такі ресурси:

* `pods`
* `cpu`
* `memory`
* `ephemeral-storage`
* `limits.cpu`
* `limits.memory`
* `limits.ephemeral-storage`
* `requests.cpu`
* `requests.memory`
* `requests.ephemeral-storage`

#### Приклад {#quota-scope-priorityclass-example}

Цей приклад створює ResourceQuota, яка відповідає Podʼам з певними пріоритетами. Приклад працює так:

- Podʼи в кластері мають один із трьох [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass): "low", "medium", "high".
  - Якщо ви хочете спробувати це, використовуйте тестовий кластер і налаштуйте ці три PriorityClasses, перш ніж продовжувати.
- Для кожного пріоритету створюється один обʼєкт квоти.

Перегляньте цей набір ResourceQuotas:

{{% code_sample file="policy/quota.yaml" %}}

Застосуйте YAML за допомогою `kubectl create`.

```shell
kubectl create -f https://k8s.io/examples/policy/quota.yaml
```

```none
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

Перевірте, що квота `Used` дорівнює `0`, за допомогою команди `kubectl describe quota`.

```shell
kubectl describe quota
```

```none
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

Створіть Pod з пріоритетом "high".

{{% code_sample file="policy/high-priority-pod.yaml" %}}

Створіть Pod:

```shell
kubectl create -f https://k8s.io/examples/policy/high-priority-pod.yaml

```

Перевірте, що статистика "Used" для квоти пріоритету "high", `pods-high`, змінилася, а інші дві квоти залишилися без змін.

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

#### Стандартне обмеження споживання PriorityClass {#limit-priority-class-consumption-by-default}

Може бути бажаним, щоб Podʼи з певним пріоритетом, наприклад "cluster-services", дозволялися в просторі імен тоді й лише тоді, коли існує відповідний обʼєкт квоти.

За допомогою цього механізму оператори можуть обмежувати використання певних високопріоритетних класів обмеженою кількістю просторів імен, і не кожен простір імен зможе стандартно споживати ці класи пріоритету.

Для цього потрібно використати прапорець `kube-apiserver` `--admission-control-config-file`, щоб передати шлях до такого конфігураційного файлу:

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

1. `priorityClassName` Podʼа не вказано.
1. `priorityClassName` Podʼа має значення, відмінне від `cluster-services`.
1. `priorityClassName` Podʼа встановлено на `cluster-services`, Pod створюється у просторі імен `kube-system` і пройшов перевірку квоти ресурсів.

Запит на створення Podʼа буде відхилено, якщо його `priorityClassName` встановлено на `cluster-services` і Pod створюється в просторі імен, відмінному від `kube-system`.

### Область дії VolumeAttributesClass {#quota-scope-volume-attributes-class}

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

Ця область дії відстежує лише квоту, спожиту PersistentVolumeClaims.

PersistentVolumeClaims можна створювати з певним [VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/) і змінювати після створення. Ви можете контролювати споживання ресурсів сховища PVC на основі повʼязаних VolumeAttributesClasses, використовуючи поле `scopeSelector` у специфікації квоти.

PVC посилається на повʼязаний VolumeAttributesClass через такі поля:

* `spec.volumeAttributesClassName`
* `status.currentVolumeAttributesClassName`
* `status.modifyVolumeStatus.targetVolumeAttributesClassName`

Відповідна ResourceQuota зіставляється й споживається лише тоді, коли ResourceQuota має `scopeSelector`, який вибирає PVC.

Коли область дії квоти задано для класу атрибутів тому за допомогою поля `scopeSelector`, обʼєкт квоти може відстежувати лише такі ресурси:

* `persistentvolumeclaims`
* `requests.storage`

Детальніше про це читайте в розділі [Обмеження використання сховища](/docs/tasks/administer-cluster/limit-storage-consumption/).

## {{% heading "whatsnext" %}} {#whats-next}

- Перегляньте [детальний приклад використання квоти ресурсів](/docs/tasks/administer-cluster/quota-api-object/).
- Прочитайте [довідник API](/docs/reference/kubernetes-api/core/resource-quota-v1/) ResourceQuota.
- Дізнайтеся про [LimitRanges](/docs/concepts/policy/limit-range/)
- Ви можете прочитати історичний [проєктний документ ResourceQuota](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_resource_quota.md), щоб дізнатися більше.
- Ви також можете прочитати [проєктний документ про підтримку квот для класів пріоритету](https://git.k8s.io/design-proposals-archive/scheduling/pod-priority-resourcequota.md).
