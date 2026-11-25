---
title: Динамічне надання томів
content_type: concept
weight: 50
---

<!-- overview -->

Динамічне надання томів дозволяє створювати томи сховища на вимогу. Без динамічного надання адміністратори кластера змушені вручну звертатися до свого хмарного провайдера або постачальника сховища, щоб створити нові томи сховища, а потім створювати [обʼєкти `PersistentVolume`](/docs/concepts/storage/persistent-volumes/), які представляють їх у Kubernetes. Можливість динамічного надання усуває потребу адміністраторів кластера заздалегідь надавати сховище. Натомість сховище надається автоматично, коли користувачі створюють [обʼєкти `PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/).

<!-- body -->

## Загальні відомості {#background}

Реалізація динамічного надання томів базується на обʼєкті API `StorageClass` із групи API `storage.k8s.io`. Адміністратор кластера може визначити стільки обʼєктів `StorageClass`, скільки потрібно, і кожен із них вказує *втулок томів* (також відомий як *provisioner*), який надає том, і набір параметрів, які слід передати цьому provisioner під час надання. Адміністратор кластера може визначити та зробити доступними кілька різновидів сховища (з однієї або різних систем зберігання) у межах кластера, кожен із власним набором параметрів. Така архітектура також гарантує, що кінцевим користувачам не потрібно перейматися складністю та нюансами надання сховища, але вони все одно можуть вибирати з кількох варіантів сховища.

Докладніше дивіться в концепції [Класи сховищ](/docs/concepts/storage/storage-classes/).

## Увімкнення динамічного надання {#enabling-dynamic-provisioning}

Щоб увімкнути динамічне надання, адміністратор кластера має заздалегідь створити для користувачів один або кілька обʼєктів StorageClass. Обʼєкти StorageClass визначають, який provisioner слід використовувати та які параметри потрібно передати цьому provisioner під час виклику динамічного надання. Назва обʼєкта StorageClass має бути дійсним [іменем DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Наведений нижче маніфест створює клас сховища "slow", який надає стандартні постійні диски, подібні до звичайних дисків.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

Наведений нижче маніфест створює клас сховища "fast", який надає постійні диски, подібні до SSD.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## Використання динамічного надання {#using-dynamic-provisioning}

Користувачі запитують динамічно надане сховище, вказуючи клас сховища у своєму `PersistentVolumeClaim`. До Kubernetes v1.6 це робилося за допомогою анотації `volume.beta.kubernetes.io/storage-class`. Однак ця анотація застаріла з версії v1.9. Тепер користувачі можуть і повинні використовувати натомість поле `storageClassName` обʼєкта `PersistentVolumeClaim`. Значення цього поля має збігатися з назвою `StorageClass`, налаштованого адміністратором (дивіться [Увімкнення динамічного надання](#enabling-dynamic-provisioning)).

Наприклад, щоб вибрати клас сховища "fast", користувач створює такий PersistentVolumeClaim:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

Цей PersistentVolumeClaim призводить до автоматичного надання постійного диска, подібного до SSD. Коли PersistentVolumeClaim видаляють, том знищується.

## Стандартна поведінка {#defaulting-behavior}

Динамічне надання можна ввімкнути в кластері так, щоб усі PersistentVolumeClaims надавалися динамічно, якщо клас сховища не вказано. Адміністратор кластера може ввімкнути таку поведінку таким чином:

- Позначити один обʼєкт `StorageClass` як *стандартний*.
- Переконатися, що [контролер допуску `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) увімкнено на API-сервері.

Адміністратор може позначити певний `StorageClass` як стандартний, додавши до нього [анотацію `storageclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class). Коли в кластері є стандартний `StorageClass` і користувач створює `PersistentVolumeClaim` без вказаного `storageClassName`, контролер допуску `DefaultStorageClass` автоматично додає поле `storageClassName`, що вказує на стандартний клас сховища.

Зверніть увагу, що якщо ви встановите анотацію `storageclass.kubernetes.io/is-default-class` у true для кількох StorageClass у своєму кластері, а потім створите `PersistentVolumeClaim` без встановленого `storageClassName`, Kubernetes використає найновіший стандартний StorageClass.

## Урахування топології {#topology-awareness}

У кластерах [із кількома зонами](/docs/setup/best-practices/multiple-zones/) Podʼи можуть бути розподілені між зонами регіону. Однозонні бекенди сховища слід надавати в тих зонах, де заплановано Podʼи. Цього можна досягти, встановивши [режим привʼязки тому](/docs/concepts/storage/storage-classes/#volume-binding-mode).
