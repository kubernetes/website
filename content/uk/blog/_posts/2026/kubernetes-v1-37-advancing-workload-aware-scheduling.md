---
layout: blog
title: "Kubernetes v1.37: Розширення можливостей Workload-Aware Scheduling"
draft: true
slug: kubernetes-v1-37-advancing-workload-aware-scheduling
author: >
  Antoni Zawodny (Google),
  Bartosz Rejman (Google),
  Heba Elayoty (Microsoft),
  Jon Huhn (Microsoft),
  Maciej Skoczeń (Google),
  Maciej Wyrzuc (Google),
  Matt Matejczyk (Google)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

AI/ML (Штучний інтелект та машинне навчання), а також складні пакетні робочі навантаження продовжують розширювати межі можливостей планування в Kubernetes. Після фундаментальних покращень, спрямованих на робочі навантаження, представлених у попередніх релізах, Kubernetes v1.37 знаменує наступну важливу віху на шляху Workload-Aware Scheduling (WAS — планування з урахуванням робочих навантажень). У цьому релізі основні API Workload та PodGroup, що забезпечують групове планування (gang scheduling), а також Workload-Aware Preemption (WAP — витіснення з урахуванням робочих навантажень) та спільні DRA ResourceClaims для PodGroup переходять в статус Beta, закріплюючи свою роль у екосистемі Kubernetes.

Для вирішення ієрархічних вимог планування сучасних високопродуктивних розподілених робочих навантажень, v1.37 вводить новий API [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/). Цей новий API дозволяє виражати багаторівневі топологічні обмеження, групове планування та політики витіснення для складних, гетерогенних груп Podʼів. Важливо, що це архітектурне розширення розблоковує нативну підтримку планування для розширених структур робочих навантажень, які зазвичай керуються API вищих рівнів, такими як JobSet та LeaderWorkerSet (LWS).

Окрім цих доповнень до API, версія 1.37 спрямована на спрощення впровадження завдяки новому набору _API для інтеграції контролерів_ та бібліотеки Go `workloadbuilder`. Вони надають стандартизовані будівельні блоки, які значно спрощують те, як сторонні контролери можуть інтегруватися з можливостями WAS. Використовуючи ці нові інструменти, інтеграція нативного контролера Job була оновлена для повного використання розширених API WAS, включаючи розширені політики планування, гнучкі режими витіснення та планування з урахуванням топології для стандартних пакетних робочих навантажень.

## Групове планування та API Workload / PodGroup {#gang-scheduling-and-workload-podgroup-apis}

Kubernetes v1.37 досягає важливої віхи: [Workload](/docs/concepts/workloads/workload-api/) / [PodGroup](/docs/concepts/workloads/podgroup-api/) API та _групове планування_ офіційно переходять в Beta. Цей перехід сигналізує про те, що нативне планування "все або нічого" для робочих навантажень стабілізується для ширшого впровадження.

Ключові оновлення API та алгоритму групового планування у цьому релізі включають:

### Перехід в Beta та зміни версій API {#beta-graduation-and-api-versioning-changes}

Основні API Workload та PodGroup були оновлені до версії v1beta1, що означає, що вони тепер знаходяться за крок від загальної доступності (General Availability, GA). Тим, хто першими почав тестувати ці функції, слід звернути увагу на зміну альфа-версії: v1alpha2 була повністю замінена на v1alpha3. Цей перехід вносить кардинальні зміни, розроблені для очищення структури API навколо `disruptionMode`.

### Вбудована система черг PodGroup {#native-podgroup-queueing}

Значне внутрішнє вдосконалення у версії 1.37 робить PodGroup повноправним елементом у черзі планування. Раніше, навіть якщо вони належали до PodGroup, всі Podʼи-члени додавались до черги індивідуально. Тепер в чергу додається лише обʼєкт верхнього рівня PodGroup. Це гарантує, що всі Podʼи мають однакову поведінку додавання в чергу і закладає основу для більш досконалих стратегій обробки черги PodGroup у майбутньому.

