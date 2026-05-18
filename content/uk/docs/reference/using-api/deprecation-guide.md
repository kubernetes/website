---
title: "Посібник з міграції від застарілих API"
weight: 45
content_type: reference
---

<!-- overview -->

Під час еволюції API Kubernetes періодично переглядаються або оновлюються. Коли API розвиваються, старий API стає застарілим і, зрештою, вилучається. Ця сторінка містить інформацію, яку вам потрібно знати у випадку міграції від застарілих версій API на новіші та стабільніші версії API.

<!-- body -->

## Вилучені API в розрізі версій {#deprecated-apis-by-version}

### v1.32

У випуску **v1.32** перестали обслуговуватися наступні застарілі версії API:

#### Ресурси контролю потоку {#flowcontrol-resources-v132}

Версія API **flowcontrol.apiserver.k8s.io/v1beta3** FlowSchema та PriorityLevelConfiguration більше не обслуговуються починаючи з v1.32.

* Перенесіть маніфести та клієнти API на використання версії API **flowcontrol.apiserver.k8s.io/v1**, доступної з версії v1.29.
* Усі наявні збережені обʼєкти доступні через новий API
* Значні зміни у **flowcontrol.apiserver.k8s.io/v1**:
  * Поле `spec.limited.nominalConcurrencyShares` PriorityLevelConfiguration має стандартне значення 30, коли не вказане, і явне значення 0 не змінюється на 30.

### v1.29

У випуску **v1.29** перестали обслуговуватися наступні застарілі версії API:

#### Ресурси контролю потоку {#flowcontrol-resources-v129}

Версія API **flowcontrol.apiserver.k8s.io/v1beta2** FlowSchema та PriorityLevelConfiguration більше не обслуговується з версії v1.29.

* Перенесіть маніфести та клієнти API на використання версії API **flowcontrol.apiserver.k8s.io/v1**, доступної з версії v1.29, або версії API **flowcontrol.apiserver.k8s.io/v1beta3**, доступної з версії v1.26.
* Усі наявні збережені обʼєкти доступні через новий API
* Значні зміни в **flowcontrol.apiserver.k8s.io/v1**:
  * Поле `spec.limited.assuredConcurrencyShares` PriorityLevelConfiguration перейменоване на `spec.limited.nominalConcurrencyShares` і має стандартне значення 30, коли не вказане, і явне значення 0 не змінюється на 30.
* Значні зміни в **flowcontrol.apiserver.k8s.io/v1beta3**:
  * Поле `spec.limited.assuredConcurrencyShares` PriorityLevelConfiguration перейменоване на `spec.limited.nominalConcurrencyShares`

### v1.27

Випуск **v1.27** припинив обслуговування наступних застарілих версій API:

#### CSIStorageCapacity {#csistoragecapacity-v127}

Версія API CSIStorageCapacity **storage.k8s.io/v1beta1** більше не обслуговується з версії v1.27.

* Перенесіть маніфести та клієнти API на версію API **storage.k8s.io/v1**, доступну з версії v1.24.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

### v1.26

Випуск **v1.26** припинив обслуговування наступних застарілих версій API:

#### Ресурси керування потоком {#flowcontrol-resources-v126}

Версія API FlowSchema та PriorityLevelConfiguration **flowcontrol.apiserver.k8s.io/v1beta1** більше не обслуговується з версії v1.26.

* Перенесіть маніфести та клієнти API на версію API **flowcontrol.apiserver.k8s.io/v1beta2**.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v126}

Версія API HorizontalPodAutoscaler **autoscaling/v2beta2** більше не обслуговується з версії v1.26.

* Перенесіть маніфести та клієнти API на версію API **autoscaling/v2**, доступну з версії v1.23.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни:
  * `targetAverageUtilization` замінено на `target.averageUtilization` та `target.type: Utilization`. Див. [Автомасштабування за декількома метриками та власними метриками](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).

### v1.25

Випуск **v1.25** припинив обслуговування наступних застарілих версій API:

#### CronJob {#cronjob-v125}

Версія API CronJob **batch/v1beta1** більше не обслуговується з версії v1.25.

* Перенесіть маніфести та клієнти API на версію API **batch/v1**, доступну з версії v1.21.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

#### EndpointSlice {#endpointslice-v125}

