---
title: Taints та Tolerations
content_type: concept
weight: 50
---

<!-- overview -->
[_Спорідненість вузлів_ (node affinity)](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) — це властивість {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, яка _притягує_ їх до набору {{< glossary_tooltip text="вузлів" term_id="node" >}} (або як перевага, або як жорстка вимога). _Taints_ є протилежністю — вони дозволяють вузлу відштовхувати набір Podʼів.

_Tolerations_ застосовуються до Podʼів. Tolerations дозволяють планувальнику планувати Podʼи на вузли з відповідними taints. Tolerations дозволяють планування, але не гарантують його: планувальник також [оцінює інші параметри](/docs/concepts/scheduling-eviction/pod-priority-preemption/) в межах своєї роботи.

Taints та tolerations працюють разом, щоб Podʼи не планувалися на непридатні вузли. На вузол накладається один або кілька taints; це означає, що вузол не повинен приймати жодних Podʼів, які не толерують ці taints.

<!-- body -->

## Концепції {#concepts}

Ви додаєте taint до вузла за допомогою [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint). Наприклад,

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

додає taint до вузла `node1`. Taint має ключ `key1`, значення `value1` і ефект taint `NoSchedule`. Це означає, що жодний Pod не зможе розміститись на `node1`, якщо він не має відповідної toleration.

Щоб видалити taint, доданий командою вище, можна виконати:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

Ви вказуєте toleration для Podʼа в PodSpec. Обидві наступні tolerations «відповідають» taint, створеному за допомогою команди `kubectl taint` вище, тому Pod з будь-якою з них зможе розміститись на `node1`:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

Стандартний планувальник Kubernetes бере до уваги taints та tolerations під час вибору вузла для запуску певного Podʼа. Проте, якщо ви вручну вказуєте `.spec.nodeName` для Podʼа, ця дія оминає планувальник; Pod тоді привʼязується до вузла, на який ви його призначили, навіть якщо на вибраному вами вузлі є taints типу `NoSchedule`. Якщо це трапиться і на вузлі також встановлено taint типу `NoExecute`, kubelet виселить Pod, якщо не встановлено відповідну toleration.

Ось приклад Podʼа, у якого визначено деякі tolerations:

{{% code_sample file="pods/pod-with-toleration.yaml" %}}

Стандартне значення для `operator` — `Equal`.

Toleration «відповідає» taint, якщо ключі однакові та ефекти однакові, і:

* `operator` — `Exists` (у цьому випадку не слід вказувати `value`), або
* `operator` — `Equal`, а значення мають бути рівні.

{{< note >}}

Є два спеціальних випадки:

Якщо `key` порожній, то `operator` має бути `Exists`, що відповідає всім ключам і значенням. Зверніть увагу, що `effect` все одно має збігатися.

Порожній `effect` відповідає всім ефектам з ключем `key1`.

{{< /note >}}

У наведеному вище прикладі використовувався `effect` `NoSchedule`. Також можна використовувати `effect` `PreferNoSchedule`.

Дозволені значення для поля `effect`:

`NoExecute`
: Це впливає на Podʼи, які вже запущені на вузлі, таким чином:

  * Podʼи, які не толерують taint, негайно виселяються
  * Podʼи, які толерують taint, не вказуючи `tolerationSeconds` в їхній специфікації toleration, залишаються привʼязаними назавжди
  * Podʼи, які толерують taint із вказаним `tolerationSeconds`, залишаються привʼязаними протягом зазначеного часу. Після закінчення цього часу контролер життєвого циклу вузла виселяє Podʼи з вузла.

`NoSchedule`
: На вузол із taint не буде заплановано нові Podʼи, якщо вони не мають відповідної toleration. Podʼи, які вже працюють на вузлі, **не** виселяються.

`PreferNoSchedule`
: `PreferNoSchedule` — це «preference» або «soft» варіант `NoSchedule`. Панель управління _спробує_ уникнути розміщення на вузлі Podʼа, який не толерує taint, але це не гарантовано.

На один вузол можна накласти кілька taints, а на один Pod — кілька tolerations. Kubernetes обробляє кілька taints і tolerations подібно до фільтра: спочатку беруться всі taints вузла, потім ігноруються ті, для яких Pod має відповідну toleration; решта неігнорованих taints мають зазначені ефекти на Pod. Зокрема,

* якщо є принаймні один неігнорований taint з ефектом `NoSchedule`, тоді Kubernetes не буде планувати Pod на цей вузол
* якщо немає неігнорованих taints з ефектом `NoSchedule`, але є принаймні один неігнорований taint з ефектом `PreferNoSchedule`, тоді Kubernetes _спробує_ не планувати Pod на цей вузол
* якщо є принаймні один неігнорований taint з ефектом `NoExecute`, тоді Pod буде виселено з вузла (якщо він вже працює на вузлі), і він не буде плануватися на вузол (якщо він ще не працює на вузлі).

Наприклад, уявіть, що ви накладаєте taint на вузол таким чином

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

І Pod має дві tolerations:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

У цьому випадку Pod не зможе плануватися на вузол, оскільки відсутня toleration, яка відповідає третьому taint. Але він зможе продовжувати працювати, якщо він вже працює на вузлі, коли до нього додається taint, оскільки третій taint — єдиний з трьох, який не толерується Podʼом.

Зазвичай, якщо до вузла додається taint з ефектом `NoExecute`, то будь-які Podʼи, які не толерують taint, будуть негайно виселені, а Podʼи, які толерують taint, ніколи не будуть виселені. Однак toleration з ефектом `NoExecute` може вказувати необовʼязкове поле `tolerationSeconds`, яке визначає, як довго Pod буде привʼязаний до вузла після додавання taint. Наприклад,

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

означає, що якщо цей Pod працює і до вузла додається відповідний taint, то Pod залишиться привʼязаним до вузла протягом 3600 секунд, а потім буде виселений. Якщо taint видаляється до цього часу, то Pod не буде виселений.

## Оператори числового порівняння {#numeric-comparison-operators}

{{< feature-state feature_gate_name="TaintTolerationComparisonOperators" >}}

Окрім `Equal` та `Exists`, ви можете використовувати числові оператори порівняння (`Gt` та `Lt`) для зіставлення taints із цілими значеннями. Це корисно для планування на основі порогових значень, наприклад для зіставлення вузлів за рівнем надійності або рівнем SLA.

* `Gt` спрацьовує, коли значення taint більше за значення toleration.
* `Lt` спрацьовує, коли значення taint менше за значення toleration.

Для числових операторів значення toleration та taint повинні бути дійсними цілими числами. Якщо одне зі значень не може бути розібране як ціле число, toleration не збігається.

{{< note >}}
Коли ви створюєте Pod, який використовує оператори tolerations `Gt` або `Lt`, API-сервер перевіряє, чи є значення toleration дійсними цілими числами. Значення taint на вузлах не перевіряються під час реєстрації вузлів. Якщо вузол має нечислове значення taint (наприклад, `servicelevel.organization.example/agreed-service-level=high:NoSchedule`), Podʼи з числовими операторами порівняння не відповідатимуть цьому taint і не зможуть плануватися на цьому вузлі.
{{< /note >}}

Наприклад, якщо на вузли накладено taint зі значенням, що представляє угоду про рівень обслуговування (SLA):

```shell
kubectl taint nodes node1 servicelevel.organization.example/agreed-service-level=950:NoSchedule
```

Pod може толерувати вузли з SLA більше 900:

{{% code_sample file="pods/pod-with-numeric-toleration.yaml" %}}

Ця toleration відповідає taint на `node1`, оскільки `950 > 900` (значення taint більше за значення toleration для оператора `Gt`). Аналогічно, ви можете використовувати оператор `Lt` для зіставлення taints, де значення taint менше за значення toleration:

```yaml
tolerations:
- key: "servicelevel.organization.example/agreed-service-level"
  operator: "Lt"
  value: "1000"
  effect: "NoSchedule"
```

{{< note >}}
Під час використання числових операторів порівняння:

* Значення toleration та taint повинні бути дійсними 64-бітними цілими числами зі знаком (нульові цифри на початку (наприклад, "0550") не допускаються).
* Якщо значення не може бути розібране як ціле число, toleration не збігається.
* Числові оператори працюють з усіма ефектами taint: `NoSchedule`, `PreferNoSchedule` та `NoExecute`.
* Для `PreferNoSchedule` з числовими операторами: якщо toleration Podʼа не задовольняє числове порівняння (наприклад, значення taint < значення toleration під час використання `Gt`), планувальник надає вузлу нижчий пріоритет, але все одно може планувати там, якщо немає кращих варіантів.
{{< /note >}}

{{< warning >}}

Перед вимкненням функціональної можливості `TaintTolerationComparisonOperators`:

* Ви повинні ідентифікувати всі робочі навантаження, що використовують оператори `Gt` або `Lt`, щоб уникнути гарячих циклів контролера.
* Оновіть усі шаблони контролерів робочих навантажень, щоб замість них використовувати оператори `Equal` або `Exists`.
* Видаліть усі Podʼи в стані очікування, які використовують оператори `Gt` або `Lt`.
* Стежте за метрикою `apiserver_request_total`, щоб виявити сплески помилок перевірки.
{{< /warning >}}

## Приклади використання {#example-use-cases}

Taints та tolerations є гнучким способом спрямовувати Podʼи *геть* від вузлів або виселяти Podʼи, які не повинні працювати. Деякі з варіантів використання:

* **Виділені вузли**: Якщо ви хочете виділити певний набір вузлів для виключного використання конкретним набором користувачів, ви можете додати taint на ці вузли (наприклад, `kubectl taint nodes nodename dedicated=groupName:NoSchedule`) і потім додати відповідну toleration до їхніх Podʼів (це найпростіше зробити за допомогою власного [контролера допуску](/docs/reference/access-authn-authz/admission-controllers/)). Podʼам із tolerations буде дозволено використовувати вузли з taints (виділені), а також будь-які інші вузли в кластері. Якщо ви хочете виділити вузли для них _та_ забезпечити, щоб вони використовували _лише_ виділені вузли, то вам слід додатково додати мітку, аналогічну taint, до того ж набору вузлів (наприклад, `dedicated=groupName`), і контролер допуску повинен додатково додати спорідненість вузлів, щоб вимагати, щоб Podʼи могли плануватися лише на вузли з міткою `dedicated=groupName`.

* **Вузли зі спеціальним обладнанням**: У кластері, де невелика підмножина вузлів має спеціалізоване обладнання (наприклад, GPU), бажано утримувати Podʼи, які не потребують спеціалізованого обладнання, поза цими вузлами, щоб залишити місце для Podʼів, що надійдуть пізніше й дійсно потребують спеціалізованого обладнання. Це можна зробити, накладаючи taints на вузли зі спеціалізованим обладнанням (наприклад, `kubectl taint nodes nodename special=true:NoSchedule` або `kubectl taint nodes nodename special=true:PreferNoSchedule`) і додаючи відповідну toleration до Podʼів, які використовують спеціалізоване обладнання. Як і у випадку з виділеними вузлами, найпростіше застосовувати tolerations за допомогою власного [контролера допуску](/docs/reference/access-authn-authz/admission-controllers/). Наприклад, рекомендується використовувати [Розширені ресурси](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
для представлення спеціального обладнання, накладати на вузли зі спеціальним обладнанням taint з назвою розширеного ресурсу і запускати контролер допуску [ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration). Тепер, оскільки на вузлах є taints, жоден Pod без toleration не буде плануватися на них. Але коли ви надсилаєте Pod, який запитує розширений ресурс, контролер допуску `ExtendedResourceToleration` автоматично додасть правильну toleration до Podʼа і цей Pod буде плануватися на вузли зі спеціальним обладнанням. Це забезпечить, що ці вузли зі спеціальним обладнанням виділені для Podʼів, які запитують таке обладнання, і вам не потрібно вручну додавати tolerations до ваших Podʼів.

* **Виселення на основі taint**: Поведінка виселення, що налаштовується для кожного Podʼа, коли є проблеми з вузлом, яка описана в наступному розділі.

## Виселення на основі taint {#taint-based-evictions}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Контролер вузлів автоматично накладає taint на вузол, коли виконуються певні умови. Вбудованими є такі taints:

* `node.kubernetes.io/not-ready`: Вузол не готовий. Це відповідає тому, що NodeCondition `Ready` має значення "`False`".
* `node.kubernetes.io/unreachable`: Вузол недоступний для контролера вузлів. Це відповідає тому, що NodeCondition `Ready` має значення "`Unknown`".
* `node.kubernetes.io/memory-pressure`: На вузлі є тиск на памʼять.
* `node.kubernetes.io/disk-pressure`: На вузлі є тиск на диск.
* `node.kubernetes.io/pid-pressure`: На вузлі є тиск на PID.
* `node.kubernetes.io/network-unavailable`: Мережа вузла недоступна.
* `node.kubernetes.io/unschedulable`: Вузол непридатний для планування.
* `node.cloudprovider.kubernetes.io/uninitialized`: Коли kubelet запускається із «зовнішнім» хмарним провайдером, цей taint накладається на вузол, щоб позначити його як непридатний до використання. Після того як контролер з cloud-controller-manager ініціалізує цей вузол, kubelet видаляє цей taint.

Якщо вузол потрібно очистити, контролер вузлів або kubelet додає відповідні taints з ефектом `NoExecute`. Цей ефект стандартно додається для taints `node.kubernetes.io/not-ready` та `node.kubernetes.io/unreachable`. Якщо стан несправності повертається до норми, kubelet або контролер вузлів можуть видалити відповідні taints.

У деяких випадках, коли вузол недоступний, API-сервер не може спілкуватися з kubelet на вузлі. Рішення про видалення Podʼів не може бути передане до kubelet, доки звʼязок з API-сервером не буде відновлено. Протягом цього часу Podʼи, які заплановані для видалення, можуть продовжувати працювати на розділеному вузлі.

{{< note >}}
Панель управління обмежує швидкість додавання нових taints на вузли. Це обмеження швидкості керує кількістю виселень, які спричиняються, коли одночасно недоступно багато вузлів (наприклад, якщо відбувається збій мережі).
{{< /note >}}

Ви можете вказати `tolerationSeconds` для Podʼа, щоб визначити, як довго цей Pod залишається привʼязаним до несправного вузла або вузла, який не відповідає.

Наприклад, ви можете довго зберігати застосунок з великою кількістю локального стану, привʼязаного до вузла, у разі розділу мережі, сподіваючись, що розділ відновиться, і, таким чином, можна уникнути виселення Podʼа. Toleration, яку ви встановили для цього Podʼа, може виглядати так:

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
Kubernetes автоматично додає toleration для `node.kubernetes.io/not-ready` та `node.kubernetes.io/unreachable` з `tolerationSeconds=300`, якщо тільки ви або контролер не встановили ці tolerations явно.

Ці автоматично додані tolerations означають, що Podʼи залишаються привʼязаними до вузлів протягом 5 хвилин після виявлення однієї з цих проблем.
{{< /note >}}

Podʼи [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) створюються з tolerations `NoExecute` для таких taints без `tolerationSeconds`:

* `node.kubernetes.io/unreachable`
* `node.kubernetes.io/not-ready`

Це забезпечує, що Podʼи DaemonSet ніколи не будуть виселені через ці проблеми.

{{< note >}}
Контролер вузлів відповідав за додавання taints до вузлів і виселення Podʼів. Але після 1.29 реалізація виселення на основі taint була переміщена з контролера вузлів в окремий і незалежний компонент під назвою taint-eviction-controller. Користувачі можуть за бажанням вимкнути виселення на основі taint, встановивши `--controllers=-taint-eviction-controller` в kube-controller-manager.
{{< /note >}}

## Накладання taints на вузли за станами {#taint-nodes-by-condition}

Панель управління, використовуючи {{<glossary_tooltip text="контролер" term_id="controller">}} вузла, автоматично створює taints з ефектом `NoSchedule` для [станів вузла](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions).

Планувальник перевіряє taints, а не стани вузла, коли він приймає рішення про планування. Це забезпечує те, що стани вузла не впливають безпосередньо на планування. Наприклад, якщо стан вузла `DiskPressure` активний, панель управління додає taint `node.kubernetes.io/disk-pressure` і не планує нові Podʼи на уражений вузол. Якщо стан вузла `MemoryPressure` активний, панель управління додає taint `node.kubernetes.io/memory-pressure`.

Ви можете ігнорувати стани вузла для новостворених Podʼів, додавши відповідні tolerations Podʼів. Панель управління також додає toleration `node.kubernetes.io/memory-pressure` на Podʼи, які мають {{< glossary_tooltip text="клас якості обслуговування" term_id="qos-class" >}} інший, ніж `BestEffort`. Це тому, що Kubernetes вважає Podʼи у класах QoS `Guaranteed` або `Burstable` (навіть Podʼи без встановленого запиту на памʼять) здатними впоратися з тиском на памʼять, тоді як нові Podʼи `BestEffort` не плануються на уражений вузол.

Контролер DaemonSet автоматично додає наступні tolerations `NoSchedule` для всіх демонів, щоб запобігти порушенню роботи DaemonSets.

* `node.kubernetes.io/memory-pressure`
* `node.kubernetes.io/disk-pressure`
* `node.kubernetes.io/pid-pressure` (1.14 або пізніше)
* `node.kubernetes.io/unschedulable` (1.10 або пізніше)
* `node.kubernetes.io/network-unavailable` (_тільки для мережі хоста_)

Додавання цих tolerations забезпечує сумісність з попередніми версіями. Ви також можете додавати довільні tolerations до DaemonSets.

## Taints та tolerations пристроїв {#device-taints-and-tolerations}

Замість того, щоб накладати taints на цілі вузли, адміністратори можуть також [накладати taints на окремі пристрої](/docs/concepts/resource-management/dynamic-resource-allocation/device-taints/#device-taints-and-tolerations), коли кластер використовує [динамічне виділення ресурсів](/docs/concepts/resource-management/dynamic-resource-allocation/) для керування спеціальним обладнанням. Перевага полягає у тому, що taint можна спрямувати саме на те обладнання, яке є несправним або потребує обслуговування. Tolerations також підтримуються, і їх можна вказувати під час запиту пристроїв. Як і taints, вони застосовуються до всіх Podʼів, які спільно використовують один і той самий виділений пристрій.

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [Виселення внаслідок тиску на вузол](/docs/concepts/scheduling-eviction/node-pressure-eviction/) та як його налаштувати
* Ознайомтесь з [Пріоритетом Podʼа](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* Прочитайте про [taints та tolerations пристроїв](/docs/concepts/resource-management/dynamic-resource-allocation/device-taints/#device-taints-and-tolerations)
