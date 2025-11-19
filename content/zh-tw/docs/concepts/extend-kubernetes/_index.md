---
title: 擴展 Kubernetes
weight: 999  # 這一節應放在最後
description: 改變你的 Kubernetes 叢集的行爲的若干方法。
feature:
  title: 爲擴展性設計
  description: >
    無需更改上游源碼即可擴展你的 Kubernetes 叢集。
content_type: concept
no_list: true
---
<!--
title: Extending Kubernetes
weight: 999 # this section should come last
description: Different ways to change the behavior of your Kubernetes cluster.
reviewers:
- erictune
- lavalamp
- cheftako
- chenopis
feature:
  title: Designed for extensibility
  description: >
    Add features to your Kubernetes cluster without changing upstream source code.
content_type: concept
no_list: true
-->

<!-- overview -->

<!--
Kubernetes is highly configurable and extensible. As a result, there is rarely a need to fork or
submit patches to the Kubernetes project code.

This guide describes the options for customizing a Kubernetes cluster. It is aimed at
{{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} who want to understand
how to adapt their Kubernetes cluster to the needs of their work environment. Developers who are
prospective {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} or
Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}} will also
find it useful as an introduction to what extension points and patterns exist, and their
trade-offs and limitations.
-->
Kubernetes 是高度可設定且可擴展的。因此，大多數情況下，
你不需要派生自己的 Kubernetes 副本或者向項目代碼提交補丁。

本指南描述定製 Kubernetes 的可選方式。主要針對的讀者是希望瞭解如何針對自身工作環境需要來調整
Kubernetes 的{{< glossary_tooltip text="叢集管理者" term_id="cluster-operator" >}}。
對於那些充當{{< glossary_tooltip text="平臺開發人員" term_id="platform-developer" >}}的開發人員或
Kubernetes 項目的{{< glossary_tooltip text="貢獻者" term_id="contributor" >}}而言，
他們也會在本指南中找到有用的介紹信息，瞭解系統中存在哪些擴展點和擴展模式，
以及它們所附帶的各種權衡和約束等等。

