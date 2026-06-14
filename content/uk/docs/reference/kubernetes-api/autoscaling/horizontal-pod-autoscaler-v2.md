---
api_metadata:
  apiVersion: "autoscaling/v2"
  import: "k8s.io/api/autoscaling/v2"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "HorizontalPodAutoscaler є конфігурацією для горизонтального автомасштабувальника подів, який автоматично керує кількістю реплік будь-якого ресурсу, що реалізує субресурс масштабування, на основі вказаних метрик."
title: "HorizontalPodAutoscaler"
weight: 10
auto_generated: false
---

`apiVersion: autoscaling/v2`

`import "k8s.io/api/autoscaling/v2"`

## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

HorizontalPodAutoscaler є конфігурацією для горизонтального автомасштабувальника подів, який автоматично керує кількістю реплік будь-якого ресурсу, що реалізує субресурс масштабування, на основі вказаних метрик.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>metadata визначає стандартні метадані обʼєкта. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a>.</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a></em></td>
      <td>spec визначає специфікацію поведінки автомасштабувальника. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a>.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a></em></td>
      <td>status визначає поточну інформацію про автомасштабувальника.</td>
    </tr>
  </tbody>
</table>

## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

HorizontalPodAutoscalerSpec описує бажану функціональність HorizontalPodAutoscaler.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>behavior</code><br/><em><a href="{{< ref "#HorizontalPodAutoscalerBehavior" >}}">HorizontalPodAutoscalerBehavior</a></em></td>
      <td>behavior налаштовує поведінку масштабування цільового ресурсу в обох напрямках: вгору та вниз (поля scaleUp та scaleDown відповідно). Якщо не встановлено, використовуються стандартні правила HPAScalingRules для масштабування вгору та вниз.</td>
    </tr>
    <tr>
      <td><code>maxReplicas</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>maxReplicas це верхня межа для кількості реплік, до якої автомасштабувальник може масштабуватися вгору. Вона не може бути меншою за minReplicas.</td>
    </tr>
    <tr>
      <td><code>metrics</code><br/><em><a href="{{< ref "#MetricSpec" >}}">MetricSpec array</a></em></td>
      <td>metrics містить специфікації, які використовуються для обчислення бажаної кількості реплік (використовується максимальна кількість реплік серед усіх метрик). Бажана кількість реплік обчислюється шляхом множення співвідношення між цільовим значенням і поточним значенням на поточну кількість подів. Тобто, використані метрики повинні зменшуватися при збільшенні кількості подів і навпаки. Дивіться окремі типи джерел метрик для отримання додаткової інформації про те, як кожен тип метрики повинен реагувати. Якщо не встановлено, за замовчуванням буде встановлено метрику 80% середнього використання CPU.</td>
    </tr>
    <tr>
      <td><code>minReplicas</code><br/><em>integer</em></td>
      <td>minReplicas це нижня межа для кількості реплік, до якої автомасштабувальник може масштабуватися вниз. Стандартно встановлено 1 под. minReplicas може бути 0, якщо увімкнено альфа-функцію HPAScaleToZero і налаштовано принаймні одну метрику Object або External. Масштабування активне, поки доступне принаймні одне значення метрики.</td>
    </tr>
    <tr>
      <td><code>scaleTargetRef</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CrossVersionObjectReference" >}}">CrossVersionObjectReference</a></em></td>
      <td>scaleTargetRef вказує на цільовий ресурс для масштабування і використовується для збору метрик з подів, а також для фактичної зміни кількості реплік.</td>
    </tr>
  </tbody>
</table>

## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

