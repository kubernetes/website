---
title: 使用 kubeadm 定制控制平面配置
content_type: concept
weight: 40
---
<!--
---
reviewers:
- sig-cluster-lifecycle
title: Customizing control plane configuration with kubeadm
content_type: concept
weight: 40
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.12" state="stable" >}}

<!--
The kubeadm `ClusterConfiguration` object exposes the field `extraArgs` that can override the default flags passed to control plane
components such as the APIServer, ControllerManager and Scheduler. The components are defined using the following fields:
-->
kubeadm `ClusterConfiguration` 对象公开了 `extraArgs` 字段，它可以覆盖传递给控制平面组件（如 APIServer、ControllerManager 和 Scheduler）的默认参数。各组件配置使用如下字段定义：

- `apiServer`
- `controllerManager`
- `scheduler`

<!--
The `extraArgs` field consist of `key: value` pairs. To override a flag for a control plane component:
-->
`extraArgs` 字段由 `key: value` 对组成。
要覆盖控制平面组件的参数:

<!--
1.  Add the appropriate field to your configuration.
2.  Add the flags to override to the field.
3.  Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.
-->
1.  将适当的字段添加到配置中。
2.  向字段添加要覆盖的参数值。
3.  用 `--config <YOUR CONFIG YAML>` 运行 `kubeadm init`。

<!--
For more details on each field in the configuration you can navigate to our
[API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2#ClusterConfiguration).
-->
有关配置中的每个字段的详细信息，您可以导航到我们的 [API 参考页面](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2#ClusterConfiguration)。

{{< note >}}
<!-- 
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults` and saving the output to a file of your choice. 
-->
您可以通过运行 `kubeadm config print init-defaults` 并将输出保存到您选择的文件中，以默认值形式生成 `ClusterConfiguration` 对象。
{{< /note >}}



<!-- body -->

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
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
    advertise-address: 192.168.0.103
    anonymous-auth: "false"
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
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
    cluster-signing-key-file: /home/johndoe/keys/ca.key
    bind-address: 0.0.0.0
    deployment-controller-sync-period: "50"
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
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
    bind-address: 0.0.0.0
    config: /home/johndoe/schedconfig.yaml
    kubeconfig: /home/johndoe/kubeconfig.yaml
```


