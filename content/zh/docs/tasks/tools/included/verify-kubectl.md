---
title: "验证 kubectl 的安装效果"
description: "如何验证 kubectl。"
headless: true
---
<!-- 
---
title: "verify kubectl install"
description: "How to verify kubectl."
headless: true
---
 -->

<!-- 
In order for kubectl to find and access a Kubernetes cluster, it needs a
[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
which is created automatically when you create a cluster using
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
or successfully deploy a Minikube cluster.
By default, kubectl configuration is located at `~/.kube/config`.

Check that kubectl is properly configured by getting the cluster state:
 -->
为了让 kubectl 能发现并访问 Kubernetes 集群，你需要一个
[kubeconfig 文件](/docs/zh/concepts/configuration/organize-cluster-access-kubeconfig/)，
该文件在
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
创建集群时，或成功部署一个 Miniube 集群时，均会自动生成。
通常，kubectl 的配置信息存放于文件 `~/.kube/config` 中。

通过获取集群状态的方法，检查是否已恰当的配置了 kubectl：

```shell
kubectl cluster-info
```

<!-- 
If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly or is not able to connect to a Kubernetes cluster.
 -->
如果返回一个 URL，则意味着 kubectl 成功的访问到了你的集群。

如果你看到如下所示的消息，则代表 kubectl 配置出了问题，或无法连接到 Kubernetes 集群。

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
（访问 <server-name:port> 被拒绝 - 你指定的主机和端口是否有误？）
```

<!-- 
For example, if you are intending to run a Kubernetes cluster on your laptop (locally), you will need a tool like Minikube to be installed first and then re-run the commands stated above.

If kubectl cluster-info returns the url response but you can't access your cluster, to check whether it is configured properly, use:
 -->
例如，如果你想在自己的笔记本上（本地）运行 Kubernetes 集群，你需要先安装一个 Minikube 这样的工具，然后再重新运行上面的命令。

如果命令 `kubectl cluster-info` 返回了 url，但你还不能访问集群，那可以用以下命令来检查配置是否妥当：

```shell
kubectl cluster-info dump
```