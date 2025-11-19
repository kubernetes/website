---
title: Kubernetes 對象
content_type: concept
weight: 30
description: >
  Kubernetes 對象是 Kubernetes 系統中的持久性實體。
  Kubernetes 使用這些實體表示你的叢集狀態。
  瞭解 Kubernetes 對象模型以及如何使用這些對象。
simple_list: true
card:
  name: concepts
  weight: 40
---
<!--
title: Objects In Kubernetes
content_type: concept
weight: 30
description: >
  Kubernetes objects are persistent entities in the Kubernetes system.
  Kubernetes uses these entities to represent the state of your cluster.
  Learn about the Kubernetes object model and how to work with these objects.
simple_list: true
card:
  name: concepts
  weight: 40
-->

<!-- overview -->

<!--
This page explains how Kubernetes objects are represented in the Kubernetes API, and how you can
express them in `.yaml` format.
-->
本頁說明了在 Kubernetes API 中是如何表示 Kubernetes 對象的，
以及如何使用 `.yaml` 格式的文件表示 Kubernetes 對象。

<!-- body -->

<!--
## Understanding Kubernetes objects {#kubernetes-objects}

*Kubernetes objects* are persistent entities in the Kubernetes system. Kubernetes uses these
entities to represent the state of your cluster. Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance
-->
## 理解 Kubernetes 對象    {#kubernetes-objects}

在 Kubernetes 系統中，**Kubernetes 對象**是持久化的實體。
Kubernetes 使用這些實體去表示整個叢集的狀態。
具體而言，它們描述瞭如下信息：

* 哪些容器化應用正在運行（以及在哪些節點上運行）
* 可以被應用使用的資源
* 關於應用運行時行爲的策略，比如重啓策略、升級策略以及容錯策略

<!--
A Kubernetes object is a "record of intent"--once you create the object, the Kubernetes system
will constantly work to ensure that the object exists. By creating an object, you're effectively
telling the Kubernetes system what you want your cluster's workload to look like; this is your
cluster's *desired state*.
-->
Kubernetes 對象是一種“意向表達（Record of Intent）”。一旦創建該對象，
Kubernetes 系統將不斷工作以確保該對象存在。通過創建對象，你本質上是在告知
Kubernetes 系統，你想要的叢集工作負載狀態看起來應是什麼樣子的，
這就是 Kubernetes 叢集所謂的**期望狀態（Desired State）**。

<!--
To work with Kubernetes objects—whether to create, modify, or delete them—you'll need to use the
[Kubernetes API](/docs/concepts/overview/kubernetes-api/). When you use the `kubectl` command-line
interface, for example, the CLI makes the necessary Kubernetes API calls for you. You can also use
the Kubernetes API directly in your own programs using one of the
[Client Libraries](/docs/reference/using-api/client-libraries/).
-->
操作 Kubernetes 對象 —— 無論是創建、修改或者刪除 —— 需要使用
[Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api)。
比如，當使用 `kubectl` 命令列接口（CLI）時，CLI 會調用必要的 Kubernetes API；
也可以在程序中使用[客戶端庫](/zh-cn/docs/reference/using-api/client-libraries/)，
來直接調用 Kubernetes API。

<!--
### Object spec and status

Almost every Kubernetes object includes two nested object fields that govern
the object's configuration: the object *`spec`* and the object *`status`*.
For objects that have a `spec`, you have to set this when you create the object,
providing a description of the characteristics you want the resource to have:
its _desired state_.
-->
### 對象規約（Spec）與狀態（Status）    {#object-spec-and-status}

幾乎每個 Kubernetes 對象包含兩個嵌套的對象字段，它們負責管理對象的設定：
對象 **`spec`（規約）** 和對象 **`status`（狀態）**。
對於具有 `spec` 的對象，你必須在創建對象時設置其內容，描述你希望對象所具有的特徵：
**期望狀態（Desired State）**。

<!--
The `status` describes the _current state_ of the object, supplied and updated
by the Kubernetes system and its components. The Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} continually
and actively manages every object's actual state to match the desired state you
supplied.
-->
`status` 描述了對象的**當前狀態（Current State）**，它是由 Kubernetes
系統和組件設置並更新的。在任何時刻，Kubernetes
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}
都一直在積極地管理着對象的實際狀態，以使之達成期望狀態。

