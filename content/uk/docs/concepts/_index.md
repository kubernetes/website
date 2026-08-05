---
title: Концепції
main_menu: true
content_type: concept
weight: 40
---

<!-- overview -->

<!--The Concepts section helps you learn about the parts of the Kubernetes system and the abstractions Kubernetes uses to represent your {{< glossary_tooltip text="cluster" term_id="cluster" length="all" >}}, and helps you obtain a deeper understanding of how Kubernetes works.
-->
В розділі "Концепції" описані складові системи Kubernetes і абстракції, за допомогою яких Kubernetes реалізовує ваш {{< glossary_tooltip text="кластер" term_id="cluster" length="all" >}}. Цей розділ допоможе вам краще зрозуміти, як працює Kubernetes.



<!-- body -->

<!--## Overview
-->

## Загальна інформація

<!--To work with Kubernetes, you use *Kubernetes API objects* to describe your cluster's *desired state*: what applications or other workloads you want to run, what container images they use, the number of replicas, what network and disk resources you want to make available, and more. You set your desired state by creating objects using the Kubernetes API, typically via the command-line interface, `kubectl`. You can also use the Kubernetes API directly to interact with the cluster and set or modify your desired state.
-->
Для роботи з Kubernetes ви використовуєте *об'єкти API Kubernetes* для того, щоб описати *бажаний стан* вашого кластера: які застосунки або інші робочі навантаження ви плануєте запускати, які образи контейнерів вони використовують, кількість реплік, скільки ресурсів мережі та диску ви хочете виділити тощо. Ви задаєте бажаний стан, створюючи об'єкти в Kubernetes API, зазвичай через інтерфейс командного рядка `kubectl`. Ви також можете взаємодіяти із кластером, задавати або змінювати його бажаний стан безпосередньо через Kubernetes API.

