---
title: 使用 CoreDNS 進行服務發現
min-kubernetes-server-version: v1.9
content_type: task
---

<!--
reviewers:
- johnbelamaric
title: Using CoreDNS for Service Discovery
min-kubernetes-server-version: v1.9
content_type: task
-->

<!-- overview -->

<!--
This page describes the CoreDNS upgrade process and how to install CoreDNS instead of kube-dns.
-->
此頁面介紹了 CoreDNS 升級過程以及如何安裝 CoreDNS 而不是 kube-dns。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## About CoreDNS

[CoreDNS](https://coredns.io) is a flexible, extensible DNS server
that can serve as the Kubernetes cluster DNS.
Like Kubernetes, the CoreDNS project is hosted by the
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}.
-->
## 關於 CoreDNS

[CoreDNS](https://coredns.io) 是一個靈活可擴充套件的 DNS 伺服器，可以作為 Kubernetes 叢集 DNS。
與 Kubernetes 一樣，CoreDNS 專案由 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 託管。

<!--
You can use CoreDNS instead of kube-dns in your cluster by replacing
kube-dns in an existing deployment, or by using tools like kubeadm
that will deploy and upgrade the cluster for you.
-->
透過替換現有叢集部署中的 kube-dns，或者使用 kubeadm 等工具來為你部署和升級叢集，
可以在你的叢集中使用 CoreDNS 而非 kube-dns，

<!--
## Installing CoreDNS

For manual deployment or replacement of kube-dns, see the documentation at the
[CoreDNS GitHub project.](https://github.com/coredns/deployment/tree/master/kubernetes)
-->
## 安裝 CoreDNS

有關手動部署或替換 kube-dns，請參閱
[CoreDNS GitHub 專案](https://github.com/coredns/deployment/tree/master/kubernetes)。

<!--
## Migrating to CoreDNS

### Upgrading an existing cluster with kubeadm
-->
## 遷移到 CoreDNS

### 使用 kubeadm 升級現有叢集

<!--
In Kubernetes version 1.21, kubeadm removed its support for `kube-dns` as a DNS application.
For `kubeadm` v{{< skew currentVersion >}}, the only supported cluster DNS application
is CoreDNS.
-->
在 Kubernetes 1.21 版本中，kubeadm 移除了對將 `kube-dns` 作為 DNS 應用的支援。
對於 `kubeadm` v{{< skew currentVersion >}}，所支援的唯一的叢集 DNS 應用是 CoreDNS。

<!--
You can move to CoreDNS when you use `kubeadm` to upgrade a cluster that is
using `kube-dns`. In this case, `kubeadm` generates the CoreDNS configuration
("Corefile") based upon the `kube-dns` ConfigMap, preserving configurations for
stub domains, and upstream name server.
-->
當你使用 `kubeadm` 升級使用 `kube-dns` 的叢集時，你還可以執行到 CoreDNS 的遷移。
在這種場景中，`kubeadm` 將基於 `kube-dns` ConfigMap 生成 CoreDNS 配置（"Corefile"），
儲存存根域和上游名稱伺服器的配置。

<!--
## Upgrading CoreDNS 

You can check the version of CoreDNS that kubeadm installs for each version of
Kubernetes in the page
[CoreDNS version in Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md).
-->
## 升級 CoreDNS 

你可以在 [CoreDNS version in Kubernetes](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md)
頁面檢視 kubeadm 為不同版本 Kubernetes 所安裝的 CoreDNS 版本。

<!--
CoreDNS can be upgraded manually in case you want to only upgrade CoreDNS
or use your own custom image.
There is a helpful [guideline and walkthrough](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)
available to ensure a smooth upgrade.
Make sure the existing CoreDNS configuration ("Corefile") is retained when
upgrading your cluster.
-->
如果你只想升級 CoreDNS 或使用自己的定製映象，也可以手動升級 CoreDNS。
參看[指南和演練](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)
文件瞭解如何平滑升級。
在升級你的叢集過程中，請確保現有 CoreDNS 的配置（"Corefile"）被保留下來。

<!--
If you are upgrading your cluster using the `kubeadm` tool, `kubeadm`
can take care of retaining the existing CoreDNS configuration automatically.
-->
如果使用 `kubeadm` 工具來升級叢集，則 `kubeadm` 可以自動處理保留現有 CoreDNS
配置這一事項。

<!--
## Tuning CoreDNS

When resource utilisation is a concern, it may be useful to tune
the configuration of CoreDNS. For more details, check out the
[documentation on scaling CoreDNS]((https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)).
-->
## CoreDNS 調優

當資源利用方面有問題時，最佳化 CoreDNS 的配置可能是有用的。
有關詳細資訊，請參閱有關[擴縮 CoreDNS 的文件](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)。

## {{% heading "whatsnext" %}}

<!--
You can configure [CoreDNS](https://coredns.io) to support many more use cases than
kube-dns does by modifying the CoreDNS configuration ("Corefile").
For more information, see the [documentation](https://coredns.io/plugins/kubernetes/)
for the `kubernetes` CoreDNS plugin, or read the 
[Custom DNS Entries for Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)
in the CoreDNS blog.
-->
你可以透過修改 CoreDNS 的配置（"Corefile"）來配置 [CoreDNS](https://coredns.io)，
以支援比 kube-dns 更多的用例。
請參考 `kubernetes` CoreDNS 外掛的[文件](https://coredns.io/plugins/kubernetes/)
或者 CoreDNS 部落格上的博文
[Custom DNS Entries for Kubernetes](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)，
以瞭解更多資訊。

