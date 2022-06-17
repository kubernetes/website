---
title: Pods
content_type: concept
weight: 10
no_list: true
card:
  name: concepts
  weight: 60
---
<!--
reviewers:
- erictune
title: Pods
content_type: concept
weight: 10
no_list: true
card:
  name: concepts
  weight: 60
-->

<!-- overview -->

<!--
_Pods_ are the smallest deployable units of computing that you can create and manage in Kubernetes.

A _Pod_ (as in a pod of whales or pea pod) is a group of one or more
{{< glossary_tooltip text="containers" term_id="container" >}}
with shared storage and network resources, and a specification
for how to run the containers. A Pod's contents are always co-located and
co-scheduled, and run in a shared context. A Pod models an
application-specific "logical host": it contains one or more application
containers which are relatively tightly coupled. 
In non-cloud contexts, applications executed on the same physical or virtual machine are analogous to cloud applications executed on the same logical host.
-->
_Pod_ 是可以在 Kubernetes 中建立和管理的、最小的可部署的計算單元。

_Pod_ （就像在鯨魚莢或者豌豆莢中）是一組（一個或多個）
{{< glossary_tooltip text="容器" term_id="container" >}}；
這些容器共享儲存、網路、以及怎樣執行這些容器的宣告。
Pod 中的內容總是並置（colocated）的並且一同排程，在共享的上下文中執行。
Pod 所建模的是特定於應用的“邏輯主機”，其中包含一個或多個應用容器，
這些容器是相對緊密的耦合在一起的。
在非雲環境中，在相同的物理機或虛擬機器上執行的應用類似於
在同一邏輯主機上執行的雲應用。

<!--
As well as application containers, a Pod can contain
[init containers](/docs/concepts/workloads/pods/init-containers/) that run
during Pod startup. You can also inject
[ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/)
for debugging if your cluster offers this.
-->
除了應用容器，Pod 還可以包含在 Pod 啟動期間執行的
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)。
你也可以在叢集中支援[臨時性容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)
的情況下，為除錯的目的注入臨時性容器。

<!-- body -->

## 什麼是 Pod？   {#what-is-a-pod}

