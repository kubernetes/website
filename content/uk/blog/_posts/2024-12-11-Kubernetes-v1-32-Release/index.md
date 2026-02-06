---
layout: blog
title: 'Kubernetes v1.32: Penelope'
date: 2024-12-11
slug: kubernetes-v1-32-release
author: >
  [Kubernetes v1.32 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.32/release-team.md)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

**Редактори:** Matteo Bianchi, Edith Puclla, William Rizzo, Ryota Sawada, Rashan Smith

Анонсуємо випуск Kubernetes v1.32: Penelope!

Як і у попередніх випусках, у Kubernetes v1.32 представлено нові стабільні, бета- та альфа-версії. Послідовний випуск високоякісних випусків підкреслює силу нашого циклу розробки та активну підтримку нашої спільноти. Цей випуск складається з 44 покращень. З них 13 перейшли до стабільного стану, 12 — до бета-версії, а 19 — до альфа-версії.

## Тема та логотип релізу {#release-theme-and-logo}

{{< figure src="k8s-1.32.png" alt="Логотип Kubernetes v1.32: Пенелопа з Одіссеї, штурвал і фіолетовий геометричний фон" class="release-logo" >}}

Темою випуску Kubernetes v1.32 є «Penelope».

Якщо Kubernetes з давньогрецької означає «лоцман», то в цьому випуску ми відштовхуємося від цього походження і розмірковуємо про останні 10 років Kubernetes і наші досягнення: кожен цикл випуску - це подорож, і як Пенелопа в «Одіссеї» ткала 10 років, щоночі видаляючи частину того, що вона зробила за день, так і кожен випуск додає нові можливості і видаляє інші, хоча в даному випадку з набагато чіткішою метою — постійно покращувати Kubernetes. Оскільки v1.32 є останнім випуском у році, коли Kubernetes відзначає своє перше десятиріччя, ми хотіли б відзначити всіх тих, хто був частиною глобальної команди Kubernetes, яка блукає хмарними морями, долаючи небезпеки та виклики: нехай ми продовжуємо творити майбутнє Kubernetes разом.

## Оновлення останніх ключових функцій {#updates-to-recent-key-features}

### Примітка про вдосконалення DRA {#a-note-on-dra-enhancements}