### Динамічна еластичність із можливістю зміни значення minCount{#dynamic-elasticity-with-mincount-mutability}

У попередніх ітераціях поле `minCount`, яке диктує мінімальну кількість Podʼів, необхідну для успішного планування PodGroup, було строго незмінним. У v1.37 `minCount` тепер є змінюваним. Ця зміна API розблоковує гнучкість для еластичних робочих навантажень. Контролери тепер можуть динамічно коригувати мінімальний необхідний розмір групи "на льоту", дозволяючи робочим навантаженням відповідним чином зменшуватись або розширюватися без переривання роботи вже запланованих Podʼів.

## Витіснення з урахуванням робочих навантажень {#workload-aware-preemption}

У Kubernetes v1.37 окрема функціональна можливість [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/) для _витіснення з урахуванням робочих навантажень_ була обʼєднана з `GenericWorkload`, ставши основною частиною зусиль з групового планування.

Поки основні концепції витіснення з урахуванням робочих навантажень залишаються тими самими, існують деякі відмінності між релізами v1.36 та v1.37:

### Продуктивність та оптимальність {#performance-and-optimality}

Щоб перевірити, чи може preemptor (витісняючий Pod) поміститися в кластері завдяки витісненню, планувальник моделює видалення всіх потенційних жертв і повторно запускає алгоритм планування. Після цього він намагається відновити роботу якомога більшої кількості жертв. У версії v1.36 алгоритм планування запускався для кожного відновлення жертви, перевіряючи, чи зможе алгоритм, з урахуванням відновленої жертви, все ще знайти прийнятне розміщення для preemptor. У v1.37 алгоритм планування запускається лише один раз і Podʼи preemptor оцінюються на основі його виводу. Пізніше перевірка відновлення жертви визначає, чи може жертва все ще працювати на своєму місці з урахуванням попереднього припущення щодо preemptor.

### PodGroup як жертва {#podgroup-as-a-victim}

Однією з обмежень v1.36 було те, що стандартне витіснення для окремих Podʼів не було свідомим щодо PodGroup і не враховувало їхні поля `disruptionMode`, дозволяючи витісняти окремі Podʼи навіть тоді, коли PodGroup мав `disruptionMode: {all: {}}` встановленим. Kubernetes v1.37 усуває це обмеження; стандартне витіснення тепер враховує поле PodGroup `disruptionMode`.

### Перейменування полів `disruptionMode` {#rename-of-the-disruptionmode-fields}

Під час переходу API на бета-версію поле `disruptionMode` було змінено, щоб відокремити його назву від об’єкта PodGroup, що дозволило забезпечити узгодженість назв у PodGroups та CompositePodGroups. Режими змінилися наступним чином: `PodGroup` став `all`, а `Pod` — `single`.

### Підтримка `preemptionPolicy` {#support-for-preemptionpolicy}

У v1.36 PodGroup не мав поля `preemptionPolicy`. PodGroup міг виконувати витіснення, доки жоден з Podʼів, що його формують, не мав встановленого `preemptionPolicy: Never`. У v1.37, коли [`PodGroupPreemptionPolicy`](/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy) ця функціональна можливість увімкнена, PodGroup також має поле `preemptionPolicy`. Воно слугує авторитетним полем для того щоб вирішити, чи може PodGroup виконувати витіснення.

## CompositePodGroup API {#compositepodgroup-api}

У Kubernetes v1.36, планування з урахуванням робочого навантаження (workload-aware scheduling) встановало чисте розділення між статичними шаблонами робочих навантажень (Workload) та станом груп під час виконання (PodGroup), але підтримувані політики планування були обмежені одиночним, пласким групуванням. CompositePodGroup API, представлений у Kubernetes v1.37, розширює цю модель для підтримки ієрархічних вимог планування.

