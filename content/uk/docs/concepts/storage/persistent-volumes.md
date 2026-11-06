---
title: Постійні томи
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
- apiVersion: "v1"
  kind: "PersistentVolumeClaim"
feature:
  title: Оркестрування сховища
  description: >
    Автоматичне монтування системи зберігання на ваш вибір: локального сховища, публічного хмарного провайдера або мережевої системи зберігання, такої як iSCSI чи NFS.
content_type: concept
weight: 20
---

<!-- overview -->

У цьому документі описано _постійні томи_ в Kubernetes. Рекомендується ознайомитися з [томами](/docs/concepts/storage/volumes/), [StorageClasses](/docs/concepts/storage/storage-classes/) та [VolumeAttributesClasses](/docs/concepts/storage/volume-attributes-classes/).

<!-- body -->

## Вступ {#introduction}

Керування сховищем — це окреме завдання, відмінне від керування обчислювальними екземплярами. Підсистема PersistentVolume надає користувачам та адміністраторам API, який абстрагує деталі того, як сховище надається, від того, як воно споживається. Для цього ми запроваджуємо два нові ресурси API: PersistentVolume і PersistentVolumeClaim.

_PersistentVolume_ (PV) — це частина сховища в кластері, надана адміністратором або динамічно за допомогою [класів сховищ](/docs/concepts/storage/storage-classes/). Це ресурс у кластері, так само як вузол є ресурсом кластера. PV — це втулки томів, як і Volumes, але їхній життєвий цикл не залежить від будь-якого окремого Podʼа, який використовує PV. Цей обʼєкт API містить деталі реалізації сховища, чи то NFS, iSCSI, чи специфічна для хмарного провайдера система зберігання.

