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

  *Patch strategy: злиття за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список контейнерів, що належать Podʼу. Зараз контейнери не можуть бути додані або видалені. В Podʼі повинен бути принаймні один контейнер. Не може бути оновлено.

- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  *Patch strategy: злиття за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список контейнерів ініціалізації, що належать Podʼу. Контейнери ініціалізації виконуються у визначеному порядку перед запуском звичайних контейнерів. Якщо будь-який контейнер ініціалізації зазнає збою, Pod вважається збійним та обробляється відповідно до restartPolicy. Імʼя контейнера ініціалізації або звичайного контейнера повинно бути унікальним серед усіх контейнерів. Контейнери ініціалізації не можуть мати дій Lifecycle, Readiness probes, Liveness probes, або Startup probes. resourceRequirements контейнера ініціалізації враховуються під час планування, знаходячи найбільше значення запиту/ліміту для кожного типу ресурсів, а потім використовуючи максимум цього значення або суму цих значень для звичайних контейнерів. Ліміти застосовуються до контейнерів ініціалізації аналогічним чином. Контейнери ініціалізації зараз не можуть бути додані або видалені. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/init-containers/](/docs/concepts/workloads/pods/init-containers/)

- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *Patch strategy: злиття за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Список ефемерних контейнерів, що запущені у цьому Pod. Ефемерні контейнери можуть бути запущені в наявному Podʼі для виконання дій, ініційованих користувачем, таких як налагодження. Цей список не може бути вказаний при створенні Podʼа, і його не можна змінити, оновивши специфікацію Podʼа. Щоб додати ефемерний контейнер до наявного Podʼа, використовуйте субресурс ефемерних контейнерів Podʼа.

- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  *Patch strategy: злиття за ключем `name`*

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

    Оператор, що представляє стосунок ключа до значення. Допустимі оператори — Exists та Equal. Стандартне значення — Equal. Exists еквівалентний знаку підстановки для значення, щоб Pod міг толерувати всі taint певної категорії.

  - **tolerations.value** (string)

    Значення taint, до якого застосовується толерантність. Якщо оператор Exists, значення має бути порожнім, в іншому випадку — це звичайний рядок.

  - **tolerations.effect** (string)

    Ефект, до якого застосовується толерантність. Порожнє значення означає відповідність усім ефектам taint. Допустимі значення: NoSchedule, PreferNoSchedule та NoExecute.

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

    Якщо це значення дорівнює null, поведінка еквівалентна полю Honor. Це функція на рівні бета, типово увімкнена за допомогою прапорця NodeInclusionPolicyInPodTopologySpread.

  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    NodeTaintsPolicy вказує, як ми будемо враховувати node taints при розрахунку перекосу розподілу топології Pod. Варіанти:

    - Honor: вузли без taints, разом з вузлами з taints, для яких вхідний Pod має толерантність, включаються.
    - Ignore: node taints ігноруються. Всі вузли включаються.

    Якщо це значення дорівнює null, поведінка еквівалентна полю Ignore. Це функція на рівні бета, типово увімкнена за допомогою прапорця NodeInclusionPolicyInPodTopologySpread.

- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead представляє ресурси, що представляють накладні витрати Podʼа для роботи з конкретним RuntimeClass. Це поле буде автоматично заповнене під час допуску контролером RuntimeClass. Якщо контролер допуску RuntimeClass увімкнено, overhead не повинен бути встановлений у запитах на створення Podʼа. Контролер допуску RuntimeClass відхилить запити на створення Podʼа, у яких overhead вже встановлений. Якщо RuntimeClass налаштований та обраний у PodSpec, Overhead буде встановлено на значення, визначене у відповідному RuntimeClass, в іншому випадку воно залишиться невстановленим та буде вважатися рівним нулю. Докладніше: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md

### Життєвий цикл {#lifecycle}

- **restartPolicy** (string)

  Політика перезапуску для всіх контейнерів у Podʼі. Одне з Always, OnFailure, Never. В деяких контекстах може бути дозволений лише субнабір цих значень. Стандартне значення — Always. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)

