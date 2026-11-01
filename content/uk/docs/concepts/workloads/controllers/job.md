---
title: Jobs
api_metadata:
- apiVersion: "batch/v1"
  kind: "Job"
content_type: concept
description: >-
  Jobs представляють одноразові завдання, які виконуються до завершення, а потім зупиняються.
feature:
  title: Пакетне виконання
  description: >
    Окрім сервісів, Kubernetes може керувати вашими пакетними та CI-навантаженнями, за потреби замінюючи контейнери, що зазнали збою.
weight: 50
hide_summary: true # Listed separately in section index
---

<!-- overview -->

Job створює один або кілька Podʼів і продовжує повторювати виконання Podʼів, доки вказана їх кількість успішно не завершиться. Коли Podʼи успішно завершуються, Job відстежує ці успішні завершення. Коли досягнуто вказаної кількості успішних завершень, завдання (тобто Job) завершено. Видалення Job видаляє створені ним Podʼи. Призупинення Job видаляє його активні Podʼи, доки Job не буде знову відновлено.

У простому випадку можна створити один обʼєкт Job для надійного запуску одного Podʼа, який працюватиме доки не завершить виконання роботи. Обʼєкт Job буде запускати новий Pod, якщо перший Pod зазнає невдачі або видаляється (наприклад, через відмову апаратного забезпечення вузла або перезавантаження вузла).

Також можна використовувати Job для запуску кількох Podʼів паралельно.

Якщо ви хочете запускати Job (або одне завдання, або кілька паралельно) за розкладом, див. [CronJob](/docs/concepts/workloads/controllers/cron-jobs/).

<!-- body -->

## Запуск прикладу Job {#running-an-example-job}

Ось конфігурація прикладу Job. Тут обчислюється число π з точністю до 2000 знаків і виконується його вивід. Виконання зазвичай займає близько 10 секунд.

{{% code_sample file="controllers/job.yaml" %}}

