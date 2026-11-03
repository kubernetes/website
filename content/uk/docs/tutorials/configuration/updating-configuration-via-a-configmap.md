---
title: Оновлення конфігурації за допомогою ConfigMap
content_type: tutorial
weight: 20
---

<!-- overview -->
Ця сторінка містить покроковий приклад оновлення конфігурації всередині Podʼа за допомогою ConfigMap і базується на завданні [Налаштування Podʼів для використання ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/). Наприкінці цього посібника ви зрозумієте, як змінювати конфігурацію запущеного застосунку. У цьому посібнику як приклади використовуються образи `alpine` і `nginx`.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібно мати інструмент командного рядка [curl](https://curl.se/) для виконання HTTP-запитів з термінала або командного рядка. Якщо у вас немає `curl`, ви можете його встановити. Ознайомтеся з документацією для вашої операційної системи.

## {{% heading "objectives" %}} {#objectives}

* Оновлення конфігурації через ConfigMap, змонтований як том
* Оновлення змінних середовища Podʼа за допомогою ConfigMap
* Оновлення конфігурації через ConfigMap в багатоконтейнерному Podʼі
* Оновлення конфігурації через ConfigMap у Podʼі, що містить sidecar-контейнер

<!-- lessoncontent -->

## Оновлення конфігурації через ConfigMap, змонтований як том {#rollout-configmap-volume}

Використовуйте команду `kubectl create configmap` для створення ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap sport --from-literal=sport=football
```

Нижче наведено приклад маніфесту Deployment з ConfigMap `sport`, змонтованим як {{< glossary_tooltip text="том" term_id="volume" >}} в єдиний контейнер Podʼа.

{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

Перевірте Podʼи цього Deployment, щоб переконатися, що вони готові (вибір за {{< glossary_tooltip text="селектором" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

Ви повинні побачити подібний вивід:

```
NAME                                READY   STATUS    RESTARTS   AGE
configmap-volume-6b976dfdcf-qxvbm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-skpvm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-tbc6r   1/1     Running   0          72s
```

На кожному вузлі, де працює один із цих Podʼів, kubelet отримує дані цього ConfigMap і перетворює їх на файли в локальному томі. Потім kubelet монтує цей том у контейнер, як зазначено в шаблоні Podʼа. Код, що виконується в цьому контейнері, завантажує інформацію з файлу та використовує її, щоб виводити звіт у stdout. Ви можете перевірити цей звіт, переглянувши логи одного з Podʼів цього Deployment:

```shell
# Виберіть один Pod, що належить до Deployment, і перегляньте його логи
kubectl logs deployments/configmap-volume
```

Ви повинні побачити подібний вивід:

```
Found 3 pods, using pod/configmap-volume-76d9c5678f-x5rgj
Thu Jan  4 14:06:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:06:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:06 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:16 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:26 UTC 2024 My preferred sport is football
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap sport
```

У редакторі, що зʼявиться, змініть значення ключа `sport` з `football` на `cricket`. Збережіть зміни. Інструмент kubectl відповідним чином оновить ConfigMap (якщо виникне помилка, спробуйте ще раз).

Ось приклад того, як може виглядати маніфест після редагування:

```yaml
apiVersion: v1
data:
  sport: cricket
kind: ConfigMap
# Наявні метадані можна залишити без змін.
# Значення, які ви побачите, не будуть точно відповідати цим.
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```

Ви повинні побачити наступний вивід:

```
configmap/sport edited
```

Відстежуйте (tail) останні записи в логах одного з Podʼів, що належать до цього Deployment:

```shell
kubectl logs deployments/configmap-volume --follow
```

Через кілька секунд ви повинні побачити зміну виводу логів:

```
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

Коли у вас є ConfigMap, підключений до запущеного Podʼа через том `configMap` або проєкційний том (`projected`), і ви оновлюєте цей ConfigMap, запущений Pod майже миттєво бачить оновлення. Однак ваш застосунок бачить зміни, лише якщо він написаний так, щоб опитувати зміни або стежити за оновленнями файлів. Застосунок, що завантажує свою конфігурацію лише один раз під час запуску, змін не помітить.

{{< alert color="info" title="Примітка" >}}
Загальна затримка з моменту оновлення ConfigMap до моменту, коли нові ключі проєцюються в Pod, може сягати тривалості періоду синхронізації kubelet. Див. також [Змонтовані ConfigMap оновлюються автоматично](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically).
{{< /alert >}}

## Оновлення змінних середовища Podʼа за допомогою ConfigMap {#rollout-configmap-env}

Використовуйте команду `kubectl create configmap` для створення ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap fruits --from-literal=fruits=apples
```

Нижче наведено приклад маніфесту Deployment з налаштуванням змінної середовища через ConfigMap `fruits`.

{{% code_sample file="deployments/deployment-with-configmap-as-envvar.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-envvar.yaml
```

Перевірте Podʼи цього Deployment, щоб переконатися, що вони готові (вибір за {{< glossary_tooltip text="селектором" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

Ви повинні побачити подібний вивід:

```
NAME                                 READY   STATUS    RESTARTS   AGE
configmap-env-var-59cfc64f7d-74d7z   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-c4wmj   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-dpr98   1/1     Running   0          46s
```

Пару ключ-значення з ConfigMap налаштовано як змінну середовища в контейнері Podʼа. Перевірте це, переглянувши логи одного Podʼа, що належить до Deployment.

```shell
kubectl logs deployment/configmap-env-var
```

Ви повинні побачити подібний вивід:

```
Found 3 pods, using pod/configmap-env-var-7c994f7769-l74nq
Thu Jan  4 16:07:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:26 UTC 2024 The basket is full of apples
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap fruits
```

У редакторі, що зʼявиться, змініть значення ключа `fruits` з `apples` на `mangoes`. Збережіть зміни. Інструмент kubectl відповідним чином оновить ConfigMap (якщо виникне помилка, спробуйте ще раз).

Ось приклад того, як може виглядати маніфест після редагування:

```yaml
apiVersion: v1
data:
  fruits: mangoes
kind: ConfigMap
# Наявні метадані можна залишити без змін.
# Значення, які ви побачите, не будуть точно відповідати цим.
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```

Ви повинні побачити наступний вивід:

```
configmap/fruits edited
```

Відстежуйте логи Deployment та спостерігайте за виводом протягом кількох секунд:

```shell
# Як пояснюється у тексті, вивід НЕ змінюється
kubectl logs deployments/configmap-env-var --follow
```

Зверніть увагу, що вивід залишається **незмінним**, хоча ви відредагували ConfigMap:

```
Thu Jan  4 16:12:56 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:26 UTC 2024 The basket is full of apples
```

{{< alert color="info" title="Примітка" >}}
Хоча значення ключа всередині ConfigMap змінилося, змінна середовища в Podʼі все ще показує попереднє значення. Це тому, що змінні середовища для процесу, що виконується всередині Podʼа, **не** оновлюються, коли змінюються вихідні дані; якщо ви хочете оновити їх примусово, вам потрібно змусити Kubernetes замінити наявні Podʼи. Нові Podʼи будуть працювати з оновленою інформацією.
{{< /alert >}}

Ви можете ініціювати таку заміну. Виконайте розгортання для Deployment, використовуючи [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/):

```shell
# Запустіть розгортання
kubectl rollout restart deployment configmap-env-var

# Дочекайтеся завершення розгортання
kubectl rollout status deployment configmap-env-var --watch=true
```

Далі перевірте Deployment:

```shell
kubectl get deployment configmap-env-var
```

Ви повинні побачити подібний вивід:

```
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
configmap-env-var   3/3     3            3           12m
```

Перевірте Podʼи:

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

Розгортання змушує Kubernetes створити новий {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}} для Deployment; це означає, що наявні Podʼи з часом завершуються, а нові створюються. Через кілька секунд ви маєте побачити вивід, подібний до цього:

```
NAME                                 READY   STATUS        RESTARTS   AGE
configmap-env-var-6d94d89bf5-2ph2l   1/1     Running       0          13s
configmap-env-var-6d94d89bf5-74twx   1/1     Running       0          8s
configmap-env-var-6d94d89bf5-d5vx8   1/1     Running       0          11s
```

{{< alert color="info" title="Примітка" >}}
Дочекайтеся, поки старі Podʼи повністю завершать роботу, перш ніж переходити до наступних кроків.
{{< /alert >}}

Перегляньте логи одного з Podʼів цього Deployment:

```shell
# Виберіть один Pod, що належить до Deployment, і перегляньте його логи
kubectl logs deployment/configmap-env-var
```

Ви повинні побачити подібний вивід:

```
Found 3 pods, using pod/configmap-env-var-6d9ff89fb6-bzcf6
Thu Jan  4 16:30:35 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:45 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:55 UTC 2024 The basket is full of mangoes
```

Це демонструє сценарій оновлення змінних середовища в Podʼі, отриманих з ConfigMap. Зміни значень ConfigMap застосовуються до Podʼа під час наступного розгортання. Якщо Podʼи створюються з іншої причини, як-от масштабування Deployment, нові Podʼи також використовують найновіші значення конфігурації; якщо ви не ініціюєте розгортання, то можете виявити, що ваш застосунок працює із сумішшю старих і нових значень змінних середовища.

## Оновлення конфігурації через ConfigMap у багатоконтейнерному Podʼі {#rollout-configmap-multiple-containers}

Використовуйте команду `kubectl create configmap`, щоб створити ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap color --from-literal=color=red
```

Нижче наведено приклад маніфесту Deployment, що керує набором Podʼів, кожен з яких має два контейнери. Обидва контейнери спільно використовують том `emptyDir` для обміну даними. Перший контейнер запускає вебсервер (`nginx`). Шлях монтування спільного тому в контейнері вебсервера — `/usr/share/nginx/html`. Другий, допоміжний контейнер базується на `alpine`, і для нього том `emptyDir` змонтовано в `/pod-data`. Допоміжний контейнер записує HTML-файл, вміст якого залежить від ConfigMap. Контейнер вебсервера віддає цей HTML через HTTP.

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

Перевірте Podʼи цього Deployment, щоб переконатися, що вони готові (вибір за {{< glossary_tooltip text="селектором" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

Ви повинні побачити вивід, схожий на:

```
NAME                                        READY   STATUS    RESTARTS   AGE
configmap-two-containers-565fb6d4f4-2xhxf   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-g5v4j   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-mzsmf   2/2     Running   0          20s
```

Відкрийте доступ до Deployment (інструмент `kubectl` створить для вас {{<glossary_tooltip text="Service" term_id="service">}}):

```shell
kubectl expose deployment configmap-two-containers --name=configmap-service --port=8080 --target-port=80
```

Використайте `kubectl`, щоб перенаправити порт:

```shell
# це залишається запущеним у фоновому режимі
kubectl port-forward service/configmap-service 8080:8080 &
```

Зверніться до Service.

```shell
curl http://localhost:8080
```

Ви повинні побачити вивід, схожий на:

```
Fri Jan  5 08:08:22 UTC 2024 My preferred color is red
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap color
```

У редакторі, що зʼявиться, змініть значення ключа `color` з `red` на `blue`. Збережіть зміни. Інструмент kubectl відповідним чином оновить ConfigMap (якщо виникне помилка, спробуйте ще раз).

Ось приклад того, як може виглядати цей маніфест після редагування:

```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# Ви можете залишити наявні метадані такими, які вони є.
# Значення, які ви побачите, не збігатимуться з цими.
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6
```

Протягом кількох секунд циклічно звертайтеся до URL Service.

```shell
# Скасуйте це, коли будете задоволені (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

Ви маєте побачити, що вивід змінюється так:

```
Fri Jan  5 08:14:00 UTC 2024 My preferred color is red
Fri Jan  5 08:14:02 UTC 2024 My preferred color is red
Fri Jan  5 08:14:20 UTC 2024 My preferred color is red
Fri Jan  5 08:14:22 UTC 2024 My preferred color is red
Fri Jan  5 08:14:32 UTC 2024 My preferred color is blue
Fri Jan  5 08:14:43 UTC 2024 My preferred color is blue
Fri Jan  5 08:15:00 UTC 2024 My preferred color is blue
```

## Оновлення конфігурації через ConfigMap у Podʼі із sidecar-контейнером {#rollout-configmap-sidecar}

Наведений вище сценарій можна відтворити, використавши [sidecar-контейнер](/docs/concepts/workloads/pods/sidecar-containers/) як допоміжний контейнер для запису HTML-файлу. Оскільки sidecar-контейнер концептуально є init-контейнером, він гарантовано запускається раніше за основний контейнер вебсервера. Це забезпечує, що HTML-файл завжди доступний, коли вебсервер готовий його віддавати.

Якщо ви продовжуєте з попереднього сценарію, можете повторно використати для нього ConfigMap з назвою `color`. Якщо ви виконуєте цей сценарій окремо, використайте команду `kubectl create configmap`, щоб створити ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap color --from-literal=color=blue
```

Нижче наведено приклад маніфесту Deployment, що керує набором Podʼів, кожен з яких має основний контейнер і sidecar-контейнер. Обидва контейнери спільно використовують том `emptyDir` для обміну даними. Основний контейнер запускає вебсервер (NGINX). Шлях монтування спільного тому в контейнері вебсервера — `/usr/share/nginx/html`. Другий контейнер — це sidecar-контейнер на основі Alpine Linux, який діє як допоміжний. Для нього том `emptyDir` змонтовано в `/pod-data`. Sidecar-контейнер записує HTML-файл, вміст якого залежить від ConfigMap. Контейнер вебсервера віддає цей HTML через HTTP.

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

Перевірте Podʼи цього Deployment, щоб переконатися, що вони готові (вибір за {{< glossary_tooltip text="селектором" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

Ви повинні побачити вивід, схожий на:

```
NAME                                           READY   STATUS    RESTARTS   AGE
configmap-sidecar-container-5fb59f558b-87rp7   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-ccs7s   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-wnmgk   2/2     Running   0          94s
```

Відкрийте доступ до Deployment (інструмент `kubectl` створить для вас {{<glossary_tooltip text="Service" term_id="service">}}):

```shell
kubectl expose deployment configmap-sidecar-container --name=configmap-sidecar-service --port=8081 --target-port=80
```

Використайте `kubectl`, щоб перенаправити порт:

```shell
# це залишається запущеним у фоновому режимі
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

Зверніться до Service.

```shell
curl http://localhost:8081
```

Ви повинні побачити вивід, схожий на:

```
Sat Feb 17 13:09:05 UTC 2024 My preferred color is blue
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap color
```

У редакторі, що зʼявиться, змініть значення ключа `color` з `blue` на `green`. Збережіть зміни. Інструмент kubectl відповідним чином оновить ConfigMap (якщо виникне помилка, спробуйте ще раз).

Ось приклад того, як може виглядати цей маніфест після редагування:

```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# Наявні метадані можна залишити без змін.
# Значення, які ви побачите, не будуть точно відповідати цим.
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```

Протягом кількох секунд циклічно звертайтеся до URL Service.

```shell
# Скасуйте це, коли будете задоволені (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

Ви маєте побачити, що вивід змінюється так:

```
Sat Feb 17 13:12:35 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:45 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:55 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:05 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:15 UTC 2024 My preferred color is green
Sat Feb 17 13:13:25 UTC 2024 My preferred color is green
Sat Feb 17 13:13:35 UTC 2024 My preferred color is green
```

## Оновлення конфігурації через незмінний ConfigMap, який монтується як том {#rollout-configmap-immutable-volume}

{{< alert color="info" title="Примітка" >}}
Незмінні ConfigMap використовуються передусім для конфігурації, яка є сталою і **не** має змінюватися з часом. Позначення ConfigMap як незмінного дає змогу підвищити продуктивність, оскільки kubelet не відстежує змін.

Якщо вам таки потрібно внести зміну, заплануйте одне з такого:

* змінити імʼя ConfigMap та перейти до запуску Podʼів, які посилаються на нове імʼя
* замінити всі вузли у вашому кластері, на яких раніше працював Pod, що використовував старе значення
* перезапустити kubelet на кожному вузлі, де kubelet раніше завантажував старий ConfigMap
{{< /alert >}}

Нижче наведено приклад маніфесту для [незмінного ConfigMap](/docs/concepts/configuration/configmap/#configmap-immutable).

{{% code_sample file="configmap/immutable-configmap.yaml" %}}

Створіть незмінний ConfigMap:

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

Нижче наведено приклад маніфесту Deployment з незмінним ConfigMap `company-name-20150801`, змонтованим як {{< glossary_tooltip text="том" term_id="volume" >}} в єдиний контейнер Podʼа.

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

Перевірте Podʼи цього Deployment, щоб переконатися, що вони готові (вибір за {{< glossary_tooltip text="селектором" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

Ви маєте побачити вивід, схожий на:

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

Контейнер Podʼа посилається на дані, визначені в ConfigMap, і використовує їх, щоб виводити звіт у stdout. Ви можете перевірити цей звіт, переглянувши логи одного з Podʼів цього Deployment:

```shell
# Виберіть один Pod, який належить до Deployment, і перегляньте його логи
kubectl logs deployments/immutable-configmap-volume
```

Ви повинні побачити вивід, подібний до:

```
Found 3 pods, using pod/immutable-configmap-volume-78b6fbff95-5gsfh
Wed Mar 20 03:52:34 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:44 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:54 UTC 2024 The name of the company is ACME, Inc.
```

{{< alert color="info" title="Примітка" >}}
Щойно ConfigMap позначено як незмінний, цю зміну неможливо скасувати, як і змінити вміст поля data або binaryData. Щоб змінити поведінку Podʼів, які використовують цю конфігурацію, ви створите новий незмінний ConfigMap і відредагуєте Deployment, задавши трохи інший шаблон Podʼа з посиланням на новий ConfigMap.
{{< /alert >}}

Створіть новий незмінний ConfigMap, використовуючи наведений нижче маніфест:

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

Ви маєте побачити вивід, схожий на:

```
configmap/company-name-20240312 created
```

Перевірте новостворений ConfigMap:

```shell
kubectl get configmap
```

Ви маєте побачити вивід, у якому показано і старий, і новий ConfigMap:

```
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

Змініть Deployment, щоб він посилався на новий ConfigMap.

Відредагуйте Deployment:

```shell
kubectl edit deployment immutable-configmap-volume
```

У редакторі, що зʼявиться, оновіть наявне визначення тому, щоб використовувати новий ConfigMap.

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # Оновіть це поле
  name: config-volume
```

Ви маєте побачити такий вивід:

```
deployment.apps/immutable-configmap-volume edited
```

Це запустить розгортання. Дочекайтеся, поки всі попередні Podʼи завершать роботу, а нові Podʼи перейдуть у стан готовності.

Відстежуйте стан Podʼів:

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

```
NAME                                          READY   STATUS        RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running       0          13s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running       0          14s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running       0          15s
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Terminating   0          32m
```

Зрештою ви маєте побачити вивід, подібний до:

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running   0          43s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running   0          44s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running   0          45s
```

Перегляньте логи одного з Podʼів цього Deployment:

```shell
# Виберіть один Pod, що належить до Deployment, і перегляньте його логи
kubectl logs deployment/immutable-configmap-volume
```

Ви повинні побачити вивід, подібний до:

```
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

Коли всі Deployment перейдуть на використання нового незмінного ConfigMap, рекомендується видалити старий:

```shell
kubectl delete configmap company-name-20150801
```

## Підсумок {#summary}

Зміни у ConfigMap, змонтованому як том у Podʼі, стають доступними безшовно після наступної синхронізації kubelet.

Зміни у ConfigMap, який налаштовує змінні середовища для Podʼа, стають доступними після наступного розгортання для цього Podʼа.

Після того як ConfigMap позначено як незмінний, цю зміну неможливо скасувати (ви не можете зробити незмінний ConfigMap змінним), і ви також не можете змінити вміст поля `data` або `binaryData`. Ви можете видалити та створити ConfigMap заново або створити новий, інший ConfigMap. Коли ви видаляєте ConfigMap, запущені контейнери та їхні Podʼи зберігають точку монтування до будь-якого тому, який посилався на цей наявний ConfigMap.

## {{% heading "cleanup" %}} {#cleaning-up}

Завершіть команди `kubectl port-forward`, якщо вони виконуються.

Видаліть ресурси, створені під час виконання цього посібника:

```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # У випадку, якщо він не був оброблений під час виконання завдання
```
