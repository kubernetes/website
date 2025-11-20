---
title: "加固指南 - 調度器設定"
description: >
  有關如何提升 Kubernetes 調度器安全性的指南。
content_type: concept
weight: 90
---
<!--
title: "Hardening Guide - Scheduler Configuration"
description: >
    Information about how to make the Kubernetes scheduler more secure.
content_type: concept
weight: 90
-->

<!-- overview -->
<!--
The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} is
one of the critical components of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

This document covers how to improve the security posture of the Scheduler.

A misconfigured scheduler can have security implications. 
Such a scheduler can target specific nodes and evict the workloads or applications that are sharing the node and its resources. 
This can aid an attacker with a [Yo-Yo attack](https://arxiv.org/abs/2105.00542): an attack on a vulnerable autoscaler.
-->
Kubernetes {{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}}是{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的關鍵組件之一。

本文介紹如何提升調度器的安全態勢。

一個設定不當的調度器可能帶來安全隱患。
這樣的調度器可以將目標設爲特定節點，並驅逐正在共享節點及其資源的工作負載或應用。
攻擊者可以藉此實施 [Yo-Yo 攻擊](https://arxiv.org/abs/2105.00542)：即針對易受攻擊的自動擴縮器發起攻擊。

<!-- body -->
<!--
## kube-scheduler configuration

### Scheduler authentication & authorization command line options

When setting up authentication configuration, it should be made sure that kube-scheduler's authentication remains consistent with kube-api-server's authentication. 
If any request has missing authentication headers, 
the [authentication should happen through the kube-api-server allowing all authentication to be consistent in the cluster](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#original-request-username-and-group).
-->
## kube-scheduler 設定   {#kube-scheduler-configuration}

### 調度器身份認證與鑑權命令列選項   {#scheduler-authentication-authorization-command-line-options}

在設置身份認證設定時，應確保 kube-scheduler 的身份認證設定與 kube-apiserver 的身份認證設定保持一致。
如果任一請求缺少身份認證頭，
則應[通過 kube-apiserver 進行身份認證以保證叢集內的所有身份認證一致](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/#original-request-username-and-group)。

<!--
- `authentication-kubeconfig`: Make sure to provide a proper kubeconfig so that the scheduler can retrieve authentication configuration options from the API Server. This kubeconfig file should be protected with strict file permissions.
- `authentication-tolerate-lookup-failure`: Set this to `false` to make sure the scheduler _always_ looks up its authentication configuration from the API server.
- `authentication-skip-lookup`: Set this to `false` to make sure the scheduler _always_ looks up its authentication configuration from the API server.
- `authorization-always-allow-paths`: These paths should respond with data that is appropriate for anonymous authorization. Defaults to `/healthz,/readyz,/livez`.
-->
- `authentication-kubeconfig`：確保提供正確的 kubeconfig 檔案，使調度器能從 API 伺服器獲取身份認證設定選項。
  這個 kubeconfig 檔案應設置嚴格的檔案權限以確保安全。
- `authentication-tolerate-lookup-failure`：設置爲 `false`，確保調度器**始終**從 API 伺服器查找其身份認證設定。
- `authentication-skip-lookup`：設置爲 `false`，確保調度器**始終**從 API 伺服器查找其身份認證設定。
- `authorization-always-allow-paths`：這些路徑應返回適用於匿名鑑權的資料。預設值爲 `/healthz,/readyz,/livez`。
<!--
- `profiling`: Set to `false` to disable the profiling endpoints which are provide debugging information but which should not be enabled on production clusters as they present a risk of denial of service or information leakage. The `--profiling` argument is deprecated and can now be provided through the [KubeScheduler DebuggingConfiguration](https://kubernetes.io/docs/reference/config-api/kube-scheduler-config.v1/#DebuggingConfiguration). Profiling can be disabled through the kube-scheduler config by setting `enableProfiling` to `false`.                                                                                     
- `requestheader-client-ca-file`: Avoid passing this argument.
-->
- `profiling`：設置爲 `false` 以禁用性能分析端點。性能分析端點可用於調試，
  但在生產環境中啓用會帶來拒絕服務（DoS）或資訊泄露風險。`--profiling` 參數已被棄用，現在可通過
  [KubeScheduler DebuggingConfiguration](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#DebuggingConfiguration)
  提供。在 kube-scheduler 設定中，將 `enableProfiling` 設置爲 `false` 即可禁用性能分析。
- `requestheader-client-ca-file`：避免使用此參數。

<!--
### Scheduler networking command line options

- `bind-address`: In most cases, the kube-scheduler does not need to be externally accessible. Setting the bind address to `localhost` is a secure practice.
- `permit-address-sharing`: Set this to `false` to  disable connection sharing through `SO_REUSEADDR`. `SO_REUSEADDR` can lead to reuse of terminated connections that are in `TIME_WAIT` state.
- `permit-port-sharing`: Default `false`. Use the default unless you are confident you understand the security implications.
-->
### 調度器網路命令列選項   {#scheduler-networking-command-line-options}

- `bind-address`：在大多數情況下，kube-scheduler 不需要被外部訪問。
  將綁定地址設置爲 `localhost` 是一種安全的做法。
- `permit-address-sharing`：設置爲 `false` 以禁用通過 `SO_REUSEADDR` 的連接共享。
  `SO_REUSEADDR` 可能導致重複使用處於 `TIME_WAIT` 狀態的已終止的連接。
- `permit-port-sharing`：預設爲 `false`。除非你非常瞭解相關的安全影響，否則建議使用預設值。

<!--
### Scheduler TLS command line options

- `tls-cipher-suites`: Always provide a list of preferred cipher suites. This ensures encryption never happens with insecure cipher suites.
-->
### 調度器 TLS 命令列選項    {#scheduler-tls-command-line-options}

- `tls-cipher-suites`：始終提供一組首選的加密套件。這能確保加密時絕不會使用不安全的加密套件。

<!--
## Scheduling configurations for custom schedulers

When using custom schedulers based on the Kubernetes scheduling code, cluster administrators need to be careful with
plugins that use the `queueSort`, `prefilter`, `filter`, or `permit` [extension points](/docs/reference/scheduling/config/#extension-points).
These extension points control various stages of a scheduling process, and the wrong configuration can impact the kube-scheduler's behavior in your cluster.
-->
## 自定義調度器的調度設定   {#scheduling-configurations-for-custom-schedulers}

在基於 Kubernetes 調度代碼使用自定義調度器時，
叢集管理員需謹慎使用 `queueSort`、`prefilter`、`filter` 和 `permit`
[擴展點](/zh-cn/docs/reference/scheduling/config/#extension-points)。
這些擴展點控制調度過程的不同階段，設定錯誤可能會影響 kube-scheduler 在叢集中的行爲。

<!--
### Key considerations

- Exactly one plugin that uses the `queueSort` extension point can be enabled at a time. Any plugins that use `queueSort` should be scrutinized.
- Plugins that implement the `prefilter` or `filter` extension point can potentially mark all nodes as unschedulable. This can bring scheduling of new pods to a halt.
- Plugins that implement the `permit` extension point can prevent or delay the binding of a Pod. Such plugins should be thoroughly reviewed by the cluster administrator.
-->
### 關鍵注意事項   {#key-considerations}

- 同一時間只能啓用一個使用 `queueSort` 擴展點的插件。任何使用 `queueSort` 的插件都應經過嚴格審查。
- 實現 `prefilter` 或 `filter` 擴展點的插件可能會將所有節點標記爲不可調度。這可能導致新 Pod 無法被調度。
- 實現 `permit` 擴展點的插件可能會阻止或延遲 Pod 的綁定。此類插件應由叢集管理員徹底審查。

<!--
When using a plugin that is not one of the [default plugins](/docs/reference/scheduling/config/#scheduling-plugins), consider disabling the `queueSort`, `filter` and `permit` extension points as follows:
-->
如果你使用的是非[預設插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)，
考慮按以下方式禁用 `queueSort`、`filter` 和 `permit` 擴展點：

<!--
```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: my-scheduler
    plugins:
      # Disable specific plugins for different extension points
      # You can disable all plugins for an extension point using "*"
      queueSort:
        disabled:
        - name: "*"             # Disable all queueSort plugins
      # - name: "PrioritySort"  # Disable specific queueSort plugin
      filter:
        disabled:
        - name: "*"                 # Disable all filter plugins
      # - name: "NodeResourcesFit"  # Disable specific filter plugin
      permit:
        disabled:
        - name: "*"               # Disables all permit plugins
      # - name: "TaintToleration" # Disable specific permit plugin
```
-->
```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: my-scheduler
    plugins:
      # 禁用不同擴展點的特定插件
      # 你可以使用 "*" 禁用某個擴展點下的所有插件
      queueSort:
        disabled:
        - name: "*"             # 禁用所有 queueSort 插件
      # - name: "PrioritySort"  # 禁用特定 queueSort 插件
      filter:
        disabled:
        - name: "*"                 # 禁用所有 filter 插件
      # - name: "NodeResourcesFit"  # 禁用特定 filter 插件
      permit:
        disabled:
        - name: "*"               # 禁用所有 permit 插件
      # - name: "TaintToleration" # 禁用特定 permit 插件
```

<!--
This creates a scheduler profile ` my-custom-scheduler`.
Whenever the `.spec` of a Pod does not have a value for `.spec.schedulerName`, the kube-scheduler runs for that Pod, 
using its main configuration, and default plugins.
If you define a Pod with `.spec.schedulerName` set to `my-custom-scheduler`, the kube-scheduler runs but with a custom configuration; in that custom configuration,
the  `queueSort`, `filter` and `permit` extension points are disabled.
If you use this KubeSchedulerConfiguration, and don't run any custom scheduler, 
and you then define a Pod with  `.spec.schedulerName` set to `nonexistent-scheduler` 
(or any other scheduler name that doesn't exist in your cluster), no events would be generated for a pod.
-->
這會創建一個調度器設定檔案 `my-custom-scheduler`。每當 Pod 的 `.spec` 中未設置 `.spec.schedulerName` 時，
kube-scheduler 會使用主要設定和預設插件運行該 Pod。如果你定義的 Pod 將 `.spec.schedulerName` 設置爲
`my-custom-scheduler`，kube-scheduler 會運行但使用自定義設定；在該自定義設定中，
`queueSort`、`filter` 和 `permit` 這幾個擴展點被禁用。
如果你使用這個 KubeSchedulerConfiguration，但未運行任何自定義調度器，
然後你定義一個 Pod，其 `.spec.schedulerName` 設置爲 `nonexistent-scheduler`
（或任何其他在你的叢集中不存在的調度器名稱），那麼 Pod 將不會生成任何事件。

<!--
## Disallow labeling nodes

A cluster administrator should ensure that cluster users cannot label the nodes. 
A malicious actor can use `nodeSelector` to schedule workloads on nodes where those workloads should not be present.
-->
## 不允許爲節點添加標籤   {#disallow-labeling-nodes}

叢集管理員應確保叢集使用者無法爲節點添加標籤。
惡意行爲者可能會使用 `nodeSelector` 將工作負載調度到那些本不應運行這些工作負載的節點上。