- **terminationGracePeriodSeconds** (int64)

  Необовʼязкова тривалість у секундах, необхідна для коректного завершення роботи Podʼа. Може бути зменшена у запиті на видалення. Значення повинно бути невідʼємним цілим числом. Значення нуль означає негайне припинення через сигнал kill (без можливості завершити роботу коректно). Якщо це значення є nil, буде використано стандартний період завершення. Період належного завершення — це тривалість у секундах після того, як процеси, що працюють у Podʼі, отримають сигнал про завершення, і до того, як вони будуть примусово зупинені сигналом kill. Встановіть це значення більше, ніж очікуваний час завершення вашого процесу. Стандартне значення — 30 секунд.

- **activeDeadlineSeconds** (int64)

  Необовʼязкова тривалість у секундах, протягом якої Pod може бути активним на вузлі відносно StartTime, перш ніж система почне активно намагатися позначити його як несправний та припинити роботу повʼязаних контейнерів. Значення повинно бути додатним цілим числом.

- **readinessGates** ([]PodReadinessGate)

  *Atomic: буде замінено під час злиття*

  Якщо вказано, всі readiness gates будуть оцінюватися для готовності Podʼа. Pod вважається готовим, коли всі його контейнери готові І всі умови, зазначені в readiness gates, мають статус "True". Докладніше: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  *PodReadinessGate містить посилання на стан Podʼа*

  - **readinessGates.conditionType** (string), обовʼязково

    ConditionType належить до стану у списку станів Podʼа з відповідним типом.

### Імʼя хосту та розвʼязування імен {#hostname-and-name-resolution}

- **hostname** (string)

  Вказує імʼя хосту Podʼа. Якщо не вказано, імʼя хосту Podʼа буде встановлено в значення визначене системою.

- **setHostnameAsFQDN** (boolean)

  Якщо встановлено значення true, імʼя хосту Podʼа буде налаштоване як повне доменне імʼя (FQDN) Podʼа, а не просто коротке імʼя (стандартно). У Linux-контейнерах це означає встановлення FQDN в полі імʼя хосту ядра (поле nodename структури utsname). У Windows-контейнерах це означає встановлення значення реєстру імʼя хосту для ключа реєстру HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters на FQDN. Якщо Pod не має FQDN, це не має ефекту. Стандартне значення — false.

- **subdomain** (string)

  Якщо вказано, повне кваліфіковане імʼя хосту Podʼа буде "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". Якщо не вказано, Pod не буде мати доменного імені взагалі.

- **hostAliases** ([]HostAlias)

  *Patch strategy: злиття за ключем `ip`*

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

      Обовʼязкове.

    - **dnsConfig.options.value** (string)

  - **dnsConfig.searches** ([]string)

    *Atomic: буде замінено під час злиття*

    Список доменів пошуку DNS для пошуку імен хостів. Він буде доданий до основних шляхів пошуку, згенерованих з DNSPolicy. Дубльовані шляхи пошуку будуть видалені.

- **dnsPolicy** (string)

  Встановлює політику DNS для Podʼа. Стандартне значеняя — "ClusterFirst". Допустимі значення: ʼClusterFirstWithHostNetʼ, ʼClusterFirstʼ, ʼDefaultʼ або ʼNoneʼ. Параметри DNS, задані в DNSConfig, будуть обʼєднані з політикою, вибраною за допомогою DNSPolicy. Щоб налаштувати опції DNS разом з hostNetwork, потрібно явно вказати політику DNS як ʼClusterFirstWithHostNetʼ.

### Простори імен хоста {#host-namespaces}

- **hostNetwork** (boolean)

  Використання мережі хоста для цього Podʼа. Використовує простір імен мережі хоста. Якщо ця опція встановлена, необхідно вказати порти, які будуть використовуватися. Стандартне значення — false.

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

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile вказує, що має бути використаний профіль, визначений у файлі на вузлі. Профіль має бути попередньо налаштований на вузлі, щоб працювати. Має бути низхідний шлях, відносно до налаштованого розташування профілю seccomp kubelet. Має бути встановлено, якщо тип "Localhost". НЕ має бути встановлено для будь-якого іншого типу.

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

