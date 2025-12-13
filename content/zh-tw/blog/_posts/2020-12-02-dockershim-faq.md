---
layout: blog
title: "棄用 Dockershim 的常見問題"
date: 2020-12-02
slug: dockershim-faq
---
<!-- 
layout: blog
title: "Dockershim Deprecation FAQ"
date: 2020-12-02
slug: dockershim-faq
-->

<!--
_**Update**: There is a [newer version](/blog/2022/02/17/dockershim-faq/) of this article available._
-->
_**更新**：本文有[較新版本](/zh-cn/blog/2022/02/17/dockershim-faq/)。_

<!-- 
This document goes over some frequently asked questions regarding the Dockershim
deprecation announced as a part of the Kubernetes v1.20 release. For more detail
on the deprecation of Docker as a container runtime for Kubernetes kubelets, and
what that means, check out the blog post
[Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/).

Also, you can read [check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) to check whether it does.
-->
本文回顧了自 Kubernetes v1.20 版宣佈棄用 Dockershim 以來所引發的一些常見問題。
關於 Kubernetes kubelets 從容器運行時的角度棄用 Docker 的細節以及這些細節背後的含義，請參考博文
[別慌: Kubernetes 和 Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/)。

此外，你可以閱讀[檢查 Dockershim 移除是否影響你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)以檢查它是否會影響你。

<!-- 
### Why is dockershim being deprecated?
-->
### 爲什麼棄用 dockershim {#why-is-dockershim-being-deprecated}

<!-- 
Maintaining dockershim has become a heavy burden on the Kubernetes maintainers.
The CRI standard was created to reduce this burden and allow smooth interoperability
of different container runtimes. Docker itself doesn't currently implement CRI,
thus the problem.
-->
維護 dockershim 已經成爲 Kubernetes 維護者肩頭一個沉重的負擔。
創建 CRI 標準就是爲了減輕這個負擔，同時也可以增加不同容器運行時之間平滑的互操作性。
但反觀 Docker 卻至今也沒有實現 CRI，所以麻煩就來了。

<!-- 
Dockershim was always intended to be a temporary solution (hence the name: shim).
You can read more about the community discussion and planning in the
[Dockershim Removal Kubernetes Enhancement Proposal][drkep].
-->
Dockershim 向來都是一個臨時解決方案（因此得名：shim）。
你可以進一步閱讀
[移除 Dockershim 這一 Kubernetes 增強方案][drkep]
以瞭解相關的社區討論和計劃。

<!-- 
Additionally, features that were largely incompatible with the dockershim, such
as cgroups v2 and user namespaces are being implemented in these newer CRI
runtimes. Removing support for the dockershim will allow further development in
those areas.
-->
此外，與 dockershim 不兼容的一些特性，例如：控制組（cgoups）v2 和使用者名字空間（user namespace），已經在新的 CRI 運行時中被實現。
移除對 dockershim 的支持將加速這些領域的發展。

[drkep]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim
<!-- 
### Can I still use Docker in Kubernetes 1.20?
-->
### 在 Kubernetes 1.20 版本中，我還可以用 Docker 嗎？ {#can-I-still-use-docker-in-kubernetes-1.20}

<!-- 
Yes, the only thing changing in 1.20 is a single warning log printed at [kubelet]
startup if using Docker as the runtime.
-->
當然可以，在 1.20 版本中僅有的改變就是：如果使用 Docker 運行時，啓動 
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 
的過程中將打印一條警告日誌。

<!-- 
### When will dockershim be removed?
-->
### 什麼時候移除 dockershim {#when-will-dockershim-be-removed}

