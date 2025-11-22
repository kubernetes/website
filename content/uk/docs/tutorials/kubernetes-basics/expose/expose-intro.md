---
title: Використання Service для доступу до застосунку
weight: 10
---

## {{% heading "objectives" %}}

* Дізнайтесь про Service у Kubernetes.
* найомтесь з тим, як мітки та селектори повʼязані з Service.
* Відкрийте доступ до застосунку по за межами Kubernetes кластера.

## Огляд Сервісів в Kubernetes {#overview-of-kubernetes-services}

Існування [Podʼів](/docs/concepts/workloads/pods/) в Kubernetes є обмеженими за часом, також вони мають свій [життєвий цикл](/docs/concepts/workloads/pods/pod-lifecycle/). Коли робочий вузол припиняє існування, також втрачаються Podʼи, які виконуються на цьому Вузлі. [Replicaset](/docs/concepts/workloads/controllers/replicaset/) може динамічно приводити кластер до бажаного стану шляхом створення нових Podʼів, щоб ваш застосунок продовжував працювати. As another example, consider an image-processing
backend with 3 replicas. Наприклад, розгляньмо обробник зображень, що має 3 копії. Ці копії (репліки) можуть бути взаємозамінні; система форонтенду не повинна перейматися репліками бекенду або навіть тим, чи Pod втрачено та створено наново. Проте кожен Pod в кластері Kubernetes має унікальну IP-адресу, навіть Podʼи на одному Вузлі, тому потрібно мати спосіб автоматичного узгодження змін серед Podʼів, щоб ваші застосунки продовжували працювати.

{{% alert %}}
_Service в Kubernetes – це рівень абстракції, який визначає логічний набір Podʼів і дозволяє передачу трафіку назовні, балансування навантаження та виявлення сервісів для цих Podʼів._
{{% /alert %}}

[Service](/docs/concepts/services-networking/service/) в Kubernetes є абстракцією, яка визначає логічний набір Podʼів та політику доступу до них. Serviceʼи забезпечують вільне зʼєднання між залежними Podʼами. Service визначається за допомогою YAML або JSON, так само як і всі обʼєкти Kubernetes. Набір Podʼів, на які поширюється дія Service, зазвичай визначається _селектором міток (label selector)_ (див. нижче, чому `selector` іноді не включають у специфікацію Service).

Хоча кожний Pod має унікальну IP-адресу, ці IP не доступні за межами кластера без використання Service. Serviceʼи уможливлюють надходження трафіку до ваших застосунків. Serviceʼи можуть бути експоновані у різний спосіб, за допомогою `type` у `spec` Service:

* _ClusterIP_ (стандартно) — експонує Service на внутрішній IP-адресі в кластері. Цей тип робить Service доступним лише зсередини кластера.

* _NodePort_ — експонує Service на одному порту кожного вибраного вузла в кластері за допомогою NAT. Робить Service доступним ззовні кластера за допомогою `NodeIP:NodePort`. Є надмножиною відносно ClusterIP.

* _LoadBalancer_ — створює зовнішній балансувальник навантаження в поточному хмарному середовищі (якщо підтримується) та призначає фіксовану зовнішню IP-адресу для Service. Є надмножиною відносно NodePort..

* _ExternalName_ — звʼязує Service з вмістом поля `externalName` (наприклад, `foo.bar.example.com`), повертаючи запис `CNAME` із його значенням. е встановлюється жодного проксі. Цей тип вимагає v1.7 або вище `kube-dns` або CoreDNS версії 0.0.8 або вище.

Додаткову інформацію про різновиди Service можна знайти у посібнику [Використання Source IP](/docs/tutorials/services/source-ip/). Дивіться також [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/).

Крім того, слід зауважити, що існують випадки використання Service, при яких не визначається `selector` у специфікації. Service, створений без `selector` також не створить відповідний обʼєкт Endpoints. Це дозволяє користувачам вручну відкривати доступ Service на конкретні точки доступу. Ще одна можливість, чому може бути відсутній селектор — використання виключно `type: ExternalName`.

## Services та мітки (Labels) {#services-and-labels}

Service маршрутизує трафік набору Podʼів. Service є абстракцією, яка дозволяє podʼам зникати та відновлюватись в Kubernetes, не впливаючи на ваш застосунок. Виявлення та маршрутизація серед залежних Podʼів (таких як компоненти frontend та backend у застосунку) обробляються Serviceʼами Kubernetes.

Services поєднуються з набором Podʼів використовуючи [мітки та селектори](/docs/concepts/overview/working-with-objects/labels), примітиву гуртування, який дозволяє логічно взаємодіяти з обʼєктами в Kubernetes. Мітки — це пари ключ/значення, призначені обʼєктам та можуть бути використані різними способами:

* Призначення обʼєктів до оточення розробки, тестування та промислової експлуатації
* Вбудовування теґів версій
* Класифікація обʼєкта за допомогою теґів

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

Мітки можна прикріплювати до обʼєктів при їх створенні або пізніше. Їх можна змінювати в будь-який час. Давайте зараз використаємо Service для надання доступу до нашого застосунку та застосуємо деякі мітки.

### Крок 1: Створення нового Service {#step-1-creating-a-new-service}

Перевіримо, що наш застосунок працює. Ми використовуватимемо команду `kubectl get` та подивимось на наявні Podʼи:

```shell
kubectl get pods
```

Якщо Podʼи не запущені, це означає, що обʼєкти з попередніх кроків були видалені. У цьому випадку поверніться та створіть Deployment з посібника [Використання kubectl для створення Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app). Зачекайте кілька секунд та перегляньте список Podʼів знову. Ви можете продовжити, як тільки побачите, що один Pod працює.

Далі виведемо список наявних Serviceʼів у нашому кластері:

```shell
kubectl get services
```

Для експонування розгортання для зовнішнього трафіку ми будемо використовувати команду `kubectl expose` з параметром `--type=NodePort`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Тепер у нас є запущений Service з назвою kubernetes-bootcamp. Тут ми бачимо, що Service отримав унікальну кластерну IP-адресу, внутрішній порт і зовнішню IP-адресу (IP-адресу Вузла).

Щоб дізнатися, який порт було відкрито назовні (для сервісу `type: NodePort`), виконаємо підкоманду `describe service`:

```shell
kubectl describe services/kubernetes-bootcamp
```

Створіть змінну оточення з назвою `NODE_PORT`, якій буде присвоєно значення порту вузла:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Тепер ми можемо перевірити, що застосунок доступний за межами кластера за допомогою `curl`, IP-адреси вузла і відкритого назовні порту:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

{{< note >}}
Якщо ви використовуєте minikube з Docker Desktop як драйвер контейнера, потрібно використовувати minikube tunnel. Це тому, що контейнери всередині Docker Desktop ізольовані від вашого компʼютера.

В окремому вікні термінала виконайте:

```shell
minikube service kubernetes-bootcamp --url
```

Вивід виглядає так:

```console
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Потім використовуйте вказаний URL для доступу до застосунку:

```shell
curl 127.0.0.1:51082
```

{{< /note >}}

І, ми отримуємо відповідь від сервера. Service — працює.

### Крок 2: Використання міток {#step-2-using-labels}

Deployment автоматично створив мітку для нашого Podʼа. За допомогою команди `describe deployment` ви можете побачити імʼя (_ключ_) цієї мітки:

```shell
kubectl describe deployment
```

Використаємо цю мітку для отримання списку наших Podʼів. Ми використовуватимемо команду `kubectl get pods` з параметром `-l`, за яким слідують значення мітки:

```shell
kubectl get pods -l app=kubernetes-bootcamp
```

Ви можете зробити те саме, щоб вивести список поточних Services:

```shell
kubectl get services -l app=kubernetes-bootcamp
```

Отримайте назву Podʼа та збережіть її в змінній середовища `POD_NAME`:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

Для застосування нової мітки ми використовуємо команду `label` за якою слідує тип обʼєкта, назва обʼєкта та нова мітка:

```shell
kubectl label pods "$POD_NAME" version=v1
```

Це додасть нову мітку до нашого Podʼа (ми закріпили версію програми для Podʼа), і ми можемо перевірити це за допомогою команди `describe pod`:

```shell
kubectl describe pods "$POD_NAME"
```

Тут ми бачимо, що мітка тепер прикріплена до нашого Podʼа. Тепер ми можемо переглянути список podʼів за допомогою нової мітки:

```shell
kubectl get pods -l version=v1
```

І, ми бачимо Pod.

### Крок 3: Видалення Service {#step-3-deleting-a-service}

Для видалення Service ви можете використовувати команду `delete service`. Тут також можна використовувати мітки:

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

Переконайтеся, що Service видалено:

```shell
kubectl get services
```

Це підтверджує, що наш Service видалено. Щоб переконатися, що маршрут більше не експонується, ви можете перевірити раніше експоновані IP та порт за допомогою `curl`:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Це доводить, що застосунок більше не доступний ззовні кластера. Ви можете переконатись, що застосунок все ще працює за допомогою `curl` з середини podʼа:

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

Тут ми бачимо, що застосунок працює. Це тому, що Deployment управляє застосунком. Для припинення роботи застосунку вам слід видалити також й Deployment.

## {{% heading "whatsnext" %}}

* Підручник [Запуск кількох екземплярів вашого застосунку](/docs/tutorials/kubernetes-basics/scale/scale-intro/).
* Дізнайтесь більше про [Service](/docs/concepts/services-networking/service/).