- **resourceClaims** ([]PodResourceClaim)

  *Patch strategy: retainKeys, обʼєднання за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  ResourceClaims визначає, які ResourceClaims повинні бути виділені та зарезервовані перед тим, як Podʼу буде дозволено почати роботу. Ресурси будуть доступні тим контейнерам, які споживають їх за іменем.

  Це поле є альфа-рівнем і вимагає увімкнення функції DynamicResourceAllocation.

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

### Змінні середовища {#environment-variables}

- **env** ([]EnvVar)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення за ключем name будуть збережені під час обʼєднання*

  Список змінних середовища для встановлення в контейнері. Не може бути оновлено.

  <a name="EnvVar"></a>
  *EnvVar представляє змінну середовища, присутню в контейнері.*

  - **env.name** (string), обовʼязково

    Назва змінної середовища. Повинно бути C_IDENTIFIER.

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

  Список джерел для заповнення змінних середовища в контейнері. Ключі, визначені в межах джерела, повинні бути C_IDENTIFIER. Усі хибні ключі будуть повідомлені як подія при запуску контейнера. Коли ключ існує в декількох джерелах, значення, що асоціюється з останнім джерелом, буде мати пріоритет. Значення, визначене за допомогою Env з дубльованим ключем, буде мати пріоритет. Не може бути оновлено.

  <a name="EnvFromSource"></a>
  *EnvFromSource представляє джерело набору ConfigMaps*

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

    Необовʼязково ідентифікатор для вставлення перед кожним ключем в ConfigMap. Повинен бути C_IDENTIFIER.

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

    Це поле альфа-версії і вимагає включення функціоналу DynamicResourceAllocation.

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

  Політика зміни розміру ресурсів для контейнера.

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

- **terminationMessagePath** (string)

  Необовʼязково: Шлях, за яким файл, до якого буде записано повідомлення про завершення контейнера, буде вмонтовано в файлову систему контейнера. Записане повідомлення, призначено для короткого кінцевого статусу, наприклад, повідомлення про помилку виразу. Якщо воно більше 4096 байт, то вузол скоротить його. Загальна довжина повідомлення по всіх контейнерах буде обмежена 12 кб. Стандартне значення — /dev/termination-log. Не може бути оновлено.

- **terminationMessagePolicy** (string)

  Вказує, як має бути заповнене повідомлення про завершення. File використовуватиме вміст terminationMessagePath для заповнення повідомлення про статус контейнера при успіху і невдачі. FallbackToLogsOnError використовуватиме останній шматок виводу логу контейнера, якщо файл повідомлення про завершення пустий і контейнер завершився з помилкою. Вивід логу обмежено 2048 байтами або 80 рядками, якщо це менше. Стандартне значення — File. Не може бути оновлено.

- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Періодичне тестування життєздатності контейнера. Контейнер буде перезапущено, якщо тест не вдасться. Не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Періодична перевірка готовності контейнера до обслуговування. Контейнер буде видалено з точок доступу Service, якщо проба зазнає невдачі. Неможливо оновити. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe вказує, що Pod успішно ініціалізовано. Якщо вказано, інші проби не виконуються, поки ця не закінчиться успіхом. Якщо цей тест не вдасться, Pod буде перезапущено, так само, як і в разі невдачі livenessProbe. Це може бути використано для надання різних параметрів проби на початку життєвого циклу Podʼа, коли завантаження даних або оновлення кешу може займати довгий час, ніж під час регулярної роботи. Це не може бути оновлено. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes](/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

- **restartPolicy** (string)

  RestartPolicy визначає поведінку перезапуску окремих контейнерів у Podʼі. Це поле може бути встановлено тільки для контейнерів ініціалізації, і єдине допустиме значення — "Always". Для інших контейнерів, відмінних від контейнерів ініціалізації, або коли це поле не вказано, поведінка перезапуску визначається політикою перезапуску Podʼа і типом контейнера. Встановлення RestartPolicy як "Always" для контейнера ініціалізації матиме наступний ефект: цей контейнер ініціалізації буде постійно перезапускатися при виході, поки всі звичайні контейнери не завершаться. Як тільки всі звичайні контейнери завершаться, всі контейнери ініціалізації з RestartPolicy "Always" будуть вимкнені. Цей життєвий цикл відрізняється від звичайних контейнерів ініціалізації і часто називається "sidecar" контейнер. Хоча цей контейнер ініціалізації все ще запускається у послідовності контейнерів ініціалізації, він не чекає на завершення роботи контейнера, перш ніж переходити до наступного контейнера ініціалізації . Натомість, наступний контейнер ініціалізації запускається одразу після запуску цього контейнера ініціалізації або після успішного завершення будь-якого startupProbe.

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

  - **name** (string), обовʼязково

    Назва змінної середовища. Повинно бути C_IDENTIFIER.

  - **value** (string)

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

  Список джерел для заповнення змінних середовища в контейнері. Ключі, визначені в межах джерела, повинні бути C_IDENTIFIER. Усі хибні ключі будуть повідомлені як подія при запуску контейнера. Коли ключ існує в декількох джерелах, значення, що асоціюється з останнім джерелом, буде мати пріоритет. Значення, визначене за допомогою Env з дубльованим ключем, буде мати пріоритет. Не може бути оновлено.

  <a name="EnvFromSource"></a>
  *EnvFromSource представляє джерело набору ConfigMaps*

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

    Необовʼязково ідентифікатор для вставлення перед кожним ключем в ConfigMap. Повинен бути C_IDENTIFIER.

  - **envFrom.secretRef** (SecretEnvSource)

    Secret для вибору з

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

- **restartPolicy** (string)

  RestartPolicy визначає поведінку перезапуску окремих контейнерів у Podʼі. Це поле може бути встановлено тільки для контейнерів ініціалізації. Ви не можете встановити це поле для ефемерних контейнерів.

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

- **resources** (ResourceRequirements)

  Для ефемерних контейнерів заборонено використовувати ресурси. Ефемерні контейнери використовують вільні ресурси, вже виділені для Podʼа.

  - **resources.claims** ([]ResourceClaim)

    *Map: унікальні значення за ключем будуть збережені під час обʼєднання*

    Claims містить назви ресурсів, визначених в spec.resourceClaims, які використовуються цим контейнером.

    Це поле альфа-версії і вимагає включення функціоналу DynamicResourceAllocation.

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

  Exec визначає дію, яку слід виконати.

  <a name="ExecAction"></a>
  *ExecAction описує дію "виконати в контейнері".*

  - **exec.command** ([]string)

    *Atomic: буде замінено під час злиття*

    Command — це командний рядок для виконання всередині контейнера, робоча тека для команди — корінь ('/') у файловій системі контейнера. Команда виконується безпосередньо, а не в оболонці, тому традиційні команди оболонки ('|', тощо) не працюватимуть. Для використання оболонки потрібно явно викликати цю оболонку. Статус виходу 0 вважається готовим/справним, а ненульовий — несправним.

- **httpGet** (HTTPGetAction)

  HTTPGet визначає HTTP-запит, який слід виконати.

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

- **sleep** (SleepAction)

  Sleep представляє тривалість, протягом якої контейнер повинен бездіяти перед завершенням.

  <a name="SleepAction"></a>
  *SleepAction описує дію "sleep".*

  - **sleep.seconds** (int64), обовʼязково

    Seconds — кількість секунд для sleep.

- **tcpSocket** (TCPSocketAction)

  Застаріло. TCPSocket НЕ підтримується як обробник життєвого циклу та зберігається для зворотної сумісності. Валідації цього поля не проводиться, і хуки життєвого циклу зазнають невдачі під час виконання, коли вказано обробник tcp.

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

  Планувальник надаватиме перевагу розміщенню Podʼів на вузлах, які відповідають виразам спорідненості, зазначеним у цьому полі, але може вибрати вузол, який порушує один або кілька з цих виразів. Найбільш пріоритетним є вузол із найбільшою сумою ваг, тобто для кожного вузла, який відповідає всім вимогам планування (запит ресурсів, вирази спорідненості requiredDuringScheduling тощо), обчислюється сума шляхом ітерації через елементи цього поля та додавання "ваги" до суми, якщо на вузлі є Podʼи, які відповідають відповідному podAffinityTerm; вузол(и) з найвищою сумою є найпріоритетнішими.

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

      MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.mismatchLabelKeys** ([]string)

      *Atomic: буде замінено під час злиття*

      MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).


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

    MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).

  - **requiredDuringSchedulingIgnoredDuringExecution.mismatchLabelKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).

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

      MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.mismatchLabelKeys** ([]string)

      *Atomic: буде замінено під час злиття*

      MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).


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

    MatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key in (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення – порожнє. Один і той же ключ не може існувати як у matchLabelKeys, так і в labelSelector. Також matchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).

  - **requiredDuringSchedulingIgnoredDuringExecution.mismatchLabelKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    MismatchLabelKeys — це набір ключів міток podʼів для вибору podʼів, які будуть враховані. Ключі використовуються для пошуку значень у мітках вхідних podʼів, ці мітки ключ-значення обʼєднуються з `labelSelector` як `key notin (value)`, щоб вибрати групу існуючих podʼів, які будуть враховані для (анти)спорідненості вхідного podʼа. Ключі, яких немає у вхідних мітках podʼів, ігноруються. Стандартне значення — порожнє. Один і той же ключ не може існувати як у mismatchLabelKeys, так і в labelSelector. Також mismatchLabelKeys не може бути встановлено, якщо labelSelector не встановлений. Це бета-поле і вимагає увімкнення функціональної можливості MatchLabelKeysInPodAffinity (стандартно увімкнено).

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    Запит за мітками до набору просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, вибраних цим полем, і тих, що зазначені в полі namespaces. Нульовий селектор і нульовий або порожній список просторів імен означає "простір імен цього Podʼа". Порожній селектор ({}) відповідає всім просторам імен.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    *Atomic: буде замінено під час злиття*

    Простори імен визначають статичний список назв просторів імен, до яких застосовується термін. Термін застосовується до обʼєднання просторів імен, зазначених у цьому полі, і тих, що вибрані namespaceSelector. Нульовий або порожній список просторів імен і нульовий namespaceSelector означає "простір імен цього Podʼа".

