---
title: Компоненти Kubernetes
content_type: concept
weight: 10
description: >
  Kubernetes кластер складається з компонентів, що становлять собою control plane, а також групи обчислювальних машин, що називаються nodes  
card:
  name: concepts
  weight: 10
--

<!-- overview -->
Коли ви розгортаєте Kubernetes, ви отримуєте кластер. 
{{< glossary_definition term_id="cluster" length="all" prepend="Kubernetes кластер складається з">}}

Цей документ описує різні компоненти, які є необхідними для повноціного робочого кластеру Kubernetes. 

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Компоненти Kubernetes кластеру" caption="Компоненти Kubernetes кластеру" class="diagram-large" >}}

<!-- body -->
## Control Plane компоненти




The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new {{< glossary_tooltip text="pod" term_id="pod">}} when a deployment's `replicas` field is unsatisfied).

Control plane components can be run on any machine in the cluster. However,
for simplicity, set up scripts typically start all control plane components on
the same machine, and do not run user containers on this machine. See
[Creating Highly Available clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
for an example control plane setup that runs across multiple machines.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Деякі типи цих controllers:

  * Node controller: Відповідає за доставку повідомлень та відповідає на запити, коли nodes перестають працювати.
  * Job controller: Спостерігає за Job обʼєктами, що відповідають за одноразові задачі, а потім створє Pods, що будуть виконувати ці завдання до повного їх завершення.
  * Endpoints controller: Заповнює Endpoint обʼєкти, тобто обєднує Services та Pods
  * Service Account & Token controllers: Створює стандартний аккаунт та API token доступу

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can
scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

  * Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route controller: For setting up routes in the underlying cloud infrastructure
  * Service controller: For creating, updating and deleting cloud provider load balancers



## Node компоненти

Node компоненти запускаються на кожній node, підтримуючи запуск pods та забезпечуючи Kubernetes оточення

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addon

Addons використовують Kubernetes ресурси ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, etc) для реалізації можливостей кластеру. Тому що ці ресурси забезпечують функціональність на рівні цілого кластеру. Всі компоненти addons належать до namespace "kube-system".  

Вибрані addons описані нижче. Розширений список усіх доступних addons доступний за [посиланням](/docs/concepts/cluster-administration/addons/).

### DNS

На відміну він інших опціональних addons, всі Kubernetes кластери повинні мати [DNS кластер](/docs/concepts/services-networking/dns-pod-service/)

DNS кластер - це DNS сервер, який є додатковим до вже існуючих інших DNS серверів у твоєму оточенні, які оброблює DNS записи, що відносяться до Kubernetes сервісів.

Контейнери, що були запущені Kubernetes автоматично мають адресу DNS серверу у своєму оточенні. 
 
### Веб-інтерфейс (Моніторингова панель)

[Моніторингова панель](/docs/tasks/access-application-cluster/web-ui-dashboard/) - це мультизадачний веб-інтерфейс для Kubernetes кластеру. Він надає можливість керувати запущеними додатками, самим кластером, а також налагоджувати їх. 

### Моніторинг ресурсів контейнерів

[Моніторинг ресурсів контейнерів](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) записує загальні часові метрики про контейнери до центрального сховища та забезпечує відповідний веб-інтерфейс для їх перегляду.

### Логування на рівні кластеру

[Логування на рівні кластеру](/docs/concepts/cluster-administration/logging/) - це механізм, що відповідає за зберігання логів зсередини контейнерів до центрального сховища з відповідним веб-інтерфейсом. 


## {{% heading "whatsnext" %}}

<!--
* Learn about [Nodes](/docs/concepts/architecture/nodes/)
* Learn about [Controllers](/docs/concepts/architecture/controller/)
* Learn about [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read etcd's official [documentation](https://etcd.io/docs/)
-->
*   Перегляньте [Nodes](/docs/concepts/architecture/nodes)
*   Перегляньте [Controllers](/docs/concepts/architecture/controllers)
*   Перегляньте [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler)
*   Почитайте [офіційну документацію etcd](https://etcd.io/docs/)
*   Готові [розпочати роботу](/docs/setup/)?

