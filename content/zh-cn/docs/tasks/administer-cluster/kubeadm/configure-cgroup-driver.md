---
title: 配置 cgroup 驱动
content_type: task
weight: 20
---
<!-- 
title: Configuring a cgroup driver
content_type: task
weight: 10
-->

<!-- overview -->

<!-- 
This page explains how to configure the kubelet's cgroup driver to match the container
runtime cgroup driver for kubeadm clusters.
-->
本页阐述如何配置 kubelet 的 cgroup 驱动以匹配 kubeadm 集群中的容器运行时的 cgroup 驱动。

## {{% heading "prerequisites" %}}

<!-- 
You should be familiar with the Kubernetes
[container runtime requirements](/docs/setup/production-environment/container-runtimes).
-->
你应该熟悉 Kubernetes 的[容器运行时需求](/zh-cn/docs/setup/production-environment/container-runtimes)。

<!-- steps -->

<!-- 
## Configuring the container runtime cgroup driver
-->
## 配置容器运行时 cgroup 驱动 {#configuring-the-container-runtime-cgroup-driver}

<!-- 
The [Container runtimes](/docs/setup/production-environment/container-runtimes) page
explains that the `systemd` driver is recommended for kubeadm based setups instead
of the kubelet's [default](/docs/reference/config-api/kubelet-config.v1beta1) `cgroupfs` driver,
because kubeadm manages the kubelet as a
[systemd service](/docs/setup/production-environment/tools/kubeadm/kubelet-integration).
-->
[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes)页面提到，
由于 kubeadm 把 kubelet 视为一个
[系统服务](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration)来管理，
所以对基于 kubeadm 的安装， 我们推荐使用 `systemd` 驱动，
不推荐 kubelet [默认](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1)的 `cgroupfs` 驱动。

<!-- 
The page also provides details on how to set up a number of different container runtimes with the
`systemd` driver by default.
-->
此页还详述了如何安装若干不同的容器运行时，并将 `systemd` 设为其默认驱动。

<!-- 
## Configuring the kubelet cgroup driver
-->
## 配置 kubelet 的 cgroup 驱动   {#configuring-the-kubelet-cgroup-driver}

<!-- 
kubeadm allows you to pass a `KubeletConfiguration` structure during `kubeadm init`.
This `KubeletConfiguration` can include the `cgroupDriver` field which controls the cgroup
driver of the kubelet.
-->
kubeadm 支持在执行 `kubeadm init` 时，传递一个 `KubeletConfiguration` 结构体。
`KubeletConfiguration` 包含 `cgroupDriver` 字段，可用于控制 kubelet 的 cgroup 驱动。

<!-- 
In v1.22 and later, if the user does not set the `cgroupDriver` field under `KubeletConfiguration`,
kubeadm defaults it to `systemd`.

In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature.
See [systemd cgroup driver](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)
for more details.
-->

{{< note >}}
在版本 1.22 及更高版本中，如果用户没有在 `KubeletConfiguration` 中设置 `cgroupDriver` 字段，
`kubeadm` 会将它设置为默认值 `systemd`。

在 Kubernetes v1.28 中，你可以以 Alpha 功能启用 cgroup 驱动的自动检测。
有关更多详情，请查看 [systemd cgroup 驱动](/zh-cn/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)。
{{< /note >}}

<!-- 
A minimal example of configuring the field explicitly:
-->
这是一个最小化的示例，其中显式的配置了此字段：

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta4
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

<!-- 
Such a configuration file can then be passed to the kubeadm command:
-->
这样一个配置文件就可以传递给 kubeadm 命令了：

```shell
kubeadm init --config kubeadm-config.yaml
```

<!-- 
Kubeadm uses the same `KubeletConfiguration` for all nodes in the cluster.
The `KubeletConfiguration` is stored in a [ConfigMap](/docs/concepts/configuration/configmap)
object under the `kube-system` namespace.

Executing the sub commands `init`, `join` and `upgrade` would result in kubeadm
writing the `KubeletConfiguration` as a file under `/var/lib/kubelet/config.yaml`
and passing it to the local node kubelet.
-->
{{< note >}}
Kubeadm 对集群所有的节点，使用相同的 `KubeletConfiguration`。
`KubeletConfiguration` 存放于 `kube-system` 命名空间下的某个 
[ConfigMap](/zh-cn/docs/concepts/configuration/configmap) 对象中。

执行 `init`、`join` 和 `upgrade` 等子命令会促使 kubeadm 
将 `KubeletConfiguration` 写入到文件 `/var/lib/kubelet/config.yaml` 中，
继而把它传递给本地节点的 kubelet。

{{< /note >}}