Цей API дозволяє його споживачам виражати багаторівневі вимоги планування, організовуючи робоче навантаження в ієрархічно-структуровану дерево-подібну ієрархію, що складається з обʼєктів CompositePodGroup та PodGroup. Кожен CompositePodGroup несе політики та обмеження, що застосовуються до інших груп (CompositePodGroups та/або PodGroups), подібно до того, як PodGroups управляють поведінкою планування для пласкої групи Podʼів. Планувальник обробляє таку ієрархію як єдину одиницю планування і прагне задовольнити вимоги, зазначені кожною групою в межах цієї ієрархії.

### Визначення ієрархії робочого навантаження {#defining-a-workload-hierarchy}

Для вираження багаторівневих вимог планування, ви визначаєте ієрархію шаблонів у обʼєкті Workload. Контролери потім створюють відповідні обʼєкти CompositePodGroup та PodGroup з цієї ієрархії.

Для цього API Workload розширено полем `spec.compositePodGroupTemplates`. Кожен CompositePodGroupTemplate визначає шаблон для батьківської CompositePodGroup і безпосередньо вкладає шаблони (`podGroupTemplates` та/або `compositePodGroupTemplates`), від яких походять його дочірні групи.

Нижче наведено приклад обʼєкта Workload, що визначає дворівневу ієрархію шаблонів:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: Workload
metadata:
  name: example-workload
  annotations:
    kubernetes.io/description: "Two-level workload hierarchy requiring 4 worker Pods and 1 driver Pod to schedule together."
spec:
  compositePodGroupTemplates:
    - name: workload-root
      schedulingPolicy:
        gang:
          minGroupCount: 2
      podGroupTemplates:
        - name: workers
          schedulingPolicy:
            gang:
              minCount: 4
        - name: driver
          schedulingPolicy:
            gang:
              minCount: 1
