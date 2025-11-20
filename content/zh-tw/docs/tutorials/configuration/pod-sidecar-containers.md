---
title: 使用邊車（Sidecar）容器
content_type: tutorial
weight: 40
min-kubernetes-server-version: 1.29
---
<!--
title: Adopting Sidecar Containers
content_type: tutorial
weight: 40
min-kubernetes-server-version: 1.29
-->

<!-- overview -->

<!--
This section is relevant for people adopting a new built-in
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature for their workloads.

Sidecar container is not a new concept as posted in the
[blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/).
Kubernetes allows running multiple containers in a Pod to implement this concept.
However, running a sidecar container as a regular container
has a lot of limitations being fixed with the new built-in sidecar containers support.
-->
本文適用於使用新的內置[邊車容器](/docs/concepts/workloads/pods/sidecar-containers/)特性的使用者。

邊車容器並不是一個新概念，正如在[博客文章](/blog/2015/06/the-distributed-system-toolkit-patterns/)中所提到的那樣。
Kubernetes 允許在一個 Pod 中運行多個容器來實現這一概念。然而，作爲一個普通容器運行邊車容器存在許多限制，
這些限制通過新的內置邊車容器支持得到了解決。

{{< feature-state feature_gate_name="SidecarContainers" >}}

## {{% heading "objectives" %}}

<!--
- Understand the need for sidecar containers
- Be able to troubleshoot issues with the sidecar containers
- Understand options to universally "inject" sidecar containers to any workload
-->
- 理解邊車容器的需求
- 能夠排查邊車容器的問題
- 瞭解如何"注入"邊車容器到任意的工作負載中

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

<!--
## Sidecar containers overview

