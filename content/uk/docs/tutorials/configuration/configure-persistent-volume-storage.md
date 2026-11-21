---
title: Налаштування Podʼа для використання PersistentVolume для зберігання
content_type: tutorial
weight: 90
---

<!-- overview -->

Ця сторінка показує, як налаштувати Pod для використання {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} для зберігання. Ось короткий опис процесу:

1. Ви, як адміністратор кластера, створюєте PersistentVolume на основі фізичного сховища. Ви не повʼязуєте том з жодним Podʼом.

1. Ви, тепер у ролі розробника / користувача кластера, створюєте PersistentVolumeClaim, який автоматично привʼязується до відповідного PersistentVolume.

1. Ви створюєте Pod, який використовує наведений вище PersistentVolumeClaim для зберігання.

## {{% heading "prerequisites" %}} {#before-you-begin}

* Вам потрібен кластер Kubernetes, який має лише один вузол, а інструмент командного рядка {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} має бути налаштований на взаємодію з вашим кластером. Якщо у вас ще немає кластера з одним вузлом, ви можете створити його за допомогою [Minikube](https://minikube.sigs.k8s.io/docs/).

* Ознайомтеся з матеріалом сторінки [Постійні томи](/docs/concepts/storage/persistent-volumes/).

<!-- steps -->

## Створення файлу index.html на вашому вузлі {#create-an-index-html-file-on-your-node}

Відкрийте оболонку на єдиному вузлі вашого кластера. Спосіб відкриття оболонки залежить від того, як ви налаштували кластер. Наприклад, якщо ви використовуєте Minikube, ви можете відкрити оболонку на вашому вузлі, виконавши `minikube ssh`.

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
Якщо ваш вузол використовує для доступу суперкористувача інструмент, відмінний від `sudo`, зазвичай це спрацює, якщо замінити `sudo` на назву іншого інструмента.
{{< /note >}}

Перевірте, що файл `index.html` існує:

```shell
cat /mnt/data/index.html
```

Вивід має бути таким:

```
Hello from Kubernetes storage
```

Тепер ви можете закрити оболонку на вашому вузлі.

## Створення PersistentVolume {#create-a-persistentvolume}

У цій вправі ви створюєте *hostPath* PersistentVolume. Kubernetes підтримує hostPath для розробки та тестування на одновузловому кластері. PersistentVolume типу hostPath використовує файл або теку на вузлі для емуляції мережевого сховища.

У промисловому кластері ви не використовували б hostPath. Натомість адміністратор кластера надав би мережевий ресурс, як-от постійний диск Google Compute Engine, спільний ресурс NFS або том Amazon Elastic Block Store. Адміністратори кластера також можуть використовувати [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io) для налаштування [динамічного надання томів](/docs/concepts/storage/dynamic-provisioning/).

Ось файл конфігурації для PersistentVolume типу hostPath:

{{% code_sample file="pods/storage/pv-volume.yaml" %}}

Файл конфігурації вказує, що том розташований у `/mnt/data` на вузлі кластера. Конфігурація також задає розмір 10 гібібайт і режим доступу `ReadWriteOnce`, що означає, що том може бути змонтований для читання й запису лише одним вузлом. Також для PersistentVolume визначено [імʼя StorageClass](/docs/concepts/storage/persistent-volumes/#class) `manual`, яке буде використано для привʼязки запитів PersistentVolumeClaim до цього PersistentVolume.

{{< note >}}
Для простоти в цьому прикладі використовується режим доступу `ReadWriteOnce`. Для промислового використання проєкт Kubernetes рекомендує натомість використовувати режим доступу `ReadWriteOncePod`.
{{< /note >}}

Створіть PersistentVolume:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Перегляньте інформацію про PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Вивід показує, що PersistentVolume має `STATUS` зі значенням `Available`. Це означає, що його ще не привʼязано до PersistentVolumeClaim.

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s
```

## Створення PersistentVolumeClaim {#create-a-persistentvolumeclaim}

Наступний крок — створення PersistentVolumeClaim. Podʼи використовують PersistentVolumeClaim, щоб запитувати фізичне сховище. У цій вправі ви створюєте PersistentVolumeClaim, який запитує том розміром щонайменше три гібібайти, що може надавати доступ для читання й запису щонайбільше одному вузлу водночас.

Ось файл конфігурації для PersistentVolumeClaim:

{{% code_sample file="pods/storage/pv-claim.yaml" %}}

Створіть PersistentVolumeClaim:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml
```

Після створення PersistentVolumeClaim панель управління Kubernetes шукає PersistentVolume, який відповідає вимогам PVC. Якщо панель управління знаходить відповідний PersistentVolume з тим самим StorageClass, вона привʼязує PVC до цього тому.

Знову подивіться на PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Тепер вивід показує `STATUS` як `Bound`.

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m
```

Подивіться на PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

Вивід показує, що PersistentVolumeClaim привʼязаний до вашого PersistentVolume,
`task-pv-volume`.

```
NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s
```

## Створення Podʼа {#create-a-pod}

Наступним кроком є створення Podʼа, який використовує ваш PersistentVolumeClaim як том.

Ось файл конфігурації для Podʼа:

{{% code_sample file="pods/storage/pv-pod.yaml" %}}

Зверніть увагу, що файл конфігурації Podʼа вказує PersistentVolumeClaim, але не вказує PersistentVolume. З погляду Podʼа PVC є томом.

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

```
Hello from Kubernetes storage
```

Якщо ви бачите це повідомлення, ви успішно налаштували Pod на використання сховища з PersistentVolumeClaim.

## Очищення {#clean-up}

Видаліть Pod:

```shell
kubectl delete pod task-pv-pod
```

## Монтування одного і того ж PersistentVolume у двох місцях {#mounting-the-same-persistentvolume-in-two-places}

Ви зрозуміли, як створити PersistentVolume і PersistentVolumeClaim, а також як змонтувати том в одне місце в контейнері. Розгляньмо, як можна змонтувати один і той самий PersistentVolume у двох різних місцях контейнера. Нижче наведено приклад:

{{% code_sample file="pods/storage/pv-duplicate.yaml" %}}

Тут:

* `subPath`: це поле дає змогу відкривати певні файли або теки зі змонтованого PersistentVolume в різних місцях контейнера. У цьому прикладі:
  * `subPath: html` монтує теку html.
  * `subPath: nginx.conf` монтує певний файл, nginx.conf.

Оскільки перший subPath — `html`, на вузлі потрібно створити теку `html` у теці `/mnt/data/`.

Другий subPath `nginx.conf` означає, що буде використано файл у теці `/mnt/data/`. Ніяких інших тек створювати не потрібно.

На вашому контейнері nginx буде виконано два монтування тому:

* `/usr/share/nginx/html` для статичного вебсайту
* `/etc/nginx/nginx.conf` для стандартної конфігурації

### Переміщення файлу index.html на вашому вузлі в нову теку {#move-the-index-html-file-on-your-node-to-a-new-folder}

Згаданий тут файл `index.html` — це той, що створений у розділі «[Створення файлу index.html на вашому вузлі](#create-an-index-html-file-on-your-node)».

Відкрийте оболонку на єдиному вузлі вашого кластера. Спосіб відкриття оболонки залежить від того, як ви налаштували кластер. Наприклад, якщо ви використовуєте Minikube, ви можете відкрити оболонку на вашому вузлі, виконавши `minikube ssh`.

Створіть теку `/mnt/data/html`:

```shell
# Це припускає, що ваш вузол використовує "sudo" для запуску команд
# від імені суперкористувача
sudo mkdir /mnt/data/html
```

Перемістіть index.html в теку:

```shell
# Перемістіть index.html з поточного розташування до теки html
sudo mv /mnt/data/index.html /mnt/data/html/index.html
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

Тут ми створимо Pod, який використовує наявні persistentVolume і persistentVolumeClaim. Однак Pod монтує в контейнер лише певний файл `nginx.conf` і теку `html`.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-duplicate.yaml
```

Перевірте, що контейнер у Podʼі працює:

```shell
kubectl get pod test
```

Отримайте доступ до оболонки контейнера у вашому Podʼі:

```shell
kubectl exec -it test -- /bin/bash
```

У вашій оболонці переконайтеся, що nginx обслуговує файл `index.html` з тому hostPath:

```shell
# Обовʼязково виконайте ці 3 команди всередині кореневої оболонки, яку ви отримали,
# виконавши "kubectl exec" на попередньому кроці
apt update
apt install curl
curl http://localhost/
```

Вивід показує текст, який ви записали у файл `index.html` у томі hostPath:

```
Hello from Kubernetes storage
```

У вашій оболонці також переконайтеся, що nginx обслуговує файл `nginx.conf` з тому hostPath:

```shell
# Обовʼязково виконайте ці команди всередині кореневої оболонки, яку ви отримали,
# виконавши "kubectl exec" на попередньому кроці
cat /etc/nginx/nginx.conf | grep keepalive_timeout
```

Вивід показує змінений текст, який ви записали у файл `nginx.conf` у томі hostPath:

```
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

Якщо у вас ще не відкрито оболонку на вузлі вашого кластера, відкрийте нову оболонку так само, як ви робили це раніше.

У оболонці на вашому вузлі видаліть файл і теку, які ви створили:

```shell
# Це передбачає, що ваш вузол використовує "sudo" для виконання команд
# з правами суперкористувача
sudo rm /mnt/data/html/index.html
sudo rm /mnt/data/nginx.conf
sudo rmdir /mnt/data/html
sudo rmdir /mnt/data
```

Тепер ви можете закрити оболонку на вашому вузлі.

<!-- discussion -->

## Контроль доступу {#access-control}

Сховище, налаштоване з ідентифікатором групи (GID), дозволяє запис лише Podʼам, які використовують той самий GID. Невідповідність або відсутність GID призводить до помилок відмови в доступі. Щоб зменшити потребу в координації з користувачами, адміністратор може додати до PersistentVolume анотацію з GID. Тоді GID автоматично додається до будь-якого Podʼа, який використовує цей PersistentVolume.

Використовуйте анотацію `pv.beta.kubernetes.io/gid` так:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

Коли Pod використовує PersistentVolume з анотацією GID, вказаний в анотації GID застосовується до всіх контейнерів у Podʼі так само, як GID, зазначені в контексті безпеки Podʼа. Кожен GID, незалежно від того, чи походить він з анотації PersistentVolume, чи зі специфікації Podʼа, застосовується до першого процесу, запущеного в кожному контейнері.

{{< note >}}
Коли Pod використовує PersistentVolume, GID, повʼязані з PersistentVolume, не відображаються в самому ресурсі Pod.
{{< /note >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Прочитайте [документ проєктування постійного сховища](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Довідка {#reference}

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)
