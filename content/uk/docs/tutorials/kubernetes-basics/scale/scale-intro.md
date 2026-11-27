---
title: Запуск кількох екземплярів вашого застосунку
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Масштабуйте наявний застосунок вручну за допомогою kubectl.

## {{% heading "prerequisites" %}} {#before-you-begin}

Команди оболонки в цьому посібнику використовують синтаксис оболонки POSIX, який підтримується стандартними оболонками у більшості систем Linux та macOS (наприклад, bash, zsh або sh). Користувачі Windows повинні використовувати оболонку, сумісну з POSIX, таку як [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) або [Git Bash](https://gitforwindows.org/), щоб виконувати команди у наведеному вигляді. Команди, що використовують `export`, `$()` та подібні конструкції, **не** сумісні з PowerShell або командним рядком Windows.

## Масштабування застосунку {#scaling-an-application}

{{% alert %}}
_Ви можете одразу створити Deployment з кількома екземплярами за допомогою параметра `--replicas` команди `kubectl create deployment`._
{{% /alert %}}

Раніше ми створили [Deployment](/docs/concepts/workloads/controllers/deployment/), а потім зробили його загальнодоступним за допомогою [Service](/docs/concepts/services-networking/service/). Deployment створив лише один Pod для запуску нашого застосунку. Коли трафік зростатиме, нам потрібно буде масштабувати застосунок, щоб задовольнити потреби користувачів.

Якщо ви ще не працювали над попередніми розділами, почніть з [Використання minikube для створення кластера](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

_Масштабування_ досягається зміною кількості реплік у Deployment.

{{< alert color="info" title="Примітка" >}}
Якщо ви спробуєте це після [попереднього розділу](/docs/tutorials/kubernetes-basics/expose/expose-intro/), то, можливо, ви видалили Service, який створили, або створили Service з `type: NodePort`. У цьому розділі припускається, що для Deployment kubernetes-bootcamp створено Service з `type: LoadBalancer`.

Якщо ви _не_ видалили Service, створений у [попередньому розділі](/docs/tutorials/kubernetes-basics/expose/expose-intro), спочатку видаліть цей Service, а потім виконайте цю команду, щоб створити новий Service з `type`, встановленим у `LoadBalancer`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```

{{< /alert >}}

## Огляд масштабування {#scaling-overview}

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
_Масштабування здійснюється шляхом зміни кількості реплік у Deployment._
{{% /alert %}}

Збільшення масштабу Deployment гарантує, що буде створено нові Podʼи і їх буде заплановано на вузли з доступними ресурсами. Масштабування збільшить кількість Podʼів до нового бажаного стану. Kubernetes також підтримує [автоматичне масштабування](/docs/concepts/workloads/autoscaling/) Podʼів, але це виходить за рамки цього посібника. Також можливе масштабування до нуля, і тоді роботу всіх Podʼів вказаного Deployment буде завершено.

Запуск кількох екземплярів застосунку потребує способу розподіляти трафік між ними. У Service є вбудований балансувальник навантаження, який розподіляє мережевий трафік між усіма Podʼами Deployment, до якого відкрито доступ. Service постійно відстежують запущені Podʼи за допомогою точок доступу, щоб трафік надходив лише на доступні Podʼи.

Коли у вас працює кілька екземплярів застосунку, ви можете виконувати поетапні оновлення без простою. Ми розглянемо це в наступному розділі посібника. А тепер перейдімо до термінала і масштабуймо наш застосунок.

### Масштабування Deployment {#scaling-a-deployment}

Щоб вивести список ваших Deployment, скористайтеся підкомандою `get deployments`:

```shell
kubectl get deployments
```

Вивід повинен бути схожий на:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

У нас має бути 1 Pod. Якщо ні, виконайте команду ще раз. Тут показано:

* _NAME_ показує імена Deployment у кластері.
* _READY_ показує співвідношення поточних/бажаних реплік
* _UP-TO-DATE_ показує кількість реплік, які були оновлені для досягнення бажаного стану.
* _AVAILABLE_ показує, скільки реплік застосунку доступно вашим користувачам.
* _AGE_ показує кількість часу, протягом якого працює застосунок.

Щоб переглянути ReplicaSet, створений Deployment, виконайте:

```shell
kubectl get rs
```

Зверніть увагу, що назва ReplicaSet завжди форматується як <nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr>. Випадковий рядок генерується випадковим чином та використовує `pod-template-hash` як основу для створення.

Два важливі стовпці цього виводу:

* _DESIRED_ — показує бажану кількість реплік застосунку, яку ви визначаєте під час створення Deployment. Це бажаний стан.
* _CURRENT_ — показує, скільки реплік зараз працює.

Далі масштабуймо Deployment до 4 реплік. Ми використаємо команду `kubectl scale`, після якої вказуються тип Deployment, назва та бажана кількість екземплярів:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

Щоб знову переглянути свої Deployment, використовуйте `get deployments`:

```shell
kubectl get deployments
```

Зміни застосовано, і тепер доступні 4 екземпляри застосунку. Далі перевірмо, чи змінилася кількість Podʼів:

```shell
kubectl get pods -o wide
```

Тепер є 4 Podʼи з різними IP-адресами. Зміну зареєстровано в журналі подій Deployment. Щоб перевірити це, скористайтеся підкомандою `describe`:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

Ви також можете побачити, що у виводі цієї команди тепер є 4 репліки.

### Балансування навантаження {#load-balancing}

Перевірмо, чи Service балансує трафік. Щоб дізнатися відкриті IP-адресу та порт, ми можемо використати `describe service`, як ми дізналися в попередній частині посібника:

```shell
kubectl describe services/kubernetes-bootcamp
```

Створіть змінну середовища з іменем `NODE_PORT` зі значенням порту вузла:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Далі виконаємо `curl` на відкриті IP-адресу та порт. Виконайте команду кілька разів:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

З кожним запитом ми потрапляємо на інший Pod. Це демонструє, що балансування навантаження працює.

Вивід має бути схожим на:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< alert color="info" title="Примітка" >}}
Якщо ви використовуєте minikube з Docker Desktop як драйвер контейнерів, потрібен тунель minikube. Це тому, що контейнери всередині Docker Desktop ізольовані від вашого компʼютера-хоста.

В окремому вікні термінала виконайте:

```shell
minikube service kubernetes-bootcamp --url
```

Вивід виглядає так:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Потім використовуйте наданий URL для доступу до застосунку:

```shell
curl 127.0.0.1:51082
```

{{< /alert >}}

### Зменшення масштабу {#scale-down}

Щоб зменшити Deployment до 2 реплік, знову виконайте підкоманду `scale`:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Виведіть список Deployment за допомогою підкоманди `get deployments`, щоб перевірити, чи застосовано зміни:

```shell
kubectl get deployments
```

Кількість реплік зменшилася до 2. Перегляньте кількість Podʼів за допомогою `get pods`:

```shell
kubectl get pods -o wide
```

Це підтверджує, що роботу двох Podʼів було завершено.

## {{% heading "whatsnext" %}} {#what-s-next}

* Посібник [Виконання поетапного оновлення](/docs/tutorials/kubernetes-basics/update/update-intro/).
* Дізнайтесь більше про [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Дізнайтесь більше про [Автоматичне масштабування](/docs/concepts/workloads/autoscaling/).
