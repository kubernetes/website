---
title: "加固指南 - 调度器配置"
description: >
  有关如何提升 Kubernetes 调度器安全性的指南。
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
Kubernetes {{< glossary_tooltip text="调度器" term_id="kube-scheduler" >}}是{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的关键组件之一。

本文介绍如何提升调度器的安全态势。

一个配置不当的调度器可能带来安全隐患。
这样的调度器可以将目标设为特定节点，并驱逐正在共享节点及其资源的工作负载或应用。
攻击者可以借此实施 [Yo-Yo 攻击](https://arxiv.org/abs/2105.00542)：即针对易受攻击的自动扩缩器发起攻击。

<!-- body -->
<!--
## kube-scheduler configuration

### Scheduler authentication & authorization command line options

When setting up authentication configuration, it should be made sure that kube-scheduler's authentication remains consistent with kube-api-server's authentication. 
If any request has missing authentication headers, 
the [authentication should happen through the kube-api-server allowing all authentication to be consistent in the cluster](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#original-request-username-and-group).
-->
## kube-scheduler 配置   {#kube-scheduler-configuration}

### 调度器身份认证与鉴权命令行选项   {#scheduler-authentication-authorization-command-line-options}

在设置身份认证配置时，应确保 kube-scheduler 的身份认证配置与 kube-apiserver 的身份认证配置保持一致。
如果任一请求缺少身份认证头，
则应[通过 kube-apiserver 进行身份认证以保证集群内的所有身份认证一致](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/#original-request-username-and-group)。

<!--
- `authentication-kubeconfig`: Make sure to provide a proper kubeconfig so that the scheduler can retrieve authentication configuration options from the API Server. This kubeconfig file should be protected with strict file permissions.
- `authentication-tolerate-lookup-failure`: Set this to `false` to make sure the scheduler _always_ looks up its authentication configuration from the API server.
- `authentication-skip-lookup`: Set this to `false` to make sure the scheduler _always_ looks up its authentication configuration from the API server.
- `authorization-always-allow-paths`: These paths should respond with data that is appropriate for anonymous authorization. Defaults to `/healthz,/readyz,/livez`.
-->
- `authentication-kubeconfig`：确保提供正确的 kubeconfig 文件，使调度器能从 API 服务器获取身份认证配置选项。
  这个 kubeconfig 文件应设置严格的文件权限以确保安全。
- `authentication-tolerate-lookup-failure`：设置为 `false`，确保调度器**始终**从 API 服务器查找其身份认证配置。
- `authentication-skip-lookup`：设置为 `false`，确保调度器**始终**从 API 服务器查找其身份认证配置。
- `authorization-always-allow-paths`：这些路径应返回适用于匿名鉴权的数据。默认值为 `/healthz,/readyz,/livez`。
<!--
- `profiling`: Set to `false` to disable the profiling endpoints which are provide debugging information but which should not be enabled on production clusters as they present a risk of denial of service or information leakage. The `--profiling` argument is deprecated and can now be provided through the [KubeScheduler DebuggingConfiguration](https://kubernetes.io/docs/reference/config-api/kube-scheduler-config.v1/#DebuggingConfiguration). Profiling can be disabled through the kube-scheduler config by setting `enableProfiling` to `false`.                                                                                     
- `requestheader-client-ca-file`: Avoid passing this argument.
-->
- `profiling`：设置为 `false` 以禁用性能分析端点。性能分析端点可用于调试，
  但在生产环境中启用会带来拒绝服务（DoS）或信息泄露风险。`--profiling` 参数已被弃用，现在可通过
  [KubeScheduler DebuggingConfiguration](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#DebuggingConfiguration)
  提供。在 kube-scheduler 配置中，将 `enableProfiling` 设置为 `false` 即可禁用性能分析。
- `requestheader-client-ca-file`：避免使用此参数。

<!--
### Scheduler networking command line options

- `bind-address`: In most cases, the kube-scheduler does not need to be externally accessible. Setting the bind address to `localhost` is a secure practice.
- `permit-address-sharing`: Set this to `false` to  disable connection sharing through `SO_REUSEADDR`. `SO_REUSEADDR` can lead to reuse of terminated connections that are in `TIME_WAIT` state.
- `permit-port-sharing`: Default `false`. Use the default unless you are confident you understand the security implications.
-->
### 调度器网络命令行选项   {#scheduler-networking-command-line-options}

- `bind-address`：在大多数情况下，kube-scheduler 不需要被外部访问。
  将绑定地址设置为 `localhost` 是一种安全的做法。
- `permit-address-sharing`：设置为 `false` 以禁用通过 `SO_REUSEADDR` 的连接共享。
  `SO_REUSEADDR` 可能导致重复使用处于 `TIME_WAIT` 状态的已终止的连接。
- `permit-port-sharing`：默认为 `false`。除非你非常了解相关的安全影响，否则建议使用默认值。

<!--
### Scheduler TLS command line options

- `tls-cipher-suites`: Always provide a list of preferred cipher suites. This ensures encryption never happens with insecure cipher suites.
-->
### 调度器 TLS 命令行选项    {#scheduler-tls-command-line-options}

- `tls-cipher-suites`：始终提供一组首选的加密套件。这能确保加密时绝不会使用不安全的加密套件。

<!--
## Scheduling configurations for custom schedulers

When using custom schedulers based on the Kubernetes scheduling code, cluster administrators need to be careful with
plugins that use the `queueSort`, `prefilter`, `filter`, or `permit` [extension points](/docs/reference/scheduling/config/#extension-points).
These extension points control various stages of a scheduling process, and the wrong configuration can impact the kube-scheduler's behavior in your cluster.
-->
## 自定义调度器的调度配置   {#scheduling-configurations-for-custom-schedulers}

在基于 Kubernetes 调度代码使用自定义调度器时，
集群管理员需谨慎使用 `queueSort`、`prefilter`、`filter` 和 `permit`
[扩展点](/zh-cn/docs/reference/scheduling/config/#extension-points)。
这些扩展点控制调度过程的不同阶段，配置错误可能会影响 kube-scheduler 在集群中的行为。

<!--
### Key considerations

- Exactly one plugin that uses the `queueSort` extension point can be enabled at a time. Any plugins that use `queueSort` should be scrutinized.
- Plugins that implement the `prefilter` or `filter` extension point can potentially mark all nodes as unschedulable. This can bring scheduling of new pods to a halt.
- Plugins that implement the `permit` extension point can prevent or delay the binding of a Pod. Such plugins should be thoroughly reviewed by the cluster administrator.
-->
### 关键注意事项   {#key-considerations}

- 同一时间只能启用一个使用 `queueSort` 扩展点的插件。任何使用 `queueSort` 的插件都应经过严格审查。
- 实现 `prefilter` 或 `filter` 扩展点的插件可能会将所有节点标记为不可调度。这可能导致新 Pod 无法被调度。
- 实现 `permit` 扩展点的插件可能会阻止或延迟 Pod 的绑定。此类插件应由集群管理员彻底审查。

<!--
When using a plugin that is not one of the [default plugins](/docs/reference/scheduling/config/#scheduling-plugins), consider disabling the `queueSort`, `filter` and `permit` extension points as follows:
-->
如果你使用的是非[默认插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)，
考虑按以下方式禁用 `queueSort`、`filter` 和 `permit` 扩展点：

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
      # 禁用不同扩展点的特定插件
      # 你可以使用 "*" 禁用某个扩展点下的所有插件
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
This creates a scheduler profile ` my-scheduler`.
Whenever the `.spec` of a Pod does not have a value for `.spec.schedulerName`, the kube-scheduler runs for that Pod, 
using its main configuration, and default plugins.
If you define a Pod with `.spec.schedulerName` set to `my-scheduler`, the kube-scheduler runs but with a custom configuration; in that custom configuration,
the  `queueSort`, `filter` and `permit` extension points are disabled.
If you use this KubeSchedulerConfiguration, and don't run any custom scheduler, 
and you then define a Pod with  `.spec.schedulerName` set to `nonexistent-scheduler` 
(or any other scheduler name that doesn't exist in your cluster), no events would be generated for a pod.
-->
这会创建一个调度器配置文件 `my-scheduler`。每当 Pod 的 `.spec` 中未设置 `.spec.schedulerName` 时，
kube-scheduler 会使用主要配置和默认插件运行该 Pod。如果你定义的 Pod 将 `.spec.schedulerName` 设置为
`my-scheduler`，kube-scheduler 会运行但使用自定义配置；在该自定义配置中，
`queueSort`、`filter` 和 `permit` 这几个扩展点被禁用。
如果你使用这个 KubeSchedulerConfiguration，但未运行任何自定义调度器，
然后你定义一个 Pod，其 `.spec.schedulerName` 设置为 `nonexistent-scheduler`
（或任何其他在你的集群中不存在的调度器名称），那么 Pod 将不会生成任何事件。

<!--
## Disallow labeling nodes

A cluster administrator should ensure that cluster users cannot label the nodes. 
A malicious actor can use `nodeSelector` to schedule workloads on nodes where those workloads should not be present.
-->
## 不允许为节点添加标签   {#disallow-labeling-nodes}

集群管理员应确保集群用户无法为节点添加标签。
恶意行为者可能会使用 `nodeSelector` 将工作负载调度到那些本不应运行这些工作负载的节点上。
