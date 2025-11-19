---
layout: blog
title: "別慌: Kubernetes 和 Docker"
date: 2020-12-02
slug: dont-panic-kubernetes-and-docker
evergreen: true
---
<!-- 
layout: blog
title: "Don't Panic: Kubernetes and Docker"
date: 2020-12-02
slug: dont-panic-kubernetes-and-docker
evergreen: true
-->

**作者：** Jorge Castro, Duffie Cooley, Kat Cosgrove, Justin Garrison, Noah Kantrowitz, Bob Killen, Rey Lejano, Dan “POP” Papandrea, Jeffrey Sica, Davanum “Dims” Srinivas

<!--
**Update:** _Kubernetes support for Docker via `dockershim` is now removed.
For more information, read the [removal FAQ](/dockershim).
You can also discuss the deprecation via a dedicated [GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)._
-->
**更新**：Kubernetes 通過 `dockershim` 對 Docker 的支持現已移除。
有關更多信息，請閱讀[移除 FAQ](/zh-cn/dockershim)。
你還可以通過專門的 [GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917) 討論棄用。

<!-- 
Kubernetes is [deprecating
Docker](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)
as a container runtime after v1.20.
-->
Kubernetes 從版本 v1.20 之後，[棄用 Docker](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)
這個容器運行時。

<!-- 
**You do not need to panic. It’s not as dramatic as it sounds.**
-->
**不必慌張，這件事並沒有聽起來那麼嚇人。**

<!-- 
TL;DR Docker as an underlying runtime is being deprecated in favor of runtimes
that use the [Container Runtime Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)
created for Kubernetes. Docker-produced images will continue to work in your
cluster with all runtimes, as they always have.
-->
棄用 Docker 這個底層運行時，轉而支持符合爲 Kubernetes 創建的容器運行接口
[Container Runtime Interface (CRI)](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)
的運行時。
Docker 構建的鏡像，將在你的集羣的所有運行時中繼續工作，一如既往。

<!-- 
If you’re an end-user of Kubernetes, not a whole lot will be changing for you.
This doesn’t mean the death of Docker, and it doesn’t mean you can’t, or
shouldn’t, use Docker as a development tool anymore. Docker is still a useful
tool for building containers, and the images that result from running `docker
build` can still run in your Kubernetes cluster. 
--> 
如果你是 Kubernetes 的終端用戶，這對你不會有太大影響。
這事並不意味着 Docker 已死、也不意味着你不能或不該繼續把 Docker 用作開發工具。
Docker 仍然是構建容器的利器，使用命令 `docker build` 構建的鏡像在 Kubernetes 集羣中仍然可以運行。

<!-- 
If you’re using a managed Kubernetes service like AKS, EkS or GKE, you will need to
make sure your worker nodes are using a supported container runtime before
Docker support is removed in a future version of Kubernetes. If you have node
customizations you may need to update them based on your environment and runtime
requirements. Please work with your service provider to ensure proper upgrade
testing and planning. 
-->
如果你正在使用 GKE、EKS、或 AKS 這類託管 Kubernetes 服務，
你需要在 Kubernetes 後續版本移除對 Docker 支持之前，
確認工作節點使用了被支持的容器運行時。
如果你的節點被定製過，你可能需要根據你自己的環境和運行時需求更新它們。
請與你的服務供應商協作，確保做出適當的升級測試和計劃。

<!-- 
If you’re rolling your own clusters, you will also need to make changes to avoid
your clusters breaking. At v1.20, you will get a deprecation warning for Docker.
When Docker runtime support is removed in a future release (<del>currently planned
for the 1.22 release in late 2021</del>) of Kubernetes it will no longer be supported
and you will need to switch to one of the other compliant container runtimes,
like containerd or CRI-O. Just make sure that the runtime you choose supports
the docker daemon configurations you currently use (e.g. logging).
-->
如果你正在運營你自己的集羣，那還應該做些工作，以避免集羣中斷。
在 v1.20 版中，你僅會得到一個 Docker 的棄用警告。
當對 Docker 運行時的支持在 Kubernetes 某個後續發行版（<del>目前的計劃是 2021 年晚些時候的 1.22 版</del>）中被移除時，
你需要切換到 containerd 或 CRI-O 等兼容的容器運行時。
只要確保你選擇的運行時支持你當前使用的 Docker 守護進程配置（例如 logging）。

