---
api_metadata:
  apiVersion: "autoscaling/v2"
  import: "k8s.io/api/autoscaling/v2"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "HorizontalPodAutoscaler — це конфігурація для горизонтального автомасштабування, яка автоматично керує кількістю реплік будь-якого ресурсу, що реалізує субресурс масштабування, на основі вказаних метрик."
title: "HorizontalPodAutoscaler"
weight: 13
auto_generated: false
---

`apiVersion: autoscaling/v2`

`import "k8s.io/api/autoscaling/v2"`

## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

HorizontalPodAutoscaler — це конфігурація для горизонтального автомасштабування, яка автоматично керує кількістю реплік будь-якого ресурсу, що реалізує субресурс масштабування, на основі вказаних метрик.

---

Зрозуміло, ось переклад без формату YAML:

- **apiVersion**: autoscaling/v2

- **kind**: HorizontalPodAutoscaler

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>):

  metadata — стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>):

  spec — специфікація поведінки автомасштабування. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>):

  status містить поточну інформацію про автомасштабування.

## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

HorizontalPodAutoscalerSpec описує бажану функціональність HorizontalPodAutoscaler.

---

- **maxReplicas** (int32), обовʼязково

  maxReplicas — верхня межа кількості реплік, до якої може масштабуватись автомасштабувальник. Не може бути менше minReplicas.

- **scaleTargetRef** (CrossVersionObjectReference), обовʼязково

  scaleTargetRef вказує на цільовий ресурс для масштабування і використовується для збору метрик для Podʼів, а також для зміни кількості реплік.

  <a name="CrossVersionObjectReference"></a>
  *CrossVersionObjectReference містить достатньо інформації для ідентифікації вказаного ресурсу.*

  - **scaleTargetRef.kind** (string), обовʼязково

    kind — тип вказаного ресурсу; Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  - **scaleTargetRef.name** (string), обовʼязково

    name — назва вказаного ресурсу; Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

  - **scaleTargetRef.apiVersion** (string)

    apiVersion — версія API вказаного ресурсу

- **minReplicas** (int32)

  minReplicas — нижня межа кількості реплік, до якої може масштабуватись автомасштабувальник. Стандартне значення — 1 Pod. minReplicas може бути 0, якщо ввімкнути альфа-функцію HPAScaleToZero і налаштувати щонайменше одну метрику типу Object або External. Масштабування активне, поки є принаймні одне значення метрики.

