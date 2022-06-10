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

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme01.svg" alt="Kubernetes 集群佈局" >}}

一旦節點下載了它們的映像，它們就可以繼續工作而無需保持與 PXE 服務器的連接。也就是說，PXE 服務器只保存 rootfs 映像，不保存任何其他復雜邏輯。在我們的節點啟動後，我們可以安全地重新啟動 PXE 服務器，它們不會發生任何嚴重的事情。

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme02.svg" alt="引導後的Kubernetes集群" >}}

啟動後，我們的節點要做的第一件事就是加入現有的 Kubernetes 集群，即執行 **kubeadm join** 命令，以便 kube-scheduler 可以在其上調度一些 pod，然後啟動各種工作負載。從一開始，當節點加入到用於控制平面節點的同一個集群時，我們就使用該方案。

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme03.svg" alt="Kubernetes 將容器調度到計算節點" >}}

該方案穩定運行了兩年多。但是後來我們決定向它添加容器化的 Kubernetes。現在我們可以在我們的控制平面節點上非常輕鬆地生成新的 Kubernetes 集群，這些節點現在是成員特殊的管理集群。現在，計算節點可以直接加入它們自己的集群——具體取決於配置。

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/scheme04.svg" alt="多個集群在單個 Kubernetes 中運行，計算加入它們的節點" >}}

## 庫貝農場

這個項目的目標是讓任何人都可以使用 Helm 只需幾個命令就可以部署這樣的基礎設施，並最終獲得大致相同的效果。

此時，我們放棄了單集群的想法。因為事實證明，在同一個集群中管理多個開發團隊的工作並不是很方便。事實是 Kubernetes 從未被設計為多租戶解決方案，目前它還沒有提供足夠的項目之間的隔離手段。因此，為每個團隊運行單獨的集群被證明是一個好主意。但是，集群不宜過多，以方便管理。開發團隊之間沒有足夠的獨立性也不算太小。

更改後，我們集群的可擴展性明顯更好。每個節點數擁有的集群越多，故障域越小，它們的工作就越穩定。作為獎勵，我們得到了一個完全以聲明方式描述的基礎設施。因此，現在您可以像在 Kubernetes 中部署任何其他應用程序一樣部署新的 Kubernetes 集群。

