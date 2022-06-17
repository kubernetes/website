---
title: 擴充套件 Kubernetes
weight: 110
description: 改變你的 Kubernetes 叢集的行為的若干方法。
feature:
  title: 為擴充套件性設計
  description: >
    無需更改上游原始碼即可擴充套件你的 Kubernetes 叢集。
content_type: concept
no_list: true
---
<!--
title: Extending Kubernetes
weight: 110
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
Kubernetes is highly configurable and extensible. As a result,
there is rarely a need to fork or submit patches to the Kubernetes
project code.

This guide describes the options for customizing a Kubernetes
cluster. It is aimed at {{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} who want to
understand how to adapt their Kubernetes cluster to the needs of
their work environment. Developers who are prospective {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} or Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}} will also find it
useful as an introduction to what extension points and patterns
exist, and their trade-offs and limitations.
-->
Kubernetes 是高度可配置且可擴充套件的。因此，大多數情況下，你不需要
派生自己的 Kubernetes 副本或者向專案程式碼提交補丁。

本指南描述定製 Kubernetes 的可選方式。主要針對的讀者是希望瞭解如何針對自身工作環境
需要來調整 Kubernetes 的{{< glossary_tooltip text="叢集管理者" term_id="cluster-operator" >}}。
對於那些充當{{< glossary_tooltip text="平臺開發人員" term_id="platform-developer" >}}
的開發人員或 Kubernetes 專案的{{< glossary_tooltip text="貢獻者" term_id="contributor" >}}
而言，他們也會在本指南中找到有用的介紹資訊，瞭解系統中存在哪些擴充套件點和擴充套件模式，
以及它們所附帶的各種權衡和約束等等。

<!-- body -->

<!--
## Overview

Customization approaches can be broadly divided into *configuration*, which only involves changing flags, local configuration files, or API resources; and *extensions*, which involve running additional programs or services. This document is primarily about extensions.
-->
## 概述  {#overview}

定製化的方法主要可分為 *配置（Configuration）* 和 *擴充套件（Extensions）* 兩種。
前者主要涉及改變引數標誌、本地配置檔案或者 API 資源；
後者則需要額外執行一些程式或服務。
本文主要關注擴充套件。

<!--
## Configuration

*Configuration files* and *flags* are documented in the Reference section of the online documentation, under each binary:

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->
## 配置   {#configuration}

配置檔案和引數標誌的說明位於線上文件的參考章節，按可執行檔案組織：

