
<!--
Manage configuration for a kubeadm cluster persisted in a ConfigMap in the cluster.
-->
管理 kubeadm 集群的配置，这些配置持久化保存在集群的一个 ConfigMap 中。

<!--
### Synopsis
-->
### 摘要



<!--
There is a ConfigMap in the kube-system namespace called "kubeadm-config" that kubeadm uses to store internal configuration about the
cluster. kubeadm CLI v1.8.0+ automatically creates this ConfigMap with the config used with 'kubeadm init', but if you
initialized your cluster using kubeadm v1.7.x or lower, you must use the 'config upload' command to create this
ConfigMap. This is required so that 'kubeadm upgrade' can configure your upgraded cluster correctly.
-->
在 kube-system 名字空间里有一个名为 “kubeadm-config” 的 ConfigMap，kubeadm 用它来存储集群的内部配置。
kubeadm CLI v1.8.0 以上的版本会用 'kubeadm init' 中使用的配置来自动创建这一 ConfigMap，但是如果您使用
kubeadm v1.7.x 或更低的版本来初始化集群，那么您必须使用 'config upload' 命令来创建这一 ConfigMap。
这是必需的，以便 'kubeadm upgrade' 能够正确配置升级后的集群。


```
kubeadm config
```

<!--
### Options

```
      --kubeconfig string   The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
```
-->
### 选项

```
      --kubeconfig string   与集群通信时使用的 KubeConfig 文件(默认为 "/etc/kubernetes/admin.conf")
```

