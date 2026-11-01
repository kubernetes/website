---
title: "Стани Podʼа"
content_type: concept
weight: 35
---

У Kubernetes багато обʼєктів мають _стани_ (conditions). Стан — це показник певного аспекту фактичного становища того, що представляє обʼєкт. Podʼи мають стани, і стани Podʼів у Kubernetes є важливим аспектом, що дозволяє контролерам (а також тим, хто займається усуненням несправностей) оцінювати справність Podʼів.

[Фаза](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) Podʼа надає високорівневий огляд того, на якому етапі життєвого циклу перебуває Pod, але одне значення не може показати повну картину. Наприклад, Pod може перебувати у фазі `Running`, але не бути готовим до обслуговування трафіку. Стани Podʼа доповнюють фазу, відстежуючи незалежно один від одного різні аспекти статусу Podʼа, наприклад, чи було його заплановано, чи готові його контейнери, чи триває зміна розміру, або чи буде робота Podʼа незабаром перервана через {{< glossary_tooltip text="taint" term_id="taint" >}}.

## Структура стану Podʼа {#structure-of-a-pod-condition}

Статус Podʼа включає масив [PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core), які вказують, чи пройшов Pod певні контрольні точки.

Кожен елемент масиву PodCondition має такі поля:

{{< table caption="Поля PodCondition" >}}
| Поле                 | Опис                                                                                                                        |
|:---------------------|:----------------------------------------------------------------------------------------------------------------------------|
| `type`               | Назва стану Podʼа.   |
| `status`             | Вказує, чи застосовний цей стан, з можливими значеннями `"True"`, `"False"` або `"Unknown"`.                      |
| `lastProbeTime`      | Час останньої перевірки стану Podʼа. |
| `lastTransitionTime` | Час останнього переходу Podʼа з одного стану в інший.                                                                       |
| `reason`             | Текст у форматі UpperCamelCase, придатний для машинного зчитування, що вказує причину останнього переходу стану.            |
| `message`            | Повідомлення, придатне для сприйняття людиною, що містить детальну інформацію про останній перехід стану.                   |
| `observedGeneration` | `.metadata.generation` Podʼа на момент запису стану. Див. [Генерація Podʼа](/docs/concepts/workloads/pods/#pod-generation). |
{{< /table >}}

## Вбудовані стани Podʼа {#built-in-pod-conditions}

Kubernetes керує такими станами Podʼа:

[Стани життєвого циклу](#lifecycle-pod-conditions): встановлюються під час проходження Podʼом свого життєвого циклу, приблизно в такому порядку: `PodScheduled`, `PodReadyToStartContainers`, `Initialized`, `ContainersReady`, `Ready`.

[Інші стани](#other-pod-conditions): встановлюються у відповідь на конкретні операції або події: `DisruptionTarget`, `PodResizePending`, `PodResizeInProgress`.

Крім вбудованих станів, ви можете визначати власні стани за допомогою [шлюзів готовності Podʼа (readiness gates)](#enhanced-pod-readiness).

## Стани життєвого циклу Podʼа {#lifecycle-pod-conditions}

У міру проходження Podʼом свого життєвого циклу kubelet встановлює такі стани приблизно в такому порядку:

1. `PodScheduled`: Pod було заплановано на вузол.
2. `PodReadyToStartContainers`: пісочницю Podʼа було успішно створено та налаштовано мережу. Пісочницю та мережу налаштовують {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} та втулок {{< glossary_tooltip text="CNI" term_id="cni" >}}.
3. `Initialized`: всі [init-контейнери](/docs/concepts/workloads/pods/init-containers/) успішно завершилися. Для Podʼа без init-контейнерів встановлюється в `True` перед створенням пісочниці.
4. `ContainersReady`: всі контейнери в Podʼі готові. Готовність контейнера визначається його [пробою готовності](/docs/concepts/workloads/pods/probes/#readiness-probe), якщо вона налаштована.
5. `Ready`: Pod здатний обслуговувати запити і повинен бути доданий до пулів балансування навантаження всіх відповідних [Services](/docs/concepts/services-networking/service/). Podʼи, які не є `Ready`, видаляються з точок доступу Service.

{{< note >}}
Стан `Ready` залежить не лише від `ContainersReady`. Якщо Pod вказує `readinessGates`, всі ці власні стани також повинні бути `True`, щоб Pod був `Ready`. Див. [Готовність Podʼа](#enhanced-pod-readiness) для деталей.
{{< /note >}}

Ви можете перевірити стани Podʼа за допомогою kubectl:

```shell
kubectl get pod <pod-name> -o yaml
```

Цей вивід показує, як виглядає поле `status.conditions` для запущеного Podʼа:

```yaml
status:
  conditions:
    - type: PodScheduled
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: PodReadyToStartContainers
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:16Z"
      observedGeneration: 1
    - type: Initialized
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: ContainersReady
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
    - type: Ready
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
```

### PodReadyToStartContainers {#pod-ready-to-start-containers}

{{< feature-state feature_gate_name="PodReadyToStartContainersCondition" >}}

{{< note >}}
Під час ранньої розробки цей стан називався `PodHasNetwork`.
{{< /note >}}

Після того, як Pod заплановано на вузол, kubelet має його допустити, а всі необхідні томи зберігання мають бути змонтовані. Після завершення цих фаз kubelet працює із середовищем виконання контейнерів (використовуючи {{< glossary_tooltip text="Container Runtime Interface, CRI" term_id="cri" >}}), щоб налаштувати пісочницю середовища виконання та мережу для Podʼа. Стан `PodReadyToStartContainers` додається до поля `status.conditions` Podʼа.

Kubelet встановлює цей стан в `False`, коли виявляє, що Pod не має пісочниці середовища виконання з налаштованою мережею. Це відбувається в таких сценаріях:

- На ранньому етапі життєвого циклу Podʼа, коли kubelet ще не почав налаштовувати пісочницю для Podʼа за допомогою середовища виконання контейнерів.
- На пізньому етапі життєвого циклу Podʼа, коли пісочницю Podʼа було знищено через:
  - перезавантаження вузла без виселення Podʼа
  - для середовищ виконання контейнерів, які використовують віртуальні машини для ізоляції, перезавантаження віртуальної машини пісочниці Podʼа, що вимагає створення нової пісочниці та нової конфігурації мережі контейнера.

Kubelet встановлює стан `PodReadyToStartContainers` в `True` після того, як втулок середовища виконання успішно завершить створення пісочниці та налаштування мережі для Podʼа. Після встановлення стану `PodReadyToStartContainers` в `True` kubelet може почати завантаження образів контейнерів та створення контейнерів.

Для Podʼа з init-контейнерами kubelet встановлює стан `Initialized` в `True` після успішного завершення init-контейнерів (що відбувається після успішного створення пісочниці та налаштування мережі втулком середовища виконання). Для Podʼа без init-контейнерів kubelet встановлює стан `Initialized` в `True` перед початком створення пісочниці та налаштування мережі.

## Інші стани Podʼа {#other-pod-conditions}

Такі стани не є частиною нормального проходження життєвого циклу Podʼа. Вони встановлюються у відповідь на конкретні операції або події.

### DisruptionTarget {#disruption-target}

Спеціальний стан Podʼа `DisruptionTarget` додається для того, щоб вказати, що Pod буде видалено через {{<glossary_tooltip term_id="disruption" text="переривання роботи">}}. Поле `reason` цього стану додатково вказує одну з таких причин завершення Podʼа:

`PreemptionByScheduler`
: Pod підлягає {{<glossary_tooltip term_id="preemption" text="витісненню">}} планувальником, щоб звільнити місце для нового Podʼа з вищим пріоритетом. Для отримання додаткової інформації див. [Пріоритет та витіснення Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

`DeletionByTaintManager`
: Pod підлягає видаленню менеджером Taint (який є частиною контролера життєвого циклу вузла в `kube-controller-manager`) через `NoExecute` taint, який Pod не толерує; див. виселення на основі {{<glossary_tooltip term_id="taint" text="taint">}}.

`EvictionByEvictionAPI`
: Pod підлягає виселенню за допомогою {{<glossary_tooltip term_id="api-eviction" text="API Kubernetes">}}.

`DeletionByPodGC`
: Pod, який привʼязаний до вузла, що більше не існує, підлягає видаленню за допомогою механізму [збору сміття Podʼів](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).

`TerminationByKubelet`
: Pod було завершено kubelet через {{<glossary_tooltip term_id="node-pressure-eviction" text="виселення внаслідок тиску на вузол">}}, [коректне вимкнення вузла](/docs/concepts/architecture/nodes/#graceful-node-shutdown) або витіснення заради [системно критичних Podʼів](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).

У всіх інших сценаріях переривання роботи, таких як виселення через перевищення [обмежень контейнерів Podʼа](/docs/concepts/configuration/manage-resources-containers/), Podʼи не отримують стан `DisruptionTarget`, оскільки ці переривання, ймовірно, були спричинені самим Podʼом і повторилися б під час повторної спроби.

{{< note >}}
Процес переривання роботи Podʼа може бути зупинено. Панель управління може повторно спробувати продовжити переривання роботи того самого Podʼа, але це не гарантовано. В результаті стан `DisruptionTarget` може бути додано до Podʼа, але цей Pod може фактично не бути видаленим. У такій ситуації через деякий час стан переривання роботи Podʼа буде очищено.
{{< /note >}}

Разом з очищенням Podʼів, механізм збору сміття Podʼів (PodGC) також позначає їх як невдалі, якщо вони перебувають у нетермінальній фазі (див. також [збір сміття Podʼів](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)).

Під час використання Job (або CronJob) ви можете використовувати ці стани переривання роботи Podʼів як частину [політики збоїв Podʼа](/docs/concepts/workloads/controllers/job#pod-failure-policy) вашого Job.

Для отримання додаткової інформації див. [Переривання роботи](/docs/concepts/workloads/pods/disruptions/).

### PodResizePending та PodResizeInProgress {#pod-resize-conditions}

Kubelet оновлює стани Podʼа, щоб вказати статус запиту на зміну розміру:

- `type: PodResizePending`: Kubelet не може негайно виконати запит. Поле `message` надає пояснення, чому.
  - `reason: Infeasible`: Запитана зміна розміру неможлива на поточному вузлі (наприклад, запит більше ресурсів, ніж є на вузлі).
  - `reason: Deferred`: Запитана зміна розміру наразі неможлива, але може стати можливою пізніше (наприклад, якщо інший Pod буде видалено). Kubelet повторно спробує зміну розміру.
- `type: PodResizeInProgress`: Kubelet прийняв зміну розміру та виділив ресурси, але зміни ще застосовуються. Зазвичай це триває недовго, але може зайняти більше часу залежно від типу ресурсу та поведінки середовища виконання. Будь-які помилки під час виконання повідомляються у полі `message` (разом з `reason: Error`).

Якщо запитана зміна розміру є _Deferred_, kubelet періодично повторно намагатиметься виконати зміну розміру, наприклад, коли інший Pod буде видалено або зменшено масштаб.

Докладніше див. [Зміна розміру CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/).

## Розширена готовність Podʼів {#enhanced-pod-readiness}

Ваш застосунок може додавати додаткові відгуки або сигнали в `.status` Podʼа; це відомо як _розширена готовність Podʼів_. Щоб використовувати це, встановіть `readinessGates` у `spec` Podʼа, щоб вказати список додаткових станів, які kubelet оцінює для готовності Podʼа. Потім ви реалізуєте або встановлюєте контролер, який керує цими власними станами, і kubelet використовує це як додаткове вхідне значення для визначення готовності Podʼа.

Шлюзи готовності (readiness gates) визначаються поточним станом полів `status.condition` для Podʼа. Якщо Kubernetes не може знайти такий стан у полі `status.conditions` Podʼа, його статус стандартно дорівнює "`False`".

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # вбудована PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # додаткова PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

Стани Podʼа, які ви додаєте, повинні мати назви, що відповідають формату [ключів міток Kubernetes](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).

### Статус готовності Podʼа {#status-for-pod-readiness}

Щоб встановити ці `status.conditions` для Podʼа, застосунки та {{< glossary_tooltip term_id="operator-pattern" text="оператори">}} повинні використовувати дію `PATCH` на субресурсі статусу Podʼа. Ви можете використовувати `kubectl patch` з `--subresource=status`, або [бібліотеку клієнта Kubernetes](/docs/reference/using-api/client-libraries/), щоб написати код, який встановлює власні стани Podʼа для готовності Podʼа.

Pod, який використовує власні стани, вважається готовим **тільки** тоді, коли виконуються обидва такі твердження:

- Всі контейнери в Podʼі готові.
- Усі стани, зазначені в `readinessGates`, мають значення `True`.

Коли контейнери Podʼа готові, але принаймні один власний стан відсутній або має значення `False`, kubelet встановлює стан `Ready` Podʼа в `status: "False"` з `reason: ReadinessGatesNotReady`.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтесь про [Життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/).
- Дізнайтесь про [Переривання роботи](/docs/concepts/workloads/pods/disruptions/).
- Дізнайтесь про [проби контейнерів](/docs/concepts/workloads/pods/probes/) та як вони впливають на готовність Podʼа.
- Дізнайтесь, як [змінювати ресурси Podʼа на місці](/docs/tasks/configure-pod-container/resize-container-resources/).