Ви можете запустити цей приклад за допомогою такої команди:

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```

Вивід буде подібний до цього:

```none
job.batch/pi created
```

Перевірте статус Job за допомогою `kubectl`:

{{< tabs name="Check status of Job" >}}
{{< tab name="kubectl describe job pi" codelang="bash" >}}
Name:           pi
Namespace:      default
Selector:       batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                batch.kubernetes.io/job-name=pi
                ...
Annotations:    batch.kubernetes.io/job-tracking: ""
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  batch.kubernetes.io/controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           batch.kubernetes.io/job-name=pi
  Containers:
   pi:
    Image:      perl:5.34.0
    Port:       <none>
    Host Port:  <none>
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  21s   job-controller  Created pod: pi-xf9p4
  Normal  Completed         18s   job-controller  Job completed
{{< /tab >}}
{{< tab name="kubectl get job pi -o yaml" codelang="bash" >}}
apiVersion: batch/v1
kind: Job
metadata:
  annotations: batch.kubernetes.io/job-tracking: ""
             ...
  creationTimestamp: "2022-11-10T17:53:53Z"
  generation: 1
  labels:
    batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
    batch.kubernetes.io/job-name: pi
  name: pi
  namespace: default
  resourceVersion: "4751"
  uid: 204fb678-040b-497f-9266-35ffa8716d14
spec:
  backoffLimit: 4
  completionMode: NonIndexed
  completions: 1
  parallelism: 1
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
  suspend: false
  template:
    metadata:
      creationTimestamp: null
      labels:
        batch.kubernetes.io/controller-uid: 863452e6-270d-420e-9b94-53a54146c223
        batch.kubernetes.io/job-name: pi
    spec:
      containers:
      - command:
        - perl
        - -Mbignum=bpi
        - -wle
        - print bpi(2000)
        image: perl:5.34.0
        imagePullPolicy: IfNotPresent
        name: pi
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Never
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
status:
  active: 1
  ready: 0
  startTime: "2022-11-10T17:53:57Z"
  uncountedTerminatedPods: {}
{{< /tab >}}
{{< /tabs >}}

Щоб переглянути завершені Podʼи Job, використовуйте `kubectl get pods`.

Щоб вивести всі Podʼи, які належать Job, у машинночитаній формі, ви можете використовувати таку команду:

```shell
pods=$(kubectl get pods --selector=batch.kubernetes.io/job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```

Вивід буде подібний до цього:

```none
pi-5rwd7
```

Тут селектор збігається з селектором Job. Параметр `--output=jsonpath` вказує вираз із назвою кожного Podʼа в отриманому списку.

Перегляньте стандартний вивід одного з Podʼів:

```shell
kubectl logs $pods
```

Інший спосіб переглянути логи Job:

```shell
kubectl logs jobs/pi
```

Вивід буде подібний до цього:

```none
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

## Написання специфікації Job {#writing-a-job-spec}

Як і з будь-якою іншою конфігурацією Kubernetes, у Job мають бути вказані поля `apiVersion`, `kind` та `metadata`.

Коли панель управління створює нові Podʼи для Job, `.metadata.name` Job є частиною основи для назв цих Podʼів. Назва Job повинна бути дійсним значенням [DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names), але це може призводити до неочікуваних результатів для імен хостів Podʼів. Для найкращої сумісності назва повинна відповідати суворішим правилам для [DNS-мітки](/docs/concepts/overview/working-with-objects/names#dns-label-names). Навіть якщо назва є DNS-піддоменом, вона повинна бути не довшою за 63 символи.

Також у Job повинен бути розділ [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Мітки для Job {#job-labels}

Мітки Job матимуть префікс `batch.kubernetes.io/` для `job-name` та `controller-uid`.

### Шаблон Podʼа {#pod-template}

`.spec.template` — єдине обовʼязкове поле `.spec`.

`.spec.template` — це [шаблон Podʼа](/docs/concepts/workloads/pods/#pod-templates). Він має точно таку саму схему, як {{< glossary_tooltip text="Pod" term_id="pod" >}}, окрім того, що він вкладений і не має `apiVersion` чи `kind`.

Окрім обовʼязкових полів для Podʼа, шаблон Podʼа в Job повинен вказувати відповідні мітки (див. [селектор Podʼа](#pod-selector)) та відповідну політику перезапуску.

Дозволяється лише [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy), що дорівнює `Never` або `OnFailure`.

### Селектор Podʼа {#pod-selector}

Поле `.spec.selector` є необовʼязковим. Майже у всіх випадках вам не слід його вказувати. Дивіться розділ [вказування вашого власного селектора Podʼа](#specifying-your-own-pod-selector).

### Паралельне виконання для Jobs {#parallel-jobs}

Існують три основних типи завдань, які підходять для виконання як Job:

1. Непаралельні Jobs
   - зазвичай запускається лише один Pod, якщо тільки він не зазнає збою.
   - Job завершується, як тільки робота його Podʼа завершується успішно.

1. Паралельні Jobs із *фіксованою кількістю завершень*:
   - вкажіть ненульове додатне значення для `.spec.completions`.
   - Job являє собою загальне завдання і є завершеним, коли є `.spec.completions` успішних Podʼів.
   - під час використання `.spec.completionMode="Indexed"`, кожен Pod отримує різний індекс у діапазоні від 0 до `.spec.completions-1`.

1. Паралельні Jobs із *чергою роботи*:
   - не вказуйте `.spec.completions`, типово встановлюється `.spec.parallelism`.
   - Podʼи повинні координувати свої дії між собою або із зовнішнім сервісом, щоб визначити, над чим кожен з них має працювати. Наприклад, Pod може отримати пакет із не більш ніж N елементів з черги роботи.
   - кожен Pod може незалежно визначити, чи завершилися всі рівноправні з ним Podʼи, а отже, чи завершено весь Job.
   - коли *будь-який* Pod з Job завершується успішно, нові Podʼи не створюються.
   - як тільки хоча б один Pod завершився успішно і всі Podʼи завершені, тоді Job завершується успішно.
   - як тільки будь-який Pod завершився успішно, жоден інший Pod не повинен виконувати роботу для цього завдання чи записувати будь-який вивід. Вони всі мають бути в процесі завершення.

Для *непаралельного* Job ви можете залишити як `.spec.completions`, так і `.spec.parallelism` не встановленими. Коли обидва не встановлені, обидва типово встановлюються на 1.

Для *Job із фіксованою кількістю завершень* вам слід встановити `.spec.completions` на кількість необхідних завершень. Ви можете встановити `.spec.parallelism` чи залишити його не встановленим, тоді він стандартно дорівнюватиме 1.

Для *Job із чергою роботи* ви повинні залишити `.spec.completions` не встановленим і встановити `.spec.parallelism` у невідʼємне ціле число.

За докладною інформацією про використання різних типів Job, див. розділ [патерни Job](#job-patterns).

#### Контроль паралелізму {#controlling-parallelism}

Запитаний паралелізм (`.spec.parallelism`) може бути встановлений у будь-яке невідʼємне значення. Якщо значення не вказано, стандартно воно дорівнює 1. Якщо вказано як 0, то Job фактично призупинено, доки значення не буде збільшено.

Фактичний паралелізм (кількість Podʼів, які працюють в будь-який момент) може бути більше чи менше, ніж запитаний паралелізм, з різних причин:

- Для *Job із фіксованою кількістю завершень*, фактична кількість Podʼів, які працюють паралельно, не перевищуватиме кількість решти завершень. Вищі значення `.spec.parallelism` фактично ігноруються.
- Для *Job із чергою роботи* жоден новий Pod не запускається після успішного завершення будь-якого Podʼа, однак решті Podʼів дозволено завершити роботу.
- Якщо у {{< glossary_tooltip term_id="controller" text="контролера" >}} Job не було часу відреагувати.
- Якщо контролер Job не зміг створити Podʼи з будь-якої причини (нестача `ResourceQuota`, відсутність дозволу тощо), тоді може бути менше Podʼів, ніж запитано.
- Контролер Job може обмежувати створення нових Podʼів через надмірну кількість збоїв попередніх Podʼів у тому самому Job.
- Коли Pod коректно завершується, на його зупинку потрібен час.

### Режим завершення {#completion-mode}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Для Jobs із *фіксованою кількістю завершень*, тобто Jobs зі значенням `.spec.completions`, відмінним від null, може бути встановлено режим завершення, який вказується в `.spec.completionMode`:

- `NonIndexed` (стандартно): Job вважається завершеним, коли є `.spec.completions` успішно завершених Podʼів. Іншими словами, завершення всіх Podʼів рівнозначні. Зверніть увагу, що Jobs, у яких `.spec.completions` дорівнює null, неявно є `NonIndexed`.
- `Indexed`: Podʼи Job отримують повʼязаний індекс завершення від 0 до `.spec.completions-1`. Індекс доступний через чотири механізми:
  - Анотація Podʼа `batch.kubernetes.io/job-completion-index`.
  - Мітка Podʼа `batch.kubernetes.io/job-completion-index` (для v1.28 і новіших). Зверніть увагу, що для використання цієї мітки функціональна можливість `PodIndexLabel` повинна бути увімкнена, і вона типово увімкнена.
  - Як частина імені хоста Podʼа, за шаблоном `$(job-name)-$(index)`. Коли ви використовуєте Indexed Job у поєднанні з {{< glossary_tooltip term_id="Service" >}}, Podʼи всередині Job можуть використовувати детерміністичні імена хостів для адресації одне одного через DNS. Докладні відомості щодо того, як налаштувати це, див. [Job із комунікацією між Podʼами](/docs/tasks/job/job-with-pod-to-pod-communication/).
  - З контейнера завдання, в змінній середовища `JOB_COMPLETION_INDEX`.

  Job вважається завершеним, коли є успішно завершений Pod для кожного індексу. Докладні відомості щодо того, як використовувати цей режим, див. [Indexed Job для паралельної обробки зі статичним призначенням роботи](/docs/tasks/job/indexed-parallel-processing-static/).

{{< note >}}
Хоча це трапляється рідко, може бути запущено більше одного Podʼа для одного і того ж індексу (з різних причин, таких як відмови вузла, перезапуски kubelet чи виселення Podʼа). У цьому випадку лише перший успішно завершений Pod буде враховуватися при підрахунку кількості завершень та оновленні статусу Job. Інші Podʼи, які працюють чи завершили роботу для того ж самого індексу, будуть видалені контролером Job, щойно їх буде виявлено.
{{< /note >}}

## Інтеграція з Workload API {#integrate-with-workload-apis}

{{< feature-state feature_gate_name="WorkloadWithJob" >}}

Коли функціональну можливість [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob) увімкнено, контролер Job компілює конфігурацію `.spec.scheduling` Job в обʼєкти [Workload](/docs/concepts/workloads/workload-api/) та [PodGroup](/docs/concepts/workloads/podgroup-api/) (`scheduling.k8s.io/v1beta1`) перед створенням будь-яких Podʼів. Це дозволяє вам виражати явний намір планування для Job, такий як [групове планування](/docs/concepts/scheduling-eviction/gang-scheduling/) (всі Podʼи плануються разом або жодного), спільне розташування за топологією та поведінку під час порушень.

Коли ви опускаєте `.spec.scheduling`, Job типово використовує політику планування `Basic`, яка зберігає стандартний результат планування Pod за Podʼом для звичайного Job. Контролер все одно створює `Workload` та `PodGroup` для кожного відповідного Job (включно з `Basic`), тому спостережувані обʼєкти є узгодженими незалежно від політики.

### Конфігурація планування {#scheduling-configuration}

Поле `.spec.scheduling` приймає такі поля:

- `schedulingPolicy`: потрібно вказати рівно одне з `basic` або `gang`. З `gang` всі Podʼи мають бути запланованими разом, перш ніж будь-який з них буде привʼязаний. Опущене `gang.minCount` стандартно дорівнює `.spec.parallelism` Job. Див. [Політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
- `schedulingConstraints`: обмеження [спільного розташування за топологією](/docs/concepts/workloads/workload-api/topology-aware-scheduling/) для Podʼів Job.
- `disruptionMode`: чи порушується робота Podʼів окремо (`single`), чи групою (`all`). Див. [порушення та пріоритет](/docs/concepts/workloads/workload-api/disruption-and-priority/).
- `resourceClaims`: динамічні запити на ресурси, спільні для Podʼів Job.

Всі поля `.spec.scheduling` є незмінними після створення Job, окрім `schedulingPolicy.gang.minCount`, яке ви можете змінювати, щоб [еластично масштабувати групу](#elastic-indexed-jobs).

### Групове планування {#gang-scheduling}

Цей Job запитує групове планування для своїх 8 Podʼів, розташованих в одній зоні, робота яких порушується разом:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: distributed-training
  namespace: training
spec:
  parallelism: 8
  completions: 8
  completionMode: Indexed
  scheduling:
    schedulingPolicy:
      gang: {}                # minCount пропущено -> стандартно дорівнює parallelism (8)
    schedulingConstraints:
      key:
      - level: topology.kubernetes.io/zone
    disruptionMode:
      all: {}                 # робота всієї групи порушується разом
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: trainer
        image: training-image:latest
        resources:
          limits:
            nvidia.com/gpu: 1
```

Коли контролер Job обробляє цей Job, він:

1. Створює обʼєкт [Workload](/docs/concepts/workloads/workload-api/) у тому самому просторі імен, що містить `podGroupTemplate`, скомпільований з `.spec.scheduling` (тут — [політика групового планування](/docs/concepts/workloads/workload-api/policies/) з `minCount: 8`).
1. Створює обʼєкт PodGroup на основі цього шаблону. PodGroup є одиницею планування під час виконання і містить вбудовану копію політики.
1. Створює Podʼи з `.spec.schedulingGroup.podGroupName`, встановленим на імʼя PodGroup, звʼязуючи кожен Pod зі своєю групою планування.

Контролер виявляє ці обʼєкти через посилання у специфікації (`Workload.spec.controllerRef` та `PodGroup.spec.workloadRef`), а не за іменем. Обʼєкти, які створює контролер, містять запис `ownerReferences`, що вказує на Job, тому вони видаляються збирачем сміття, коли Job видаляється.

### Типове (Basic) планування {#default-basic-scheduling}

Job, який опускає `.spec.scheduling`, типово використовує `Basic`, що діє як неявна відмова від групового планування. Його Podʼи плануються так само, як у звичайного Job, при цьому все одно створюються `Workload` та `PodGroup` типу `Basic`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: batch-processor
  namespace: batch
spec:
  parallelism: 10
  completions: 10
  # .spec.scheduling пропущено -> типово використовується Basic scheduling.
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: processor
        image: processor-image:v1
```

### Контролери вищого рівня {#higher-level-controllers}

Для автономного Job контролер Job володіє як `Workload`, так і `PodGroup`. Коли Job натомість містить `ownerReference` на батьківський контролер, який компілює `Workload` (наприклад, `JobSet`), контролер Job делегує володіння `Workload` цьому батьківському контролеру. Чи створює контролер Job все ще `PodGroup` під час виконання, залежить від того, що делегує батьківський контролер:

- Якщо батьківський контролер встановлює анотацію `scheduling.k8s.io/group-template-name` на Job, контролер Job створює та володіє `PodGroup`, зіставленим з іменованим `PodGroupTemplate` батьківського контролера.
- В іншому випадку батьківський контролер володіє обома обʼєктами, і контролер Job не створює жодного; він виявляє наявні обʼєкти та використовує їх під час створення Podʼів.

Якщо в шаблоні Podʼа Job вже задано `.spec.template.spec.schedulingGroup`, контролер Job не створює жодного обʼєкта, дозволяючи вам (або контролеру вищого рівня) самостійно керувати життєвим циклом `Workload`/`PodGroup`.

### Поведінка CronJob {#cronjob-behavior}

Jobs, створені за допомогою `CronJob`, є автономними; `CronJob` не створює та не керує обʼєктами `Workload`. Якщо `jobTemplate` CronJob встановлює `.spec.scheduling`, контролер Job створює окремі обʼєкти `Workload` та `PodGroup` для кожного екземпляра Job, скомпільовані з `.spec.scheduling` цього Job (типово `Basic`, якщо опущено). Ці обʼєкти видаляються збирачем сміття, коли кожен Job завершується або видаляється.

### Обмеження для альфа-релізу {#workload-integration-limitations}

- Кожен Job відповідає точно одному обʼєкту `PodGroup`; всі Podʼи в Job поділяють єдину політику планування.
- Лише `schedulingPolicy.gang.minCount` є змінним; всі інші поля `.spec.scheduling` є незмінними після створення.
- Призупинені Jobs зберігають свої обʼєкти `Workload` та `PodGroup`; вони не видаляються під час призупинення і не створюються заново під час відновлення.

## Обробка збоїв Podʼа та контейнера {#handling-pod-and-container-failures}

Контейнер у Podʼі може вийти з ладу з ряду причин, таких як завершення процесу з ненульовим кодом виходу або примусове припинення роботи контейнера через перевищення обмеження памʼяті тощо. Якщо це стається і `.spec.template.spec.restartPolicy = "OnFailure"`, тоді Pod залишається на вузлі, але контейнер перезапускається. Отже, ваш застосунок повинен обробляти випадок, коли він перезапускається локально, або вказувати `.spec.template.spec.restartPolicy = "Never"`. Докладні відомості про `restartPolicy` див. в розділі [життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

Весь Pod також може вийти з ладу з низки причин, таких як коли Pod виштовхується з вузла (вузол оновлюється, перезавантажується, видаляється тощо), або якщо контейнер Podʼа виходить з ладу і `.spec.template.spec.restartPolicy = "Never"`. Коли Pod виходить з ладу, контролер Job запускає новий Pod. Це означає, що ваш застосунок повинен обробляти випадок, коли він перезапускається у новому Podʼі. Зокрема, він повинен обробляти тимчасові файли, блокування, неповний вивід та інше, викликане попередніми запусками.

Типово кожен збій Podʼа враховується в обмеженні `.spec.backoffLimit`, див. [політика backoff для збоїв Podʼа](#pod-backoff-failure-policy). Однак ви можете налаштовувати обробку збоїв Podʼа, встановлюючи [політику збоїв Podʼа](#pod-failure-policy) для Job.

Додатково ви можете вирішити враховувати збої Podʼа незалежно для кожного індексу в [Indexed](#completion-mode) Job, встановлюючи поле `.spec.backoffLimitPerIndex` (докладні відомості див. [обмеження backoff на індекс](#backoff-limit-per-index)).

Зверніть увагу, що навіть якщо ви вказали `.spec.parallelism = 1` і `.spec.completions = 1` і `.spec.template.spec.restartPolicy = "Never"`, та сама програма може іноді бути запущена двічі.

Якщо ви вказали як `.spec.parallelism`, так і `.spec.completions` більше ніж 1, то може бути запущено кілька Podʼів одночасно. Таким чином, ваші Podʼи також повинні бути стійкими до паралелізму.

Якщо ви вказуєте поле `.spec.podFailurePolicy`, контролер Job не вважає збоєм Pod, що завершується (Pod зі встановленим полем `.metadata.deletionTimestamp`), доки цей Pod не стане термінальним (його `.status.phase` є `Failed` або `Succeeded`). Однак контролер Job створює Pod-замінник, щойно стає очевидним, що Pod перебуває в процесі завершення. Після того як Pod завершиться, контролер Job оцінює `.backoffLimit` і `.podFailurePolicy` для відповідного Job, враховуючи тепер уже завершений Pod.

Якщо хоча б одна з цих вимог не виконана, контролер Job вважає Pod, що завершується, негайним збоєм, навіть якщо цей Pod пізніше завершиться з `phase: "Succeeded"`.

### Політика backoff для збоїв Podʼа {#pod-backoff-failure-policy}

Трапляються ситуації, коли ви хочете, щоб Job зазнав збою після певної кількості спроб через логічну помилку в конфігурації тощо. Для цього встановіть `.spec.backoffLimit`, щоб вказати кількість повторних спроб, після яких Job вважатиметься невдалим.

Стандартне значення `.spec.backoffLimit` дорівнює 6, якщо не вказано [обмеження backoff на індекс](#backoff-limit-per-index) (тільки Індексовані Job). Якщо вказано `.spec.backoffLimitPerIndex`, то `.spec.backoffLimit` стандартно дорівнює 2147483647 (MaxInt32).

Повʼязані з Job невдалі Podʼи створюються заново контролером Job з експоненціальною затримкою (10s, 20s, 40s …), яка обмежена десятьма хвилинами.

Кількість спроб обчислюється двома способами:

- Кількість Podʼів з `.status.phase = "Failed"`.
- Під час використання `restartPolicy = "OnFailure"` кількість спроб у всіх контейнерах Podʼів з `.status.phase`, що дорівнює `Pending` або `Running`.

Якщо хоча б один із розрахунків досягне значення `.spec.backoffLimit`, Job вважається невдалим.

{{< note >}}
Якщо ваш Job має `restartPolicy = "OnFailure"`, майте на увазі, що Pod, який виконує Job, буде завершено, щойно буде досягнуто обмеження backoff Job. Це може ускладнити налагодження виконуваного файлу Job. Ми радимо встановлювати `restartPolicy = "Never"` під час налагодження Job або використовувати систему логування, щоб вивід невдалих Jobs не було випадково втрачено.
{{< /note >}}

### обмеження backoff на індекс {#backoff-limit-per-index}

{{< feature-state feature_gate_name="JobBackoffLimitPerIndex" >}}

Коли ви запускаєте [Indexed](#completion-mode) Job, ви можете вибрати обробку спроб для збоїв Podʼа незалежно для кожного індексу. Для цього встановіть `.spec.backoffLimitPerIndex`, щоб вказати максимальну кількість невдалих спроб Podʼа для кожного індексу.

Коли обмеження backoff на індекс перевищується для певного індексу, Kubernetes вважає цей індекс невдалим і додає його до поля `.status.failedIndexes`. Індекси, які виконались успішно, реєструються в полі `.status.completedIndexes`, незалежно від того, чи ви встановили поле `backoffLimitPerIndex`.

Зауважте, що невдалий індекс не перериває виконання інших індексів. Щойно всі індекси завершаться для Job, в якому ви вказали обмеження backoff на індекс, якщо хоча б один з цих індексів виявився невдалим, контролер Job позначає весь Job як невдалий, встановлюючи стан `Failed` в статусі. Job отримує позначку "невдалий", навіть якщо деякі, можливо, майже всі індекси були оброблені успішно.

Ви також можете обмежити максимальну кількість позначених невдалих індексів, встановивши поле `.spec.maxFailedIndexes`. Коли кількість невдалих індексів перевищує значення поля `maxFailedIndexes`, контролер Job запускає завершення всіх Podʼів, що залишаються запущеними в цьому Job. Щойно всі Podʼи будуть завершені, контролер Job позначає весь Job як невдалий, встановлюючи стан `Failed` в статусі Job.

Ось приклад маніфесту для Job, який визначає `backoffLimitPerIndex`:

{{< code_sample file="/controllers/job-backoff-limit-per-index-example.yaml" >}}

У вищенаведеному прикладі контролер Job дозволяє один перезапуск для кожного з індексів. Коли загальна кількість невдалих індексів перевищує 5, тоді весь Job завершується.

Після завершення Job його стан виглядає так:

```sh
kubectl get -o yaml job job-backoff-limit-per-index-example
```

```yaml
  status:
    completedIndexes: 1,3,5,7,9
    failedIndexes: 0,2,4,6,8
    succeeded: 5          # 1 succeeded pod for each of 5 succeeded indexes
    failed: 10            # 2 failed pods (1 retry) for each of 5 failed indexes
    conditions:
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: FailureTarget
    - message: Job has failed indexes
      reason: FailedIndexes
      status: "True"
      type: Failed
```

Контролер Job додає стан `FailureTarget` до Job для запуску [завершення та очищення Job](#job-termination-and-cleanup). Коли всі Podʼи Job завершуються, контролер Job додає стан `Failed` з тими ж значеннями для `reason` і `message`, що й у стану `FailureTarget`. Для деталей дивіться [Завершення Podʼів Job](#termination-of-job-pods).

Додатково ви можете використовувати обмеження backoff на індекс разом з [політикою збоїв Podʼа](#pod-failure-policy). Коли використовується обмеження backoff на індекс, доступна нова дія `FailIndex`, яка дозволяє вам уникати непотрібних повторів всередині індексу.

### Політика збоїв Podʼа {#pod-failure-policy}

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

Політика збоїв Podʼа, визначена за допомогою поля `.spec.podFailurePolicy`, дозволяє вашому кластеру обробляти збої Podʼа на основі кодів виходу контейнера та станів Podʼа.

У деяких ситуаціях вам може знадобитися кращий контроль обробки збоїв Podʼа, ніж контроль, який надає [Політика backoff для збоїв Podʼа](#pod-backoff-failure-policy), яка базується на `.spec.backoffLimit` Job. Ось деякі приклади використання:

- Для оптимізації витрат на виконання робочих навантажень, уникнення непотрібних перезапусків Podʼа, ви можете завершити Job, як тільки один із його Podʼів відмовить із кодом виходу, що вказує на помилку програмного забезпечення.
- Щоб гарантувати, що ваш Job завершиться, навіть якщо є порушення, ви можете ігнорувати збої Podʼів, спричинені порушеннями (такими як {{< glossary_tooltip text="витіснення" term_id="preemption" >}}, {{< glossary_tooltip text="виселення, ініційоване API" term_id="api-eviction" >}} або виселення на основі {{< glossary_tooltip text="taint" term_id="taint" >}}), щоб вони не враховувалися в обмеженні спроб `.spec.backoffLimit`.

Ви можете налаштувати політику збоїв Podʼа в полі `.spec.podFailurePolicy`, щоб задовольнити наведені вище сценарії використання. Ця політика може обробляти збої Podʼа на основі кодів виходу контейнера та станів Podʼа.

Ось маніфест для Job, який визначає `podFailurePolicy`:

{{% code_sample file="/controllers/job-pod-failure-policy-example.yaml" %}}

У вищенаведеному прикладі перше правило політики збоїв Podʼа вказує, що Job слід позначити як невдалий, якщо контейнер `main` завершиться кодом виходу 42. Наступні правила стосуються саме контейнера `main`:

- код виходу 0 означає, що контейнер виконався успішно
- код виходу 42 означає, що **весь Job** завершився невдало
- будь-який інший код виходу вказує, що контейнер, а отже, і весь Pod завершилися невдало. Pod буде створено заново, якщо загальна кількість перезапусків менша за `backoffLimit`. Якщо `backoffLimit` досягнуто, **весь Job** завершився невдало.

{{< note >}}
Оскільки в шаблоні Podʼа вказано `restartPolicy: Never`, kubelet не перезапускає контейнер `main` в тому конкретному Podʼі.
{{< /note >}}

Друге правило політики збоїв Podʼа, що вказує дію `Ignore` для невдалих Podʼів зі станом `DisruptionTarget`, виключає порушення роботи Podʼів із підрахунку обмеження спроб `.spec.backoffLimit`.

{{< note >}}
Якщо Job виявився невдалим через політику збоїв Podʼа чи через політику backoff для збоїв Podʼа, і Job виконується кількома Podʼами, Kubernetes завершує всі Podʼи в цьому Job, які все ще перебувають у статусах Pending або Running.
{{< /note >}}

Ось деякі вимоги та семантика API:

- якщо ви хочете використовувати поле `.spec.podFailurePolicy` для Job, вам також слід визначити шаблон Podʼа цього Job з `.spec.restartPolicy`, встановленим на `Never`.
- правила політики збоїв Podʼа, які ви визначаєте у `spec.podFailurePolicy.rules`, оцінюються послідовно. Якщо одне з правил відповідає збою Podʼа, інші правила ігноруються. Якщо жодне правило не відповідає збою Podʼа, застосовується типова обробка.
- ви можете обмежити правило певним контейнером, вказавши його імʼя у `spec.podFailurePolicy.rules[*].onExitCodes.containerName`. Якщо не вказано, правило застосовується до всіх контейнерів. Якщо вказано, воно повинно відповідати імені одного з контейнерів або `initContainer` у шаблоні Podʼа.
- ви можете вказати дію, яка виконується, коли спрацьовує політика збоїв Podʼа, у `spec.podFailurePolicy.rules[*].action`. Можливі значення:
  - `FailJob`: використовуйте це, щоб вказати, що Job цього Podʼа має бути позначений як Failed, а всі запущені Podʼи мають бути завершені.
  - `Ignore`: використовуйте це, щоб вказати, що значення лічильника, що рахує `.spec.backoffLimit`, не повинне збільшуватися, і має бути створений Pod-замінник.
  - `Count`: використовуйте це, щоб вказати, що Pod повинен бути оброблений типовим способом. Лічильник `.spec.backoffLimit` повинен збільшитися.
  - `FailIndex`: використовуйте цю дію разом із [обмеження backoff на індекс](#backoff-limit-per-index) для уникнення непотрібних повторних спроб в межах індексу невдалого Podʼа.

{{< note >}}
Коли використовується `podFailurePolicy`, контролер Job враховує лише Podʼи у фазі `Failed`. Podʼи з відміткою про видалення, які не знаходяться в термінальній фазі (`Failed` чи `Succeeded`), вважаються такими, що ще завершуються. Це означає, що такі Podʼи зберігають [завершувачі відстеження](#job-tracking-with-finalizers) доки не досягнуть термінальної фази. З Kubernetes 1.27 Kubelet переводить видалені Podʼи в термінальну фазу (див.: [Фаза Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)). Це забезпечує видалення завершувачів контролером Job.
{{< /note >}}

{{< note >}}
Починаючи з Kubernetes v1.28, коли використовується політика збоїв Podʼа, контролер Job створює заново Podʼи, що завершуються, лише тоді, коли ці Podʼи досягли термінальної фази `Failed`. Ця поведінка подібна до `podReplacementPolicy: Failed`. Докладніше див. [Політика заміни Podʼів](#pod-replacement-policy).
{{< /note >}}

Коли ви використовуєте `podFailurePolicy`, і Job зазнає невдачі через Pod, що відповідає правилу з дією `FailJob`, контролер Job запускає процес завершення Job, додаючи стан `FailureTarget`. Для деталей дивіться [Завершення та очищення Job](#job-termination-and-cleanup).

## Політика успіху {#success-policy}

Під час створення Indexed Job ви можете визначити, коли Job може бути визнаний успішним, за допомогою `.spec.successPolicy`, на основі успішних Podʼів.

Типово Job вважається успішним, коли кількість успішних Podʼів дорівнює `.spec.completions`. Існують ситуації, коли вам може знадобитися додатковий контроль для визнання Job успішним:

- Під час виконання симуляцій з різними параметрами, вам можуть не знадобитися всі симуляції для успішного завершення загального Job.
- Під час використання шаблону лідер-виконавець, лише успіх лідера визначає успіх чи невдачу Job. Прикладами цього є фреймворки, такі як MPI та PyTorch тощо.

Ви можете налаштувати політику успіху у полі `.spec.successPolicy`, щоб задовольнити вищезазначені випадки використання. Ця політика може керувати успіхом Job на основі успішних Podʼів. Після того, як Job відповідає політиці успіху, контролер Job завершує решту Podʼів. Політика успіху визначається правилами. Кожне правило може мати одну з таких форм:

- Коли ви вказуєте лише `succeededIndexes`, одразу після успішного завершення всіх індексів, вказаних у `succeededIndexes`, контролер Job позначає Job як успішний. `succeededIndexes` повинен бути списком інтервалів між 0 і `.spec.completions-1`.
- Коли ви вказуєте лише `succeededCount`, як тільки кількість успішних індексів досягне `succeededCount`, контролер Job позначає Job як успішний.
- Коли ви вказуєте як `succeededIndexes`, так і `succeededCount`, як тільки кількість успішних індексів з підмножини індексів, вказаних у `succeededIndexes`, досягне `succeededCount`, контролер Job позначає Job як успішний.

Зверніть увагу, що коли ви вказуєте кілька правил у `.spec.successPolicy.rules`, контролер Job оцінює правила послідовно. Після того, як Job задовольняє правило, контролер Job ігнорує решту правил.

Ось приклад маніфеста для Job із `successPolicy`:

{{% code_sample file="/controllers/job-success-policy.yaml" %}}

У вищенаведеному прикладі були вказані як `succeededIndexes`, так і `succeededCount`. Тому контролер Job позначить Job як успішний і завершить залишкові Podʼи після успіху будь-яких зазначених індексів, 0, 2 або 3. Job, який відповідає політиці успіху, отримує стан `SuccessCriteriaMet` з причиною `SuccessPolicy`. Після видалення залишкових Podʼів, Job отримує стан `Complete`.

Зверніть увагу, що `succeededIndexes` представлено як інтервали, розділені дефісом. Номери перераховані у вигляді першого та останнього елементів серії, розділених дефісом.

{{< note >}}
Коли ви вказуєте як політику успіху, так і деякі політики завершення, такі як `.spec.backoffLimit` і `.spec.podFailurePolicy`, щойно Job задовольняє будь-яку з політик, контролер Job дотримується політики завершення і ігнорує політику успіху.
{{< /note >}}

## Завершення Job та очищення {#job-termination-and-cleanup}

Коли Job завершується, Podʼи більше не створюються, але Podʼи [зазвичай](#pod-backoff-failure-policy) також не видаляються. Якщо їх не видаляти, можна переглядати логи завершених Podʼів для перевірки наявності помилок, попереджень чи іншого діагностичного виводу. Обʼєкт Job також залишається після завершення, щоб ви могли переглядати його статус. Користувач сам видаляє старі Jobs, переглянувши їхній статус. Видаліть Job за допомогою `kubectl` (наприклад, `kubectl delete jobs/pi` або `kubectl delete -f ./job.yaml`). Коли ви видаляєте Job за допомогою `kubectl`, усі створені ним Podʼи також видаляються.

Стандартно Job буде виконуватися безперервно, якщо тільки Pod не вийде з ладу (`restartPolicy=Never`) або контейнер не вийде з ладу з помилкою (`restartPolicy=OnFailure`), після чого Job дотримується `.spec.backoffLimit`, описаного вище. Як тільки досягнуто `.spec.backoffLimit`, Job буде позначено як невдалий, і будь-які запущені Podʼи будуть завершені.

Іншим способом завершити Job є встановлення активного крайнього терміну. Це робиться шляхом встановлення в поле `.spec.activeDeadlineSeconds` Job кількості секунд. `activeDeadlineSeconds` застосовується до тривалості Job, незалежно від кількості створених Podʼів. Як тільки Job досягає `activeDeadlineSeconds`, всі його запущені Podʼи завершуються, і статус Job стане `type: Failed` з `reason: DeadlineExceeded`.

Зауважте, що `.spec.activeDeadlineSeconds` Job має пріоритет перед його `.spec.backoffLimit`. Отже, Job, який повторно запускає один або кілька невдалих Podʼів, не розпочне розгортання додаткових Podʼів, якщо `activeDeadlineSeconds` вже досягнуто, навіть якщо `backoffLimit` ще не досягнуто.

Приклад:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  backoffLimit: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Зверніть увагу, що як саме специфікація Job, так і [специфікація шаблону Podʼа](/docs/concepts/workloads/pods/init-containers/#detailed-behavior) у межах Job мають поле `activeDeadlineSeconds`. Переконайтеся, що ви встановлюєте це поле на відповідному рівні.

Памʼятайте, що `restartPolicy` застосовується до Podʼа, а не до самого Job: автоматичного перезапуску Job не відбудеться, якщо статус Job `type: Failed`. Тобто механізми завершення Job, активовані за допомогою `.spec.activeDeadlineSeconds` і `.spec.backoffLimit`, призводять до остаточного збою Job, який потребує ручного втручання.

### Термінальні стани Job {#terminal-job-conditions}

Job має два можливих термінальних стани, кожному з яких відповідає стан Job (condition):

- Успішне виконання: стан Job `Complete`
- Невдача: стан Job `Failed`

Jobs зазнають невдачі з таких причин:

- Кількість невдач Podʼа перевищила вказане `.spec.backoffLimit` у специфікації Job. Для деталей див. [Політика backoff для збоїв Podʼа](#pod-backoff-failure-policy).
- Час виконання Job перевищив вказане `.spec.activeDeadlineSeconds`.
- Indexed Job, який використовує `.spec.backoffLimitPerIndex`, має збійні індекси. Для деталей див. [обмеження backoff на індекс](#backoff-limit-per-index).
- Кількість невдалих індексів у Job перевищила вказане значення `spec.maxFailedIndexes`. Для деталей див. [обмеження backoff на індекс](#backoff-limit-per-index).
- Невдалий Pod відповідає правилу у `.spec.podFailurePolicy`, яке має дію `FailJob`. Для деталей про те, як правила політики збоїв Podʼа можуть вплинути на оцінку невдачі, див. [Політика збоїв Podʼа](#pod-failure-policy).

Jobs успішні з таких причин:

- Кількість успішних Podʼів досягла вказаного `.spec.completions`.
- Виконані критерії, зазначені у `.spec.successPolicy`. Для деталей див. [Політика успіху](#success-policy).

У Kubernetes v1.31 та пізніших версіях контролер Job затримує додавання термінальних станів, `Failed` або `Complete`, поки всі Podʼи Job не будуть завершені.

У Kubernetes v1.30 та раніших версіях контролер Job додавав термінальні стани `Complete` або `Failed` відразу після того, як був запущений процес завершення Job та всі завершувачі Podʼа були видалені. Однак деякі Podʼи все ще могли працювати або завершуватися в момент додавання термінального стану.

У Kubernetes v1.31 та пізніших версіях контролер додає термінальні стани Job лише *після* завершення всіх Podʼів. Ви можете керувати цією поведінкою за допомогою [функціональних можливостей](/docs/reference/command-line-tools-reference/feature-gates/) `JobManagedBy` та `JobPodReplacementPolicy` (обидві стандартно увімкнені).

### Завершення Podʼів Job {#termination-of-job-pods}

Контролер Job додає стан `FailureTarget` або стан `SuccessCriteriaMet` до Job, щоб запустити завершення Podʼів після того, як Job відповідає критеріям успіху або невдачі.

Фактори, такі як `terminationGracePeriodSeconds`, можуть збільшити час від моменту додавання контролером Job стану `FailureTarget` або стану `SuccessCriteriaMet` до моменту, коли всі Podʼи Job завершаться і контролер Job додасть [термінальний стан](#terminal-job-conditions) (`Failed` або `Complete`).

Ви можете використовувати стан `FailureTarget` або стан `SuccessCriteriaMet`, щоб оцінити, чи Job зазнав невдачі чи досяг успіху, без необхідності чекати, поки контролер додасть термінальний стан.

Наприклад, ви можете захотіти вирішити, коли створити Job-замінник для невдалого Job. Якщо ви заміните невдалий Job, щойно зʼявиться стан `FailureTarget`, ваш Job-замінник запуститься раніше, але Podʼи невдалого Job і Job-замінника можуть працювати одночасно, використовуючи додаткові обчислювальні ресурси.

Або, якщо ваш кластер має обмежену місткість ресурсів, ви можете дочекатися появи стану `Failed` на Job, що затримає ваш Job-замінник, але збереже ресурси, оскільки ви дочекаєтеся видалення всіх невдалих Podʼів.

## Автоматичне очищення завершених Jobs {#clean-up-finished-jobs-automatically}

Зазвичай завершені Jobs вже не потрібні в системі. Їх зберігання створює тиск на API-сервер. Якщо Jobs керуються безпосередньо контролером вищого рівня, таким як [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/), їх можуть очищати CronJobs на основі заданої політики очищення за місткістю.

### Механізм TTL для завершених Jobs {#ttl-mechanism-for-finished-jobs}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Ще один спосіб автоматично очищати завершені Jobs (`Complete` або `Failed`) — це використовувати механізм TTL, наданий
[контролером TTL](/docs/concepts/workloads/controllers/ttlafterfinished/) для завершених ресурсів, вказуючи поле `.spec.ttlSecondsAfterFinished` у Job.

Коли контролер TTL очищує Job, він каскадно видаляє Job, тобто видаляє його залежні обʼєкти, такі як Podʼи, разом з Job. Зверніть увагу, що під час видалення Job будуть дотримані гарантії його життєвого циклу, такі як завершувачі.

Наприклад:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-ttl
spec:
  ttlSecondsAfterFinished: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job `pi-with-ttl` стане придатним для автоматичного видалення через `100` секунд після завершення.

Якщо поле встановлено в `0`, Job стане придатним для автоматичного видалення одразу після завершення. Якщо поле не вказане, Job не буде очищено контролером TTL після завершення.

{{< note >}}
Рекомендується встановлювати поле `ttlSecondsAfterFinished`, оскільки некеровані Jobs (Jobs, які ви створили безпосередньо, а не опосередковано через інші API робочого навантаження, такі як CronJob) мають стандартну політику видалення `orphanDependents`, що призводить до того, що Podʼи, створені некерованим Job, залишаються після того, як Job повністю видалено. Навіть якщо {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} зрештою [прибирає збором сміття](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection) Podʼи видаленого Job після їх збою або завершення, іноді ці залишкові Podʼи можуть погіршувати продуктивність кластера або в найгіршому випадку спричинити вихід кластера з ладу через це погіршення.

Ви можете використовувати [LimitRanges](/docs/concepts/policy/limit-range/) та [ResourceQuotas](/docs/concepts/policy/resource-quotas/), щоб обмежити кількість ресурсів, які певний простір імен може споживати.
{{< /note >}}

## Патерни використання Job {#job-patterns}

Обʼєкт Job може використовуватися для обробки набору незалежних, але повʼязаних *робочих одиниць*. Це можуть бути електронні листи для надсилання, кадри для рендерингу, файли для перекодування, діапазони ключів у базі даних NoSQL для сканування і так далі.

У складній системі може бути кілька різних наборів робочих одиниць. Тут ми розглядаємо лише один набір робочих одиниць, якими користувач хоче керувати разом — *пакетне завдання*.

Існує кілька різних патернів для паралельних обчислень, кожен з власними перевагами та недоліками. Компроміси:

- Один обʼєкт Job для кожної робочої одиниці або один обʼєкт Job для всіх робочих одиниць. Один Job на кожну робочу одиницю створює деяку накладну роботу для користувача та системи під час управління великою кількістю обʼєктів Job. Один Job для всіх робочих одиниць підходить краще для великої кількості одиниць.
- Кількість створених Podʼів дорівнює кількості робочих одиниць або кожен Pod може обробляти кілька робочих одиниць. Коли кількість Podʼів дорівнює кількості робочих одиниць, Podʼи зазвичай вимагають менше змін у наявному коді та контейнерах. Кожен Pod, що обробляє кілька робочих одиниць, підходить краще для великої кількості одиниць.
- Кілька підходів використовують чергу роботи. Це вимагає запуску сервісу черги та змін наявної програми чи контейнера, щоб вони використовували чергу роботи. Інші підходи легше адаптувати до наявного контейнеризованого застосунку.
- Коли Job повʼязаний із [headless Service](/docs/concepts/services-networking/service/#headless-services), ви можете дозволити Podʼам у межах Job спілкуватися один з одним для спільних обчислень.

Переваги та недоліки узагальнено у таблиці нижче, де стовпці з 2 по 4 відповідають зазначеним вище питанням. Назви патернів також є посиланнями на приклади та більш детальний опис.

| Патерн                                        | Один обʼєкт Job | Кількість Podʼів менша за робочі одиниці? | Використовувати застосунок без модифікацій? |
| ----------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|
| [Черга, Pod на одиницю роботи]                 |         ✓         |                             |      іноді           |
| [Черга змінної кількості Podʼів]                   |         ✓         |             ✓               |                     |
| [Indexed Job зі статичним призначенням роботи]       |         ✓         |                                          |          ✓          |
| [Job із комунікацією між Podʼами]             |         ✓         |         іноді              |      іноді           |
| [Розширення шаблону Job]                        |                   |                             |          ✓          |

Коли ви вказуєте завершення з `.spec.completions`, кожний Pod, створений контролером Job, має ідентичний [`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status). Це означає, що всі Podʼи для завдання матимуть однаковий командний рядок, однаковий образ, однакові томи та (майже) однакові змінні середовища. Ці патерни — це різні способи організації Podʼів для роботи над різними завданнями.

Ця таблиця показує обовʼязкові налаштування для `.spec.parallelism` та `.spec.completions` для кожного з патернів. Тут `W` — це кількість робочих одиниць.

|             Патерн                             | `.spec.completions` |  `.spec.parallelism` |
| ----------------------------------------------- |:-------------------:|:--------------------:|
| [Черга, Pod на одиницю роботи]                 |          W          |        будь-яка        |
| [Черга змінної кількості Podʼів]                   |         null        |        будь-яка        |
| [Indexed Job зі статичним призначенням роботи]       |          W          |        будь-яка        |
| [Job із комунікацією між Podʼами]             |          W          |         W            |
| [Розширення шаблону Job]                        |          1          |     повинно бути 1   |

## Розширене використання {#advanced-usage}

### Призупинення Job {#suspending-a-job}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Коли створюється Job, контролер Job негайно починає створювати Podʼи, щоб відповідати вимогам Job і продовжує це робити, доки Job не завершиться. Однак іноді ви можете хотіти тимчасово призупинити виконання Job та відновити його пізніше, або запускати Jobs у призупиненому стані, щоб власний контролер пізніше вирішував, коли їх запустити.

Щоб призупинити Job, ви можете оновити поле `.spec.suspend` Job на значення true; пізніше, коли ви захочете відновити його, оновіть його на значення false. Створення Job з `.spec.suspend` встановленим в true створить його в призупиненому стані.

У Kubernetes 1.35 або новіших версіях поле `.status.startTime` очищується під час призупинення Job, коли увімкнено функціональну можливість [MutableSchedulingDirectivesForSuspendedJobs](#mutable-scheduling-directives-for-suspended-jobs).

Під час відновлення Job після призупинення його поле `.status.startTime` буде скинуто на поточний час. Це означає, що таймер `.spec.activeDeadlineSeconds` буде зупинений і перезапущений, коли Job буде призупинено та відновлено.

Коли ви призупиняєте Job, будь-які запущені Podʼи, які не мають статусу `Completed`, будуть [завершені](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) з сигналом SIGTERM. Період коректного завершення Podʼа буде дотримано, і ваш Pod має обробити цей сигнал протягом цього періоду. Це може включати в себе збереження прогресу на майбутнє або скасування змін. Podʼи, завершені у такий спосіб, не враховуватимуться при підрахунку `completions` Job.

Приклад визначення Job в призупиненому стані може виглядати так:

```shell
kubectl get job myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: myjob
spec:
  suspend: true
  parallelism: 1
  completions: 5
  template:
    spec:
      ...
```

Ви також можете перемикати призупинення Job, використовуючи командний рядок.

Призупиніть активний Job:

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":true}}'
```

Відновіть призупинений Job:

```shell
kubectl patch job/myjob --type=strategic --patch '{"spec":{"suspend":false}}'
```

Статус Job може бути використаний для визначення того, чи Job призупинено чи його було призупинено раніше:

```shell
kubectl get jobs/myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
# .metadata та .spec опущено
status:
  conditions:
  - lastProbeTime: "2021-02-05T13:14:33Z"
    lastTransitionTime: "2021-02-05T13:14:33Z"
    status: "True"
    type: Suspended
  startTime: "2021-02-05T13:13:48Z"
```

Стан Job типу "Suspended" зі статусом "True" означає, що Job призупинено; поле `lastTransitionTime` може бути використане для визначення того, як довго Job було призупинено. Якщо статус цього стану є "False", то Job було раніше призупинено і зараз він працює. Якщо такого стану не існує в статусі Job, то Job ніколи не був зупинений.

Також створюються події, коли Job призупинено та відновлено:

```shell
kubectl describe jobs/myjob
```

```none
Name:           myjob
...
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  12m   job-controller  Created pod: myjob-hlrpl
  Normal  SuccessfulDelete  11m   job-controller  Deleted pod: myjob-hlrpl
  Normal  Suspended         11m   job-controller  Job suspended
  Normal  SuccessfulCreate  3s    job-controller  Created pod: myjob-jvb44
  Normal  Resumed           3s    job-controller  Job resumed
```

Останні чотири події, зокрема події "Suspended" та "Resumed", є прямим наслідком перемикання поля `.spec.suspend`. Протягом цього часу ми бачимо, що жоден Pod не був створений, але створення Podʼів розпочалося знову, як тільки Job було відновлено.

### Змінні директиви планування {#mutable-scheduling-directives}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

У більшості випадків паралельний Job потребуватиме, щоб його Podʼи запускалися з певними обмеженнями, типу "всі в одній зоні" або "всі на GPU моделі x або y", але не комбінація обох.

[Поле призупинення](#suspending-a-job) є першим кроком до такої семантики. Призупинення дозволяє власному контролеру черги вирішувати, коли має початися Job; однак після зняття призупинення власний контролер черги не впливає на те, де насправді будуть розташовані Podʼи Job.

Ця функція дозволяє оновлювати директиви планування Job до запуску, що дає власному контролеру черги змогу впливати на розташування Podʼів, водночас залишаючи саме призначення Podʼів вузлам за kube-scheduler.

Поля в шаблоні Podʼа Job, які можна оновити, це спорідненість вузла, селектор вузла, tolerations, мітки, анотації та [scheduling gates](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/).

#### Змінні директиви планування для призупинених Jobs {#mutable-scheduling-directives-for-suspended-jobs}

{{< feature-state feature_gate_name="MutableSchedulingDirectivesForSuspendedJobs" >}}

У Kubernetes 1.34 та раніших версіях змінювати директиви планування Podʼа дозволяється лише для призупинених Jobs, які ніколи не відновлювалися раніше. Починаючи з Kubernetes 1.35, це дозволяється для будь-яких призупинених Jobs, коли увімкнено функціональну можливість `MutableSchedulingDirectivesForSuspendedJobs`.

Крім того, ця функціональна можливість дозволяє очищати поле `.status.startTime` при [призупиненні Job](#suspending-a-job).

### Змінні ресурси Podʼа для призупинених Jobs {#mutable-pod-resources-for-suspended-jobs}

{{< feature-state feature_gate_name="MutablePodResourcesForSuspendedJobs" >}}

Адміністратор кластера може визначити контроль допуску в Kubernetes, змінюючи запити на ресурси або обмеження для Job на основі правил політики.

За допомогою цієї функції Kubernetes також дозволяє змінювати шаблон Podʼа для [призупиненого Job](#suspending-a-job), щоб змінити вимоги до ресурсів Podʼів у Job. Це відрізняється від _зміни розміру Podʼа на місці_, яке дозволяє оновлювати ресурси по одному Podʼу за раз для Podʼів, які вже працюють.

Клієнт, який встановлює нові запити на ресурси або обмеження, може відрізнятися від клієнта, який спочатку створив Job, і не обовʼязково має бути адміністратором кластера.

### Визначення власного селектора Podʼа {#specifying-your-own-pod-selector}

Зазвичай, коли ви створюєте обʼєкт Job, ви не вказуєте `.spec.selector`. Логіка системного визначення типових значень додає це поле під час створення Job. Вона обирає значення селектора, яке не перетинатиметься з жодним іншим Job.

Однак у деяких випадках вам може знадобитися перевизначити цей автоматично встановлений селектор. Для цього ви можете вказати `.spec.selector` Job.

Будьте дуже уважні при цьому. Якщо ви вказуєте селектор міток, який не є унікальним для Podʼів цього Job, і який відповідає неповʼязаним Podʼам, то Podʼи неповʼязаного Job можуть бути видалені, або цей Job може зарахувати інші Podʼи як свої завершення, або один чи обидва Jobs можуть відмовитися створювати Podʼи чи виконуватися до завершення. Якщо вибрано неунікальний селектор, інші контролери (наприклад, ReplicationController) та їхні Podʼи також можуть поводитися непередбачувано. Kubernetes не завадить вам помилитися під час вказування `.spec.selector`.

Ось приклад ситуації, коли вам може знадобитися використовувати цю функцію.

Скажімо, Job `old` вже запущений. Ви хочете, щоб наявні Podʼи продовжували працювати, але щоб решта Podʼів, які він створює, використовували інший шаблон Podʼа, а Job мав нову назву. Ви не можете оновити Job, оскільки ці поля не можна оновлювати. Отже, ви видаляєте Job `old`, але *залишаєте його Podʼи запущеними*, використовуючи `kubectl delete jobs/old --cascade=orphan`. Перед видаленням ви занотовуєте, який селектор він використовує:

```shell
kubectl get job old -o yaml
```

Вивід буде подібний до цього:

```yaml
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

Потім ви створюєте новий Job із назвою `new` і явно вказуєте той самий селектор. Оскільки наявні Podʼи мають мітку `batch.kubernetes.io/controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`, вони також контролюються Job `new`.

Вам потрібно вказати `manualSelector: true` у новому Job, оскільки ви не використовуєте селектор, який система зазвичай генерує автоматично.

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      batch.kubernetes.io/controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

Сам новий Job матиме uid, відмінний від `a8f3d00d-c6d2-11e5-9f87-42010af00002`. Встановлення `manualSelector: true` говорить системі, що ви розумієте, що робите, і дозволяє цю невідповідність.

### Відстеження Job за допомогою завершувачів {#job-tracking-with-finalizers}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Панель управління стежить за Podʼами, які належать до будь-якого Job, і виявляє, чи якийсь такий Pod видалено з API-сервера. Для цього контролер Job створює Podʼи з завершувачем `batch.kubernetes.io/job-tracking`. Контролер видаляє завершувач тільки після того, як Pod був врахований в стані Job, що дозволяє видалити Pod іншими контролерами або користувачами.

{{< note >}}
Див. [Мій Pod залишається в стані завершення](/docs/tasks/debug/debug-application/debug-pods/), якщо ви спостерігаєте, що Podʼи з Job залишаються з завершувачем відстеження.
{{< /note >}}

### Еластичні Indexed Jobs {#elastic-indexed-jobs}

{{< feature-state feature_gate_name="ElasticIndexedJob" >}}

Ви можете масштабувати Indexed Jobs вгору або вниз, змінюючи як `.spec.parallelism`, так і `.spec.completions` разом, так щоб `.spec.parallelism == .spec.completions`. Під час масштабування вниз Kubernetes видаляє Podʼи з вищими індексами.

Сценарії використання еластичних Indexed Jobs включають пакетні робочі навантаження, які вимагають масштабування Indexed Job, такі як завдання навчання MPI, Horovod, Ray та PyTorch.

{{< note >}}
Коли функціональна можливість [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/) увімкнена і Job використовує [групове планування](#integrate-with-workload-apis), розмір групи слідує за змінним `schedulingPolicy.gang.minCount` (або `.spec.parallelism`, коли `minCount` не встановлено). Ви можете масштабувати групу одним із двох способів:

- встановити `.spec.scheduling.schedulingPolicy.gang.minCount` безпосередньо, або
- змінити `.spec.parallelism`, коли `minCount` не встановлено.

При будь-якій зміні контролер перекомпілює `Workload` та повторно синхронізує розмір `PodGroup`, масштабуючи групу на місці без перестворення Job. Оновлення застосовуються лише до Podʼів, які оцінюються в майбутніх циклах планування, і не впливають на вже заплановані Podʼи. `gang.minCount`, більше за `.spec.parallelism`, відхиляється, оскільки така група ніколи не може бути задоволена.
{{< /note >}}

### Відкладене створення Podʼів-замінників {#pod-replacement-policy}

{{< feature-state feature_gate_name="JobPodReplacementPolicy" >}}

Типово контролер Job створює Podʼи заново, щойно вони зазнають збою або почнуть завершуватися (матимуть відмітку видалення). Це означає, що в певний момент часу, коли деякі з Podʼів завершуються, кількість запущених Podʼів для Job може бути більшою, ніж `parallelism` або більше, ніж один Pod на індекс (якщо ви використовуєте Indexed Job).

Ви можете створювати Podʼи-замінники лише тоді, коли Podʼи, які знаходяться в стані завершення, повністю завершені (мають `status.phase: Failed`). Для цього встановіть `.spec.podReplacementPolicy: Failed`. Типова політика заміни залежить від того, чи Job має встановлену політику збоїв Podʼа. Якщо для Job не визначено політику збоїв Podʼа, відсутність поля `podReplacementPolicy` вибирає політику заміни `TerminatingOrFailed`: панель управління створює Podʼи-замінники негайно після видалення Podʼів (як тільки панель управління бачить, що Pod для цього Job має встановлене значення `deletionTimestamp`). Для Jobs із встановленою політикою збоїв Podʼа стандартне значення `podReplacementPolicy` — це `Failed`, інших значень не передбачено. Докладніше про політики збоїв Podʼа для Jobs можна дізнатися у розділі [Політика збоїв Podʼа](#pod-failure-policy).

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  podReplacementPolicy: Failed
  ...
```

При увімкненій функціональній можливості у вашому кластері ви можете перевірити поле `.status.terminating` Job. Значення цього поля — це кількість Podʼів, якими володіє Job, які зараз перебувають у стані завершення.

```shell
kubectl get jobs/myjob -o yaml
```

```yaml
apiVersion: batch/v1
kind: Job
# .metadata та .spec опущено
status:
  terminating: 3 # три Podʼи, які перебувають у стані завершення і ще не досягли стану Failed
```

### Делегування керування обʼєктом Job зовнішньому контролеру {#delegation-of-managing-a-job-object-to-external-controller}

{{< feature-state feature_gate_name="JobManagedBy" >}}

Ця функція дозволяє вам вимкнути вбудований контролер Job для конкретного Job і делегувати узгодження цього Job зовнішньому контролеру.

Ви вказуєте контролер, який узгоджує Job, встановлюючи власне значення для поля `spec.managedBy` — будь-яке значення окрім `kubernetes.io/job-controller`. Значення поля є незмінним.

{{< note >}}
Під час використання цієї функції переконайтеся, що контролер, вказаний у полі, встановлено, інакше Job може бути не узгоджений взагалі.
{{< /note >}}

{{< note >}}
При розробці зовнішнього контролера Job, будьте уважні: ваш контролер повинен працювати відповідно до визначень специфікації API та полів статусу обʼєкта Job.

Докладно ознайомтесь з ними в [API Job](/docs/reference/kubernetes-api/workload-resources/job-v1/). Ми також рекомендуємо запустити наскрізні тести сумісності для обʼєкта Job, щоб перевірити вашу реалізацію.

Нарешті, при розробці зовнішнього контролера Job переконайтеся, що він не використовує завершувач `batch.kubernetes.io/job-tracking`, зарезервований для вбудованого контролера.
{{< /note >}}

## Альтернативи {#alternatives}

### Окремі Podʼи {#bare-pods}

Коли вузол, на якому працює Pod, перезавантажується або виходить з ладу, Pod завершується і не буде перезапущений. Однак Job створить нові Podʼи для заміни завершених. З цієї причини ми рекомендуємо використовувати Job замість окремого Podʼа, навіть якщо ваш застосунок вимагає тільки одного Podʼа.

### Replication Controller {#replication-controller}

Jobs доповнюють [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/). Replication Controller керує Podʼами, завершення яких не очікується (наприклад, вебсервери), а Job керує Podʼами, завершення яких очікується (наприклад, пакетні завдання).

Як зазначено в розділі [Життєвий цикл Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/), `Job` придатний *лише* для Podʼів з `RestartPolicy`, рівним `OnFailure` або `Never`.

{{< note >}}
Якщо `RestartPolicy` не встановлено, стандартне значення — `Always`.
{{< /note >}}

### Один Job запускає контролер Podʼів {#single-job-starts-controller-pod}

Ще один патерн: один Job створює Pod, який своєю чергою створює інші Podʼи, виступаючи як свого роду власний контролер для цих Podʼів. Це дає найбільшу гнучкість, але може бути дещо складним для початку використання та пропонує меншу інтеграцію з Kubernetes.

Перевагою цього підходу є те, що загальний процес отримує гарантію завершення обʼєкта Job, але при цьому повністю контролюється те, які Podʼи створюються і як їм призначається робота.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся про [Podʼи](/docs/concepts/workloads/pods).
- Дізнайтеся про різні способи запуску Jobs:
  - [Груба паралельна обробка за допомогою черги роботи](/docs/tasks/job/coarse-parallel-processing-work-queue/)
  - [Тонка паралельна обробка за допомогою черги роботи](/docs/tasks/job/fine-parallel-processing-work-queue/)
  - Використовуйте [Indexed Jobs для паралельної обробки зі статичним призначенням роботи](/docs/tasks/job/indexed-parallel-processing-static/)
  - Створіть кілька Jobs на основі шаблону: [Паралельна обробка з використанням розширень](/docs/tasks/job/parallel-processing-expansion/)
- Перейдіть за посиланнями в розділі [Автоматичне очищення завершених Jobs](#clean-up-finished-jobs-automatically), щоб дізнатися більше про те, як ваш кластер може очищати завершені та/або невдалі завдання.
- `Job` є частиною REST API Kubernetes. Ознайомтесь з визначенням обʼєкта {{< api-reference page="batch/job-v1" >}}, щоб зрозуміти API для Jobs.
- Прочитайте про [`CronJob`](/docs/concepts/workloads/controllers/cron-jobs/), який ви можете використовувати для визначення серії Jobs, які виконуватимуться за розкладом, подібно до інструмента UNIX `cron`.
- Попрактикуйтесь в налаштуванні обробки відновлюваних і невідновлюваних збоїв Podʼів за допомогою `podFailurePolicy` на основі покрокових [прикладів](/docs/tasks/job/pod-failure-policy/).
- Дізнайтеся про [групове планування](/docs/concepts/scheduling-eviction/gang-scheduling/)
  для планування паралельних Jobs за принципом "все або нічого".

[Черга, Pod на одиницю роботи]: /docs/tasks/job/coarse-parallel-processing-work-queue/
[Черга змінної кількості Podʼів]: /docs/tasks/job/fine-parallel-processing-work-queue/
[Indexed Job зі статичним призначенням роботи]: /docs/tasks/job/indexed-parallel-processing-static/
[Job із комунікацією між Podʼами]: /docs/tasks/job/job-with-pod-to-pod-communication/
[Розширення шаблону Job]: /docs/tasks/job/parallel-processing-expansion/
