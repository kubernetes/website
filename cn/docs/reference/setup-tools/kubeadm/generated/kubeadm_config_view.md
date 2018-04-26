
<!--
View the kubeadm configuration stored inside the cluster.
-->
查看存储在集群内部的 kubeadm 配置。

<!--
### Synopsis
-->
### 摘要



<!--
Using this command, you can view the ConfigMap in the cluster where the configuration for kubeadm is located.
-->
使用此命令，您可以查看集群中 kubeadm 配置所在的 ConfigMap。

<!--
The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->
配置位于 “kube-system” 名字空间内名为 “kubeadm-config” 的 ConfigMap 中。


```
kubeadm config view
```

<!--
### Options inherited from parent commands

```
      --kubeconfig string   The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
```
-->
### 继承自父命令的选项

```
      --kubeconfig string   与集群通信时使用的 KubeConfig 文件(默认为 "/etc/kubernetes/admin.conf")
```

