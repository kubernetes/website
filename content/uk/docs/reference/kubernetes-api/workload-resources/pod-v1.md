---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod — це колекція контейнерів, які можуть запускатися на одному хості."
title: "Pod"
weight: 1
auto_generated: false
---

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Pod {#Pod}

Pod є колекцією контейнерів, які можуть працювати на одному хості. Цей ресурс створюється клієнтами та розміщується на хостах.

---

- **apiVersion**: v1

- **kind**: Pod

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Метадані стандартного обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  Специфікація бажаної поведінки Podʼа. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)

  Останній спостережуваний статус Podʼа. Ці дані можуть бути застарілими. Заповнюється системою. Тільки для читання. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodSpec {#PodSpec}

PodSpec — це опис Pod.

---

### Контейнери {#containers}

- **containers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>), обовʼязково

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список контейнерів, що належать Podʼу. Зараз контейнери не можуть бути додані або видалені. В Podʼі повинен бути принаймні один контейнер. Не може бути оновлено.

- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список контейнерів ініціалізації, що належать Podʼу. Контейнери ініціалізації виконуються у визначеному порядку перед запуском звичайних контейнерів. Якщо будь-який контейнер ініціалізації зазнає збою, Pod вважається збійним та обробляється відповідно до restartPolicy. Імʼя контейнера ініціалізації або звичайного контейнера повинно бути унікальним серед усіх контейнерів. Контейнери ініціалізації не можуть мати дій Lifecycle, Readiness probes, Liveness probes, або Startup probes. resourceRequirements контейнера ініціалізації враховуються під час планування, знаходячи найбільше значення запиту/ліміту для кожного типу ресурсів, а потім використовуючи максимум цього значення або суму цих значень для звичайних контейнерів. Ліміти застосовуються до контейнерів ініціалізації аналогічним чином. Контейнери ініціалізації зараз не можуть бути додані або видалені. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/init-containers/](/docs/concepts/workloads/pods/init-containers/)

- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список ефемерних контейнерів, що запущені у цьому Pod. Ефемерні контейнери можуть бути запущені в наявному Podʼі для виконання дій, ініційованих користувачем, таких як налагодження. Цей список не може бути вказаний при створенні Podʼа, і його не можна змінити, оновивши специфікацію Podʼа. Щоб додати ефемерний контейнер до наявного Podʼа, використовуйте субресурс ефемерних контейнерів Podʼа.

- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  ImagePullSecrets — це необовʼязково список посилань на Secretʼи у тому ж просторі імен, які використовуються для отримання будь-яких образів, що використовуються у цьому PodSpec. Якщо вказано, ці Secretʼи будуть передані індивідуальним реалізаціям отримувачів для їх використання. Докладніше: [https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod](/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod)

- **enableServiceLinks** (boolean)

  EnableServiceLinks вказує, чи слід впроваджувати інформацію про Serviceʼи у змінні середовища Pod, відповідно до синтаксису Docker посилань. Необовʼязково: стандартне значення — true.

- **os** (PodOS)

  PodOS визначає параметри операційної системи Pod.

  Якщо в поле OS встановлено значення linux, наступні поля не повинні бути встановлені:
  - securityContext.windowsOptions

  Якщо в поле OS встановлено значення windows, наступні поля не повинні бути встановлені:
  - spec.hostPID
  - spec.hostIPC
  - spec.hostUsers
  - spec.resources
  - spec.securityContext.appArmorProfile
  - spec.securityContext.seLinuxOptions
  - spec.securityContext.seccompProfile
  - spec.securityContext.fsGroup
  - spec.securityContext.fsGroupChangePolicy
  - spec.securityContext.sysctls
  - spec.shareProcessNamespace
  - spec.securityContext.runAsUser
  - spec.securityContext.runAsGroup
  - spec.securityContext.supplementalGroups
  - spec.securityContext.supplementalGroupsPolicy
  - spec.containers[*].securityContext.appArmorProfile
  - spec.containers[*].securityContext.seLinuxOptions
  - spec.containers[*].securityContext.seccompProfile
  - spec.containers[*].securityContext.capabilities
  - spec.containers[*].securityContext.readOnlyRootFilesystem
  - spec.containers[*].securityContext.privileged
  - spec.containers[*].securityContext.allowPrivilegeEscalation
  - spec.containers[*].securityContext.procMount
  - spec.containers[*].securityContext.runAsUser
  - spec.containers[*].securityContext.runAsGroup

  <a name="PodOS"></a>
  *PodOS визначає параметри операційної системи Pod.*

  - **os.name** (string), обовʼязково

    Name — це назва операційної системи. Поточні підтримувані значення — linux і windows. Додаткове значення може бути визначено у майбутньому і може бути одним з: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration. Клієнти повинні очікувати обробку додаткових значень і розглядати нерозпізнані значення у цьому полі як os: null.

### Томи {#volumes}