HorizontalPodAutoscalerStatus описує поточний стан горизонтального автомасштабувальника подів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>conditions</code><br/><em><a href="{{< ref "#HorizontalPodAutoscalerCondition" >}}">HorizontalPodAutoscalerCondition array</a></em><br/><em>patch strategy: злиття за ключем <code>type</code></em></td>
      <td>conditions є набором умов, необхідних для того, щоб цей автомасштабувальник міг масштабувати свою ціль, і вказує, чи виконуються ці умови.</td>
    </tr>
    <tr>
      <td><code>currentMetrics</code><br/><em><a href="{{< ref "#MetricStatus" >}}">MetricStatus array</a></em></td>
      <td>currentMetrics є останнім прочитаним станом метрик, які використовуються цим автомасштабувальником.</td>
    </tr>
    <tr>
      <td><code>currentReplicas</code><br/><em>integer</em></td>
      <td>currentReplicas це поточна кількість реплік подів, якими керує цей автомасштабувальник, станом на останнє спостереження автомасштабувальника.</td>
    </tr>
    <tr>
      <td><code>desiredReplicas</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>desiredReplicas це бажана кількість реплік подів, якими керує цей автомасштабувальник, станом на останнє обчислення автомасштабувальником.</td>
    </tr>
    <tr>
      <td><code>lastScaleTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>lastScaleTime це останній час, коли горизонтальний автомасштабувальник подів змінив кількість подів, використовується автомасштабувальником для контролю частоти зміни кількості подів.</td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>observedGeneration це останнє покоління, спостережене цим автомасштабувальником.</td>
    </tr>
  </tbody>
</table>

## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

HorizontalPodAutoscalerList список обʼєктів горизонтального автомасштабувальника подів.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler array</a></em></td>
      <td>items це список обʼєктів горизонтального автомасштабувальника подів.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>metadata це стандартні метадані списку.</td>
    </tr>
  </tbody>
</table>

## ContainerResourceMetricSource {#ContainerResourceMetricSource}

ContainerResourceMetricSource показує, як масштабуватися за метрикою ресурсу, відомою Kubernetes, як зазначено в запитах і обмеженнях, описуючи кожен под у поточній цільовій групі масштабування (наприклад, CPU або памʼять). Значення будуть усереднені перед порівнянням з цільовим значенням. Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування поверх тих, що доступні для звичайних метрик для кожного пода, використовуючи джерело "pods". Повинно бути встановлено лише один тип "target".

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>container це назва контейнера в подах цільової групи масштабування</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name це назва ресурсу, про який йде мова.</td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricTarget" >}}">MetricTarget</a></em></td>
      <td>target визначає цільове значення для даної метрики</td>
    </tr>
  </tbody>
</table>

## ContainerResourceMetricStatus {#ContainerResourceMetricStatus}