<!-- 
Given the impact of this change, we are using an extended deprecation timeline.
It will not be removed before Kubernetes 1.22, meaning the earliest release without
dockershim would be 1.23 in late 2021. 
_Update_: removal of dockershim is scheduled for Kubernetes v1.24, see 
[Dockershim Removal Kubernetes Enhancement Proposal][drkep].
We will be working closely with vendors and other ecosystem groups to ensure a smooth transition and will evaluate 
things as the situation evolves.
-->
考慮到此改變帶來的影響，我們使用了一個加長的廢棄時間表。
在 Kubernetes 1.22 版之前，它不會被徹底移除；換句話說，dockershim 被移除的最早版本會是 2021 年底發佈的 1.23 版。
_更新_：dockershim 計劃在 Kubernetes 1.24 版被移除，
請參閱[移除 Dockershim 這一 Kubernetes 增強方案][drkep]。
我們將與供應商以及其他生態團隊緊密合作，確保順利過渡，並將依據事態的發展評估後續事項。


<!--
### Can I still use dockershim after it is removed from Kubernetes?
-->
### 從 Kubernetes 中移除後我還能使用 dockershim 嗎？ {#can-i-still-use-dockershim-after-it-is-removed-from-kubernetes}

<!--
Update:
Mirantis and Docker have [committed][mirantis] to maintaining the dockershim after
it is removed from Kubernetes.
-->
更新：Mirantis 和 Docker [已承諾][mirantis]在 dockershim 從 Kubernetes
中刪除後對其進行維護。

[mirantis]: https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/


<!-- 
### Will my existing Docker images still work?
-->
### 我現有的 Docker 映像檔還能正常工作嗎？ {#will-my-existing-docker-image-still-work}

<!-- 
Yes, the images produced from `docker build` will work with all CRI implementations.
All your existing images will still work exactly the same.
-->
當然可以，`docker build` 創建的映像檔適用於任何 CRI 實現。
所有你的現有映像檔將和往常一樣工作。

<!-- 
### What about private images?
-->
### 私有映像檔呢？{#what-about-private-images}

<!-- 
Yes. All CRI runtimes support the same pull secrets configuration used in
Kubernetes, either via the PodSpec or ServiceAccount.
-->
當然可以。所有 CRI 運行時均支持 Kubernetes 中相同的拉取（pull）Secret 設定，
不管是通過 PodSpec 還是通過 ServiceAccount 均可。

<!-- 
### Are Docker and containers the same thing?
-->
### Docker 和容器是一回事嗎？ {#are-docker-and-containers-the-same-thing}

<!-- 
Docker popularized the Linux containers pattern and has been instrumental in
developing the underlying technology, however containers in Linux have existed
for a long time. The container ecosystem has grown to be much broader than just
Docker. Standards like OCI and CRI have helped many tools grow and thrive in our
ecosystem, some replacing aspects of Docker while others enhance existing
functionality.
-->
雖然 Linux 的容器技術已經存在了很久，
但 Docker 普及了 Linux 容器這種技術模式，並在開發底層技術方面發揮了重要作用。
容器的生態相比於單純的 Docker，已經進化到了一個更寬廣的領域。
像 OCI 和 CRI 這類標準幫助許多工具在我們的生態中成長和繁榮，
其中一些工具替代了 Docker 的某些部分，另一些增強了現有功能。

<!-- 
### Are there examples of folks using other runtimes in production today?
-->
### 現在是否有在生產系統中使用其他運行時的例子？ {#are-there-example-of-folks-using-other-runtimes-in-production-today}

<!-- 
All Kubernetes project produced artifacts (Kubernetes binaries) are validated
with each release.
-->
Kubernetes 所有項目在所有版本中出產的工件（Kubernetes 二進制檔案）都經過了驗證。

<!-- 
Additionally, the [kind] project has been using containerd for some time and has
seen an improvement in stability for its use case. Kind and containerd are leveraged
multiple times every day to validate any changes to the Kubernetes codebase. Other
related projects follow a similar pattern as well, demonstrating the stability and
usability of other container runtimes. As an example, OpenShift 4.x has been
using the [CRI-O] runtime in production since June 2019.
-->
此外，[kind] 項目使用 containerd 已經有年頭了，
並且在這個場景中，穩定性還明顯得到提升。
Kind 和 containerd 每天都會做多次協調，以驗證對 Kubernetes 代碼庫的所有更改。
其他相關項目也遵循同樣的模式，從而展示了其他容器運行時的穩定性和可用性。
例如，OpenShift 4.x 從 2019 年 6 月以來，就一直在生產環境中使用 [CRI-O] 運行時。