- **volumes** ([]<a href="{{< ref "../config-and-storage-resources/volume#Volume" >}}">Volume</a>)

  *Patch strategies: retainKeys, обʼєднання по ключу `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список томів, які можуть бути змонтовані контейнерами, що належать Podʼу. Докладніше: [https://kubernetes.io/docs/concepts/storage/volumes](/docs/concepts/storage/volumes)

### Планування {#scheduling}

- **nodeSelector** (map[string]string)

  NodeSelector — це селектор, який має бути істинним, щоб Pod підходив для вузла. Селектор, який має відповідати міткам вузла для планування Podʼа на цьому вузлі. Докладніше: [https://kubernetes.io/docs/concepts/configuration/assign-pod-node/](/docs/concepts/configuration/assign-pod-node/)

- **nodeName** (string)

  Поле `NodeName` вказує, на якому вузлі (node) заплановано запуск цього podʼа. Якщо це поле порожнє, pod є кандидатом для планування за допомогою планувальника, визначеного в полі `schedulerName`. Після того як це поле встановлено, kubelet цього вузла стає відповідальним за життєвий цикл podʼа. Це поле не слід використовувати для вираження бажання запустити pod на конкретному вузлі. Детальніше: [https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodename](/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)

- **affinity** (Affinity)

  Якщо вказано, це обмеження на планування Podʼа.

  <a name="Affinity"></a>
  *Affinity — це група правил планування з урахуванням спорідненості.*

  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)

    Описує правила планування Podʼа з урахуванням спорідненості до вузла.

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)

    Описує правила планування Podʼа з урахуванням спорідненості до інших Podʼів (наприклад, розташувати цей Pod на тому ж вузлі, у тій же зоні тощо, що й інші Podʼи).

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)

    Описує правила планування Podʼа з урахуванням анти-спорідненості до інших Podʼів (наприклад, уникати розташування цього Podʼа на тому ж вузлі, у тій же зоні тощо, що й інші Podʼи).

- **tolerations** ([]Toleration)

  *Atomic: буде замінено під час злиття*

  Якщо вказано, визначає толерантності Podʼа.

  <a name="Toleration"></a>
  *Pod, до якого прикріплено цю толерантність, толерує будь-який taint, який відповідає трійці <key,value,effect> за допомогою оператора зіставлення <operator>.*

  - **tolerations.key** (string)

    Ключ taint, до якого застосовується толерантність. Порожнє значення означає відповідність усім ключам taint. Якщо ключ порожній, оператор має бути Exists; ця комбінація означає відповідність усім значенням та ключам.

  - **tolerations.operator** (string)

    Оператор, що представляє стосунок ключа до значення. Допустимі оператори — Exists, Equal, Lt та Gt. Стандартне значення — Equal. Exists еквівалентний знаку підстановки для значення, щоб Pod міг толерувати всі taint певної категорії. Lt і Gt виконують числові порівняння ( потребує функціональну можливість TaintTolerationComparisonOperators).

    Можливі значення переліку (enum):
    - `"Equal"`
    - `"Exists"`
    - `"Gt"`
    - `"Lt"`

  - **tolerations.value** (string)

    Значення taint, до якого застосовується толерантність. Якщо оператор Exists, значення має бути порожнім, в іншому випадку — це звичайний рядок.

  - **tolerations.effect** (string)

    Ефект, до якого застосовується толерантність. Порожнє значення означає відповідність усім ефектам taint. Допустимі значення: NoSchedule, PreferNoSchedule та NoExecute.

    Можливі значення переліку (enum):
    - `"NoExecute"` Виселити будь-які вже запущені Podʼи, які не толерують taint. В даний час це контролюється NodeController.
    - `"NoSchedule"` Не дозволяти новим Podʼам плануватися на вузол, якщо вони не толерують taint, але дозволяти всім Podʼам, надісланим до Kubelet без проходження через планувальник, запускатися, а також дозволяти всім вже запущеним Podʼам продовжувати працювати. Контролюється планувальником.
    - `"PreferNoSchedule"` Як TaintEffectNoSchedule, але планувальник намагається не планувати нові Podʼи на вузол, а не забороняти новим Podʼам плануватися на вузол повністю. Контролюється планувальником.

  - **tolerations.tolerationSeconds** (int64)

    TolerationSeconds визначає період часу, протягом якого толерантність (яка має бути з ефектом NoExecute, інакше це поле ігнорується) толерує taint. Стандартно не встановлюється, що означає виконувати толерування taint назавжди (не видаляти). Нульові та відʼємні значення система обробляє як 0 (негайне видалення).

- **schedulerName** (string)

  Якщо вказано, Pod буде оброблено вказаним планувальником. Якщо не вказано, Pod буде оброблено стандартним планувальником.

- **runtimeClassName** (string)

  RuntimeClassName посилається на обʼєкт RuntimeClass у групі node.k8s.io, який повинен бути використаний для запуску цього Podʼа. Якщо жоден ресурс RuntimeClass не відповідає названому класу, Pod не буде запущено. Якщо не встановлено або порожнє, буде використано "старий" RuntimeClass, який є неявним класом з порожнім визначенням, що використовує стандартний обробник середовища. Детальніше: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class

- **priorityClassName** (string)

  Якщо вказано, вказує на пріоритет Podʼа. "system-node-critical" та "system-cluster-critical" — це два спеціальні ключові слова, які вказують на найвищі пріоритети, причому перший має найвищий пріоритет. Будь-яке інше імʼя має бути визначене шляхом створення обʼєкта PriorityClass з цим імʼям. Якщо не вказано, пріоритет Podʼа буде стандартним або нульовим, якщо немає стандартного значення.

- **priority** (int32)

  Значення пріоритету. Різні системні компоненти використовують це поле для визначення пріоритету Podʼа. Коли включено контролер доступу до пріоритетів (Priority Admission Controller), він не дозволяє користувачам встановлювати це поле. Контролер доступу заповнює це поле з PriorityClassName. Чим вище значення, тим вищий пріоритет.

- **preemptionPolicy** (string)

  PreemptionPolicy — це політика випередження для Podʼів з нижчим пріоритетом. Одне з: Never чи PreemptLowerPriority. Стандартне значення — PreemptLowerPriority, якщо не встановлено.

  Можливі значення переліку (enum):
  - `"Never"` означає, що Pod не може випереджати інші Podʼи з нижчим пріоритетом.
  - `"PreemptLowerPriority"` означає, що Pod може випереджати інші Podʼи з нижчим пріоритетом.

- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  *Patch strategy: об’єднання за ключем `topologyKey`*

  *Map: під час об’єднання будуть збережені унікальні значення за ключами `topologyKey, whenUnsatisfiable`*

  TopologySpreadConstraints описує, як група Podʼів повинна розподілятися по топологічних доменах. Планувальник розміщуватиме Podʼи таким чином, щоб дотримуватися обмежень. Всі topologySpreadConstraints поєднуються логічним оператором AND.

  <a name="TopologySpreadConstraint"></a>
  *TopologySpreadConstraint визначає, як розподіляти відповідні Podʼи серед заданої топології.*

  - **topologySpreadConstraints.maxSkew** (int32), обовʼязково

    MaxSkew описує ступінь нерівномірного розподілу Podʼів. Коли `whenUnsatisfiable=DoNotSchedule`, це максимальна допустима різниця між кількістю відповідних Podʼів у цільовій топології та глобальним мінімумом. Глобальний мінімум — це мінімальна кількість відповідних Podʼів у відповідному домені або нуль, якщо кількість відповідних доменів менша за MinDomains. Наприклад, у кластері з 3 зонами MaxSkew встановлено на 1, і Podʼи з однаковим labelSelector розподіляються як 2/2/1: У цьому випадку глобальний мінімум дорівнює 1.

    {{<mermaid>}}
    graph TD;

    subgraph zone3["zone 3"]
            P3_1("Pod")
    end
    subgraph zone2["zone 2"]
            P2_1("Pod")
            P2_2("Pod")
    end
    subgraph zone1["zone 1"]
            P1_1("Pod")
            P1_2("Pod")
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class P1_1,P1_2,P2_1,P2_2,P3_1 k8s;
    class zone1,zone2,zone3 cluster;
    {{</mermaid>}}

    - якщо MaxSkew дорівнює 1, новий Pod може бути розміщений тільки в zone3, щоб стати 2/2/2; розміщення його в zone1 (zone2) призведе до порушення MaxSkew (1) через ActualSkew (3-1) в zone1 (zone2).
    - якщо MaxSkew дорівнює 2, новий Pod може бути розміщений у будь-якій зоні. Коли `whenUnsatisfiable=ScheduleAnyway`, це використовується для надання більшої переваги топологіям, які задовольняють цю умову. Це обовʼязкове поле. Стандартне значення — 1; 0 не допускається.

  - **topologySpreadConstraints.topologyKey** (string), обовʼязково

    TopologyKey — це ключ міток вузлів. Вузли, які мають мітку з цим ключем та ідентичними значеннями, вважаються такими, що належать до однієї топології. Ми розглядаємо кожен \<key, value> як "кошик" і намагаємося розмістити збалансовану кількість Podʼів у кожному кошику. Ми визначаємо домен як конкретний екземпляр топології. Також ми визначаємо відповідний домен як домен, чиї вузли відповідають вимогам nodeAffinityPolicy та nodeTaintsPolicy. Наприклад, якщо TopologyKey — це "kubernetes.io/hostname", кожен вузол є доменом цієї топології. І, якщо TopologyKey — це "topology.kubernetes.io/zone", кожна зона є доменом цієї топології. Це обовʼязкове поле.

  - **topologySpreadConstraints.whenUnsatisfiable** (string), обовʼязково

    WhenUnsatisfiable вказує, як діяти з Podʼом, якщо він не відповідає умовам розподілу.

    - DoNotSchedule (стандартно) наказує планувальнику не розміщувати його.
    - ScheduleAnyway наказує планувальнику розмістити Pod у будь-якому місці, але з наданням більшої переваги топологіям, які допоможуть зменшити нерівномірність розподілу. Умова вважається "незадовільною" для вхідного Podʼа, якщо і тільки якщо кожне можливе призначення вузла для цього Podʼа порушуватиме "MaxSkew" у деякій топології. Наприклад, у кластері з 3 зонами MaxSkew встановлено на 1, і Podʼи з однаковим labelSelector розподіляються як 3/1/1:

      {{<mermaid>}}
      graph TD;

      subgraph zone3["zone 3"]
              P3_1("Pod")
      end
      subgraph zone2["zone 2"]
              P2_1("Pod")
      end
      subgraph zone1["zone 1"]
              P1_1("Pod")
              P1_2("Pod")
              P1_3("Pod")
      end

      classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
      classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
      classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
      class P1_1,P1_2,P1_3,P2_1,P3_1 k8s;
      class zone1,zone2,zone3 cluster;
      {{</mermaid>}}

      Якщо WhenUnsatisfiable встановлено на DoNotSchedule, новий Pod може бути розміщений тільки в zone2 (zone3), щоб стати 3/2/1 (3/1/2), оскільки ActualSkew (2-1) у zone2 (zone3) задовольняє MaxSkew (1). Іншими словами, кластер все ще може бути незбалансованим, але планувальник не зробить його *більш* незбалансованим. Це обовʼязкове поле.

      Можливі значення переліку (enum):
      - `"DoNotSchedule"` наказує планувальнику не планувати pod, коли обмеження не задовольняються.
      - `"ScheduleAnyway"` наказує планувальнику планувати pod, навіть якщо обмеження не задовольняються.

  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    LabelSelector використовується для знаходження відповідних Podʼів. Podʼи, які відповідають цьому label selector, враховуються для визначення кількості Podʼів у відповідному топологічному домені.

  - **topologySpreadConstraints.matchLabelKeys** ([]string)

    *Atomic: буде замінено під час об’єднання*

    MatchLabelKeys — це набір ключів міток Podʼа для вибору Podʼів, за якими буде розраховано розподіл. Ключі використовуються для пошуку значень у мітках вхідного Podʼа, ці ключ-значення міток поєднуються з labelSelector для вибору групи наявних Podʼів, за якими буде розраховано розподіл для вхідного Podʼа. Той самий ключ заборонено мати як у MatchLabelKeys, так і в LabelSelector. MatchLabelKeys не можна встановлювати, коли LabelSelector не встановлено. Ключі, які не існують у мітках вхідного Podʼа, будуть ігноруватися. Нульовий або порожній список означає збіг тільки з labelSelector.

    Це бета-поле і вимагає ввімкнення функції MatchLabelKeysInPodTopologySpread (типово увімкнено).

  - **topologySpreadConstraints.minDomains** (int32)

    MinDomains вказує мінімальну кількість відповідних доменів. Коли кількість відповідних доменів з відповідними топологічними ключами менша за minDomains, Pod Topology Spread трактує "глобальний мінімум" як 0, і потім виконується розрахунок Skew. І коли кількість відповідних доменів з відповідними топологічними ключами дорівнює або перевищує minDomains, це значення не впливає на розподіл. У результаті, коли кількість відповідних доменів менша за minDomains, планувальник не розміщуватиме більше maxSkew Podʼів у ці домени. Якщо значення дорівнює null, обмеження поводиться так, ніби MinDomains дорівнює 1. Допустимі значення — цілі числа, більші за 0. Коли значення не дорівнює null, WhenUnsatisfiable має бути DoNotSchedule.

    Наприклад, у кластері з 3 зонами MaxSkew встановлено на 2, MinDomains встановлено на 5, і Podʼи з однаковим labelSelector розподіляються як 2/2/2:

    {{<mermaid>}}
    graph TD;

    subgraph zone3["zone 3"]
            P3_1("Pod")
            P3_2("Pod")
    end
    subgraph zone2["zone 2"]
            P2_1("Pod")
            P2_2("Pod")
    end
    subgraph zone1["zone 1"]
            P1_1("Pod")
            P1_2("Pod")
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class P1_1,P1_2,P2_1,P2_2,P3_1,P3_2 k8s;
    class zone1,zone2,zone3 cluster;
    {{</mermaid>}}

    Кількість доменів менша за 5 (MinDomains), тому "глобальний мінімум" трактуватиметься як 0. У цій ситуації новий Pod з тим самим labelSelector не може бути розміщений, оскільки обчислений skew буде 3 (3 - 0), якщо новий Pod буде розміщено в будь-якій з трьох зон, це порушить MaxSkew.

  - **topologySpreadConstraints.nodeAffinityPolicy** (string)

    NodeAffinityPolicy вказує, як ми будемо враховувати nodeAffinity/nodeSelector Podʼа при розрахунку перекосу розподілу топології Pod. Варіанти:

    - Honor: тільки вузли, що відповідають nodeAffinity/nodeSelector, включаються до розрахунків.
    - Ignore: nodeAffinity/nodeSelector ігноруються. Всі вузли включаються до розрахунків.

    Якщо це значення дорівнює null, поведінка еквівалентна політиці Honor.

    Можливі значення переліку (enum):
    - `"Honor"` наказує використовувати цю директиву планування при розрахунку перекосу розподілу топології pod.
    - `"Ignore"` наказує ігнорувати цю директиву планування при розрахунку перекосу розподілу топології pod.

  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    NodeTaintsPolicy вказує, як ми будемо враховувати node taints при розрахунку перекосу розподілу топології Pod. Варіанти:

    - Honor: вузли без taints, разом з вузлами з taints, для яких вхідний Pod має толерантність, включаються.
    - Ignore: node taints ігноруються. Всі вузли включаються.

    Можливі значення переліку (enum):
    - `"Honor"` наказує використовувати цю директиву планування при розрахунку перекосу розподілу топології pod.
    - `"Ignore"` наказує ігнорувати цю директиву планування при розрахунку перекосу розподілу топології pod.

- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead представляє ресурси, що представляють накладні витрати Podʼа для роботи з конкретним RuntimeClass. Це поле буде автоматично заповнене під час допуску контролером RuntimeClass. Якщо контролер допуску RuntimeClass увімкнено, overhead не повинен бути встановлений у запитах на створення Podʼа. Контролер допуску RuntimeClass відхилить запити на створення Podʼа, у яких overhead вже встановлений. Якщо RuntimeClass налаштований та обраний у PodSpec, Overhead буде встановлено на значення, визначене у відповідному RuntimeClass, в іншому випадку воно залишиться невстановленим та буде вважатися рівним нулю. Докладніше: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md

### Життєвий цикл {#lifecycle}

- **activeDeadlineSeconds** (int64)

  Опціональна тривалість у секундах, протягом якої под може бути активним на вузлі відносно StartTime, перш ніж система почне активно намагатися позначити його як несправний і вбити повʼязані контейнери. Значення повинно бути додатним цілим числом.

- **readinessGates** ([]PodReadinessGate)

  *Atomic: буде замінено під час об’єднання*

  Якщо вказано, всі елементи готовності будуть оцінені на предмет готовності подів. Под готовий, коли всі його контейнери готові І всі стани, вказані в елементах готовності, мають статус, рівний "True". Більше інформації: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  *PodReadinessGate містить посилання на стан пода*

  - **readinessGates.conditionType** (string), обовʼязково

    ConditionType посилається на стан у списку станів подів із відповідним типом.

- **restartPolicy** (string)

  Політика перезапуску для всіх контейнерів у Podʼі. Одне з Always, OnFailure, Never. В деяких контекстах може бути дозволений лише субнабір цих значень. Стандартне значення — Always. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)

  Можливі значення переліку (enum):
  - `"Always"`
  - `"Never"`
  - `"OnFailure"`

- **terminationGracePeriodSeconds** (int64)

  Необовʼязкова тривалість у секундах, необхідна для коректного завершення роботи Podʼа. Може бути зменшена у запиті на видалення. Значення повинно бути невідʼємним цілим числом. Значення нуль означає негайне припинення через сигнал kill (без можливості завершити роботу коректно). Якщо це значення є nil, буде використано стандартний період завершення. Період належного завершення — це тривалість у секундах після того, як процеси, що працюють у Podʼі, отримають сигнал про завершення, і до того, як вони будуть примусово зупинені сигналом kill. Встановіть це значення більше, ніж очікуваний час завершення вашого процесу. Стандартне значення — 30 секунд.

- **workloadRef** (WorkloadReference)

  WorkloadRef надає посилання на обʼєкт Workload, до якого належить цей Pod. Це поле використовується планувальником для ідентифікації PodGroup і застосування правильних політик планування груп. Обʼєкт Workload, на який посилається це поле, може не існувати на момент створення Podʼа. Це поле є незмінним, але обʼєкт Workload з тим самим іменем може бути створений заново з іншими політиками. Якщо це зробити під час планування podʼа, розміщення може не відповідати очікуваним політикам.

  <a name="WorkloadReference"></a>
  *WorkloadReference ідентифікує обʼєкт Workload та членство PodGroup, до якого належить Pod. Планувальник використовує цю інформацію для застосування семантики планування з урахуванням навантаження.*

  - **workloadRef.name** (string), обовʼязково

    Name визначає імʼя обʼєкта Workload, до якого належить цей Pod. Workload повинен знаходитися в тому ж просторі імен, що і Pod. Якщо він не відповідає жодному з наявних Workload, Pod залишатиметься незапланованим, доки не буде створено обʼєкт Workload і він не буде виявлений kube-scheduler. Це повинен бути піддомен DNS.

  - **workloadRef.podGroup** (string), обовʼязково

    PodGroup — це назва PodGroup у рамках робочого навантаження, до якого належить цей Pod. Якщо вона не збігається з жодною з наявних PodGroup у рамках робочого навантаження, Pod залишатиметься незапланованим, доки обʼєкт робочого навантаження не буде створено заново та не буде проіндексовано kube-scheduler. Це має бути мітка DNS.

  - **workloadRef.podGroupReplicaKey** (string)

    PodGroupReplicaKey визначає ключ репліки PodGroup, до якої належить цей Pod. Він використовується для розрізнення Podʼів, що належать до різних реплік однієї групи Podʼів. Політика групи Podʼів застосовується окремо до кожної репліки. При встановленні вона повинна бути міткою DNS.

### Імʼя хосту та розвʼязування імен {#hostname-and-name-resolution}

- **hostname** (string)

  Вказує імʼя хосту Podʼа. Якщо не вказано, імʼя хосту Podʼа буде встановлено в значення визначене системою.

- **hostnameOverride** (string)

  HostnameOverride дозволяє явне перевизначення імені хоста для подів, як воно сприймається самим подом. Це поле визначає лише імʼя хоста для подів і не впливає на його записи DNS. Коли це поле встановлено на непусте значення:
  - Воно має пріоритет над значеннями, встановленими в `hostname` та `subdomain`.
  - Імʼя хосту пода буде встановлено на це значення.
  - `setHostnameAsFQDN` має бути nil або встановлено на false.
  - `hostNetwork` має бути встановлено на false.

  Це поле має бути дійсним піддоменом DNS, як визначено в RFC 1123, і містити не більше 64 символів. Потрібно ввімкнути функцію HostnameOverride.

- **setHostnameAsFQDN** (boolean)

  Якщо встановлено значення true, імʼя хосту Podʼа буде налаштоване як повне доменне імʼя (FQDN) Podʼа, а не просто коротке імʼя (стандартно). У Linux-контейнерах це означає встановлення FQDN в полі імʼя хосту ядра (поле nodename структури utsname). У Windows-контейнерах це означає встановлення значення реєстру імʼя хосту для ключа реєстру HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters на FQDN. Якщо Pod не має FQDN, це не має ефекту. Стандартне значення — false.

- **subdomain** (string)

  Якщо вказано, повне кваліфіковане імʼя хосту Podʼа буде "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". Якщо не вказано, Pod не буде мати доменного імені взагалі.

- **hostAliases** ([]HostAlias)

  *Patch strategy: обʼєднання за ключем `ip`*

  *Map: унікальні значення ключа ip будуть збережені під час злиття*

  HostAliases є необовʼязковим списком хостів та IP, які будуть впроваджені у файл hosts Podʼа, якщо вказано.

  <a name="HostAlias"></a>
  *HostAlias містить зітсавлення між IP та іменами хостів, які будуть впроваджені як запис у файл hosts Podʼа.*

  - **hostAliases.ip** (string), обовʼязково

    Запис IP-адреси у файлі hosts.

  - **hostAliases.hostnames** ([]string)

    *Atomic: буде замінено під час злиття*

    Імена хостів для вищевказаної IP-адреси.

- **dnsConfig** (PodDNSConfig)

  Вказує параметри DNS Podʼа. Параметри, вказані тут, будуть обʼєднані зі згенерованою DNS-конфігурацією на основі DNSPolicy.

  <a name="PodDNSConfig"></a>
  *PodDNSConfig визначає параметри DNS Podʼа на додаток до тих, що генеруються з DNSPolicy.*

  - **dnsConfig.nameservers** ([]string)

    *Atomic: буде замінено під час злиття*

    Список IP-адрес DNS-серверів імен. Він буде доданий до основних серверів імен, згенерованих з DNSPolicy. Дубльовані сервери імен будуть видалені.

  - **dnsConfig.options** ([]PodDNSConfigOption)

    *Atomic: буде замінено під час злиття*

    Список опцій DNS-резолвера. Він буде обʼєднаний з основними опціями, згенерованими з DNSPolicy. Дубльовані записи будуть видалені. Опції розвʼязування імен, зазначені в Options, замінять ті, що зʼявляються в основній DNSPolicy.

    <a name="PodDNSConfigOption"></a>
    *PodDNSConfigOption визначає опції DNS-резольвера Podʼа.*

    - **dnsConfig.options.name** (string)

      Name — ім'я цього параметра DNS-резолвера. Обовʼязкове.

    - **dnsConfig.options.value** (string)

      Value — це значення цієї опції DNS-резолвера.

  - **dnsConfig.searches** ([]string)

    *Atomic: буде замінено під час злиття*

    Список доменів пошуку DNS для пошуку імен хостів. Він буде доданий до основних шляхів пошуку, згенерованих з DNSPolicy. Дубльовані шляхи пошуку будуть видалені.

- **dnsPolicy** (string)

  Встановлює політику DNS для Podʼа. Стандартне значеняя — "ClusterFirst". Допустимі значення: ʼClusterFirstWithHostNetʼ, ʼClusterFirstʼ, ʼDefaultʼ або ʼNoneʼ. Параметри DNS, задані в DNSConfig, будуть обʼєднані з політикою, вибраною за допомогою DNSPolicy. Щоб налаштувати опції DNS разом з hostNetwork, потрібно явно вказати політику DNS як ʼClusterFirstWithHostNetʼ.

  Можливі значення переліку (enum):
  - `"ClusterFirst"` вказує, що pod повинен спочатку використовувати кластерний DNS, якщо hostNetwork не дорівнює true, а якщо він доступний, то використовувати стандартні (визначені kubelet) налаштування DNS.
  - `"ClusterFirstWithHostNet"` вказує, що pod повинен спочатку використовувати кластерний DNS, якщо він доступний, а потім повертатися до стандартних (визначених kubelet) налаштувань DNS.
  - `"Default"` вказує, що pod повинен використовувати стандартні (визначені kubelet) налаштування DNS.
  - `"None"` вказує, що pod повинен використовувати порожні налаштування DNS. Параметри DNS, такі як сервери імен та шляхи пошуку, повинні бути визначені через DNSConfig.

### Простори імен хоста {#host-namespaces}

- **hostNetwork** (boolean)

  Використання мережі хоста для цього Podʼа. При використанні HostNetwork слід вказати порти, щоб планувальник знав про них. Коли `hostNetwork` має значення true, вказані поля `hostPort` у визначеннях портів повинні збігатись з `containerPort`, а невизначені поля `hostPort` у визначеннях портів стандартно збігаються з `containerPort`. Стандартне значення — false.

- **hostPID** (boolean)

  Використання простору імен PID хоста. Необовʼязково: стандартне значення — false.

- **hostIPC** (boolean)

  Використання простору імен IPC хоста. Необовʼязково: стандартне значення — false.

- **shareProcessNamespace** (boolean)

  Спільний процесний простір імен між усіма контейнерами в Podʼі. Якщо це встановлено, контейнери зможуть бачити та надсилати сигнали процесам з інших контейнерів у тому ж Podʼі, і перший процес у кожному контейнері не буде мати PID 1. HostPID та ShareProcessNamespace не можуть бути встановлені одночасно. Необовʼязково: стандартне значення — false.

### Службовий обліковий запис {#service-account}

- **serviceAccountName** (string)

  ServiceAccountName — це імʼя службового облікового запису, який використовується для запуску цього Podʼа. Детальніше: [https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/](/docs/tasks/configure-pod-container/configure-service-account/)

- **automountServiceAccountToken** (boolean)

  AutomountServiceAccountToken вказує, чи повинен токен службового облікового запису автоматично монтуватися.

### Контекст безпеки {#security-context}

- **securityContext** (PodSecurityContext)

  SecurityContext містить атрибути безпеки на рівні Podʼа та загальні налаштування контейнера. Необовʼязково: стандартне значення — порожньо. Див. опис типу для стандартних значень для кожного поля.

  <a name="PodSecurityContext"></a>
  *PodSecurityContext містить атрибути безпеки на рівні Podʼа та загальні налаштування контейнера. Деякі поля також присутні у container.securityContext. Значення полів container.securityContext мають пріоритет над значеннями полів PodSecurityContext.*

  - **securityContext.appArmorProfile** (AppArmorProfile)

    appArmorProfile — параметри AppArmor, які будуть використовуватися контейнерами у цьому pod'і. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    <a name="AppArmorProfile"></a>
    *AppArmorProfile визначає налаштування AppArmor для контейнера або podʼа.*

    - **securityContext.appArmorProfile.type** (string), обовʼязково

      Поле `type` вказує, який тип профілю AppArmor буде застосовано. Дійсні варіанти:
      - `Localhost` — профіль, попередньо завантажений на вузлі.
      - `RuntimeDefault` — стандартний профіль середовища виконання контейнрів.
      - `Unconfined` — без примусового виконання правил AppArmor.

      Можливі значення переліку (enum):
      - `"Localhost"` вказує, що слід використовувати профіль, попередньо завантажений на вузлі.
      - `"RuntimeDefault"` вказує, що слід використовувати стандартний профіль середовища виконання контейнерів.
      - `"Unconfined"` вказує, що не слід застосовувати жоден профіль AppArmor.

    - **securityContext.appArmorProfile.localhostProfile** (string)

      `localhostProfile` вказує профіль, завантажений на вузлі, який слід використовувати. Профіль має бути попередньо налаштований на вузлі для коректної роботи. Назва профілю повинна відповідати завантаженій назві. Це поле повинно бути встановлене, якщо і тільки якщо тип дорівнює "Localhost".

  - **securityContext.fsGroup** (int64)

    Спеціальна додаткова група, яка застосовується до всіх контейнерів у Podʼі. Деякі типи томів дозволяють Kubelet змінювати право власності на цей том, щоб він належав Podʼу:

    1. GID власника буде FSGroup
    2. Встановлюється біт setgid (нові файли, створені в томі, будуть належати FSGroup)
    3. Біти дозволів обʼєднуються з rw-rw----

    Якщо не встановлено, Kubelet не змінює право власності та  дозволи будь-якого тому. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy визначає поведінку зміни прав власності та дозволів тому перед тим, як він буде доступний у Podʼі. Це поле застосовується лише до типів томів, які підтримують права власності на основі fsGroup (та дозволів). Це не впливає на ефемерні типи томів, такі як: secret, configmaps та emptydir. Дійсні значення: "OnRootMismatch" та "Always". Якщо не вказано, використовується "Always". Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    Можливі значення переліку (enum):
    - `"Always"` вказує, що право власності та дозволи тому завжди повинні змінюватися щоразу, коли том монтується всередині Podʼа. Це стандартна поведінка.
    - `"OnRootMismatch"` вказує, що право власності та дозволи тому будуть змінені лише тоді, коли права та власність кореневої теки не відповідають очікуваним правам в томі. Це може допомогти скоротити час, необхідний для зміни прав власності та дозволів тому.

  - **securityContext.runAsUser** (int64)

    UID, з яким запускається початковий процес контейнера. Стандартно використовується користувач, вказаний у метаданих образу, якщо не вказано інше. Також може бути встановлено в `PodSecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, зазначене в `SecurityContext`. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.runAsNonRoot** (boolean)

    Вказує, що контейнер повинен запускатися як користувач, який не є root. Якщо значення `true`, Kubelet перевірить образ під час виконання, щоб гарантувати, що він не запускається з UID 0 (root), і не запустить контейнер, якщо це не так. Якщо поле не встановлено або має значення `false`, така перевірка не виконується. Також може бути налаштовано в `SecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, вказане в `SecurityContext`.

  - **securityContext.runAsGroup** (int64)

    GID, під яким запускається початковий процес контейнера. Якщо не встановлено, використовується стандартне значення для середовища виконання. Також може бути вказано в `SecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, зазначене в `SecurityContext` для цього контейнера. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

  - **securityContext.seccompProfile** (SeccompProfile)

    Параметри seccomp для використання контейнерами в цьому Podʼі. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile визначає налаштування профілю seccomp для Podʼа/контейнера. Може бути встановлено лише одне джерело профілю.*

    - **securityContext.seccompProfile.type** (string), обовʼязкове

      type вказує, який тип профілю seccomp буде застосовано. Допустимі варіанти:

      - Localhost — має бути використаний профіль, визначений у файлі на вузлі.
      - RuntimeDefault — має бути використаний стандартний профіль для середовища виконання контейнерів.
      - Unconfined — не застосовується жоден профіль.

      Можливі значення переліку (enum):
      - `"Localhost"` вказує, що має бути використаний профіль, визначений у файлі на вузлі. Шлях до файлу відносно \<kubelet-root-dir>/seccomp.
      - `"RuntimeDefault"` вказує, що має бути використаний стандартний профіль для середовища виконання контейнерів.
      - `"Unconfined"` вказує, що не застосовується жоден профіль.

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile вказує, що має бути використаний профіль, визначений у файлі на вузлі. Профіль має бути попередньо налаштований на вузлі, щоб працювати. Має бути низхідний шлях, відносно до налаштованого розташування профілю seccomp kubelet. Має бути встановлено, якщо тип "Localhost". НЕ має бути встановлено для будь-якого іншого типу.

  - **securityContext.seLinuxChangePolicy** (string)

    seLinuxChangePolicy визначає спосіб застосування мітки SELinux контейнера до всіх томів, що використовуються Pod. Вона не впливає на вузли, які не підтримують SELinux, або на томи, які не підтримують SELinux. Допустимими значеннями є "MountOption" і "Recursive".

    "Recursive" означає перемаркування всіх файлів на всіх томах Pod під час виконання контейнера. Це може бути повільним для великих томів, але дозволяє змішувати привілейовані і непривілейовані Podʼи, що мають спільний доступ до одного тому на одному вузлі.

    "MountOption" монтує всі придатні томи Pod з параметром монтування `-o context`. Для цього потрібно, щоб усім Podʼам, які мають спільний доступ до одного тому, було присвоєно однакову мітку SELinux. Неможливо надати спільний доступ до одного тому привілейованим і непривілейованим Podʼам. Допустимими томами є внутрішні томи FibreChannel і iSCSI, а також усі томи CSI, чий драйвер CSI оголошує про підтримку SELinux, встановлюючи spec.seLinuxMount: true у своєму екземплярі CSIDriver. Інші томи завжди перемарковуються рекурсивно. Значення "MountOption" дозволено лише тоді, коли увімкнено функцію SELinuxMount.

    Якщо не вказано, а функціональну можливість SELinuxMount увімкнено, буде використано значення "MountOption". Якщо не вказано і SELinuxMount вимкнено, для томів ReadWriteOncePod використовується "MountOption", а для всіх інших томів — "Recursive".

    Це поле впливає лише на ті Podʼи, для яких встановлено мітку SELinux або у PodSecurityContext, або у SecurityContext усіх контейнерів.

    Усі Podʼи, які використовують той самий том, повинні використовувати ту саму політику seLinuxChangePolicy, інакше деякі podʼи можуть застрягнути у стані ContainerCreating. Зауважте, що це поле не може бути встановлено, якщо spec.os.name має значення windows.

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    Контекст SELinux, який буде застосовано до всіх контейнерів. Якщо не зазначено, середовище виконання контейнера виділить випадковий контекст SELinux для кожного контейнера. Також може бути встановлено в SecurityContext. Якщо встановлено і в SecurityContext, і в PodSecurityContext, то значення, зазначене в SecurityContext, має пріоритет для цього контейнера. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions — це мітки, які будуть застосовані до контейнера*

    - **securityContext.seLinuxOptions.level** (string)

      Level — це мітка рівня SELinux, яка застосовується до контейнера.

    - **securityContext.seLinuxOptions.role** (string)

      Role — це мітка ролі SELinux, яка застосовується до контейнера.

    - **securityContext.seLinuxOptions.type** (string)

      Type — це мітка типу SELinux, яка застосовується до контейнера.

    - **securityContext.seLinuxOptions.user** (string)

      User — це мітка користувача SELinux, яка застосовується до контейнера.

  - **securityContext.supplementalGroups** ([]int64)

    *Atomic: буде замінено під час злиття*

    Список груп, які застосовуються до першого процесу, запущеного в кожному контейнері, на додачу до основного GID контейнера та `fsGroup` (якщо вказано). Якщо функція `SupplementalGroupsPolicy` увімкнена, поле `supplementalGroupsPolicy` визначає, чи будуть ці групи додані до вже визначених у контейнерному образі або замінять їх. Якщо не вказано, додаткові групи не додаються, хоча членство в групах, визначених в образі контейнера, може бути використане залежно від поля `supplementalGroupsPolicy`. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

  - **securityContext.supplementalGroupsPolicy** (string)

    Визначає, як обчислюються додаткові групи для перших процесів контейнера. Дійсні значення: "Merge" і "Strict". Якщо не вказано, використовується значення "Merge". (Alpha) Використання цього поля вимагає ввімкненої функції `SupplementalGroupsPolicy`, і середовище виконання контейнерів повинно підтримувати цю функцію. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    Можливі значення переліку (enum):
    - `"Merge"` вказує, що SupplementalGroups контейнера та FsGroup (вказані в SecurityContext) будуть обʼєднані з групами основного користувача, як визначено в образі контейнера (в /etc/group).
    - `"Strict"` вказує, що SupplementalGroups контейнера та FsGroup (вказані в SecurityContext) будуть використані замість будь-яких груп, визначених в образі контейнера.

  - **securityContext.sysctls** ([]Sysctl)

    *Atomic: буде замінено під час злиття*

    Sysctls містять список sysctls з простором імен, що використовуються для Podʼа. Podʼи з непідтримуваними sysctl (середовищем виконання контейнера) можуть не запуститися. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    <a name="Sysctl"></a>
    *Sysctl визначає параметр ядра, який потрібно встановити*

    - **securityContext.sysctls.name** (string), обовʼязкове

      Назва властивості

    - **securityContext.sysctls.value** (string), обовʼязкове

      Значення властивості

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    Параметри, специфічні для Windows, що застосовуються до всіх контейнерів. Якщо не зазначено, використовуються параметри у SecurityContext контейнера. Якщо встановлено і в SecurityContext, і в PodSecurityContext, то значення, зазначене в SecurityContext, має пріоритет. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions містять параметри та облікові дані, специфічні для Windows.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec — це місце, де веб-хук GMSA (https://github.com/kubernetes-sigs/windows-gmsa) вставляє вміст GMSA credential spec, зазначений у полі GMSACredentialSpecName.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName — це ім’я специфікації облікових даних GMSA для використання.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess визначає, чи повинен контейнер запускатися як контейнер ʼHost Processʼ. Усі контейнери Podʼа повинні мати однакове ефективне значення HostProcess (не дозволяється змішування контейнерів HostProcess та не-HostProcess). Крім того, якщо HostProcess дорівнює true, то HostNetwork також має бути встановлено на true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      Ім’я користувача в Windows для запуску точки входу процесу контейнера. Стандартно використовується користувач, вказаний у метаданих образу, якщо не вказано. Також можна встановити в PodSecurityContext. Якщо встановлено як у SecurityContext, так і в PodSecurityContext, значення, вказане в SecurityContext, має пріоритет.

### Alpha рівень {#alpha-level}

- **hostUsers** (boolean)

  Використання простору імен користувачів хоста. Необовʼязково: стандартне значення — true. Якщо встановлено true або не зазначено, Pod буде виконуватися в просторі імен користувачів хоста, корисно, коли Pod потребує функції, доступної лише в просторі імен користувачів хоста, такої як завантаження модуля ядра з CAP_SYS_MODULE. Коли встановлено false, створюється новий простір імен для користувачів для Podʼа. Встановлення значення false корисно для зниження ризику вразливостей виходу з контейнера, дозволяючи користувачам запускати контейнери з правами root без фактичних привілеїв root на хості. Це поле є рівнем alpha і враховується лише серверами, які включають функцію UserNamespacesSupport.

- **resources** (ResourceRequirements)

  Resources - це загальна кількість ресурсів процесора і памʼяті, необхідних для всіх контейнерів у podʼі. Підтримується вказівка запитів і лімітів тільки для імен ресурсів "cpu", "memory" та "hugepages". Вимоги до ресурсів не підтримуються.

  Це поле дозволяє тонко керувати розподілом ресурсів для всього podʼа, дозволяючи розподіляти ресурси між контейнерами в podʼі.

  Це поле є альфа-версією і вимагає увімкнення функціональної можвості PodLevelResources.

  <a name="ResourceRequirements"></a>
  *ResourceRequirements описує вимоги до обчислювальних ресурсів.*

  - **resources.claims** ([]ResourceClaim)

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    Claims перераховує імена ресурсів, визначених у spec.resourceClaims, які використовуються цим контейнером.

    Це залежить від функціональної можливості DynamicResourceAllocation.

    Це поле є незмінним. Його можна встановити лише для контейнерів.

    <a name="ResourceClaim"></a>
    *ResourceClaim посилається на один запис у PodSpec.ResourceClaims.*.

    - **resources.claims.name** (string), обовʼязково

      Name має збігатися з назвою одного запису в pod.spec.resourceClaims Podʼа, в якому використовується це поле. Це робить ресурс доступним всередині контейнера.

    - **resources.claims.request** (string)

      Request - імʼя, вибране для запиту у заявці, на яку зроблено посилання. Якщо порожнє, то буде доступно все з заявки, інакше — лише результат цього запиту.

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits описує максимальну кількість дозволених обчислювальних ресурсів. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests описує мінімальну кількість необхідних обчислювальних ресурсів. Якщо параметр Requests не вказано для контейнера, то стандартно він дорівнює Limits, якщо це явно вказано, інакше — значенню, визначеному реалізацією. Requests не може перевищувати Limits. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

- **resourceClaims** ([]PodResourceClaim)

  *Patch strategy: retainKeys, обʼєднання за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  ResourceClaims визначає, які ResourceClaims повинні бути виділені та зарезервовані перед тим, як Podʼу буде дозволено почати роботу. Ресурси будуть доступні тим контейнерам, які споживають їх за іменем.

  Це стабільне поле, але вимагає увімкнення функціональної можливості DynamicResourceAllocation.

  Це поле є незмінним.

  <a name="PodResourceClaim"></a>
  *`PodResourceClaim` посилається на один конкретний `ResourceClaim`, або безпосередньо, або через вказання `ResourceClaimTemplate`, який потім перетворюється на `ResourceClaim` для podʼа.*

  *Він додає до нього імʼя, яке унікально ідентифікує `ResourceClaim` всередині podʼа. Контейнери, яким потрібен доступ до цього `ResourceClaim`, посилаються на нього за цим імʼям.*

  - **resourceClaims.name** (string), обовʼязкове

    Імʼя унікально ідентифікує цей ресурсний запит всередині Podʼа. Це повинно бути DNS_LABEL.

  - **resourceClaims.resourceClaimName** (string)

    ResourceClaimName — це імʼя обʼєкта ResourceClaim у тому ж просторі імен, що і цей Pod.

    Має бути задано точно одне з ResourceClaimName та ResourceClaimTemplateName.

  - **resourceClaims.resourceClaimTemplateName** (string)

    ResourceClaimTemplateName — це імʼя обʼєкта ResourceClaimTemplate у тому ж просторі імен, що і цей Pod.

    Шаблон буде використаний для створення нового ResourceClaim, який буде привʼязаний до цього Podʼа. Коли цей Pod буде видалений, ResourceClaim також буде видалений. Імʼя Podʼа та імʼя ресурсу разом з згенерованим компонентом будуть використані для формування унікального імені для ResourceClaim, яке буде записано в pod.status.resourceClaimStatuses.

    Це поле є незмінним, і після створення ResourceClaim панель управління не вноситиме жодних змін до відповідного ResourceClaim.

    Має бути встановлено точно одне з полів `ResourceClaimName` або `ResourceClaimTemplateName`.

- **schedulingGates** ([]PodSchedulingGate)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  SchedulingGates — це непрозорий список значень, які, якщо вказані, блокуватимуть планування Podʼа. Якщо schedulingGates не порожні, Pod залишатиметься в стані SchedulingGated, і планувальник не намагатиметься його розмістити.

  SchedulingGates можна встановити лише під час створення Podʼа і видаляти лише згодом.

  <a name="PodSchedulingGate"></a>
  *PodSchedulingGate повʼязаний з Podʼом для захисту його планування.*

  - **schedulingGates.name** (string), обовʼязкове

    Імʼя шлюзу планування. Кожен шлюз планування повинен мати унікальне поле name.

### Застаріле {#deprecated}

- **serviceAccount** (string)

  DeprecatedServiceAccount — це застарілий псевдонім для ServiceAccountName. Застаріле: використовуйте serviceAccountName замість цього.

## Контейнер {#Container}

Один контейнер застосунка, який ви хочете запустити в Podʼі.

---

- **name** (string), обовʼязково

  Імʼя контейнера вказується як DNS_LABEL. Кожен контейнер в Podʼі повинен мати унікальне імʼя (DNS_LABEL). Не може бути оновлено.

### Образ {#image}

- **image** (string)

  Назва образу контейнера. Докладніше: [https://kubernetes.io/docs/concepts/containers/images](/docs/concepts/containers/images). Це поле є необовʼязковим для того, щоб дозволити більш високому рівню управління конфігурацією використовувати стандартний образ або перевизначити образ контейнера в контролері навантаження, такому як Deployments та StatefulSets.

- **imagePullPolicy** (string)

  Політика отримання образу. Одне з значень: Always, Never, IfNotPresent. Стандартно — Always, якщо вказано теґ `:latest`, або IfNotPresent у іншому випадку. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/containers/images#updating-images](/docs/concepts/containers/images#updating-images)

  Можливі значення переліку (enum):
  - `"Always"` вказує, що kubelet завжди намагається отримати останній образ. Контейнер зазнає невдачі, якщо отримання не вдається.
  - `"IfNotPresent"` вказує, що kubelet отримує образ, якщо він не присутній на диску. Контейнер зазнає невдачі, якщо образ не присутній, і отримання не вдається.
  - `"Never"` вказує, що kubelet ніколи не отримує образ, а лише використовує локальний образ. Контейнер зазнає невдачі, якщо образ не присутній.

### Точка входу {#entrypoint}

- **command** ([]string)

  *Atomic: буде замінено під час злиття*

  Масив точок входу. Виконується безпосередньо, не у середовищі оболонки. Якщо не надано, буде використано ENTRYPOINT образу контейнера. Змінні $(VAR_NAME) розширюються за допомогою середовища контейнера. Якщо змінну не вдасться розгорнути, посилання у вхідному рядку залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): наприклад, "$$(VAR_NAME)" виведе літеральний рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгортатися, незалежно від того, чи існує змінна, чи ні. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell](/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell)

- **args** ([]string)

  *Atomic: буде замінено під час злиття*

  Аргументи точки входу. Якщо не надано, буде використано CMD образу контейнера. Змінні $(VAR_NAME) розширюються за допомогою середовища контейнера. Якщо змінну не вдасться розгорнути, посилання у вхідному рядку залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): наприклад, "$$(VAR_NAME)" виведе літеральний рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгортатися, незалежно від того, чи існує змінна, чи ні. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell](/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell)

- **workingDir** (string)

  Робоча тека контейнера. Якщо не вказано, буде використано стандартне значення контейнера, яке може бути налаштоване в образі контейнера. Не може бути оновлено.

### Порти {#ports}