<!-- 
## So why the confusion and what is everyone freaking out about?
-->
## 那爲什麼會有這樣的困惑，爲什麼每個人要害怕呢？{#so-why-the-confusion-and-what-is-everyone-freaking-out-about}

<!-- 
We’re talking about two different environments here, and that’s creating
confusion. Inside of your Kubernetes cluster, there’s a thing called a container
runtime that’s responsible for pulling and running your container images. Docker
is a popular choice for that runtime (other common options include containerd
and CRI-O), but Docker was not designed to be embedded inside Kubernetes, and
that causes a problem. 
-->
我們在這裏討論的是兩套不同的環境，這就是造成困惑的根源。
在你的 Kubernetes 集羣中，有一個叫做容器運行時的東西，它負責拉取並運行容器鏡像。
Docker 對於運行時來說是一個流行的選擇（其他常見的選擇包括 containerd 和 CRI-O），
但 Docker 並非設計用來嵌入到 Kubernetes，這就是問題所在。

<!-- 
You see, the thing we call “Docker” isn’t actually one thing&mdash;it’s an entire
tech stack, and one part of it is a thing called “containerd,” which is a
high-level container runtime by itself. Docker is cool and useful because it has
a lot of UX enhancements that make it really easy for humans to interact with
while we’re doing development work, but those UX enhancements aren’t necessary
for Kubernetes, because it isn’t a human. 
-->
你看，我們稱之爲 “Docker” 的物件實際上並不是一個物件——它是一個完整的技術堆棧，
它其中一個叫做 “containerd” 的部件本身，纔是一個高級容器運行時。
Docker 既酷炫又實用，因爲它提供了很多用戶體驗增強功能，而這簡化了我們做開發工作時的操作，
Kubernetes 用不到這些增強的用戶體驗，畢竟它並非人類。

<!-- 
As a result of this human-friendly abstraction layer, your Kubernetes cluster
has to use another tool called Dockershim to get at what it really needs, which
is containerd. That’s not great, because it gives us another thing that has to
be maintained and can possibly break. What’s actually happening here is that
Dockershim is being removed from Kubelet as early as v1.23 release, which
removes support for Docker as a container runtime as a result. You might be
thinking to yourself, but if containerd is included in the Docker stack, why
does Kubernetes need the Dockershim?
-->
因爲這個用戶友好的抽象層，Kubernetes 集羣不得不引入一個叫做 Dockershim 的工具來訪問它真正需要的 containerd。
這不是一件好事，因爲這引入了額外的運維工作量，而且還可能出錯。
實際上正在發生的事情就是：Dockershim 將在不早於 v1.23 版中從 kubelet 中被移除，也就取消對 Docker 容器運行時的支持。
你心裏可能會想，如果 containerd 已經包含在 Docker 堆棧中，爲什麼 Kubernetes 需要 Dockershim。

<!-- 
Docker isn’t compliant with CRI, the [Container Runtime Interface](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/).
If it were, we wouldn’t need the shim, and this wouldn’t be a thing. But it’s
not the end of the world, and you don’t need to panic&mdash;you just need to change
your container runtime from Docker to another supported container runtime.
-->
Docker 不兼容 CRI，
[容器運行時接口](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)。
如果支持，我們就不需要這個 shim 了，也就沒問題了。
但這也不是世界末日，你也不需要恐慌——你唯一要做的就是把你的容器運行時從 Docker 切換到其他受支持的容器運行時。

