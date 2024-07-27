---
title: 排查 CNI 插件相关的错误
content_type: task
weight: 40
---
<!--
title: Troubleshooting CNI plugin-related errors
content_type: task
reviewers:
- mikebrow
- divya-mohan0209
weight: 40
-->

<!-- overview -->

<!--
To avoid CNI plugin-related errors, verify that you are using or upgrading to a
container runtime that has been tested to work correctly with your version of
Kubernetes.
-->

为了避免 CNI 插件相关的错误，需要验证你正在使用或升级到一个经过测试的容器运行时，
该容器运行时能够在你的 Kubernetes 版本上正常工作。

<!--
## About the "Incompatible CNI versions" and "Failed to destroy network for sandbox" errors
-->

## 关于 "Incompatible CNI versions" 和 "Failed to destroy network for sandbox" 错误   {#about-the-incompatible-cni-versions-and-failed-to-destroy-network-for-sandbox-errors} 

<!--
Service issues exist for pod CNI network setup and tear down in containerd
v1.6.0-v1.6.3 when the CNI plugins have not been upgraded and/or the CNI config
version is not declared in the CNI config files. The containerd team reports, "these issues are resolved in containerd v1.6.4."

With containerd v1.6.0-v1.6.3, if you do not upgrade the CNI plugins and/or
declare the CNI config version, you might encounter the following "Incompatible
CNI versions" or "Failed to destroy network for sandbox" error conditions.
-->

在 containerd v1.6.0-v1.6.3 中，当配置或清除 Pod CNI 网络时，如果 CNI 插件没有升级和/或
CNI 配置文件中没有声明 CNI 配置版本时，会出现服务问题。containerd 团队报告说：
“这些问题在 containerd v1.6.4 中得到了解决。”

在使用 containerd v1.6.0-v1.6.3 时，如果你不升级 CNI 插件和/或声明 CNI 配置版本，
你可能会遇到以下 "Incompatible CNI versions" 或 "Failed to destroy network for sandbox"
错误状况。

<!--
### Incompatible CNI versions error
-->

### Incompatible CNI versions 错误   {#incompatible-cni-versions-error}

<!--
If the version of your CNI plugin does not correctly match the plugin version in
the config because the config version is later than the plugin version, the
containerd log will likely show an error message on startup of a pod similar
to:
-->

如果因为配置版本比插件版本新，导致你的 CNI 插件版本与配置中的插件版本无法正确匹配时，
在启动 Pod 时，containerd 日志可能会显示类似的错误信息：

```
incompatible CNI versions; config is \"1.0.0\", plugin supports [\"0.1.0\" \"0.2.0\" \"0.3.0\" \"0.3.1\" \"0.4.0\"]"
```

