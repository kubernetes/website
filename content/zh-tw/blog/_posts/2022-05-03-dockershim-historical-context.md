---
layout: blog
title: "Dockershim：歷史背景"
date: 2022-05-03
slug: dockershim-historical-context
---

<!--
layout: blog
title: "Dockershim: The Historical Context"
date: 2022-05-03
slug: dockershim-historical-context
-->

<!--
**Author:** Kat Cosgrove

Dockershim has been removed as of Kubernetes v1.24, and this is a positive move for the project. However, context is important for fully understanding something, be it socially or in software development, and this deserves a more in-depth review. Alongside the dockershim removal in Kubernetes v1.24, we’ve seen some confusion (sometimes at a panic level) and dissatisfaction with this decision in the community, largely due to a lack of context around this removal. The decision to deprecate and eventually remove dockershim from Kubernetes was not made quickly or lightly. Still, it’s been in the works for so long that many of today’s users are newer than that decision, and certainly newer than the choices that led to the dockershim being necessary in the first place.

So what is the dockershim, and why is it going away?
-->
**作者：** Kat Cosgrove

自 Kubernetes v1.24 起，Dockershim 已被刪除，這對項目來說是一個積極的舉措。
然而，背景對於充分理解某事很重要，無論是社交還是軟件開發，這值得更深入的審查。
除了 Kubernetes v1.24 中的 dockershim 移除之外，
我們在社區中看到了一些混亂（有時處於恐慌級別）和對這一決定的不滿，
主要是由於缺乏有關此刪除背景的瞭解。棄用並最終從 Kubernetes 中刪除
dockershim 的決定並不是迅速或輕率地做出的。
儘管如此，它已經工作了很長時間，以至於今天的許多使用者都比這個決定更新，
更不用提當初爲何引入 dockershim 了。

那麼 dockershim 是什麼，爲什麼它會消失呢？

<!--
In the early days of Kubernetes, we only supported one container runtime. That runtime was Docker Engine. Back then, there weren’t really a lot of other options out there and Docker was the dominant tool for working with containers, so this was not a controversial choice. Eventually, we started adding more container runtimes, like rkt and hypernetes, and it became clear that Kubernetes users want a choice of runtimes working best for them. So Kubernetes needed a way to allow cluster operators the flexibility to use whatever runtime they choose.
-->
在 Kubernetes 的早期，我們只支持一個容器運行時，那個運行時就是 Docker Engine。
那時，並沒有太多其他選擇，而 Docker 是使用容器的主要工具，所以這不是一個有爭議的選擇。
最終，我們開始添加更多的容器運行時，比如 rkt 和 hypernetes，很明顯 Kubernetes
使用者希望選擇最適合他們的運行時。因此，Kubernetes 需要一種方法來允許叢集操作員靈活地使用他們選擇的任何運行時。

<!--
The [Container Runtime Interface](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) (CRI) was released to allow that flexibility. The introduction of CRI was great for the project and users alike, but it did introduce a problem: Docker Engine’s use as a container runtime predates CRI, and Docker Engine is not CRI-compatible. To solve this issue, a small software shim (dockershim) was introduced as part of the kubelet component specifically to fill in the gaps between Docker Engine and CRI, allowing cluster operators to continue using Docker Engine as their container runtime largely uninterrupted.
-->
[容器運行時接口](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) (CRI) 
已發佈以支持這種靈活性。 CRI 的引入對項目和使用者來說都很棒，但它確實引入了一個問題：Docker Engine
作爲容器運行時的使用早於 CRI，並且 Docker Engine 不兼容 CRI。 爲了解決這個問題，在 kubelet
組件中引入了一個小型軟件 shim (dockershim)，專門用於填補 Docker Engine 和 CRI 之間的空白，
允許叢集操作員繼續使用 Docker Engine 作爲他們的容器運行時基本上不間斷。