ContainerResourceMetricStatus показує поточне значення метрики ресурсу, відомої Kubernetes, як зазначено в запитах і обмеженнях, описуючи один контейнер у кожному поді в поточній цільовій групі масштабування (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування поверх тих, що доступні для звичайних метрик для кожного пода, використовуючи джерело "pods".

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>container</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>container це назва контейнера в подах цільової групи масштабування</td>
    </tr>
    <tr>
      <td><code>current</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricValueStatus" >}}">MetricValueStatus</a></em></td>
      <td>current містить поточне значення для даної метрики</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name це назва ресурсу, про який йде мова.</td>
    </tr>
  </tbody>
</table>

## CrossVersionObjectReference {#CrossVersionObjectReference}

CrossVersionObjectReference містить достатньо інформації, щоб ідентифікувати посиланий ресурс.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>apiVersion це версія API референта</td>
    </tr>
    <tr>
      <td><code>kind</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>kind це тип референта; Більше інформації: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name це назва референта; Більше інформації: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a></td>
    </tr>
  </tbody>
</table>

## ExternalMetricSource {#ExternalMetricSource}

ExternalMetricSource вказує, як масштабувати за метрикою, яка не повʼязана з жодним обʼєктом Kubernetes (наприклад, довжина черги в хмарному сервісі обміну повідомленнями або QPS від балансувальника навантаження, що працює поза кластером).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>metric</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricIdentifier" >}}">MetricIdentifier</a></em></td>
      <td>metric визначає цільову метрику за назвою та селектором</td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricTarget" >}}">MetricTarget</a></em></td>
      <td>target визначає цільове значення для даної метрики</td>
    </tr>
  </tbody>
</table>

## ExternalMetricStatus {#ExternalMetricStatus}

ExternalMetricStatus показує поточне значення глобальної метрики, яка не повʼязана з жодним обʼєктом Kubernetes.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>current</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricValueStatus" >}}">MetricValueStatus</a></em></td>
      <td>current містить поточне значення для даної метрики</td>
    </tr>
    <tr>
      <td><code>metric</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricIdentifier" >}}">MetricIdentifier</a></em></td>
      <td>metric визначає цільову метрику за назвою та селектором</td>
    </tr>
  </tbody>
</table>

## HPAScalingPolicy {#HPAScalingPolicy}

HPAScalingPolicy є окремою політикою, яка повинна дотримуватися протягом зазначеного інтервалу часу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>periodSeconds</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>periodSeconds вказує вікно часу, протягом якого політика повинна дотримуватися. PeriodSeconds має бути більше нуля і менше або дорівнювати 1800 (30 хв).</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type використовується для вказівки політики масштабування.</td>
    </tr>
    <tr>
      <td><code>value</code>&nbsp;<strong>*</strong><br/><em>integer</em></td>
      <td>value містить величину зміни, дозволену політикою. Вона повинна бути більше нуля</td>
    </tr>
  </tbody>
</table>

## HPAScalingRules {#HPAScalingRules}

HPAScalingRules налаштовує поведінку масштабування в одному напрямку за допомогою правил політики масштабування та налаштовуваного допуску метрик.

Правила політики масштабування застосовуються після обчислення DesiredReplicas на основі метрик для HPA. Вони можуть обмежувати швидкість масштабування, вказуючи політики масштабування. Вони можуть запобігати коливанням, вказуючи вікно стабілізації, щоб кількість реплік не встановлювалася миттєво, замість цього обирається найбезпечніше значення з вікна стабілізації.

Допуск застосовується до значень метрик і запобігає занадто швидкому масштабуванню при невеликих коливаннях метрик. (Зверніть увагу, що для встановлення допуску потрібно ввімкнути бета-функцію HPAConfigurableTolerance.)

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>policies</code><br/><em><a href="{{< ref "#HPAScalingPolicy" >}}">HPAScalingPolicy array</a></em></td>
      <td>policies є списком потенційних політик масштабування, які можуть бути використані під час масштабування. Якщо не встановлено, використовуються стандартні значення:
      <ul>
        <li>Для масштабування вгору: дозволяється подвоєння кількості подів або абсолютна зміна на 4 поди за 15 секунд.</li>
        <li>Для масштабування вниз: дозволяється видалити всі поди за 15 секунд.</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>selectPolicy</code><br/><em>string</em></td>
      <td>selectPolicy використовується для вказівки, яка політика повинна бути використана. Якщо не встановлено, використовується стандартне значення Max.</td>
    </tr>
    <tr>
      <td><code>stabilizationWindowSeconds</code><br/><em>integer</em></td>
      <td>stabilizationWindowSeconds вказує кількість секунд, протягом яких слід враховувати попередні рекомендації під час масштабування вгору або вниз. StabilizationWindowSeconds має бути більше або дорівнювати нулю і менше або дорівнювати 3600 (одна година). Якщо не встановлено, використовуються стандартні значення:
      <ul>
        <li>Для масштабування вгору: 0 (тобто стабілізація не виконується).</li>
        <li>Для масштабування вниз: 300 (тобто вікно стабілізації триває 300 секунд).</li>
      </ul>
      </td>
    </tr>
    <tr>
      <td><code>tolerance</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>tolerance є допуском на співвідношення між поточним і бажаним значенням метрики, при якому не вносяться оновлення до бажаної кількості реплік (наприклад, 0.01 для 1%). Має бути більше або дорівнювати нулю. Якщо не встановлено, застосовується стандартний допуск для всього кластера (стандартно — 10%). Наприклад, якщо автомасштабувальник налаштований з цільовим споживанням памʼяті 100Mi, а допуски на зменшення та збільшення масштабу становлять 5% та 1% відповідно, масштабування буде ініційовано, коли фактичне споживання впаде нижче 95Mi або перевищить 101Mi. Це бета-поле і вимагає увімкнення функціональної можливості HPAConfigurableTolerance.</td>
    </tr>
  </tbody>
</table>

## HorizontalPodAutoscalerBehavior {#HorizontalPodAutoscalerBehavior}

HorizontalPodAutoscalerBehavior налаштовує поведінку масштабування цілі в обох напрямках: вгору та вниз (поля scaleUp та scaleDown відповідно).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>scaleDown</code><br/><em><a href="{{< ref "#HPAScalingRules" >}}">HPAScalingRules</a></em></td>
      <td>scaleDown є політикою масштабування для зменшення масштабу. Якщо не встановлено, стандартне значення дозволяє зменшити кількість подів до minReplicas з вікном стабілізації 300 секунд (тобто використовується найвища рекомендація за останні 300 секунд).</td>
    </tr>
    <tr>
      <td><code>scaleUp</code><br/><em><a href="{{< ref "#HPAScalingRules" >}}">HPAScalingRules</a></em></td>
      <td>scaleUp є політикою масштабування для збільшення масштабу. Якщо не встановлено, стандартне значення дозволяє збільшити кількість подів не більше ніж на 4 за 60 секунд або подвоїти кількість подів за 60 секунд. Стабілізація не використовується.</td>
    </tr>
  </tbody>
</table>

## HorizontalPodAutoscalerCondition {#HorizontalPodAutoscalerCondition}

HorizontalPodAutoscalerCondition описує стан HorizontalPodAutoscaler у певний момент часу.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>lastTransitionTime</code><br/><em><a href="{{< ref "../definitions/time-v1-meta#Time" >}}">Time</a></em></td>
      <td>lastTransitionTime — це останній час, коли стан перейшов з одного статусу в інший</td>
    </tr>
    <tr>
      <td><code>message</code><br/><em>string</em></td>
      <td>message зрозуміле людині пояснення, що містить деталі про перехід стану</td>
    </tr>
    <tr>
      <td><code>reason</code><br/><em>string</em></td>
      <td>reason — це причина останнього переходу стану.</td>
    </tr>
    <tr>
      <td><code>status</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>status — це статус стану (True, False, Unknown)</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type описує поточний стан</td>
    </tr>
  </tbody>
</table>

## MetricIdentifier {#MetricIdentifier}

MetricIdentifier визначає імʼя та, за бажанням, селектор для метрики

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name — це імʼя заданої метрики</td>
    </tr>
    <tr>
      <td><code>selector</code><br/><em><a href="{{< ref "../definitions/label-selector-v1-meta#LabelSelector" >}}">LabelSelector</a></em></td>
      <td>selector — це рядок, закодований у форматі стандартного селектора міток Kubernetes для заданої метрики. Якщо встановлено, він передається як додатковий параметр серверу метрик для більш точного визначення метрик. Якщо не встановлено, використовується лише metricName для збору метрик.</td>
    </tr>
  </tbody>
</table>

## MetricSpec {#MetricSpec}

MetricSpec визначає, як масштабувати на основі однієї метрики (повинні бути встановлені лише `type` та одне інше відповідне поле одночасно).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerResource</code><br/><em><a href="{{< ref "#ContainerResourceMetricSource" >}}">ContainerResourceMetricSource</a></em></td>
      <td>containerResource посилається на метрику ресурсу (наприклад, ті, що вказані в параметрах requests та limits), відому Kubernetes, яка описує окремий контейнер у кожному поді поточній цільовій метриці масштабування (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додачу до тих, що доступні для звичайних метрик на рівні подів із використанням джерела "pods".</td>
    </tr>
    <tr>
      <td><code>external</code><br/><em><a href="{{< ref "#ExternalMetricSource" >}}">ExternalMetricSource</a></em></td>
      <td>external посилається на глобальну метрику, яка не повʼязана з жодним обʼєктом Kubernetes. Вона дозволяє автоматичне масштабування на основі інформації, що надходить від компонентів, які працюють поза кластером (наприклад, довжина черги в хмарному сервісі обміну повідомленнями або QPS від балансувальника навантаження, що працює поза кластером).</td>
    </tr>
    <tr>
      <td><code>object</code><br/><em><a href="{{< ref "#ObjectMetricSource" >}}">ObjectMetricSource</a></em></td>
      <td>object посилається на метрику, що описує один обʼєкт Kubernetes (наприклад, кількість запитів на секунду для обʼєкта Ingress).</td>
    </tr>
    <tr>
      <td><code>pods</code><br/><em><a href="{{< ref "#PodsMetricSource" >}}">PodsMetricSource</a></em></td>
      <td>pods посилається на метрику, що описує кожен под у поточному цільовому масштабі (наприклад, транзакції, оброблені за секунду). Значення будуть усереднені перед порівнянням з цільовим значенням.</td>
    </tr>
    <tr>
      <td><code>resource</code><br/><em><a href="{{< ref "#ResourceMetricSource" >}}">ResourceMetricSource</a></em></td>
      <td>resource посилається на метрику ресурсу (наприклад, ті, що вказані в параметрах requests та limits), відому Kubernetes, яка описує кожен под у поточному цільовому масштабі (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додачу до тих, що доступні для звичайних метрик на рівні подів із використанням джерела "pods".</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type є типом джерела метрики. Воно повинно бути одним із "ContainerResource", "External", "Object", "Pods" або "Resource", кожне з яких відповідає відповідному полю в об'єкті.</td>
    </tr>
  </tbody>
</table>

## MetricStatus {#MetricStatus}

MetricStatus описує останній стан однієї метрики.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>containerResource</code><br/><em><a href="{{< ref "#ContainerResourceMetricStatus" >}}">ContainerResourceMetricStatus</a></em></td>
      <td>container resource посилається на метрику ресурсу (наприклад, ті, що вказані в параметрах requests та limits), відому Kubernetes, яка описує один контейнер у кожному поді поточній цільовій метриці масштабування (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додачу до тих, що доступні для звичайних метрик на рівні подів із використанням джерела "pods".</td>
    </tr>
    <tr>
      <td><code>external</code><br/><em><a href="{{< ref "#ExternalMetricStatus" >}}">ExternalMetricStatus</a></em></td>
      <td>external посилається на глобальну метрику, яка не пов'язана з жодним об'єктом Kubernetes. Вона дозволяє автоматичне масштабування на основі інформації, що надходить від компонентів, які працюють поза кластером (наприклад, довжина черги в хмарному сервісі обміну повідомленнями або QPS від балансувальника навантаження, що працює поза кластером).</td>
    </tr>
    <tr>
      <td><code>object</code><br/><em><a href="{{< ref "#ObjectMetricStatus" >}}">ObjectMetricStatus</a></em></td>
      <td>object посилається на метрику, що описує один обʼєкт Kubernetes (наприклад, кількість запитів на секунду для обʼєкта Ingress).</td>
    </tr>
    <tr>
      <td><code>pods</code><br/><em><a href="{{< ref "#PodsMetricStatus" >}}">PodsMetricStatus</a></em></td>
      <td>pods посилається на метрику, що описує кожен под у поточному цільовому масштабі (наприклад, кількість оброблених транзакцій за секунду). Значення будуть усереднені перед порівнянням із цільовим значенням.</td>
    </tr>
    <tr>
      <td><code>resource</code><br/><em><a href="{{< ref "#ResourceMetricStatus" >}}">ResourceMetricStatus</a></em></td>
      <td>resource посилається на метрику ресурсу (наприклад, ті, що вказані в параметрах requests та limits), відому Kubernetes, яка описує кожен под у поточному цільовому масштабі (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування на додачу до тих, що доступні для звичайних метрик на рівні подів із використанням джерела "pods".</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type є типом джерела метрики. Воно повинно бути одним із "ContainerResource", "External", "Object", "Pods" або "Resource", кожне з яких відповідає відповідному полю в об'єкті.</td>
    </tr>
  </tbody>
</table>

## MetricTarget {#MetricTarget}

MetricTarget визначає цільове значення, середнє значення або середнє використання конкретної метрики

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>averageUtilization</code><br/><em>integer</em></td>
      <td>averageUtilization є цільовим значенням середнього значення метрики ресурсу для всіх відповідних подів, представленим у відсотках від запитуваного значення ресурсу для подів. Наразі дійсно лише для типу джерела метрики Resource.</td>
    </tr>
    <tr>
      <td><code>averageValue</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>averageValue є цільовим значенням середнього значення метрики для всіх відповідних подів (як кількість)</td>
    </tr>
    <tr>
      <td><code>type</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>type визначає, чи є тип метрики Utilization, Value або AverageValue</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>value є цільовим значенням метрики (як кількість).</td>
    </tr>
  </tbody>
</table>

## MetricValueStatus {#MetricValueStatus}

MetricValueStatus визначає поточне значення метрики

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>averageUtilization</code><br/><em>integer</em></td>
      <td>currentAverageUtilization є поточним значенням середнього значення метрики ресурсу для всіх відповідних подів, представленим у відсотках від запитуваного значення ресурсу для подів.</td>
    </tr>
    <tr>
      <td><code>averageValue</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>averageValue є поточним значенням середнього значення метрики для всіх відповідних подів (як кількість)</td>
    </tr>
    <tr>
      <td><code>value</code><br/><em><a href="{{< ref "../definitions/quantity-resource#Quantity" >}}">Quantity</a></em></td>
      <td>value є поточним значенням метрики (як кількість).</td>
    </tr>
  </tbody>
</table>

## ObjectMetricSource {#ObjectMetricSource}

ObjectMetricSource визначає, як масштабуватися за метрикою, що описує обʼєкт Kubernetes (наприклад, кількість запитів на секунду для обʼєкта Ingress).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>describedObject</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CrossVersionObjectReference" >}}">CrossVersionObjectReference</a></em></td>
      <td>describedObject визначає опис обʼєкта, такого як kind, name, apiVersion</td>
    </tr>
    <tr>
      <td><code>metric</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricIdentifier" >}}">MetricIdentifier</a></em></td>
      <td>metric визначає цільову метрику за назвою та селектором</td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricTarget" >}}">MetricTarget</a></em></td>
      <td>target визначає цільове значення для даної метрики</td>
    </tr>
  </tbody>
</table>

## ObjectMetricStatus {#ObjectMetricStatus}

ObjectMetricStatus визначає поточне значення метрики, що описує обʼєкт Kubernetes (наприклад, кількість запитів на секунду для обʼєкта Ingress).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>current</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricValueStatus" >}}">MetricValueStatus</a></em></td>
      <td>current містить поточне значення для даної метрики</td>
    </tr>
    <tr>
      <td><code>describedObject</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#CrossVersionObjectReference" >}}">CrossVersionObjectReference</a></em></td>
      <td>describedObject визначає опис обʼєкта, такого як kind, name, apiVersion</td>
    </tr>
    <tr>
      <td><code>metric</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricIdentifier" >}}">MetricIdentifier</a></em></td>
      <td>metric визначає цільову метрику за назвою та селектором</td>
    </tr>
  </tbody>
</table>

## PodsMetricSource {#PodsMetricSource}

PodsMetricSource визначає, як масштабуватися за метрикою, що описує кожен под у поточному цільовому масштабі (наприклад, кількість оброблених транзакцій за секунду). Значення будуть усереднені перед порівнянням з цільовим значенням.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>metric</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricIdentifier" >}}">MetricIdentifier</a></em></td>
      <td>metric визначає цільову метрику за назвою та селектором</td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricTarget" >}}">MetricTarget</a></em></td>
      <td>target визначає цільове значення для даної метрики</td>
    </tr>
  </tbody>
</table>

## PodsMetricStatus {#PodsMetricStatus}

PodsMetricStatus визначає поточне значення метрики, що описує кожен под у поточному цільовому масштабі (наприклад, кількість оброблених транзакцій за секунду).

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>current</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricValueStatus" >}}">MetricValueStatus</a></em></td>
      <td>current містить поточне значення для даної метрики</td>
    </tr>
    <tr>
      <td><code>metric</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricIdentifier" >}}">MetricIdentifier</a></em></td>
      <td>metric визначає цільову метрику за назвою та селектором</td>
    </tr>
  </tbody>
</table>

## ResourceMetricSource {#ResourceMetricSource}

ResourceMetricSource визначає, як масштабуватися за метрикою ресурсу, відомою Kubernetes, як зазначено в запитах і обмеженнях, описуючи кожен под у поточному цільовому масштабі (наприклад, CPU або памʼять). Значення будуть усереднені перед порівнянням з цільовим значенням. Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування поверх тих, що доступні для звичайних метрик на поди за допомогою джерела "pods". Повинно бути встановлено лише один тип "target".

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name визначає назву ресурсу, про який йде мова.</td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricTarget" >}}">MetricTarget</a></em></td>
      <td>target визначає цільове значення для даної метрики</td>
    </tr>
  </tbody>
</table>

## ResourceMetricStatus {#ResourceMetricStatus}

ResourceMetricStatus визначає поточне значення метрики ресурсу, відомої Kubernetes, як зазначено в запитах і обмеженнях, описуючи кожен под у поточному цільовому масштабі (наприклад, CPU або памʼять). Такі метрики вбудовані в Kubernetes і мають спеціальні параметри масштабування поверх тих, що доступні для звичайних метрик на поди за допомогою джерела "pods".

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>current</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#MetricValueStatus" >}}">MetricValueStatus</a></em></td>
      <td>current містить поточне значення для даної метрики</td>
    </tr>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name визначає назву ресурсу, про який йде мова.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-1}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-2}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Часу у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення відсутнє, буде використано стандартний період очікування для зазначеного типу. Зазвичай використовується значення для конкретного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>Якщо встановлено в true, це призведе до небезпечного видалення ресурсу у випадку, якщо нормальний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища томущо: a) його дані не можна трансформувати, наприклад, помилка дешифрування, або b) не вдається декодувати в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження завершувача, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на нормальний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-3}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Часу у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення відсутнє, буде використано стандартний період очікування для зазначеного типу. Зазвичай використовується значення для конкретного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>Якщо встановлено в true, це призведе до небезпечного видалення ресурсу у випадку, якщо нормальний процес видалення не вдасться через помилку пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не можна успішно отримати з відповідного сховища томущо: a) його дані не можна трансформувати, наприклад, помилка дешифрування, або b) не вдається декодувати в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження завершувача, пропускає перевірки передумов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити роботу кластера, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечно, покладається на нормальний процес видалення. Використовуйте лише якщо ви ДІЙСНО знаєте, що робите. Стандартне значення — false, і користувач повинен явно погодитися на його використання.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріло: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти залишатися покинутими. Якщо true/false, завершувач "orphan" буде доданий до/видалений з списку завершувачів обʼєкта. Можна встановити або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи і як буде виконано збір сміття. Можна встановити або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним завершувачем у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — залишити залежні обʼєкти покинутими; 'Background' — дозволити збирачу сміття видаляти залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти з показом всіх дій.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-4}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read

