---
title: Динамічне впровадження томів
content_type: concept
weight: 50
---

<!-- overview -->

Динамічне впровадження томів дозволяє створювати томи сховища при потребі. Без динамічного впровадження адміністратори кластера повинні вручну звертатися до свого хмарного або постачальника сховища, щоб створити нові томи сховища, а потім створювати [обʼєкти `PersistentVolume`](/docs/concepts/storage/persistent-volumes/), щоб мати їх в Kubernetes. Функція динамічного впровадження томів усуває необхідність для адміністраторів кластера попередньо впровадження сховища. Замість цього воно автоматично впроваджує сховище, коли користувачі створюють [обʼєкти `PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/).

<!-- body -->

## Причини {#background}

Реалізація динамічного впровадження томів базується на API-обʼєкті `StorageClass` з групи API `storage.k8s.io`. Адміністратор кластера може визначити стільки обʼєктів `StorageClass`, скільки потрібно, кожен з них вказуючи *провайдера тому* (також відомий як *provisioner*) для впровадження тому та набір параметрів, які слід передати цьому провайдеру. Адміністратор кластера може визначити та надавати кілька варіантів сховища (з того ж або різних систем сховищ) в межах кластера, кожен зі своїм набором параметрів. Цей дизайн також забезпечує те, що кінцеві користувачі не повинні турбуватися про складнощі та нюанси впровадження сховища, але все ще мають можливість вибрати з різних варіантів сховища.

Для отримання додаткової інформації ознайомтесь з концепцією [Класи сховищ](/docs/concepts/storage/storage-classes/).

## Увімкнення динамічного надання ресурсів {#enabling-dynamic-provisioning}

Для увімкнення динамічного впровадження адміністратор кластера повинен передбачити один або декілька обʼєктів `StorageClass` для користувачів. Обʼєкти `StorageClass` визначають, який провайдер повинен використовуватися та які параметри повинні йому передаватися під час виклику динамічного впровадження. Імʼя обʼєкта `StorageClass` повинно бути дійсним [імʼям DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

Наступний маніфест створює клас сховища "slow", який надає стандартні диски, схожі на постійні диски.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow


provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

Наступний маніфест створює клас сховища "fast", який надає диски, схожі на SSD.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## Використання динамічного надання ресурсів {#using-dynamic-provisioning}

Користувачі можуть запитувати динамічно впроваджене сховище, включаючи клас сховища у свій `PersistentVolumeClaim`. До версії Kubernetes v1.6 це робилося за допомогою анотації `volume.beta.kubernetes.io/storage-class`. Однак ця анотація застаріла з версії v1.9. Тепер користувачі можуть і повинні використовувати поле `storageClassName` обʼєкта `PersistentVolumeClaim`. Значення цього поля повинно відповідати імені `StorageClass`, налаштованому адміністратором (див. [Увімкнення динамічного надання ресурсів](#enabling-dynamic-provisioning)).

Наприклад, щоб вибрати клас сховища "fast", користувач створює наступний `PersistentVolumeClaim`:

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

Цей запит призводить до автоматичного впровадження тому, схожого на SSD. Після видалення заявки том знищується.

## Стандартна поведінка {#default-behavior}

Динамічне впровадження може бути увімкнено в кластері так, що всі заявки будуть динамічно надані, якщо не вказано жоден клас сховища. Адміністратор кластера може увімкнути цю поведінку шляхом:

- Визначення одного обʼєкта `StorageClass` як *типового*;
- Переконайтеся, що [контролер дозволів `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass) увімкнений на API-сервері.

Адміністратор може визначити певний `StorageClass` як типовий, додавши анотацію [`storageclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class) до нього. Коли в кластері існує типовий `StorageClass`, і користувач створює `PersistentVolumeClaim` із невказаним `storageClassName`, контролер `DefaultStorageClass` автоматично додає поле `storageClassName`, що вказує на типовий клас сховища.

Зверніть увагу, що якщо ви встановите анотацію `storageclass.kubernetes.io/is-default-class` в true для більше одного StorageClass у вашому кластері, а потім створите `PersistentVolumeClaim` із не встановленим `storageClassName`, Kubernetes використовує найновіший створений типовий StorageClass.

## Врахування топології {#topology-awareness}

У кластерах [з кількома зонами](/docs/setup/best-practices/multiple-zones/) можуть розташовуватися Podʼи в різних зонах одного регіону. Томи сховища в одній зоні повинні надаватися в ті зони, де заплановані Podʼи. Це можна здійснити, встановивши [режим звʼязування тому](/docs/concepts/storage/storage-classes/#volume-binding-mode).
