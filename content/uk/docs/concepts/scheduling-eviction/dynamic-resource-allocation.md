---
title: Динамічне виділення ресурсів
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

Динамічне виділення ресурсів — це API для запиту та спільного використання ресурсів між Podʼами та контейнерами всередині Podʼа. Це узагальнення API для постійних томів для загальних ресурсів. Зазвичай ці ресурси є пристроями, такими як GPU.

Драйвери сторонніх ресурсів відповідають за відстеження та підготовку ресурсів, а виділення ресурсів здійснюється Kubernetes за допомогою _структурованих параметрів_ (введених у Kubernetes 1.30). Різні види ресурсів підтримують довільні параметри для визначення вимог та ініціалізації.

У версіях Kubernetes від 1.26 до 1.31 була реалізована (альфа) версія _classic DRA_, яка більше не підтримується. Ця документація для Kubernetes v{{< skew currentVersion >}}, пояснює поточний підхід до динамічного розподілу ресурсів у Kubernetes.

## {{% heading "prerequisites" %}}

Kubernetes v{{< skew currentVersion >}} включає підтримку API на рівні кластера для динамічного виділення ресурсів, але це [потрібно](#enabling-dynamic-resource-allocation) включити явно. Ви також повинні встановити драйвер ресурсів для конкретних ресурсів, які мають бути керовані за допомогою цього API. Якщо ви не використовуєте Kubernetes v{{< skew currentVersion>}}, перевірте документацію для цієї версії Kubernetes.

<!-- body -->

## API

{{< glossary_tooltip text="Група API" term_id="api-group" >}} `resource.k8s.io/v1beta1` надає наступні типи:

ResourceClaim
: Визначає запит на доступ до ресурсів у кластері для використання робочими навантаженнями. Наприклад, якщо робоче навантаження потребує пристрою прискорювача з певними властивостями, саме так виражається цей запит. Розділ статусу відстежує, чи було виконано цей запит і які конкретні ресурси було виділено.

ResourceClaimTemplate
: Визначає специфікацію та деякі метадані для створення ResourceClaims. Створюється користувачем під час розгортання робочого навантаження. Kubernetes автоматично створює та видаляє ResourceClaims для кожного Podʼа.

DeviceClass
: Містить заздалегідь визначені критерії вибору для певних пристроїв та їх конфігурацію. DeviceClass створюється адміністратором кластера під час встановлення драйвера ресурсів. Кожен запит на виділення пристрою в ResourceClaim повинен посилатися на один конкретний DeviceClass.

ResourceSlice
: Використовується драйверами DEA для публікації інформації про ресурси, які доступні у кластері.

Всі параметри які використовуються для вибору пристроїв визначаються ResourceClaim та DeviceClass за вбудованими типами. Параметри конфігурації можна вбудувати тут. Який параметр є валідним визначається драйвером DRA, Kubernetes лише передає їх без їх інтерпретації.

`PodSpec` `core/v1` визначає ResourceClaims, які потрібні для Podʼа в полі `resourceClaims`. Записи в цьому списку посилаються або на ResourceClaim, або на ResourceClaimTemplate. При посиланні на ResourceClaim всі Podʼи, які використовують цей PodSpec (наприклад, всередині Deployment або StatefulSet), спільно використовують один екземпляр ResourceClaim. При посиланні на ResourceClaimTemplate, кожен Pod отримує свій власний екземпляр.

Список `resources.claims` для ресурсів контейнера визначає, чи отримує контейнер доступ до цих екземплярів ресурсів, що дозволяє спільне використання ресурсів між одним або кількома контейнерами.

Нижче наведено приклад для умовного драйвера ресурсів. Для цього Podʼа буде створено два обʼєкти ResourceClaim, і кожен контейнер отримає доступ до одного з них.

```yaml
apiVersion: resource.k8s.io/v1beta1
kind: DeviceClass
name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        selectors:
        - cel:
           expression: |-
              device.attributes["resource-driver.example.com"].color == "black" &&
              device.attributes["resource-driver.example.com"].size == "large"
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

## Планування {#scheduling}

Планувальник відповідає за виділення ресурсів для ResourceClaim, коли Pod потребує їх. Він робить це, отримуючи повний список доступних ресурсів з обʼєктів ResourceSlice, відстежуючи, які з цих ресурсів вже були виділені наявним ResourceClaim, а потім вибираючи з тих ресурсів, що залишилися.

Єдиний тип підтримуваних ресурсів зараз — це пристрої. Пристрій має імʼя та кілька атрибутів та можливостей. Вибір пристроїв здійснюється за допомогою виразів CEL, які перевіряють ці атрибути та можливості. Крім того, набір вибраних пристроїв також може бути обмежений наборами, які відповідають певним обмеженням.

Обраний ресурс фіксується у статусі ResourceClaim разом з будь-якими вендор-специфічними налаштуваннями, тому коли Pod збирається запуститися на вузлі, драйвер ресурсу на вузлі має всю необхідну інформацію для підготовки ресурсу.

За допомогою структурованих параметрів планувальник може приймати рішення без спілкування з будь-якими драйверами ресурсів DRA. Він також може швидко планувати кілька Podʼів, зберігаючи інформацію про виділення ресурсів для ResourceClaim у памʼяті та записуючи цю інформацію в обʼєкти ResourceClaim у фоні, одночасно з привʼязкою Podʼа до вузла.

## Моніторинг ресурсів {#monitoring-resources}

Kubelet надає службу gRPC для забезпечення виявлення динамічних ресурсів запущених Podʼів. Для отримання додаткової інформації про точки доступу gRPC дивіться [звіт про виділення ресурсів](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

## Попередньо заплановані Podʼи {#pre-scheduled-pods}

Коли ви, або інший клієнт API, створюєте Pod із вже встановленим `spec.nodeName`, планувальник пропускається. Якщо будь-який ResourceClaim, потрібний для цього Podʼа, ще не існує, не виділений або не зарезервований для Podʼа, то kubelet не зможе запустити Pod і періодично перевірятиме це, оскільки ці вимоги можуть бути задоволені пізніше.

Така ситуація також може виникнути, коли підтримка динамічного виділення ресурсів не була увімкнена в планувальнику на момент планування Podʼа (різниця версій, конфігурація, feature gate і т. д.). kube-controller-manager виявляє це і намагається зробити Pod працюючим, шляхом отримання потрібних ResourceClaims. Однак, це працює якщо вони були виділені планувальником для якогось іншого podʼа.

Краще уникати цього оминаючи планувальник, оскільки Pod, який призначений для вузла, блокує нормальні ресурси (ОЗП, ЦП), які потім не можуть бути використані для інших Podʼів, поки Pod є застряглим. Щоб запустити Pod на певному вузлі, при цьому проходячи через звичайний потік планування, створіть Pod із селектором вузла, який точно відповідає бажаному вузлу:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: назва-призначеного-вузла
  ...
```

Можливо, ви також зможете змінити вхідний Pod під час допуску, щоб скасувати поле `.spec.nodeName` і використовувати селектор вузла замість цього.

## Адміністративний доступ {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Ви можете позначити запит у ResourceClaim або ResourceClaimTemplate як такий, що має привілейовані можливості. Запит з правами адміністратора надає доступ до пристроїв, які використовуються, і
може увімкнути додаткові дозволи, якщо зробити пристрій доступним у
контейнері:

```yaml
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        adminAccess: true
```

Якщо цю функцію вимкнено, поле `adminAccess` буде видалено автоматично при створенні такої вимоги до ресурсу.

Доступ адміністратора є привілейованим режимом, який не слід надавати звичайним користувачам у багатокористувацькому кластері. Адміністратори кластера можуть обмежити використання цієї функції, встановивши політику перевірки допуску, подібну до наступного прикладу. Адміністратори кластера повинні адаптувати принаймні імена і замінити "dra.example.com".

```yaml
# Дозвіл на використання доступу адміністратора надається лише у просторах імен, які мають мітку
# "admin-access.dra.example.com". Інші способи прийняття цього рішення
# також можливі.

apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: resourceclaim-policy.dra.example.com
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["resource.k8s.io"]
      apiVersions: ["v1alpha3", "v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["resourceclaims"]
  validations:
    - expression: '! object.spec.devices.requests.exists(e, has(e.adminAccess) && e.adminAccess)'
      reason: Forbidden
      messageExpression: '"admin access to devices not enabled"'
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: resourceclaim-binding.dra.example.com
spec:
  policyName:  resourceclaim-policy.dra.example.com
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: admin-access.dra.example.com
        operator: DoesNotExist
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: resourceclaimtemplate-policy.dra.example.com
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["resource.k8s.io"]
      apiVersions: ["v1alpha3", "v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["resourceclaimtemplates"]
  validations:
    - expression: '! object.spec.spec.devices.requests.exists(e, has(e.adminAccess) && e.adminAccess)'
      reason: Forbidden
      messageExpression: '"admin access to devices not enabled"'
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: resourceclaimtemplate-binding.dra.example.com
spec:
  policyName:  resourceclaimtemplate-policy.dra.example.com
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: admin-access.dra.example.com
        operator: DoesNotExist
```

## Статус пристрою ResourceClaim {#resourceclaim-device-status}

Драйвери можуть повідомляти дані про стан конкретного пристрою для кожного виділеного пристрою у вимозі на ресурс. Наприклад, IP-адреси, призначені пристрою мережевого інтерфейсу, можуть бути вказані у статусі ResourceClaim.

Драйвери встановлюють статус, точність інформації залежить від реалізації цих драйверів DRA. Тому стан пристрою, про який повідомляється, не завжди може відображати зміни стану пристрою в реальному часі.

Якщо цю функцію вимкнено, це поле автоматично очищується при збереженні ResourceClaim.

Статус пристрою в ResourceClaim підтримується, коли з драйвера DRA можна оновити існуючий ResourceClaim, в якому встановлено поле `status.devices`.

## Увімкнення динамічного виділення ресурсів {#enabling-dynamic-resource-allocation}

Динамічне виділення ресурсів є _бета-функцією_, яка стандартно вимкнена, та увімкнена коли увімкнуто [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DynamicResourceAllocation` та {{< glossary_tooltip text="групу API" term_id="api-group" >}} `resource.k8s.io/v1beta1`. Для отримання деталей щодо цього дивіться параметри [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) `--feature-gates` та `--runtime-config`. Також варто увімкнути цю функцію в kube-scheduler, kube-controller-manager та kubelet.

Коли драйвер ресурсу повідомляє про стан пристроїв, то слід увімкнути функцію `DRAResourceClaimDeviceStatus` на додаток до `DynamicResourceAllocation`.

Швидка перевірка того, чи підтримує кластер Kubernetes цю функцію, полягає у виведенні обʼєктів DeviceClass за допомогою наступної команди:

```shell
kubectl get deviceclasses
```

Якщо ваш кластер підтримує динамічне виділення ресурсів, відповідь буде або список обʼєктів DeviceClass, або:

```none
No resources found
```

Якщо це не підтримується, буде виведено помилку:

```none
error: the server doesn't have a resource type "deviceclasses"
```

Типова конфігурація kube-scheduler вмикає втулок "DynamicResources" лише в разі увімкнення функціональної можливості та при використанні конфігурації API v1. Налаштування конфігурації може змінюватися, щоб включити його.

Крім увімкнення функції в кластері, також потрібно встановити драйвер ресурсів. Для отримання додаткової інформації звертайтеся до документації драйвера.

### Увімкнення адміністративного доступу {#enabling-admin-access}

[Адміністративний доступ](#admin-access) є _альфа-функцією_ і вмикається лише тоді, коли у kube-apiserver та kube-планувальнику увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRAAdminAccess`.

### Увімкнення Device Status {#enabling-device-status}

[ResourceClaim Device Status](#resourceclaim-device-status) є _альфа-функцією_ і вмикається лише тоді, коли [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRAResourceClaimDeviceStatus` увімкнено у kube-apiserver.

## {{% heading "whatsnext" %}}

- Для отримання додаткової інформації про дизайн дивіться KEP: [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters).