<!--
For example: in Kubernetes, a Deployment is an object that can represent an
application running on your cluster. When you create the Deployment, you
might set the Deployment `spec` to specify that you want three replicas of
the application to be running. The Kubernetes system reads the Deployment
spec and starts three instances of your desired application--updating
the status to match your spec. If any of those instances should fail
(a status change), the Kubernetes system responds to the difference
between spec and status by making a correction--in this case, starting
a replacement instance.
-->
例如，Kubernetes 中的 Deployment 對象能夠表示運行在叢集中的應用。
當創建 Deployment 時，你可能會設置 Deployment 的 `spec`，指定該應用要有 3 個副本運行。
Kubernetes 系統讀取 Deployment 的 `spec`，
並啓動我們所期望的應用的 3 個實例 —— 更新狀態以與規約相匹配。
如果這些實例中有的失敗了（一種狀態變更），Kubernetes 系統會通過執行修正操作來響應
`spec` 和 `status` 間的不一致 —— 意味着它會啓動一個新的實例來替換。

<!--
For more information on the object spec, status, and metadata, see the
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).
-->
關於對象 spec、status 和 metadata 的更多信息，可參閱
[Kubernetes API 約定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。

<!--
### Describing a Kubernetes object

When you create an object in Kubernetes, you must provide the object spec that describes its
desired state, as well as some basic information about the object (such as a name). When you use
the Kubernetes API to create the object (either directly or via `kubectl`), that API request must
include that information as JSON in the request body.
Most often, you provide the information to `kubectl` in a file known as a _manifest_.
By convention, manifests are YAML (you could also use JSON format).
Tools such as `kubectl` convert the information from a manifest into JSON or another supported
serialization format when making the API request over HTTP.
-->
### 描述 Kubernetes 對象    {#describing-a-kubernetes-object}

創建 Kubernetes 對象時，必須提供對象的 `spec`，用來描述該對象的期望狀態，
以及關於對象的一些基本信息（例如名稱）。
當使用 Kubernetes API 創建對象時（直接創建或經由 `kubectl` 創建），
API 請求必須在請求主體中包含 JSON 格式的信息。
大多數情況下，你會通過 **清單（Manifest）** 文件爲 `kubectl` 提供這些信息。
按照慣例，清單是 YAML 格式的（你也可以使用 JSON 格式）。
像 `kubectl` 這樣的工具在通過 HTTP 進行 API 請求時，
會將清單中的信息轉換爲 JSON 或其他受支持的序列化格式。
<!--
Here's an example manifest that shows the required fields and object spec for a Kubernetes
Deployment:
-->
這裏有一個清單示例文件，展示了 Kubernetes Deployment 的必需字段和對象 `spec`：

{{% code_sample file="application/deployment.yaml" %}}

<!--
One way to create a Deployment using a manifest file like the one above is to use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) command
in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:
-->
與上面使用清單文件來創建 Deployment 類似，另一種方式是使用 `kubectl` 命令列接口（CLI）的
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 命令，
將 `.yaml` 文件作爲參數。下面是一個示例：

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
### Required fields

In the manifest (YAML or JSON file) for the Kubernetes object you want to create, you'll need to set values for
the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, `UID`, and optional `namespace`
* `spec` - What state you desire for the object
-->
### 必需字段    {#required-fields}

在想要創建的 Kubernetes 對象所對應的清單（YAML 或 JSON 文件）中，需要設定的字段如下：

* `apiVersion` - 創建該對象所使用的 Kubernetes API 的版本
* `kind` - 想要創建的對象的類別
* `metadata` - 幫助唯一標識對象的一些數據，包括一個 `name` 字符串、`UID` 和可選的 `namespace`
* `spec` - 你所期望的該對象的狀態

