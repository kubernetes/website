---
title: Рекомендації щодо динамічного розподілу ресурсів для адміністраторів кластера
content_type: concept
weight: 60
---

<!-- overview -->
На цій сторінці описано рекомендації щодо налаштування кластера Kubernetes із використанням динамічного розподілу ресурсів (DRA). Ці інструкції призначені для адміністраторів кластерів.

<!-- body -->
## Окремі дозволи для API, повʼязаних з DRA {#separate-permissions-to-dra-related-apis}

DRA оркеструється через низку різних API. Використовуйте інструменти авторизації (такі як RBAC або інше рішення), щоб контролювати доступ до потрібних API залежно від ролі вашого користувача.

Загалом доступ до DeviceClasses і ResourceSlices слід надавати лише адміністраторам і драйверам DRA. Операторам кластерів, які розгортатимуть Podʼи із заявками, потрібен доступ до API ResourceClaim і ResourceClaimTemplate; обидва ці API обмежені простором імен.

## Розгортання та обслуговування драйверів DRA {#dra-driver-deployment-and-maintenance}

Драйвери DRA — це сторонні застосунки, які працюють на кожному вузлі кластера й взаємодіють з апаратним забезпеченням цього вузла та вбудованими компонентами DRA Kubernetes. Процедура встановлення залежить від обраного драйвера, але, ймовірно, він розгортається як DaemonSet на всіх або на вибраних вузлах кластера (за допомогою селекторів вузлів або подібних механізмів).

### Використовуйте драйвери з безперебійним оновленням, якщо це можливо {#use-drivers-with-seamless-upgrade-if-available}

Драйвери DRA реалізують [інтерфейс пакунка `kubeletplugin`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin). Ваш драйвер може підтримувати _безперебійні оновлення_ завдяки реалізації властивості цього інтерфейсу, яка дозволяє двом версіям одного драйвера DRA співіснувати протягом короткого часу. Це доступно лише для kubelet версії 1.33 і новіших, і ваш драйвер може не підтримувати це для гетерогенних кластерів з підʼєднаними вузлами, на яких працюють старіші версії Kubernetes, — перевірте це в документації вашого драйвера.

Якщо безперебійні оновлення доступні у вашій ситуації, розгляньте можливість їх використання, щоб мінімізувати затримки планування під час оновлення драйвера.

Якщо ви не можете використовувати безперебійні оновлення, під час простою драйвера на час оновлення ви можете помітити, що:

* Podʼи не можуть запускатися, якщо заявки, від яких вони залежать, ще не були підготовлені до використання.
* Очищення після останнього Podʼа, який використовував заявку, відкладається, доки драйвер знову не стане доступним. Pod не позначається як завершений. Це не дає повторно використовувати ресурси цього Podʼа для інших Podʼів.
* Запущені Podʼи продовжують працювати.

### Переконайтеся, що драйвер DRA надає пробу життєздатності, і використовуйте її {#confirm-your-dra-driver-exposes-a-liveness-probe-and-utilize-it}

Ваш драйвер DRA, ймовірно, реалізує gRPC-сокет для перевірок справності відповідно до рекомендацій щодо драйверів DRA. Найпростіший спосіб використати цей gRPC-сокет — налаштувати його як пробу життєздатності для DaemonSet, що розгортає ваш драйвер DRA. Документація вашого драйвера або інструменти розгортання вже можуть це містити, але якщо ви створюєте конфігурацію окремо або запускаєте драйвер DRA не як Pod Kubernetes, переконайтеся, що ваші інструменти оркестрування перезапускають драйвер DRA в разі невдалих перевірок справності цього gRPC-сокета. Це мінімізує випадкові простої драйвера DRA і дасть йому більше можливостей для самовідновлення, зменшуючи затримки планування або час на усунення несправностей.

### Під час drain вузла виконуйте drain драйвера DRA якомога пізніше {#when-draining-a-node-drain-the-dra-driver-as-late-as-possible}

Драйвер DRA відповідає за скасування підготовки всіх пристроїв, виділених Podʼам, і якщо для драйвера DRA буде виконано {{< glossary_tooltip text="drain" term_id="drain" >}} до видалення Podʼів із заявками, він не зможе завершити очищення. Якщо ви реалізуєте власну логіку drain для вузлів, перед завершенням самого драйвера DRA перевірте, що немає виділених або зарезервованих ResourceClaim чи ResourceClaimTemplates.

## Відстежуйте та налаштовуйте компоненти для вищого навантаження, особливо у великомасштабних середовищах {#monitor-and-tune-components-for-higher-load-especially-in-high-scale-environments}

Компонент панелі управління {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} та внутрішній контролер ResourceClaim, яким керує компонент {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}, виконують основну роботу під час планування Podʼів із заявками на основі метаданих, що зберігаються в API DRA. Порівняно з Podʼами, запланованими без DRA, для Podʼів із заявками DRA зростають кількість викликів API-сервера, а також використання памʼяті й CPU цими компонентами. Крім того, локальні компоненти вузла, такі як драйвер DRA та kubelet, використовують API DRA для виділення апаратних запитів під час створення пісочниці Podʼа. Особливо у великомасштабних середовищах, де кластери мають багато вузлів та/або розгортають багато робочих навантажень, які інтенсивно використовують заявки на ресурси, визначені DRA, адміністратор кластера має налаштувати відповідні компоненти з урахуванням збільшеного навантаження.