<!--
Customization approaches can be broadly divided into [configuration](#configuration), which only
involves changing command line arguments, local configuration files, or API resources; and [extensions](#extensions),
which involve running additional programs, additional network services, or both.
This document is primarily about _extensions_.
-->
定製化的方法主要可分爲[設定](#configuration)和[擴展](#extensions)兩種。
前者主要涉及更改命令列參數、本地設定文件或者 API 資源；
後者則需要額外運行一些程序、網路服務或兩者。
本文主要關注**擴展**。
<!-- body -->

<!--
## Configuration

*Configuration files* and *command arguments* are documented in the [Reference](/docs/reference/) section of the online
documentation, with a page for each binary:

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)
-->
## 設定   {#configuration}

**設定文件**和**命令參數**的說明位於在線文檔的[參考](/zh-cn/docs/reference/)一節，
每個可執行文件一個頁面：

* [`kube-apiserver`](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)

<!--
Command arguments and configuration files may not always be changeable in a hosted Kubernetes service or a
distribution with managed installation. When they are changeable, they are usually only changeable
by the cluster operator. Also, they are subject to change in future Kubernetes versions, and
setting them may require restarting processes. For those reasons, they should be used only when
there are no other options.
-->
在託管的 Kubernetes 服務中或者受控安裝的發行版本中，命令參數和設定文件不總是可以修改的。
即使它們是可修改的，通常其修改權限也僅限於叢集操作員。
此外，這些內容在將來的 Kubernetes 版本中很可能發生變化，設置新參數或設定文件可能需要重啓進程。
有鑑於此，應該在沒有其他替代方案時纔會使用這些命令參數和設定文件。

<!--
Built-in *policy APIs*, such as [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) and Role-based Access Control
([RBAC](/docs/reference/access-authn-authz/rbac/)), are built-in Kubernetes APIs that provide declaratively configured policy settings.
APIs are typically usable even with hosted Kubernetes services and with managed Kubernetes installations.
The built-in policy APIs follow the same conventions as other Kubernetes resources such as Pods.
When you use a policy APIs that is [stable](/docs/reference/using-api/#api-versioning), you benefit from a
[defined support policy](/docs/reference/using-api/deprecation-policy/) like other Kubernetes APIs.
For these reasons, policy APIs are recommended over *configuration files* and *command arguments* where suitable.
-->
諸如 [ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)、
[NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/)
和基於角色的訪問控制（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）
等**內置策略 API** 都是以聲明方式設定策略選項的內置 Kubernetes API。
即使在託管的 Kubernetes 服務和受控的 Kubernetes 安裝環境中，API 通常也是可用的。
內置策略 API 遵循與 Pod 這類其他 Kubernetes 資源相同的約定。
當你使用[穩定版本](/zh-cn/docs/reference/using-api/#api-versioning)的策略 API，
它們與其他 Kubernetes API 一樣，採納的是一種[預定義的支持策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
出於以上原因，在條件允許的情況下，基於策略 API 的方案應該優先於**設定文件**和**命令參數**。

<!--
## Extensions

Extensions are software components that extend and deeply integrate with Kubernetes.
They adapt it to support new types and new kinds of hardware.

Many cluster administrators use a hosted or distribution instance of Kubernetes.
These clusters come with extensions pre-installed. As a result, most Kubernetes
users will not need to install extensions and even fewer users will need to author new ones.
-->
## 擴展    {#extensions}

擴展（Extensions）是一些擴充 Kubernetes 能力並與之深度集成的軟件組件。
它們調整 Kubernetes 的工作方式使之支持新的類型和新的硬件種類。

大多數叢集管理員會使用一種託管的 Kubernetes 服務或者其某種發行版本。
這類叢集通常都預先安裝了擴展。因此，大多數 Kubernetes 使用者不需要安裝擴展，
至於需要自己編寫新的擴展的情況就更少了。

<!--
### Extension patterns

Kubernetes is designed to be automated by writing client programs. Any
program that reads and/or writes to the Kubernetes API can provide useful
automation. *Automation* can run on the cluster or off it. By following
the guidance in this doc you can write highly available and robust automation.
Automation generally works with any Kubernetes cluster, including hosted
clusters and managed installations.
-->
### 擴展模式   {#extension-patterns}

Kubernetes 從設計上即支持通過編寫客戶端程序來將其操作自動化。
任何能夠對 Kubernetes API 發出讀寫指令的程序都可以提供有用的自動化能力。
**自動化組件**可以運行在叢集上，也可以運行在叢集之外。
通過遵從本文中的指南，你可以編寫高度可用的、運行穩定的自動化組件。
自動化組件通常可以用於所有 Kubernetes 叢集，包括託管的叢集和受控的安裝環境。

<!--
There is a specific pattern for writing client programs that work well with
Kubernetes called the {{< glossary_tooltip term_id="controller" text="controller" >}}
pattern. Controllers typically read an object's `.spec`, possibly do things, and then
update the object's `.status`.

A controller is a client of the Kubernetes API. When Kubernetes is the client and calls
out to a remote service, Kubernetes calls this a *webhook*. The remote service is called
a *webhook backend*. As with custom controllers, webhooks do add a point of failure.
-->
編寫客戶端程序有一種特殊的{{< glossary_tooltip term_id="controller" text="控制器（Controller）" >}}模式，
能夠與 Kubernetes 很好地協同工作。控制器通常會讀取某個對象的 `.spec`，或許還會執行一些操作，
之後更新對象的 `.status`。

控制器是 Kubernetes API 的客戶端。當 Kubernetes 充當客戶端且調用某遠程服務時，
Kubernetes 將此稱作 **Webhook**。該遠程服務稱作 **Webhook 後端**。
與定製的控制器相似，Webhook 也會引入失效點（Point of Failure）。

{{< note >}}
<!--
Outside of Kubernetes, the term “webhook” typically refers to a mechanism for asynchronous
notifications, where the webhook call serves as a one-way notification to another system or
component. In the Kubernetes ecosystem, even synchronous HTTP callouts are often
described as “webhooks”.
-->
在 Kubernetes 之外，“Webhook” 這個詞通常是指一種異步通知機制，
其中 Webhook 調用將用作對另一個系統或組件的單向通知。
在 Kubernetes 生態系統中，甚至同步的 HTTP 調用也經常被描述爲 “Webhook”。
{{< /note >}}

<!--
In the webhook model, Kubernetes makes a network request to a remote service.
With the alternative *binary Plugin* model, Kubernetes executes a binary (program).
Binary plugins are used by the kubelet (for example, [CSI storage plugins](https://kubernetes-csi.github.io/docs/)
and [CNI network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)),
and by kubectl (see [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)).
-->
在 Webhook 模型中，Kubernetes 向遠程服務發起網路請求。
在另一種稱作**可執行文件插件（Binary Plugin）** 模型中，Kubernetes 執行某個可執行文件（程序）。
這些可執行文件插件由 kubelet（例如，[CSI 存儲插件](https://kubernetes-csi.github.io/docs/)和
[CNI 網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)）
和 kubectl 使用。

<!--
### Extension points

This diagram shows the extension points in a Kubernetes cluster and the
clients that access it.
-->
### 擴展點   {#extension-points}

下圖展示了 Kubernetes 叢集中的這些擴展點及其訪問叢集的客戶端。

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png"
    alt="用符號表示的七個編號的 Kubernetes 擴展點"
    class="diagram-large" caption="Kubernetes 擴展點" >}}

<!--
#### Key to the figure
-->
#### 圖示要點   {#key-to-the-figure}

<!--
1. Users often interact with the Kubernetes API using `kubectl`. [Plugins](#client-extensions)
   customise the behaviour of clients. There are generic extensions that can apply to different clients,
   as well as specific ways to extend `kubectl`.

1. The API server handles all requests. Several types of extension points in the API server allow
   authenticating requests, or blocking them based on their content, editing content, and handling
   deletion. These are described in the [API Access Extensions](#api-access-extensions) section.

1. The API server serves various kinds of *resources*. *Built-in resource kinds*, such as
   `pods`, are defined by the Kubernetes project and can't be changed.
   Read [API extensions](#api-extensions) to learn about extending the Kubernetes API.
-->
1. 使用者通常使用 `kubectl` 與 Kubernetes API 交互。
   [插件](#client-extensions)定製客戶端的行爲。
   有一些通用的擴展可以應用到不同的客戶端，還有一些特定的方式可以擴展 `kubectl`。

2. API 伺服器處理所有請求。API 伺服器中的幾種擴展點能夠使使用者對請求執行身份認證、
   基於其內容阻止請求、編輯請求內容、處理刪除操作等等。
   這些擴展點在 [API 訪問擴展](#api-access-extensions)節詳述。

3. API 伺服器能提供各種類型的**資源（Resources）** 服務。
   諸如 `pods` 的**內置資源類型**是由 Kubernetes 項目所定義的，無法改變。
   請查閱 [API 擴展](#api-extensions)瞭解如何擴展 Kubernetes API。

<!--
1. The Kubernetes scheduler [decides](/docs/concepts/scheduling-eviction/assign-pod-node/)
   which nodes to place pods on. There are several ways to extend scheduling, which are
   described in the [Scheduling extensions](#scheduling-extensions) section.

1. Much of the behavior of Kubernetes is implemented by programs called
   {{< glossary_tooltip term_id="controller" text="controllers" >}}, that are
   clients of the API server. Controllers are often used in conjunction with custom resources.
   Read [combining new APIs with automation](#combining-new-apis-with-automation) and
   [Changing built-in resources](#changing-built-in-resources) to learn more.
-->
4. Kubernetes 調度器負責[決定](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
   Pod 要放置到哪些節點上執行。有幾種方式來擴展調度行爲，這些方法將在[調度器擴展](#scheduling-extensions)節中展開說明。

5. Kubernetes 中的很多行爲都是通過稱爲{{< glossary_tooltip term_id="controller" text="控制器（Controller）" >}}的程序來實現的，
   這些程序也都是 API 伺服器的客戶端。控制器常常與定製資源結合使用。
   進一步瞭解請查閱[結合使用新的 API 與自動化組件](#combining-new-apis-with-automation)和[更改內置資源](#changing-built-in-resources)。

<!--
1. The kubelet runs on servers (nodes), and helps pods appear like virtual servers with their own IPs on
   the cluster network. [Network Plugins](#network-plugins) allow for different implementations of
   pod networking.

1. You can use [Device Plugins](#device-plugins) to integrate custom hardware or other special
   node-local facilities, and make these available to Pods running in your cluster. The kubelet
   includes support for working with device plugins.

   The kubelet also mounts and unmounts
   {{< glossary_tooltip text="volume" term_id="volume" >}} for pods and their containers.
   You can use [Storage Plugins](#storage-plugins) to add support for new kinds
   of storage and other volume types.
-->
6. Kubelet 運行在各個伺服器（節點）上，幫助 Pod 展現爲虛擬的伺服器並在叢集網路中擁有自己的 IP。
   [網路插件](#network-plugins)使得 Kubernetes 能夠採用不同實現技術來連接 Pod 網路。

7. 你可以使用[設備插件](#device-plugins)集成定製硬件或其他專用的節點本地設施，
   使得這些設施可用於叢集中運行的 Pod。Kubelet 包括了對使用設備插件的支持。

   kubelet 也會爲 Pod 及其容器增加或解除{{< glossary_tooltip text="卷" term_id="volume" >}}的掛載。
   你可以使用[存儲插件](#storage-plugins)增加對新存儲類別和其他卷類型的支持。

<!--
#### Extension point choice flowchart {#extension-flowchart}

If you are unsure where to start, this flowchart can help. Note that some solutions may involve
several types of extensions.
-->
#### 擴展點選擇流程圖   {#extension-flowchart}

如果你無法確定從何處入手，下面的流程圖可能對你有些幫助。
注意，某些方案可能需要同時採用幾種類型的擴展。

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/zh-cn/docs/concepts/extend-kubernetes/flowchart.svg"
    alt="附帶使用場景問題和實現指南的流程圖。綠圈表示是；紅圈表示否。"
    class="diagram-large" caption="選擇一個擴展方式的流程圖指導" >}}

---

<!--
## Client extensions

Plugins for kubectl are separate binaries that add or replace the behavior of specific subcommands.
The `kubectl` tool can also integrate with [credential plugins](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
These extensions only affect a individual user's local environment, and so cannot enforce site-wide policies.

If you want to extend the `kubectl` tool, read [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/).
-->
## 客戶端擴展   {#client-extensions}

kubectl 所用的插件是單獨的二進制文件，用於添加或替換特定子命令的行爲。
`kubectl` 工具還可以與[憑據插件](/zh-cn/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)集成。
這些擴展隻影響單個使用者的本地環境，因此不能強制執行站點範圍的策略。

如果你要擴展 `kubectl` 工具，請閱讀[用插件擴展 kubectl](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)。

<!--
## API extensions

### Custom resource definitions

Consider adding a _Custom Resource_ to Kubernetes if you want to define new controllers, application
configuration objects or other declarative APIs, and to manage them using Kubernetes tools, such
as `kubectl`.

For more about Custom Resources, see the
[Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) concept guide.
-->
## API 擴展  {#api-extensions}

### 定製資源對象   {#custom-resource-definitions}

如果你想要定義新的控制器、應用設定對象或者其他聲明式 API，並且使用 Kubernetes
工具（如 `kubectl`）來管理它們，可以考慮向 Kubernetes 添加**定製資源**。

關於定製資源的更多信息，可參見[定製資源概念指南](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。

<!--
### API aggregation layer

You can use Kubernetes' [API Aggregation Layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
to integrate the Kubernetes API with additional services such as for [metrics](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/).
-->
### API 聚合層   {#api-aggregation-layer}

你可以使用 Kubernetes 的
[API 聚合層](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)將
Kubernetes API 與其他服務集成，例如[指標](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)。

<!--
### Combining new APIs with automation

A combination of a custom resource API and a control loop is called the
{{< glossary_tooltip term_id="controller" text="controllers" >}} pattern. If your controller takes
the place of a human operator deploying infrastructure based on a desired state, then the controller
may also be following the {{< glossary_tooltip text="operator pattern" term_id="operator-pattern" >}}.
The Operator pattern is used to manage specific applications; usually, these are applications that
maintain state and require care in how they are managed.

You can also make your own custom APIs and control loops that manage other resources, such as storage,
or to define policies (such as an access control restriction).
-->
### 結合使用新 API 與自動化組件 {#combinding-new-apis-with-automation}

定製資源 API 與控制迴路的組合稱作{{< glossary_tooltip term_id="controller" text="控制器" >}}模式。
如果你的控制器代替人工操作員根據所需狀態部署基礎設施，那麼控制器也可以遵循
{{<glossary_tooltip text="Operator 模式" term_id="operator-pattern" >}}。
Operator 模式用於管理特定的應用；通常，這些應用需要維護狀態並需要仔細考慮狀態的管理方式。

你還可以創建自己的定製 API 和控制迴路來管理其他資源（例如存儲）或定義策略（例如訪問控制限制）。

<!--
### Changing built-in resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall
into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (such as Pods), whereas
_API Access Extensions_ do.
-->
### 更改內置資源   {#changing-built-in-resources}

當你通過添加定製資源來擴展 Kubernetes 時，所添加的資源總是會被放在一個新的 API 組中。
你不可以替換或更改現有的 API 組。添加新的 API 不會直接讓你影響現有
API（如 Pod）的行爲，不過 **API 訪問擴展**能夠實現這點。

<!--
## API access extensions

When a request reaches the Kubernetes API Server, it is first _authenticated_, then _authorized_,
and is then subject to various types of _admission control_ (some requests are in fact not
authenticated, and get special treatment). See
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/)
for more on this flow.

Each of the steps in the Kubernetes authentication / authorization flow offers extension points.
-->
## API 訪問擴展    {#api-access-extensions}

當請求到達 Kubernetes API 伺服器時，首先要經過**身份認證**，之後是**鑑權**操作，
再之後要經過若干類型的**准入控制**（某些請求實際上未通過身份認證，需要特殊處理）。
參見[控制 Kubernetes API 訪問](/zh-cn/docs/concepts/security/controlling-access/)以瞭解此流程的細節。

Kubernetes 身份認證/授權流程中的每個步驟都提供了擴展點。

<!--
### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates
in all requests to a username for the client making the request.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an
authenticating proxy, and it can send a token from an `Authorization:` header to a remote service for
verification (an [authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication))
if those don't meet your needs.
-->
### 身份認證    {#authentication}

[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)負責將所有請求中的頭部或證書映射到發出該請求的客戶端的使用者名。

Kubernetes 提供若干內置的身份認證方法。它也可以運行在某種身份認證代理的後面，
並且可以將來自 `Authorization:` 頭部的令牌發送到某個遠程服務
（[認證 Webhook](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
來執行驗證操作，以備內置方法無法滿足你的要求。

<!--
### Authorization

[Authorization](/docs/reference/access-authn-authz/authorization/) determines whether specific
users can read, write, and do other operations on API resources. It works at the level of whole
resources -- it doesn't discriminate based on arbitrary object fields.

If the built-in authorization options don't meet your needs, an
[authorization webhook](/docs/reference/access-authn-authz/webhook/)
allows calling out to custom code that makes an authorization decision.
-->
### 鑑權    {#authorization}

[鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)操作負責確定特定的使用者是否可以讀、寫 API
資源或對其執行其他操作。此操作僅在整個資源集合的層面進行。
換言之，它不會基於對象的特定字段作出不同的判決。

如果內置的鑑權選項無法滿足你的需要，
你可以使用[鑑權 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)
來調用使用者提供的代碼，執行定製的鑑權決定。

<!--
### Dynamic admission control

After a request is authorized, if it is a write operation, it also goes through
[Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps.
In addition to the built-in steps, there are several extensions:

* The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  restricts what images can be run in containers.
* To make arbitrary admission control decisions, a general
  [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  can be used. Admission webhooks can reject creations or updates.
  Some admission webhooks modify the incoming request data before it is handled further by Kubernetes.
-->
### 動態准入控制  {#dynamic-admission-control}

請求的鑑權操作結束之後，如果請求的是寫操作，
還會經過[准入控制](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)處理步驟。
除了內置的處理步驟，還存在一些擴展點：

* [映像檔策略 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  能夠限制容器中可以運行哪些映像檔。
* 爲了執行任意的准入控制決定，
  可以使用一種通用的[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  機制。這類准入 Webhook 可以拒絕創建或更新請求。
  一些准入 Webhook 會先修改傳入的請求數據，纔會由 Kubernetes 進一步處理這些傳入請求數據。

<!--
## Infrastructure extensions

### Device plugins

_Device plugins_ allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).
-->
## 基礎設施擴展    {#infrastructure-extensions}

### 設備插件   {#device-plugins}

**設備插件**允許一個節點通過[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)發現新的
Node 資源（除了內置的類似 CPU 和內存這類資源之外）。

<!--
### Storage plugins

{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins provide
a way to extend Kubernetes with supports for new kinds of volumes. The volumes can be backed by
durable external storage, or provide ephemeral storage, or they might offer a read-only interface
to information using a filesystem paradigm.

Kubernetes also includes support for [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) plugins,
which are deprecated since Kubernetes v1.23 (in favour of CSI).
-->
### 存儲插件  {#storage-plugins}

{{< glossary_tooltip text="容器存儲接口" term_id="csi" >}} (CSI) 插件提供了一種擴展
Kubernetes 的方式使其支持新類別的卷。
這些卷可以由持久的外部存儲提供支持，可以提供臨時存儲，還可以使用文件系統範型爲信息提供只讀接口。

Kubernetes 還包括對 [FlexVolume](/zh-cn/docs/concepts/storage/volumes/#flexvolume)
插件的支持，該插件自 Kubernetes v1.23 起被棄用（被 CSI 替代）。

<!--
FlexVolume plugins allow users to mount volume types that aren't natively supported by Kubernetes. When
you run a Pod that relies on FlexVolume storage, the kubelet calls a binary plugin to mount the volume.
The archived [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
design proposal has more detail on this approach.

The [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
includes general information on storage plugins.
-->
FlexVolume 插件允許使用者掛載 Kubernetes 本身不支持的卷類型。
當你運行依賴於 FlexVolume 存儲的 Pod 時，kubelet 會調用一個二進制插件來掛載該卷。
歸檔的 [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
設計提案對此方法有更多詳細說明。

[Kubernetes 存儲供應商的卷插件 FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
包含了有關存儲插件的通用信息。

<!--
### Network plugins

Your Kubernetes cluster needs a _network plugin_ in order to have a working Pod network
and to support other aspects of the Kubernetes network model.

[Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
allow Kubernetes to work with different networking topologies and technologies.
-->
### 網路插件   {#network-plugins}

你的 Kubernetes 叢集需要一個**網路插件**才能擁有一個正常工作的 Pod 網路，
才能支持 Kubernetes 網路模型的其他方面。

[網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)可以讓
Kubernetes 使用不同的網路拓撲和技術。

<!--
### Kubelet image credential provider plugins

{{< feature-state for_k8s_version="v1.26" state="stable" >}}
Kubelet image credential providers are plugins for the kubelet to dynamically retrieve image registry
credentials. The credentials are then used when pulling images from container image registries that
match the configuration.

The plugins can communicate with external services or use local files to obtain credentials. This way,
the kubelet does not need to have static credentials for each registry, and can support various
authentication methods and protocols.

For plugin configuration details, see
[Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/).
-->
### Kubelet 映像檔憑據提供程序插件   {#kubelet-image-credential-provider-plugins}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}
Kubelet 映像檔憑據提供程序是 Kubelet 動態檢索映像檔倉庫憑據的插件。
當你從與設定匹配的容器映像檔倉庫中拉取映像檔時，這些憑據將被使用。

這些插件可以與外部服務通信或使用本地文件來獲取憑據。這樣，kubelet
就不需要爲每個倉庫都設置靜態憑據，並且可以支持各種身份驗證方法和協議。

有關插件設定的詳細信息，請參閱
[設定 kubelet 映像檔憑據提供程序](/zh-cn/docs/tasks/administer-cluster/kubelet-credential-provider/)。

<!--
## Scheduling extensions

The scheduler is a special type of controller that watches pods, and assigns
pods to nodes. The default scheduler can be replaced entirely, while
continuing to use other Kubernetes components, or
[multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
can run at the same time.

This is a significant undertaking, and almost all Kubernetes users find they
do not need to modify the scheduler.
-->
## 調度擴展   {#scheduling-extensions}

調度器是一種特殊的控制器，負責監視 Pod 變化並將 Pod 分派給節點。
默認的調度器可以被整體替換掉，同時繼續使用其他 Kubernetes 組件。
或者也可以在同一時刻使用[多個調度器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。

這是一項非同小可的任務，幾乎絕大多數 Kubernetes
使用者都會發現其實他們不需要修改調度器。

<!--
You can control which [scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins)
are active, or associate sets of plugins with different named [scheduler profiles](/docs/reference/scheduling/config/#multiple-profiles).
You can also write your own plugin that integrates with one or more of the kube-scheduler's
[extension points](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points).

Finally, the built in `kube-scheduler` component supports a
[webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)
that permits a remote HTTP backend (scheduler extension) to filter and / or prioritize
the nodes that the kube-scheduler chooses for a pod.
-->
你可以控制哪些[調度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)處於激活狀態，
或將插件集關聯到名字不同的[調度器設定文件](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)上。
你還可以編寫自己的插件，與一個或多個 kube-scheduler
的[擴展點](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)集成。

最後，內置的 `kube-scheduler` 組件支持
[Webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)，
從而允許遠程 HTTP 後端（調度器擴展）來爲 kube-scheduler 選擇的 Pod 所在節點執行過濾和優先排序操作。

{{< note >}}
<!--
You can only affect node filtering
and node prioritization with a scheduler extender webhook; other extension points are
not available through the webhook integration.
-->
你只能使用調度器擴展程序 Webhook 來影響節點過濾和節點優先排序；
其他擴展點無法通過集成 Webhook 獲得。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about infrastructure extensions
  * [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [storage plugins](https://kubernetes-csi.github.io/docs/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Learn more about [Extension API Servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)
-->
* 進一步瞭解基礎設施擴展
  * [設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [存儲插件](https://kubernetes-csi.github.io/docs/)
* 進一步瞭解 [kubectl 插件](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)
* 進一步瞭解[定製資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 進一步瞭解[擴展 API 伺服器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* 進一步瞭解[動態准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
* 進一步瞭解 [Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)
