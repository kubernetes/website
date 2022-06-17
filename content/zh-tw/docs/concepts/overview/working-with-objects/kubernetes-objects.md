---
title: 理解 Kubernetes 物件
content_type: concept
weight: 10
card: 
  name: concepts
  weight: 40
---

<!---
title: Understanding Kubernetes Objects
content_type: concept
weight: 10
card: 
  name: concepts
  weight: 40
-->

<!-- overview -->
<!--
This page explains how Kubernetes objects are represented in the Kubernetes API, and how you can express them in `.yaml` format.
-->
本頁說明了在 Kubernetes API 中是如何表示 Kubernetes 物件的，
以及使用 `.yaml` 格式的檔案表示 Kubernetes 物件。

<!-- body -->
<!--
## Understanding Kubernetes Objects

*Kubernetes Objects* are persistent entities in the Kubernetes system. 
Kubernetes uses these entities to represent the state of your cluster. 

Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance
-->
## 理解 Kubernetes 物件    {#kubernetes-objects}

在 Kubernetes 系統中，*Kubernetes 物件* 是持久化的實體。
Kubernetes 使用這些實體去表示整個叢集的狀態。
比較特別地是，它們描述瞭如下資訊：

* 哪些容器化應用正在執行（以及在哪些節點上執行）
* 可以被應用使用的資源
* 關於應用執行時表現的策略，比如重啟策略、升級策略，以及容錯策略

<!--
A Kubernetes object is a "record of intent" - once you create the object, 
the Kubernetes system will constantly work to ensure that object exists. 
By creating an object, you're effectively telling the Kubernetes system what 
you want your cluster's workload to look like; this is your cluster's *desired state*.

To work with Kubernetes objects - whether to create, modify, or delete them - 
you'll need to use the [Kubernetes API](/docs/concepts/overview/kubernetes-api/).
When you use the `kubectl` command-line interface, for example, 
the CLI makes the necessary Kubernetes API calls for you. 
You can also use the Kubernetes API directly in your own programs using 
one of the [Client Libraries](/docs/reference/using-api/client-libraries/).
-->
Kubernetes 物件是“目標性記錄”——一旦建立物件，Kubernetes 系統將不斷工作以確保物件存在。
透過建立物件，你就是在告知 Kubernetes 系統，你想要的叢集工作負載狀態看起來應是什麼樣子的，
這就是 Kubernetes 叢集所謂的 **期望狀態（Desired State）**。

操作 Kubernetes 物件 —— 無論是建立、修改，或者刪除 —— 需要使用
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api)。
比如，當使用 `kubectl` 命令列介面（CLI）時，CLI 會呼叫必要的 Kubernetes API；
也可以在程式中使用[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)，
來直接呼叫 Kubernetes API。

<!--
### Object Spec and Status

Almost every Kubernetes object includes two nested object fields that govern
the object's configuration: the object *`spec`* and the object *`status`*.
For objects that have a `spec`, you have to set this when you create the object,
providing a description of the characteristics you want the resource to have:
its _desired state_.
-->
### 物件規約（Spec）與狀態（Status）    {#object-spec-and-status}

幾乎每個 Kubernetes 物件包含兩個巢狀的物件欄位，它們負責管理物件的配置：
物件 **`spec`（規約）** 和 物件 **`status`（狀態）**。
對於具有 `spec` 的物件，你必須在建立物件時設定其內容，描述你希望物件所具有的特徵：
*期望狀態（Desired State）*。

<!--
The `status` describes the _current state_ of the object, supplied and updated
by the Kubernetes system and its components. The Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} continually
and actively manages every object's actual state to match the desired state you
supplied.
-->
`status` 描述了物件的**當前狀態（Current State）**，它是由 Kubernetes 系統和元件設定並更新的。
在任何時刻，Kubernetes {{< glossary_tooltip text="控制平面" term_id="control-plane" >}}
都一直都在積極地管理著物件的實際狀態，以使之達成期望狀態。

<!--
For example: in Kubernetes, a Deployment is an object that can represent an
application running on your cluster. When you create the Deployment, you
might set the Deployment `spec` to specify that you want three replicas of
the application to be running. The Kubernetes system reads the Deployment
spec and starts three instances of your desired application-updating
the status to match your spec. If any of those instances should fail
(a status change), the Kubernetes system responds to the difference
between spec and status by making a correction-in this case, starting
a replacement instance.
-->
例如，Kubernetes 中的 Deployment 物件能夠表示執行在叢集中的應用。
當建立 Deployment 時，可能會去設定 Deployment 的 `spec`，以指定該應用要有 3 個副本執行。
Kubernetes 系統讀取 Deployment 的 `spec`，
並啟動我們所期望的應用的 3 個例項 —— 更新狀態以與規約相匹配。
如果這些例項中有的失敗了（一種狀態變更），Kubernetes 系統會透過執行修正操作
來響應 `spec` 和狀態間的不一致 —— 意味著它會啟動一個新的例項來替換。

