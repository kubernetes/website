---
title: 控制器
content_type: concept
weight: 30
---

<!-- 
title: Controllers
content_type: concept
weight: 30
-->

<!-- overview -->
<!--
In robotics and automation, a _control loop_ is
a non-terminating loop that regulates the state of a system.

Here is one example of a control loop: a thermostat in a room.

When you set the temperature, that's telling the thermostat
about your *desired state*. The actual room temperature is the
*current state*. The thermostat acts to bring the current state
closer to the desired state, by turning equipment on or off.
-->
在機器人技術和自動化領域，控制迴路（Control Loop）是一個非終止迴路，用於調節系統狀態。

這是一個控制環的例子：房間裏的溫度自動調節器。

當你設置了溫度，告訴了溫度自動調節器你的**期望狀態（Desired State）**。
房間的實際溫度是**當前狀態（Current State）**。
通過對設備的開關控制，溫度自動調節器讓其當前狀態接近期望狀態。

{{< glossary_definition term_id="controller" length="short">}}

<!-- body -->
<!--
## Controller pattern

A controller tracks at least one Kubernetes resource type.
These {{< glossary_tooltip text="objects" term_id="object" >}}
have a spec field that represents the desired state. The
controller(s) for that resource are responsible for making the current
state come closer to that desired state.

The controller might carry the action out itself; more commonly, in Kubernetes,
a controller will send messages to the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} that have
useful side effects. You'll see examples of this below.

{{< comment >}}
Some built-in controllers, such as the namespace controller, act on objects
that do not have a spec. For simplicity, this page omits explaining that
detail.
{{< /comment >}}
-->
## 控制器模式 {#controller-pattern}

一個控制器至少追蹤一種類型的 Kubernetes 資源。這些
{{< glossary_tooltip text="對象" term_id="object" >}}
有一個代表期望狀態的 `spec` 字段。
該資源的控制器負責確保其當前狀態接近期望狀態。

