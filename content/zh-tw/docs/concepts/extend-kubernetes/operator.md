---
title: Operator 模式
content_type: concept
weight: 30
---

<!--
title: Operator pattern
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
Operators are software extensions to Kubernetes that make use of [custom
resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
to manage applications and their components. Operators follow
Kubernetes principles, notably the [control loop](/docs/concepts/architecture/controller/).
-->
Operator 是 Kubernetes 的擴充套件軟體，它利用
[定製資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
管理應用及其元件。
Operator 遵循 Kubernetes 的理念，特別是在[控制器](/zh-cn/docs/concepts/architecture/controller/)
方面。

<!-- body -->

<!--
## Motivation

The Operator pattern aims to capture the key aim of a human operator who
is managing a service or set of services. Human operators who look after
specific applications and services have deep knowledge of how the system
ought to behave, how to deploy it, and how to react if there are problems.

People who run workloads on Kubernetes often like to use automation to take
care of repeatable tasks. The Operator pattern captures how you can write
code to automate a task beyond what Kubernetes itself provides.
-->
## 初衷

Operator 模式旨在捕獲（正在管理一個或一組服務的）運維人員的關鍵目標。
負責特定應用和 service 的運維人員，在系統應該如何執行、如何部署以及出現問題時如何處理等方面有深入的瞭解。

在 Kubernetes 上執行工作負載的人們都喜歡透過自動化來處理重複的任務。
Operator 模式會封裝你編寫的（Kubernetes 本身提供功能以外的）任務自動化程式碼。

<!--
## Operators in Kubernetes

Kubernetes is designed for automation. Out of the box, you get lots of
built-in automation from the core of Kubernetes. You can use Kubernetes
to automate deploying and running workloads, *and* you can automate how
Kubernetes does that.

Kubernetes' {{< glossary_tooltip text="operator pattern" term_id="operator-pattern" >}} concept lets you extend the cluster's behaviour without modifying the code of Kubernetes itself by linking {{< glossary_tooltip text="controllers" term_id="controller" >}} to one or more custom resources.
Operators are clients of the Kubernetes API that act as controllers for
a [Custom Resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
## Kubernetes 上的 Operator

Kubernetes 為自動化而生。無需任何修改，你即可以從 Kubernetes 核心中獲得許多內建的自動化功能。
你可以使用 Kubernetes 自動化部署和執行工作負載， *甚至* 可以自動化 Kubernetes 自身。

Kubernetes 的 {{< glossary_tooltip text="Operator 模式" term_id="operator-pattern" >}}概念允許你在不修改
Kubernetes 自身程式碼的情況下，透過為一個或多個自定義資源關聯{{< glossary_tooltip text="控制器" term_id="controller" >}}
來擴充套件叢集的能力。
Operator 是 Kubernetes API 的客戶端，充當
[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
的控制器。

<!--
## An example Operator {#example}

Some of the things that you can use an operator to automate include:

* deploying an application on demand
* taking and restoring backups of that application's state
* handling upgrades of the application code alongside related changes such
  as database schemas or extra configuration settings
* publishing a Service to applications that don't support Kubernetes APIs to
  discover them
* simulating failure in all or part of your cluster to test its resilience
* choosing a leader for a distributed application without an internal
  member election process
-->
## Operator 示例 {#example}

使用 Operator 可以自動化的事情包括：

* 按需部署應用
* 獲取/還原應用狀態的備份
* 處理應用程式碼的升級以及相關改動。例如，資料庫 schema 或額外的配置設定
* 釋出一個 service，要求不支援 Kubernetes API 的應用也能發現它
* 模擬整個或部分叢集中的故障以測試其穩定性
* 在沒有內部成員選舉程式的情況下，為分散式應用選擇首領角色

<!--
What might an Operator look like in more detail? Here's an example:

1. A custom resource named SampleDB, that you can configure into the cluster.
2. A Deployment that makes sure a Pod is running that contains the
   controller part of the operator.
3. A container image of the operator code.
4. Controller code that queries the control plane to find out what SampleDB
   resources are configured.
5. The core of the Operator is code to tell the API server how to make
   reality match the configured resources.
   * If you add a new SampleDB, the operator sets up PersistentVolumeClaims
     to provide durable database storage, a StatefulSet to run SampleDB and
     a Job to handle initial configuration.
   * If you delete it, the Operator takes a snapshot, then makes sure that
     the StatefulSet and Volumes are also removed.
6. The operator also manages regular database backups. For each SampleDB
   resource, the operator determines when to create a Pod that can connect
   to the database and take backups. These Pods would rely on a ConfigMap
   and / or a Secret that has database connection details and credentials.
7. Because the Operator aims to provide robust automation for the resource
   it manages, there would be additional supporting code. For this example,
   code checks to see if the database is running an old version and, if so,
   creates Job objects that upgrade it for you.
-->

想要更詳細的瞭解 Operator？下面是一個示例：

1. 有一個名為 SampleDB 的自定義資源，你可以將其配置到叢集中。
2. 一個包含 Operator 控制器部分的 Deployment，用來確保 Pod 處於執行狀態。
3. Operator 程式碼的容器映象。
4. 控制器程式碼，負責查詢控制平面以找出已配置的 SampleDB 資源。
5. Operator 的核心是告訴 API 伺服器，如何使現實與程式碼裡配置的資源匹配。
   * 如果新增新的 SampleDB，Operator 將設定 PersistentVolumeClaims 以提供
     持久化的資料庫儲存，設定 StatefulSet 以執行 SampleDB，並設定 Job
     來處理初始配置。
   * 如果你刪除它，Operator 將建立快照，然後確保 StatefulSet 和 Volume 已被刪除。
6. Operator 也可以管理常規資料庫的備份。對於每個 SampleDB 資源，Operator
   會確定何時建立（可以連線到資料庫並進行備份的）Pod。這些 Pod 將依賴於
   ConfigMap 和/或具有資料庫連線詳細資訊和憑據的 Secret。
7. 由於 Operator 旨在為其管理的資源提供強大的自動化功能，因此它還需要一些
   額外的支援性程式碼。在這個示例中，程式碼將檢查資料庫是否正執行在舊版本上，
   如果是，則建立 Job 物件為你升級資料庫。

<!--
## Deploying Operators

The most common way to deploy an Operator is to add the
Custom Resource Definition and its associated Controller to your cluster.
The Controller will normally run outside of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}},
much as you would run any containerized application.
For example, you can run the controller in your cluster as a Deployment.
-->
## 部署 Operator

部署 Operator 最常見的方法是將自定義資源及其關聯的控制器新增到你的叢集中。
跟執行容器化應用一樣，控制器通常會執行在
{{< glossary_tooltip text="控制平面" term_id="control-plane" >}} 之外。
例如，你可以在叢集中將控制器作為 Deployment 執行。

<!--
## Using an Operator {#using-operators}

Once you have an Operator deployed, you'd use it by adding, modifying or
deleting the kind of resource that the Operator uses. Following the above
example, you would set up a Deployment for the Operator itself, and then:

```shell
kubectl get SampleDB                   # find configured databases

kubectl edit SampleDB/example-database # manually change some settings
```
-->
## 使用 Operator {#using-operators}

部署 Operator 後，你可以對 Operator 所使用的資源執行新增、修改或刪除操作。
按照上面的示例，你將為 Operator 本身建立一個 Deployment，然後：

```shell
kubectl get SampleDB                   # 查詢所配置的資料庫

kubectl edit SampleDB/example-database # 手動修改某些配置
```

<!--
&hellip;and that's it! The Operator will take care of applying the changes as well as keeping the existing service in good shape.
-->
可以了！Operator 會負責應用所作的更改並保持現有服務處於良好的狀態。

<!--
## Writing your own Operator {#writing-operator}
-->

## 編寫你自己的 Operator {#writing-operator}

<!--
If there isn't an Operator in the ecosystem that implements the behavior you
want, you can code your own.

You also implement an Operator (that is, a Controller) using any language / runtime
that can act as a [client for the Kubernetes API](/docs/reference/using-api/client-libraries/).
-->

如果生態系統中沒可以實現你目標的 Operator，你可以自己編寫程式碼。

你還可以使用任何支援 [Kubernetes API 客戶端](/zh-cn/docs/reference/using-api/client-libraries/)
的語言或執行時來實現 Operator（即控制器）。

<!--
Following are a few libraries and tools you can use to write your own cloud native
Operator.

{{% thirdparty-content %}}

* [Charmed Operator Framework](https://juju.is/)
* [Java Operator SDK](https://github.com/java-operator-sdk/java-operator-sdk)
* [Kopf](https://github.com/nolar/kopf) (Kubernetes Operator Pythonic Framework)
* [kubebuilder](https://book.kubebuilder.io/)
* [KubeOps](https://buehler.github.io/dotnet-operator-sdk/) (dotnet operator SDK)
* [KUDO](https://kudo.dev/) (Kubernetes Universal Declarative Operator)
* [Metacontroller](https://metacontroller.github.io/metacontroller/intro.html) along with WebHooks that 
you implement yourself
* [Operator Framework](https://operatorframework.io)
* [shell-operator](https://github.com/flant/shell-operator)
-->
以下是一些庫和工具，你可用於編寫自己的雲原生 Operator。

{{% thirdparty-content %}}

* [Charmed Operator Framework](https://juju.is/)
* [Java Operator SDK](https://github.com/java-operator-sdk/java-operator-sdk)
* [Kopf](https://github.com/nolar/kopf) (Kubernetes Operator Pythonic Framework)
* [kubebuilder](https://book.kubebuilder.io/)
* [KubeOps](https://buehler.github.io/dotnet-operator-sdk/) (dotnet operator SDK)
* [KUDO](https://kudo.dev/) (Kubernetes 通用宣告式 Operator)
* [Metacontroller](https://metacontroller.github.io/metacontroller/intro.html)，可與 Webhooks 結合使用，以實現自己的功能。
* [Operator Framework](https://operatorframework.io)
* [shell-operator](https://github.com/flant/shell-operator)

## {{% heading "whatsnext" %}}

<!--
* Read the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} [Operator White Paper](https://github.com/cncf/tag-app-delivery/blob/eece8f7307f2970f46f100f51932db106db46968/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md).
* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Find ready-made operators on [OperatorHub.io](https://operatorhub.io/) to suit your use case
* [Publish](https://operatorhub.io/) your operator for other people to use
* Read [CoreOS' original article](https://web.archive.org/web/20170129131616/https://coreos.com/blog/introducing-operators.html) that introduced the Operator pattern (this is an archived version of the original article).
* Read an [article](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps) from Google Cloud about best practices for building Operators
-->

* 閱讀 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} [Operator 白皮書](https://github.com/cncf/tag-app-delivery/blob/eece8f7307f2970f46f100f51932db106db46968/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md)。
* 詳細瞭解 [定製資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 在 [OperatorHub.io](https://operatorhub.io/) 上找到現成的、適合你的 Operator
* [釋出](https://operatorhub.io/)你的 Operator，讓別人也可以使用
* 閱讀 [CoreOS 原始文章](https://web.archive.org/web/20170129131616/https://coreos.com/blog/introducing-operators.html)，它介紹了 Operator 模式（這是一個存檔版本的原始文章）。
* 閱讀這篇來自谷歌雲的關於構建 Operator 最佳實踐的
  [文章](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps)
