---
title: "驗證 kubectl 的安裝效果"
description: "如何驗證 kubectl。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!-- 
title: "verify kubectl install"
description: "How to verify kubectl."
headless: true
_build:
  list: never
  render: never
  publishResources: false
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
爲了讓 kubectl 能發現並訪問 Kubernetes 叢集，你需要一個
[kubeconfig 檔案](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)，
該檔案在
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
創建叢集時，或成功部署一個 Minikube 叢集時，均會自動生成。
通常，kubectl 的設定資訊存放於檔案 `~/.kube/config` 中。

通過獲取叢集狀態的方法，檢查是否已恰當地設定了 kubectl：

```shell
kubectl cluster-info
```

<!-- 
If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not configured correctly
or is not able to connect to a Kubernetes cluster.
-->
如果返回一個 URL，則意味着 kubectl 成功地訪問到了你的叢集。

如果你看到如下所示的消息，則代表 kubectl 設定出了問題，或無法連接到 Kubernetes 叢集。

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
（訪問 <server-name:port> 被拒絕 - 你指定的主機和端口是否有誤？）
```

<!-- 
For example, if you are intending to run a Kubernetes cluster on your laptop (locally),
you will need a tool like [Minikube](https://minikube.sigs.k8s.io/docs/start/) to be installed first and then re-run the commands stated above.

If `kubectl cluster-info` returns the url response but you can't access your cluster,
to check whether it is configured properly, use:
-->
例如，如果你想在自己的筆記本上（本地）運行 Kubernetes 叢集，你需要先安裝一個 [Minikube](https://minikube.sigs.k8s.io/docs/start/)
這樣的工具，然後再重新運行上面的命令。

如果命令 `kubectl cluster-info` 返回了 URL，但你還不能訪問叢集，那可以用以下命令來檢查設定是否妥當：

```shell
kubectl cluster-info dump
```

<!--
### Troubleshooting the 'No Auth Provider Found' error message {#no-auth-provider-found}

In Kubernetes 1.26, kubectl removed the built-in authentication for the following cloud
providers' managed Kubernetes offerings. These providers have released kubectl plugins
to provide the cloud-specific authentication. For instructions, refer to the following provider documentation:
-->
### 排查"找不到身份驗證提供商"的錯誤資訊    {#no-auth-provider-found}

在 Kubernetes 1.26 中，kubectl 刪除了以下雲提供商託管的 Kubernetes 產品的內置身份驗證。
這些提供商已經發布了 kubectl 插件來提供特定於雲的身份驗證。
有關說明，請參閱以下提供商文檔：

<!--
* Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)
-->
* Azure AKS：[kubelogin 插件](https://azure.github.io/kubelogin/)
* CKE：[gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

<!--
(There could also be other reasons to see the same error message, unrelated to that change.)
-->
（還可能會有其他原因會看到相同的錯誤資訊，和這個更改無關。）
