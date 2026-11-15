---
title: Класи атрибутів томів
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

На цій сторінці передбачається, що ви знайомі зі [StorageClasses](/docs/concepts/storage/storage-classes/), [томами](/docs/concepts/storage/volumes/) та [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) у Kubernetes.

<!-- body -->

VolumeAttributesClass надає адміністраторам можливість описати змінні «класи» сховища, які вони пропонують. Різні класи можуть відповідати різним рівням якості обслуговування. Сам Kubernetes не має власної думки щодо того, що представляють ці класи.

Ця можливість загальнодоступна (GA) з версії 1.34, і користувачі можуть вимкнути її.

Крім того, VolumeAttributesClasses можна використовувати лише зі сховищем на основі {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} і лише там, де відповідний драйвер CSI реалізує API `ModifyVolume`.

## API VolumeAttributesClass {#the-volumeattributesclass-api}

Кожен VolumeAttributesClass містить `driverName` та `parameters`, які використовуються, коли PersistentVolume (PV), що належить до цього класу, потрібно динамічно надати або змінити.

Назва обʼєкта VolumeAttributesClass є важливою: саме за нею користувачі можуть запитати певний клас. Адміністратори встановлюють назву та інші параметри класу під час першого створення обʼєктів VolumeAttributesClass. Хоча назву обʼєкта VolumeAttributesClass у `PersistentVolumeClaim` можна змінювати, параметри наявного класу є незмінними.

```yaml
apiVersion: storage.k8s.io/v1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: csi.storage.example.com
parameters:
  iops: "3000"
  throughput: "50Mi"
```

### Provisioner {#provisioner}

Кожен VolumeAttributesClass має provisioner, який визначає, який втулок томів використовується для надання PV. Поле `driverName` є обовʼязковим.

Підтримку цієї можливості для VolumeAttributesClass реалізовано в [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).

Ви не обмежені вказанням [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner). Ви також можете запускати та вказувати зовнішні provisioners — незалежні програми, які відповідають специфікації, визначеній Kubernetes. Автори зовнішніх provisioners мають повну свободу щодо того, де розміщено їхній код, як постачається provisioner, як його потрібно запускати, який втулок томів він використовує тощо.

Щоб зрозуміти, як provisioner працює з VolumeAttributesClass, зверніться до [документації CSI external-provisioner](https://kubernetes-csi.github.io/docs/external-provisioner.html).

### Resizer {#resizer}

Кожен VolumeAttributesClass має resizer, який визначає, який втулок томів використовується для зміни PV. Поле `driverName` є обовʼязковим.

Підтримку зміни томів для VolumeAttributesClass реалізовано в [kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer).

Наприклад, наявний PersistentVolumeClaim використовує VolumeAttributesClass з назвою silver:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: silver
  …
```

У кластері доступний новий VolumeAttributesClass gold:

```yaml
apiVersion: storage.k8s.io/v1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: csi.storage.example.com
parameters:
  iops: "4000"
  throughput: "60Mi"
```

Кінцевий користувач може оновити PVC, вказавши новий VolumeAttributesClass gold, і застосувати зміни:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  …
  volumeAttributesClassName: gold
  …
```

Щоб зрозуміти, як resizer працює з VolumeAttributesClass, зверніться до [документації CSI external-resizer](https://kubernetes-csi.github.io/docs/external-resizer.html).

## Параметри {#parameters}

VolumeAttributeClasses мають параметри, які описують томи, що до них належать. Залежно від provisioner або resizer можуть прийматися різні параметри. Наприклад, значення `4000` для параметра `iops` і параметр `throughput` є специфічними для GCE PD. Якщо параметр пропущено, під час надання тому використовується стандартне значення. Якщо користувач застосовує PVC з іншим VolumeAttributesClass із пропущеними параметрами, стандартне значення параметрів може використовуватися залежно від реалізації драйвера CSI. Докладніше дивіться в документації відповідного драйвера CSI.

Для VolumeAttributesClass можна визначити не більше 512 параметрів. Загальна довжина обʼєкта параметрів, включно з ключами та значеннями, не може перевищувати 256 KiB.
