---
title: Використання Service для доступу до застосунку
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Дізнайтесь про Service у Kubernetes.
* Дізнайтесь, як мітки та селектори повʼязані з Service.
* Відкрийте доступ до застосунку за межами кластера Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

Команди оболонки в цьому посібнику використовують синтаксис оболонки POSIX, який підтримується стандартними оболонками у більшості систем Linux та macOS (наприклад, bash, zsh або sh). Користувачі Windows повинні використовувати оболонку, сумісну з POSIX, таку як [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) або [Git Bash](https://gitforwindows.org/), щоб виконувати команди у наведеному вигляді. Команди, що використовують `export`, `$()` та подібні конструкції, **не** сумісні з PowerShell або командним рядком Windows.

## Огляд Service у Kubernetes {#overview-of-kubernetes-services}

[Podʼи](/docs/concepts/workloads/pods/) в Kubernetes смертні. Podʼи мають [життєвий цикл](/docs/concepts/workloads/pods/pod-lifecycle/). Коли робочий вузол припиняє існування, Podʼи, що працюють на цьому вузлі, також втрачаються. [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) може потім динамічно повернути кластер до бажаного стану, створивши нові Podʼи, щоб ваш застосунок продовжував працювати. Як інший приклад, розгляньмо бекенд обробки зображень із 3 репліками. Ці репліки взаємозамінні; системі фронтенду не має бути діла до реплік бекенду чи навіть до того, що Pod втрачено та створено наново. Водночас кожен Pod у кластері Kubernetes має унікальну IP-адресу, навіть Podʼи на одному вузлі, тому потрібен спосіб автоматично узгоджувати зміни серед Podʼів, щоб ваші застосунки продовжували працювати.

{{% alert %}}
_Service в Kubernetes — це рівень абстракції, який визначає логічний набір Podʼів і дає змогу відкривати доступ для зовнішнього трафіку, балансувати навантаження та виявляти сервіси для цих Podʼів._
{{% /alert %}}

[Service](/docs/concepts/services-networking/service/) в Kubernetes — це абстракція, яка визначає логічний набір Podʼів і політику доступу до них. Service забезпечують слабке звʼязування між залежними Podʼами. Service визначається за допомогою YAML або JSON, як і всі маніфести обʼєктів Kubernetes. Набір Podʼів, на які спрямований Service, зазвичай визначається _селектором міток (label selector)_ (див. нижче, чому вам може знадобитися Service без `selector` у специфікації).

Хоча кожен Pod має унікальну IP-адресу, ці IP-адреси недоступні за межами кластера без Service. Service дають змогу вашим застосункам отримувати трафік. Доступ до Service можна відкрити різними способами, вказавши `type` у `spec` Service:

* _ClusterIP_ (стандартно) — відкриває доступ до Service на внутрішній IP-адресі в кластері. Цей тип робить Service доступним лише зсередини кластера.

* _NodePort_ — відкриває доступ до Service на тому самому порту кожного вибраного вузла в кластері за допомогою NAT. Робить Service доступним ззовні кластера за адресою `NodeIP:NodePort`. Є надмножиною відносно ClusterIP.

* _LoadBalancer_ — створює зовнішній балансувальник навантаження в поточному хмарному середовищі (якщо підтримується) та призначає фіксовану зовнішню IP-адресу для Service. Є надмножиною відносно NodePort.

* _ExternalName_ — зіставляє Service із вмістом поля `externalName` (наприклад, `foo.bar.example.com`), повертаючи запис `CNAME` з його значенням. Жодне проксіювання не налаштовується.

Додаткову інформацію про різновиди Service можна знайти у посібнику [Використання Source IP](/docs/tutorials/services/source-ip/). Дивіться також [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/).

Крім того, зауважте, що є випадки використання Service, у яких `selector` у специфікації не визначається. Service, створений без `selector`, також не створить відповідний обʼєкт Endpoints. Це дає змогу користувачам вручну зіставляти Service з конкретними точками доступу. Ще одна можлива причина відсутності селектора — використання виключно `type: ExternalName`.

## Service та мітки {#services-and-labels}

Service маршрутизує трафік між набором Podʼів. Service — це абстракція, яка дає змогу Podʼам зникати й реплікуватися в Kubernetes без впливу на ваш застосунок. Виявлення та маршрутизацію між залежними Podʼами (як-от компонентами фронтенду та бекенду застосунку) забезпечують Service Kubernetes.

Service зіставляються з набором Podʼів за допомогою [міток і селекторів](/docs/concepts/overview/working-with-objects/labels) — примітиву групування, який дає змогу виконувати логічні операції з обʼєктами в Kubernetes. Мітки — це пари ключ/значення, прикріплені до обʼєктів, і їх можна використовувати різними способами:

* Позначення обʼєктів для розробки, тестування та промислової експлуатації
* Вбудовування теґів версій
* Класифікація обʼєкта за допомогою теґів

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

Мітки можна прикріплювати до обʼєктів під час створення або пізніше. Їх можна змінювати будь-коли. Тепер відкриймо доступ до нашого застосунку за допомогою Service і застосуймо кілька міток.

### Крок 1: Створення нового Service {#step-1-creating-a-new-service}

Перевірмо, що наш застосунок працює. Ми використаємо команду `kubectl get` і подивимося на наявні Podʼи:

```shell
kubectl get pods
```

Якщо жоден Pod не працює, це означає, що обʼєкти з попередніх посібників було видалено. У такому разі поверніться та створіть Deployment знову за посібником [Використання kubectl для створення Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app). Зачекайте кілька секунд і знову виведіть список Podʼів. Продовжуйте, щойно побачите, що працює один Pod.

Далі виведемо список наявних Service у нашому кластері:

```shell
kubectl get services
```

Щоб відкрити доступ до Deployment для зовнішнього трафіку, ми використаємо команду `kubectl expose` з параметром `--type=NodePort`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Тепер у нас є запущений Service з назвою kubernetes-bootcamp. Тут ми бачимо, що Service отримав унікальну кластерну IP-адресу, внутрішній порт і зовнішню IP-адресу (IP-адресу Вузла).

Щоб дізнатися, який порт було відкрито назовні (для Service з `type: NodePort`), виконаємо підкоманду `describe service`:

```shell
kubectl describe services/kubernetes-bootcamp
```

Створіть змінну середовища з назвою `NODE_PORT` зі значенням призначеного порту вузла:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Тепер ми можемо перевірити, що застосунок доступний за межами кластера за допомогою `curl`, IP-адреси вузла і відкритого назовні порту:

```shell
curl http://"$(minikube ip):$NODE_PORT"
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

Потім використовуйте вказаний URL для доступу до застосунку:

```shell
curl 127.0.0.1:51082
```

{{< /alert >}}

І ми отримуємо відповідь від сервера. Доступ до Service відкрито.

### Крок 2: Використання міток {#step-2-using-labels}

Deployment автоматично створив мітку для нашого Podʼа. За допомогою підкоманди `describe deployment` ви можете побачити імʼя (_ключ_) цієї мітки:

```shell
kubectl describe deployment
```

Використаймо цю мітку, щоб отримати список наших Podʼів. Ми використаємо команду `kubectl get pods` з параметром `-l`, після якого вказуються значення мітки:

```shell
kubectl get pods -l app=kubernetes-bootcamp
```

Ви можете зробити те саме, щоб вивести список наявних Service:

```shell
kubectl get services -l app=kubernetes-bootcamp
```

Отримайте назву Podʼа та збережіть її в змінній середовища `POD_NAME`:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

Щоб застосувати нову мітку, ми використовуємо підкоманду `label`, після якої вказуються тип обʼєкта, назва обʼєкта та нова мітка:

```shell
kubectl label pods "$POD_NAME" version=v1
```

Це додасть нову мітку до нашого Podʼа (ми закріпили за Podʼом версію застосунку), і ми можемо перевірити це за допомогою команди `describe pod`:

```shell
kubectl describe pods "$POD_NAME"
```

Тут ми бачимо, що мітка тепер прикріплена до нашого Podʼа. І тепер ми можемо отримати список Podʼів за новою міткою:

```shell
kubectl get pods -l version=v1
```

І ми бачимо Pod.

### Крок 3: Видалення Service {#step-3-deleting-a-service}

Щоб видалити Service, ви можете використати підкоманду `delete service`. Тут також можна використовувати мітки:

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

Переконайтеся, що Service видалено:

```shell
kubectl get services
```

Це підтверджує, що наш Service видалено. Щоб переконатися, що маршрут більше не доступний, ви можете виконати `curl` на раніше відкриті IP-адресу та порт:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Це доводить, що застосунок більше не доступний ззовні кластера. Ви можете переконатися, що застосунок досі працює, виконавши `curl` зсередини Podʼа:

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

Тут ми бачимо, що застосунок працює. Це тому, що застосунком керує Deployment. Щоб припинити роботу застосунку, вам потрібно також видалити Deployment.

## {{% heading "whatsnext" %}} {#what-s-next}

* Посібник [Запуск кількох екземплярів вашого застосунку](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
* Дізнайтесь більше про [Service](/docs/concepts/services-networking/service/).
