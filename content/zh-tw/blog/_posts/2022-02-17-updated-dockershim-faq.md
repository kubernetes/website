---
layout: blog
title: "更新：移除 Dockershim 的常見問題"
linkTitle: "移除 Dockershim 的常見問題"
date: 2022-02-17
slug: dockershim-faq
aliases: [ '/zh-cn/dockershim' ]
---
<!-- 
layout: blog
title: "Updated: Dockershim Removal FAQ"
linkTitle: "Dockershim Removal FAQ"
date: 2022-02-17
slug: dockershim-faq
aliases: [ '/dockershim' ]
-->

<!--
**This supersedes the original
[Dockershim Deprecation FAQ](/blog/2020/12/02/dockershim-faq/) article,
published in late 2020. The article includes updates from the v1.24
release of Kubernetes.**
-->
**本文是針對 2020 年末發佈的[棄用 Dockershim 的常見問題](/zh-cn/blog/2020/12/02/dockershim-faq/)的博客更新。
本文包括 Kubernetes v1.24 版本的更新。**

---

<!--
This document goes over some frequently asked questions regarding the
removal of _dockershim_ from Kubernetes. The removal was originally
[announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/)
as a part of the Kubernetes v1.20 release. The Kubernetes
[v1.24 release](/releases/#release-v1-24) actually removed the dockershim
from Kubernetes.
-->
本文介紹了一些關於從 Kubernetes 中移除 _dockershim_ 的常見問題。
該移除最初是作爲 Kubernetes v1.20
版本的一部分[宣佈](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/)的。
Kubernetes 在 [v1.24 版](/releases/#release-v1-24)移除了 dockershim。

<!--
For more on what that means, check out the blog post
[Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/).
-->
關於細節請參考博文
[別慌: Kubernetes 和 Docker](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/)。

<!--
To determine the impact that the removal of dockershim would have for you or your organization,
you can read [Check whether dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/).
-->
要確定移除 dockershim 是否會對你或你的組織的影響，可以查閱：
[檢查棄用 Dockershim 對你的影響](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
這篇文章。

<!--
In the months and days leading up to the Kubernetes 1.24 release, Kubernetes contributors worked hard to try to make this a smooth transition.
-->
在 Kubernetes 1.24 發佈之前的幾個月和幾天裏，Kubernetes
貢獻者努力試圖讓這個過渡順利進行。

<!--
- A blog post detailing our [commitment and next steps](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/).
- Checking if there were major blockers to migration to [other container runtimes](/docs/setup/production-environment/container-runtimes/#container-runtimes).
- Adding a [migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/) guide.
- Creating a list of
  [articles on dockershim removal and on using CRI-compatible runtimes](/docs/reference/node/topics-on-dockershim-and-cri-compatible-runtimes/).
  That list includes some of the already mentioned docs, and also covers selected external sources
  (including vendor guides).
-->
- 一篇詳細說明[承諾和後續操作](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)的博文。
- 檢查是否存在遷移到其他 [容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/#container-runtimes) 的主要障礙。
- 添加 [從 dockershim 遷移](/docs/tasks/administer-cluster/migrating-from-dockershim/)的指南。
- 創建了一個[有關 dockershim 移除和使用 CRI 兼容運行時的列表](/zh-cn/docs/reference/node/topics-on-dockershim-and-cri-compatible-runtimes/)。
  該列表包括一些已經提到的文檔，還涵蓋了選定的外部資源（包括供應商指南）。

<!--
### Why was the dockershim removed from Kubernetes?
-->
### 爲什麼會從 Kubernetes 中移除 dockershim ？ {#why-was-the-dockershim-removed-from-kubernetes}

<!--
Early versions of Kubernetes only worked with a specific container runtime:
Docker Engine. Later, Kubernetes added support for working with other container runtimes.
The CRI standard was [created](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) to
enable interoperability between orchestrators (like Kubernetes) and many different container
runtimes.
Docker Engine doesn't implement that interface (CRI), so the Kubernetes project created
special code to help with the transition, and made that _dockershim_ code part of Kubernetes
itself.
-->
Kubernetes 的早期版本僅適用於特定的容器運行時：Docker Engine。
後來，Kubernetes 增加了對使用其他容器運行時的支持。[創建](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) CRI
標準是爲了實現編排器（如 Kubernetes）和許多不同的容器運行時之間交互操作。
Docker Engine 沒有實現（CRI）接口，因此 Kubernetes 項目創建了特殊代碼來幫助過渡，
並使 dockershim 代碼成爲 Kubernetes 的一部分。

<!--
The dockershim code was always intended to be a temporary solution (hence the name: shim).
You can read more about the community discussion and planning in the
[Dockershim Removal Kubernetes Enhancement Proposal][drkep].
In fact, maintaining dockershim had become a heavy burden on the Kubernetes maintainers.
-->
dockershim 代碼一直是一個臨時解決方案（因此得名：shim）。
你可以閱讀 [Kubernetes 移除 Dockershim 增強方案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim)
以瞭解相關的社區討論和計劃。
事實上，維護 dockershim 已經成爲 Kubernetes 維護者的沉重負擔。

<!--
Additionally, features that were largely incompatible with the dockershim, such
as cgroups v2 and user namespaces are being implemented in these newer CRI
runtimes. Removing the dockershim from Kubernetes allows further development in those areas.
-->
此外，在較新的 CRI 運行時中實現了與 dockershim 不兼容的功能，例如 cgroups v2 和使用者命名空間。
從 Kubernetes 中移除 dockershim 允許在這些領域進行進一步的開發。

<!--
### Are Docker and containers the same thing?
-->
### Docker 和容器一樣嗎？ {#are-docker-and-containers-the-same-thing}

<!--
Docker popularized the Linux containers pattern and has been instrumental in
developing the underlying technology, however containers in Linux have existed
for a long time. The container ecosystem has grown to be much broader than just
Docker. Standards like OCI and CRI have helped many tools grow and thrive in our
ecosystem, some replacing aspects of Docker while others enhance existing
functionality.
-->
Docker 普及了 Linux 容器模式，並在開發底層技術方面發揮了重要作用，但是 Linux
中的容器已經存在了很長時間，容器生態系統已經發展到比 Docker 廣泛得多。
OCI 和 CRI 等標準幫助許多工具在我們的生態系統中發展壯大，其中一些替代了 Docker
的某些方面，而另一些則增強了現有功能。

<!--
### Will my existing container images still work?
-->
### 我現有的容器映像檔是否仍然有效？ {#will-my-existing-container-images-still-work}

<!--
Yes, the images produced from `docker build` will work with all CRI implementations.
All your existing images will still work exactly the same.
-->
是的，從 `docker build` 生成的映像檔將適用於所有 CRI 實現，
現有的所有映像檔仍將完全相同。

<!--
#### What about private images?
-->
#### 私有映像檔呢？ {#what-about-private-images}

<!--
Yes. All CRI runtimes support the same pull secrets configuration used in
Kubernetes, either via the PodSpec or ServiceAccount.
-->
當然可以，所有 CRI 運行時都支持在 Kubernetes 中使用的相同的 pull secrets
設定，無論是通過 PodSpec 還是 ServiceAccount。

<!--
### Can I still use Docker Engine in Kubernetes 1.23?
-->
### 在 Kubernetes 1.23 版本中還可以使用 Docker Engine 嗎？ {#can-i-still-use-docker-engine-in-kubernetes-1-23}

<!--
Yes, the only thing changed in 1.20 is a single warning log printed at [kubelet]
startup if using Docker Engine as the runtime. You'll see this warning in all versions up to 1.23. The dockershim removal occurred
in Kubernetes 1.24.
-->
可以使用，在 1.20 版本中唯一的改動是，如果使用 Docker Engine，
在 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
啓動時會打印一個警告日誌。
你將在 1.23 版本及以前版本看到此警告，dockershim 已在 Kubernetes 1.24 版本中移除 。

<!--
If you're running Kubernetes v1.24 or later, see [Can I still use Docker Engine as my container runtime?](#can-i-still-use-docker-engine-as-my-container-runtime).
(Remember, you can switch away from the dockershim if you're using any supported Kubernetes release; from release v1.24, you
**must** switch as Kubernetes no longer includes the dockershim).
-->
如果你運行的是 Kubernetes v1.24 或更高版本，請參閱
[我仍然可以使用 Docker Engine 作爲我的容器運行時嗎？](#can-i-still-use-docker-engine-as-my-container-runtime)
（如果你使用任何支持 dockershim 的版本，可以隨時切換離開；從版本 v1.24
開始，因爲 Kubernetes 不再包含 dockershim，你**必須**切換）。

<!--
### Which CRI implementation should I use?
-->
### 我應該用哪個 CRI 實現？ {#which-cri-implementation-should-i-use}

<!--
That’s a complex question and it depends on a lot of factors. If Docker Engine is
working for you, moving to containerd should be a relatively easy swap and
will have strictly better performance and less overhead. However, we encourage you
to explore all the options from the [CNCF landscape] in case another would be an
even better fit for your environment.
-->
這是一個複雜的問題，依賴於許多因素。
如果你正在使用 Docker Engine，遷移到 containerd
應該是一個相對容易地轉換，並將獲得更好的性能和更少的開銷。
然而，我們鼓勵你探索 [CNCF landscape] 提供的所有選項，做出更適合你的選擇。

[CNCF landscape]: https://landscape.cncf.io/?group=projects-and-products&view-mode=card#runtime--container-runtime

<!--
#### Can I still use Docker Engine as my container runtime?
-->
#### 我還可以使用 Docker Engine 作爲我的容器運行時嗎？ {#can-i-still-use-docker-engine-as-my-container-runtime}

<!--
First off, if you use Docker on your own PC to develop or test containers: nothing changes.
You can still use Docker locally no matter what container runtime(s) you use for your
Kubernetes clusters. Containers make this kind of interoperability possible.
-->
首先，如果你在自己的電腦上使用 Docker 用來做開發或測試容器：它將與之前沒有任何變化。
無論你爲 Kubernetes 叢集使用什麼容器運行時，你都可以在本地使用 Docker。容器使這種交互成爲可能。

<!--
Mirantis and Docker have [committed][mirantis] to maintaining a replacement adapter for
Docker Engine, and to maintain that adapter even after the in-tree dockershim is removed
from Kubernetes. The replacement adapter is named [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/).
-->
Mirantis 和 Docker 已[承諾](https://www.mirantis.com/blog/mirantis-to-take-over-support-of-kubernetes-dockershim-2/)
爲 Docker Engine 維護一個替代適配器，
並在 dockershim 從 Kubernetes 移除後維護該適配器。
替代適配器名爲 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/)。

<!--
You can install `cri-dockerd` and use it to connect the kubelet to Docker Engine. Read [Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/) to learn more.
-->
你可以安裝 `cri-dockerd` 並使用它將 kubelet 連接到 Docker Engine。
閱讀[將 Docker Engine 節點從 dockershim 遷移到 cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
以瞭解更多信息。


<!--
### Are there examples of folks using other runtimes in production today?
-->
### 現在是否有在生產系統中使用其他運行時的例子？ {#are-there-examples-of-folks-using-other-runtimes-in-production-today}

<!--
All Kubernetes project produced artifacts (Kubernetes binaries) are validated
with each release.
-->
Kubernetes 所有項目在所有版本中出產的工件（Kubernetes 二進制文件）都經過了驗證。

<!--
Additionally, the [kind] project has been using containerd for some time and has
seen an improvement in stability for its use case. Kind and containerd are leveraged
multiple times every day to validate any changes to the Kubernetes codebase. Other
related projects follow a similar pattern as well, demonstrating the stability and
usability of other container runtimes. As an example, OpenShift 4.x has been
using the [CRI-O] runtime in production since June 2019.
-->
此外，[kind](https://kind.sigs.k8s.io/) 項目使用 containerd 已經有一段時間了，並且提高了其用例的穩定性。
Kind 和 containerd 每天都會被多次使用來驗證對 Kubernetes 代碼庫的任何更改。
其他相關項目也遵循同樣的模式，從而展示了其他容器運行時的穩定性和可用性。
例如，OpenShift 4.x 從 2019 年 6 月以來，就一直在生產環境中使用 [CRI-O](https://cri-o.io/) 運行時。

<!--
For other examples and references you can look at the adopters of containerd and
CRI-O, two container runtimes under the Cloud Native Computing Foundation ([CNCF]).
-->
至於其他示例和參考資料，你可以查看 containerd 和 CRI-O 的使用者列表，
這兩個容器運行時是雲原生基金會（[CNCF](https://cncf.io)）下的項目。

- [containerd](https://github.com/containerd/containerd/blob/master/ADOPTERS.md)
- [CRI-O](https://github.com/cri-o/cri-o/blob/master/ADOPTERS.md)

<!--
### People keep referencing OCI, what is that?
-->
### 人們總在談論 OCI，它是什麼？ {#people-keep-referencing-oci-what-is-that}

<!--
OCI stands for the [Open Container Initiative], which standardized many of the
interfaces between container tools and technologies. They maintain a standard
specification for packaging container images (OCI image-spec) and running containers
(OCI runtime-spec). They also maintain an actual implementation of the runtime-spec
in the form of [runc], which is the underlying default runtime for both
[containerd] and [CRI-O]. The CRI builds on these low-level specifications to
provide an end-to-end standard for managing containers.
-->
OCI 是 [Open Container Initiative](https://opencontainers.org/about/overview/) 的縮寫，
它標準化了容器工具和底層實現之間的大量接口。
它們維護了打包容器映像檔（OCI image）和運行時（OCI runtime）的標準規範。
它們還以 [runc](https://github.com/opencontainers/runc) 的形式維護了一個 runtime-spec 的真實實現，
這也是 [containerd](https://containerd.io/) 和 [CRI-O](https://cri-o.io/) 依賴的默認運行時。
CRI 建立在這些底層規範之上，爲管理容器提供端到端的標準。


<!--
### What should I look out for when changing CRI implementations?
-->
### 當切換 CRI 實現時，應該注意什麼？ {#what-should-i-look-out-for-when-changing-cri-implementations}

<!--
While the underlying containerization code is the same between Docker and most
CRIs (including containerd), there are a few differences around the edges. Some
common things to consider when migrating are:
-->
雖然 Docker 和大多數 CRI（包括 containerd）之間的底層容器化代碼是相同的，
但其周邊部分卻存在差異。遷移時要考慮如下常見事項：

<!--
- Logging configuration
- Runtime resource limitations
- Node provisioning scripts that call docker or use Docker Engine via its control socket
- Plugins for `kubectl` that require the `docker` CLI or the Docker Engine control socket
- Tools from the Kubernetes project that require direct access to Docker Engine
  (for example: the deprecated `kube-imagepuller` tool)
- Configuration of functionality like `registry-mirrors` and insecure registries
- Other support scripts or daemons that expect Docker Engine to be available and are run
  outside of Kubernetes (for example, monitoring or security agents)
- GPUs or special hardware and how they integrate with your runtime and Kubernetes
-->
- 日誌設定
- 運行時的資源限制
- 調用 docker 或通過其控制套接字使用 Docker Engine 的節點設定腳本
- 需要 `docker` 命令或 Docker Engine 控制套接字的 `kubectl` 插件
- 需要直接訪問 Docker Engine 的 Kubernetes 工具（例如：已棄用的 'kube-imagepuller' 工具）
- 設定 `registry-mirrors` 和不安全的映像檔倉庫等功能
- 保障 Docker Engine 可用、且運行在 Kubernetes 之外的腳本或守護進程（例如：監視或安全代理）
- GPU 或特殊硬件，以及它們如何與你的運行時和 Kubernetes 集成

<!--
If you use Kubernetes resource requests/limits or file-based log collection
DaemonSets then they will continue to work the same, but if you've customized
your `dockerd` configuration, you’ll need to adapt that for your new container
runtime where possible.
-->
如果你只是用了 Kubernetes 資源請求/限制或基於文件的日誌收集 DaemonSet，它們將繼續穩定工作，
但是如果你用了自定義了 dockerd 設定，則可能需要爲新的容器運行時做一些適配工作。

<!--
Another thing to look out for is anything expecting to run for system maintenance
or nested inside a container when building images will no longer work. For the
former, you can use the [`crictl`][cr] tool as a drop-in replacement (see
[mapping from docker cli to crictl](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/#mapping-from-docker-cli-to-crictl))
and for the latter you can use newer container build options like [img], [buildah],
[kaniko], or [buildkit-cli-for-kubectl] that don’t require Docker.
-->
另外還有一個需要關注的點，那就是當創建映像檔時，系統維護或嵌入容器方面的任務將無法工作。
對於前者，可以用 [`crictl`](https://github.com/kubernetes-sigs/cri-tools) 工具作爲臨時替代方案
(參閱[從 docker cli 到 crictl 的映射](/zh-cn/docs/tasks/debug/debug-cluster/crictl/#mapping-from-docker-cli-to-crictl))。
對於後者，可以用新的容器創建選項，例如
[img](https://github.com/genuinetools/img)、
[buildah](https://github.com/containers/buildah)、
[kaniko](https://github.com/GoogleContainerTools/kaniko) 或
[buildkit-cli-for-kubectl](https://github.com/vmware-tanzu/buildkit-cli-for-kubectl)，
他們都不需要 Docker。

<!-- 
For containerd, you can start with their [documentation] to see what configuration
options are available as you migrate things over.
-->
對於 containerd，你可查閱有關它的[文檔](https://github.com/containerd/cri/blob/master/docs/registry.md)，
獲取遷移時可用的設定選項。

<!--
For instructions on how to use containerd and CRI-O with Kubernetes, see the
Kubernetes documentation on [Container Runtimes].
-->
有關如何在 Kubernetes 中使用 containerd 和 CRI-O 的說明，
請參閱 [Kubernetes 相關文檔](/docs/setup/production-environment/container-runtimes/)。

<!--
### What if I have more questions?
-->
### 我還有其他問題怎麼辦？ {#what-if-i-have-more-questions}

<!--
If you use a vendor-supported Kubernetes distribution, you can ask them about
upgrade plans for their products. For end-user questions, please post them
to our end user community forum: https://discuss.kubernetes.io/.
-->
如果你使用了供應商支持的 Kubernetes 發行版，你可以諮詢供應商他們產品的升級計劃。
對於最終使用者的問題，請把問題發到我們的最終使用者社區的[論壇](https://discuss.kubernetes.io/)。

<!--
You can discuss the decision to remove dockershim via a dedicated
[GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917).
-->
你可以通過專用 [GitHub 問題](https://github.com/kubernetes/kubernetes/issues/106917) 
討論刪除 dockershim 的決定。

<!--
You can also check out the excellent blog post
[Wait, Docker is deprecated in Kubernetes now?][dep] a more in-depth technical
discussion of the changes.
-->
你也可以看看這篇優秀的博客文章：[等等，Docker 被 Kubernetes 棄用了?](https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m)
對這些變化進行更深入的技術討論。

<!--
### Is there any tooling that can help me find dockershim in use?
-->
### 是否有任何工具可以幫助我找到正在使用的 dockershim？ {#is-there-any-tooling-that-can-help-me-find-dockershim-in-use}

<!--
Yes! The [Detector for Docker Socket (DDS)][dds] is a kubectl plugin that you can
install and then use to check your cluster. DDS can detect if active Kubernetes workloads
are mounting the Docker Engine socket (`docker.sock`) as a volume.
Find more details and usage patterns in the DDS project's [README][dds].
-->
是的！ [Docker Socket 檢測器 (DDS)][dds] 是一個 kubectl 插件，
你可以安裝它用於檢查你的叢集。 DDS 可以檢測運行中的 Kubernetes
工作負載是否將 Docker Engine 套接字 (`docker.sock`) 作爲卷掛載。
在 DDS 項目的 [README][dds] 中查找更多詳細信息和使用方法。

[dds]: https://github.com/aws-containers/kubectl-detector-for-docker-socket

<!--
### Can I have a hug?
-->
### 我可以加入嗎？ {#can-i-have-a-hug}

<!--
Yes, we're still giving hugs as requested. 🤗🤗🤗
-->
當然，只要你願意，隨時隨地歡迎。🤗🤗🤗