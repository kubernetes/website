---
title: Посібник з роботи з просторами імен
content_type: task
weight: 260
---

<!-- overview -->

{{< glossary_tooltip text="Простори імен" term_id="namespace" >}} Kubernetes допомагають різним проєктам, командам або клієнтам спільно використовувати кластер Kubernetes.

Для цього вони надають:

1. Область видимості для [назв](/docs/concepts/overview/working-with-objects/names/).
2. Механізм для прикріплення авторизації та політик до частини кластера.

Використання кількох просторів імен є необовʼязковим.

У цьому прикладі показано, як використовувати простори імен Kubernetes для розділення вашого кластера.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Передумови {#prerequisites}

У цьому прикладі передбачається таке:

1. У вас є [наявний кластер Kubernetes](/docs/setup/).
2. Ви маєте базове уявлення про {{< glossary_tooltip text="Podʼи" term_id="pod" >}}, {{< glossary_tooltip term_id="service" text="Service" >}} і {{< glossary_tooltip text="Deployment" term_id="deployment" >}} у Kubernetes.

## Ознайомлення зі стандартним простором імен {#understand-the-default-namespace}

Стандартно під час розгортання кластер Kubernetes створює простір імен default для стандартного набору Podʼів, Service і Deployment, що використовуються кластером.

Якщо у вас новий кластер, ви можете переглянути доступні простори імен так:

```shell
kubectl get namespaces
```

```
NAME      STATUS    AGE
default   Active    13m
```

## Створення нових просторів імен {#create-new-namespaces}

Для цієї вправи ми створимо два додаткові простори імен Kubernetes для зберігання нашого вмісту.

Уявімо сценарій, у якому організація використовує спільний кластер Kubernetes для розробки та промислової експлуатації.

Команда розробки хоче мати в кластері простір, де вона може переглядати список Podʼів, Service і Deployment, які використовує для створення та запуску свого застосунку. У цьому просторі ресурси Kubernetes зʼявляються й зникають, а обмеження на те, хто може або не може змінювати ресурси, послаблені, щоб забезпечити гнучку розробку.

Команда експлуатації хоче мати в кластері простір, де вона може запроваджувати суворі процедури щодо того, хто може або не може змінювати набір Podʼів, Service і Deployment, які обслуговують промисловий сайт.

Один із підходів, якого може дотримуватися ця організація, — розділити кластер Kubernetes на два простори імен: `development` і `production`.

Створімо два нових простори імен для зберігання нашої роботи.

Використовуйте файл [`namespace-dev.yaml`](/examples/admin/namespace-dev.yaml), який описує простір імен `development`:

{{% code_sample language="yaml" file="admin/namespace-dev.yaml" %}}

Створіть простір імен `development` за допомогою kubectl.

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.yaml
```

Збережіть такий вміст у файл [`namespace-prod.yaml`](/examples/admin/namespace-prod.yaml), який описує простір імен `production`:

{{% code_sample language="yaml" file="admin/namespace-prod.yaml" %}}

А потім створімо простір імен `production` за допомогою kubectl.

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.yaml
```

Щоб бути впевненими, що все правильно, перелічімо всі простори імен у нашому кластері.

```shell
kubectl get namespaces --show-labels
```

```
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

## Створення Podʼів у кожному просторі імен {#create-pods-in-each-namespace}

Простір імен Kubernetes надає область для Podʼів, Service та Deployment у кластері.

Користувачі, які взаємодіють з одним простором імен, не бачать вмісту в іншому просторі імен.

Щоб продемонструвати це, запустімо простий Deployment та Podʼи у просторі імен `development`.

Спочатку перевірмо поточний контекст:

```shell
kubectl config view
```

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: REDACTED
    server: https://130.211.122.180
  name: lithe-cocoa-92103_kubernetes
contexts:
- context:
    cluster: lithe-cocoa-92103_kubernetes
    user: lithe-cocoa-92103_kubernetes
  name: lithe-cocoa-92103_kubernetes
current-context: lithe-cocoa-92103_kubernetes
kind: Config
preferences: {}
users:
- name: lithe-cocoa-92103_kubernetes
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
    token: 65rZW78y8HbwXXtSXuUw9DbP4FLjHi4b
- name: lithe-cocoa-92103_kubernetes-basic-auth
  user:
    password: h5M0FtUUIflBSdI7
    username: admin
```

```shell
kubectl config current-context
```

```
lithe-cocoa-92103_kubernetes
```

Наступний крок — визначення контексту для клієнта kubectl для роботи в кожному просторі імен. Значення полів "cluster" та "user" копіюються з поточного контексту.

```shell
kubectl config set-context dev --namespace=development \
  --cluster=lithe-cocoa-92103_kubernetes \
  --user=lithe-cocoa-92103_kubernetes

kubectl config set-context prod --namespace=production \
  --cluster=lithe-cocoa-92103_kubernetes \
  --user=lithe-cocoa-92103_kubernetes
```

Стандартно наведені вище команди додають два контексти, які зберігаються у файлі `.kube/config`. Тепер ви можете переглянути контексти й перемикатися між двома новими контекстами запитів залежно від того, з яким простором імен ви хочете працювати.

Щоб переглянути нові контексти:

```shell
kubectl config view
```

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: REDACTED
    server: https://130.211.122.180
  name: lithe-cocoa-92103_kubernetes
contexts:
- context:
    cluster: lithe-cocoa-92103_kubernetes
    user: lithe-cocoa-92103_kubernetes
  name: lithe-cocoa-92103_kubernetes
- context:
    cluster: lithe-cocoa-92103_kubernetes
    namespace: development
    user: lithe-cocoa-92103_kubernetes
  name: dev
- context:
    cluster: lithe-cocoa-92103_kubernetes
    namespace: production
    user: lithe-cocoa-92103_kubernetes
  name: prod
current-context: lithe-cocoa-92103_kubernetes
kind: Config
preferences: {}
users:
- name: lithe-cocoa-92103_kubernetes
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
    token: 65rZW78y8HbwXXtSXuUw9DbP4FLjHi4b
- name: lithe-cocoa-92103_kubernetes-basic-auth
  user:
    password: h5M0FtUUIflBSdI7
    username: admin
```

Перемкнімся, щоб працювати у просторі імен `development`.

```shell
kubectl config use-context dev
```

Ви можете перевірити поточний контекст так:

```shell
kubectl config current-context
```

```
dev
```

На цьому етапі всі запити, які ми надсилаємо до кластера Kubernetes з командного рядка, обмежені простором імен `development`.

Створімо деякий вміст.

{{% code_sample file="admin/snowflake-deployment.yaml" %}}

Застосуйте маніфест для створення Deployment

```shell
kubectl apply -f https://k8s.io/examples/admin/snowflake-deployment.yaml
```

Ми створили Deployment з 2 репліками, який запускає Pod під назвою `snowflake` з базовим контейнером, що віддає імʼя хоста.

```shell
kubectl get deployment
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
snowflake    2/2     2            2           2m
```

```shell
kubectl get pods -l app=snowflake
```

```
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

І це чудово, розробники можуть робити все, що вони хочуть, і їм не потрібно хвилюватися про вплив на вміст у просторі імен `production`.

Тепер перейдемо до простору імен `production` та покажемо, як ресурси в одному просторі імен приховані від іншого.

```shell
kubectl config use-context prod
```

Простір імен `production` має бути порожнім, і ці команди не мають нічого повернути.

```shell
kubectl get deployment
kubectl get pods
```

У промисловому середовищі люблять запускати «худобу» (cattle), тож створімо кілька Podʼів `cattle`.

```shell
kubectl create deployment cattle --image=registry.k8s.io/serve_hostname --replicas=5

kubectl get deployment
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
cattle       5/5     5            5           10s
```

```shell
kubectl get pods -l app=cattle
```

```
NAME                      READY     STATUS    RESTARTS   AGE
cattle-2263376956-41xy6   1/1       Running   0          34s
cattle-2263376956-kw466   1/1       Running   0          34s
cattle-2263376956-n4v97   1/1       Running   0          34s
cattle-2263376956-p5p3i   1/1       Running   0          34s
cattle-2263376956-sxpth   1/1       Running   0          34s
```

На цьому етапі повинно бути зрозуміло, що ресурси, які користувачі створюють в одному просторі імен, приховані від іншого простору імен.

З розвитком підтримки політики в Kubernetes ми розширимо цей сценарій, щоб показати, як можна надавати різні правила авторизації для кожного простору імен.