У цьому випуску, як і в попередньому, проєкт Kubernetes продовжує пропонувати ряд удосконалень динамічного розподілу ресурсів (DRA), ключового компонента системи керування ресурсами Kubernetes. Ці вдосконалення спрямовані на підвищення гнучкості та ефективності розподілу ресурсів для робочих навантажень, які потребують спеціалізованого обладнання, такого як графічні процесори, FPGA та мережеві адаптери. Ці функції особливо корисні для таких сценаріїв використання, як машинне навчання або високопродуктивні обчислювальні застосунки. Основна частина, що забезпечує підтримку структурованих параметрів DRA [перейшла у бета-версію](#structured-parameter-support).

### Покращення якості життя на вузлах та оновлення контейнерів sidecar {#quality-of-life-improvements-on-nodes-and-sidecar-containers-update}

[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) має наступні основні моменти, які виходять за рамки KEPs:

1. Функція сторожового таймера systemd тепер використовується для перезапуску kubelet, коли перевірка стану не вдається, одночасно обмежуючи максимальну кількість перезапусків протягом певного періоду часу. Це підвищує надійність роботи kubelet. Більш детальну інформацію можна знайти в pull request [#127566](https://github.com/kubernetes/kubernetes/pull/127566).

2. У випадках, коли виникає помилка витягування образу, повідомлення, що відображається у статусі podʼів, було покращено, щоб зробити його більш зручним для користувача і вказати деталі про те, чому pod перебуває у такому стані. Коли виникає помилка витягування образу, вона додається до поля `status.containerStatuses[*].state.waiting.message` у специфікації Pod зі значенням `ImagePullBackOff` у полі `reason`. Ця зміна надає вам більше контексту і допомагає визначити першопричину проблеми. Докладніші відомості наведено у pull request [#127918](https://github.com/kubernetes/kubernetes/pull/127918).

3. Функція контейнерів sidecar планується до випуску у статусі Stable у версії 1.33. Щоб переглянути решту робочих елементів та відгуки користувачів, дивіться коментарі у тікеті [#753](https://github.com/kubernetes/enhancements/issues/753#issuecomment-2350136594).

## Функції, що перейшли у стан Stable {#highlights-of-features-graduating-to-stable}

_Це добірка деяких поліпшень, які тепер стабільно працюють після випуску v1.32._

### Перемикачі полів Custom Resource {#custom-resource-field-selectors}

Селектор полів власних ресурсів дозволяє розробникам додавати селектори полів до власних ресурсів, відображаючи функціональність, доступну для вбудованих обʼєктів Kubernetes. Це дозволяє ефективніше і точніше фільтрувати власні ресурси, сприяючи кращому проєктуванню API.

Ця робота була виконана в рамках [KEP #4358](https://github.com/kubernetes/enhancements/issues/4358), силами [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).

### Підтримка зміни розміру томів у памʼяті {#support-to-size-memory-backed-volumes}

Ця функція дозволяє динамічно змінювати розмір томів, що зберігаються в памʼяті, на основі обмежень на ресурси Pod, покращуючи перенесення робочого навантаження та загальне використання ресурсів вузла.

Ця робота була виконана в рамках [KEP #1967](https://github.com/kubernetes/enhancements/issues/1967), силами [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### Покращення токену привʼязаного службового облікового запису {#bound-service-account-token-improvements}

Включення імені вузла до вимог токенів службових облікових записів дозволяє користувачам використовувати цю інформацію під час авторизації та допуску (ValidatingAdmissionPolicy). Крім того, це покращення унеможливлює використання облікових даних службових облікових записів для підвищення привілеїв для вузлів.

Ця робота була виконана в рамках [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

### Структурована конфігурація авторизації {#structured-authorization-configuration}

На сервері API можна налаштувати декілька авторизаторів, щоб забезпечити структуровані рішення щодо авторизації, з підтримкою умов відповідності CEL у веб-хуках.

Ця робота була виконана в рамках [KEP #3221](https://github.com/kubernetes/enhancements/issues/3221) силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

### Автоматичне видалення PVC, створених StatefulSet {#auto-remove-pvcs-created-by-statefulset}

PersistentVolumeClaims (PVC), створені StatefulSet, автоматично видаляються, коли вони більше не потрібні, забезпечуючи при цьому збереження даних під час оновлень StatefulSet і обслуговування вузлів. Ця функція спрощує керування сховищем для StatefulSets і зменшує ризик появи «осиротілих» PVC.

Ця робота була виконана в рамках [KEP #1847](https://github.com/kubernetes/enhancements/issues/1847) силами [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).

## Функції, що перейшли в стан Beta {#highlights-of-features-graduating-to-beta}

_Це добірка деяких покращень, які зараз є в бета версії після релізу v1.32._

### Механізм керованого Job API {#job-api-managed-by-mechanism}

Поле `managedBy` для Jobs було підвищено до рівня бета-версії у випуску v1.32. Ця можливість дозволяє зовнішнім контролерам (наприклад, [Kueue](https://kueue.sigs.k8s.io/)) керувати синхронізацією завдань, пропонуючи більшу гнучкість та інтеграцію з сучасними системами керування робочим навантаженням.

Ця робота була виконана в рамках [KEP #4368](https://github.com/kubernetes/enhancements/issues/4368), силами [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).

### Дозволити анонімний вхід лише для налаштованих точок доступу {#only-allow-anonymous-auth-for-configured-endpoints}

Ця функція дозволяє адміністраторам вказати, які точки доступу дозволено використовувати для анонімних запитів. Наприклад, адміністратор може дозволити анонімний доступ лише до таких точок контролю справності, як `/healthz`, `/livez` і `/readyz`, при цьому не допускаючи анонімного доступу до інших точок доступу або ресурсів кластера, навіть якщо користувач невірно налаштував RBAC.

Ця робота була виконана в рамках [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633), силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

### Функції зворотного виклику для кожного втулку для точного повторного запиту в розширеннях kube-scheduler {#per-plugin-callback-functions-for-accurate-requeueing-in-kube-scheduler-enhancements}

Ця функція підвищує продуктивність планування завдяки ефективнішим рішенням щодо повторних спроб планування за допомогою функцій зворотного виклику для кожного втулка (QueueingHint). Тепер усі втулки мають підказки QueueingHints.

Ця робота була виконана в рамках [KEP #4247](https://github.com/kubernetes/enhancements/issues/4247), силами [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

### Відновлення після збою збільшення тому {#recover-from-volume-expansion-failure}

Ця функція дозволяє користувачам відновитися після невдалої спроби розширення тома, повторивши спробу з меншим розміром. Ця функція гарантує, що розширення тома буде більш стійким і надійним, зменшуючи ризик втрати або пошкодження даних під час цього процесу.

Ця робота була виконана в рамках [KEP #1790](https://github.com/kubernetes/enhancements/issues/1790), силами [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

### Знімок групи томів {#volume-group-snapshot}

Ця функція представляє API VolumeGroupSnapshot, який дозволяє користувачам робити знімки кількох томів разом, забезпечуючи узгодженість даних у всіх томах.

Ця робота була виконана в рамках [KEP #3476](https://github.com/kubernetes/enhancements/issues/3476), силами [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

### Підтримка структурованих параметрів {#structured-parameter-support}

Основна частина Dynamic Resource Allocation (DRA, динамічний розподіл ресурсів), підтримка структурованих параметрів, перейшла в бета-версію. Це дозволяє kube-scheduler та кластерному автомасштабувальнику імітувати розподіл запитів безпосередньо, без використання сторонніх драйверів. Тепер ці компоненти можуть передбачати, чи можуть запити на ресурси бути виконані на основі поточного стану кластера, без фактичної фіксації розподілу. Усуваючи необхідність у сторонньому драйвері для перевірки або тестування розподілів, ця функція покращує планування і прийняття рішень щодо розподілу ресурсів, роблячи процеси планування і масштабування більш ефективними.

Ця робота була виконана в рамках [KEP #4381](https://github.com/kubernetes/enhancements/issues/4381), силами WG Device
Management (командою, що складється з [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node), [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) та [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)).

### Авторизація міток і селекторів полів {#label-and-field-selector-authorization}

Селектори міток і полів можна використовувати у рішеннях щодо авторизації. Авторизатор вузла автоматично використовує це, щоб обмежити вузли лише переглядом або переліком їхніх podʼів. Авторизатори вебхуків можна оновити, щоб обмежити запити на основі міток або селекторів полів, що використовуються.

Ця робота була виконана в рамках [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) силами [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).

## Фцнкції, що перейшли в стан Alpha {#highlights-of-new-features-in-alpha}

_Це добірка деяких покращень, які зараз є в альфа версії після релізу v1.32._

### Асинхронне витіснення у планувальнику Kubernetes {#asynchronous-preemption-in-the-kubernetes-scheduler}

Планувальник Kubernetes було вдосконалено за допомогою функції асинхронного витіснення, яка покращує пропускну здатність планувальника, обробляючи операції витіснення асинхронно. Витіснення гарантує, що більш пріоритетні podʼи отримують необхідні їм ресурси, витісняючи менш пріоритетні, але раніше цей процес включав важкі операції, такі як виклики API для видалення podʼів, що сповільнювало роботу планувальника. Завдяки цьому вдосконаленню такі завдання тепер обробляються паралельно, що дозволяє планувальнику без затримок продовжувати планувати інші podʼів. Це покращення особливо корисне для кластерів з високим рівнем відтоку Podʼів або частими збоями в плануванні, забезпечуючи більш ефективний та відмовостійкий процес планування.

Ця робота була виконана в рамках KEP [#4832](https://github.com/kubernetes/enhancements/issues/4832) силами [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

### Змінювані політики допуску за допомогою CEL-виразів {#mutating-admission-policies-using-cel-expressions}

Ця функція використовує обʼєктну конкретизацію CEL та стратегії JSON Patch у поєднанні з алгоритмами злиття Server Side Apply. Це спрощує визначення політик, зменшує конфлікти мутацій і підвищує продуктивність контролю доступу, закладаючи основу для більш надійних, розширюваних фреймворків політик в Kubernetes.

Сервер Kubernetes API тепер підтримує мутацію політик допуску на основі Common Expression Language (CEL), що забезпечує легку та ефективну альтернативу мутації веб-хуків допуску. Завдяки цьому вдосконаленню адміністратори можуть використовувати CEL для оголошення змін, таких як встановлення міток, стандартних значень полів або додавання sidecars, за допомогою простих декларативних виразів. Такий підхід зменшує операційну складність, усуває потребу у веб-хуках та інтегрується безпосередньо з kube-apiserver, пропонуючи швидшу та надійнішу обробку мутацій у процесі роботи.

Ця робота була виконана в рамках [KEP #3962](https://github.com/kubernetes/enhancements/issues/3962) силами [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).

### Специфікації ресурсів на рівні podʼів {#pod-level-resource-specifications}

Це вдосконалення спрощує управління ресурсами в Kubernetes, надаючи можливість встановлювати запити на ресурси та ліміти на рівні Pod, створюючи спільний пул, який можуть динамічно використовувати всі контейнери в Pod. Це особливо цінно для робочих навантажень з контейнерами, які мають нестабільні або різкі потреби в ресурсах, оскільки це мінімізує надлишкове резервування і покращує загальну ефективність використання ресурсів.

Використовуючи налаштування Linux cgroup на рівні Pod, Kubernetes гарантує дотримання цих обмежень на ресурси, дозволяючи тісно повʼязаним контейнерам ефективніше співпрацювати без штучних обмежень. Важливо, що ця функція підтримує зворотну сумісність з існуючими налаштуваннями ресурсів на рівні контейнерів, дозволяючи користувачам адаптувати їх поступово, не порушуючи поточні робочі процеси або існуючі конфігурації.

Це значне покращення для багатоконтейнерних подів, оскільки зменшує операційну складність управління розподілом ресурсів між контейнерами. Це також забезпечує приріст продуктивності для тісно інтегрованих застосунків, таких як архітектури sidecar, де контейнери розподіляють робочі навантаження або залежать від доступності один одного для оптимальної роботи.

Ця робота була виконана в рамках [KEP #2837](https://github.com/kubernetes/enhancements/issues/2837) силами [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### Дозвіл нульового значення для дії sleep хука PreStop {#allow-zero-value-for-sleep-action-of-prestop-hook}

Це вдосконалення надає можливість встановити нульову тривалість сплячого режиму для хука життєвого циклу PreStop у Kubernetes, пропонуючи гнучкіший варіант перевірки та налаштування ресурсів, який не потребує зупинки. Раніше спроба визначити нульове значення для дії переходу в режим сну призводила до помилок валідації, що обмежувало його використання. З цим оновленням користувачі можуть налаштувати нульову тривалість як допустимий параметр переходу в режим сну, що дозволяє негайне виконання і завершення дій, де це необхідно.

Це вдосконалення є сумісним з попередніми версіями, його впроваджено як додаткову функцію, керовану за допомогою функції `PodLifecycleSleepActionAllowZero`. Ця зміна особливо корисна для сценаріїв, що вимагають використання хуків PreStop для перевірки або обробки веб-хуків допуску, не вимагаючи фактичної тривалості сплячого режиму. Завдяки узгодженню з можливостями функції `time.After` Go, це оновлення спрощує конфігурацію і розширює зручність використання для робочих навантажень Kubernetes.

Ця робота була виконана в рамках [KEP #4818](https://github.com/kubernetes/enhancements/issues/4818) силами [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### DRA: Стандартизовані дані мережевого інтерфейсу для статусу заявки на ресурс {#dra-standardized-network-interface-data-for-resource-claim-status}

Це вдосконалення додає нове поле, яке дозволяє драйверам повідомляти конкретні дані про стан пристрою для кожного виділеного обʼєкта в ResourceClaim. Воно також встановлює стандартизований спосіб представлення інформації про мережеві пристрої.

Ця робота була виконана в рамках [KEP #4817](https://github.com/kubernetes/enhancements/issues/4817), силами [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).

### Нові точки доступу statusz та flagz для основних компонентів {#new-statusz-and-flagz-endpoints-for-core-components}

Ви можете ввімкнути дві нові HTTP точки доступу `/statusz` і `/flagz`, для основних компонентів. Це покращує налагоджуваність кластера за рахунок отримання інформації про те, з якою версією (наприклад, Golang) працює компонент, а також про час його роботи і з якими прапорцями командного рядка він був запущений; це полегшує діагностику як проблем виконання, так і проблем конфігурації.

Ця робота була виконана в рамках [KEP #4827](https://github.com/kubernetes/enhancements/issues/4827) та [KEP #4828](https://github.com/kubernetes/enhancements/issues/4828) силами [SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation).

### Windows дає відсіч! {#windows-strikes-back}

Додано підтримку належного завершення роботи Windows-вузлів у кластерах Kubernetes. До цього випуску Kubernetes надавав функціональність належноо завершення роботи для вузлів Linux, але не мав еквівалентної підтримки для Windows. Це покращення дозволяє kubelet на Windows-вузлах правильно обробляти події вимкнення системи. Це гарантує, що Podʼи, запущені на Windows-вузлах, будуть належно завершені, що дозволить перепланувати робочі навантаження без збоїв. Це покращення підвищує надійність і стабільність кластерів, що включають вузли Windows, особливо під час планового обслуговування або будь-яких оновлень системи.

Крім того, додано підтримку спорідненості процесорів і памʼяті для вузлів Windows з вузлами, з поліпшеннями в диспетчері процесорів, диспетчері памʼяті і диспетчері топології.

Ця робота була виконана в рамках [KEP #4802](https://github.com/kubernetes/enhancements/issues/4802) та [KEP #4885](https://github.com/kubernetes/enhancements/issues/4885) силами [SIG
Windows](https://github.com/kubernetes/community/tree/master/sig-windows).

## Випуск, списання та ліквідація у 1.32 {#graduations-deprecations-and-removals-in-1-32}

### Перехід у Stable {#graduations-to-stable}

Тут перераховані всі функції, які перейшли до стабільного стану (також відомого як _загальна доступність_). Повний список оновлень, включно з новими функціями та переходами з альфа-версії до бета-версії, наведено у примітках до випуску.

Цей випуск містить загалом 13 покращень, які було підвищено до рівня стабільності:

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

У міру розвитку та зрілості Kubernetes, функції можуть бути застарілими, вилученими або заміненими на кращі для покращення загального стану проєкту. Детальніше про цей процес див. у документі Kubernetes [політика застарівання та видалення](/docs/reference/using-api/deprecation-policy/).

#### Відмова від старої імплементації DRA {#withdrawal-of-the-old-dra-implementation}

Удосконалення [#3063](https://github.com/kubernetes/enhancements/issues/3063) запровадило динамічний розподіл ресурсів (DRA) у Kubernetes 1.26.

Однак, у Kubernetes v1.32 цей підхід до DRA буде суттєво змінено. Код, повʼязаний з оригінальною реалізацією, буде видалено, залишивши KEP [#4381](https://github.com/kubernetes/enhancements/issues/4381) як «нову» базову функціональність.

Рішення про зміну існуючого підходу було прийнято через його несумісність з кластерним автомасштабуванням, оскільки доступність ресурсів була непрозорою, що ускладнювало прийняття рішень як для кластерного автомасштабувальника, так і для контролерів. Нещодавно додана модель структурованих параметрів замінює цю функціональність.

Це видалення дозволить Kubernetes більш передбачувано обробляти нові вимоги до апаратного забезпечення та запити на ресурси, оминаючи складнощі зворотних викликів API до kube-apiserver.

Щоб дізнатися більше, дивіться тікет [#3063](https://github.com/kubernetes/enhancements/issues/3063).

#### Вилічення API {#api-removals}

У [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32) вилучено один API:

* Видалено версію `flowcontrol.apiserver.k8s.io/v1beta3` API FlowSchema та PriorityLevelConfiguration. Щоб підготуватися до цього, ви можете відредагувати наявні маніфести та переписати клієнтське програмне забезпечення для використання версії `flowcontrol.apiserver.k8s.io/v1 API`, доступної починаючи з v1.29. Всі існуючі збережені обʼєкти доступні через новий API. Серед помітних змін у flowcontrol.apiserver.k8s.io/v1beta3 - поле PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` стає типово рівним 30, якщо його не вказано, а явне значення 0 не змінюється на 30.

Для отримання додаткової інформації зверніться до [Посібника із застарівання API](/docs/reference/using-api/deprecation-guide/#v1-32).

### Примітки до випуску та необхідні дії для оновлення {#release-notes-and-upgrade-actions-required}

Ознайомтеся з повною інформацією про випуск Kubernetes v1.32 у наших [примітках до випуску](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md).

## Доступність {#availability}

Kubernetes v1.32 доступний для завантаження на [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.32.0) або на [сторінці завантаження Kubernetes](/releases/download/).

Щоб розпочати роботу з Kubernetes, перегляньте ці [інтерактивні підручники](/docs/tutorials/) або запустіть локальні кластери Kubernetes за допомогою [minikube](https://minikube.sigs.k8s.io/). Ви також можете легко встановити v1.32 за допомогою [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

## Команда випуску {#release-team}

Kubernetes можливий лише завдяки підтримці, відданості та наполегливій праці його спільноти. Кожна команда розробників складається з відданих волонтерів спільноти, які працюють разом над створенням багатьох частин, що складають випуски Kubernetes, на які ви покладаєтесь.
Це вимагає спеціалізованих навичок людей з усіх куточків нашої спільноти, від самого коду до його документації та управління проектом.

Ми хотіли б подякувати всій [команді розробників](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.32/release-team.md) за години, проведені за напруженою роботою над випуском Kubernetes v1.32 для нашої спільноти. Членство в команді варіюється від новачків до досвідчених лідерів команд, які повернулися з досвідом, отриманим протягом декількох циклів випуску. Особлива подяка нашому керівнику релізу, Фредеріко Муньосу, за те, що він керує командою розробників так витончено і вирішує будь-які питання з максимальною ретельністю, гарантуючи, що цей реліз буде виконано гладко і ефективно. І останнє, але не менш важливе: велика подяка всім учасникам релізу, як ведучим, так і помічникам, а також наступним SIG за приголомшливу роботу і результати, досягнуті за ці 14 тижнів роботи над релізом:

- [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) — за фундаментальну підтримку в документації та рецензування блогів, а також за постійну співпрацю з командами випуску та документації;
- [SIG k8s Infra](https://github.com/kubernetes/community/tree/master/sig-k8s-infra) та [SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing) — за видатну роботу з підтримки фреймворку тестування, а також усіх необхідних інфра-компонентів;
- [SIG Release](https://github.com/kubernetes/community/tree/master/sig-release) та усім менеджерам релізу — за неймовірну підтримку, надану протягом усього процесу створення релізу, вирішення навіть найскладніших питань у витончений та своєчасний спосіб.

## Швидкість реалізації проекту{#project-velocity}

CNCF K8s [проєкт DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) обʼєднує низку цікавих даних, повʼязаних зі швидкістю розвитку Kubernetes та різних підпроєктів. Це включає в себе все, від індивідуальних внесків до кількості компаній, які беруть участь, і є ілюстрацією глибини і широти зусиль, які докладаються для розвитку цієї екосистеми.

У циклі випуску v1.32, який тривав 14 тижнів (з 9 вересня по 11 грудня), ми бачили внески в Kubernetes від 125 різних компаній і 559 приватних осіб на момент написання цієї статті.

У всій екосистемі Cloud Native ця цифра зросла до 433 компаній, що налічує 2441 учасника. Це на 7% більше загального внеску порівняно з циклом [попереднього випуску](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/#project-velocity), а кількість залучених компаній зросла на 14%, що свідчить про значний інтерес до проектів Cloud Native та наявність спільноти.

Джерело цих даних:

- [Компанії, що роблять внесок у Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1725832800000&to=1733961599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Загальний внесок в екосистему](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1725832800000&to=1733961599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

Під внеском ми маємо на увазі, коли хтось робить комміти, рецензує код, коментує, створює випуск або PR, переглядає PR (включаючи блоги і документацію) або коментує випуски і PR.

Якщо ви зацікавлені у внеску, відвідайте [Початок роботи](https://www.kubernetes.dev/docs/guide/#getting-started) на нашому сайті для учасників.

[Перевірити DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All), щоб дізнатися більше про загальну швидкість роботи проєкту та спільноти Kubernetes.

## Оновлені події {#event-updates}

Ознайомтеся з майбутніми подіями з Kubernetes та хмарних технологій з березня по червень 2025 року, зокрема з KubeCon та KCD Залишайтеся в курсі подій та долучайтеся до спільноти Kubernetes.

**Березень 2025**
- [**KCD - Kubernetes Community Days: Beijing, China**](https://www.cncf.io/kcds/): У березні | Пекін, Китай
- [**KCD - Kubernetes Community Days: Guadalajara, Mexico**](https://www.cncf.io/kcds/): 16 березня 2025 року | Гвадалахара, Мексика
- [**KCD - Kubernetes Community Days: Rio de Janeiro, Brazil**](https://www.cncf.io/kcds/): 22 березня 2025 року | Ріо-де-Жанейро, Бразилія

**Квітень 2025**
- [**KubeCon + CloudNativeCon Europe 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe): 1-4 квітня 2025 року | Лондон, Велика Британія
- [**KCD - Kubernetes Community Days: Budapest, Hungary**](https://www.cncf.io/kcds/): 23 квітня 2025 | Будапешт, Угорщина
- [**KCD - Kubernetes Community Days: Chennai, India**](https://www.cncf.io/kcds/): 26 квітня 2025 | Ченнаї, Індія
- [**KCD - Kubernetes Community Days: Auckland, New Zealand**](https://www.cncf.io/kcds/): 28 квітня 2025 | Окленд, Нова Зеландія

**Травень 2025**
- [**KCD - Kubernetes Community Days: Helsinki, Finland**](https://www.cncf.io/kcds/): 6 травня 2025 року | Гельсінкі, Фінляндія
- [**KCD - Kubernetes Community Days: San Francisco, USA**](https://www.cncf.io/kcds/): 8 травня 2025 року | Сан-Франциско, США
- [**KCD - Kubernetes Community Days: Austin, USA**](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-austin-2025/): 15 травня 2025 | Остін, США
- [**KCD - Kubernetes Community Days: Seoul, South Korea**](https://www.cncf.io/kcds/): 22 травня 2025 | Сеул, Південна Корея
- [**KCD - Kubernetes Community Days: Istanbul, Turkey**](https://www.cncf.io/kcds/): 23 травня 2025 | Стамбул, Туреччина
- [**KCD - Kubernetes Community Days: Heredia, Costa Rica**](https://www.cncf.io/kcds/): 31 травня 2025 | Ередія, Коста-Ріка
- [**KCD - Kubernetes Community Days: New York, USA**](https://www.cncf.io/kcds/): У травні | Нью-Йорк, США

**Червень 2025**

- [**KCD - Kubernetes Community Days: Bratislava, Slovakia**](https://www.cncf.io/kcds/): June 5, 2025 | Bratislava, Slovakia
- [**KCD - Kubernetes Community Days: Bangalore, India**](https://www.cncf.io/kcds/): June 6, 2025 | Bangalore, India
- [**KubeCon + CloudNativeCon China 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/): 10-11 червня 2025 року | Гонконг
- [**KCD - Kubernetes Community Days: Antigua Guatemala, Guatemala**](https://www.cncf.io/kcds/): 14 червня 2025 | Антигуа Гватемала, Гватемала
- [**KubeCon + CloudNativeCon Japan 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan): 16-17 червня 2025 | Токіо, Японія
- [**KCD - Kubernetes Community Days: Nigeria, Africa**](https://www.cncf.io/kcds/): 19 червня 2025 | Нігерія, Африка

## Найближчий вебінар про випуск {#upcoming-release-webinar}

Приєднуйтесь до команди розробників Kubernetes v1.32 у **четвер, 9 січня 2025 року о 17:00 (UTC)**, щоб дізнатися про основні моменти цього випуску, а також про застарілі та вилучені компоненти, які допоможуть спланувати оновлення. Для отримання додаткової інформації та реєстрації відвідайте [сторінку події](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-132-release/) на сайті Онлайн-програм CNCF.

## Долучайтеся {#get-involved}

Найпростіший спосіб долучитися до Kubernetes - приєднатися до однієї з багатьох [Special Interest Groups](https://www.kubernetes.dev/community/community-groups/#special-interest-groups) (SIG), які відповідають вашим інтересам. Маєте щось, про що хотіли б розповісти спільноті Kubernetes? Поділіться своєю думкою на нашій щотижневій [зустрічі спільноти](https://github.com/kubernetes/community/tree/master/communication), а також за допомогою каналів нижче. Дякуємо за ваші постійні відгуки та підтримку.

- Слідкуйте за нами у Bluesky [@Kubernetes.io](https://bsky.app/profile/did:plc:kyg4uikmq7lzpb76ugvxa6ul) для отримання останніх оновлень
- Приєднуйтесь до обговорення спільноти на [Discuss](https://discuss.kubernetes.io/)
- Приєднуйтесь до спільноти у [Slack](http://slack.k8s.io/)
- Ставте питання (або відповідайте) на [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Поділіться своєю [історією](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) про Kubernetes
- Дізнайтеся більше про те, що відбувається з Kubernetes у [блозі](https://kubernetes.io/blog/)
- Дізнайтеся більше про [команду розробників Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team)