它使用[Kubernetes-in-Kubernetes](http://github.com/kvaps/kubernetes-in-kubernetes)作為基礎，[LTSP](https://github.com/ltsp/ltsp/)作為PXE-啟動節點的服務器，並使用 [dnsmasq-controller](https://github.com/kvaps/dnsmasq-controller) 自動配置 DHCP 服務器：


{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/kubefarm.png" alt="Kubefarm" >}}

＃＃ 這個怎麼運作

現在讓我們看看它是如何工作的。一般來說，如果你從應用程序的角度來看 Kubernetes，你會注意到它遵循 [The Twelve-Factor App](https://12factor.net/) 的所有原則，並且是 其實寫的很好。因此，這意味著在不同的 Kubernetes 中將 Kubernetes 作為應用程序運行應該沒什麼大不了的。

### 在 Kubernetes 中運行 Kubernetes

現在我們來看看[Kubernetes-in-Kubernetes](https://github.com/kvaps/kubernetes-in-kubernetes)項目，它提供了一個現成的Helm圖表，用於在Kubernetes中運行Kubernetes。

以下是您可以在值文件中傳遞給 Helm 的參數：

* [**kubernetes/values.yaml**](https://github.com/kvaps/kubernetes-in-kubernetes/tree/v0.13.1/deploy/helm/kubernetes)

<img alt="Kubernetes is just five binaries" style="float: right; max-height: 280px;" src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/5binaries.png">

除了 **persistence**（集群的存儲參數）之外，這裡還描述了 Kubernetes 控制平面組件：即：**etcd cluster**、**apiserver**、**controller-manager** 和 **scheduler**。這些幾乎是標準的 Kubernetes 組件。有一句輕鬆的說法是“Kubernetes 只是五個二進製文件”。所以這裡是這些二進製文件的配置所在的位置。

如果您曾經嘗試使用 kubeadm 引導集群，那麼此配置會提醒您它的配置。但除了 Kubernetes 實體之外，您還有一個管理容器。實際上，它是一個容器，其中包含兩個二進製文件：**kubectl** 和 **kubeadm**。它們用於為上述組件生成 kubeconfig 並執行集群的初始配置。此外，在緊急情況下，您可以隨時執行它來檢查和管理您的集群。

發布後[已部署](https://asciinema.org/a/407280)，可以看到一個pod列表：**admin-container**, **apiserver** in two replicas, **controller -manager**、**etcd-cluster**、**scheduler** 和初始化集群的初始作業。最後你有一個命令，它允許你將 shell 放入管理容器，你可以使用它來查看裡面發生了什麼：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot01.svg)](https://asciinema.org/a/407280?autoplay=1)

另外，讓我們看看證書。如果你曾經安裝過 Kubernetes，那麼你就會知道它有一個 _scary_ 目錄 `/etc/kubernetes/pki` 和一堆證書。在 Kubernetes-in-Kubernetes 的情況下，您可以使用 cert-manager 對它們進行完全自動化的管理。因此，在安裝過程中將所有證書參數傳遞給 Helm 就足夠了，所有證書都會自動為您的集群生成。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot02.svg)](https://asciinema.org/a/407280?t=15&autoplay=1)

查看其中一個證書，例如。 apiserver，你可以看到它有一個 DNS 名稱和 IP 地址的列表。如果您想讓這個集群在外部可以訪問，那麼只需在值文件中描述額外的 DNS 名稱並更新版本。這將更新證書資源，並且 cert-manager 將重新生成證書。您將不再需要考慮這一點。如果 kubeadm 證書需要每年至少更新一次，這裡 cert-manager 會小心並自動更新它們。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot03.svg)](https://asciinema.org/a/407280?t=25&autoplay=1)

現在讓我們登錄到管理容器並查看集群和節點。當然，目前還沒有節點，因為目前您只為 Kubernetes 部署了空白控制平面。但是在 kube-system 命名空間中，您可以看到一些 coredns pod 正在等待調度，並且 configmaps 已經出現。也就是說，您可以得出集群正在運行的結論：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot04.svg)](https://asciinema.org/a/407280?t=30&autoplay=1)

這是[已部署集群的圖表](https://kvaps.github.io/images/posts/Kubernetes-in-Kubernetes-and-PXE-bootable-servers-farm/Argo_CD_kink_network.html)。您可以看到所有 Kubernetes 組件的服務：**apiserver**、**controller-manager**、**etcd-cluster** 和 **scheduler**。以及它們將流量轉發到的右側的 pod。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/argocd01.png)](https://kvaps.github.io/images/posts/Kubernetes-in-Kubernetes-and-PXE-bootable-servers-farm/Argo_CD_kink_network.html)
*順便說一下，圖表是在 [ArgoCD](https://argoproj.github.io/argo-cd/) 中繪製的——我們用來管理集群的 GitOps 工具，很酷的圖表是它的功能之一.*

### 編排物理服務器

好的，現在您可以看到我們的 Kubernetes 控制平面是如何部署的，但是工作節點呢，我們如何添加它們呢？正如我已經說過的，我們所有的服務器都是裸機。我們不使用虛擬化來運行 Kubernetes，而是自己編排所有物理服務器。

此外，我們確實非常積極地使用 Linux 網絡引導功能。 此外，這正是引導，而不是某種安裝自動化。 當節點啟動時，它們只是為它們運行一個現成的系統映像。 也就是說，要更新任何節點，我們只需要重新啟動它 - 它就會下載一個新圖像。 這非常容易、簡單和方便。

為此，創建了 [Kubefarm](https://github.com/kvaps/kubefarm) 項目，它允許您自動執行此操作。 最常用的示例可以在 [examples](https://github.com/kvaps/kubefarm/tree/v0.13.1/examples) 目錄中找到。 其中最標準的命名為 [generic](https://github.com/kvaps/kubefarm/tree/v0.13.1/examples/generic)。 我們來看看 values.yaml：

* [**generic/values.yaml**](https://github.com/kvaps/kubefarm/blob/v0.13.1/examples/generic/values.yaml)

您可以在此處指定傳遞到上游 Kubernetes-in-Kubernetes 圖表的參數。為了使您的控制平面可以從外部訪問，在此處指定 IP 地址就足夠了，但如果您願意，您可以在此處指定一些 DNS 名稱。

在 PXE 服務器配置中，您可以指定時區。您還可以添加 SSH 密鑰以在沒有密碼的情況下登錄（但您也可以指定密碼），以及在引導系統期間應應用的內核模塊和參數。

接下來是 **nodePools** 配置，即節點本身。如果你曾經使用過 gke 的 terraform 模塊，那麼這個邏輯會讓你想起它。在這裡，您使用一組參數靜態描述所有節點：

- **Name**（主機名）；
    
- **MAC-addresses** - 我們有兩個網卡的節點，每個節點都可以從此處指定的任何 MAC 地址啟動。
    
- **IP-address**，DHCP 服務器應該發給這個節點。
    

在此示例中，您有兩個池：第一個有五個節點，第二個只有一個，第二個池也分配了兩個標籤。標籤是描述特定節點配置的方式。例如，您可以為某些池添加特定的 DHCP 選項、用於啟動的 PXE 服務器選項（例如，這裡啟用了調試選項）以及一組 **kubernetesLabels** 和 **kubernetesTaints** 選項。這意味著什麼？

例如，在此配置中，您有一個帶有一個節點的第二個 nodePool。池分配了 **debug** 和 **foo** 標籤。現在在 **kubernetesLabels** 中查看 **foo** 標籤的選項。這意味著 m1c43 節點將使用這兩個標籤和分配的污點啟動。一切似乎都很簡單。現在 [讓我們試試](https://asciinema.org/a/407282) 這在實踐中。

### 演示

轉到 [examples](https://github.com/kvaps/kubefarm/tree/v0.13.1/examples) 並將之前部署的圖表更新到 Kubefarm。只需使用 [generic](https://github.com/kvaps/kubefarm/tree/v0.13.1/examples/generic) 參數並查看 pod。您可以看到添加了一個 PXE 服務器和一個作業。這項工作本質上是轉到已部署的 Kubernetes 集群並創建一個新令牌。現在它將每 12 小時重複運行一次以生成新令牌，以便節點可以連接到您的集群。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot05.svg)](https://asciinema.org/a/407282?autoplay=1)

在[圖形表示](https://kvaps.github.io/images/posts/Kubernetes-in-Kubernetes-and-PXE-bootable-servers-farm/Argo_CD_Applications_kubefarm-network.html)中，它看起來差不多，但現在 apiserver 開始暴露在外面。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/argocd02.png)](https://kvaps.github.io/images/posts/Kubernetes-in-Kubernetes-and-PXE-bootable-servers-farm/Argo_CD_Applications_kubefarm-network.html)

在圖中，IP 以綠色突出顯示，可以通過它訪問 PXE 服務器。目前，Kubernetes 默認不允許為 TCP 和 UDP 協議創建單個 LoadBalancer 服務，因此您必須創建兩個具有相同 IP 地址的不同服務。一個用於 TFTP，第二個用於 HTTP，通過它下載系統映像。

但是這個簡單的例子並不總是足夠的，有時您可能需要在啟動時修改邏輯。例如這裡是一個目錄[advanced_network](https://github.com/kvaps/kubefarm/tree/v0.13.1/examples/advanced_network)，裡面有一個[values file](https://github. com/kvaps/kubefarm/tree/v0.13.1/examples/advanced_network）和一個簡單的 shell 腳本。我們稱它為“network.sh”：

* [**network.sh**](https://github.com/kvaps/kubefarm/blob/v0.13.1/examples/advanced_network/values.yaml#L14-L78)

該腳本所做的只是在啟動時獲取環境變量，並根據它們生成網絡配置。它創建一個目錄並將 netplan 配置放入其中。例如，在這裡創建一個綁定接口。基本上，這個腳本可以包含你需要的一切。它可以保存網絡配置或生成系統服務，添加一些鉤子或描述任何其他邏輯。任何可以用 bash 或 shell 語言描述的東西都可以在這里工作，並且會在啟動時執行。

讓我們看看如何[部署](https://asciinema.org/a/407284)。讓我們將通用值文件作為第一個參數傳遞，並將附加值文件作為第二個參數傳遞。這是一個標準的 Helm 功能。這樣你也可以傳遞秘密，但在這種情況下，配置只是由第二個文件擴展：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot06.svg)](https://asciinema.org/a/407284?autoplay=1)

讓我們看看 netboot 服務器的 configmap **foo-kubernetes-ltsp** 並確保 `network.sh` 腳本確實存在。這些命令用於在引導時配置網絡：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot07.svg)](https://asciinema.org/a/407284?t=15&autoplay=1)

[在這裡](https://asciinema.org/a/407286) 你可以看到它的工作原理。機箱接口（我們使用HPE Moonshots 1500）有節點，可以輸入`show node list`命令獲取所有節點的列表。現在您可以看到啟動過程。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot08.svg)](https://asciinema.org/a/407286?autoplay=1)

您還可以通過“show node macaddr all”命令獲取他們的 MAC 地址。我們有一個聰明的操作員自動從機箱收集 MAC 地址並將它們傳遞給 DHCP 服務器。實際上，它只是為運行在同一管理 Kubernetes 集群中的 dnsmasq-controller 創建自定義配置資源。此外，通過此界面，您可以控制節點本身，例如打開和關閉它們。

如果您沒有這樣的機會通過 iLO 進入機箱並為您的節點收集 MAC 地址列表，您可以考慮使用 [catchall cluster](https://asciinema.org/a/407287) 模式。純粹來說，它只是一個帶有動態 DHCP 池的集群。因此，所有未在其他集群的配置中描述的節點將自動加入該集群。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot09.svg)](https://asciinema.org/a/407287?autoplay=1)

例如，您可以看到一個帶有一些節點的特殊集群。它們使用基於其 MAC 地址的自動生成名稱加入集群。從這一點開始，您可以連接到它們並查看那裡會發生什麼。在這裡，您可以以某種方式準備它們，例如，設置文件系統和 然後將它們重新加入另一個集群。

現在讓我們嘗試連接到節點終端，看看它是如何啟動的。在 BIOS 之後，配置了網卡，這裡它從特定的 MAC 地址向 DHCP 服務器發送請求，將其重定向到特定的 PXE 服務器。稍後使用標準 HTTP 協議從服務器下載內核和 initrd 映像：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot10.svg)](https://asciinema.org/a/407286?t=28&autoplay=1)

加載內核後，節點下載 rootfs 映像並將控制權移交給 systemd。然後引導照常進行，之後節點加入 Kubernetes：

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot11.svg)](https://asciinema.org/a/407286?t=80&autoplay=1)

如果你看一下 **fstab**，你只能看到兩個條目：**/var/lib/docker** 和 **/var/lib/kubelet**，它們被掛載為 **tmpfs**（實際上，來自 RAM）。同時，根分區掛載為 **overlayfs**，因此您在此處對系統所做的所有更改將在下次重新啟動時丟失。

查看節點上的塊設備，您可以看到一些 nvme 磁盤，但它還沒有掛載到任何地方。還有一個循環設備 - 這是從服務器下載的確切 rootfs 映像。目前它位於 RAM 中，佔用 653 MB 並使用 **loop** 選項安裝。

如果您查看 **/etc/ltsp**，您會發現在啟動時執行的 `network.sh` 文件。從容器中，您可以看到它正在運行 `kube-proxy` 和 `pause` 容器。

[![](/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/screenshot12.svg)](https://asciinema.org/a/407286?t=100&autoplay=1)

＃＃ 細節

### 網絡啟動映像

但主要圖像來自哪裡？這裡有一個小技巧。節點的鏡像是通過 [Dockerfile](https://github.com/kvaps/kubefarm/tree/v0.13.1/build/ltsp) 與服務器一起構建的。 [Docker multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/) 功能允許您在鏡像構建階段輕鬆添加任何包和內核模塊。它看起來像這樣：

* [**Dockerfile**](https://github.com/kvaps/kubefarm/blob/v0.13.1/build/ltsp/Dockerfile)

這裡發生了什麼？首先，我們使用常規的 Ubuntu 20.04 並安裝我們需要的所有軟件包。首先我們安裝**kernel**、**lvm**、**systemd**、**ssh**。一般來說，您希望在最終節點上看到的所有內容都應在此處描述。這裡我們還安裝了 `docker` 和 `kubelet` 和 `kubeadm`，用於將節點加入集群。

然後我們執行額外的配置。在最後階段，我們只需安裝 `tftp` 和 `nginx`（將我們的鏡像提供給客戶端），**grub**（引導加載程序）。然後將先前階段的根複製到最終圖像中並從中生成壓縮圖像。也就是說，實際上，我們得到了一個 docker 鏡像，其中包含我們節點的服務器和啟動鏡像。同時，可以通過更改 Dockerfile 輕鬆更新。

### Webhook 和 API 聚合層

我要特別注意 webhook 和聚合層的問題。一般來說，webhook 是 Kubernetes 的一項功能，它允許您響應任何資源的創建或修改。因此，您可以添加一個處理程序，以便在應用資源時，Kubernetes 必須向某個 pod 發送請求並檢查該資源的配置是否正確，或者對其進行額外的更改。

但關鍵是，為了讓 webhook 工作，apiserver 必須能夠直接訪問它正在運行的集群。如果它像我們的案例一樣在單獨的集群中啟動，或者甚至與任何集群分開啟動，那麼 Konnectivity 服務可以在這里為我們提供幫助。 Konnectivity 是可選但官方支持的 Kubernetes 組件之一。

讓我們以四個節點的集群為例，每個節點都運行一個“kubelet”，我們還有其他 Kubernetes 組件在外部運行：“kube-apiserver”、“kube-scheduler”和“kube-controller-manager”。默認情況下，所有這些組件都直接與 apiserver 交互——這是 Kubernetes 邏輯中最知名的部分。但實際上，也存在反向連接。例如，當您要查看日誌或運行“kubectl exec 命令”時，API 服務器會獨立建立與特定 kubelet 的連接：

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/konnectivity01.svg" alt="Kubernetes apiserver reaching kubelet" >}}

但問題是，如果我們有一個 webhook，那麼它通常作為標準 pod 運行，並在我們的集群中提供服務。當 apiserver 嘗試訪問它時，它會失敗，因為它將嘗試訪問一個名為 **webhook.namespace.svc** 的集群內服務，該服務位於它實際運行的集群之外：

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/konnectivity02.svg" alt="Kubernetes apiserver can't reach webhook" >}}

在這裡，連接性可以幫助我們。 Konnectivity 是一個專門為 Kubernetes 開發的棘手的代理服務器。它可以部署為 apiserver 旁邊的服務器。並且 Konnectivity-agent 直接部署在您要訪問的集群中的多個副本中。代理建立與服務器的連接並設置穩定的通道以使 apiserver 能夠訪問集群中的所有 webhook 和所有 kubelet。因此，現在與集群的所有通信都將通過 Konnectivity-server 進行：

{{< figure src="/images/blog/2021-12-22-kubernetes-in-kubernetes-and-pxe-bootable-server-farm/konnectivity03.svg" alt="Kubernetes apiserver reaching webhook via konnectivity" >}}

## 我們的計劃

當然，我們不會停留在這個階段。對這個項目感興趣的人經常給我寫信。如果有足夠多的感興趣的人，我希望將 Kubernetes-in-Kubernetes 項目移到 [Kubernetes SIGs](https://github.com/kubernetes-sigs) 下，以官方 Kubernetes 的形式表示舵圖。也許，通過使這個項目獨立，我們將聚集一個更大的社區。

我還在考慮將它與機器控制器管理器集成，這將允許創建工作節點，不僅是物理服務器，而且還可以使用 kubevirt 創建虛擬機並在同一個 Kubernetes 集群中運行它們。順便說一句，它還允許在雲中生成虛擬機，並在本地部署控制平面。

我還在考慮與 Cluster-API 集成的選項，以便您可以直接通過 Kubernetes 環境創建物理 Kubefarm 集群。但目前我並不完全確定這個想法。如果您對此事有任何想法，我很樂意聽取他們的意見。
