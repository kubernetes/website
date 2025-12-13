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

* Ознайомтеся з матеріалом в [Постійні томи](/docs/concepts/storage/persistent-volumes/).

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

В операційному кластері ви не використовували б hostPath. Замість цього адміністратор кластера створив би мережевий ресурс, такий як постійний диск Google Compute Engine, розділ NFS або том Amazon Elastic Block Store. Адміністратори кластера також можуть використовувати [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io) для [динамічного налаштування](/docs/concepts/storage/dynamic-provisioning/).

Ось файл конфігурації для PersistentVolume типу hostPath:

{{% code_sample file="pods/storage/pv-volume.yaml" %}}

Файл конфігурації вказує, що том знаходиться в `/mnt/data` на вузлі кластера. Конфігурація також вказує розмір 10 гібібайт та режим доступу `ReadWriteOnce`, що означає, що том може бути підключений як для читання-запису лише одним вузлом. Визначається імʼя [StorageClass](/docs/concepts/storage/persistent-volumes/#class) `manual` для PersistentVolume, яке буде використовуватися для привʼязки запитів PersistentVolumeClaim до цього PersistentVolume.

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

Видаліть Pod:

```shell
kubectl delete pod task-pv-pod
```

## Монтування одного і того ж PersistentVolume у двох місцях {#mounting-the-same-persistentvolume-in-two-places}

Ви зрозуміли, як створити PersistentVolume і PersistentVolumeClaim, а також як змонтувати том в одне місце в контейнері. Розгляньмо, як можна змонтувати один і той самий PersistentVolume у двох різних місцях контейнера. Нижче наведено приклад:

{{% code_sample file="pods/storage/pv-duplicate.yaml" %}}

Nen:

* `subPath`: Це поле дозволяє експонувати певні файли або теки зі змонтованого PersistentVolume у різних місцях контейнера. У цьому прикладі
  * `subPath: html` монтує теку html.
  * `subPath: nginx.conf` монтує певний файл, nginx.conf.

Оскільки перший subPath — `html`, на вузлі потрібно створити теку `html` у теці `/mnt/data/`.

Другий subPath `nginx.conf` означає, що буде використано файл у теці `/mnt/data/`. Ніяких інших тек створювати не потрібно.

На вашому контейнері nginx буде виконано два монтування тому:

* `/usr/share/nginx/html` для статичного вебсайту
* `/etc/nginx/nginx.conf` для файлу налаштувань

### Переміщення файлу index.html на вашому Вузлі в нову теку {#move-the-index-html-file-on-your-node-to-a-new-folder}

Згаданий тут файл `index.html` стосується до файлу, створеного у розділі "[Створіть файл index.html на вашому вузлі](#create-an-index-html-file-on-your-node)".

Відкрийте оболонку на одному з вузлів кластера. Спосіб відкриття оболонки залежить від того, як ви налаштували кластер. Наприклад, якщо ви використовуєте Minikube, ви можете відкрити оболонку на вашому вузлі, скориставшись командою `minikube ssh`.

Створіть теку `/mnt/data/html`:

```shell
# Це припускає, що ваш вузол використовує "sudo" для запуску команд
# від імені суперкористувача
sudo mkdir /mnt/data/html
```

Перемістіть index.html в теку:

```shell
# Перемістіть index.html з поточного розташування до теки html
sudo mv /mnt/data/index.html html
```

### Створення нового файлу nginx.conf {#create-a-new-nginx-conf-file}

{{% code_sample file="pods/storage/nginx.conf" %}}

Це модифікована версія стандартного файлу `nginx.conf`. Тут стандартне значення `keepalive_timeout` змінено на `60`.

Створіть файл nginx.conf:

```shell
cat <<EOF > /mnt/data/nginx.conf
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  60;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
EOF
```

### Створення Podʼа {#create-a-pod-1}

Тут ми створимо pod, який використовує наявні persistentVolume і persistentVolumeClaim. Однак, він монтує до контейнера лише певний файл `nginx.conf` і теку `html`.

Створіть pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-duplicate.yaml
```

Перевірте, що контейнер в Pod працює:

```shell
kubectl get pod test
```

Отримайте доступ до оболонки контейнера у вашому Podʼі:

```shell
kubectl exec -it test -- /bin/bash
```

У вашій оболонці переконайтеся, що nginx обслуговує файл `index.html` з тому hostPath:

```shell
# Переконайтеся, що ці 3 команди виконано в оболонці root, з якої запущено
# "kubectl exec" у попередньому кроці
apt update
apt install curl
curl http://localhost/
```

На виході буде показано текст, який ви записали до файлу `index.html` у томі hostPath:

```console
Hello from Kubernetes storage
```

У вашій оболонці також переконайтеся, що nginx обслуговує файл `nginx.conf` з тома hostPath:

```shell
# Переконайтеся, що ці команди виконано в оболонці root, з якої запущено
# "kubectl exec" у попередньому кроці
cat /etc/nginx/nginx.conf | grep keepalive_timeout
```

На виході буде показано змінений текст, який ви записали до файлу `nginx.conf` на томі hostPath:

```console
keepalive_timeout  60;
```

Якщо ви бачите ці повідомлення, це означає, що ви успішно налаштували Pod на використання певного файлу і теки у сховищі з PersistentVolumeClaim.

## Очищення {#clean-up-1}

Видаліть Pod:

```shell
kubectl delete pod test
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Якщо у вас ще не відкрито оболонку до вузла у вашому кластері, відкрийте нову оболонку так само як ви робили це раніше.

У оболонці на вашому вузлі видаліть файл і теку, які ви створили:

```shell
# Це передбачає, що ваш Вузол використовує "sudo" для виконання команд
# з правами суперкористувача
sudo rm /mnt/data/html/index.html
sudo rm /mnt/data/nginx.conf
sudo rmdir /mnt/data
```

Тепер ви можете закрити оболонку доступу до вашого вузла.

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

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Прочитайте [документ проєктування постійного сховища](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Довідка {#reference}

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)