<!-- 
One thing to note: If you are relying on the underlying docker socket
(`/var/run/docker.sock`) as part of a workflow within your cluster today, moving
to a different runtime will break your ability to use it. This pattern is often
called Docker in Docker. There are lots of options out there for this specific
use case including things like
[kaniko](https://github.com/GoogleContainerTools/kaniko),
[img](https://github.com/genuinetools/img), and
[buildah](https://github.com/containers/buildah). 
-->
要注意一點：如果你依賴底層的 Docker 套接字(`/var/run/docker.sock`)，作爲你集羣中工作流的一部分，
切換到不同的運行時會導致你無法使用它。
這種模式經常被稱之爲嵌套 Docker（Docker in Docker）。
對於這種特殊的場景，有很多選項，比如：
[kaniko](https://github.com/GoogleContainerTools/kaniko)、
[img](https://github.com/genuinetools/img)、和
[buildah](https://github.com/containers/buildah)。

<!-- 
## What does this change mean for developers, though? Do we still write Dockerfiles? Do we still build things with Docker?
-->
## 那麼，這一改變對開發人員意味着什麼？我們還要寫 Dockerfile 嗎？還能用 Docker 構建鏡像嗎？{#what-does-this-change-mean-for-developers}

<!-- 
This change addresses a different environment than most folks use to interact
with Docker. The Docker installation you’re using in development is unrelated to
the Docker runtime inside your Kubernetes cluster. It’s confusing, we understand.
As a developer, Docker is still useful to you in all the ways it was before this
change was announced. The image that Docker produces isn’t really a
Docker-specific image&mdash;it’s an OCI ([Open Container Initiative](https://opencontainers.org/)) image. 
Any OCI-compliant image, regardless of the tool you use to build it, will look
the same to Kubernetes. Both [containerd](https://containerd.io/) and
[CRI-O](https://cri-o.io/) know how to pull those images and run them. This is
why we have a standard for what containers should look like.
-->
此次改變帶來了一個不同的環境，這不同於我們常用的 Docker 交互方式。
你在開發環境中用的 Docker 和你 Kubernetes 集羣中的 Docker 運行時無關。
我們知道這聽起來讓人困惑。
對於開發人員，Docker 從所有角度來看仍然有用，就跟這次改變之前一樣。
Docker 構建的鏡像並不是 Docker 特有的鏡像——它是一個
OCI（[開放容器標準](https://opencontainers.org/)）鏡像。
任一 OCI 兼容的鏡像，不管它是用什麼工具構建的，在 Kubernetes 的角度來看都是一樣的。
[containerd](https://containerd.io/) 和
[CRI-O](https://cri-o.io/)
兩者都知道怎麼拉取並運行這些鏡像。
這就是我們制定容器標準的原因。

<!-- 
So, this change is coming. It’s going to cause issues for some, but it isn’t
catastrophic, and generally it’s a good thing. Depending on how you interact
with Kubernetes, this could mean nothing to you, or it could mean a bit of work.
In the long run, it’s going to make things easier. If this is still confusing
for you, that’s okay&mdash;there’s a lot going on here; Kubernetes has a lot of
moving parts, and nobody is an expert in 100% of it. We encourage any and all
questions regardless of experience level or complexity! Our goal is to make sure
everyone is educated as much as possible on the upcoming changes. We hope
this has answered most of your questions and soothed some anxieties! ❤️
-->
所以，改變已經發生。
它確實帶來了一些問題，但這不是一個災難，總的說來，這還是一件好事。
根據你操作 Kubernetes 的方式的不同，這可能對你不構成任何問題，或者也只是意味着一點點的工作量。
從一個長遠的角度看，它使得事情更簡單。
如果你還在困惑，也沒問題——這裏還有很多事情；
Kubernetes 有很多變化中的功能，沒有人是100%的專家。
我們鼓勵你提出任何問題，無論水平高低、問題難易。
我們的目標是確保所有人都能在即將到來的改變中獲得足夠的瞭解。
我們希望這已經回答了你的大部分問題，並緩解了一些焦慮！❤️

<!-- 
Looking for more answers? Check out our accompanying [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) _(updated February 2022)_.
-->
還在尋求更多答案嗎？請參考我們附帶的
[移除 Dockershim 的常見問題](/zh-cn/blog/2020/12/02/dockershim-faq/) _(2022年2月更新)_。
