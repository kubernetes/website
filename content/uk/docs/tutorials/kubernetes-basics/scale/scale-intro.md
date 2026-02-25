---
title: Запуск кількох екземплярів вашого застосунку
weight: 10
---

## {{% heading "objectives" %}}

* Масштабування застосунку вручну за допомогою kubectl.

## Масштабування застосунку {#scaling-an-application}

{{% alert %}}
_Ви можете створити Deployment з декількома екземплярами з самого початку за допомогою параметра `--replicas` команди `kubectl create deployment`._
{{% /alert %}}

Раніше ми створили [Deployment](/docs/concepts/workloads/controllers/deployment/), а потім робили його загальнодоступним за допомогою [Service](/docs/concepts/services-networking/service/). Deployment створив лише один Pod для запуску нашого застосунку. Зі збільшенням трафіку, нам потрібно масштабувати застосунок, щоб відповідати зростаючим вимогам користувачів.

Якщо ви ще не працювали над попередніми розділами, почніть з [Використання minikube для створення кластера](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

_Масштабування_ досягається зміною кількості реплік в Deployment..

{{< note >}}
Якщо ви спробуєте це після [попереднього розділу](/docs/tutorials/kubernetes-basics/expose/expose-intro/), то, можливо, ви видалили Service, який створили, або створили Service з `type: NodePort`. У цьому розділі припускається, що для Deployment kubernetes-bootcamp створено Service з `type: LoadBalancer`.

Якщо ви _не_ видалили Service, створений у [попередньому розділі](/docs/tutorials/kubernetes-basics/expose/expose-intro), спочатку видаліть цей Service, а потім запустіть наступну команду для створення нового Service з параметром `type` встановленим на `LoadBalancer`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```

{{< /note >}}

## Огляд масштабування {#scaling-overview}

<!-- animation -->
<!-- <div class="col-md-8">
  <div id="myCarousel" class="carousel" data-ride="carousel" data-interval="3000">
    <div class="carousel-inner" role="listbox">
      <div class="item carousel-item active">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg">
      </div>
      <div class="item carousel-item">
        <img src="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg">
      </div>
    </div>
  </div>
</div> -->
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

Масштабування Deployment гарантує створення нових Podʼів і їх призначення на Вузли з вільними ресурсами. Масштабування збільшить кількість Podʼів до нового бажаного стану. Kubernetes також підтримує [автоматичне масштабування](/docs/concepts/workloads/autoscaling/) Podʼів, але це виходить за рамки цього посібника. Також можливе масштабування до нуля, і це призведе до завершення всіх Podʼів вказаного Deployment.

Запуск кількох екземплярів застосунку вимагає засобів для розподілу трафіку між ними. У Service є вбудований балансувальник навантаження, який розподілить мережевий трафік на всі Podʼи, які експонує Deployment. Service будуть постійно відстежувати робочі Podʼи, використовуючи точки доступу, щоб гарантувати, що трафік направляється лише на доступні Podʼи.

Після того, як ви запустите кілька екземплярів застосунку, ви зможете виконувати Rolling-оновлення без простоїв. Ми розглянемо це у наступному розділі підручника. Тепер перейдемо до термінала і масштабуємо наш застосунок.

### Масштабування Deployment {#scaling-a-deployment}

Щоб переглянути свій Deployment, використовуйте команду `get deployments`:

```shell
kubectl get deployments
```

Вивід повинен бути схожий на:

```console
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

Маємо 1 Pod. Якщо його немає, виконайте команду ще раз. Тут маємо:

* _NAME_ показує імена Deploymentʼів у кластері.
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
* _CURRENT_ — показує, скільки реплік в цей час працюють.

Далі масштабуймо Deployment до 4 реплік. Ми використаємо команду `kubectl scale`, за якою слідує тип Deployment, назва та бажана кількість екземплярів:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

Щоб знову переглянути свої Deployment, використовуйте `get deployments`:

```shell
kubectl get deployments
```

Зміни були застосовані, і у нас є 4 екземпляри застосунку. Далі перевірмо, чи змінилася кількість Podʼів:

```shell
kubectl get pods -o wide
```

Тепер є 4 Podʼа з різними IP-адресами. Зміна була зареєстрована в журналі подій Deployment. Щоб перевірити це, використовуйте команду `describe`:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

Ви також можете побачити, що у виводі цієї команди тепер є 4 репліки.

### Балансування навантаження {#load-balancing}

Перевіримо, чи Service балансує трафік. Щоб дізнатися зовнішній IP та порт, ми можемо використовувати команду `describe service`, як ми дізнались в попередній частині посібника:

```shell
kubectl describe services/kubernetes-bootcamp
```

Створіть змінну середовища з іменем `NODE_PORT`, яка має значення як порт Вузла:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Далі ми запустимо `curl` з зовнішньою IP-адресою та портом. Виконайте команду кілька разів:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Ми потрапляємо на різні Podʼи при кожному запиті. Це демонструє, що балансування навантаження працює.

Вивід має бути схожим на:

```console
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< note >}}
Якщо ви використовуєте minikube з Docker Desktop як драйвер контейнера, потрібен тунель minikube. Це через те, що контейнери всередині Docker Desktop ізольовані від вашого компʼютера-хосту.

В окремому вікні термінала виконайте:

```shell
minikube service kubernetes-bootcamp --url
```

Вивід виглядає так:

```console
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Потім використовуйте наданий URL для доступу до застосунку:

```shell
curl 127.0.0.1:51082
```

{{< /note >}}

### Зменшення масштабу розгортання {#scale-down}

Щоб зменшити Deployment до 2 реплік, знову запустіть команду `scale`:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Перевірте Deployment, щоб переконатися, що зміни були застосовані, за допомогою команди `get deployments`:

```shell
kubectl get deployments
```

Кількість реплік зменшилася до 2. Перегляньте кількість Podʼів за допомогою `get pods`:

```shell
kubectl get pods -o wide
```

Це підтверджує, що роботу двох Podʼів було завершено.

## {{% heading "whatsnext" %}}

* Підручник [Виконання поступового оновлення](/docs/tutorials/kubernetes-basics/update/update-intro/).
* Дізнайтесь більше про [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* Дізнайтесь більше про [Автоматичне масштабування](/docs/concepts/workloads/autoscaling/).