## Проба {#Probe}

Проба описує перевірку стану, яка виконується для контейнера, щоб визначити, чи він справний або готовий приймати трафік.

---

- **exec** (ExecAction)

  Exec визначає дію, яку потрібно виконати.

  <a name="ExecAction"></a>
  *ExecAction описує дію "виконати в контейнері".*

  - **exec.command** ([]string)

    *Atomic: буде замінено під час злиття*

    Command — це командний рядок для виконання всередині контейнера, робоча тека для команди — корінь ('/') у файловій системі контейнера. Команда виконується безпосередньо, а не в оболонці, тому традиційні команди оболонки ('|', тощо) не працюватимуть. Для використання оболонки потрібно явно викликати цю оболонку. Статус виходу 0 вважається готовим/справним, а ненульовий — несправним.

- **httpGet** (HTTPGetAction)

  HTTPGet визначає HTTP-запит для виконання.

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

- **tcpSocket** (TCPSocketAction)

  TCPSocket визначає дію, що включає TCP-порт.

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

  GRPC визначає дію, що включає GRPC-порт.

  <a name="GRPCAction"></a>
  **

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

  *Patch strategy: злиття за ключем `ip`*

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

- **message** (string)

  Повідомлення, зрозуміле людині, що вказує на деталі, чому Pod знаходиться в цьому стані.

- **reason** (string)

  Коротке повідомлення у форматі CamelCase, що вказує на деталі, чому Pod знаходиться в цьому стані, наприклад, ʼEvictedʼ.

- **podIP** (string)

  `podIP` — IP-адреса, виділена Podʼа. Доступна для маршрутизації принаймні в межах кластера. Пусте, якщо ще не виділено.