Неправильне налаштування компонентів може мати прямі або лавиноподібні наслідки, що спричиняють різні симптоми протягом життєвого циклу Podʼа. Якщо параметри QPS та burst компонента `kube-scheduler` занадто низькі, планувальник може швидко визначити придатний вузол для Podʼа, але витратити більше часу на привʼязку Podʼа до цього вузла. З DRA під час планування Podʼа критично важливі параметри QPS та Burst у конфігурації client-go в `kube-controller-manager`.

Конкретні значення для налаштування вашого кластера залежать від різних чинників, таких як кількість вузлів/Podʼів, швидкість створення Podʼів, плинність, навіть у середовищах без DRA; докладніше дивіться в [README SIG Scalability про пороги масштабованості Kubernetes](https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md). У тестах масштабування на кластері з увімкненим DRA зі 100 вузлами, 720 довгоживучими Podʼами (90% насичення) та 80 плинними Podʼами (10% плинності, 10 разів) зі швидкістю створення Jobs 10 QPS значення QPS для `kube-controller-manager` можна було встановити лише 75, а Burst — 150, щоб досягти таких самих цільових метрик, як для розгортань без DRA. На цій нижній межі спостерігалося, що обмежувач швидкості на стороні клієнта спрацьовував достатньо, щоб захистити API-сервер від вибухового сплеску, але межа була достатньо високою, щоб не вплинути на SLO запуску Podʼів. Хоча це гарна відправна точка, краще зрозуміти, як налаштувати різні компоненти, що найбільше впливають на продуктивність DRA у вашому розгортанні, можна, відстежуючи наведені нижче метрики. Докладніше про всі стабільні метрики Kubernetes дивіться в [Довіднику метрик Kubernetes](/docs/reference/instrumentation/metrics/).

### Метрики `kube-controller-manager` {#kube-controller-manager-metrics}

Наведені нижче метрики докладно показують роботу внутрішнього контролера ResourceClaim, яким керує компонент `kube-controller-manager`.

* Швидкість додавання до робочої черги: відстежуйте {{< highlight promql "hl_inline=true"  >}} sum(rate(workqueue_adds_total{name="resource_claim"}[5m])) {{< /highlight >}}, щоб оцінити, як швидко елементи додаються до контролера ResourceClaim.
* Глибина робочої черги: відстежуйте {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager", name="resource_claim"}){{< /highlight >}}, щоб виявити будь-які нагромадження в контролері ResourceClaim.
* Тривалість обробки в робочій черзі: відстежуйте {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99, sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m])) by (le)){{< /highlight >}}, щоб зрозуміти швидкість, з якою контролер ResourceClaim обробляє роботу.

Якщо ви спостерігаєте низьку швидкість додавання до робочої черги, високу глибину робочої черги та/або велику тривалість обробки в робочій черзі, це свідчить про те, що контролер працює не оптимально. Розгляньте можливість налаштування таких параметрів, як QPS, burst і конфігурації CPU/памʼяті.

Якщо ви спостерігаєте високу швидкість додавання до робочої черги, високу глибину робочої черги, але прийнятну тривалість обробки, це вказує на те, що контролер обробляє роботу, але паралелізму може бути недостатньо. Паралелізм жорстко закодований у контролері, тому як адміністратор кластера ви можете налаштувати це, зменшивши QPS створення Podʼів, щоб швидкість додавання до робочої черги ResourceClaim стала більш керованою.

### Метрики `kube-scheduler` {#kube-scheduler-metrics}

Наведені нижче метрики планувальника є високорівневими й агрегують продуктивність усіх запланованих Podʼів, а не лише тих, що використовують DRA. Важливо зазначити, що на наскрізні метрики зрештою впливає продуктивність `kube-controller-manager` у створенні ResourceClaims з ResourceClaimTemplates у розгортаннях, які інтенсивно використовують ResourceClaimTemplates.

* Наскрізна тривалість роботи планувальника: відстежуйте {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}.
* Затримка алгоритму планувальника: відстежуйте {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}.

### Метрики `kubelet` {#kubelet-metrics}

Коли для Podʼа, привʼязаного до вузла, має бути задоволений ResourceClaim, kubelet викликає методи `NodePrepareResources` та `NodeUnprepareResources` драйвера DRA. Ви можете спостерігати цю поведінку з погляду kubelet за допомогою наведених нижче метрик.

* kubelet NodePrepareResources: відстежуйте {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m])) by (le)){{< /highlight >}}.
* kubelet NodeUnprepareResources: відстежуйте {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m])) by (le)){{< /highlight >}}.

### Операції DRA kubeletplugin {#dra-kubeletplugin-operations}

Драйвери DRA реалізують [інтерфейс пакунка `kubeletplugin`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin), який надає власну метрику для базових операцій gRPC `NodePrepareResources` та `NodeUnprepareResources`. Ви можете спостерігати цю поведінку з погляду внутрішнього kubeletplugin за допомогою наведених нижче метрик.

* Операція DRA kubeletplugin gRPC NodePrepareResources: відстежуйте {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m])) by (le)){{< /highlight >}}.
* Операція DRA kubeletplugin gRPC NodeUnprepareResources: відстежуйте {{< highlight promql "hl_inline=true" >}} histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m])) by (le)){{< /highlight >}}.

## {{% heading "whatsnext" %}} {#whats-next}

* [Дізнайтеся більше про DRA](/docs/concepts/resource-management/dynamic-resource-allocation/)
* Прочитайте [Довідник метрик Kubernetes](/docs/reference/instrumentation/metrics/)
