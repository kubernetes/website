---
title: Класи атрибутів тома
content_type: concept
weight: 45
---

<!-- overview -->

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

Ця сторінка передбачає, що ви знайомі з [StorageClasses](/docs/concepts/storage/storage-classes/), [томами](/docs/concepts/storage/volumes/) та [постійними томами](/docs/concepts/storage/persistent-volumes/) в Kubernetes.

<!-- body -->

Клас VolumeAttributesClass надає адміністраторам можливість описати змінні "класи" сховищ, які вони пропонують. Різні класи можуть відповідати різним рівням якості обслуговування. Kubernetes сам по собі не виражає думки про те, що представляють ці класи.

Ця функція загалом доступна (GA) з версії 1.34, і користувачі мають можливість вимкнути її.

Ви також можете використовувати VolumeAttributesClass лише зі сховищем, підтримуваним {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}, і лише там, де відповідний драйвер CSI реалізує API `ModifyVolume`.

## API VolumeAttributesClass {#the-volumeattributesclass-api}

Кожен клас VolumeAttributesClass містить `driverName` та `parameters`, які використовуються, коли потрібно динамічно створити або змінити PersistentVolume (PV), що належить до цього класу.

Назва обʼєкта VolumeAttributesClass має значення, і вона використовується користувачами для запиту конкретного класу. Адміністратори встановлюють імʼя та інші параметри класу при створенні обʼєктів VolumeAttributesClass. Хоча імʼя обʼєкта VolumeAttributesClass в `PersistentVolumeClaim` може змінюватися, параметри в наявному класі є незмінними.

```yaml
apiVersion: storage.k8s.io/v1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: pd.csi.storage.gke.io
parameters:
  provisioned-iops: "3000"
  provisioned-throughput: "50"
```

### Постачальник {#provisioner}

Кожен клас VolumeAttributesClass має постачальника, який визначає, який втулок тому використовується для надання PV. Поле `driverName` повинно бути вказане.

Підтримка функції для VolumeAttributesClass реалізована у [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner).

Ви не обмежені вказанням [kubernetes-csi/external-provisioner](https://github.com/kubernetes-csi/external-provisioner). Ви також можете використовувати та вказувати зовнішні постачальники, які є незалежними програмами та відповідають специфікації, визначеною Kubernetes. Автори зовнішніх постачальників мають повну свободу в тому, де знаходиться їх код, як постачальник надається, як його потрібно запускати, який втулок тому він використовує та інше.

Щоб зрозуміти, як постачальник працює з VolumeAttributesClass, зверніться до [документації CSI external-provisioner](https://kubernetes-csi.github.io/docs/external-provisioner.html).

### Модифікатор розміру {#resizer}

Кожен клас VolumeAttributesClass має модифікатор розміру, який визначає, який втулок тому використовується для модифікації PV. Поле `driverName` повинно бути вказане.

Підтримка функції модифікації розміру тому для VolumeAttributesClass реалізована у [kubernetes-csi/external-resizer](https://github.com/kubernetes-csi/external-resizer).

Наприклад, наявний запит PersistentVolumeClaim використовує клас VolumeAttributesClass з іменем silver:

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

В кластері доступний новий клас VolumeAttributesClass з імʼям gold:

```yaml
apiVersion: storage.k8s.io/v1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: pd.csi.storage.gke.io
parameters:
  iops: "4000"
  throughput: "60"
```

Користувач може оновити PVC за допомогою нового класу VolumeAttributesClass gold та застосувати зміни:

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

Щоб зрозуміти, як модифікатор розміру працює з VolumeAttributesClass, зверніться до  [документації CSI external-resizer](https://kubernetes-csi.github.io/docs/external-resizer.html).

## Параметри {#parameters}

Класи VolumeAttributesClass мають параметри, які описують томи, які до них належать. Різні параметри можуть бути прийняті залежно від обраного провайдера або модифікатора розміру. Наприклад, значення `4000` для параметра `iops`, та параметр `throughput` є специфічними для GCE PD. Якщо параметр опущено, використовуються стандартні значення під час створення тому. Якщо користувач застосовує PVC із використанням іншого VolumeAttributesClass з пропущеними параметрами, стандартні значення може використовуватися залежно від реалізації драйвера CSI. Будь ласка, звертайтесь до відповідної документації драйвера CSI для отримання деталей.

Може бути визначено не більше 512 параметрів для класу VolumeAttributesClass. Загальна довжина обʼєкта параметрів, включаючи ключі та значення, не може перевищувати 256 КіБ.