```

Після створення `example-workload` контролер може генерувати відповідні об’єкти груп виконання на основі цих шаблонів:

1. Кореневий CompositePodGroup, що посилається на шаблон `workload-root` в `example-workload` та несе його політику планування на рівні групи (gang scheduling з `minGroupCount: 2`):

    ```yaml
    apiVersion: scheduling.k8s.io/v1alpha3
    kind: CompositePodGroup
    metadata:
      name: example-root-group
      annotations:
        kubernetes.io/description: "Root group coordinating gang scheduling across child worker and driver PodGroups."
    spec:
      workloadRef:
        workloadName: example-workload
        templateName: workload-root
      schedulingPolicy:
        gang:
          minGroupCount: 2
    ```

2. Два дочірніх обʼєкти PodGroup (`example-workload-workers` та `example-workload-driver`), що посилаються на свої відповідні листкові шаблони в `example-workload` та повʼязуються з кореневою групою через `parentCompositePodGroupName`:

    ```yaml
    apiVersion: scheduling.k8s.io/v1beta1
    kind: PodGroup
    metadata:
      name: example-workload-workers
      annotations:
        kubernetes.io/description: "Worker group requiring at least 4 Pods to be scheduled together."
    spec:
      parentCompositePodGroupName: example-root-group
      workloadRef:
        workloadName: example-workload
        templateName: workers
      schedulingPolicy:
        gang:
          minCount: 4
    ---
    apiVersion: scheduling.k8s.io/v1beta1
    kind: PodGroup
    metadata:
      name: example-workload-driver
      annotations:
        kubernetes.io/description: "Driver group requiring 1 Pod to schedule alongside the workers."
    spec:
      parentCompositePodGroupName: example-root-group
      workloadRef:
        workloadName: example-workload
        templateName: driver
      schedulingPolicy:
        gang:
          minCount: 1
    ```

### Як працює багаторівневе групове планування {#how-multi-level-gang-scheduling-works}

Для планування ієрархічного робочого навантаження, `kube-scheduler` оцінює все дерево груп як єдину одиницю планування:

* **Рекурсивна оцінка**: Планувальник обходить ієрархію від кореневого CompositePodGroup аж до кінцевих обʼєктів PodGroup. На кожному рівні батьківський CompositePodGroup вважається таким, що підлягає плануванню, лише тоді, коли його дочірні групи відповідають його політиці планування (наприклад, розміщення щонайменше `minGroupCount` дочірніх груп при використанні групової політики), тоді як кожен кінцевий PodGroup повинен відповідати власній політиці на рівні Pod (наприклад, розміщення щонайменше `minCount` Podʼів-учасників при використанні групової політики).
* **Планування за принципом «все або нічого»**: щойно знайдено дійсну комбінацію дочірніх груп, яка задовольняє вимоги кореневої CompositePodGroup, Podʼи по всій ієрархії плануються та прив’язуються атомарно. Якщо коренева група не може задовольнити обмеження своєї політики, уся ієрархія залишається непридатною для планування, і жодні Podʼи не прив’язуються, що запобігає частковим розгортанням та виникненню блокувань.

### Витіснення з урахуванням робочих навантажень для CompositePodGroup API {#workload-aware-preemption-for-the-compositepodgroup-api}

Kubernetes v1.37 розширює витіснення з урахуванням робочих навантажень для підтримки ієрархій CompositePodGroup. Конкретно, якщо CompositePodGroup не може бути запланований через недостатню потужність кластера, планувальник може викликати витіснення для витіснення робочих навантажень з нижчою пріоритетністю, щоб розмістити Podʼи, що належать до цього CompositePodGroup.

CompositePodGroup також може бути обраний для витіснення. Для визначення бажаної поведінки під час витіснення, власники робочих навантажень можуть вказати відповідний `disruptionMode` в spec CompositePodGroup:

* **`single`**: Дозволяє незалежно призупиняти роботу та переривати роботу окремих груп дочірніх процесів у складі CompositePodGroup. Це поведінка, коли `disruptionMode` не встановлено.
* **`all`**: Забезпечує семантику витіснення «все або нічого» у межах цілої ієрархії CompositePodGroup. Якщо будь-який Pod в дочірньому піддереві має бути витіснений, планувальник витісняє всі Podʼи з усієї ієрархії.

## Планування з урахуванням топології {#topology-aware-scheduling}

У Kubernetes v1.37, планування з урахуванням топології розширюється для підтримки складних, багаторівневих ієрархій робочих навантажень та надає покращення продуктивності для наявнихї однорівневих розгортань.

### Багаторівневе планування з урахуванням топології {#multi-level-topology-aware-scheduling}

У версії Kubernetes v1.36 було впроваджено базове планування з урахуванням топології, що дозволяє визначати обмеження щодо розміщення безпосередньо на рівні PodGroup. Хоча це ефективно для однорівневих групувань, складні розподілені робочі навантаження — такі як масштабне навчання моделей штучного інтелекту та машинного навчання, розгортання JobSet або дезагреговане інференційне обчислення за допомогою LeaderWorkerSet (LWS) — часто вимагають одночасного розміщення на декількох рівнях інфраструктури кластера.

Наприклад, може виникнути необхідність у виконанні всього робочого навантаження в межах однієї зони доступності, тоді як окремі частини цього навантаження (такі як певні групи робочих процесів або процеси драйверів) вимагають суворого розміщення в одних і тих самих серверних стійках.

У Kubernetes v1.37, поряд з новим CompositePodGroup API (`scheduling.k8s.io/v1alpha3`), планування з урахуванням топології розширюється для підтримки _багаторівневого планування з урахуванням топології_. Тепер ви можете виражати складні вимоги співрозташування, вказуючи топологічні обмеження на різних рівнях ієрархії груп.

### Розвʼязування топологічних обмежень зверху вниз {#top-down-topology-constraint-resolution}

Під час ієрархічного планування, `kube-scheduler` розвʼязує багаторівневі топологічні обмеження в манері **зверху вниз** (**top-down**). Конкретно, топологічні домени, що розглядаються під час планування дочірньої групи, обмежуються топологічним доменом, що відповідає розміщенню, що припускається батьківською групою.

### Конфігурація та виконання під час виконання {#configuration-and-runtime-execution}

Використовуючи оновлений Workload API (`scheduling.k8s.io/v1beta1`), ви можете налаштувати багаторівневі топологічні обмеження безпосередньо в `compositePodGroupTemplates`. У прикладі нижче, батьківський шаблон обмежує все робоче навантаження однією зоною доступності (`topology.kubernetes.io/zone`), тоді як дочірні шаблони для `workers` та `driver` обмежують їхні відповідні Podʼи серверними стійками (`topology.example.com/rack`) в межах обраної зони:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: Workload
metadata:
  name: multi-level-tas-workload
  namespace: job-ns
  annotations:
    kubernetes.io/description: "Workload defining zone-level co-location for the root group and rack-level co-location for child groups."
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    schedulingConstraints:
      topology:
      - key: topology.kubernetes.io/zone
    podGroupTemplates:
    - name: workers
      schedulingPolicy:
        gang:
          minCount: 8
      schedulingConstraints:
        topology:
        - key: topology.example.com/rack
    - name: driver
      schedulingPolicy:
        gang:
          minCount: 1
      schedulingConstraints:
        topology:
        - key: topology.example.com/rack
```

