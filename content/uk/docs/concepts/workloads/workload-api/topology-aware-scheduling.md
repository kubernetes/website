---
title: Топологічно орієнтоване планування робочих навантажень
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

Топологічно орієнтоване планування робочих навантажень (*Topology-Aware Scheduling*, TAS) є можливістю Workload API, яка оптимізує розміщення Podʼів у межах кластера.

TAS забезпечує, щоб усі Podʼи в межах PodGroup були розміщені в одному топологічному домені, наприклад, в одній серверній стійці або в одній зоні. Це мінімізує затримки між Podʼами та запобігає фрагментації робочого навантаження по інфраструктурі кластера.

## Топологічно орієнтоване планування з політикою `gang` {#topology-aware-scheduling-with-gang-scheduling-policy}

Під час застосування до PodGroups з політикою планування `gang` TAS симулює потенційне призначення (*placement*, розміщення) всієї групи Podʼів одразу. Він гарантує, що принаймні вказана кількість `minCount` Podʼів може розміститися разом в одному топологічному домені, перш ніж виділяти ресурси. Якщо жодного здійсненного розміщення не знайдено, весь PodGroup стає непридатним для планування.

Цей підхід рекомендується для робочих навантажень, таких як розподілене навчання AI та ML, які суворо потребують близькості для мінімізації затримок між Podʼами.

Якщо нові Podʼи додаються до PodGroup, у якому деякі Podʼи вже заплановані (наприклад, якщо Podʼи створюються повторно), планувальник змусить усі нові Podʼи розміститися саме в тому топологічному домені, де наразі перебувають наявні Podʼи. Якщо в цьому конкретному домені недостатньо ресурсів для нових Podʼів, вони залишаться в стані очікування — навіть якщо це означає, що на даний момент буде заплановано менше ніж `minCount` Podʼів.

{{< note >}}
Станом на v1.36 топологічно орієнтоване планування не ініціює витіснення робочих навантажень або Podʼів. Якщо жодного здійсненного розміщення не вдається знайти без витіснення, PodGroup стає непридатним для планування.
{{< /note >}}

## Топологічно орієнтоване планування з політикою `basic` {#topology-aware-scheduling-with-basic-scheduling-policy}

Використання TAS з політикою планування `basic` може призводити до непослідовної поведінки. Планувальник може спостерігати лише підмножину Podʼів під час входу в цикл планування PodGroup — тому здійсненність розміщення оцінюється лише для спостережуваних Podʼів, а не для всього PodGroup. Щоб частково помʼякшити це обмеження, можна використовувати шлюзи планування, щоб затримати планування PodGroup до тих пір, поки всі Podʼи в PodGroup не будуть у черзі планування.

Якщо жодного здійсненного розміщення для всього PodGroup не знайдено, може бути запланована лише підмножина Podʼів, і вони гарантовано відповідатимуть обмеженням планування.

Якщо нові Podʼи додаються до PodGroup, у якому деякі Podʼи вже заплановані, планувальник діятиме так само, як у випадку політики `gang` — змушуючи нові Podʼи розміститися в тому ж домені, якщо є достатньо ресурсів (у протилежному випадку нові Podʼи залишаться в стані очікування).

## Налаштування API: обмеження планування {#api-configuration-scheduling-constraints}

Кожен PodGroup (або PodGroupTemplate) може за бажанням оголосити поле `schedulingConstraints`, яке інтерпретується алгоритмом [планування PodGroup на основі розміщення](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm). Якщо обмеження визначені в PodGroupTemplate, вони будуть скопійовані до PodGroups, що на нього посилаються.

Станом на Kubernetes v1.36 API підтримує топологічні обмеження.

{{< note >}}
Станом на Kubernetes v1.36 ви можете вказати лише одне топологічне обмеження для кожного PodGroup.
{{< /note >}}

### Топологічне обмеження {#topology-constraint}

Щоб визначити топологічне обмеження для PodGroup, потрібно встановити `key`, який відповідає мітці вузла Kubernetes, що представляє цільовий топологічний домен (наприклад, стійку або зону). Планувальник суворо забезпечує, щоб усі Podʼи в межах PodGroup були розміщені на вузлах, які мають точно однакове значення для цієї мітки.

Ось приклад PodGroup, налаштованого з топологічним обмеженням:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: example-podgroup
spec:
  schedulingPolicy:
    gang:
      minCount: 4
  schedulingConstraints:
    topology:
      - key: topology.example.com/rack
```

## Багаторівневе топологічно орієнтоване планування {#multi-level-topology-aware-scheduling}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Складні робочі навантаження можуть вимагати спільного розміщення їхніх Podʼів на різних рівнях інфраструктури кластера. Наприклад, усе робоче навантаження може потребувати запуску в межах однієї зони доступності, тоді як різні частини цього робочого навантаження можуть вимагати суворого спільного розміщення в межах конкретних серверних стійок.

Такі багаторівневі вимоги до спільного розміщення можна виразити за допомогою API `CompositePodGroup` та вказуючи топологічні обмеження на різних рівнях ієрархії груп.

Використання API `CompositePodGroup` вимагає увімкнення функціональної можливості [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup) та {{< glossary_tooltip text="групи API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`.

