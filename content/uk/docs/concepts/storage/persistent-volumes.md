---
title: Постійні томи
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
- apiVersion: "v1"
  kind: "PersistentVolumeClaim"
feature:
  title: Оркестрування зберігання
  description: >
    Автоматичне монтування системи зберігання за вашим вибором, будь то локальне сховище, публічний постачальник хмарних послуг або мережева система зберігання, така як iSCSI або NFS.
content_type: concept
weight: 20
---

<!-- overview -->

Цей документ описує _постійні томи (persistent volumes)_ в Kubernetes. Рекомендується вже мати уявлення про [томи](/docs/concepts/storage/volumes/), [StorageClasses](/docs/concepts/storage/storage-classes/) та [VolumeAttributesClasses](/docs/concepts/storage/volume-attributes-classes/).

<!-- body -->

## Вступ {#introduction}

Управління системою зберігання даних — це завдання, що відрізняється від управління обчислювальними ресурсами. Підсистема PersistentVolume надає API для користувачів та адміністраторів, який відділяє деталі того, як відбувається надання сховища від того, як воно використовується. Для цього ми вводимо два нових ресурси API: PersistentVolume і PersistentVolumeClaim.

**PersistentVolume** (PV) — це частина системи зберігання в кластері, яка була надана адміністратором або динамічно надана за допомогою [Storage Classes](/docs/concepts/storage/storage-classes/). Це ресурс в кластері, так само як вузол — це ресурс кластера. PV — це втулки томів, так само як Volumes, але вони мають життєвий цикл, незалежний від будь-якого окремого Podʼа, який використовує PV. Цей обʼєкт API охоплює деталі реалізації зберігання, такі як NFS, iSCSI або система зберігання, специфічна для постачальника хмарних послуг.

