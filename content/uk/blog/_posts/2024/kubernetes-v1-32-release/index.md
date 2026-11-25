---
layout: blog
title: 'Kubernetes v1.32: Penelope'
date: 2024-12-11
slug: kubernetes-v1-32-release
release_announcement:
  minor_version: "1.32"
  themes:
    - "Penelope"
author: >
  [Команда випуску Kubernetes v1.32](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.32/release-team.md)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

**Редактори:** Matteo Bianchi, Edith Puclla, William Rizzo, Ryota Sawada, Rashan Smith

Анонсуємо випуск Kubernetes v1.32: Penelope!

Як і попередні випуски, Kubernetes v1.32 представляє нові стабільні, бета- та альфа-функції. Послідовне постачання високоякісних випусків підкреслює силу нашого циклу розробки та активну підтримку нашої спільноти. Загалом цей випуск містить 44 удосконалення. З них 13 перейшли до стабільної версії, 12 — до бета-версії, а 19 зʼявилися в альфа-версії.

## Тема та логотип випуску {#release-theme-and-logo}

{{< figure src="k8s-1.32.png" alt="Логотип Kubernetes v1.32: Пенелопа з «Одіссеї», штурвал і фіолетовий геометричний фон" class="release-logo" >}}

Темою випуску Kubernetes v1.32 є «Penelope».

Якщо Kubernetes з давньогрецької означає «лоцман», то в цьому випуску ми відштовхуємося від цього походження і розмірковуємо про останні 10 років Kubernetes і наші досягнення: кожен цикл випуску — це подорож, і так само як Пенелопа в «Одіссеї» ткала 10 років, щоночі розпускаючи частину того, що зробила за день, кожен випуск додає нові функції та вилучає інші, хоча в нашому випадку з набагато чіткішою метою — постійно покращувати Kubernetes. Оскільки v1.32 є останнім випуском у році, коли Kubernetes відзначає своє перше десятиріччя, ми хотіли вшанувати всіх тих, хто був частиною глобального екіпажу Kubernetes, що мандрує хмарними (cloud-native) морями, долаючи небезпеки та виклики: тож продовжуймо разом ткати майбутнє Kubernetes.

## Оновлення останніх ключових функцій {#updates-to-recent-key-features}

### Примітка щодо удосконалень DRA {#a-note-on-dra-enhancements}