#### HTTP Запит {#http-request-5}

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри шляху {#path-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-5}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри шляху {#path-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-6}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List All Namespaces

#### HTTP Запит {#http-request-7}

GET /apis/autoscaling/v2/horizontalpodautoscalers

#### Параметри запиту {#query-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-7}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-8}

GET /apis/autoscaling/v2/watch/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Параметри шляху {#path-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-8}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch List

#### HTTP Запит {#http-request-9}

GET /apis/autoscaling/v2/watch/namespaces/{namespace}/horizontalpodautoscalers

#### Параметри шляху {#path-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters}-9

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-9}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch List All Namespaces

#### HTTP Запит {#http-request-10}

GET /apis/autoscaling/v2/watch/horizontalpodautoscalers

#### Параметри запиту {#query-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>allowWatchBookmarks запитує події спостереження з типом "BOOKMARK". Сервери, які не реалізують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через певний інтервал, і не можуть припускати, що сервер надішле будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Опція continue повинна бути встановлена при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не розпізнає. Якщо вказане значення continue більше не дійсне через закінчення терміну дії (зазвичай пʼять-пʼятнадцять хвилин) або зміну конфігурації на сервері, сервер відповість помилкою 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, він повинен перезапустити свій список без поля continue. В іншому випадку клієнт може надіслати ще один запит списку з токеном, отриманим з помилкою 410, сервер відповість списком, починаючи з наступного ключа, але з останнього знімка, що не відповідає попереднім результатам списку — обʼєкти, які були створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, якщо їх ключі йдуть після "наступного ключа". Це поле не підтримується, коли watch встановлено в true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми полями. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку обʼєктів, що повертаються, за їхніми мітками. Зазвичай повертаються всі обʼєкти.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit є максимальним числом відповідей, які потрібно повернути для виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення обмеження може повернути менше, ніж запитана кількість елементів (до нуля елементів) у випадку, якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати лише наявність поля continue, щоб визначити, чи доступні додаткові результати. Сервери можуть вирішити не підтримувати аргумент limit і повернуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що результатів більше немає. Це поле не підтримується, якщо watch дорівнює true. Сервер гарантує, що обʼєкти, повернені при використанні continue, будуть ідентичні до виконання одного виклику списку без обмеження — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені в будь-які наступні продовжені запити. Це іноді називають послідовним знімком, і забезпечує, що клієнт, який використовує limit для отримання менших частин дуже великого результату, може бути впевнений, що він бачить усі можливі обʼєкти. Якщо обʼєкти оновлюються під час отримання часткового списку, повертається версія обʼєкта, яка була присутня на момент обчислення першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження на те, з яких версій ресурсів може обслуговуватися запит. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Див. <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a> для деталей. Стандартне значення не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:
      <ul>
        <li><code>resourceVersionMatch = NotOlderThan</code> інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.</li>
        <li><code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список обʼєктів, що повертаються, за допомогою виразу вибору шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для вказівки одного або кількох діапазонів хешів:<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000')<br/>shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>Шляхи полів використовують синтаксис CEL, що починається з обʼєкта (наприклад, "object.metadata.uid"), а не формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:
      <ul>
        <li>object.metadata.uid</li>
        <li>object.metadata.namespace</li>
      </ul>
      hexStart і hexEnd є рядковими літералами CEL у одинарних лапках з префіксом '0x', що визначають включну нижню і виключну верхню межі в 64-бітовому просторі хешів FNV-1a. Повний діапазон: [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:
      <ul>
        <li>2-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')</li>
        <li>4-шардове розділення:<br/>шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  </li>
      </ul>
      Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.
      </td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику list/watch. Це обмежує тривалість виклику, незалежно від будь-якої активності чи неактивності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-10}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch Status

#### HTTP Запит {#http-request-11}

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри шляху {#path-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле обовʼязкове для запитів apply (application/apply-patch), але необовʼязкове для типів патчів, що не застосовуються (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force має на меті "примусово" застосовувати запити Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим користувачам. Прапорець Force повинен бути скасований для запитів, що не є патчами apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-11}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read Status

#### HTTP Запит {#http-request-12}

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри шляху {#path-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-12}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-12}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Status

#### HTTP Запит {#http-request-13}

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Параметри шляху {#path-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>Назва HorizontalPodAutoscaler</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>Назва обʼєкта та область авторизації, наприклад для команд і проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-13}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядач або командний інструмент для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-13}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "horizontal-pod-autoscaler-v2#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a></em></td>
    </tr>
  </tbody>
</table>
