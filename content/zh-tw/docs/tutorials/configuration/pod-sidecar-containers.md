---
title: 使用 Sidecar 容器
content_type: tutorial
weight: 40
min-kubernetes-server-version: 1.29
---

<!-- overview -->

<!--
This section is relevant for people adopting a new built-in
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature for their workloads.
-->
本節適合正在為工作負載採用新的內建 [Sidecar 容器](/docs/concepts/workloads/pods/sidecar-containers/)功能的使用者。

<!--
Sidecar container is not a new concept as posted in the
[blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/).
Kubernetes allows running multiple containers in a Pod to implement this concept.
However, running a sidecar container as a regular container
has a lot of limitations being fixed with the new built-in sidecar containers support.
-->
如這篇[部落格文章](/blog/2015/06/the-distributed-system-toolkit-patterns/)所述，Sidecar 容器並非新概念。
Kubernetes 允許在一個 Pod 中執行多個容器來實現這個概念。
然而，將 Sidecar 容器作為一般容器執行有許多限制，而新的內建 Sidecar 容器功能正在修正這些限制。

{{< feature-state feature_gate_name="SidecarContainers" >}}

## {{% heading "objectives" %}}

<!--
- Understand the need for sidecar containers
- Be able to troubleshoot issues with the sidecar containers
- Understand options to universally "inject" sidecar containers to any workload
-->
- 了解使用 Sidecar 容器的需求
- 能夠對 Sidecar 容器的問題進行故障排除
- 了解可將 Sidecar 容器普遍「注入」至任何工作負載的選項。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

<!--
## Sidecar containers overview
-->
## Sidecar 容器總覽 {#sidecar-containers-overview}