<!--
However, this little software shim was never intended to be a permanent solution. Over the course of years, its existence has introduced a lot of unnecessary complexity to the kubelet itself. Some integrations are inconsistently implemented for Docker because of this shim, resulting in an increased burden on maintainers, and maintaining vendor-specific code is not in line with our open source philosophy. To reduce this maintenance burden and move towards a more collaborative community in support of open standards, [KEP-2221 was introduced](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim), proposing the removal of the dockershim. With the release of Kubernetes v1.20, the deprecation was official.
-->
然而，這個小軟件 shim 從來沒有打算成爲一個永久的解決方案。 多年來，它的存在給
kubelet 本身帶來了許多不必要的複雜性。由於這個 shim，Docker
的一些集成實現不一致，導致維護人員的負擔增加，並且維護特定於供應商的代碼不符合我們的開源理念。
爲了減少這種維護負擔並朝着支持開放標準的更具協作性的社區邁進，
[引入了 KEP-2221](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim)，
建議移除 dockershim。隨着 Kubernetes v1.20 的發佈，正式棄用。

<!--
We didn’t do a great job communicating this, and unfortunately, the deprecation announcement led to some panic within the community. Confusion around what this meant for Docker as a company, if container images built by Docker would still run, and what Docker Engine actually is led to a conflagration on social media. This was our fault; we should have more clearly communicated what was happening and why at the time. To combat this, we released [a blog](/blog/2020/12/02/dont-panic-kubernetes-and-docker/) and [accompanying FAQ](/blog/2020/12/02/dockershim-faq/) to allay the community’s fears and correct some misconceptions about what Docker is and how containers work within Kubernetes. As a result of the community’s concerns, Docker and Mirantis jointly agreed to continue supporting the dockershim code in the form of [cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/), allowing you to continue using Docker Engine as your container runtime if need be. For the interest of users who want to try other runtimes, like containerd or cri-o, [migration documentation was written](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).
-->
我們沒有很好地傳達這一點，不幸的是，棄用公告在社區內引起了一些恐慌。關於這對
Docker作爲一家公司意味着什麼，Docker 構建的容器映像檔是否仍然可以運行，以及
Docker Engine 究竟是什麼導致了社交媒體上的一場大火，人們感到困惑。
這是我們的錯；我們應該更清楚地傳達當時發生的事情和原因。爲了解決這個問題，
我們發佈了[一篇博客](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/)和[相應的 FAQ](/zh-cn/blog/2020/12/02/dockershim-faq/)
以減輕社區的恐懼並糾正對 Docker 是什麼以及容器如何在 Kubernetes 中工作的一些誤解。
由於社區的關注，Docker 和 Mirantis 共同決定繼續以
[cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/)
的形式支持 dockershim 代碼，允許你在需要時繼續使用 Docker Engine 作爲容器運行時。
對於想要嘗試其他運行時（如 containerd 或 cri-o）的使用者，
[已編寫遷移文檔](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/)。

<!--
We later [surveyed the community](https://kubernetes.io/blog/2021/11/12/are-you-ready-for-dockershim-removal/) and [discovered that there are still many users with questions and concerns](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim). In response, Kubernetes maintainers and the CNCF committed to addressing these concerns by extending documentation and other programs. In fact, this blog post is a part of this program. With so many end users successfully migrated to other runtimes, and improved documentation, we believe that everyone has a paved way to migration now.
-->
我們後來[調查了社區](https://kubernetes.io/blog/2021/11/12/are-you-ready-for-dockershim-removal/)[發現還有很多使用者有疑問和顧慮](/zh-cn/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim)。 
作爲回應，Kubernetes 維護人員和 CNCF 承諾通過擴展文檔和其他程序來解決這些問題。
事實上，這篇博文是這個計劃的一部分。隨着如此多的最終使用者成功遷移到其他運行時，以及改進的文檔，
我們相信每個人現在都爲遷移鋪平了道路。

<!--
Docker is not going away, either as a tool or as a company. It’s an important part of the cloud native community and the history of the Kubernetes project. We wouldn’t be where we are without them. That said, removing dockershim from kubelet is ultimately good for the community, the ecosystem, the project, and open source at large. This is an opportunity for all of us to come together to support open standards, and we’re glad to be doing so with the help of Docker and the community.
-->
Docker 不會消失，無論是作爲一種工具還是作爲一家公司。它是雲原生社區的重要組成部分，
也是 Kubernetes 項目的歷史。沒有他們，我們就不會是現在的樣子。也就是說，從 kubelet
中刪除 dockershim 最終對社區、生態系統、項目和整個開源都有好處。
這是我們所有人齊心協力支持開放標準的機會，我們很高興在 Docker 和社區的幫助下這樣做。
