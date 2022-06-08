---
layout: blog
title: "Kubernetes-in-Kubernetes and the WEDOS PXE bootable server farm"
slug: kubernetes-in-kubernetes-and-pxe-bootable-server-farm
date: 2021-12-22
---

**作者**：Andrei Kvapil (WEDOS)


當您擁有兩個數據中心、數千台物理服務器、虛擬機並託管數十萬個站點時，Kubernetes 實際上可以簡化所有這些事情的管理。實踐表明，通過使用 Kubernetes，您不僅可以以聲明方式描述和管理應用程序，還可以描述和管理基礎架構本身。我為最大的捷克託管服務提供商 **WEDOS Internet a.s** 工作，今天我將向您展示我的兩個項目 - [Kubernetes-in-Kubernetes](https://github.com/kvaps/kubernetes-in-kubernetes ) 和 [Kubefarm](https://github.com/kvaps/kubefarm)。

在他們的幫助下，您只需幾個命令就可以使用 Helm 在另一個 Kubernetes 中部署一個完全正常工作的 Kubernetes 集群。如何以及為什麼？

讓我向您介紹我們的基礎架構是如何工作的。我們所有的物理服務器都可以分為兩組：**控制平面**和**計算**節點。控制平面節點通常是手動設置的，安裝了穩定的操作系統，旨在運行所有集群服務，包括 Kubernetes 控制平面。這些節點的主要任務是保證集群本身的順利運行。計算節點默認沒有安裝任何操作系統，而是直接從控制平面節點通過網絡引導操作系統映像。他們的工作就是開展工作量。

{{< 圖 src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme01.svg" alt="Kubernetes 集群佈局" >}}

一旦節點下載了它們的映像，它們就可以繼續工作而無需保持與 PXE 服務器的連接。也就是說，PXE 服務器只保存 rootfs 映像，不保存任何其他復雜邏輯。在我們的節點啟動後，我們可以安全地重新啟動 PXE 服務器，它們不會發生任何嚴重的事情。

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme02.svg" alt="引導後的Kubernetes集群" >}}

啟動後，我們的節點要做的第一件事就是加入現有的 Kubernetes 集群，即執行 **kubeadm join** 命令，以便 kube-scheduler 可以在其上調度一些 pod，然後啟動各種工作負載。從一開始，當節點加入到用於控制平面節點的同一個集群時，我們就使用該方案。

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme03.svg" alt="Kubernetes 將容器調度到計算節點" > }}

該方案穩定運行了兩年多。但是後來我們決定向它添加容器化的 Kubernetes。現在我們可以在我們的控制平面節點上非常輕鬆地生成新的 Kubernetes 集群，這些節點現在是成員特殊的管理集群。現在，計算節點可以直接加入它們自己的集群——具體取決於配置。

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme04.svg" alt="多個集群在單個 Kubernetes 中運行，計算加入它們的節點" >}}

## 庫貝農場

這個項目的目標是讓任何人都可以使用 Helm 只需幾個命令就可以部署這樣的基礎設施，並最終獲得大致相同的效果。

此時，我們放棄了單集群的想法。因為事實證明，在同一個集群中管理多個開發團隊的工作並不是很方便。事實是 Kubernetes 從未被設計為多租戶解決方案，目前它還沒有提供足夠的項目之間的隔離手段。因此，為每個團隊運行單獨的集群被證明是一個好主意。但是，集群不宜過多，以方便管理。開發團隊之間沒有足夠的獨立性也不算太小。

更改後，我們集群的可擴展性明顯更好。每個節點數擁有的集群越多，故障域越小，它們的工作就越穩定。作為獎勵，我們得到了一個完全以聲明方式描述的基礎設施。因此，現在您可以像在 Kubernetes 中部署任何其他應用程序一樣部署新的 Kubernetes 集群。

它使用[Kubernetes-in-Kubernetes](http://github.com/kvaps/kubernetes-in-kubernetes)作為基礎，[LTSP](https://github.com/ltsp/ltsp/)作為PXE-啟動節點的服務器，並使用 [dnsmasq-controller](https://github.com/kvaps/dnsmasq-controller) 自動配置 DHCP 服務器：


{{< 圖 src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/kubefarm.png" alt="Kubefarm" >}}

＃＃ 這個怎麼運作

現在讓我們看看它是如何工作的。一般來說，如果你從應用程序的角度來看 Kubernetes，你會注意到它遵循 [The Twelve-Factor App](https://12factor.net/) 的所有原則，並且是 其實寫的很好。因此，這意味著在不同的 Kubernetes 中將 Kubernetes 作為應用程序運行應該沒什麼大不了的。

### 在 Kubernetes 中運行 Kubernetes

現在我們來看看[Kubernetes-in-Kubernetes](https://github.com/kvaps/kubernetes-in-kubernetes)項目，它提供了一個現成的Helm圖表，用於在Kubernetes中運行Kubernetes。

以下是您可以在值文件中傳遞給 Helm 的參數：

* [**kubernetes/values.yaml**](https://github.com/kvaps/kubernetes-in-kubernetes/tree/v0.13.1/deploy/helm/kubernetes)

<img alt="Kubernetes 只是五個二進製文件" style="float: right; max-height: 280px;" src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/5binaries.png">

除了 **persistence**（集群的存儲參數）之外，這裡還描述了 Kubernetes 控制平面組件：即：**etcd cluster**、**apiserver**、**controller-manager** 和 **scheduler **。這些幾乎是標準的 Kubernetes 組件。有一句輕鬆的說法是“Kubernetes 只是五個二進製文件”。所以這裡是這些二進製文件的配置所在的位置。

如果您曾經嘗試使用 kubeadm 引導集群，那麼此配置會提醒您它的配置。但除了 Kubernetes 實體之外，您還有一個管理容器。實際上，它是一個容器，其中包含兩個二進製文件：**kubectl** 和 **kubeadm**。它們用於為上述組件生成 kubeconfig 並執行集群的初始配置。此外，在緊急情況下，您可以隨時執行它來檢查和管理您的集群。

發布後[已部署](https://asciinema.org/a/407280)，可以看到一個pod列表：**admin-container**, **apiserver** in two replicas, **controller -manager**、**etcd-cluster**、**scheduler** 和初始化集群的初始作業。最後你有一個命令，它允許你將 shell 放入管理容器，你可以使用它來查看裡面發生了什麼：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot01.svg)](https://asciinema.org/a/407280?自動播放=1)

另外，讓我們看看證書。如果你曾經安裝過 Kubernetes，那麼你就會知道它有一個 _scary_ 目錄 `/etc/kubernetes/pki` 和一堆證書。在 Kubernetes-in-Kubernetes 的情況下，您可以使用 cert-manager 對它們進行完全自動化的管理。因此，在安裝過程中將所有證書參數傳遞給 Helm 就足夠了，所有證書都會自動為您的集群生成。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot02.svg)](https://asciinema.org/a/407280? t=15&自動播放=1)

查看其中一個證書，例如。 apiserver，你可以看到它有一個 DNS 名稱和 IP 地址的列表。如果您想讓這個集群在外部可以訪問，那麼只需在值文件中描述額外的 DNS 名稱並更新版本。這將更新證書資源，並且 cert-manager 將重新生成證書。您將不再需要考慮這一點。如果 kubeadm 證書需要每年至少更新一次，這裡 cert-manager 會小心並自動更新它們。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot03.svg)](https://asciinema.org/a/407280? t=25&自動播放=1)

現在讓我們登錄到管理容器並查看集群和節點。當然，目前還沒有節點，因為目前您只為 Kubernetes 部署了空白控制平面。但是在 kube-system 命名空間中，您可以看到一些 coredns pod 正在等待調度，並且 configmaps 已經出現。也就是說，您可以得出集群正在運行的結論：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot04.svg)](https://asciinema.org/a/407280? t=30&自動播放=1)

這是[已部署集群的圖表]（https://kvaps.github.io/images/posts/Kubernetes-in-Kubernetes-and-PXE-bootable-servers-farm/Argo_CD_kink_network.html）。您可以看到所有 Kubernetes 組件的服務：**apiserver**、**controller-manager**、**etcd-cluster** 和 **scheduler**。以及它們將流量轉發到的右側的 pod。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/argocd01.png)](https://kvaps.github.io/images/帖子/Kubernetes-in-Kubernetes-and-PXE-bootable-servers-farm/Argo_CD_kink_network.html)

*順便說一下，圖表是在 [ArgoCD](https://argoproj.github.io/argo-cd/) 中繪製的——我們用來管理集群的 GitOps 工具，很酷的圖表是它的功能之一。 *

### 編排物理服務器

好的，現在您可以看到我們的 Kubernetes 控制平面是如何部署的，但是工作節點呢，我們如何添加它們呢？正如我已經說過的，我們所有的服務器都是裸機。我們不使用虛擬化來運行 Kubernetes，而是自己編排所有物理服務器。

阿爾斯









