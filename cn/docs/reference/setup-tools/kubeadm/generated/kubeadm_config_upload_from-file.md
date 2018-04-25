
<!--
Upload a configuration file to the in-cluster ConfigMap for kubeadm configuration.
-->
为 kubeadm 配置上传一个配置文件到集群内部的 ConfigMap 中。

<!--
### Synopsis
-->
### 摘要



<!--
Using this command, you can upload configuration to the ConfigMap in the cluster using the same config file you gave to 'kubeadm init'.
If you initialized your cluster using a v1.7.x or lower kubeadm client and used the --config option, you need to run this command with the
same config file before upgrading to v1.8 using 'kubeadm upgrade'.
-->
使用此命令，您可以上传配置到集群中的 ConfigMap，上传时使用的是 'kubeadm init' 中传入的相同的配置文件。
如果您使用 v1.7.x 或更低版本的 kubeadm 客户端，并使用 --config 选项来初始化您的集群，那么在使用
'kubeadm upgrade' 升级到 v1.8 之前，您需要使用同样的配置文件运行此命令。

<!--
The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->
配置位于 “kube-system” 名字空间内名为 “kubeadm-config” 的 ConfigMap 中。


```
kubeadm config upload from-file
```

<!--
### Options

```
      --config string   Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental.
```
-->
### 选项

```
      --config string   kubeadm 配置文件。 警告：配置文件的使用是试验性的。
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

