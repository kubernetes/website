---
title: Компоненти Kubernetes
content_type: concept
description: >
  Кластер Kubernetes складається з компонентів, які є частиною панелі управління та набору машин, які називаються вузлами.
weight: 30
card: 
  title: Компоненти кластера
  name: concepts
  weight: 20
---

<!-- overview -->

В результаті розгортання Kubernetes ви отримуєте кластер.
{{< glossary_definition term_id="cluster" length="all" prepend="Кластер Kubernetes — це ">}}

Цей документ описує різні компоненти, які вам потрібні для повноцінного та працездатного кластера Kubernetes.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="Компоненти кластера Kubernetes" class="diagram-large" >}}

<!-- body -->

## Компоненти панелі управління {#control-plane-components}

Компонент панелі управління приймають глобальні рішення щодо кластера (наприклад, планування), а також виявляють та реагують на події кластера (наприклад, запуск нового {{< glossary_tooltip text="Podʼу" term_id="pod" >}} якщо поле `{{< glossary_tooltip text="replicas" term_id="replica" >}}` Deploymentʼу не задовільне).

Компоненти панелі управління можуть запускатись будь-якій машині в кластері. Однак для спрощення сценарії налаштування зазвичай запускають усі компоненти рівня керування на одній машині та не запускають контейнери користувача на цій машині. Дивіться [Створення кластера високої доступності за допомогою kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) для прикладу розгортання панелі управління, яка працює на кількох машинах.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Існує багато різних типів контролерів. Декілька прикладів:

* Контролер вузла (Node controller): Відповідає за виявлення та реакцію, коли вузли виходять з ладу.
* Контролер завдань (Job controller): Спостерігає за обʼєктами Job, які представляють одноразові завдання, а потім створює
    Podʼи для виконання цих завдань до завершення.
* Контролер EndpointSlice: Заповнює обʼєкти EndpointSlice (для надання звʼязку між Serviceʼами та Podʼами).
* Контролер облікового запису служби (ServiceAccount controller): Створює стандартні облікові записи служби для нових просторів імен.

Вище наведений перелік не є вичерпним.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

`cloud-controller-manager` запускає лише ті контролери, які є специфічними для вашого хмарного постачальника. Якщо ви використовуєте Kubernetes на власних серверах або у навчальному середовищі на своєму ПК, кластер не має менеджера хмарових контролерів.

Так само як і з `kube-controller-manager`, `cloud-controller-manager` обʼєднує кілька логічно незалежних кілець управління в єдиний виконуваний файл, який ви запускаєте як один процес. Ви можете масштабувати його горизонтально (запускати більше одного екземпляра), щоб покращити продуктивність чи допомогти витримати випадки відмов.

Наступні контролери можуть мати залежності від хмарного постачальника:

* Контролер вузла (Node controller): Для перевірки хмарного постачальника з метою визначення, чи був вузол видалений у хмарі після того, як він перестав відповідати.
* Контролер маршруту (Route controller): Для налаштування маршрутів в основній інфраструктурі хмари.
* Контролер служби (Service controller): Для створення, оновлення та видалення балансувальників навантаження хмарового постачальника.

## Компоненти вузлів {#node-components}

Компоненти вузлів запускаються на кожному вузлі, і вони відповідають за запуск Podʼів та забезпечення середовища виконання Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Середовище виконання контейнерів (Container runtime) {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Доповнення {#addons}

Доповнення використовують ресурси ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, та інші) для реалізації функцій кластера. Оскільки вони надають функції на рівні кластера, ресурси простору імен для додатків належать до простору імен `kube-system`.

Деякі доповнення описані нижче; за повним переліком доповнень звертайтесь до розділу [Доповнення](/docs/concepts/cluster-administration/addons/).

### DNS

Хоча інші додатки не є строго обовʼязковими, у всіх кластерах Kubernetes повинен бути [кластерний DNS](/docs/concepts/services-networking/dns-pod-service/), оскільки багато прикладів покладаються на його наявність.

Кластерний DNS — це DNS-сервер, додатковий до інших DNS-серверів у вашому середовищі, який обслуговує DNS-записи для служб Kubernetes.

Контейнери, які запускаються за допомогою Kubernetes, автоматично включають цей DNS-сервер у свій пошук DNS.

### Web UI (Dashboard) {#web-ui-dashboard}

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) — це універсальний вебінтерфейс для кластерів Kubernetes. Він дозволяє користувачам керувати та розвʼязувати проблеми з застосунками, які працюють у кластері, а також самим кластером.

### Моніторинг ресурсів контейнера {#container-resource-monitoring}

[Моніторинг ресурсів контейнера](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) веде запис загальних метрик часових рядів
щодо контейнерів у центральній базі даних та надає інтерфейс користувача для перегляду цих даних.

### Логування на рівні кластера {#cluster-level-logging}

Механізм [логування на рівні кластера](/docs/concepts/cluster-administration/logging/) відповідає за збереження логів контейнерів у центральному сховищі логів з інтерфейсом пошуку/перегляду.

### Втулки мережі {#network-plugins}

[Втулки мережі](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins) – це програмні компоненти, які впроваджують специфікацію інтерфейсу мережі контейнера (CNI). Вони відповідають за виділення IP-адрес для Podʼів та уможливлюють їм взаємодію один з одним у межах кластера.

## {{% heading "whatsnext" %}}

Дізнайтесь також про:

* [Вузли](/docs/concepts/architecture/nodes/) та [обмін трафіком між ними](/docs/concepts/architecture/control-plane-node-communication/) та панеллю управління.
* [Контролери](/docs/concepts/architecture/controller/) Kubernetes.
* [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/), який є стандартним планувальником Kubernetes.
* Офіційна [документація](https://etcd.io/docs/) etcd.
* Кілька [середовищ виконання контейнерів](/docs/setup/production-environment/container-runtimes/) в Kubernetes.
* Інтеграці з хмарними постачальниками з використанням [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
* Команди [kubectl](/docs/reference/generated/kubectl/kubectl-commands).