<!--
For more information on the object spec, status, and metadata, see the 
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).
-->
關於物件 spec、status 和 metadata 的更多資訊，可參閱
[Kubernetes API 約定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。

<!--
### Describing a Kubernetes Object

When you create an object in Kubernetes, you must provide the object spec that describes its desired state, 
as well as some basic information about the object (such as a name). 
When you use the Kubernetes API to create the object (either directly or via `kubectl`), 
that API request must include that information as JSON in the request body. 
**Most often, you provide the information to `kubectl` in a .yaml file.** `kubectl` converts the information to JSON when making the API request.

Here's an example `.yaml` file that shows the required fields and object spec for a Kubernetes Deployment:
-->
### 描述 Kubernetes 物件    {#describing-a-kubernetes-object}

建立 Kubernetes 物件時，必須提供物件的 `spec`，用來描述該物件的期望狀態，
以及關於物件的一些基本資訊（例如名稱）。
當使用 Kubernetes API 建立物件時（直接建立，或經由 `kubectl`），
API 請求必須在請求本體中包含 JSON 格式的資訊。
**大多數情況下，你需要提供 `.yaml` 檔案為 kubectl 提供這些資訊**。
`kubectl` 在發起 API 請求時，將這些資訊轉換成 JSON 格式。

這裡有一個 `.yaml` 示例檔案，展示了 Kubernetes Deployment 的必需欄位和物件 `spec`：

{{< codenew file="application/deployment.yaml" >}}

<!--
One way to create a Deployment using a `.yaml` file like the one above is to use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) command
in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:
-->
相較於上面使用 `.yaml` 檔案來建立 Deployment，另一種類似的方式是使用 `kubectl` 命令列介面（CLI）中的
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 命令，
將 `.yaml` 檔案作為引數。下面是一個示例：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

<!--
The output is similar to this:
-->
輸出類似下面這樣：

```
deployment.apps/nginx-deployment created
```

<!--
### Required Fields

In the `.yaml` file for the Kubernetes object you want to create, you'll need to set values for the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, `UID`, and optional `namespace`
* `spec` - What state you desire for the object
-->
### 必需欄位    {#required-fields}

在想要建立的 Kubernetes 物件所對應的 `.yaml` 檔案中，需要配置的欄位如下：

* `apiVersion` - 建立該物件所使用的 Kubernetes API 的版本
* `kind` - 想要建立的物件的類別
* `metadata` - 幫助唯一性標識物件的一些資料，包括一個 `name` 字串、`UID` 和可選的 `namespace`
* `spec` - 你所期望的該物件的狀態

<!--
The precise format of the object `spec` is different for every Kubernetes object, 
and contains nested fields specific to that object. 
The [Kubernetes API Reference](https://kubernetes.io/docs/reference/kubernetes-api/) 
can help you find the spec format for all of the objects you can create using Kubernetes.
-->
對每個 Kubernetes 物件而言，其 `spec` 之精確格式都是不同的，包含了特定於該物件的巢狀欄位。
我們能在 [Kubernetes API 參考](/zh-cn/docs/reference/kubernetes-api/)
找到我們想要在 Kubernetes 上建立的任何物件的規約格式。

<!--
For example, see the [`spec` field](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
for the Pod API reference.
For each Pod, the `.spec` field specifies the pod and its desired state (such as the container image name for
each container within that pod).
Another example of an object specification is the
[`spec` field](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)
for the StatefulSet API. For StatefulSet, the `.spec` field specifies the StatefulSet and
its desired state.
Within the `.spec` of a StatefulSet is a [template](/docs/concepts/workloads/pods/#pod-templates)
for Pod objects. That template describes Pods that the StatefulSet controller will create in order to
satisfy the StatefulSet specification.
Different kinds of object can also have different `.status`; again, the API reference pages
detail the structure of that `.status` field, and its content for each different type of object.
-->
例如，參閱 Pod API 參考文件中
[`spec` 欄位](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)。
對於每個 Pod，其 `.spec` 欄位設定了 Pod 及其期望狀態（例如 Pod 中每個容器的容器映象名稱）。
另一個物件規約的例子是 StatefulSet API 中的
[`spec` 欄位](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)。
對於 StatefulSet 而言，其 `.spec` 欄位設定了 StatefulSet 及其期望狀態。
在 StatefulSet 的 `.spec` 內，有一個為 Pod 物件提供的[模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。該模板描述了 StatefulSet 控制器為了滿足 StatefulSet 規約而要建立的 Pod。
不同型別的物件可以由不同的 `.status` 資訊。API 參考頁面給出了 `.status` 欄位的詳細結構，
以及針對不同型別 API 物件的具體內容。

## {{% heading "whatsnext" %}}

<!--
* Learn about the most important basic Kubernetes objects, such as [Pod](/docs/concepts/workloads/pods/).
* Learn about [controllers](/docs/concepts/architecture/controller/) in Kubernetes.
* [Using the Kubernetes API](/docs/reference/using-api/) explains some more API concepts.
-->
* 瞭解最重要的 Kubernetes 基本物件，例如 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
* 瞭解 Kubernetes 中的[控制器](/zh-cn/docs/concepts/architecture/controller/)。
* [使用 Kubernetes API](/zh-cn/docs/reference/using-api/) 一節解釋了一些 API 概念。

