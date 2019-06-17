---
title: 使用 kubeadm 定制控制平面配置
content_template: templates/concept
weight: 40
---

<!--
---
reviewers:
- sig-cluster-lifecycle
title: Customizing control plane configuration with kubeadm
content_template: templates/concept
weight: 40
---
-->

{{% capture overview %}}

<!--
The kubeadm configuration exposes the following fields that can override the default flags passed to control plane components such as the APIServer, ControllerManager and Scheduler:
-->
kubeadm 配置公开了以下字段，这些字段可以覆盖传递给控制平面组件（如 APIServer、ControllerManager 和 Scheduler）的默认参数：

- `APIServerExtraArgs`
- `ControllerManagerExtraArgs`
- `SchedulerExtraArgs`

<!--
These fields consist of `key: value` pairs. To override a flag for a control plane component:
-->
这些字段由 `key: value` 对组成。
要覆盖控制平面组件的参数:

<!--
1.  Add the appropriate field to your configuration.
2.  Add the flags to override to the field.
-->
1.  将适当的字段添加到配置中。
2.  向字段添加要覆盖的参数值。

<!--
For more details on each field in the configuration you can navigate to our
[API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#ClusterConfiguration).
-->
有关配置中的每个字段的详细信息，您可以导航到我们的 [API 参考页面](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#ClusterConfiguration)。

{{% /capture %}}

{{% capture body %}}

<!--
## APIServer flags
-->
## APIServer 参数

<!--
For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).
-->
有关详细信息，请参阅 [kube-apiserver 参考文档](/docs/reference/command-line-tools-reference/kube-apiserver/)。

<!--
Example usage:
-->
使用示例：
```yaml
apiVersion: kubeadm.k8s.io/v1alpha3
kind: ClusterConfiguration
kubernetesVersion: v1.12.0
metadata:
  name: 1.12-sample
apiServerExtraArgs:
  advertise-address: 192.168.0.103
  anonymous-auth: false
  enable-admission-plugins: AlwaysPullImages,DefaultStorageClass
  audit-log-path: /home/johndoe/audit.log
```

<!--
## ControllerManager flags
-->
## ControllerManager 参数

<!--
For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).
-->
有关详细信息，请参阅 [kube-controller-manager 参考文档](/docs/reference/command-line-tools-reference/kube-controller-manager/)。

<!--
Example usage:
-->
使用示例：
```yaml
apiVersion: kubeadm.k8s.io/v1alpha3
kind: ClusterConfiguration
kubernetesVersion: v1.12.0
metadata:
  name: 1.12-sample
controllerManagerExtraArgs:
  cluster-signing-key-file: /home/johndoe/keys/ca.key
  bind-address: 0.0.0.0
  deployment-controller-sync-period: 50
```

<!--
## Scheduler flags
-->
## Scheduler 参数

<!--
For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->
有关详细信息，请参阅 [kube-scheduler 参考文档](/docs/reference/command-line-tools-reference/kube-scheduler/)。

<!--
Example usage:
-->
使用示例：
```yaml
apiVersion: kubeadm.k8s.io/v1alpha3
kind: ClusterConfiguration
kubernetesVersion: v1.12.0
metadata:
  name: 1.12-sample
schedulerExtraArgs:
  address: 0.0.0.0
  config: /home/johndoe/schedconfig.yaml
  kubeconfig: /home/johndoe/kubeconfig.yaml
```

{{% /capture %}}
