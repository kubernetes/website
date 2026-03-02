---
title: Призначення Podʼів до Вузлів
content_type: concept
weight: 20
---

<!-- overview -->

Ви можете обмежити {{< glossary_tooltip text="Pod" term_id="pod" >}} так, щоб він був _обмежений_ для запуску на конкретних {{< glossary_tooltip text="вузлах" term_id="node" >}}, або _віддавав перевагу_ запуску на певних вузлах. Існують кілька способів як це  зробити, а рекомендовані підходи використовують усі [селектори міток](/docs/concepts/overview/working-with-objects/labels/) для полегшення вибору. Зазвичай вам не потрібно встановлювати жодні обмеження такого роду; {{< glossary_tooltip text="планувальник" term_id="kube-scheduler" >}} автоматично робить розумне розміщення (наприклад, розподіл Podʼів по вузлах так, щоб не розміщувати Podʼи на вузлі з недостатньою кількістю вільних ресурсів). Однак є деякі обставини, коли ви можете контролювати, на якому вузлі розгортається Pod, наприклад, щоб переконатися, що Pod потрапляє на вузол з прикріпленим до нього SSD, або спільно розміщувати Podʼи з двох різних служб, які багато спілкуються в одній зоні доступності.

<!-- body -->

Ви можете використовувати будь-який з наступних методів для вибору місця, де Kubernetes планує конкретні Podʼи:

- [Поле nodeSelector](#nodeselector), яке відповідає [міткам вузлів](#built-in-node-labels)
- [Спорідненість та антиспорідненість](#affinity-and-anti-affinity)
- Поле [nodeName](#nodename)
- [Обмеження розподілу топології Podʼа](#pod-topology-spread-constraints)

## Мітки вузлів {#built-in-node-labels}

Як і багато інших обʼєктів Kubernetes, вузли мають [мітки](/docs/concepts/overview/working-with-objects/labels/). Ви можете [додавати мітки вручну](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node). Kubernetes також заповнює [стандартний набір міток](/docs/reference/node/node-labels/) на всіх вузлах кластера.

{{< note >}}
Значення цих міток специфічне для хмарного середовища і не може бути надійним. Наприклад, значення `kubernetes.io/hostname` може бути таким самим, як імʼя вузла у деяких середовищах, і різним в інших середовищах.
{{</ note >}}

### Ізоляція/обмеження вузлів {#node-isolation-restriction}

Додавання міток до вузлів дозволяє вам позначати Podʼи для розміщення на конкретних вузлах або групах вузлів. Ви можете використовувати цю функціональність, щоб забезпечити, що певні Podʼи працюватимуть тільки на вузлах із певною ізоляцією, безпекою або регуляторними властивостями.

Якщо ви використовуєте мітки для ізоляції вузлів, обирайте ключі міток, які {{<glossary_tooltip text="kubelet" term_id="kubelet">}} не може змінювати. Це заважає скомпрометованому вузлу встановлювати ці мітки на себе, щоб планувальник планував навантаження на скомпрометований вузол.

Втулок допуску [`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) перешкоджає kubelet встановлювати або змінювати мітки з префіксом `node-restriction.kubernetes.io/`.

Щоб скористатися цим префіксом міток для ізоляції вузлів:

1. Переконайтеся, що ви використовуєте [авторизатор вузлів](/docs/reference/access-authn-authz/node/) і _ввімкнули_ втулок допуску `NodeRestriction`.
2. Додайте мітки з префіксом `node-restriction.kubernetes.io/` на ваші вузли, і використовуйте ці мітки у ваших [селекторах вузлів](#nodeselector). Наприклад, `example.com.node-restriction.kubernetes.io/fips=true` або `example.com.node-restriction.kubernetes.io/pci-dss=true`.

## Вибір вузла з використанням `nodeSelector` {#nodeselector}

`nodeSelector` є найпростішим рекомендованим способом обмеження вибору вузла. Ви можете додати поле `nodeSelector` до специфікації вашого Podʼа і вказати [мітки вузла](#built-in-node-labels), які має мати цільовий вузол. Kubernetes розміщує Pod лише на тих вузлах, які мають всі мітки, які ви вказали.

Дивіться [Призначення Podʼів на вузли](/docs/tasks/configure-pod-container/assign-pods-nodes) для отримання додаткової інформації.

## Спорідненість та антиспорідненість {#affinity-and-anti-affinity}

`nodeSelector` є найпростішим способом обмежити Podʼи вузлами з певними мітками. Спорідненість та антиспорідненість розширюють типи обмежень, які ви можете визначити. Деякі з переваг спорідненості та антиспорідненості включають:

- Мова (анти)спорідненості є більш виразною. `nodeSelector` вибирає лише вузли з усіма вказаними мітками. (Анти)спорідненіcть дає вам більший контроль над логікою вибору.
- Ви можете вказати, що правило є _soft_ або _preferred_, таким чином, планувальник все ще розміщує Pod навіть якщо не може знайти відповідного вузла.
- Ви можете обмежити Pod, використовуючи мітки на інших Podʼах, які працюють на вузлі (або іншій топологічній області), а не лише мітки вузла, що дозволяє визначати правила для того, які Podʼи можуть бути розташовані на одному вузлі.

Функція affinity складається з двох типів значень:

- _Спорідненість вузла_ працює подібно до поля `nodeSelector`, але є більш виразним і дозволяє вказувати мʼякі правила.
- _Між-Podʼова (анти)спорідненість_ дозволяє обмежувати Podʼи проти міток інших Podʼів.

### Спорідненість вузла {#node-affinity}

Спорідненість вузла концептуально подібне до `nodeSelector` і дозволяє вам обмежувати, на яких вузлах може бути запланований ваш Pod на основі міток вузла. Існують два типи спорідненості вузла:

- `requiredDuringSchedulingIgnoredDuringExecution`: Планувальник не може запланувати Pod, якщо правило не виконується. Це працює подібно до `nodeSelector`, але з більш виразним синтаксисом.
- `preferredDuringSchedulingIgnoredDuringExecution`: Планувальник намагається знайти вузол, який відповідає правилу. Якщо відповідний вузол недоступний, планувальник все одно планує Pod.

{{< note >}}
У попередніх типах `IgnoredDuringExecution` означає, що якщо мітки вузла змінюються після того, як Kubernetes запланував Pod, Pod продовжує працювати.
{{</ note >}}

Ви можете вказати спорідненість вузла, використовуючи поле `.spec.affinity.nodeAffinity` в специфікації вашого Podʼа.

Наприклад, розгляньте наступну специфікацію Podʼа:

{{% code_sample file="pods/pod-with-node-affinity.yaml" %}}

У цьому прикладі застосовуються наступні правила:

- Вузол _повинен_ мати мітку з ключем `topology.kubernetes.io/zone`, а значення цієї мітки _повинно_ бути або `antarctica-east1`, або `antarctica-west1`.
- Вузол _переважно_ має мати мітку з ключем `another-node-label-key`, а значення `another-node-label-value`.

Ви можете використовувати поле `operator`, щоб вказати логічний оператор, який Kubernetes буде використовувати при інтерпретації правил. Ви можете використовувати `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt` і `Lt`.

Прочитайте розділ [Оператори](#operators), щоб дізнатися більше про те, як вони працюють.

`NotIn` та `DoesNotExist` дозволяють визначати поведінку антиспорідненості. Альтернативно, ви можете використовувати [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) для відштовхування Podʼів від конкретних вузлів.

{{< note >}}
Якщо ви вказуєте як `nodeSelector`, так і `nodeAffinity`, _обидва_ вони повинні задовольнятися для того, щоб Pod був запланований на вузол.

Якщо ви вказуєте кілька умов в `nodeSelectorTerms`, повʼязаних з типами `nodeAffinity`, то Pod може бути запланований на вузол, якщо одна з вказаних умов може бути задоволеною (умови зʼєднуються логічним OR).

Якщо ви вказуєте кілька виразів в одному полі `matchExpressions`, повʼязаному з умовою в `nodeSelectorTerms`, то Pod може бути запланований на вузол лише в тому випадку, якщо всі вирази задовольняються (вирази зʼєднуються логічним AND).
{{</ note >}}

Дивіться [Призначення Podʼів вузлам з використанням Node Affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/) для отримання додаткової інформації.

### Вага спорідненості вузла {#node-affinity-weight}

Ви можете вказати `weight` (вагу) від 1 до 100 для кожного випадку спорідненості типу `preferredDuringSchedulingIgnoredDuringExecution`. Коли планувальник знаходить вузли, які відповідають усім іншим вимогам планування Podʼа, планувальник проходить по кожному правилу preferred, якому задовольняє вузол, і додає значення `weight` для цього виразу до суми.

Кінцева сума додається до загального балу інших функцій пріоритету для вузла. Вузли з найвищим загальним балом пріоритету отримують пріоритет у виборі планувальника при прийнятті рішення щодо планування Podʼа.

Наприклад, розгляньте наступну специфікацію Podʼа:

{{% code_sample file="pods/pod-with-affinity-preferred-weight.yaml" %}}

Якщо існують два можливих вузли, які відповідають правилу `preferredDuringSchedulingIgnoredDuringExecution`, один з міткою `label-1:key-1`, а інший з міткою `label-2:key-2`, планувальник бере до уваги `weight` кожного вузла і додає вагу до інших балів для цього вузла, і планує Pod на вузол з найвищим кінцевим балом.

{{< note >}}
Якщо ви хочете, щоб Kubernetes успішно запланував Podʼи в цьому прикладі, вам потрібно мати наявні вузли з міткою `kubernetes.io/os=linux`.
{{</ note >}}

#### Спорідненість вузла для кожного профілю планування {#node-affinity-per-scheduling-profile}

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

При налаштуванні кількох [профілів планування](/docs/reference/scheduling/config/#multiple-profiles) ви можете повʼязати профіль зі спорідненістю вузла, що є корисним, якщо профіль застосовується лише до певного набору вузлів. Для цього додайте `addedAffinity` до поля `args` втулка [`NodeAffinity`](/docs/reference/scheduling/config/#scheduling-plugins) у [конфігурації планувальника](/docs/reference/scheduling/config/). Наприклад:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
  - schedulerName: foo-scheduler
    pluginConfig:
      - name: NodeAffinity
        args:
          addedAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: scheduler-profile
                  operator: In
                  values:
                  - foo
```

`addedAffinity` застосовується до всіх Podʼів, які встановлюють `.spec.schedulerName` в `foo-scheduler`, на додачу до NodeAffinity, вказаного в PodSpec. Тобто для збігу вузла з Podʼом потрібно задовольнити збіг між `addedAffinity` та `.spec.NodeAffinity` Podʼа.

Оскільки `addedAffinity` не є видимим для кінцевих користувачів, його поведінка може бути неочікуваною для них. Використовуйте мітки вузлів, які мають чіткий взаємозвʼязок з іменем профілю планування.

{{< note >}}
Контролер DaemonSet, який [створює Podʼи для DaemonSet](/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled), не підтримує профілі планування. Коли контролер DaemonSet створює Podʼи, стандартний планувальник Kubernetes розміщує ці Podʼи та дотримується будь-яких правил `nodeAffinity` в контролері DaemonSet.
{{< /note >}}

### Між-podʼова спорідненість та антиспорідненість {#inter-pod-affinity-anti-affinity}

Між-podʼова спорідненість та антиспорідненість дозволяють обмежити, на яких вузлах ваші Podʼи можуть бути заплановані на основі міток Podʼів, які вже працюють на цьому вузлі, а не міток вузлів.

#### Типи між-podʼової спорідненості та антиспорідненості {#types-of-inter-pod-affinity-and-anti-affinity}

Між-podʼова спорідненість та антиспорідненість мають наступний вигляд: "цей Pod повинен (або, у випадку антиспорідненості, не повинен) працювати у X, якщо на цьому X вже працюють один або декілька Podʼів, які задовольняють правилу Y", де X є областю топології, такою як вузол, стійка, зона або регіон постачальника хмарних послуг, або щос подібне, а Y — це правило, яке Kubernetes намагається задовольнити.

Ви виражаєте ці правила (Y) як [селектори міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors) з опційним повʼязаним списком просторів імен. Podʼи є обʼєктами з простором імен в Kubernetes, тому мітки Podʼів також неявно мають простори імен. Будь-які селектори міток для міток Podʼа повинні вказувати простори імен, в яких Kubernetes має переглядати ці мітки.

Ви виражаєте область топології (X), використовуючи `topologyKey`, який є ключем для мітки вузла, яку система використовує для позначення домену. Для прикладу дивіться у [Відомі мітки, анотації та позначення](/docs/reference/labels-annotations-taints/).

{{< note >}}
Між-Podʼові спорідненість та антиспорідненість потребують значних обсягів обчислень, що може значно сповільнити планування великих кластерів. Ми не рекомендуємо їх використовувати в кластерах розміром більше декількох сотень вузлів.
{{< /note >}}

{{< note >}}
Антиспорідненість Podʼа вимагає, щоб вузли систематично позначались, іншими словами, кожен вузол в кластері повинен мати відповідну мітку, яка відповідає `topologyKey`. Якщо деякі або всі вузли не мають вказаної мітки `topologyKey`, це може призвести до непередбачуваної поведінки.
{{< /note >}}

Подібно до [Node affinnity](#node-affinity), існують два типи спорідненості та
антиспорідненості Podʼа:

- `requiredDuringSchedulingIgnoredDuringExecution`
- `preferredDuringSchedulingIgnoredDuringExecution`

Наприклад, ви можете використовувати спорідненість `requiredDuringSchedulingIgnoredDuringExecution`,
щоб повідомити планувальник про те, що потрібно розташувати Podʼи двох служб в тій самій зоні постачальника хмарних послуг, оскільки вони взаємодіють між собою дуже часто. Так само ви можете використовувати антиспорідненість
`preferredDuringSchedulingIgnoredDuringExecution`, щоб розподілити Podʼи служби по різних зонах постачальника хмарних послуг.

Для використання між-Podʼової спорідненості використовуйте поле `affinity.podAffinity` в специфікації Podʼа. Для між-Podʼової антиспорідненості використовуйте поле `affinity.
podAntiAffinity` в специфікації Podʼа.

#### Поведінка планування {#scheduling-behavior}

При плануванні нового Podʼа планувальник Kubernetes оцінює правила спорідненості/антиспорідненості Podʼа в контексті поточного стану кластера:

1. Жорсткі обмеження (фільтрація вузлів):
   - `podAffinity.requiredDuringSchedulingIgnoredDuringExecution` та `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`:
     - Планувальник гарантує, що новий Pod буде призначено вузлам, які задовольняють цим необхідним правилам спорідненості та антиспорідненості, на основі існуючих Podʼів.

2. Мʼякі обмеження (скоринг):
   - `podAffinity.preferredDuringSchedulingIgnoredDuringExecution` та `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - Планувальник оцінює вузли на основі того, наскільки добре вони відповідають цим бажаним правилам спорідненості та антиспорідненості, щоб оптимізувати розміщення Podʼів.

3. Ігноровані поля:
   - Наявні в Podʼах `podAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - Ці кращі правила спорідненості не враховуються під час прийняття рішення щодо планування нових Podʼів.
   - Наявні в Podʼах `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - Аналогічно, при плануванні ігноруються бажані правила антиспорідненності наявних Podʼів.

#### Планування групи Podʼів з між-podʼовою спорідненістю{#scheduling-a-group-of-pods-with-inter-pod-affinity-to-themselves}

Якщо поточний Pod, який планується, є першим у серії, який має спорідненість один до одного, його можна планувати, якщо він проходить всі інші перевірки спорідненості. Це визначається тим, що не існує іншого Podʼа в кластері, який відповідає простору імен та селектору цього Podʼа, що Pod відповідає власним умовам і обраний вузол відповідає всім запитаним топологіям. Це забезпечує відсутність блокування навіть у випадку, якщо всі Podʼи мають вказану між-Podʼову спорідненість.

#### Приклад спорідненості Podʼа {#an-example-of-a-pod-that-uses-pod-affinity}

Розгляньте наступну специфікацію Podʼа:

{{% code_sample file="pods/pod-with-pod-affinity.yaml" %}}

У цьому прикладі визначено одне правило спорідненості Podʼа та одне правило антиспорідненості Podʼа. Правило спорідненості Podʼа використовує "hard" `requiredDuringSchedulingIgnoredDuringExecution`, тоді як правило антиспорідненості використовує "soft" `preferredDuringSchedulingIgnoredDuringExecution`.

Правило спорідненості вказує, що планувальник може розмістити Pod лише на вузлі, який належить до певної [зони](/docs/concepts/scheduling-eviction/topology-spread-constraints/), де інші Podʼи мають мітку `security=S1`. Наприклад, якщо у нас є кластер із призначеною зоною, скажімо, "Zone V", що складається з вузлів з міткою `topology.kubernetes.io/zone=V`, планувальник може призначити Pod на будь-який вузол у Zone V, якщо принаймні один Pod у Zone V вже має мітку `security=S1`. Зворотно, якщо в Zone V немає Podʼів з мітками `security=S1`, планувальник не призначить Pod з прикладц ні на один вузол в цій зоні.

Правило антиспорідненості вказує, що планувальник повинен уникати призначення Podʼа на вузол, якщо цей вузол належить до певної [зони](/docs/concepts/scheduling-eviction/topology-spread-constraints/), де інші Podʼи мають мітку `security=S2`. Наприклад, якщо у нас є кластер із призначеною зоною, скажімо, "Zone R", що складається з вузлів з міткою `topology.kubernetes.io/zone=R`, планувальник повинен уникати призначення Podʼа на будь-який вузол у Zone R, якщо принаймні один Pod у Zone R вже має мітку `security=S2`. Зворотно, правило антиспорідненості не впливає на планування у Zone R, якщо немає Podʼів з мітками `security=S2`.

Щоб ближче ознайомитися з прикладами спорідненості та антиспорідненості Podʼів, зверніться до [проєктної документації](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).

В полі `operator` для спорідненості та антиспорідненості Podʼа можна використовувати значення `In`, `NotIn`, `Exists` та `DoesNotExist`.

Для отримання додаткової інформації про те, як це працює, перегляньте [Оператори](#operators).

У принципі, `topologyKey` може бути будь-яким допустимим ключем мітки з такими винятками з причин продуктивності та безпеки:

- Для спорідненості та антиспорідненості Podʼа пусте поле `topologyKey` не дозволяється як для `requiredDuringSchedulingIgnoredDuringExecution`, так і для `preferredDuringSchedulingIgnoredDuringExecution`.
- Для правил антиспорідненості Podʼа `requiredDuringSchedulingIgnoredDuringExecution` контролер допуску `LimitPodHardAntiAffinityTopology` обмежує `topologyKey` до `kubernetes.io/hostname`. Ви можете змінити або вимкнути контролер допуску, якщо хочете дозволити власні топології.

Крім `labelSelector` та `topologyKey`, ви можете опціонально вказати список просторів імен, з якими `labelSelector` повинен зіставлятися, використовуючи поле `namespaces` на тому ж рівні, що й `labelSelector` та `topologyKey`. Якщо відсутнє або порожнє, `namespaces` типово відноситься до простору імен Podʼа, де зʼявляється визначення спорідненості/антиспорідненості.

#### Селектор простору імен {#namespace-selector}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Ви також можете вибирати відповідні простори імен за допомогою `namespaceSelector`, який є запитом міток до набору просторів імен. Умова спорідненості застосовується до просторів імен, вибраних як `namespaceSelector`, так і полем `namespaces`. Зверніть увагу, що порожній `namespaceSelector` ({}) відповідає всім просторам імен, тоді як нульовий або порожній список `namespaces` і нульовий `namespaceSelector` відповідає простору імен Podʼа, де визначена правило.

#### matchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- UPDATE THIS WHEN PROMOTING TO STABLE -->
Поле `matchLabelKeys` знаходиться на рівні бета-версії та є стандартно увімкненим в Kubernetes {{< skew currentVersion >}}. Якщо ви бажаєте його вимкнути, вам потрібно зробити це явним чином за допомогою вимкнення [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/)  `MatchLabelKeysInPodAffinity`.
{{< /note >}}

У Kubernetes є опціональне поле `matchLabelKeys` для спорідненості або антиспорідненості Podʼа. Це поле вказує ключі для міток, які повинні відповідати міткам вхідного Podʼа під час задоволення спорідненості (антиспорідненості) Podʼа.

Ці ключі використовуються для отримання значень з міток Podʼа; ці ключ-значення міток поєднуються (використовуючи `AND`) з обмеженнями відповідно до поля `labelSelector`. Обʼєднане фільтрування вибирає набір наявниї Podʼів, які будуть враховуватися при розрахунку спорідненості (антиспорідненості) Podʼа.

{{< caution >}}
Не рекомендується використовувати `matchLabelKeys` з мітками, які можуть оновлюватися безпосередньо на podʼах. Навіть якщо ви редагуєте мітку podʼів, вказану у `matchLabelKeys`, **безпосередньо**, (тобто не через deployment), kube-apiserver не відобразить оновлення мітки у обʼєднаному `labelSelectorʼі.
{{< /caution >}}

Частим використанням є використання `matchLabelKeys` разом із `pod-template-hash` (встановленим у Podʼах, керованих як частина Deployment, де значення унікальне для кожного покоління). Використання `pod-template-hash` в `matchLabelKeys` дозволяє вам спрямовувати Podʼи, які належать тому ж поколінню, що й вхідний Pod, так щоб поступове оновлення не руйнувало споріденість.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: application-server
...
spec:
  template:
    spec:
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - database
            topologyKey: topology.kubernetes.io/zone
            # Тільки Podʼи з певного розгортання беруться до уваги при обчисленні спорідненості Podʼа.
            # Якщо ви оновите Deployment, підмінні Podʼи дотримуватимуться своїх власних правил спорідненості
            # (якщо вони визначені в новому шаблоні Podʼа).
            matchLabelKeys:
            - pod-template-hash
```

#### mismatchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- UPDATE THIS WHEN PROMOTING TO STABLE -->
Поле `mismatchLabelKeys` знаходиться на рівні бета-версії та є стандартно увімкненим в Kubernetes {{< skew currentVersion >}}. Якщо ви бажаєте його вимкнути, вам потрібно зробити це явним чином за допомогою вимкнення [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodAffinity`.
{{< /note >}}

Kubernetes включає додаткове поле `mismatchLabelKeys` для спорідненості або антиспорідненості Podʼа. Це поле вказує ключі для міток, які не повинні мати збігу з мітками вхідного Podʼа, при задоволенні спорідненості чи антиспорідненості Podʼа.

{{< caution >}}
Не рекомендується використовувати `mismatchLabelKeys` з мітками, які можуть оновлюватися безпосередньо на podʼах. Навіть якщо ви відредагуєте мітку podʼів, вказану у `mismatchLabelKeys`, **безпосередньо** (тобто не через deployment), kube-apiserver не відобразить оновлення мітки на обʼєднаному `labelSelectorʼі.
{{< /caution >}}

Один з прикладів використання — це забезпечення того, що Podʼи будуть розміщені в топологічному домені (вузол, зона і т. д.), де розміщені лише Podʼи від того ж орендаря або команди. Іншими словами, ви хочете уникнути запуску Podʼів від двох різних орендарів в одному топологічному домені одночасно.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    # Припустимо, що всі відповідні Podʼи мають встановлену мітку "tenant"
    tenant: tenant-a
...
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # переконаємось, що Podʼи, повʼязані з цим орендарем, потрапляють у відповідний пул вузлів
      - matchLabelKeys:
          - tenant
        labelSelector: {}
        topologyKey: node-pool
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # переконаємось, що Podʼи, повʼязані з цим орендарем, не можуть розміщуватися на вузлах,
      # які використовуються для іншого орендаря
      - mismatchLabelKeys:
        - tenant # незалежно від значення мітки "tenant" для цього Podʼа, заборонити
                 # розміщення на вузлах у будь-якому пулі, де працює будь-який Pod
                 # від іншого орендаря.
        labelSelector:
          # Ми повинні мати labelSelector, який обирає лише Podʼи з міткою tenant,
          # інакше цей Pod матиме антиспорідненість до Podʼів з daemonsetʼів, наприклад,
          # які не повинні мати мітку tenant.
          matchExpressions:
          - key: tenant
            operator: Exists
        topologyKey: node-pool
```

#### Ще кілька практичних прикладів {#more-practical-use-cases}

Між-Podʼові спорідненість та антиспорідненість можуть бути навіть більш корисними, коли вони використовуються з колекціями вищого рівня, такими як ReplicaSets, StatefulSets, Deployments і т. д. Ці правила дозволяють налаштувати спільне розташування набору робочих навантажень у визначеній топології; наприклад, віддаючи перевагу розміщенню двох повʼязаних Podʼів на одному вузлі.

Наприклад: уявіть кластер з трьох вузлів. Ви використовуєте кластер для запуску вебзастосунку та також сервіс кешування в памʼяті (наприклад, Redis). Нехай для цього прикладу також буде фіксований максимальний рівень затримки між вебзастосунком та цим кешем, як це практично можливо. Ви можете використовувати між-Podʼові спорідненість та антиспорідненість, щоб спільні вебсервери з кешем, як це можна точніше, розташовувалися поруч.

У наступному прикладі Deployment для кешування Redis, репліки отримують мітку `app=store`. Правило `podAntiAffinity` повідомляє планувальникові уникати розміщення декількох реплік з міткою `app=store` на одному вузлі. Це створює кожен кеш на окремому вузлі.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

У наступному прикладі Deployment для вебсерверів створює репліки з міткою `app=web-store`. Правило спорідненості Podʼа повідомляє планувальнику розмістити кожну репліку на вузлі, де є Pod з міткою `app=store`. Правило антиспорідненості Podʼа повідомляє планувальнику ніколи не розміщати декілька серверів `app=web-store` на одному вузлі.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.16-alpine
```

Створення цих двох попередніх Deploymentʼів призводить до наступного структури кластера, де кожен вебсервер знаходиться поруч з кешем, на трьох окремих вузлах.

|    вузол-1    |    вузол-2    |    вузол-3    |
| :-----------: | :-----------: | :-----------: |
| _webserver-1_ | _webserver-2_ | _webserver-3_ |
|   _cache-1_   |   _cache-2_   |   _cache-3_   |

Загальний ефект полягає в тому, що кожен екземпляр кешу ймовірно використовується одним клієнтом, який працює на тому ж самому вузлі. Цей підхід спрямований на мінімізацію як перекосу (нерівномірного навантаження), так і затримки.

У вас можуть бути інші причини використання антиспорідненості Podʼа. Дивіться [посібник по ZooKeeper](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
для прикладу StatefulSet, налаштованого з антиспорідненостю для забезпечення високої
доступності, використовуючи ту ж саму техніку, що й цей приклад.

## nodeName

`nodeName` є більш прямим способом вибору вузла, ніж спорідненісь або `nodeSelector`. `nodeName` — це поле в специфікації Pod. Якщо поле `nodeName` не порожнє, планувальник ігнорує Pod, і kubelet на названому вузлі намагається розмістити Pod на цьому вузлі. Використання `nodeName` переважає використання `nodeSelector` або правил спорідненості та антиспорідненості.

Деякі з обмежень використання `nodeName` для вибору вузлів:

- Якщо зазначений вузол не існує, Pod не буде запущено, і у деяких випадках його може бути автоматично видалено.
- Якщо зазначений вузол не має достатньо ресурсів для розміщення Podʼа, Pod зазнає збою, про що буде повідомлено,  наприклад, OutOfmemory або OutOfcpu.
- Назви вузлів у хмарних середовищах не завжди передбачувані або стабільні.

{{< warning >}}
`nodeName` призначений для використання власними планувальниками або у більш складних випадках, де вам потрібно обійти будь-які налаштовані планувальники. Обхід планувальників може призвести до збійних Podʼів, якщо призначені вузли переповнені. Ви можете використовувати [спорідненісь вузлів](#node-affinity) або поле [`nodeSelector`](#nodeselector), щоб призначити Pod до певного вузла без обходу планувальників.
{{< /warning >}}

Нижче наведено приклад специфікації Pod з використанням поля `nodeName`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

Вищевказаний Pod буде запущено лише на вузлі `kube-01`.

## nominatedNodeName

{{< feature-state feature_gate_name="NominatedNodeNameForExpectation" >}}

`nominatedNodeName` може використовуватись для зовнішніх компонентів, щоб номінувати вузол для очікуючого Podʼа. Ця номінація є найкращою спробою: її може бути проігноровано, якщо планувальник визначить, що Pod не може перейти до номінованого вузла.

Крім того, це поле може бути (перезаписано) планувальником:

- Якщо планувальник знаходить вузол для номінації через випередження.
- Якщо планувальник вирішує, куди йде Pod, і переміщує його в цикл привʼязки.
  - Зверніть увагу, що в цьому випадку `nominatedNodeName` встановлюється лише тоді, коли Pod повинен пройти через точки розширення `WaitOnPermit` або `PreBind`.

Ось приклад статусу Pod з використанням поля `nominatedNodeName`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
...
status:
  nominatedNodeName: kube-01
```

## Обмеження розподілу топології Pod {#pod-topology-spread-constraints}

Ви можете використовувати _обмеження розподілу топології_ для керування тим, як {{< glossary_tooltip text="Podʼи" term_id="Pod" >}} розподіляються по вашому кластеру серед недоступних доменів, таких як регіони, зони, вузли або будь-які інші топологічні домени, які ви визначаєте. Ви можете це зробити, щоб покращити продуктивність, очікувану доступність або
загальне використання.

Докладніше про роботу з обмеженнями розподілу топології Podʼів читайте [тут](/docs/concepts/scheduling-eviction/topology-spread-constraints/).

## Мітки топології Podʼів {#pod-topology-labels}

{{< feature-state feature_gate_name="PodTopologyLabelsAdmission" >}}

Podʼи успадковують мітки топології (`topology.kubernetes.io/zone` та `topology.kubernetes.io/region`) від призначеного їм вузла, якщо такі мітки присутні. Ці мітки можна потім використовувати через Downward API, щоб забезпечити робоче навантаження інформацією про топологію вузлів.

Ось приклад Podʼа, що використовує Downward API для своєї зони та регіону:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-topology-labels
spec:
  containers:
    - name: app
      image: alpine
      command: ["sh", "-c", "env"]
      env:
        - name: MY_ZONE
          valueFrom:
            fieldRef:
              fieldPath: metadata.labels['topology.kubernetes.io/zone']
        - name: MY_REGION
          valueFrom:
            fieldRef:
              fieldPath: metadata.labels['topology.kubernetes.io/region']
```

## Оператори {#operators}

Наступні логічні оператори можна використовувати в полі `operator` для `nodeAffinity` та `podAffinity`, згаданих вище.

|    Оператор    |   Поведінка     |
| :------------: | :-------------: |
| `In` | Значення мітки присутнє у заданому наборі рядків |
|   `NotIn`   | Значення мітки не міститься у заданому наборі рядків |
| `Exists` | Мітка з цим ключем існує на обʼєкті |
| `DoesNotExist` | На обʼєкті не існує мітки з цим ключем |

Наступні оператори можна використовувати лише з `nodeAffinity`.

|    Оператор    |    Поведінка    |
| :------------: | :-------------: |
| `Gt` | Значення поля буде інтерпретовано як ціле число, і це ціле число, отримане в результаті обробки значення мітки, визначеної цим селектором, буде більшим ніж це ціле число. |
| `Lt` | Значення поля буде інтерпретовано як ціле число, і це ціле число, отримане в результаті обробки значення мітки, визначеної цим селектором, буде меншим ніж це ціле число. |

{{< note >}}
Оператори `Gt` та `Lt` не працюватимуть з нецілими значеннями. Якщо дане значення не вдається розібрати як ціле число, Pod не вдасться запланувати. Крім того, `Gt` та `Lt` не доступні для `podAffinity`.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [taint та toleration](/docs/concepts/scheduling-eviction/taint-and-toleration/).
- Прочитайте документи про [спорідненісь вузлів](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md) та про [між-Podʼову (анти)спорідненість](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
- Дізнайтеся, як [менеджер топології](/docs/tasks/administer-cluster/topology-manager/) бере участь у рішеннях з розподілу ресурсів на рівні вузлів.
- Навчиться використовувати [nodeselector](/docs/tasks/configure-pod-container/assign-pods-nodes/).
- Навчиться використовувати [спорідненісь та антиспорідненісь](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).
