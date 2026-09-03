---
layout: blog
title: 'Оголошення про підтримку Changed Block Tracking API (альфа)'
date: 2025-09-25T05:00:00-08:00
slug: csi-changed-block-tracking
author: >
   [Prasad Ghangal](https://github.com/PrasadG193) (Veeam Kasten)
   [Carl Braganza](https://github.com/carlbraganza) (Veeam Kasten)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Ми раді оголосити про альфа-підтримку механізму _відстеження змінених блоків_. Це покращує екосистему зберігання даних Kubernetes, надаючи ефективний спосіб для драйверів зберігання даних [CSI](https://kubernetes.io/docs/concepts/storage/volumes/#csi) ідентифікувати змінені блоки в знімках (snapshot) PersistentVolume. За допомогою драйвера, який може використовувати цю функцію, ви зможете скористатися швидшими та більш ефективними з точки зору використання ресурсів операціями резервного копіювання.

Якщо ви хочете спробувати цю функцію, перейдіть до розділу [Початок роботи](#getting-started).

## Що таке відстеження змінених блоків? {#what-is-changed-block-tracking}

Відстеження змінених блоків дозволяє системам зберігання даних ідентифікувати та відстежувати зміни на рівні блоків між моментальними знімками, усуваючи необхідність сканування цілих томів під час операцій резервного копіювання. Це вдосконалення є зміною в інтерфейсі Container Storage Interface (CSI), а також у підтримці зберігання даних у самій системі Kubernetes. З увімкненою альфа-функцією ваш кластер може:

- Ідентифікувати виділені блоки в знімку тому CSI
- Визначати змінені блоки між двома знімками одного тому
- Оптимізувати операції резервного копіювання, зосередившись лише на змінених блоках даних

Для користувачів Kubernetes, які керують великими наборами даних, цей API забезпечує значно ефективніші процеси резервного копіювання. Тепер програми резервного копіювання можуть зосередитися лише на змінених блоках, а не обробляти цілі томи.

{{< note >}}
На даний момент Changed Block Tracking  API підтримується тільки для блокових томів, а не для файлових томів. Драйвери CSI, які керують файловими системами зберігання даних, не зможуть реалізувати цю функцію.
{{< /note >}}

## Переваги підтримки відстеження змінених блоків у Kubernetes {#benefits-of-changed-block-tracking-support-in-kubernetes}

У міру зростання популярності Kubernetes для управління критичними даними зі збереженням стану (stateful), потреба в ефективних рішеннях для резервного копіювання стає все більш важливою. Традиційні підходи до повного резервного копіювання стикаються з такими проблемами:

- _Довгі вікна резервного копіювання_: повне резервне копіювання великих обсягів даних може займати години, що ускладнює його виконання в межах вікон технічного обслуговування.
- _Високе використання ресурсів_: операції резервного копіювання споживають значну пропускну здатність мережі та ресурси вводу-виводу, особливо для великих обсягів даних і застосунків, що інтенсивно використовують дані.
- _Збільшення витрат на зберігання_: Повторні повні резервні копії зберігають надлишкові дані, що призводить до лінійного зростання вимог до зберігання, навіть якщо між резервними копіями фактично змінюється лише невеликий відсоток даних.

Changed Block Tracking API вирішує ці проблеми, надаючи вбудовану підтримку Kubernetes для інкрементних резервних копій через інтерфейс CSI.

## Ключові компоненти {#key-components}

Реалізація складається з трьох основних компонентів:

1. _CSI SnapshotMetadata Service API_: API, що пропонується gRPC, який надає знімки томів та дані про змінені блоки.
2. _SnapshotMetadataService API_: Kubernetes CustomResourceDefinition (CRD), який повідомляє про доступність служби метаданих драйвера CSI та деталі підключення до клієнтів кластера.
3. _External Snapshot Metadata Sidecar_: проміжний компонент, який підключає драйвери CSI до застосунків резервного копіювання через стандартизований інтерфейс gRPC.

## Вимоги до впровадження {#implementation-requirements}

### Обовʼязки постачальника послуг зберігання {#storage-provider-responsibilities}

Якщо ви є автором інтеграції сховища з Kubernetes і хочете підтримати функцію відстеження змінених блоків, ви повинні виконати певні вимоги:

1. _Впровадити CSI RPC_: Постачальники систем зберігання даних повинні впровадити сервіс `SnapshotMetadata`, як визначено в [специфікаціях CSI protobuf](https://github.com/container-storage-interface/spec/blob/master/csi.proto). Цей сервіс вимагає впровадження серверного потокового передавання для таких RPC:

   - `GetMetadataAllocated`: для ідентифікації виділених блоків у знімку
   - `GetMetadataDelta`: для визначення змінених блоків між двома знімками

2. _Можливості бекенду сховища_: переконайтеся, що бекенд сховища має можливість відстежувати та повідомляти про зміни на рівні блоків.

3. _Розгортання зовнішніх компонентів_: інтегруйте з sidecar `external-snapshot-metadata`, щоб відкрити доступ до сервісу метаданих знімків.

4. _Реєстрація власного ресурсу_: зареєструйте ресурс `SnapshotMetadataService` за допомогою CustomResourceDefinition і створіть власний ресурс `SnapshotMetadataService`, який повідомляє про доступність служби метаданих і надає деталі підключення.

5. _Підтримка обробки помилок_: реалізуйте належну обробку помилок для цих RPC відповідно до вимог специфікації CSI.

### Відповідальність за рішення щодо резервного копіювання {#backup-solution-responsibilities}

A backup solution looking to leverage this feature must:

1. _Налаштування автентифікації_: Програма резервного копіювання повинна надавати токен Kubernetes ServiceAccount під час використання [Kubernetes SnapshotMetadataService API](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3314-csi-changed-block-tracking#the-kubernetes-snapshotmetadata-service-api). Необхідно встановити відповідні права доступу, такі як RBAC RoleBindings, щоб авторизувати ServiceAccount програми резервного копіювання для отримання таких токенів.

2. _Впровадити код потокового передавання на стороні клієнта_: Розробити клієнти, які впроваджують API потокового передавання gRPC, визначені у файлі [schema.proto](https://github.com/kubernetes-csi/external-snapshot-metadata/blob/main/proto/schema.proto). Зокрема:

   - Впровадити код клієнта для потокового передавання для методів `GetMetadataAllocated` та `GetMetadataDelta`.
   - Ефективно обробляти відповіді сервера для потокового передавання, оскільки метадані надходять частинами.
   - Обробляти формат повідомлення `SnapshotMetadataResponse` з належним обробленням помилок.

   Репозиторій GitHub `external-snapshot-metadata` надає зручний пакет підтримки [ітератора](https://github.com/kubernetes-csi/external-snapshot-metadata/tree/master/pkg/iterator) для спрощення реалізації клієнта.

3. _Обробка великих потоків даних_: Розробка клієнтів для ефективної обробки великих потоків метаданих блоків, які можуть бути повернуті для томів із значними змінами.

4. _Оптимізація процесів резервного копіювання_: Модифікація робочих процесів резервного копіювання для використання змінених метаданих блоків з метою ідентифікації та передачі лише змінених блоків, щоб зробити резервне копіювання більш ефективним, скоротивши тривалість резервного копіювання та споживання ресурсів.

## Початок роботи {#getting-started}

Щоб використовувати відстеження змінених блоків у кластері:

1. Переконайтеся, що драйвер CSI підтримує знімки томів і реалізує можливості метаданих знімків за допомогою необхідного sidecar `external-snapshot-metadata`.
2. Переконайтеся, що власний ресурс SnapshotMetadataService зареєстрований за допомогою CRD.
3. Перевірте наявність власного ресурсу SnapshotMetadataService для драйвера CSI.
4. Створіть клієнтів, які можуть отримати доступ до API за допомогою відповідної автентифікації (через токени Kubernetes ServiceAccount).

API надає дві основні функції:

- `GetMetadataAllocated`: перелічує блоки, виділені в одному знімку.
- `GetMetadataDelta`: перелічує блоки, змінені між двома знімками.

## Що далі? {#what-s-next}

Залежно від відгуків та прийняття, розробники Kubernetes сподіваються перевести реалізацію CSI Snapshot Metadata в бета-версію в майбутніх релізах.

## Де я можу дізнатися більше? {#where-can-i-learn-more}

Для тих, хто зацікавлений у випробуванні цієї нової функції:

- Офіційна [документація](https://kubernetes-csi.github.io/docs/external-snapshot-metadata.html) для розробників Kubernetes CSI
- [Пропозиція щодо вдосконалення](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3314-csi-changed-block-tracking) функції метаданих знімків.
- [Репозиторій GitHub](https://github.com/kubernetes-csi/external-snapshot-metadata) для реалізації та статусу випуску `external-snapshot-metadata`
- Повні визначення протоколу gRPC для API метаданих знімків: [schema.proto](https://github.com/kubernetes-csi/external-snapshot-metadata/blob/main/proto/schema.proto)
- Приклад реалізації клієнта метаданих знімків: [snapshot-metadata-lister](https://github.com/kubernetes-csi/external-snapshot-metadata/tree/main/examples/snapshot-metadata-lister)
- Приклад комплексного рішення з csi-hostpath-driver: [документація з прикладом](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/example-ephemeral.md)

## Як я можу долучитися? {#how-do-i-get-involved}

Цей проєкт, як і всі проєкти Kubernetes, є результатом наполегливої праці багатьох учасників з різних сфер, які працювали разом. Від імені SIG Storage я хотів би висловити величезну подяку учасникам, які допомогли переглянути дизайн та реалізацію проєкту, зокрема, але не виключно, наступним особам:

- Ben Swartzlander ([bswartz](https://github.com/bswartz))
- Carl Braganza ([carlbraganza](https://github.com/carlbraganza))
- Daniil Fedotov ([hairyhum](https://github.com/hairyhum))
- Ivan Sim ([ihcsim](https://github.com/ihcsim))
- Nikhil Ladha ([Nikhil-Ladha](https://github.com/Nikhil-Ladha))
- Prasad Ghangal ([PrasadG193](https://github.com/PrasadG193))
- Praveen M ([iPraveenParihar](https://github.com/iPraveenParihar))
- Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
- Xing Yang ([xing-yang](https://github.com/xing-yang))

Дякуємо також усім, хто долучився до проєкту, зокрема тим, хто допоміг рецензувати [KEP](https://github.com/kubernetes/enhancements/pull/4082) та [CSI spec PR](https://github.com/container-storage-interface/spec/pull/551).

Ті, хто зацікавлений у розробці та розвитку CSI або будь-якої частини системи зберігання даних Kubernetes, можуть приєднатися до [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). Ми завжди раді новим учасникам.

SIG також проводить регулярні [зустрічі Data Protection Working Group](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit). Нові учасники можуть долучитися до наших дискусій.
