<!--

### Synopsis

Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run

```
kubeadm upgrade diff [version] [flags]
```

### Options

| --api-server-manifest string     Default: "/etc/kubernetes/manifests/kube-apiserver.yaml" |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              | path to API server manifest                                  |
| --config string                                              |                                                              |
|                                                              | Path to a kubeadm configuration file.                        |
| -c, --context-lines int     Default: 3                       |                                                              |
|                                                              | How many lines of context in the diff                        |
| --controller-manager-manifest string     Default: "/etc/kubernetes/manifests/kube-controller-manager.yaml" |                                                              |
|                                                              | path to controller manifest                                  |
| -h, --help                                                   |                                                              |
|                                                              | help for diff                                                |
| --kubeconfig string     Default: "/etc/kubernetes/admin.conf" |                                                              |
|                                                              | The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. |
| --scheduler-manifest string     Default: "/etc/kubernetes/manifests/kube-scheduler.yaml" |                                                              |
|                                                              | path to scheduler manifest                                   |

### Options inherited from parent commands

| --rootfs string |                                                             |
| --------------- | ----------------------------------------------------------- |
|                 | [EXPERIMENTAL] The path to the 'real' host root filesystem. |

-->

### 概述

显示哪些差异将被应用于现有的静态 pod 资源清单。参考: kubeadm upgrade apply --dry-run 

```
kubeadm upgrade diff [version] [flags]
```

### 选项

| --api-server-manifest string     默认值: "/etc/kubernetes/manifests/kube-apiserver.yaml" |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              | API服务器清单的路径                                          |
| --config string                                              |                                                              |
|                                                              | kubeadm 配置文件的路径。                                     |
| -c, --context-lines int     默认值: 3                        |                                                              |
|                                                              | 差异中有多少行上下文                                         |
| --controller-manager-manifest string     默认值: "/etc/kubernetes/manifests/kube-controller-manager.yaml" |                                                              |
|                                                              | 控制器清单的路径                                             |
| -h, --help                                                   |                                                              |
|                                                              | 帮助                                                         |
| --kubeconfig string     默认值: "/etc/kubernetes/admin.conf" |                                                              |
|                                                              | 与集群通信时使用的 kubeconfig 文件，如果标志是未设置，则可以在一组标准位置中搜索现有的 kubeconfig 文件。 |
| --scheduler-manifest string     默认值: "/etc/kubernetes/manifests/kube-scheduler.yaml" |                                                              |
|                                                              | 调度程序清单的路径                                           |

### 从父命令继承的选项

| --rootfs string |                                              |
| --------------- | -------------------------------------------- |
|                 | [EXPERIMENTAL]  “真实”主机根文件系统的路径。 |

