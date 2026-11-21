---
title: Налаштування планувальника
content_type: concept
weight: 20

---

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Ви можете налаштувати поведінку `kube-scheduler`, написавши конфігураційний файл і передавши його шлях як аргумент командного рядка.

<!-- overview -->

<!-- body -->

Профіль планування дозволяє налаштувати різні етапи планування в {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}. Кожен етап доступний через точку розширення. Втулки забезпечують поведінку планування, реалізуючи одну або кілька таких точок розширення.

Ви можете вказати профілі планування, запустивши `kube-scheduler --config <filename>`, використовуючи структуру KubeSchedulerConfiguration [v1](/docs/reference/config-api/kube-scheduler-config.v1/).

Мінімальна конфігурація виглядає так:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

{{< note >}}
KubeSchedulerConfiguration v1beta3 застарів у v1.26 і вилучений у v1.29. Перенесіть KubeSchedulerConfiguration на [v1](/docs/reference/config-api/kube-scheduler-config.v1/).
{{< /note >}}

## Профілі {#profiles}

Профіль планування дозволяє налаштувати різні етапи планування в {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}. Кожен етап доступний через [точку розширення](#extension-points). [Втулки](#scheduling-plugins) забезпечують поведінку планування, реалізуючи одну або кілька таких точок розширення.

Ви можете налаштувати один екземпляр `kube-scheduler` для роботи з [кількома профілями](#multiple-profiles).

### Точки розширення {#extension-points}

Планування відбувається в кілька етапів, які доступні через такі точки розширення:

1. `queueSort`: Ці втулки надають функцію впорядкування, яка використовується для сортування очікуваних Podʼів у черзі планування. Одночасно може бути ввімкнений лише один втулок сортування черги.
1. `placementGenerate`: Ці втулки генерують потенційні розміщення (набори вузлів), де може бути запланована розглянута PodGroup. Ця точка розширення застосовується лише до планування PodGroup і вимагає ввімкнення планування Workload.
1. `placementScore`: Ці втулки оцінюють розміщення, запропоновані `placementGenerate`, щоб вибрати оптимальне розміщення для розглянутої PodGroup.
1. `preFilter`: Ці втулки використовуються для попередньої обробки або перевірки інформації про Pod або кластер перед фільтрацією. Вони можуть позначити Pod як непридатний для планування.
1. `filter`: Ці втулки еквівалентні Предикатам у політиці планування і використовуються для відсівання вузлів, які не можуть запустити Pod. Фільтри викликаються в налаштованому порядку. Pod позначається як непридатний для планування, якщо жоден вузол не пройшов усі фільтри.
1. `postFilter`: Ці втулки викликаються в налаштованому порядку, коли для Podʼа не знайдено відповідних вузлів. Якщо будь-який втулок `postFilter` позначає Pod як _придатний для планування_, решта втулків не викликаються. Ці втулки не застосовуються для Podʼів, які призначаються в рамках планування PodGroup.
1. `podGroupPostFilter`: Ці втулки викликаються в налаштованому порядку, коли не знайдено відповідного розміщення для групи Podʼів. Якщо будь-який втулок `podGroupPostFilter` позначає групу Podʼів як _придатну для планування_, решта втулків не викликаються. Ця точка розширення застосовується лише до планування PodGroup і вимагає ввімкнення планування Workload.
1. `preScore`: Це інформаційна точка розширення, яка може використовуватися для попередньої оцінки.
1. `score`: Ці втулки надають оцінку кожному вузлу, який пройшов етап фільтрації. Планувальник обере вузол з найвищою сумою зважених оцінок.
1. `reserve`: Це інформаційна точка розширення, яка повідомляє втулки, коли ресурси були зарезервовані для певного Podʼа. Втулки також реалізують виклик `Unreserve`, який викликається у випадку невдачі під час або після `Reserve`.
1. `permit`: Ці втулки можуть запобігти або затримати привʼязку Podʼа.
1. `preBind`: Ці втулки виконують будь-які роботи, необхідні перед привʼязкою Podʼа.
1. `bind`: Втулки привʼязують Pod до вузла. Втулки `bind` викликаються по черзі, і як тільки один з них виконає привʼязку, решта втулків пропускаються. Принаймні один втулок привʼязки обовʼязковий.
1. `postBind`: Це інформаційна точка розширення, яка викликається після привʼязки Podʼа.
1. `multiPoint`: Це поле лише для конфігурації, яке дозволяє ввімкнути або вимкнути втулки одночасно для всіх застосовних до них точок розширення.

Для кожної точки розширення ви можете вимкнути конкретні [типові втулки](#scheduling-plugins) або ввімкнути власні. Наприклад:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: PodTopologySpread
        enabled:
        - name: MyCustomPluginA
          weight: 2
        - name: MyCustomPluginB
          weight: 1
```

Ви можете використовувати `*` як імʼя в масиві вимкнених втулків, щоб вимкнути всі типові втулки для цієї точки розширення. Це також може бути використано для зміни порядку втулків, якщо це необхідно.

### Втулки планування {#scheduling-plugins}

Такі втулки, типово увімкнені, реалізують одну або більше з цих точок розширення:

- `ImageLocality`: Віддає перевагу вузлам, які вже мають образи контейнерів, що запускаються Podʼом. Точки розширення: `score`.
- `TaintToleration`: Реалізує
  [taints та tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/). Реалізує точки розширення: `filter`, `preScore`, `score`.
- `NodeName`: Перевіряє, чи відповідає імʼя вузла у специфікації Podʼа поточному вузлу. Точки розширення: `filter`.
- `NodePorts`: Перевіряє, чи має вузол вільні порти для запитуваних портів Podʼа. Точки розширення: `preFilter`, `filter`.
- `NodeAffinity`: Реалізує [nodeSelector](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  та [спорідненість вузлів](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity). Точки розширення: `filter`, `score`.
- `PodTopologySpread`: Реалізує [обмеження поширення топології Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/). Точки розширення: `preFilter`, `filter`, `preScore`, `score`.
- `NodeUnschedulable`: Відфільтровує вузли, які мають `.spec.unschedulable` встановлений на true. Точки розширення: `filter`.
- `NodeResourcesFit`: Для планування pod-by-pod перевіряє, чи має вузол усі ресурси, які запитує Pod. Оцінка може використовувати одну з трьох стратегій: `LeastAllocated` (типово), `MostAllocated` та `RequestedToCapacityRatio`. Для планування PodGroup обчислює використання ресурсів у всьому оціненому розміщенні. Оцінка використовує стратегію `MostAllocated`. Точки розширення: `preFilter`, `filter`, `score`, `placementScore`.
- `NodeResourcesBalancedAllocation`: Віддає перевагу вузлам, які отримають більш збалансоване використання ресурсів, якщо Pod буде заплановано на них. Точки розширення: `score`.
- `VolumeBinding`: Перевіряє, чи має вузол або чи може привʼязати запитувані {{< glossary_tooltip text="томи" term_id="volume" >}}. Точки розширення: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
  {{< note >}}
  Точка розширення `score` увімкнена, коли ввімкнена можливість `StorageCapacityScoring`. Вона надає пріоритет найменшим PV, які можуть відповідати запитуваному розміру тому.
  {{< /note >}}
- `VolumeRestrictions`: Перевіряє, чи задовольняють томи, змонтовані на вузлі, обмеження, специфічні для постачальника томів. Точки розширення: `filter`.
- `VolumeZone`: Перевіряє, чи задовольняють запитувані томи будь-які вимоги до зони, які вони можуть мати. Точки розширення: `filter`.
- `NodeVolumeLimits`: Перевіряє, чи можуть бути дотримані обмеження кількості томів CSI для вузла. Цей втулок також може запобігти розміщенню Podʼів на вузлі, якщо на ньому не встановлено драйвер CSI; для цього потрібно увімкнути функціональну можливість `VolumeLimitScaling`. Він також дозволяє кластерному автомасштабувальнику точно розрахувати кількість вузлів, необхідних для планування Podʼів в очікуванні з приєднуваними томами CSI. Точки розширення: `filter`.
- `EBSLimits`: Перевіряє, чи можуть бути дотримані обмеження кількості томів AWS EBS для вузла. Точки розширення: `filter`.
- `GCEPDLimits`: Перевіряє, чи можуть бути дотримані обмеження кількості томів GCP-PD для вузла. Точки розширення: `filter`.
- `AzureDiskLimits`: Перевіряє, чи можуть бути дотримані обмеження кількості томів дисків Azure для вузла. Точки розширення: `filter`.
- `InterPodAffinity`: Реалізує [спорідненість та антиспорідненість між Podʼами](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity). Точки розширення: `preFilter`, `filter`, `preScore`, `score`.
- `PrioritySort`: Забезпечує типове сортування за пріоритетами. Точки розширення: `queueSort`.
- `DefaultBinder`: Забезпечує типовий механізм привʼязки. Точки розширення: `bind`.
- `DefaultPreemption`: Забезпечує типовий механізм витіснення. Точки розширення: `postFilter`, `podGroupPostFilter`.
- `TopologyPlacement`: Забезпечує типовий механізм генерації розміщень для обмежень топології PodGroup. Точки розширення: `placementGenerate`.
- `PodGroupPodsCount`: Забезпечує алгоритм оцінки розміщень на основі кількості Podʼів, які можуть бути заплановані в даному розміщенні. Точки розширення: `placementScore`.

Ви також можете ввімкнути такі втулки через API конфігурації компонентів, які не увімкнені типово:

- `CinderLimits`: Перевіряє, чи можуть бути дотримані обмеження кількості томів [OpenStack Cinder](https://docs.openstack.org/cinder/) для вузла. Точки розширення: `filter`.

### Кілька профілів {#multiple-profiles}

Ви можете налаштувати `kube-scheduler` для роботи з кількома профілями. Кожен профіль має повʼязане імʼя планувальника і може мати різний набір втулків, налаштованих у його [точках розширення](#extension-points).

З такою зразковою конфігурацією планувальник буде працювати з двома профілями: один зі типовими втулками і один з усіма вимкненими втулками оцінювання (scoring).

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: no-scoring-scheduler
    plugins:
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

Podʼи, які хочуть бути заплановані відповідно до певного профілю, можуть включати відповідне імʼя планувальника у своєму полі `.spec.schedulerName`.

Типово створюється один профіль з іменем планувальника `default-scheduler`. Цей профіль включає типові втулки, описані вище. Під час оголошення більше одного профілю для кожного з них потрібно унікальне імʼя планувальника.

Якщо Pod не вказує імʼя планувальника, kube-apiserver встановить його на `default-scheduler`. Таким чином, для планування цих Podʼів повинен існувати профіль з цим імʼям планувальника.

{{< note >}}
Події планування Podʼа мають `.spec.schedulerName` як свій `reportingController`. Події для вибору лідера використовують імʼя планувальника з першого профілю в списку.

Докладніше дивіться розділ `reportingController` у [довіднику API Event](/docs/reference/kubernetes-api/cluster-resources/event-v1/).
{{< /note >}}

{{< note >}}
Усі профілі повинні використовувати той самий втулок у точці розширення `queueSort` і мати однакові параметри конфігурації (якщо це застосовується). Це повʼязано з тим, що планувальник має лише одну чергу Podʼів в очікуванні.
{{< /note >}}

### Втулки, які застосовуються до кількох точок розширення {#multipoint}

Починаючи з `kubescheduler.config.k8s.io/v1beta3`, у конфігурації профілю є додаткове поле `multiPoint`, яке дозволяє легко увімкнути або вимкнути втулок для кількох точок розширення. Метою конфігурації `multiPoint` є спрощення конфігурації для користувачів і адміністраторів під час використання власних профілів.

Розглянемо втулок `MyPlugin`, який реалізує точки розширення `preScore`, `score`, `preFilter` і `filter`. Щоб увімкнути `MyPlugin` для всіх доступних точок розширення, конфігурація профілю виглядає так:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: MyPlugin
```

Це рівносильно ручному ввімкненню `MyPlugin` для всіх його точок розширення, як показано нижче:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      preScore:
        enabled:
        - name: MyPlugin
      score:
        enabled:
        - name: MyPlugin
      preFilter:
        enabled:
        - name: MyPlugin
      filter:
        enabled:
        - name: MyPlugin
```

Однією з переваг використання `multiPoint` є те, що якщо `MyPlugin` реалізує іншу точку розширення в майбутньому, конфігурація `multiPoint` автоматично увімкне його для нової точки розширення.

Конкретні точки розширення можна виключити з розширення `MultiPoint` за допомогою поля `disabled` для цієї точки розширення. Це працює з вимкненням типових і нетипових втулків, а також з підстановним знаком (`'*'`) для вимкнення всіх втулків. Приклад вимкнення `Score` і `PreScore`:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'MyPlugin'
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

Починаючи з `kubescheduler.config.k8s.io/v1beta3`, усі [типові втулки](#scheduling-plugins) ввімкнені внутрішньо через `MultiPoint`. Однак окремі точки розширення все ще доступні, щоб забезпечити гнучке переналаштування типових значень (наприклад, порядок і ваги Score). Наприклад, розглянемо два втулки Score `DefaultScore1` і `DefaultScore2`, кожен з вагою `1`. Їх можна змінити місцями з різними вагами так:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      score:
        enabled:
        - name: 'DefaultScore2'
          weight: 5
```

У цьому прикладі не потрібно явно вказувати втулки в `MultiPoint`, оскільки вони є типовими втулками. І єдиний втулок, вказаний у `Score`, це `DefaultScore2`. Це тому, що втулки, встановлені через конкретні точки розширення, завжди матимуть пріоритет перед втулками `MultiPoint`. Таким чином, цей фрагмент по суті змінює порядок втулків без необхідності вказувати їх усіх.

Загальна ієрархія пріоритету під час налаштування втулків `MultiPoint` така:

1. Специфічні точки розширення працюють першими, і їх налаштування переважатимуть над налаштуваннями, встановленими деінде.
2. Втулки, налаштовані вручну через `MultiPoint`, і їх налаштування.
3. Типові втулки та їхні типові налаштування.

Щоб продемонструвати наведену вище ієрархію, наведений нижче приклад базується на цих втулках:

|Втулок|Точки розширення|
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|

Дійсна конфігурація (для зразка) для цих втулків виглядає так:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'CustomQueueSort'
        - name: 'CustomPlugin1'
          weight: 3
        - name: 'CustomPlugin2'
        disabled:
        - name: 'DefaultQueueSort'
      filter:
        disabled:
        - name: 'DefaultPlugin1'
      score:
        enabled:
        - name: 'DefaultPlugin2'
```

Зверніть увагу, що повторне оголошення втулка `MultiPoint` у конкретній точці розширення не є помилкою. Повторне оголошення ігнорується (і логується), оскільки конкретні точки розширення мають пріоритет.

Крім збереження більшості конфігурацій в одному місці, цей приклад виконує кілька речей:

* Увімкнено власний втулок `queueSort` і вимкнено типовий
* Увімкнено `CustomPlugin1` і `CustomPlugin2`, які будуть виконуватися першими для всіх своїх точок розширення
* Вимкнено `DefaultPlugin1`, але тільки для `filter`
* Змінено порядок, щоб `DefaultPlugin2` виконувався першим у `score` (навіть перед власними втулками)

У версіях конфігурації до `v1beta3`, без `multiPoint`, наведений вище фрагмент рівнозначний цьому:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:

      # Вимкнути типовий втулок QueueSort
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # Увімкнути власні втулки Filter
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # Увімкнути та змінити порядок власних втулків score
      score:
        enabled:
        - name: 'DefaultPlugin2'
          weight: 1
        - name: 'DefaultPlugin1'
          weight: 1
        - name: 'CustomPlugin1'
          weight: 3
        - name: 'CustomPlugin2'
          weight: 1
```

Хоча це складний приклад, він демонструє гнучкість конфігурації `MultiPoint`, а також її безшовну інтеграцію з наявними методами налаштування точок розширення.

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте [довідник kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)
* Ознайомтеся з [плануванням](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Прочитайте [довідник з конфігурації kube-scheduler (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
