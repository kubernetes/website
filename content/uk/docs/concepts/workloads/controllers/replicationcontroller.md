---
title: ReplicationController
api_metadata:
- apiVersion: "v1"
  kind: "ReplicationController"
content_type: concept
weight: 90
description: >-
  Застарілий API для керування робочими навантаженнями, які можуть горизонтально масштабуватися. Замінено API Deployment та ReplicaSet.
---

<!-- overview -->

{{< note >}}
[`Deployment`](/docs/concepts/workloads/controllers/deployment/), який налаштовує [`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/), тепер є рекомендованим способом налаштування реплікації.
{{< /note >}}

_ReplicationController_ гарантує, що завжди запущено зазначену кількість реплік Podʼів. Іншими словами, ReplicationController гарантує, що Pod або однорідний набір Podʼів завжди працює та доступний.

<!-- body -->

## Як працює ReplicationController {#how-a-replicationcontroller-works}

Якщо є занадто багато Podʼів, ReplicationController завершує зайві Podʼи. Якщо Podʼів замало, ReplicationController запускає додаткові. На відміну від вручну створених Podʼів, Podʼи, якими керує ReplicationController, автоматично замінюються, якщо вони зазнають збою, видаляються або завершуються. Наприклад, ваші Podʼи створюються на вузлі заново після обслуговування з порушенням роботи, такого як оновлення ядра. З цієї причини ви повинні використовувати ReplicationController, навіть якщо ваш застосунок вимагає лише одного Podʼа. ReplicationController схожий на наглядача процесів, але замість того, щоб наглядати за окремими процесами на одному вузлі, ReplicationController наглядає за кількома Podʼами на різних вузлах.

ReplicationController часто скорочується до "rc" в обговореннях та як скорочення в командах kubectl.

Простим випадком є створення одного обʼєкта ReplicationController для надійного запуску одного екземпляра Podʼа протягом необмеженого часу. Складніший випадок — це запуск кількох ідентичних реплік реплікованого сервісу, наприклад, вебсерверів.

## Запуск прикладу ReplicationController {#running-an-example-replicationcontroller}

Цей приклад конфігурації ReplicationController запускає три копії вебсервера nginx.

{{% code_sample file="controllers/replication.yaml" %}}

Запустіть цей приклад, завантаживши файл прикладу, а потім виконавши таку команду:

```shell
kubectl apply -f https://k8s.io/examples/controllers/replication.yaml
```

Вивід подібний до такого:

```none
replicationcontroller/nginx created
```

Перевірте стан ReplicationController за допомогою цієї команди:

```shell
kubectl describe replicationcontrollers/nginx
```

Вивід подібний до такого:

```none
Name:        nginx
Namespace:   default
Selector:    app=nginx
Labels:      app=nginx
Annotations:    <none>
Replicas:    3 current / 3 desired
Pods Status: 0 Running / 3 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=nginx
  Containers:
   nginx:
    Image:              nginx
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen       LastSeen     Count    From                        SubobjectPath    Type      Reason              Message
  ---------       --------     -----    ----                        -------------    ----      ------              -------
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-qrm3m
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-3ntk0
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-4ok8v
```

Тут створено три Podʼи, але жоден ще не працює, можливо, через те, що виконується завантаження образу. Трохи пізніше та сама команда може показати:

```shell
Pods Status:    3 Running / 0 Waiting / 0 Succeeded / 0 Failed
```

Щоб перелічити всі Podʼи, які належать ReplicationController у формі, придатній для машинного читання, можна використовувати команду на зразок:

```shell
pods=$(kubectl get pods --selector=app=nginx --output=jsonpath={.items..metadata.name})
echo $pods
```

Вивід подібний до такого:

```none
nginx-3ntk0 nginx-4ok8v nginx-qrm3m
```

Тут селектор такий самий, як і селектор для ReplicationController (бачимо у виводі `kubectl describe`), і в іншій формі у `replication.yaml`. Опція `--output=jsonpath` вказує вираз із назвою кожного Podʼа в отриманому списку.

## Створення маніфесту ReplicationController {#writing-a-replicationcontroller-manifest}

Як і з усіма іншими конфігураціями Kubernetes, для ReplicationController потрібні поля `apiVersion`, `kind` і `metadata`.

Коли панель управління створює нові Podʼи для ReplicationController, `.metadata.name` ReplicationController є частиною основи для назв цих Podʼів. Назва ReplicationController повинна бути дійсним значенням [DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names), але це може призводити до неочікуваних результатів для імен хостів Podʼів. Для забезпечення найкращої сумісності назва повинна відповідати суворішим правилам для [DNS-мітки](/docs/concepts/overview/working-with-objects/names#dns-label-names).

Для загальної інформації про роботу з файлами конфігурації дивіться [управління обʼєктами](/docs/concepts/overview/working-with-objects/object-management/).

ReplicationController також потребує розділу [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Шаблон Podʼа {#pod-template}

`.spec.template` — єдине обовʼязкове поле в розділі `.spec`.

`.spec.template` — це [шаблон Podʼа](/docs/concepts/workloads/pods/#pod-templates). Він має точно таку саму схему, як і {{< glossary_tooltip text="Pod" term_id="pod" >}}, за винятком того, що він вкладений і не має `apiVersion` або `kind`.

Окрім обовʼязкових полів для Podʼа, шаблон Podʼа в ReplicationController повинен вказувати відповідні мітки та відповідну політику перезапуску. Щодо міток, переконайтеся, що вони не перекриваються з іншими контролерами. Див. [селектор Podʼа](#pod-selector).

Дозволена лише [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) зі значенням `Always`, яке є стандартним, якщо нічого не вказано.

Для локальних перезапусків контейнерів ReplicationControllers делегують агентові на вузлі, наприклад, [Kubelet](/docs/reference/command-line-tools-reference/kubelet/).

### Мітки на ReplicationController {#labels-on-the-replicationcontroller}

ReplicationController може мати власні мітки (`.metadata.labels`). Зазвичай ви встановлюєте їх так само, як і `.spec.template.metadata.labels`; якщо `.metadata.labels` не вказано, то вони стандартно встановлюються як `.spec.template.metadata.labels`. Однак вони можуть бути різними, і `.metadata.labels` не впливають на поведінку ReplicationController.

### Селектор Podʼа {#pod-selector}

Поле `.spec.selector` є [селектором міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors). ReplicationController керує всіма Podʼами з мітками, які відповідають селектору. Він не робить різниці між Podʼами, які він створив чи видалив, і Podʼами, які створив чи видалив інший процес чи особа. Це дозволяє замінити ReplicationController без впливу на запущені Podʼи.

Якщо вказано, то `.spec.template.metadata.labels` повинні дорівнювати `.spec.selector`, інакше їх відхилить API. Якщо `.spec.selector` не вказано, він буде встановлений типово як `.spec.template.metadata.labels`.

Також, як правило, ви не повинні створювати жодних Podʼів, мітки яких відповідають цьому селектору, безпосередньо, з іншим ReplicationController або з іншим контролером, таким як Job. Якщо ви це зробите, то ReplicationController вважатиме, що він створив інші Podʼи. Kubernetes не забороняє вам це робити.

Якщо у вас все-таки виникає кілька контролерів із селекторами, що перетинаються, вам доведеться керувати видаленням самостійно (див. [нижче](#working-with-replicationcontrollers)).

### Кілька реплік {#multiple-replicas}

Ви можете вказати, скільки Podʼів повинно працювати одночасно, встановивши `.spec.replicas` рівним кількості Podʼів, які ви хочете мати одночасно. Кількість, що працює в будь-який момент, може бути більшою або меншою, наприклад, якщо репліки тільки що були збільшені або зменшені, чи якщо Pod коректно зупинено, а його заміна запускається раніше.

Якщо ви не вказали `.spec.replicas`, то типово встановлюється 1.

## Робота з ReplicationControllers {#working-with-replicationcontrollers}

### Видалення ReplicationController та його Podʼів {#deleting-a-replicationcontroller-and-its-pods}

Щоб видалити ReplicationController та всі його Podʼи, використовуйте команду [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). Kubectl масштабує ReplicationController до нуля і чекає, доки кожний Pod буде видалено, перед видаленням самого ReplicationController. Якщо цю команду kubectl перервати, її можна перезапустити.

Під час використання REST API або [бібліотеки клієнта](/docs/reference/using-api/client-libraries) вам потрібно виконати кроки явно (масштабування реплік до 0, очікування видалення Podʼів, а потім видалення самого ReplicationController).

### Видалення лише ReplicationController {#deleting-only-a-replicationcontroller}

Ви можете видалити ReplicationController, не впливаючи на його Podʼи.

Під час використання kubectl вкажіть опцію `--cascade=orphan` команді [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete).

Під час використання REST API або [бібліотеки клієнта](/docs/reference/using-api/client-libraries) ви можете видалити обʼєкт ReplicationController.

Після видалення оригіналу ви можете створити новий ReplicationController, щоб замінити його. Поки старий та новий `.spec.selector` однакові, новий перейме старі Podʼи. Однак він не буде вживати жодних зусиль, щоб наявні Podʼи відповідали новому, відмінному від оригінального, шаблону Podʼа. Щоб оновити Podʼи за новою специфікацією у керований спосіб, використовуйте [поетапне оновлення](#rolling-updates).

### Ізолювання Podʼів від ReplicationController {#isolating-pods-from-a-replicationcontroller}

Podʼи можуть бути вилучені із цільового набору ReplicationController зміною їхніх міток. Цей метод може бути використаний для виведення Podʼів з обслуговування для налагодження та відновлення даних. Podʼи, вилучені цим способом, будуть автоматично замінені (за умови, що кількість реплік також не змінюється).

## Поширені шаблони використання {#common-usage-patterns}

### Перепланування {#rescheduling}

Як було зазначено вище, чи у вас є 1 Pod, який вам потрібно тримати в роботі, чи 1000, ReplicationController гарантує, що зазначена кількість Podʼів існує, навіть у випадку відмови вузла або завершення Podʼа (наприклад, через дію іншого агента управління).

### Масштабування {#scaling}

ReplicationController дозволяє масштабувати кількість реплік вгору або вниз, як вручну, так і за допомогою агента автомасштабування, оновлюючи поле `replicas`.

### Поетапні оновлення {#rolling-updates}

ReplicationController призначений для полегшення поетапного оновлення сервісу за допомогою заміни Podʼів один за одним.

Як пояснено в [#1353](https://issue.k8s.io/1353), рекомендований підхід — створити новий ReplicationController з 1 реплікою, масштабувати нові (+1) та старі (-1) контролери по одному, а потім видалити старий контролер після досягнення 0 реплік. Це передбачувано оновлює набір Podʼів незалежно від неочікуваних відмов.

В ідеалі контролер поетапного оновлення мав би враховувати готовність застосунку і гарантувати, що достатня кількість Podʼів у будь-який момент продуктивно обслуговує запити.

Обом ReplicationControllers потрібно створювати Podʼи із принаймні однією відмінною міткою, такою як теґ образу основного контейнера Podʼа, оскільки саме оновлення образів зазвичай спонукають до поетапних оновлень.

### Кілька каналів випуску {#multiple-release-tracks}

Окрім запуску кількох випусків застосунку під час поетапного оновлення, часто запускають кілька випусків протягом тривалого часу або навіть постійно, використовуючи кілька каналів випуску. Канали розрізняються за допомогою міток.

Наприклад, сервіс може охоплювати всі Podʼи з `tier in (frontend), environment in (prod)`. Тепер скажімо, у вас є 10 реплікованих Podʼів, які складають цей рівень. Але ви хочете мати можливість випробувати нову версію цього компонента як канарку (canary). Ви можете налаштувати ReplicationController із `replicas`, встановленим на 9 для більшості реплік, з мітками `tier=frontend, environment=prod, track=stable`, та інший ReplicationController із `replicas`, встановленим на 1 для канарки, з мітками `tier=frontend, environment=prod, track=canary`. Тепер сервіс охоплює як канаркові, так і не канаркові Podʼи. Але ви можете окремо працювати з ReplicationControllers, щоб щось перевіряти, відстежувати результати тощо.

### Використання ReplicationControllers із Services {#using-replicationcontrollers-with-services}

Кілька ReplicationControllers можуть працювати за одним сервісом, так що, наприклад, частина трафіку іде до старої версії, а частина до нової.

ReplicationController ніколи не завершиться самостійно, але не очікується, що він житиме так довго, як сервіси. Сервіси можуть складатися з Podʼів, контрольованих кількома ReplicationControllers, і передбачається, що протягом життя сервісу (наприклад, для виконання оновлення Podʼів, які забезпечують роботу сервісу) буде створено і знищено багато ReplicationControllers. І самі сервіси, і їхні клієнти не повинні нічого знати про ReplicationControllers, які підтримують Podʼи цих сервісів.

## Написання програм для реплікації {#writing-programs-for-replication}

Podʼи, створені ReplicationController, призначені бути взаємозамінними та семантично ідентичними, хоча їхні конфігурації з часом можуть ставати неоднорідними. Це очевидно підходить для реплікованих stateless-серверів, але ReplicationControllers також можна використовувати для забезпечення доступності застосунків із вибором master, шардованих застосунків і застосунків із пулом робочих процесів. Такі застосунки повинні використовувати механізми динамічного призначення роботи, такі як [черги роботи RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-two-python.html), на відміну від статичного / одноразового налаштування конфігурації кожного Podʼа, що вважається антипатерном. Будь-яке налаштування Podʼа, таке як вертикальне автоматичне визначення розміру ресурсів (наприклад, CPU чи памʼяті), повинно виконуватися іншим онлайн-процесом контролера, подібним до самого ReplicationController.

## Обовʼязки ReplicationController {#responsibilities-of-the-replicationcontroller}

ReplicationController гарантує, що бажана кількість Podʼів відповідає його селектору міток і працює. Наразі з його підрахунку виключаються лише завершені Podʼи. У майбутньому можливо буде враховувати інформацію про [готовність](https://issue.k8s.io/620) та інші дані, доступні від системи, можливо буде додано більше елементів керування політикою заміни, і планується генерація подій, які можуть використовуватися зовнішніми клієнтами для впровадження як завгодно складних політик заміни та / або зменшення масштабу.

ReplicationController назавжди обмежений цією вузькою відповідальністю. Він сам не виконуватиме проби готовності чи життєздатності. Замість автоматичного масштабування він призначений для управління зовнішнім автомасштабувальником (як обговорюється в [#492](https://issue.k8s.io/492)), який буде змінювати його поле `replicas`. Ми не будемо додавати політик планування (наприклад, [розподілення](https://issue.k8s.io/367#issuecomment-48428019)) до ReplicationController. Він також не повинен перевіряти, чи відповідають контрольовані Podʼи поточному зазначеному шаблону, оскільки це заважало б автоматичному визначенню розміру та іншим автоматизованим процесам. Так само крайні терміни завершення, залежності порядку, розширення конфігурації та інші функції мають бути в інших місцях. Навіть планується виділити механізм масового створення Podʼів ([#170](https://issue.k8s.io/170)).

ReplicationController призначений бути компонованим базовим примітивом. Ми очікуємо, що на його основі та на основі інших доповнювальних примітивів у майбутньому буде побудовано високорівневі API та / або інструменти для зручності користувачів. "Макро" операції, які наразі підтримуються kubectl (run, scale), є прикладами перевірки цієї концепції. Наприклад, можемо уявити щось на зразок [Asgard](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1), що управляє ReplicationControllers, автомасштабувальниками, сервісами, політиками планування, канарковими розгортаннями та іншими аспектами.

## Обʼєкт API {#api-object}

ReplicationController є ресурсом верхнього рівня в REST API Kubernetes. Докладніша інформація про обʼєкт API є за посиланням: [Обʼєкт API ReplicationController](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replicationcontroller-v1-core).

## Альтернативи ReplicationController {#alternatives-to-replicationcontroller}

### ReplicaSet

[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/) — це ReplicationController нового покоління, який підтримує новий [селектор міток на основі множини](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement). Він використовується головним чином [Deployment](/docs/concepts/workloads/controllers/deployment/) як механізм для оркестрування створення, видалення та оновлення Podʼів. Зауважте, що ми рекомендуємо використовувати Deployments замість безпосереднього використання ReplicaSets, хіба що вам потрібне власне оркестрування оновлень або оновлення взагалі не потрібні.

### Deployment (Рекомендовано) {#deployment-recommended}

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) — це обʼєкт API вищого рівня, який оновлює свої базові ReplicaSets та їхні Podʼи. Deployments рекомендуються, якщо вам потрібна функціональність поетапного оновлення, оскільки вони є декларативними, виконуються на сервері та мають додаткові функції.

### Окремі Podʼи {#bare-pods}

На відміну від випадку, коли користувач створює Podʼи безпосередньо, ReplicationController замінює Podʼи, які видаляються або завершуються з будь-якої причини, такої як відмова вузла або обслуговування вузла з порушенням роботи, наприклад, оновлення ядра. З цієї причини ми рекомендуємо використовувати ReplicationController, навіть якщо ваш застосунок вимагає лише одного Podʼа. Вважайте це подібним наглядачу процесів, тільки він наглядає за кількома Podʼами на кількох вузлах, а не за окремими процесами на одному вузлі. ReplicationController делегує локальні перезапуски контейнерів деякому агенту на вузлі, наприклад kubelet.

### Job

Використовуйте [`Job`](/docs/concepts/workloads/controllers/job/) замість ReplicationController для Podʼів, які мають завершуватись самі по собі (іншими словами, пакетні завдання).

### DaemonSet

Використовуйте [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) замість ReplicationController для Podʼів, які забезпечують функцію рівня машини, таку як моніторинг машини або логування машини. Ці Podʼи мають термін служби, який повʼязаний із терміном служби машини: Pod повинен працювати на машині перед тим, як інші Podʼи почнуть працювати, і може бути безпечно завершений, коли машина готова до перезавантаження або вимкнення.

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [Podʼи](/docs/concepts/workloads/pods).
* Дізнайтеся більше про [Deployment](/docs/concepts/workloads/controllers/deployment/), альтернативу ReplicationController.
* `ReplicationController` — це частина REST API Kubernetes. Ознайомтесь з визначенням обʼєкта {{< api-reference page="core/replication-controller-v1" >}}, щоб зрозуміти API для контролерів реплікації.