- **behavior** (HorizontalPodAutoscalerBehavior)

  behavior — налаштовує поведінку масштабування цільового ресурсу як в напрямку збільшення, так і в напрямку зменшення (поля scaleUp та scaleDown відповідно). Якщо не вказано, будуть використані типові правила масштабування HPAScalingRules для збільшення і зменшення.

  <a name="HorizontalPodAutoscalerBehavior"></a>
  *HorizontalPodAutoscalerBehavior налаштовує поведінку масштабування цільового ресурсу як в напрямку збільшення, так і в напрямку зменшення (поля scaleUp та scaleDown відповідно).*

  - **behavior.scaleDown** (HPAScalingRules)

    scaleDown — політика масштабування для зменшення. Якщо не встановлено, типове значення дозволяє зменшувати до minReplicas Podʼів з вікном стабілізації 300 секунд (тобто використовується найкраще рекомендоване значення за останні 300 секунд).

    <a name="HPAScalingRules"></a>
    *HPAScalingRules налаштовує поведінку масштабування для одного напрямку за допомогою правил політики масштабування та метрики допуску, що налаштовується.*

    *Правила політики масштабування застосовуються після обчислення DesiredReplicas з метрик для HPA. Вони можуть обмежувати швидкість масштабування, вказуючи політики масштабування. Вони можуть запобігти стрибкоподібному масштабуванню, вказавши вікно стабілізації, щоб кількість реплік не встановлювалася миттєво, натомість вибиралося найбезпечніше значення з вікна стабілізації.*

    *Допуск застосовується до значень метрики і запобігає надто швидкому масштабуванню при невеликих змінах метрики. (Зауважте, що встановлення допуску вимагає функціональної можливості бета-версії HPAConfigurableTolerance).*

    - **behavior.scaleDown.policies** ([]HPAScalingPolicy)

      *Atomic: will be replaced during a merge*

      policies — список потенційних політик масштабування, які можуть використовуватись під час масштабування. Якщо не встановлено, використовуйте стандартні значення:

      - Для збільшення масштабу: дозволити подвоєння кількості pods або абсолютну зміну на 4 podʼів у 15-секундному вікні.
      - Для зменшення масштабу: дозволити видалення всіх podʼів у 15 секундному вікні.

      <a name="HPAScalingPolicy"></a>
      *HPAScalingPolicy — це одна політика, яка повинна виконуватися для вказаного інтервалу в минулому.*

      - **behavior.scaleDown.policies.type** (string), обовʼязково

        type — використовується для зазначення політики масштабування.

      - **behavior.scaleDown.policies.value** (int32), обовʼязково

        value — містить кількість зміни, що дозволяється політикою. Вона повинна бути більше нуля.

      - **behavior.scaleDown.policies.periodSeconds** (int32), обовʼязково

        periodSeconds — визначає вікно часу, протягом якого політика повинна бути true. PeriodSeconds повинен бути більше нуля і менше або рівний 1800 (30 хвилин).

    - **behavior.scaleDown.selectPolicy** (string)

      selectPolicy — використовується для зазначення того, яка політика повинна бути використана. Якщо не встановлено, використовується типове значення Max.

    - **behavior.scaleDown.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds — кількість секунд, протягом яких враховуються попередні рекомендації під час збільшення або зменшення масштабування. stabilizationWindowSeconds повинен бути більше або рівний нулю і менше або рівний 3600 (одна година). Якщо не встановлено, використовуються типові значення:

      - Для збільшення масштабування: 0 (тобто стабілізація не виконується).
      - Для зменшення масштабування: 300 (тобто вікно стабілізації 300 секунд).

    - **behavior.scaleDown.tolerance** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Tolerance — допуск на співвідношення між поточним і бажаним значенням метрики, при якому не відбувається оновлення до бажаної кількості реплік (наприклад, 0.01 для 1%). Має бути більше або дорівнювати нулю. Якщо не встановлено, застосовується стандартний допуск для всього кластера ( стандартно 10%).

      Наприклад, якщо автомасштабування налаштовано з цільовим споживанням памʼяті 100Mi, а допуски на зменшення і збільшення масштабу становлять 5% і 1% відповідно, масштабування спрацює, коли фактичне споживання опуститься нижче 95Mi або перевищить 101Mi.

      Це бета-поле і вимагає щоб функціональна можливість HPAConfigurableTolerance була увімкенан.

  - **behavior.scaleUp** (HPAScalingRules)

    scaleUp — це політика масштабування вгору. Якщо не встановлено, використовується стандартне значення, яке є найбільшим з:

    - збільшення не більше ніж на 4 Podʼи за 60 секунд
    - подвоєння кількості Podʼів за 60 секунд

    Стабілізація не використовується.

    <a name="HPAScalingRules"></a>
    *HPAScalingRules налаштовує поведінку масштабування для одного напрямку за допомогою правил політики масштабування та метрики допуску, що налаштовується.*

    *Правила політики масштабування застосовуються після обчислення DesiredReplicas з метрик для HPA. Вони можуть обмежувати швидкість масштабування, вказуючи політики масштабування. Вони можуть запобігти стрибкоподібному масштабуванню, вказавши вікно стабілізації, щоб кількість реплік не встановлювалася миттєво, натомість вибиралося найбезпечніше значення з вікна стабілізації.*

    *Допуск застосовується до значень метрики і запобігає надто швидкому масштабуванню при невеликих змінах метрики. (Зауважте, що встановлення допуску вимагає функціональної можливості бета-версії HPAConfigurableTolerance).*

    - **behavior.scaleUp.policies** ([]HPAScalingPolicy)

      *Atomic: буде замінено під час обʼєднання*

      policies — список потенційних політик масштабування, які можуть використовуватись під час масштабування. Якщо не встановлено, використовуйте стандартні значення:

      - Для збільшення масштабу: дозволити подвоєння кількості pods або абсолютну зміну на 4 podʼів у 15-секундному вікні.
      - Для зменшення масштабу: дозволити видалення всіх podʼів у 15 секундному вікні.

      <a name="HPAScalingPolicy"></a>
      *HPAScalingPolicy — це окрема політика, якої треба має бути true протягом заданого інтервалу в минулому.*

      - **behavior.scaleUp.policies.type** (string), обовʼязково

        type — використовується для зазначення політики масштабування.

      - **behavior.scaleUp.policies.value** (int32), обовʼязково

        value — містить кількість змін, дозволених політикою. Значення має бути більше нуля.

      - **behavior.scaleUp.policies.periodSeconds** (int32), обовʼязково

        periodSeconds визначає вікно часу, протягом якого політика має бути true. PeriodSeconds має бути більше нуля та менше або дорівнювати 1800 (30 хвилин).

    - **behavior.scaleUp.selectPolicy** (string)

      selectPolicy використовується для вказівки, яка політика має бути використана. Якщо не встановлено, використовується стандартне значення Max.

    - **behavior.scaleUp.stabilizationWindowSeconds** (int32)

      stabilizationWindowSeconds — це кількість секунд, протягом яких минулі рекомендації мають враховуватися під час масштабування вгору або вниз. StabilizationWindowSeconds має бути більше або дорівнювати нулю та менше або дорівнювати 3600 (одна година). Якщо не встановлено, використовуються стандартні значення:

      - Для масштабування вгору: 0 (тобто стабілізація не виконується).
      - Для масштабування вниз: 300 (тобто вікно стабілізації триває 300 секунд).

    - **behavior.scaleUp.tolerance** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Tolerance — допуск на співвідношення між поточним і бажаним значенням метрики, при якому не відбувається оновлення до бажаної кількості реплік (наприклад, 0.01 для 1%). Має бути більше або дорівнювати нулю. Якщо не встановлено, застосовується стандартний допуск для всього кластера ( стандартно 10%).

      Наприклад, якщо автомасштабування налаштовано з цільовим споживанням памʼяті 100Mi, а допуски на зменшення і збільшення масштабу становлять 5% і 1% відповідно, масштабування спрацює, коли фактичне споживання опуститься нижче 95Mi або перевищить 101Mi.

      Це бета-поле і вимагає функціональної можливості HPAConfigurableTolerance.