- **podIPs** ([]PodIP)

  *Patch strategy: злиття за ключем `ip`*

  *Map: унікальні значення ключа ip будуть збережені під час злиття*

  `podIPs` містить IP-адреси, виділені Podʼу. Якщо це поле задано, 0-й запис повинен відповідати полю `podIP`. Podʼам може бути виділено не більше одного значення для кожного з IPv4 та IPv6. Цей список пустий, якщо IP-адреси ще не виділено.

  <a name="PodIP"></a>
  *PodIP представляє одну IP-адресу, виділену Podʼу.*

  - **podIPs.ip** (string), обовʼязково

    IP — це IP-адреса, призначена Podʼу.

- **conditions** ([]PodCondition)

  *Patch strategy: злиття за ключем `type`*

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

  - **conditions.reason** (string)

    Унікальна, однослівна, у CamelCase причина останнього переходу умови.

- **qosClass** (string)

  Класифікація якості обслуговування (QOS), присвоєна Podʼу на основі вимог до ресурсів. Дивіться тип PodQOSClass для доступних класів QOS. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes](/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes)

- **initContainerStatuses** ([]ContainerStatus)

  *Atomic: буде замінено під час злиття*

  Список містить один запис на кожен контейнер ініціалізації в маніфесті. Найбільш успішний контейнер ініціалізації матиме ready = true, найбільш нещодавно запущений контейнер матиме startTime встановлений. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status](/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status)

  <a name="ContainerStatus"></a>
  *ContainerStatus містить деталі поточного стану цього контейнера.*

  - **initContainerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources представляє обчислювальні ресурси, виділені для цього контейнера вузлом. Kubelet встановлює це значення у Container.Resources.Requests після успішного допуску podʼа та після успішного допуску бажаного масштабування podʼа.

  - **initContainerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: злиття за ключем `type`*

    *Map: унікальні значення ключа type будуть збережені під час злиття*

    AllocatedResourcesStatus представляє статус різних ресурсів, виділених для цього podʼа.

    <a name="ResourceStatus"></a>
    **

    - **initContainerStatuses.allocatedResourcesStatus.name** (string), обовʼязково

      Назва ресурсу. Має бути унікальною в межах podʼа та відповідати одному з ресурсів зі специфікації podʼа.

    - **initContainerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: унікальні значення ключа resourceID будуть збережені під час злиття*

      Список унікальних станів ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та стан ресурсу. Мінімум, ResourceID має унікально ідентифікувати ресурс, виділений podʼу на вузлі протягом життя podʼа. Дивіться тип ResourceID для його визначення.

      <a name="ResourceHealth"></a>
      *ResourceHealth представляє стан справності ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP https://kep.k8s.io/4680, і планується додавання історичних змін стану справності в майбутніх ітераціях KEP.*

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

      Це поле альфа-версії і потребує включення функціональної можливості DynamicResourceAllocation.

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

    *Patch strategy: злиття за ключем `mountPath`*

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

  Список містить один запис на кожен контейнер в маніфесті. Докладніше: [https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status](/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status)

  <a name="ContainerStatus"></a>
  *ContainerStatus містить деталі поточного стану цього контейнера.*

  - **containerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources представляє обчислювальні ресурси, виділені для цього контейнера вузлом. Kubelet встановлює це значення у Container.Resources.Requests після успішного допуску podʼа та після успішного допуску бажаного масштабування podʼа.

  - **containerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: злиття за ключем `name`*

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    AllocatedResourcesStatus представляє статус різних ресурсів, виділених для цього podʼа.

    <a name="ResourceStatus"></a>
    **

    - **containerStatuses.allocatedResourcesStatus.name** (string), обовʼязково

      Назва ресурсу. Має бути унікальною в межах podʼа та відповідати одному з ресурсів зі специфікації podʼа.

    - **containerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: унікальні значення ключа resourceID будуть збережені під час злиття*

      Список унікальних станів ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та стан ресурсу. Мінімум, ResourceID має унікально ідентифікувати ресурс, виділений podʼу на вузлі протягом життя podʼа. Дивіться тип ResourceID для його визначення.

      <a name="ResourceHealth"></a>
      *ResourceHealth представляє стан справності ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP https://kep.k8s.io/4680, і планується додавання історичних змін стану справності в майбутніх ітераціях KEP.*

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

      Це поле альфа-версії і потребує включення функціональної можливості DynamicResourceAllocation.

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

    *Patch strategy: злиття за ключем `mountPath`*

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

  Статус будь-яких ефемерних контейнерів, які працювали в цьому Podʼі.

  <a name="ContainerStatus"></a>
  *ContainerStatus містить деталі поточного стану цього контейнера.*

  - **ephemeralContainerStatuses.allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    AllocatedResources представляє обчислювальні ресурси, виділені для цього контейнера вузлом. Kubelet встановлює це значення у Container.Resources.Requests після успішного допуску podʼа та після успішного допуску бажаного масштабування podʼа.

  - **ephemeralContainerStatuses.allocatedResourcesStatus** ([]ResourceStatus)

    *Patch strategy: злиття за ключем `name`*

    *Map: унікальні значення ключа name будуть збережені під час злиття*

    AllocatedResourcesStatus представляє статус різних ресурсів, виділених для цього podʼа.

    <a name="ResourceStatus"></a>
    **

    - **ephemeralContainerStatuses.allocatedResourcesStatus.name** (string), обовʼязково

      Назва ресурсу. Має бути унікальною в межах podʼа та відповідати одному з ресурсів зі специфікації podʼа.

    - **ephemeralContainerStatuses.allocatedResourcesStatus.resources** ([]ResourceHealth)

      *Map: унікальні значення ключа resourceID будуть збережені під час злиття*

      Список унікальних станів ресурсів. Кожен елемент списку містить унікальний ідентифікатор ресурсу та стан ресурсу. Мінімум, ResourceID має унікально ідентифікувати ресурс, виділений podʼу на вузлі протягом життя podʼа. Дивіться тип ResourceID для його визначення.

      <a name="ResourceHealth"></a>
      *ResourceHealth представляє стан справності ресурсу. Він містить останню інформацію про стан пристрою. Це частина KEP https://kep.k8s.io/4680, і планується додавання історичних змін стану справності в майбутніх ітераціях KEP.*

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

      Це поле альфа-версії і потребує включення функціональної можливості DynamicResourceAllocation.

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

    *Patch strategy: злиття за ключем `mountPath`*

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

