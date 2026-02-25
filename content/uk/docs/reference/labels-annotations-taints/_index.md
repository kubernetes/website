---
title: Відомі мітки, анотації та позначення
content_type: concept
weight: 40
no_list: true
card:
  name: reference
  weight: 30
  anchors:
    - anchor: "#labels-annotations-and-taints-used-on-api-objects"
      title: Мітки, анотації та позначення
---

<!-- overview -->

Kubernetes зберігає всі мітки, анотації та taint в просторах імен `kubernetes.io` і `k8s.io`.

Цей документ одночасно є і довідником, і точкою для призначення значень.

<!-- body -->

## Мітки, анотації та позначення, використані в обʼєктах API {#labels-annotations-and-taints-used-on-api-objects}

### apf.kubernetes.io/autoupdate-spec

Тип: Annotation

Приклад: `apf.kubernetes.io/autoupdate-spec: "true"`

Використовується для: [Обʼєктів `FlowSchema` та `PriorityLevelConfiguration`](/docs/concepts/cluster-administration/flow-control/#defaults)

Якщо ця анотація встановлена в значення true для FlowSchema або PriorityLevelConfiguration, то `spec` для цього обʼєкта управляється kube-apiserver. Якщо сервер API не розпізнає обʼєкт APF, а ви анотуєте його для автоматичного оновлення, сервер API видаляє весь обʼєкт. У іншому випадку сервер API не управляє специфікацією обʼєкта. Докладніше читайте [Обслуговування обовʼязкових та рекомендованих обʼєктів конфігурації](/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects).

### app.kubernetes.io/component

Тип: Label

Приклад: `app.kubernetes.io/component: "database"`

Використовується для: Всі обʼєкти (зазвичай використовується на [ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Компонент в архітектурі застосунку.

Одна з [рекомендованих міток](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/created-by (deprecated)

Тип: Label

Приклад: `app.kubernetes.io/created-by: "controller-manager"`

Використовується для: Всі обʼєкти (зазвичай використовується на [ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Контролер/користувач, який створив цей ресурс.

{{< note >}}
Починаючи з v1.9, ця мітка є застарілою.
{{< /note >}}

### app.kubernetes.io/instance

Тип: Label

Приклад: `app.kubernetes.io/instance: "mysql-abcxyz"`

Використовується для: Всі обʼєкти (зазвичай використовується на
[ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Унікальне імʼя, що ідентифікує екземпляр застосунку. Для призначення неунікального імені використовуйте [app.kubernetes.io/name](#app-kubernetes-io-name).

Одна з [рекомендованих міток](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/managed-by

Тип: Label

Приклад: `app.kubernetes.io/managed-by: "helm"`

Використовується для: Всі обʼєкти (зазвичай використовується на [ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Інструмент, що використовується для управління роботою застосунку.

Одна з [рекомендованих міток](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/name

Тип: Label

Приклад: `app.kubernetes.io/name: "mysql"`

Використовується для: Всі обʼєкти (зазвичай використовується на [ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Назва застосунку.

Одна з [рекомендованих міток](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/part-of

Тип: Label

Приклад: `app.kubernetes.io/part-of: "wordpress"`

Використовується для: Всі обʼєкти (зазвичай використовується на [ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Назва застосунку вищого рівня, частиною якого є цей обʼєкт.

Одна з [рекомендованих міток](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/version

Тип: Label

Приклад: `app.kubernetes.io/version: "5.7.21"`

Використовується для: Всі обʼєкти (зазвичай використовується на [ресурсах робочого навантаження](/docs/reference/kubernetes-api/workload-resources/)).

Поточна версія застосунку.

Загальні форми значень включають:

- [семантична версія](https://semver.org/spec/v1.0.0.html)
- [хеш ревізії Git](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions) для вихідного коду.

Одна з [рекомендованих міток](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### applyset.kubernetes.io/additional-namespaces (alpha) {#applyset-kubernetes-io-additional-namespaces}

Тип: Annotation

Приклад: `applyset.kubernetes.io/additional-namespaces: "namespace1,namespace2"`

Використовується для: Обʼєкти, які використовуються як батьки ApplySet.

Використання цієї анотації є альфа-версією. Для Kubernetes версії {{< skew currentVersion >}} ви можете використовувати цю анотацію на Secrets, ConfigMaps або власних ресурсах, якщо {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, що їх визначає, має мітку `applyset.kubernetes.io/is-parent-type`.

Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ця анотація застосовується до батьківського обʼєкта, який використовується для відстеження ApplySet для розширення області застосування ApplySet поза власним простором імен батьківського обʼєкта (якщо є). Значення — це розділені комами імена просторів імен, в яких знаходяться обʼєкти, відмінні від простору імен батьківського обʼєкта.

### applyset.kubernetes.io/contains-group-kinds (alpha) {#applyset-kubernetes-io-contains-group-kinds}

Тип: Annotation

Приклад: `applyset.kubernetes.io/contains-group-kinds: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Використовується для: Обʼєкти, які використовуються як батьки ApplySet.

Використання цієї анотації є альфа-версією. Для Kubernetes версії {{< skew currentVersion >}} ви можете використовувати цю анотацію на Secrets, ConfigMaps або власних ресурсах, якщо {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, що їх визначає, має мітку `applyset.kubernetes.io/is-parent-type`.

Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ця анотація застосовується до батьківського об’єкта, який використовується для відстеження ApplySet для оптимізації списку об’єктів-членів ApplySet. Не є обовʼязковою у специфікації ApplySet, оскільки інструменти можуть виконувати виявлення або використовувати іншу оптимізацію. Однак, починаючи з версії Kubernetes {{< skew currentVersion >}}, kubectl вимагає її наявності. Якщо присутнє, значення цієї анотації має бути розділеним комами списком типів груп у форматі повної назви, тобто. `<resource>.<group>`.

### applyset.kubernetes.io/contains-group-resources (deprecated) {#applyset-kubernetes-io-contains-group-resources}

Тип: Annotation

Приклад: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Використовується для: Обʼєкти, які використовуються як батьки ApplySet.

Для Kubernetes версії {{< skew currentVersion >}} ви можете використовувати цю анотацію на Secrets, ConfigMaps або власних ресурсах, якщо {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, що їх визначає, має мітку `applyset.kubernetes.io/is-parent-type`.

Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ця анотація застосовується до батьківського об’єкта, який використовується для відстеження ApplySet для оптимізації списку об’єктів-членів ApplySet. Не є обовʼязковою у специфікації ApplySet, оскільки інструменти можуть виконувати виявлення або використовувати іншу оптимізацію. Однак, починаючи з версії Kubernetes {{< skew currentVersion >}}, kubectl вимагає її наявності. Якщо присутнє, значення цієї анотації має бути розділеним комами списком типів груп у форматі повної назви, тобто. `<resource>.<group>`.

{{< note >}}
Ця анотація наразі застаріла і замінена на [`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds), її підтримку буде вилучено у бета-версії applyset або GA.
{{< /note >}}

### applyset.kubernetes.io/id (alpha) {#applyset-kubernetes-io-id}

Тип: Label

Приклад: `applyset.kubernetes.io/id: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

Використовується для: Обʼєкти, які використовуються як батьки ApplySet.

Використання цієї мітки є альфа-версією. Для Kubernetes версії {{< skew currentVersion >}} ви можете використовувати цю мітку на Secrets, ConfigMaps або власних ресурсах, якщо {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, що їх визначає, має мітку `applyset.kubernetes.io/is-parent-type`.

Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ця мітка робить об’єкт батьківським об’єктом ApplySet. Його значенням є унікальний ідентифікатор ApplySet, який походить від ідентифікатора самого батьківського об’єкта. Цей ідентифікатор **повинен** бути кодуванням base64 (з використанням безпечного для URL кодування RFC4648) хешу group-kind-name-namespace обʼєкта, на якому він знаходиться, у вигляді: `<base64(sha256(<name>.<namespace>.<kind>.<group>))>`. Між значенням цієї мітки та UID обʼєкта немає звʼязку.

### applyset.kubernetes.io/is-parent-type (alpha) {#applyset-kubernetes-io-is-parent-type}

Тип: Label

Приклад: `applyset.kubernetes.io/is-parent-type: "true"`

Використовується для: Custom Resource Definition (CRD)

Використання цієї мітки є альфа-версією. Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ви можете встановити цю мітку на CustomResourceDefinition (CRD), щоб ідентифікувати тип власного ресурсу, який він визначає (а не сам CRD) як дозволеного батька для ApplySet. Єдиним допустимим значенням для цієї мітки є `"true"`; якщо ви хочете позначити CRD як такий, що не є дійсним батьком для ApplySets, пропустіть цю мітку.

### applyset.kubernetes.io/part-of (alpha) {#applyset-kubernetes-io-part-of}

Тип: Label

Приклад: `applyset.kubernetes.io/part-of: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

Використовується для: Всі обʼєкти.

Використання цієї мітки є альфа-версією. Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ця мітка робить обʼєкт членом ApplySet. Значення мітки **повинно** збігатися зі значенням мітки `applyset.kubernetes.io/id` у батьківському обʼєкті.

### applyset.kubernetes.io/tooling (alpha) {#applyset-kubernetes-io-tooling}

Тип: Annotation

Приклад: `applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

Використовується для: Обʼєкти, які використовуються як батьки ApplySet.

Використання цієї анотації є альфа-версією. Для Kubernetes версії {{< skew currentVersion >}} ви можете використовувати цю анотацію на Secrets, ConfigMaps або власних ресурсах, якщо {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, що їх визначає, має мітку `applyset.kubernetes.io/is-parent-type`.

Частина специфікації, яка використовується для реалізації [обрізки на основі ApplySet в kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). Ця анотація застосовується до батьківського обʼєкта, який використовується для відстеження ApplySet, щоб вказати, який інструментарій керує цим ApplySet. Інструментарій повинен відмовлятися змінювати ApplySets, що належать іншим інструментам. Значення має бути у форматі `<toolname>/<semver>`.

### apps.kubernetes.io/pod-index (beta) {#apps-kubernetes.io-pod-index}

Тип: Label

Приклад: `apps.kubernetes.io/pod-index: "0"`

Використовується для: Pod

Коли контролер StatefulSet створює Pod для StatefulSet, він встановлює цю мітку на Pod. Значення мітки є порядковим індексом створюваного Podʼа.

Дивіться [Мітка індексу Podʼа](/docs/concepts/workloads/controllers/statefulset/#pod-index-label) в темі StatefulSet для отримання більш детальної інформації. Зверніть увагу на [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/), має бути увімкнено, щоб цю мітку можна було додати до Podʼів.

### resource.kubernetes.io/pod-claim-name

Тип: Annotation

Приклад: `resource.kubernetes.io/pod-claim-name: "my-pod-claim"`

Використовується для: ResourceClaim

Ця анотація додається до створених вимог на ресурси. Її значення відповідає назві вимоги ресурсу у файлі `.spec` будь-якого Podʼа(ів), для якого було створено ResourceClaim. Ця анотація є внутрішньою деталлю реалізації [динамічного розподілу ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/). Вам не потрібно читати або змінювати значення цієї анотації.

### cluster-autoscaler.kubernetes.io/safe-to-evict

Тип: Annotation

Приклад: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

Використовується для: Pod

Коли ця анотація має значення `"true"`, автомасштабувальнику кластера дозволяється виселяти Pod навіть якщо інші правила зазвичай забороняють це робити. Автомасштабувальник кластера ніколи не виселяє Podʼи, для яких ця анотація явно встановлена у значення `"false"`; ви можете встановити це значення для важливого Podʼа, який ви хочете продовжувати виконувати. Якщо цю анотацію не задано, то автомасштабувальник кластера поводитиметься так, як він поводиться на рівні Podʼа.

### config.kubernetes.io/local-config

Тип: Annotation

Приклад: `config.kubernetes.io/local-config: "true"`

Використовується для: Всі обʼєкти

Ця анотація використовується у маніфестах для позначення обʼєкта як локальної конфігурації, яку не слід передавати до API Kubernetes.

Значення `"true"` для цієї анотації вказує, що обʼєкт використовується лише клієнтськими інструментами і не повинен бути надісланий на сервер API.

Значення `"false"` може бути використане для вказівки, що обʼєкт повинен бути надісланий на сервер API, навіть якщо в іншому випадку він вважався б локальним.

Ця анотація є частиною специфікації функцій Kubernetes Resource Model (KRM), яка використовується Kustomize та подібними сторонніми інструментами. Наприклад, Kustomize видаляє обʼєкти з цією анотацією з кінцевого результату збирання коду.

### container.apparmor.security.beta.kubernetes.io/\* (beta) {#container-apparmor-security-beta-kubernetes-io}

Тип: Annotation

Приклад: `container.apparmor.security.beta.kubernetes.io/my-container: my-custom-profile`

Використовується для: Pods

Ця анотація дозволяє вам вказати профіль безпеки AppArmor для контейнера в межах Podʼа Kubernetes. Починаючи з версії Kubernetes 1.30, це слід налаштовувати за допомогою поля `appArmorProfile`. Щоб дізнатися більше, перегляньте [підручник з AppArmor](/docs/tutorials/security/apparmor/). У підручнику показано, як використовувати AppArmor для обмеження можливостей і доступу контейнера.

Вказаний профіль визначає набір правил і обмежень, яких повинен дотримуватися процес у контейнері. Це допомагає забезпечити дотримання політик безпеки та ізоляцію ваших контейнерів.

### deployment.kubernetes.io/desired-replicas

Тип: Annotation

Приклад: `deployment.kubernetes.io/desired-replicas: "3"`

Використовується для: ReplicaSet

Ця анотація встановлюється контролером Deployment на ReplicaSets, якими він керує. Значення представляє бажану кількість реплік (`.spec.replicas`) з Deployment, якому належить цей ReplicaSet. Контролер Deployment використовує цю анотацію для відстеження бажаного стану під час послідовних оновлень та операцій масштабування.

Це внутрішня анотація, яка використовується контролером Deployment і не повинна змінюватися вручну.

### deployment.kubernetes.io/max-replicas

Тип: Annotation

Приклад: `deployment.kubernetes.io/max-replicas: "5"`

Використовується для: ReplicaSet

Ця анотація встановлюється контролером Deployment на ReplicaSets, якими він керує. Значення представляє максимальну кількість реплік, яку цей ReplicaSet може мати під час оновлення. Це використовується для реалізації параметра `maxSurge` стратегії оновлення Rolling Update Deployment, який контролює, скільки додаткових Podʼів можна створити над бажаною кількістю під час оновлення.

Це внутрішня анотація, яка використовується контролером Deployment і не повинна змінюватися вручну.

### deployment.kubernetes.io/revision

Тип: Annotation

Приклад: `deployment.kubernetes.io/revision: "2"`

Використовується для: ReplicaSet

Ця анотація встановлюється контролером Deployment на ReplicaSets, якими він керує. Значення представляє номер ревізії Deployment. Кожного разу, коли шаблон Podʼа (`.spec.template`) в Deployment змінюється, номер ревізії збільшується. Ця анотація використовується для відстеження історії розгортання та дозволяє повернутися до попередніх ревізій за допомогою `kubectl rollout undo`.

Номер ревізії також видно при запуску `kubectl rollout history deployment/<name>`.

Це внутрішня анотація, яка використовується контролером Deployment і не повинна змінюватися вручну.

### internal.config.kubernetes.io/\* (reserved prefix) {#internal.config.kubernetes.io-reserved-wildcard}

Тип: Annotation

Використовується для: Всі обʼєкти

Цей префікс зарезервований для внутрішнього використання інструментами, які діють як оркестратори відповідно до специфікації функцій Моделі Ресурсів Kubernetes (KRM). Анотації з цим префіксом є внутрішніми для процесу оркестрування та не зберігаються в маніфестах у файловій системі. Іншими словами, інструмент-оркестратор повинен встановлювати ці анотації при зчитуванні файлів з локальної файлової системи та видаляти їх при записі результатів роботи функцій назад у файлову систему.

Функція KRM **не повинна** змінювати анотації з цим префіксом, якщо не зазначено інше для конкретної анотації. Це дозволяє інструментам оркестрування додавати додаткові внутрішні анотації без необхідності вносити зміни в існуючі функції.

### internal.config.kubernetes.io/path

Тип: Annotation

Приклад: `internal.config.kubernetes.io/path: "relative/file/path.yaml"`

Використовується для: Всі обʼєкти

Ця анотація записує шлях до файлу маніфесту, з якого було завантажено обʼєкт, у вигляді розділеного слешами, незалежного від ОС, відносного шляху. Шлях є відносним до фіксованого розташування у файловій системі, визначеного інструментом-оркестратором.

Ця анотація є частиною специфікації функцій Моделі Ресурсів Kubernetes (KRM), яка використовується Kustomize та подібними сторонніми інструментами.

Функція KRM **не повинна** змінювати цю анотацію у вхідних обʼєктах, якщо вона не змінює файли, на які посилається. Функція KRM **може** включати цю анотацію у обʼєкти, які вона генерує.

### internal.config.kubernetes.io/index

Тип: Annotation

Приклад: `internal.config.kubernetes.io/index: "2"`

Використовується для: Всі обʼєкти

Ця анотація записує позицію (нумерація з нуля) YAML-документа, який містить обʼєкт, у файлі маніфесту, з якого було завантажено обʼєкт. Зазначимо, що YAML-документи розділяються трьома тире (`---`) і кожен може містити один обʼєкт. Якщо ця анотація не вказана, мається на увазі значення 0.

Ця анотація є частиною специфікації функцій Моделі Ресурсів Kubernetes (KRM), яка використовується Kustomize та подібними сторонніми інструментами.

Функція KRM **не повинна** змінювати цю анотацію у вхідних обʼєктах, якщо вона не змінює файли, на які посилається. Функція KRM **може** включати цю анотацію в обʼєкти, які вона генерує.

### kube-scheduler-simulator.sigs.k8s.io/bind-result

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'`

Використовується для: Pod

Ця анотація записує результат bind втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/filter-result

Тип: Annotation

Приклад:

```yaml
kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {"node-282x7":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"},"node-gp9t4":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"}}
```

Використовується для: Pod

Ця анотація записує результат роботи втулків фільтрів планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/finalscore-result

Тип: Annotation

Приклад:

```yaml
kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"}}
```

Використовується для: Pod

Ця анотація записує остаточні бали, які планувальник обчислює з балів, отриманих від втулків планувальника для розрахунку балів, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/permit-result

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/permit-result: '{"CustomPermitPlugin":"success"}'`

Використовується для: Pod

Ця анотація записує результат роботи втулків дозволів планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{"CustomPermitPlugin":"10s"}'`

Використовується для: Pod

Ця анотація записує таймаути, що повертаються втулками дозволів планувальника, які використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/postfilter-result

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{"DefaultPreemption":"success"}'`

Використовується для: Pod

Ця анотація записує результат роботи втулків постфільтрів планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/prebind-result

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'`

Використовується для: Pod

Ця анотація записує результат prebind роботи втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/prefilter-result

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"NodeAffinity":"[\"node-\a"]"}'`

Використовується для: Pod

Ця анотація записує результат PreFilter роботи втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status

Тип: Annotation

Приклад:

```yaml
kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodePorts":"success","NodeResourcesFit":"success","PodTopologySpread":"success","VolumeBinding":"success","VolumeRestrictions":"success"}
```

Використовується для: Pod

Ця анотація записує результат prefilter роботи втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/prescore-result

Тип: Annotation

Приклад:

```yaml
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodeNumber":"success","PodTopologySpread":"success","TaintToleration":"success"}
```

Використовується для: Pod

Ця анотація записує результат prefilter роботи втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/reserve-result

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'`

Використовується для: Pod

Ця анотація записує результат reserve роботи втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/result-history

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/result-history: '[]'`

Використовується для: Pod

У цій анотації записано всі минулі результати планування за допомогою втулків планувальника, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/score-result

Тип: Annotation

```yaml
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"}}
```

Використовується для: Pod

Ця анотація записує результат роботи втулків планувальника оцінок, що використовуються https://sigs.k8s.io/kube-scheduler-simulator.

### kube-scheduler-simulator.sigs.k8s.io/selected-node

Тип: Annotation

Приклад: `kube-scheduler-simulator.sigs.k8s.io/selected-node: node-282x7`

Використовується для: Pod

Ця анотація записує вузол, який обрано циклом планування, що використовується https://sigs.k8s.io/kube-scheduler-simulator.

### kubernetes.io/arch

Тип: Label

Приклад: `kubernetes.io/arch: "amd64"`

Використовується для: Node

Kubelet заповнює це значення за допомогою `runtime.GOARCH`, як визначено в Go. Це може бути корисним, якщо ви використовуєте змішані вузли ARM і x86.

### kubernetes.io/os

Тип: Label

Приклад: `kubernetes.io/os: "linux"`

Використовується для: Node, Pod

Для вузлів Kubelet заповнює це значення за допомогою `runtime.GOOS`, як визначено в Go. Це може бути корисним, якщо у вашому кластері використовуються різні операційні системи (наприклад, змішані вузли Linux і Windows).

Ви також можете встановити цю мітку на Pod. Kubernetes дозволяє встановлювати будь-яке значення для цієї мітки; якщо ви використовуєте цю мітку, ви все ж повинні встановити її на рядок Go `runtime.GOOS` для операційної системи, з якою працює цей Pod.

Якщо значення мітки `kubernetes.io/os` для Pod не відповідає значенню мітки на вузлі, Kubelet на цьому вузлі не прийме Pod. Проте це не враховується планувальником kube-scheduler. Крім того, Kubelet відмовляється запускати Pod, якщо ви вказали операційну систему Pod, яка не відповідає операційній системі вузла, на якому працює цей Kubelet. Більше деталей можна знайти в розділі [Операційна система Podʼа](/docs/concepts/workloads/pods/#pod-os).

### kubernetes.io/metadata.name

Тип: Label

Приклад: `kubernetes.io/metadata.name: "mynamespace"`

Використовується для: Namespaces

API-сервер Kubernetes (частина {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}}) встановлює цю мітку на всі простори імен. Значення мітки встановлюється на імʼя простору імен. Ви не можете змінити значення цієї мітки.

Це корисно, якщо ви хочете вказати конкретний простір імен за допомогою селектора міток {{< glossary_tooltip text="selector" term_id="selector" >}}.

### kubernetes.io/limit-ranger

Тип: Annotation

Приклад: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

Використовується для: Pod

Стандартно Kubernetes не надає жодних обмежень на ресурси, тобто, якщо ви явно не визначите обмеження, ваш контейнер може споживати необмежену кількість CPU та памʼяті. Ви можете визначити стандартний запит або обмеження для Podʼів. Це робиться шляхом створення LimitRange у відповідному просторі імен. Podʼи, розгорнуті після визначення LimitRange, матимуть ці обмеження, застосовані до них. Анотація `kubernetes.io/limit-ranger` фіксує, що стандартні ресурси були вказані для Pod і були успішно застосовані. Для детальнішої інформації читайте про [LimitRanges](/docs/concepts/policy/limit-range).

### kubernetes.io/config.hash

Тип: Annotation

Приклад: `kubernetes.io/config.hash: "df7cc47f8477b6b1226d7d23a904867b"`

Використовується для: Pod

Коли kubelet створює статичний Pod на основі заданого маніфесту, він додає цю анотацію до статичного Pod. Значення анотації — це UID Pod. Зверніть увагу, що kubelet також встановлює `.spec.nodeName` у поточне імʼя вузла, ніби Pod було заплановано на цей вузол.

### kubernetes.io/config.mirror

Тип: Annotation

Приклад: `kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

Використовується для: Pod

Для статичного Pod, створеного kubelet на вузлі, на API-сервері створюється {{< glossary_tooltip text="дзеркальний Pod" term_id="mirror-pod" >}}. Kubelet додає анотацію, щоб позначити, що цей Pod фактично є дзеркальним Podʼом. Значення анотації копіюється з анотації [`kubernetes.io/config.hash`](#kubernetes-io-config-hash), яка є UID Pod.

При оновленні Pod з цією встановленою анотацією анотацію не можна змінити або видалити. Якщо у Podʼа немає цієї анотації, її не можна додати під час оновлення Pod.

### kubernetes.io/config.source

Тип: Annotation

Приклад: `kubernetes.io/config.source: "file"`

Використовується для: Pod

Ця анотація додається kubelet, щоб вказати звідки походить Pod. Для статичних Pod значення анотації може бути одним із `file` або `http`, залежно від того, де розташований маніфест Podʼа. Для Podʼа, створеного на API-сервері, а потім запланованого на поточний вузол, значення анотації — `api`.

### kubernetes.io/config.seen

Тип: Annotation

Приклад: `kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

Використовується для: Pod

Коли kubelet вперше бачить Pod, він може додати цю анотацію до Pod зі значенням поточного часу у форматі RFC3339.

### addonmanager.kubernetes.io/mode

Тип: Label

Приклад: `addonmanager.kubernetes.io/mode: "Reconcile"`

Використовується для: Всі обʼєкти

Для вказання того, як слід керувати надбудовою, ви можете використовувати мітку `addonmanager.kubernetes.io/mode`. Ця мітка може мати одне з трьох значень: `Reconcile`, `EnsureExists` або `Ignore`.

- `Reconcile`: Ресурси надбудови періодично будуть зведені до очікуваного стану. Якщо є будь-які відмінності, менеджер надбудов буде переробляти, змінювати конфігурацію або видаляти ресурси за потреби. Цей режим є стандартним режимом, якщо мітка не вказана.
- `EnsureExists`: Ресурси надбудов будуть перевірятися лише на наявність, але не будуть змінюватися після створення. Менеджер надбудов створить або переробить ресурси, коли відсутній жоден екземпляр ресурсу з таким імʼям.
- `Ignore`: Ресурси надбудов будуть ігноруватися. Цей режим корисний для надбудов, які не сумісні з менеджером надбудов або керуються іншим контролером.

Для отримання докладнішої інформації див. [Addon-manager](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md).

### beta.kubernetes.io/arch (deprecated)

Тип: Label

Ця мітка є застарілою. Використовуйте натомість [`kubernetes.io/arch`](#kubernetes-io-arch).

### beta.kubernetes.io/os (deprecated)

Тип: Label

Ця мітка є застарілою. Використовуйте натомість [`kubernetes.io/os`](#kubernetes-io-os).

### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

Тип: Label

Приклад: `kube-aggregator.kubernetes.io/automanaged: "onstart"`

Використовується для: APIService

`kube-apiserver` встановлює цю мітку для будь-якого обʼєкта APIService, який сервер API створив автоматично. Мітка позначає, як панель управління повинна керувати цим APIService. Ви не повинні додавати, змінювати або видаляти цю мітку самостійно.

{{< note >}}
Обʼєкти APIService, що автоматично керуються, видаляються kube-apiserver, коли він не має вбудованого або власного API ресурсу користувача, який відповідає API-групі/версії APIService.
{{< /note >}}

Є два можливих значення:

- `onstart`: APIService повинен бути зведений до очікуваного стану при старті сервера API, але не під час інших операцій.
- `true`: Сервер API повинен безперервно зводити цей APIService до очікуваного стану.

### service.alpha.kubernetes.io/tolerate-unready-endpoints (deprecated)

Тип: Annotation

Використовується для: Service

Ця анотація раніше використовувалася для вказівки, що контролер Endpoints повинен створювати точки доступу для не готових Podʼів. Починаючи з Kubernetes 1.11, кращим API для цієї функції є поле `.publishNotReadyAddresses` в {{< glossary_tooltip term_id="service" >}}. Ця анотація не має впливу в Kubernetes {{< skew currentVersion >}}.

### autoscaling.alpha.kubernetes.io/behavior (deprecated) {#autoscaling-alpha-kubernetes-io-behavior}

Тип: Annotation

Використовується для: HorizontalPodAutoscaler

Ця анотація використовувалася для налаштування поведінки масштабування для HorizontalPodAutoscaler (HPA) у попередніх версіях Kubernetes. Вона дозволяла вказати, як HPA має масштабувати Podʼи вгору або вниз, включаючи встановлення вікон стабілізації та політик масштабування. Встановлення цієї анотації не має жодного ефекту в будь-якому підтримуваному випуску Kubernetes.

### kubernetes.io/hostname {#kubernetesiohostname}

Тип: Label

Приклад: `kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

Використовується для: Node

Kubelet заповнює цю мітку імʼям хоста вузла. Зверніть увагу, що імʼя хоста може бути змінене з "фактичного" імʼя хоста за допомогою прапорця `--hostname-override` для `kubelet`.

Ця мітка також використовується як частина ієрархії топології. Дивіться [topology.kubernetes.io/zone](#topologykubernetesiozone) для отримання додаткової інформації.

### kubernetes.io/change-cause {#change-cause}

Тип: Annotation

Приклад: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

Використовується для: Всіх обʼєктів

Ця анотація є найкращою спробою пояснення причини зміни чого-небудь.

Вона заповнюється при додаванні параметру `--record` до команди `kubectl`, яка може змінити обʼєкт.

### kubernetes.io/description {#description}

Тип: Annotation

Приклад: `kubernetes.io/description: "Description of K8s object."`

Використовується для: Всіх обʼєктів

Ця анотація використовується для опису конкретної поведінки вказаного обʼєкта.

### kubernetes.io/enforce-mountable-secrets (deprecated){#enforce-mountable-secrets}

Тип: Annotation

Приклад: `kubernetes.io/enforce-mountable-secrets: "true"`

Використовується для: ServiceAccount

{{< note >}}
`kubernetes.io/enforce-mountable-secrets` є застарілим, починаючи з Kubernetes v1.32. Використовуйте окремі простори імен для ізоляції доступу до змонтованих секретів.
{{< /note >}}

Значення цієї анотації повинно бути **true**, щоб вона набула чинності. Коли ви встановлюєте цю анотацію у значення "true", Kubernetes застосовує наступні правила для Podʼів, що працюють з цим ServiceAccount:

1. Secretʼи, змонтовані як томи, повинні бути перелічені в полі `secrets` ServiceAccount.
2. Secretʼи, на які посилаються у полі `envFrom` для контейнерів (включаючи контейнери sidecar і контейнери ініціалізації), також повинні бути перелічені в полі `secrets` ServiceAccount. Якщо будь-який контейнер в Podʼі посилається на Secret, який не перелічений в полі `secrets` ServiceAccount (навіть якщо посилання позначене як `optional`), то Pod не запуститься, і буде згенеровано помилку, що вказує на невідповідне посилання на секрет.
3. Secretʼи, на які посилається у полі `imagePullSecrets` Podʼа, повинні бути присутніми в полі `imagePullSecrets` ServiceAccount, Pod не запуститься, і буде згенеровано помилку, що вказує на невідповідне посилання на секрет для отримання образу.

Під час створення або оновлення Podʼа перевіряються ці правила. Якщо Pod не відповідає їм, він не запуститься, і ви побачите повідомлення про помилку. Якщо Pod уже працює, і ви змінюєте анотацію `kubernetes.io/enforce-mountable-secrets` на значення true, або ви редагуєте повʼязаний ServiceAccount для видалення посилання на Secret, який вже використовується Podʼом, Pod продовжить працювати.

### node.alpha.kubernetes.io/ttl (deprecated)

Тип: Label

Приклад: `node.alpha.kubernetes.io/ttl: "0"`

Використовується для: Node

Ця мітка історично використовувалася деякими інструментами (такими як minikube) для встановлення значення часу існування вузлів. Мітка є застарілою і не повинна використовуватися в нових розгортаннях.

{{< note >}}
Ця мітка є застарілою і не має впливу в поточних версіях Kubernetes. Вона все ще може бути встановлена старими інструментами для забезпечення зворотної сумісності.
{{< /note >}}

### node.kubernetes.io/exclude-from-external-load-balancers

Тип: Label

Приклад: `node.kubernetes.io/exclude-from-external-load-balancers`

Використовується для: Node

Ви можете додати мітки до певних робочих вузлів, щоб виключити їх зі списку серверів бекенда, які використовуються зовнішніми балансувальниками навантаження. Наступна команда може бути використана для виключення робочого вузла зі списку серверів бекенда у наборі серверів бекенда:

```shell
kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true
```

### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Тип: Annotation

Приклад: `controller.kubernetes.io/pod-deletion-cost: "10"`

Використовується для: Pod

Ця анотація використовується для встановлення [Вартості видалення Podʼа](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost), що дозволяє користувачам впливати на порядок зменшення масштабування ReplicaSet. Значення анотації аналізується як тип `int32`.

### cluster-autoscaler.kubernetes.io/enable-ds-eviction

Тип: Annotation

Приклад: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

Використовується для: Pod

Ця анотація контролює, чи повинен бути виселений Pod DaemonSet за допомогою ClusterAutoscaler. Ця анотація повинна бути вказана на Pod DaemonSet у маніфесті DaemonSet. Коли ця анотація встановлена в значення `"true"`, ClusterAutoscaler дозволяє виселити Pod DaemonSet, навіть якщо інші правила зазвичай цього уникнули б. Щоб заборонити ClusterAutoscaler виселяти Pod DaemonSet, ви можете встановити цю анотацію в значення `"false"` для важливих Pod DaemonSet. Якщо ця анотація не встановлена, тоді ClusterAutoscaler діє згідно своєї загальної поведінки (тобто виселяє Pod DaemonSets на основі своєї конфігурації).

{{< note >}}
Ця анотація впливає тільки на Podʼи DaemonSet.
{{< /note >}}

### kubernetes.io/ingress-bandwidth

Тип: Annotation

Приклад: `kubernetes.io/ingress-bandwidth: 10M`

Використовується для: Pod

Ви можете застосувати обмеження пропускної здатності відповідно для якості обслуговування до Pod щоб ефективно обмежити його доступну пропускну здатність. Вхідний трафік до Podʼа обробляється за допомогою упорядкованої черги пакетів для ефективного керування даними. Щоб обмежити пропускну здатність Podʼа, напишіть файл визначення обʼєкта JSON і вкажіть швидкість передачі даних за допомогою анотації `kubernetes.io/ingress-bandwidth`. Одиницею, яка використовується для вказівки швидкості вхідної передачі, є біти на секунду, в форматі [Кількості](/docs/reference/kubernetes-api/common-definitions/quantity/). Наприклад, `10M` означає 10 мегабіт на секунду.

{{< note >}}
Анотація формування трафіку вхідного напрямку є експериментальною функцією. Якщо ви хочете ввести підтримку формування трафіку, вам слід додати втулок `bandwidth` до конфігураційного файлу CNI (стандартно `/etc/cni/net.d`) і переконатися, що відповідний виконавчий файл включений у теку CNI bin (стандартно `/opt/cni/bin`).
{{< /note >}}

### kubernetes.io/egress-bandwidth

Тип: Annotation

Приклад: `kubernetes.io/egress-bandwidth: 10M`

Використовується для: Pod

Вихідний трафік з Podʼа обробляється за допомогою застосування політик, які просто відкидають пакети, що перевищують налаштовану швидкість. Обмеження, які ви встановлюєте на Pod, не впливають на пропускну здатність інших Podʼів. Щоб обмежити пропускну здатність Podʼа, напишіть файл визначення обʼєкта JSON і вкажіть швидкість передачі даних за допомогою анотації `kubernetes.io/egress-bandwidth`. Одиницею, яка використовується для вказівки швидкості вихідної передачі, є біти на секунду, в форматі [Кількості](/docs/reference/kubernetes-api/common-definitions/quantity/). Наприклад, `10M` означає 10 мегабіт на секунду.

{{< note >}}
Анотація формування трафіку вихідного напрямку є експериментальною функцією. Якщо ви хочете ввести підтримку формування трафіку, вам слід додати втулок `bandwidth` до конфігураційного файлу CNI (стандартно `/etc/cni/net.d`) і переконатися, що відповідний виконавчий файл включений у теку CNI bin (стандартно `/opt/cni/bin`).
{{< /note >}}

### beta.kubernetes.io/instance-type (deprecated)

Тип: Label

{{< note >}}
Починаючи з версії v1.17, ця мітка застаріла на користь [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
{{< /note >}}

### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Тип: Label

Приклад: `node.kubernetes.io/instance-type: "m3.medium"`

Використовується для: Node

Kubelet заповнює це значенням типу екземпляра, як визначено постачальником хмарних послуг. Це буде встановлено лише в разі використання постачальника хмарних послуг. Це налаштування є зручним, якщо ви хочете спрямувати певні робочі навантаження на певні типи екземплярів, але, як правило, ви хочете покладатися на планувальник Kubernetes для виконання планування на основі ресурсів. Ви повинні намагатися планувати на основі властивостей, а не на основі типів екземплярів (наприклад, потребувати GPU, замість потреби в `g2.2xlarge`).

### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

Тип: Label

{{< note >}}
Починаючи з версії v1.17, ця мітка застаріла на користь [topology.kubernetes.io/region](#topologykubernetesioregion).
{{< /note >}}

### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

Тип: Label

{{< note >}}
Починаючи з версії v1.17, ця мітка застаріла на користь [topology.kubernetes.io/zone](#topologykubernetesiozone).
{{< /note >}}

### pv.kubernetes.io/bind-completed {#pv-kubernetesiobind-completed}

Тип: Annotation

Приклад: `pv.kubernetes.io/bind-completed: "yes"`

Використовується для: PersistentVolumeClaim

Коли ця анотація встановлена на PersistentVolumeClaim (PVC), це вказує на те, що життєвий цикл PVC пройшов через початкове налаштування звʼязування. Коли вона присутня, ця інформація змінює те, як панель управління тлумачить стан обʼєктів PVC. Значення цієї анотації не має значення для Kubernetes.

### pv.kubernetes.io/bound-by-controller {#pv-kubernetesioboundby-controller}

Тип: Annotation

Приклад: `pv.kubernetes.io/bound-by-controller: "yes"`

Використовується для: PersistentVolume, PersistentVolumeClaim

Якщо ця анотація встановлена на PersistentVolume або PersistentVolumeClaim, це вказує на те, що звʼязка зберігання (PersistentVolume → PersistentVolumeClaim або PersistentVolumeClaim → PersistentVolume) була встановлена контролером. Якщо анотація не встановлена, а звʼязка зберігання вже існує, відсутність цієї анотації означає, що звʼязка була встановлена вручну. Значення цієї анотації не має значення.

### pv.kubernetes.io/provisioned-by {#pv-kubernetesiodynamically-provisioned}

Тип: Annotation

Приклад: `pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

Використовується для: PersistentVolume

Ця анотація додається до PersistentVolume (PV), який був динамічно розподілений Kubernetes. Її значення — це імʼя втулка тому, який створив том. Вона служить як користувачам (щоб показати, звідки походить PV), так і Kubernetes (щоб визначити динамічно розподілені PV у своїх рішеннях).

### pv.kubernetes.io/migrated-to {#pv-kubernetesio-migratedto}

Тип: Annotation

Приклад: `pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

Використовується для: PersistentVolume, PersistentVolumeClaim

Ця анотація додається до PersistentVolume (PV) та PersistentVolumeClaim (PVC), які мають бути динамічно розподілені або видалені відповідним драйвером CSI через власну функціональну можливість `CSIMigration`. Коли ця анотація встановлена, компоненти Kubernetes "припиняють боротьбу", і `external-provisioner` діятиме з обʼєктами.

### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Тип: Label

Приклад: `statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

Використовується для: Pod

Коли контролер StatefulSet створює Pod для StatefulSet, панель управління встановлює цю мітку на Podʼі. Значення мітки — це імʼя створеного Podʼа.

Дивіться [Мітка імені Podʼа](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) у темі StatefulSet для отримання більш детальної інформації.

### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

Тип: Annotation

Приклад: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

Використовується для: Namespace

[PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector) використовує цей ключ анотації для призначення селекторів вузла до Podʼів у просторах імен.

### topology.kubernetes.io/region {#topologykubernetesioregion}

Тип: Label

Приклад: `topology.kubernetes.io/region: "us-east-1"`

Використовується для: Node, PersistentVolume

Див. [topology.kubernetes.io/zone](#topologykubernetesiozone).

### topology.kubernetes.io/zone {#topologykubernetesiozone}

Тип: Label

Приклад: `topology.kubernetes.io/zone: "us-east-1c"`

Використовується для: Node, PersistentVolume

**На Node**: `kubelet` або зовнішній `cloud-controller-manager` заповнюють мітку інформацією від постачальника хмарних послуг. Мітку буде встановлено лише в разі використання постачальника хмарних послуг. Однак ви можете розглянути можливість встановлення її на вузлах, якщо це має сенс у вашій топології.

**На PersistentVolume**: постачальники томів, що мають відомості про топологію, автоматично встановлюють обмеження на спорідненість вузла для `PersistentVolume`.

Зона представляє собою логічний домен невдачі. Для підвищення доступності звичайно, кластери Kubernetes охоплюють декілька зон. Хоча точне визначення зони залишається на вибір реалізацій інфраструктури, загальні властивості зон включають дуже низьку мережеву затримку всередині зони, відсутність вартості мережевого трафіку всередині зони та незалежність від невдач інших зон. Наприклад, вузли всередині зони можуть використовувати один мережевий комутатор, але вузли в різних зонах цього робити не повинні.

Регіон представляє собою більшу область, що складається з однієї або декількох зон. Кластери Kubernetes, що охоплюють декілька регіонів, є не звичайним явищем. Хоча точне визначення зони або регіону залишається на вибір реалізацій інфраструктури, загальні властивості регіону включають в себе вищу мережеву затримку між ними, ненульову вартість мережевого трафіку між ними та незалежність від невдач інших зон або регіонів. Наприклад, вузли всередині регіону можуть використовувати спільну інфраструктуру живлення (наприклад, джерело безперебійного живлення або генератор), але вузли в різних регіонах зазвичай ні.

Kubernetes робить кілька припущень щодо структури зон та регіонів:

1. регіони та зони є ієрархічними: зони є строгими підмножинами регіонів, і жодна зона не може бути в двох регіонах;
2. імена зон є унікальними у всіх регіонах; наприклад, регіон "africa-east-1" може складатися з зон "africa-east-1a" та "africa-east-1b".

Можна вважати за безпечне припущення, що мітки топології не змінюються. Навіть якщо мітки є строго змінюваними, споживачі можуть припускати, що данний вузол не буде переміщений між зонами без знищення та перестворення.

Kubernetes може використовувати цю інформацію різними способами. Наприклад, планувальник автоматично намагається розподілити Podʼи в ReplicaSet по вузлах в однозонному кластері (щоб зменшити вплив відмови вузла, див. [kubernetes.io/hostname](#kubernetesiohostname)). З кластерами, які охоплюють кілька зон, ця поведінка розподілу також застосовується до зон (для зменшення впливу відмови зони). Це досягається за допомогою _SelectorSpreadPriority_.

*SelectorSpreadPriority* — це найкраще розміщення. Якщо зони у вашому кластері є гетерогенними (наприклад, різна кількість вузлів, різні типи вузлів або різні вимоги до ресурсів Podʼа), це розміщення може завадити рівномірному розподілу ваших Podʼів між зонами. Якщо це потрібно, ви можете використовувати однорідні зони (однакова кількість і типи вузлів), щоб зменшити ймовірність нерівномірного розподілу.

Планувальник (за допомогою предиката _VolumeZonePredicate_) також буде забезпечувати, що Podʼи, які вимагають певного тома, будуть розміщені лише в тій же зоні, що й цей том. Томи не можуть бути підключені в різних зонах.

Якщо `PersistentVolumeLabel` не підтримує автоматичне додавання міток до ваших PersistentVolume, варто розглянути можливість додавання міток вручну (або підтримку `PersistentVolumeLabel`). З `PersistentVolumeLabel` планувальник перешкоджає Podʼам монтувати томи в інших зонах. Якщо ваша інфраструктура не має цього обмеження, вам не потрібно додавати мітки зони до томів взагалі.

### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Тип: Annotation

Приклад: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

Використовується для: PersistentVolumeClaim

Ця анотація застаріла починаючи з v1.23. Дивіться [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner).

### volume.beta.kubernetes.io/storage-class (deprecated)

Тип: Annotation

Приклад: `volume.beta.kubernetes.io/storage-class: "example-class"`

Використовується для: PersistentVolume, PersistentVolumeClaim

Ця анотація може використовуватися для PersistentVolume(PV) або PersistentVolumeClaim(PVC), щоб вказати імʼя [StorageClass](/docs/concepts/storage/storage-classes/). Коли обидва атрибути `storageClassName` та анотація `volume.beta.kubernetes.io/storage-class` вказані, анотація `volume.beta.kubernetes.io/storage-class` має перевагу над атрибутом `storageClassName`.

Ця анотація застаріла. Замість цього встановіть [поле `storageClassName`](/docs/concepts/storage/persistent-volumes/#class) для PersistentVolumeClaim або PersistentVolume.

### volume.beta.kubernetes.io/mount-options (deprecated) {#mount-options}

Тип: Annotation

Example : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

Використовується для: PersistentVolume

Адміністратор Kubernetes може вказати додаткові [опції монтування](/docs/concepts/storage/persistent-volumes/#mount-options) для того, коли PersistentVolume монтується на вузлі.

### volume.kubernetes.io/storage-provisioner {#volume-kubernetes-io-storage-provisioner}

Тип: Annotation

Використовується для: PersistentVolumeClaim

Ця анотація додається до PVC, яка має бути динамічно наданою. Її значення — це імʼя втулка тому, який має надати том для цієї PVC.

### volume.kubernetes.io/selected-node

Тип: Annotation

Використовується для: PersistentVolumeClaim

Ця анотація додається до PVC, яка активується планувальником для динамічного надання. Її значення — це імʼя вибраного вузла.

### volumes.kubernetes.io/controller-managed-attach-detach

Тип: Annotation

Використовується для: Node

Якщо вузол має анотацію `volumes.kubernetes.io/controller-managed-attach-detach`, його операції прикріплення та відʼєднання зберігання керуються {{< glossary_tooltip text="контролером" term_id="controller" >}} _прикріплення/відʼєднання тому_.

Значення анотації не має значення.

### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Тип: Label

Приклад: `node.kubernetes.io/windows-build: "10.0.17763"`

Використовується для: Node

Коли kubelet працює на операційній системі Microsoft Windows, він автоматично позначає міткою свій вузол, щоб зафіксувати версію Windows Server, що використовується.

Значення мітки має формат "MajorVersion.MinorVersion.BuildNumber".

### storage.alpha.kubernetes.io/migrated-plugins {#storagealphakubernetesiomigrated-plugins}

Тип: Annotation

Приклад:`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/cinder"`

Використовується для: CSINode (API розширення)

Цю анотацію буде автоматично додано до обʼєкта CSINode, який зіставляється з вузлом, на якому встановлено CSIDriver. Ця анотація показує назву вбудованого втулка, який було перенесено. Його значення залежить від вбудованого коду хмарного провайдера зберігання.

Наприклад, якщо тип зберігання вбудованого хмарного провайдера є `CSIMigrationvSphere`, обʼєкт CSINodes для вузла повинен бути оновлений наступним чином: `storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/vsphere-volume"`

### service.kubernetes.io/headless {#servicekubernetesioheadless}

Тип: Label

Приклад: `service.kubernetes.io/headless: ""`

Використовується для: EndpointSlice, Endpoints

{{< glossary_tooltip term_id="control-plane" text="панель управління" >}} додає цей {{< glossary_tooltip term_id="label" text="label" >}} до об'єктів EndpointSlice та Endpoints, коли власний {{< glossary_tooltip term_id="service" >}} є headless (як підказка для проксі-сервісу, що він може ігнорувати ці точки доступу). Щоб дізнатися більше, прочитайте [Headless Services](/docs/concepts/services-networking/service/#headless-services).

### service.kubernetes.io/topology-aware-hints (deprecated) {#servicekubernetesiotopology-aware-hints}

Приклад: `service.kubernetes.io/topology-aware-hints: "Auto"`

Використовується для: Service

Це застарілий аліас для анотації [`service.kubernetes.io/topology-mode`](#service-kubernetes-io-topology-mode),  яка має таку саму функціональність.

### service.kubernetes.io/topology-mode

Тип: Annotation

Приклад: `service.kubernetes.io/topology-mode: Auto`

Використовується для: Service

Ця анотація надає спосіб визначення того, як Serviceʼи обробляють топологію мережі; наприклад, ви можете налаштувати Service так, щоб Kubernetes віддавав перевагу збереженню трафіку між клієнтом і сервером в межах однієї топологічної зони. У деяких випадках це може допомогти зменшити витрати або покращити роботу мережі.

Дивіться [Маршрутизація з урахуванням топології](/docs/concepts/services-networking/topology-aware-routing/) для отримання додаткових відомостей.

### kubernetes.io/service-name {#kubernetesioservice-name}

Тип: Label

Приклад: `kubernetes.io/service-name: "my-website"`

Використовується для: EndpointSlice

Kubernetes асоціює [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) з [Services](/docs/concepts/services-networking/service/) за допомогою цієї мітки.

Ця мітка записує {{< glossary_tooltip term_id="name" text="імʼя">}} Service, який підтримує EndpointSlice. Усі EndpointSlices повинні мати цю мітку встановлену на імʼя їх повʼязаного Service.

### kubernetes.io/service-account.name

Тип: Annotation

Приклад: `kubernetes.io/service-account.name: "sa-name"`

Використовується для: Secret

Ця анотація записує {{< glossary_tooltip term_id="name" text="імʼя">}} ServiceAccount, яке представляє токен (збережений у Secret типу `kubernetes.io/service-account-token`).

### kubernetes.io/service-account.uid

Тип: Annotation

Приклад: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Використовується для: Secret

Ця анотація записує {{< glossary_tooltip term_id="uid" text="унікальний ідентифікатор" >}} ServiceAccount, який представляє токен (збережений у Secret типу `kubernetes.io/service-account-token`).

### kubernetes.io/legacy-token-last-used

Тип: Label

Приклад: `kubernetes.io/legacy-token-last-used: 2022-10-24`

Використовується для: Secret

Панель управління додає цю мітку лише до Secretʼів, які мають тип `kubernetes.io/service-account-token`. Значення цієї мітки записує дату (в форматі ISO 8601, в часовому поясі UTC), коли панель управління востаннє бачила запит, де клієнт автентифікувався за допомогою токена службового облікового запису.

Якщо легасі-токен використовувався останній раз до того, як кластер отримав цю функцію (додану у Kubernetes v1.26), то мітка не встановлена.

### kubernetes.io/legacy-token-invalid-since

Тип: Label

Приклад: `kubernetes.io/legacy-token-invalid-since: 2023-10-27`

Використовується для: Secret

Панель управління автоматично додає цю мітку до автогенерованих Secretʼів з типом `kubernetes.io/service-account-token`, за умови, що у вас увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `LegacyServiceAccountTokenCleanUp`. У Kubernetes {{< skew currentVersion >}} ця поведінка включена стандартно. Ця мітка позначає токен на основі Secret як недійсний для автентифікації. Значення цієї мітки записує дату (в форматі ISO 8601, в часовому поясі UTC), коли панель управління виявляє, що автогенерований Secret не використовувався протягом вказаного періоду (стандартно, один рік).

### endpoints.kubernetes.io/managed-by (deprecated) {#endpoints-kubernetes-io-managed-by}

Nbg: Label

Приклад: `endpoints.kubernetes.io/managed-by: endpoint-controller`

Використовується для: Endpoints

Ця мітка використовуюється для позначення обʼєктів Endpoints, які були створені Kubernetes (на відміну до Endpoints, стоврених користувачами чи зовнішніми контролерами).

{{< note >}}
API [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) є застарілим, використовуйте натомість [EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/).
{{< /note >}}

### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Тип: Label

Приклад: `endpointslice.kubernetes.io/managed-by: endpointslice-controller.k8s.io`

Використовується для: EndpointSlices

Ця мітка використовується для позначення контролера або сутності, яка керує EndpointSlice. Мета цієї мітки — забезпечити можливість керувати різними обʼєктами EndpointSlice різними контролерами або сутностями в межах одного та самого кластера. Значення  `endpointslice-controller.k8s.io` вказує на обʼєкт EndpointSlice, який було створено автоматично Kubernetes для потреби Service з
{{< glossary_tooltip text="селекторами" term_id="selector" >}}.

### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Тип: Label

Приклад: `endpointslice.kubernetes.io/skip-mirror: "true"`

Використовується для: Endpoints

Цю мітку можна встановити на значення `"true"` для ресурсу Endpoints, щоб позначити, що контролер EndpointSliceMirroring не повинен дублювати цей ресурс за допомогою EndpointSlices.

### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Тип: Label

Приклад: `service.kubernetes.io/service-proxy-name: "foo-bar"`

Використовується для: Service

Встановлює значення для цієї мітки, що вказує kube-proxy ігнорувати цей сервіс для проксирування. Це дозволяє використовувати альтернативні реалізації проксі для цього сервісу (наприклад, запуск DaemonSet, який керує nftables своїм способом). Кілька альтернативних реалізацій проксі можуть бути активними одночасно, використовуючи це поле, наприклад, маючи унікальне значення для кожної альтернативної реалізації проксі, щоб відповідати за свої відповідні сервіси.

### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Тип: Annotation

Приклад: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Використовується для: Pod

Ця анотація використовується для запуску контейнерів Windows з ізоляцією Hyper-V.

{{< note >}}
Починаючи з v1.20, ця анотація є застарілою. Експериментальна підтримка Hyper-V була вилучена в 1.21.
{{< /note >}}

### ingressclass.kubernetes.io/is-default-class

Тип: Annotation

Приклад: `ingressclass.kubernetes.io/is-default-class: "true"`

Використовується для: IngressClass

Якщо ресурс IngressClass має цю анотацію встановлену на значення `"true"`, новий ресурс Ingress без вказаного класу буде призначено цей стандартний клас.

### kubernetes.io/ingress.class (deprecated)

Тип: Annotation

Використовується для: Ingress

{{< note >}}
Починаючи з v1.18, ця анотація застаріла на користь `spec.ingressClassName`.
{{< /note >}}

### kubernetes.io/cluster-service (deprecated) {#kubernetes-io-cluster-service}

Тип: Label

Приклад: `kubernetes.io/cluster-service: "true"`

Використовується для: Service

Ця мітка вказує на те, що Service надає послугу кластеру, якщо її значення встановлено у true. Коли ви запускаєте `kubectl cluster-info`, утиліта запитує Services, для яких цю мітку встановлено у значення true.

Втім, встановлення цієї мітки на будь-якій Service є застарілим.

### storageclass.kubernetes.io/is-default-class

Тип: Annotation

Приклад: `storageclass.kubernetes.io/is-default-class: "true"`

Використовується для: StorageClass

Якщо один ресурс StorageClass має цю анотацію встановлену на значення `"true"`, новий ресурс PersistentVolumeClaim без вказаного класу буде призначено цей стандартний клас.

### alpha.kubernetes.io/provided-node-ip (alpha) {#alpha-kubernetes-io-provided-node-ip}

Тип: Annotation

Приклад: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Використовується для: Node

Kubelet може встановити цю анотацію на вузлі, щоб вказати його налаштовану адресу IPv4 та/або IPv6.

Коли kubelet запускається з прапорцем `--cloud-provider`, встановленим на будь-яке значення (включає як зовнішні, так і застарілі постачальники хмарних служб у вбудованому коді), він встановлює цю анотацію на вузлі, щоб вказати IP-адресу, встановлену з командного рядка за допомогою прапорця `--node-ip`. Цей IP перевіряється постачальником хмарних послуг на дійсність за допомогою cloud-controller-manager.

### batch.kubernetes.io/job-completion-index

Тип: Annotation, Label

Приклад: `batch.kubernetes.io/job-completion-index: "3"`

Використовується для: Pod

Контролер Job у kube-controller-manager встановлює це як мітку та анотацію для Podʼів, створених з [режимом завершення](/docs/concepts/workloads/controllers/job/#completion-mode) Indexed.

Зверніть увагу, що для того, щоб це було додано як **мітку** Podʼа, необхідно увімкнути функціональну можливість [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/), інакше це буде просто анотацією.

### batch.kubernetes.io/cronjob-scheduled-timestamp

Тип: Annotation

Приклад: `batch.kubernetes.io/cronjob-scheduled-timestamp: "2016-05-19T03:00:00-07:00"`

Використовується для: Jobs and Pods controlled by CronJobs

Ця анотація використовується для запису оригінального (очікуваного) часу створення для завдання, коли це завдання є частиною CronJob. Панель управління встановлює значення цього часового позначення у форматі RFC3339. Якщо завдання належить до CronJob з вказаною часовою зоною, тоді мітка часу знаходиться в цій часовій зоні. В іншому випадку мітка часу відображається в локальному часі controller-manager.

### kubectl.kubernetes.io/default-container

Тип: Annotation

Приклад: `kubectl.kubernetes.io/default-container: "front-end-app"`

Значення анотації — це імʼя контейнера, яке є типовим для цього Podʼа. Наприклад, команди `kubectl logs` або `kubectl exec` без прапорця `-c` або `--container` використовуватимуть цей типовий контейнер.

### kubectl.kubernetes.io/default-logs-container (deprecated)

Тип: Annotation

Приклад: `kubectl.kubernetes.io/default-logs-container: "front-end-app"`

Значення анотації — це імʼя контейнера, яке є типовим для логування для цього Podʼа. Наприклад, команда `kubectl logs` без прапорця `-c` або `--container` використовуватиме цей типовий контейнер.

{{< note >}}
Ця анотація є застарілою. Замість цього, слід використовувати анотацію [`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container). Версії Kubernetes 1.25 і новіші ігнорують цю анотацію.
{{< /note >}}

### kubectl.kubernetes.io/last-applied-configuration

Тип: Annotation

Приклад: _дивіться наступний код_

```yaml
kubectl.kubernetes.io/last-applied-configuration: >
  {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"name":"example","namespace":"default"},"spec":{"selector":{"matchLabels":{"app.kubernetes.io/name":foo}},"template":{"metadata":{"labels":{"app.kubernetes.io/name":"foo"}},"spec":{"containers":[{"image":"container-registry.example/foo-bar:1.42","name":"foo-bar","ports":[{"containerPort":42}]}]}}}}
```

Використовується для: Всі обʼєкти

Командний рядок інструменту kubectl використовує цю анотацію як застарілий механізм для відстеження змін. Цей механізм був замінений на [Server-Side Apply](/docs/reference/using-api/server-side-apply/).

### kubectl.kubernetes.io/restartedAt {#kubectl-k8s-io-restart-at}

Тип: Annotation

Приклад: `kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

Використовується для: Deployment, ReplicaSet, StatefulSet, DaemonSet, Pod

Ця анотація містить останній час перезапуску ресурсу (Deployment, ReplicaSet, StatefulSet або DaemonSet), під час якого kubectl запустив розгортання для примусового створення нових Podʼів. Команда `kubectl rollout restart <RESOURCE>` ініціює перезапуск шляхом виправлення шаблону метаданих усіх Podʼів ресурсу з цією анотацією. У наведеному вище прикладі останній час перезапуску показано як 21 червня 2024 року о 17:27:41 UTC.

Не слід вважати, що ця анотація відображає дату/час останнього оновлення; окремі зміни могли бути внесені з моменту останнього ручного розгортання.

Якщо ви вручну встановите цю анотацію на Pod, нічого не станеться. Побічний ефект перезапуску повʼязаний з тим, як працює управління робочим навантаженням і шаблонізацією Pod.

### endpoints.kubernetes.io/over-capacity (deprecated) {#endpoints-kubernetes-io-over-capacity}

Тип: Annotation

Приклад: `endpoints.kubernetes.io/over-capacity: truncated`

Використовується для: Endpoints

{{< glossary_tooltip text="Панель управління" term_id="control-plane" >}} додає цю анотацію до обʼєкта [Endpoints](/docs/concepts/services-networking/service/#endpoints), якщо повʼязаний {{< glossary_tooltip term_id="service" >}} має більше 1000 резервних точок доступу. Анотація вказує на те, що обʼєкт Endpoints перевищив потужність, і кількість точок доступу була скорочена до 1000.

Якщо кількість резервних точок доступу опускається нижче 1000, то {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} видаляє цю анотацію.

{{< note >}}
API [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) є застарілим на користь [EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/). Сервіс може мати кілька обʼєктів EndpointSlice. Як результат, EndpointSlices не потребують обрізання.
{{< /note >}}

### endpoints.kubernetes.io/last-change-trigger-time (deprecated) {#endpoints-kubernetes-io-last-change-trigger-time}

Тип: Annotation

Приклад: `endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

Використовується для: Endpoints

Ця анотація встановлює обʼєкт [Endpoints](/docs/concepts/services-networking/service/#endpoints), який представляє мітку часу (Мітка часу зберігається у форматі дата-часового рядка RFC 3339. Наприклад, '2018-10-22T19:32:52.1Z'). Це позначка часу останньої зміни в деякому обʼєкті Pod або Service, яка спричинила зміну в обʼєкті Endpoints.

{{< note >}}
API [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) є застарілим на користь [EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/).
{{< /note >}}

### control-plane.alpha.kubernetes.io/leader (deprecated) {#control-plane-alpha-kubernetes-io-leader}

Тип: Annotation

Приклад: `control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

Використовується для: Endpoints

{{< glossary_tooltip text="Панель управління" term_id="control-plane" >}} раніше використовувала обʼєкт [Endpoints](/docs/concepts/services-networking/service/#endpoints) для координації призначення лідера для панелі управління Kubernetes. Цей обʼєкт Endpoints містив анотацію з наступними деталями:

- Хто є поточним лідером.
- Час, коли було здобуто поточне лідерство.
- Тривалість оренди (лідерства) у секундах.
- Час, коли поточна оренда (поточне лідерство) повинна бути продовжена.
- Кількість переходів лідерства, які сталися у минулому.

Тепер Kubernetes використовує [Leases](/docs/concepts/architecture/leases/) для керування призначенням лідера для панелі управління Kubernetes.

### batch.kubernetes.io/job-tracking (deprecated) {#batch-kubernetes-io-job-tracking}

Тип: Annotation

Приклад: `batch.kubernetes.io/job-tracking: ""`

Використовується для: Jobs

Раніше наявність цієї анотації на обʼєкті Job вказувала на те, що панель управління [відстежує статус Job за допомогою завершувачів](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers). Додавання або видалення цієї анотації більше не має впливу (з версії Kubernetes v1.27 і пізніше). Всі Jobs відстежуються за допомогою завершувачів.

### job-name (deprecated) {#job-name}

Тип: Label

Приклад: `job-name: "pi"`

Використовується для: Jobs та Pods, що керуються через Jobs

{{< note >}}
Починаючи з Kubernetes 1.27, ця мітка застаріла. Kubernetes 1.27 та новіші версії ігнорують цю мітку і використовують мітку з префіксом `job-name`.
{{< /note >}}

### controller-uid (deprecated) {#controller-uid}

Тип: Label

Приклад: `controller-uid: "$UID"`

Використовується для: Jobs та Pods, що керуються через Jobs

{{< note >}}
Починаючи з Kubernetes 1.27, ця мітка застаріла. Kubernetes 1.27 та новіші версії ігнорують цю мітку і використовують мітку з префіксом `controller-uid`.
{{< /note >}}

### batch.kubernetes.io/job-name {#batchkubernetesio-job-name}

Тип: Label

Приклад: `batch.kubernetes.io/job-name: "pi"`

Використовується для: Jobs та Pods, що керуються через Jobs

Ця мітка використовується як зручний спосіб для отримання Podʼів, що належать Job. Мітка `job-name` походить від імені Job і надає простий спосіб отримати Podʼи, що належать Job.

### batch.kubernetes.io/controller-uid {#batchkubernetesio-controller-uid}

Тип: Label

Приклад: `batch.kubernetes.io/controller-uid: "$UID"`

Використовується для: Jobs та Pods, що керуються через Jobs

Ця мітка використовується як програмний спосіб отримати всі Podʼи, що належать Job. `controller-uid` є унікальним ідентифікатором, який встановлюється в поле `selector`, щоб контролер Job міг отримати всі відповідні Podʼи.

### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

Тип: Annotation

Приклад: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Використовується для: Namespace

Ця анотація вимагає активування контролера допуску [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction). Ключ цієї анотації дозволяє призначати толерантності для простору імен, і будь-які нові створені в цьому просторі імен Podʼи отримають ці толерантності.

### scheduler.alpha.kubernetes.io/tolerationsWhitelist {#schedulerkubernetestolerations-whitelist}

Тип: Annotation

Приклад: `scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Використовується для: Namespace

Ця анотація корисна лише тоді, коли активований контролер допуску (Alpha) [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction). Значення анотації — це JSON-документ, який визначає список допустимих толерантностей для простору імен, який анотується. Під час створення Pod або зміни його толерантностей, сервер API перевіряє толерантності, щоб переконатися, що вони згадуються у списку дозволених. Pod буде прийнятий лише у випадку успішної перевірки.

### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Тип: Annotation

Використовується для: Node

Ця анотація вимагає активації [втулка планування NodePreferAvoidPods](/docs/reference/scheduling/config/#scheduling-plugins). Однак цей втулок застарів починаючи з Kubernetes 1.22. Замість цього використовуйте [Позначення та толерантності](/docs/concepts/scheduling-eviction/taint-and-toleration/).

### node.kubernetes.io/not-ready

Тип: Taint

Приклад: `node.kubernetes.io/not-ready: "NoExecute"`

Використовується для: Node

Контролер Node визначає, чи готовий Node, відстежуючи стан його справності, і відповідно додає або видаляє це позначення.

### node.kubernetes.io/unreachable

Тип: Taint

Приклад: `node.kubernetes.io/unreachable: "NoExecute"`

Використовується для: Node

Контролер Node додає позначення на Node відповідно до [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready`, якщо воно має значення `Unknown`.

### node.kubernetes.io/unschedulable

Тип: Taint

Приклад: `node.kubernetes.io/unschedulable: "NoSchedule"`

Використовується для: Node

Позначення буде додано до вузла під час його ініціалізації, щоб уникнути стану перегонів.

### node.kubernetes.io/memory-pressure

Тип: Taint

Приклад: `node.kubernetes.io/memory-pressure: "NoSchedule"`

Використовується для: Node

Kubelet виявляє тиск на памʼять на основі значень `memory.available` і `allocatableMemory.available`, спостережуваних на вузлі. Потім спостережені значення порівнюються з відповідними пороговими значеннями, які можна встановити на kubelet, щоб визначити, чи потрібно додати / видалити умову вузла та позначення.

### node.kubernetes.io/disk-pressure

Тип: Taint

Приклад: `node.kubernetes.io/disk-pressure :"NoSchedule"`

Використовується для: Node

Kubelet виявляє тиск на дискову памʼять на основі значень `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` і `nodefs.inodesFree` (тільки для Linux), спостережуваних на вузлі. Потім спостережені значення порівнюються з відповідними пороговими значеннями, які можна встановити на kubelet, щоб визначити, чи потрібно додати / видалити умову вузла та позначення.

### node.kubernetes.io/network-unavailable

Тип: Taint

Приклад: `node.kubernetes.io/network-unavailable: "NoSchedule"`

Використовується для: Node

Це спочатку встановлюється kubelet, коли використовуваний хмарний постачальник вказує на потребу в додатковій конфігурації мережі. Тільки коли маршрут на хмарі налаштований належним чином, хмарний постачальник видаляє позначення.

### node.kubernetes.io/pid-pressure

Тип: Taint

Приклад: `node.kubernetes.io/pid-pressure: "NoSchedule"`

Використовується для: Node

Kubelet перевіряє D-значення розміру `/proc/sys/kernel/pid_max` та PID, використані Kubernetes на вузлі, щоб отримати кількість доступних PID, які вказуються метрикою `pid.available`. Потім цю метрику порівнюють з відповідним пороговим значенням, яке можна встановити на kubelet, щоб визначити, чи потрібно додати / видалити умову вузла та позначення.

### node.kubernetes.io/out-of-service

Тип: Taint

Приклад: `node.kubernetes.io/out-of-service:NoExecute`

Використовується для: Node

Користувач може вручну додати позначення на вузол, відмітивши його як такий що вийшов з ладу. Якщо вузол позначено як неробочий з цією міткою, Podʼи на вузлі буде примусово видалено, якщо на ньому немає відповідних толерантностей, і операції відокремлення тома для Podʼів, що завершуються на вузлі, будуть виконані негайно. Це дозволяє швидко відновити Podʼи на вузлі, що вийшов з ладу, на іншому вузлі.

{{< caution >}}
Дивіться [Невідповідне вимкнення вузла](/docs/concepts/cluster-administration/node-shutdown/#non-graceful-node-shutdown) для отримання додаткових відомостей про те, коли і як використовувати це позначення.
{{< /caution >}}

### node.cloudprovider.kubernetes.io/uninitialized

Тип: Taint

Приклад: `node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

Використовується для: Node

Встановлює цю позначку на вузлі, щоб позначити його як непридатний для використання, коли kubelet запускається з "зовнішнім" хмарним постачальником, доки контролер з cloud-controller-manager ініціалізує цей вузол, а потім видаляє позначку.

### node.cloudprovider.kubernetes.io/shutdown

Тип: Taint

Приклад: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

Використовується для: Node

Якщо вузол перебуває у визначеному хмарним постачальником стані вимкнення, вузол отримує відповідну позначку з `node.cloudprovider.kubernetes.io/shutdown` і ефект позначки `NoSchedule`.

### feature.node.kubernetes.io/\*

Тип: Label

Приклад: `feature.node.kubernetes.io/network-sriov.capable: "true"`

Використовується для: Node

Ці мітки використовуються компонентом виявлення функцій вузла (NFD), щоб оголошувати функції на вузлі. Усі вбудовані мітки використовують простір імен мітки `feature.node.kubernetes.io` та мають формат `feature.node.kubernetes.io/<назва-функції>: "true"`. NFD має багато точок розширення для створення міток, специфічних для постачальника або застосунку. Для отримання детальної інформації дивіться [посібник з налаштування](https://kubernetes-sigs.github.io/node-feature-discovery/v0.12/usage/customization-guide).

### nfd.node.kubernetes.io/master.version

Тип: Annotation

Приклад: `nfd.node.kubernetes.io/master.version: "v0.6.0"`

Використовується для: Node

Для вузлів, на яких заплановано [master](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-master.html) виявлення функцій вузла (NFD) , ця анотація записує версію майстра NFD. Вона використовується лише для інформаційних цілей.

### nfd.node.kubernetes.io/worker.version

Тип: Annotation

Приклад: `nfd.node.kubernetes.io/worker.version: "v0.4.0"`

Використовується для: Nodes

Антоація записує версію [робочого процесу](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-worker.html) виявлення функцій вузла (NFD), якщо він працює на вузлі. Вона використовується лише для інформаційних цілей.

### nfd.node.kubernetes.io/feature-labels

Тип: Annotation

Приклад: `nfd.node.kubernetes.io/feature-labels: "cpu-cpuid.ADX,cpu-cpuid.AESNI,cpu-hardware_multithreading,kernel-version.full"`

Використовується для: Nodes

Ця анотація записує список міток функцій вузла, розділених комами, керованих [виявленням функцій вузла](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD). NFD використовує це для внутрішнього механізму. Ви не повинні редагувати цю анотацію самостійно.

### nfd.node.kubernetes.io/extended-resources

Тип: Annotation

Приклад: `nfd.node.kubernetes.io/extended-resources: "accelerator.acme.example/q500,example.com/coprocessor-fx5"`

Використовується для: Nodes

Ця анотація зберігає розділені комами список [розширених ресурсів](/docs/concepts/configuration/manage-resources-containers/#extended-resources), керованих [виявленням функцій вузла](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD). NFD використовує це для внутрішнього механізму. Ви не повинні редагувати цю анотацію самостійно.

### nfd.node.kubernetes.io/node-name

Тип: Label

Приклад: `nfd.node.kubernetes.io/node-name: node-1`

Використовується для: Nodes

Мітка вказує, який вузол націлений обʼєкт NodeFeature. Творці обʼєктів NodeFeature повинні встановлювати цю мітку, а споживачі обʼєктів повинні використовувати її для фільтрації особливостей, призначених для певного вузла.

{{< note >}}
Ці мітки або анотації Node Feature Discovery (NFD) застосовуються лише до вузлів, де працює NFD. Щоб дізнатися більше про NFD та його компоненти, перейдіть до його офіційної [документації](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/).
{{< /note >}}

### service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-emit-interval}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "5"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження для Service на основі цієї анотації. Значення визначає, як часто балансувальник навантаження записує записи логу. Наприклад, якщо ви встановите значення на 5, записи логу будуть відбуватися з інтервалом у 5 секунд.

### service.beta.kubernetes.io/aws-load-balancer-access-log-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-enabled}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження для Service на основі цієї анотації. Ведення логу доступу активується, якщо ви встановите анотацію на значення "true".

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-name}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: example`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження для Service на основі цієї анотації. Балансувальник навантаження записує логи до корзини S3 з іменем, яке ви вказуєте.

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-prefix}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "/example"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження для Service на основі цієї анотації. Балансувальник навантаження записує обʼєкти журналів з префіксом, який ви вказуєте.

### service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags (beta) {#service-beta-kubernetes-io-aws-load-balancer-additional-resource-tags}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує теґи (концепція AWS) для балансувальника навантаження на основі розділених комами пар ключ/значення у значенні цієї анотації.

### service.beta.kubernetes.io/aws-load-balancer-alpn-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-alpn-policy}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-alpn-policy: HTTP2Optional`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-attributes (beta) {#service-beta-kubernetes-io-aws-load-balancer-attributes}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-attributes: "deletion_protection.enabled=true"`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Для отримання додаткової інформації дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-backend-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-backend-protocol}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує прослуховувач балансувальника навантаження на основі значення цієї анотації.

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Налаштування затримки зʼєднання балансувальника навантаження залежить від значення, яке ви встановлюєте.

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-timeout}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"`

Використовується для: Service

Якщо ви налаштовуєте [затримку зʼєднання](#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled) для Service з `type: LoadBalancer`, і ви використовуєте хмару AWS, інтеграція налаштовує період затримки на основі цієї анотації. Значення, яке ви встановлюєте, визначає тайм-аут затримки у секундах.

### service.beta.kubernetes.io/aws-load-balancer-ip-address-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-ip-address-type}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-idle-timeout}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Балансувальник має налаштований період тайм-ауту бездіяльності (у секундах), який застосовується до його зʼєднань. Якщо протягом періоду тайм-ауту бездіяльності не було відправлено або отримано жодних даних, балансувальник закриває зʼєднання.

### service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-cross-zone-load-balancing-enabled}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Якщо ви встановите цю анотацію в значення "true", кожен вузол балансувальника навантаження розподіляє запити рівномірно серед зареєстрованих цілей у всіх увімкнених [зонах доступності](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones). Якщо ви вимкнете перехресне балансування зон, кожен вузол балансувальника навантаження розподіляє запити рівномірно серед зареєстрованих цілей лише у своїй зоні доступності.

### service.beta.kubernetes.io/aws-load-balancer-eip-allocations (beta) {#service-beta-kubernetes-io-aws-load-balancer-eip-allocations}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-eip-allocations: "eipalloc-01bcdef23bcdef456,eipalloc-def1234abc4567890"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення є розділеним комами списком ідентифікаторів виділення еластичних IP-адрес.

Ця анотація має сенс тільки для Service з `type: LoadBalancer`, де балансувальник навантаження є мережевим балансувальником AWS.

### service.beta.kubernetes.io/aws-load-balancer-extra-security-groups (beta) {#service-beta-kubernetes-io-aws-load-balancer-extra-security-groups}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації є розділеним комами списком додаткових груп безпеки AWS VPC для налаштування балансувальника навантаження.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-healthy-threshold}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: "3"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації визначає кількість послідовних успішних перевірок стану для бекенду, щоб вважати його справним для передавання трафіку.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-interval}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації визначає інтервал, в секундах, між запитами перевірки стану, які виконує балансувальник навантаження.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-path (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-papth}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації визначає частину шляху URL, яка використовується для HTTP перевірок стану.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-port (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-port}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації визначає порт, до якого підключається балансувальник навантаження під час виконання перевірок стану.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-protocol}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації визначає спосіб, яким балансувальник навантаження перевіряє стан бекендів.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-timeout}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "3"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації вказує кількість секунд до того, як запит, який ще не вдався, автоматично вважається неуспішним.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-unhealthy-threshold}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Значення анотації визначає кількість послідовних невдалих перевірок стану, необхідних для того, щоб бекенд вважася несправним для передачі трафіку.

### service.beta.kubernetes.io/aws-load-balancer-internal (beta) {#service-beta-kubernetes-io-aws-load-balancer-internal}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-internal: "true"`

Використовується для: Service

Інтеграція менеджера контролера хмарних служб з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Коли ви встановлюєте цю анотацію у значення "true", інтеграція налаштовує внутрішній балансувальник навантаження.

Якщо ви використовуєте [контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/), дивіться [`service.beta.kubernetes.io/aws-load-balancer-scheme`](#service-beta-kubernetes-io-aws-load-balancer-scheme).

### service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules (beta) {#service-beta-kubernetes-io-aws-load-balancer-manage-backend-security-group-rules}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules: "true"`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-name}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-name: my-elb`

Використовується для: Service

Якщо ви встановлюєте цю анотацію на Service, і також анотуєте цей Service з `service.beta.kubernetes.io/aws-load-balancer-type: "external"`, і ви використовуєте [контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) у вашому кластері, тоді контролер балансувальника навантаження AWS встановлює назву цього балансувальника на значення, яке ви встановлюєте для _цієї_ анотації.

Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-nlb-target-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-nlb-target-type}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "true"`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses (beta) {#service-beta-kubernetes-io-aws-load-balancer-private-ipv4-addresses}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses: "198.51.100.0,198.51.100.64"`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-proxy-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-proxy-protocol}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"`

Використовується для: Service

Офіційна інтеграція Kubernetes з AWS Elastic Load Balancing налаштовує балансувальник навантаження на основі цієї анотації. Єдине допустиме значення — `"*"`, що вказує на те, що балансувальник навантаження повинен обгортати TCP-зʼєднання до бекенду Pod за допомогою протоколу PROXY.

### service.beta.kubernetes.io/aws-load-balancer-scheme (beta) {#service-beta-kubernetes-io-aws-load-balancer-scheme}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-scheme: internal`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-security-groups (deprecated) {#service-beta-kubernetes-io-aws-load-balancer-security-groups}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

Використовується для: Service

Контролер балансувальника навантаження AWS використовує цю анотацію для вказівки розділеного комами списку груп безпеки, які ви хочете прикріпити до балансувальника навантаження AWS. Підтримуються як імʼя, так і ID груп безпеки, де імʼя відповідає тегу `Name`, а не атрибуту `groupName`.

Коли ця анотація додається до Service, контролер балансувальника навантаження прикріплює групи безпеки, на які вказує анотація, до балансувальника навантаження. Якщо ви пропускаєте цю анотацію, контролер балансувальника навантаження AWS автоматично створює нову групу безпеки і прикріплює її до балансувальника навантаження.

{{< note >}}
Починаючи з Kubernetes v1.27, ця анотація більше не встановлюється або не читається безпосередньо. Однак контролер балансувальника навантаження AWS (частина проєкту Kubernetes) все ще використовує анотацію `service.beta.kubernetes.io/aws-load-balancer-security-groups`.
{{< /note >}}

### service.beta.kubernetes.io/load-balancer-source-ranges (deprecated) {#service-beta-kubernetes-io-load-balancer-source-ranges}

Приклад: `service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Вам слід встановити `.spec.loadBalancerSourceRanges` для Service замість цього.

### service.beta.kubernetes.io/aws-load-balancer-ssl-cert (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-cert}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"`

Використовується для: Service

Офіційна інтеграція з AWS Elastic Load Balancing налаштовує TLS для Service з `type: LoadBalancer` на основі цієї анотації. Значення анотації — це імʼя ресурсу AWS (ARN) сертифіката X.509, який повинен використовувати прослуховувач балансувальника навантаження.

(Протокол TLS базується на старій технології, яка скорочується до SSL.)

### service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-negotiation-policy}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

Офіційна інтеграція з AWS Elastic Load Balancing налаштовує TLS для Service з `type: LoadBalancer` на основі цієї анотації. Значення анотації — це імʼя політики AWS для взаємодії TLS з клієнтом.

### service.beta.kubernetes.io/aws-load-balancer-ssl-ports (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-ports}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

Офіційна інтеграція з AWS Elastic Load Balancing налаштовує TLS для Service з `type: LoadBalancer` на основі цієї анотації. Значення анотації може бути або `"*"`, що означає, що всі порти балансувальника навантаження повинні використовувати TLS, або це може бути розділений комами список номерів портів.

### service.beta.kubernetes.io/aws-load-balancer-subnets (beta) {#service-beta-kubernetes-io-aws-load-balancer-subnets}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

Офіційна інтеграція Kubernetes з AWS використовує цю анотацію для налаштування балансувальника навантаження та визначення, в яких зонах доступності AWS розгорнути керовану службу балансування навантаження. Значення може бути або розділений комами список імен підмереж, або розділений комами список ідентифікаторів підмереж.

### service.beta.kubernetes.io/aws-load-balancer-target-group-attributes (beta) {#service-beta-kubernetes-io-aws-load-balancer-target-group-attributes}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: "stickiness.enabled=true,stickiness.type=source_ip"`

Використовується для: Service

[Контролер балансувальника навантаження AWS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) використовує цю анотацію. Дивіться [анотації](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) у документації контролера балансувальника навантаження AWS.

### service.beta.kubernetes.io/aws-load-balancer-target-node-labels (beta) {#service-beta-kubernetes-io-aws-target-node-labels}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

Офіційна інтеграція Kubernetes з AWS використовує цю анотацію для визначення, які вузли у вашому кластері повинні бути розглянуті як дійсні цілі для балансувальника навантаження.

### service.beta.kubernetes.io/aws-load-balancer-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-type}

Приклад: `service.beta.kubernetes.io/aws-load-balancer-type: external`

Офіційні інтеграції Kubernetes з AWS використовують цю анотацію для визначення того, чи має інтеграція з хмарним провайдером AWS керувати Service з `type: LoadBalancer`.

Є два допустимі значення:

`nlb`
: менеджер контролера хмарних послуг налаштовує мережевий балансувальник навантаження

`external`
: менеджер контролера хмарних послуг не налаштовує жодного балансувальника навантаження

Якщо ви розгортаєте Service з `type: LoadBalancer` на AWS і не встановлюєте жодної анотації `service.beta.kubernetes.io/aws-load-balancer-type`, інтеграція з AWS розгортатиме класичний балансувальник навантаження Elastic Load Balancer. Ця поведінка, коли анотація відсутня, є типовою, якщо ви не вказуєте інше.

Коли ви встановлюєте цю анотацію на значення `external` на Service з `type: LoadBalancer`, а у вашому кластері є працюючий deployment контролера балансувальника навантаження AWS, то контролер балансувальника навантаження AWS намагатиметься розгорнути балансувальник навантаження на основі специфікації Service.

{{< caution >}}
Не змінюйте або додавайте анотацію `service.beta.kubernetes.io/aws-load-balancer-type` на існуючий обʼєкт Service. Для отримання додаткових відомостей дивіться документацію AWS з цього питання.
{{< /caution >}}

### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset (deprecated) {#service-beta-kubernetes-azure-load-balancer-disble-tcp-reset}

Приклад: `service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

Використовується для: Service

Ця анотація працює лише для Service, підтримуваних стандартним балансувальником навантаження Azure. Вона використовується у Service для вказівки, чи слід вимикати або вмикати скидання TCP при бездіяльності. Якщо увімкнено, це допомагає застосункам працювати більш передбачувано, виявляти обриви зʼєднання, видаляти застарілі зʼєднання та ініціювати нові. Ви можете встановити значення як true або false.

Дивіться [Скидання TCP балансувальника навантаження](https://learn.microsoft.com/en-gb/azure/load-balancer/load-balancer-tcp-reset) для отримання додаткової інформації.

{{< note >}}
Ця анатоція є застарілою.
{{< /note >}}

### pod-security.kubernetes.io/enforce

Тип: Label

Приклад: `pod-security.kubernetes.io/enforce: "baseline"`

Використовується для: Namespace

Значення **обовʼязково** повинно бути одним із `privileged`, `baseline` або `restricted`, що відповідає рівням [стандарту безпеки для Podʼів](/docs/concepts/security/pod-security-standards). Зокрема, мітка `enforce` _забороняє_ створення будь-якого Podʼа у позначеному просторі імен, який не відповідає вимогам, визначеним на вказаному рівні.

Для отримання додаткової інформації перегляньте [Застосування безпеки Podʼів на рівні простору імен](/docs/concepts/security/pod-security-admission).

### pod-security.kubernetes.io/enforce-version

Тип: Label

Приклад: `pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

Використовується для: Namespace

Значення **має** бути `latest` або дійсна версія Kubernetes у форматі `v<major>.<minor>`. Це визначає версію політик [стандарту безпеки для Podʼів](/docs/concepts/security/pod-security-standards), які застосовуються при перевірці Podʼа.

Для отримання додаткової інформації дивіться [Застосування безпеки Podʼів на рівні простору імен](/docs/concepts/security/pod-security-admission).

### pod-security.kubernetes.io/audit

Тип: Label

Приклад: `pod-security.kubernetes.io/audit: "baseline"`

Використовується для: Namespace

Значення **має** бути одним із `privileged`, `baseline` або `restricted`, що відповідають рівням [стандарту безпеки для Podʼів](/docs/concepts/security/pod-security-standards). Зокрема, мітка `audit` не перешкоджає створенню Podʼа у позначеному просторі імен, який не відповідає вимогам, визначеним на вказаному рівні, але додає цю анотацію до Podʼа.

Для отримання додаткової інформації дивіться [Застосування безпеки Podʼів на рівні простору імен](/docs/concepts/security/pod-security-admission).

### pod-security.kubernetes.io/audit-version

Тип: Label

Приклад: `pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

Використовується для: Namespace

Значення **повинно** бути `latest` або дійсна версія Kubernetes у форматі `v<major>.<minor>`. Це визначає версію політик [стандарту безпеки для Podʼів](/docs/concepts/security/pod-security-standards), які застосовуються під час перевірки Podʼа.

Для отримання додаткової інформації дивіться [Застосування безпеки Podʼів на рівні простору імен](/docs/concepts/security/pod-security-admission).

### pod-security.kubernetes.io/warn

Тип: Label

Приклад: `pod-security.kubernetes.io/warn: "baseline"`

Використовується для: Namespace

Значення **має** бути одним із `privileged`, `baseline` або `restricted`, що відповідають рівням [стандарту безпеки для Podʼів](/docs/concepts/security/pod-security-standards). Зокрема, мітка `warn` не перешкоджає створенню Podʼа у позначеному просторі імен, який не відповідає вимогам, визначеним на вказаному рівні, але повертає попередження користувачу після цього.

Зверніть увагу, що попередження також відображаються при створенні або оновленні обʼєктів, які містять шаблони Podʼа, такі як Deployments, Jobs, StatefulSets тощо.

Для отримання додаткової інформації дивіться [Застосування безпеки Podʼів на рівні простору імен](/docs/concepts/security/pod-security-admission).

### pod-security.kubernetes.io/warn-version

Тип: Label

Приклад: `pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

Використовується для: Namespace

Значення **повинно** бути `latest` або дійсна версія Kubernetes у форматі `v<основний>.<додатковий>`. Це визначає версію політик [стандарту безпеки для Podʼів](/docs/concepts/security/pod-security-standards), які застосовуються при перевірці поданих Podʼів. Зверніть увагу, що попередження також відображаються при створенні або оновленні обʼєктів, які містять шаблони Podʼа, такі як Deployments, Jobs, StatefulSets тощо.

Для отримання додаткової інформації дивіться [Застосування безпеки Podʼів на рівні простору імен](/docs/concepts/security/pod-security-admission).

### rbac.authorization.kubernetes.io/autoupdate

Тип: Annotation

Приклад: `rbac.authorization.kubernetes.io/autoupdate: "false"`

Використовується для: ClusterRole, ClusterRoleBinding, Role, RoleBinding

Коли ця анотація встановлена на стандартне значення `"true"` на обʼєктах RBAC, створених сервером API, вони автоматично оновлюються при запуску сервера для додавання відсутніх дозволів та субʼєктів (додаткові дозволи та субʼєкти залишаються на місці). Щоб запобігти автоматичному оновленню певної ролі або привʼязки ролі, встановіть цю анотацію у значення `"false"`. Якщо ви створюєте власні обʼєкти RBAC і встановлюєте цю анотацію у значення `"false"`, `kubectl auth reconcile` (який дозволяє узгоджувати довільні обʼєкти RBAC у {{< glossary_tooltip text="маніфесті" term_id="manifest" >}}) враховує цю анотацію і автоматично не додає відсутні дозволи та субʼєкти.

### kubernetes.io/psp (deprecated) {#kubernetes-io-psp}

Тип: Annotation

Приклад: `kubernetes.io/psp: restricted`

Використовується для: Pod

Ця анотація була актуальною лише у випадку використання обʼєктів [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/). Kubernetes v{{< skew currentVersion >}} не підтримує API PodSecurityPolicy.

Коли контролер допуску PodSecurityPolicy дав дозвіл Podʼу, він модифікував Pod так, щоб мати цю анотацію. Значення анотації було імʼям PodSecurityPolicy, яке використовувалось для валідації.

### seccomp.security.alpha.kubernetes.io/pod (non-functional) {#seccomp-security-alpha-kubernetes-io-pod}

Тип: Annotation

Використовується для: Pod

Кубернетес до версії 1.25 дозволяв вам налаштовувати поведінку seccomp за допомогою цієї анотації. Див. [Обмеження системних викликів контейнера за допомогою seccomp](/docs/tutorials/security/seccomp/), щоб дізнатися, як вказувати обмеження seccomp для Pod.

### container.seccomp.security.alpha.kubernetes.io/[NAME] (non-functional) {#container-seccomp-security-alpha-kubernetes-io}

Тип: Annotation

Використовується для: Pod

До версії 1.25 Kubernetes дозволяв налаштовувати поведінку seccomp за допомогою цієї анотації. Дивіться [Обмеження системних викликів контейнера за допомогою seccomp](/docs/tutorials/security/seccomp/), щоб дізнатися підтримуваний спосіб вказування обмежень seccomp для Pod.

### snapshot.storage.kubernetes.io/allow-volume-mode-change

Тип: Annotation

Приклад: `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

Використовується для: VolumeSnapshotContent

Значення може бути або `true`, або `false`. Це визначає, чи може користувач змінювати режим джерельного тому при створенні PersistentVolumeClaim із VolumeSnapshot.

Зверніться до [Зміна режиму тому знімка](/docs/concepts/storage/volume-snapshots/#convert-volume-mode) та [Документації розробника Kubernetes CSI](https://kubernetes-csi.github.io/docs/) для отримання додаткової інформації.

### scheduler.alpha.kubernetes.io/critical-pod (deprecated)

Тип: Annotation

Приклад: `scheduler.alpha.kubernetes.io/critical-pod: ""`

Використовується для: Pod

Ця анотація повідомляє панель управління Kubernetes, що Pod є критичним, щоб descheduler не видаляв цей Pod.

{{< note >}}
Починаючи з версії 1.16, ця анотація була видалена на користь [Пріоритету Pod](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
{{< /note >}}

### jobset.sigs.k8s.io/jobset-name

Тип: Label, Annotation

Приклад:  `jobset.sigs.k8s.io/jobset-name: "my-jobset"`

Використовується для: Jobs, Pods

Ця мітка/анотація використовується для зберігання назви JobSet, до якого належить Job або Pod. [JobSet](https://jobset.sigs.k8s.io) — це API розширення, яке ви можете розгорнути у своєму кластері Kubernetes.

### jobset.sigs.k8s.io/replicatedjob-replicas

Тип: Label, Annotation

Приклад: `jobset.sigs.k8s.io/replicatedjob-replicas: "5"`

Використовується для: Jobs, Pods

Ця мітка/анотація вказує на кількість реплік для ReplicatedJob.

### jobset.sigs.k8s.io/replicatedjob-name

Тип: Label, Annotation

Приклад: `jobset.sigs.k8s.io/replicatedjob-name: "my-replicatedjob"`

Використовується для: Jobs, Pods

Ця мітка або анотація зберігає імʼя реплікованого завдання, частиною якого є цей Job або Pod.

### jobset.sigs.k8s.io/job-index

Тип: Label, Annotation

Приклад: `jobset.sigs.k8s.io/job-index: "0"`

Використовується для: Jobs, Pods

Ця мітка/анотація встановлюється контролером JobSet для дочірніх Jobs і Pods. Вона містить індекс репліки Job у межах батьківського ReplicatedJob.

### jobset.sigs.k8s.io/job-key

Тип: Label, Annotation

Приклад: `jobset.sigs.k8s.io/job-key: "0f1e93893c4cb372080804ddb9153093cb0d20cefdd37f653e739c232d363feb"`

Використовується для: Jobs, Pods

Контролер JobSet встановлює цю мітку (а також анотацію з тим самим ключем) на дочірніх завданнях JobSet і Pods. Значенням є хеш SHA256 імені Job у просторі імен.

### alpha.jobset.sigs.k8s.io/exclusive-topology

Тип: Annotation

Приклад: `alpha.jobset.sigs.k8s.io/exclusive-topology: "zone"`

Використовується для: JobSets, Jobs

Ви можете встановити цю мітку/анотацію на [JobSet](https://jobset.sigs.k8s.io), щоб забезпечити ексклюзивне розміщення завдань для кожної топологічної групи. Ви також можете визначити цю мітку або анотацію на тиражованому шаблоні завдання. Щоб дізнатися більше, прочитайте документацію до JobSet.

### alpha.jobset.sigs.k8s.io/node-selector

Тип: Annotation

Приклад: `alpha.jobset.sigs.k8s.io/node-selector: "true"`

Використовується для: Jobs, Pods

Ця мітка/анотація може бути застосована до JobSet. Коли вона встановлена, контролер JobSet модифікує Jobs і відповідні їм Pods, додаючи селектори вузлів і толерації. Це забезпечує ексклюзивне розміщення завдань в домені топології, обмежуючи планування цих Podʼів конкретними вузлами на основі стратегії.

### alpha.jobset.sigs.k8s.io/namespaced-job

Тип: Label

Приклад: `alpha.jobset.sigs.k8s.io/namespaced-job: "default_myjobset-replicatedjob-0"`

Використовується для: Nodes

Ця мітка встановлюється на вузлах вручну або автоматично (наприклад, кластерним автомасштабувальником). Коли `alpha.jobset.sigs.k8s.io/node-selector` встановлено у `"true"`, контролер JobSet додає nodeSelector до цієї мітки вузла (разом з толерантністю до позначення `alpha.jobset.sigs.k8s.io/no-schedule`, описаної далі).

### alpha.jobset.sigs.k8s.io/no-schedule

Тип: Taint

Приклад: `alpha.jobset.sigs.k8s.io/no-schedule: "NoSchedule"`

Використовується для: Nodes

Ця позначка встановлюється або вручну, або автоматично (наприклад, кластерним автомасштабувальником) на вузлах. Коли `alpha.jobset.sigs.k8s.io/node-selector` встановлено у `"true"`, контролер JobSet додає толерантність до цієї позначки вузла (разом із селектором вузла до мітки `alpha.jobset.sigs.k8s.io/namespaced-job`, описаної раніше).

### jobset.sigs.k8s.io/coordinator

Тип: Annotation, Label

Приклад: `jobset.sigs.k8s.io/coordinator: "myjobset-workers-0-0.headless-svc"`

Використовується для: Jobs, Pods

Ця анотація/мітка використовується на Jobs та Pods для зберігання стабільної точки доступу, де можна знайти pod координатора, якщо у специфікації [JobSet](https://jobset.sigs.k8s.io) визначено поле `.spec.coordinator`.

## Анотації, що використовуються для аудиту {#annotations-used-for-audit}

<!-- sorted by annotation -->

- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`validation.policy.admission.k8s.io/validation_failure`](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)

Дивіться більше деталей на сторінці [Анотації аудиту](/docs/reference/labels-annotations-taints/audit-annotations/).

## kubeadm

### kubeadm.alpha.kubernetes.io/cri-socket (deprecated) {#kubeadm-alpha-kubernetes-io-cri-socket}

Тип: Annotation

Приклад: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

Використовується для: Node

{{< note >}}
Починаючи з v1.34, ця анотація застаріла, kubeadm більше не буде встановлювати та використовувати її.
{{< /note >}}

### kubeadm.kubernetes.io/etcd.advertise-client-urls

Тип: Annotation

Приклад: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

Використовується для: Pod

Анотація, яку kubeadm додає до локально керованих Podʼів etcd для відстеження списку URL-адрес, до яких повинні підключатися клієнти etcd. Це використовується головним чином для перевірки стану справності кластера etcd.

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint

Тип: Annotation

Приклад: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

Використовується для: Pod

Анотація, яку kubeadm додає до локально керованих Podʼів `kube-apiserver` для відстеження оголошеної адреси/порту для цього екземпляра API-сервера.

### kubeadm.kubernetes.io/component-config.hash

Тип: Annotation

Приклад: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

Використовується для: ConfigMap

Анотація, яку kubeadm додає до ConfigMapʼів, що ним керуються для налаштування компонентів. Вона містить хеш (SHA-256), який використовується для визначення, чи застосував користувач налаштування, відмінні від стандартних налаштувань для конкретного компонента.

### node-role.kubernetes.io/control-plane

Тип: Label

Використовується для: Node

Мітка-маркер, що вказує, що вузол використовується для запуску компонентів панелі управління. Інструмент kubeadm застосовує цю мітку до вузлів панелі управління, якими він керує. Інші інструменти управління кластером зазвичай також встановлюють це позачення.

Ви можете позначити вузли панелі управління цією міткою, щоб спростити розміщення Podʼів лише на цих вузлах або уникнути запуску Podʼів на панелі управління. Якщо ця мітка встановлена, [контролер EndpointSlice](/docs/concepts/services-networking/topology-aware-routing/#implementation-control-plane) ігнорує цей вузол під час розрахунку підказок, що враховують топологію.

### node-role.kubernetes.io/*

Тип: Label

Приклад: `node-role.kubernetes.io/gpu: gpu`

Використовується для: Node

Ця необовʼязкова мітка застосовується до вузла, коли ви хочете позначити роль вузла. Роль вузла (текст після `/` у ключі мітки) можна встановити, якщо загальний ключ відповідає правилам [синтаксису](/docs/concepts/oview/working-with-objects/labels/#syntax-and-character-set) для міток обʼєктів.

У Kubernetes визначено одну специфічну роль вузла, **панель управління**. Мітка, яку ви можете використовувати для позначення цієї ролі вузла, має вигляд [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane).

### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

Тип: Taint

Приклад: `node-role.kubernetes.io/control-plane:NoSchedule`

Використовується для: Node

Позначення, що kubeadm накладає на вузли панелі управління для обмеження розміщення Podʼів і дозволяє розміщувати на них лише певні Podʼи.

Якщо це позначення застосовано, вузли панелі управління дозволяють розміщувати у себе лише критичні навантаження. Ви можете видалити це позначення вручну за допомогою такої команди на відповідному вузлі.

```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/control-plane:NoSchedule-
```

### node-role.kubernetes.io/master (deprecated) {#node-role-kubernetes-io-master-taint}

Тип: Taint

Використовується для: Node

Приклад: `node-role.kubernetes.io/master:NoSchedule`

Позначення, що раніше kubeadm застосовував на вузли панелі управління, щоб дозволити розміщувати на них лише критичні навантаження. Замінений позначенням [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint). kubeadm більше не встановлює або не використовує це застаріле позначення.

### resource.kubernetes.io/admin-access {resource-kubernetes-io-admin-access}

Тип: Label

Приклад: `resource.kubernetes.io/admin-access: "true"`

Використовується для:: Namespace

Використовується для надання адміністративного доступу до певних типів API resource.k8s.io у просторі імен. Коли ця мітка встановлена у просторі імен зі значенням `”true"` (чутливою до регістру), вона дозволяє використання `adminAccess: true` для будь-яких типів API у просторі імен `resource.k8s.io`. Наразі цей дозвіл застосовується до обʼєктів `ResourceClaim` та `ResourceClaimTemplate`.

Докладнішу інформацію див. у статті [Доступ адміністратора до динамічного розподілу ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#enabling-admin-access).
