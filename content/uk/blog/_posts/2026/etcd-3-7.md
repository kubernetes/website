---
title: Представляємо etcd v3.7.0
slug: announcing-etcd-3.7
date: 2026-07-08T20:00:00+0800
canonicalUrl: https://etcd.io/blog/2026/announcing-etcd-3.7/
draft: false
author: "SIG Etcd Leads"
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

_Ця стаття є дзеркалом [оригінального анонсу](https://etcd.io/blog/2026/announcing-etcd-3.7/)_

Сьогодні SIG etcd оголошує про випуск [etcd v3.7.0](https://github.com/etcd-io/etcd/releases/tag/v3.7.0) — останнього мінорного релізу популярного розподіленого сховища для даних ключ-значення, що є основним компонентом Kubernetes. v3.7 включає довгоочікувану функцію RangeStream, кілька інших покращень продуктивності, видаляє останні залишки legacy v2store та завершує велику переробку protobuf.

Ви можете завантажити etcd v3.7.0 за посиланням:

- [Вихідний код](https://github.com/etcd-io/etcd/archive/refs/tags/v3.7.0.tar.gz)
- [Бінарні файли](https://github.com/etcd-io/etcd/releases/tag/v3.7.0)
- [Офіційні образи контейнерів](https://gcr.io/etcd-development/etcd)

Цей випуск також включає нові версії двох ключових залежностей etcd: [bbolt v1.5.0](https://github.com/etcd-io/bbolt/releases/tag/v1.5.0) та [raft v3.7.0](https://github.com/etcd-io/raft/releases/tag/v3.7.0).

Інструкції щодо встановлення etcd можна знайти в [документації з встановлення](https://etcd.io/docs/v3.7/install/). Повний список змін доступний у [описі змін etcd v3.7](https://github.com/etcd-io/etcd/blob/main/CHANGELOG/CHANGELOG-3.7.md).

Щира подяка всім учасникам, які зробили цей випуск можливим!

## Основні функції {#major-features}

Найважливіші зміни у v3.7.0 включають:

- [**RangeStream**](#rangestream) — потокова передача великих наборів результатів частинами замість буферизації всієї відповіді.
- **Запити діапазонів лише за ключами, швидші та надійніші leases**, а також кілька інших [**покращень продуктивності**](#performance-improvements).
- etcd тепер [завантажується повністю з v3store](#bootstrap-from-v3store), що усуває давню залежність від застарілого сховища v2
- Завершено [**переробку protobuf**](#protobuf-overhaul), в результаті чого застарілі бібліотеки protobuf замінено на ті, що повністю підтримуються.
- etcd v3.7 постачається з [bbolt v1.5.1](#bbolt-v151) та [raft v3.7.0](#raft-v370).

## Функції {#features}

### RangeStream

У etcd v3.6 та попередніх версіях важко працювати з запитами, які повертають великі результати. База даних буферизувала весь результат перед надсиланням, що призводило до непередбачуваної затримки та використання памʼяті як на сервері, так і на клієнті. [RPC RangeStream](https://github.com/kubernetes/enhancements/tree/master/keps/sig-etcd/5966-etcd-range-stream) дозволяє застосункам-отримувачам приймати результати частинами, зменшуючи затримку та роблячи використання памʼяті для буферизації більш передбачуваним.

Інструкції щодо використання RangeStream [у gRPC викликах](https://etcd.io/docs/v3.7/learning/api/#rangestream) та [у etcdctl](https://etcd.io/docs/v3.7/dev-guide/interacting_v3/#read-keys) можна знайти в документації etcd. Користувачам варто спробувати це для власних застосунків.

У скоординованих релізах функція RangeStream стане доступною для користувачів майбутнього Kubernetes v1.37, з увімкненням функціональної можливості `EtcdRangeStream`. Це раннє та заплановане впровадження можливе завдяки злиттю розробки etcd та Kubernetes у 2023 році.

### Покращення продуктивності {#performance-improvements}

v3.7 пропонує кілька конкретних покращень продуктивності як для панелі управління Kubernetes, так і для інших випадків використання. Користувачі Kubernetes повинні побачити значне зниження загального використання CPU членами etcd порівняно з v3.6.

#### Оптимізація запитів діапазону лише за ключами {#keys-only-range-optimization}

etcd v3.7.0 включає оптимізацію Range лише за ключами ([#21791: keys-only Range optimization](https://github.com/etcd-io/etcd/pull/21791)). Під час обробки запиту Range з параметром `keys_only` або команди `etcdctl get --keys-only` etcd зчитує дані виключно зі свого індексу в памʼяті. Він повертає ключі, що відповідають запиту, не завантажуючи всі серіалізовані значення з bbolt, як це робилося раніше. Єдиним винятком, коли завантаження з bbolt все ще потрібне, є випадки, коли запити Range з параметром `keys_only` необхідно сортувати за значенням (тобто коли для параметра SortTarget встановлено значення VALUE).

Це зменшує непотрібні зчитування з бекенду та використання памʼяті для робочих навантажень, яким потрібні лише імена ключів, роблячи великі запити лише за ключами більш ефективними.

#### Швидші, надійніші lease etcd {#faster-more-reliable-etcd-leases}

v3.7 покращує закінчення та поновлення lease:

- Запити LeaseRevoke тепер пріоритезуються для забезпечення своєчасного закінчення lease під час перевантаження ([#20492: stability enhancement during overload conditions](https://github.com/etcd-io/etcd/pull/20492)).
- Нова функція FastLeaseKeepAlive дозволяє швидше поновлювати lease, пропускаючи очікування на застосований індекс ([#20589: etcdserver: improve linearizable renew lease](https://github.com/etcd-io/etcd/pull/20589)).

#### Швидші операції find() {#faster-find-operations}

etcd 3.7 покращує продуктивність одночасних спостережень за ключами, роблячи операції find() швидшими ([#19768: adt: split interval tree by right endpoint on matched left endpoints](https://github.com/etcd-io/etcd/pull/19768)).

### Інші функції {#other-features}

#### Переробка protobuf {#protobuf-overhaul}

v3.7 виконує міграцію та замінює кілька застарілих protobuf бібліотек на повністю підтримувані залежності. Це включає заміну `github.com/golang/protobuf` та `github.com/gogo/protobuf` на повністю підтримувану `google.golang.org/protobuf` ([#14533: Protobuf: cleanup both golang/protobuf and gogo/protobuf](https://github.com/etcd-io/etcd/issues/14533)), та міграцію grpc-logging до grpc-middleware v2 ([#20420: Migrate grpc-logging to grpc-middleware v2](https://github.com/etcd-io/etcd/pull/20420)).

Окрім покращення безпеки та підтримки, ця переробка, як було показано, зменшує використання CPU компонентами etcd.

Хоча ці зміни, як очікується, не матимуть прямого впливу на користувачів, які запускають etcd за допомогою офіційних бінарних файлів або контейнерних образів, вони можуть торкнутися користувачів, які використовують модулі etcd на Go, такі як клієнтський SDK або пакунки в `api/` чи `pkg/`. Цим користувачам, можливо, доведеться оновити свій код або залежності через зміни в protobuf та пов’язані з ним API, введені в цьому випуску. Більш детальну інформацію можна знайти в [записі про відстеження змін API](https://github.com/etcd-io/website/issues/1162).

#### Підтримка Unix сокетів {#unix-socket-support}

etcd тепер підтримує точки доступу через Unix сокет
и ([#19760: Add Support for Unix Socket endpoints](https://github.com/etcd-io/etcd/pull/19760)), дозволяючи локальну комунікацію без TCP порту. Оскільки це обмежено кластерами з одним учасником, це переважно призначено для розробки, тестування та випадків використання на периферії.

#### Bootstrap з v3store {#bootstrap-from-v3store}

Однією з головних змін у etcd v3.7 є те, що сервер тепер завантажується повністю з v3 store ([#20187 Bootstrap etcdserver from v3store](https://github.com/etcd-io/etcd/issues/20187)), усуваючи залежність від legacy v2 store під час запуску.

Ця віха є результатом довгострокових зусиль, що охоплюють кілька релізів від v3.4 до v3.7. Вона вирішує давню технічну заборгованість, значно спрощує процес завантаження та закладає основу для майбутніх покращень etcd.

Для підтримки зворотної сумісності etcd v3.7 продовжує генерувати v2 снапшоти. Як результат, прапорець `--snapshot-count` також збережений у v3.7. Це остання залишкова залежність від legacy v2 store, і як генерація v2 снапшотів, так і прапор `--snapshot-count` будуть видалені у v3.8.

#### Тайм-аути etcdutl {#etcdutl-timeouts}

Всі команди etcdutl тепер мають аргумент командного рядка `--timeout` ([#20708: etcdutl: enable timeout functionality for all commands](https://github.com/etcd-io/etcd/pull/20708)), тому офлайн-команди утиліти більше не блокуються назавжди при утримуванні блоку.

#### Встановлення токена автентифікації безпосередньо {#setting-the-authentication-token-directly}

Клієнт v3 тепер дозволяє користувачам встановлювати JWT безпосередньо, пропонуючи більше гнучкості в варіантах автентифікації ([#16803: clientv3: allow setting JWT directly](https://github.com/etcd-io/etcd/pull/16803), [#20747: clientv3: disable auth retry when token is set](https://github.com/etcd-io/etcd/pull/20747)).

#### Отримання AuthStatus без автентифікації {#getting-authstatus-without-authentication}

Клієнти можуть перевіряти свій AuthStatus без попередньої спроби автентифікації, що дозволяє зменшити навантаження на застосунок ([#20802: etcdserver: скасувати перевірку дозволів у API AuthStatus](https://github.com/etcd-io/etcd/pull/20802)).

#### Нові метрики спостережень {#new-watch-metrics}

v3.7 додає необовʼязкові метрики send-loop спостережень ([#21030: Instrument watchstream send loop](https://github.com/etcd-io/etcd/pull/21030)) для кращої видимості шляху спостережень:

- `etcd_debugging_server_watch_send_loop_watch_stream_duration_seconds`
- `etcd_debugging_server_watch_send_loop_watch_stream_duration_per_event_seconds`
- `etcd_debugging_server_watch_send_loop_control_stream_duration_seconds`
- `etcd_debugging_server_watch_send_loop_progress_duration_seconds`

Також є нова метрика `etcd_server_request_duration_seconds` ([#21038: Add metric `etcd_server_request_duration_seconds`](https://github.com/etcd-io/etcd/pull/21038)).

#### Очищення команд etcdctl {#etcdctl-command-cleanup}

etcdctl команди були реорганізовані для ясності ([#20162: etcdctl: organize etcdctl subcommand](https://github.com/etcd-io/etcd/pull/20162)) та глобальні аргументи командного рядка тепер приховані для спрощення виводу довідки ([#20493: etcdctl: hide global flags](https://github.com/etcd-io/etcd/pull/20493)).

## Оновлення {#upgrading}

Цей випуск містить зміни, що можуть спричинити несумісність, зокрема пов’язані з вилученням застарілих компонентів версії v2. Користувачам слід ознайомитися з [посібником з оновлення](https://etcd.io/docs/v3.7/upgrades/upgrade_3_7/) перед оновленням своїх вузлів. Як і у випадку з усіма випусками з незначними змінами, слід виконувати послідовне оновлення, оновлюючи по одному вузлу за раз, та перевіряти стан кластера між етапами.

### Видалені експериментальні прапорці {#experimental-flags-removed}

Всі застарілі експериментальні прапорці були видалені ([#19959: Cleanup the deprecated experimental flags](https://github.com/etcd-io/etcd/pull/19959)). Функції в etcd тепер слідують життєвому циклу Kubernetes-style feature-gate (Alpha → Beta → GA), представленому у v3.6, замість старого префіксу `--experimental`. Якщо ваша конфігурація все ще залежить від аргументів командного рядка `--experimental-*`, виконайте міграцію для використання відповідних флагів функцій або стабільних аргументів командного рядка перед оновленням до etcd 3.7.

### Пакунки legacy V2 API та очищення коду {#legacy-v2-api-packages-and-code-cleanup}

Щоб усунути залежності від v2store, такі компоненти були видалені:

- [v2 discovery](https://github.com/etcd-io/etcd/pull/20109) пакунки видалені ([#20109: Remove v2discovery](https://github.com/etcd-io/etcd/pull/20109)),
- підтримка [v2 request](https://github.com/etcd-io/etcd/pull/21263) ([#21263: Remove v2 Request and apply_v2.go](https://github.com/etcd-io/etcd/pull/21263))
- підтримка [v2 client](https://github.com/etcd-io/etcd/pull/20117) ([#20117: Remove client/internal/v2](https://github.com/etcd-io/etcd/pull/20117)).

Ці зміни можуть створити певні проблеми для користувачів, особливо тих, хто ще не оновився до v3.6.11 або пізнішої версії. Користувачі повинні повідомляти про будь-які перешкоди, з якими зіткнулися, або про випадки, які потребують кращої документації з оновлення.

### Створення клієнта без блокування {#non-blocking-client-creation}

etcd більше не використовує застарілий параметр налаштування `grpc.WithBlock` ([\#21942: Make the etcd client creation non-blocking](https://github.com/etcd-io/etcd/pull/21942)). Для збереження попередньої блокуючої поведінки, коли це потрібно, слідуйте порадам у документації grpc-go про антипатерни ([https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md#especially-bad-using-deprecated-dialoptions](https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md#especially-bad-using-deprecated-dialoptions)).

### Тільки multiarch контейнерні образи {#multiarch-container-images-only}

Для користувачів, які залежать від офіційних контейнерних образів etcd, v3.7 буде розповсюджуватися **лише** як multiarch контейнери. Архітектно-позначені образи не будуть доступні, тому відкоригуйте розгортання відповідно.

### Зміни API {#api-changes}

Як і з кожним релізом etcd, є низка змін API. Вони розроблені для максимальної зворотної сумісності, але можуть вимагати коригувань від деяких користувачів. Повну інформацію див. на нашій сторінці [документації API](https://etcd.io/docs/v3.7/learning/api/).

## bbolt v1.5.1

etcd v3.7 залежить від, та включає, [v1.5.1](https://github.com/etcd-io/bbolt/blob/main/CHANGELOG/CHANGELOG-1.5.md) рушія сховища bbolt. v1.5 включає кілька покращень функціональності та продуктивності, зокрема:

- [Обмеження розміру файлів бази даних](https://github.com/etcd-io/bbolt/pull/929): користувачі можуть встановлювати обмеження розміру файлів, а bbolt забезпечуватиме їх дотримання. Коли база даних bolt перевищує ці обмеження, вона відмовлятиметься приймати записи доти, доки база даних не буде ущільнена або обмеження не буде змінено.
- [Вимкнення статистики для продуктивності](https://github.com/etcd-io/bbolt/pull/977): користувачі можуть встановити `NoStatistics`, щоб обмежити накладні витрати від блокувань, взятих засобом перегляду статистики бази даних.
- [Більш ефективна обробка хеш-таблиці](https://github.com/etcd-io/bbolt/pull/1179): швидше обʼєднання відрізків з меншими накладними витратами.

## raft v3.7.0

etcd 3.7 залежить від механізму консенсусу raft версії 3.7.0 і містить його. Версія 3.7 містить низку вдосконалень, зокрема:

- [Оновлення процесу завантаження](https://github.com/etcd-io/raft/pull/370): v3.7 тепер дозволяє завантажуватися з частково ініціалізованих снапшотів, підтримуючи ініціалізацію etcd безпосередньо з v3store.
- [Покращення ReadIndex потоку для запобігання застарілим читанням](https://github.com/etcd-io/raft/pull/397) шляхом інʼєкції унікального ідентифікатора в контекст heartbeat для операцій лише читання.

raft v3.7.0 також включає [ті ж оновлення protobuf бібліотеки](https://github.com/etcd-io/etcd/issues/14533) та рефакторингу, як і etcd.

## Оновлення залежностей {#dependency-updates}

Інші оновлення залежностей включають підвищення до `golang.org/x/crypto` v0.52.0 для вирішення CVE ([#21903: \[release-3.7\] Bump golang.org/x/crypto to v0.52.0](https://github.com/etcd-io/etcd/pull/21903)), оновлення OpenTelemetry contrib до v0.61.0 ([#20017: Update otelgrpc to v0.61.0](https://github.com/etcd-io/etcd/pull/20017)), та компіляцію з Go 1.26.4 ([#21891: \[release-3.7\] Update Go to 1.26.4](https://github.com/etcd-io/etcd/pull/21891)).

## Учасники {#contributors}

etcd v3.7.0 є результатом роботи понад сотні учасників у спільноті. Дякуємо всім, хто писав код, рецензував PR, створював та сортував тікети, та допомагав тестувати альфа-, бета- та кандидатів для випуску.

### Лідери {#leaders}

Лідерами SIG etcd для випуску v3.7 є [ivanvc](https://github.com/ivanvc), [serathius](https://github.com/serathius), [ahrtr](https://github.com/ahrtr), [fuweid](https://github.com/fuweid), [siyuanfoundation](https://github.com/siyuanfoundation), та [jberkus](https://github.com/jberkus). Іван очолює нашу команду випуску.

### Інші учасники {#other-contributors}

[ah8ad3](https://github.com/ah8ad3), [ajaysundark](https://github.com/ajaysundark), [aladesawe](https://github.com/aladesawe), [amosehiguese](https://github.com/amosehiguese), [ArkaSaha30](https://github.com/ArkaSaha30), [ashikjm](https://github.com/ashikjm), [AwesomePatrol](https://github.com/AwesomePatrol), [dims](https://github.com/dims), [Elbehery](https://github.com/Elbehery), [gangli113](https://github.com/gangli113), [henrybear327](https://github.com/henrybear327), [Jille](https://github.com/Jille), [jmhbnz](https://github.com/jmhbnz), [joshuazh-x](https://github.com/joshuazh-x), [kishen-v](https://github.com/kishen-v), [lavishpal](https://github.com/lavishpal), [liggitt](https://github.com/liggitt), [marcelfranca](https://github.com/marcelfranca), [miancheng7](https://github.com/miancheng7), [mmorel-35](https://github.com/mmorel-35), [MrDXY](https://github.com/MrDXY), [mrueg](https://github.com/mrueg), [purpleidea](https://github.com/purpleidea), [qsyqian](https://github.com/qsyqian), [redwrasse](https://github.com/redwrasse), [ronaldngounou](https://github.com/ronaldngounou), [skitt](https://github.com/skitt), [spzala](https://github.com/spzala), [tcchawla](https://github.com/tcchawla), [tjungblu](https://github.com/tjungblu), [vivekpatani](https://github.com/vivekpatani), [wenjiaswe](https://github.com/wenjiaswe)

### Нові учасники {#new-contributors}

Особлива подяка учасникам, які зробили свій перший внесок у etcd у цьому циклі — включаючи [Jeffrey Ying](https://github.com/jefftree), чия робота стала рушійною силою реалізації функції RangeStream. Нові учасники можуть мати значний вплив на etcd; якщо ви хочете долучитися, див. [посібник учасника](https://github.com/etcd-io/etcd/blob/main/CONTRIBUTING.md).

[1911860538](https://github.com/1911860538), [4rivappa](https://github.com/4rivappa), [aaronjzhang](https://github.com/aaronjzhang), [abdurrehman107](https://github.com/abdurrehman107), [ABin-Huang](https://github.com/ABin-Huang), [adeptvin1](https://github.com/adeptvin1), [aditya7880900936](https://github.com/aditya7880900936), [AHBICJ](https://github.com/AHBICJ), [akstron](https://github.com/akstron), [alliasgher](https://github.com/alliasgher), [aman4433](https://github.com/aman4433), [aojea](https://github.com/aojea), [apullo777](https://github.com/apullo777), [AR21SM](https://github.com/AR21SM), [arturmelanchyk](https://github.com/arturmelanchyk), [AshrafAhmed9](https://github.com/AshrafAhmed9), [asttool](https://github.com/asttool), [asutorufa](https://github.com/asutorufa), [BBQing](https://github.com/BBQing), [beforetech](https://github.com/beforetech), [boqishan](https://github.com/boqishan), [caltechustc](https://github.com/caltechustc), [carsontham](https://github.com/carsontham), [christophsj](https://github.com/christophsj), [chuanye-gao](https://github.com/chuanye-gao), [cnuss](https://github.com/cnuss), [cuiweixie](https://github.com/cuiweixie), [dmvolod](https://github.com/dmvolod), [Dogacel](https://github.com/Dogacel), [dongjiang1989](https://github.com/dongjiang1989), [EduardoVega](https://github.com/EduardoVega), [evertrain](https://github.com/evertrain), [eyupcanakman](https://github.com/eyupcanakman), [gaganhr94](https://github.com/gaganhr94), [goingforstudying-ctrl](https://github.com/goingforstudying-ctrl), [greenblade29](https://github.com/greenblade29), [Himanshu-370](https://github.com/Himanshu-370), [HossamSaberX](https://github.com/HossamSaberX), [huajianxiaowanzi](https://github.com/huajianxiaowanzi), [hwdef](https://github.com/hwdef), [ishan-gupta2005](https://github.com/ishan-gupta2005), [ishan16696](https://github.com/ishan16696), [ivangsm](https://github.com/ivangsm), [JasonLove-Coding](https://github.com/JasonLove-Coding), [Jefftree](https://github.com/Jefftree), [jihogh](https://github.com/jihogh), [jonathan-albrecht-ibm](https://github.com/jonathan-albrecht-ibm), [joshjms](https://github.com/joshjms), [kairosci](https://github.com/kairosci), [kei01234kei](https://github.com/kei01234kei), [kjgorman](https://github.com/kjgorman), [kovan](https://github.com/kovan), [kstrifonoff](https://github.com/kstrifonoff), [Kunalbehbud](https://github.com/Kunalbehbud), [letreturn](https://github.com/letreturn), [lorenz](https://github.com/lorenz), [m4l1c1ou5](https://github.com/m4l1c1ou5), [madhav-murali](https://github.com/madhav-murali), [madvimer](https://github.com/madvimer), [majiayu000](https://github.com/majiayu000), [marcus-hodgson-antithesis](https://github.com/marcus-hodgson-antithesis), [mattsains](https://github.com/mattsains), [mcrute](https://github.com/mcrute), [mingl1](https://github.com/mingl1), [MohanadKh03](https://github.com/MohanadKh03), [mstrYoda](https://github.com/mstrYoda), [NAM-MAN](https://github.com/NAM-MAN), [neeraj542](https://github.com/neeraj542), [nicknikolakakis](https://github.com/nicknikolakakis), [nihalmaddala](https://github.com/nihalmaddala), [niuyueyang1996](https://github.com/niuyueyang1996), [notandruu](https://github.com/notandruu), [ntdkhiem](https://github.com/ntdkhiem), [nwnt](https://github.com/nwnt), [olamilekan000](https://github.com/olamilekan000), [pigeio](https://github.com/pigeio), [pjsharath28](https://github.com/pjsharath28), [progmem](https://github.com/progmem), [Qian-Cheng-nju](https://github.com/Qian-Cheng-nju), [quocvibui](https://github.com/quocvibui), [ravisastryk](https://github.com/ravisastryk), [robin-vidal](https://github.com/robin-vidal), [robinkb](https://github.com/robinkb), [rockswe](https://github.com/rockswe), [roman-khimov](https://github.com/roman-khimov), [rsafonseca](https://github.com/rsafonseca), [sahilpatel09](https://github.com/sahilpatel09), [SalehBorhani](https://github.com/SalehBorhani), [SebTardif](https://github.com/SebTardif), [seshachalam-yv](https://github.com/seshachalam-yv), [shashwat010](https://github.com/shashwat010), [shivamgcodes](https://github.com/shivamgcodes), [shuan1026](https://github.com/shuan1026), [silentred](https://github.com/silentred), [sneaky-potato](https://github.com/sneaky-potato), [socketpair](https://github.com/socketpair), [srri](https://github.com/srri), [subrajeet-maharana](https://github.com/subrajeet-maharana), [sxllwx](https://github.com/sxllwx), [tchap](https://github.com/tchap), [tsujiri](https://github.com/tsujiri), [tzfun](https://github.com/tzfun), [upamanyus](https://github.com/upamanyus), [uzairhameed](https://github.com/uzairhameed), [varunu28](https://github.com/varunu28), [vihasmakwana](https://github.com/vihasmakwana), [wendy-ha18](https://github.com/wendy-ha18), [xiaoxiangirl](https://github.com/xiaoxiangirl), [xigang](https://github.com/xigang), [xUser5000](https://github.com/xUser5000), [yagikota](https://github.com/yagikota), [yajianggroup](https://github.com/yajianggroup), [yedou37](https://github.com/yedou37), [Zanda256](https://github.com/Zanda256), [zechariahkasina](https://github.com/zechariahkasina), [zhijun42](https://github.com/zhijun42), [zhoujiaweii](https://github.com/zhoujiaweii)

Надсилайте відгуки через:

- [GitHub issues](https://github.com/etcd-io/etcd/issues)
- [#sig-etcd slack channel](https://kubernetes.slack.com/archives/C3HD8ARJ5) у [Kubernetes Slack](https://www.kubernetes.dev/docs/comms/slack/#joining-slack)
- [etcd-dev mailing list](https://groups.google.com/g/etcd-dev)
