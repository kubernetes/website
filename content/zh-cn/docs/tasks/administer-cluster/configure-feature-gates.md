---
title: 启用或禁用特性门控
content_type: task
weight: 60
---
<!--
title: Enable Or Disable Feature Gates
content_type: task
weight: 60
-->

<!-- overview -->
<!--
This page shows how to enable or disable feature gates to control specific Kubernetes
features in your cluster. Enabling feature gates allows you to test and use Alpha or
Beta features before they become generally available.
-->
本页介绍如何启用或禁用特性门控（feature gates），
以便在你的集群中控制特定的 Kubernetes 特性。
启用特性门控可以让你在特性正式发布（GA）之前，测试并使用 Alpha 或 Beta 特性。

{{< note >}}
<!--
For some stable (GA) gates, you can also disable them, usually for one minor release
after GA; however if you do that, your cluster may not be conformant as Kubernetes.
-->
对于某些稳定（GA）的特性门控，你也可以禁用它们，通常只允许在 GA 之后的一个次要版本中这样做；
但如果你这样做，你的集群可能不再符合 Kubernetes 一致性（conformance）要求。
{{< /note >}}

<!--
Changes from original PR proposal:
- Added note about conformance implications when disabling stable gates
- Corrected --help behavior: all components show all gates due to shared definitions
- Clarified that not all components support configuration files (e.g., kube-controller-manager)
- Specified that verification methods apply to kubeadm static pod deployments
- Added context about kubeadm's distributed configuration approach
-->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You also need:
-->
你还需要：

<!--
* Administrative access to your cluster
* Knowledge of which feature gate you want to enable (see the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/))
-->
* 对集群的管理访问权限
* 知道你要启用哪个特性门控（参阅[特性门控参考](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)）

{{< note >}}
<!--
GA (stable) features are always enabled by default. You typically configure gates for
Alpha or Beta features.
-->
GA（稳定）特性默认始终启用。
你通常会为 Alpha 或 Beta 特性配置特性门控。
{{< /note >}}

<!-- steps -->

<!--
## Understand feature gate maturity

Before enabling a feature gate, check the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/)
for the feature's maturity level:
-->
## 了解特性门控的成熟度   {#understand-feature-gate-maturity}

