---
title: Вертикальне автоматичне масштабування Podʼів
feature:
  title: Вертикальне автомасштабування
  description: >
    Автоматично коригуйте запитами на ресурси та обмеженнями на основі фактичних моделей використання.
content_type: concept
weight: 70
math: true
---

<!-- overview -->

У Kubernetes _VerticalPodAutoscaler_ автоматично оновлює управління  {{< glossary_tooltip text="ресурсом" term_id="api-resource" >}} робочого навантаження (таким як {{< glossary_tooltip text="Deployment" term_id="deployment" >}} або {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), з метою автоматичного коригування {{< glossary_tooltip text="ресурсів" term_id="infrastructure-resource" >}} інфраструктури [запитів і обмежень](/docs/concepts/configuration/manage-resources-containers/# запити-та-обмеження) відповідно до фактичного використання.

Вертикальне масштабування означає, що відповіддю на збільшення попиту на ресурси є виділення більшої кількості ресурсів (наприклад, памʼяті або процесорного часу)  для {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, які вже працюють для даного навантаження. Це також відомо як _rightsizing_, або іноді _autopilot_. Це відрізняється від горизонтального масштабування, яке для Kubernetes означало б розгортання більшої кількості Podʼів для розподілу навантаження.

Якщо використання ресурсів зменшується, а запити на ресурси від Podʼа перевищують оптимальний рівень, VerticalPodAutoscaler дає вказівку ресурсу робочого навантаження (Deployment, StatefulSet або іншому подібному ресурсу)  скоригувати запити на ресурси назад, запобігаючи марнуванню ресурсів.

VerticalPodAutoscaler реалізовано як ресурс API Kubernetes і {{< glossary_tooltip text="контролер" term_id="controller" >}}. Ресурс визначає поведінку контролера.  Контролер вертикального автомасштабування podʼів, що працює в рамках панелі даних Kubernetes, періодично коригує запити на ресурси та обмеження для свого обʼєкта (наприклад, Deployment) на основі аналізу історичного використання ресурсів, кількості доступних ресурсів у кластері та подій у реальному часі, таких як умови нестачі памʼяті (OOM).

<!-- body -->

## Обʼєкт API {#api-object}

VerticalPodAutoscaler визначається як {{< glossary_tooltip text="Custom Resource Definition" term_id="customresourcedefinition" >}} (CRD) в Kubernetes. На відміну від HorizontalPodAutoscaler, який є частиною основного API Kubernetes, VPA необхідно встановлювати окремо у вашому кластері.

Поточна стабільна версія API — `autoscaling.k8s.io/v1`. Більш детальну інформацію про встановлення VPA та API можна знайти в [репозиторії VPA на GitHub](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler).

## Як працює VerticalPodAutoscaler? {#how-does-a-verticalpodautoscaler-work}

{{< mermaid >}}
graph BT
    metrics[Metrics Server]
    api[API Server]
    admission[VPA Admission Controller]

    vpa_cr[VerticalPodAutoscaler CRD]
    recommender[VPA recommender]
    updater[VPA updater]

    metrics --> recommender
    recommender -->|Зберігає<br/>рекомендації| vpa_cr

    subgraph Робоче навантаження застосунку
        controller[Deployment / RC / StatefulSet]
        pod[Pod / Container]
    end

    vpa_cr -->|Перевірка на<br/> наявність змін| updater
    updater -->|Виселяє або оновлює<br/> pod на місці| controller
    controller -->|Запит на<br/>новий Pod| api

    api -->|Створення<br/>нового Podʼа| admission
    admission -->|Отримує останні<br/>рекомендації| vpa_cr
    admission -->|Інʼєкція нових<br/>значень ресурсів| api

    api -->|Створює<br/>Pod| controller
    controller -->|Новий Pod з<br/>оптимальними<br/>ресурсами| pod

    classDef vpa fill:#9FC5E8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
    classDef crd fill:#D5A6BD,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
    classDef metrics fill:#FFD966,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;
    classDef app fill:#B6D7A8,stroke:#1E1E1D,stroke-width:1px,color:#1E1E1D;

    class recommender,updater,admission vpa;
    class vpa_cr crd;
    class metrics metrics;
    class controller,pod app;
{{< /mermaid >}}

Схема 1. VerticalPodAutoscaler контролює запити на ресурси та обмеження Podʼів у Deployment.

<!-- https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqlVG1P2zAQ_iuW-RpY0rVNG6RJpSkSH9hQuzFpLZo850o9nDiznQKj_PddYqcvMGmaSKXG53vuuefuHD9RrjKgCb3VrFyRs8-LguBjqh9uY1SWUnBmhSrIV6XvpGKZg9QPV4XVSkrQ8xRKqR5zKCx5R6Zj_JtZZmFZyRnYm11IqbL5lcrQP8ZgJgrQ3guFZ3b_OVgtuJlfujeZgV5vsawU89HVxYvNLBfGoNL59dWIjFqrSeRU3uwnWJfsO9fza9AWK5QoalRZZXAJmoynqQdr4CrHujIssubdsz2iKjOs1Hn9Gj0HVZDj4w_7ka-oa8BmZpUGQ6btdtN2s_FKW0pnNQHjFfA7Q5ZKE75ixS0g2Cs4kNaAJ2vBrSF18xH_pfEYIgpSSsZhszdMF7uzm_Ap_KrAIEEB9zXJph5CqwmXDeij85Gxhkb8ZjeUFzPynNgdWKMMWYuxu4746Lby16EXxU_gXg02TVWaA1kzWdU9-IuyRhEYp_wfpbZV3Au7Ip9KK3ImcSouCdLjGW7puWTGpLCslZKlkDI5Gp6Pe5NBYJDxDpKjaIK_1JvH9yKzqyQqHwKupNKt-_QFG9eZZ0t7o_5Z-ja29hA6xvPzdNjvv42RlaVnO-un8ej_q93j2_8MAn9gg92wsbH72dvjjx062G5r9O8D3268AY6uFn9KA7zxREYTqysIaA46Z7VJn-rABbUryGFBE1xmsGSVtAu6KJ4xrGTFN6XyNlKr6nZFkyWTBi0nPxUMb88txG1OMoGf9xbJ8K6ZPRZ8y9PUP1ZVYWkSdZs8NHmiDzSJOyedXhiGUe_9IIw63SigjzQZhCfhMO5FcTwcdgaDuPsc0N-NsPBkENf4MBr0O_1uNx4GFJrsl-6ub6785z9_1f9X -->

Kubernetes реалізує вертикальне автоматичне масштабування подів за допомогою декількох взаємодіючих компонентів, які працюють з перервами (це не безперервний процес). VPA складається з трьох основних компонентів:

- _recommender_, який аналізує використання ресурсів і надає рекомендації.
- _updater_, який обробляє запити на ресурси подів, витісняючи Podʼи або модифікуючи їх на місці.
- І веб-хук VPA _admission controller_, який застосовує рекомендації щодо ресурсів до нових або створених заново Podʼів.

Один раз протягом кожного періоду Recommender запитує використання ресурсів для Pod, на які спрямовано кожне визначення VerticalPodAutoscaler. Recommender знаходить цільовий ресурс, визначений `targetRef`, потім вибирає pod на основі міток `.spec.selector` цільового ресурсу та отримує метрики з API метрик ресурсів для аналізу фактичного споживання CPU та памʼяті.

Recommender аналізує поточні та історичні дані про використання ресурсів (CPU та памʼять) для кожного Podʼа, на який націлений VerticalPodAutoscaler. Він перевіряє:

- Історичні моделі споживання з часом для виявлення тенденцій
- Пікове використання та відхилення для забезпечення достатнього запасу
- Події вичерпання памʼяті (OOM) та інші інциденти, повʼязані з ресурсами

На основі цього аналізу Recommender обчислює три типи рекомендацій:

- Рекомендація щодо цільового значення (оптимальні ресурси для типового використання)
- Нижня межа (мінімально необхідні ресурси)
- Верхня межа (максимально доцільні ресурси). Ці рекомендації зберігаються в полі `.status.recommendation` ресурсу VerticalPodAutoscaler.

Компонент _updater_ контролює ресурси VerticalPodAutoscaler і порівнює поточні запити на ресурси Podʼів з рекомендаціями. Коли різниця перевищує налаштовані порогові значення і політика оновлення дозволяє це, updater може:

- Видалити Podʼи, ініціюючи їх відновлення з новими запитами на ресурси (традиційний підхід)
- Оновити ресурси Podʼа на місці без вилучення, якщо кластер підтримує оновлення ресурсів Podʼів на місці

Вибраний метод залежить від налаштованого режиму оновлення, можливостей кластера та типу необхідних змін ресурсів. Оновлення на місці, якщо вони доступні, дозволяють уникнути переривання роботи Podʼа, але можуть мати обмеження щодо ресурсів, які можна модифікувати. Оновлювач дотримується PodDisruptionBudgets, щоб мінімізувати вплив на роботу сервісу.

_Контролер допуску_ працює як мутаційний веб-хук, який перехоплює запити на створення Podʼів. Він перевіряє, чи є Pod ціллю VerticalPodAutoscaler, і, якщо так, застосовує рекомендовані запити на ресурси та обмеження перед створенням Podʼа. Конкретніше, контролер допуску використовує рекомендацію Target у розділі `.status.recommendation` ресурсу VerticalPodAutoscaler як запити на нові ресурси. Контролер допуску гарантує, що нові Podʼи запускаються з належними виділеними ресурсами, незалежно від того, чи вони створені під час початкового розгортання, після виселення оновлювачем або внаслідок операцій масштабування.

VerticalPodAutoscaler вимагає, щоб у кластері було встановлено джерело метрик, таке як {{< glossary_tooltip text="надбудова" term_id="addons" >}} Metrics Server від Kubernetes. Компоненти VPA отримують метрики з API `metrics.k8s.io`. Metrics Server потрібно запускати окремо, оскільки він зазвичай не розгортається в більшості кластерів. Докладнішу інформацію про метрики ресурсів дивіться у розділі [Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server).

## Режими оновлення {#update-modes}

VerticalPodAutoscaler підтримує різні режими оновлення, які контролюють, як і коли рекомендації щодо ресурсів застосовуються до ваших Podʼів. Ви налаштовуєте режим оновлення за допомогою поля `updateMode` у специфікації VPA під `updatePolicy`:

```yaml
---
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"  # Off, Initial, Recreate, InPlaceOrRecreate
```

### Off {#updateMode-Off}

У режимі оновлення `Off` рекомендаційна система VPA все одно аналізує використання ресурсів і генерує рекомендації, але ці рекомендації не застосовуються до Podʼів автоматично. Рекомендації зберігаються лише в полі `.status` обʼєкта VPA.

Ви можете використовувати такий інструмент, як `kubectl`, щоб переглянути `.status` і рекомендації, що містяться в ньому.

### Initial {#updateMode-Initial}

У режимі `Initial` VPA встановлює запити на ресурси тільки під час першого створення Podʼа. Він не оновлює ресурси для вже запущених Podʼів, навіть якщо рекомендації змінюються з часом. Рекомендації застосовуються тільки під час створення Podʼа.

### Recreate {#updateMode-Recreate}

У режимі `Recreate` VPA активно управляє ресурсами Podʼів, вилучаючи Podʼи, коли їхні поточні запити на ресурси значно відрізняються від рекомендацій. Коли Pod вилучається, контролер робочого навантаження (який управляє Deployment, StatefulSet тощо) створює заміну Podʼа, а контролер допуску VPA застосовує оновлені запити на ресурси до нового Podʼа.

### InPlaceOrRecreate {#updateMode-InPlaceOrRecreate}

У режимі `InPlaceOrRecreate` VPA намагається оновити запити та обмеження ресурсів Podʼа без перезапуску Podʼа, якщо це можливо. Однак, якщо оновлення на місці не можуть бути виконані для певної зміни ресурсу, VPA повертається до виселення Podʼа (аналогічно режиму `Recreate`) і дозволяє контролеру робочого навантаження створити заміну Podʼа з оновленими ресурсами.

У цьому режимі оновлювач застосовує рекомендації на місці за допомогою функції [Зміна розміру ресурсів контейнера на місці](/docs/tasks/configure-pod-container/resize-container-resources/).

### Auto (застаріло) {#updateMode-Auto}

{{< note >}}
Режим оновлення `Auto` **визнано застарілим починаючи з версії VPA 1.4.0**. Використовуйте `Recreate` для оновлень на основі виселення або `InPlaceOrRecreate` для оновлень на місці з резервним варіантом виселення.
{{< /note >}}

Режим `Auto` наразі є синонімом режиму `Recreate` і працює ідентично. Він був введений для забезпечення можливості майбутнього розширення стратегій автоматичного оновлення.

## Політики ресурсів {#resource-policies}

Політики ресурсів дозволяють точно налаштувати спосіб, у який VerticalPodAutoscaler генерує рекомендації та застосовує оновлення. Ви можете встановити межі для рекомендацій щодо ресурсів, вказати, якими ресурсами керувати, та налаштувати різні політики для окремих контейнерів у Podʼі.

Політики ресурсів визначаються у полі `resourcePolicy` специфікації VPA:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: "application"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources:
      - cpu
      - memory
      controlledValues: RequestsAndLimits
```

#### minAllowed та maxAllowed {#minallowed-and-maxallowed}

Ці поля встановлюють межі для рекомендацій VPA. VPA ніколи не рекомендуватиме ресурси нижче `minAllowed` або вище `maxAllowed`, навіть якщо фактичні дані про використання вказують на інші значення.

#### controlledResources

Поле `controlledResources` визначає, якими типами ресурсів VPA повинен керувати для контейнера в Podʼі. Якщо не вказано, VPA стандартно управляє як CPU, так і памʼяттю. Ви можете обмежити VPA управлінням лише певними ресурсами. Допустимі імена ресурсів включають `cpu` та `memory`.

### controlledValues

Поле `controlledValues` визначає, чи контролює VPA запити на ресурси, обмеження або і те, і інше:

RequestsAndLimits
: VPA встановлює як запити, так і обмеження.  Обмеження масштабується пропорційно до запиту на основі співвідношення запиту до обмеження, визначеного в специфікації Pod. Це типовий режим.

RequestsOnly
: VPA встановлює лише запити, залишаючи обмеження без змін. Обмеження дотримуються і можуть викликати обмеження пропускної здатності або завершення роботи через брак памʼяті, якщо використання перевищує їх.

Дивіться [запити та обмеження](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits), щоб дізнатися більше про ці два поняття.

## Ресурси LimitRange {#limitrange-resources}

Компоненти VPA контролера доступу та оновлювача обробляють рекомендації, щоб відповідати обмеженням, визначеним у [LimitRanges](/docs/concepts/policy/limit-range/). Ресурси LimitRange з `type` Pod та Container перевіряються в кластері Kubernetes.

Наприклад, якщо поле `max` у ресурсі Container LimitRange перевищено, обидва компоненти VPA знижують обмеження до значення, визначеного в полі `max`, і запит пропорційно зменшується, щоб зберегти співвідношення запиту до обмеження в специфікації Pod.

## {{% heading "whatsnext" %}}

Якщо ви налаштовуєте автомасштабування у своєму кластері, ви також можете розглянути можливість використання [автомасштабування вузлів](/docs/concepts/cluster-administration/node-autoscaling/), щоб переконатися, що ви використовуєте потрібну кількість вузлів. Ви також можете дізнатися більше про [_горизонтальне_ автомасштабування Podʼів](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).