<!--
While Kubernetes supports more
{{< glossary_tooltip text="container runtimes" term_id="container-runtime" >}}
than just Docker, [Docker](https://www.docker.com/) is the most commonly known
runtime, and it helps to describe Pods using some terminology from Docker.
-->
{{< note >}}
除了 Docker 之外，Kubernetes 支援
很多其他{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}，
[Docker](https://www.docker.com/) 是最有名的執行時，
使用 Docker 的術語來描述 Pod 會很有幫助。
{{< /note >}}

<!--
The shared context of a Pod is a set of Linux namespaces, cgroups, and
potentially other facets of isolation - the same things that isolate a Docker
container.  Within a Pod's context, the individual applications may have
further sub-isolations applied.

In terms of Docker concepts, a Pod is similar to a group of Docker containers
with shared namespaces and shared filesystem volumes.
-->
Pod 的共享上下文包括一組 Linux 名字空間、控制組（cgroup）和可能一些其他的隔離
方面，即用來隔離 Docker 容器的技術。
在 Pod 的上下文中，每個獨立的應用可能會進一步實施隔離。

就 Docker 概念的術語而言，Pod 類似於共享名字空間和檔案系統卷的一組 Docker
容器。

<!--
## Using Pods

The following is an example of a Pod which consists of a container running the image `nginx:1.14.2`.

{{< codenew file="pods/simple-pod.yaml" >}}

To create the Pod shown above, run the following command:
-->
## 使用 Pod   {#using-pods}

下面是一個 Pod 示例，它由一個執行映象 `nginx:1.14.2` 的容器組成。

{{< codenew file="pods/simple-pod.yaml" >}}

要建立上面顯示的 Pod，請執行以下命令：

```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

<!--
Pods are generally not created directly and are created using workload resources.
See [Working with Pods](#working-with-pods) for more information on how Pods are used
with workload resources.

### Workload resources for managing pods
-->
Pod 通常不是直接建立的，而是使用工作負載資源建立的。
有關如何將 Pod 用於工作負載資源的更多資訊，請參閱 [使用 Pod](#working-with-pods)。

### 用於管理 pod 的工作負載資源

<!--
Usually you don't need to create Pods directly, even singleton Pods. 
Instead, create them using workload resources such as {{< glossary_tooltip text="Deployment"
term_id="deployment" >}} or {{< glossary_tooltip text="Job" term_id="job" >}}.
If your Pods need to track state, consider the 
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} resource.

Pods in a Kubernetes cluster are used in two main ways:
-->
通常你不需要直接建立 Pod，甚至單例項 Pod。
相反，你會使用諸如
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或
{{< glossary_tooltip text="Job" term_id="job" >}} 這類工作負載資源
來建立 Pod。如果 Pod 需要跟蹤狀態，
可以考慮 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
資源。

Kubernetes 叢集中的 Pod 主要有兩種用法：

<!--
* **Pods that run a single container**. The "one-container-per-Pod" model is the
  most common Kubernetes use case; in this case, you can think of a Pod as a
  wrapper around a single container; Kubernetes manages Pods rather than managing
  the containers directly.
* **Pods that run multiple containers that need to work together**. A Pod can
  encapsulate an application composed of multiple co-located containers that are
  tightly coupled and need to share resources. These co-located containers
  form a single cohesive unit of service—for example, one container serving data
  stored in a shared volume to the public, while a separate _sidecar_ container
  refreshes or updates those files.  
  The Pod wraps these containers, storage resources, and an ephemeral network
  identity together as a single unit.

  Grouping multiple co-located and co-managed containers in a single Pod is a
  relatively advanced use case. You should use this pattern only in specific
  instances in which your containers are tightly coupled.
-->
* **執行單個容器的 Pod**。"每個 Pod 一個容器"模型是最常見的 Kubernetes 用例；
  在這種情況下，可以將 Pod 看作單個容器的包裝器，並且 Kubernetes 直接管理 Pod，而不是容器。
* **執行多個協同工作的容器的 Pod**。
  Pod 可能封裝由多個緊密耦合且需要共享資源的共處容器組成的應用程式。
  這些位於同一位置的容器可能形成單個內聚的服務單元 —— 一個容器將檔案從共享卷提供給公眾，
  而另一個單獨的“邊車”（sidecar）容器則重新整理或更新這些檔案。
  Pod 將這些容器和儲存資源打包為一個可管理的實體。

  {{< note >}}
  將多個並置、同管的容器組織到一個 Pod 中是一種相對高階的使用場景。
  只有在一些場景中，容器之間緊密關聯時你才應該使用這種模式。  
  {{< /note >}}

<!--
Each Pod is meant to run a single instance of a given application. If you want to
scale your application horizontally (to provide more overall resources by running
more instances), you should use multiple Pods, one for each instance. In
Kubernetes, this is typically referred to as _replication_.
Replicated Pods are usually created and managed as a group by a workload resource
and its {{< glossary_tooltip text="controller" term_id="controller" >}}.

See [Pods and controllers](#pods-and-controllers) for more information on how
Kubernetes uses workload resources, and their controllers, to implement application
scaling and auto-healing.
-->

每個 Pod 都旨在執行給定應用程式的單個例項。如果希望橫向擴充套件應用程式（例如，執行多個例項
以提供更多的資源），則應該使用多個 Pod，每個例項使用一個 Pod。
在 Kubernetes 中，這通常被稱為 _副本（Replication）_。
通常使用一種工作負載資源及其{{< glossary_tooltip text="控制器" term_id="controller" >}}
來建立和管理一組 Pod 副本。

參見 [Pod 和控制器](#pods-and-controllers)以瞭解 Kubernetes
如何使用工作負載資源及其控制器以實現應用的擴縮和自動修復。

<!--
### How Pods manage multiple containers

Pods are designed to support multiple cooperating processes (as containers) that form
a cohesive unit of service. The containers in a Pod are automatically co-located and
co-scheduled on the same physical or virtual machine in the cluster. The containers
can share resources and dependencies, communicate with one another, and coordinate
when and how they are terminated.
-->
### Pod 怎樣管理多個容器

Pod 被設計成支援形成內聚服務單元的多個協作過程（形式為容器）。
Pod 中的容器被自動安排到叢集中的同一物理機或虛擬機器上，並可以一起進行排程。
容器之間可以共享資源和依賴、彼此通訊、協調何時以及何種方式終止自身。

<!--
For example, you might have a container that
acts as a web server for files in a shared volume, and a separate "sidecar" container
that updates those files from a remote source, as in the following diagram:
-->

例如，你可能有一個容器，為共享卷中的檔案提供 Web 伺服器支援，以及一個單獨的
"邊車 (sidercar)" 容器負責從遠端更新這些檔案，如下圖所示：

{{< figure src="/images/docs/pod.svg" alt="Pod creation diagram" class="diagram-medium" >}}

<!--
Some Pods have {{< glossary_tooltip text="init containers" term_id="init-container" >}}
as well as {{< glossary_tooltip text="app containers" term_id="app-container" >}}.
Init containers run and complete before the app containers are started.

Pods natively provide two kinds of shared resources for their constituent containers:
[networking](#pod-networking) and [storage](#pod-storage).
-->
有些 Pod 具有 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}} 和
{{< glossary_tooltip text="應用容器" term_id="app-container" >}}。
Init 容器會在啟動應用容器之前執行並完成。

Pod 天生地為其成員容器提供了兩種共享資源：[網路](#pod-networking)和
[儲存](#pod-storage)。

<!--
## Working with Pods

You'll rarely create individual Pods directly in Kubernetes—even singleton Pods. This
is because Pods are designed as relatively ephemeral, disposable entities. When
a Pod gets created (directly by you, or indirectly by a
{{< glossary_tooltip text="controller" term_id="controller" >}}), the new Pod is
scheduled to run on a {{< glossary_tooltip term_id="node" >}} in your cluster.
The Pod remains on that node until the Pod finishes execution, the Pod object is deleted,
the Pod is *evicted* for lack of resources, or the node fails.
-->
## 使用 Pod   {#working-with-pods}

你很少在 Kubernetes 中直接建立一個個的 Pod，甚至是單例項（Singleton）的 Pod。
這是因為 Pod 被設計成了相對臨時性的、用後即拋的一次性實體。
當 Pod 由你或者間接地由 {{< glossary_tooltip text="控制器" term_id="controller" >}}
建立時，它被排程在叢集中的{{< glossary_tooltip text="節點" term_id="node" >}}上執行。
Pod 會保持在該節點上執行，直到 Pod 結束執行、Pod 物件被刪除、Pod 因資源不足而被
*驅逐* 或者節點失效為止。

<!--
Restarting a container in a Pod should not be confused with restarting a Pod. A Pod
is not a process, but an environment for running container(s). A Pod persists until
it is deleted.
-->
{{< note >}}
重啟 Pod 中的容器不應與重啟 Pod 混淆。
Pod 不是程序，而是容器執行的環境。
在被刪除之前，Pod 會一直存在。
{{< /note >}}

<!--
When you create the manifest for a Pod object, make sure the name specified is a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
當你為 Pod 物件建立清單時，要確保所指定的 Pod 名稱是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Pods and controllers

You can use workload resources to create and manage multiple Pods for you. A controller
for the resource handles replication and rollout and automatic healing in case of
Pod failure. For example, if a Node fails, a controller notices that Pods on that
Node have stopped working and creates a replacement Pod. The scheduler places the
replacement Pod onto a healthy Node.

Here are some examples of workload resources that manage one or more Pods:
-->
### Pod 和控制器    {#pods-and-controllers}

你可以使用工作負載資源來建立和管理多個 Pod。
資源的控制器能夠處理副本的管理、上線，並在 Pod 失效時提供自愈能力。
例如，如果一個節點失敗，控制器注意到該節點上的 Pod 已經停止工作，
就可以建立替換性的 Pod。排程器會將替身 Pod 排程到一個健康的節點執行。

下面是一些管理一個或者多個 Pod 的工作負載資源的示例：

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

<!--
### Pod templates

Controllers for {{< glossary_tooltip text="workload" term_id="workload" >}} resources create Pods
from a _pod template_ and manage those Pods on your behalf.

PodTemplates are specifications for creating Pods, and are included in workload resources such as
[Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).
-->
### Pod 模版    {#pod-templates}

{{< glossary_tooltip text="負載" term_id="workload" >}}資源的控制器通常使用
_Pod 模板（Pod Template）_ 來替你建立 Pod 並管理它們。

Pod 模板是包含在工作負載物件中的規範，用來建立 Pod。這類負載資源包括
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 和
[DaemonSets](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 等。

<!--
Each controller for a workload resource uses the `PodTemplate` inside the workload
object to make actual Pods. The `PodTemplate` is part of the desired state of whatever
workload resource you used to run your app.

The sample below is a manifest for a simple Job with a `template` that starts one
container. The container in that Pod prints a message then pauses.
-->
工作負載的控制器會使用負載物件中的 `PodTemplate` 來生成實際的 Pod。
`PodTemplate` 是你用來執行應用時指定的負載資源的目標狀態的一部分。

下面的示例是一個簡單的 Job 的清單，其中的 `template` 指示啟動一個容器。
該 Pod 中的容器會列印一條訊息之後暫停。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # 這裡是 Pod 模版
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # 以上為 Pod 模版
```

<!--
Modifying the pod template or switching to a new pod template has no effect on the
Pods that already exist. Pods do not receive template updates directly. Instead,
a new Pod is created to match the revised pod template.

For example, the deployment controller ensures that the running Pods match the current
pod template for each Deployment object. If the template is updated, the Deployment has
to remove the existing Pods and create new Pods based on the updated template. Each workload
resource implements its own rules for handling changes to the Pod template.
-->
修改 Pod 模版或者切換到新的 Pod 模版都不會對已經存在的 Pod 起作用。
Pod 不會直接收到模版的更新。相反，
新的 Pod 會被創建出來，與更改後的 Pod 模版匹配。

例如，Deployment 控制器針對每個 Deployment 物件確保執行中的 Pod 與當前的 Pod
模版匹配。如果模版被更新，則 Deployment 必須刪除現有的 Pod，基於更新後的模版
建立新的 Pod。每個工作負載資源都實現了自己的規則，用來處理對 Pod 模版的更新。

<!--
On Nodes, the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} does not
directly observe or manage any of the details around pod templates and updates; those
details are abstracted away. That abstraction and separation of concerns simplifies
system semantics, and makes it feasible to extend the cluster's behavior without
changing existing code.
-->
在節點上，{{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 並不直接監測
或管理與 Pod 模版相關的細節或模版的更新，這些細節都被抽象出來。
這種抽象和關注點分離簡化了整個系統的語義，並且使得使用者可以在不改變現有程式碼的
前提下就能擴充套件叢集的行為。

<!--
## Pod update and replacement

As mentioned in the previous section, when the Pod template for a workload
resource is changed, the controller creates new Pods based on the updated
template instead of updating or patching the existing Pods.
-->
## Pod 更新與替換   {#pod-update-and-replacement}

正如前面章節所述，當某工作負載的 Pod 模板被改變時，控制器會基於更新的模板
建立新的 Pod 物件而不是對現有 Pod 執行更新或者修補操作。

<!--
Kubernetes doesn't prevent you from managing Pods directly. It is possible to
update some fields of a running Pod, in place. However, Pod update operations
like 
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core), and
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
have some limitations:
-->
Kubernetes 並不禁止你直接管理 Pod。對執行中的 Pod 的某些欄位執行就地更新操作
還是可能的。不過，類似
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core) 和
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
這類更新操作有一些限制：

<!--
- Most of the metadata about a Pod is immutable. For example, you cannot
  change the `namespace`, `name`, `uid`, or `creationTimestamp` fields;
  the `generation` field is unique. It only accepts updates that increment the
  field's current value.
- If the `metadata.deletionTimestamp` is set, no new entry can be added to the
  `metadata.finalizers` list.
- Pod updates may not change fields other than `spec.containers[*].image`,
  `spec.initContainers[*].image`, `spec.activeDeadlineSeconds` or
  `spec.tolerations`. For `spec.tolerations`, you can only add new entries.
- When updating the `spec.activeDeadlineSeconds` field, two types of updates
  are allowed:

  1. setting the unassigned field to a positive number; 
  1. updating the field from a positive number to a smaller, non-negative
     number.
-->
- Pod 的絕大多數元資料都是不可變的。例如，你不可以改變其 `namespace`、`name`、
  `uid` 或者 `creationTimestamp` 欄位；`generation` 欄位是比較特別的，如果更新
  該欄位，只能增加欄位取值而不能減少。
- 如果 `metadata.deletionTimestamp` 已經被設定，則不可以向 `metadata.finalizers`
  列表中新增新的條目。
- Pod 更新不可以改變除 `spec.containers[*].image`、`spec.initContainers[*].image`、
  `spec.activeDeadlineSeconds` 或 `spec.tolerations` 之外的欄位。
  對於 `spec.tolerations`，你只被允許新增新的條目到其中。
- 在更新`spec.activeDeadlineSeconds` 欄位時，以下兩種更新操作是被允許的：

  1. 如果該欄位尚未設定，可以將其設定為一個正數；
  1. 如果該欄位已經設定為一個正數，可以將其設定為一個更小的、非負的整數。

<!--
## Resource sharing and communication

Pods enable data sharing and communication among their constituent
containters.
-->
### 資源共享和通訊 {#resource-sharing-and-communication}

Pod 使它的成員容器間能夠進行資料共享和通訊。

<!--
### Storage in Pods {#pod-storage}

A Pod can specify a set of shared storage
{{< glossary_tooltip text="volumes" term_id="volume" >}}. All containers
in the Pod can access the shared volumes, allowing those containers to
share data. Volumes also allow persistent data in a Pod to survive
in case one of the containers within needs to be restarted. See
[Storage](/docs/concepts/storage/) for more information on how
Kubernetes implements shared storage and makes it available to Pods.
-->
### Pod 中的儲存 {#pod-storage}

一個 Pod 可以設定一組共享的儲存{{< glossary_tooltip text="卷" term_id="volume" >}}。
Pod 中的所有容器都可以訪問該共享卷，從而允許這些容器共享資料。
卷還允許 Pod 中的持久資料保留下來，即使其中的容器需要重新啟動。
有關 Kubernetes 如何在 Pod 中實現共享儲存並將其提供給 Pod 的更多資訊，
請參考[卷](/zh-cn/docs/concepts/storage/)。

<!--
### Pod networking

Each Pod is assigned a unique IP address for each address family. Every
container in a Pod shares the network namespace, including the IP address and
network ports. Inside a Pod (and **only** then), the containers that belong to the Pod
can communicate with one another using `localhost`. When containers in a Pod communicate
with entities *outside the Pod*,
they must coordinate how they use the shared network resources (such as ports).
-->
### Pod 聯網    {#pod-networking}

每個 Pod 都在每個地址族中獲得一個唯一的 IP 地址。
Pod 中的每個容器共享網路名字空間，包括 IP 地址和網路埠。
*Pod 內* 的容器可以使用 `localhost` 互相通訊。
當 Pod 中的容器與 *Pod 之外* 的實體通訊時，它們必須協調如何使用共享的網路資源
（例如埠）。

<!--
Within a Pod, containers share an IP address and port space, and
can find each other via `localhost`. The containers in a Pod can also communicate
with each other using standard inter-process communications like SystemV semaphores
or POSIX shared memory.  Containers in different Pods have distinct IP addresses
and can not communicate by IPC without
and can not communicate by OS-level IPC without special configuration.
Containers that want to interact with a container running in a different Pod can
use IP networking to communicate.
-->
在同一個 Pod 內，所有容器共享一個 IP 地址和埠空間，並且可以透過 `localhost` 發現對方。
他們也能透過如 SystemV 訊號量或 POSIX 共享記憶體這類標準的程序間通訊方式互相通訊。
不同 Pod 中的容器的 IP 地址互不相同，沒有特殊配置，無法透過 OS 級 IPC 進行通訊就不能使用 IPC 進行通訊。
如果某容器希望與運行於其他 Pod 中的容器通訊，可以透過 IP 聯網的方式實現。

<!--
Containers within the Pod see the system hostname as being the same as the configured
`name` for the Pod. There's more about this in the [networking](/docs/concepts/cluster-administration/networking/)
section.
-->
Pod 中的容器所看到的系統主機名與為 Pod 配置的 `name` 屬性值相同。
[網路](/zh-cn/docs/concepts/cluster-administration/networking/)部分提供了更多有關此內容的資訊。

<!--
## Privileged mode for containers

In Linux, any container in a Pod can enable privileged mode using the `privileged` (Linux) flag on the [security context](/docs/tasks/configure-pod-container/security-context/) of the container spec. This is useful for containers that want to use operating system administrative capabilities such as manipulating the network stack or accessing hardware devices.

If your cluster has the `WindowsHostProcessContainers` feature enabled, you can create a [Windows HostProcess pod](/docs/tasks/configure-pod-container/create-hostprocess-pod) by setting the `windowsOptions.hostProcess` flag on the security context of the pod spec. All containers in these pods must run as Windows HostProcess containers. HostProcess pods run directly on the host and can also be used to perform administrative tasks as is done with Linux privileged containers.
-->
## 容器的特權模式     {#privileged-mode-for-containers}

在 Linux 中，Pod 中的任何容器都可以使用容器規約中的
[安全性上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)中的
`privileged`（Linux）引數啟用特權模式。
這對於想要使用作業系統管理權能（Capabilities，如操縱網路堆疊和訪問裝置）
的容器很有用。

如果你的叢集啟用了 `WindowsHostProcessContainers` 特性，你可以使用 Pod 規約中安全上下文的
`windowsOptions.hostProcess` 引數來建立
[Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)。
這些 Pod 中的所有容器都必須以 Windows HostProcess 容器方式執行。
HostProcess Pod 可以直接執行在主機上，它也能像 Linux 特權容器一樣，用於執行管理任務。

<!--
Your {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} must support the concept of a privileged container for this setting to be relevant.
-->
{{< note >}}
你的{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}必須支援
特權容器的概念才能使用這一配置。
{{< /note >}}

<!--
## Static Pods

_Static Pods_ are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Whereas most Pods are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}), for static
Pods, the kubelet directly supervises each static Pod (and restarts it if it fails).
-->
## 靜態 Pod    {#static-pods}