<!--Once you've set your desired state, the *Kubernetes Control Plane* makes the cluster's current state match the desired state via the Pod Lifecycle Event Generator ([PLEG](https://github.com/kubernetes/design-proposals-archive/blob/main/node/pod-lifecycle-event-generator.md)). To do so, Kubernetes performs a variety of tasks automatically--such as starting or restarting containers, scaling the number of replicas of a given application, and more. The Kubernetes Control Plane consists of a collection of processes running on your cluster:
-->
Після того, як ви задали бажаний стан, *площина управління Kubernetes* приводить поточний стан кластера до бажаного за допомогою Pod Lifecycle Event Generator ([PLEG](https://github.com/kubernetes/design-proposals-archive/blob/main/node/pod-lifecycle-event-generator.md)). Для цього Kubernetes автоматично виконує ряд задач: запускає або перезапускає контейнери, масштабує кількість реплік у певному застосунку тощо. Площина управління Kubernetes складається із набору процесів, що виконуються у вашому кластері:

<!--* The **Kubernetes Master** is a collection of three processes that run on a single node in your cluster, which is designated as the master node. Those processes are: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) and [kube-scheduler](/docs/admin/kube-scheduler/).
* Each individual non-master node in your cluster runs two processes:
  * **[kubelet](/docs/admin/kubelet/)**, which communicates with the Kubernetes Master.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, a network proxy which reflects Kubernetes networking services on each node.
  -->

* **Kubernetes master** становить собою набір із трьох процесів, запущених на одному вузлі вашого кластера, що визначений як керівний (master). До цих процесів належать: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) і [kube-scheduler](/docs/admin/kube-scheduler/).
* На кожному не-мастер вузлі вашого кластера виконуються два процеси:
  * **[kubelet](/docs/admin/kubelet/)**, що обмінюється даними з Kubernetes master.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, мережевий проксі, що відображає мережеві сервіси Kubernetes на кожному вузлі.

<!--## Kubernetes Objects
-->

## Об'єкти Kubernetes

<!--Kubernetes contains a number of abstractions that represent the state of your system: deployed containerized applications and workloads, their associated network and disk resources, and other information about what your cluster is doing. These abstractions are represented by objects in the Kubernetes API. See [Understanding Kubernetes Objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) for more details.
-->
Kubernetes оперує певною кількістю абстракцій, що відображають стан вашої системи: розгорнуті у контейнерах застосунки та робочі навантаження, пов'язані з ними ресурси мережі та диску, інша інформація щодо функціонування вашого кластера. Ці абстракції представлені як об'єкти Kubernetes API. Для більш детальної інформації ознайомтесь з [Об'єктами Kubernetes](/docs/concepts/overview/working-with-objects/kubernetes-objects/).

<!--The basic Kubernetes objects include:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)
-->
До базових об'єктів Kubernetes належать:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

<!--Kubernetes also contains higher-level abstractions that rely on [Controllers](/docs/concepts/architecture/controller/) to build upon the basic objects, and provide additional functionality and convenience features. These include:
-->
В Kubernetes є також абстракції вищого рівня, які надбудовуються над базовими об'єктами за допомогою [контролерів](/docs/concepts/architecture/controller/) і забезпечують додаткову функціональність і зручність. До них належать:

* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

<!--## Kubernetes Control Plane
-->

## Площина управління Kubernetes (*Kubernetes Control Plane*) {#площина-управління-kubernetes}

<!--The various parts of the Kubernetes Control Plane, such as the Kubernetes Master and kubelet processes, govern how Kubernetes communicates with your cluster. The Control Plane maintains a record of all of the Kubernetes Objects in the system, and runs continuous control loops to manage those objects' state. At any given time, the Control Plane's control loops will respond to changes in the cluster and work to make the actual state of all the objects in the system match the desired state that you provided.
-->
Різні частини площини управління Kubernetes, такі як Kubernetes Master і kubelet, регулюють, як Kubernetes спілкується з вашим кластером. Площина управління веде облік усіх об'єктів Kubernetes в системі та безперервно, в циклі перевіряє стан цих об'єктів. У будь-який момент часу контрольні цикли, запущені площиною управління, реагуватимуть на зміни у кластері і намагатимуться привести поточний стан об'єктів до бажаного, що заданий у конфігурації.

<!--For example, when you use the Kubernetes API to create a Deployment, you provide a new desired state for the system. The Kubernetes Control Plane records that object creation, and carries out your instructions by starting the required applications and scheduling them to cluster nodes--thus making the cluster's actual state match the desired state.
-->
Наприклад, коли за допомогою API Kubernetes ви створюєте Deployment, ви задаєте новий бажаний стан для системи. Площина управління Kubernetes фіксує створення цього об'єкта і виконує ваші інструкції шляхом запуску потрібних застосунків та їх розподілу між вузлами кластера. В такий спосіб досягається відповідність поточного стану бажаному.

<!--### Kubernetes Master
-->

### Kubernetes Master

<!--The Kubernetes master is responsible for maintaining the desired state for your cluster. When you interact with Kubernetes, such as by using the `kubectl` command-line interface, you're communicating with your cluster's Kubernetes master.
-->
Kubernetes Master відповідає за підтримку бажаного стану вашого кластера. Щоразу, як ви взаємодієте з Kubernetes, наприклад при використанні інтерфейсу командного рядка `kubectl`, ви обмінюєтесь даними із Kubernetes master вашого кластера.

<!--The "master" refers to a collection of processes managing the cluster state.  Typically all these processes run on a single node in the cluster, and this node is also referred to as the master. The master can also be replicated for availability and redundancy.
-->
Слово "master" стосується набору процесів, які управляють станом кластера. Переважно всі ці процеси виконуються на одному вузлі кластера, який також називається master. Master-вузол можна реплікувати для забезпечення високої доступності кластера.

<!--### Kubernetes Nodes
-->

### Вузли Kubernetes

<!--The nodes in a cluster are the machines (VMs, physical servers, etc) that run your applications and cloud workflows. The Kubernetes master controls each node; you'll rarely interact with nodes directly.
-->
Вузлами кластера називають машини (ВМ, фізичні сервери тощо), на яких запущені ваші застосунки та хмарні робочі навантаження. Кожен вузол керується Kubernetes master; ви лише зрідка взаємодіятимете безпосередньо із вузлами.




## {{% heading "whatsnext" %}}


<!--If you would like to write a concept page, see
[Using Page Templates](/docs/home/contribute/page-templates/)
for information about the concept page type and the concept template.
-->
Якщо ви хочете створити нову сторінку у розділі Концепції, у статті
[Використання шаблонів сторінок](/docs/home/contribute/page-templates/)
ви знайдете інформацію щодо типу і шаблона сторінки.