Версія API EndpointSlice **discovery.k8s.io/v1beta1** більше не обслуговується з версії v1.25.

* Перенесіть маніфести та клієнти API на версію API **discovery.k8s.io/v1**, доступну з версії v1.21.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни в **discovery.k8s.io/v1**:
  * використовуйте поле `nodeName` для кожного Endpoint замість застарілого поля `topology["kubernetes.io/hostname"]`
  * використовуйте поле `zone` для кожного Endpoint замість застарілого поля `topology["topology.kubernetes.io/zone"]`
  * `topology` замінено полем `deprecatedTopology`, яке не доступне для запису у v1

#### Event {#event-v125}

Версія API Event **events.k8s.io/v1beta1** більше не обслуговується з версії v1.25.

* Перенесіть маніфести та клієнти API на версію API **events.k8s.io/v1**, доступну з версії v1.19.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни в **events.k8s.io/v1**:
  * `type` обмежено до `Normal` та `Warning`
  * `involvedObject` перейменовано в `regarding`
  * `action`, `reason`, `reportingController` та `reportingInstance` є обовʼязковими при створенні нових **events.k8s.io/v1** Events
  * використовуйте `eventTime` замість застарілого поля `firstTimestamp` (яке перейменовано в `deprecatedFirstTimestamp` та не допускається в нових **events.k8s.io/v1** Events)
  * використовуйте `series.lastObservedTime` замість застарілого поля `lastTimestamp` (яке перейменовано в `deprecatedLastTimestamp` та не допускається в нових **events.k8ерсіях API **events.k8s.io/v1** Events)
  * використовуйте `series.count` замість застарілого поля `count` (яке перейменовано в `deprecatedCount` та не допускається в нових **events.k8s.io/v1** Events)
  * використовуйте `reportingController` замість застарілого поля `source.component` (яке перейменовано в `deprecatedSource.component` та не допускається в нових **events.k8s.io/v1** Events)
  * використовуйте `reportingInstance` замість застарілого поля `source.host` (яке перейменовано в `deprecatedSource.host` та не допускається в нових **events.k8s.io/v1** Events)

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v125}

Версія API HorizontalPodAutoscaler **autoscaling/v2beta1** більше не обслуговується з версії v1.25.

* Перенесіть маніфести та клієнти API на версію API **autoscaling/v2**, доступну з версії v1.23.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни:
  * `targetAverageUtilization` замінено на `target.averageUtilization` та `target.type: Utilization`. Див. [Автомасштабування за декількома метриками та власними метриками](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics).

#### PodDisruptionBudget {#poddisruptionbudget-v125}

Версія API PodDisruptionBudget **policy/v1beta1** більше не обслуговується з версії v1.25.

* Перенесіть маніфести та клієнти API на версію API **policy/v1**, доступну з версії v1.21.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни в **policy/v1**:
  * пустий `spec.selector` (`{}`), записаний до `policy/v1` PodDisruptionBudget, вибирає всі теки в просторі імен (у `policy/v1beta1` пустий `spec.selector` не вибирав жодні теки). Неустановлений `spec.selector` вибирає жодні теки в обох версіях API.

#### PodSecurityPolicy {#psp-v125}

PodSecurityPolicy в версії API **policy/v1beta1** більше не обслуговується з версії v1.25, і контролер допуску PodSecurityPolicy буде видалено.