У цьому випуску, як і в попередньому, проєкт Kubernetes продовжує пропонувати низку удосконалень динамічного виділення ресурсів (Dynamic Resource Allocation, DRA), ключового компонента системи керування ресурсами Kubernetes. Ці удосконалення спрямовані на підвищення гнучкості та ефективності виділення ресурсів для робочих навантажень, які потребують спеціалізованого обладнання, такого як графічні процесори (GPU), FPGA та мережеві адаптери. Ці функції особливо корисні для таких сценаріїв використання, як машинне навчання або застосунки високопродуктивних обчислень. Основна частина, що забезпечує підтримку структурованих параметрів DRA, [перейшла до бета-версії](#structured-parameter-support).

### Покращення якості життя на вузлах та оновлення sidecar-контейнерів {#quality-of-life-improvements-on-nodes-and-sidecar-containers-update}

[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) має такі основні новини, що виходять за межі KEP:

1. Можливість сторожового таймера (watchdog) systemd тепер використовується для перезапуску kubelet, коли його перевірка стану не вдається, одночасно обмежуючи максимальну кількість перезапусків протягом певного періоду часу. Це підвищує надійність роботи kubelet. Докладніше дивіться pull request [#127566](https://github.com/kubernetes/kubernetes/pull/127566).

2. У випадках, коли виникає помилка відстрочки витягування образу (image pull back-off), повідомлення, що відображається у статусі Podʼа, покращено, щоб зробити його зрозумілішим для людини і вказати подробиці про те, чому Pod перебуває у такому стані. Коли виникає відстрочка витягування образу, помилка додається до поля `status.containerStatuses[*].state.waiting.message` у специфікації Podʼа зі значенням `ImagePullBackOff` у полі `reason`. Ця зміна надає вам більше контексту і допомагає визначити першопричину проблеми. Докладніше дивіться pull request [#127918](https://github.com/kubernetes/kubernetes/pull/127918).

3. Функція sidecar-контейнерів має перейти до стабільної версії у v1.33. Щоб переглянути решту робочих завдань та відгуки користувачів, дивіться коментарі в тікеті [#753](https://github.com/kubernetes/enhancements/issues/753#issuecomment-2350136594).

## Ключові функції, що переходять до стабільної версії {#highlights-of-features-graduating-to-stable}

_Це добірка деяких покращень, які стали стабільними після випуску v1.32._

### Селектори полів для Custom Resource {#custom-resource-field-selectors}

Селектор полів власних ресурсів дозволяє розробникам додавати селектори полів до власних ресурсів, аналогічно до функціональності, доступної для вбудованих обʼєктів Kubernetes. Це дозволяє ефективніше і точніше фільтрувати власні ресурси, сприяючи кращим практикам проєктування API.

Ця робота була виконана в рамках [KEP #4358](https://github.com/kubernetes/enhancements/issues/4358), силами [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).

### Підтримка визначення розміру томів у памʼяті {#support-to-size-memory-backed-volumes}

Ця функція дозволяє динамічно визначати розмір томів, що зберігаються в памʼяті, на основі обмежень ресурсів Podʼа, покращуючи переносність робочого навантаження та загальне використання ресурсів вузла.

Ця робота була виконана в рамках [KEP #1967](https://github.com/kubernetes/enhancements/issues/1967), силами [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### Покращення токена привʼязаного службового облікового запису {#bound-service-account-token-improvement}

Включення імені вузла до тверджень (claims) токенів службових облікових записів дозволяє користувачам використовувати цю інформацію під час авторизації та допуску (ValidatingAdmissionPolicy). Крім того, це покращення не дає обліковим даним службових облікових записів стати шляхом для підвищення привілеїв для вузлів.

Ця робота була виконана в рамках [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

### Структурована конфігурація авторизації {#structured-authorization-configuration}

В API-сервері можна налаштувати декілька авторизаторів, щоб забезпечити структуровані рішення щодо авторизації, з підтримкою умов відповідності CEL у вебхуках. Ця робота була виконана в рамках [KEP #3221](https://github.com/kubernetes/enhancements/issues/3221) силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

### Автоматичне видалення PVC, створених StatefulSet {#auto-remove-pvcs-created-by-statefulset}

PersistentVolumeClaims (PVC), створені StatefulSet, автоматично видаляються, коли вони більше не потрібні, забезпечуючи при цьому збереження даних під час оновлень StatefulSet і обслуговування вузлів. Ця функція спрощує керування сховищем для StatefulSet і зменшує ризик появи «осиротілих» PVC.

Ця робота була виконана в рамках [KEP #1847](https://github.com/kubernetes/enhancements/issues/1847) силами [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).

## Ключові функції, що переходять до бета-версії {#highlights-of-features-graduating-to-beta}

_Це добірка деяких покращень, які стали бета-версією після випуску v1.32._

### Механізм managed-by в Job API {#job-api-managed-by-mechanism}

Поле `managedBy` для Job перейшло до бета-версії у випуску v1.32. Ця функція дозволяє зовнішнім контролерам (наприклад, [Kueue](https://kueue.sigs.k8s.io/)) керувати синхронізацією Job, пропонуючи більшу гнучкість та інтеграцію з розвиненими системами керування робочими навантаженнями.

Ця робота була виконана в рамках [KEP #4368](https://github.com/kubernetes/enhancements/issues/4368), силами [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).

### Дозвіл анонімної автентифікації лише для налаштованих точок доступу {#only-allow-anonymous-auth-for-configured-endpoints}

Ця функція дозволяє адміністраторам вказати, які точки доступу дозволено використовувати для анонімних запитів. Наприклад, адміністратор може дозволити анонімний доступ лише до таких точок контролю справності, як `/healthz`, `/livez` і `/readyz`, при цьому не допускаючи анонімного доступу до інших точок доступу або ресурсів кластера, навіть якщо користувач неправильно налаштував RBAC.

Ця робота була виконана в рамках [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633), силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

### Функції зворотного виклику для кожного втулка для точного повторного додавання в чергу в удосконаленнях kube-scheduler {#per-plugin-callback-functions-for-accurate-requeueing-in-kube-scheduler-enhancements}

Ця функція підвищує пропускну здатність планування завдяки ефективнішим рішенням щодо повторних спроб планування за допомогою функцій зворотного виклику для кожного втулка (QueueingHint). Тепер усі втулки мають QueueingHints.

Ця робота була виконана в рамках [KEP #4247](https://github.com/kubernetes/enhancements/issues/4247), силами [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

### Відновлення після збою розширення тому {#recover-from-volume-expansion-failure}

Ця функція дозволяє користувачам відновитися після невдалої спроби розширення тому, повторивши спробу з меншим розміром. Це удосконалення гарантує, що розширення тому буде більш стійким і надійним, зменшуючи ризик втрати або пошкодження даних під час цього процесу.

Ця робота була виконана в рамках [KEP #1790](https://github.com/kubernetes/enhancements/issues/1790), силами [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

### Знімок групи томів {#volume-group-snapshot}

Ця функція представляє API VolumeGroupSnapshot, який дозволяє користувачам робити знімок кількох томів разом, забезпечуючи узгодженість даних у всіх томах.

Ця робота була виконана в рамках [KEP #3476](https://github.com/kubernetes/enhancements/issues/3476), силами [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

### Підтримка структурованих параметрів {#structured-parameter-support}

Основна частина динамічного виділення ресурсів (Dynamic Resource Allocation, DRA), підтримка структурованих параметрів, перейшла до бета-версії. Це дозволяє kube-scheduler та Cluster Autoscaler моделювати виділення заявок безпосередньо, без потреби у сторонньому драйвері. Тепер ці компоненти можуть передбачати, чи можуть запити на ресурси бути виконані на основі поточного стану кластера, без фактичної фіксації виділення. Усуваючи потребу в сторонньому драйвері для перевірки або тестування виділень, ця функція покращує планування і прийняття рішень щодо розподілу ресурсів, роблячи процеси планування і масштабування ефективнішими.

Ця робота була виконана в рамках [KEP #4381](https://github.com/kubernetes/enhancements/issues/4381), силами WG Device Management (міжфункціональної команди, що складається з [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node), [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) та [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)).

### Авторизація за селекторами міток і полів {#label-and-field-selector-authorization}

Селектори міток і полів можна використовувати у рішеннях щодо авторизації. Авторизатор вузлів автоматично використовує це, щоб дозволити вузлам отримувати перелік (list) або відстежувати (watch) лише їхні Podʼи. Авторизатори вебхуків можна оновити, щоб обмежувати запити на основі використаного селектора міток або полів.

Ця робота була виконана в рамках [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

## Ключові нові функції в альфа-версії {#highlights-of-new-features-in-alpha}

_Це добірка ключових покращень, представлених як альфа-функції у випуску v1.32._

### Асинхронне витіснення у планувальнику Kubernetes {#asynchronous-preemption-in-the-kubernetes-scheduler}

Планувальник Kubernetes було вдосконалено за допомогою функції асинхронного витіснення, яка покращує пропускну здатність планування, обробляючи операції витіснення асинхронно. Витіснення гарантує, що Podʼи з вищим пріоритетом отримують необхідні їм ресурси шляхом виселення Podʼів з нижчим пріоритетом, але раніше цей процес включав важкі операції, такі як виклики API для видалення Podʼів, що сповільнювало роботу планувальника. Завдяки цьому удосконаленню такі завдання тепер обробляються паралельно, що дозволяє планувальнику без затримок продовжувати планувати інші Podʼи. Це покращення особливо корисне для кластерів з високим рівнем плинності Podʼів або частими збоями планування, забезпечуючи ефективніший та стійкіший процес планування.

Ця робота була виконана в рамках KEP [#4832](https://github.com/kubernetes/enhancements/issues/4832) силами [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

### Мутаційні політики допуску з використанням виразів CEL {#mutating-admission-policies-using-cel-expressions}

Ця функція використовує створення обʼєктів у CEL та стратегії JSON Patch у поєднанні з алгоритмами злиття Server Side Apply. Це спрощує визначення політик, зменшує конфлікти мутацій і підвищує продуктивність контролю допуску, закладаючи основу для більш надійних, розширюваних фреймворків політик у Kubernetes.

API-сервер Kubernetes тепер підтримує мутаційні політики допуску (Mutating Admission Policies) на основі Common Expression Language (CEL), що забезпечує легку та ефективну альтернативу мутаційним вебхукам допуску. Завдяки цьому удосконаленню адміністратори можуть використовувати CEL для оголошення мутацій, таких як встановлення міток, встановлення типових значень полів або додавання sidecar-контейнерів, за допомогою простих декларативних виразів. Такий підхід зменшує операційну складність, усуває потребу у вебхуках та інтегрується безпосередньо з kube-apiserver, пропонуючи швидшу та надійнішу обробку мутацій в межах процесу.

Ця робота була виконана в рамках [KEP #3962](https://github.com/kubernetes/enhancements/issues/3962) силами [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).

### Специфікації ресурсів на рівні Podʼа {#pod-level-resource-specifications}

Це удосконалення спрощує керування ресурсами в Kubernetes, надаючи можливість встановлювати запити на ресурси та обмеження на рівні Podʼа, створюючи спільний пул, який можуть динамічно використовувати всі контейнери в Podʼі. Це особливо цінно для робочих навантажень з контейнерами, які мають мінливі або пікові потреби в ресурсах, оскільки це мінімізує надлишкове резервування і покращує загальну ефективність використання ресурсів.

Використовуючи налаштування Linux cgroup на рівні Podʼа, Kubernetes гарантує дотримання цих обмежень ресурсів, дозволяючи тісно повʼязаним контейнерам ефективніше співпрацювати без штучних обмежень. Важливо, що ця функція зберігає зворотну сумісність з наявними налаштуваннями ресурсів на рівні контейнерів, дозволяючи користувачам впроваджувати її поступово, не порушуючи поточні робочі процеси або наявні конфігурації.

Це значне покращення для багатоконтейнерних Podʼів, оскільки воно зменшує операційну складність керування виділенням ресурсів між контейнерами. Це також забезпечує приріст продуктивності для тісно інтегрованих застосунків, таких як архітектури sidecar, де контейнери спільно виконують робочі навантаження або залежать від доступності один одного для оптимальної роботи.

Ця робота була виконана в рамках [KEP #2837](https://github.com/kubernetes/enhancements/issues/2837) силами [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### Дозвіл нульового значення для дії sleep хука PreStop {#allow-zero-value-for-sleep-action-of-prestop-hook}

Це удосконалення надає можливість встановити нульову тривалість sleep для хука життєвого циклу PreStop у Kubernetes, пропонуючи гнучкіший варіант без операцій (no-op) для перевірки та налаштування ресурсів. Раніше спроба визначити нульове значення для дії sleep призводила до помилок валідації, що обмежувало її використання. З цим оновленням користувачі можуть налаштувати нульову тривалість як допустиме значення sleep, що дозволяє негайне виконання та завершення там, де це потрібно.

Це удосконалення є зворотно сумісним, його впроваджено як функцію, яку вмикають за бажанням (opt-in) і якою керує функціональна можливість `PodLifecycleSleepActionAllowZero`. Ця зміна особливо корисна для сценаріїв, що вимагають використання хуків PreStop для перевірки або обробки вебхуків допуску, не вимагаючи фактичної тривалості sleep. Завдяки узгодженню з можливостями функції Go `time.After` це оновлення спрощує конфігурацію і розширює можливості використання для робочих навантажень Kubernetes.

Ця робота була виконана в рамках [KEP #4818](https://github.com/kubernetes/enhancements/issues/4818) силами [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### DRA: Стандартизовані дані мережевого інтерфейсу для статусу заявки на ресурс {#dra-standardized-network-interface-data-for-resource-claim-status}

Це удосконалення додає нове поле, яке дозволяє драйверам повідомляти конкретні дані про стан пристрою для кожного виділеного обʼєкта в ResourceClaim. Воно також встановлює стандартизований спосіб представлення інформації про мережеві пристрої.

Ця робота була виконана в рамках [KEP #4817](https://github.com/kubernetes/enhancements/issues/4817), силами [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).

### Нові точки доступу statusz та flagz для основних компонентів {#new-statusz-and-flagz-endpoints-for-core-components}

Ви можете ввімкнути дві нові HTTP-точки доступу, `/statusz` і `/flagz`, для основних компонентів. Вони покращують можливості налагодження кластера, надаючи інформацію про те, з якою версією (наприклад, версією Golang) працює компонент, а також про час його роботи і з якими прапорцями командного рядка його було запущено; це полегшує діагностику як проблем виконання, так і проблем конфігурації.

Ця робота була виконана в рамках [KEP #4827](https://github.com/kubernetes/enhancements/issues/4827) та [KEP #4828](https://github.com/kubernetes/enhancements/issues/4828) силами [SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation).

### Windows дає відсіч! {#windows-strikes-back}

Додано підтримку належного завершення роботи Windows-вузлів у кластерах Kubernetes. До цього випуску Kubernetes надавав функціональність належного завершення роботи для вузлів Linux, але не мав еквівалентної підтримки для Windows. Це удосконалення дозволяє kubelet на Windows-вузлах правильно обробляти події вимкнення системи. Завдяки цьому Podʼи, запущені на Windows-вузлах, належно завершуються, що дозволяє перепланувати робочі навантаження без порушень. Це покращення підвищує надійність і стабільність кластерів, що включають вузли Windows, особливо під час планового обслуговування або будь-яких оновлень системи.

Крім того, додано підтримку спорідненості процесорів і памʼяті для вузлів Windows з вузлами, з поліпшеннями в диспетчері процесорів, диспетчері памʼяті і диспетчері топології.

Ця робота була виконана відповідно в рамках [KEP #4802](https://github.com/kubernetes/enhancements/issues/4802) та [KEP #4885](https://github.com/kubernetes/enhancements/issues/4885) силами [SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows).

## Переходи, застарівання та вилучення у 1.32 {#graduations-deprecations-and-removals-in-1-32}

### Переходи до стабільної версії {#graduations-to-stable}

Тут перелічено всі функції, які перейшли до стабільної версії (також відомої як _загальна доступність_). Повний список оновлень, включно з новими функціями та переходами з альфа-версії до бета-версії, наведено у примітках до випуску.

Цей випуск містить загалом 13 удосконалень, що перейшли до стабільної версії:

- [Structured Authorization Configuration](https://github.com/kubernetes/enhancements/issues/3221)
- [Bound service account token improvements](https://github.com/kubernetes/enhancements/issues/4193)
- [Custom Resource Field Selectors](https://github.com/kubernetes/enhancements/issues/4358)
- [Retry Generate Name](https://github.com/kubernetes/enhancements/issues/4420)
- [Make Kubernetes aware of the LoadBalancer behaviour](https://github.com/kubernetes/enhancements/issues/1860)
- [Field `status.hostIPs` added for Pod](https://github.com/kubernetes/enhancements/issues/2681)
- [Custom profile in kubectl debug](https://github.com/kubernetes/enhancements/issues/4292)
- [Memory Manager](https://github.com/kubernetes/enhancements/issues/1769)
- [Support to size memory backed volumes](https://github.com/kubernetes/enhancements/issues/1967)
- [Improved multi-numa alignment in Topology Manager](https://github.com/kubernetes/enhancements/issues/3545)
- [Add job creation timestamp to job annotations](https://github.com/kubernetes/enhancements/issues/4026)
- [Add Pod Index Label for StatefulSets and Indexed Jobs](https://github.com/kubernetes/enhancements/issues/4017)
- [Auto remove PVCs created by StatefulSet](https://github.com/kubernetes/enhancements/issues/1847)

### Застарівання та вилучення {#deprecations-and-removals}

У міру розвитку та зрілості Kubernetes функції можуть бути визнані застарілими, вилучені або замінені кращими для покращення загального стану проєкту. Докладніше про цей процес дивіться у [політиці застарівання та вилучення](/docs/reference/using-api/deprecation-policy/) Kubernetes.

#### Відмова від старої реалізації DRA {#withdrawal-of-the-old-dra-implementation}

Удосконалення [#3063](https://github.com/kubernetes/enhancements/issues/3063) запровадило динамічне виділення ресурсів (DRA) у Kubernetes 1.26.

Однак у Kubernetes v1.32 цей підхід до DRA буде суттєво змінено. Код, повʼязаний з оригінальною реалізацією, буде вилучено, залишивши KEP [#4381](https://github.com/kubernetes/enhancements/issues/4381) як «нову» базову функціональність.

Рішення про зміну наявного підходу виникло через його несумісність з автомасштабуванням кластера, оскільки доступність ресурсів була непрозорою, що ускладнювало прийняття рішень як для Cluster Autoscaler, так і для контролерів. Нещодавно додана модель структурованих параметрів замінює цю функціональність.

Це вилучення дозволить Kubernetes більш передбачувано обробляти нові вимоги до апаратного забезпечення та заявки на ресурси, оминаючи складнощі численних викликів API до kube-apiserver і назад.

Щоб дізнатися більше, дивіться тікет удосконалення [#3063](https://github.com/kubernetes/enhancements/issues/3063).

#### Вилучення API {#api-removals}

У [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32) вилучено один API:

* Вилучено версію API `flowcontrol.apiserver.k8s.io/v1beta3` для FlowSchema та PriorityLevelConfiguration. Щоб підготуватися до цього, ви можете відредагувати наявні маніфести та переписати клієнтське програмне забезпечення для використання версії `flowcontrol.apiserver.k8s.io/v1 API`, доступної починаючи з v1.29. Усі наявні збережені обʼєкти доступні через новий API. Серед помітних змін у flowcontrol.apiserver.k8s.io/v1beta3 — поле PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` типово отримує значення 30 лише тоді, коли його не вказано, а явне значення 0 не змінюється на 30.

Для отримання додаткової інформації зверніться до [посібника із застарівання API](/docs/reference/using-api/deprecation-guide/#v1-32).

### Примітки до випуску та необхідні дії для оновлення {#release-notes-and-upgrade-actions-required}

Ознайомтеся з повною інформацією про випуск Kubernetes v1.32 у наших [примітках до випуску](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md).

## Доступність {#availability}

Kubernetes v1.32 доступний для завантаження на [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.32.0) або на [сторінці завантаження Kubernetes](/releases/download/).

Щоб розпочати роботу з Kubernetes, перегляньте ці [інтерактивні підручники](/docs/tutorials/) або запустіть локальні кластери Kubernetes за допомогою [minikube](https://minikube.sigs.k8s.io/). Ви також можете легко встановити v1.32 за допомогою [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

## Команда випуску {#release-team}

Kubernetes можливий лише завдяки підтримці, відданості та наполегливій праці його спільноти. Кожна команда випуску складається з відданих волонтерів спільноти, які працюють разом над створенням багатьох частин, що складають випуски Kubernetes, на які ви покладаєтесь.
Це вимагає спеціалізованих навичок людей з усіх куточків нашої спільноти, від самого коду до його документації та управління проєктом.

Ми хотіли б подякувати всій [команді випуску](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.32/release-team.md) за години напруженої роботи над тим, щоб випуск Kubernetes v1.32 дійшов до нашої спільноти. Склад команди випуску варіюється від тих, хто вперше став помічником (shadow), до керівників команд, які повертаються з досвідом, здобутим протягом кількох циклів випуску. Особлива подяка нашому керівнику випуску, Frederico Muñoz, за те, що він так витончено керував командою випуску і вирішував будь-які питання з максимальною ретельністю, забезпечуючи гладке та ефективне проведення цього випуску. І останнє, але не менш важливе: велика подяка всім учасникам випуску — як керівникам, так і помічникам — а також наступним SIG за приголомшливу роботу і результати, досягнуті за ці 14 тижнів роботи над випуском:

- [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) — за фундаментальну підтримку в рецензуванні документації та блогів, а також за постійну співпрацю з командами комунікацій (Comms) і документації (Docs) випуску;
- [SIG k8s Infra](https://github.com/kubernetes/community/tree/master/sig-k8s-infra) та [SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing) — за видатну роботу з підтримки фреймворку тестування в належному стані, а також усіх необхідних компонентів інфраструктури;
- [SIG Release](https://github.com/kubernetes/community/tree/master/sig-release) та всім менеджерам випуску — за неймовірну підтримку, надану протягом усього процесу оркестрування випуску, та вирішення навіть найскладніших питань витончено і своєчасно.

## Швидкість реалізації проєкту {#project-velocity}

CNCF K8s [проєкт DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) обʼєднує низку цікавих даних, повʼязаних зі швидкістю розвитку Kubernetes та різних підпроєктів. Це включає в себе все, від індивідуальних внесків до кількості компаній, які беруть участь, і є ілюстрацією глибини і широти зусиль, які докладаються для розвитку цієї екосистеми.

У циклі випуску v1.32, який тривав 14 тижнів (з 9 вересня по 11 грудня), ми бачили внески в Kubernetes від 125 різних компаній і 559 окремих осіб на момент написання цієї статті.

У всій екосистемі Cloud Native ця цифра зростає до 433 компаній із загальною кількістю учасників 2441. Це на 7% більше загального внеску порівняно з циклом [попереднього випуску](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/#project-velocity), а кількість залучених компаній зросла на 14%, що свідчить про значний інтерес до проєктів Cloud Native і сильну спільноту, яка стоїть за ними.

Джерело цих даних:
- [Компанії, що роблять внесок у Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1725832800000&to=1733961599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Загальний внесок в екосистему](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1725832800000&to=1733961599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

Під внеском ми маємо на увазі, коли хтось робить коміт, рецензує код, коментує, створює тікет або PR, рецензує PR (включно з блогами і документацією) або коментує тікети і PR.

Якщо ви зацікавлені у внеску, відвідайте сторінку [Початок роботи](https://www.kubernetes.dev/docs/guide/#getting-started) на нашому сайті для учасників.

[Перегляньте DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All), щоб дізнатися більше про загальну швидкість роботи проєкту та спільноти Kubernetes.

## Новини про події {#event-updates}

Ознайомтеся з майбутніми подіями Kubernetes та cloud-native з березня по червень 2025 року, зокрема з KubeCon та KCD. Залишайтеся в курсі подій та долучайтеся до спільноти Kubernetes.

**Березень 2025**
- [**KCD - Kubernetes Community Days: Beijing, China**](https://www.cncf.io/kcds/): У березні | Пекін, Китай
- [**KCD - Kubernetes Community Days: Guadalajara, Mexico**](https://www.cncf.io/kcds/): 16 березня 2025 року | Гвадалахара, Мексика
- [**KCD - Kubernetes Community Days: Rio de Janeiro, Brazil**](https://www.cncf.io/kcds/): 22 березня 2025 року | Ріо-де-Жанейро, Бразилія

**Квітень 2025**
- [**KubeCon + CloudNativeCon Europe 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe): 1-4 квітня 2025 року | Лондон, Велика Британія
- [**KCD - Kubernetes Community Days: Budapest, Hungary**](https://www.cncf.io/kcds/): 23 квітня 2025 року | Будапешт, Угорщина
- [**KCD - Kubernetes Community Days: Chennai, India**](https://www.cncf.io/kcds/): 26 квітня 2025 року | Ченнаї, Індія
- [**KCD - Kubernetes Community Days: Auckland, New Zealand**](https://www.cncf.io/kcds/): 28 квітня 2025 року | Окленд, Нова Зеландія

**Травень 2025**
- [**KCD - Kubernetes Community Days: Helsinki, Finland**](https://www.cncf.io/kcds/): 6 травня 2025 року | Гельсінкі, Фінляндія
- [**KCD - Kubernetes Community Days: San Francisco, USA**](https://www.cncf.io/kcds/): 8 травня 2025 року | Сан-Франциско, США
- [**KCD - Kubernetes Community Days: Austin, USA**](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-austin-2025/): 15 травня 2025 року | Остін, США
- [**KCD - Kubernetes Community Days: Seoul, South Korea**](https://www.cncf.io/kcds/): 22 травня 2025 року | Сеул, Південна Корея
- [**KCD - Kubernetes Community Days: Istanbul, Turkey**](https://www.cncf.io/kcds/): 23 травня 2025 року | Стамбул, Туреччина
- [**KCD - Kubernetes Community Days: Heredia, Costa Rica**](https://www.cncf.io/kcds/): 31 травня 2025 року | Ередія, Коста-Ріка
- [**KCD - Kubernetes Community Days: New York, USA**](https://www.cncf.io/kcds/): У травні | Нью-Йорк, США

**Червень 2025**

- [**KCD - Kubernetes Community Days: Bratislava, Slovakia**](https://www.cncf.io/kcds/): 5 червня 2025 року | Братислава, Словаччина
- [**KCD - Kubernetes Community Days: Bangalore, India**](https://www.cncf.io/kcds/): 6 червня 2025 року | Бангалор, Індія
- [**KubeCon + CloudNativeCon China 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/): 10-11 червня 2025 року | Гонконг
- [**KCD - Kubernetes Community Days: Antigua Guatemala, Guatemala**](https://www.cncf.io/kcds/): 14 червня 2025 року | Антигуа-Гватемала, Гватемала
- [**KubeCon + CloudNativeCon Japan 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan): 16-17 червня 2025 року | Токіо, Японія
- [**KCD - Kubernetes Community Days: Nigeria, Africa**](https://www.cncf.io/kcds/): 19 червня 2025 року | Нігерія, Африка

## Найближчий вебінар про випуск {#upcoming-release-webinar}

Приєднуйтесь до учасників команди випуску Kubernetes v1.32 у **четвер, 9 січня 2025 року о 17:00 (UTC)**, щоб дізнатися про основні моменти цього випуску, а також про застарівання та вилучення, що допоможе спланувати оновлення. Для отримання додаткової інформації та реєстрації відвідайте [сторінку події](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-132-release/) на сайті CNCF Online Programs.

## Долучайтеся {#get-involved}

Найпростіший спосіб долучитися до Kubernetes — приєднатися до однієї з багатьох [груп за інтересами (Special Interest Groups)](https://www.kubernetes.dev/community/community-groups/#special-interest-groups) (SIG), які відповідають вашим інтересам. Маєте щось, про що хотіли б розповісти спільноті Kubernetes? Поділіться своєю думкою на нашій щотижневій [зустрічі спільноти](https://github.com/kubernetes/community/tree/master/communication), а також за допомогою каналів нижче. Дякуємо за ваші постійні відгуки та підтримку.

- Слідкуйте за нами у Bluesky [@Kubernetes.io](https://bsky.app/profile/did:plc:kyg4uikmq7lzpb76ugvxa6ul), щоб отримувати останні оновлення
- Приєднуйтесь до обговорення спільноти на [Discuss](https://discuss.kubernetes.io/)
- Приєднуйтесь до спільноти у [Slack](http://slack.k8s.io/)
- Ставте питання (або відповідайте на них) на [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Поділіться своєю [історією](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) про Kubernetes
- Дізнайтеся більше про те, що відбувається з Kubernetes, у [блозі](https://kubernetes.io/blog/)
- Дізнайтеся більше про [команду випуску Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team)