控制器可能會自行執行操作；在 Kubernetes 中更常見的是一個控制器會發送資訊給
{{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}，這會有副作用。
具體可參看後文的例子。

{{< comment >}}
一些內置的控制器，比如名字空間控制器，針對沒有指定 `spec` 的對象。
爲了簡單起見，本文沒有詳細介紹這些細節。
{{< /comment >}}

<!--
### Control via API server

The {{< glossary_tooltip term_id="job" >}} controller is an example of a
Kubernetes built-in controller. Built-in controllers manage state by
interacting with the cluster API server.

Job is a Kubernetes resource that runs a
{{< glossary_tooltip term_id="pod" >}}, or perhaps several Pods, to carry out
a task and then stop.

(Once [scheduled](/docs/concepts/scheduling-eviction/), Pod objects become part of the
desired state for a kubelet).

When the Job controller sees a new task it makes sure that, somewhere
in your cluster, the kubelets on a set of Nodes are running the right
number of Pods to get the work done.
The Job controller does not run any Pods or containers
itself. Instead, the Job controller tells the API server to create or remove
Pods.
Other components in the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
act on the new information (there are new Pods to schedule and run),
and eventually the work is done.
-->

### 通過 API 伺服器來控制 {#control-via-API-server}

{{< glossary_tooltip text="Job" term_id="job" >}} 控制器是一個 Kubernetes 內置控制器的例子。
內置控制器通過和叢集 API 伺服器交互來管理狀態。

Job 是一種 Kubernetes 資源，它運行一個或者多個 {{< glossary_tooltip term_id="pod" >}}，
來執行一個任務然後停止。
（一旦[被調度了](/zh-cn/docs/concepts/scheduling-eviction/)，對 `kubelet` 來說 Pod
對象就會變成期望狀態的一部分）。

在叢集中，當 Job 控制器拿到新任務時，它會保證一組 Node 節點上的 `kubelet`
可以運行正確數量的 Pod 來完成工作。
Job 控制器不會自己運行任何的 Pod 或者容器。Job 控制器是通知 API 伺服器來創建或者移除 Pod。
{{< glossary_tooltip text="控制面" term_id="control-plane" >}}中的其它組件
根據新的消息作出反應（調度並運行新 Pod）並且最終完成工作。

<!--
After you create a new Job, the desired state is for that Job to be completed.
The Job controller makes the current state for that Job be nearer to your
desired state: creating Pods that do the work you wanted for that Job, so that
the Job is closer to completion.

Controllers also update the objects that configure them.
For example: once the work is done for a Job, the Job controller
updates that Job object to mark it `Finished`.

(This is a bit like how some thermostats turn a light off to
indicate that your room is now at the temperature you set).
-->
創建新 Job 後，所期望的狀態就是完成這個 Job。Job 控制器會讓 Job 的當前狀態不斷接近期望狀態：創建爲 Job 要完成工作所需要的 Pod，使 Job 的狀態接近完成。

控制器也會更新設定對象。例如：一旦 Job 的工作完成了，Job 控制器會更新 Job 對象的狀態爲 `Finished`。

（這有點像溫度自動調節器關閉了一個燈，以此來告訴你房間的溫度現在到你設定的值了）。

<!--
### Direct control

In contrast with Job, some controllers need to make changes to
things outside of your cluster.

For example, if you use a control loop to make sure there
are enough {{< glossary_tooltip text="Nodes" term_id="node" >}}
in your cluster, then that controller needs something outside the
current cluster to set up new Nodes when needed.

Controllers that interact with external state find their desired state from
the API server, then communicate directly with an external system to bring
the current state closer in line.

(There actually is a [controller](https://github.com/kubernetes/autoscaler/)
that horizontally scales the nodes in your cluster.)
-->

### 直接控制 {#direct-control}

相比 Job 控制器，有些控制器需要對叢集外的一些東西進行修改。

例如，如果你使用一個控制迴路來保證叢集中有足夠的
{{< glossary_tooltip text="節點" term_id="node" >}}，那麼控制器就需要當前叢集外的
一些服務在需要時創建新節點。

和外部狀態交互的控制器從 API 伺服器獲取到它想要的狀態，然後直接和外部系統進行通信
並使當前狀態更接近期望狀態。

（實際上有一個[控制器](https://github.com/kubernetes/autoscaler/)
可以水平地擴展叢集中的節點。）

<!--
The important point here is that the controller makes some changes to bring about
your desired state, and then reports the current state back to your cluster's API server.
Other control loops can observe that reported data and take their own actions.
-->
這裏的重點是，控制器做出了一些變更以使得事物更接近你的期望狀態，
之後將當前狀態報告給叢集的 API 伺服器。
其他控制迴路可以觀測到所彙報的資料的這種變化並採取其各自的行動。

<!--
In the thermostat example, if the room is very cold then a different controller
might also turn on a frost protection heater. With Kubernetes clusters, the control
plane indirectly works with IP address management tools, storage services,
cloud provider APIs, and other services by
[extending Kubernetes](/docs/concepts/extend-kubernetes/) to implement that.
-->
在溫度計的例子中，如果房間很冷，那麼某個控制器可能還會啓動一個防凍加熱器。
就 Kubernetes 叢集而言，控制面間接地與 IP 地址管理工具、儲存服務、雲驅動
APIs 以及其他服務協作，通過[擴展 Kubernetes](/zh-cn/docs/concepts/extend-kubernetes/)
來實現這點。

<!--
## Desired versus current state {#desired-vs-current}

Kubernetes takes a cloud-native view of systems, and is able to handle
constant change.

Your cluster could be changing at any point as work happens and
control loops automatically fix failures. This means that,
potentially, your cluster never reaches a stable state.

As long as the controllers for your cluster are running and able to make
useful changes, it doesn't matter if the overall state is stable or not.
-->
## 期望狀態與當前狀態 {#desired-vs-current}

Kubernetes 採用了系統的雲原生視圖，並且可以處理持續的變化。

在任務執行時，叢集隨時都可能被修改，並且控制迴路會自動修復故障。
這意味着很可能叢集永遠不會達到穩定狀態。

只要叢集中的控制器在運行並且進行有效的修改，整體狀態的穩定與否是無關緊要的。

<!--
## Design

As a tenet of its design, Kubernetes uses lots of controllers that each manage
a particular aspect of cluster state. Most commonly, a particular control loop
(controller) uses one kind of resource as its desired state, and has a different
kind of resource that it manages to make that desired state happen. For example,
a controller for Jobs tracks Job objects (to discover new work) and Pod objects
(to run the Jobs, and then to see when the work is finished). In this case
something else creates the Jobs, whereas the Job controller creates Pods.

It's useful to have simple controllers rather than one, monolithic set of control
loops that are interlinked. Controllers can fail, so Kubernetes is designed to
allow for that.

-->
## 設計 {#design}

作爲設計原則之一，Kubernetes 使用了很多控制器，每個控制器管理叢集狀態的一個特定方面。
最常見的一個特定的控制器使用一種類型的資源作爲它的期望狀態，
控制器管理控制另外一種類型的資源向它的期望狀態演化。
例如，Job 的控制器跟蹤 Job 對象（以發現新的任務）和 Pod 對象（以運行 Job，然後查看任務何時完成）。
在這種情況下，新任務會創建 Job，而 Job 控制器會創建 Pod。

使用簡單的控制器而不是一組相互連接的單體控制迴路是很有用的。
控制器會失敗，所以 Kubernetes 的設計正是考慮到了這一點。

<!--
There can be several controllers that create or update the same kind of object.
Behind the scenes, Kubernetes controllers make sure that they only pay attention
to the resources linked to their controlling resource.

For example, you can have Deployments and Jobs; these both create Pods.
The Job controller does not delete the Pods that your Deployment created,
because there is information ({{< glossary_tooltip term_id="label" text="labels" >}})
the controllers can use to tell those Pods apart.
-->
{{< note >}}
可以有多個控制器來創建或者更新相同類型的對象。
在後臺，Kubernetes 控制器確保它們只關心與其控制資源相關聯的資源。

例如，你可以創建 Deployment 和 Job；它們都可以創建 Pod。
Job 控制器不會刪除 Deployment 所創建的 Pod，因爲有資訊
（{{< glossary_tooltip term_id="label" text="標籤" >}}）讓控制器可以區分這些 Pod。
{{< /note >}}

<!--
## Ways of running controllers {#running-controllers}

Kubernetes comes with a set of built-in controllers that run inside
the {{< glossary_tooltip term_id="kube-controller-manager" >}}. These
built-in controllers provide important core behaviors.

The Deployment controller and Job controller are examples of controllers that
come as part of Kubernetes itself ("built-in" controllers).
Kubernetes lets you run a resilient control plane, so that if any of the built-in
controllers were to fail, another part of the control plane will take over the work.

You can find controllers that run outside the control plane, to extend Kubernetes.
Or, if you want, you can write a new controller yourself.
You can run your own controller as a set of Pods,
or externally to Kubernetes. What fits best will depend on what that particular
controller does.
-->
## 運行控制器的方式 {#running-controllers}

Kubernetes 內置一組控制器，運行在 {{< glossary_tooltip term_id="kube-controller-manager" >}} 內。
這些內置的控制器提供了重要的核心功能。

Deployment 控制器和 Job 控制器是 Kubernetes 內置控制器的典型例子。
Kubernetes 允許你運行一個穩定的控制平面，這樣即使某些內置控制器失敗了，
控制平面的其他部分會接替它們的工作。

你會遇到某些控制器運行在控制面之外，用以擴展 Kubernetes。
或者，如果你願意，你也可以自己編寫新控制器。
你可以以一組 Pod 來運行你的控制器，或者運行在 Kubernetes 之外。
最合適的方案取決於控制器所要執行的功能是什麼。

## {{% heading "whatsnext" %}}
<!--
* Read about the [Kubernetes control plane](/docs/concepts/architecture/#control-plane-components)
* Discover some of the basic [Kubernetes objects](/docs/concepts/overview/working-with-objects/)
* Learn more about the [Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* If you want to write your own controller, see
  [Kubernetes extension patterns](/docs/concepts/extend-kubernetes/#extension-patterns)
  and the [sample-controller](https://github.com/kubernetes/sample-controller) repository.
-->
* 閱讀 [Kubernetes 控制平面組件](/zh-cn/docs/concepts/architecture/#control-plane-components)
* 瞭解 [Kubernetes 對象](/zh-cn/docs/concepts/overview/working-with-objects/)
  的一些基本知識
* 進一步學習 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)
* 如果你想編寫自己的控制器，請查看
  [Kubernetes 擴展模式](/zh-cn/docs/concepts/extend-kubernetes/#extension-patterns)
  以及[控制器樣例](https://github.com/kubernetes/sample-controller)。