_PersistentVolumeClaim_ (PVC) — це запит користувача на сховище. Він схожий на Pod. Podʼи споживають ресурси вузла, а PVC споживають ресурси PV. Podʼи можуть запитувати певні обсяги ресурсів (CPU та памʼять). PVC можуть запитувати певний розмір і режими доступу (наприклад, їх можна монтувати як ReadWriteOnce, ReadOnlyMany, ReadWriteMany або ReadWriteOncePod, дивіться [AccessModes](#access-modes)).

Хоча PersistentVolumeClaims дозволяють користувачам споживати абстрактні ресурси сховища, для різних завдань користувачам часто потрібні PersistentVolumes із різними властивостями, наприклад, продуктивністю. Адміністратори кластера мають бути здатні пропонувати різноманітні PersistentVolumes, які відрізняються не лише розміром і режимами доступу, не розкриваючи користувачам деталей реалізації цих томів. Для цих потреб існує ресурс _StorageClass_.

Дивіться [докладний покроковий опис із робочими прикладами](/docs/tutorials/configuration/configure-persistent-volume-storage).

## Життєвий цикл тому та PVC {#lifecycle-of-a-volume-and-claim}

PV — це ресурси в кластері. PVC — це запити на ці ресурси, які також діють як квитанції на ресурс. Взаємодія між PV та PVC відбувається за таким життєвим циклом:

### Надання {#provisioning}

Існує два способи надання PV: статично або динамічно.

#### Статичне {#static}

Адміністратор кластера створює певну кількість PV. Вони містять відомості про реальне сховище, доступне для використання користувачами кластера. Вони існують в API Kubernetes і доступні для споживання.

#### Динамічне {#dynamic}

Коли жоден зі статичних PV, створених адміністратором, не відповідає PersistentVolumeClaim користувача, кластер може спробувати динамічно надати том спеціально для цього PVC. Це надання ґрунтується на StorageClasses: PVC має запитати [клас сховища](/docs/concepts/storage/storage-classes/), а адміністратор має створити й налаштувати цей клас, щоб динамічне надання могло відбутися. PVC, які запитують клас `""`, фактично вимикають для себе динамічне надання.

Щоб увімкнути динамічне надання сховища на основі класу сховища, адміністратор кластера має ввімкнути `DefaultStorageClass` [контролер допуску](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) на API-сервері. Це можна зробити, наприклад, переконавшись, що `DefaultStorageClass` є серед значень упорядкованого списку, розділеного комами, у прапорці `--enable-admission-plugins` компонента API-сервера. Докладніше про прапорці командного рядка API-сервера дивіться в документації [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

### Привʼязка {#binding}

Користувач створює або, у разі динамічного надання, уже створив PersistentVolumeClaim із певним запитаним обсягом сховища та певними режимами доступу. Цикл управління в панелі управління стежить за новими PVC, знаходить відповідний PV (якщо це можливо) і привʼязує їх один до одного. Якщо PV було динамічно надано для нового PVC, цикл завжди привʼязуватиме цей PV до PVC. Інакше користувач завжди отримає принаймні те, що запитував, але том може перевищувати запитаний обсяг. Після привʼязки PersistentVolumeClaim є ексклюзивними, незалежно від того, як їх було привʼязано. Привʼязка PVC до PV — це зіставлення один до одного за допомогою ClaimRef, який є двоспрямованою привʼязкою між PersistentVolume і PersistentVolumeClaim.

PVC залишатимуться непривʼязаними необмежено довго, якщо відповідного тому не існує. PVC будуть привʼязані, коли відповідні томи стануть доступними. Наприклад, кластер, забезпечений багатьма PV розміром 50Gi, не відповідатиме PVC, який запитує 100Gi. PVC можна буде привʼязати, коли до кластера буде додано PV розміром 100Gi.

### Використання {#using}

Podʼи використовують PVC як томи. Кластер перевіряє PVC, щоб знайти привʼязаний том, і монтує цей том для Podʼа. Для томів, які підтримують кілька режимів доступу, користувач вказує бажаний режим, коли використовує свій PVC як том у Podʼі.

Щойно користувач має PVC і цей PVC привʼязано, привʼязаний PV належить користувачеві стільки, скільки потрібно. Користувачі планують Podʼи та отримують доступ до своїх PV, додаючи розділ `persistentVolumeClaim` у блок `volumes` Podʼа. Докладніше дивіться в розділі [PVC як томи](#claims-as-volumes).

### Захист обʼєктів сховища, що використовуються {#storage-object-in-use-protection}

Мета можливості захисту обʼєктів сховища, що використовуються, — гарантувати, що PersistentVolumeClaims (PVC), які активно використовуються Podʼом, і PersistentVolume (PV), привʼязані до PVC, не вилучаються із системи, оскільки це може призвести до втрати даних.

{{< note >}}
PVC активно використовується Podʼом, коли існує обʼєкт Pod, який використовує PVC.
{{< /note >}}

Якщо користувач видаляє PVC, який активно використовується Podʼом, PVC вилучається не одразу. Вилучення PVC відкладається, доки PVC більше не використовуватиметься активно жодним Podʼом. Так само, якщо адміністратор видаляє PV, привʼязаний до PVC, PV вилучається не одразу. Вилучення PV відкладається, доки PV більше не буде привʼязаний до PVC.

Ви можете побачити, що PVC захищено, коли статус PVC — `Terminating`, а список `Finalizers` містить `kubernetes.io/pvc-protection`:

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

Ви можете побачити, що PV захищено, коли статус PV — `Terminating`, а список `Finalizers` також містить `kubernetes.io/pv-protection`:

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

Коли користувач закінчує роботу зі своїм томом, він може видалити обʼєкти PVC з API, що дозволяє повторно використати ресурс. Політика повторного використання PersistentVolume вказує кластеру, що робити з томом після того, як його звільнено від PVC. Наразі томи можна зберегти (Retain), переробити (Recycle) або видалити (Delete).

#### Retain

Політика повторного використання `Retain` дозволяє повторно використати ресурс вручну. Коли PersistentVolumeClaim видаляють, PersistentVolume все ще існує, і том вважається «звільненим». Але він ще не доступний для іншого PVC, оскільки на томі залишаються дані попереднього власника PVC. Адміністратор може вручну повторно використати том, виконавши такі кроки.

1. Видаліть PersistentVolume. Повʼязаний ресурс сховища в зовнішній інфраструктурі все ще існує після видалення PV.
1. Вручну очистіть дані на повʼязаному ресурсі сховища.
1. Вручну видаліть повʼязаний ресурс сховища.

Якщо ви хочете повторно використати той самий ресурс сховища, створіть новий PersistentVolume із таким самим визначенням ресурсу сховища.

#### Delete

Для втулків томів, які підтримують політику повторного використання `Delete`, видалення вилучає і обʼєкт PersistentVolume з Kubernetes, і повʼязаний ресурс сховища в зовнішній інфраструктурі. Томи, надані динамічно, успадковують [політику повторного використання свого StorageClass](#reclaim-policy), стандартним значенням якої є `Delete`. Адміністратор має налаштувати StorageClass відповідно до очікувань користувачів; інакше PV потрібно відредагувати або змінити за допомогою patch після створення. Дивіться [Зміна політики повторного використання PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### Recycle

{{< warning >}}
Політика повторного використання `Recycle` застаріла. Натомість рекомендовано використовувати динамічне надання.
{{< /warning >}}

Якщо це підтримує базовий втулок томів, політика повторного використання `Recycle` виконує базове очищення (`rm -rf /thevolume/*`) тому й знову робить його доступним для нового PVC.

Однак адміністратор може налаштувати власний шаблон Podʼа recycler за допомогою аргументів командного рядка менеджера контролерів Kubernetes, як описано в [довіднику](/docs/reference/command-line-tools-reference/kube-controller-manager/). Власний шаблон Podʼа recycler має містити специфікацію `volumes`, як показано в наведеному нижче прикладі:

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

Однак конкретний шлях, вказаний у частині `volumes` власного шаблону Podʼа recycler, замінюється конкретним шляхом тому, що переробляється.

### Завершувач захисту від видалення PersistentVolume {#persistentvolume-deletion-protection-finalizer}

{{< feature-state feature_gate_name="HonorPVReclaimPolicy" >}}

До PersistentVolume можна додавати завершувачі, щоб PersistentVolumes із політикою повторного використання `Delete` видалялися лише після видалення базового сховища.

Завершувач `external-provisioner.volume.kubernetes.io/finalizer` (запроваджений у v1.31) додається як до динамічно, так і до статично наданих томів CSI.

Завершувач `kubernetes.io/pv-controller` (запроваджений у v1.31) додається до динамічно наданих томів вбудованих втулків і пропускається для статично наданих томів вбудованих втулків.

Ось приклад динамічно наданого тому вбудованого втулка:

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

Завершувач `external-provisioner.volume.kubernetes.io/finalizer` додається для томів CSI. Ось приклад:

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

Коли для конкретного вбудованого втулка томів увімкнено прапорець можливості `CSIMigration{provider}`, завершувач `kubernetes.io/pv-controller` замінюється завершувачем `external-provisioner.volume.kubernetes.io/finalizer`.

Завершувачі гарантують, що обʼєкт PV вилучається лише після видалення тому з бекенду сховища, якщо політика повторного використання PV — `Delete`. Це також гарантує, що том буде видалено з бекенду сховища незалежно від порядку видалення PV і PVC.

### Резервування PersistentVolume {#reserving-a-persistentvolume}

Панель управління може [привʼязувати PersistentVolumeClaims до відповідних PersistentVolumes](#binding) у кластері. Однак, якщо ви хочете, щоб PVC привʼязався до певного PV, потрібно попередньо їх привʼязати.

Вказавши PersistentVolume у PersistentVolumeClaim, ви оголошуєте привʼязку між цими конкретними PV та PVC. Якщо PersistentVolume існує і не зарезервував PersistentVolumeClaims через своє поле `claimRef`, PersistentVolume і PersistentVolumeClaim буде привʼязано.

Привʼязка відбувається незалежно від деяких критеріїв зіставлення томів, зокрема спорідненості вузла. Панель управління все ще перевіряє, що [клас сховища](/docs/concepts/storage/storage-classes/), режими доступу та запитаний розмір сховища є дійсними.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # Порожній рядок потрібно вказати явно, інакше буде встановлено стандартний StorageClass
  volumeName: foo-pv
  ...
```

Цей метод не гарантує жодних привілеїв привʼязки для PersistentVolume. Якщо інші PersistentVolumeClaims можуть використовувати вказаний вами PV, спочатку потрібно зарезервувати цей том сховища. Вкажіть відповідний PersistentVolumeClaim у полі `claimRef` PV, щоб інші PVC не могли до нього привʼязатися.

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

Це корисно, якщо ви хочете використовувати PersistentVolumes, у яких `persistentVolumeReclaimPolicy` має значення `Retain`, зокрема у випадках, коли ви повторно використовуєте наявний PV.

### Розширення PersistentVolumeClaims {#expanding-persistent-volumes-claims}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Підтримку розширення PersistentVolumeClaims (PVC) стандартно ввімкнено. Ви можете розширювати такі типи томів:

* {{< glossary_tooltip text="csi" term_id="csi" >}} (зокрема деякі типи томів, перенесені на CSI)
* flexVolume (застаріло)
* portworxVolume (застаріло)

Ви можете розширити PVC, лише якщо поле `allowVolumeExpansion` його класу сховища має значення true.

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

Щоб запросити більший том для PVC, відредагуйте обʼєкт PVC і вкажіть більший розмір. Це запускає розширення тому, що стоїть за базовим PersistentVolume. Новий PersistentVolume для задоволення PVC ніколи не створюється. Натомість змінюється розмір наявного тому.

{{< warning >}}
Пряме редагування розміру PersistentVolume може завадити автоматичній зміні розміру цього тому. Якщо ви редагуєте місткість PersistentVolume, а потім редагуєте `.spec` відповідного PersistentVolumeClaim, щоб розмір PersistentVolumeClaim збігався з PersistentVolume, зміна розміру сховища не відбудеться. Панель управління Kubernetes побачить, що бажаний стан обох ресурсів збігається, і зробить висновок, що розмір базового тому було збільшено вручну й зміна розміру не потрібна.
{{< /warning >}}

#### Розширення томів CSI {#csi-volume-expansion}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Підтримку розширення томів CSI стандартно ввімкнено, але вона також вимагає, щоб конкретний драйвер CSI підтримував розширення томів. Докладніше дивіться в документації конкретного драйвера CSI.

#### Зміна розміру тому, що містить файлову систему {#resizing-a-volume-containing-a-file-system}

Ви можете змінювати розмір томів, що містять файлову систему, лише якщо це XFS, Ext3 або Ext4.

Коли том містить файлову систему, її розмір змінюється лише тоді, коли новий Pod використовує PersistentVolumeClaim у режимі `ReadWrite`. Розширення файлової системи виконується або під час запуску Podʼа, або коли Pod працює і базова файлова система підтримує онлайн-розширення.

FlexVolumes (застаріли з Kubernetes v1.23) дозволяють змінювати розмір, якщо драйвер налаштовано з можливістю `RequiresFSResize`, встановленою в `true`. Розмір FlexVolume можна змінити під час перезапуску Podʼа.

#### Зміна розміру PersistentVolumeClaim, що використовується {#resizing-an-in-use-persistentvolumeclaim}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

У цьому випадку вам не потрібно видаляти й повторно створювати Pod або Deployment, який використовує наявний PVC. Будь-який PVC, що використовується, автоматично стає доступним для свого Podʼа, щойно його файлову систему буде розширено. Ця можливість не впливає на PVC, які не використовуються Podʼом або Deployment. Ви повинні створити Pod, який використовує PVC, щоб розширення могло завершитися.

Як і інші типи томів, томи FlexVolume також можна розширювати, коли їх використовує Pod.

{{< note >}}
Змінити розмір FlexVolume можна лише тоді, коли це підтримує базовий драйвер.
{{< /note >}}

#### Відновлення після збою під час розширення томів {#recovering-from-failure-when-expanding-volumes}

Якщо користувач вказує новий розмір, надто великий для базової системи зберігання, розширення PVC повторюватиметься постійно, доки користувач або адміністратор кластера не вживе заходів. Це може бути небажаним, тому Kubernetes надає такі методи відновлення після таких збоїв.

{{< tabs name="recovery_methods" >}}
{{% tab name="Вручну з доступом адміністратора кластера" %}}

Якщо розширення базового сховища не вдається, адміністратор кластера може вручну відновити стан PersistentVolumeClaim (PVC) і скасувати запити на зміну розміру. Інакше контролер постійно повторюватиме запити на зміну розміру без втручання адміністратора.

1. Позначте PersistentVolume (PV), привʼязаний до PersistentVolumeClaim (PVC), політикою повторного використання `Retain`.
2. Видаліть PVC. Оскільки PV має політику повторного використання `Retain`, ми не втратимо жодних даних під час повторного створення PVC.
3. Видаліть запис `claimRef` зі специфікації PV, щоб новий PVC міг до нього привʼязатися. Це має зробити PV `Available`.
4. Створіть PVC заново з меншим розміром, ніж у PV, і встановіть у поле `volumeName` PVC назву PV. Це має привʼязати новий PVC до наявного PV.
5. Не забудьте відновити політику повторного використання PV.

{{% /tab %}}
{{% tab name="Запитом на розширення до меншого розміру" %}}

Якщо розширення PVC не вдалося, ви можете повторити його з меншим розміром, ніж запитане раніше значення. Щоб запросити нову спробу розширення з меншим запропонованим розміром, відредагуйте `.spec.resources` цього PVC і виберіть значення, менше за попереднє. Це корисно, якщо розширення до більшого значення не вдалося через обмеження місткості. Якщо це сталося або ви підозрюєте, що могло статися, ви можете повторити розширення, вказавши розмір у межах місткості базового провайдера сховища. Ви можете стежити за статусом операції зміни розміру через `.status.allocatedResourceStatuses` та Events на PVC.

Зверніть увагу, що, хоча ви можете вказати менший обсяг сховища, ніж запитували раніше, нове значення все одно має бути більшим за `.status.capacity`. Kubernetes не підтримує зменшення PVC до розміру, меншого за поточний.
{{% /tab %}}
{{% /tabs %}}

## Типи постійних томів {#types-of-persistent-volumes}

Типи PersistentVolume реалізовано як втулки. Наразі Kubernetes підтримує такі втулки:

* [`csi`](/docs/concepts/storage/volumes/#csi) — Container Storage Interface (CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) — Сховище Fibre Channel (FC)
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) — том HostPath (лише для тестування на одному вузлі; НЕ ПРАЦЮВАТИМЕ в кластері з кількома вузлами; натомість розгляньте використання тому `local`)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) — Сховище iSCSI (SCSI через IP)
* [`local`](/docs/concepts/storage/volumes/#local) — локальні пристрої зберігання, змонтовані на вузлах.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) — сховище Network File System (NFS)

Такі типи PersistentVolume застаріли, але все ще доступні. Якщо ви використовуєте ці типи томів, крім `flexVolume`, `cephfs` та `rbd`, встановіть відповідні драйвери CSI.

* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) — AWS Elastic Block Store (EBS) (**міграцію стандартно ввімкнено** починаючи з v1.23)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) — Azure Disk (**міграцію стандартно ввімкнено** починаючи з v1.23)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) — Azure File (**міграцію стандартно ввімкнено** починаючи з v1.24)
* [`cinder`](/docs/concepts/storage/volumes/#cinder) — Cinder (блочне сховище OpenStack) (**міграцію стандартно ввімкнено** починаючи з v1.21)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) — FlexVolume (**застаріло** починаючи з версії v1.23, план міграції відсутній, планів припинення підтримки немає)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcePersistentDisk) — GCE Persistent Disk (**міграцію стандартно ввімкнено** починаючи з v1.23)
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) — Том Portworx (**міграцію стандартно ввімкнено** починаючи з v1.31)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) — том vSphere VMDK (**міграцію стандартно ввімкнено** починаючи з v1.25)

Старіші версії Kubernetes також підтримували такі типи вбудованих PersistentVolume:

* [`cephfs`](/docs/concepts/storage/volumes/#cephfs) (**недоступно** починаючи з версії v1.31)
* `flocker` — Flocker storage. (**недоступно** починаючи з версії v1.25)
* `glusterfs` — GlusterFS storage. (**недоступно** починаючи з версії v1.26)
* `photonPersistentDisk` — Photon controller persistent disk. (**недоступно** починаючи з версії v1.15)
* `quobyte` — Том Quobyte. (**недоступно** починаючи з версії v1.25)
* [`rbd`](/docs/concepts/storage/volumes/#rbd) — Rados Block Device (RBD) volume (**недоступно** починаючи з версії v1.31)
* `scaleIO` — Том ScaleIO. (**недоступно** починаючи з версії v1.21)
* `storageos` — Том StorageOS. (**недоступно** починаючи з версії v1.25)

## Постійні томи {#persistent-volumes}

Кожен PV містить spec і status, тобто специфікацію та статус тому. Назва обʼєкта PersistentVolume має бути дійсним [іменем DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

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
Для використання PersistentVolume у кластері можуть знадобитися допоміжні програми, повʼязані з типом тому. У цьому прикладі PersistentVolume має тип NFS, і для підтримки монтування файлових систем NFS потрібна допоміжна програма /sbin/mount.nfs.
{{< /note >}}

### Місткість {#capacity}

Зазвичай PV має певну місткість сховища. Вона задається атрибутом `capacity` PV, який є значенням {{< glossary_tooltip term_id="quantity" text="Quantity" >}}.

Наразі розмір сховища — єдиний ресурс, який можна встановити або запитати. Майбутні атрибути можуть включати IOPS, пропускну здатність тощо.

### Режим тому {#volume-mode}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Kubernetes підтримує два значення `volumeModes` для PersistentVolumes: `Filesystem` та `Block`.

`volumeMode` є необовʼязковим параметром API. `Filesystem` — стандартний режим, який використовується, коли параметр `volumeMode` пропущено.

Том із `volumeMode: Filesystem` *монтується* в Podʼи в теку. Якщо том підкріплений блоковим пристроєм і пристрій порожній, Kubernetes створює на ньому файлову систему перед першим монтуванням.

Ви можете встановити `volumeMode` у `Block`, щоб використовувати том як необроблений блоковий пристрій. Такий том подається в Pod як блоковий пристрій без файлової системи. Цей режим корисний, щоб надати Podʼу найшвидший можливий доступ до тому без будь-якого шару файлової системи між Podʼом і томом. З іншого боку, застосунок, що працює в Podʼі, має знати, як працювати з необробленим блоковим пристроєм. Приклад використання тому з `volumeMode: Block` у Podʼі дивіться в розділі [Підтримка необроблених блокових томів](#raw-block-volume-support).

### Режими доступу {#access-modes}

PersistentVolume можна змонтувати на хості будь-яким способом, який підтримує провайдер ресурсу. Як показано в таблиці нижче, провайдери мають різні можливості, а режими доступу кожного PV встановлюються відповідно до режимів, які підтримує цей конкретний том. Наприклад, NFS може підтримувати кількох клієнтів для читання й запису, але конкретний PV NFS може бути експортований на сервері лише для читання. Кожен PV отримує власний набір режимів доступу, що описує можливості саме цього PV.

Режими доступу такі:

`ReadWriteOnce`
: том можна змонтувати для читання й запису на одному вузлі. Режим доступу ReadWriteOnce все ще може дозволяти кільком Podʼам доступ до цього тому (читання з нього або запис у нього), якщо ці Podʼи працюють на одному вузлі. Про доступ для одного Podʼа дивіться ReadWriteOncePod.

`ReadOnlyMany`
: том можна змонтувати лише для читання на багатьох вузлах.

`ReadWriteMany`
: том можна змонтувати для читання й запису на багатьох вузлах.

`ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  том можна змонтувати для читання й запису одним Podʼом. Використовуйте режим доступу ReadWriteOncePod, якщо хочете гарантувати, що лише один Pod у всьому кластері може читати цей PVC або записувати в нього.

{{< note >}}
Режим доступу `ReadWriteOncePod` підтримується лише для томів {{< glossary_tooltip text="CSI" term_id="csi" >}} і Kubernetes версії 1.22+. Щоб використовувати цю можливість, вам потрібно оновити такі [sidecar-контейнери CSI](https://kubernetes-csi.github.io/docs/sidecar-containers.html) до цих або новіших версій:

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
Kubernetes використовує режими доступу до томів для зіставлення PersistentVolumeClaims і PersistentVolumes. У деяких випадках режими доступу до томів також обмежують, де можна змонтувати PersistentVolume. Режими доступу до томів **не** забезпечують захист від запису після монтування сховища. Навіть якщо вказано режими доступу ReadWriteOnce, ReadOnlyMany або ReadWriteMany, вони не встановлюють жодних обмежень на том. Наприклад, навіть якщо PersistentVolume створено як ReadOnlyMany, це не гарантує, що він буде доступний лише для читання. Якщо вказано режим доступу ReadWriteOncePod, том обмежений і може бути змонтований лише одним Podʼом.
{{< /note >}}

> **Важливо!** Том можна монтувати одночасно лише в одному режимі доступу, навіть якщо він підтримує кілька.

| Втулок томів         | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
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

### Клас {#class}

PV може мати клас, який задається встановленням атрибута `storageClassName` на назву [StorageClass](/docs/concepts/storage/storage-classes/). PV певного класу можна привʼязати лише до PVC, які запитують цей клас. PV без `storageClassName` не має класу, і його можна привʼязати лише до PVC, які не запитують жодного конкретного класу.

У минулому замість атрибута `storageClassName` використовувалася анотація `volume.beta.kubernetes.io/storage-class`. Ця анотація все ще працює; однак у майбутньому випуску Kubernetes вона стане повністю застарілою.

### Політика повторного використання {#reclaim-policy}

Поточні політики повторного використання:

* Retain — ручне повторне використання
* Recycle — базове очищення (`rm -rf /thevolume/*`)
* Delete — видалити том

У Kubernetes {{< skew currentVersion >}} переробку підтримують лише типи томів `nfs` та `hostPath`.

### Параметри монтування {#mount-options}

Адміністратор Kubernetes може вказати додаткові параметри монтування для випадку, коли постійний том монтується на вузлі.

{{< note >}}
Не всі типи постійних томів підтримують параметри монтування.
{{< /note >}}

Такі типи томів підтримують параметри монтування:

* `csi` (зокрема типи томів, перенесені на CSI)
* `iscsi`
* `nfs`

Параметри монтування не перевіряються. Якщо параметр монтування недійсний, монтування завершиться невдачею.

У минулому замість атрибута `mountOptions` використовувалася анотація `volume.beta.kubernetes.io/mount-options`. Ця анотація все ще працює; однак у майбутньому випуску Kubernetes вона стане повністю застарілою.

### Спорідненість вузла {#node-affinity}

{{< note >}}
Для більшості типів томів вам не потрібно встановлювати це поле. Вам слід явно встановити його для томів [local](/docs/concepts/storage/volumes/#local).
{{< /note >}}

PV може вказувати спорідненість вузла, щоб визначити обмеження, з яких вузлів можна отримати доступ до цього тому. Podʼи, які використовують PV, плануватимуться лише на вузли, вибрані спорідненістю вузла. Щоб вказати спорідненість вузла, встановіть `nodeAffinity` у `.spec` PV. Докладніше про це поле дивіться в довіднику API [PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec).

#### Оновлення спорідненості вузла {#updates-to-node-affinity}

{{< feature-state feature_gate_name="MutablePVNodeAffinity" >}}

Якщо у вашому кластері ввімкнено функціональну можливість [`MutablePVNodeAffinity`](/docs/reference/command-line-tools-reference/feature-gates/#MutablePVNodeAffinity), поле `.spec.nodeAffinity` PersistentVolume можна змінювати. Це дозволяє адміністраторам кластера або зовнішньому контролеру сховища оновлювати спорідненість вузла PersistentVolume під час міграції даних, не перериваючи роботу запущених Podʼів.

Під час оновлення спорідненості вузла переконайтеся, що нова спорідненість вузла все ще відповідає вузлам, на яких том наразі використовується. Podʼи, що порушують нову спорідненість, якщо вони вже працюють, можуть продовжувати працювати. Але Kubernetes не підтримує таку конфігурацію. Слід якнайшвидше завершити Podʼи, що її порушують. Через кешування в памʼяті Podʼи, створені після оновлення, протягом короткого часу все ще можуть плануватися за старою спорідненістю вузла.

Щоб скористатися цією можливістю, увімкніть функціональну можливість `MutablePVNodeAffinity` у таких компонентах:

- `kube-apiserver`
- `kubelet`

### Фаза {#phase}

PersistentVolume перебуватиме в одній із таких фаз:

`Available`
: вільний ресурс, ще не привʼязаний до PVC

`Bound`
: том привʼязано до PVC

`Released`
: PVC видалено, але кластер ще не повторно використав повʼязаний ресурс сховища

`Failed`
: автоматичне повторне використання тому завершилося збоєм

Ви можете побачити назву PVC, привʼязаного до PV, за допомогою `kubectl describe persistentvolume <name>`.

#### Час переходу фази {#phase-transition-timestamp}

{{< feature-state feature_gate_name="PersistentVolumeLastPhaseTransitionTime" >}}

Поле `.status` PersistentVolume може містити альфа-поле `lastPhaseTransitionTime`. Це поле фіксує час останнього переходу тому між фазами. Для новостворених томів фаза встановлюється в `Pending`, а `lastPhaseTransitionTime` — на поточний час.

## PersistentVolumeClaims

Кожен PVC містить spec і status, тобто специфікацію та статус PVC. Назва обʼєкта PersistentVolumeClaim має бути дійсним [іменем DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

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

### Режими доступу {#access-modes-1}

PVC використовують [ті самі домовленості, що й томи](#access-modes), запитуючи сховище з певними режимами доступу.

### Режими томів {#volume-modes}

PVC використовують [ту саму домовленість, що й томи](#volume-mode), щоб вказати споживання тому як файлової системи або блокового пристрою.

### Назва тому {#volume-name}

PVC можуть використовувати поле `volumeName`, щоб явно привʼязатися до певного PersistentVolume. Ви також можете залишити `volumeName` невстановленим, вказавши, що хочете, щоб Kubernetes налаштував новий PersistentVolume, який відповідає PVC. Якщо вказаний PV уже привʼязаний до іншого PVC, привʼязка застрягне в стані очікування.

### Ресурси {#resources}

PVC, як і Podʼи, можуть запитувати певні кількості ресурсу. У цьому випадку запит стосується сховища. До томів і PVC застосовується та сама [модель ресурсів](https://git.k8s.io/design-proposals-archive/scheduling/resources.md).

{{< note >}}
Для томів `Filesystem` запит сховища стосується «зовнішнього» розміру тому (тобто розміру, виділеного бекендом сховища). Це означає, що розмір, доступний для запису, може бути дещо меншим у провайдерів, які будують файлову систему поверх блокового пристрою, через накладні витрати файлової системи. Це особливо помітно з XFS, де стандартно ввімкнено багато можливостей метаданих.
{{< /note >}}

### Селектор {#selector}

PVC можуть вказати [селектор міток](/docs/concepts/overview/working-with-objects/labels/#label-selectors), щоб додатково відфільтрувати набір томів. До PVC можна привʼязати лише томи, мітки яких відповідають селектору. Селектор може складатися з двох полів:

* `matchLabels` — том повинен мати мітку з таким значенням
* `matchExpressions` — список вимог, які визначаються за допомогою ключа, списку значень та оператора, який повʼязує ключ і значення. Допустимі оператори включають `In`, `NotIn`, `Exists` та `DoesNotExist`.

Усі вимоги з `matchLabels` і `matchExpressions` обʼєднуються логічним «І» — для збігу всі вони мають бути виконані.

### Клас {#class-1}

PVC може запитати певний клас, вказавши назву [StorageClass](/docs/concepts/storage/storage-classes/) в атрибуті `storageClassName`. До PVC можна привʼязати лише PV запитаного класу, тобто ті, що мають такий самий `storageClassName`, як і PVC.

PVC не обовʼязково мають запитувати клас. PVC зі `storageClassName`, встановленим у `""`, завжди інтерпретується як такий, що запитує PV без класу, тому його можна привʼязати лише до PV без класу (без анотації або з анотацією, встановленою в `""`). PVC без `storageClassName` — це не зовсім те саме, і кластер обробляє його по-різному залежно від того, чи ввімкнено [втулок допуску `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass).

* Якщо втулок допуску ввімкнено, адміністратор може вказати стандартний StorageClass. Усі PVC без `storageClassName` можна привʼязати лише до PV цього стандартного класу. Стандартний StorageClass задається встановленням анотації `storageclass.kubernetes.io/is-default-class` у `true` в обʼєкті StorageClass. Якщо адміністратор не вказав стандартний клас, кластер реагує на створення PVC так, ніби втулок допуску вимкнено. Якщо вказано кілька стандартних StorageClass, під час динамічного надання PVC використовується найновіший.
* Якщо втулок допуску вимкнено, поняття стандартного StorageClass немає. Усі PVC зі `storageClassName`, встановленим у `""`, можна привʼязати лише до PV, у яких `storageClassName` також встановлено в `""`. Однак PVC без `storageClassName` можна оновити пізніше, коли стандартний StorageClass стане доступним. Якщо PVC оновлено, він більше не привʼязуватиметься до PV, у яких `storageClassName` також встановлено в `""`.

Докладніше дивіться в розділі [ретроактивне призначення стандартного StorageClass](#retroactive-default-storageclass-assignment).

Залежно від способу встановлення, менеджер надбудов може розгорнути стандартний StorageClass у кластері Kubernetes під час встановлення.

Коли PVC вказує `selector` на додаток до запиту StorageClass, вимоги обʼєднуються логічним «І»: до PVC можна привʼязати лише PV запитаного класу із запитаними мітками.

{{< note >}}
Наразі для PVC з непорожнім `selector` не можна динамічно надати PV.
{{< /note >}}

У минулому замість атрибута `storageClassName` використовувалася анотація `volume.beta.kubernetes.io/storage-class`. Ця анотація все ще працює; однак у майбутньому випуску Kubernetes вона більше не підтримуватиметься.

#### Ретроактивне призначення стандартного StorageClass {#retroactive-default-storageclass-assignment}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Ви можете створити PersistentVolumeClaim, не вказуючи `storageClassName` для нового PVC, навіть якщо у вашому кластері немає стандартного StorageClass. У цьому випадку новий PVC створюється так, як ви його визначили, а `storageClassName` цього PVC залишається невстановленим, доки не стане доступним стандартний клас.

Коли стандартний StorageClass стає доступним, панель управління визначає всі наявні PVC без `storageClassName`. Для PVC, які мають порожнє значення `storageClassName` або не мають цього ключа, панель управління оновлює `storageClassName` відповідно до нового стандартного StorageClass. Якщо у вас є наявний PVC, де `storageClassName` має значення `""`, і ви налаштовуєте стандартний StorageClass, цей PVC не буде оновлено.

Щоб і надалі привʼязуватися до PV із `storageClassName`, встановленим у `""` (за наявності стандартного StorageClass), вам потрібно встановити `storageClassName` повʼязаного PVC у `""`.

Така поведінка допомагає адміністраторам змінювати стандартний StorageClass: спочатку вилучити старий, а потім створити або встановити інший. Через це коротке вікно без стандартного класу PVC без `storageClassName`, створені в цей час, не матимуть стандартного класу, але завдяки ретроактивному призначенню стандартного StorageClass такий спосіб зміни стандартних значень безпечний.

### Відстеження невикористаних PVC {#unused-pvc-tracking}

{{< feature-state feature_gate_name="PersistentVolumeClaimUnusedSinceTime" >}}

Коли цю можливість увімкнено, контролер захисту PVC додає до кожного PersistentVolumeClaim [стан](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) `Unused`, щоб показати, чи посилається на нього зараз якийсь нетермінальний Pod.

Цей стан має два значення:

`Unused` зі статусом `"True"` (причина `NoPodsUsingPVC`)
: Жоден нетермінальний Pod не посилається на цей PVC. `lastTransitionTime` фіксує час, коли PVC перестав використовуватися.

`Unused` зі статусом `"False"` (причина `PodUsingPVC`)
: Принаймні один нетермінальний Pod наразі посилається на цей PVC. `lastTransitionTime` фіксує час, коли PVC почав використовуватися.

Pod вважається нетермінальним, якщо його фаза не `Succeeded` і не `Failed`. Це означає, що Pod в очікуванні (навіть ще не запланований) вважається таким, що використовує PVC.

`lastTransitionTime` стану `Unused` можуть використовувати адміністратори кластера, інструменти моніторингу та зовнішні контролери, щоб визначати PVC, які не використовуються тривалий час. Наприклад, щоб знайти всі PVC, які не використовуються понад 30 днів, можна вибрати PVC, у яких стан `Unused` має `status: "True"`, а `lastTransitionTime` старший за 30 днів.

{{< note >}}
Тривалість невикористання, показана цим станом, може бути коротшою за фактичний час невикористання через затримки обробки в контролері або через те, що можливість було ввімкнено, коли PVC уже не використовувався. Стан не оновлюється, коли в PVC встановлено `deletionTimestamp` (тобто для PVC, що видаляються).
{{< /note >}}

## PVC як томи {#claims-as-volumes}

Podʼи отримують доступ до сховища, використовуючи PVC як том. PVC має існувати в тому самому просторі імен, що й Pod, який його використовує. Кластер знаходить PVC у просторі імен Podʼа і використовує його, щоб отримати PersistentVolume, що стоїть за PVC. Потім том монтується на хост і в Pod.

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

Привʼязки PersistentVolumes є ексклюзивними, а оскільки PersistentVolumeClaims є обʼєктами в просторі імен, монтування PVC у режимах "Many" (`ROX`, `RWX`) можливе лише в межах одного простору імен.

### PersistentVolumes типу `hostPath` {#persistentvolumes-typed-hostpath}

PersistentVolume типу `hostPath` використовує файл або теку на вузлі для емуляції мережевого сховища. Дивіться [приклад тому типу `hostPath`](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolume).

## Підтримка необроблених блокових томів {#raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Такі втулки томів підтримують необроблені блокові томи, зокрема динамічне надання, де це застосовно:

* CSI (зокрема деякі типи томів, перенесені на CSI)
* FC (Fibre Channel)
* iSCSI
* Локальний том

### PersistentVolume, що використовує необроблений блоковий том {#persistent-volume-using-a-raw-block-volume}

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

### PersistentVolumeClaim, який запитує необроблений блоковий том {#persistent-volume-claim-requesting-a-raw-block-volume}

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

### Специфікація Podʼа з додаванням шляху необробленого блокового пристрою в контейнері {#pod-specification-adding-raw-block-device-path-in-container}

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
Під час додавання необробленого блокового пристрою для Podʼа ви вказуєте шлях до пристрою в контейнері замість шляху монтування.
{{< /note >}}

### Привʼязка блокових томів {#binding-block-volumes}

Якщо користувач запитує необроблений блоковий том, вказавши це в полі `volumeMode` у специфікації PersistentVolumeClaim, правила привʼязки дещо відрізняються від попередніх випусків, які не враховували цей режим як частину специфікації. Нижче наведено таблицю можливих комбінацій, які користувач і адміністратор можуть вказати для запиту необробленого блокового пристрою. Таблиця показує, чи буде том привʼязано за цих комбінацій: Матриця привʼязки томів для статично наданих томів:

| PV volumeMode | PVC volumeMode | Результат      |
| --------------|:--------------:| --------------:|
|   не вказано  | не вказано     | ПРИВʼЯЗАНИЙ    |
|   не вказано  | Block          | НЕ ПРИВʼЯЗАНИЙ |
|   не вказано  | Filesystem     | ПРИВʼЯЗАНИЙ    |
|   Block       | не вказано     | НЕ ПРИВʼЯЗАНИЙ |
|   Block       | Block          | ПРИВʼЯЗАНИЙ    |
|   Block       | Filesystem     | НЕ ПРИВʼЯЗАНИЙ |
|   Filesystem  | Filesystem     | ПРИВʼЯЗАНИЙ    |
|   Filesystem  | Block          | НЕ ПРИВʼЯЗАНИЙ |
|   Filesystem  | не вказано     | ПРИВʼЯЗАНИЙ    |

{{< note >}}
Для альфа-випуску підтримуються лише статично надані томи. Адміністратори мають враховувати ці значення під час роботи з необробленими блоковими пристроями.
{{< /note >}}

## Підтримка знімків томів та відновлення тому зі знімка {#volume-snapshot-and-restore-volume-from-snapshot-support}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Знімки томів підтримують лише зовнішні втулки томів CSI. Докладніше дивіться в [Знімки томів](/docs/concepts/storage/volume-snapshots/). Вбудовані втулки томів застаріли. Про застарілі втулки томів читайте в [FAQ про втулки томів](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md).

### Створення PersistentVolumeClaim зі знімка тому {#create-persistent-volume-claim-from-volume-snapshot}

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

### Створення PersistentVolumeClaim з наявного PVC {#create-persistent-volume-claim-from-an-existing-pvc}

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

[Клонування томів](#volume-cloning) та [відновлення зі знімка](#volume-snapshot-and-restore-volume-from-snapshot-support) попередньо заповнюють новий том із вбудованого _джерела даних_. _Наповнювачі томів_ розширюють цей механізм, щоб PersistentVolumeClaim можна було попередньо заповнити з інших видів джерел (власного ресурсу), на які він посилається через поле `dataSourceRef`:

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

Докладніше, зокрема про джерела даних між просторами імен, дивіться в [Наповнювачі томів та джерела даних](/docs/concepts/storage/volume-populators-and-data-sources/).

## Створення переносної конфігурації {#writing-portable-configuration}

Якщо ви пишете шаблони конфігурації або приклади, які працюють на широкому спектрі кластерів і потребують постійного сховища, рекомендується використовувати такий підхід:

* Додавайте обʼєкти PersistentVolumeClaim до свого набору конфігурації (поряд із Deployments, ConfigMaps тощо).
* Не додавайте обʼєкти PersistentVolume до конфігурації, оскільки користувач, який застосовує конфігурацію, може не мати дозволу на створення PersistentVolumes.
* Дайте користувачеві можливість вказати назву класу сховища під час застосування шаблону.
  * Якщо користувач вказує назву класу сховища, запишіть це значення в поле `persistentVolumeClaim.storageClassName`. Це приведе до зіставлення PVC з правильним класом сховища, якщо адміністратор увімкнув StorageClasses у кластері.
  * Якщо користувач не вказує назву класу сховища, залиште поле `persistentVolumeClaim.storageClassName` зі значенням nil. Це призведе до автоматичного надання PV для користувача зі стандартним StorageClass кластера. Багато кластерних середовищ мають встановлений стандартний StorageClass, або адміністратори можуть створити власний стандартний StorageClass.
* У своїх інструментах стежте за PVC, які не привʼязуються протягом певного часу, і показуйте це користувачеві, оскільки це може означати, що кластер не має підтримки динамічного сховища (у цьому випадку користувач має створити відповідний PV) або не має системи зберігання (у цьому випадку користувач не може розгорнути конфігурацію, яка потребує PVC).

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся більше про [створення PersistentVolume](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolume).
* Дізнайтеся більше про [створення PersistentVolumeClaim](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* Прочитайте [проєктний документ Persistent Storage](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Довідники API {#reference}

Дізнайтеся більше про описані на цій сторінці API:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
