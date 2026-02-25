---
title: Знімки томів
content_type: concept
weight: 60
---

<!-- overview -->

У Kubernetes _VolumeSnapshot_ представляє знімок тому в системі зберігання. Цей документ передбачає, що ви вже знайомі з постійними томами Kubernetes — [persistent volumes](/docs/concepts/storage/persistent-volumes/).

<!-- body -->

## Вступ {#introduction}

Так само як ресурси API `PersistentVolume` та `PersistentVolumeClaim` використовуються для створення томів для користувачів та адміністраторів, API-ресурси `VolumeSnapshotContent` та `VolumeSnapshot` надаються для створення знімків томів для користувачів та адміністраторів.

`VolumeSnapshotContent` — це знімок, зроблений з тому в кластері, який був створений адміністратором. Це ресурс в кластері, так само як `PersistentVolume` — це ресурс кластера.

`VolumeSnapshot` — це запит на знімок тому від користувача. Він схожий на `PersistentVolumeClaim`.

`VolumeSnapshotClass` дозволяє вам вказати різні атрибути, що належать до `VolumeSnapshot`. Ці атрибути можуть відрізнятися серед знімків, зроблених з того ж тому в системі зберігання, і тому не можуть бути виражені, використовуючи той самий `StorageClass` `PersistentVolumeClaim`.

Знімки томів надають користувачам Kubernetes стандартизований спосіб копіювання вмісту тому в певний момент часу без створення цілком нового тому. Ця функціональність, наприклад, дозволяє адміністраторам баз даних робити резервні копії баз даних перед внесенням змін або видаленням.

Користувачі повинні знати про наступне при використанні цієї функції:

- API-обʼєкти `VolumeSnapshot`, `VolumeSnapshotContent` та `VolumeSnapshotClass` є {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, а не частиною основного API.
- Підтримка `VolumeSnapshot` доступна лише для драйверів CSI.
- В рамках процесу розгортання `VolumeSnapshot` команда Kubernetes надає контролер знімків для розгортання в панелі управління та допоміжний контейнер csi-snapshotter, який розгортається разом із драйвером CSI. Контролер знімків відстежує обʼєкти `VolumeSnapshot` та `VolumeSnapshotContent` та відповідає за створення та видалення обʼєкта `VolumeSnapshotContent`. Допоміжний контейнер (sidecar) csi-snapshotter відстежує обʼєкти `VolumeSnapshotContent` та виконує операції `CreateSnapshot` та `DeleteSnapshot` для точки доступу CSI.
- Також існує сервер перевірки вебзапитів, який надає затвердження обʼєктів знімків. Його слід встановити дистрибутивами Kubernetes разом із контролером знімків та CRDs, а не драйверами CSI. Він повинен бути встановлений в усіх кластерах Kubernetes, в яких увімкнено функцію створення знімків.
- Драйвери CSI можуть або не втілювати функціональність знімка тому. Драйвери CSI, які надали підтримку знімків тому, скоріш за все, використовуватимуть csi-snapshotter. Див. [Документацію драйвера CSI](https://kubernetes-csi.github.io/docs/) для отримання деталей.
- Встановлення CRDs та контролера знімків є обовʼязком дистрибутиву Kubernetes.

Для розширених випадків використання, таких як створення групових знімків кількох томів, див. додаткову документацію [CSI Volume Group Snapshot documentation](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html).

## Життєвий цикл знімка тому та змісту знімка тому {#lifecycle-of-a-volume-snapshot-and-volume-snapshot-content}

`VolumeSnapshotContents` — це ресурси в кластері. `VolumeSnapshots` – це запити на отримання цих ресурсів. Взаємодія між `VolumeSnapshotContents` та `VolumeSnapshots` відповідає життєвому циклу:

### Впровадження знімків томів {#provisioning-volume-snapshot}

Існує два способи впровадження знімків: статичне попереднє впровадження або динамічне попереднє впровадження.

#### Статичне {#static}

Адміністратор кластера створює кілька `VolumeSnapshotContents`. Вони містять деталі реального знімка тому на системі зберігання, який доступний для використання користувачами кластера. Вони існують в API Kubernetes і доступні для використання.

#### Динамічне {#dynamic}

Замість використання попередньо наявного знімка, можна запросити динамічне створення знімка з PersistentVolumeClaim. [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) вказує параметри, специфічні для постачальника зберігання, які слід використовувати при створенні знімка.

### Звʼязування {#binding}

Контролер знімків відповідає за звʼязування обʼєкта `VolumeSnapshot` з відповідним обʼєктом `VolumeSnapshotContent`, як у випадку попереднього впровадження, так і у випадку динамічного провадження. Звʼязування є зіставлення один до одного.

У випадку попереднього впровадження, обʼєкт `VolumeSnapshot` залишається незвʼязаним до тих пір, доки не буде створено запитаний обʼєкт `VolumeSnapshotContent`.

### Persistent Volume Claim як захист джерела знімка {#persistent-volume-claim-as-snapshot-source-protection}

Метою цього захисту є забезпечення того, що обʼєкти API {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} використовуються і не видаляються з системи, поки відбувається створення знімка з нього (оскільки це може призвести до втрати даних).

Під час створення знімка з `PersistentVolumeClaim`, цей `PersistentVolumeClaim` знаходиться в стані використання. Якщо видалити обʼєкт API `PersistentVolumeClaim`, який активно використовується як джерело знімка, то обʼєкт `PersistentVolumeClaim` не видаляється негайно. Замість цього видалення обʼєкта `PersistentVolumeClaim` відкладається до готовності або анулювання знімка.

### Видалення {#delete}

Видалення спровоковане видаленням обʼєкта `VolumeSnapshot`, і буде дотримано `DeletionPolicy`. Якщо `DeletionPolicy` — це `Delete`, тоді підлеглий знімок сховища буде видалено разом з обʼєктом `VolumeSnapshotContent`. Якщо `DeletionPolicy` — це `Retain`, то як сховища, так і `VolumeSnapshotContent` залишаться.

## VolumeSnapshots

Кожен том `VolumeSnapshot` містить специфікацію та стан.

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

Обʼєкт знімка тому може запитати певний клас, вказавши назву [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) за допомогою атрибута `volumeSnapshotClassName`. Якщо нічого не встановлено, то використовується типовий клас, якщо він доступний.

Для знімків, що були створені наперед, вам потрібно вказати `volumeSnapshotContentName` як джерело для знімка, як показано в наступному прикладі. Поле `volumeSnapshotContentName` як джерело є обовʼязковим для наперед створених знімків.

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

Кожен обʼєкт `VolumeSnapshotContent` містить специфікацію та стан. При динамічному створенні знімків загальний контролер створює обʼєкти `VolumeSnapshotContent`. Ось приклад:

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

`volumeHandle` – це унікальний ідентифікатор тому, створеного на сховищі та поверненого драйвером CSI під час створення тому. Це поле обовʼязкове для динамічного створення знімка. Воно вказує джерело тому для знімка.

Для наперед створених знімків ви (як адміністратор кластера) відповідаєте за створення обʼєкта `VolumeSnapshotContent` наступним чином.

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

`snapshotHandle` — це унікальний ідентифікатор знімка тому, створеного в сховищі. Це поле є обовʼязковим для наперед створених знімків. Воно вказує ідентифікатор CSI знімка у сховищі, який представляє цей `VolumeSnapshotContent`.

`sourceVolumeMode` — це режим тому, з якого був зроблений знімок. Значення поля `sourceVolumeMode` може бути або `Filesystem`, або `Block`. Якщо режим джерела тому не вказано, Kubernetes розглядає знімок так, ніби режим джерела тому невідомий.

`volumeSnapshotRef` — це посилання на відповідний `VolumeSnapshot`. Зверніть увагу, що коли `VolumeSnapshotContent` створюється як наперед створений знімок, то `VolumeSnapshot`, на який посилається `volumeSnapshotRef`, може ще не існувати.

## Зміна режиму тому знімка {#convert-volume-mode}

Якщо API `VolumeSnapshots`, встановлене на вашому кластері, підтримує поле `sourceVolumeMode`, то API має можливість запобігати несанкціонованим користувачам зміни режиму тому.

Щоб перевірити, чи має ваш кластер цю функціональність, виконайте наступну команду:

```yaml
kubectl get crd volumesnapshotcontent -o yaml
```

Якщо ви хочете дозволити користувачам створювати `PersistentVolumeClaim` з наявного `VolumeSnapshot`, але з іншим режимом тому, ніж у джерела, слід додати анотацію `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"` до `VolumeSnapshotContent`, який відповідає `VolumeSnapshot`.

Для наперед створених знімків `spec.sourceVolumeMode` повинно бути заповнено адміністратором кластера.

Приклад ресурсу `VolumeSnapshotContent` із включеною цією функцією виглядатиме так:

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

## Створення томів зі знімків {#provisioning-volumes-from-snapshots}

Ви можете створити новий том, наперед заповнений даними зі знімка, використовуючи поле _dataSource_ в обʼєкті `PersistentVolumeClaim`.

Докладніше дивіться в [Знімок тому та відновлення тому зі знімка](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