Коли контролер створює екземпляр цього робочого навантаження під час виконання, він породжує відповідні обʼєкти часу виконання з цих шаблонів:

1. Кореневий CompositePodGroup, що посилається на шаблон `root`, несе обмеження топології зони доступності та ієрархічну політику gang scheduling.
2. Два дочірніх обʼєкти PodGroup (`tas-workload-workers` та `tas-workload-driver`), кожен з яких посилається на кореневий CompositePodGroup як свою батьківську групу через поле spec `parentCompositePodGroupName`:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: tas-workload-root
  namespace: job-ns
  annotations:
    kubernetes.io/description: "Root group constraining the entire workload to a single availability zone."
spec:
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
  schedulingConstraints:
    topology:
    - key: topology.kubernetes.io/zone
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: tas-workload-workers
  namespace: job-ns
  annotations:
    kubernetes.io/description: "Worker group requiring 8 Pods co-located within a single rack in the selected zone."
spec:
  parentCompositePodGroupName: tas-workload-root
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: workers
  schedulingPolicy:
    gang:
      minCount: 8
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: tas-workload-driver
  namespace: job-ns
  annotations:
    kubernetes.io/description: "Driver group requiring 1 Pod placed in a rack within the selected zone."
spec:
  parentCompositePodGroupName: tas-workload-root
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: driver
  schedulingPolicy:
    gang:
      minCount: 1
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
```

Під час планування планувальник аналізує декілька можливих зон доступності в кластері для `tas-workload-root`. Для кожної з таких зон він поділяє вузли за топологією стійок, щоб визначити можливі варіанти розміщення `tas-workload-workers` та `tas-workload-driver` виключно в межах цієї зони, систематично оцінюючи різні комбінації доступних зон і стійок перед прийняттям рішення щодо планування.

Дозволяючи моделювати топологічні обмеження ієрархічно, Kubernetes v1.37 надає структурований спосіб вираження багаторівневих вимог співрозташування по складних кластерних інфраструктурах.

### Покращення продуктивності для однорівневого TAS {#performance-improvements-for-single-level-tas}

Поряд із впровадженням багаторівневих ієрархій у версії Alpha, Kubernetes v1.37 знижує витрати на оцінку розміщення для наявного однорівневого планування з урахуванням топології. Ми постійно працюємо над оптимізацією ефективності алгоритмів оцінки розміщення в `kube-scheduler` і плануємо забезпечити подальше підвищення продуктивності в майбутніх версіях.

## API інтеграції контролерів {#controller-integration-apis}

Kubernetes v1.37 вводить нові стандартні будівельні блоки, щоб кожен контролер міг експонувати ті самі примітиви планування у своїх власних API та спільно використовувати ту саму логіку для їх перетворення в обʼєкти планування. Ці примітиви виражають конкретні поведінки планування, такі як політики або логіка витіснення, залишаючи іменування полів гнучким для кожного контролера. Прикладом є нативний Job контролер, який ми детально розглянемо в наступному розділі.

Типи з префіксом `WorkloadPodGroup` описують кінцеву групу Podʼів; типи з префіксом `WorkloadCompositePodGroup` описують групу груп. Контролер вбудовує їх без змін в свій власний API, під будь-яким іменем поля, що відповідає його домену:

* `WorkloadPodGroupSchedulingPolicy` — або `basic`, що означає стандартне Pod-by-Pod планування, або `gang` з `minCount`. Композитний варіант приймає `minGroupCount` замість цього.
* `WorkloadPodGroupSchedulingConstraints` — топологічні обмеження (`topology[].key`), в межах яких Pod групи мають бути співрозташовані.
* `WorkloadPodGroupDisruptionMode` — `single` або `all`, з семантикою витіснення, описаною раніше в цьому пості.
* `WorkloadPodGroupResourceClaim` — ResourceClaims, спільні для всієї групи.

Спільні лише форми (shapes), тому контролери зберігають повну автономію щодо того, як вони іменують та вкладають ці поля у своїх власних API.

**Бібліотека `workloadbuilder`** перетворює цей намір на об’єкти планування. Контролер описує своє робоче навантаження у вигляді дерева вузлів `WorkloadItem` — вузол із дочірніми елементами компілюється в `CompositePodGroupTemplate`, а вузол без дочірніх елементів — у `PodGroupTemplate` і додає до кожного вузла власні стандартні значення та надані користувачем будівельні блоки. Далі функція `Validate()` повідомляє про проблеми, вказуючи точний шлях до поля в рамках власного API контролера, `BuildWorkload()` компілює дерево в робоче навантаження, а `NewPodGroup()` та `NewCompositePodGroup()` створюють об’єкти груп для виконання.

Валідація є «стандартно заборонено» («deny-by-default»): контролер оголошує політики та режими витіснення, які він фактично підтримує, через `AllowedPolicies` та `AllowedDisruptionModes`, і все, що виходить за межі цих списків, відхиляється. Будуючі блоки, додані в майбутніх релізах, тому залишаються недоступними, доки контролер явно не підключиться до них.

Для ієрархічних робочих навантажень, де батьківський контролер володіє Workload і делегує створення груп своїм нащадкам, `NewBuilderFromExistingWorkload` дозволяє нашадку матеріалізувати лише свій власний PodGroup з Workload пращура.

Ні будівельні блоки, ні бібліотека не мають власної функціональної можливості; вони стають видимими для користувача через той контролер, який їх приймає. Нативний Job контролер є першим, хто це робить, докладніше в наступному розділі.

## Інтеграція з Job контролером {#integration-with-the-job-controller}

На основі нових API-інтерфейсів інтеграції контролерів у Job API тепер передбачено явне поле `.spec.scheduling`, завдяки чому ви можете самостійно вказати, як слід планувати завдання, замість того, щоб покладатися на те, що контролер завдань сам визначить це на основі структури завдання. Це розширює можливості підтримки далеко за межі статичних, індексованих та повністю паралельних завдань.

`.spec.scheduling` складається з будівельних блоків, описаних вище:

* `schedulingPolicy` — `basic` для стандартного Pod-by-Pod планування, або `gang` для планування "все або нічого".
* `schedulingConstraints` — топологічний домен, в межах якого Podʼи Job мають бути розташовані разом.
* `disruptionMode` — чи можуть Podʼи Job бути витіснені індивідуально (`single`) або тільки як єдине ціле (`all`).
* `resourceClaims` — ResourceClaims, спільні для всіх Podʼів Job.

Наприклад:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: distributed-training-job
  annotations:
    kubernetes.io/description: "Distributed Job using explicit WAS scheduling with gang policy and zone topology constraints."
spec:
  parallelism: 8
  completions: 8
  scheduling:
    schedulingPolicy:
      gang: {}                # minCount omitted → defaults to parallelism (8)
    schedulingConstraints:
      topology:
      - key: topology.kubernetes.io/zone
    disruptionMode:
      all: {}
  template:
    spec:
      containers:
      ...
```

