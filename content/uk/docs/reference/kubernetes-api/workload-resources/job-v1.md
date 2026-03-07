---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "Job"
content_type: "api_reference"
description: "Job представляє конфігурацію окремого завдання."
title: "Job"
weight: 10
auto_generated: false
---

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`

## Job {#Job}

Job представляє конфігурацію окремого завдання.

---

- **apiVersion**: batch/v1

- **kind**: Job

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Детальніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

  Специфікація бажаної поведінки завдання. Детальніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/job-v1#JobStatus" >}}">JobStatus</a>)

  Поточний статус завдання. Детальніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## JobSpec {#JobSpec}

JobSpec описує, як виглядатиме виконання завдання.

### Репліки {#Replicas}

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), обовʼязково

  Описує pod, який буде створено під час виконання завдання. Єдині дозволені значення template.spec.restartPolicy — "Never" або "OnFailure". Детальніше: [https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

- **parallelism** (int32)

  Визначає максимальну бажану кількість Podʼів, які завдання повинно виконувати в будь-який момент часу. Фактична кількість Podʼів, що працюють в стабільному стані, буде меншою за цю кількість, коли ((.spec.completions - .status.successful) < .spec.parallelism), тобто коли залишилося менше роботи, ніж максимально дозволена паралельність. Детальніше: [https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

### Життєвий цикл {#Lifecycle}

- **completions** (int32)

  Визначає бажану кількість успішно завершених Podʼів, які має виконати завдання. Встановлення null означає, що успіх будь-якого Podʼа сигналізує про успіх усіх Podʼів і дозволяє паралельності мати будь-яке позитивне значення. Встановлення значення 1 означає, що паралельність обмежується до 1 і успіх цього Podʼа сигналізує про успіх завдання. Детальніше: [https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

- **completionMode** (string)

  completionMode визначає, як відстежуються завершення Podʼів. Може бути `NonIndexed` (стандартно) або `Indexed`.

  `NonIndexed` означає, що завдання вважається завершеним, коли успішно завершено кількість Podʼів вказана у .spec.completions. Кожне завершення Podʼа є аналогічним до іншого.

  `Indexed` означає, що Podʼи завдання отримують асоційований індекс завершення від 0 до (.spec.completions — 1), доступний в анотації batch.kubernetes.io/job-completion-index. Завдання вважається завершеним, коли для кожного індексу є один успішно завершений Pod. Коли значення `Indexed`, .spec.completions має бути вказано, а `.spec.parallelism` має бути менше або дорівнювати 10^5. Крім того, імʼя Podʼа має форму `$(job-name)-$(index)-$(random-string)`, а імʼя хоста Podʼа має форму `$(job-name)-$(index)`.

  У майбутньому можуть бути додані інші режими завершення. Якщо контролер завдання спостерігає режим, який він не розпізнає, що можливо під час оновлень через різницю версій, контролер пропускає оновлення для завдання.

  Можливі значення переліку (enum):
  - `"Indexed"` — це режим завершення Job. У цьому режимі Podʼи Job отримують відповідний індекс завершення від 0 до (.spec.completions - 1). Job вважається завершеним, коли Pod завершується для кожного індексу завершення.
  - `"NonIndexed"` — це режим завершення Job. У цьому режимі Job вважається завершеним, коли було успішно завершено .spec.completions Podʼи. Завершення Podʼів є гомологічними один до одного.

- **backoffLimit** (int32)

  Визначає кількість спроб перед тим, як відзначити завдання таким, що не вдалося. Стандартне  значення — 6, якщо не вказано backoffLimitPerIndex (тільки Indexed Job). Якщо вказано backoffLimitPerIndex, стандартно для backoffLimit встановлюється значення 2147483647.

- **activeDeadlineSeconds** (int64)

  Визначає тривалість у секундах відносно startTime, протягом якої завдання може бути активним, перш ніж система спробує його завершити; значення має бути додатним цілим числом. Якщо завдання призупинено (під час створення або через оновлення), цей таймер фактично зупиняється і скидається, коли завдання знову відновлюється.

- **ttlSecondsAfterFinished** (int32)

  ttlSecondsAfterFinished обмежує термін життя завдання, яке завершило виконання (або Complete, або Failed). Якщо це поле встановлено, то через ttlSecondsAfterFinished після завершення завдання воно може бути автоматично видалене. Коли завдання видаляється, його життєвий цикл (наприклад, завершувачі) буде враховуватись. Якщо це поле не встановлено, завдання не буде автоматично видалено. Якщо це поле встановлено на нуль, завдання може бути видалене відразу після завершення.

- **suspend** (boolean)

  suspend визначає, чи повинен контролер завдання створювати Podʼи чи ні. Якщо завдання створюється з параметром suspend, встановленим на true, контролер завдання не створює Podʼи. Якщо завдання призупиняється після створення (тобто прапорець змінюється з false на true), контролер завдання видалить усі активні Podʼи, повʼязані з цим завданням. Користувачі повинні спроєктувати своє робоче навантаження так, щоб воно могло правильно обробляти це. Призупинення завдання скине поле StartTime завдання, фактично скидаючи таймер ActiveDeadlineSeconds. Стандартне значення — false.

### Селектор {#Selector}

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  Запит до міток на Podʼах, які повинні відповідати кількості Podʼів. Зазвичай система встановлює це поле для вас. Детальніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)

- **manualSelector** (boolean)

  manualSelector керує генерацією міток Podʼів і селекторів Podʼів. Залиште `manualSelector` невстановленим, якщо ви не впевнені, що робите. Коли значення false або невстановлене, система вибирає унікальні мітки для цього завдання та додає ці мітки до шаблону Podʼа. Коли значення true, користувач відповідає за вибір унікальних міток і вказування селектора. Невдача у виборі унікальної мітки може спричинити некоректну роботу цього та інших завдань. Однак ви можете побачити `manualSelector=true` у завданнях, створених за допомогою старого API `extensions/v1beta1`. Детальніше: [https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector](/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector)

### Бета-рівень {#Beta-level}

- **podFailurePolicy** (PodFailurePolicy)

  Визначає політику обробки невдалих Podʼів. Зокрема, дозволяє вказати набір дій та умов, які повинні бути виконані для виконання повʼязаної дії. Якщо це поле порожнє, застосовується стандартна поведінка — лічильник невдалих Podʼів, представлений полем .status.failed завдання, збільшується і перевіряється з backoffLimit. Це поле не можна використовувати в комбінації з restartPolicy=OnFailure.

  <a name="PodFailurePolicy"></a>
  *PodFailurePolicy описує, як невдалі Podʼи впливають на backoffLimit.*

  - **podFailurePolicy.rules** ([]PodFailurePolicyRule), обовʼязково

    *Atomic: буде замінено під час обʼєднання*

    Список правил політики невдач Podʼів. Правила оцінюються послідовно. Як тільки правило відповідає невдачі Podʼа, решта правил ігнорується. Якщо жодне правило не відповідає невдачі Podʼа, застосовується стандартна обробка — лічильник невдач Podʼів збільшується і перевіряється з backoffLimit. Максимально дозволено 20 елементів.

    <a name="PodFailurePolicyRule"></a>
    *PodFailurePolicyRule описує, як обробляється невдача Podʼа, коли виконуються вимоги. Одне з onExitCodes і onPodConditions, але не обидва, можуть бути використані в кожному правилі.*

    - **podFailurePolicy.rules.action** (string), обовʼязково

      Визначає дію, яка виконується при невдачі Podʼа, коли виконуються вимоги. Можливі значення:

      - FailJob: означає, що завдання Podʼа позначається як Failed і всі запущені Podʼи завершуються.
      - FailIndex: означає, що індекс Podʼа позначається як Failed і не буде перезапущений.
      - Ignore: означає, що лічильник по відношенню до .backoffLimit не збільшується і створюється Pod заміна.
      - Count: означає, що Pod обробляється стандартним способом — лічильник .backoffLimit збільшується.

      Додаткові значення можуть бути додані в майбутньому. Клієнти повинні реагувати на невідому дію, пропускаючи правило.

      Можливі значення переліку (enum):
      - `"Count"` Це дія, яка може бути виконана при невдачі podʼа, невдача podʼа обробляється стандартним способом — лічильник .backoffLimit, представлений полем .status.failed завдання, збільшується.
      - `"FailIndex"` Це дія, яка може бути виконана при невдачі podʼа — позначити індекс Job як невдалий, щоб уникнути перезапусків у межах цього індексу. Цю дію можна використовувати лише тоді, коли встановлено backoffLimitPerIndex.
      - `"FailJob"` Це дія, яка може бути виконана при невдачі podʼа — позначити завдання podʼа як Failed і завершити всі запущені podʼи.
      - `"Ignore"` Це дія, яка може бути виконана при невдачі podʼа — лічильник .backoffLimit, представлений полем .status.failed завдання, не збільшується, і створюється заміна podʼа.

    - **podFailurePolicy.rules.onExitCodes** (PodFailurePolicyOnExitCodesRequirement)

      Представляє вимогу до кодів завершення контейнера.

      <a name="PodFailurePolicyOnExitCodesRequirement"></a>
      *PodFailurePolicyOnExitCodesRequirement описує вимогу для обробки невдалого Podʼа на основі кодів завершення його контейнера. Зокрема, перевіряється .state.terminated.exitCode для кожного контейнера застосунку та init-контейнера, представленого полями .status.containerStatuses і .status.initContainerStatuses у статусі Podʼа відповідно. Контейнери, завершені успішно (код завершення 0), виключаються з перевірки вимоги.*

      - **podFailurePolicy.rules.onExitCodes.operator** (string), обовʼязково

        Представляє стосунок між кодом(ами) завершення контейнера та зазначеними значеннями. Контейнери, завершені успішно (код завершення 0), виключаються з перевірки вимоги. Можливі значення:

        - In: вимога задовольняється, якщо хоча б один код завершення контейнера (може бути кілька, якщо є кілька контейнерів, не обмежених полем 'containerName') входить до набору зазначених значень.
        - NotIn: вимога задовольняється, якщо хоча б один код завершення контейнера (може бути кілька, якщо є кілька контейнерів, не обмежених полем 'containerName') не входить до набору зазначених значень.

        Додаткові значення можуть бути додані в майбутньому. Клієнти повинні реагувати на невідомий оператор, вважаючи, що вимога не задоволена.

        Можливі значення переліку (enum):
        - `"In"`
        - `"NotIn"`

      - **podFailurePolicy.rules.onExitCodes.values** ([]int32), обовʼязково

        *Set: унікальні значення зберігатимуться під час обʼєднання*

        Визначає набір значень. Кожен повернутий код завершення контейнера (може бути кілька у випадку кількох контейнерів) перевіряється щодо цього набору значень з урахуванням оператора. Список значень має бути впорядкованим і не містити дублікатів. Значення '0' не може бути використано для оператора In. Потрібен принаймні один елемент. Максимально дозволено 255 елементів.

      - **podFailurePolicy.rules.onExitCodes.containerName** (string)

        Обмежує перевірку кодів завершення контейнера контейнером з зазначеним імʼям. Коли null, правило застосовується до всіх контейнерів. Коли зазначено, воно має відповідати одному з імен контейнерів або init-контейнерів у шаблоні Podʼа.

    - **podFailurePolicy.rules.onPodConditions** ([]PodFailurePolicyOnPodConditionsPattern), обовʼязково

      *Atomic: буде замінено під час обʼєднання*

      Представляє вимогу до стану Podʼа. Вимога представлена як список шаблонів стан Podʼа. Вимога задовольняється, якщо хоча б один шаблон відповідає фактичному стану Podʼа. Максимально дозволено 20 елементів.

      <a name="PodFailurePolicyOnPodConditionsPattern"></a>
      *PodFailurePolicyOnPodConditionsPattern описує шаблон для відповідності фактичний стан Podʼа.*

      - **podFailurePolicy.rules.onPodConditions.type** (string), обовʼязково

        Визначає необхідний тип стану Podʼа. Для відповідності стану Podʼа потрібно, щоб зазначений тип відповідав типу стану Podʼа.

      - **podFailurePolicy.rules.onPodConditions.status** (string), обовʼязково

        Визначає необхідний статус стану Podʼа. Для відповідності стану Podʼа потрібно, щоб зазначений статус відповідав статусу стану Podʼа. Стандартне значення — True.


- **successPolicy** (SuccessPolicy)

  successPolicy вказує політику, коли Job може бути оголошено успішним. Якщо це поле порожнє, застосовується стандартна поведінка — Job вважається успішним лише тоді, коли кількість успішно виконаних podʼів дорівнює значенню completions. Якщо поле вказане, воно має бути незмінним і працює тільки для Indexed Jobs. Після того, як Job відповідає SuccessPolicy, невикористані podʼи завершуються.

  <a name="SuccessPolicy"></a>
  *SuccessPolicy описує, коли Job може бути оголошено успішним на основі успішності деяких показників.*

  - **successPolicy.rules** ([]SuccessPolicyRule), required

    *Atomic: буде замінено під час злиття*

    rules представляє список альтернативних правил для оголошення Jobs успішними до того, як `.status.succeeded >= .spec.completions`. Як тільки будь-яке з правил виконується, додається умова "SuccessCriteriaMet", і невикористані podʼи видаляються. Кінцевий стан для такого Job матиме стан "Complete". Ці правила оцінюються по порядку; як тільки Job відповідає одному з правил, інші ігноруються. Дозволено не більше 20 елементів.

    <a name="SuccessPolicyRule"></a>
    *SuccessPolicyRule описує правило для оголошення Job успішним. Кожне правило повинно мати вказаний принаймні один із параметрів: "succeededIndexes" або "succeededCount".*

    - **successPolicy.rules.succeededCount** (int32)

      `succeededCount` вказує мінімальний необхідний розмір фактичного набору успішно завершених індексів для Job. Коли `succeededCount` використовується разом із `succeededIndexes`, перевірка обмежується лише індексами, зазначеними в `succeededIndexes`. Наприклад, якщо `succeededIndexes` встановлено як "1-4", `succeededCount` дорівнює "3", а індекси, що були завершені — "1", "3" і "5", Job не оголошується успішним, оскільки враховуються лише індекси "1" і "3" згідно з цими правилами. Якщо це поле є null, воно не має стандартного значення і ніколи не оцінюється. Якщо вказано, воно повинно бути додатним цілим числом.

    - **successPolicy.rules.succeededIndexes** (string)

      `succeededIndexes` вказує набір індексів, які повинні бути у фактичному наборі успішно завершених індексів для Job. Список індексів має бути в межах від 0 до ".spec.completions-1" і не повинен містити дублікатів. Потрібен щонайменше один елемент. Індекси представлені у вигляді інтервалів, розділених комами. Інтервали можуть бути десятковими числами або парою десяткових чисел, розділених дефісом. Числа представляються як перший і останній елемент серії, розділені дефісом. Наприклад, якщо індекси, які були завершені — 1, 3, 4, 5 і 7, вони представлені як "1,3-5,7". Якщо це поле є null, воно не має стандартного значення і ніколи не оцінюється.

### Альфа-рівень {#Alpha-level}

- **backoffLimitPerIndex** (int32)

  Визначає ліміт кількості повторних спроб в межах індексу перед тим, як позначити цей індекс як невдалий. Коли цей параметр увімкнений, кількість невдач по індексу зберігається в анотації Podʼа batch.kubernetes.io/job-index-failure-count. Це поле можна встановити лише при completionMode=Indexed для завдання, і політика перезапуску Podʼа повинна бути Never. Поле незмінне.

- **managedBy** (string)

  Поле `ManagedBy` вказує контролер, який керує Job. Контролер Job у Kubernetes синхронізує jobʼи, які не мають цього поля взагалі або якщо значення поля — зарезервований рядок `kubernetes.io/job-controller`, але пропускає синхронізацію Job із власними значенням у цьому полі. Значення має бути дійсним шляхом із префіксом домену (наприклад, acme.io/foo) — усі символи перед першим "/" мають бути дійсним піддоменом відповідно до RFC 1123. Усі символи після першого "/" мають бути дійсними символами HTTP-шляху згідно з RFC 3986. Значення не може перевищувати 63 символів. Це поле є незмінним.

- **maxFailedIndexes** (int32)

  Визначає максимальну кількість невдалих індексів перед тим, як позначити завдання як невдале, коли backoffLimitPerIndex встановлено. Як тільки кількість невдалих індексів перевищує це число, все завдання позначається як Failed і його виконання припиняється. Якщо залишити null, завдання продовжує виконання всіх своїх індексів і позначається станом завдання `Complete`. Це поле можна вказати лише, коли встановлено backoffLimitPerIndex. Воно може бути null або дорівнювати кількості completions. Воно обовʼязково і повинно бути менше або дорівнювати 10^4, коли кількість completions більша за 10^5.

- **podReplacementPolicy** (string)

  podReplacementPolicy визначає, коли створювати нові Podʼи на заміну. Можливі значення:

  - TerminatingOrFailed означає, що ми створюємо Podʼи повторно, коли вони завершуються (мають metadata.deletionTimestamp) або не зазнали збою.
  - Failed означає, що потрібно чекати, поки раніше створений Pod повністю завершиться (має phase Failed або Succeeded) перед створенням нового Podʼа на заміну.

  При використанні podFailurePolicy, Failed є єдиним допустимим значенням. TerminatingOrFailed і Failed є допустимими значеннями, коли podFailurePolicy не використовується.

  Можливі значення переліку (enum):
  - `"Failed"` означає, що перед створенням замінювального Pod необхідно дочекатися повного завершення роботи раніше створеного Pod (фаза Failed або Succeeded).
  - `"TerminatingOrFailed"` означає, що ми створюємо Podʼи повторно, коли вони завершуються (мають metadata.deletionTimestamp) або не зазнали збою.

## JobStatus {#JobStatus}

JobStatus представляє поточний стан Job.

---

- **startTime** (Time)

  Представляє час, коли контролер Job почав обробку завдання. Коли Job створюється в призупиненому стані, це поле не встановлюється до першого відновлення. Це поле скидається кожного разу, коли Job відновлюється після призупинення. Воно представлене у форматі RFC3339 і є в UTC.

  Якщо поле встановлено, його можна видалити лише після призупинення завдання. Поле не можна змінити, поки завдання не призупинено або не завершено.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **completionTime** (Time)

  Представляє час, коли завдання було завершено. Це поле може не встановлюватися в порядку "відбувається перед" у різних операціях. Воно представлене у форматі RFC3339 і є в UTC. Час завершення встановлюється, коли завдання успішно завершується, і тільки тоді. Значення не можна оновити або видалити. Значення вказує на той самий або пізніший момент часу, що і поле startTime.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **active** (int32)

  Кількість Podʼів в стані очікування та працюючих Podʼів, які не завершуються (без мітки видалення). Значення дорівнює нулю для завершених завдань.

- **failed** (int32)

  Кількість Podʼів, які досягли фази Failed. Значення зростає монотонно.

- **succeeded** (int32)

  Кількість Podʼів, які досягли фази Succeeded. Значення монотонно зростає для даної специфікації. Однак воно може зменшуватись у відповідь на скорочення кількості job, що еластично індексуються.

- **completedIndexes** (string)

  completedIndexes містить завершені індекси, коли .spec.completionMode = "Indexed" у текстовому форматі. Індекси представлені у вигляді десяткових чисел, розділених комами. Числа перелічені у порядку зростання. Три або більше послідовних числа стискаються і представлені першим і останнім елементами серії, розділеними дефісом. Наприклад, якщо завершені індекси 1, 3, 4, 5 і 7, вони представлені як "1,3-5,7".

- **conditions** ([]JobCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Atomic: буде замінено під час обʼєднання*

  Останні доступні спостереження за поточним станом обʼєкта. Коли Job не вдається, один зі станів матиме тип "Failed" і статус true. Коли Job призупинено, один зі станів матиме тип "Suspended" і статус true; коли Job відновлюється, статус цього стану стає false. Коли Job завершено, один з станів матиме тип "Complete" і статус true.

  Завдання вважається завершеним, коли воно перебуває в термінальному стані "Complete" або "Failed". Завдання не може мати одночасно стан "Complete" і "Failed". Крім того, воно не може перебувати в станах "Complete" і "FailureTarget". Умови "Complete", "Failed" і "FailureTarget" не можуть бути відключені.

  Додаткова інформація: [https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

  <a name="JobCondition"></a>
  *JobCondition описує поточний стан завдання.*

  - **conditions.status** (string), обовʼязково

    Статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану завдання, Complete або Failed.

  - **conditions.lastProbeTime** (Time)

    Останній раз, коли стан було перевірено.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.lastTransitionTime** (Time)

    Останній раз, коли стан переходила з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, із зазначенням деталей останнього переходу.

  - **conditions.reason** (string)

    (коротка) причина останнього переходу стану.

- **uncountedTerminatedPods** (UncountedTerminatedPods)

  uncountedTerminatedPods містить UID Podʼів, які завершили роботу, але контролер завдань ще не врахував їх у статусних лічильниках.

  Контролер завдань створює Podʼи з завершувачем. Коли Pod завершується (успішно або з помилкою), контролер виконує три кроки для врахування його у статусі завдання:

  1. Додає UID Podʼа до масивів у цьому полі.
  2. Видаляє завершувач Podʼа.
  3. Видаляє UID Podʼа з масивів, збільшуючи відповідний лічильник.

  Старі завдання можуть не відстежуватися з використанням цього поля, у такому випадку поле залишається порожнім. Структура порожня для завершених завдань .

  <a name="UncountedTerminatedPods"></a>
  *UncountedTerminatedPods містить UID Podʼів, які завершили роботу, але ще не враховані в лічильниках статусу завдання.*

  - **uncountedTerminatedPods.failed** ([]string)

    *Set: унікальні значення зберігатимуться під час обʼєднання*

    failed містить UID Podʼів, що завершилися з помилкою.

  - **uncountedTerminatedPods.succeeded** ([]string)

    *Set: унікальні значення зберігатимуться під час обʼєднання*

    succeeded містить UID Podʼів, що завершилися успішно.

### Бета-рівень {#Beta-level-1}

- **ready** (int32)

  Кількість активних Podʼів, які мають стан Ready та не завшуються (без deletionTimestamp)

### Альфа-рівень {#Alpha-level-2}

- **failedIndexes** (string)

  FailedIndexes зберігає невдалі індекси, коли spec.backoffLimitPerIndex є набором. Індекси представлені у текстовому форматі, аналогічному до поля `completedIndexes`, тобто вони зберігаються як десяткові цілі числа, розділені комами. Числа подані в порядку зростання. Три або більше послідовних числа стискаються і представлені першим та останнім елементом серії, розділеними дефісом. Наприклад, якщо невдалі індекси: 1, 3, 4, 5 і 7, вони представлені як "1,3-5,7". Набір невдалих індексів не може перетинатися з набором завершених індексів.

- **terminating** (int32)

  Кількість Podʼів, які завершуються (у фазі Pending або Running та мають deletionTimestamp).

  Це поле знаходиться на бета-рівні. Контролер завдань заповнює це поле, коли ввімкнено функцію JobPodReplacementPolicy (стандартно увімкнено).

## JobList {#JobList}

JobList представляє собою колекцію завдань.

---

- **apiVersion**: batch/v1

- **kind**: JobList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>), обовʼязково

  Список завдань (Job).

## Операції {#Operations}

---

### `get` отримати вказане завдання {#get-read-the-specified-job}

#### HTTP запит {#http-request}

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

401: Unauthorized

### `get` отримати статус вказаного завдання {#get-read-the-status-of-the-specified-job}

#### HTTP запит {#http-request-1}

GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Job {#list-or-watch-objects-of-kind-job}

#### HTTP запит {#http-request-2}

GET /apis/batch/v1/namespaces/{namespace}/jobs

#### Параметри {#parameters-2}

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

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): ОК

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Job {#list-or-watch-objects-of-kind-job-1}

#### HTTP запит {#http-request-3}

GET /apis/batch/v1/jobs

#### Параметри {#parameters-3}

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

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/job-v1#JobList" >}}">JobList</a>): ОК

401: Unauthorized

### `create` створення Job {#create-create-a-job}

#### HTTP запит {#http-request-4}

POST /apis/batch/v1/namespaces/{namespace}/jobs

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

202 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Job {#update-replace-the-specified-job}

#### HTTP запит {#http-request-5}

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Job {#update-replace-the-status-of-the-specified-job}

#### HTTP запит {#http-request-6}

PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Job {#patch-partially-update-the-specified-job}

#### HTTP запит {#http-request-7}

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Job {#patch-partially-update-the-status-of-the-specified-job}

#### HTTP запит {#http-request-8}

PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): ОК

201 (<a href="{{< ref "../workload-resources/job-v1#Job" >}}">Job</a>): Created

401: Unauthorized

### `delete` видалення Job {#delete-delete-a-job}

#### HTTP запит {#http-request-9}

DELETE /apis/batch/v1/namespaces/{namespace}/jobs/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва завдання

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

#### Відповідь

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Job {#deletecollection-delete-collection-of-job}

#### HTTP запит {#http-request-10}

DELETE /apis/batch/v1/namespaces/{namespace}/jobs

#### Параметри {#parameters-10}

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

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

401: Unauthorized
