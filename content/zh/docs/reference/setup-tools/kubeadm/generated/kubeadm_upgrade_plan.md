<!--

### Synopsis

Check which versions are available to upgrade to and validate whether your current cluster is upgradeable. To skip the internet check, pass in the optional [version] parameter

```
kubeadm upgrade plan [version] [flags]
```

### Options

| --allow-experimental-upgrades                                |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              | Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes. |
| --allow-release-candidate-upgrades                           |                                                              |
|                                                              | Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes. |
| --config string                                              |                                                              |
|                                                              | Path to a kubeadm configuration file.                        |
| --feature-gates string                                       |                                                              |
|                                                              | A set of key=value pairs that describe feature gates for various features. Options are: IPv6DualStack=true\|false (ALPHA - default=false) PublicKeysECDSA=true\|false (ALPHA - default=false) |
| -h, --help                                                   |                                                              |
|                                                              | help for plan                                                |
| --ignore-preflight-errors stringSlice                        |                                                              |
|                                                              | A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks. |
| --kubeconfig string     Default: "/etc/kubernetes/admin.conf" |                                                              |
|                                                              | The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. |
| --print-config                                               |                                                              |
|                                                              | Specifies whether the configuration file that will be used in the upgrade should be printed or not. |

### Options inherited from parent commands

| --rootfs string |                                                             |
| --------------- | ----------------------------------------------------------- |
|                 | [EXPERIMENTAL] The path to the 'real' host root filesystem. |

-->

### 概述

检查可升级到哪些版本，并验证您当前的集群是否可升级。 要跳过互联网检查，请传递可选的 [version] 参数 

```
kubeadm upgrade plan [version] [flags]
```

### 选项

| --allow-experimental-upgrades                                |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              | 显示不稳定版本的 Kubernetes 作为升级替代方案，并允许升级到 Kubernetes 的 Alpha/Beta/发行候选版本。 |
| --allow-release-candidate-upgrades                           |                                                              |
|                                                              | 显示 Kubernetes 的发行候选版本作为升级选择，并允许升级到 Kubernetes 的发行候选版本。 |
| --config string                                              |                                                              |
|                                                              | 配置文件的路径。                                             |
| --feature-gates string                                       |                                                              |
|                                                              | 一组描述各种特征特性门控的键值对。选项有：IPv6DualStack=true\|false (ALPHA - default=false) PublicKeysECDSA=true\|false (ALPHA - default=false) |
| -h, --help                                                   |                                                              |
|                                                              | 帮助                                                         |
| --ignore-preflight-errors stringSlice                        |                                                              |
|                                                              | 检查清单，其错误将显示为警告。 例如：“IsPrivilegedUser，Swap”。 值 “all” 忽略所有检查的错误。 |
| --kubeconfig string     Default: "/etc/kubernetes/admin.conf" |                                                              |
|                                                              | 与集群通信时使用的 kubeconfig 文件。 如果标志为未设置，则可以在一组标准位置中搜索现有的 kubeconfig 文件。 |
| --print-config                                               |                                                              |
|                                                              | 指定是否打印将在升级中使用的配置文件。                       |

### 从父命令继承的选项

| --rootfs string |                                              |
| --------------- | -------------------------------------------- |
|                 | [EXPERIMENTAL]  “真实”主机根文件系统的路径。 |