Відсутність `.spec.scheduling`, або відсутність `schedulingPolicy` всередині нього, вибирає політику `basic`, яка поводиться так само, як стандартне планування Job сьогодні.

Для кожного Job, яким він керує, контролер компілює цю конфігурацію в Workload та PodGroup, які належать Job, і встановлює `.spec.schedulingGroup.podGroupName` на кожному Podʼі, який він створює, щоб планувальник обробляв їх як одну групу. Після створення, `.spec.scheduling` є незмінним, з одним винятком: `schedulingPolicy.gang.minCount` може бути оновлене, що дозволяє змінювати розмір запущеного gang.

## Підтримка DRA ResourceClaim для робочих навантажень {#dra-resourceclaim-support-for-workloads}

У міру вдосконалення основних API-інтерфейсів WAS вдосконалюється й їхня інтеграція з [Динамічним розподілом ресурсів](/docs/concepts/resource-management/dynamic-resource-allocation/) (DRA). У версії Kubernetes v1.36 було впроваджено функціональну можливість [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims). Відповідна функція дозволяє [ResourceClaims](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceclaims-templates) реплікувати та резервувати для цілих PodGroups, а також спільно використовувати всіма їхніми Podʼами-членами.

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-job-workers-pg
spec:
  ...
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
---
apiVersion: v1
kind: Pod
metadata:
  name: topology-aware-workers-pg-pod
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
```

У Kubernetes v1.37 функціональна можливість `DRAWorkloadResourceClaims` перейшла в Beta.

Хоча API та основна функціональність цієї функції залишаються незмінними, одна зміна усуває деяку потенційно несподівану поведінку під час вимкнення функції. Раніше, коли один із елементів `spec.resourceClaims` Podʼа посилався на ResourceClaimTemplate і збігався з одним із елементів `spec.resourceClaims` його PodGroup, а функціональна можливість `DRAWorkloadResourceClaims` була **відключена**, ResourceClaim створювався для Podʼа, а не для PodGroup. У цьому сценарії у версії v1.37 ResourceClaim взагалі не створюється. Ця зміна запобігає створенню Kubernetes великої кількості ResourceClaims на основі ResourceClaimTemplate та потенційному вичерпанню ресурсів DRA, коли заявка, призначена для спільного використання всією PodGroup, реплікується для кожного Podʼа у групі.

Для отримання додаткової інформації дивіться [документацію функції](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api#workload-resource-claims).

## Що далі? {#whats-next}

[Workload-Aware Scheduling Working Group](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/) (WG WAS) зараз фіналізує свої плани для циклу релізу Kubernetes v1.38. Хоча плани все ще формуються (залишайтеся з нами!), такі ключові ініціативи вже заплановані:

* **Перехід Workload та PodGroup API у статус GA:** Закріплення основної бази планування з урахуванням робочих навантажень як стабільного Kubernetes API.
* **Перехід Topology-Aware Scheduling (TAS) та CompositePodGroup (CPG) в Beta:** Приведення цих передових функцій розміщення та ієрархічного планування до стабільності Beta.
* **Перехід будівельних блоків інтеграції контролерів до Beta:** Подальше вдосконалення інтерфейсів інтеграції для забезпечення зручності розробки.
* **Збільшення впровадження та інтеграція:** Розширення екосистеми шляхом інтеграції планування з урахуванням робочих навантажень з іншими контролерами, з особливим фокусом на ієрархічних оркестраторах, таких як [JobSet](https://github.com/kubernetes-sigs/jobset).
* **Інтеграція з Kueue:** Просування тісної інтеграції між WAS та [Kueue](https://kueue.sigs.k8s.io/). У найближчій перспективі ми прагнемо забезпечити повне ознайомлення Kueue з функціональними можливостями WAS для безперебійної взаємодії. У довгостроковій перспективі ми плануємо, що Kueue використовуватиме WAS як базовий механізм для реалізації таких функцій, як групове планування та розміщення з урахуванням топології.

## Початок роботи {#getting-started}

Багато з покращень планування з урахуванням робочих навантажень тепер доступні як Beta-функції в v1.37, тоді як нові передові можливості вводяться в Alpha. І Beta, і Alpha функції тут стандартно вимкнені і вимагають ручного увімкнення.

**Beta-функції:**

* **Workload API, групове планування та витіснення:**
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload) — функціональна можливість (яка тепер інтегрує групове планування та витіснення з урахуванням робочих навантажень) є Beta і стандартно вимкнена на `kube-apiserver`, `kube-controller-manager` та `kube-scheduler`.   Переконайтеся, що ваші маніфести оновлені для використання `scheduling.k8s.io/v1beta1` {{< glossary_tooltip text="API group" term_id="api-group" >}}.
* **Підтримка DRA ResourceClaim для робочих навантажень:** Увімкніть
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) — функціональну можливість на `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` та `kubelet`.

**Alpha-функції:**

* **Планування з урахуванням топології:** Увімкніть
  [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling) — функціональну можливість на `kube-apiserver` та `kube-scheduler`.

* **CompositePodGroup API:** Увімкніть
  [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup) — функціональну можливість на `kube-apiserver`, `kube-controller-manager` та `kube-scheduler`, і переконайтеся, що версія API `scheduling.k8s.io/v1alpha3` увімкнена. Зверніть увагу, що увімкнення `CompositePodGroup` на `kube-controller-manager` також вимагає увімкнення функціональної можливості [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling).
* **Інтеграція Workload API з Job контролером:**
  Увімкніть функціональну можливість [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob) на `kube-apiserver` та `kube-controller-manager`.
* **PodGroup `preemptionPolicy`:**
  Увімкніть функціональну можливість [`PodGroupPreemptionPolicy`](/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy) на `kube-apiserver` та `kube-scheduler`.

**API інтеграції контролерів:**

Нова бібліотека `workloadbuilder` доступна для розробників, що будують як out-of-tree, так і in-tree контролери, які хочуть інтегруватися з WAS. Вона не вимагає функціональної можливості. Ви можете дослідити бібліотеку та знайти приклади використання безпосередньо в репозиторії [`kubernetes/component-helpers`](https://github.com/kubernetes/component-helpers/tree/master/scheduling/schedulingv1/workloadbuilder).

Ми заохочуємо вас спробувати планування з урахуванням робочих навантажень у ваших тестових кластерах та поділитися вашим досвідом, щоб допомогти сформувати майбутнє планування Kubernetes. Ви можете надіслати ваш відгук:

* Звертаючись через [Slack (#wg-workload-aware-scheduling)](https://kubernetes.slack.com/archives/C0AHLJ0EAEL).
* Приєднуючись до [WG Workload-Aware Scheduling](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/) або [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) зустрічей.
* Створіть новий [тікет](https://github.com/kubernetes/kubernetes/issues) у репозиторії Kubernetes.

## Дізнайтеся більше {#learn-more}

Для глибшого занурення в архітектуру та дизайн цих функцій, прочитайте KEPs:

* [KEP-4671: Gang Scheduling Support in Kubernetes](https://www.kubernetes.dev/resources/keps/4671/)
* [KEP-5710: Workload-aware preemption](https://www.kubernetes.dev/resources/keps/5710/)
* [KEP-5732: Topology-aware workload scheduling](https://www.kubernetes.dev/resources/keps/5732/)
* [KEP-6012: CompositePodGroup API](https://www.kubernetes.dev/resources/keps/6012/)
* [KEP-6089: WAS: Controller Integration APIs](https://www.kubernetes.dev/resources/keps/6089/)
* [KEP-5547: WAS: Integrate Workload APIs with Job controller](https://www.kubernetes.dev/resources/keps/5547/)
* [KEP-5729: DRA: ResourceClaim Support for Workloads](https://www.kubernetes.dev/resources/keps/5729/)