_靜態 Pod（Static Pod）_ 直接由特定節點上的 `kubelet` 守護程序管理，
不需要{{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}看到它們。
儘管大多數 Pod 都是透過控制面（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
來管理的，對於靜態 Pod 而言，`kubelet` 直接監控每個 Pod，並在其失效時重啟之。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.
The main use for static Pods is to run a self-hosted control plane: in other words,
using the kubelet to supervise the individual [control plane components](/docs/concepts/overview/components/#control-plane-components).

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
-->
靜態 Pod 通常繫結到某個節點上的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}。
其主要用途是執行自託管的控制面。
在自託管場景中，使用 `kubelet` 來管理各個獨立的
[控制面元件](/zh-cn/docs/concepts/overview/components/#control-plane-components)。

`kubelet` 自動嘗試為每個靜態 Pod 在 Kubernetes API 伺服器上建立一個
{{< glossary_tooltip text="映象 Pod" term_id="mirror-pod" >}}。
這意味著在節點上執行的 Pod 在 API 伺服器上是可見的，但不可以透過 API
伺服器來控制。

{{< note >}}
<!--
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
-->
靜態 Pod 的 `spec` 不能引用其他的 API 物件（例如：{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、{{< glossary_tooltip text="Secret" term_id="secret" >}}等）。
{{< /note >}}

<!--
## Container probes

A _probe_ is a diagnostic performed periodically by the kubelet on a container. To perform a diagnostic, the kubelet can invoke different actions:

- `ExecAction` (performed with the help of the container runtime)
- `TCPSocketAction` (checked directly by the kubelet)
- `HTTPGetAction` (checked directly by the kubelet)

You can read more about [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) 
in the Pod Lifecycle documentation.
-->
## 容器探針   {#container-probes}

_Probe_ 是由 kubelet 對容器執行的定期診斷。要執行診斷，kubelet 可以執行三種動作：
    
- `ExecAction`（藉助容器執行時執行）
- `TCPSocketAction`（由 kubelet 直接檢測）
- `HTTPGetAction`（由 kubelet 直接檢測）

你可以參閱 Pod 的生命週期文件中的[探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)部分。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
* Learn about [RuntimeClass](/docs/concepts/containers/runtime-class/) and how you can use it to
  configure different Pods with different container runtime configurations.
* Read about [Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how you can use it to manage application availability during disruptions.
* Pod is a top-level resource in the Kubernetes REST API.
  The {{< api-reference page="workload-resources/pod-v1" >}}
  object definition describes the object in detail.
* [The Distributed System Toolkit: Patterns for Composite Containers](/blog/2015/06/the-distributed-system-toolkit-patterns/) explains common layouts for Pods with more than one container.
-->
* 瞭解 [Pod 生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)
* 瞭解 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)，以及如何使用它
  來配置不同的 Pod 使用不同的容器執行時配置
* 瞭解 [Pod 拓撲分佈約束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* 瞭解 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)，以及你
  如何可以利用它在出現干擾因素時管理應用的可用性。
* Pod 在 Kubernetes REST API 中是一個頂層資源。
  {{< api-reference page="workload-resources/pod-v1" >}}
  物件的定義中包含了更多的細節資訊。
* 部落格 [分散式系統工具箱：複合容器模式](/blog/2015/06/the-distributed-system-toolkit-patterns/)
  中解釋了在同一 Pod 中包含多個容器時的幾種常見佈局。

<!--
To understand the context for why Kubernetes wraps a common Pod API in other resources (such as {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} or {{< glossary_tooltip text="Deployments" term_id="deployment" >}}), you can read about the prior art, including:
-->
要了解為什麼 Kubernetes 會在其他資源
（如 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
或 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
封裝通用的 Pod API，相關的背景資訊可以在前人的研究中找到。具體包括：

* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google.com/pubs/pub43438.html)
* [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).