Перейдіть до [Pod Security Admission](/docs/concepts/security/pod-security-admission/) або [виклику стороннього вебхуку допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/). Для настанов з міграції, див. [Міграція з PodSecurityPolicy до вбудованого контролера допуску PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/). Для отримання додаткової інформації про застарілість, див. [ВPodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

#### RuntimeClass {#runtimeclass-v125}

RuntimeClass в версії API **node.k8s.io/v1beta1** більше не обслуговується з версії v1.25.

* Перенесіть маніфести та клієнти API на версію API **node.k8s.io/v1**, доступну з версії v1.20.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

### v1.22

Випуск **v1.22** припинив обслуговування наступних застарілих версій API:

#### Ресурси вебхуків {#webhook-resources-v122}

Версія API **admissionregistration.k8s.io/v1beta1** для MutatingWebhookConfiguration та ValidatingWebhookConfiguration більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **admissionregistration.k8s.io/v1**, доступну з версії v1.16.
* Усі наявні обʼєкти, які зберігаються, доступні через нові API
* Помітні зміни:
  * стандартно `webhooks[*].failurePolicy` змінено з `Ignore` на `Fail` для v1
  * стандартно `webhooks[*].matchPolicy` змінено з `Exact` на `Equivalent` для v1
  * стандартно `webhooks[*].timeoutSeconds` змінено з `30s` на `10s` для v1
  * поле `webhooks[*].sideEffects` стандартно видалено, і тепер воно обовʼязкове,
    і дозволяється лише `None` та `NoneOnDryRun` для v1
  * стандартно видалено значення поля `webhooks[*].admissionReviewVersions` та робиться обовʼязковим для v1 (підтримувані версії для AdmissionReview - `v1` та `v1beta1`)
  * поле `webhooks[*].name` повинно бути унікальним в списку для обʼєктів, створених через `admissionregistration.k8s.io/v1`

#### CustomResourceDefinition {#customresourcedefinition-v122}

Версія API **apiextensions.k8s.io/v1beta1** для CustomResourceDefinition більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **apiextensions.k8s.io/v1**, доступну з версії v1.16.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни:
  * поле `spec.scope` тепер не має станадртного значення `Namespaced` і повинно бути явно вказано
  * поле `spec.version` вилучено в v1; використовуйте замість цього `spec.versions`
  * поле `spec.validation` вилучено в v1; використовуйте замість цього `spec.versions[*].schema`
  * поле `spec.subresources` вилучено в v1; використовуйте замість цього `spec.versions[*].subresources`
  * поле `spec.additionalPrinterColumns` вилучено в v1; використовуйте замість цього `spec.versions[*].additionalPrinterColumns`
  * `spec.conversion.webhookClientConfig` переміщено в `spec.conversion.webhook.clientConfig` в v1
  * `spec.conversion.conversionReviewVersions` переміщено в `spec.conversion.webhook.conversionReviewVersions` в v1
  * поле `spec.versions[*].schema.openAPIV3Schema` тепер обовʼязкове при створенні обʼєктів CustomResourceDefinition для v1, і повинно бути [структурною схемою](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)
  * `spec.preserveUnknownFields: true` заборонено при створенні обʼєктів CustomResourceDefinition для v1; воно повинно бути вказано у визначеннях схем як `x-kubernetes-preserve-unknown-fields: true`
  * В елементах `additionalPrinterColumns` поле `JSONPath` перейменовано в `jsonPath` в v1
    (виправлення [#66531](https://github.com/kubernetes/kubernetes/issues/66531))

#### APIService {#apiservice-v122}

Версія API **apiregistration.k8s.io/v1beta1** для APIService більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **apiregistration.k8s.io/v1**, доступну з версії v1.10.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

#### TokenReview {#tokenreview-v122}

Версія API **authentication.k8s.io/v1beta1** для TokenReview більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **authentication.k8s.io/v1**, доступну з версії v1.6.
* Немає помітних змін

#### Ресурси SubjectAccessReview {#subjectaccessreview-resources-v122}

Версія API **authorization.k8s.io/v1beta1** для LocalSubjectAccessReview, SelfSubjectAccessReview, SubjectAccessReview та SelfSubjectRulesReview більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **authorization.k8s.io/v1**, доступну з версії v1.6.
* Помітні зміни:
  * Поле `spec.group` перейменовано на `spec.groups` в v1 (виправляє [#32709](https://github.com/kubernetes/kubernetes/issues/32709))

#### CertificateSigningRequest {#certificatesigningrequest-v122}

Версія API **certificates.k8s.io/v1beta1** для CertificateSigningRequest більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **certificates.k8s.io/v1**, доступну з версії v1.19.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни в `certificates.k8s.io/v1`:
  * Для API-клієнтів, що запитують сертифікати:
    * Поле `spec.signerName` тепер обовʼязкове
      (див. [відомі підписувачи Kubernetes](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)), і запити на `kubernetes.io/legacy-unknown` не дозволяються бути створеними через API `certificates.k8s.io/v1`
    * Поле `spec.usages` тепер обовʼязкове, не може містити дубльованих значень та повинно містити лише відомі використання
  * Для API-клієнтів, що схвалюють або підписують сертифікати:
    * `status.conditions` не може містити дублюються типи
    * `status.conditions[*].status` тепер обовʼязкове
    * `status.certificate` повинно бути в кодуванні PEM та містити лише блоки `CERTIFICATE`

#### Lease {#lease-v122}

Версія API **coordination.k8s.io/v1beta1** для Lease більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **coordination.k8s.io/v1**, доступну з версії v1.14.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

#### Ingress {#ingress-v122}

Версії API **extensions/v1beta1** та **networking.k8s.io/v1beta1** для Ingress більше не обслуговуються з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **networking.k8s.io/v1**, доступну з версії v1.19.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Помітні зміни:
  * Поле `spec.backend` перейменовано на `spec.defaultBackend`
  * Поле `serviceName` бекенду перейменовано на `service.name`
  * Числові поля `servicePort` бекенду перейменовані на `service.port.number`
  * Рядкові поля `servicePort` бекенду перейменовані на `service.port.name`
  * `pathType` тепер обовʼязковий для кожного вказаного шляху. Варіанти — `Prefix`, `Exact`, та `ImplementationSpecific`. Для відповідності невизначеній поведінці `v1beta1` використовуйте `ImplementationSpecific`.

#### IngressClass {#ingressclass-v122}

Версія API **networking.k8s.io/v1beta1** для IngressClass більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **networking.k8s.io/v1**, доступну з версії v1.19.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API
* Немає помітних змін

#### Ресурси RBAC {#rbac-resources-v122}

Версія API **rbac.authorization.k8s.io/v1beta1** для ClusterRole, ClusterRoleBinding,
Role та RoleBinding більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **rbac.authorization.k8s.io/v1**, доступну з версії v1.8.
* Усі наявні обʼєкти, які зберігаються, доступні через нові API
* Немає помітних змін

#### PriorityClass {#priorityclass-v122}

Версія API **scheduling.k8s.io/v1beta1** для PriorityClass більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **scheduling.k8s.io/v1**, доступну з версії v1.14.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API.
* Немає помітних змін.

#### Ресурси зберігання {#storage-resources-v122}

Версія API **storage.k8s.io/v1beta1** для CSIDriver, CSINode, StorageClass та VolumeAttachment більше не обслуговується з версії v1.22.

* Перенесіть маніфести та клієнти API на версію API **storage.k8s.io/v1**
  * CSIDriver доступний у **storage.k8s.io/v1** починаючи з версії v1.19.
  * CSINode доступний у **storage.k8s.io/v1** починаючи з версії v1.17.
  * StorageClass доступний у **storage.k8s.io/v1** починаючи з версії v1.6.
  * VolumeAttachment доступний у **storage.k8s.io/v1** з версії v1.13.
* Усі наявні обʼєкти, які зберігаються, доступні через нові API.
* Немає помітних змін.

### v1.16

Випуск **v1.16** припинив обслуговування наступних застарілих версій API:

#### Мережева політика {#networkpolicy-v116}

Версія API **extensions/v1beta1** для NetworkPolicy більше не обслуговується з версії v1.16.

* Перенесіть маніфести та клієнти API на версію API **networking.k8s.io/v1**, доступну з версії v1.8.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API.

#### DaemonSet {#daemonset-v116}

Версії API **extensions/v1beta1** та **apps/v1beta2** для DaemonSet більше не обслуговуються з версії v1.16.

* Перенесіть маніфести та клієнти API на версію API **apps/v1**, доступну з версії v1.9.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API.
* Помітні зміни:
  * `spec.templateGeneration` видалено.
  * `spec.selector` тепер є обовʼязковим і незмінним після створення; використовуйте наявні мітки шаблону як селектор для безшовного оновлення.
  * `spec.updateStrategy.type` тепер стандартно встановлено на `RollingUpdate`
    (стандартно в `extensions/v1beta1` було `OnDelete`).

#### Deployment {#deployment-v116}

Версії API **extensions/v1beta1**, **apps/v1beta1** та **apps/v1beta2** для Deployment більше не обслуговуються з версії v1.16.

* Перенесіть маніфести та клієнти API на версію API **apps/v1**, доступну з версії v1.9.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API.
* Помітні зміни:
  * `spec.rollbackTo` видалено.
  * `spec.selector` тепер є обовʼязковим і незмінним після створення; використовуйте наявні мітки шаблону як селектор для безшовного оновлення.
  * `spec.progressDeadlineSeconds` тепер стандартно встановлено на `600` секунд
    (стандартно в `extensions/v1beta1` було без крайнього терміну).
  * `spec.revisionHistoryLimit` тепер стандартно встановлено на `10`
    (стандартно в `apps/v1beta1` було `2`, стандартно в `extensions/v1beta1` було зберігати всі).
  * `maxSurge` та `maxUnavailable` тепер стандартно встановлено на `25%`
    (стандартно в `extensions/v1beta1` було `1`).

#### StatefulSet {#statefulset-v116}

Версії API **apps/v1beta1** та **apps/v1beta2** для StatefulSet більше не обслуговуються з версії v1.16.

* Перенесіть маніфести та клієнти API на версію API **apps/v1**, доступну з версії v1.9.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API.
* Помітні зміни:
  * `spec.selector` тепер є обовʼязковим і незмінним після створення; використовуйте наявні мітки шаблону як селектор для безшовного оновлення.
  * `spec.updateStrategy.type` тепер стандартно встановлено на `RollingUpdate` (в `apps/v1beta1` було `OnDelete`).

#### ReplicaSet {#replicaset-v116}

Версії API **extensions/v1beta1**, **apps/v1beta1** та **apps/v1beta2** для ReplicaSet більше не обслуговуються з версії v1.16.

* Перенесіть маніфести та клієнти API на версію API **apps/v1**, доступну з версії v1.9.
* Усі наявні обʼєкти, які зберігаються, доступні через новий API.
* Помітні зміни:
  * `spec.selector` тепер є обовʼязковим і незмінним після створення; використовуйте наявні мітки шаблону як селектор для безшовного оновлення.

#### PodSecurityPolicy {#psp-v116}

Версія API **extensions/v1beta1** для PodSecurityPolicy більше не обслуговується з версії v1.16.

* Перенесіть маніфести та клієнти API на версію API **policy/v1beta1**, доступну з версії v1.10.
* Зауважте, що версія API **policy/v1beta1** для PodSecurityPolicy буде видалена у версії v1.25.

## Що робити {#what-to-do}

### Тестування з вимкненими застарілими API {#testing-with-deprecated-apis-disabled}

Ви можете протестувати свої кластери, запустивши API сервер зі конкретними вимкненими версіями API, щоб змоделювати майбутні видалення. Додайте наступний прапорець до аргументів запуску API сервера:

`--runtime-config=<group>/<version>=false`

Наприклад:

`--runtime-config=admissionregistration.k8s.io/v1beta1=false,apiextensions.k8s.io/v1beta1,...`

### Пошук використання застарілих API {#locate-use-of-deprecated-apis}

Використовуйте [попередження клієнтів, метрики та інформацію аудиту, доступні в версії 1.19+](/blog/2020/09/03/warnings/#deprecation-warnings) для визначення використання застарілих API.

### Перехід на незастарілі API {#migrate-to-non-deprecated-apis}

* Оновіть власні інтеграції та контролери, щоб викликати незастарілі API.
* Змініть YAML файли, щоб вони посилалися на незастарілі API.

  Ви можете використовувати команду `kubectl convert` для автоматичного перетворення наявного обʼєкта:

  `kubectl convert -f <file> --output-version <group>/<version>`.

  Наприклад, щоб перетворити старий Deployment на `apps/v1`, ви можете виконати:

  `kubectl convert -f ./my-deployment.yaml --output-version apps/v1`

  Це перетворення може використовувати не ідеальні стандартні значення. Щоб дізнатися більше про конкретний ресурс, зверніться до [довідника API Kubernetes](/docs/reference/kubernetes-api/).

  {{< note >}}
  Інструмент `kubectl convert` не стандартно встановлюється, хоча раніше він був частиною самого `kubectl`. Для отримання додаткової інформації ви можете прочитати [питання про застарілість та видалення](https://github.com/kubernetes/kubectl/issues/725) для вбудованої підкоманди.

  Щоб дізнатися, як налаштувати `kubectl convert` на вашому компʼютері, відвідайте сторінку, яка відповідає вашій операційній системі:
  [Linux](/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin),
  [macOS](/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin) або
  [Windows](/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin).
  {{< /note >}}
