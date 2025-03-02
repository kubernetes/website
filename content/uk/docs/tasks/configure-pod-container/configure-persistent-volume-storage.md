---
title: Налаштування Podʼа для використання PersistentVolume для зберігання
content_type: task
weight: 90
---

<!-- overview -->

Ця сторінка показує, як налаштувати Pod для використання {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} для зберігання. Ось короткий опис процесу:

1. Ви, як адміністратор кластера, створюєте PersistentVolume на основі фізичного сховища. Ви не повʼязуєте том з жодним Podʼом.

1. Ви, як розробник / користувач кластера, створюєте PersistentVolumeClaim, який автоматично привʼязується до відповідного PersistentVolume.

1. Ви створюєте Pod, який використовує вищезгаданий PersistentVolumeClaim для зберігання.

## {{% heading "prerequisites" %}}

* Вам потрібно мати кластер Kubernetes, який має лише один вузол, і {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} повинен бути налаштований на спілкування з вашим кластером. Якщо у вас ще немає кластера з одним вузлом, ви можете створити його, використовуючи [Minikube](https://minikube.sigs.k8s.io/docs/).

* Ознайомтеся з матеріалом в [Постійні томи](/uk/docs/concepts/storage/persistent-volumes/).

<!-- steps -->

## Створіть файл index.html на вашому вузлі {#create-an-index-html-file-on-your-node}

Відкрийте оболонку на єдиному вузлі вашого кластера. Спосіб відкриття оболонки залежить від того, як ви налаштували ваш кластер. Наприклад, якщо ви використовуєте Minikube, ви можете відкрити оболонку до вашого вузла, введенням `minikube ssh`.

У вашій оболонці на цьому вузлі створіть теку `/mnt/data`:

```shell
# Це передбачає, що ваш вузол використовує "sudo" для запуску команд
# як суперкористувач
sudo mkdir /mnt/data
```

У теці `/mnt/data` створіть файл `index.html`:

```shell
# Це також передбачає, що ваш вузол використовує "sudo" для запуску команд
# як суперкористувач
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
Якщо ваш вузол використовує інструмент для доступу суперкористувача, відмінний від `sudo`, ви зазвичай можете зробити це, якщо заміните `sudo` на імʼя іншого інструмента.
{{< /note >}}

Перевірте, що файл `index.html` існує:

```shell
cat /mnt/data/index.html
```

Виведення повинно бути:

```none
Hello from Kubernetes storage
```

Тепер ви можете закрити оболонку вашого вузла.

## Створення PersistentVolume {#create-a-persistentvolume}

У цьому завданні ви створюєте *hostPath* PersistentVolume. Kubernetes підтримує hostPath для розробки та тестування на одновузловому кластері. PersistentVolume типу hostPath використовує файл або теку на вузлі для емуляції мережевого сховища.

В операційному кластері ви не використовували б hostPath. Замість цього адміністратор кластера створив би мережевий ресурс, такий як постійний диск Google Compute Engine, розділ NFS або том Amazon Elastic Block Store. Адміністратори кластера також можуть використовувати [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io) для [динамічного налаштування](/uk/docs/concepts/storage/dynamic-provisioning/).

Ось файл конфігурації для PersistentVolume типу hostPath:

{{% code_sample file="pods/storage/pv-volume.yaml" %}}

Файл конфігурації вказує, що том знаходиться в `/mnt/data` на вузлі кластера. Конфігурація також вказує розмір 10 гібібайт та режим доступу `ReadWriteOnce`, що означає, що том може бути підключений як для читання-запису лише одним вузлом. Визначається імʼя [StorageClass](/uk/docs/concepts/storage/persistent-volumes/#class) `manual` для PersistentVolume, яке буде використовуватися для привʼязки запитів PersistentVolumeClaim до цього PersistentVolume.

{{< note >}}
У цьому прикладі використовується режим доступу `ReadWriteOnce` для спрощення. Для
операційного застосування проєкт Kubernetes рекомендує використовувати режим доступу `ReadWriteOncePod`.
{{< /note >}}

Створіть PersistentVolume:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Перегляньте інформацію про PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Вивід показує, що PersistentVolume має `STATUS` `Available`. Це означає, що він ще не був привʼязаний до PersistentVolumeClaim.

```none
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s
```

## Створення PersistentVolumeClaim {#create-a-persistentvolumeclaim}

Наступним кроком є створення PersistentVolumeClaim. Podʼи використовують PersistentVolumeClaim для запиту фізичного сховища. У цій вправі ви створюєте PersistentVolumeClaim, який запитує том не менше трьох гібібайт, який може забезпечити доступ до читання-запису не більше одного вузла за раз.

Ось файл конфігурації для PersistentVolumeClaim:

{{% code_sample file="pods/storage/pv-claim.yaml" %}}

Створіть PersistentVolumeClaim:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml
```

Після створення PersistentVolumeClaim панель управління Kubernetes шукає PersistentVolume, який відповідає вимогам заявки. Якщо панель управління знаходить відповідний PersistentVolume з тим самим StorageClass, вона привʼязує заявку до тому.

Знову подивіться на PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Тепер вивід показує `STATUS` як `Bound`.

```none
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m
```

Подивіться на PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

Вивід показує, що PersistentVolumeClaim привʼязаний до вашого PersistentVolume,
`task-pv-volume`.

```none
NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s
```

## Створення Podʼа {#create-a-pod}

Наступним кроком є створення Podʼа, який використовує ваш PersistentVolumeClaim як том.

Ось файл конфігурації для Podʼа:

{{% code_sample file="pods/storage/pv-pod.yaml" %}}

Зверніть увагу, що файл конфігурації Podʼа вказує PersistentVolumeClaim, але не вказує PersistentVolume. З погляду Podʼа, заявка є томом.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Перевірте, що контейнер у Podʼі працює:

```shell
kubectl get pod task-pv-pod
```

Відкрийте оболонку для контейнера, що працює у вашому Podʼі:

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

У вашій оболонці перевірте, що nginx обслуговує файл `index.html` з тому hostPath:

```shell
# Обовʼязково запустіть ці 3 команди всередині кореневої оболонки, яка є результатом
# виконання "kubectl exec" на попередньому кроці
apt update
apt install curl
curl http://localhost/
```

Вивід показує текст, який ви записали у файл `index.html` у томі hostPath:

```none
Hello from Kubernetes storage
```

Якщо ви бачите це повідомлення, ви успішно налаштували Pod для використання зберігання з PersistentVolumeClaim.

## Очищення {#clean-up}

Видаліть Pod, PersistentVolumeClaim та PersistentVolume:

```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Якщо у вас ще не відкрито оболонку до вузла у вашому кластері, відкрийте нову оболонку так само як ви робили це раніше.

У оболонці на вашому вузлі видаліть файл і теку, які ви створили:

```shell
# Це передбачає, що ваш вузол використовує "sudo" для виконання команд
# з правами суперкористувача
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

Тепер ви можете закрити оболонку доступу до вашого вузла.

## Монтування одного PersistentVolume у два місця {#mounting-the-same-persistentvolume-in-two-places}

{{% code_sample file="pods/storage/pv-duplicate.yaml" %}}

Ви можете виконати монтування томуу двох місцях у вашому контейнері nginx:

* `/usr/share/nginx/html` для статичного вебсайту
* `/etc/nginx/nginx.conf` для стандартної конфігурації

<!-- discussion -->

## Контроль доступу {#access-control}

Зберігання даних із використанням ідентифікатора групи (GID) дозволяє запис лише для Podʼів, які використовують той самий GID. Невідповідність або відсутність GID призводить до помилок доступу. Щоб зменшити необхідність координації з користувачами, адміністратор може анотувати PersistentVolume з GID. Після цього GID автоматично додається до будь-якого Podʼа, який використовує цей PersistentVolume.

Використовуйте анотацію `pv.beta.kubernetes.io/gid` наступним чином:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

Коли Pod використовує PersistentVolume з анотацією GID, анотований GID застосовується до всіх контейнерів у Podʼі так само як GID, зазначені у контексті безпеки Podʼа. Кожен GID, незалежно від того, чи походить він з анотації PersistentVolume або специфікації Podʼа, застосовується до першого процесу, запущеного в кожному контейнері.

{{< note >}}
Коли Pod використовує PersistentVolume, GID, асоційовані з PersistentVolume, не відображаються на самому ресурсі Podʼа.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [PersistentVolumes](/uk/docs/concepts/storage/persistent-volumes/).
* Прочитайте [документ проєктування постійного сховища](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Довідка {#reference}

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)