在启用某个特性门控之前，请先查看[特性门控参考](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
中该特性的成熟度级别：

<!--
- **Alpha**: Disabled by default, may be buggy. Use only in test clusters.
- **Beta**: Usually enabled by default, well-tested.
- **GA**: Always enabled by default; can sometimes be disabled for one release after GA.
-->
- **Alpha**：默认禁用，可能存在缺陷。仅在测试集群中使用。
- **Beta**：通常默认启用，经过充分测试。
- **GA**：默认始终启用；在特性达到 GA 之后，有时可能允许在一个发布版本中被禁用。

<!--
## Identify which components need the feature gate

Different feature gates affect different Kubernetes components:
-->
## 确定哪些组件需要此特性门控   {#identify-which-components-need-the-feature-gate}

不同的特性门控会影响不同的 Kubernetes 组件：

<!--
- Some features require enabling the gate on **multiple components** (e.g., API server and controller manager)
- Other features only need the gate on a **single component** (e.g., only kubelet)
-->
- 某些特性需要在**多个组件**（例如 API 服务器和控制器管理器）上同时启用对应的特性门控。
- 另一些特性只需要在**单个组件**（例如 kubelet）上启用对应的特性门控。

<!--
The [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/)
typically indicates which components are affected by each gate. All Kubernetes components
share the same feature gate definitions, so all gates appear in help output, but only
relevant gates affect each component's behavior.
-->
[特性门控参考](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)通常会指出每个特性门控会影响哪些组件。
所有 Kubernetes 组件共享同一套特性门控定义，因此所有特性门控都会出现在帮助输出中，
但只有与该组件相关的特性门控才会影响其行为。

<!--
## Configuration
-->
## 配置   {#configuration}

<!--
### During cluster initialization

Create a configuration file to enable feature gates across relevant components:
-->
### 在集群初始化期间   {#during-cluster-initialization}

创建配置文件，在相关组件上启用特性门控：

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
apiServer:
  extraArgs:
    feature-gates: "FeatureName=true"
controllerManager:
  extraArgs:
    feature-gates: "FeatureName=true"
scheduler:
  extraArgs:
    feature-gates: "FeatureName=true"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  FeatureName: true
```

<!--
Initialize the cluster:
-->
初始化集群：

```shell
kubeadm init --config kubeadm-config.yaml
```

<!--
### On an existing cluster

For kubeadm clusters, feature gate configuration can be set in several locations
including manifest files, configuration files, and kubeadm configuration.

Edit control plane component manifests in `/etc/kubernetes/manifests/`:
-->
### 在现有集群上   {#on-an-existing-cluster}

对于 kubeadm 集群，特性门控配置可以在多个地方设置，
包括清单文件、配置文件以及 kubeadm 配置。

编辑位于 `/etc/kubernetes/manifests/` 的控制平面组件清单：

<!--
1. For kube-apiserver, kube-controller-manager, or kube-scheduler, add the flag to the command:
-->
1. 对于 kube-apiserver、kube-controller-manager 或 kube-scheduler，
   将参数添加到命令中：

   ```yaml
   spec:
     containers:
     - command:
       - kube-apiserver
       - --feature-gates=FeatureName=true
       # ... 其他参数
   ```

   <!--
   Save the file. The pod restarts automatically.
   -->
   
   保存文件后，Pod 会自动重启。

<!--
2. For kubelet, edit `/var/lib/kubelet/config.yaml`:
-->
2. 对于 kubelet，编辑 `/var/lib/kubelet/config.yaml`：

   ```yaml
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   featureGates:
     FeatureName: true
   ```

   <!--
   Restart kubelet:
   -->
  
   重启 kubelet：

   ```shell
   sudo systemctl restart kubelet
   ```

<!--
3. For kube-proxy, edit the ConfigMap:
-->
3. 对于 kube-proxy，编辑对应的 ConfigMap：

   ```shell
   kubectl -n kube-system edit configmap kube-proxy
   ```

   <!--
   Add feature gates to the configuration:
   -->
   
   将特性门控添加到配置中：

   ```yaml
   featureGates:
     FeatureName: true
   ```

   <!--
   Restart the DaemonSet:
   -->
   
   重启 DaemonSet：

   ```shell
   kubectl -n kube-system rollout restart daemonset kube-proxy
   ```

<!--
## Configure multiple feature gates

Use comma-separated lists for command-line flags:
-->
## 配置多个特性门控   {#configure-multiple-feature-gates}

在命令行参数中使用逗号分隔的列表：

```shell
--feature-gates=FeatureA=true,FeatureB=false,FeatureC=true
```

<!--
For components that support configuration files (kubelet, kube-proxy):
-->
对于支持配置文件的组件（kubelet、kube-proxy）：

```yaml
featureGates:
  FeatureA: true
  FeatureB: false
  FeatureC: true
```

{{< note >}}
<!--
In kubeadm clusters, control plane components (kube-apiserver, kube-controller-manager,
and kube-scheduler) are typically configured via command-line flags in their static pod
manifests located at `/etc/kubernetes/manifests/`. While these components support
configuration files via the `--config` flag, kubeadm primarily uses command-line flags.
-->
在 kubeadm 集群中，控制平面组件（kube-apiserver、kube-controller-manager、kube-scheduler）
通常通过其静态 Pod 清单中的命令行参数来配置，这些清单位于 `/etc/kubernetes/manifests/`。
虽然这些组件也支持通过 `--config` 参数使用配置文件，但 kubeadm 主要使用命令行参数。
{{< /note >}}


<!-- discussion -->

<!--
## Verify feature gate configuration

After configuring, verify the feature gates are active. The following methods apply
to kubeadm clusters where control plane components run as static pods.
-->
## 验证特性门控配置   {#verify-feature-gate-configuration}

完成配置后，请验证特性门控是否已生效。
下列方法适用于控制平面组件以静态 Pod 方式运行的 kubeadm 集群。

<!--
### Check control plane component manifests

View the feature gates configured in the static pod manifest:
-->
### 检查控制平面组件清单   {#check-control-plane-component-manifests}

查看静态 Pod 清单中配置的特性门控：
```shell
kubectl -n kube-system get pod kube-apiserver-<node-name> -o yaml | grep feature-gates
```

<!--
### Check kubelet configuration

Use the kubelet's configz endpoint:
-->
### 检查 kubelet 配置   {#check-kubelet-configuration}

使用 kubelet 的 configz 端点：
```shell
kubectl proxy --port=8001 &
curl -sSL "http://localhost:8001/api/v1/nodes/<node-name>/proxy/configz" | grep featureGates -A 5
```

<!--
Or check the configuration file directly on the node:
-->
或者直接在节点上检查配置文件：
```shell
cat /var/lib/kubelet/config.yaml | grep -A 10 featureGates
```

<!--
### Check via metrics endpoint

Feature gate status is exposed in Prometheus-style metrics by Kubernetes components
(available in Kubernetes 1.26+). Query the metrics endpoint to verify which feature
gates are enabled:
-->
### 通过指标端点检查   {#check-via-metrics-endpoint}

特性门控状态会由 Kubernetes 组件以 Prometheus 风格的指标暴露出来（Kubernetes 1.26+ 可用）。
查询指标端点以验证哪些特性门控已启用：
```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled
```

<!--
To check a specific feature gate:
-->
要检查某个特定的特性门控：
```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep FeatureName
```

<!--
The metric shows `1` for enabled gates and `0` for disabled gates.
-->
该指标对已启用的特性门控显示为 `1`，对已禁用的特性门控显示为 `0`。

{{< note >}}
<!--
In kubeadm clusters, verify all relevant locations where feature gates might be
configured, as the configuration is distributed across multiple files and locations.
-->
在 kubeadm 集群中，请验证所有可能配置特性门控的相关位置，
因为配置分散在多个文件与多个位置中。
{{< /note >}}

<!--
### Check via /flagz endpoint

If you have access to a component's debugging endpoints, and the `ComponentFlagz`
feature gate is enabled for that component, you can inspect the command-line flags
that were used to start the component by visiting the `/flagz` endpoint. Feature
gates configured using command-line flags appear in this output.

The `/flagz` endpoint is part of Kubernetes *z-pages*, which provide human-readable
runtime debugging information for core components.

For more information, see the
[z-pages documentation](/docs/reference/instrumentation/zpages/).
-->
### 通过 /flagz 端点进行检查

如果你可以访问某个组件的调试端点，并且该组件启用了 `ComponentFlagz` 特性门控，
那么你可以通过访问 `/flagz` 端点，查看启动该组件时所使用的命令行参数。
通过命令行参数配置的特性门控会在该输出中显示。

`/flagz` 端点是 Kubernetes *z-pages* 的一部分，用于为核心组件提供人类可读的运行时调试信息。

更多信息请参见[z-pages 文档](/zh-cn/docs/reference/instrumentation/zpages/)。

<!--
## Understanding component-specific requirements

Some examples of component-specific feature gates:
-->
## 理解组件层面的特定要求   {#understanding-component-specific-requirements}

下面是一些与组件相关的特性门控示例：

<!--
- **API server-focused**: Features like `StructuredAuthenticationConfiguration` primarily affect kube-apiserver
- **Kubelet-focused**: Features like `GracefulNodeShutdown` primarily affect kubelet
- **Multiple components**: Some features require coordination between components
-->
- **侧重 API 服务器**：例如 `StructuredAuthenticationConfiguration` 主要影响 kube-apiserver。
- **侧重 kubelet**：例如 `GracefulNodeShutdown` 主要影响 kubelet。
- **多个组件**：有些特性需要组件之间协同。

{{< caution >}}
<!--
When a feature requires multiple components, you must enable the gate on all relevant
components. Enabling it on only some components may result in unexpected behavior or errors.
-->
当某个特性需要多个组件时，你必须在所有相关组件上启用该特性门控。
只在部分组件上启用可能导致意外行为或错误。
{{< /caution >}}

<!--
Always test feature gates in non-production environments first. Alpha features may be
removed without notice.
-->
务必先在非生产环境中测试特性门控。
Alpha 特性可能会在未提前通知的情况下被移除。

## {{% heading "whatsnext" %}}

<!--
* Read the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/)
* Learn about [Feature Stages](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)
* Review [kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta4/)
-->
* 阅读[特性门控参考](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
* 了解[特性阶段](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)
* 查阅[kubeadm 配置](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