<!-- 
## Using the `cgroupfs` driver
-->
# 使用 `cgroupfs` 驱动

<!-- 
To use `cgroupfs` and to prevent `kubeadm upgrade` from modifying the
`KubeletConfiguration` cgroup driver on existing setups, you must be explicit
about its value. This applies to a case where you do not wish future versions
of kubeadm to apply the `systemd` driver by default.
-->
如仍需使用 `cgroupfs` 且要防止 `kubeadm upgrade` 修改现有系统中
`KubeletConfiguration` 的 cgroup 驱动，你必须显式声明它的值。
此方法应对的场景为：在将来某个版本的 kubeadm 中，你不想使用默认的 `systemd` 驱动。

<!-- 
See the below section on "[Modify the kubelet ConfigMap](#modify-the-kubelet-configmap)" for details on
how to be explicit about the value.

If you wish to configure a container runtime to use the `cgroupfs` driver,
you must refer to the documentation of the container runtime of your choice.
-->
参阅以下章节“[修改 kubelet 的 ConfigMap](#modify-the-kubelet-configmap) ”，了解显式设置该值的方法。

如果你希望配置容器运行时来使用 `cgroupfs` 驱动，
则必须参考所选容器运行时的文档。

<!-- 
## Migrating to the `systemd` driver
-->
## 迁移到 `systemd` 驱动

<!-- 
To change the cgroup driver of an existing kubeadm cluster from `cgroupfs` to `systemd` in-place,
a similar procedure to a kubelet upgrade is required. This must include both
steps outlined below.
-->
要将现有 kubeadm 集群的 cgroup 驱动从 `cgroupfs` 就地升级为 `systemd`，
需要执行一个与 kubelet 升级类似的过程。
该过程必须包含下面两个步骤：

<!-- 
Alternatively, it is possible to replace the old nodes in the cluster with new ones
that use the `systemd` driver. This requires executing only the first step below
before joining the new nodes and ensuring the workloads can safely move to the new
nodes before deleting the old nodes.
-->
{{< note >}}
还有一种方法，可以用已配置了 `systemd` 的新节点替换掉集群中的老节点。
按这种方法，在加入新节点、确保工作负载可以安全迁移到新节点、及至删除旧节点这一系列操作之前，
只需执行以下第一个步骤。
{{< /note >}}

<!-- 
### Modify the kubelet ConfigMap
-->
### 修改 kubelet 的 ConfigMap  {#modify-the-kubelet-configmap}

<!-- 
- Call `kubectl edit cm kubelet-config -n kube-system`.
- Either modify the existing `cgroupDriver` value or add a new field that looks like this:
-->
- 运行 `kubectl edit cm kubelet-config -n kube-system`。
- 修改现有 `cgroupDriver` 的值，或者新增如下式样的字段：

  ```yaml
  cgroupDriver: systemd
  ```
  <!-- 
  This field must be present under the `kubelet:` section of the ConfigMap.
  -->
  该字段必须出现在 ConfigMap 的 `kubelet:` 小节下。

<!-- 
### Update the cgroup driver on all nodes
-->
### 更新所有节点的 cgroup 驱动

<!-- 
For each node in the cluster:

- [Drain the node](/docs/tasks/administer-cluster/safely-drain-node) using `kubectl drain <node-name> --ignore-daemonsets`
- Stop the kubelet using `systemctl stop kubelet`
- Stop the container runtime
- Modify the container runtime cgroup driver to `systemd`
- Set `cgroupDriver: systemd` in `/var/lib/kubelet/config.yaml`
- Start the container runtime
- Start the kubelet using `systemctl start kubelet`
- [Uncordon the node](/docs/tasks/administer-cluster/safely-drain-node) using `kubectl uncordon <node-name>`
-->
对于集群中的每一个节点：

- 执行命令 `kubectl drain <node-name> --ignore-daemonsets`，以
  [腾空节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)
- 执行命令 `systemctl stop kubelet`，以停止 kubelet
- 停止容器运行时
- 修改容器运行时 cgroup 驱动为 `systemd`
- 在文件 `/var/lib/kubelet/config.yaml` 中添加设置 `cgroupDriver: systemd`
- 启动容器运行时
- 执行命令 `systemctl start kubelet`，以启动 kubelet
- 执行命令 `kubectl uncordon <node-name>`，以
  [取消节点隔离](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)

<!-- 
Execute these steps on nodes one at a time to ensure workloads
have sufficient time to schedule on different nodes.

Once the process is complete ensure that all nodes and workloads are healthy.
-->
在节点上依次执行上述步骤，确保工作负载有充足的时间被调度到其他节点。

流程完成后，确认所有节点和工作负载均健康如常。