- **ports** ([]ContainerPort)

  *Patch strategy: обʼєднання за ключем `containerPort`*

  *Map: унікальні значення за ключами `containerPort, protocol` будуть збережені під час обʼєднання*

  Список портів, які потрібно відкрити з контейнера. Не вказання порту тут НЕ ЗАПОБІГАЄ його відкриттю. Будь-який порт, який прослуховує стандартну адресу "0.0.0.0" всередині контейнера, буде доступний з мережі. Зміна цього масиву за допомогою стратегічного патча злиття може пошкодити дані. Для отримання додаткової інформації дивіться https://github.com/kubernetes/kubernetes/issues/108255. Не може бути оновлено.

  <a name="ContainerPort"></a>
  *ContainerPort представляє мережевий порт в одному контейнері.*

  - **ports.containerPort** (int32), обовʼязково

    Номер порту для відкриття на IP-адресі контейнера. Це повинен бути дійсний номер порту, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    IP-адреса хоста, що звʼязується з зовнішнім портом.

  - **ports.hostPort** (int32)

    Номер порту для відкриття на хості. Якщо вказано, це повинен бути дійсний номер порту, 0 \< x \< 65536. Якщо вказано HostNetwork, це значення повинно збігатися з ContainerPort. Більшість контейнерів цього не потребують.

  - **ports.name** (string)

    Якщо вказано, це повинен бути IANA_SVC_NAME і єдиним в межах Podʼа. Кожен іменований порт в Podʼі повинен мати унікальне імʼя. Назва порту, на яку можна посилатися з Service.

  - **ports.protocol** (string)

    Протокол для порту. Повинен бути UDP, TCP або SCTP. Стандартне значення — "TCP".

    Можливі значення переліку (enum):
    - `"SCTP"` протокол SCTP.
    - `"TCP"` протокол TCP.
    - `"UDP"` протокол UDP.

### Змінні середовища {#environment-variables}

- **env** ([]EnvVar)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  Список змінних середовища для встановлення в контейнері. Не може бути оновлено.

  <a name="EnvVar"></a>
  *EnvVar представляє змінну середовища, присутню в контейнері.*

  - **env.name** (string), обовʼязково

    Назва змінної середовища. Може складатися з будь-яких друкованих символів ASCII, крім '='.

  - **env.value** (string)

    Змінні посилання $(VAR_NAME) розгортаються за допомогою попередньо визначених змінних середовища в контейнері та будь-яких змінних середовища Service. Якщо змінну не вдається розʼязати, посилання відносно введеного рядка буде незмінним. Подвійний $$ зменшується до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" буде створювати літеральний рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгорнуті, незалежно від того, чи існує змінна, чи ні. Стандартне значення — "".

  - **env.valueFrom** (EnvVarSource)

    Джерело значення змінної середовища. Не може бути використано, якщо значення не є пустим.

    <a name="EnvVarSource"></a>
    *EnvVarSource представляє джерело значення EnvVar.*

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Вибирає ключ з ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Вибирає ключ з ConfigMap.*

      - **env.valueFrom.configMapKeyRef.key** (string), обовʼязково

        Ключ для вибору.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Назва обʼєкта на який посилаються. Це поле фактично є обовʼязковим, але через забезпечення зворотної сумісності допускається залишати його порожнім. Екземпляри цього типу з порожнім значенням, ймовірно, є неправильними. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Вказує, чи має бути визначений ConfigMap або його ключ

    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Вибирає поле Podʼа: підтримує `metadata.name`, `metadata.namespace`, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, `spec.nodeName`, `spec.serviceAccountName`, `status.hostIP`, `status.podIP`, `status.podIPs`.

    - **env.valueFrom.fileKeyRef** (FileKeySelector)

      FileKeyRef вибирає ключ файлу env. Потрібно, щоб була увімкнена функціональна можливість EnvFiles.

      <a name="FileKeySelector"></a>
      *FileKeySelector вибирає ключ файлу env.*

      - **env.valueFrom.fileKeyRef.key** (string), обовʼязково

        Ключ у файлі env. Недійсний ключ завадить запуску пода. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих символів ASCII, крім '='. На етапі Alpha функції EnvFiles розмір ключа обмежений 128 символами.

      - **env.valueFrom.fileKeyRef.path** (string), обовʼязково

        Шлях у томі, з якого слід вибрати файл. Повинен бути відносним і не може містити шлях '..' або починатися з '..'.

      - **env.valueFrom.fileKeyRef.volumeName** (string), обовʼязково

        Імʼя монтування тому, що містить файл env.

      - **env.valueFrom.fileKeyRef.optional** (boolean)

        Вказує, чи потрібно визначати файл або його ключ. Якщо файл або ключ не існує, змінна середовища не публікується. Якщо для параметра optional встановлено значення true, а вказаний ключ не існує, змінна середовища не буде встановлена в контейнерах Podʼа.

        Якщо для параметра optional встановлено значення false, а вказаний ключ не існує, під час створення Podʼа буде повідомлено помилку.

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Вибирає ресурс контейнера: наразі підтримуються лише обмеження і запити ресурсів (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory та requests.ephemeral-storage).

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Вибирає ключ Secretʼа в просторі імен Podʼа

      <a name="SecretKeySelector"></a>
      *SecretKeySelector вибирає ключ Secretʼа.*

      - **env.valueFrom.secretKeyRef.key** (string), обовʼязково

        Ключ Secretʼа для вибору. Повинен бути дійсним ключем Secretʼа.

      - **env.valueFrom.secretKeyRef.name** (string)

        Назва посилання. Це поле фактично є обовʼязковим, але через забезпечення зворотної сумісності допускається залишати його порожнім. Екземпляри цього типу з порожнім значенням, ймовірно, є неправильними. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Зазначає, чи має бути визначений Secret або його ключ

- **envFrom** ([]EnvFromSource)

  *Atomic: буде замінено під час злиття*

  Список джерел для заповнення змінних середовища в контейнері. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих символів ASCII, крім '='. Усі хибні ключі будуть повідомлені як подія при запуску контейнера. Коли ключ існує в декількох джерелах, значення, що асоціюється з останнім джерелом, буде мати пріоритет. Значення, визначене за допомогою Env з дубльованим ключем, буде мати пріоритет. Не може бути оновлено.

  <a name="EnvFromSource"></a>
  *EnvFromSource представляє джерело набору ConfigMaps або Secrets*

  - **envFrom.configMapRef** (ConfigMapEnvSource)

    ConfigMap для вибору з

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource вибирає ConfigMap для заповнення змінними середовища.*

    *Зміст поля Data цільового ConfigMap буде представлено в парах ключ-значення як змінні середовища.*

    - **envFrom.configMapRef.name** (string)

      Назва посилання. Це поле фактично є обовʼязковим, але через забезпечення зворотної сумісності допускається залишати його порожнім. Екземпляри цього типу з порожнім значенням, ймовірно, є неправильними/ Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

    - **envFrom.configMapRef.optional** (boolean)

      Вказує, чи має бути визначений ConfigMap

  - **envFrom.prefix** (string)

    Необовʼязковий текст для вставлення перед кожною змінною. Може складатися з будь-яких друкованих символів ASCII, крім '='.

  - **envFrom.secretRef** (SecretEnvSource)

    Secret для вибору з

    <a name="SecretEnvSource"></a>
    *SecretEnvSource вибирає Secret для заповнення змінними середовища.*

    *Зміст поля Data цільового Secret буде представлено в парах ключ-значення як змінні середовища.*

    - **envFrom.secretRef.name** (string)

      Назва посилання. Це поле фактично є обовʼязковим, але через забезпечення зворотної сумісності допускається залишати його порожнім. Екземпляри цього типу з порожнім значенням, ймовірно, є неправильними. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

    - **envFrom.secretRef.optional** (boolean)

      Вказує, чи має бути визначений Secret

### Томи {#volumes-1}

- **volumeMounts** ([]VolumeMount)

  *Patch strategy: обʼєднання за ключем `mountPath`*

  *Map: унікальні значення за ключем mountPath будуть збережені під час обʼєднання*

  Томи, які будуть змонтовані в файлову систему контейнера. Не може бути оновлено.

  <a name="VolumeMount"></a>
  *VolumeMount описує монтування Тому всередині контейнера.*

  - **volumeMounts.mountPath** (string), обовʼязково

    Шлях всередині контейнера, за яким повинен бути змонтований том. Не повинен містити ':'.

  - **volumeMounts.name** (string), обовʼязково

    Повинно відповідати імені Тому.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation визначає, як монтування розповсюджуються від хоста до контейнера і навпаки. Коли не встановлено, використовується MountPropagationNone. Це поле є бета-версією в 1.10. Коли `RecursiveReadOnly` встановлено в `IfPossible` або `Enabled`, `MountPropagation` повинен бути `None` або не вказаним (стандартно `None`).

    Можливі значення переліку (enum):
    - `"Bidirectional"` означає, що том у контейнері отримає нові монтування від хоста або інших контейнерів, а його власні монтування будуть поширені з контейнера на хост або інші контейнери. Зверніть увагу, що цей режим рекурсивно застосовується до всіх монтувань у томі («rshared» у термінології Linux).
    - `"HostToContainer"` означає, що том у контейнері отримає нові монтування від хоста або інших контейнерів, але файлові системи, змонтовані всередині контейнера, не будуть поширені на хост або інші контейнери. Зверніть увагу, що цей режим рекурсивно застосовується до всіх монтувань у томі («rslave» у термінології Linux).
    - `"None"` означає, що том у контейнері не отримає нові монтування від хоста або інших контейнерів, а файлові системи, змонтовані всередині контейнера, не будуть поширені на хост або інші контейнери. Зверніть увагу, що цей режим відповідає «private» в термінології Linux.

  - **volumeMounts.readOnly** (boolean)

    Змонтований як тільки для читання, якщо true, для читання/запису в іншому випадку (false або не вказано). Стандартне значення — false.

  - **volumeMounts.recursiveReadOnly** (string)

    `RecursiveReadOnly` вказує, чи слід обробляти монтування тільки для читання рекурсивно.

    Якщо `ReadOnly` встановлено в `false`, це поле не має значення і не має бути вказаним.

    Якщо `ReadOnly` дорівнює `true`, і це поле встановлено в `Disabled`, монтування не стає рекурсивним тільки для читання. Якщо це поле встановлено в `IfPossible`, монтування стає рекурсивним тільки для читання, якщо це підтримується середовищем виконання контейнерів. Якщо це поле встановлено в `Enabled`, монтування стає рекурсивним тільки для читання, якщо це підтримується середовищем виконання контейнерів; в іншому випадку, pod не буде запущено і буде згенеровано помилку, щоб вказати причину.

    Якщо це поле встановлено в `IfPossible` або `Enabled`, `MountPropagation` має бути встановлено в `None` (або бути не вказаним, що стандартно дорівнює `None`).

    Якщо це поле не вказано, воно вважається еквівалентом `Disabled`.

  - **volumeMounts.subPath** (string)

    Шлях всередині тому, з якого має бути змонтований том контейнера. Стандартне значення — "" (корінь тому).

  - **volumeMounts.subPathExpr** (string)

    Розгорнутий шлях всередині тому, з якого має бути змонтований том контейнера. Поводиться схоже до SubPath, але посилання на змінні середовища $(VAR_NAME) розгортаються за допомогою середовища контейнера. Стандартне значення — "" (корінь тому). SubPathExpr і SubPath є взаємовиключними.

- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: обʼєднання за ключем `devicePath`*

  *Map: унікальні значення за ключем devicePath будуть збережені під час обʼєднання*

  volumeDevices — це список блочних пристроїв, які будуть використані контейнером.

  <a name="VolumeDevice"></a>
  *volumeDevice описує зіставлення необробленого блочного пристрою всередині контейнера.*

  - **volumeDevices.devicePath** (string), обовʼязково

    devicePath — це шлях всередині контейнера, на який буде зіставлено пристрій.

  - **volumeDevices.name** (string), обовʼязково

    name повинно відповідати імені persistentVolumeClaim в Podʼі.

### Ресурси {#resources}

- **resources** (ResourceRequirements)

  Обчислювальні ресурси, необхідні для цього контейнера. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  <a name="ResourceRequirements"></a>
  *ResourceRequirements описує вимоги до обчислювальних ресурсів.*

  - **resources.claims** ([]ResourceClaim)

    *Map: унікальні значення за ключем будуть збережені під час обʼєднання*

    Claims містить назви ресурсів, визначених в spec.resourceClaims, які використовуються цим контейнером.

    Це поле залежить від функціональнох можливості DynamicResourceAllocation.

    Це поле є незмінним. Його можна встановити тільки для контейнерів.

    <a name="ResourceClaim"></a>
    *ResourceClaim посилається на один запис в PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), обовʼязково

      Імʼя повинно відповідати імені одного запису в pod.spec.resourceClaims Podʼа, де використовується це поле. Це робить цей ресурс доступним всередині контейнера.

    - **resources.claims.request** (string)

      `Request` — це імʼя, вибране для запиту в зазначеній заявці. Якщо поле порожнє, буде доступно все з заявки; в іншому випадку, доступний буде лише результат цього запиту.

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits визначає максимальну кількість обчислювальних ресурсів, дозволених. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests описує мінімальну кількість обчислювальних ресурсів, що потрібна. Якщо Requests відсутній для контейнера, він стандартно встановлюється в Limits, якщо це явно вказано, інакше — у значення, визначеного реалізацією. Requests не може перевищувати Limits. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: буде замінено під час обʼєднання*

  Політика зміни розміру ресурсів для контейнера. Це поле не можна встановити для тимчасових контейнерів.

  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy представляє політику зміни розміру ресурсів для контейнера.*

  - **resizePolicy.resourceName** (string), обовʼязково

    Назва ресурсу, до якого застосовується ця політика зміни розміру ресурсу. Підтримувані значення: cpu, memory.

  - **resizePolicy.restartPolicy** (string), обовʼязково

    Політика перезапуску, яку застосовувати при зміні розміру вказаного ресурсу. Якщо не вказано, то стандартно встановлюється NotRequired.

### Життєвий цикл {#lifecycle}

- **lifecycle** (Lifecycle)

  Дії, які система управління повинна виконати у відповідь на події життєвого циклу контейнера. Не може бути оновлено.

  <a name="Lifecycle"></a>
  *Lifecycle описує дії, які система управління повинна виконати у відповідь на події життєвого циклу контейнера. Для обробників життєвого циклу PostStart і PreStop управління контейнером блокується, поки дія не буде завершена, якщо процес контейнера виявляється несправним, тоді обробник переривається.*

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart викликається негайно після створення контейнера. Якщо обробник не вдалося виконати, контейнер буде завершено і перезапущено згідно зі своєю політикою перезапуску. Інше управління контейнером блокується, поки хук не завершиться. Докладніше: [https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks)

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop викликається негайно перед тим, як контейнер буде завершено через запит API або подію управління, таку як невдача проби справності/запуску, випередження, скорочення ресурсів тощо. Обробник не викликається, якщо контейнер впаде або закінчить роботу. Період перебігу належного завершення підраховується до виконання хуку PreStop. Незалежно від результату обробника, контейнер в кінцевому підсумку завершиться протягом періоду належного завершення Pod (якщо він не буде затриманий завершенням залишкових операцій). Інше управління контейнером блокується, поки хук не завершиться або досягне періоду належного завершення. Докладніше: [https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks)

  - **lifecycle.stopSignal** (string)

    StopSignal визначає, який сигнал буде надіслано контейнеру під час його зупинки. Якщо його не вказано, стандартне значення визначатиметься використовуваним середовищем виконання контейнера. StopSignal можна встановити лише для Podʼів з непорожнім імʼям .spec.os.name

    Можливі значення переліку (enum):
    - `"SIGABRT"`
    - `"SIGALRM"`
    - `"SIGBUS"`
    - `"SIGCHLD"`
    - `"SIGCLD"`
    - `"SIGCONT"`
    - `"SIGFPE"`
    - `"SIGHUP"`
    - `"SIGILL"`
    - `"SIGINT"`
    - `"SIGIO"`
    - `"SIGIOT"`
    - `"SIGKILL"`
    - `"SIGPIPE"`
    - `"SIGPOLL"`
    - `"SIGPROF"`
    - `"SIGPWR"`
    - `"SIGQUIT"`
    - `"SIGRTMAX"`
    - `"SIGRTMAX-1"`
    - `"SIGRTMAX-10"`
    - `"SIGRTMAX-11"`
    - `"SIGRTMAX-12"`
    - `"SIGRTMAX-13"`
    - `"SIGRTMAX-14"`
    - `"SIGRTMAX-2"`
    - `"SIGRTMAX-3"`
    - `"SIGRTMAX-4"`
    - `"SIGRTMAX-5"`
    - `"SIGRTMAX-6"`
    - `"SIGRTMAX-7"`
    - `"SIGRTMAX-8"`
    - `"SIGRTMAX-9"`
    - `"SIGRTMIN"`
    - `"SIGRTMIN+1"`
    - `"SIGRTMIN+10"`
    - `"SIGRTMIN+11"`
    - `"SIGRTMIN+12"`
    - `"SIGRTMIN+13"`
    - `"SIGRTMIN+14"`
    - `"SIGRTMIN+15"`
    - `"SIGRTMIN+2"`
    - `"SIGRTMIN+3"`
    - `"SIGRTMIN+4"`
    - `"SIGRTMIN+5"`
    - `"SIGRTMIN+6"`
    - `"SIGRTMIN+7"`
    - `"SIGRTMIN+8"`
    - `"SIGRTMIN+9"`
    - `"SIGSEGV"`
    - `"SIGSTKFLT"`
    - `"SIGSTOP"`
    - `"SIGSYS"`
    - `"SIGTERM"`
    - `"SIGTRAP"`
    - `"SIGTSTP"`
    - `"SIGTTIN"`
    - `"SIGTTOU"`
    - `"SIGURG"`
    - `"SIGUSR1"`
    - `"SIGUSR2"`
    - `"SIGVTALRM"`
    - `"SIGWINCH"`
    - `"SIGXCPU"`
    - `"SIGXFSZ"`

- **terminationMessagePath** (string)

  Необовʼязково: Шлях, за яким файл, до якого буде записано повідомлення про завершення контейнера, буде вмонтовано в файлову систему контейнера. Записане повідомлення, призначено для короткого кінцевого статусу, наприклад, повідомлення про помилку виразу. Якщо воно більше 4096 байт, то вузол скоротить його. Загальна довжина повідомлення по всіх контейнерах буде обмежена 12 кб. Стандартне значення — /dev/termination-log. Не може бути оновлено.

- **terminationMessagePolicy** (string)

  Вказує, як має бути заповнене повідомлення про завершення. File використовуватиме вміст terminationMessagePath для заповнення повідомлення про статус контейнера при успіху і невдачі. FallbackToLogsOnError використовуватиме останній шматок виводу логу контейнера, якщо файл повідомлення про завершення пустий і контейнер завершився з помилкою. Вивід логу обмежено 2048 байтами або 80 рядками, якщо це менше. Стандартне значення — File. Не може бути оновлено.

  Можливі значення переліку (enum):
  - `"FallbackToLogsOnError"` прочитає найновіший вміст журналів контейнера для повідомлення про стан контейнера, коли контейнер завершується з помилкою, а terminationMessagePath не має вмісту.
  - `"File"` є стандартною поведінкою і встановить повідомлення про стан контейнера на вміст terminationMessagePath контейнера, коли контейнер завершується.

- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Періодичне тестування життєздатності контейнера. Контейнер буде перезапущено, якщо тест не вдасться. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Періодична перевірка готовності контейнера до обслуговування. Контейнер буде видалено з точок доступу Service, якщо проба зазнає невдачі. Неможливо оновити. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe вказує, що Pod успішно ініціалізовано. Якщо вказано, інші проби не виконуються, поки ця не закінчиться успіхом. Якщо цей тест не вдасться, Pod буде перезапущено, так само, як і в разі невдачі livenessProbe. Це може бути використано для надання різних параметрів проби на початку життєвого циклу Podʼа, коли завантаження даних або оновлення кешу може займати довгий час, ніж під час регулярної роботи. Це не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **restartPolicy** (string)

  RestartPolicy визначає поведінку перезапуску окремих контейнерів у Podʼі. Це поле перевизначає политику перезапуску на рівні подів. Коли це поле не вказано, поведінка перезапуску визначається політикою перезапуску Podʼа і типом контейнера. Додатково, встановлення RestartPolicy як "Always" для контейнера ініціалізації матиме наступний ефект: цей контейнер ініціалізації буде постійно перезапускатися при виході, поки всі звичайні контейнери не завершаться. Як тільки всі звичайні контейнери завершаться, всі контейнери ініціалізації з RestartPolicy "Always" будуть вимкнені. Цей життєвий цикл відрізняється від звичайних контейнерів ініціалізації і часто називається "sidecar" контейнер. Хоча цей контейнер ініціалізації все ще запускається у послідовності контейнерів ініціалізації, він не чекає на завершення роботи контейнера, перш ніж переходити до наступного контейнера ініціалізації . Натомість, наступний контейнер ініціалізації запускається одразу після запуску цього контейнера ініціалізації або після успішного завершення будь-якого startupProbe.

- **restartPolicyRules** ([]ContainerRestartRule)

  *Atomic: буде замінено під час злиття*

  Представляє список правил, які необхідно перевірити, щоб визначити, чи слід перезапустити контейнер при виході. Правила оцінюються по порядку. Як тільки правило відповідає стану виходу контейнера, решта правил ігноруються. Якщо жодне правило не відповідає стану виходу контейнера, політика перезапуску на рівні контейнера визначає, чи буде контейнер перезапущений чи ні. Обмеження щодо правил:
  - Допускається не більше 20 правил.
  - Правила можуть мати однакову дію.
  - Ідентичні правила не заборонені у перевірках. Коли правила вказані, контейнер ПОВИНЕН явно встановити RestartPolicy, навіть якщо він відповідає RestartPolicy Pod.

  <a name="ContainerRestartRule"></a>
  *ContainerRestartRule описує, як обробляється вихід контейнера.*

  - **restartPolicyRules.action** (string), обовʼязково

    Вказує дію, що виконується при виході контейнера, якщо вимоги виконані. Єдиним можливим значенням є "Restart" (Перезапустити) для перезапуску контейнера.

  - **restartPolicyRules.exitCodes** (ContainerRestartRuleOnExitCodes)

    Представляє коди виходу для перевірки виходів контейнера.

    <a name="ContainerRestartRuleOnExitCodes"></a>
    *ContainerRestartRuleOnExitCodes описує умови обробки виведеного контейнера на основі його кодів виходу.*

    - **restartPolicyRules.exitCodes.operator** (string), обовʼязково

      Представляє взаємозвʼязок між кодом (кодами) виходу контейнера та вказаними значеннями. Можливі значення:
      - In: вимога виконується, якщо код виходу контейнера знаходиться в наборі вказаних значень.
      - NotIn: вимога виконується, якщо код виходу контейнера не знаходиться в наборі вказаних значень.

    - **restartPolicyRules.exitCodes.values** ([]int32)

      *Set: унікальні значення будуть збережені під час злиття*

      Вказує набір значень, які слід перевіряти для кодів виходу контейнера. Допускається не більше 255 елементів.

### Контекст безпеки {#security-context-1}

