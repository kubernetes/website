---
title: "驗證 kubectl 的安裝效果"
description: "如何驗證 kubectl。"
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
為了讓 kubectl 能發現並訪問 Kubernetes 叢集，你需要一個
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)，
該檔案在
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
建立叢集時，或成功部署一個 Miniube 叢集時，均會自動生成。
通常，kubectl 的配置資訊存放於檔案 `~/.kube/config` 中。

透過獲取叢集狀態的方法，檢查是否已恰當的配置了 kubectl：

```shell
kubectl cluster-info
```

<!-- 
If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly or is not able to connect to a Kubernetes cluster.
 -->
如果返回一個 URL，則意味著 kubectl 成功的訪問到了你的叢集。

如果你看到如下所示的訊息，則代表 kubectl 配置出了問題，或無法連線到 Kubernetes 叢集。

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
（訪問 <server-name:port> 被拒絕 - 你指定的主機和埠是否有誤？）
```

<!-- 
For example, if you are intending to run a Kubernetes cluster on your laptop (locally), you will need a tool like Minikube to be installed first and then re-run the commands stated above.

If kubectl cluster-info returns the url response but you can't access your cluster, to check whether it is configured properly, use:
 -->
例如，如果你想在自己的筆記本上（本地）執行 Kubernetes 叢集，你需要先安裝一個 Minikube 這樣的工具，然後再重新執行上面的命令。

如果命令 `kubectl cluster-info` 返回了 url，但你還不能訪問叢集，那可以用以下命令來檢查配置是否妥當：

```shell
kubectl cluster-info dump
```