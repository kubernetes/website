---
title: 從輪詢切換爲基於 CRI 事件的更新來獲取容器狀態
min-kubernetes-server-version: 1.26
content_type: task
weight: 90
---
<!--
title: Switching from Polling to CRI Event-based Updates to Container Status
min-kubernetes-server-version: 1.26
content_type: task
weight: 90
-->

{{< feature-state feature_gate_name="EventedPLEG" >}}

<!-- overview -->

<!--
This page shows how to migrate nodes to use event based updates for container status. The event-based
implementation reduces node resource consumption by the kubelet, compared to the legacy approach
that relies on polling.
You may know this feature as _evented Pod lifecycle event generator (PLEG)_. That's the name used
internally within the Kubernetes project for a key implementation detail.

The polling based approach is referred to as _generic PLEG_.
-->
本頁展示瞭如何遷移節點以使用基於事件的更新來獲取容器狀態。
與依賴輪詢的傳統方法相比，基於事件的實現可以減少 kubelet 對節點資源的消耗。
你可以將這個特性稱爲**事件驅動的 Pod 生命週期事件生成器 (PLEG)**。
這是在 Kubernetes 項目內部針對關鍵實現細節所用的名稱。

基於輪詢的方法稱爲**通用 PLEG**。

## {{% heading "prerequisites" %}}

<!--
* You need to run a version of Kubernetes that provides this feature.
  Kubernetes v1.27 includes beta support for event-based container
  status updates. The feature is beta but is _disabled_ by default
  because it requires support from the container runtime.
* {{< version-check >}}
  If you are running a different version of Kubernetes, check the documentation for that release.
-->
* 你需要運行提供此特性的 Kubernetes 版本。
  Kubernetes 1.27 提供了對基於事件更新容器狀態的 Beta 支持。
  此特性處於 Beta 階段，默認被**禁用**。
* {{< version-check >}}
  如果你正在運行不同版本的 Kubernetes，請查閱對應版本的文檔。
<!--
* The container runtime in use must support container lifecycle events.
  The kubelet automatically switches back to the legacy generic PLEG
  mechanism if the container runtime does not announce support for
  container lifecycle events, even if you have this feature gate enabled.
-->
* 所使用的容器運行時必須支持容器生命週期事件。
  如果容器運行時未聲明對容器生命週期事件的支持，即使你已啓用了此特性門控，
  kubelet 也會自動切換回傳統的通用 PLEG。

<!-- steps -->

<!--
## Why switch to Evented PLEG?

* The _Generic PLEG_ incurs non-negligible overhead due to frequent polling of container statuses.
* This overhead is exacerbated by kubelet's parallelized polling of container states, thus limiting
  its scalability and causing poor performance and reliability problems.
* The goal of _Evented PLEG_ is to reduce unnecessary work during inactivity
  by replacing periodic polling.
-->
## 爲什麼要切換到事件驅動的 PLEG？   {#why-switch-to-evented-pleg}

* **通用 PLEG** 由於頻繁輪詢容器狀態而產生了不可忽略的開銷。
* 這種開銷會被 kubelet 的並行輪詢容器狀態的機制加劇，
  限制了可擴縮性，還會導致性能和可靠性問題。
* **事件驅動的 PLEG** 的目標是通過替換定期輪詢來減少閒置時的非必要任務。

<!--
## Switching to Evented PLEG

1. Start the kubelet with the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   `EventedPLEG` enabled. You can manage the kubelet feature gates editing the kubelet
   [config file](/docs/tasks/administer-cluster/kubelet-config-file/) and restarting the kubelet service.
   You need to do this on each node where you are using this feature.
-->
## 切換爲事件驅動的 PLEG   {#switching-to-evented-pleg}

1. 啓用[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
   `EventedPLEG` 後啓動 kubelet。
   你可以通過編輯 kubelet [設定文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)並重啓
   kubelet 服務來管理 kubelet 特性門控。
   你需要在使用此特性的所有節點上執行此操作。

<!--
2. Make sure the node is [drained](/docs/tasks/administer-cluster/safely-drain-node/) before proceeding. 

3. Start the container runtime with the container event generation enabled. 
-->
2. 確保節點被[騰空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)後再繼續。

3. 啓用容器事件生成後啓動容器運行時。

   {{< tabs name="tab_with_code" >}}

   {{% tab name="containerd" %}}
   <!--
   Version 1.7+
   -->
   版本 1.7+

   {{% /tab %}}

   {{% tab name="CRI-O" %}}
   <!--
   Version 1.26+
   
   Check if the CRI-O is already configured to emit CRI events by verifying the configuration,
   -->
   版本 1.26+

   通過驗證設定，檢查 CRI-O 是否已設定爲發送 CRI 事件：

   ```shell
   crio config | grep enable_pod_events
   ```

   <!--
   If it is enabled, the output should be similar to the following:
   -->
   如果已啓用，輸出應類似於：

   ```none
   enable_pod_events = true
   ```

   <!--
   To enable it, start the CRI-O daemon with the flag `--enable-pod-events=true` or
   use a dropin config with the following lines:
   -->
   要啓用它，可使用 `--enable-pod-events=true` 標誌或添加以下設定來啓動 CRI-O 守護進程：

   ```toml
   [crio.runtime]
   enable_pod_events: true
   ```

   {{% /tab %}}
   {{< /tabs >}}

   {{< version-check >}}

<!--
4. Verify that the kubelet is using event-based container stage change monitoring.
   To check, look for the term `EventedPLEG` in the kubelet logs.

   The output should be similar to this:
-->
4. 確認 kubelet 正使用基於事件的容器階段變更監控。
   要檢查這一點，可在 kubelet 日誌中查找 `EventedPLEG` 詞條。

   輸出類似於：

   ```console
   I0314 11:10:13.909915 1105457 feature_gate.go:249] feature gates: &{map[EventedPLEG:true]}
   ```

   <!--
   If you have set `--v` to 4 and above, you might see more entries that indicate
   that the kubelet is using event-based container state monitoring.
   -->
   如果你將 `--v` 設置爲 4 及更高值，你可能會看到更多條目表明
   kubelet 正在使用基於事件的容器狀態監控。

   ```console
   I0314 11:12:42.009542 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=3b2c6172-b112-447a-ba96-94e7022912dc
   I0314 11:12:44.623326 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   I0314 11:12:44.714564 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   ```

## {{% heading "whatsnext" %}}

<!--
* Learn more about the design in the Kubernetes Enhancement Proposal (KEP):
  [kubelet Evented PLEG for Better Performance](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md).
-->
* 進一步瞭解 Kubernetes 增強提案 (KEP)：
  [kubelet Evented PLEG for Better Performance](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md)
  中的設計理念。