- **securityContext** (SecurityContext)

  SecurityContext визначає параметри безпеки, з якими має працювати контейнер. Якщо встановлено, поля SecurityContext замінять відповідні поля PodSecurityContext. Докладніше: [https://kubernetes.io/docs/tasks/configure-pod-container/security-context/](/docs/tasks/configure-pod-container/security-context/)

  <a name="SecurityContext"></a>
  *SecurityContext містить конфігурацію безпеки, яка буде застосована до контейнера. Деякі поля присутні як у SecurityContext, так і в PodSecurityContext. Якщо обидва встановлені, значення в SecurityContext мають пріоритет.*

  - **securityContext.allowPrivilegeEscalation** (boolean)

    `AllowPrivilegeEscalation` контролює, чи може процес отримати більше привілеїв, ніж його батьківський процес. Цей булевий параметр безпосередньо контролює, чи буде встановлено прапоркць `no_new_privs` для процесу контейнера. `AllowPrivilegeEscalation` завжди має значення `true`, коли контейнер:
      1. Запускається з привілеями (`Privileged`)
      2. Має `CAP_SYS_ADMIN`

      Зверніть увагу, що це поле не може бути встановлене, коли `spec.os.name` дорівнює `windows`.

  - **securityContext.appArmorProfile** (AppArmorProfile)

    `appArmorProfile` — це параметри AppArmor, які використовуються цим контейнером. Якщо встановлено, цей профіль переважає профіль AppArmor podʼа. Зверніть увагу, що це поле не може бути встановлене, коли `spec.os.name` дорівнює `windows`.

    <a name="AppArmorProfile"></a>
    *AppArmorProfile визначає налаштування AppArmor для podʼа або контейнера.*

    - **securityContext.appArmorProfile.type** (string), обовʼязково

      Поле `type` вказує, який тип профілю AppArmor буде застосовано. Дійсні варіанти:
      - `Localhost` — профіль, попередньо завантажений на вузлі.
      - `RuntimeDefault` — стандартний профіль середовища виконання контейнерів.
      - `Unconfined` — без примусового виконання правил AppArmor.

      Можливі значення переліку (enum):
      - `"Localhost"` вказує, що слід використовувати профіль, попередньо завантажений на вузлі.
      - `"RuntimeDefault"` вказує, що слід використовувати стандартний профіль середовища виконання контейнерів.
      - `"Unconfined"` вказує, що не слід примушувати жоден профіль AppArmor.

    - **securityContext.appArmorProfile.localhostProfile** (string)

      `localhostProfile` вказує профіль, завантажений на вузлі, який слід використовувати. Профіль має бути попередньо налаштований на вузлі для коректної роботи. Назва профілю повинна відповідати завантаженій назві. Це поле повинно бути встановлене, якщо і тільки якщо тип дорівнює "Localhost".

  - **securityContext.capabilities** (Capabilities)

    Можливості для додавання/видалення під час запуску контейнерів. Стандарто використовується набір можливостей, наданих середовищем виконання контейнера. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    <a name="Capabilities"></a>
    *Додає та видаляє можливості POSIX з працюючих контейнерів.*

    - **securityContext.capabilities.add** ([]string)

      *Atomic: буде замінено під час обʼєднання*

      Додані можливості.

    - **securityContext.capabilities.drop** ([]string)

      *Atomic: буде замінено під час обʼєднання*

      Видалені можливості.

  - **securityContext.procMount** (string)

    `procMount` вказує тип монтування файлової системи `/proc`, який слід використовувати для контейнерів. Стандартне значення — `Default`, що використовує стандартні налаштування середовища виконання контейнерів для шляхів тільки для читання та замаскованих шляхів. Це вимагає ввімкнення функціональної можливості `ProcMountType`. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    Можливі значення переліку (enum):
    - `"Default"` використовує стандартні налаштування середовища виконання контейнерів для шляхів тільки для читання та замаскованих шляхів для /proc. Більшість середовищ виконання контейнерів маскують певні шляхи в /proc, щоб уникнути випадкового витоку безпеки спеціальних пристроїв або інформації.
    - `"Unmasked"` обминає стандартну поведінку маскування середовища виконання контейнерів і забезпечує, щоб новостворений /proc контейнера залишався незмінним без модифікацій.

  - **securityContext.privileged** (boolean)

    Запуск контейнера у привілейованому режимі. Процеси у привілейованих контейнерах по суті еквівалентні root на хості. Стандартно дорівнює false. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.readOnlyRootFilesystem** (boolean)

    Чи має цей контейнер кореневу файлову систему тільки для читання. Стандартно дорівнює false. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.runAsUser** (int64)

    UID, з яким запускається початковий процес контейнера. Стандартно використовується користувач, вказаний у метаданих образу, якщо не вказано інше. Також може бути встановлено в `PodSecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, зазначене в `SecurityContext`. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.runAsNonRoot** (boolean)

    Вказує, що контейнер повинен запускатися як користувач, який не є root. Якщо значення `true`, Kubelet перевірить образ під час виконання, щоб гарантувати, що він не запускається з UID 0 (root), і не запустить контейнер, якщо це не так. Якщо поле не встановлено або має значення `false`, така перевірка не виконується. Також може бути налаштовано в `SecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, вказане в `SecurityContext`.

  - **securityContext.runAsGroup** (int64)

    GID, під яким запускається початковий процес контейнера. Якщо не встановлено, використовується стандартне значення для середовища виконання. Також може бути вказано в `SecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, зазначене в `SecurityContext` для цього контейнера. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    Контекст SELinux, який буде застосований до контейнера. Якщо не вказано, середовище виконання контейнера призначить випадковий контекст SELinux для кожного контейнера. Може також бути встановлено в PodSecurityContext. Якщо встановлено в обох SecurityContext і PodSecurityContext, пріоритет має значення, вказане в SecurityContext. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions — це мітки, що застосовуються до контейнера*

    - **securityContext.seLinuxOptions.level** (string)

      Level є міткою рівня SELinux, що застосовується до контейнера.

    - **securityContext.seLinuxOptions.role** (string)

      Role є міткою ролі SELinux, що застосовується до контейнера.

    - **securityContext.seLinuxOptions.type** (string)

      Type є міткою типу SELinux, що застосовується до контейнера.

    - **securityContext.seLinuxOptions.user** (string)

      User є міткою користувача SELinux, що застосовується до контейнера.

  - **securityContext.seccompProfile** (SeccompProfile)

    Параметри seccomp для використання контейнерами в цьому Podʼі. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile визначає налаштування профілю seccomp для Podʼа/контейнера. Може бути встановлено лише одне джерело профілю.*

    - **securityContext.seccompProfile.type** (string), обовʼязкове

      type вказує, який тип профілю seccomp буде застосовано. Допустимі варіанти:

      - Localhost — має бути використаний профіль, визначений у файлі на вузлі.
      - RuntimeDefault — має бути використаний стандартний профіль для середовища виконання контейнерів.
      - Unconfined — не застосовується жоден профіль.

      Можливі значення переліку (enum):
      - `"Localhost"` вказує, що слід використовувати профіль, визначений у файлі на вузлі. Шлях до файлу відносно \<kubelet-root-dir>/seccomp.
      - `"RuntimeDefault"` представляє стандартний профіль seccomp для середовища виконання контейнерів.
      - `"Unconfined"` вказує, що не застосовується жоден профіль seccomp (також відомий як unconfined).

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile вказує, що має бути використаний профіль, визначений у файлі на вузлі. Профіль має бути попередньо налаштований на вузлі, щоб працювати. Має бути низхідний шлях, відносно до налаштованого розташування профілю seccomp kubelet. Має бути встановлено, якщо тип "Localhost". НЕ має бути встановлено для будь-якого іншого типу.

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    Специфічні налаштування для Windows, які застосовуються до всіх контейнерів. Якщо не вказано, використовуються опції з PodSecurityContext. Якщо встановлено в обох SecurityContext і PodSecurityContext, пріоритет має значення, вказане в SecurityContext. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions містять специфічні для Windows параметри та облікові дані.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec — це місце, де вебхук GMSA (https://github.com/kubernetes-sigs/windows-gmsa) вставляє вміст специфікації облікових даних GMSA, названої полем GMSACredentialSpecName.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName — це назва специфікації облікових даних GMSA, яка буде використана.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess визначає, чи слід запускати контейнер як контейнер ʼHost Processʼ. Усі контейнери Pod повинні мати однакове значення HostProcess (не дозволено мати суміш контейнерів HostProcess та не-HostProcess). Крім того, якщо HostProcess є true, то HostNetwork також повинен бути встановлений у true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      Імʼя користувача в Windows для запуску точки входу процесу контейнера. Стандартно використовується користувач, вказаний у метаданих образу, якщо не вказано. Може також бути встановлено в PodSecurityContext. Якщо встановлено в обох SecurityContext і PodSecurityContext, пріоритет має значення, вказане в SecurityContext.

### Налагодження {#debugging}

- **stdin** (boolean)

  Чи повинен цей контейнер виділяти буфер для stdin у середовищі виконання контейнера. Якщо це не встановлено, читання з stdin у контейнері завжди буде призводити до EOF. Стандартно — false.

- **stdinOnce** (boolean)

  Чи повинне середовище виконання контейнера закрити канал stdin після того, як він був відкритий одним підключенням. Коли stdin дорівнює true, потік stdin залишатиметься відкритим протягом декількох сеансів підключення. Якщо stdinOnce встановлено у true, stdin відкривається під час запуску контейнера, залишається порожнім до першого підключення клієнта до stdin, а потім залишається відкритим і приймає дані до відключення клієнта, після чого stdin закривається і залишається закритим до перезапуску контейнера. Якщо цей прапорець встановлено у false, процеси контейнера, що читають з stdin, ніколи не отримають EOF. Стандартно — false.

- **tty** (boolean)

  Чи повинен цей контейнер виділяти для себе TTY, також вимагає, щоб 'stdin' був true. Стандартно — false.

## Ефемерний контейнер {#EphemeralContainer}

Ефемерний контейнер — це тимчасовий контейнер, який ви можете додати до існуючого Pod для ініційованих користувачем дій, таких як налагодження. Ефемерні контейнери не мають гарантій щодо ресурсів або планування, і вони не будуть перезапускатися після завершення роботи або при видаленні чи перезапуску Pod. Kubelet може виселити Pod, якщо ефемерний контейнер спричинить перевищення виділених ресурсів для Pod.

Щоб додати ефемерний контейнер, використовуйте субресурс ephemeralcontainers поточного Pod. Ефемерні контейнери не можуть бути видалені або перезапущені.

---

- **name** (string), обовʼязкове

  Імʼя ефемерного контейнера, вказане як DNS_LABEL. Це імʼя повинно бути унікальним серед усіх контейнерів, контейнерів ініціалізації та ефемерних контейнерів.

- **targetContainerName** (string)

  Якщо встановлено, імʼя контейнера з PodSpec, на який націлюється цей ефемерний контейнер. Ефемерний контейнер буде працювати в тих самих просторах імен (IPC, PID тощо), що і цей контейнер. Якщо не встановлено, то ефемерний контейнер використовує простори імен, налаштовані в специфікації Pod.

  Середовище виконання контейнера повинно підтримувати цю функцію. Якщо середовище виконання не підтримує націлювання простору імен, то результат налаштування цього поля є невизначеним.

### Образ {#image-1}

- **image** (string)

  Імʼя образу контейнера. Докладніше: [https://kubernetes.io/docs/concepts/containers/images](/docs/concepts/containers/images)

- **imagePullPolicy** (string)

  Політика завантаження образу. Одне з значень: Always, Never, IfNotPresent. Стандартне значення — Always, якщо вказано теґ `:latest`, або IfNotPresent в іншому випадку. Не можна оновити. Докладніше: [https://kubernetes.io/docs/concepts/containers/images#updating-images](/docs/concepts/containers/images#updating-images)

  Можливі значення переліку (enum):
  - `"Always"` означає, що kubelet завжди намагається завантажити останній образ. Контейнер зазнає невдачі, якщо завантаження не вдається.
  - `"IfNotPresent"` означає, що kubelet завантажує, якщо образ не присутній на диску. Контейнер зазнає невдачі, якщо образ не присутній, а завантаження не вдається.
  - `"Never"` означає, що kubelet ніколи не завантажує образ, а лише використовує локальний образ. Контейнер зазнає невдачі, якщо образ не присутній.

### Точка входу {#entrypoint-1}

- **command** ([]string)

  *Atomic: буде замінено під час злиття*

  Масив команд для точки входу. Не виконується в оболонці. Використовується ENTRYPOINT образу, якщо це не задано. Змінні $(VAR_NAME) розширюються за допомогою середовища контейнера. Якщо змінну не вдасться розгорнути, посилання у вхідному рядку залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): наприклад, "$$(VAR_NAME)" виведе літеральний рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгортатися, незалежно від того, чи існує змінна, чи ні. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell](/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell)

- **args** ([]string)

  *Atomic: буде замінено під час злиття*

  Аргументи для точки входу.  Якщо не надано, буде використано CMD образу контейнера. Змінні $(VAR_NAME) розширюються за допомогою середовища контейнера. Якщо змінну не вдасться розгорнути, посилання у вхідному рядку залишиться без змін. Подвійні $$ зменшуються до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): наприклад, "$$(VAR_NAME)" виведе літеральний рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгортатися, незалежно від того, чи існує змінна, чи ні. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell](/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell)

- **workingDir** (string)

  Робоча тека контейнера. Якщо не вказано, буде використано стандартне значення контейнера, яке може бути налаштоване в образі контейнера. Не може бути оновлено.

### Змінні середовища {#environment-variables-1}

- **env** ([]EnvVar)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список змінних середовища для передачі в контейнер. Не може бути оновлено.

  <a name="EnvVar"></a>
  *EnvVar представляє змінну середовища, присутню в контейнері.*

  - **env.name** (string), обовʼязково

    Назва змінної середовища. Може складатися з будь-яких друкованих символів ASCII, крім '='.

  - **env.value** (string)

    Змінні посилання $(VAR_NAME) розгортаються за допомогою попередньо визначених змінних середовища в контейнері та будь-яких змінних середовища Service. Якщо змінну не вдається розʼязати, посилання відносно введеного рядка буде незмінним. Подвійний $$ зменшується до одного $, що дозволяє екранувати синтаксис $(VAR_NAME): тобто "$$(VAR_NAME)" буде створювати літеральний рядок "$(VAR_NAME)". Екрановані посилання ніколи не будуть розгорнуті, незалежно від того, чи існує змінна, чи ні. Стандартне значення — "".

  - **env.valueFrom** (EnvVarSource)

    Джерело значення змінної середовища. Не може бути використано, якщо значення не є пустим.

    <a name="EnvVarSource"></a>
    *EnvVarSource представляє джерело значення EnvVar.*

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Вибирає ключ з ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Вибирає ключ з ConfigMap.*

      - **env.valueFrom.configMapKeyRef.key** (string), обовʼязково

        Ключ для вибору.

      - **env.valueFrom.configMapKeyRef.name** (string), обовʼязково

        Назва обʼєкта на який посилаються. Це поле фактично є обов'язковим, але через зворотну сумісність допускається бути порожнім. Випадки цього типу з порожнім значенням тут майже напевно є помилковими. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Вказує, чи має бути визначений ConfigMap або його ключ

    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Вибирає поле Podʼа: підтримує `metadata.name`, `metadata.namespace`, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, `spec.nodeName`, `spec.serviceAccountName`, `status.hostIP`, `status.podIP`, `status.podIPs`.

    - **env.valueFrom.fileKeyRef** (FileKeySelector)

      FileKeyRef вибирає ключ файлу env. Потрібно, щоб була увімкнена функціональна можливість EnvFiles.

      <a name="FileKeySelector"></a>
      *FileKeySelector вибирає ключ файлу env.*

      - **env.valueFrom.fileKeyRef.key** (string), обовʼязково

        Ключ у файлі env. Недійсний ключ завадить запуску пода. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих символів ASCII, крім '='. На етапі Alpha функції EnvFiles розмір ключа обмежений 128 символами.

      - **env.valueFrom.fileKeyRef.path** (string), обовʼязково

        Шлях у томі, з якого слід вибрати файл. Повинен бути відносним і не може містити шлях '..' або починатися з '..'.

      - **env.valueFrom.fileKeyRef.volumeName** (string), обовʼязково

        Імʼя монтування тому, що містить файл env.

      - **env.valueFrom.fileKeyRef.optional** (boolean)

        Вказує, чи потрібно визначати файл або його ключ. Якщо файл або ключ не існує, змінна середовища не публікується. Якщо для параметра optional встановлено значення true, а вказаний ключ не існує, змінна середовища не буде встановлена в контейнерах Podʼа.

        Якщо для параметра optional встановлено значення false, а вказаний ключ не існує, під час створення Podʼа буде повідомлено помилку.

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Вибирає ресурс контейнера: наразі підтримуються лише обмеження і запити ресурсів (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory та requests.ephemeral-storage).

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Вибирає ключ Secretʼа в просторі імен Podʼа

      <a name="SecretKeySelector"></a>
      *SecretKeySelector вибирає ключ Secretʼа.*

      - **env.valueFrom.secretKeyRef.key** (string), обовʼязково

        Ключ Secretʼа для вибору. Повинен бути дійсним ключем Secretʼа.

      - **env.valueFrom.secretKeyRef.name** (string)

        Назва посилання. Це поле фактично є обов'язковим, але через зворотну сумісність допускається бути порожнім. Випадки цього типу з порожнім значенням тут майже напевно є помилковими. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Зазначає, чи має бути визначений Secret або його ключ

- **envFrom** ([]EnvFromSource)

  *Atomic: буде замінено під час злиття*

  Список джерел для заповнення змінних середовища в контейнері. Ключі, визначені в джерелі, можуть складатися з будь-яких друкованих символів ASCII, крім '='. Усі хибні ключі будуть повідомлені як подія при запуску контейнера. Коли ключ існує в декількох джерелах, значення, що асоціюється з останнім джерелом, буде мати пріоритет. Значення, визначене за допомогою Env з дубльованим ключем, буде мати пріоритет. Не може бути оновлено.

  <a name="EnvFromSource"></a>
  *EnvFromSource представляє джерело набору ConfigMaps або Secrets*

  - **envFrom.configMapRef** (ConfigMapEnvSource)

    ConfigMap для вибору з

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource вибирає ConfigMap для заповнення змінними середовища.*

    *Зміст поля Data цільового ConfigMap буде представлено в парах ключ-значення як змінні середовища.*

    - **envFrom.configMapRef.name** (string)

      Назва посилання. Це поле фактично є обов'язковим, але через зворотну сумісність допускається бути порожнім. Випадки цього типу з порожнім значенням тут майже напевно є помилковими. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

    - **envFrom.configMapRef.optional** (boolean)

      Вказує, чи має бути визначений ConfigMap

  - **envFrom.prefix** (string)

    Необовʼязковий текст для вставлення перед кожною змінною. Може складатися з будь-яких друкованих символів ASCII, крім '='.

  - **envFrom.secretRef** (SecretEnvSource)

    Secret для вибору

    <a name="SecretEnvSource"></a>
    *SecretEnvSource вибирає Secret для заповнення змінними середовища.*

    *Зміст поля Data цільового Secret буде представлено в парах ключ-значення як змінні середовища.*

    - **envFrom.secretRef.name** (string)

      Назва посилання. Це поле фактично є обов'язковим, але через зворотну сумісність допускається бути порожнім. Випадки цього типу з порожнім значенням тут майже напевно є помилковими. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)

    - **envFrom.secretRef.optional** (boolean)

      Вказує, чи має бути визначений Secret

### Томи {#volumes-2}

- **volumeMounts** ([]VolumeMount)

  *Patch strategy: обʼєднання за ключем `mountPath`*

  *Map: унікальні значення ключа mountPath будуть збережені під час злиття*

  Томи Podʼів для монтування у файлову систему контейнера. Субшляхи монтування в ефемерних контейнерах не дозволяються. Не може бути оновлено.

  <a name="VolumeMount"></a>
  *VolumeMount описує монтування Тому всередині контейнера.*

  - **volumeMounts.mountPath** (string), обовʼязково

    Шлях всередині контейнера, за яким повинен бути змонтований том. Не повинен містити ':'.

  - **volumeMounts.name** (string), обовʼязково

    Повинно відповідати імені Тому.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation визначає, як монтування розповсюджуються від хоста до контейнера і навпаки. Коли не встановлено, використовується MountPropagationNone. Це поле є бета-версією в 1.10. Коли `RecursiveReadOnly` встановлено на `IfPossible` або `Enabled`, `MountPropagation` повинно бути `None` або невказаним (що стандартно дорівнює `None`).

    Possible enum values:
    - `"Bidirectional"` означає, що том у контейнері отримає нові монтування з хоста або інших контейнерів, а його власні монтування будуть розповсюджені з контейнера на хост або інші контейнери. Зверніть увагу, що цей режим рекурсивно застосовується до всіх монтувань у томі ("rshared" у термінології Linux).
    - `"HostToContainer"` означає, що том у контейнері отримає нові монтування з хоста або інших контейнерів, але файлові системи, змонтовані всередині контейнера, не будуть розповсюджені на хост або інші контейнери. Зверніть увагу, що цей режим рекурсивно застосовується до всіх монтувань у томі ("rslave" у термінології Linux).
    - `"None"` означає, що том у контейнері не отримає нові монтування з хоста або інших контейнерів, а файлові системи, змонтовані всередині контейнера, не будуть розповсюджені на хост або інші контейнери. Зверніть увагу, що цей режим відповідає "private" у термінології Linux.

  - **volumeMounts.readOnly** (boolean)

    Змонтований як тільки для читання, якщо true, для читання/запису в іншому випадку (false або не вказано). Стандартне значення — false.

  - **volumeMounts.recursiveReadOnly** (string)

    `RecursiveReadOnly` визначає, чи повинні змонтовані в режимі "тільки для читання" ресурси оброблятися рекурсивно.

    Якщо `ReadOnly` дорівнює `false`, це поле не має значення і не повинно бути вказаним.
    Якщо `ReadOnly` дорівнює `true` і це поле встановлено на `Disabled`, монтування не виконується рекурсивно в режимі "тільки для читання". Якщо це поле встановлено на `IfPossible`, монтування виконується рекурсивно в режимі "тільки для читання", якщо це підтримується контейнерним середовищем. Якщо це поле встановлено на `Enabled`, монтування виконується рекурсивно в режимі "тільки для читання", якщо це підтримується контейнерним середовищем, інакше pod не буде запущено, і буде згенеровано помилку з відповідною причиною.

    Якщо це поле встановлено на `IfPossible` або `Enabled`, значення `MountPropagation` повинно бути встановлено на `None` (або бути невказаним, що стандартно дорівнює `None`).

    Якщо це поле не вказано, воно вважається еквівалентним до `Disabled`.

  - **volumeMounts.subPath** (string)

    Шлях всередині тому, з якого має бути змонтований том контейнера. Стандартне значення — "" (корінь тому).

  - **volumeMounts.subPathExpr** (string)

    Розгорнутий шлях всередині тому, з якого має бути змонтований том контейнера. Поводиться схоже до SubPath, але посилання на змінні середовища $(VAR_NAME) розгортаються за допомогою середовища контейнера. Стандартне значення — "" (корінь тому). SubPathExpr і SubPath є взаємовиключними.

- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: обʼєднання за ключем `devicePath`*

  *Map: унікальні значення ключа devicePath будуть збережені під час злиття*

  volumeDevices — це список блочних пристроїв, які будуть використані контейнером.

  <a name="VolumeDevice"></a>
  *volumeDevice описує зіставлення необробленого блочного пристрою всередині контейнера.*

  - **volumeDevices.devicePath** (string), обовʼязково

    devicePath — це шлях всередині контейнера, на який буде зіставлено пристрій.

  - **volumeDevices.name** (string), обовʼязково

    name повинно відповідати імені persistentVolumeClaim в Podʼі.

### Ресурси {#resources-1}

- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: буде замінено під час обʼєднання*

  Політика зміни розміру ресурсів для контейнера.

  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy представляє політику зміни розміру ресурсів для контейнера.*

  - **resizePolicy.resourceName** (string), обовʼязково

    Назва ресурсу, до якого застосовується ця політика зміни розміру ресурсу. Підтримувані значення: cpu, memory.

  - **resizePolicy.restartPolicy** (string), обовʼязково

    Політика перезапуску, яку застосовувати при зміні розміру вказаного ресурсу. Якщо не вказано, то стандартно встановлюється NotRequired.

### Життєвий цикл {#lifecycle-1}

- **terminationMessagePath** (string)

  Необовʼязково: Шлях, за яким файл, до якого буде записано повідомлення про завершення контейнера, буде вмонтовано в файлову систему контейнера. Записане повідомлення, призначено для короткого кінцевого статусу, наприклад, повідомлення про помилку виразу. Якщо воно більше 4096 байт, то вузол скоротить його. Загальна довжина повідомлення по всіх контейнерах буде обмежена 12 кб. Стандартне значення — /dev/termination-log. Не може бути оновлено.

- **terminationMessagePolicy** (string)

  Вказує, як має бути заповнене повідомлення про завершення. File використовуватиме вміст terminationMessagePath для заповнення повідомлення про статус контейнера при успіху і невдачі. FallbackToLogsOnError використовуватиме останній шматок виводу логу контейнера, якщо файл повідомлення про завершення пустий і контейнер завершився з помилкою. Вивід логу обмежено 2048 байтами або 80 рядками, якщо це менше. Стандартне значення — File. Не може бути оновлено.

  Можливі значення переліку (enum):
  - `"FallbackToLogsOnError"` прочитає найновіший вміст журналів контейнера для повідомлення про стан контейнера, коли контейнер завершується з помилкою, а terminationMessagePath не має вмісту.
  - `"File"` є стандартною поведінкою і встановить повідомлення про стан контейнера на вміст terminationMessagePath контейнера, коли контейнер завершується.

- **restartPolicy** (string)

  RestartPolicy визначає поведінку перезапуску окремих контейнерів у Podʼі. Ви не можете встановити це поле для ефемерних контейнерів.

- **restartPolicyRules** ([]ContainerRestartRule)

  *Atomic: буде замінено під час злиття*

  Представляє список правил, які слід перевірити, щоб визначити, чи слід перезапустити контейнер при виході. Ви не можете встановити це поле для ефемерних контейнерів.

  <a name="ContainerRestartRule"></a>
  *ContainerRestartRule описує, як обробляється вихід контейнера.*

  - **restartPolicyRules.action** (string), обовʼязково

    Вказує дію, що виконується при виході з контейнера, якщо вимоги виконані. Єдиним можливим значенням є "Restart" (Перезапустити) для перезапуску контейнера.

  - **restartPolicyRules.exitCodes** (ContainerRestartRuleOnExitCodes)

    Представляє коди виходу для перевірки виходів контейнера.

    <a name="ContainerRestartRuleOnExitCodes"></a>
    *ContainerRestartRuleOnExitCodes describes the condition for handling an exited container based on its exit codes.*

    - **restartPolicyRules.exitCodes.operator** (string), обовʼязково

      Представляє взаємозвʼязок між кодом (кодами) виходу контейнера та вказаними значеннями. Можливі значення:
      - In: вимога виконується, якщо код виходу контейнера знаходиться в наборі вказаних значень.
      - NotIn: вимога виконується, якщо код виходу контейнера не знаходиться в наборі вказаних значень.

    - **restartPolicyRules.exitCodes.values** ([]int32)

      *Set: унікальні значення будуть збережені під час злиття*

      Вказує набір значень, які слід перевіряти для кодів виходу контейнера. Допускається не більше 255 елементів.

### Налагодження {#debugging-1}

- **stdin** (boolean)

  Чи повинен цей контейнер виділяти буфер для stdin у середовищі виконання контейнера. Якщо це не встановлено, читання з stdin у контейнері завжди буде призводити до EOF. Стандартно — false.

- **stdinOnce** (boolean)

  Чи повинне середовище виконання контейнера закрити канал stdin після того, як він був відкритий одним підключенням. Коли stdin дорівнює true, потік stdin залишатиметься відкритим протягом декількох сеансів підключення. Якщо stdinOnce встановлено у true, stdin відкривається під час запуску контейнера, залишається порожнім до першого підключення клієнта до stdin, а потім залишається відкритим і приймає дані до відключення клієнта, після чого stdin закривається і залишається закритим до перезапуску контейнера. Якщо цей прапорець встановлено у false, процеси контейнера, що читають з stdin, ніколи не отримають EOF. Стандартно — false.

- **tty** (boolean)

  Чи повинен цей контейнер виділяти для себе TTY, також вимагає, щоб 'stdin' був true. Стандартно — false.

### Контекс безпеки {#security-context-2}

- **securityContext** (SecurityContext)

  SecurityContext визначає параметри безпеки, з якими має працювати контейнер. Якщо встановлено, поля SecurityContext замінять відповідні поля PodSecurityContext. Докладніше: [https://kubernetes.io/docs/tasks/configure-pod-container/security-context/](/docs/tasks/configure-pod-container/security-context/)

  <a name="SecurityContext"></a>
  *SecurityContext містить конфігурацію безпеки, яка буде застосована до контейнера. Деякі поля присутні як у SecurityContext, так і в PodSecurityContext. Якщо обидва встановлені, значення в SecurityContext мають пріоритет.*

  - **securityContext.allowPrivilegeEscalation** (boolean)

    `AllowPrivilegeEscalation` керує тим, чи може процес отримати більше привілеїв, ніж батьківський процес. Це булеве значення безпосередньо контролює, чи буде встановлений прапорець `no_new_privs` для процесу контейнера.

    `AllowPrivilegeEscalation` завжди має значення `true` за наступних умов:
    1. Контейнер запускається в привілейованому режимі (`Privileged`).
    2. Контейнер має `CAP_SYS_ADMIN`.

    Зверніть увагу, що це поле не можна встановити, якщо `spec.os.name` дорівнює `windows`.

  - **securityContext.appArmorProfile** (AppArmorProfile)

    `appArmorProfile` визначає параметри AppArmor, які використовуються для цього контейнера. Якщо встановлено, цей профіль замінює профіль AppArmor для всього podʼа. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    <a name="AppArmorProfile"></a>
    *AppArmorProfile визначає налаштування AppArmor для podʼа або контейнера.*

    - **securityContext.appArmorProfile.type** (string), обовʼязково

      Поле `type` вказує, який тип профілю AppArmor буде застосовано. Дійсні варіанти:
      - `Localhost` — профіль, попередньо завантажений на вузлі.
      - `RuntimeDefault` — стандартний профіль середовища виконання контейнерів.
      - `Unconfined` — без примусового виконання правил AppArmor.

      Можливі значення переліку (enum):
      - `"Localhost"` вказує, що слід використовувати профіль, попередньо завантажений на вузлі.
      - `"RuntimeDefault"` вказує, що слід використовувати стандартний профіль середовища виконання контейнерів.
      - `"Unconfined"` вказує, що не слід примусово виконувати жоден профіль AppArmor.

    - **securityContext.appArmorProfile.localhostProfile** (string)

      `localhostProfile` вказує профіль, завантажений на вузлі, який слід використовувати. Профіль має бути попередньо налаштований на вузлі для коректної роботи. Назва профілю повинна відповідати завантаженій назві. Це поле повинно бути встановлене, якщо і тільки якщо тип дорівнює "Localhost".

  - **securityContext.capabilities** (Capabilities)

    Можливості для додавання/видалення під час запуску контейнерів. Стандарто використовується набір можливостей, наданих середовищем виконання контейнера. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    <a name="Capabilities"></a>
    *Додає та видаляє можливості POSIX з працюючих контейнерів.*

    - **securityContext.capabilities.add** ([]string)

      *Atomic: буде замінено під час злиття*

      Додані можливості.

    - **securityContext.capabilities.drop** ([]string)

      *Atomic: буде замінено під час злиття*

      Видалені можливості.

  - **securityContext.procMount** (string)

    procMount позначає тип монтування proc, який слід використовувати для контейнерів. Стандартне значення — Default, яке використовує стандартні налаштування середовища виконання контейнера для шляхів тільки для читання та змаскованих шляхів. Це вимагає увімкнення прапорця функції ProcMountType. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    Можливі значення переліку (enum):
    - `"Default"` використовує стандартні налаштування середовища виконання контейнера для шляхів тільки для читання та змаскованих шляхів для /proc. Більшість середовищ виконання контейнерів маскують певні шляхи в /proc, щоб уникнути випадкового витоку безпеки спеціальних пристроїв або інформації.
    - `"Unmasked"` обминає стандартну поведінку маскування середовища виконання контейнера та забезпечує, щоб новостворений /proc контейнера залишався незмінним.

  - **securityContext.privileged** (boolean)

    Запуск контейнера у привілейованому режимі. Процеси у привілейованих контейнерах по суті еквівалентні root на хості. Стандартно дорівнює false. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.readOnlyRootFilesystem** (boolean)

    Чи має цей контейнер кореневу файлову систему тільки для читання. Стандартно дорівнює false. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.runAsUser** (int64)

    UID, з яким запускається початковий процес контейнера. Стандартно використовується користувач, вказаний у метаданих образу, якщо не вказано інше. Також може бути встановлено в `PodSecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, зазначене в `SecurityContext`. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

  - **securityContext.runAsNonRoot** (boolean)

    Вказує, що контейнер повинен запускатися як користувач, який не є root. Якщо значення `true`, Kubelet перевірить образ під час виконання, щоб гарантувати, що він не запускається з UID 0 (root), і не запустить контейнер, якщо це не так. Якщо поле не встановлено або має значення `false`, така перевірка не виконується. Також може бути налаштовано в `SecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, вказане в `SecurityContext`.

  - **securityContext.runAsGroup** (int64)

    GID, під яким запускається початковий процес контейнера. Якщо не встановлено, використовується стандартне значення для середовища виконання. Також може бути вказано в `SecurityContext`. Якщо значення встановлено як у `SecurityContext`, так і в `PodSecurityContext`, пріоритет має значення, зазначене в `SecurityContext` для цього контейнера. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    Контекст SELinux, який буде застосований до контейнера. Якщо не вказано, середовище виконання контейнера призначить випадковий контекст SELinux для кожного контейнера. Може також бути встановлено в PodSecurityContext. Якщо встановлено в обох SecurityContext і PodSecurityContext, пріоритет має значення, вказане в SecurityContext. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions — це мітки, що застосовуються до контейнера*

    - **securityContext.seLinuxOptions.level** (string)

      Level є міткою рівня SELinux, що застосовується до контейнера.

    - **securityContext.seLinuxOptions.role** (string)

      Role є міткою ролі SELinux, що застосовується до контейнера.

    - **securityContext.seLinuxOptions.type** (string)

      Type є міткою типу SELinux, що застосовується до контейнера.

    - **securityContext.seLinuxOptions.user** (string)

      User є міткою користувача SELinux, що застосовується до контейнера.

  - **securityContext.seccompProfile** (SeccompProfile)

    Параметри seccomp для використання контейнерами в цьому Podʼі. Зверніть увагу, що це поле не можна встановити, коли spec.os.name — windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile визначає налаштування профілю seccomp для Podʼа/контейнера. Може бути встановлено лише одне джерело профілю.*

    - **securityContext.seccompProfile.type** (string), обовʼязкове

      type вказує, який тип профілю seccomp буде застосовано. Допустимі варіанти:

      - Localhost — має бути використаний профіль, визначений у файлі на вузлі.
      - RuntimeDefault — має бути використаний стандартний профіль для середовища виконання контейнерів.
      - Unconfined — не застосовується жоден профіль.

      Можливі значення переліку (enum):
      - `"Localhost"` вказує, що слід використовувати профіль, визначений у файлі на вузлі. Шлях до файлу відносно до \<kubelet-root-dir>/seccomp.
      - `"RuntimeDefault"` представляє стандартний профіль seccomp для середовища виконання контейнерів.
      - `"Unconfined"` вказує, що жоден профіль seccomp не застосовується (також відомий як unconfined).

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile вказує, що має бути використаний профіль, визначений у файлі на вузлі. Профіль має бути попередньо налаштований на вузлі, щоб працювати. Має бути низхідний шлях, відносно до налаштованого розташування профілю seccomp kubelet. Має бути встановлено, якщо тип "Localhost". НЕ має бути встановлено для будь-якого іншого типу.

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    Специфічні налаштування для Windows, які застосовуються до всіх контейнерів. Якщо не вказано, використовуються опції з PodSecurityContext. Якщо встановлено в обох SecurityContext і PodSecurityContext, пріоритет має значення, вказане в SecurityContext. Зверніть увагу, що це поле не може бути встановлено, коли spec.os.name є linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions містять специфічні для Windows параметри та облікові дані.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec — це місце, де вебхук GMSA (https://github.com/kubernetes-sigs/windows-gmsa) вставляє вміст специфікації облікових даних GMSA, названої полем GMSACredentialSpecName.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName — це назва специфікації облікових даних GMSA, яка буде використана.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess визначає, чи слід запускати контейнер як контейнер ʼHost Processʼ. Усі контейнери Pod повинні мати однакове значення HostProcess (не дозволено мати суміш контейнерів HostProcess та не-HostProcess). Крім того, якщо HostProcess є true, то HostNetwork також повинен бути встановлений у true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      Імʼя користувача в Windows для запуску точки входу процесу контейнера. Стандартно використовується користувач, вказаний у метаданих образу, якщо не вказано. Може також бути встановлено в PodSecurityContext. Якщо встановлено в обох SecurityContext і PodSecurityContext, пріоритет має значення, вказане в SecurityContext.

### Не дозволяються {#not-allowed}

- **ports** ([]ContainerPort)

  *Patch strategy: обʼєднання за ключем `containerPort`*

  *Map: унікальні значення за ключами `containerPort, protocol` будуть збережені під час обʼєднання*

  Для ефемерних контейнерів визначення портів не дозволяється.

  <a name="ContainerPort"></a>
  *ContainerPort представляє мережевий порт в одному контейнері.*

  - **ports.containerPort** (int32), обовʼязково

    Номер порту для відкриття на IP-адресі контейнера. Це повинен бути дійсний номер порту, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    IP-адреса хоста, що звʼязується з зовнішнім портом.

  - **ports.hostPort** (int32)

    Номер порту для відкриття на хості. Якщо вказано, це повинен бути дійсний номер порту, 0 \< x \< 65536. Якщо вказано HostNetwork, це значення повинно збігатися з ContainerPort. Більшість контейнерів цього не потребують.

  - **ports.name** (string)

    Якщо вказано, це повинен бути IANA_SVC_NAME і єдиним в межах Podʼа. Кожен іменований порт в Podʼі повинен мати унікальне імʼя. Назва порту, на яку можна посилатися з Service.

  - **ports.protocol** (string)

    Протокол для порту. Повинен бути UDP, TCP або SCTP. Стандартне значення — "TCP".

    Можливі значення переліку (enum):
    - `"SCTP"` протокол SCTP.
    - `"TCP"` протокол TCP.
    - `"UDP"` протокол UDP.

- **resources** (ResourceRequirements)

  Для ефемерних контейнерів заборонено використовувати ресурси. Ефемерні контейнери використовують вільні ресурси, вже виділені для Podʼа.

  - **resources.claims** ([]ResourceClaim)

    *Map: унікальні значення за ключем будуть збережені під час обʼєднання*

    Claims містить назви ресурсів, визначених в spec.resourceClaims, які використовуються цим контейнером.

    Це поле залежить від функціональної можливості DynamicResourceAllocation.

    Це поле є незмінним. Його можна встановити тільки для контейнерів.

    <a name="ResourceClaim"></a>
    *ResourceClaim посилається на один запис в PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), обовʼязково

      Імʼя повинно відповідати імені одного запису в pod.spec.resourceClaims Podʼа, де використовується це поле. Це робить цей ресурс доступним всередині контейнера.

    - **resources.claims.request** (string)

      `Request` — це імʼя, вибране для запиту в зазначеній заявці. Якщо поле порожнє, буде доступно все з заявки; в іншому випадку, доступний буде лише результат цього запиту.

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits визначає максимальну кількість обчислювальних ресурсів, дозволених. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests описує мінімальну кількість обчислювальних ресурсів, що потрібна. Якщо Requests відсутній для контейнера, він стандартно встановлюється в Limits, якщо це явно вказано, інакше — у значення, визначеного реалізацією. Requests не може перевищувати Limits. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

- **lifecycle** (Lifecycle)

  Для ефемерних контейнерів заборонено використовувати lifecycle.

  <a name="Lifecycle"></a>
  *Lifecycle описує дії, які система управління повинна виконати у відповідь на події життєвого циклу контейнера. Для обробників життєвого циклу PostStart і PreStop управління контейнером блокується, поки дія не буде завершена, якщо процес контейнера виявляється несправним, тоді обробник переривається.*

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart викликається негайно після створення контейнера. Якщо обробник не вдалося виконати, контейнер буде завершено і перезапущено згідно зі своєю політикою перезапуску. Інше управління контейнером блокується, поки хук не завершиться. Докладніше: [https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks)

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop викликається негайно перед тим, як контейнер буде завершено через запит API або подію управління, таку як невдача проби справності/запуску, випередження, скорочення ресурсів тощо. Обробник не викликається, якщо контейнер впаде або закінчить роботу. Період перебігу належного завершення підраховується до виконання хуку PreStop. Незалежно від результату обробника, контейнер в кінцевому підсумку завершиться протягом періоду належного завершення Pod (якщо він не буде затриманий завершенням залишкових операцій). Інше управління контейнером блокується, поки хук не завершиться або досягне періоду належного завершення. Докладніше: [https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks)

  - **lifecycle.stopSignal** (string)

    StopSignal визначає, який сигнал буде надіслано контейнеру під час його зупинки. Якщо його не вказано, стандартне значення визначатиметься використовуваним середовищем виконання контейнера. StopSignal можна встановити лише для Podʼів з непорожнім імʼям .spec.os.name

    Можливі значення переліку (enum):
    - `"SIGABRT"`
    - `"SIGALRM"`
    - `"SIGBUS"`
    - `"SIGCHLD"`
    - `"SIGCLD"`
    - `"SIGCONT"`
    - `"SIGFPE"`
    - `"SIGHUP"`
    - `"SIGILL"`
    - `"SIGINT"`
    - `"SIGIO"`
    - `"SIGIOT"`
    - `"SIGKILL"`
    - `"SIGPIPE"`
    - `"SIGPOLL"`
    - `"SIGPROF"`
    - `"SIGPWR"`
    - `"SIGQUIT"`
    - `"SIGRTMAX"`
    - `"SIGRTMAX-1"`
    - `"SIGRTMAX-10"`
    - `"SIGRTMAX-11"`
    - `"SIGRTMAX-12"`
    - `"SIGRTMAX-13"`
    - `"SIGRTMAX-14"`
    - `"SIGRTMAX-2"`
    - `"SIGRTMAX-3"`
    - `"SIGRTMAX-4"`
    - `"SIGRTMAX-5"`
    - `"SIGRTMAX-6"`
    - `"SIGRTMAX-7"`
    - `"SIGRTMAX-8"`
    - `"SIGRTMAX-9"`
    - `"SIGRTMIN"`
    - `"SIGRTMIN+1"`
    - `"SIGRTMIN+10"`
    - `"SIGRTMIN+11"`
    - `"SIGRTMIN+12"`
    - `"SIGRTMIN+13"`
    - `"SIGRTMIN+14"`
    - `"SIGRTMIN+15"`
    - `"SIGRTMIN+2"`
    - `"SIGRTMIN+3"`
    - `"SIGRTMIN+4"`
    - `"SIGRTMIN+5"`
    - `"SIGRTMIN+6"`
    - `"SIGRTMIN+7"`
    - `"SIGRTMIN+8"`
    - `"SIGRTMIN+9"`
    - `"SIGSEGV"`
    - `"SIGSTKFLT"`
    - `"SIGSTOP"`
    - `"SIGSYS"`
    - `"SIGTERM"`
    - `"SIGTRAP"`
    - `"SIGTSTP"`
    - `"SIGTTIN"`
    - `"SIGTTOU"`
    - `"SIGURG"`
    - `"SIGUSR1"`
    - `"SIGUSR2"`
    - `"SIGVTALRM"`
    - `"SIGWINCH"`
    - `"SIGXCPU"`
    - `"SIGXFSZ"`

- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Проби не дозволені для ефемерних контейнерів.

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Проби не дозволені для ефемерних контейнерів.

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Проби не дозволені для ефемерних контейнерів.

## Обробник життєвого циклу {#LifecycleHandler}

Обробник життєвого циклу (LifecycleHandler) визначає конкретну дію, яку слід виконати в хуці життєвого циклу. Має бути вказане тільки одне з полів, за винятком TCPSocket.

---

- **exec** (ExecAction)

  Exec вказує команду для виконання в контейнері.

  <a name="ExecAction"></a>
  *ExecAction описує дію "виконати в контейнері".*

  - **exec.command** ([]string)

    *Atomic: буде замінено під час злиття*

    Command — це командний рядок для виконання всередині контейнера, робоча тека для команди — корінь ('/') у файловій системі контейнера. Команда виконується безпосередньо, а не в оболонці, тому традиційні команди оболонки ('|', тощо) не працюватимуть. Для використання оболонки потрібно явно викликати цю оболонку. Статус виходу 0 вважається готовим/справним, а ненульовий — несправним.

- **httpGet** (HTTPGetAction)

  HTTPGet визначає HTTP GET-запит, який слід виконати.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction описує дію на основі HTTP Get-запитів.*

  - **httpGet.port** (IntOrString), обовʼязково

    Назва або номер порту для доступу до контейнера. Номер повинен бути в діапазоні від 1 до 65535. Назва повинна бути IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString — це тип, який може містити int32 або рядок. Під час перетворення з/у JSON або YAML він створює або споживає внутрішній тип. Це дозволяє мати, наприклад, поле JSON, яке може приймати назву або номер.*

  - **httpGet.host** (string)

    Імʼя хосту для підключення, стандартно використовується IP-адреса Podʼа. Ймовірно, вам потрібно встановити "Host" в httpHeaders замість цього.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    *Atomic: буде замінено під час злиття*

    Власні заголовки для встановлення в запиті. HTTP дозволяє повторювані заголовки.

    <a name="HTTPHeader"></a>
    *HTTPHeader описує власний заголовок, який буде використовуватись в HTTP-пробах.*

    - **httpGet.httpHeaders.name** (string), обовʼязково

      Назва поля заголовка. Воно буде канонізовано при виведенні, тому імена, що відрізняються регістром, будуть сприйматись як один і той самий заголовок.

    - **httpGet.httpHeaders.value** (string), обовʼязково

      Значення поля заголовка.

  - **httpGet.path** (string)

    Шлях для доступу до HTTP-сервера.

  - **httpGet.scheme** (string)

    Схема для підключення до хоста. Стандартне значення — HTTP.

    Можливі значення переліку (enum):
    - `"HTTP"` вказує, що слід використовувати схему http://
    - `"HTTPS"` вказує, що слід використовувати схему https://

- **sleep** (SleepAction)

  Sleep представляє тривалість, протягом якої контейнер повинен бездіяти.

  <a name="SleepAction"></a>
  *SleepAction описує дію "sleep".*

  - **sleep.seconds** (int64), обовʼязково

    Seconds — кількість секунд для sleep.

- **tcpSocket** (TCPSocketAction)

  Застаріло. TCPSocket НЕ підтримується як обробник життєвого циклу та зберігається для зворотної сумісності. Валідація цього поля не проводиться, і хуки життєвого циклу зазнають невдачі під час виконання, коли вказано обробник tcp.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction описує дію на основі відкриття сокета*

  - **tcpSocket.port** (IntOrString), обовʼязково

    Номер або назва порту для доступу до контейнера. Номер повинен бути в діапазоні від 1 до 65535. Назва повинна бути IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString — це тип, який може містити int32 або рядок. Під час перетворення з/у JSON або YAML він створює або споживає внутрішній тип. Це дозволяє мати, наприклад, поле JSON, яке може приймати назву або номер.*

  - **tcpSocket.host** (string)

    Додатково: Імʼя хоста для підключення, стандартно використовується IP-адреса Podʼа.

## NodeAffinity {#NodeAffinity}

Node affinity — це група правил планування вузлів за спорідненістю.

---

- **preferredDuringSchedulingIgnoredDuringExecution** ([]PreferredSchedulingTerm)

  *Atomic: буде замінено під час злиття*

  Планувальник надаватиме перевагу розміщенню Podʼів на вузлах, які відповідають виразам спорідненості, зазначеним у цьому полі, але може вибрати вузол, який порушує один або кілька цих виразів. Найбільш пріоритетним є вузол із найбільшою сумою ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, вирази спорідненості requiredDuringScheduling тощо), обчислюється сума шляхом ітерації через елементи цього поля та додавання "ваги" до суми, якщо вузол відповідає відповідним matchExpressions; вузол(и) з найвищою сумою є найпріоритетнішими.

  <a name="PreferredSchedulingTerm"></a>
  *Порожній термін пріоритету планування відповідає всім об’єктам з неявною вагою 0 (тобто, він не діє). Нульовий термін пріоритету планування не відповідає жодному обʼєкту (тобто, також не діє).*

  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm), обов’язковий

    Термін селектора вузлів, пов’язаний з відповідною вагою.

    <a name="NodeSelectorTerm"></a>
    *Нульовий або порожній термін селектора вузлів не відповідає жодному обʼєкту. Вимоги до них обʼєднані за допомогою операції AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

    *Atomic: буде замінено під час злиття*

      Список вимог селектора вузлів за мітками вузлів.

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

    *Atomic: буде замінено під час злиття*

      Список вимог селектора вузлів за полями вузлів.

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), обов’язковий

    Вага, пов’язана з відповідним nodeSelectorTerm, у діапазоні 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** (NodeSelector)

  Якщо вимоги спорідненості, зазначені в цьому полі, не будуть виконані під час планування, Pod не буде розміщено на вузлі. Якщо вимоги спорідненості, зазначені в цьому полі, перестануть виконуватися в якийсь момент під час виконання Podʼа (наприклад, через оновлення), система може або не може спробувати врешті-решт виселити Pod з його вузла.

  <a name="NodeSelector"></a>
  *Селектор вузлів представляє обʼєднання результатів одного або кількох запитів за мітками до набору вузлів; тобто він представляє OR селекторів, представлених термінами селектора вузлів.*

  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm), обов’язковий

    *Atomic: буде замінено під час злиття*

    Обов’язковий. Список термінів селектора вузлів. Терміни обʼєднані за допомогою операції OR.

    <a name="NodeSelectorTerm"></a>
    *Null або порожній термін селектора вузла не відповідає жодному об'єкту. Вимоги до них складаються за принципом AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: буде замінено під час злиття*

      Список вимог селектора вузлів за мітками вузлів.

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: буде замінено під час злиття*

      Список вимог селектора вузлів за полями вузлів.

## PodAffinity {#PodAffinity}

Pod affinity — це група правил планування між Podʼами за спорідненістю.

---

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  *Atomic: буде замінено під час злиття*

  Планувальник надаватиме перевагу розміщенню Podʼів на вузлах, які відповідають виразам спорідненості, зазначеним у цьому полі, але може вибрати вузол, який порушує один або кілька з цих виразів. Найбільш пріоритетним є вузол із найбільшою сумою ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, вирази спорідненості requiredDuringScheduling тощо), обчислюється сума шляхом ітерації через елементи цього поля та віднімання "ваги" з суми, якщо на вузлі є Podʼи, які відповідають відповідному podAffinityTerm; вузол(и) з найвищою сумою є найпріоритетнішими.

  <a name="WeightedPodAffinityTerm"></a>
  *Ваги всіх відповідних полів WeightedPodAffinityTerm додаються для кожного вузла, щоб знайти найпріоритетніший(і) вузол(и).*

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), обов’язковий

    Обов’язковий. Термін спорідненості Podʼа, пов’язаний з відповідною вагою.

    <a name="PodAffinityTerm"></a>
    *Визначає набір Podʼів (тобто тих, які відповідають labelSelector у стосунку до заданих простірів імен), з якими цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість), де розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем \<topologyKey\> збігається з будь-яким вузлом, на якому виконується Pod з набору Podʼів.*

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), обов’язковий

      Цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість) з Podʼами, які відповідають labelSelector у зазначених просторах імен, де розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем topologyKey збігається з будь-яким вузлом, на якому виконується будь-який з вибраних Podʼів. Порожній topologyKey не допускається.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      Запит за мітками до набору ресурсів, у даному випадку Podʼів. Якщо він дорівнює null, цей PodAffinityTerm не збігається з жодним Pod'ом.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.matchLabelKeys** ([]string)

      *Atomic: буде замінено під час злиття*

      MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.mismatchLabelKeys** ([]string)

      *Atomic: буде замінено під час злиття*

      MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.


    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      Запит за мітками до набору просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, вибраних цим полем, і тих, що зазначені в полі namespaces. Нульовий селектор і нульовий або порожній список просторів імен означає "простір імен цього Podʼа". Порожній селектор ({}) відповідає всім просторам імен.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      *Atomic: буде замінено під час злиття*

      Простори імен визначають статичний список назв просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, зазначених у цьому полі, і тих, що вибрані namespaceSelector. Нульовий або порожній список просторів імен і нульовий namespaceSelector означає "простір імен цього Podʼа".

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), обов’язковий

    Вага, пов’язана з відповідним podAffinityTerm, у діапазоні 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  *Atomic: буде замінено під час злиття*

  Якщо вимоги спорідненісті, зазначені в цьому полі, не будуть виконані під час планування, Pod не буде розміщено на вузлі. Якщо вимоги спорідненісті, зазначені в цьому полі, перестануть виконуватися в якийсь момент під час виконання Podʼа (наприклад, через оновлення міток Podʼа), система може або не може спробувати врешті-решт виселити Pod з його вузла. Коли є кілька елементів, списки вузлів, що відповідають кожному podAffinityTerm, перетинаються, тобто всі терміни мають бути виконані.

  <a name="PodAffinityTerm"></a>
  *Визначає набір Podʼів (тобто тих, які відповідають labelSelector у стосунку до заданих простірів імен), з якими цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість), де розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем \<topologyKey\> збігається з будь-яким вузлом, на якому виконується Pod з набору Podʼів.*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), обов’язковий

    Цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість) з Podʼами, які відповідають labelSelector у зазначених просторах імен, де розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем topologyKey збігається з будь-яким вузлом, на якому виконується будь-який з вибраних Podʼів. Порожній topologyKey не допускається.

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    Запит за мітками до набору ресурсів, у даному випадку Podʼів. Якщо він дорівнює null, цей PodAffinityTerm не збігається з жодним Podʼом.

  - **requiredDuringSchedulingIgnoredDuringExecution.matchLabelKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

  - **requiredDuringSchedulingIgnoredDuringExecution.mismatchLabelKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    Запит за мітками до набору просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, вибраних цим полем, і тих, що зазначені в полі namespaces. Нульовий селектор і нульовий або порожній список просторів імен означає "простір імен цього Podʼа". Порожній селектор ({}) відповідає всім просторам імен.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    *Atomic: буде замінено під час злиття*

    Простори імен визначають статичний список назв просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, зазначених у цьому полі, і тих, що вибрані namespaceSelector. Нульовий або порожній список просторів імен і нульовий namespaceSelector означає "простір імен цього Podʼа".

## PodAntiAffinity {#PodAntiAffinity}

Pod anti affinity — це група правил планування між Podʼами за анти-спорідненістю.

---

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  *Atomic: буде замінено під час злиття*

  Планувальник надаватиме перевагу розміщенню Podʼів на вузлах, які відповідають виразам анти-спорідненості, зазначеним у цьому полі, але може вибрати вузол, який порушує один або кілька з цих виразів. Найбільш пріоритетним є вузол із найбільшою сумою ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, вирази анти-спорідненості requiredDuringScheduling тощо), обчислюється сума шляхом ітерації через елементи цього поля та додавання "ваги" до суми, якщо на вузлі є Podʼи, які відповідають відповідному podAffinityTerm; вузол(и) з найвищою сумою є найпріоритетнішими.

  <a name="WeightedPodAffinityTerm"></a>
  *Ваги всіх відповідних полів WeightedPodAffinityTerm додаються для кожного вузла, щоб знайти найпріоритетніший(і) вузол(и).*

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), обов’язковий

    Обов’язковий. Термін спорідненості Podʼа, пов’язаний з відповідною вагою.

    <a name="PodAffinityTerm"></a>
    *Визначає набір Podʼів (тобто тих, які відповідають labelSelector у стосунку до заданих простірів імен), з якими цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість), де розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем \<topologyKey\> збігається з будь-яким вузлом, на якому виконується Pod з набору Podʼів.*

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), обов’язковий

      Цей Pod повинен бути розміщений разом (спорідненість) або не разом (анти-спорідненість) з Podʼами, які відповідають labelSelector у зазначених просторах імен. Розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем topologyKey збігається з будь-яким вузлом, на якому виконується будь-який з вибраних Podʼів. Порожній topologyKey не допускається.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      Запит за мітками до набору ресурсів, у даному випадку Podʼів. Якщо він дорівнює null, цей PodAffinityTerm не збігається з жодним Podʼом.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.matchLabelKeys** ([]string)

      *Atomic: буде замінено під час злиття*

      MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.mismatchLabelKeys** ([]string)

      *Atomic: буде замінено під час злиття*

      MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      Запит за мітками до набору просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, вибраних цим полем, і тих, що зазначені в полі namespaces. Нульовий селектор і нульовий або порожній список просторів імен означає "простір імен цього Podʼа". Порожній селектор ({}) відповідає всім просторам імен.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      *Atomic: буде замінено під час злиття*

      Простори імен визначають статичний список назв просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, зазначених у цьому полі, і тих, що вибрані namespaceSelector. Нульовий або порожній список просторів імен і нульовий namespaceSelector означає "простір імен цього Podʼа".

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), обов’язковий

    Вага, пов’язана з відповідним podAffinityTerm, у діапазоні 1-100.

- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  *Atomic: буде замінено під час злиття*

  Якщо вимоги анти-спорідненості, зазначені в цьому полі, не будуть виконані під час планування, Pod не буде розміщено на вузлі. Якщо вимоги анти-спорідненості, зазначені в цьому полі, перестануть виконуватися в якийсь момент під час виконання Podʼа (наприклад, через оновлення міток Podʼа), система може або не може спробувати врешті-решт виселити Pod з його вузла. Коли є кілька елементів, списки вузлів, що відповідають кожному podAffinityTerm, перетинаються, тобто всі терміни мають бути виконані.

  <a name="PodAffinityTerm"></a>
  *Визначає набір Podʼів (тобто тих, які відповідають labelSelector у стосунку до заданих простірів імен), з якими цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість), де розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем \<topologyKey\> збігається з будь-яким вузлом, на якому виконується Pod з набору Podʼів.*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), обов’язковий

    Цей Pod має бути розміщений разом (спорідненість) або не разом (анти-спорідненість) з Podʼами, які відповідають labelSelector у зазначених просторах імен. Розміщення разом визначається як виконання на вузлі, значення мітки якого з ключем topologyKey збігається з будь-яким вузлом, на якому виконується будь-який з вибраних Podʼів. Порожній topologyKey не допускається.

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    Запит за мітками до набору ресурсів, у даному випадку Podʼів. Якщо він дорівнює null, цей PodAffinityTerm не збігається з жодним Podʼом.

  - **requiredDuringSchedulingIgnoredDuringExecution.matchLabelKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

  - **requiredDuringSchedulingIgnoredDuringExecution.mismatchLabelKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    Запит за мітками до набору просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, вибраних цим полем, і тих, що зазначені в полі namespaces. Нульовий селектор і нульовий або порожній список просторів імен означає "простір імен цього Podʼа". Порожній селектор ({}) відповідає всім просторам імен.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    *Atomic: буде замінено під час злиття*

    Простори імен визначають статичний список назв просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, зазначених у цьому полі, і тих, що вибрані namespaceSelector. Нульовий або порожній список просторів імен і нульовий namespaceSelector означає "простір імен цього Podʼа".

## Проба {#Probe}

Проба описує перевірку стану, яка виконується для контейнера, щоб визначити, чи він справний або готовий приймати трафік.

---

- **exec** (ExecAction)

  Exec вказує команду для виконання в контейнері.

  <a name="ExecAction"></a>
  *ExecAction описує дію "виконати в контейнері".*

  - **exec.command** ([]string)

    *Atomic: буде замінено під час злиття*

    Command — це командний рядок для виконання всередині контейнера, робоча тека для команди — корінь ('/') у файловій системі контейнера. Команда виконується безпосередньо, а не в оболонці, тому традиційні команди оболонки ('|', тощо) не працюватимуть. Для використання оболонки потрібно явно викликати цю оболонку. Статус виходу 0 вважається готовим/справним, а ненульовий — несправним.

- **httpGet** (HTTPGetAction)

  HTTPGet визначає HTTP GET-запит для виконання.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction описує дію на основі HTTP GET запитів.*

  - **httpGet.port** (IntOrString), обовʼязково

    Назва або номер порту для доступу до контейнера. Номер повинен бути в діапазоні від 1 до 65535. Назва повинна бути IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString — це тип, який може містити int32 або рядок. Під час перетворення з/у JSON або YAML він створює або споживає внутрішній тип. Це дозволяє мати, наприклад, поле JSON, яке може приймати назву або номер.*

  - **httpGet.host** (string)

    Імʼя хосту для підключення, стандартно використовується IP-адреса Podʼа. Ймовірно, вам потрібно встановити "Host" в httpHeaders замість цього.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    *Atomic: буде замінено під час злиття*

    Власні заголовки для встановлення в запиті. HTTP дозволяє повторювані заголовки.

    <a name="HTTPHeader"></a>
    *HTTPHeader описує власний заголовок, який буде використовуватись в HTTP-пробах.*

    - **httpGet.httpHeaders.name** (string), обовʼязково

      Назва поля заголовка. Воно буде канонізовано при виведенні, тому імена, що відрізняються регістром, будуть сприйматись як один і той самий заголовок.

    - **httpGet.httpHeaders.value** (string), обовʼязково

      Значення поля заголовка.

  - **httpGet.path** (string)

    Шлях для доступу на HTTP сервері.

  - **httpGet.scheme** (string)

    Схема для підключення до хоста. Стандартне значення — HTTP.

    Можливі значення переліку (enum):
    - `"HTTP"` вказує, що слід використовувати схему http://
    - `"HTTPS"` вказує, що слід використовувати схему https://

- **tcpSocket** (TCPSocketAction)

  TCPSocket вказує на зʼєднання з TCP-портом.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction описує дію на основі відкриття сокету.*

  - **tcpSocket.port** (IntOrString), обовʼязково

    Номер або назва порту для доступу до контейнера. Номер повинен бути в діапазоні від 1 до 65535. Назва повинна бути IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString — це тип, який може містити int32 або рядок. Під час перетворення з/у JSON або YAML він створює або споживає внутрішній тип. Це дозволяє мати, наприклад, поле JSON, яке може приймати назву або номер.*

  - **tcpSocket.host** (string)

    Додатково: Імʼя хоста для підключення, стандартно використовується IP-адреса Podʼа.

- **initialDelaySeconds** (int32)

  Кількість секунд після запуску контейнера перед початком перевірки на життєздатність. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **terminationGracePeriodSeconds** (int64)

  Необовʼязкова тривалість у секундах, необхідна для завершення роботи Podʼа після збою перевірки. Період належного завершення — це тривалість у секундах після того, як процесам у Podʼі надіслано сигнал про завершення і час до примусової зупинки процесів сигналом kill. Встановіть цю величину більше, ніж очікуваний час завершення вашого процесу. Якщо це значення є nil, буде використано terminationGracePeriodSeconds Podʼа. В іншому випадку, це значення перекриває значення, надане у специфікації Podʼа. Значення має бути невідʼємним числом. Значення нуль означає негайну зупинку через сигнал kill (без можливості завершення). Це поле є бета-функцією і вимагає увімкнення gate ProbeTerminationGracePeriod. Мінімальне значення — 1. Якщо не встановлено, використовується spec.terminationGracePeriodSeconds.

- **periodSeconds** (int32)

  Як часто (у секундах) виконувати перевірку. Стандартне значення — 10 секунд. Мінімальне значення — 1.

- **timeoutSeconds** (int32)

  Кількість секунд після якої перевірка завершується з тайм-аутом. Стандартне значення — 1 секунда. Мінімальне значення — 1. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **failureThreshold** (int32)

  Мінімальна кількість послідовних збоїв, щоб перевірка вважалася невдалою після того, як вона вже пройшла успішно. Стандартне значення — 3. Мінімальне значення — 1.

- **successThreshold** (int32)

  Мінімальна кількість послідовних успішних перевірок, щоб вважати перевірку успішною після того, як вона не вдалася. Стандартне значення — 1. Має бути 1 для liveness та startup. Мінімальне значення — 1.

- **grpc** (GRPCAction)

  GRPC визначає запит GRPC HealthCheckRequest.

  <a name="GRPCAction"></a>
  *GRPCAction вказує на дію, що залучає GRPC-сервіс.*

  - **grpc.port** (int32), обовʼязково

    Номер порту GRPC сервісу. Номер має бути в діапазоні від 1 до 65535.

  - **grpc.service** (string)

    Service — це імʼя сервісу, яке потрібно вказати в GRPC HealthCheckRequest (див. https://github.com/grpc/grpc/blob/master/doc/health-checking.md).

    Якщо це не вказано, то стандартна поведінка визначається GRPC.

## PodStatus {#PodStatus}

PodStatus представляє інформацію про стан Podʼа. Стан може відставати від фактичного стану системи, особливо якщо вузол, на якому розміщений Pod, не може звʼязатися з панеллю управління.

---

- **nominatedNodeName** (string)

  `nominatedNodeName` встановлюється тільки тоді, коли цей Pod випереджає інші Podʼи на вузлі, але не може бути негайно розміщений, оскільки жертвам випередження надається час для завершення роботи. Це поле не гарантує, що Pod буде розміщений на цьому вузлі. Планувальник може вирішити розмістити Pod в іншому місці, якщо інші вузли стануть доступними раніше. Планувальник також може вирішити надати ресурси на цьому вузлі Podʼу вищого пріоритету, який створюється після вилучення. В результаті це поле може відрізнятися від `PodSpec.nodeName`, коли Pod розміщується.

- **hostIP** (string)

  `hostIP` містить IP-адресу хоста, до якого призначено Pod. Пусте, якщо Pod ще не запущено. Pod може бути призначений на вузол, у якого є проблема з kubelet, що означає, що `HostIP` не буде оновлено, навіть якщо вузол призначено Podʼу.

- **hostIPs** ([]HostIP)

  *Patch strategy: обʼєднання за ключем `ip`*

  *Atomic: буде замінено під час злиття*

  `hostIPs` містить IP-адреси, виділені хосту. Якщо це поле задано, перший запис повинен відповідати полю `hostIP`. Цей список пустий, якщо Pod ще не запущено. Pod може бути призначений на вузол, у якого є проблема з kubelet, що означає, що `HostIPs` не буде оновлено, навіть якщо вузол призначено цьому Podʼу.

  <a name="HostIP"></a>
  *HostIP представляє одну IP-адресу, виділену хосту.*

  - **hostIPs.ip** (string), обовʼязково

    IP — це IP-адреса, призначена хосту.

- **startTime** (Time)

  RFC 3339 дата і час, коли обʼєкт був підтверджений Kubelet. Це відбувається перед тим, як Kubelet завантажив образ контейнера(ів) для Podʼа.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує правильну серіалізацію в YAML і JSON. Надаються обгортки для багатьох фабричних методів, які пропонує пакет time.*

- **phase** (string)

  `phase` Podʼа — це просте, високорівневе резюме про те, на якому етапі свого життєвого циклу знаходиться Pod. Массив умов, поля `reason` і `message`, а також масиви статусів окремих контейнерів містять більше деталей про стан Podʼа. Існує пʼять можливих значень фаз:

  - Pending: Pod прийнято системою Kubernetes, але один або більше образів контейнерів ще не створено. Це включає час до розміщення, а також час, витрачений на завантаження образів через мережу, що може зайняти деякий час.
  - Running: Pod був привʼязаний до вузла, і всі контейнери були створені. Принаймні один контейнер все ще працює або знаходиться в процесі запуску чи перезапуску.
  - Succeeded: всі контейнери в Podʼі завершили роботу успішно і не будуть перезапускатися.
  - Failed: всі контейнери в Podʼі завершили роботу, і принаймні один контейнер завершився з помилкою. Контейнер або завершився з ненульовим статусом, або був завершений системою.

  - Unknown: з якоїсь причини стан Podʼа не вдалося отримати, зазвичай через помилку у звʼязку з хостом Podʼа.

  Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase](/docs/concepts/workloads/pods/pod-lifecycle#pod-phase)

  Можливі значення переліку (enum):
  - `"Failed"` означає, що всі контейнери в Podʼі завершили роботу, і принаймні один контейнер завершився з помилкою (вийшов з ненульовим кодом виходу або був зупинений системою).
  - `"Pending"` означає, що Pod був прийнятий системою, але один або більше контейнерів ще не були запущені. Це включає час до привʼязки до вузла, а також час, витрачений на завантаження образів на хост.
  - `"Running"` означає, що Pod був привʼязаний до вузла, і всі контейнери були запущені. Принаймні один контейнер все ще працює або знаходиться в процесі перезапуску.
  - `"Succeeded"` означає, що всі контейнери в Podʼі добровільно завершили роботу з кодом виходу 0, і система не буде перезапускати жоден з цих контейнерів.
  - `"Unknown"` означає, що з якоїсь причини стан Podʼа не вдалося отримати, зазвичай через помилку у звʼязку з хостом Podʼа. Застаріле: не встановлюється з 2015 року (74da3b14b0c0f658b3bb8d2def5094686d0e9095)

- **message** (string)

  Повідомлення, зрозуміле людині, що вказує на деталі, чому Pod знаходиться в цьому стані.

- **reason** (string)

  Коротке повідомлення у форматі CamelCase, що вказує на деталі, чому Pod знаходиться в цьому стані, наприклад, ʼEvictedʼ.

- **podIP** (string)

  `podIP` — IP-адреса, виділена Podʼа. Доступна для маршрутизації принаймні в межах кластера. Пусте, якщо ще не виділено.

- **podIPs** ([]PodIP)

  *Patch strategy: обʼєднання за ключем `ip`*

  *Map: унікальні значення ключа ip будуть збережені під час злиття*

  `podIPs` містить IP-адреси, виділені Podʼу. Якщо це поле задано, 0-й запис повинен відповідати полю `podIP`. Podʼам може бути виділено не більше одного значення для кожного з IPv4 та IPv6. Цей список пустий, якщо IP-адреси ще не виділено.

  <a name="PodIP"></a>
  *PodIP представляє одну IP-адресу, виділену Podʼу.*

  - **podIPs.ip** (string), обовʼязково

    IP — це IP-адреса, призначена Podʼу.

- **conditions** ([]PodCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Поточний стан обслуговування Podʼа. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions](/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions)

  <a name="PodCondition"></a>
  *PodCondition містить деталі поточного стану цього Podʼа.*

  - **conditions.status** (string), обовʼязково

    Статус стану. Може бути True, False, Unknown. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions](/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions)

  - **conditions.type** (string), обовʼязково

    Тип є типом стану. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions](/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions)

  - **conditions.lastProbeTime** (Time)

    Останній час, коли ми перевіряли стан.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.lastTransitionTime** (Time)

    Останній час, коли стан перейшов з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, що вказує на деталі останнього переходу.

  - **conditions.observedGeneration** (int64)

    Якщо встановлено, це означає .metadata.generation, на основі якого було встановлено стан podʼа. Для використання цього поля необхідно ввімкнути функціональну можливість PodObservedGenerationTracking.

  - **conditions.reason** (string)

    Унікальна, однослівна, у CamelCase причина останнього переходу умови.

- **qosClass** (string)

  Класифікація якості обслуговування (QOS), присвоєна Podʼу на основі вимог до ресурсів. Дивіться тип PodQOSClass для доступних класів QOS. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes](/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes)

  Можливі значення переліку (enum):
  - `"BestEffort"` клас qos BestEffort
  - `"Burstable"` клас qos Burstable
  - `"Guaranteed"` клас qos Guaranteed

- **initContainerStatuses** ([]ContainerStatus)

  *Atomic: буде замінено під час злиття*

  Статуси контейнерів init у цьому podʼі. Останній успішно запущений init-контейнер, який не можна перезапустити, матиме ready = true, останній запущений контейнер матиме startTime. Кожен init-контейнер у цьому podʼі повинен мати щонайбільше один статус у цьому списку, і всі статуси повинні бути для контейнерів у цьому podʼі. Однак це не є обовʼязковим. Якщо у списку присутній статус неіснуючого контейнера, або у списку є дублікати назв, поведінка різних компонентів Kubernetes не визначена і ці статуси можуть бути проігноровані. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status](/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status)

  <a name="ContainerStatus"></a>
  *ContainerStatus містить деталі поточного стану цього контейнера.*

  - **initContainerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources представляє обчислювальні ресурси, виділені для цього контейнера вузлом. Kubelet встановлює це значення у Container.Resources.Requests після успішного допуску podʼа та після успішного допуску бажаного масштабування podʼа.

  - **initContainerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: обʼєднання за ключем `type`*

    *Map: унікальні значення ключа type будуть збережені під час злиття*

    AllocatedResourcesStatus представляє статус різних ресурсів, виділених для цього podʼа.

    <a name="ResourceStatus"></a>
    *ResourceStatus представляє статус окремого ресурсу, призначеного для Pod.*

    - **initContainerStatuses.allocatedResourcesStatus.name** (string), обовʼязково

      Назва ресурсу. Повинна бути унікальною в межах podʼа і, у випадку не-DRA ресурсу, збігатися з одним з ресурсів зі специфікації pod. Для DRA-ресурсів значення має бути "claim:\<name_claim>/\<request>". Коли цей статус повідомляється для контейнера, "claim_name" і "request" повинні відповідати одній з вимог цього контейнера.

    - **initContainerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: унікальні значення ключа resourceID будуть збережені під час злиття*

      Список стану справності унікальних ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та його стан справності. Як мінімум, протягом усього життя Podʼа, ідентифікатор ресурсу повинен однозначно ідентифікувати ресурс, виділений для Podʼа на вузлі. Якщо інший Pod на тому ж вузлі повідомляє про стан з тим же ідентифікатором ресурсу, це має бути той самий ресурс, який вони спільно використовують. Дивіться визначення типу ResourceID, щоб дізнатися, який формат він має у різних випадках використання.

      <a name="ResourceHealth"></a>
      *ResourceHealth представляє стан справності ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP https://kep.k8s.io/4680.*

      - **initContainerStatuses.allocatedResourcesStatus.resources.resourceID** (string), обовʼязково

        ResourceID є унікальним ідентифікатором ресурсу. Дивіться тип ResourceID для отримання додаткової інформації.

      - **initContainerStatuses.allocatedResourcesStatus.resources.health** (string)

        Health ресурсу. Може бути одним з:
        - Healthy: працює нормально
        - Unhealthy: повідомлено про несправний стан. Ми вважаємо це тимчасовою проблемою зі справністю, оскільки наразі у нас немає механізму для розрізнення тимчасових і постійних проблем.
        - Unknown: статус не можна визначити. Наприклад, втулок пристрою було відключено і він не був повторно зареєстрований з того часу.

        В майбутньому ми можемо ввести статус PermanentlyUnhealthy.

  - **initContainerStatuses.containerID** (string)

    ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'. Де type є ідентифікатором середовища виконання контейнера, що повертається з виклику Version API CRI (наприклад, "containerd").

  - **initContainerStatuses.image** (string), обовʼязково

    Image є назвою образу контейнера з якого запущений у контейнері. Образ контейнера може не збігатися з образом, що використовується в PodSpec, оскільки він міг бути розвʼязаний середовищем виконання. Докладніше: [https://kubernetes.io/docs/concepts/containers/images](/docs/concepts/containers/images)

  - **initContainerStatuses.imageID** (string), обовʼязково

    ImageID є ідентифікатором образу контейнера. Ідентифікатор образу може не збігатися з ідентифікатором образу, що використовується в PodSpec, оскільки він міг бути розвʼязаний середовищем виконання.

  - **initContainerStatuses.lastState** (ContainerState)

    LastTerminationState містить останній стан завершення контейнера, щоб допомогти в налагодженні аварійних зупинок та перезапусків контейнера. Це поле не заповнюється, якщо контейнер все ще запущений і RestartCount дорівнює 0.

    <a name="ContainerState"></a>
    *ContainerState містить можливий стан контейнера. Може бути зазначено лише один з його членів. Якщо жоден з них не вказано, стандартно використовується ContainerStateWaiting.*

    - **initContainerStatuses.lastState.running** (ContainerStateRunning)

      Відомості про запущений контейнер

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning є станом контейнера, який запущений.*

      - **initContainerStatuses.lastState.running.startedAt** (Time)

        Час, коли контейнер був востаннє (пере)запущений.

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **initContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      Відомості про контейнер, який завершив свою роботу

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated є станом контейнера, який завершив свою роботу.*

      - **initContainerStatuses.lastState.terminated.containerID** (string)

        ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'.

      - **initContainerStatuses.lastState.terminated.exitCode** (int32), обовʼязково

        Код виходу з останнього завершення роботи контейнера

      - **initContainerStatuses.lastState.terminated.startedAt** (Time)

        Час, коли розпочалося попереднє виконання контейнера

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **initContainerStatuses.lastState.terminated.finishedAt** (Time)

        Час, коли контейнер востаннє завершив свою роботу

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **initContainerStatuses.lastState.terminated.message** (string)

        Повідомлення щодо останнього завершення роботи контейнера

      - **initContainerStatuses.lastState.terminated.reason** (string)

        (коротка) причина останнього завершення роботи контейнера

      - **initContainerStatuses.lastState.terminated.signal** (int32)

        Сигнал з останнього завершення роботи контейнера

    - **initContainerStatuses.lastState.waiting** (ContainerStateWaiting)

      Деталі про контейнер, що очікує

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting є станом контейнера, що очікує.*

      - **initContainerStatuses.lastState.waiting.message** (string)

        Повідомлення про причину, чому контейнер ще не запущений.

      - **initContainerStatuses.lastState.waiting.reason** (string)

        (коротка) причина, чому контейнер ще не запущений

  - **initContainerStatuses.name** (string), обовʼязково

    Name є DNS_LABEL, що представляє унікальну назву контейнера. Кожен контейнер в podʼі повинен мати унікальну назву серед усіх типів контейнерів. Не можна оновити.

  - **initContainerStatuses.ready** (boolean), обовʼязково

    Ready вказує, чи контейнер наразі проходить перевірку готовності. Значення змінюватиметься, оскільки перевірки готовності продовжують виконуватися. Якщо перевірки готовності не вказані, це поле стандартно буде true, як тільки контейнер буде повністю запущений (див. поле Started).

    Значення зазвичай використовується для визначення, чи контейнер готовий приймати трафік.

  - **initContainerStatuses.resources** (ResourceRequirements)

    Resources представляє запити та ліміти обчислювальних ресурсів, які були успішно застосовані до працюючого контейнера після його запуску або успішного масштабування.

    <a name="ResourceRequirements"></a>
    *ResourceRequirements описує вимоги до обчислювальних ресурсів.*

    - **initContainerStatuses.resources.claims** ([]ResourceClaim)

      *Map: унікальні значення ключа name будуть збережені під час злиття*

      Claims перелік назв ресурсів, визначених у spec.resourceClaims, які використовуються цим контейнером.

      Це поле залежить від функціональної можливості DynamicResourceAllocation.

      Це поле незмінне. Воно може бути встановлено лише для контейнерів.

      <a name="ResourceClaim"></a>
      *ResourceClaim посилається на один запис у PodSpec.ResourceClaims.*

      - **initContainerStatuses.resources.claims.name** (string), обовʼязково

        Name має відповідати назві одного запису в pod.spec.resourceClaims podʼа, де використовується це поле. Це робить ресурс доступним всередині контейнера.

      - **initContainerStatuses.resources.claims.request** (string)

        Request є назвою, обраною для запиту в зазначеній заявці. Якщо порожньо, всі ресурси з заявки стають доступними, інакше лише результат цього запиту.

    - **initContainerStatuses.resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Limits описує максимальну кількість дозволених обчислювальних ресурсів. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

    - **initContainerStatuses.resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Requests описує мінімальну кількість обчислювальних ресурсів, необхідних для контейнера. Якщо Requests не вказано для контейнера, воно стандартно дорівнює Limits, якщо вони явно вказані, інакше — значенню, визначеному реалізацією. Requests не може перевищувати Limits. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **initContainerStatuses.restartCount** (int32), обовʼязково

    RestartCount містить кількість разів, коли контейнер був перезапущений. Kubelet намагається завжди збільшувати це значення, але є випадки, коли стан може бути втрачено через перезавантаження вузла, і тоді значення може бути скинуто на 0. Значення ніколи не є відʼємним.

  - **initContainerStatuses.started** (boolean)

    Started вказує, чи контейнер завершив свій хук життєвого циклу postStart і пройшов перевірку запуску. Ініціалізується як false, стає true після того, як перевірка запуску вважається успішною. Скидається на false, коли контейнер перезапускається або якщо kubelet тимчасово втрачає стан. У обох випадках перевірки запуску будуть виконані знову. Завжди true, коли перевірка запуску не визначена і контейнер запущений та пройшов хук життєвого циклу postStart. Значення null слід трактувати так само, як false.

  - **initContainerStatuses.state** (ContainerState)

    State містить деталі про поточний стан контейнера.

    <a name="ContainerState"></a>
    *ContainerState містить можливий стан контейнера. Може бути зазначено лише один з його членів. Якщо жоден з них не вказано, стандартно використовується ContainerStateWaiting.*

    - **initContainerStatuses.state.running** (ContainerStateRunning)

      Деталі про запущений контейнер

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning є станом контейнера, який запущений.*

      - **initContainerStatuses.state.running.startedAt** (Time)

        Час, коли контейнер був востаннє (пере)запущений.

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **initContainerStatuses.state.terminated** (ContainerStateTerminated)

      Відомості про контейнер, який завершив свою роботу

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated є станом контейнера, який завершив свою роботу.*

      - **initContainerStatuses.state.terminated.containerID** (string)

        ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'.

      - **initContainerStatuses.state.terminated.exitCode** (int32), обовʼязково

        Код виходу з останнього завершення роботи контейнера

      - **initContainerStatuses.state.terminated.startedAt** (Time)

        Час, коли розпочалося попереднє виконання контейнера

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **initContainerStatuses.state.terminated.finishedAt** (Time)

        Час, коли контейнер востаннє завершив свою роботу

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **initContainerStatuses.state.terminated.message** (string)

        Повідомлення щодо останнього завершення роботи контейнера

      - **initContainerStatuses.state.terminated.reason** (string)

        (коротка) причина останнього завершення роботи контейнера

      - **initContainerStatuses.state.terminated.signal** (int32)

        Сигнал з останнього завершення роботи контейнера

    - **initContainerStatuses.state.waiting** (ContainerStateWaiting)

      Деталі про контейнер, що очікує

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting є станом контейнера, що очікує.*

      - **initContainerStatuses.state.waiting.message** (string)

        Повідомлення про причину, чому контейнер ще не запущений.

      - **initContainerStatuses.state.waiting.reason** (string)

        (коротка) причина, чому контейнер ще не запущений

  - **initContainerStatuses.stopSignal** (string)

    StopSignal повідомляє про фактичний сигнал зупинки для цього контейнера

    Можливі значення переліку (enum):
    - `"SIGABRT"`
    - `"SIGALRM"`
    - `"SIGBUS"`
    - `"SIGCHLD"`
    - `"SIGCLD"`
    - `"SIGCONT"`
    - `"SIGFPE"`
    - `"SIGHUP"`
    - `"SIGILL"`
    - `"SIGINT"`
    - `"SIGIO"`
    - `"SIGIOT"`
    - `"SIGKILL"`
    - `"SIGPIPE"`
    - `"SIGPOLL"`
    - `"SIGPROF"`
    - `"SIGPWR"`
    - `"SIGQUIT"`
    - `"SIGRTMAX"`
    - `"SIGRTMAX-1"`
    - `"SIGRTMAX-10"`
    - `"SIGRTMAX-11"`
    - `"SIGRTMAX-12"`
    - `"SIGRTMAX-13"`
    - `"SIGRTMAX-14"`
    - `"SIGRTMAX-2"`
    - `"SIGRTMAX-3"`
    - `"SIGRTMAX-4"`
    - `"SIGRTMAX-5"`
    - `"SIGRTMAX-6"`
    - `"SIGRTMAX-7"`
    - `"SIGRTMAX-8"`
    - `"SIGRTMAX-9"`
    - `"SIGRTMIN"`
    - `"SIGRTMIN+1"`
    - `"SIGRTMIN+10"`
    - `"SIGRTMIN+11"`
    - `"SIGRTMIN+12"`
    - `"SIGRTMIN+13"`
    - `"SIGRTMIN+14"`
    - `"SIGRTMIN+15"`
    - `"SIGRTMIN+2"`
    - `"SIGRTMIN+3"`
    - `"SIGRTMIN+4"`
    - `"SIGRTMIN+5"`
    - `"SIGRTMIN+6"`
    - `"SIGRTMIN+7"`
    - `"SIGRTMIN+8"`
    - `"SIGRTMIN+9"`
    - `"SIGSEGV"`
    - `"SIGSTKFLT"`
    - `"SIGSTOP"`
    - `"SIGSYS"`
    - `"SIGTERM"`
    - `"SIGTRAP"`
    - `"SIGTSTP"`
    - `"SIGTTIN"`
    - `"SIGTTOU"`
    - `"SIGURG"`
    - `"SIGUSR1"`
    - `"SIGUSR2"`
    - `"SIGVTALRM"`
    - `"SIGWINCH"`
    - `"SIGXCPU"`
    - `"SIGXFSZ"`

  - **initContainerStatuses.user** (ContainerUser)

    User представляє інформацію про ідентифікацію користувача, спочатку прикріплену до першого процесу контейнера

    <a name="ContainerUser"></a>
    *ContainerUser представляє інформацію про ідентифікацію користувача*

    - **initContainerStatuses.user.linux** (LinuxContainerUser)

      Linux містить інформацію про ідентифікацію користувача, спочатку прикріплену до першого процесу контейнерів у Linux. Зверніть увагу, що фактична ідентичність, яка виконується, може змінюватися, якщо процес має достатні привілеї для цього.

      <a name="LinuxContainerUser"></a>
      *LinuxContainerUser представляє інформацію про ідентифікацію користувача в контейнерах Linux*

      - **initContainerStatuses.user.linux.gid** (int64), обовʼязково

        GID є основним gid, спочатку прикріпленим до першого процесу в контейнері

      - **initContainerStatuses.user.linux.uid** (int64), обовʼязково

        UID є основним uid, спочатку прикріпленим до першого процесу в контейнері

      - **initContainerStatuses.user.linux.supplementalGroups** ([]int64)

        *Atomic: буде замінено під час злиття*

        SupplementalGroups є додатковими групами, спочатку прикріпленими до першого процесу в контейнері

  - **initContainerStatuses.volumeMounts** ([]VolumeMountStatus)

    *Patch strategy: обʼєднання за ключем `mountPath`*

    *Map: унікальні значення ключа mountPath будуть збережені під час злиття*

    Стан монтування томів.

    <a name="VolumeMountStatus"></a>
    *VolumeMountStatus показує стан монтування томів.*

    - **initContainerStatuses.volumeMounts.mountPath** (string), обовʼязково

      MountPath відповідає оригінальному VolumeMount.

    - **initContainerStatuses.volumeMounts.name** (string), обовʼязково

      Name відповідає назві оригінального VolumeMount.

    - **initContainerStatuses.volumeMounts.readOnly** (boolean)

      ReadOnly відповідає оригінальному VolumeMount.

    - **initContainerStatuses.volumeMounts.recursiveReadOnly** (string)

      RecursiveReadOnly має бути встановлено на Disabled, Enabled або unspecified (для монтувань відмінних "тільки для читання"). Значення IfPossible в оригінальному VolumeMount повинно бути перетворено на Disabled або Enabled, залежно від результату монтування.

- **containerStatuses** ([]ContainerStatus)

  *Atomic: буде замінено під час злиття*

  Статуси контейнерів у цьому podʼі. Кожен контейнер у цьому списку повинен мати щонайбільше один статус, і всі статуси повинні бути для контейнерів у цьому podʼі. Однак це не є обовʼязковим. Якщо у списку присутній статус неіснуючого контейнера, або у списку є дублікати назв, поведінка різних компонентів Kubernetes не визначена, і ці статуси можуть бути проігноровані. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status](/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status)

  <a name="ContainerStatus"></a>
  *ContainerStatus містить деталі поточного стану цього контейнера.*

  - **containerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources представляє обчислювальні ресурси, виділені для цього контейнера вузлом. Kubelet встановлює це значення у Container.Resources.Requests після успішного допуску podʼа та після успішного допуску бажаного масштабування podʼа.

  - **containerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: обʼєднання за ключем `name`*

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    AllocatedResourcesStatus представляє статус різних ресурсів, виділених для цього podʼа.

    <a name="ResourceStatus"></a>
    *ResourceStatus представляє статус окремого ресурсу, призначеного для Podʼа.*

    - **containerStatuses.allocatedResourcesStatus.name** (string), обовʼязково

      Назва ресурсу. Повинна бути унікальною в межах podʼа і, якщо це не DRA-ресурс, збігатися з одним із ресурсів зі специфікації podʼа. Для DRA-ресурсів значення має бути "claim:\<name_claim>/\<request>". Коли цей статус повідомляється для контейнера, "claim_name” і "request" повинні відповідати одній з заявок цього контейнера..

    - **containerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: унікальні значення ключа resourceID будуть збережені під час злиття*

      Список стану справності унікальних ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та його стан справності. Як мінімум, протягом усього життя Podʼа, ідентифікатор ресурсу повинен однозначно ідентифікувати ресурс, виділений для Podʼа на вузлі. Якщо інший Pod на тому ж вузлі повідомляє про стан з тим же ідентифікатором ресурсу, це має бути той самий ресурс, який вони спільно використовують. Дивіться визначення типу ResourceID, щоб дізнатися, який формат він має у різних випадках використання.

      <a name="ResourceHealth"></a>
      *ResourceHealth представляє стан справності ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP https://kep.k8s.io/4680.*

      - **containerStatuses.allocatedResourcesStatus.resources.resourceID** (string), обовʼязково

        ResourceID є унікальним ідентифікатором ресурсу. Дивіться тип ResourceID для отримання додаткової інформації.

      - **containerStatuses.allocatedResourcesStatus.resources.health** (string)

        Health ресурсу. Може бути одним з:
        - Healthy: працює нормально
        - Unhealthy: повідомлено про несправний стан. Ми вважаємо це тимчасовою проблемою зі справністю, оскільки наразі у нас немає механізму для розрізнення тимчасових і постійних проблем.
        - Unknown: статус не можна визначити. Наприклад, втулок пристрою було відключено і він не був повторно зареєстрований з того часу.

        В майбутньому ми можемо ввести статус PermanentlyUnhealthy.

  - **containerStatuses.containerID** (string)

    ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'. Де type є ідентифікатором середовища виконання контейнера, що повертається з виклику Version API CRI (наприклад, "containerd").

  - **containerStatuses.image** (string), обовʼязково

    Image є назвою образу контейнера з якого запущений у контейнері. Образ контейнера може не збігатися з образом, що використовується в PodSpec, оскільки він міг бути розвʼязаний середовищем виконання. Докладніше: [https://kubernetes.io/docs/concepts/containers/images](/docs/concepts/containers/images)

  - **containerStatuses.imageID** (string), обовʼязково

    ImageID є ідентифікатором образу контейнера. Ідентифікатор образу може не збігатися з ідентифікатором образу, що використовується в PodSpec, оскільки він міг бути розвʼязаний середовищем виконання.

  - **containerStatuses.lastState** (ContainerState)

    LastTerminationState містить останній стан завершення контейнера, щоб допомогти в налагодженні аварійних зупинок та перезапусків контейнера. Це поле не заповнюється, якщо контейнер все ще запущений і RestartCount дорівнює 0.

    <a name="ContainerState"></a>
    *ContainerState містить можливий стан контейнера. Може бути зазначено лише один з його членів. Якщо жоден з них не вказано, стандартно використовується ContainerStateWaiting.*

    - **containerStatuses.lastState.running** (ContainerStateRunning)

      Відомості про запущений контейнер

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning є станом контейнера, який запущений.*

      - **containerStatuses.lastState.running.startedAt** (Time)

        Час, коли контейнер був востаннє (пере)запущений.

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **containerStatuses.lastState.terminated** (ContainerStateTerminated)

      Відомості про контейнер, який завершив свою роботу

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated є станом контейнера, який завершив свою роботу.*

      - **containerStatuses.lastState.terminated.containerID** (string)

        ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'.

      - **containerStatuses.lastState.terminated.exitCode** (int32), обовʼязково

        Код виходу з останнього завершення роботи контейнера

      - **containerStatuses.lastState.terminated.startedAt** (Time)

        Час, коли розпочалося попереднє виконання контейнера

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **containerStatuses.lastState.terminated.finishedAt** (Time)

        Час, коли контейнер востаннє завершив свою роботу

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **containerStatuses.lastState.terminated.message** (string)

        Повідомлення щодо останнього завершення роботи контейнера

      - **containerStatuses.lastState.terminated.reason** (string)

        (коротка) причина останнього завершення роботи контейнера

      - **containerStatuses.lastState.terminated.signal** (int32)

        Сигнал з останнього завершення роботи контейнера

    - **containerStatuses.lastState.waiting** (ContainerStateWaiting)

      Деталі про контейнер, що очікує

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting є станом контейнера, що очікує.*

      - **containerStatuses.lastState.waiting.message** (string)

        Повідомлення про причину, чому контейнер ще не запущений.

      - **containerStatuses.lastState.waiting.reason** (string)

        (коротка) причина, чому контейнер ще не запущений

  - **containerStatuses.name** (string), обовʼязково

    Name є DNS_LABEL, що представляє унікальну назву контейнера. Кожен контейнер в podʼі повинен мати унікальну назву серед усіх типів контейнерів. Не можна оновити.

  - **containerStatuses.ready** (boolean), обовʼязково

    Ready вказує, чи контейнер наразі проходить перевірку готовності. Значення змінюватиметься, оскільки перевірки готовності продовжують виконуватися. Якщо перевірки готовності не вказані, це поле стандартно буде true, як тільки контейнер буде повністю запущений (див. поле Started).

    Значення зазвичай використовується для визначення, чи контейнер готовий приймати трафік.

  - **containerStatuses.resources** (ResourceRequirements)

    Resources представляє запити та ліміти обчислювальних ресурсів, які були успішно застосовані до працюючого контейнера після його запуску або успішного масштабування.

    <a name="ResourceRequirements"></a>
    *ResourceRequirements описує вимоги до обчислювальних ресурсів.*

    - **containerStatuses.resources.claims** ([]ResourceClaim)

      *Map: унікальні значення ключа name будуть збережені під час злиття*

      Claims перелік назв ресурсів, визначених у spec.resourceClaims, які використовуються цим контейнером.

      Це поле залежить від функціональної можливості DynamicResourceAllocation.

      Це поле незмінне. Воно може бути встановлено лише для контейнерів.

      <a name="ResourceClaim"></a>
      *ResourceClaim посилається на один запис у PodSpec.ResourceClaims.*

      - **containerStatuses.resources.claims.name** (string), обовʼязково

        Name має відповідати назві одного запису в pod.spec.resourceClaims podʼа, де використовується це поле. Це робить ресурс доступним всередині контейнера.

      - **containerStatuses.resources.claims.request** (string)

        Request є назвою, обраною для запиту в зазначеній заявці. Якщо порожньо, всі ресурси з заявки стають доступними, інакше лише результат цього запиту.

    - **containerStatuses.resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Limits описує максимальну кількість дозволених обчислювальних ресурсів. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

    - **containerStatuses.resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Requests описує мінімальну кількість обчислювальних ресурсів, необхідних для контейнера. Якщо Requests не вказано для контейнера, воно стандартно дорівнює Limits, якщо вони явно вказані, інакше — значенню, визначеному реалізацією. Requests не може перевищувати Limits. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **containerStatuses.restartCount** (int32), обовʼязково

    RestartCount містить кількість разів, коли контейнер був перезапущений. Kubelet намагається завжди збільшувати це значення, але є випадки, коли стан може бути втрачено через перезавантаження вузла, і тоді значення може бути скинуто на 0. Значення ніколи не є відʼємним.

  - **containerStatuses.started** (boolean)

    Started вказує, чи контейнер завершив свій хук життєвого циклу postStart і пройшов перевірку запуску. Ініціалізується як false, стає true після того, як перевірка запуску вважається успішною. Скидається на false, коли контейнер перезапускається або якщо kubelet тимчасово втрачає стан. У обох випадках перевірки запуску будуть виконані знову. Завжди true, коли перевірка запуску не визначена і контейнер запущений та пройшов хук життєвого циклу postStart. Значення null слід трактувати так само, як false.

  - **containerStatuses.state** (ContainerState)

    State містить деталі про поточний стан контейнера.

    <a name="ContainerState"></a>
    *ContainerState містить можливий стан контейнера. Може бути зазначено лише один з його членів. Якщо жоден з них не вказано, стандартно використовується ContainerStateWaiting.*

    - **containerStatuses.state.running** (ContainerStateRunning)

      Деталі про запущений контейнер

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning є станом контейнера, який запущений.*

      - **containerStatuses.state.running.startedAt** (Time)

        Час, коли контейнер був востаннє (пере)запущений.

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **containerStatuses.state.terminated** (ContainerStateTerminated)

      Відомості про контейнер, який завершив свою роботу

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated є станом контейнера, який завершив свою роботу.*

      - **containerStatuses.state.terminated.containerID** (string)

        ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'.

      - **containerStatuses.state.terminated.exitCode** (int32), обовʼязково

        Код виходу з останнього завершення роботи контейнера

      - **containerStatuses.state.terminated.startedAt** (Time)

        Час, коли розпочалося попереднє виконання контейнера

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **containerStatuses.state.terminated.finishedAt** (Time)

        Час, коли контейнер востаннє завершив свою роботу

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **containerStatuses.state.terminated.message** (string)

        Повідомлення щодо останнього завершення роботи контейнера

      - **containerStatuses.state.terminated.reason** (string)

        (коротка) причина останнього завершення роботи контейнера

      - **containerStatuses.state.terminated.signal** (int32)

        Сигнал з останнього завершення роботи контейнера

    - **containerStatuses.state.waiting** (ContainerStateWaiting)

      Деталі про контейнер, що очікує

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting є станом контейнера, що очікує.*

      - **containerStatuses.state.waiting.message** (string)

        Повідомлення про причину, чому контейнер ще не запущений.

      - **containerStatuses.state.waiting.reason** (string)

        (коротка) причина, чому контейнер ще не запущений

  - **containerStatuses.stopSignal** (string)

    StopSignal повідомляє про фактичний сигнал зупинки для цього контейнера

    Можливі значення переліку (enum):
    - `"SIGABRT"`
    - `"SIGALRM"`
    - `"SIGBUS"`
    - `"SIGCHLD"`
    - `"SIGCLD"`
    - `"SIGCONT"`
    - `"SIGFPE"`
    - `"SIGHUP"`
    - `"SIGILL"`
    - `"SIGINT"`
    - `"SIGIO"`
    - `"SIGIOT"`
    - `"SIGKILL"`
    - `"SIGPIPE"`
    - `"SIGPOLL"`
    - `"SIGPROF"`
    - `"SIGPWR"`
    - `"SIGQUIT"`
    - `"SIGRTMAX"`
    - `"SIGRTMAX-1"`
    - `"SIGRTMAX-10"`
    - `"SIGRTMAX-11"`
    - `"SIGRTMAX-12"`
    - `"SIGRTMAX-13"`
    - `"SIGRTMAX-14"`
    - `"SIGRTMAX-2"`
    - `"SIGRTMAX-3"`
    - `"SIGRTMAX-4"`
    - `"SIGRTMAX-5"`
    - `"SIGRTMAX-6"`
    - `"SIGRTMAX-7"`
    - `"SIGRTMAX-8"`
    - `"SIGRTMAX-9"`
    - `"SIGRTMIN"`
    - `"SIGRTMIN+1"`
    - `"SIGRTMIN+10"`
    - `"SIGRTMIN+11"`
    - `"SIGRTMIN+12"`
    - `"SIGRTMIN+13"`
    - `"SIGRTMIN+14"`
    - `"SIGRTMIN+15"`
    - `"SIGRTMIN+2"`
    - `"SIGRTMIN+3"`
    - `"SIGRTMIN+4"`
    - `"SIGRTMIN+5"`
    - `"SIGRTMIN+6"`
    - `"SIGRTMIN+7"`
    - `"SIGRTMIN+8"`
    - `"SIGRTMIN+9"`
    - `"SIGSEGV"`
    - `"SIGSTKFLT"`
    - `"SIGSTOP"`
    - `"SIGSYS"`
    - `"SIGTERM"`
    - `"SIGTRAP"`
    - `"SIGTSTP"`
    - `"SIGTTIN"`
    - `"SIGTTOU"`
    - `"SIGURG"`
    - `"SIGUSR1"`
    - `"SIGUSR2"`
    - `"SIGVTALRM"`
    - `"SIGWINCH"`
    - `"SIGXCPU"`
    - `"SIGXFSZ"`

  - **containerStatuses.user** (ContainerUser)

    User представляє інформацію про ідентифікацію користувача, спочатку прикріплену до першого процесу контейнера

    <a name="ContainerUser"></a>
    *ContainerUser представляє інформацію про ідентифікацію користувача*

    - **containerStatuses.user.linux** (LinuxContainerUser)

      Linux містить інформацію про ідентифікацію користувача, спочатку прикріплену до першого процесу контейнерів у Linux. Зверніть увагу, що фактична ідентичність, яка виконується, може змінюватися, якщо процес має достатні привілеї для цього.

      <a name="LinuxContainerUser"></a>
      *LinuxContainerUser представляє інформацію про ідентифікацію користувача в контейнерах Linux*

      - **containerStatuses.user.linux.gid** (int64), обовʼязково

        GID є основним gid, спочатку прикріпленим до першого процесу в контейнері

      - **containerStatuses.user.linux.uid** (int64), обовʼязково

        UID є основним uid, спочатку прикріпленим до першого процесу в контейнері

      - **containerStatuses.user.linux.supplementalGroups** ([]int64)

        *Atomic: буде замінено під час злиття*

        SupplementalGroups є додатковими групами, спочатку прикріпленими до першого процесу в контейнері

  - **containerStatuses.volumeMounts** ([]VolumeMountStatus)

    *Patch strategy: обʼєднання за ключем `mountPath`*

    *Map: унікальні значення ключа mountPath будуть збережені під час злиття*

    Стан монтування томів.

    <a name="VolumeMountStatus"></a>
    *VolumeMountStatus показує стан монтування томів.*

    - **containerStatuses.volumeMounts.mountPath** (string), обовʼязково

      MountPath відповідає оригінальному VolumeMount.

    - **containerStatuses.volumeMounts.name** (string), обовʼязково

      Name відповідає назві оригінального VolumeMount.

    - **containerStatuses.volumeMounts.readOnly** (boolean)

      ReadOnly відповідає оригінальному VolumeMount.

    - **containerStatuses.volumeMounts.recursiveReadOnly** (string)

      RecursiveReadOnly має бути встановлено на Disabled, Enabled або unspecified (для монтувань відмінних "тільки для читання"). Значення IfPossible в оригінальному VolumeMount повинно бути перетворено на Disabled або Enabled, залежно від результату монтування.

- **ephemeralContainerStatuses** ([]ContainerStatus)

  *Atomic: буде замінено під час злиття*

  Статуси для всіх ефемерних контейнерів, які були запущені в цьому podʼі. Кожен ефемерний контейнер у podʼі повинен мати щонайбільше один статус у цьому списку, і всі статуси повинні бути для контейнерів у podʼі. Однак це не є обовʼязковим. Якщо у списку присутній статус неіснуючого контейнера, або у списку є дублікати назв, поведінка різних компонентів Kubernetes не визначена, і ці статуси можуть бути проігноровані. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status](/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status)

  <a name="ContainerStatus"></a>
  *ContainerStatus містить деталі поточного стану цього контейнера.*

  - **ephemeralContainerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources представляє обчислювальні ресурси, виділені для цього контейнера вузлом. Kubelet встановлює це значення у Container.Resources.Requests після успішного допуску podʼа та після успішного допуску бажаного масштабування podʼа.

  - **ephemeralContainerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: обʼєднання за ключем `name`*

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    AllocatedResourcesStatus представляє статус різних ресурсів, виділених для цього podʼа.

    <a name="ResourceStatus"></a>
    *ResourceStatus представляє статус окремого ресурсу, призначеного для Podʼа.*

    - **ephemeralContainerStatuses.allocatedResourcesStatus.name** (string), обовʼязково

      Назва ресурсу. Повинна бути унікальною в межах podʼа і, у випадку не-DRA ресурсу, збігатися з одним з ресурсів зі специфікації pod. Для DRA-ресурсів значення має бути "claim:\<name_claim>/\<request>". Коли цей статус повідомляється для контейнера, "claim_name" і "request" повинні відповідати одній з вимог цього контейнера.

    - **ephemeralContainerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: унікальні значення ключа resourceID будуть збережені під час злиття*

      Список стану справності унікальних ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та його стан справності. Як мінімум, протягом усього життя Podʼа, ідентифікатор ресурсу повинен однозначно ідентифікувати ресурс, виділений для Podʼа на вузлі. Якщо інший Pod на тому ж вузлі повідомляє про стан з тим же ідентифікатором ресурсу, це має бути той самий ресурс, який вони спільно використовують. Дивіться визначення типу ResourceID, щоб дізнатися, який формат він має у різних випадках використання.

      <a name="ResourceHealth"></a>
      *ResourceHealth представляє стан справності ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP https://kep.k8s.io/4680.*

      - **ephemeralContainerStatuses.allocatedResourcesStatus.resources.resourceID** (string), обовʼязково

        ResourceID є унікальним ідентифікатором ресурсу. Дивіться тип ResourceID для отримання додаткової інформації.

      - **ephemeralContainerStatuses.allocatedResourcesStatus.resources.health** (string)

        Health ресурсу. Може бути одним з:
        - Healthy: працює нормально
        - Unhealthy: повідомлено про несправний стан. Ми вважаємо це тимчасовою проблемою зі справністю, оскільки наразі у нас немає механізму для розрізнення тимчасових і постійних проблем.
        - Unknown: статус не можна визначити. Наприклад, втулок пристрою було відключено і він не був повторно зареєстрований з того часу.

        В майбутньому ми можемо ввести статус PermanentlyUnhealthy.

  - **ephemeralContainerStatuses.containerID** (string)

    ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'. Де type є ідентифікатором середовища виконання контейнера, що повертається з виклику Version API CRI (наприклад, "containerd").

  - **ephemeralContainerStatuses.image** (string), обовʼязково

    Image є назвою образу контейнера з якого запущений у контейнері. Образ контейнера може не збігатися з образом, що використовується в PodSpec, оскільки він міг бути розвʼязаний середовищем виконання. Докладніше: [https://kubernetes.io/docs/concepts/containers/images](/docs/concepts/containers/images)

  - **ephemeralContainerStatuses.imageID** (string), обовʼязково

    ImageID є ідентифікатором образу контейнера. Ідентифікатор образу може не збігатися з ідентифікатором образу, що використовується в PodSpec, оскільки він міг бути розвʼязаний середовищем виконання.

  - **ephemeralContainerStatuses.lastState** (ContainerState)

    LastTerminationState містить останній стан завершення контейнера, щоб допомогти в налагодженні аварійних зупинок та перезапусків контейнера. Це поле не заповнюється, якщо контейнер все ще запущений і RestartCount дорівнює 0.

    <a name="ContainerState"></a>
    *ContainerState містить можливий стан контейнера. Може бути зазначено лише один з його членів. Якщо жоден з них не вказано, стандартно використовується ContainerStateWaiting.*

    - **ephemeralContainerStatuses.lastState.running** (ContainerStateRunning)

      Відомості про запущений контейнер

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning є станом контейнера, який запущений.*

      - **ephemeralContainerStatuses.lastState.running.startedAt** (Time)

        Час, коли контейнер був востаннє (пере)запущений.

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **ephemeralContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      Відомості про контейнер, який завершив свою роботу

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated є станом контейнера, який завершив свою роботу.*

      - **ephemeralContainerStatuses.lastState.terminated.containerID** (string)

        ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'.

      - **ephemeralContainerStatuses.lastState.terminated.exitCode** (int32), обовʼязково

        Код виходу з останнього завершення роботи контейнера

      - **ephemeralContainerStatuses.lastState.terminated.startedAt** (Time)

        Час, коли розпочалося попереднє виконання контейнера

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **ephemeralContainerStatuses.lastState.terminated.finishedAt** (Time)

        Час, коли контейнер востаннє завершив свою роботу

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **ephemeralContainerStatuses.lastState.terminated.message** (string)

        Повідомлення щодо останнього завершення роботи контейнера

      - **ephemeralContainerStatuses.lastState.terminated.reason** (string)

        (коротка) причина останнього завершення роботи контейнера

      - **ephemeralContainerStatuses.lastState.terminated.signal** (int32)

        Сигнал з останнього завершення роботи контейнера

    - **ephemeralContainerStatuses.lastState.waiting** (ContainerStateWaiting)

      Деталі про контейнер, що очікує

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting є станом контейнера, що очікує.*

      - **ephemeralContainerStatuses.lastState.waiting.message** (string)

        Повідомлення про причину, чому контейнер ще не запущений.

      - **ephemeralContainerStatuses.lastState.waiting.reason** (string)

        (коротка) причина, чому контейнер ще не запущений

  - **ephemeralContainerStatuses.name** (string), обовʼязково

    Name є DNS_LABEL, що представляє унікальну назву контейнера. Кожен контейнер в podʼі повинен мати унікальну назву серед усіх типів контейнерів. Не можна оновити.

  - **ephemeralContainerStatuses.ready** (boolean), обовʼязково

    Ready вказує, чи контейнер наразі проходить перевірку готовності. Значення змінюватиметься, оскільки перевірки готовності продовжують виконуватися. Якщо перевірки готовності не вказані, це поле стандартно буде true, як тільки контейнер буде повністю запущений (див. поле Started).

    Значення зазвичай використовується для визначення, чи контейнер готовий приймати трафік.

  - **ephemeralContainerStatuses.resources** (ResourceRequirements)

    Resources представляє запити та ліміти обчислювальних ресурсів, які були успішно застосовані до працюючого контейнера після його запуску або успішного масштабування.

    <a name="ResourceRequirements"></a>
    *ResourceRequirements описує вимоги до обчислювальних ресурсів.*

    - **ephemeralContainerStatuses.resources.claims** ([]ResourceClaim)

      *Map: унікальні значення ключа name будуть збережені під час злиття*

      Claims перелік назв ресурсів, визначених у spec.resourceClaims, які використовуються цим контейнером.

      Це поле залежить від функціональної можливості DynamicResourceAllocation.

      Це поле незмінне. Воно може бути встановлено лише для контейнерів.

      <a name="ResourceClaim"></a>
      *ResourceClaim посилається на один запис у PodSpec.ResourceClaims.*

      - **ephemeralContainerStatuses.resources.claims.name** (string), обовʼязково

        Name має відповідати назві одного запису в pod.spec.resourceClaims podʼа, де використовується це поле. Це робить ресурс доступним всередині контейнера.

      - **ephemeralContainerStatuses.resources.claims.request** (string)

        Request є назвою, обраною для запиту в зазначеній заявці. Якщо порожньо, всі ресурси з заявки стають доступними, інакше лише результат цього запиту.

    - **ephemeralContainerStatuses.resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Limits описує максимальну кількість дозволених обчислювальних ресурсів. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

    - **ephemeralContainerStatuses.resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Requests описує мінімальну кількість обчислювальних ресурсів, необхідних для контейнера. Якщо Requests не вказано для контейнера, воно стандартно дорівнює Limits, якщо вони явно вказані, інакше — значенню, визначеному реалізацією. Requests не може перевищувати Limits. Докладніше: [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](/docs/concepts/configuration/manage-resources-containers/)

  - **ephemeralContainerStatuses.restartCount** (int32), обовʼязково

    RestartCount містить кількість разів, коли контейнер був перезапущений. Kubelet намагається завжди збільшувати це значення, але є випадки, коли стан може бути втрачено через перезавантаження вузла, і тоді значення може бути скинуто на 0. Значення ніколи не є відʼємним.

  - **ephemeralContainerStatuses.started** (boolean)

    Started вказує, чи контейнер завершив свій хук життєвого циклу postStart і пройшов перевірку запуску. Ініціалізується як false, стає true після того, як перевірка запуску вважається успішною. Скидається на false, коли контейнер перезапускається або якщо kubelet тимчасово втрачає стан. У обох випадках перевірки запуску будуть виконані знову. Завжди true, коли перевірка запуску не визначена і контейнер запущений та пройшов хук життєвого циклу postStart. Значення null слід трактувати так само, як false.

  - **ephemeralContainerStatuses.state** (ContainerState)

    State містить деталі про поточний стан контейнера.

    <a name="ContainerState"></a>
    *ContainerState містить можливий стан контейнера. Може бути зазначено лише один з його членів. Якщо жоден з них не вказано, стандартно використовується ContainerStateWaiting.*

    - **ephemeralContainerStatuses.state.running** (ContainerStateRunning)

      Деталі про запущений контейнер

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning є станом контейнера, який запущений.*

      - **ephemeralContainerStatuses.state.running.startedAt** (Time)

        Час, коли контейнер був востаннє (пере)запущений.

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

    - **ephemeralContainerStatuses.state.terminated** (ContainerStateTerminated)

      Відомості про контейнер, який завершив свою роботу

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated є станом контейнера, який завершив свою роботу.*

      - **ephemeralContainerStatuses.state.terminated.containerID** (string)

        ContainerID є ідентифікатором контейнера у форматі '\<type>://\<container_id>'.

      - **ephemeralContainerStatuses.state.terminated.exitCode** (int32), обовʼязково

        Код виходу з останнього завершення роботи контейнера

      - **ephemeralContainerStatuses.state.terminated.startedAt** (Time)

        Час, коли розпочалося попереднє виконання контейнера

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **ephemeralContainerStatuses.state.terminated.finishedAt** (Time)

        Час, коли контейнер востаннє завершив свою роботу

        <a name="Time"></a>
        *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

      - **ephemeralContainerStatuses.state.terminated.message** (string)

        Повідомлення щодо останнього завершення роботи контейнера

      - **ephemeralContainerStatuses.state.terminated.reason** (string)

        (коротка) причина останнього завершення роботи контейнера

      - **ephemeralContainerStatuses.state.terminated.signal** (int32)

        Сигнал з останнього завершення роботи контейнера

    - **ephemeralContainerStatuses.state.waiting** (ContainerStateWaiting)

      Деталі про контейнер, що очікує

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting є станом контейнера, що очікує.*

      - **ephemeralContainerStatuses.state.waiting.message** (string)

        Повідомлення про причину, чому контейнер ще не запущений.

      - **ephemeralContainerStatuses.state.waiting.reason** (string)

        (коротка) причина, чому контейнер ще не запущений

  - **ephemeralContainerStatuses.stopSignal** (string)

    StopSignal повідомляє про фактичний сигнал зупинки для цього контейнера

    Можливі значення переліку (enum):
    - `"SIGABRT"`
    - `"SIGALRM"`
    - `"SIGBUS"`
    - `"SIGCHLD"`
    - `"SIGCLD"`
    - `"SIGCONT"`
    - `"SIGFPE"`
    - `"SIGHUP"`
    - `"SIGILL"`
    - `"SIGINT"`
    - `"SIGIO"`
    - `"SIGIOT"`
    - `"SIGKILL"`
    - `"SIGPIPE"`
    - `"SIGPOLL"`
    - `"SIGPROF"`
    - `"SIGPWR"`
    - `"SIGQUIT"`
    - `"SIGRTMAX"`
    - `"SIGRTMAX-1"`
    - `"SIGRTMAX-10"`
    - `"SIGRTMAX-11"`
    - `"SIGRTMAX-12"`
    - `"SIGRTMAX-13"`
    - `"SIGRTMAX-14"`
    - `"SIGRTMAX-2"`
    - `"SIGRTMAX-3"`
    - `"SIGRTMAX-4"`
    - `"SIGRTMAX-5"`
    - `"SIGRTMAX-6"`
    - `"SIGRTMAX-7"`
    - `"SIGRTMAX-8"`
    - `"SIGRTMAX-9"`
    - `"SIGRTMIN"`
    - `"SIGRTMIN+1"`
    - `"SIGRTMIN+10"`
    - `"SIGRTMIN+11"`
    - `"SIGRTMIN+12"`
    - `"SIGRTMIN+13"`
    - `"SIGRTMIN+14"`
    - `"SIGRTMIN+15"`
    - `"SIGRTMIN+2"`
    - `"SIGRTMIN+3"`
    - `"SIGRTMIN+4"`
    - `"SIGRTMIN+5"`
    - `"SIGRTMIN+6"`
    - `"SIGRTMIN+7"`
    - `"SIGRTMIN+8"`
    - `"SIGRTMIN+9"`
    - `"SIGSEGV"`
    - `"SIGSTKFLT"`
    - `"SIGSTOP"`
    - `"SIGSYS"`
    - `"SIGTERM"`
    - `"SIGTRAP"`
    - `"SIGTSTP"`
    - `"SIGTTIN"`
    - `"SIGTTOU"`
    - `"SIGURG"`
    - `"SIGUSR1"`
    - `"SIGUSR2"`
    - `"SIGVTALRM"`
    - `"SIGWINCH"`
    - `"SIGXCPU"`
    - `"SIGXFSZ"`

  - **ephemeralContainerStatuses.user** (ContainerUser)

    User представляє інформацію про ідентифікацію користувача, спочатку прикріплену до першого процесу контейнера

    <a name="ContainerUser"></a>
    *ContainerUser представляє інформацію про ідентифікацію користувача*

    - **ephemeralContainerStatuses.user.linux** (LinuxContainerUser)

      Linux містить інформацію про ідентифікацію користувача, спочатку прикріплену до першого процесу контейнерів у Linux. Зверніть увагу, що фактична ідентичність, яка виконується, може змінюватися, якщо процес має достатні привілеї для цього.

      <a name="LinuxContainerUser"></a>
      *LinuxContainerUser представляє інформацію про ідентифікацію користувача в контейнерах Linux*

      - **ephemeralContainerStatuses.user.linux.gid** (int64), обовʼязково

        GID є основним gid, спочатку прикріпленим до першого процесу в контейнері

      - **ephemeralContainerStatuses.user.linux.uid** (int64), обовʼязково

        UID є основним uid, спочатку прикріпленим до першого процесу в контейнері

      - **ephemeralContainerStatuses.user.linux.supplementalGroups** ([]int64)

        *Atomic: буде замінено під час злиття*

        SupplementalGroups є додатковими групами, спочатку прикріпленими до першого процесу в контейнері

  - **ephemeralContainerStatuses.volumeMounts** ([]VolumeMountStatus)

    *Patch strategy: обʼєднання за ключем `mountPath`*

    *Map: унікальні значення ключа mountPath будуть збережені під час злиття*

    Стан монтування томів.

    <a name="VolumeMountStatus"></a>
    *VolumeMountStatus показує стан монтування томів.*

    - **ephemeralContainerStatuses.volumeMounts.mountPath** (string), обовʼязково

      MountPath відповідає оригінальному VolumeMount.

    - **ephemeralContainerStatuses.volumeMounts.name** (string), обовʼязково

      Name відповідає назві оригінального VolumeMount.

    - **ephemeralContainerStatuses.volumeMounts.readOnly** (boolean)

      ReadOnly відповідає оригінальному VolumeMount.

    - **ephemeralContainerStatuses.volumeMounts.recursiveReadOnly** (string)

      RecursiveReadOnly має бути встановлено на Disabled, Enabled або unspecified (для монтувань відмінних "тільки для читання"). Значення IfPossible в оригінальному VolumeMount повинно бути перетворено на Disabled або Enabled, залежно від результату монтування.

- **resourceClaimStatuses** ([]PodResourceClaimStatus)

  *Patch strategies: retainKeys, обʼєднання по ключу `name`*

  *Map: унікальні значення по ключу name будуть збережені під час обʼєднання*

  Статус ресурсних заявок.

  <a name="PodResourceClaimStatus"></a>
  *PodResourceClaimStatus зберігається у PodStatus для кожної PodResourceClaim, яка посилається на ResourceClaimTemplate. Він зберігає згенеровану назву для відповідної ResourceClaim.*

  - **resourceClaimStatuses.name** (string), обовʼязково

    Імʼя унікально ідентифікує цю ресурсну заявку всередині Podʼа. Воно має відповідати імені в pod.spec.resourceClaims, що означає, що рядок повинен бути DNS_LABEL.

  - **resourceClaimStatuses.resourceClaimName** (string)

    ResourceClaimName є назвою ResourceClaim, яка була згенерована для podʼа в просторі імен podʼа. Якщо це поле не встановлено, то створення ResourceClaim не було необхідним. У цьому випадку запис pod.spec.resourceClaims можна ігнорувати.

- **extendedResourceClaimStatus** (PodExtendedResourceClaimStatus)

  Статус розширеної заявки на ресурси, підтриманої DRA.

  <a name="PodExtendedResourceClaimStatus"></a>
  *PodExtendedResourceClaimStatus зберігається в PodStatus для розширених запитів на ресурси, що підтримуються DRA. Він зберігає згенероване імʼя для відповідного спеціального ResourceClaim, створеного планувальником.*

  - **extendedResourceClaimStatus.requestMappings** ([]ContainerExtendedResourceRequest), обовʼязково

    *Atomic: буде замінено під час злиття*

    RequestMappings визначає відповідність між \<контейнером, розширеним ресурсом, що підтримується DRA> та  запитом пристрою у згенерованому ResourceClaim.

    <a name="ContainerExtendedResourceRequest"></a>
    *ContainerExtendedResourceRequest має відповідність імені контейнера, імені розширеного ресурсу та імені запиту пристрою.*

    - **extendedResourceClaimStatus.requestMappings.containerName** (string), обовʼязково

      Імʼя контейнера, що запитує ресурси.

    - **extendedResourceClaimStatus.requestMappings.requestName** (string), обовʼзково

      Імʼя запиту в спеціальному ResourceClaim, що відповідає розширеному ресурсу.

    - **extendedResourceClaimStatus.requestMappings.resourceName** (string), обовʼязково

      Імʼя розширеного ресурсу в цьому контейнері, який підтримується DRA.

  - **extendedResourceClaimStatus.resourceClaimName** (string), обовʼязково

    ResourceClaimName — це імʼя ResourceClaim, яке було згенеровано для Podʼа в просторі імен Podʼа.

- **resize** (string)

  Статус бажаної зміни розміру ресурсів для контейнерів Podʼа. Він порожній, якщо немає очікуваної зміни розміру ресурсів. Будь-які зміни в ресурсах контейнера автоматично встановлять це на "Proposed". Застарілий: Статус зміни розміру переміщено до двох станів podʼів PodResizePending та PodResizeInProgress. PodResizePending відстежуватиме стани, у яких специфікацію було змінено, але Kubelet ще не виділив ресурси. PodResizeInProgress відстежує поточні зміни розмірів і має бути присутнім, коли виділені ресурси != підтверджені ресурси.

- **allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  AllocatedResources — це загальна кількість запитів, виділених для цього podʼа вузлом. Якщо запити на рівні podʼа не встановлені, це буде загальна кількість запитів, агрегованих по контейнерах у podʼі.

- **resources** (ResourceRequirements)

  Resources представляє запити на обчислювальні ресурси та обмеження, які були застосовані на рівні podʼа, якщо запити або обмеження на рівні podʼа встановлені в PodSpec.Resources.

  <a name="ResourceRequirements"></a>
  *ResourceRequirements описує вимоги до обчислювальних ресурсів.*

  - **resources.claims** ([]ResourceClaim)

    *Map: унікальні значення імені ключа будуть збережені під час злиття*

    Claims перелічує імена ресурсів, визначених у spec.resourceClaims, які використовуються цим контейнером.

    Це поле залежить від функції DynamicResourceAllocation.

    Це поле є незмінним. Воно може бути встановлене тільки для контейнерів.

    <a name="ResourceClaim"></a>
    *ResourceClaim посилається на один запис у PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), обовʼязково

      Name має відповідати імені одного запису в pod.spec.resourceClaims Podʼа, де використовується це поле. Це робить цей ресурс доступним всередині контейнера.

    - **resources.claims.request** (string)

      Request — це назва, обрана для запиту у відповідній вимозі. Якщо поле порожнє, доступні всі дані з вимоги, в іншому випадку — тільки результат цього запиту.

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits описує максимальну кількість дозволених обчислювальних ресурсів. Більше інформації: <a href="/uk/docs/concepts/configuration/manage-resources-containers/">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a>

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests описує мінімальну кількість необхідних обчислювальних ресурсів. Якщо Requests пропущено для контейнера, використовується значення Limits, якщо воно явно вказано, інакше — значення, визначене реалізацією. Requests не може перевищувати Limits. Додаткова інформація: <a href="/uk/docs/concepts/configuration/manage-resources-containers/">https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/</a>

- **observedGeneration** (int64)

  Якщо встановлено, це поле представляє .metadata.generation, на основі якого було визначено статус pod. Увімкніть PodObservedGenerationTracking, щоб мати змогу використовувати це поле.

## PodList {#PodList}

PodList — це список Podʼів.

---

- **items** ([]<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>), обовʼязково

  Список Podʼів. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md

- **apiVersion** (string)

  APIVersion визначає версію схеми цього подання обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind — це рядкове значення, яке представляє REST-ресурс, який представляє цей обʼєкт. Сервери можуть вивести це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

## Операції {#Operations}

---

### `get` отримати вказаний Pod {#get-read-the-specified-pod}

#### HTTP запит {#http-request}

GET /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `get` отримати ефемерні контейнери вказаного Podʼа {#get-read-ephemeral-containers-of-the-specified-pod}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `get` отримати лог вказаного Podʼа {#get-read-the-log-of-the-specified-pod}

#### HTTP запит {#http-request-2}

GET /api/v1/namespaces/{namespace}/pods/{name}/log

#### Параметри {#parameters-2}

- **name** (*в шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **container** (*в запиті*): string

  Контейнер, для якого потрібно виводити логи. Стандартно виводяться тільки логи контейнера, якщо в Podʼі є тільки один контейнер.

- **follow** (*в запиті*): boolean

  Слідкувати за потоком логу Podʼа. Стандартне значення — false.

- **insecureSkipTLSVerifyBackend** (*в запиті*): boolean

  insecureSkipTLSVerifyBackend вказує, що apiserver не повинен підтверджувати дійсність сертифікату обслуговуючого програмного забезпечення, з яким він зʼєднується. Це зробить HTTPS-зʼєднання між apiserver та обслуговуючим програмним забезпеченням ненадійним. Це означає, що apiserver не може підтвердити, що дані логу, які він отримує, отримано від реального kubelet. Якщо kubelet налаштований для підтвердження уповноваження TLS apiserver, це не означає, що зʼєднання з реальним kubelet вразливе до атаки посередника (наприклад, зловмисник не зможе перехопити фактичні дані логу, що надходять від реального kubelet).

- **limitBytes** (*в запиті*): integer

  Якщо задано, кількість байтів, які слід прочитати з сервера, перш ніж завершити виведення логу. Це може не показувати повністю останню лінію логу, і може повернути трохи більше або трохи менше, ніж вказаний обмежувач.

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **previous** (*в запиті*): boolean

  Повертати логи попередньо завершених контейнерів. Стандартне значення — false.

- **sinceSeconds** (*в запиті*): integer

  Відносний час у секундах до поточного часу, з якого показувати логи. Якщо це значення передує часу запуску Podʼа, будуть повернуті лише логи з часу запуску Podʼа. Якщо це значення в майбутньому, жодних логів не буде повернено. Можна вказати тільки один з sinceSeconds або sinceTime.

- **stream** (*в запиті*): string

  Вказує, який потік журналу контейнера повертати клієнту. Допустимими значеннями є "All", "Stdout" і "Stderr". Якщо не вказано, буде використано значення "All", а stdout і stderr будуть повертатися по черзі. Зауважте, що коли вказано "TailLines", "Stream" може бути встановлено лише у nil або "All".

- **tailLines** (*в запиті*): integer

  Якщо задано, кількість рядків з кінця логу, які слід показати. Якщо не вказано, логи показуються з моменту створення контейнера, або відносно sinceSeconds або sinceTime. Зауважте, що коли вказано "TailLines", "Stream" може бути встановлено лише у nil або "All".

- **timestamps** (*в запиті*): boolean

  Якщо true, додаємо часову мітку RFC3339 або RFC3339Nano на початок кожного рядка виводу логу. Стандартне значення — false.

#### Відповідь {#response-2}

200 (string): OK

401: Unauthorized

### `get` отримати зміну розміру вказаного Pod {#get-read-resize-of-the-specified-pod}

#### HTTP запит {#http-request-3}

GET /api/v1/namespaces/{namespace}/pods/{name}/resize

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя Pod

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `get` отримати статус вказаного Podʼа {#get-read-the-status-of-the-specified-pod}

#### HTTP запит {#http-request-4}

GET /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Pod {#list-list-or-watch-objects-of-kind-pod}

#### HTTP запит {#http-request-5}

GET /api/v1/namespaces/{namespace}/pods

#### Параметри {#parameters-5}

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

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Pod {#list-list-or-watch-objects-of-kind-pod-1}

#### HTTP запит {#http-request-6}

GET /api/v1/pods

#### Параметри {#parameters-6}

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

### `create` створення Podʼа {#create-create-pod}

#### HTTP запит {#http-request-7}

POST /api/v1/namespaces/{namespace}/pods

#### Параметри {#parameters-7}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Podʼа {#update-replace-the-specified-pod}

#### HTTP запит {#http-request-8}

PUT /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `update` заміна ephemeralcontainers вказаного Podʼа {#update-replace-the-ephemeralcontainers-of-the-specified-pod}

#### HTTP запит {#http-request-9}

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `update` заміна розміру вказаного Podʼа {#update-replace-resize-of-the-specified-pod}

#### HTTP запит {#http-request-10}

PUT /api/v1/namespaces/{namespace}/pods/{name}/resize

#### Параметри {#parameters-10}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Podʼа {#patch-partially-update-the-specified-pod}

#### HTTP запит {#http-request-11}

PATCH /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters-11}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

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

#### Відповідь {#response-11}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `patch` часткове оновлення ephemeralcontainers вказаного Podʼа {#patch-partially-update-ephemeralcontainers-of-the-specified-pod}

#### HTTP запит {#http-request-12}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри {#parameters-12}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

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

#### Відповідь {#response-12}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `patch` часткове оновлення зміни розміру вказаного Podʼа {#patch-partially-update-resize-of-the-specified-pod}

#### HTTP запит {#http-request-13}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/resize

#### Параметри {#parameters-13}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

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

#### Відповідь {#response-13}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `delete` видалення Pod {#delete-delete-pod}

#### HTTP запит {#http-request-14}

DELETE /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters-14}

- **name** (*в шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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

#### Відповідь {#response-14}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Podʼів {#deletecollection-delete-collection-of-pod}

#### HTTP запит {#http-request-15}

DELETE /api/v1/namespaces/{namespace}/pods

#### Параметри {#parameters-15}

- **namespace** (*в шляху*): string, обовʼязково

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

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-15}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