Sidecar containers are secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the primary _app
container_ by providing additional services, or functionalities such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.
You can read more in the [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
concept page.
-->
## 邊車容器概述

邊車容器是與主應用程式容器在同一 {{< glossary_tooltip text="Pod" term_id="pod" >}}
內一起運行的輔助容器。這些容器通過提供額外的服務或功能（如日誌記錄、監控、安全或資料同步）來增強或擴展主**應用容器**的功能，
而無需直接修改主應用程式代碼。你可以在[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)概念頁面中閱讀更多相關內容。

<!--
The concept of sidecar containers is not new and there are multiple implementations of this concept.
As well as sidecar containers that you, the person defining the Pod, want to run, you can also find
that some {{< glossary_tooltip text="addons" term_id="addons" >}} modify Pods - before the Pods
start running - so that there are extra sidecar containers. The mechanisms to _inject_ those extra
sidecars are often [mutating webhooks](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
For example, a service mesh addon might inject a sidecar that configures mutual TLS and encryption
in transit between different Pods.
-->
邊車容器的概念並不新鮮，有許多不同的實現方式。除了你（定義 Pod 的人）希望運行的邊車容器外，
一些{{< glossary_tooltip text="插件" term_id="addons" >}}也會在 Pod 開始運行之前對其進行修改，
以添加額外的邊車容器。這些額外邊車容器的**注入**機制通常是[變更 Webhook（Mutating Webhook）](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
例如，服務網格插件可能會注入一個設定雙向 TLS（Mutual TLS）和傳輸中加密的邊車容器。

<!--
While the concept of sidecar containers is not new,
the native implementation of this feature in Kubernetes, however, is new. And as with every new feature,
adopting this feature may present certain challenges.

This tutorial explores challenges and solutions that can be experienced by end users as well as
by authors of sidecar containers.
-->
雖然邊車容器的概念並不新鮮，但 Kubernetes 對這一特性的原生實現卻是新的。
與每一項新特性一樣，採用這一特性可能會帶來某些挑戰。

本教程探討了終端使用者和邊車容器作者可能遇到的挑戰及其解決方案。

<!--
## Benefits of a built-in sidecar container

Using Kubernetes' native support for sidecar containers provides several benefits:

1. You can configure a native sidecar container to start ahead of
   {{< glossary_tooltip text="init containers" term_id="init-container" >}}.
1. The built-in sidecar containers can be authored to guarantee that they are terminated last.
   Sidecar containers are terminated with a `SIGTERM` signal once all the regular containers
   are completed and terminated. If the sidecar container isn’t gracefully shut down, a
   `SIGKILL` signal will be used to terminate it.
1. With Jobs, when Pod's `restartPolicy: OnFailure` or `restartPolicy: Never`,
   native sidecar containers do not block Pod completion. With legacy sidecar containers,
   special care is needed to handle this situation.
1. Also, with Jobs, built-in sidecar containers would keep being restarted once they are done,
   even if regular containers would not with Pod's `restartPolicy: Never`.

See [differences from init containers](/docs/concepts/workloads/pods/sidecar-containers/#differences-from-application-containers)
to learn more about it.
-->
## 內置邊車容器的優勢

使用 Kubernetes 對邊車容器的原生支持可以帶來以下幾個好處：

1. 你可以設定原生邊車容器在 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}}之前啓動。
2. 內置邊車容器可以編寫爲確保它們最後終止。一旦所有常規容器完成並終止，邊車容器將接收到 `SIGTERM` 信號。
   如果邊車容器未能體面關閉，系統將使用 `SIGKILL` 信號終止它。
3. 在 Job 中，當 Pod 設定 `restartPolicy: OnFailure` 或 `restartPolicy: Never` 時，
   原生邊車容器不會阻止 Pod 完成。而對於傳統邊車容器，需要特別處理這種情況。
4. 同樣在 Job 中，即使 Pod 的 `restartPolicy: Never` 時常規容器不會重啓，
   內置邊車容器仍會在完成後繼續重啓。

更多詳情請參見[與 Init 容器的區別](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/#differences-from-application-containers)。

<!--
## Adopting built-in sidecar containers

The `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is in beta state starting from Kubernetes version 1.29 and is enabled by default.
Some clusters may have this feature disabled or have software installed that is incompatible with the feature.

When this happens, the Pod may be rejected or the sidecar containers may block Pod startup,
rendering the Pod useless. This condition is easy to detect as the Pod simply gets stuck on
initialization. However, it is often unclear what caused the problem.

Here are the considerations and troubleshooting steps that one can take while adopting sidecar containers for their workload.
-->
## 採用內置邊車容器

從 Kubernetes 1.29 版本開始，`SidecarContainers`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)處於 Beta 階段，
並預設啓用。某些叢集可能禁用了此特性，或者安裝了與該特性不兼容的軟體。

當這種情況發生時，Pod 可能會被拒絕，或者邊車容器可能阻止 Pod 啓動，導致 Pod 無法使用。
這種情況下很容易檢測到問題，因爲 Pod 會卡在初始化階段。然而，通常不清楚是什麼原因導致了問題。

以下是在使用邊車容器處理工作負載時可以考慮的因素和排查步驟。

<!--
### Ensure the feature gate is enabled

As a very first step, make sure that both API server and Nodes are at Kubernetes version v1.29 or
later. The feature will break on clusters where Nodes are running earlier versions where it is not enabled.
-->
### 確保特性門控已啓用

首先，確保 API 伺服器和節點都在 Kubernetes v1.29 及更高版本上運行。
如果節點運行的是早期版本且未啓用該特性，叢集中的該特性將無法正常工作。

<!--
title="Note" color="info"
-->
{{< alert title="注意" color="info" >}}

<!--
The feature can be enabled on nodes with the version 1.28. The behavior of built-in sidecar
container termination was different in version 1.28, and it is not recommended to adjust
the behavior of a sidecar to that behavior. However, if the only concern is the startup order, the
above statement can be changed to Nodes running version 1.28 with the feature gate enabled.
-->
此特性可以在 1.28 版本的節點上啓用。然而，內置邊車容器的終止行爲在 1.28 版本中有所不同，
不建議將邊車的行爲調整爲 1.28 中的行爲。但是，如果唯一的關注點是啓動順序，
上述陳述可以改爲：運行 1.28 版本並啓用了特性門控的節點。

{{< /alert >}}

<!--
You should ensure that the feature gate is enabled for the API server(s) within the control plane
**and** for all nodes.

One of the ways to check the feature gate enablement is to run a command like this:

- For API Server:
-->
你應該確保控制平面內的 API 伺服器**和**所有節點都啓用了特性門控。

一種檢查特性門控是否啓用的方法是運行如下命令：

- 對於 API 伺服器：

  ```shell
  kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep SidecarContainers
  ```

<!--
- For the individual node:
-->
- 對於單個節點：

  ```shell
  kubectl get --raw /api/v1/nodes/<node-name>/proxy/metrics | grep kubernetes_feature_enabled | grep SidecarContainers
  ```

<!--
If you see something like this:
-->
如果你看到類似這樣的內容：

```
kubernetes_feature_enabled{name="SidecarContainers",stage="BETA"} 1
```

<!--
it means that the feature is enabled.
-->
表示該特性已啓用。

<!--
### Check for 3rd party tooling and mutating webhooks

If you experience issues when validating the feature, it may be an indication that one of the
3rd party tools or mutating webhooks are broken.

When the `SidecarContainers` feature gate is enabled, Pods gain a new field in their API.
Some tools or mutating webhooks might have been built with an earlier version of Kubernetes API.

If tools pass unknown fields as-is using various patching strategies to mutate a Pod object,
this will not be a problem. However, there are tools that will strip out unknown fields;
if you have those, they must be recompiled with the v1.28+ version of Kubernetes API client code.

The way to check this is to use the `kubectl describe pod` command with your Pod that has passed through
mutating admission. If any tools stripped out the new field (`restartPolicy:Always`),
you will not see it in the command output.

If you hit an issue like this, please advise the author of the tools or the webhooks
use one of the patching strategies for modifying objects instead of a full object update.
-->
### 檢查第三方工具和變更 Webhook

如果你在驗證特性時遇到問題，這可能表明某個第三方工具或變更 Webhook 出現了問題。

當 `SidecarContainers` 特性門控啓用後，Pod 在其 API 中會新增一個字段。
某些工具或變更 Webhook 可能是基於早期版本的 Kubernetes API 構建的。

如果工具使用各種修補策略將未知字段原樣傳遞，這不會有問題。然而，有些工具會刪除未知字段；
如果你使用的是這些工具，必須使用 v1.28+ 版本的 Kubernetes API 客戶端代碼重新編譯它們。

檢查這一點的方法是使用 `kubectl describe pod` 命令查看已通過變更准入的 Pod。
如果任何工具刪除了新字段（如 `restartPolicy: Always`），你將不會在命令輸出中看到它。

如果你遇到了此類問題，請告知工具或 Webhook 的作者使用修補策略來修改對象，而不是進行完整的對象更新。

<!--
title="Note" color="info"
-->
{{< alert  title="注意" color="info" >}}

<!--
Mutating webhook may update Pods based on some conditions.
Thus, sidecar containers may work for some Pods and fail for others.
-->
變更 Webhook 可能會根據某些條件更新 Pod。
因此，邊車容器可能對某些 Pod 有效，但對其他 Pod 無效。

{{< /alert >}}

<!--
### Automatic injection of sidecars

If you are using software that injects sidecars automatically,
there are a few possible strategies you may follow to
ensure that native sidecar containers can be used.
All strategies are generally options you may choose to decide whether
the Pod the sidecar will be injected to will land on a Node supporting the feature or not.

As an example, you can follow [this conversation in Istio community](https://github.com/istio/istio/issues/48794).
The discussion explores the options listed below.
-->
### 邊車的自動注入

如果你使用的是自動注入邊車的軟體，可以採取幾種策略來確保能夠使用原生邊車容器。
所有這些策略通常都是你可以選擇的選項，以決定注入邊車的 Pod 是否會落在支持該特性的節點上。

例如，可以參考 [Istio 社區中的這次討論](https://github.com/istio/istio/issues/48794)。
討論中探討了以下選項：

<!--
1. Mark Pods that land to nodes supporting sidecars. You can use node labels
   and node affinity to mark nodes supporting sidecar containers and Pods landing on those nodes.
-->
1. 標記支持邊車的節點上的 Pod。你可以使用節點標籤和節點親和性來標記支持邊車容器的節點以及落在這些節點上的 Pod。
<!--
1. Check Nodes compatibility on injection. During sidecar injection, you may use
   the following strategies to check node compatibility:
   - query node version and assume the feature gate is enabled on the version 1.29+
   - query node prometheus metrics and check feature enablement status
   - assume the nodes are running with a [supported version skew](/releases/version-skew-policy/#supported-version-skew)
     from the API server
   - there may be other custom ways to detect nodes compatibility.
-->
2. 注入時檢查節點兼容性。在邊車注入過程中，可以使用以下策略來檢查節點兼容性：
   - 查詢節點版本並假設版本 1.29+ 上啓用了特性門控。
   - 查詢節點 Prometheus 指標並檢查特性啓用狀態。
   - 假設節點與 API 伺服器的版本差異在[支持的版本範圍](/zh-cn/releases/version-skew-policy/#supported-version-skew)內。
   - 可能還有其他自定義方法來檢測節點兼容性。
<!--
1. Develop a universal sidecar injector. The idea of a universal sidecar injector is to
   inject a sidecar container as a regular container as well as a native sidecar container.
   And have a runtime logic to decide which one will work. The universal sidecar injector
   is wasteful, as it will account for requests twice, but may be considered as a workable
   solution for special cases.
-->
3. 開發通用邊車注入器（Sidecar Injector）。通用邊車注入器的想法是在注入一個普通容器的同時注入一個原生邊車容器，並在運行時決定哪個容器會生效。
   通用邊車注入器雖然浪費資源（因爲它會兩次計算請求量），但在某些特殊情況下可以視爲可行的解決方案。
   <!--
   - One way would be on start of a native sidecar container
     detect the node version and exit immediately if the version does not support the sidecar feature.
   - Consider a runtime feature detection design:
     - Define an empty dir so containers can communicate with each other
     - Inject an init container, let's call it `NativeSidecar` with `restartPolicy=Always`.
     - `NativeSidecar` must write a file to an empty directory indicating the first run and exit
       immediately with exit code `0`.
   -->
   - 一種方法是在原生邊車容器啓動時檢測節點版本，如果不支持邊車特性則立即退出。
   - 考慮運行時特性檢測設計：
     - 定義一個空目錄（Empty Dir）以便容器之間通信。
     - 注入一個 Init 容器，我們稱之爲 `NativeSidecar`，並設置 `restartPolicy=Always`。
     - `NativeSidecar` 必須在空目錄中寫入一個檔案，表示首次運行並立即退出，退出碼爲 `0`。
     <!--
     - `NativeSidecar` on restart (when native sidecars are supported) checks that file already
       exists in the empty dir and changes it - indicating that the built-in sidecar containers
       are supported and running.
     - Inject regular container, let's call it `OldWaySidecar`.
     - `OldWaySidecar` on start checks the presence of a file in an empty dir.
     - If the file indicates that the `NativeSidecar` is NOT running, it assumes that the sidecar
       feature is not supported and works assuming it is the sidecar.
     - If the file indicates that the `NativeSidecar` is running, it either does nothing and sleeps
       forever (in the case when Pod’s `restartPolicy=Always`) or exits immediately with exit code `0`
       (in the case when Pod’s `restartPolicy!=Always`).
     -->
     - `NativeSidecar` 在重啓時（當支持原生邊車時）檢查空目錄中是否已存在該檔案，並進行更改 —— 表示已支持原生邊車容器並正在運行。
     - 注入一個普通容器，我們稱之爲 `OldWaySidecar`。
     - `OldWaySidecar` 啓動時檢查空目錄中是否存在檔案。
     - 如果檔案表示 `NativeSidecar` 未運行，則假設邊特性不支持，並按邊車的方式工作。
     - 如果檔案表示 `NativeSidecar` 正在運行，則根據 Pod 的 `restartPolicy` 決定行爲：
     - 如果 Pod 的 `restartPolicy=Always`，則不做任何操作並永遠休眠。
     - 如果 Pod 的 `restartPolicy!=Always`，則立即退出，退出碼爲 `0`。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).
-->
- 瞭解有關[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)的更多資訊。