- **metrics** ([]MetricSpec)

  *Atomic: буде замінено під час обʼєднання*

  metrics містить специфікації для обчислення бажаної кількості реплік (буде використана максимальна кількість реплік за всіма метриками). Бажана кількість реплік обчислюється множенням відношення між цільовим значенням та поточним значенням на поточну кількість Podʼів. Таким чином, метрики, що використовуються, мають зменшуватися зі збільшенням кількості Podʼів, і навпаки. Дивіться індивідуальні типи джерел метрик для отримання додаткової інформації про те, як кожен тип метрик має реагувати. Якщо не встановлено, стандартна метрика з буде встановлена на 80% середнього використання CPU.

  <a name="MetricSpec"></a>
  *MetricSpec визначає, як масштабуватися на основі однієї метрики (лише `type` та одне інше відповідне поле мають бути встановлені одночасно).*

  - **metrics.type** (string), обовʼязково

    type — тип джерела метрики. Має бути одним з "ContainerResource", "External", "Object", "Pods" або "Resource", кожен з яких відповідає відповідному полю в обʼєкті.

  - **metrics.containerResource** (ContainerResourceMetricSource)

    containerResource стосується метрики ресурсу (наприклад, ті, що вказані в запитах і лімітах), відомої Kubernetes, яка описує один контейнер у кожному Podʼі поточного цільового масштабу (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додаток до тих, що доступні для звичайних метрик на кожен Pod за допомогою джерела "pods".

    <a name="ContainerResourceMetricSource"></a>
    *ContainerResourceMetricSource вказує, як масштабуватися на основі метрики ресурсу, відомої Kubernetes, як вказано в запитах і лімітах, описуючи кожен Pod у поточному цільовому масштабі (наприклад, CPU або памʼять). Значення будуть усереднені перед порівнянням з цільовим значенням. Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додаток до тих, що доступні для звичайних метрик на кожен Pod за допомогою джерела "pods". Має бути встановлений лише один тип "target".*

    - **metrics.containerResource.container** (string), обовʼязково

      container — це назва контейнера в Podʼах цільового масштабу.

    - **metrics.containerResource.name** (string), обовʼязково

      name — це назва відповідного ресурсу.

    - **metrics.containerResource.target** (MetricTarget), обовʼязково

      target — визначає цільове значення для даної метрики.

      <a name="MetricTarget"></a>
      *MetricTarget визначає цільове значення, середнє значення або середнє використання певної метрики.*

      - **metrics.containerResource.target.type** (string), обовʼязково

        type — представляє, чи є тип метрики Utilization, Value або AverageValue.

      - **metrics.containerResource.target.averageUtilization** (int32)

        averageUtilization — це цільове значення середнього значення метрики ресурсу по всім відповідним Podʼам, представлене у відсотках від запитуваного значення ресурсу для Podʼів. Наразі дійсно лише для типу джерела метрики Resource.

      - **metrics.containerResource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue – це цільове значення середнього значення метрики по всім відповідним Podʼам (як кількість).

      - **metrics.containerResource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це цільове значення метрики (як кількість).

  - **metrics.external** (ExternalMetricSource)

    external стосується глобальної метрики, яка не повʼязана з жодним обʼєктом Kubernetes. Це дозволяє автоматичне масштабування на основі інформації, що надходить від компонентів, які працюють за межами кластера (наприклад, довжина черги у хмарному сервісі обміну повідомленнями або QPS від балансувальника навантаження, що працює за межами кластера).

    <a name="ExternalMetricSource"></a>
    *ExternalMetricSource вказує, як масштабуватися на основі метрики, не повʼязаної з жодним обʼєктом Kubernetes (наприклад, довжина черги у хмарному сервісі обміну повідомленнями або QPS від балансувальника навантаження, що працює за межами кластера).*

    - **metrics.external.metric** (MetricIdentifier), обовʼязково

      metric — визначає цільову метрику за назвою та селектором.

      <a name="MetricIdentifier"></a>
      *MetricIdentifier визначає назву та, за потреби, селектор для метрики.*

      - **metrics.external.metric.name** (string), обовʼязково

        name — це назва даної метрики.

      - **metrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector — це строкове кодування стандартного селектора міток Kubernetes для даної метрики. Якщо встановлено, він передається як додатковий параметр серверу метрик для більш специфічного вибору метрик. Якщо не встановлено, для збору метрик буде використовуватися лише назва метрики.

    - **metrics.external.target** (MetricTarget), обовʼязково

      target — визначає цільове значення для даної метрики.

      <a name="MetricTarget"></a>
      *MetricTarget визначає цільове значення, середнє значення або середнє використання певної метрики.*

      - **metrics.external.target.type** (string), обовʼязково

        type — представляє, чи є тип метрики Utilization, Value або AverageValue.

      - **metrics.external.target.averageUtilization** (int32)

        averageUtilization — це цільове значення середнього значення метрики ресурсу по всім відповідним Podʼам, представлене у відсотках від запитуваного значення ресурсу для Podʼів. Наразі дійсно лише для типу джерела метрики Resource.

      - **metrics.external.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це цільове значення середнього значення метрики по всім відповідним Podʼам (як кількість).

      - **metrics.external.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value – це цільове значення метрики (як кількість).

  - **metrics.object** (ObjectMetricSource)

    object — стосується метрики, що описує один обʼєкт Kubernetes (наприклад, кількість запитів на секунду на обʼєкті Ingress).

    <a name="ObjectMetricSource"></a>
    *ObjectMetricSource вказує, як масштабуватися на основі метрики, що описує обʼєкт Kubernetes (наприклад, кількість запитів на секунду на обʼєкті Ingress).*

    - **metrics.object.describedObject** (CrossVersionObjectReference), обовʼязково

      describedObject визначає опис обʼєкта, такого як тип, імʼя та версія API.

      <a name="CrossVersionObjectReference"></a>
      *CrossVersionObjectReference містить достатньо інформації для ідентифікації відповідного ресурсу.*

      - **metrics.object.describedObject.kind** (string), обовʼязково

        kind — це тип посилання; Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

      - **metrics.object.describedObject.name** (string), обовʼязково

        name — це імʼя посилання; Додаткова інформація: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **metrics.object.describedObject.apiVersion** (string)

        apiVersion — це версія API посилання.

    - **metrics.object.metric** (MetricIdentifier), обовʼязково

      metric — визначає цільову метрику за назвою та селектором.

      <a name="MetricIdentifier"></a>
      *MetricIdentifier визначає назву та, за потреби, селектор для метрики.*

      - **metrics.object.metric.name** (string), обовʼязково

        name — це назва даної метрики.

      - **metrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector — це строкове кодування стандартного селектора міток Kubernetes для даної метрики. Якщо встановлено, він передається як додатковий параметр серверу метрик для більш специфічного вибору метрик. Якщо не встановлено, для збору метрик буде використовуватися лише назва метрики.

    - **metrics.object.target** (MetricTarget), обовʼязково

      target — визначає цільове значення для даної метрики.

      <a name="MetricTarget"></a>
      *MetricTarget визначає цільове значення, середнє значення або середнє використання певної метрики.*

      - **metrics.object.target.type** (string), обовʼязково

        type — представляє, чи є тип метрики Utilization, Value або AverageValue.

      - **metrics.object.target.averageUtilization** (int32)

        averageUtilization — цільове значення середнього значення метрики ресурсу по всім відповідним Podʼам, представлене у відсотках від запитуваного значення ресурсу для Podʼів. Наразі дійсно лише для типу джерела метрики Resource.

      - **metrics.object.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — цільове значення середнього значення метрики по всім відповідним Podʼам (як кількість).

      - **metrics.object.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — цільове значення метрики (як кількість).

  - **metrics.pods** (PodsMetricSource)

    pods — стосується метрики, що описує кожен Pod у поточному цільовому масштабі (наприклад, кількість транзакцій на секунду). Значення будуть усереднені перед порівнянням з цільовим значенням.

    <a name="PodsMetricSource"></a>
    *PodsMetricSource вказує, як масштабуватися на основі метрики, що описує кожен Pod у поточному цільовому масштабі (наприклад, кількість транзакцій на секунду). Значення будуть усереднені перед порівнянням з цільовим значенням.*

    - **metrics.pods.metric** (MetricIdentifier), обовʼязково

      metric — визначає цільову метрику за назвою та селектором.

      <a name="MetricIdentifier"></a>
      *MetricIdentifier визначає назву та, за потреби, селектор для метрики.*

      - **metrics.pods.metric.name** (string), обовʼязково

        name — це назва даної метрики.

      - **metrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector — це строкове кодування стандартного селектора міток Kubernetes для даної метрики. Якщо встановлено, він передається як додатковий параметр серверу метрик для більш специфічного вибору метрик. Якщо не встановлено, для збору метрик буде використовуватися лише назва метрики.

    - **metrics.pods.target** (MetricTarget), обовʼязково

      target визначає цільове значення для даної метрики.

      <a name="MetricTarget"></a>
      *MetricTarget визначає цільове значення, середнє значення або середнє використання певної метрики.*

      - **metrics.pods.target.type** (string), обовʼязково

        type — представляє, чи є тип метрики Utilization, Value або AverageValue.

      - **metrics.pods.target.averageUtilization** (int32)

        averageUtilization — це цільове значення середнього значення метрики ресурсу по всім відповідним Podʼам, представлене у відсотках від запитуваного значення ресурсу для Podʼів. Наразі дійсно лише для типу джерела метрики Resource.

      - **metrics.pods.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це цільове значення середнього значення метрики по всім відповідним Podʼам (як кількість).

      - **metrics.pods.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це цільове значення метрики (як кількість).

  - **metrics.resource** (ResourceMetricSource)

    resource — стосується метрики ресурсу (наприклад, ті, що вказані в запитах і лімітах), відомої Kubernetes, яка описує кожен  у поточному цільовому масштабі (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додаток до тих, що доступні для звичайних метрик на кожен  за допомогою джерела "pods".

    <a name="ResourceMetricSource"></a>
    *ResourceMetricSource вказує, як масштабуватися на основі метрики ресурсу, відомої Kubernetes, як вказано в запитах і лімітах, описуючи кожен у поточному цільовому масштабі (наприклад, CPU або памʼять). Значення будуть усереднені перед порівнянням з цільовим значенням.  Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додаток до тих, що доступні для звичайних метрик на кожен под за допомогою джерела "pods". Повинен бути встановлений лише один тип "target".*

    - **metrics.resource.name** (string), обовʼязково

      name — це назва ресурсу.

    - **metrics.resource.target** (MetricTarget), обовʼязково

      target — визначає цільове значення для даної метрики.

      <a name="MetricTarget"></a>
      *MetricTarget визначає цільове значення, середнє значення або середнє використання певної метрики.*

      - **metrics.resource.target.type** (string), обовʼязково

        type представляє, чи є тип метрики Utilization, Value або AverageValue.

      - **metrics.resource.target.averageUtilization** (int32)

        averageUtilization — це цільове значення середнього значення метрики ресурсу по всім відповідним Podʼам, представлене у відсотках від запитуваного значення ресурсу для Podʼів. Наразі дійсно лише для типу джерела метрики Resource.

      - **metrics.resource.target.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це цільове значення середнього значення метрики по всім відповідним Podʼам (як кількість).

      - **metrics.resource.target.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value —це цільове значення метрики (як кількість).

## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

HorizontalPodAutoscalerStatus описує поточний стан горизонтального автомасштабувальника Podʼів.

---

- **desiredReplicas** (int32), обовʼязково

  desiredReplicas — це бажана кількість реплік Podʼів, якими керує цей автомасштабувальник, відповідно до останнього обчислення автомасштабувальника.

- **conditions** ([]HorizontalPodAutoscalerCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: під час обʼєднання зберігатимуться унікальні значення за ключем type*

  conditions — це набір станів, необхідних для масштабування цільового обʼєкта автомасштабувальником, та вказує, чи було їх досягнуто.

  <a name="HorizontalPodAutoscalerCondition"></a>
  *HorizontalPodAutoscalerCondition описує стан HorizontalPodAutoscaler у певний момент часу.*

  - **conditions.status** (string), обовʼязково

    status — це статус стану (True, False, Unknown)

  - **conditions.type** (string), обовʼязково

    type описує поточний стан

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime — це останній час, коли стан перейшла з одного стану в інший

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    message - це зрозуміле людині пояснення, що містить деталі про зміну стану

  - **conditions.reason** (string)

    reason — це причина останньї зміни стану.

- **currentMetrics** ([]MetricStatus)

  *Atomic: буде замінено під час обʼєднання*

  currentMetrics — це останній прочитаний статус метрик, які використовує цей автомасштабувальник.

  <a name="MetricStatus"></a>
  *MetricStatus описує останній прочитаний статус окремої метрики.*

  - **currentMetrics.type** (string), обовʼязково

    type — це тип джерела метрики. Це буде один з "ContainerResource", "External", "Object", "Pods" або "Resource", кожен з яких відповідає відповідному полю в обʼєкті.

  - **currentMetrics.containerResource** (ContainerResourceMetricStatus)

    container resource стосується метрики ресурсу (такої як зазначено в запитах та обмеженнях), відомої Kubernetes, що описує окремий контейнер у кожному Podʼі в поточному цільовому масштабуванні (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні опції масштабування, окрім тих, що доступні для звичайних метрик на кожен Pod, використовуючи джерело "pods".

    <a name="ContainerResourceMetricStatus"></a>
    *ContainerResourceMetricStatus вказує поточне значення метрики ресурсу, відомої Kubernetes, як зазначено в запитах та обмеженнях, що описує окремий контейнер у кожному Podʼі в поточному цільовому масштабуванні (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні опції масштабування, окрім тих, що доступні для звичайних метрик на кожен Pod, використовуючи джерело "pods".*

    - **currentMetrics.containerResource.container** (string), обовʼязково

      container — це імʼя контейнера в Podʼах цільового масштабування

    - **currentMetrics.containerResource.current** (MetricValueStatus), обовʼязково

      current — містить поточне значення для даної метрики

      <a name="MetricValueStatus"></a>
      *MetricValueStatus містить поточне значення метрики*

      - **currentMetrics.containerResource.current.averageUtilization** (int32)

        currentAverageUtilization — це поточне значення середнього використання метрики ресурсу серед усіх відповідних Podʼів, представлене у відсотках від запитаного значення ресурсу для Podʼів.

      - **currentMetrics.containerResource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це поточне середнє значення метрики серед усіх відповідних Podʼів (як кількість)

      - **currentMetrics.containerResource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це поточне значення метрики (як кількість).

    - **currentMetrics.containerResource.name** (string), обовʼязково

      name — це імʼя ресурсу, про який йдеться.

  - **currentMetrics.external** (ExternalMetricStatus)

    external стосується глобальної метрики, яка не повʼязана з жодним обʼєктом Kubernetes. Вона дозволяє автомасштабування на основі інформації, що надходить від компонентів, що працюють за межами кластера (наприклад, довжина черги у хмарному сервісі обміну повідомленнями або QPS від балансувальника навантаження, що працює за межами кластера).

    <a name="ExternalMetricStatus"></a>
    *ExternalMetricStatus вказує поточне значення глобальної метрики, не повʼязаної з жодним обʼєктом Kubernetes.*

    - **currentMetrics.external.current** (MetricValueStatus), обовʼязково

      current — містить поточне значення для даної метрики

      <a name="MetricValueStatus"></a>
      *MetricValueStatus містить поточне значення метрики*

      - **currentMetrics.external.current.averageUtilization** (int32)

        currentAverageUtilization — це поточне значення середнього використання метрики ресурсу серед усіх відповідних Podʼів, представлене у відсотках від запитаного значення ресурсу для Podʼів.

      - **currentMetrics.external.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це поточне середнє значення метрики серед усіх відповідних Podʼів (як кількість)

      - **currentMetrics.external.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це поточне значення метрики (як кількість).

    - **currentMetrics.external.metric** (MetricIdentifier), обовʼязково

      metric — ідентифікує цільову метрику за імʼям і селектором

      <a name="MetricIdentifier"></a>
      *MetricIdentifier визначає імʼя та, за потреби, селектор для метрики*

      - **currentMetrics.external.metric.name** (string), обовʼязково

        name — це імʼя даної метрики

      - **currentMetrics.external.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector — це строково-кодована форма стандартного селектора міток Kubernetes для даної метрики. Коли встановлено, він передається як додатковий параметр до сервера метрик для більш специфічного вибору метрик. Коли не встановлено, буде використано лише metricName для збору метрик.

  - **currentMetrics.object** (ObjectMetricStatus)

    object стосується метрики, що описує окремий обʼєкт Kubernetes (наприклад, кількість запитів на секунду для обʼєкта Ingress).

    <a name="ObjectMetricStatus"></a>
    *ObjectMetricStatus вказує поточне значення метрики, що описує обʼєкт Kubernetes (наприклад, кількість запитів на секунду для обʼєкта Ingress).*

    - **currentMetrics.object.current** (MetricValueStatus), обовʼязково

      current — містить поточне значення для даної метрики

      <a name="MetricValueStatus"></a>
      *MetricValueStatus містить поточне значення метрики*

      - **currentMetrics.object.current.averageUtilization** (int32)

        currentAverageUtilization — це поточне значення середнього використання метрики ресурсу серед усіх відповідних Podʼів, представлене у відсотках від запитаного значення ресурсу для Podʼів.

      - **currentMetrics.object.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це поточне середнє значення метрики серед усіх відповідних Podʼів (як кількість)

      - **currentMetrics.object.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це поточне значення метрики (як кількість).

    - **currentMetrics.object.describedObject** (CrossVersionObjectReference), обовʼязково

      DescribedObject вказує описи обʼєкта, такі як kind, name, apiVersion

      <a name="CrossVersionObjectReference"></a>
      *CrossVersionObjectReference містить достатньо інформації, щоб ідентифікувати вказаний ресурс.*

      - **currentMetrics.object.describedObject.kind** (string), обовʼязково

        kind — це тип посилання; Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

      - **currentMetrics.object.describedObject.name** (string), обовʼязково

        name — це імʼя посилання; Більше інформації: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **currentMetrics.object.describedObject.apiVersion** (string)

        apiVersion — це версія API посилання

    - **currentMetrics.object.metric** (MetricIdentifier), обовʼязково

      metric — ідентифікує цільову метрику за імʼям і селектором

      <a name="MetricIdentifier"></a>
      *MetricIdentifier визначає імʼя та, за потреби, селектор для метрики*

      - **currentMetrics.object.metric.name** (string), обовʼязково

        name — це імʼя даної метрики

      - **currentMetrics.object.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector — це строково-кодована форма стандартного селектора міток Kubernetes для даної метрики. Коли встановлено, він передається як додатковий параметр до сервера метрик для більш специфічного вибору метрик. Коли не встановлено, буде використано лише metricName для збору метрик.

  - **currentMetrics.pods** (PodsMetricStatus)

    pods — стосується метрики, що описує кожен Pod у поточному цільовому масштабуванні (наприклад, кількість оброблених транзакцій на секунду). Значення буде усереднено перед порівнянням з цільовим значенням.

    <a name="PodsMetricStatus"></a>
    *PodsMetricStatus вказує поточне значення метрики, що описує кожен Pod у поточному цільовому масштабуванні (наприклад, кількість оброблених транзакцій на секунду).*

    - **currentMetrics.pods.current** (MetricValueStatus), обовʼязково

      current — містить поточне значення для даної метрики

      <a name="MetricValueStatus"></a>
      *MetricValueStatus містить поточне значення метрики*

      - **currentMetrics.pods.current.averageUtilization** (int32)

        currentAverageUtilization — це поточне значення середнього використання метрики ресурсу серед усіх відповідних Podʼів, представлене у відсотках від запитаного значення ресурсу для Podʼів.

      - **currentMetrics.pods.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це поточне значення середньої метрики серед усіх відповідних Podʼів (як кількість)

      - **currentMetrics.pods.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це поточне значення метрики (як кількість).

    - **currentMetrics.pods.metric** (MetricIdentifier), обовʼязково

      metric — ідентифікує цільову метрику за імʼям і селектором

      <a name="MetricIdentifier"></a>
      *MetricIdentifier визначає імʼя та, за потреби, селектор для метрики*

      - **currentMetrics.pods.metric.name** (string), обовʼязково

        name — це імʼя даної метрики

      - **currentMetrics.pods.metric.selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        selector — це строково-кодована форма стандартного селектора міток Kubernetes для даної метрики. Коли встановлено, він передається як додатковий параметр до сервера метрик для більш специфічного вибору метрик. Коли не встановлено, буде використано лише metricName для збору метрик.

  - **currentMetrics.resource** (ResourceMetricStatus)

    resource — стосується метрики ресурсу (такої як зазначено в запитах та обмеженнях), відомої Kubernetes, що описує кожен Pod у поточному цільовому масштабуванні (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні опції масштабування, окрім тих, що доступні для звичайних метрик на кожен Pod, використовуючи джерело "pods".

    <a name="ResourceMetricStatus"></a>
    *ResourceMetricStatus вказує поточне значення метрики ресурсу, відомої Kubernetes, як зазначено в запитах та обмеженнях, що описує кожен Pod у поточному цільовому масштабуванні (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні опції масштабування, окрім тих, що доступні для звичайних метрик на кожен Pod, використовуючи джерело "pods".*

    - **currentMetrics.resource.current** (MetricValueStatus), обовʼязково

      current містить поточне значення для даної метрики

      <a name="MetricValueStatus"></a>
      *MetricValueStatus містить поточне значення метрики*

      - **currentMetrics.resource.current.averageUtilization** (int32)

        currentAverageUtilization — це поточне значення середнього використання метрики ресурсу серед усіх відповідних Podʼів, представлене у відсотках від запитаного значення ресурсу для Podʼів.

      - **currentMetrics.resource.current.averageValue** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        averageValue — це поточне середнє значення метрики серед усіх відповідних Podʼів (як кількість)

      - **currentMetrics.resource.current.value** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

        value — це поточне значення метрики (як кількість).

    - **currentMetrics.resource.name** (string), обовʼязково

      name — це імʼя ресурсу, про який йдеться.

- **currentReplicas** (int32)

  currentReplicas — це поточна кількість реплік Podʼів, якими керує цей автомасштабувальник, як це було останній раз спостережено автомасштабувальником.

- **lastScaleTime** (Time)

  lastScaleTime — це останній час, коли HorizontalPodAutoscaler масштабував кількість Podʼів, використовується автомасштабувальником для контролю частоти зміни кількості Podʼів.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **observedGeneration** (int64)

  observedGeneration — це останнє покоління, яке спостерігав цей автомасштабувальник.

## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

HorizontalPodAutoscalerList — це список обʼєктів горизонтального автомасштабувальника Podʼів.

---

- **apiVersion**: autoscaling/v2

- **kind**: HorizontalPodAutoscalerList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata — це стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), обовʼязково

  items — це список обʼєктів горизонтального автомасштабувальника Podʼів.

## Операції {#operations}

---

### `get` отримати вказаний HorizontalPodAutoscaler {#get-read-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request}

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

### `get` отримати статус вказаного HorizontalPodAutoscaler {#get-read-status-of-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-1}

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу HorizontalPodAutoscaler {#list-list-or-watch-objects-of-kind-horizontalpodautoscaler}

#### HTTP запит {#http-request-2}

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

### `list` перелік або перегляд за обʼєктів типу HorizontalPodAutoscaler {#list-list-or-watch-objects-of-kind-horizontalpodautoscaler-1}

#### HTTP запит {#http-request-3}

GET /apis/autoscaling/v2/horizontalpodautoscalers

#### Параметри {#parameters-3}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

### `create` створення HorizontalPodAutoscaler {#create-create-a-horizontalpodautoscaler}

#### HTTP запит {#http-request-4}

POST /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

### `update` заміна вказаний HorizontalPodAutoscaler {#update-replace-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-5}

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного HorizontalPodAutoscaler {#update-replace-status-of-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-6}

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного HorizontalPodAutoscaler {#patch-partially-update-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-7}

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#patch" >}}">patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного HorizontalPodAutoscaler {#patch-partially-update-status-of-the-specified-horizontalpodautoscaler}

#### HTTP запит {#http-request-8}

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#patch" >}}">patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

### `delete` видалення HorizontalPodAutoscaler {#delete-delete-a-horizontalpodautoscaler}

#### HTTP запит {#http-request-9}

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя HorizontalPodAutoscaler

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-parameters/common-parameters#deleteOptions" >}}">deleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції HorizontalPodAutoscaler {#deletecollection-delete-collection-of-horizontalpodautoscaler}

#### HTTP запит {#http-request-10}

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри

- **namespace** (*в шляху*): string, обовʼязковий

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): булеве значення

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