<!--
Sidecar containers are secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the primary _app
container_ by providing additional services, or functionalities such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.
You can read more in the [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
concept page.
-->
Sidecar 容器是在同一個 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中，與主要應用程式容器一起執行的輔助容器。
這些容器透過提供額外的服務或功能來增強或擴展主要應用程式容器，
例如日誌記錄、監控、安全性或資料同步，且無須直接修改主要應用程式的程式碼。
您可以參閱 [Sidecar 容器](/docs/concepts/workloads/pods/sidecar-containers/) 概念頁面以了解更多資訊。

<!--
The concept of sidecar containers is not new and there are multiple implementations of this concept.
As well as sidecar containers that you, the person defining the Pod, want to run, you can also find
that some {{< glossary_tooltip text="addons" term_id="addons" >}} modify Pods - before the Pods
start running - so that there are extra sidecar containers. The mechanisms to _inject_ those extra
sidecars are often [mutating webhooks](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
For example, a service mesh addon might inject a sidecar that configures mutual TLS and encryption
in transit between different Pods.
-->
Sidecar 容器的概念並不新穎，且已有多種實作方式。
除了您（即定義 Pod 的人）希望執行的 Sidecar 容器外，某些{{< glossary_tooltip text="附加元件" term_id="addons" >}}也可能在 Pod 開始執行之前修改 Pod，因此加入了額外的 Sidecar 容器。
這類額外 Sidecar 的**注入**機制通常是 [mutating webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
例如，Service Mesh（服務網格）附加元件可能會注入一個 Sidecar，用於設定不同 Pod 之間的 mutual TLS（mTLS，雙向 TLS）與傳輸加密。

<!--
While the concept of sidecar containers is not new,
the native implementation of this feature in Kubernetes, however, is new. And as with every new feature,
adopting this feature may present certain challenges.
-->
雖然 Sidecar 容器的概念並不新，但 Kubernetes 的原生實作是全新的。如同每個新功能一樣，採用此功能可能會遇到一些挑戰。

<!--
This tutorial explores challenges and solutions that can be experienced by end users as well as
by authors of sidecar containers.
-->
本教學將探討終端使用者和 Sidecar 容器開發者可能遇到的挑戰與解決方案。

<!--
## Benefits of a built-in sidecar container
-->
## 內建 Sidecar 容器的優點 {#benefits-of-a-built-in-sidecar-container}

<!--
Using Kubernetes' native support for sidecar containers provides several benefits:
-->
使用 Kubernetes 對 Sidecar 容器的原生支援有以下幾個優點：

<!--
1. You can configure a native sidecar container to start ahead of
   {{< glossary_tooltip text="init containers" term_id="init-container" >}}.
-->
1. 您可以設定原生 Sidecar 容器在 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}}之前啟動。

<!--
1. The built-in sidecar containers can be authored to guarantee that they are terminated last.
   Sidecar containers are terminated with a `SIGTERM` signal once all the regular containers
   are completed and terminated. If the sidecar container isn't gracefully shut down, a
   `SIGKILL` signal will be used to terminate it.
-->
2. 內建 Sidecar 容器可以設定為被最後終止。當所有一般容器完成並終止後，Sidecar 容器會收到 `SIGTERM` 訊號而終止。若 Sidecar 容器未能正常關閉，則會使用 `SIGKILL` 訊號來終止。

<!--
1. With Jobs, when Pod's `restartPolicy: OnFailure` or `restartPolicy: Never`,
   native sidecar containers do not block Pod completion. With legacy sidecar containers,
   special care is needed to handle this situation.
-->
3. 在 Job 中，當 Pod 設定 `restartPolicy: OnFailure` 或 `restartPolicy: Never`，原生 Sidecar 容器不會阻礙 Pod 完成。而使用傳統的 Sidecar 容器時，需要特別處理這種狀況。

<!--
1. Also, with Jobs, built-in sidecar containers would keep being restarted once they are done,
   even if regular containers would not with Pod's `restartPolicy: Never`.
-->
4. 此外，在 Job 中，即使 Pod 設定了 `restartPolicy: Never` 讓一般容器不會重啟，但內建 Sidecar 容器在執行結束後，依然會不斷被重新啟動。

<!--
See [differences from init containers](/docs/concepts/workloads/pods/sidecar-containers/#differences-from-application-containers)
to learn more about it.
-->
請參考[與 Init 容器的差異](/docs/concepts/workloads/pods/sidecar-containers/#differences-from-application-containers)以了解更多。

<!--
## Adopting built-in sidecar containers
-->
## 採用內建 Sidecar 容器 {#adopting-built-in-sidecar-containers}

<!--
The `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is in beta state starting from Kubernetes version 1.29 and is enabled by default.
Some clusters may have this feature disabled or have software installed that is incompatible with the feature.
-->
`SidecarContainers` [功能開關](/docs/reference/command-line-tools-reference/feature-gates/)自 Kubernetes 1.29 版本起進入 Beta 狀態，並預設啟用。
部分叢集可能已停用此功能，或安裝了與此功能不相容的軟體。

<!--
When this happens, the Pod may be rejected or the sidecar containers may block Pod startup,
rendering the Pod useless. This condition is easy to detect as the Pod simply gets stuck on
initialization. However, it is often unclear what caused the problem.
-->
發生這種狀況時，Pod 可能被拒絕，或 Sidecar 容器可能阻止 Pod 啟動，導致 Pod 無法正常運作。這種狀況很容易被發現，因為 Pod 會卡在初始化階段。然而，導致問題的根本原因通常不明顯。

<!--
Here are the considerations and troubleshooting steps that one can take while adopting sidecar containers for their workload.
-->
以下是在為工作負載採用 Sidecar 容器時，可以參考的注意事項與故障排除步驟。

<!--
### Ensure the feature gate is enabled
-->
### 確認功能開關已啟用 {#ensure-the-feature-gate-is-enabled}

<!--
As a very first step, make sure that both API server and Nodes are at Kubernetes version v1.29 or
later. The feature will break on clusters where Nodes are running earlier versions where it is not enabled.
-->
首先，請確認 API 伺服器和節點的 Kubernetes 版本均為 v1.29 或更新版本。若叢集中的節點執行較舊的版本且該版本未啟用此功能，則此功能將無法正常運作。

{{< alert title="Note" color="info" >}}

<!--
The feature can be enabled on nodes with the version 1.28. The behavior of built-in sidecar
container termination was different in version 1.28, and it is not recommended to adjust
the behavior of a sidecar to that behavior. However, if the only concern is the startup order, the
above statement can be changed to Nodes running version 1.28 with the feature gate enabled.
-->
此功能可以在 1.28 版本的節點上啟用。然而內建 Sidecar 容器的終止行為在 1.28 版本中不同，也不建議將 Sidecar 的行為調整為符合該版本的行為。
但是，如果唯一考量是啟動順序，則上述說明可改為：運行 1.28 版本且已啟用功能開關的節點。

{{< /alert >}}

<!--
You should ensure that the feature gate is enabled for the API server(s) within the control plane
**and** for all nodes.
-->
您應確認控制平面內的 API 伺服器**以及**所有節點均啟用此功能開關。

<!--
One of the ways to check the feature gate enablement is to run a command like this:
-->
檢查功能開關是否啟用的其中一種方式是執行以下指令：

<!--
- For API Server:
-->
- 針對 API 伺服器：

  ```shell
  kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep SidecarContainers
  ```

<!--
- For the individual node:
-->
- 針對個別節點：

  ```shell
  kubectl get --raw /api/v1/nodes/<node-name>/proxy/metrics | grep kubernetes_feature_enabled | grep SidecarContainers
  ```

<!--
If you see something like this:
-->
若看到類似這樣的內容：

```
kubernetes_feature_enabled{name="SidecarContainers",stage="BETA"} 1
```

<!--
it means that the feature is enabled.
-->
表示此功能已啟用。

<!--
### Check for 3rd party tooling and mutating webhooks
-->
### 檢查第三方工具與 mutating webhooks {#check-for-3rd-party-tooling-and-mutating-webhooks}

<!--
If you experience issues when validating the feature, it may be an indication that one of the
3rd party tools or mutating webhooks are broken.
-->
若在驗證此功能時遇到問題，表示可能某個第三方工具或 mutating webhook 無法正常運作。

<!--
When the `SidecarContainers` feature gate is enabled, Pods gain a new field in their API.
Some tools or mutating webhooks might have been built with an earlier version of Kubernetes API.
-->
啟用 `SidecarContainers` 功能開關後，Pod 的 API 中會新增一個欄位。
某些工具或 mutating webhook 可能是基於較舊版本的 Kubernetes API 所建構的。

<!--
If tools pass unknown fields as-is using various patching strategies to mutate a Pod object,
this will not be a problem. However, there are tools that will strip out unknown fields;
if you have those, they must be recompiled with the v1.28+ version of Kubernetes API client code.
-->
如果這些工具在使用各種修補策略來修改 Pod 物件時，能將未知的欄位原封不動地傳遞過去，這不會造成問題。
然而，有些工具會直接移除這些未知欄位；
若有這種狀況，它們必須使用 v1.28 或更新版本的 Kubernetes API 用戶端程式碼重新編譯。

<!--
The way to check this is to use the `kubectl describe pod` command with your Pod that has passed through
mutating admission. If any tools stripped out the new field (`restartPolicy:Always`),
you will not see it in the command output.
-->
檢查方式是對通過 mutating admission 的 Pod 執行 `kubectl describe pod` 指令。
若任何工具移除了新欄位（`restartPolicy:Always`），您不會在指令輸出中看到該欄位。

<!--
If you hit an issue like this, please advise the author of the tools or the webhooks
use one of the patching strategies for modifying objects instead of a full object update.
-->
若遇到此類問題，請建議工具或 webhook 的開發者改用修補策略來修改物件，而非更新整個物件。

{{< alert  title="Note" color="info" >}}

<!--
Mutating webhook may update Pods based on some conditions.
Thus, sidecar containers may work for some Pods and fail for others.
-->
Mutating webhook 可能根據特定條件更新 Pod。
因此，Sidecar 容器可能在某些 Pod 可以運作，而對其他 Pod 則無法運作。

{{< /alert >}}

<!--
### Automatic injection of sidecars
-->
### 自動注入 Sidecar {#automatic-injection-of-sidecars}

<!--
If you are using software that injects sidecars automatically,
there are a few possible strategies you may follow to
ensure that native sidecar containers can be used.
All strategies are generally options you may choose to decide whether
the Pod the sidecar will be injected to will land on a Node supporting the feature or not.
-->
若您使用會自動注入 Sidecar 的軟體，可以考慮以下幾種策略，以確保能夠使用原生 Sidecar 容器。
這些策略通常是用來決定要被注入 Sidecar 的 Pod 是否會被排程到支援此功能的節點上。

<!--
As an example, you can follow [this conversation in Istio community](https://github.com/istio/istio/issues/48794).
The discussion explores the options listed below.
-->
您可以參考 [Istio 社群的這個討論](https://github.com/istio/istio/issues/48794)作為範例。
該討論探討了以下列出的選項。

<!--
1. Mark Pods that land to nodes supporting sidecars. You can use node labels
   and node affinity to mark nodes supporting sidecar containers and Pods landing on those nodes.
-->
1. 標記落在支援 Sidecar 節點上的 Pod。您可以使用節點標籤與節點親和性，來標記支援 Sidecar 容器的節點，以及落在這些節點上的 Pod。

<!--
1. Check Nodes compatibility on injection. During sidecar injection, you may use
   the following strategies to check node compatibility:
   - query node version and assume the feature gate is enabled on the version 1.29+
   - query node prometheus metrics and check feature enablement status
   - assume the nodes are running with a [supported version skew](/releases/version-skew-policy/#supported-version-skew)
     from the API server
   - there may be other custom ways to detect nodes compatibility.
-->
2. 在注入時檢查節點相容性。在 Sidecar 注入時，您可以使用以下策略來檢查節點相容性：
   - 查詢節點版本，並假設在 1.29 版本以上已啟用此功能開關
   - 查詢節點的 Prometheus 指標，並檢查功能啟用狀態
   - 假設節點執行的版本與 API 伺服器之間維持在[支援的版本偏差](/releases/version-skew-policy/#supported-version-skew)範圍內
   - 可能還有其他自訂方式來偵測節點相容性

<!--
1. Develop a universal sidecar injector. The idea of a universal sidecar injector is to
   inject a sidecar container as a regular container as well as a native sidecar container.
   And have a runtime logic to decide which one will work. The universal sidecar injector
   is wasteful, as it will account for requests twice, but may be considered as a workable
   solution for special cases.
   - One way would be on start of a native sidecar container
     detect the node version and exit immediately if the version does not support the sidecar feature.
   - Consider a runtime feature detection design:
     - Define an empty dir so containers can communicate with each other
     - Inject an init container, let's call it `NativeSidecar` with `restartPolicy=Always`.
     - `NativeSidecar` must write a file to an empty directory indicating the first run and exit
       immediately with exit code `0`.
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
3. 開發通用 Sidecar 注入器。通用 Sidecar 注入器的概念是同時以一般容器和原生 Sidecar 容器的形式注入 Sidecar，並透過執行階段邏輯來決定哪個會實際運作。通用 Sidecar 注入器較浪費資源，因為它會將資源請求計算兩次，但對於特殊情況可視為一個可行的解決方案。
   - 一種方式是在原生 Sidecar 容器啟動時偵測節點版本，若版本不支援 Sidecar 功能則立即退出。
   - 考慮執行階段功能偵測的設計：
     - 定義一個空目錄，讓容器之間可以互相通訊
     - 注入一個 Init 容器，稱之為 `NativeSidecar`，設定 `restartPolicy=Always`
     - `NativeSidecar` 必須向空目錄寫入一個檔案，表示首次執行，並以退出碼 `0` 立即退出
     - `NativeSidecar` 在重新啟動時（當支援原生 Sidecar 時）檢查該檔案是否已存在於空目錄中，並更新檔案——表示支援內建 Sidecar 容器且正在執行
     - 注入一般容器，稱之為 `OldWaySidecar`
     - `OldWaySidecar` 啟動時檢查空目錄中是否存在該檔案
     - 若檔案表示 `NativeSidecar` 並未執行，則假設不支援 Sidecar 功能，並以 Sidecar 的角色運作
     - 若檔案表示 `NativeSidecar` 正在執行，則什麼都不做並永久休眠（當 Pod 設定為 `restartPolicy=Always`），或以退出碼 `0` 立即退出（當 Pod 設定為 `restartPolicy!=Always`）。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).
-->
- 了解更多關於 [Sidecar 容器](/docs/concepts/workloads/pods/sidecar-containers/)的資訊。