<!--
To fix this issue, [update your CNI plugins and CNI config files](#updating-your-cni-plugins-and-cni-config-files).
-->

为了解决这个问题，需要[更新你的 CNI 插件和 CNI 配置文件](#updating-your-cni-plugins-and-cni-config-files)。

<!--
### Failed to destroy network for sandbox error
-->

### Failed to destroy network for sandbox 错误   {#failed-to-destroy-network-for-sandbox-error} 

<!--
If the version of the plugin is missing in the CNI plugin config, the pod may
run. However, stopping the pod generates an error similar to:
-->

如果 CNI 插件配置中未给出插件的版本，
Pod 可能可以运行。但是，停止 Pod 时会产生类似于以下错误：

```
ERROR[2022-04-26T00:43:24.518165483Z] StopPodSandbox for "b" failed
error="failed to destroy network for sandbox \"bbc85f891eaf060c5a879e27bba9b6b06450210161dfdecfbb2732959fb6500a\": invalid version \"\": the version is empty"
```

<!--
This error leaves the pod in the not-ready state with a network namespace still
attached. To recover from this problem, [edit the CNI config file](#updating-your-cni-plugins-and-cni-config-files) to add
the missing version information. The next attempt to stop the pod should
be successful.
-->

此错误使 Pod 处于未就绪状态，且仍然挂接到某网络名字空间上。
为修复这一问题，[编辑 CNI 配置文件](#updating-your-cni-plugins-and-cni-config-files)以添加缺失的版本信息。
下一次尝试停止 Pod 应该会成功。

<!--
### Updating your CNI plugins and CNI config files
-->

### 更新你的 CNI 插件和 CNI 配置文件   {#updating-your-cni-plugins-and-cni-config-files}

<!--
If you're using containerd v1.6.0-v1.6.3 and encountered "Incompatible CNI
versions" or "Failed to destroy network for sandbox" errors, consider updating
your CNI plugins and editing the CNI config files.

Here's an overview of the typical steps for each node:
-->

如果你使用 containerd v1.6.0-v1.6.3 并遇到 "Incompatible CNI versions" 或者
"Failed to destroy network for sandbox" 错误，考虑更新你的 CNI 插件并编辑 CNI 配置文件。

以下是针对各节点要执行的典型步骤的概述：

<!--
1. [Safely drain and cordon the
node](/docs/tasks/administer-cluster/safely-drain-node/).
-->

1. [安全地腾空并隔离节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。

<!--
2. After stopping your container runtime and kubelet services, perform the
following upgrade operations:
  - If you're running CNI plugins, upgrade them to the latest version.
  - If you're using non-CNI plugins, replace them with CNI plugins. Use the
  latest version of the plugins.
  - Update the plugin configuration file to specify or match a version of the
  CNI specification that the plugin supports, as shown in the following ["An
  example containerd configuration
  file"](#an-example-containerd-configuration-file) section.
  - For `containerd`, ensure that you have installed the latest version (v1.0.0
  or later) of the CNI loopback plugin.
  - Upgrade node components (for example, the kubelet) to Kubernetes v1.24
  - Upgrade to or install the most current version of the container runtime.
-->

2. 停止容器运行时和 kubelet 服务后，执行以下升级操作：
  - 如果你正在运行 CNI 插件，请将它们升级到最新版本。
  - 如果你使用的是非 CNI 插件，请将它们替换为 CNI 插件，并使用最新版本的插件。
  - 更新插件配置文件以指定或匹配 CNI 规范支持的插件版本，
    如后文 ["containerd 配置文件示例"](#an-example-containerd-configuration-file)章节所示。
  - 对于 `containerd`，请确保你已安装 CNI loopback 插件的最新版本（v1.0.0 或更高版本）。
  - 将节点组件（例如 kubelet）升级到 Kubernetes v1.24
  - 升级到或安装最新版本的容器运行时。

<!--
3. Bring the node back into your cluster by restarting your container runtime
and kubelet. Uncordon the node (`kubectl uncordon <nodename>`).
-->

3. 通过重新启动容器运行时和 kubelet 将节点重新加入到集群。取消节点隔离（`kubectl uncordon <nodename>`）。

<!--
## An example containerd configuration file
-->

## containerd 配置文件示例   {#an-example-containerd-configuration-file}

<!--
The following example shows a configuration for `containerd` runtime v1.6.x,
which supports a recent version of the CNI specification (v1.0.0).

Please see the documentation from your plugin and networking provider for
further instructions on configuring your system.
-->

以下示例显示了 `containerd` 运行时 v1.6.x 的配置，
它支持最新版本的 CNI 规范（v1.0.0）。
请参阅你的插件和网络提供商的文档，以获取有关你系统配置的进一步说明。

<!--
On Kubernetes, containerd runtime adds a loopback interface, `lo`, to pods as a
default behavior. The containerd runtime configures the loopback interface via a
CNI plugin, `loopback`. The `loopback` plugin is distributed as part of the
`containerd` release packages that have the `cni` designation. `containerd`
v1.6.0 and later includes a CNI v1.0.0-compatible loopback plugin as well as
other default CNI plugins. The configuration for the loopback plugin is done
internally by containerd, and is set to use CNI v1.0.0. This also means that the
version of the `loopback` plugin must be v1.0.0 or later when this newer version
`containerd` is started.
-->

在 Kubernetes 中，作为其默认行为，containerd 运行时为 Pod 添加一个本地回路接口：`lo`。
containerd 运行时通过 CNI 插件 `loopback` 配置本地回路接口。  
`loopback` 插件作为 `containerd` 发布包的一部分，扮演 `cni` 角色。
`containerd` v1.6.0 及更高版本包括与 CNI v1.0.0 兼容的 loopback 插件以及其他默认 CNI 插件。
loopback 插件的配置由 containerd 内部完成，并被设置为使用 CNI v1.0.0。
这也意味着当这个更新版本的 `containerd` 启动时，`loopback` 插件的版本必然是 v1.0.0 或更高版本。

<!--
The following bash command generates an example CNI config. Here, the 1.0.0
value for the config version is assigned to the `cniVersion` field for use when
`containerd` invokes the CNI bridge plugin.
-->

以下 Bash 命令生成一个 CNI 配置示例。这里，`cniVersion` 字段被设置为配置版本值 1.0.0，
以供 `containerd` 调用 CNI 桥接插件时使用。

```bash
cat << EOF | tee /etc/cni/net.d/10-containerd-net.conflist
{
 "cniVersion": "1.0.0",
 "name": "containerd-net",
 "plugins": [
   {
     "type": "bridge",
     "bridge": "cni0",
     "isGateway": true,
     "ipMasq": true,
     "promiscMode": true,
     "ipam": {
       "type": "host-local",
       "ranges": [
         [{
           "subnet": "10.88.0.0/16"
         }],
         [{
           "subnet": "2001:db8:4860::/64"
         }]
       ],
       "routes": [
         { "dst": "0.0.0.0/0" },
         { "dst": "::/0" }
       ]
     }
   },
   {
     "type": "portmap",
     "capabilities": {"portMappings": true},
     "externalSetMarkChain": "KUBE-MARK-MASQ"
   }
 ]
}
EOF
```

<!--
Update the IP address ranges in the preceding example with ones that are based
on your use case and network addressing plan.
-->
基于你的用例和网络地址规划，将前面示例中的 IP 地址范围更新为合适的值。
