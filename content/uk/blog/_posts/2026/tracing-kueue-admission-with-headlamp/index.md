---
layout: blog
title: "Чому мій Kubernetes Job досі в черзі? Відстеження допуску Kueue в Headlamp"
date: 2026-10-14T10:35:00-08:00
canonicalUrl: https://headlamp.dev/blog/2026/10/12/tracing-kueue-admission-with-headlamp
slug: tracing-kueue-admission-with-headlamp
author: >
  [Utkarsh Raj](https://github.com/utkarshrajpandey0001) (LFX Mentee, CNCF),
  [René Dudfield](https://github.com/illume) (Microsoft),
  [Kevin Hannon](https://github.com/kannon92) (Red Hat)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Ви подаєте [Kubernetes Job](/docs/concepts/workloads/controllers/job/) і чекаєте, поки зʼявляться його Podʼи. Хвилина минає. Потім ще одна. Job досі призупинено, журналів застосунку немає, а Podʼа для перевірки може й не бути.

У кластері, керованому [Kueue](https://kueue.sigs.k8s.io/), це цілком може бути нормою. Kueue досі може вирішувати, чи може Job використати запитані ресурси. Корисне питання полягає не лише в тому, «чому Pod у стані очікування?». Насамперед варто запитати: «Чи здійснив Kueue допуск (admission) цього Workload?».

[Втулок Kueue для Headlamp](https://github.com/headlamp-k8s/plugins/tree/main/kueue) переносить це розслідування в інтерфейс Headlamp. Замість того, щоб відтворювати шлях допуску за допомогою кількох команд і обʼємних YAML-обʼєктів, ви можете почати з Workload, прочитати повідомлення його стану готовності (condition) і перейти за посиланнями до LocalQueue, ClusterQueue, ResourceFlavor і Cohort.

Ця стаття присвячена саме цьому підходу: спершу Headlamp, а командний рядок зʼявляється лише в короткому необовʼязковому розділі для відтворення прикладу.

## Підготовка {#before-you-begin}

Вам потрібен кластер Kubernetes зі [встановленим Kueue](https://kueue.sigs.k8s.io/docs/installation/), [встановлений Headlamp](https://headlamp.dev/docs/latest/installation/) та [втулок Kueue `0.1.0-alpha`](https://github.com/headlamp-k8s/plugins/tree/main/kueue/0.1.0-alpha). Ваш обліковий запис Kubernetes повинен мати права на читання ресурсів Kueue, що використовуються в цій статті.

Альфа-версія надає режими перегляду лише для читання ресурсів Kueue `v1beta2`: Cohorts, ClusterQueues, LocalQueues, ResourceFlavorʼи та Workloads. Вона не додає власних робочих процесів створення, редагування, зупинки, відновлення чи видалення. Headlamp як і раніше надає стандартні дії з YAML і ресурсами, якщо ваші дозволи це допускають.

## Спершу відокремте допуск від планування Podʼів {#first-separate-admission-from-pod-scheduling}

Kueue та планувальник Kubernetes відповідають на різні питання.

- Допуск Kueue (admission): чи слід запускати цей Workload зараз, з урахуванням політики черги (queue), квоти, ResourceFlavorʼів, перевірок допуску (admission checks) та інших Workloadʼів в очікуванні?
- Планування Podʼів: після того як Kueue здійснює допуск Workload і Job поновлюється, на яких вузлах можна виконати його Podʼи?

Межа між цими двома змінює саме розслідування. Якщо Workload не допущено, залишайтеся в розділі Kueue в Headlamp. Якщо допущено, але Podʼи досі в стані `Pending`, переходьте до звичайних режимів перегляду Job і Pod у Headlamp і перевіряйте події планувальника.

{{< figure
  src="./kueue-admission-architecture.png"
  alt="Kubernetes Job стає Workload Kueue. Kueue оцінює його LocalQueue, ClusterQueue, ResourceFlavor і необовʼязковий Cohort, перш ніж поновити Job. Headlamp зчитує ці ресурси через Kubernetes API."
  caption="Архітектура допуску Kueue"
>}}

## Шлях усунення несправностей із Headlamp на першому місці {#the-headlamp-first-troubleshooting-path}

Найшвидше розслідування починається з Workload, а не з командного рядка.

{{< figure
  src="./headlamp-kueue-troubleshooting-flow.png"
  alt="Схема усунення несправностей у Headlamp, що починається з Workload Kueue, перевіряє умови допуску, переходить за посиланнями до LocalQueue і ClusterQueue, якщо допуск заблоковано, і перемикається до режимів перегляду Job і Pod після допуску."
  caption="Відстеження Job в очікуванні за допомогою Headlamp"
>}}

## Крок 1. Відкрийте режим перегляду Workloads {#step-1-open-the-workloads-view}

У Headlamp відкрийте **Kueue → Workloads**. Виберіть простір імен (namespace), що містить Job, а потім знайдіть Workload, створений для нього.

Kueue створює [Workload](https://kueue.sigs.k8s.io/docs/concepts/workload/), що представляє запит ресурсів і стан допуску Job. В альфа-версії втулка посилання на власника показані як текст у форматі `Kind/name`, але поки не є клікабельними. Назва Workload зазвичай містить назву Job, тож фільтр за простором імен і пошук у таблиці — найпростіший спосіб його знайти.

Ще до відкриття сторінки подробиць список уже дає корисний перший огляд:

- LocalQueue
- пріоритет і клас пріоритету
- активний стан
- стан допуску (admitted)
- стан завершення
- зрозумілий поточний стан, як-от `Admitted`, `Finished` або `Inadmissible`
- вік

Якщо відповідного Workload немає, перевірте три речі, перш ніж іти далі: вибраний простір імен, чи було Job подано до LocalQueue, і чи може ваш обліковий запис Kubernetes перелічувати Workloads. Втулок виконує перевірки дозволів і показує повідомлення про доступ, коли поточний обліковий запис не може прочитати ресурс.

## Крок 2. Прочитайте стан, стани готовності та події {#step-2-read-status-conditions-and-events}

Відкрийте Workload. Почніть з його поточного стану та [станів готовності (conditions)](https://kueue.sigs.k8s.io/docs/tasks/troubleshooting/troubleshooting_jobs/#is-my-job-admitted), а не з повного YAML.

Для усунення несправностей допуску найважливіші типи станів готовності — це `QuotaReserved` і `Admitted`.

- `Admitted=True` означає, що Kueue здійснив допуск Workload. Job може поновитися, тож усі Podʼи, що лишилися в стані `Pending`, належать гілці розслідування, повʼязаній із плануванням.
- `QuotaReserved=False` з причиною, як-от `Pending`, означає, що Kueue не зарезервував квоту. Повідомлення стану готовності пояснює, що завадило резервуванню.
- Стан `Inadmissible` означає, що Workload поки не вміщується в доступну конфігурацію черги. До цього можуть призвести відсутність ресурсу в наборі квот, непридатний ResourceFlavor, зупинена черга чи перевірка допуску (admission check).

Наприклад, повідомлення стану готовності може сповіщати, що Kueue не зміг призначити ResourceFlavor, оскільки ClusterQueue має недостатню квоту CPU. Таке повідомлення — перша справжня відповідь на запитання «Чому мій Job досі в черзі?». Решта подорожі Headlamp пояснює конфігурацію, що стоїть за цим.

Також перевірте розділ **Events**. Стани готовності описують поточний стан; події допомагають побачити, що змінилося нещодавно або що Kueue намагався зробити.

## Крок 3. Порівняйте запит Workload із його призначенням {#step-3-compare-the-workload-s-request-with-its-assignment}

Залишайтеся на сторінці подробиць Workload і перевірте PodSets та запити ресурсів. Втулок показує кількість Podʼів, CPU, памʼять та інші ресурси, які Kueue оцінює разом.

Це важливо, бо Job із `parallelism: 3` та запитом один CPU на Pod просить у Kueue загалом три процесори. Погляд лише на шаблон одного Podʼа недооцінить Workload.

Якщо квоту вже зарезервовано, та сама сторінка також показує призначений ClusterQueue, ResourceFlavorʼи та використання допущених ресурсів. Якщо цих призначень допуску немає, Workload ще не дійшов до цього етапу.

У нашому прикладі Workload запитує:

- три Podʼи
- загалом три процесори
- загалом 600 MiB памʼяті

Наступне питання — куди цей запит потрапив у Kueue.

## Крок 4. Перейдіть за посиланням на LocalQueue {#step-4-follow-the-linked-localqueue}

Скористайтеся посиланням [LocalQueue](https://kueue.sigs.k8s.io/docs/concepts/local_queue/) на сторінці подробиць Workload. LocalQueue — це точка входу на рівні простору імен, яку використовує Job. Вона зʼєднує Workloads у межах простору імен із ClusterQueue, що охоплює весь кластер.

Сторінка LocalQueue показує:

- її простір імен і підключений ClusterQueue
- політику зупинки (stop policy) та поточний стан
- кількість Workload в очікуванні, з резервуванням і допущених
- стани готовності Kueue та події Kubernetes
- повʼязані Workloads у тому самому просторі імен

Ця сторінка відповідає на два практичні питання: чи потрапив Job до черги, яку ви очікували, і чи є він єдиним Workload в очікуванні там.

Якщо LocalQueue неактивний або зупинений, це може вже пояснювати очікування. Якщо він активний, перейдіть за посиланням на ClusterQueue, щоб перевірити його пропускну здатність.

## Крок 5. Перевірте ємність і використання ClusterQueue {#step-5-inspect-clusterqueue-capacity-and-usage}

[ClusterQueue](https://kueue.sigs.k8s.io/docs/concepts/cluster_queue/) представляє квоту та політику допуску на рівні кластера, доступні для одного чи кількох LocalQueue.

На його сторінці подробиць у Headlamp порівняйте запит Workload із такими параметрами:

- ресурси в межах квоти (covered resources)
- номінальна квота для кожного ResourceFlavor
- поточні резервування та використання
- ліміти запозичення та надання квоти
- кількість Workload в очікуванні, з резервуванням і допущених
- стратегія постановки в чергу (queueing strategy) та політика зупинки
- налаштування примусового витіснення (preemption), чесного поділу (fair sharing), взаємозамінності flavor (flavor fungibility) та перевірок допуску
- стани готовності Kueue та події Kubernetes

Для прикладу в цій статті ClusterQueue надає номінальну квоту в два процесори та два слоти Pod. Workload просить по три з кожного. Повідомлення стану готовності та сторінка ClusterQueue тепер розповідають ту саму історію: Workload не вміщується, тож Kueue залишає Job призупиненим.

Це проблема ємності для допуску, а не доказ того, що kube-scheduler не зміг знайти вузол.

## Крок 6. За потреби перевірте ResourceFlavor і Cohort {#step-6-check-resourceflavor-and-cohort-when-needed}

Квота не завжди є єдиним пулом. [ResourceFlavor](https://kueue.sigs.k8s.io/docs/concepts/resource_flavor/) може представляти клас обчислень за допомогою міток вузлів, позначок (taints), допусків (tolerations) або налаштувань топології. Скористайтеся посиланням на ResourceFlavor із ClusterQueue, коли стан готовності згадує призначення flavor або коли Workload потребує певного класу обладнання, як-от вузли з GPU.

Якщо ClusterQueue належить [Cohort](https://kueue.sigs.k8s.io/docs/concepts/cohort/), перейдіть і за цим посиланням. Cohort дає змогу ClusterQueue ділитися невикористаною квотою. Сторінка в Headlamp показує батьківські та дочірні Cohort, ClusterQueue-учасники, задіяні ResourceFlavorʼи, групи ресурсів, ліміти запозичення та надання квоти, а також відомості про чесний поділ.

Ці сторінки допомагають відповісти на більш тонке питання: чи заблоковано Workload тому, що черга не має власної квоти, тому, що вона не може позичити достатньо, чи тому, що не можна призначити придатний flavor?

## Чого ми навчилися, не залишаючи Headlamp {#what-we-learned-without-leaving-headlamp}

Для прикладу Job в очікуванні інтерфейс дає нам повне пояснення:

1. Workload не допущено.
2. Його стан готовності `QuotaReserved` має значення false, а повідомлення вказує на недостатню квоту.
3. Workload запитує три процесори та три слоти Pod.
4. Його LocalQueue активний і вказує на очікуваний ClusterQueue.
5. ClusterQueue надає лише два процесори та два слоти Pod.
6. Тому Kueue тримає Job призупиненим, доки квота не стане доступною або конфігурацію черги не змінять.

Важлива не та обставина, що Headlamp вигадує новий стан. Він зчитує ті самі обʼєкти Kubernetes API, що й інші клієнти, а потім збирає повʼязані ресурси та зрозумілі значення в одному цілісному розслідуванні.

## Якщо Workload допущено — перемикайтеся на інші режими {#if-the-workload-is-admitted-switch-views}

Уявімо, що сторінка подробиць Workload показує `Admitted=True`, але застосунок досі не працює. Kueue завершив свою частину рішення. Продовжуйте в стандартних режимах перегляду Kubernetes у Headlamp:

1. Відкрийте **Workloads → Jobs** і перевірте стан та події Job.
2. Відкрийте **Workloads → Pods** і фільтруйте за назвою Job або простором імен.
3. Виберіть Pod у стані `Pending` і прочитайте його розділ **Events**.

На цьому етапі шукайте ознаки проблем планувальника, як-от недостатня ємність вузла, [привʼязка до вузлів (node affinity)](/docs/concepts/scheduling-eviction/assign-pod-node/), [розмітки та допуски (taints and tolerations)](/docs/concepts/scheduling-eviction/taint-and-toleration/), обмеження топології, привʼязування постійних томів чи помилки завантаження образів.

Це перемикання — найкорисніше правило усунення несправностей у статті:

- Не допущено: розслідуйте ресурси Kueue в Headlamp.
- `Admitted`, але Podʼи в стані `Pending`: розслідуйте відомості про Job, Podʼи, вузли та планувальник у Headlamp.

## Повторюваний чекліст Headlamp {#a-repeatable-headlamp-checklist}

Коли наступний Job не запускається, скористайтеся цим коротким шляхом:

1. Відкрийте **Kueue → Workloads** і виберіть правильний простір імен.
2. Знайдіть Workload, повʼязаний із Job.
3. Перевірте зрозумілий поточний стан, а також стани готовності `Admitted` і `QuotaReserved`.
4. Прочитайте повідомлення стану готовності та нещодавні події.
5. Порівняйте запити ресурсів PodSet із призначеннями допуску.
6. Перейдіть за посиланням LocalQueue та підтвердьте його стан і ClusterQueue.
7. Перейдіть за посиланням ClusterQueue і порівняйте квоту, резервування, використання та політику.
8. Перевірте подробиці ResourceFlavor або Cohort, коли повідомлення вказує на вибір flavor або спільну квоту.
9. Якщо допущено, перейдіть до режимів перегляду Job і Pod у Headlamp.

## Що Headlamp замінює під час цього розслідування {#what-headlamp-replaces-during-this-investigation}

Втулок не замінює `kubectl` чи [`kueuectl`](https://kueue.sigs.k8s.io/docs/reference/kubectl-kueue/) для скриптів, точного виведення обʼєктів чи змін. Він замінює монотонну навігацію без інтерфейсу, потрібну під час інтерактивного розслідування.

| Питання | Шлях у Headlamp | Еквівалент у командному рядку |
| --- | --- | --- |
| Чи допущено Workload? | **Kueue → Workloads → стан і стани готовності** | `kubectl describe workload <workload-name> -n <namespace>` |
| До якого LocalQueue він потрапив? | **Workload → повʼязаний LocalQueue** | `kubectl get localqueue <localqueue-name> -n <namespace> -o yaml` |
| Який ClusterQueue надає квоту? | **LocalQueue → повʼязаний ClusterQueue** | `kubectl get clusterqueue <clusterqueue-name> -o yaml` |
| Який flavor чи спільна квота мають значення? | **ClusterQueue → ResourceFlavor або Cohort** | `kubectl get resourceflavor <flavor-name> -o yaml` або `kubectl get cohort <cohort-name> -o yaml` |
| Що сталося після допуску? | **Workloads → Jobs і Pods → події** | `kubectl describe job <job-name> -n <namespace>` або `kubectl describe pod <pod-name> -n <namespace>` |

Для скриптів і робочих процесів GitOps командний рядок залишається правильним інструментом. Для людини, яка запитує «чому це очікує?», зазвичай швидше прочитати звʼязний шлях у Headlamp.

## Необовʼязково: відтворіть сценарій очікування {#optional-reproduce-the-pending-scenario}

Репозиторій втулка містить [приклади маніфестів Cohort, ClusterQueue, LocalQueue, ResourceFlavor і Job](https://github.com/headlamp-k8s/plugins/tree/main/kueue/test-files/deploy) для локального тестування. Застосуйте ці приклади до кластера зі встановленим Kueue, а потім відкрийте розділ Kueue в Headlamp.

Щоб відтворити конкретну невідповідність квоти, використану в цій статті, налаштуйте ClusterQueue з двома процесорами та двома слотами Pod, а потім подайте Job із трьома Podʼами, що запитує один CPU на Pod. Job потрапляє до свого LocalQueue, Kueue створює Workload, і Workload залишається в очікуванні, бо сукупний запит більший за доступну квоту.

Цей сценарій навмисно винесено за межі основного огляду: щойно ресурси створено, саме розслідування слід вести в Headlamp.

## Поточні обмеження альфа-версії {#current-alpha-limitations}

Випуск `0.1.0-alpha` — це початковий режим перегляду шляху допуску Kueue лише для читання.

- Втулок не додає власних процесів створення, редагування, призупинення, відновлення чи видалення.
- Посилання на власника Workload показуються як текст і поки не є навігабельними.
- Інтерфейс залежить від дозволів Kubernetes тієї обліковості, яку використовує Headlamp.
- Метрики та візуальна мапа взаємозвʼязків — можливі напрями подальшої роботи, а не функції цього випуску.

Ці обмеження корисно висловити чітко: поточна мета втулка — зробити стан допуску та взаємозвʼязки ресурсів простішими для перевірки.

## Розроблено в межах наставництва LFX {#developed-during-lfx-mentorship}

Втулок розроблено в межах [наставництва CNCF LFX](https://mentorship.lfx.linuxfoundation.org/) 2026 Term 2 з використанням TypeScript, React, Kubernetes API та системи втулків Headlamp.

Utkarsh Raj реалізував втулок за наставництва та рецензування René Dudfield ([@illume](https://github.com/illume)) і Kevin Hannon ([@kannon92](https://github.com/kannon92)). Відгуки спільнот Headlamp і Kueue сформували режими перегляду ресурсів, подання станів, навігацію, документацію, тести та перший альфа-випуск.

## Спробуйте та поділіться відгуками {#try-it-and-share-feedback}

Перегляньте [сирці втулка та README](https://github.com/headlamp-k8s/plugins/tree/main/kueue), прочитайте [документацію до випуску `0.1.0-alpha`](https://github.com/headlamp-k8s/plugins/tree/main/kueue/0.1.0-alpha) або поділіться відгуками в [тікеті випуску](https://github.com/headlamp-k8s/plugins/issues/1251).

Якщо Workload в очікуванні досі важко пояснити після проходження шляху в Headlamp, це якраз той вид зворотного звʼязку, що може покращити втулок.
