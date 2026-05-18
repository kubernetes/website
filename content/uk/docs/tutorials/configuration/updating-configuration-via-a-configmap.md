---
title: Оновлення конфігурації за допомогою ConfigMap
content_type: tutorial
weight: 20
---

<!-- overview -->
Ця сторінка містить покроковий приклад оновлення конфігурації всередині Podʼа за допомогою ConfigMap і базується на завданні [Налаштування Podʼа для використання ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/). Наприкінці цього посібника ви зрозумієте, як змінити конфігурацію для запущеного застосунку. Цей посібник використовує образи `alpine` та `nginx` як приклади.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібно мати інструмент командного рядка [curl](https://curl.se/) для виконання HTTP-запитів з термінала або командного рядка. Якщо у вас немає `curl`, ви можете його встановити. Ознайомтеся з документацією для вашої операційної системи.

## {{% heading "objectives" %}}

* Оновлення конфігурації через ConfigMap, змонтованого як том
* Оновлення змінних середовища Podʼа за допомогою ConfigMap
* Оновлення конфігурації через ConfigMap в багатоконтейнерному Podʼі
* Оновлення конфігурації через ConfigMap у Podʼі, що містить контейнер Sidecar

<!-- lessoncontent -->

## Оновлення конфігурації через ConfigMap, змонтований як том {#rollout-configmap-volume}

Використовуйте команду `kubectl create configmap` для створення ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap sport --from-literal=sport=football
```

Нижче наведено приклад маніфесту Deployment з ConfigMap `sport`, змонтованим як {{< glossary_tooltip text="том" term_id="volume" >}} у єдиний контейнер Pod.

{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

Перевірте Podʼи цього Deploymentʼа, щоб переконатися, що вони готові (використовуючи {{< glossary_tooltip text="селектор" term_id="selector" >}}):

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

Ви повинні побачити подібний вивід:

```none
NAME                                READY   STATUS    RESTARTS   AGE
configmap-volume-6b976dfdcf-qxvbm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-skpvm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-tbc6r   1/1     Running   0          72s
```

На кожному вузлі, де працює один із цих Podʼів, kubelet отримує дані для цього ConfigMap і перетворює їх на файли у локальному томі. Потім kubelet монтує цей том у контейнер, як зазначено у шаблоні Podʼа. Код, що виконується у цьому контейнері, завантажує інформацію з файлу та використовує її для друку звіту у stdout. Ви можете перевірити цей звіт, переглянувши логи одного з Podʼів у цьому Deploymentʼі:

```shell
# Виберіть один Pod, що належить до Deploymentʼа, і перегляньте його логи
kubectl logs deployments/configmap-volume
```

Ви повинні побачити подібний вивід:

```none
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

В редакторі, що з’явиться, змініть значення ключа `sport` з `football` на `cricket`. Збережіть зміни. Інструмент kubectl відповідним чином оновлює ConfigMap (якщо виникне помилка, спробуйте ще раз).

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

```none
configmap/sport edited
```

Слідкуйте за останніми записами в логах одного з Podʼів, що належить до цього Deploymentʼа:

```shell
kubectl logs deployments/configmap-volume --follow
```

Через кілька секунд ви повинні побачити зміну виводу логів:

```none
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

Коли у вас є ConfigMap, змонтований у працюючий Pod, як том `configMap`, або `projected` том, і ви оновлюєте цей ConfigMap, працюючий Pod майже миттєво бачить це оновлення. Однак ваш застосунок бачить зміни лише в тому випадку, якщо він запрограмований опитувати зміни або стежити за оновленнями файлів. Застосунок, що завантажує свою конфігурацію лише під час запуску, не помітить змін.

{{< note >}}
Загальна затримка з моменту оновлення ConfigMap до моменту, коли нові ключі проєцюються у Pod, може бути такою ж довгою, як і період синхронізації kubelet. Також перевірте [Автоматичне оновлення змонтованих ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically).
{{< /note >}}

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

Перевірте Podʼи цього Deploymentʼа (збігаються з {{< glossary_tooltip text="селектором" term_id="selector" >}}), щоб переконатися, що вони готові :

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

Ви повинні побачити подібний вивід:

```none
NAME                                 READY   STATUS    RESTARTS   AGE
configmap-env-var-59cfc64f7d-74d7z   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-c4wmj   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-dpr98   1/1     Running   0          46s
```

Ключ-значення у ConfigMap налаштовано як змінну середовища в контейнері Podʼа. Перевірте це, переглянувши логи одного Podʼа, що належить до Deploymentʼа.

```shell
kubectl logs deployment/configmap-env-var
```

Ви повинні побачити подібний вивід:

```none
Found 3 pods, using pod/configmap-env-var-7c994f7769-l74nq
Thu Jan  4 16:07:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:26 UTC 2024 The basket is full of apples
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap fruits
```

В редакторі, що зʼявиться, змініть значення ключа `fruits` з `apples` на `mangoes`. Збережіть зміни. Інструмент kubectl відповідним чином оновлює ConfigMap (якщо виникне помилка, спробуйте ще раз).

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

```none
configmap/fruits edited
```

Відстежуйте логи Deployment та спостерігайте за виводом протягом кількох секунд:

```shell
# Як пояснюється у тексті, вивід НЕ змінюється
kubectl logs deployments/configmap-env-var --follow
```

Зверніть увагу, що вивід залишається **незмінним**, навіть якщо ви редагували ConfigMap:

```none
Thu Jan  4 16:12:56 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:26 UTC 2024 The basket is full of apples
```

{{< note >}}
Хоча значення ключа всередині ConfigMap змінилося, змінна середовища в Podʼі все ще показує попереднє значення. Це тому, що змінні середовища для процесу, що виконується всередині Podʼа, **не** оновлюються, коли змінюються вихідні дані; якщо ви хочете оновити їх примусово, вам потрібно змусити Kubernetes замінити наявні Podʼи. Нові Podʼи будуть працювати з оновленою інформацією.
{{< /note >}}

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

```none
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
configmap-env-var   3/3     3            3           12m
```

Перевірте Podʼи:

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

Розгортання змушує Kubernetes створити новий {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}} для Deploymentʼа; це означає, що наявні Podʼи з часом завершуються, а нові створюються. Через кілька секунд ви повинні побачити подібний вивід:

```none
NAME                                 READY   STATUS        RESTARTS   AGE
configmap-env-var-6d94d89bf5-2ph2l   1/1     Running       0          13s
configmap-env-var-6d94d89bf5-74twx   1/1     Running       0          8s
configmap-env-var-6d94d89bf5-d5vx8   1/1     Running       0          11s
```

{{< note >}}
Будь ласка, дочекайтеся повного завершення старих Podʼів, перш ніж продовжувати наступні кроки.
{{< /note >}}

Перегляньте логи для одного з Podʼів у цьому Deploymentʼі:

```shell
# Виберіть один Pod, що належить до Deployment, і перегляньте його логи
kubectl logs deployment/configmap-env-var
```

Ви повинні побачити подібний вивід:

```none
Found 3 pods, using pod/configmap-env-var-6d9ff89fb6-bzcf6
Thu Jan  4 16:30:35 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:45 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:55 UTC 2024 The basket is full of mangoes
```

Це демонструє сценарій оновлення змінних середовища у Podʼі, що отримані з ConfigMap. Зміни до значень ConfigMap застосовуються до Podʼів під час наступного розгортання. Якщо Podʼи створюються з іншої причини, наприклад, при масштабуванні Deployment, тоді нові Podʼи також використовують останні значення конфігурації; якщо ви не ініціюєте розгортання, то ви можете виявити, що ваш застосунок працює зі змішаними старими та новими значеннями змінних середовища.

## Оновлення конфігурації через ConfigMap у багатоконтейнерному Поді {#rollout-configmap-multiple-containers}

Використовуйте команду `kubectl create configmap`, щоб створити ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap color --from-literal=color=red
```

Нижче подано приклад маніфесту для Deployment, що керує набором Podʼів, кожен з двома контейнерами. Два контейнери спільно використовують том `emptyDir`, який вони використовують для звʼязку. Перший контейнер працює як вебсервер (`nginx`). Шлях монтування для спільного тому в контейнері вебсервера — `/usr/share/nginx/html`. Другий допоміжний контейнер базується на `alpine`, і для цього контейнера том `emptyDir` монтується у `/pod-data`. Допоміжний контейнер записує файл у HTML, чий вміст залежить від ConfigMap. Контейнер вебсервера обслуговує HTML за допомогою HTTP.

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

Перевірте Podʼи для цього Deploymentʼа (збігаються з {{< glossary_tooltip text="селектором" term_id="selector" >}}), щоб переконатися, що вони готові:

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

Ви повинні побачити вивід, схожий на:

```none
NAME                                        READY   STATUS    RESTARTS   AGE
configmap-two-containers-565fb6d4f4-2xhxf   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-g5v4j   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-mzsmf   2/2     Running   0          20s
```

Надайте доступ до Deploymentʼа (`kubectl` створює
{{<glossary_tooltip text="Service" term_id="service">}} для вас):

```shell
kubectl expose deployment configmap-two-containers --name=configmap-service --port=8080 --target-port=80
```

Використайте `kubectl`, щоб перенаправити порт:

```shell
kubectl port-forward service/configmap-service 8080:8080 & # залишається запущеним у фоновому режимі
```

Отримайте доступ до Service.

```shell
curl http://localhost:8080
```

Ви повинні побачити вивід, схожий на:

```none
Fri Jan  5 08:08:22 UTC 2024 My preferred color is red
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap color
```

У відкритому редакторі, змініть значення ключа `color` з `red` на `blue`. Збережіть свої зміни. `kubectl` оновлює ConfigMap відповідно (якщо ви побачите помилку, спробуйте ще раз).

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

Затримайтесь на URL сервісу протягом кількох секунд.

```shell
# Скасуйте це, коли будете задоволені (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

Ви повинні побачити, що виведення змінюється наступним чином:

```none
Fri Jan  5 08:14:00 UTC 2024 My preferred color is red
Fri Jan  5 08:14:02 UTC 2024 My preferred color is red
Fri Jan  5 08:14:20 UTC 2024 My preferred color is red
Fri Jan  5 08:14:22 UTC 2024 My preferred color is red
Fri Jan  5 08:14:32 UTC 2024 My preferred color is blue
Fri Jan  5 08:14:43 UTC 2024 My preferred color is blue
Fri Jan  5 08:15:00 UTC 2024 My preferred color is blue
```

## Оновлення конфігурації через ConfigMap у Поді з контейнером sidecar{#rollout-configmap-sidecar}

Вищевказаний сценарій можна відтворити за допомогою [контейнера sidecar](/docs/concepts/workloads/pods/sidecar-containers/) як допоміжного контейнера для запису HTML-файлу. Оскільки контейнер sidecar концептуально є контейнером ініціалізації, гарантується, що він запускається перед головним контейнером вебсервера. Це забезпечує те, що файл HTML завжди доступний, коли вебсервер буде готовий його обслуговувати.

Якщо ви продовжуєте з попереднього сценарію, ви можете використати знову ConfigMap з імʼям `color` для цього сценарію. Якщо ви виконуєте цей сценарій самостійно, використовуйте команду `kubectl create configmap`, щоб створити ConfigMap з [літеральних значень](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):

```shell
kubectl create configmap color --from-literal=color=blue
```

Нижче наведено приклад маніфесту для Deployment, що керує набором Podʼів, кожен з головним контейнером і контейнером sidecar. Обидва контейнери використовують спільний том `emptyDir` для звʼязку. Головний контейнер працює як вебсервер (NGINX). Шлях монтування для спільного тому в контейнері вебсервера — `/usr/share/nginx/html`. Другий контейнер є контейнером sidecar, який базується на Alpine Linux і діє як допоміжний контейнер. Для цього контейнера том `emptyDir` монтується у `/pod-data`. Контейнер sidecar записує файл у HTML, чий вміст залежить від ConfigMap. Контейнер вебсервера обслуговує HTML через HTTP.

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

Перевірте Podʼи для цього Deployment (збігаються з {{< glossary_tooltip text="селектором" term_id="selector" >}}), щоб переконатися, що вони готові:

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

Ви повинні побачити вивід, схожий на:

```none
NAME                                           READY   STATUS    RESTARTS   AGE
configmap-sidecar-container-5fb59f558b-87rp7   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-ccs7s   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-wnmgk   2/2     Running   0          94s
```

Надайте доступ до Deployment (`kubectl` створює
{{<glossary_tooltip text="Service" term_id="service">}} для вас):

```shell
kubectl expose deployment configmap-sidecar-container --name=configmap-sidecar-service --port=8081 --target-port=80
```

Використайте `kubectl`, щоб перенаправити порт:

```shell
kubectl port-forward service/configmap-sidecar-service 8081:8081 & # це залишається запущеним у фоновому режимі
```

Отримайте доступ до Service.

```shell
curl http://localhost:8081
```

Ви повинні побачити вивід, схожий на:

```none
Sat Feb 17 13:09:05 UTC 2024 My preferred color is blue
```

Відредагуйте ConfigMap:

```shell
kubectl edit configmap color
```

У відкритому редакторі змініть значення ключа `color` з `blue` на `green`. Збережіть свої зміни. Інструмент `kubectl` оновлює ConfigMap відповідно (якщо ви побачите помилку, спробуйте ще раз).

Ось приклад того, як може виглядати цей маніфест після редагування:

```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```

Затримайтесь на URL сервісу протягом кількох секунд.

```shell
# Скасуйте це, коли будете задоволені (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

Ви повинні побачити, що вивід змінюється наступним чином:

```none
Sat Feb 17 13:12:35 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:45 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:55 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:05 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:15 UTC 2024 My preferred color is green
Sat Feb 17 13:13:25 UTC 2024 My preferred color is green
Sat Feb 17 13:13:35 UTC 2024 My preferred color is green
```

## Оновлення конфігурації через незмінний ConfigMap, який монтується як том {#rollout-configmap-immutable-volume}

{{< note >}}
Незмінні ConfigMaps особливо корисні для конфігурації, яка є постійною і **не** очікується, що зміниться з часом. Позначення ConfigMap як незмінного дозволяє поліпшити продуктивність, де kubelet не відстежує зміни.

Якщо вам дійсно потрібно внести зміни, вам слід запланувати одне з наступного:

* змінити імʼя ConfigMap та перейти до запуску Podʼів, які посилаються на нове імʼя
* замінити всі вузли в вашому кластері, які раніше запускали Pod, що використовував старе значення
* перезавантажити kubelet на будь-якому вузлі, де kubelet раніше завантажував старий ConfigMap
{{< /note >}}

Нижче наведено приклад маніфесту для [незмінного ConfigMap](/docs/concepts/configuration/configmap/#configmap-immutable).

{{% code_sample file="configmap/immutable-configmap.yaml" %}}

Створіть незмінний ConfigMap:

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

Нижче наведено приклад маніфесту Deployment з незмінним ConfigMap `company-name-20150801`, який монтується як {{< glossary_tooltip text="том" term_id="volume" >}} в єдиний контейнер Pod.

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

Перевірте Podʼи для цього Deploymentʼа (збігаються з {{< glossary_tooltip text="селектором" term_id="selector" >}}), щоб переконатися, що вони готові :

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

Ви повинні побачити вивід схожий на:

```none
ІNAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

Контейнер Podʼа посилається на дані, визначені в ConfigMap, і використовує їх для виводу звіту в stdout. Ви можете перевірити цей звіт, переглянувши логи для одного з Podʼів у цьому Deploymentʼі:

```shell
# Виберіть один Pod, який належить до Deployment, і перегляньте його логи
kubectl logs deployments/immutable-configmap-volume
```

Ви повинні побачити вивід, подібний до:

```none
Found 3 pods, using pod/immutable-configmap-volume-78b6fbff95-5gsfh
Wed Mar 20 03:52:34 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:44 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:54 UTC 2024 The name of the company is ACME, Inc.
```

{{< note >}}
Щойно ConfigMap позначений як незмінний, неможливо скасувати цю зміну ані змінити вміст поля даних або binaryData. Для зміни поведінки Podʼів, які використовують цю конфігурацію, ви створите новий незмінний ConfigMap і редагуватимете Deployment для визначення трохи іншого шаблону Podʼа, з посиланням на новий ConfigMap.
{{< /note >}}

Створіть новий незмінний ConfigMap, використовуючи наведений нижче маніфест:

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

Ви повинні побачити вивід схожий на:

```none
configmap/company-name-20240312 створено
```

Перевірте новостворений ConfigMap:

```shell
kubectl get configmap
```

Ви повинні побачити вивід, який відображає обидва: старий та новий ConfigMaps:

```none
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

Відредагуйте Deployment, щоб вказати новий ConfigMap:

```shell
kubectl edit deployment immutable-configmap-volume
```

В редакторі, що зʼявиться, оновіть наявне визначення тому для використання нового ConfigMap.

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # Оновіть це поле
  name: config-volume
```

Ви маєте побачити вивід, подібний до:

```none
deployment.apps/immutable-configmap-volume edited
```

Це запустить розгортання. Почекайте поки всі раніше створені Podʼи завершаться, а нові Podʼи будуть в стані ready.

Відстежуйте стан Podʼів:

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

```none
NAME                                          READY   STATUS        RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running       0          13s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running       0          14s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running       0          15s
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Terminating   0          32m

```

Ви нарешті побачите вивід, подібний до:

```none
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running   0          43s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running   0          44s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running   0          45s
```

Перевірте логи для одного з Podʼів у цьому Deploymentʼі:

```shell
# Виберіть один Pod, який належить до Deployment, і перегляньте його логи
kubectl logs deployments/immutable-configmap-volume
```

Ви повинні побачити вивід, подібний до:

```none
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

Як тільки всі розгортання мігрують на використання нового незмінного ConfigMap, потрібно видалити старий ConfigMap:

```shell
kubectl delete configmap company-name-20150801
```

## Підсумок {#summary}

Зміни у ConfigMap, змонтованому як том у Pod, стають доступними безперешкодно після наступної синхронізації kubelet.

Зміни у ConfigMap, який налаштовує змінні середовища для Podʼа, стають доступними після наступного розгортання для цього Podʼа.

Після того як ConfigMap позначено як незмінний, неможливо скасувати цю зміну (ви не можете зробити незмінний ConfigMap змінним), і ви також не можете внести жодну зміну до вмісту поля `data` або `binaryData`. Ви можете видалити та створити ConfigMap заново, або можете створити новий відмінний ConfigMap. Коли ви видаляєте ConfigMap, запущені контейнери та їхні Podʼи зберігають точку монтування до будь-якого тому, який посилається на цей наявнийConfigMap.

## {{% heading "cleanup" %}}

Завершіть команди `kubectl port-forward`, якщо вони виконуються.

Видаліть ресурси, створені під час навчання:

```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # У випадку, якщо він не був оброблений під час виконання завдання
```
