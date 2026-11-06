---
title: Знімки томів
content_type: concept
weight: 60
---

<!-- overview -->

У Kubernetes _VolumeSnapshot_ представляє знімок тому в системі зберігання. У цьому документі передбачається, що ви вже знайомі з [постійними томами](/docs/concepts/storage/persistent-volumes/) Kubernetes.

<!-- body -->

## Вступ {#introduction}

Подібно до того, як ресурси API `PersistentVolume` та `PersistentVolumeClaim` використовуються для надання томів користувачам і адміністраторам, ресурси API `VolumeSnapshotContent` та `VolumeSnapshot` призначені для створення знімків томів для користувачів і адміністраторів.

`VolumeSnapshotContent` — це знімок, зроблений із тому в кластері, наданого адміністратором. Це ресурс у кластері, так само як PersistentVolume є ресурсом кластера.

`VolumeSnapshot` — це запит на знімок тому від користувача. Він схожий на `PersistentVolumeClaim`.

`VolumeSnapshotClass` дозволяє вказати різні атрибути, що належать до `VolumeSnapshot`. Ці атрибути можуть відрізнятися для знімків, зроблених з одного й того самого тому в системі зберігання, і тому їх не можна виразити за допомогою того самого `StorageClass` у `PersistentVolumeClaim`.

Знімки томів надають користувачам Kubernetes стандартизований спосіб копіювання вмісту тому на певний момент часу без створення цілком нового тому. Ця функціональність дозволяє, наприклад, адміністраторам баз даних створювати резервні копії баз даних перед внесенням змін або видаленням.

Під час використання цієї можливості користувачі повинні знати таке:

- API-обʼєкти `VolumeSnapshot`, `VolumeSnapshotContent` та `VolumeSnapshotClass` є {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, а не частиною основного API.
- Підтримка `VolumeSnapshot` доступна лише для драйверів CSI.
- У межах процесу розгортання `VolumeSnapshot` команда Kubernetes надає контролер знімків, який розгортається в панелі управління, і допоміжний sidecar-контейнер csi-snapshotter, який розгортається разом із драйвером CSI. Контролер знімків стежить за обʼєктами `VolumeSnapshot` та `VolumeSnapshotContent` і відповідає за створення та видалення обʼєкта `VolumeSnapshotContent`. Sidecar-контейнер csi-snapshotter стежить за обʼєктами `VolumeSnapshotContent` і запускає операції `CreateSnapshot` та `DeleteSnapshot` для точки доступу CSI.
- Також існує сервер валідаційного вебхука, який забезпечує посилену валідацію обʼєктів знімків. Його мають встановлювати дистрибутиви Kubernetes разом із контролером знімків і CRDs, а не драйвери CSI. Його слід встановити в усіх кластерах Kubernetes, де ввімкнено можливість знімків.
- Драйвери CSI можуть реалізовувати функціональність знімків томів, а можуть і не реалізовувати. Драйвери CSI, які надають підтримку знімків томів, імовірно, використовуватимуть csi-snapshotter. Докладніше дивіться в [документації драйверів CSI](https://kubernetes-csi.github.io/docs/).
- За встановлення CRDs та контролера знімків відповідає дистрибутив Kubernetes.

Для складніших випадків використання, таких як створення групових знімків кількох томів, дивіться зовнішню [документацію CSI Volume Group Snapshot](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html).

У кластерах, де знімок можна використовувати лише з частини кластера (наприклад, знімок тому в одній зоні багатозонового кластера без спільного сховища), топологію знімка можна записати та враховувати під час відновлення з нього. Докладніше дивіться у зовнішній [документації CSI](https://kubernetes-csi.github.io/docs/introduction.html).

## Життєвий цикл знімка тому та вмісту знімка тому {#lifecycle-of-a-volume-snapshot-and-volume-snapshot-content}

`VolumeSnapshotContents` — це ресурси в кластері. `VolumeSnapshots` — це запити на ці ресурси. Взаємодія між `VolumeSnapshotContents` та `VolumeSnapshots` відбувається за таким життєвим циклом:

### Надання знімків томів {#provisioning-volume-snapshot}

Знімки можна надавати двома способами: попередньо або динамічно.

#### Попереднє надання {#static}

Адміністратор кластера створює певну кількість `VolumeSnapshotContents`. Вони містять відомості про реальний знімок тому в системі зберігання, доступний для використання користувачами кластера. Вони існують в API Kubernetes і доступні для використання.

#### Динамічне надання {#dynamic}

Замість використання наявного знімка ви можете запросити динамічне створення знімка з PersistentVolumeClaim. [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) вказує специфічні для постачальника сховища параметри, які слід використовувати під час створення знімка.

### Привʼязка {#binding}

Контролер знімків відповідає за привʼязку обʼєкта `VolumeSnapshot` до відповідного обʼєкта `VolumeSnapshotContent` як за попереднього, так і за динамічного надання. Привʼязка є зіставленням один до одного.

У випадку попереднього надання VolumeSnapshot залишається непривʼязаним, доки не буде створено запитаний обʼєкт VolumeSnapshotContent.

### Захист PersistentVolumeClaim як джерела знімка {#persistent-volume-claim-as-snapshot-source-protection}

Мета цього захисту — гарантувати, що обʼєкти API {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}, які використовуються, не вилучаються із системи, поки з них робиться знімок (оскільки це може призвести до втрати даних).

Поки з PersistentVolumeClaim робиться знімок, цей PersistentVolumeClaim вважається таким, що використовується. Якщо ви видалите обʼєкт API PersistentVolumeClaim, який активно використовується як джерело знімка, обʼєкт PersistentVolumeClaim вилучається не одразу. Натомість його вилучення відкладається, доки знімок не стане readyToUse або не буде перерваний.

### Видалення {#delete}

Видалення запускається видаленням обʼєкта `VolumeSnapshot`, і далі діє `DeletionPolicy`. Якщо `DeletionPolicy` має значення `Delete`, базовий знімок сховища буде видалено разом з обʼєктом `VolumeSnapshotContent`. Якщо `DeletionPolicy` має значення `Retain`, то і базовий знімок, і `VolumeSnapshotContent` залишаються.

## VolumeSnapshots

Кожен VolumeSnapshot містить spec і status.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

`persistentVolumeClaimName` — це назва обʼєкта `PersistentVolumeClaim`, який є джерелом даних для знімка. Це поле є обовʼязковим для динамічного створення знімка.

Знімок тому може запитати певний клас, вказавши назву [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) в атрибуті `volumeSnapshotClassName`. Якщо нічого не вказано, використовується стандартний клас, якщо він доступний.

Для попередньо наданих знімків потрібно вказати `volumeSnapshotContentName` як джерело знімка, як показано в наведеному нижче прикладі. Поле джерела `volumeSnapshotContentName` є обовʼязковим для попередньо наданих знімків.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

## Вміст знімків томів {#volume-snapshot-contents}

Кожен VolumeSnapshotContent містить spec і status. Під час динамічного надання загальний контролер знімків створює обʼєкти `VolumeSnapshotContent`. Ось приклад:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

`volumeHandle` — це унікальний ідентифікатор тому, створеного в бекенді сховища й повернутого драйвером CSI під час створення тому. Це поле є обовʼязковим для динамічного надання знімка. Воно вказує том-джерело знімка.

Для попередньо наданих знімків ви (як адміністратор кластера) відповідаєте за створення обʼєкта `VolumeSnapshotContent`, як показано нижче.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

`snapshotHandle` — це унікальний ідентифікатор знімка тому, створеного в бекенді сховища. Це поле є обовʼязковим для попередньо наданих знімків. Воно вказує ідентифікатор знімка CSI в системі зберігання, який представляє цей `VolumeSnapshotContent`.

`sourceVolumeMode` — це режим тому, з якого зроблено знімок. Значенням поля `sourceVolumeMode` може бути `Filesystem` або `Block`. Якщо режим вихідного тому не вказано, Kubernetes вважає, що режим вихідного тому невідомий.

`volumeSnapshotRef` — це посилання на відповідний `VolumeSnapshot`. Зверніть увагу, що коли `VolumeSnapshotContent` створюється як попередньо наданий знімок, `VolumeSnapshot`, на який посилається `volumeSnapshotRef`, може ще не існувати.

## Зміна режиму тому знімка {#convert-volume-mode}

Якщо API `VolumeSnapshots`, встановлений у вашому кластері, підтримує поле `sourceVolumeMode`, то API може не давати неавторизованим користувачам змінювати режим тому.

Щоб перевірити, чи підтримує ваш кластер цю можливість, виконайте таку команду:

```yaml
$ kubectl get crd volumesnapshotcontent -o yaml
```

Якщо ви хочете дозволити користувачам створювати `PersistentVolumeClaim` з наявного `VolumeSnapshot`, але з іншим режимом тому, ніж у джерела, слід додати анотацію `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"` до `VolumeSnapshotContent`, який відповідає `VolumeSnapshot`.

Для попередньо наданих знімків `spec.sourceVolumeMode` має заповнити адміністратор кластера.

Приклад ресурсу `VolumeSnapshotContent` із увімкненою цією можливістю виглядатиме так:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
  annotations:
    - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

## Топологія знімків томів {#volume-snapshot-topology}

У деяких кластерах знімок можна використовувати лише з частини кластера. Наприклад, у багатозоновому кластері, де сховище не є спільним між зонами, знімок тому в одній зоні можна використовувати лише з цієї зони: томи, відновлені зі знімка, можна створювати лише там, де розташовані дані знімка.

Коли ввімкнено можливість `VolumeSnapshotTopology`, ця топологія записується та враховується:

- Адміністратор кластера може встановити `allowedTopologies` у [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/), щоб вказати, звідки мають бути доступні динамічно створені знімки.
- Драйвер CSI повідомляє, звідки можна використовувати знімок, а sidecar-контейнер csi-snapshotter записує це в `VolumeSnapshotContent.spec.nodeAffinity`.
- Коли ви надаєте том зі знімка, ця топологія використовується для розміщення відновленого тому там, де доступні дані знімка.

Це альфа-можливість sidecar-контейнерів CSI, яка вмикається функціональною можливістю `VolumeSnapshotTopology` у csi-snapshotter та external-provisioner. Докладніше дивіться у зовнішній [документації CSI](https://kubernetes-csi.github.io/docs/introduction.html).

## Надання томів зі знімків {#provisioning-volumes-from-snapshots}

Ви можете надати новий том, попередньо заповнений даними зі знімка, за допомогою поля _dataSource_ в обʼєкті `PersistentVolumeClaim`.

Докладніше дивіться в [Знімок тому та відновлення тому зі знімка](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