### Визначення багаторівневих топологічних обмежень {#multi-level-topology-constraints-resolution}

Кожна група в ієрархії `CompositePodGroup` може вказати топологічне обмеження, яке гарантує, що всі нащадкові Podʼи цієї групи будуть заплановані в тому самому топологічному домені, що відповідає обмеженню цієї групи.

Під час [ієрархічного планування](/docs/concepts/scheduling-eviction/podgroup-scheduling) планувальник визначає ці обмеження **зверху вниз**. Зокрема, топологічні домени, які розглядаються під час планування дочірньої групи, обмежені топологічним доменом, що відповідає розміщенню, прийнятому батьківською групою.

Kubernetes не накладає жодних суворих вимог на фізичну ієрархію топологічних міток — топологічні ключі є довільними мітками вузлів. Однак порядок, у якому ви вказуєте топологічні обмеження від батьківської до дочірньої групи, визначає порядок, у якому планувальник поділяє топологічні домени.

{{< note >}}
Станом на Kubernetes v1.37 ви можете вказати лише одне топологічне обмеження в кожному `CompositePodGroup`.
{{< /note >}}

### Приклад {#example}

Наступний приклад налаштовує `Workload`, у якому батьківський `CompositePodGroupTemplate` обмежує все робоче навантаження однією зоною доступності (`topology.example.com/zone`), тоді як два дочірні елементи `PodGroupTemplate` (`workers` та `driver`) обмежують свої відповідні Podʼи серверними стійками (`topology.example.com/rack`) у межах цієї зони:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: example-workload
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    schedulingConstraints:
      topology:
      - key: topology.example.com/zone
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

Після створення обʼєкта `Workload` відповідні обʼєкти груп створюються таким чином:

- Кореневий `CompositePodGroup`, що посилається на шаблон `root`.
- Два дочірні обʼєкти `PodGroup` (`workers` та `driver`), кожен з яких посилається на кореневий `CompositePodGroup` як на свою батьківську групу.

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: workload-root
spec:
  workloadRef:
    workloadName: example-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
  schedulingConstraints:
    topology:
    - key: topology.example.com/zone
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: workload-workers
spec:
  parentCompositePodGroupName: workload-root
  workloadRef:
    workloadName: example-workload
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
  name: workload-driver
spec:
  parentCompositePodGroupName: workload-root
  workloadRef:
    workloadName: example-workload
    templateName: driver
  schedulingPolicy:
    gang:
      minCount: 1
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
```

Під час планування планувальник спочатку обирає зону доступності для `workload-root`. Потім він поділяє вузли в цій зоні за стійками, щоб знайти здійсненні розміщення на стійках для `workload-workers` та `workload-driver` у межах обраної зони.

Наприклад, розглянемо кластер із пʼятьма вузлами, позначеними таким чином:

| Вузол | `topology.example.com/zone` | `topology.example.com/rack` |
| --- | --- | --- |
| `node-a` | `zone-1` | `rack-1` |
| `node-b` | `zone-1` | `rack-1` |
| `node-c` | `zone-1` | `rack-2` |
| `node-d` | `zone-2` | `rack-1` |
| `node-e` | `zone-2` | `rack-3` |

Під час обробки `workload-root` планувальник оцінює можливі розміщення на всіх вузлах кластера на основі топологічного ключа `topology.example.com/zone`:

| Оцінене можливе розміщення | Вузли в можливому розміщенні |
| --- | --- |
| `zone-1` | `node-a`, `node-b`, `node-c` |
| `zone-2` | `node-d`, `node-e` |

Під час оцінки можливих розміщень для `workload-workers` планувальник поділяє лише вузли в межах розміщення, прийнятого `workload-root`, на основі топологічного ключа `topology.example.com/rack`:

| Батьківське розміщення | Оцінене можливе розміщення | Вузли в можливому розміщенні |
| --- | --- | --- |
| `zone-1` | `rack-1` | `node-a`, `node-b` |
| `zone-1` | `rack-2` | `node-c` |
| `zone-2` | `rack-1` | `node-d` |
| `zone-2` | `rack-3` | `node-e` |

Можливі розміщення, згенеровані для сусіднього PodGroup `workload-driver`, ідентичні тим, що згенеровані для `workload-workers`, оскільки обидві групи вказують той самий топологічний ключ (`topology.example.com/rack`).

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся про [політики груп Podʼів](/docs/concepts/workloads/workload-api/policies/).
- Дізнайтеся про [втулки, повʼязані з топологічно орієнтованим плануванням](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
- Прочитайте про алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
- Дізнайтеся про [будівельні блоки планування та бібліотеку workloadbuilder](/docs/concepts/workloads/workload-api/workloadbuilder/), зокрема про будівельний блок обмежень планування.
