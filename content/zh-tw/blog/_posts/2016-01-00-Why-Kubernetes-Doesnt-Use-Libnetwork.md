---
title: " 爲什麼 Kubernetes 不用 libnetwork "
date: 2016-01-14
slug: why-kubernetes-doesnt-use-libnetwork
---

<!--
title: " Why Kubernetes doesn’t use libnetwork "
date: 2016-01-14
slug: why-kubernetes-doesnt-use-libnetwork
url: /blog/2016/01/Why-Kubernetes-Doesnt-Use-Libnetwork
-->

<!-- Kubernetes has had a very basic form of network plugins since before version 1.0 was released — around the same time as Docker's [libnetwork](https://github.com/docker/libnetwork) and Container Network Model ([CNM](https://github.com/docker/libnetwork/blob/master/docs/design.md)) was introduced. Unlike libnetwork, the Kubernetes plugin system still retains its "alpha" designation. Now that Docker's network plugin support is released and supported, an obvious question we get is why Kubernetes has not adopted it yet. After all, vendors will almost certainly be writing plugins for Docker — we would all be better off using the same drivers, right?   -->

在 1.0 版本發佈之前，Kubernetes 已經有了一個非常基礎的網路插件形式-大約在引入 Docker’s [libnetwork](https://github.com/docker/libnetwork) 和 Container Network Model ([CNM](https://github.com/docker/libnetwork/blob/master/docs/design.md)) 的時候。與 libnetwork 不同，Kubernetes 插件系統仍然保留它的 'alpha' 名稱。現在 Docker 的網路插件支持已經發布並得到支持，我們發現一個明顯的問題是 Kubernetes 尚未採用它。畢竟，供應商幾乎肯定會爲 Docker 編寫插件-我們最好還是用相同的驅動程式，對吧？

<!-- Before going further, it's important to remember that Kubernetes is a system that supports multiple container runtimes, of which Docker is just one. Configuring networking is a facet of each runtime, so when people ask "will Kubernetes support CNM?" what they really mean is "will kubernetes support CNM drivers with the Docker runtime?" It would be great if we could achieve common network support across runtimes, but that’s not an explicit goal.   -->

在進一步說明之前，重要的是記住 Kubernetes 是一個支持多種容器運行時的系統， Docker 只是其中之一。設定網路只是每一個運行時的一個方面，所以當人們問起“ Kubernetes 會支持CNM嗎？”，他們真正的意思是“ Kubernetes 會支持 Docker 運行時的 CNM 驅動嗎？”如果我們能夠跨運行時實現通用的網路支持會很棒，但這不是一個明確的目標。

<!-- Indeed, Kubernetes has not adopted CNM/libnetwork for the Docker runtime. In fact, we’ve been investigating the alternative Container Network Interface ([CNI](https://github.com/appc/cni/blob/master/SPEC.md)) model put forth by CoreOS and part of the App Container ([appc](https://github.com/appc)) specification. Why? There are a number of reasons, both technical and non-technical.   -->

實際上， Kubernetes 還沒有爲 Docker 運行時採用 CNM/libnetwork 。事實上，我們一直在研究 CoreOS 提出的替代 Container Network Interface ([CNI](https://github.com/appc/cni/blob/master/SPEC.md)) 模型以及 App Container ([appc](https://github.com/appc)) 規範的一部分。爲什麼我們要這麼做？有很多技術和非技術的原因。

<!-- First and foremost, there are some fundamental assumptions in the design of Docker's network drivers that cause problems for us.   -->

首先，Docker 的網路驅動程式設計中存在一些基本假設，這些假設會給我們帶來問題。

<!-- Docker has a concept of "local" and "global" drivers. Local drivers (such as "bridge") are machine-centric and don’t do any cross-node coordination. Global drivers (such as "overlay") rely on [libkv](https://github.com/docker/libkv) (a key-value store abstraction) to coordinate across machines. This key-value store is a another plugin interface, and is very low-level (keys and values, no semantic meaning). To run something like Docker's overlay driver in a Kubernetes cluster, we would either need cluster admins to run a whole different instance of [consul](https://github.com/hashicorp/consul), [etcd](https://github.com/coreos/etcd) or [zookeeper](https://zookeeper.apache.org/) (see [multi-host networking](https://docs.docker.com/engine/userguide/networking/get-started-overlay/)), or else we would have to provide our own libkv implementation that was backed by Kubernetes.  -->

Docker 有一個“本地”和“全局”驅動程式的概念。本地驅動程式（例如 "bridge" ）以機器爲中心，不進行任何跨節點協調。全局驅動程式（例如 "overlay" ）依賴於 [libkv](https://github.com/docker/libkv) （一個鍵值儲存抽象庫）來協調跨機器。這個鍵值儲存是另一個插件介面，並且是非常低級的（鍵和值，沒有其他含義）。 要在 Kubernetes 叢集中運行類似 Docker's overlay 驅動程式，我們要麼需要叢集管理員來運行 [consul](https://github.com/hashicorp/consul), [etcd](https://github.com/coreos/etcd) 或 [zookeeper](https://zookeeper.apache.org/) 的整個不同實例 (see [multi-host networking](https://docs.docker.com/engine/userguide/networking/get-started-overlay/)) 否則我們必須提供我們自己的 libkv 實現，那被 Kubernetes 支持。

<!-- The latter sounds attractive, and we tried to implement it, but the libkv interface is very low-level, and the schema is defined internally to Docker. We would have to either directly expose our underlying key-value store or else offer key-value semantics (on top of our structured API which is itself implemented on a key-value system). Neither of those are very attractive for performance, scalability and security reasons. The net result is that the whole system would significantly be more complicated, when the goal of using Docker networking is to simplify things.   -->

後者聽起來很有吸引力，並且我們嘗試實現它，但 libkv 介面是非常低級的，並且架構在內部定義爲 Docker 。我們必須直接暴露我們的底層鍵值儲存，或者提供鍵值語義（在我們的結構化API之上，它本身是在鍵值系統上實現的）。對於性能，可伸縮性和安全性原因，這些都不是很有吸引力。最終結果是，當使用 Docker 網路的目標是簡化事情時，整個系統將顯得更加複雜。

<!-- For users that are willing and able to run the requisite infrastructure to satisfy Docker global drivers and to configure Docker themselves, Docker networking should "just work." Kubernetes will not get in the way of such a setup, and no matter what direction the project goes, that option should be available. For default installations, though, the practical conclusion is that this is an undue burden on users and we therefore cannot use Docker's global drivers (including "overlay"), which eliminates a lot of the value of using Docker's plugins at all.   -->

對於願意並且能夠運行必需的基礎架構以滿足 Docker 全局驅動程式並自己設定 Docker 的使用者， Docker 網路應該“正常工作。” Kubernetes 不會妨礙這樣的設置，無論項目的方向如何，該選項都應該可用。但是對於預設安裝，實際的結論是這對使用者來說是一個不應有的負擔，因此我們不能使用 Docker 的全局驅動程式（包括 "overlay" ），這消除了使用 Docker 插件的很多價值。

<!-- Docker's networking model makes a lot of assumptions that aren’t valid for Kubernetes. In docker versions 1.8 and 1.9, it includes a fundamentally flawed implementation of "discovery" that results in corrupted `/etc/hosts` files in containers ([docker #17190](https://github.com/docker/docker/issues/17190)) — and this cannot be easily turned off. In version 1.10 Docker is planning to [bundle a new DNS server](https://github.com/docker/docker/issues/17195), and it’s unclear whether this will be able to be turned off. Container-level naming is not the right abstraction for Kubernetes — we already have our own concepts of service naming, discovery, and binding, and we already have our own DNS schema and server (based on the well-established [SkyDNS](https://github.com/skynetservices/skydns)). The bundled solutions are not sufficient for our needs but are not disableable.   -->

Docker 的網路模型做出了許多對 Kubernetes 無效的假設。在 docker 1.8 和 1.9 版本中，它包含一個從根本上有缺陷的“發現”實現，導致容器中的 `/etc/hosts` 檔案損壞 ([docker #17190](https://github.com/docker/docker/issues/17190)) - 並且這不容易被關閉。在 1.10 版本中，Docker 計劃 [捆綁一個新的DNS伺服器](https://github.com/docker/docker/issues/17195)，目前還不清楚是否可以關閉它。容器級命名不是 Kubernetes 的正確抽象 - 我們已經有了自己的服務命名，發現和綁定概念，並且我們已經有了自己的 DNS 模式和伺服器（基於完善的 [SkyDNS](https://github.com/skynetservices/skydns) ）。捆綁的解決方案不足以滿足我們的需求，但不能禁用。

<!-- Orthogonal to the local/global split, Docker has both in-process and out-of-process ("remote") plugins. We investigated whether we could bypass libnetwork (and thereby skip the issues above) and drive Docker remote plugins directly. Unfortunately, this would mean that we could not use any of the Docker in-process plugins, "bridge" and "overlay" in particular, which again eliminates much of the utility of libnetwork.   -->

與本地/全局拆分正交， Docker 具有進程內和進程外（ "remote" ）插件。我們調查了是否可以繞過 libnetwork （從而跳過上面的問題）並直接驅動 Docker remote 插件。不幸的是，這意味着我們無法使用任何 Docker 進程中的插件，特別是 "bridge" 和 "overlay"，這再次消除了 libnetwork 的大部分功能。

<!-- On the other hand, CNI is more philosophically aligned with Kubernetes. It's far simpler than CNM, doesn't require daemons, and is at least plausibly cross-platform (CoreOS’s [rkt](https://coreos.com/rkt/docs/) container runtime supports it). Being cross-platform means that there is a chance to enable network configurations which will work the same across runtimes (e.g. Docker, Rocket, Hyper). It follows the UNIX philosophy of doing one thing well.   -->

另一方面， CNI 在哲學上與 Kubernetes 更加一致。它比 CNM 簡單得多，不需要守護進程，並且至少有合理的跨平臺（ CoreOS 的 [rkt](https://coreos.com/rkt/docs/) 容器運行時支持它）。跨平臺意味着有機會啓用跨運行時（例如 Docker ， Rocket ， Hyper ）運行相同的網路設定。 它遵循 UNIX 的理念，即做好一件事。

<!-- Additionally, it's trivial to wrap a CNI plugin and produce a more customized CNI plugin — it can be done with a simple shell script. CNM is much more complex in this regard. This makes CNI an attractive option for rapid development and iteration. Early prototypes have proven that it's possible to eject almost 100% of the currently hard-coded network logic in kubelet into a plugin.   -->

此外，包裝 CNI 插件並生成更加個性化的 CNI 插件是微不足道的 - 它可以通過簡單的 shell 腳本完成。 CNM 在這方面要複雜得多。這使得 CNI 對於快速開發和迭代是有吸引力的選擇。早期的原型已經證明，可以將 kubelet 中幾乎 100％ 的當前硬編碼網路邏輯彈出到插件中。

<!-- We investigated [writing a "bridge" CNM driver](https://groups.google.com/forum/#!topic/kubernetes-sig-network/5MWRPxsURUw) for Docker that ran CNI drivers. This turned out to be very complicated. First, the CNM and CNI models are very different, so none of the "methods" lined up. We still have the global vs. local and key-value issues discussed above. Assuming this driver would declare itself local, we have to get info about logical networks from Kubernetes.   -->

我們調查了爲 Docker [編寫 "bridge" CNM驅動程式](https://groups.google.com/g/kubernetes-sig-network/c/5MWRPxsURUw) 並運行 CNI 驅動程式。事實證明這非常複雜。首先， CNM 和 CNI 模型非常不同，因此沒有一種“方法”協調一致。 我們仍然有上面討論的全球與本地和鍵值問題。假設這個驅動程式會聲明自己是本地的，我們必須從 Kubernetes 獲取有關邏輯網路的資訊。

<!-- Unfortunately, Docker drivers are hard to map to other control planes like Kubernetes. Specifically, drivers are not told the name of the network to which a container is being attached — just an ID that Docker allocates internally. This makes it hard for a driver to map back to any concept of network that exists in another system.   -->

不幸的是， Docker 驅動程式很難映射到像 Kubernetes 這樣的其他控制平面。具體來說，驅動程式不會被告知連接容器的網路名稱 - 只是 Docker 內部分配的 ID 。這使得驅動程式很難映射回另一個系統中存在的任何網路概念。

<!-- This and other issues have been brought up to Docker developers by network vendors, and are usually closed as "working as intended" ([libnetwork #139](https://github.com/docker/libnetwork/issues/139), [libnetwork #486](https://github.com/docker/libnetwork/issues/486), [libnetwork #514](https://github.com/docker/libnetwork/pull/514), [libnetwork #865](https://github.com/docker/libnetwork/issues/865), [docker #18864](https://github.com/docker/docker/issues/18864)), even though they make non-Docker third-party systems more difficult to integrate with. Throughout this investigation Docker has made it clear that they’re not very open to ideas that deviate from their current course or that delegate control. This is very worrisome to us, since Kubernetes complements Docker and adds so much functionality, but exists outside of Docker itself.   -->

這個問題和其他問題已由網路供應商提出給 Docker 開發人員，並且通常關閉爲“按預期工作”，([libnetwork #139](https://github.com/docker/libnetwork/issues/139), [libnetwork #486](https://github.com/docker/libnetwork/issues/486), [libnetwork #514](https://github.com/docker/libnetwork/pull/514), [libnetwork #865](https://github.com/docker/libnetwork/issues/865), [docker #18864](https://github.com/docker/docker/issues/18864))，即使它們使非 Docker 第三方系統更難以與之集成。在整個調查過程中， Docker 明確表示他們對偏離當前路線或委託控制的想法不太歡迎。這對我們來說非常令人擔憂，因爲 Kubernetes 補充了 Docker 並增加了很多功能，但它存在於 Docker 之外。

<!-- For all of these reasons we have chosen to invest in CNI as the Kubernetes plugin model. There will be some unfortunate side-effects of this. Most of them are relatively minor (for example, `docker inspect` will not show an IP address), but some are significant. In particular, containers started by `docker run` might not be able to communicate with containers started by Kubernetes, and network integrators will have to provide CNI drivers if they want to fully integrate with Kubernetes. On the other hand, Kubernetes will get simpler and more flexible, and a lot of the ugliness of early bootstrapping (such as configuring Docker to use our bridge) will go away.   -->

出於所有這些原因，我們選擇投資 CNI 作爲 Kubernetes 插件模型。這會有一些不幸的副作用。它們中的大多數都相對較小（例如， `docker inspect` 不會顯示 IP 地址），特別是由 `docker run` 啓動的容器可能無法與 Kubernetes 啓動的容器通信，如果網路集成商想要與 Kubernetes 完全集成，則必須提供 CNI 驅動程式。但另一方面， Kubernetes 將變得更簡單，更靈活，早期引入的許多醜陋的（例如設定 Docker 使用我們的網橋）將會消失。

<!-- As we proceed down this path, we’ll certainly keep our eyes and ears open for better ways to integrate and simplify. If you have thoughts on how we can do that, we really would like to hear them — find us on [slack](http://slack.k8s.io/) or on our [network SIG mailing-list](https://groups.google.com/forum/#!forum/kubernetes-sig-network).   -->

當我們沿着這條道路前進時，我們會保持開放，以便更好地整合和簡化。如果您對我們如何做到這一點有所想法，我們真的希望聽到它們 - 在 [slack](http://slack.k8s.io/) 或者 [network SIG mailing-list](https://groups.google.com/g/kubernetes-sig-network) 找到我們。

Tim Hockin, Software Engineer, Google