* [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
* [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
* [kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/).

<!--
Flags and configuration files may not always be changeable in a hosted Kubernetes service or a distribution with managed installation. When they are changeable, they are usually only changeable by the cluster administrator. Also, they are subject to change in future Kubernetes versions, and setting them may require restarting processes. For those reasons, they should be used only when there are no other options.
-->
在託管的 Kubernetes 服務中或者受控安裝的發行版本中，引數標誌和配置檔案不總是可以
修改的。即使它們是可修改的，通常其修改許可權也僅限於叢集管理員。
此外，這些內容在將來的 Kubernetes 版本中很可能發生變化，設定新引數或配置檔案可能
需要重啟程序。
有鑑於此，通常應該在沒有其他替代方案時才應考慮更改引數標誌和配置檔案。

<!--
*Built-in Policy APIs*, such as [ResourceQuota](/docs/concepts/policy/resource-quotas/), [PodSecurityPolicies](/docs/concepts/security/pod-security-policy/), [NetworkPolicy](/docs/concepts/services-networking/network-policies/) and Role-based Access Control ([RBAC](/docs/reference/access-authn-authz/rbac/)), are built-in Kubernetes APIs. APIs are typically used with hosted Kubernetes services and with managed Kubernetes installations. They are declarative and use the same conventions as other Kubernetes resources like pods, so new cluster configuration can be repeatable and be managed the same way as applications. And, where they are stable, they enjoy a [defined support policy](/docs/reference/using-api/deprecation-policy/) like other Kubernetes APIs. For these reasons, they are preferred over *configuration files* and *flags* where suitable.
-->
*內建的策略 API*，例如[ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)、
[PodSecurityPolicies](/zh-cn/docs/concepts/security/pod-security-policy/)、
[NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/)
和基於角色的訪問控制（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）
等等都是內建的 Kubernetes API。
API 通常用於託管的 Kubernetes 服務和受控的 Kubernetes 安裝環境中。
這些 API 是宣告式的，與 Pod 這類其他 Kubernetes 資源遵從相同的約定，
所以新的叢集配置是可複用的，並且可以當作應用程式來管理。
此外，對於穩定版本的 API 而言，它們與其他 Kubernetes API 一樣，
採納的是一種[預定義的支援策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
出於以上原因，在條件允許的情況下，基於 API 的方案應該優先於配置檔案和引數標誌。

<!--
## Extensions

Extensions are software components that extend and deeply integrate with Kubernetes.
They adapt it to support new types and new kinds of hardware.

Many cluster administrators use a hosted or distribution instance of Kubernetes. 
These clusters come with extensions pre-installed. As a result, most Kubernetes 
users will not need to install extensions and even fewer users will need to author new ones.
-->
## 擴充套件    {#extensions}

擴充套件（Extensions）是一些擴充 Kubernetes 能力並與之深度整合的軟體元件。
它們調整 Kubernetes 的工作方式使之支援新的型別和新的硬體種類。

大多數叢集管理員會使用一種託管的 Kubernetes 服務或者其某種發行版本。
這類叢集通常都預先安裝了擴充套件。因此，大多數 Kubernetes 使用者不需要安裝擴充套件，
至於需要自己編寫新的擴充套件的情況就更少了。

<!--
## Extension Patterns

Kubernetes is designed to be automated by writing client programs. Any
program that reads and/or writes to the Kubernetes API can provide useful
automation. *Automation* can run on the cluster or off it. By following
the guidance in this doc you can write highly available and robust automation.
Automation generally works with any Kubernetes cluster, including hosted
clusters and managed installations.
-->
## 擴充套件模式   {#extension-patterns}

Kubernetes 從設計上即支援透過編寫客戶端程式來將其操作自動化。
任何能夠對 Kubernetes API 發出讀寫指令的程式都可以提供有用的自動化能力。
*自動化元件*可以執行在叢集上，也可以執行在叢集之外。
透過遵從本文中的指南，你可以編寫高度可用的、執行穩定的自動化元件。
自動化元件通常可以用於所有 Kubernetes 叢集，包括託管的叢集和受控的安裝環境。

<!--
There is a specific pattern for writing client programs that work well with
Kubernetes called the *Controller* pattern. Controllers typically read an
object's `.spec`, possibly do things, and then update the object's `.status`.

A controller is a client of Kubernetes. When Kubernetes is the client and
calls out to a remote service, it is called a *Webhook*. The remote service
is called a *Webhook Backend*. Like Controllers, Webhooks do add a point of
failure.
-->
編寫客戶端程式有一種特殊的 Controller（控制器）模式，能夠與 Kubernetes
很好地協同工作。控制器通常會讀取某個物件的 `.spec`，或許還會執行一些操作，
之後更新物件的 `.status`。

Controller 是 Kubernetes 的客戶端。當 Kubernetes 充當客戶端，
呼叫某遠端服務時，對應的遠端元件稱作 *Webhook*，遠端服務稱作 Webhook 後端。
與控制器模式相似，Webhook 也會在整個架構中引入新的失效點（Point of Failure）。

<!--
In the webhook model, Kubernetes makes a network request to a remote service.
In the *Binary Plugin* model, Kubernetes executes a binary (program).
Binary plugins are used by the kubelet (e.g.
[Flex Volume Plugins](/docs/concepts/storage/volumes/#flexvolume)
and [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/))
and by kubectl.

Below is a diagram showing how the extension points interact with the
Kubernetes control plane.
-->
在 Webhook 模式中，Kubernetes 向遠端服務發起網路請求。
在 **可執行檔案外掛（Binary Plugin）** 模式中，Kubernetes
執行某個可執行檔案（程式）。可執行檔案外掛在 kubelet （例如，
[FlexVolume 外掛](/zh-cn/docs/concepts/storage/volumes/#flexvolume))
和[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)）
和 kubectl 中使用。

下面的示意圖中展示了這些擴充套件點如何與 Kubernetes 控制面交互。

<!-- image source drawing https://docs.google.com/drawings/d/1muJ7Oxuj_7Gtv7HV9-2zJbOnkQJnjxq-v1ym_kZfB-4/edit?ts=5a01e054 -->
<!--
![Extension Points and the Control Plane](/docs/concepts/extend-kubernetes/control-plane.png)
-->
![擴充套件點與控制面](/docs/concepts/extend-kubernetes/control-plane.png)

<!--
## Extension Points

This diagram shows the extension points in a Kubernetes system.
-->
## 擴充套件點   {#extension-points}

此示意圖顯示的是 Kubernetes 系統中的擴充套件點。

<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->
<!--
![Extension Points](/docs/concepts/extend-kubernetes/extension-points.png)
-->
![擴充套件點](/docs/concepts/extend-kubernetes/extension-points.png)

<!--
1.   Users often interact with the Kubernetes API using `kubectl`. [Kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) extend the kubectl binary. They only affect the individual user's local environment, and so cannot enforce site-wide policies.
2.   The apiserver handles all requests. Several types of extension points in the apiserver allow authenticating requests, or blocking them based on their content, editing content, and handling deletion. These are described in the [API Access Extensions](#api-access-extensions) section.
3.   The apiserver serves various kinds of *resources*. *Built-in resource kinds*, like `pods`, are defined by the Kubernetes project and can't be changed. You can also add resources that you define, or that other projects have defined, called *Custom Resources*, as explained in the [Custom Resources](#user-defined-types) section. Custom Resources are often used with API Access Extensions.
4.   The Kubernetes scheduler decides which nodes to place pods on. There are several ways to extend scheduling. These are described in the [Scheduler Extensions](#scheduler-extensions) section.
5.   Much of the behavior of Kubernetes is implemented by programs called Controllers which are clients of the API-Server. Controllers are often used in conjunction with Custom Resources.
6.   The kubelet runs on servers, and helps pods appear like virtual servers with their own IPs on the cluster network. [Network Plugins](#network-plugins) allow for different implementations of pod networking.
7.  The kubelet also mounts and unmounts volumes for containers. New types of storage can be supported via [Storage Plugins](#storage-plugins).

If you are unsure where to start, this flowchart can help. Note that some solutions may involve several types of extensions.
-->
1. 使用者通常使用 `kubectl` 與 Kubernetes API 互動。
   [kubectl 外掛](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)能夠擴充套件 kubectl 程式的行為。
   這些外掛只會影響到每個使用者的本地環境，因此無法用來強制實施整個站點範圍的策略。

2. API 伺服器處理所有請求。API 伺服器中的幾種擴充套件點能夠使使用者對請求執行身份認證、
   基於其內容阻止請求、編輯請求內容、處理刪除操作等等。
   這些擴充套件點在 [API 訪問擴充套件](#api-access-extensions)節詳述。

3. API 伺服器向外提供不同型別的資源（resources）。
   內建的資源型別，如 `pods`，是由 Kubernetes 專案所定義的，無法改變。
   你也可以新增自己定義的或者其他專案所定義的稱作自定義資源（Custom Resources）
   的資源，正如[自定義資源](#user-defined-types)節所描述的那樣。
   自定義資源通常與 API 訪問擴充套件點結合使用。

4. Kubernetes 排程器負責決定 Pod 要放置到哪些節點上執行。
   有幾種方式來擴充套件排程行為。這些方法將在
   [排程器擴充套件](#scheduler-extensions)節中展開。

5. Kubernetes 中的很多行為都是透過稱為控制器（Controllers）的程式來實現的，
   這些程式也都是 API 伺服器的客戶端。控制器常常與自定義資源結合使用。

6. 元件 kubelet 執行在各個節點上，幫助 Pod 展現為虛擬的伺服器並在叢集網路中擁有自己的 IP。
   [網路外掛](#network-plugins)使得 Kubernetes 能夠採用不同實現技術來連線
   Pod 網路。

7. 元件 kubelet 也會為容器增加或解除儲存卷的掛載。
   透過[儲存外掛](#storage-plugins)，可以支援新的儲存型別。

如果你無法確定從何處入手，下面的流程圖可能對你有些幫助。
注意，某些方案可能需要同時採用幾種型別的擴充套件。

<!-- image source drawing: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->
<!--
![Flowchart for Extension](/docs/concepts/extend-kubernetes/flowchart.png)
-->
![擴充套件流程圖](/docs/concepts/extend-kubernetes/flowchart.png)

<!--
## API Extensions

### User-Defined Types

Consider adding a Custom Resource to Kubernetes if you want to define new controllers, application configuration objects or other declarative APIs, and to manage them using Kubernetes tools, such as `kubectl`.

Do not use a Custom Resource as data storage for application, user, or monitoring data.

For more about Custom Resources, see the [Custom Resources concept guide](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
## API 擴充套件  {#api-extensions}

### 使用者定義的型別   {#user-defined-types}

如果你想要定義新的控制器、應用配置物件或者其他宣告式 API，並且使用 Kubernetes
工具（如 `kubectl`）來管理它們，可以考慮向 Kubernetes 新增自定義資源。

不要使用自定義資源來充當應用、使用者或者監控資料的資料儲存。

關於自定義資源的更多資訊，可參見[自定義資源概念指南](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。

<!--
### Combining New APIs with Automation

The combination of a custom resource API and a control loop is called the [Operator pattern](/docs/concepts/extend-kubernetes/operator/). The Operator pattern is used to manage specific, usually stateful, applications. These custom APIs and control loops can also be used to control other resources, such as storage or policies.
-->
### 結合使用新 API 與自動化元件 {#combinding-new-apis-with-automation}

自定義資源 API 與控制迴路的組合稱作
[Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)。
Operator 模式用來管理特定的、通常是有狀態的應用。
這些自定義 API 和控制迴路也可用來控制其他資源，如儲存或策略。

<!--
### Changing Built-in Resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (e.g. Pods), but API Access Extensions do.
-->
### 更改內建資源   {#changing-built-in-resources}

當你透過新增自定義資源來擴充套件 Kubernetes 時，所新增的資源通常會被放在一個新的
API 組中。你不可以替換或更改現有的 API 組。
新增新的 API 不會直接讓你影響現有 API （如 Pods）的行為，不過 API
訪問擴充套件能夠實現這點。

<!--
### API Access Extensions

When a request reaches the Kubernetes API Server, it is first Authenticated, then Authorized, then subject to various types of Admission Control. See [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/) for more on this flow.

Each of these steps offers extension points.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an authenticating proxy, and it can send a token from an Authorization header to a remote service for verification (a webhook). All of these methods are covered in the [Authentication documentation](/docs/reference/access-authn-authz/authentication/).
-->
### API 訪問擴充套件    {#api-access-extensions}

當請求到達 Kubernetes API 伺服器時，首先要經過身份認證，之後是鑑權操作，
再之後要經過若干型別的准入控制器的檢查。
參見[控制 Kubernetes API 訪問](/zh-cn/docs/concepts/security/controlling-access/)
以瞭解此流程的細節。

這些步驟中都存在擴充套件點。

Kubernetes 提供若干內建的身份認證方法。它也可以執行在某種身份認證代理的後面，
並且可以將來自鑑權頭部的令牌傳送到某個遠端服務（Webhook）來執行驗證操作。
所有這些方法都在[身份認證文件](/zh-cn/docs/reference/access-authn-authz/authentication/)
中有詳細論述。

<!--
### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates in all requests to a username for the client making the request.

Kubernetes provides several built-in authentication methods, and an [Authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) method if those don't meet your needs.
-->
### 身份認證    {#authentication}

[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)負責將所有請求中
的頭部或證書對映到發出該請求的客戶端的使用者名稱。

Kubernetes 提供若干種內建的認證方法，以及
[認證 Webhook](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
方法以備內建方法無法滿足你的要求。

<!--
### Authorization

[Authorization](/docs/reference/access-authn-authz/authorization/) determines whether specific users can read, write, and do other operations on API resources. It works at the level of whole resources - it doesn't discriminate based on arbitrary object fields. If the built-in authorization options don't meet your needs, and [Authorization webhook](/docs/reference/access-authn-authz/webhook/) allows calling out to user-provided code to make an authorization decision.
-->
### 鑑權    {#authorization}

[鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)
操作負責確定特定的使用者是否可以讀、寫 API 資源或對其執行其他操作。
此操作僅在整個資源集合的層面進行。
換言之，它不會基於物件的特定欄位作出不同的判決。
如果內建的鑑權選項無法滿足你的需要，你可以使用
[鑑權 Webhook](/zh-cn/docs/reference/access-authn-authz/webhook/)來呼叫使用者提供
的程式碼，執行定製的鑑權操作。

<!--
### Dynamic Admission Control

After a request is authorized, if it is a write operation, it also goes through [Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps. In addition to the built-in steps, there are several extensions:

*   The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook) restricts what images can be run in containers.
*   To make arbitrary admission control decisions, a general [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) can be used. Admission Webhooks can reject creations or updates.
-->
### 動態准入控制  {#dynamic-admission-control}

請求的鑑權操作結束之後，如果請求的是寫操作，還會經過
[准入控制](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)處理步驟。
除了內建的處理步驟，還存在一些擴充套件點：

* [映象策略 Webhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  能夠限制容器中可以執行哪些映象。
* 為了執行任意的准入控制，可以使用一種通用的
  [准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) 
  機制。這類 Webhook 可以拒絕物件建立或更新請求。

<!--
## Infrastructure Extensions

### Storage Plugins

[Flex Volumes](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md
) allow users to mount volume types without built-in support by having the
Kubelet call a Binary Plugin to mount the volume.
-->
## 基礎設施擴充套件    {#infrastructure-extensions}

### 儲存外掛  {#storage-plugins}

[FlexVolumes](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md
)
卷可以讓使用者掛載無需內建支援的卷型別，
kubelet 會呼叫可執行檔案外掛來掛載對應的儲存卷。

<!--
FlexVolume is deprecated since Kubernetes v1.23. The Out-of-tree CSI driver is the recommended way to write volume drivers in Kubernetes. See [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors) for more information.
-->
從 Kubernetes v1.23 開始，FlexVolume 被棄用。
在 Kubernetes 中編寫卷驅動的推薦方式是使用樹外（Out-of-tree）CSI 驅動。
詳細資訊可參閱 [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)。

<!--
### Device Plugins

Device plugins allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a [Device
Plugin](/docs/concepts/cluster-administration/device-plugins/).

### Network Plugins

Different networking fabrics can be supported via node-level [Network Plugins](/docs/admin/network-plugins/).
-->
### 裝置外掛    {#device-plugins}

使用[裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)，
節點能夠發現新的節點資源（除了內建的類似 CPU 和記憶體這類資源）。

### 網路外掛   {#network-plugins}

透過節點層面的[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)，
可以支援不同的網路設施。

<!--
### Scheduler Extensions

The scheduler is a special type of controller that watches pods, and assigns
pods to nodes. The default scheduler can be replaced entirely, while
continuing to use other Kubernetes components, or
[multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
can run at the same time.

This is a significant undertaking, and almost all Kubernetes users find they
do not need to modify the scheduler.

The scheduler also supports a
[webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)
that permits a webhook backend (scheduler extension) to filter and prioritize
the nodes chosen for a pod.
-->
### 排程器擴充套件   {#scheduler-extensions}

排程器是一種特殊的控制器，負責監視 Pod 變化並將 Pod 分派給節點。
預設的排程器可以被整體替換掉，同時繼續使用其他 Kubernetes 元件。
或者也可以在同一時刻使用
[多個排程器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。

這是一項非同小可的任務，幾乎絕大多數 Kubernetes
使用者都會發現其實他們不需要修改排程器。

排程器也支援一種
[Webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)，
允許使用某種 Webhook 後端（排程器擴充套件）來為 Pod 可選的節點執行過濾和優先排序操作。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn more about Infrastructure extensions
  * [Network Plugins](/docs/concepts/cluster-administration/network-plugins/)
  * [Device Plugins](/docs/concepts/cluster-administration/device-plugins/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)
-->
* 進一步瞭解[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* 瞭解[動態准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
* 進一步瞭解基礎設施擴充套件
  * [網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* 瞭解 [kubectl 外掛](/zh-cn/docs/tasks/extend-kubectl/kubectl-plugins/)
* 瞭解 [Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)