<!--
The precise format of the object `spec` is different for every Kubernetes object, and contains
nested fields specific to that object. The [Kubernetes API Reference](/docs/reference/kubernetes-api/)
can help you find the spec format for all of the objects you can create using Kubernetes.
-->
對每個 Kubernetes 對象而言，其 `spec` 之精確格式都是不同的，包含了特定於該對象的嵌套字段。
[Kubernetes API 參考](/zh-cn/docs/reference/kubernetes-api/)可以幫助你找到想要使用
Kubernetes 創建的所有對象的規約格式。

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
Different kinds of objects can also have different `.status`; again, the API reference pages
detail the structure of that `.status` field, and its content for each different type of object.
-->
例如，參閱 Pod API 參考文檔中
[`spec` 字段](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)。
對於每個 Pod，其 `.spec` 字段設置了 Pod 及其期望狀態（例如 Pod 中每個容器的容器映像檔名稱）。
另一個對象規約的例子是 StatefulSet API 中的
[`spec` 字段](/zh-cn/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)。
對於 StatefulSet 而言，其 `.spec` 字段設置了 StatefulSet 及其期望狀態。
在 StatefulSet 的 `.spec` 內，有一個爲 Pod 對象提供的[模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
該模板描述了 StatefulSet 控制器爲了滿足 StatefulSet 規約而要創建的 Pod。
不同類型的對象可以有不同的 `.status` 信息。API 參考頁面給出了 `.status` 字段的詳細結構，
以及針對不同類型 API 對象的具體內容。

{{< note >}}
<!--
See [Configuration Best Practices](/docs/concepts/configuration/overview/) for additional
information on writing YAML configuration files.
-->
請查看[設定最佳實踐](/zh-cn/docs/concepts/configuration/overview/)來獲取有關編寫 YAML 設定文件的更多信息。
{{< /note >}}

<!--
## Server side field validation

Starting with Kubernetes v1.25, the API server offers server side
[field validation](/docs/reference/using-api/api-concepts/#field-validation)
that detects unrecognized or duplicate fields in an object. It provides all the functionality
of `kubectl --validate` on the server side.
-->
## 伺服器端字段驗證   {#server-side-field-validation}

從 Kubernetes v1.25 開始，API
伺服器提供了伺服器端[字段驗證](/zh-cn/docs/reference/using-api/api-concepts/#field-validation)，
可以檢測對象中未被識別或重複的字段。它在伺服器端提供了 `kubectl --validate` 的所有功能。

<!--
The `kubectl` tool uses the `--validate` flag to set the level of field validation. It accepts the
values `ignore`, `warn`, and `strict` while also accepting the values `true` (equivalent to `strict`)
and `false` (equivalent to `ignore`). The default validation setting for `kubectl` is `--validate=true`.
-->
`kubectl` 工具使用 `--validate` 標誌來設置字段驗證級別。它接受值
`ignore`、`warn` 和 `strict`，同時還接受值 `true`（等同於 `strict`）和
`false`（等同於 `ignore`）。`kubectl` 的默認驗證設置爲 `--validate=true`。

<!--
`Strict`
: Strict field validation, errors on validation failure

`Warn`
: Field validation is performed, but errors are exposed as warnings rather than failing the request

`Ignore`
: No server side field validation is performed
-->
`Strict`
: 嚴格的字段驗證，驗證失敗時會報錯

`Warn`
: 執行字段驗證，但錯誤會以警告形式提供而不是拒絕請求

`Ignore`
: 不執行伺服器端字段驗證

<!--
When `kubectl` cannot connect to an API server that supports field validation it will fall back
to using client-side validation. Kubernetes 1.27 and later versions always offer field validation;
older Kubernetes releases might not. If your cluster is older than v1.27, check the documentation
for your version of Kubernetes.
-->
當 `kubectl` 無法連接到支持字段驗證的 API 伺服器時，它將回退爲使用客戶端驗證。
Kubernetes 1.27 及更高版本始終提供字段驗證；較早的 Kubernetes 版本可能沒有此功能。
如果你的叢集版本低於 v1.27，可以查閱適用於你的 Kubernetes 版本的文檔。

## {{% heading "whatsnext" %}}

<!--
If you're new to Kubernetes, read more about the following:

* [Pods](/docs/concepts/workloads/pods/) which are the most important basic Kubernetes objects.
* [Deployment](/docs/concepts/workloads/controllers/deployment/) objects.
* [Controllers](/docs/concepts/architecture/controller/) in Kubernetes.
* [kubectl](/docs/reference/kubectl/) and [kubectl commands](/docs/reference/generated/kubectl/kubectl-commands).

[Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
explains how to use `kubectl` to manage objects.
You might need to [install kubectl](/docs/tasks/tools/#kubectl) if you don't already have it available.
-->
如果你剛開始學習 Kubernetes，可以進一步閱讀以下信息：

* 最重要的 Kubernetes 基本對象 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
* [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 對象。
* Kubernetes 中的[控制器](/zh-cn/docs/concepts/architecture/controller/)。
* [kubectl](/zh-cn/docs/reference/kubectl/) 和
  [kubectl 命令](/docs/reference/generated/kubectl/kubectl-commands)。

[Kubernetes 對象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)
介紹瞭如何使用 `kubectl` 來管理對象。
如果你還沒有安裝 `kubectl`，你可能需要[安裝 kubectl](/zh-cn/docs/tasks/tools/#kubectl)。

<!--
To learn about the Kubernetes API in general, visit:

* [Kubernetes API overview](/docs/reference/using-api/)

To learn about objects in Kubernetes in more depth, read other pages in this section:
-->
從總體上了解 Kubernetes API，可以查閱：

* [Kubernetes API 概述](/zh-cn/docs/reference/using-api/)

若要更深入地瞭解 Kubernetes 對象，可以閱讀本節的其他頁面：

<!-- Docsy automatically includes a list of pages in the section -->