<!-- 
For other examples and references you can look at the adopters of containerd and
CRI-O, two container runtimes under the Cloud Native Computing Foundation ([CNCF]).
- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)
-->
至於其他示例和參考資料，你可以查看 containerd 和 CRI-O 的使用者列表，
這兩個容器運行時是雲原生基金會（[CNCF]）下的項目。

- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)

[CRI-O]: https://cri-o.io/
[kind]: https://kind.sigs.k8s.io/
[CNCF]: https://cncf.io


<!-- 
### People keep referencing OCI, what is that?
-->
### 人們總在談論 OCI，那是什麼？ {#people-keep-referenceing-oci-what-is-that}

<!-- 
OCI stands for the [Open Container Initiative], which standardized many of the
interfaces between container tools and technologies. They maintain a standard
specification for packaging container images (OCI image-spec) and running containers
(OCI runtime-spec). They also maintain an actual implementation of the runtime-spec
in the form of [runc], which is the underlying default runtime for both
[containerd] and [CRI-O]. The CRI builds on these low-level specifications to
provide an end-to-end standard for managing containers.
-->
OCI 代表[開放容器標準](https://opencontainers.org/about/overview/)，
它標準化了容器工具和底層實現（technologies）之間的大量介面。
他們維護了打包容器映像檔（OCI image-spec）和運行容器（OCI runtime-spec）的標準規範。
他們還以 [runc](https://github.com/opencontainers/runc) 
的形式維護了一個 runtime-spec 的真實實現，
這也是 [containerd](https://containerd.io/) 和 [CRI-O](https://cri-o.io/) 依賴的預設運行時。
CRI 建立在這些底層規範之上，爲管理容器提供端到端的標準。

<!-- 
### Which CRI implementation should I use?
-->
### 我應該用哪個 CRI 實現？ {#which-cri-implementation-should-I-use}

<!-- 
That’s a complex question and it depends on a lot of factors. If Docker is
working for you, moving to containerd should be a relatively easy swap and
will have strictly better performance and less overhead. However, we encourage you
to explore all the options from the [CNCF landscape] in case another would be an
even better fit for your environment.
-->
這是一個複雜的問題，依賴於許多因素。
在 Docker 工作良好的情況下，遷移到 containerd 是一個相對容易的轉換，並將獲得更好的性能和更少的開銷。
然而，我們建議你先探索 [CNCF 全景圖](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#runtime--container-runtime)
提供的所有選項，以做出更適合你的環境的選擇。

<!-- 
### What should I look out for when changing CRI implementations?
-->
### 當切換 CRI 底層實現時，我應該注意什麼？ {#what-should-I-look-out-for-when-changing-CRI-implementation}

<!-- 
While the underlying containerization code is the same between Docker and most
CRIs (including containerd), there are a few differences around the edges. Some
common things to consider when migrating are:
-->
Docker 和大多數 CRI（包括 containerd）的底層容器化代碼是相同的，但其周邊部分卻存在一些不同。
遷移時一些常見的關注點是：

<!-- 
- Logging configuration
- Runtime resource limitations
- Node provisioning scripts that call docker or use docker via it's control socket
- Kubectl plugins that require docker CLI or the control socket
- Kubernetes tools that require direct access to Docker (e.g. kube-imagepuller)
- Configuration of functionality like `registry-mirrors` and insecure registries 
- Other support scripts or daemons that expect Docker to be available and are run
  outside of Kubernetes (e.g. monitoring or security agents)
- GPUs or special hardware and how they integrate with your runtime and Kubernetes
-->

- 日誌設定
- 運行時的資源限制
- 直接訪問 docker 命令或通過控制套接字調用 Docker 的節點供應腳本
- 需要訪問 docker 命令或控制套接字的 kubectl 插件
- 需要直接訪問 Docker 的 Kubernetes 工具（例如：kube-imagepuller）
- 設定像 `registry-mirrors` 和不安全的映像檔倉庫等功能
- 需要 Docker 保持可用、且運行在 Kubernetes 之外的，其他支持腳本或守護進程（例如：監視或安全代理）
- GPU 或特殊硬件，以及它們如何與你的運行時和 Kubernetes 集成

<!-- 
If you use Kubernetes resource requests/limits or file-based log collection
DaemonSets then they will continue to work the same, but if you’ve customized
your dockerd configuration, you’ll need to adapt that for your new container
runtime where possible.
-->
如果你只是用了 Kubernetes 資源請求/限制或基於檔案的日誌收集 DaemonSet，它們將繼續穩定工作，
但是如果你用了自定義了 dockerd 設定，則可能需要爲新容器運行時做一些適配工作。

<!-- 
Another thing to look out for is anything expecting to run for system maintenance
or nested inside a container when building images will no longer work. For the
former, you can use the [`crictl`][cr] tool as a drop-in replacement (see [mapping from dockercli to crictl](/docs/reference/tools/map-crictl-dockercli/)) and for the
latter you can use newer container build options like [img], [buildah],
[kaniko], or [buildkit-cli-for-kubectl] that don’t require Docker.
-->
另外還有一個需要關注的點，那就是當創建映像檔時，系統維護或嵌入容器方面的任務將無法工作。
對於前者，可以用 [`crictl`](https://github.com/kubernetes-sigs/cri-tools) 工具作爲臨時替代方案
(參見[從 docker 命令映射到 crictl](/zh-cn/docs/reference/tools/map-crictl-dockercli/))；
對於後者，可以用新的容器創建選項，比如
[cr](https://github.com/kubernetes-sigs/cri-tools)、
[img](https://github.com/genuinetools/img)、
[buildah](https://github.com/containers/buildah)、
[kaniko](https://github.com/GoogleContainerTools/kaniko)、或 
[buildkit-cli-for-kubectl](https://github.com/vmware-tanzu/buildkit-cli-for-kubectl
)，
他們均不需要訪問 Docker。

<!-- 
For containerd, you can start with their [documentation] to see what configuration
options are available as you migrate things over.
-->
對於 containerd，你可以從它們的
[文檔](https://github.com/containerd/cri/blob/master/docs/registry.md)
開始，看看在遷移過程中有哪些設定選項可用。

<!-- 
For instructions on how to use containerd and CRI-O with Kubernetes, see the
Kubernetes documentation on [Container Runtimes]
-->
對於如何協同 Kubernetes 使用 containerd 和 CRI-O 的說明，參見 Kubernetes 文檔中這部分：
[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes)。

<!-- 
### What if I have more questions?
-->
### 我還有問題怎麼辦？{#what-if-I-have-more-questions}

<!-- 
If you use a vendor-supported Kubernetes distribution, you can ask them about
upgrade plans for their products. For end-user questions, please post them
to our end user community forum: https://discuss.kubernetes.io/. 
-->
如果你使用了一個有供應商支持的 Kubernetes 發行版，你可以諮詢供應商他們產品的升級計劃。
對於最終使用者的問題，請把問題發到我們的最終使用者社區的[論壇](https://discuss.kubernetes.io/)。

<!-- 
You can also check out the excellent blog post
[Wait, Docker is deprecated in Kubernetes now?][dep] a more in-depth technical
discussion of the changes.
-->
你也可以看看這篇優秀的博文：
[等等，Docker 剛剛被 Kubernetes 廢掉了？](https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m) 
一個對此變化更深入的技術討論。

<!-- 
### Can I have a hug?
-->
### 我可以加入嗎？{#can-I-have-a-hug}

<!-- 
Always and whenever you want!  🤗🤗
-->
只要你願意，隨時隨地歡迎加入！