- **resize** (string)

  Статус бажаної зміни розміру ресурсів для контейнерів Podʼа. Він порожній, якщо немає очікуваної зміни розміру ресурсів. Будь-які зміни в ресурсах контейнера автоматично встановлять це на "Proposed".

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

- **name** (*у шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `get` отримати ефемерні контейнери вказаного Podʼа {#get-read-ephemeral-containers-of-the-specified-pod}

#### HTTP запит {#http-request-1}

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри {#parameters-1}

- **name** (*у шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `get` отримати лог вказаного Podʼа {#get-read-the-log-of-the-specified-pod}

#### HTTP запит {#http-request-2}

GET /api/v1/namespaces/{namespace}/pods/{name}/log

#### Параметри {#parameters-2}

- **name** (*у шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **container** (*у запиті*): string

  Контейнер, для якого потрібно виводити логи. Стандартно виводяться тільки логи контейнера, якщо в Podʼі є тільки один контейнер.

- **follow** (*у запиті*): boolean

  Слідкувати за потоком логу Podʼа. Стандартне значення — false.

- **insecureSkipTLSVerifyBackend** (*у запиті*): boolean

  insecureSkipTLSVerifyBackend вказує, що apiserver не повинен підтверджувати дійсність сертифікату обслуговуючого програмного забезпечення, з яким він зʼєднується. Це зробить HTTPS-зʼєднання між apiserver та обслуговуючим програмним забезпеченням ненадійним. Це означає, що apiserver не може підтвердити, що дані логу, які він отримує, отримано від реального kubelet. Якщо kubelet налаштований для підтвердження уповноваження TLS apiserver, це не означає, що зʼєднання з реальним kubelet вразливе до атаки посередника (наприклад, зловмисник не зможе перехопити фактичні дані логу, що надходять від реального kubelet).

- **limitBytes** (*у запиті*): integer

  Якщо задано, кількість байтів, які слід прочитати з сервера, перш ніж завершити виведення логу. Це може не показувати повністю останню лінію логу, і може повернути трохи більше або трохи менше, ніж вказаний обмежувач.

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **previous** (*у запиті*): boolean

  Повертати логи попередньо завершених контейнерів. Стандартне значення — false.

- **sinceSeconds** (*у запиті*): integer

  Відносний час у секундах до поточного часу, з якого показувати логи. Якщо це значення передує часу запуску Podʼа, будуть повернуті лише логи з часу запуску Podʼа. Якщо це значення в майбутньому, жодних логів не буде повернено. Можна вказати тільки один з sinceSeconds або sinceTime.

- **tailLines** (*у запиті*): integer

  Якщо задано, кількість рядків з кінця логу, які слід показати. Якщо не вказано, логи показуються з моменту створення контейнера, або відносно sinceSeconds або sinceTime.

- **timestamps** (*у запиті*): boolean

  Якщо true, додаємо часову мітку RFC3339 або RFC3339Nano на початок кожного рядка виводу логу. Стандартне значення — false.

#### Відповідь {#response-2}

200 (string): OK

401: Unauthorized

### `get` отримати статус вказаного Podʼа {#get-read-the-status-of-the-specified-pod}

#### HTTP запит {#http-request-3}

GET /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри {#parameters-3}

- **name** (*у шляху*): string, обовʼязково

  назва Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Pod {#list-list-or-watch-objects-of-kind-pod}

#### HTTP запит {#http-request-4}

GET /api/v1/namespaces/{namespace}/pods

#### Параметри {#parameters-4}

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Pod {#list-list-or-watch-objects-of-kind-pod-1}

#### HTTP запит {#http-request-5}

GET /api/v1/pods

#### Параметри {#parameters-5}

- **allowWatchBookmarks** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

### `create` створення Podʼа {#create-create-pod}

#### HTTP запит {#http-request-6}

POST /api/v1/namespaces/{namespace}/pods

#### Параметри {#parameters-6}

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Podʼа {#update-replace-the-specified-pod}

#### HTTP запит {#http-request-7}

PUT /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters-7}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `update` заміна ephemeralcontainers вказаного Podʼа {#update-replace-the-ephemeralcontainers-of-the-specified-pod}

#### HTTP запит {#http-request-8}

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри {#parameters-8}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Podʼа {#update-replace-the-status-of-the-specified-pod}

#### HTTP запит {#http-request-9}

PUT /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри {#parameters-9}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Podʼа {#patch-partially-update-the-specified-pod}

#### HTTP запит {#http-request-10}

PATCH /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters-10}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `patch` часткове оновлення ephemeralcontainers вказаного Podʼа {#patch-partially-update-ephemeralcontainers-of-the-specified-pod}

#### HTTP запит {#http-request-11}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

#### Параметри {#parameters-11}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-11}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Podʼа {#patch-partially-update-the-status-of-the-specified-pod}

#### HTTP запит {#http-request-12}

PATCH /api/v1/namespaces/{namespace}/pods/{name}/status

#### Параметри {#parameters-12}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-12}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

### `delete` видалення Pod {#delete-delete-pod}

#### HTTP запит {#http-request-13}

DELETE /api/v1/namespaces/{namespace}/pods/{name}

#### Параметри {#parameters-13}

- **name** (*у шляху*): string, обовʼязково

  імʼя Podʼа

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-13}

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Podʼів {#deletecollection-delete-collection-of-pod}

#### HTTP запит {#http-request-14}

DELETE /api/v1/namespaces/{namespace}/pods

#### Параметри {#parameters-14}

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*у запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*у запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*у запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-14}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