**PersistentVolumeClaim** (PVC) — це запит на отримання ресурсів системи зберігання від користувача. Він схожий на Pod. Podʼи використовують ресурси вузла, а PVC використовують ресурси PV. Podʼи можуть запитувати конкретні рівні ресурсів (CPU та памʼять). Claims можуть запитувати конкретний розмір та режими доступу (наприклад, їх можна монтувати в режимі ReadWriteOnce, ReadOnlyMany, ReadWriteMany або ReadWriteOncePod, див. [AccessModes](#access-modes)).

Хоча PersistentVolumeClaims дозволяють користувачам споживати абстрактні ресурси зберігання, часто користувачам потрібні PersistentVolumes з різними властивостями, такими як продуктивність для різних завдань. Адміністратори кластера повинні мати можливість надавати різноманітні PersistentVolumes, які відрізняються не тільки розміром і режимами доступу, але й іншими характеристиками, не розголошуючи користувачам деталей того, як реалізовані ці томи. Для цих потреб існує ресурс **StorageClass**.

Дивіться [докладний огляд із робочими прикладами](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).

## Життєвий цикл тому та запиту {#lifecycle-of-a-volume-and-claim}

PV (PersistentVolume) — це ресурс в кластері. PVC (PersistentVolumeClaim) — це запити на ці ресурси, які також діють як повідомлення, що підтверджують доступ до ресурсу. Взаємодія між PV та PVC слідує такому життєвому циклу:

### Виділення {#provisioning}

Існує два способи надання PV: статичне чи динамічне.

#### Статичне {#static}

Адміністратор кластера створює кілька PV. Вони містять деталі реальної системи зберігання, яка доступна для використання користувачами кластера. Вони існують в API Kubernetes і доступні для споживання.

#### Динамічне {#dynamic}

Коли жоден зі статичних PV, які створив адміністратор, не відповідає PersistentVolumeClaim користувача, кластер може спробувати динамічно надати том спеціально для цього PVC. Це надання ґрунтується на StorageClasses: PVC повинен запитати [клас зберігання](/docs/concepts/storage/storage-classes/), а адміністратор повинен створити та налаштувати цей клас для динамічного надання. Заявки, які запитують клас `""`, фактично вимикають динамічне надання ресурсів для себе.

Для активації динамічного надання сховища на основі класу зберігання адміністратор кластера повинен увімкнути [контролер допуску](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) `DefaultStorageClass` на API-сервері. Це можна зробити, наприклад, забезпечивши, що `DefaultStorageClass` знаходиться серед значень, розділених комами, у впорядкованому списку для прапорця `--enable-admission-plugins` компонента API-сервера. Для отримання додаткової інформації щодо прапорців командного рядка API-сервера перевірте документацію [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

### Звʼязування {#binding}

Користувач створює, або, у разі динамічного надання, має вже створений, PersistentVolumeClaim із конкретним обсягом запитаного сховища та з певними режимами доступу. Цикл керування в панелі управління бачить нові PVC, знаходить відповідний PV (якщо це можливо), і звʼязує їх один з одним. Якщо PV був динамічно наданий для нового PVC, цикл завжди буде привʼязувати цей PV до PVC. В іншому випадку користувачі завжди отримають принаймні те, про що вони просили, але том може бути більшим, ніж те, що було запитано. Як тільки звʼязування виконане, привʼязки PersistentVolumeClaim стають ексклюзивними, незалежно від того, як вони були звʼязані. Привʼязка PVC до PV — це зіставлення один до одного, з використанням ClaimRef, яке є двонапрямним звʼязуванням між PersistentVolume і PersistentVolumeClaim.

Заявки залишатимуться непривʼязаними нескінченно довго, якщо відповідного тому не існує. Заявки будуть привʼязані, в міру того як стають доступні відповідні томи. Наприклад, кластер, який має багато PV розміром 50Gi, не буде відповідати PVC розміром 100Gi. PVC може бути привʼязаний, коли до кластера додається PV розміром 100Gi.

### Використання {#using}

Podʼи використовують заявки як томи. Кластер перевіряє заявку, щоб знайти привʼязаний том і монтує цей том для Podʼа. Для томів, які підтримують кілька режимів доступу, користувач вказує бажаний режим при використанні своєї заявки як тому в Podʼі.

Якщо у користувача є заявка, і ця заявка привʼязана, привʼязаний PV належить користувачеві стільки, скільки він йому потрібний. Користувачі планують Podʼи та отримують доступ до своїх заявлених PV, включивши розділ `persistentVolumeClaim` в блок `volumes` Podʼа. Див. [Заявки як Томи](#claims-as-volumes) для отримання докладнішої інформації щодо цього.

### Захист обʼєкта зберігання, що використовується {#storage-object-in-use-protection}

Мета функції захисту обʼєктів зберігання — є забезпечення того, що PersistentVolumeClaims (PVC), які активно використовуються Podʼом, та PersistentVolume (PV), які привʼязані до PVC, не видаляються з системи, оскільки це може призвести до втрати даних.

{{< note >}}
PVC активно використовується Podʼом, коли існує обʼєкт Pod, який використовує PVC.
{{< /note >}}

Якщо користувач видаляє PVC, що активно використовується Podʼом, PVC не видаляється негайно. Видалення PVC відкладається до тих пір, поки PVC більше активно не використовується жодним Podʼом. Також, якщо адміністратор видаляє PV, який привʼязаний до PVC, PV не видаляється негайно. Видалення PV відкладається до тих пір, поки PV більше не є привʼязаним до PVC.

Ви можете перевірити, що PVC захищено, коли статус PVC — `Terminating`, а список `Finalizers` включає `kubernetes.io/pvc-protection`:

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

Ви можете перевірити, що PV захищено, коли статус PV — `Terminating`, а список `Finalizers` також включає `kubernetes.io/pv-protection`:

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

### Повторне використання {#reclaiming}

Коли користувач закінчує використання свого тому, він може видалити обʼєкти PVC з API, що дозволяє відновлщо дозволяє повторно використовувати ресурс. Політика повторного використання для PersistentVolume повідомляє кластеру, що робити з томом після звільнення заявки на нього. Наразі томи можуть бути Retain, Recycle, або Delete.

#### Retain

Політика повторного використання `Retain` дозволяє ручне повторне використання ресурсу. Коли видаляється PersistentVolumeClaim, PersistentVolume все ще існує, і том вважається "звільненим". Але він ще не доступний для іншої заявки через те, що дані попередньої заявки залишаються на томі. Адміністратор може вручну відновити том виконавши наступні кроки.

1. Видаліть PersistentVolume. Повʼязаний ресурс зберігання в зовнішній інфраструктурі все ще існує після видалення PV.
1. Вручну очистіть дані на повʼязаному ресурсі, відповідно.
1. Вручну видаліть повʼязаний ресурс.

Якщо ви хочете використовувати той самий ресурс, створіть новий PersistentVolume з тим же описом ресурсу.

#### Delete

Для втулків томів, які підтримують політику повторного використання `Delete`, ця політика видаляє як обʼєкт PersistentVolume з Kubernetes, так і повʼязаний ресурс зовнішньої інфраструктури. Томи, які були динамічно виділені, успадковують [політику пвоторного використання з їх StorageClass](#reclaim-policy), яка стандартно встановлена в `Delete`. Адміністратор повинен налаштувати StorageClass відповідно до очікувань користувачів; в іншому випадку PV повинен бути відредагований або виправлений (patch) після створення. Див. [Змінення політики повторного використання PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### Recycle

{{< warning >}}
Політика повторного використання `Recycle` є застарілою. Замість цього рекомендований підхід — використовувати динамічне виділення.
{{< /warning >}}

Якщо підтримується відповідний втулок томів, політика повторного використання `Recycle` виконує базове очищення (`rm -rf /thevolume/*`) тому та знову робить його доступним для нової заявки.

Однак адміністратор може налаштувати власний шаблон Podʼа для повторного використання тому за допомогою аргументів командного рядка контролера Kubernetes, як описано в [довідці](/docs/reference/command-line-tools-reference/kube-controller-manager/). Власний шаблон Podʼа політики повторного використання тому повинен містити специфікацію `volumes`, як показано у прикладі нижче:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "registry.k8s.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

Проте конкретний шлях, вказаний у власному шаблоні Podʼа для повторного використання тому, в частині `volumes`, замінюється конкретним шляхом тому, який використовується.

### Завершувач захисту від видалення PersistentVolume {#persistentvolume-deletion-protection-finalizer}

{{< feature-state feature_gate_name="HonorPVReclaimPolicy" >}}

До PersistentVolume можна додавати завершувачі, щоб забезпечити, що PersistentVolume з політикою повторного використання `Delete` буде видалено лише після видалення сховища, яке він забезпечував.

Завершувач `external-provisioner.volume.kubernetes.io/finalizer` (введений у v1.31) додається як до динамічно, так і до статично виділених томів CSI.

Завершувач `kubernetes.io/pv-controller` (введений у v1.31) додається до динамічно виділених томів внутрішнього втулка і пропускається для статично виділених томів внутрішнього втулка.

Ось приклад динамічно виділеного тому внутрішнього втулка:

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Name:            pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Labels:          <none>
Annotations:     kubernetes.io/createdby: vsphere-volume-dynamic-provisioner
                 pv.kubernetes.io/bound-by-controller: yes
                 pv.kubernetes.io/provisioned-by: kubernetes.io/vsphere-volume
Finalizers:      [kubernetes.io/pv-protection kubernetes.io/pv-controller]
StorageClass:    vcp-sc
Status:          Bound
Claim:           default/vcp-pvc-1
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:
Source:
    Type:               vSphereVolume (a Persistent Disk resource in vSphere)
    VolumePath:         [vsanDatastore] d49c4a62-166f-ce12-c464-020077ba5d46/kubernetes-dynamic-pvc-74a498d6-3929-47e8-8c02-078c1ece4d78.vmdk
    FSType:             ext4
    StoragePolicyName:  vSAN Default Storage Policy
Events:                 <none>
```

Завершувач `external-provisioner.volume.kubernetes.io/finalizer` додається для томів CSI. Наприклад:

```shell
Name:            pvc-2f0bab97-85a8-4552-8044-eb8be45cf48d
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
Finalizers:      [kubernetes.io/pv-protection external-provisioner.volume.kubernetes.io/finalizer]
StorageClass:    fast
Status:          Bound
Claim:           demo-app/nginx-logs
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        200Mi
Node Affinity:   <none>
Message:
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.vsphere.vmware.com
    FSType:            ext4
    VolumeHandle:      44830fa8-79b4-406b-8b58-621ba25353fd
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1648442357185-8081-csi.vsphere.vmware.com
                           type=vSphere CNS Block Volume
Events:                <none>
```

Коли прапорець функції `CSIMigration{provider}` увімкнено для конкретного внутрішнього втулка, завершувач `kubernetes.io/pv-controller` замінюється завершувачем `external-provisioner.volume.kubernetes.io/finalizer`.

Завершувачі забезпечують, що обʼєкт PV видаляється лише після того, як том буде видалений з бекенду зберігання, якщо політика повторного використання PV є `Delete`. Це також гарантує, що том буде видалений з бекенду зберігання незалежно від порядку видалення PV і PVC.

### Резервування PersistentVolume {#reserving-persistentvolume}

Панель управління може [привʼязувати PersistentVolumeClaims до PersistentVolume](#binding) в кластері. Однак, якщо вам потрібно, щоб PVC привʼязувався до певного PV, вам слід заздалегідь їх привʼязувати.

Вказавши PersistentVolume в PersistentVolumeClaim, ви оголошуєте привʼязку між цим конкретним PV та PVC. Якщо PersistentVolume існує і не зарезервував PersistentVolumeClaim через своє поле `claimRef`, тоді PersistentVolume і PersistentVolumeClaim будуть привʼязані.

Привʼязка відбувається незалежно від деяких критеріїв зіставлення томів, включаючи спорідненість вузла. Панель управління все ще перевіряє, що [клас сховища](/docs/concepts/storage/storage-classes/), режими доступу та розмір запитаного сховища є дійсними.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # Порожній рядок повинен бути явно встановлений, інакше буде встановлено типовий StorageClass
  volumeName: foo-pv
  ...
```

Цей метод не гарантує жодних привʼязок для PersistentVolume. Якщо інші PersistentVolumeClaims можуть використовувати PV, який ви вказуєте, вам слід заздалегідь резервувати цей том сховища. Вкажіть відповідний PersistentVolumeClaim у поле `claimRef` PV, щоб інші PVC не могли привʼязатися до нього.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

Це корисно, якщо ви хочете використовувати PersistentVolumes з політикою повторного використання `Retain`, включаючи випадки, коли ви повторно використовуєте наявний PV.

### Розширення Persistent Volume Claims {#expanding-persistent-volume-claims}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Підтримка розширення PersistentVolumeClaims (PVCs) є типово увімкненою. Ви можете розширити наступні типи томів:

* {{< glossary_tooltip text="csi" term_id="csi" >}} (включно з деякими типами перенесених томів CSI)
* flexVolume (застарілий)
* portworxVolume (застарілий)

Ви можете розширити PVC лише в тому випадку, якщо поле `allowVolumeExpansion` його класу сховища має значення true.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

Для запиту більшого тому для PVC відредагуйте обʼєкт PVC та вказуйте більший розмір. Це спричинює розширення тому, який стоїть за основним PersistentVolume. Новий PersistentVolume ніколи не створюється для задоволення вимоги. Замість цього, змінюється розмір поточного тому.

{{< warning >}}
Пряме редагування розміру PersistentVolume може запобігти автоматичному зміненню розміру цього тому. Якщо ви редагуєте обсяг PersistentVolume, а потім редагуєте `.spec` відповідного PersistentVolumeClaim, щоб розмір PersistentVolumeClaim відповідав PersistentVolume, то зміна розміру сховища не відбудеться. Панель управління Kubernetes побачить, що бажаний стан обох ресурсів збігається, і робить висновок, що розмір обʼєкта був збільшений вручну і розширення не потрібне.
{{< /warning >}}

#### Розширення томів CSI {#csi-volume-expansion}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Підтримка розширення томів CSI типово увімкнена, але вона також вимагає, щоб конкретний драйвер CSI підтримував розширення тому. Зверніться до документації відповідного драйвера CSI для отримання додаткової інформації.

#### Зміна розміру тому, що містить файлову систему {#resizing-a-volume-containing-a-filesystem}

Ви можете змінювати розмір томів, що містять файлову систему, тільки якщо файлова система є XFS, Ext3 або Ext4.

Коли том містить файлову систему, розмір файлової системи змінюється тільки тоді, коли новий Pod використовує PersistentVolumeClaim у режимі `ReadWrite`. Розширення файлової системи виконується при запуску нового Pod або коли Pod працює, і базова файлова система підтримує онлайн-розширення.

FlexVolumes (застарілий починаючи з Kubernetes v1.23) дозволяє змінювати розмір, якщо драйвер налаштований із можливістю `RequiresFSResize` встановленою в `true`. FlexVolume може бути змінений при перезапуску Pod.

#### Зміна розміру використовуваного PersistentVolumeClaim {#resizing-an-in-use-persistentvolumeclaim}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

В цьому випадку вам не потрібно видаляти та перестворювати Pod або Deployment, який використовує наявний PVC. Будь-який PVC, який знаходиться у використанні, автоматично стає доступним для свого Pod, як тільки його файлова система буде розширена. Ця функція не впливає на PVC, які не використовуються Pod або Deployment. Ви повинні створити Pod, який використовує PVC, перш ніж розширення може завершитися.

Аналогічно іншим типам томів — томи FlexVolume також можуть бути розширені в разі використання Podʼом.

{{< note >}}
Змінювати розмір FlexVolume можливо лише тоді, коли зміна розміру підтримується драйвером.
{{< /note >}}

#### Відновлення після невдалих спроб розширення томів {#recovering-from-failure-while-expanding-volumes}

Якщо користувач вказав новий розмір, який надто великий для задоволення базовою системою зберігання, розширення PVC буде намагатися робити спроби його задовольнити, доки користувач або адміністратор кластера не вживе будь-яких заходів. Це може бути небажаним, і, отже, Kubernetes надає наступні методи відновлення після таких невдач.

{{< tabs name="recovery_methods" >}}
{{% tab name="Вручну адміністраторами кластера" %}}

Якщо розширення базового сховища не вдається, адміністратор кластера може вручну відновити стан Persistent Volume Claim (PVC) та скасувати запити на зміну розміру. Інакше запити на зміну розміру буде продовжено автоматично контролером без втручання адміністратора.

1. Позначте Persistent Volume (PV), який привʼязаний до Persistent Volume Claim (PVC), політикою повторного використання `Retain`.
2. Видаліть PVC. Оскільки PV має політику повторного використання `Retain`, ми не втратимо жодних даних під час повторного створення PVC.
3. Видаліть запис `claimRef` з характеристик PV, щоб новий PVC міг привʼязатися до нього. Це повинно зробити PV `Available`.
4. Створіть заново PVC з меншим розміром, ніж у PV, і встановіть в поле `volumeName` PVC імʼя PV. Це повинно привʼязати новий PVC до наявного PV.
5. Не забудьте відновити політику повторного вкористання PV.

{{% /tab %}}
{{% tab name="Шляхом запиту на зменшення розміру" %}}

Якщо розширення не вдалося для PVC, ви можете повторити спробу розширення з меншим розміром, ніж раніше запитаний. Щоб запросити нову спробу розширення з новим запропонованим розміром, відредагуйте `.spec.resources` для цього PVC і виберіть значення, яке менше за попереднє значення. Це корисно, якщо розширення до більшого значення не вдалося через обмеження місткості. Якщо це трапилося або ви підозрюєте, що це може трапитися, ви можете повторити спробу розширення, вказавши розмір, який знаходиться в межах обмежень місткості базового постачальника сховища. Ви можете слідкувати за станом операції зміни розміру, спостерігаючи за `.status.allocatedResourceStatuses` та подіями в PVC.

Зверніть увагу, що, навіть якщо ви можете вказати менше обсягу зберігання, ніж запитано раніше, нове значення все ще повинно бути вищим за `.status.capacity`. Kubernetes не підтримує зменшення PVC до меншого розміру, ніж його поточний розмір.
{{% /tab %}}
{{% /tabs %}}

## Типи Persistent Volume {#types-of-persistent-volumes}

Типи PersistentVolume реалізовані у вигляді втулків. Kubernetes наразі підтримує наступні втулки:

* [`csi`](/docs/concepts/storage/volumes/#csi) — Інтерфейс зберігання контейнерів (Container Storage Interface, CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) — Сховище Fibre Channel (FC)
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) — Том HostPath (для тестування тільки на одному вузлі; НЕ ПРАЦЮВАТИМЕ в кластері з декількома вузлами; розгляньте використання тому `local` замість цього)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) — Сховище iSCSI (SCSI через IP)
* [`local`](/docs/concepts/storage/volumes/#local) — Локальні пристрої зберігання, підключені до вузлів.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) — Сховище в мережевій файловій системі (NFS)

Наступні типи PersistentVolume застарілі, але все ще доступні. Якщо ви використовуєте ці типи томів, окрім `flexVolume`, `cephfs` та `rbd`, будь ласка, встановіть відповідні драйвери CSI.

* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) — AWS Elastic Block Store (EBS) (**міграція типово увімкнена** починаючи з v1.23)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) — Azure Disk (**міграція типово увімкнена** починаючи з v1.23)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) — Azure File (**міграція типово увімкнена** починаючи з v1.24)
* [`cinder`](/docs/concepts/storage/volumes/#cinder) — Cinder (блочне сховище OpenStack) (**міграція типово увімкнена** починаючи з v1.21)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) — FlexVolume (**застаріло** починаючи з версії v1.23, план міграції відсутній, планів припинення підтримки немає)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcePersistentDisk) — GCE Persistent Disk (**застаріло** починаючи з v1.23, план міграції відсутній, планів припинення підтримки немає)
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) — Том Portworx (**міграція типово увімкнена** починаючи з v1.31)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK volume (**міграція типово увімкнена** починаючи з v1.25)

Старші версії Kubernetes також підтримували наступні типи вбудованих PersistentVolume:

* [`cephfs`](/docs/concepts/storage/volumes/#cephfs) (**недоступно** починаючи з версії v1.31)
* `flocker` — Flocker storage. (**недоступно** починаючи з версії v1.25)
* `glusterfs` - GlusterFS storage. (**недоступно** починаючи з версії v1.26)
* `photonPersistentDisk` — Photon controller persistent disk. (**недоступно** починаючи з версії v1.15)
* `quobyte` — Том Quobyte. (**недоступно** починаючи з версії v1.25)
* [`rbd`](/docs/concepts/storage/volumes/#rbd) — Rados Block Device (RBD) volume  (**недоступно** починаючи з версії v1.31)
* `scaleIO` — Том ScaleIO. (**недоступно** починаючи з версії v1.21)
* `storageos` — Том StorageOS. (**недоступно** починаючи з версії v1.25)

## Persistent Volumes

Кожен PersistentVolume (PV) містить специфікацію та статус, які являють собою характеристики та стан тому. Імʼя обʼєкта PersistentVolume повинно бути дійсним [DNS імʼям субдомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

{{< note >}}
Можливо, для використання PersistentVolume у кластері будуть потрібні допоміжні програми. У цьому прикладі PersistentVolume має тип NFS, і для підтримки монтування файлових систем NFS необхідна допоміжна програма /sbin/mount.nfs.
{{< /note >}}

### Обсяг {#capacity}

Зазвичай у PV є конкретний обсяг зберігання. Він встановлюється за допомогою атрибута `capacity` PV, який є значенням {{< glossary_tooltip term_id="quantity" text="кількості" >}} обсягу.

Наразі розмір — це єдиний ресурс, який можна встановити або вимагати. Майбутні атрибути можуть включати IOPS, пропускну здатність тощо.

### Режим тому {#volume-mode}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Kubernetes підтримує два режими `volumeModes` для PersistentVolumes: `Filesystem` та `Block`.

`volumeMode` є необовʼязковим параметром API. `Filesystem` є типовим режимом, який використовується, коли параметр `volumeMode` пропущено.

Том з `volumeMode: Filesystem` _монтується_ в Podʼах в теку. Якщо том підтримується блоковим пристроєм, і пристрій порожній, Kubernetes створює файлову систему на пристрої перед його першим монтуванням.

Ви можете встановити значення `volumeMode` в `Block`, щоб використовувати том як блоковий пристрій. Такий том представляється в Podʼі як блоковий пристрій, без будь-якої файлової системи на ньому. Цей режим корисний, щоб надати Podʼу найшвидший можливий спосіб доступу до тому, без будь-якого рівня файлової системи між Podʼом і томом. З іншого боку, застосунок, який працює в Podʼі, повинен знати, як взаємодіяти з блоковим пристроєм. Дивіться [Підтримка блокового тому](#raw-block-volume-support) для прикладу використання тому з `volumeMode: Block` в Podʼі.

### Режими доступу {#access-modes}

PersistentVolume може бути підключений до вузла будь-яким способом, який підтримує постачальник ресурсів. Як показано в таблиці нижче, постачальники матимуть різні можливості, і кожному PV присвоюється набір режимів доступу, які описують можливості саме цього PV.

Режими доступу такі:

`ReadWriteOnce`
: том може бути змонтовано у режимі читання-запису на одному вузлі. У режимі доступу ReadWriteOnce можна дозволити доступ до тому (читання з нього або запис до нього) кільком podʼам, якщо вони працюють на одному вузлі. Про доступ до одного з них див. ReadWriteOncePod.

`ReadOnlyMany`
: том може бути підключений як тільки для читання багатьма вузлами.

`ReadWriteMany`
: том може бути підключений як для читання-запису багатьма вузлами.

 `ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  том може бути підключений як для читання-запису одним Podʼом. Використовуйте режим доступу ReadWriteOncePod, якщо ви хочете забезпечити, що тільки один Pod по всьому кластеру може читати цей PVC або писати в нього.

{{< note >}}
Режим доступу `ReadWriteOncePod` підтримується лише для {{< glossary_tooltip text="CSI" term_id="csi" >}} томів та Kubernetes версії 1.22+. Щоб використовувати цю функцію, вам потрібно оновити наступні [CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html) до цих версій або новіших:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

У командному рядку режими доступу скорочуються так:

* RWO — ReadWriteOnce
* ROX — ReadOnlyMany
* RWX — ReadWriteMany
* RWOP — ReadWriteOncePod

{{< note >}}
Kubernetes використовує режими доступу до тому для зіставлення PersistentVolumeClaims з PersistentVolumes. У деяких випадках режими доступу до тому також обмежують місця, де може бути підключений PersistentVolume. Режими доступу до тому **не** накладають захист від запису після підключення сховища. Навіть якщо режими доступу вказані як ReadWriteOnce, ReadOnlyMany або ReadWriteMany, вони не встановлюють жодних обмежень на том. Наприклад, навіть якщо PersistentVolume створено як ReadOnlyMany, це не гарантує, що він буде доступний лише для читання. Якщо режими доступу
вказані як ReadWriteOncePod, том обмежений і може бути підключений лише до одного пода.
{{< /note >}}

> **Важливо!** Том може бути підключений лише одним режимом доступу одночасно, навіть якщо він підтримує кілька.

| Тип тому             | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | залежить від драйвера  | залежить від драйвера | залежить від драйвера | залежить від драйвера |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | залежить від драйвера | -              |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | - (працює, коли Podʼи розташовані разом) | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |

### Class

PV може мати клас, який вказується, встановленням атрибуту `storageClassName` на імʼя [StorageClass](/docs/concepts/storage/storage-classes/). PV певного класу може бути призначений лише до PVC, що запитує цей клас. PV без `storageClassName` не має класу і може бути призначений тільки до PVC, які не запитують жодного конкретного класу.

У минулому для цього використовувався атрибут `volume.beta.kubernetes.io/storage-class` замість `storageClassName`. Ця анотація все ще працює; однак вона повністю застаріє в майбутньому релізі Kubernetes.

### Політика повторного використання {#reclaim-policy}

Поточні політики повторного використання:

* Retain — ручне відновлення
* Recycle — базова очистка (`rm -rf /thevolume/*`)
* Delete — видалити том

В Kubernetes {{< skew currentVersion >}} підтримується повторне використання лише для томів `nfs` та `hostPath`.

### Параметри монтування {#mount-options}

Адміністратор Kubernetes може вказати додаткові параметри монтування для випадку, коли постійний том монтується на вузлі.

{{< note >}}
Не всі типи постійних томів підтримують параметри монтування.
{{< /note >}}

Наступні типи томів підтримують параметри монтування:

* `csi` (включно з деякими типами перенесених томів CSI)
* `iscsi`
* `nfs`

Параметри монтування не перевіряються на валідність. Якщо параметр монтування недійсний, монтування не вдасться.

У минулому для цього використовувалася анотація `volume.beta.kubernetes.io/mount-options` замість атрибуту `mountOptions`. Ця анотація все ще працює; однак вона повністю застаріє в майбутньому релізі Kubernetes.

### Node Affinity

{{< note >}}
Для більшості типів томів вам не потрібно встановлювати це поле. Вам слід явно встановити його для томів [local](/docs/concepts/storage/volumes/#local).
{{< /note >}}

Постійний том може вказувати властивості спорідненості вузла для визначення обмежень, які обмежують доступ до цього тому з визначених вузлів. Podʼи, які використовують PV, будуть заплановані тільки на ті вузли, які вибрані за допомогою спорідненості вузла. Щоб вказати спорідненість вузла, встановіть `nodeAffinity` в `.spec` PV. Деталі поля можна знайти у референсі API [PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec).

#### Оновлення до вузлової спорідненості {#updates-to-node-affinity}

{{< feature-state feature_gate_name="MutablePVNodeAffinity" >}}

Якщо у вашому кластері ввімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/#MutablePVNodeAffinity) `MutablePVNodeAffinity`, поле `.spec.nodeAffinity` PersistentVolume є змінним. Це дозволяє адміністраторам кластера або зовнішньому контролеру сховища оновлювати спорідненість вузлів PersistentVolume під час міграції даних без переривання роботи подів.

Під час оновлення спорідненості вузлів слід переконатися, що нова спорідненість вузлів все ще відповідає вузлам, на яких том наразі використовується. Щодо подів, які порушують нову спорідненість, якщо под вже працює, він може продовжувати працювати. Але Kubernetes не підтримує таку конфігурацію. Слід якнайшвидше припинити роботу подів, які порушують правила. Через кешування в памʼяті подів, створених після оновлення, протягом короткого проміжку часу все ще може плануватися за старою спорідненістю вузлів.

Щоб скористатися цією функцією, слід увімкнути функцію `MutablePVNodeAffinity` на таких компонентах:

- `kube-apiserver`
- `kubelet`

### Фаза {#phase}

PersistentVolume може перебувати в одній з наступних фаз:

`Available`
: вільний ресурс, який ще не призначений запиту

`Bound`
: том призначено запиту

`Released`
: запит було видалено, але повʼязане сховище ще не використане кластером повторно

`Failed`
: том не вдалося вилучити (автоматично)

Ви можете бачити імʼя PVC, призначеного для PV, використовуючи `kubectl describe persistentvolume <імʼя>`.

#### Час переходу фази {#phase-transition-timestamp}

{{< feature-state feature_gate_name="PersistentVolumeLastPhaseTransitionTime" >}}

Поле `.status` для PersistentVolume може включати альфа-поле `lastPhaseTransitionTime`. Це поле фіксує відмітку часу, коли том востаннє перейшов у свою фазу. Для новостворених томів фаза встановлюється як `Pending`, а `lastPhaseTransitionTime` встановлюється на поточний час.

## PersistentVolumeClaims

Кожен PVC містить специфікацію та статус, які визначають вимоги та стан заявок. Імʼя обʼєкта PersistentVolumeClaim повинно бути дійсним [DNS імʼям субдомен](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### Режим доступу {#access-modes-1}

Заявки використовують [ті ж самі конвенції, що й томи](#access-modes), коли вони вимагають зберігання з конкретними режимами доступу.

### Режим тому {#volume-modes}

Заявки використовують [ту ж саму конвенцію, що і томи](#volume-mode), щоб вказати споживання тому як файлової системи чи блокового пристрою.

### Імʼя тому {#volume-name}

Заявки можуть використовувати поле `volumeName`, щоб явно привʼязатись до певного PersistentVolume. Ви також можете залишити `volumeName` невстановленим, вказавши, що ви хочете, щоб Kubernetes налаштував новий PersistentVolume, який відповідає заявці. Якщо вказаний PV вже привʼязаний до іншого PVC, привʼязка залишиться в очікуванні.

### Ресурси {#resources}

Заявки, подібно до Podʼів, можуть вимагати конкретну кількість ресурсів. У цьому випадку запит стосується зберігання. До заявок застосовується та ж [модель ресурсів](https://git.k8s.io/design-proposals-archive/scheduling/resources.md), що й до томів.

{{< note >}}
Для томів `Filesystem` запит до сховища посилається на розмір тома “outer" (тобто розмір, виділений бекендом сховища). Це означає, що розмір, доступний для запису, може бути дещо меншим для провайдерів, які створюють файлову систему поверх блочного пристрою, через накладні витрати на файлову систему. Це особливо помітно у XFS, де багато функцій метаданих стандартно увімкнено.
{{< /note >}}

### Селектор {#selector}

Заявки можуть вказати [селектор міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors), щоб додатково фільтрувати набір томів. До заявки може бути привʼязано лише ті томи, мітки яких відповідають селектору. Селектор може складатися з двох полів:

* `matchLabels` — том повинен містити мітку з таким значенням
* `matchExpressions` — список вимог, які визначаються за допомогою ключа, списку значень та оператора, який повʼязує ключ і значення. Допустимі оператори включають `In`, `NotIn`, `Exists` та `DoesNotExist`.

Всі вимоги як з `matchLabels`, так і з `matchExpressions` обʼєднуються за допомогою ЛОГІЧНОГО «І» — всі вони повинні бути задоволені, щоб мати збіг.

### Class {#class-1}

Заявка може вимагати певний клас, вказавши імʼя [StorageClass](/docs/concepts/storage/storage-classes/) за допомогою атрибута `storageClassName`. Тільки Томи з запитаним класом, тобто ті, у яких `storageClassName` збігається з PVC, можуть бути привʼязані до PVC.

PVC не обоʼязково повинен вимагати клас. PVC зі своїм `storageClassName`, встановленим рівним `""`, завжди інтерпретується як PVC, який вимагає PV без класу, тобто він може бути привʼязаний лише до PV без класу (без анотації або з анотацією, встановленою рівною `""`). PVC без `storageClassName` не зовсім те ж саме і відзначається по-іншому кластером, залежно від того, чи включений [втулок допуску `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass).

* Якщо втулок доступу увімкнено, адміністратор може вказати типовий StorageClass. Усі PVC, у яких немає `storageClassName`, можуть бути привʼязані лише до PV з цим типовим StorageClass. Вказання типового StorageClass виконується, втсановленням анотації `storageclass.kubernetes.io/is-default-class` рівною `true` в обʼєкті StorageClass. Якщо адміністратор не вказав типовий StorageClass, кластер відповідає на створення PVC так, ніби втулок доступу був вимкнений. Якщо вказано більше одного типового StorageClass, для привʼязки PVC використовується остання версія типового StorageClass, коли PVC динамічно виділяється.
* Якщо втулок доступу вимкнено, немає поняття типового StorageClass. Усі PVC, у яких `storageClassName` встановлено рівно `""`, можуть бути привʼязані лише до PV, у яких `storageClassName` також встановлено рівно `""`. Однак PVC з відсутнім `storageClassName` можна буде оновити пізніше, коли стане доступним типовий StorageClass. Якщо PVC оновлюється, він більше не буде привʼязуватися до PV з `storageClassName`, також встановленим рівно `""`.

Дивіться [ретроактивне призначення типового StorageClass](#retroactive-default-storageclass-assignment) для отримання докладнішої інформації.

Залежно від методу встановлення, типовий StorageClass може бути розгорнутий в кластер Kubernetes менеджером надбудов під час встановлення.

Коли PVC вказує `selector`, крім вимоги типового StorageClass, вимоги використовують ЛОГІЧНЕ «І»: лише PV вказаного класу і з вказаними мітками може бути привʼязаний до PVC.

{{< note >}}
На даний момент PVC з непорожнім `selector` не може мати PV, динамічно виділеного для нього.
{{< /note >}}

У минулому анотація `volume.beta.kubernetes.io/storage-class` використовувалася замість атрибута `storageClassName`. Ця анотація все ще працює; однак вона не буде підтримуватися в майбутньому релізі Kubernetes.

#### Ретроактивне призначення типового StorageClass {#retroactive-default-storageclass-assignment}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Ви можете створювати PersistentVolumeClaim без вказівки `storageClassName` для нового PVC, і ви можете це робити навіть тоді, коли в кластері немає типового StorageClass. У цьому випадку новий PVC створюється так, як ви його визначили, і `storageClassName` цього PVC залишається невизначеним, доки не стане доступним типовий StorageClass.

Коли стає доступним типовий StorageClass, панель управління ідентифікує всі наявні PVC без `storageClassName`. Для PVC, у яких або встановлено порожнє значення для `storageClassName`, або цей ключ взагалі відсутній, панель управління оновлює ці PVC, встановлюючи `storageClassName`, щоб відповідати новому типовому StorageClass. Якщо у вас є наявний PVC, у якого `storageClassName` дорівнює `""`, і ви налаштовуєте типовий StorageClass, то цей PVC не буде оновлено.

Щоб продовжувати привʼязувати заявку до PV з `storageClassName`, встановленим у `""` (коли присутній типовий StorageClass), вам потрібно встановити `storageClassName` асоційованого PVC у `""`.

Ця поведінка допомагає адміністраторам змінювати типовий StorageClass, видаляючи спочатку старий, а потім створюючи або встановлюючи інший. Це короткочасне вікно, коли немає типового StorageClass, призводить до того, що PVC без `storageClassName`, створені в цей час, не мають жодного типового значення, але завдяки ретроактивному призначенню типового StorageClass цей спосіб зміни типових значень є безпечним.

## Заявки як томи {#claims-as-volumes}

Podʼи отримують доступ до сховища, використовуючи заявки як томи. Заявки повинні існувати в тому ж просторі імен, що і Pod, який її використовує. Кластер знаходить заявку в просторі імен Podʼа і використовує її для отримання PersistentVolume, який підтримує заявку. Потім том монтується на хост та у Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### Примітка щодо просторів імен {#a-note-on-namespaces}

Привʼязки PersistentVolumes є ексклюзивними, і оскільки PersistentVolumeClaims є обʼєктами з простором імен, монтування заявк з режимами "Many" (`ROX`, `RWX`) можливе лише в межах одного простору імен.

### PersistentVolumes типу `hostPath` {#persistentvolumes-typed-hostpath}

PersistentVolume типу `hostPath` використовує файл або теку на вузлі для емуляції мережевого сховища. Див. [приклад тому типу `hostPath`](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).

## Підтримка блокового тому {#raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Наступні втулки томів підтримують блокові томи, включаючи динамічне надання, де це можливо:

* CSI (включно з деякими типами перенесених томів CSI)
* FC (Fibre Channel)
* iSCSI
* Локальний том

### PersistentVolume, що використовує блоковий том {#persistent-volume-using-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```

### PersistentVolumeClaim, який запитує блоковий том {#persistent-volume-claim-requesting-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

### Специфікація Pod з додаванням шляху блокового пристрою в контейнер {#pod-specification-adding-raw-block-device-path-to-container}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
При додаванні блокового пристрою для Pod ви вказуєте шлях до пристрою в контейнері замість шляху монтування.
{{< /note >}}

### Привʼязка блокових томів {#binding-block-volumes}

Якщо користувач запитує блоковоий том, вказавши це за допомогою поля `volumeMode` у специфікації PersistentVolumeClaim, правила привʼязки трохи відрізняються від попередніх версій, які не враховували цей режим як частину специфікації. У таблиці наведено можливі комбінації, які користувач і адміністратор можуть вказати для запиту блокового пристрою. Таблиця показує, чи буде привʼязаний том чи ні, враховуючи ці комбінації: Матриця привʼязки томів для статично виділених томів:

| PV volumeMode | PVC volumeMode | Результат      |
| --------------|:--------------:| --------------:|
|   не вказано  | не вказано     | ПРИВ'ЯЗАНИЙ    |
|   не вказано  | Block          | НЕ ПРИВ'ЯЗАНИЙ |
|   не вказано  | Filesystem     | ПРИВ'ЯЗАНИЙ    |
|   Block       | не вказано     | НЕ ПРИВ'ЯЗАНИЙ |
|   Block       | Block          | ПРИВ'ЯЗАНИЙ    |
|   Block       | Filesystem     | НЕ ПРИВ'ЯЗАНИЙ |
|   Filesystem  | Filesystem     | ПРИВ'ЯЗАНИЙ    |
|   Filesystem  | Block          | НЕ ПРИВ'ЯЗАНИЙ |
|   Filesystem  | не вказано     | ПРИВ'ЯЗАНИЙ    |

{{< note >}}
Підтримуються лише статично виділені томи для альфа-релізу. Адміністраторам слід бути обережними, враховуючи ці значення при роботі з блоковими пристроями.
{{< /note >}}

## Підтримка знімків томів та відновлення тому зі знімка {#volume-snapshot-and-restore-volume-from-snapshot-support}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Знімки томів підтримують лише зовнішні втулки томів CSI. Докладні відомості див. у [Знімках томів](/docs/concepts/storage/volume-snapshots/). Втулки томів, які входять до складу Kubernetes, є застарілими. Про застарілі
втулки томів можна прочитати в [ЧаПи втулків томів](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### Створення PersistentVolumeClaim із знімка тому {#create-persistent-volume-claim-from-volume-snapshot}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Клонування томів {#volume-cloning}

[Клонування томів](/docs/concepts/storage/volume-pvc-datasource/) доступне лише для втулків томів CSI.

### Створення PersistentVolumeClaim із існуючого PVC {#create-persistent-volume-claim-from-an-existing-pvc}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Наповнювачі томів та джерела даних {#volume-populators-and-data-sources}

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

Kubernetes підтримує користувацькі заповнювачі томів. Для використання користувацьких заповнювачів томів слід увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `AnyVolumeDataSource` для kube-apiserver та kube-controller-manager.

Наповнювачі томів використовують поле специфікації PVC, що називається `dataSourceRef`. На відміну від поля `dataSource`, яке може містити тільки посилання на інший PersistentVolumeClaim або на VolumeSnapshot, поле `dataSourceRef` може містити посилання на будь-який обʼєкт у тому ж просторі імен, за винятком основних обʼєктів, окрім PVC. Для кластерів, які мають увімкнуту цю функціональну можливість, використання `dataSourceRef` бажано перед `dataSource`.

## Джерела даних зі змішаними просторами імен {#cross-namespace-data-sources}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Kubernetes підтримує джерела даних томів зі змішаними просторами імен. Для використання джерел даних томів із змішаними просторами імен слід увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `AnyVolumeDataSource` та `CrossNamespaceVolumeDataSource` для kube-apiserver та kube-controller-manager. Також вам слід увімкнути `CrossNamespaceVolumeDataSource` для csi-provisioner.

Увімкнення `CrossNamespaceVolumeDataSource` дозволяє вам вказати простір імен у полі `dataSourceRef`.

{{< note >}}
Коли ви вказуєте простір імен для джерела даних тому, Kubernetes перевіряє наявність ReferenceGrant у іншому просторі імен перед прийняттям посилання. ReferenceGrant є частиною розширених API `gateway.networking.k8s.io`. Докладні відомості див. в документації API Gateway за посиланням [ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/). Це означає, що вам слід розширити свій кластер Kubernetes принаймні за допомогою ReferenceGrant зі специфікації API Gateway, перш ніж ви зможете використовувати цей механізм.
{{< /note >}}

## Посилання на джерела даних {#data-source-references}

Поле `dataSourceRef` поводиться майже так само, як і поле `dataSource`. Якщо одне задано, а інше — ні, сервер API надасть обом полям одне й те ж значення. Жодне з цих полів не можна змінити після створення, і спроба вказати різні значення для обох полів призведе до помилки валідації. Таким чином, обидва поля завжди матимуть однаковий вміст.

Є дві відмінності між полем `dataSourceRef` і полем `dataSource`, які користувачам слід знати:

* Поле `dataSource` ігнорує неправильні значення (мовби поле було порожнім), тоді як поле `dataSourceRef` ніколи не ігнорує значення і призведе до помилки, якщо використано неправильне значення. Неправильними значеннями є будь-які обʼєкти основних обʼєктів (обʼєкти без apiGroup), окрім PVC.
* Поле `dataSourceRef` може містити обʼєкти різних типів, тоді як поле `dataSource` дозволяє лише PVC та VolumeSnapshot.

Коли увімкнено `CrossNamespaceVolumeDataSource`, є додаткові відмінності:

* Поле `dataSource` дозволяє лише локальні обʼєкти, тоді як поле `dataSourceRef` дозволяє обʼєкти у будь-яких просторах імен.
* Коли вказано простір імен, `dataSource` і `dataSourceRef` не синхронізуються.

Користувачам завжди слід використовувати `dataSourceRef` в кластерах, де увімкнено цю функціональну можлвімть, і використовувати `dataSource` в кластерах, де її вимкнено. В будь-якому випадку необхідно дивитися на обидва поля. Дубльовані значення із трошки різними семантиками існують лише з метою забезпечення сумісності з попередніми версіями. Зокрема, старі й нові контролери можуть взаємодіяти, оскільки поля однакові.

### Використання засобів наповнення томів {#using-volume-populators}

Засоби наповнення томів — це контролери, які можуть створювати томи з не порожнім вмістом, де вміст тому визначається за допомогою Custom Resource. Користувачі створюють наповнений том, посилаючись на Custom Resource із використанням поля `dataSourceRef`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Оскільки засоби наповнення томів — це зовнішні компоненти, спроби створити PVC, який використовує їх, можуть завершитися неуспішно, якщо встановлені не всі потрібні компоненти. Зовнішні контролери повинні генерувати події в PVC для надання зворотного звʼязку щодо стану створення, включаючи попередження, якщо PVC не може бути створено через відсутність певного компонента.

Ви можете встановити альфа-контролер [перевірки джерела даних тому](https://github.com/kubernetes-csi/volume-data-source-validator) у вашому кластері. Цей контролер генерує Події попередження в PVC у випадку, якщо не зареєстровано жодного засобу наповнення для обробки цього виду джерела даних. Коли для PVC встановлюється відповідний засіб наповнення, це відповідальність цього контролера наповнення повідомляти про події, що стосуються створення тому та проблем під час цього процесу.

### Використання джерела даних томів зі змішаними просторами імен {#using-cross-namespace-volume-data-sources}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

Створіть ReferenceGrant, щоб дозволити власнику простору імен приймати посилання. Ви визначаєте наповнений том, вказавши джерело даних тому між просторами імен за допомогою поля `dataSourceRef`. Вам вже повинен бути дійсний ReferenceGrant у вихідному просторі імен:

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-ns1-pvc
  namespace: default
spec:
  from:
  - group: ""
    kind: PersistentVolumeClaim
    namespace: ns1
  to:
  - group: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: ns1
spec:
  storageClassName: example
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSourceRef:
    apiGroup: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
    namespace: default
  volumeMode: Filesystem
```

## Створення переносимої конфігурації {#writing-portable-configuration}

Якщо ви створюєте шаблони конфігурації або приклади, які повинні працювати на широкому спектрі кластерів і вам потрібне постійний сховище, рекомендується використовувати такий підхід:

* Включайте обʼєкти PersistentVolumeClaim у ваш набір конфігурації (нарізі з Deployment, ConfigMap і т. д.).
* Не включайте обєкти PersistentVolume в конфігурацію, оскільки користувач, який створює конфігурацію, може не мати прав на створення PersistentVolumes.
* Дайте користувачеві можливість надавати імʼя класу сховища при створенні шаблону.
  * Якщо користувач вказує імʼя класу сховища, вставте це значення в поле `persistentVolumeClaim.storageClassName`. Це призведе до збігу PVC з відповідним класом сховища, якщо адміністратори увімкнули StorageClass.
  * Якщо користувач не вказує імʼя класу сховища, залиште поле `persistentVolumeClaim.storageClassName` нульовим. Це призведе до автоматичного надання користувачеві PV в кластері. Багато середовищ кластеру мають типовий клас сховища, або адміністратори можуть створити свій типовий StorageClass.
* В інструментах спостерігайте за PVC, які не привʼязуються протягом певного часу та виводьте це користувачеві, оскільки це може вказувати на те, що у кластері відсутня підтримка динамічного сховища (у цьому випадку користувач повинен створити відповідний PV) або у кластері відсутня система сховища (у цьому випадку користувач не може розгортати конфігурацію, що вимагає PVC).

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [створення PersistentVolume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
* Дізнайтеся більше про [створення PersistentVolumeClaim](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* Прочитайте [документ з дизайну постійного сховища](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Довідники API {#reference}

Дізнайтеся більше про описані на цій сторінці API:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
