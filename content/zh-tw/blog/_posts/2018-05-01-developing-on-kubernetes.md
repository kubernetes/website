---
title: 在 Kubernetes 上開發
date: 2018-05-01
slug: developing-on-kubernetes
---

<!--
---
title: Developing on Kubernetes
date: 2018-05-01
slug: developing-on-kubernetes
---
-->

<!--
**Authors**: [Michael Hausenblas](https://twitter.com/mhausenblas) (Red Hat), [Ilya Dmitrichenko](https://twitter.com/errordeveloper) (Weaveworks)
-->
**作者**： [Michael Hausenblas](https://twitter.com/mhausenblas) (Red Hat), [Ilya Dmitrichenko](https://twitter.com/errordeveloper) (Weaveworks)

<!-- 
How do you develop a Kubernetes app? That is, how do you write and test an app that is supposed to run on Kubernetes? This article focuses on the challenges, tools and methods you might want to be aware of to successfully write Kubernetes apps alone or in a team setting.
-->

您將如何開發一個 Kubernetes 應用？也就是說，您如何編寫並測試一個要在 Kubernetes 上執行的應用程式？本文將重點介紹在獨自開發或者團隊協作中，您可能希望瞭解到的為了成功編寫 Kubernetes 應用程式而需面臨的挑戰，工具和方法。

<!--
We’re assuming you are a developer, you have a favorite programming language, editor/IDE, and a testing framework available. The overarching goal is to introduce minimal changes to your current workflow when developing the app for Kubernetes. For example, if you’re a Node.js developer and are used to a hot-reload setup—that is, on save in your editor the running app gets automagically updated—then dealing with containers and container images, with container registries, Kubernetes deployments, triggers, and more can not only be overwhelming but really take all the fun out if it.
-->

我們假定您是一位開發人員，有您鍾愛的程式語言，編輯器/IDE（整合開發環境），以及可用的測試框架。在針對 Kubernetes 開發應用時，最重要的目標是減少對當前工作流程的影響，改變越少越好，儘量做到最小。舉個例子，如果您是 Node.js 開發人員，習慣於那種熱過載的環境 - 也就是說您在編輯器裡一做儲存，正在執行的程式就會自動更新 - 那麼跟容器、容器映象或者映象倉庫打交道，又或是跟 Kubernetes 部署、triggers 以及更多頭疼東西打交道，不僅會讓人難以招架也真的會讓開發過程完全失去樂趣。

<!--
In the following, we’ll first discuss the overall development setup, then review tools of the trade, and last but not least do a hands-on walkthrough of three exemplary tools that allow for iterative, local app development against Kubernetes.
-->

在下文中，我們將首先討論 Kubernetes 總體開發環境，然後回顧常用工具，最後進行三個示例性工具的實踐演練。這些工具允許針對 Kubernetes 進行本地應用程式的開發和迭代。

<!--
## Where to run your cluster?
-->

## 您的叢集執行在哪裡？

<!--
As a developer you want to think about where the Kubernetes cluster you’re developing against runs as well as where the development environment sits. Conceptually there are four development modes:
-->

作為開發人員，您既需要考慮所針對開發的 Kubernetes 叢集執行在哪裡，也需要思考開發環境如何配置。概念上，有四種開發模式：

![Dev Modes](/images/blog/2018-05-01-developing-on-kubernetes/dok-devmodes_preview.png)

<!--
A number of tools support pure offline development including Minikube, Docker for Mac/Windows, Minishift, and the ones we discuss in detail below. Sometimes, for example, in a microservices setup where certain microservices already run in the cluster, a proxied setup (forwarding traffic into and from the cluster) is preferable and Telepresence is an example tool in this category. The live mode essentially means you’re building and/or deploying against a remote cluster and, finally, the pure online mode means both your development environment and the cluster are remote, as this is the case with, for example, [Eclipse Che](https://www.eclipse.org/che/docs/che-7/introduction-to-eclipse-che/) or [Cloud 9](https://github.com/errordeveloper/k9c). Let’s now have a closer look at the basics of offline development: running Kubernetes locally.
-->

許多工具支援純 offline 開發，包括 Minikube、Docker（Mac 版/Windows 版）、Minishift 以及下文中我們將詳細討論的幾種。有時，比如說在一個微服務系統中，已經有若干微服務在執行，proxied 模式（透過轉發把資料流傳進傳出叢集）就非常合適，Telepresence 就是此類工具的一個例項。live 模式，本質上是您基於一個遠端叢集進行構建和部署。最後，純 online 模式意味著您的開發環境和執行叢集都是遠端的，典型的例子是 [Eclipse Che](https://www.eclipse.org/che/docs/che-7/introduction-to-eclipse-che/) 或者 [Cloud 9](https://github.com/errordeveloper/k9c)。現在讓我們仔細看看離線開發的基礎：在本地執行 Kubernetes。

<!--
[Minikube](/docs/getting-started-guides/minikube/) is a popular choice for those who prefer to run Kubernetes in a local VM. More recently Docker for [Mac](https://docs.docker.com/docker-for-mac/kubernetes/) and [Windows](https://docs.docker.com/docker-for-windows/kubernetes/) started shipping Kubernetes as an experimental package (in the “edge” channel). Some reasons why you may want to prefer using Minikube over the Docker desktop option are:
-->

[Minikube](/docs/getting-started-guides/minikube/) 在更加喜歡於本地 VM 上執行 Kubernetes 的開發人員中，非常受歡迎。不久前，Docker 的 [Mac](https://docs.docker.com/docker-for-mac/kubernetes/) 版和 [Windows](https://docs.docker.com/docker-for-windows/kubernetes/) 版，都試驗性地開始自帶 Kubernetes（需要下載 “edge” 安裝包）。在兩者之間，以下原因也許會促使您選擇 Minikube 而不是 Docker 桌面版：

<!--
* You already have Minikube installed and running
* You prefer to wait until Docker ships a stable package
* You’re a Linux desktop user
* You are a Windows user who doesn’t have Windows 10 Pro with Hyper-V
-->

* 您已經安裝了 Minikube 並且它執行良好
* 您想等到 Docker 出穩定版本
* 您是 Linux 桌面使用者
* 您是 Windows 使用者，但是沒有配有 Hyper-V 的 Windows 10 Pro

<!--
Running a local cluster allows folks to work offline and that you don’t have to pay for using cloud resources. Cloud provider costs are often rather affordable and free tiers exists, however some folks prefer to avoid having to approve those costs with their manager as well as potentially incur unexpected costs, for example, when leaving cluster running over the weekend.
-->

執行一個本地叢集，開發人員可以離線工作，不用支付雲服務。雲服務收費一般不會太高，並且免費的等級也有，但是一些開發人員不喜歡為了使用雲服務而必須得到經理的批准，也不願意支付意想不到的費用，比如說忘了下線而叢集在週末也在運轉。

<!--
Some developers prefer to use a remote Kubernetes cluster, and this is usually to allow for larger compute and storage capacity and also enable collaborative workflows more easily. This means it’s easier for you to pull in a colleague to help with debugging or share access to an app in the team. Additionally, for some developers it can be critical to mirror production environment as closely as possible, especially when it comes down to external cloud services, say,  proprietary databases, object stores, message queues, external load balancer, or mail delivery systems.
-->

有些開發人員卻更喜歡遠端的 Kubernetes 叢集，這樣他們通常可以獲得更大的計算能力和儲存容量，也簡化了協同工作流程。您可以更容易的拉上一個同事來幫您除錯，或者在團隊內共享一個應用的使用。再者，對某些開發人員來說，儘可能的讓開發環境類似生產環境至關重要，尤其是您依賴外部廠商的雲服務時，如：專有資料庫、雲物件儲存、訊息佇列、外商的負載均衡器或者郵件投遞系統。

<!--
In summary, there are good reasons for you to develop against a local cluster as well as a remote one. It very much depends on in which phase you are: from early prototyping and/or developing alone to integrating a set of more stable microservices.
-->

總之，無論您選擇本地或者遠端叢集，理由都足夠多。這很大程度上取決於您所處的階段：從早期的原型設計/單人開發到後期面對一批穩定微服務的整合。

<!--
Now that you have a basic idea of the options around the runtime environment, let’s move on to how to iteratively develop and deploy your app.
-->

既然您已經瞭解到執行環境的基本選項，那麼我們就接著討論如何迭代式的開發並部署您的應用。

<!--
## The tools of the trade
-->

## 常用工具

<!--
We are now going to review tooling allowing you to develop apps on Kubernetes with the focus on having minimal impact on your existing workflow. We strive to provide an unbiased description including implications of using each of the tools in general terms.
-->

我們現在回顧既可以允許您可以在 Kubernetes 上開發應用程式又儘可能最小地改變您現有的工作流程的一些工具。我們致力於提供一份不偏不倚的描述，也會提及使用某個工具將會意味著什麼。

<!--
Note that this is a tricky area since even for established technologies such as, for example, JSON vs YAML vs XML or REST vs gRPC vs SOAP a lot depends on your background, your preferences and organizational settings. It’s even harder to compare tooling in the Kubernetes ecosystem as things evolve very rapidly and new tools are announced almost on a weekly basis; during the preparation of this post alone, for example, [Gitkube](https://gitkube.sh/) and [Watchpod](https://github.com/MinikubeAddon/watchpod) came out. To cover these new tools as well as related, existing tooling such as [Weave Flux](https://github.com/weaveworks/flux) and OpenShift’s [S2I](https://docs.openshift.com/container-platform/3.9/creating_images/s2i.html) we are planning a follow-up blog post to the one you’re reading.
-->

請注意這很棘手，因為即使在成熟定型的技術中做選擇，比如說在 JSON、YAML、XML、REST、gRPC 或者 SOAP 之間做選擇，很大程度也取決於您的背景、喜好以及公司環境。在 Kubernetes 生態系統內比較各種工具就更加困難，因為技術發展太快，幾乎每週都有新工具面市；舉個例子，僅在準備這篇部落格的期間，[Gitkube](https://gitkube.sh/) 和 [Watchpod](https://github.com/MinikubeAddon/watchpod) 相繼出品。為了進一步覆蓋到這些新的，以及一些相關的已推出的工具，例如 [Weave Flux](https://github.com/weaveworks/flux) 和 OpenShift 的 [S2I](https://docs.openshift.com/container-platform/3.9/creating_images/s2i.html)，我們計劃再寫一篇跟進的部落格。

### Draft


<!--
[Draft](https://github.com/Azure/draft) aims to help you get started deploying any app to Kubernetes. It is capable of applying heuristics as to what programming language your app is written in and generates a Dockerfile along with a Helm chart. It then runs the build for you and deploys resulting image to the target cluster via the Helm chart. It also allows user to setup port forwarding to localhost very easily.
-->

[Draft](https://github.com/Azure/draft) 旨在幫助您將任何應用程式部署到 Kubernetes。它能夠檢測到您的應用所使用的程式語言，並且生成一份 Dockerfile 和 Helm 圖表。然後它替您啟動構建並且依照 Helm 圖表把所生產的映象部署到目標叢集。它也可以讓您很容易地設定到 localhost 的埠對映。

<!--
Implications:
-->

這意味著：

<!--
* User can customise the chart and Dockerfile templates however they like, or even create a [custom pack](https://github.com/Azure/draft/blob/master/docs/reference/dep-003.md) (with Dockerfile, the chart and more) for future use
-->
* 使用者可以任意地自定義 Helm 圖表和 Dockerfile 模版，或者甚至建立一個 [custom pack](https://github.com/Azure/draft/blob/master/docs/reference/dep-003.md)（使用 Dockerfile、Helm 圖表以及其他）以備後用

<!--
* It’s not very simple to guess how just any app is supposed to be built, in some cases user may need to tweak Dockerfile and the Helm chart that Draft generates
-->
* 要想理解一個應用應該怎麼構建並不容易，在某些情況下，使用者也許需要修改 Draft 生成的 Dockerfile 和 Heml 圖表

<!--
* With [Draft version 0.12.0](https://github.com/Azure/draft/releases/tag/v0.12.0) or older, every time user wants to test a change, they need to wait for Draft to copy the code to the cluster, then run the build, push the image and release updated chart; this can timely, but it results in an image being for every single change made by the user (whether it was committed to git or not)
-->
* 如果使用 [Draft version 0.12.0](https://github.com/Azure/draft/releases/tag/v0.12.0)<sup>1</sup> 或者更老版本，每一次使用者想要測試一個改動，他們需要等 Draft 把程式碼複製到叢集，執行構建，推送映象並且釋出更新後的圖表；這些步驟可能進行得很快，但是每一次使用者的改動都會產生一個映象（無論是否提交到 git ）

<!--
* As of Draft version 0.12.0, builds are executed locally
* User doesn’t have an option to choose something other than Helm for deployment
* It can watch local changes and trigger deployments, but this feature is not enabled by default
-->
* 在 Draft 0.12.0版本，構建是本地進行的
* 使用者不能選擇 Helm 以外的工具進行部署
* 它可以監控本地的改動並且觸發部署，但是這個功能預設是關閉的

<!--
* It allows developer to use either local or remote Kubernetes cluster
* Deploying to production is up to the user, Draft authors recommend their other project – Brigade
* Can be used instead of Skaffold, and along the side of Squash
-->
* 它允許開發人員使用本地或者遠端的 Kubernetes 叢集
* 如何部署到生產環境取決於使用者， Draft 的作者推薦了他們的另一個專案 - Brigade
* 可以代替 Skaffold， 並且可以和 Squash 一起使用

<!--
More info:
-->

更多資訊：

* [Draft: Kubernetes container development made easy](https://kubernetes.io/blog/2017/05/draft-kubernetes-container-development)
* [Getting Started Guide](https://github.com/Azure/draft/blob/master/docs/getting-started.md)

【1】：此處疑為 0.11.0，因為 0.12.0 已經支援本地構建，見下一條

### Skaffold

<!--
[Skaffold](https://github.com/GoogleCloudPlatform/skaffold) is a tool that aims to provide portability for CI integrations with different build system, image registry and deployment tools. It is different from Draft, yet somewhat comparable. It has a basic capability for generating manifests, but it’s not a prominent feature. Skaffold is extendible and lets user pick tools for use in each of the steps in building and deploying their app.
-->

[Skaffold](https://github.com/GoogleCloudPlatform/skaffold) 讓 CI 整合具有可移植性的，它允許使用者採用不同的構建系統，映象倉庫和部署工具。它不同於 Draft，同時也具有一定的可比性。它具有生成系統清單的基本能力，但那不是一個重要功能。Skaffold 易於擴充套件，允許使用者在構建和部署應用的每一步選取相應的工具。

<!--
Implications:
-->

這意味著：

<!--
* Modular by design
* Works independently of CI vendor, user doesn’t need Docker or Kubernetes plugin
* Works without CI as such, i.e. from the developer’s laptop
* It can watch local changes and trigger deployments
-->
* 模組化設計
* 不依賴於 CI，使用者不需要 Docker 或者 Kubernetes 外掛
* 沒有 CI 也可以工作，也就是說，可以在開發人員的電腦上工作
* 它可以監控本地的改動並且觸發部署

<!--
* It allows developer to use either local or remote Kubernetes cluster
* It can be used to deploy to production, user can configure how exactly they prefer to do it and provide different kind of pipeline for each target environment
* Can be used instead of Draft, and along the side with most other tools
-->
* 它允許開發人員使用本地或者遠端的 Kubernetes 叢集
* 它可以用於部署生產環境，使用者可以精確配置，也可以為每一套目標環境提供不同的生產線
* 可以代替 Draft，並且和其他工具一起使用

<!--
More info:
-->

更多資訊：

* [Introducing Skaffold: Easy and repeatable Kubernetes development](https://cloudplatform.googleblog.com/2018/03/introducing-Skaffold-Easy-and-repeatable-Kubernetes-development.html)
* [Getting Started Guide](https://github.com/GoogleCloudPlatform/skaffold#getting-started-with-local-tooling)

### Squash

<!--
[Squash](https://github.com/solo-io/squash) consists of a debug server that is fully integrated with Kubernetes, and a IDE plugin. It allows you to insert breakpoints and do all the fun stuff you are used to doing when debugging an application using an IDE. It bridges IDE debugging experience with your Kubernetes cluster by allowing you to attach the debugger to a pod running in your Kubernetes cluster.
-->
[Squash](https://github.com/solo-io/squash) 包含一個與 Kubernetes 全面整合的除錯伺服器，以及一個 IDE 外掛。它允許您插入斷點和所有的除錯操作，就像您所習慣的使用 IDE 除錯一個程式一般。它允許您將偵錯程式應用到 Kubernetes 叢集中執行的 pod 上，從而讓您可以使用 IDE 除錯 Kubernetes 叢集。

<!--
Implications:
-->

這意味著：

<!--
* Can be used independently of other tools you chose
* Requires a privileged DaemonSet
* Integrates with popular IDEs
* Supports Go, Python, Node.js, Java and gdb
-->
* 不依賴您選擇的其它工具
* 需要一組特權 DaemonSet
* 可以和流行 IDE 整合
* 支援 Go、Python、Node.js、Java 和 gdb

<!--
* User must ensure application binaries inside the container image are compiled with debug symbols
* Can be used in combination with any other tools described here
* It can be used with either local or remote Kubernetes cluster
-->
* 使用者必須確保容器中的應用程式使編譯時使用了除錯符號
* 可與此處描述的任何其他工具結合使用
* 它可以與本地或遠端 Kubernetes 叢集一起使用

<!--
More info:
-->

更多資訊：

* [Squash: A Debugger for Kubernetes Apps](https://www.youtube.com/watch?v=5TrV3qzXlgI)
* [Getting Started Guide](https://squash.solo.io/overview/)

### Telepresence

<!--
[Telepresence](https://www.telepresence.io/) connects containers running on developer’s workstation with a remote Kubernetes cluster using a two-way proxy and emulates in-cluster environment as well as provides access to config maps and secrets. It aims to improve iteration time for container app development by eliminating the need for deploying app to the cluster and leverages local container to abstract network and filesystem interface in order to make it appear as if the app was running in the cluster.
-->
[Telepresence](https://www.telepresence.io/) 使用雙向代理將開發人員工作站上執行的容器與遠端 Kubernetes 叢集連線起來，並模擬叢集內環境以及提供對配置對映和機密的訪問。它消除了將應用部署到叢集的需要，並利用本地容器抽象出網路和檔案系統介面，以使其看起來應用好像就在叢集中執行，從而改進容器應用程式開發的迭代時間。

<!--
Implications:
-->

這意味著：

<!--
* It can be used independently of other tools you chose
* Using together with Squash is possible, although Squash would have to be used for pods in the cluster, while conventional/local debugger would need to be used for debugging local container that’s connected to the cluster via Telepresence
* Telepresence imposes some network latency
-->
* 它不依賴於其它您選取的工具
* 可以同 Squash 一起使用，但是 Squash 必須用於除錯叢集中的 pods，而傳統/本地偵錯程式需要用於除錯透過 Telepresence 連線到叢集的本地容器
* Telepresence 會產生一些網路延遲

<!--
* It provides connectivity via a side-car process - sshuttle, which is based on SSH
* More intrusive dependency injection mode with LD_PRELOAD/DYLD_INSERT_LIBRARIES is also available
* It is most commonly used with a remote Kubernetes cluster, but can be used with a local one also
-->
* 它透過輔助程序提供連線 -  sshuttle，基於SSH的一個工具
* 還提供了使用 LD_PRELOAD/DYLD_INSERT_LIBRARIES 的更具侵入性的依賴注入模式
* 它最常用於遠端 Kubernetes 叢集，但也可以與本地叢集一起使用

<!--
More info:
-->

更多資訊：

* [Telepresence: fast, realistic local development for Kubernetes microservices](https://www.telepresence.io/)
* [Getting Started Guide](https://www.telepresence.io/tutorials/docker)
* [How It Works](https://www.telepresence.io/discussion/how-it-works)

### Ksync

<!--
[Ksync](https://github.com/vapor-ware/ksync) synchronizes application code (and configuration) between your local machine and the container running in Kubernetes, akin to what [oc rsync](https://docs.openshift.com/container-platform/3.9/dev_guide/copy_files_to_container.html) does in OpenShift. It aims to improve iteration time for app development by eliminating build and deployment steps.
-->


[Ksync](https://github.com/vapor-ware/ksync) 在本地計算機和執行在 Kubernetes 中的容器之間同步應用程式程式碼（和配置），類似於 [oc rsync](https://docs.openshift.com/container-platform/3.9/dev_guide/copy_files_to_container.html) 在 OpenShift 中的角色。它旨在透過消除構建和部署步驟來縮短應用程式開發的迭代時間。


<!--
Implications:
-->

這意味著：

<!--
* It bypasses container image build and revision control
* Compiled language users have to run builds inside the pod (TBC)
* Two-way sync – remote files are copied to local directory
* Container is restarted each time remote filesystem is updated
* No security features – development only
-->
* 它繞過容器影象構建和修訂控制
* 使用編譯語言的使用者必須在 pod（TBC）內執行構建
* 雙向同步 - 遠端檔案會複製到本地目錄
* 每次更新遠端檔案系統時都會重啟容器
* 無安全功能 - 僅限開發

<!--
* Utilizes [Syncthing](https://github.com/syncthing/syncthing), a Go library for peer-to-peer sync
* Requires a privileged DaemonSet running in the cluster
* Node has to use Docker with overlayfs2 – no other CRI implementations are supported at the time of writing
-->
* 使用 [Syncthing](https://github.com/syncthing/syncthing)，一個用於點對點同步的 Go 語言庫
* 需要一個在叢集中執行的特權 DaemonSet
* Node 必須使用帶有 overlayfs2 的 Docker  - 在寫作本文時，尚不支援其他 CRI 實現

<!--
More info:
-->

更多資訊：

* [Getting Started Guide](https://github.com/vapor-ware/ksync#getting-started)
* [How It Works](https://github.com/vapor-ware/ksync/blob/master/docs/architecture.md)
* [Katacoda scenario to try out ksync in your browser](https://www.katacoda.com/vaporio/scenarios/ksync)
* [Syncthing Specification](https://docs.syncthing.net/specs/)

<!--
## Hands-on walkthroughs
-->

## 實踐演練


<!--
The app we will be using for the hands-on walkthroughs of the tools in the following is a simple [stock market simulator](https://github.com/kubernauts/dok-example-us), consisting of two microservices:
-->

我們接下來用於練習使用工具的應用是一個簡單的[股市模擬器](https://github.com/kubernauts/dok-example-us)，包含兩個微服務：

<!--
* The `stock-gen` microservice is written in Go and generates stock data randomly and exposes it via HTTP endpoint `/stockdata`.
‎* A second microservice, `stock-con` is a Node.js app that consumes the stream of stock data from `stock-gen` and provides an aggregation in form of a moving average via the HTTP endpoint `/average/$SYMBOL` as well as a health-check endpoint at `/healthz`.
-->

* `stock-gen`（股市資料生成器）微服務是用 Go 編寫的，隨機生成股票資料並透過 HTTP 端點 `/ stockdata` 公開
* 第二個微服務，`stock-con`（股市資料消費者）是一個 Node.js 應用程式，它使用來自 `stock-gen` 的股票資料流，並透過 HTTP 端點 `/average/$SYMBOL` 提供股價移動平均線，也提供一個健康檢查端點 `/healthz`。

<!--
Overall, the default setup of the app looks as follows:
-->

總體上，此應用的預設配置如下圖所示：

![Default Setup](/images/blog/2018-05-01-developing-on-kubernetes/dok-architecture_preview.png)

<!--
In the following we’ll do a hands-on walkthrough for a representative selection of tools discussed above: ksync, Minikube with local build, as well as Skaffold. For each of the tools we do the following:
-->

在下文中，我們將選取以上討論的代表性工具進行實踐演練：ksync，具有本地構建的 Minikube 以及 Skaffold。對於每個工具，我們執行以下操作：

<!--
* Set up the respective tool incl. preparations for the deployment and local consumption of the `stock-con` microservice.
* Perform a code update, that is, change the source code of the `/healthz` endpoint in the `stock-con` microservice and observe the updates.
-->

* 設定相應的工具，包括部署準備和 `stock-con` 微服務資料的本地讀取
* 執行程式碼更新，即更改 `stock-con` 微服務的 `/healthz` 端點的原始碼並觀察網頁重新整理

<!--
Note that for the target Kubernetes cluster we’ve been using Minikube locally, but you can also a remote cluster for ksync and Skaffold if you want to follow along.
-->

請注意，我們一直使用 Minikube 的本地 Kubernetes 叢集，但是您也可以使用 ksync 和 Skaffold 的遠端叢集跟隨練習。

<!--
## Walkthrough: ksync
-->

## 實踐演練：ksync

<!--
As a preparation, install [ksync](https://vapor-ware.github.io/ksync/#installation) and then carry out the following steps to prepare the development setup:
-->

作為準備，安裝 [ksync](https://vapor-ware.github.io/ksync/#installation)，然後執行以下步驟配置開發環境：

```
$ mkdir -p $(pwd)/ksync
$ kubectl create namespace dok
$ ksync init -n dok
```
<!--
With the basic setup completed we're ready to tell ksync’s local client to watch a certain Kubernetes namespace and then we create a spec to define what we want to sync (the directory `$(pwd)/ksync` locally with `/app` in the container). Note that target pod is specified via the selector parameter:
-->


完成基本設定後，我們可以告訴 ksync 的本地客戶端監控 Kubernetes 的某個名稱空間，然後我們建立一個規範來定義我們想要同步的資料夾（本地的 `$(pwd)/ksync` 和容器中的 `/ app` ）。請注意，目標 pod 是用 selector 引數指定：

```
$ ksync watch -n dok
$ ksync create -n dok --selector=app=stock-con $(pwd)/ksync /app
$ ksync get -n dok
```

<!--
Now we deploy the stock generator and the stock consumer microservice:
-->

現在我們部署股價資料生成器和股價資料消費者微服務：

```
$ kubectl -n=dok apply \
      -f https://raw.githubusercontent.com/kubernauts/dok-example-us/master/stock-gen/app.yaml
$ kubectl -n=dok apply \
      -f https://raw.githubusercontent.com/kubernauts/dok-example-us/master/stock-con/app.yaml
```
<!--
Once both deployments are created and the pods are running, we forward the `stock-con` service for local consumption (in a separate terminal session):
-->


一旦兩個部署建好並且 pod 開始執行，我們轉發 `stock-con` 服務以供本地讀取（另開一個終端視窗）：

```
$ kubectl get -n dok po --selector=app=stock-con  \
                     -o=custom-columns=:metadata.name --no-headers |  \
                     xargs -IPOD kubectl -n dok port-forward POD 9898:9898
```
<!--
With that we should be able to consume the `stock-con` service from our local machine; we do this by regularly checking the response of the `healthz` endpoint like so (in a separate terminal session):
-->


這樣，透過定期查詢 `healthz` 端點，我們就應該能夠從本地機器上讀取 `stock-con` 服務，查詢命令如下（在一個單獨的終端視窗）：

```
$ watch curl localhost:9898/healthz
```
<!--
Now change the code in the `ksync/stock-con`directory, for example update the [`/healthz` endpoint code in `service.js`](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52) by adding a field to the JSON response and observe how the pod gets updated and the response of the `curl localhost:9898/healthz` command changes. Overall you should have something like the following in the end:
-->


現在，改動 `ksync/stock-con` 目錄中的程式碼，例如改動 [`service.js` 中定義的 `/healthz` 端點程式碼](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52)，在其 JSON 形式的響應中新添一個欄位並觀察 pod 如何更新以及 `curl localhost：9898/healthz` 命令的輸出發生何種變化。總的來說，您最後應該看到類似的內容：


![Preview](/images/blog/2018-05-01-developing-on-kubernetes/dok-ksync_preview.png)


<!--
### Walkthrough: Minikube with local build
-->

### 實踐演練：帶本地構建的 Minikube

<!--
For the following you will need to have Minikube up and running and we will leverage the Minikube-internal Docker daemon for building images, locally. As a preparation, do the following
-->


對於以下內容，您需要啟動並執行 Minikube，我們將利用 Minikube 自帶的 Docker daemon 在本地構建映象。作為準備，請執行以下操作

```
$ git clone https://github.com/kubernauts/dok-example-us.git && cd dok-example-us
$ eval $(minikube docker-env)
$ kubectl create namespace dok
```

<!--
Now we deploy the stock generator and the stock consumer microservice:
-->

現在我們部署股價資料生成器和股價資料消費者微服務：


```
$ kubectl -n=dok apply -f stock-gen/app.yaml
$ kubectl -n=dok apply -f stock-con/app.yaml
```
<!--
Once both deployments are created and the pods are running, we forward the `stock-con` service for local consumption (in a separate terminal session) and check the response of the `healthz` endpoint:
-->


一旦兩個部署建好並且 pod 開始執行，我們轉發 `stock-con` 服務以供本地讀取（另開一個終端視窗）並檢查 `healthz` 端點的響應：

```
$ kubectl get -n dok po --selector=app=stock-con  \
                     -o=custom-columns=:metadata.name --no-headers |  \
                     xargs -IPOD kubectl -n dok port-forward POD 9898:9898 &
$ watch curl localhost:9898/healthz
```
<!--
Now change the code in the `stock-con`directory, for example, update the [`/healthz` endpoint code in `service.js`](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52) by adding a field to the JSON response. Once you’re done with your code update, the last step is to build a new container image and kick off a new deployment like shown below:
-->

現在，改一下 `ksync/stock-con` 目錄中的程式碼，例如修改 [`service.js` 中定義的 `/healthz` 端點程式碼](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52)，在其 JSON 形式的響應中新增一個欄位。在您更新完程式碼後，最後一步是構建新的容器映象並啟動新部署，如下所示：


```
$ docker build -t stock-con:dev -f Dockerfile .
$ kubectl -n dok set image deployment/stock-con *=stock-con:dev
```
<!--
Overall you should have something like the following in the end:
-->

總的來說，您最後應該看到類似的內容：

![Local Preview](/images/blog/2018-05-01-developing-on-kubernetes/dok-minikube-localdev_preview.png)

<!--
### Walkthrough: Skaffold
-->

### 實踐演練：Skaffold

<!--
To perform this walkthrough you first need to install [Skaffold](https://github.com/GoogleContainerTools/skaffold#installation). Once that is done, you can do the following steps to prepare the development setup:
-->

要進行此演練，首先需要安裝 [Skaffold](https://github.com/GoogleContainerTools/skaffold#installation)。完成後，您可以執行以下步驟來配置開發環境：

```
$ git clone https://github.com/kubernauts/dok-example-us.git && cd dok-example-us
$ kubectl create namespace dok
```
<!--
Now we deploy the stock generator (but not the stock consumer microservice, that is done via Skaffold):
-->

現在我們部署股價資料生成器（但是暫不部署股價資料消費者，此服務將使用 Skaffold 完成）：

```
$ kubectl -n=dok apply -f stock-gen/app.yaml
```

<!--
Note that initially we experienced an authentication error when doing `skaffold dev` and needed to apply a fix as described in [Issue 322](https://github.com/GoogleContainerTools/skaffold/issues/322). Essentially it means changing the content of `~/.docker/config.json` to:
-->


請注意，最初我們在執行 `skaffold dev` 時發生身份驗證錯誤，為避免此錯誤需要安裝[問題322](https://github.com/GoogleContainerTools/skaffold/issues/322) 中所述的修復。本質上，需要將 `〜/.docker/config.json` 的內容改為：


```
{
   "auths": {}
}
```

<!--
Next, we had to patch `stock-con/app.yaml` slightly to make it work with Skaffold:
-->

接下來，我們需要略微改動 `stock-con/app.yaml`，這樣 Skaffold 才能正常使用此檔案：

<!--
Add a `namespace` field to both the `stock-con` deployment and the service with the value of `dok`.
Change the `image` field of the container spec to `quay.io/mhausenblas/stock-con` since Skaffold manages the container image tag on the fly.
-->

在 `stock-con` 部署和服務中新增一個 `namespace` 欄位，其值為 `dok`

將容器規範的 `image` 欄位更改為 `quay.io/mhausenblas/stock-con`，因為 Skaffold 可以即時管理容器映象標籤。

<!--
 The resulting `app.yaml` file stock-con looks as follows:
 -->
最終的 stock-con 的 `app.yaml` 檔案看起來如下：


```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  labels:
    app: stock-con
  name: stock-con
  namespace: dok
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: stock-con
    spec:
      containers:
      - name: stock-con
        image: quay.io/mhausenblas/stock-con
        env:
        - name: DOK_STOCKGEN_HOSTNAME
          value: stock-gen
        - name: DOK_STOCKGEN_PORT
          value: "9999"
        ports:
        - containerPort: 9898
          protocol: TCP
        livenessProbe:
          initialDelaySeconds: 2
          periodSeconds: 5
          httpGet:
            path: /healthz
            port: 9898
        readinessProbe:
          initialDelaySeconds: 2
          periodSeconds: 5
          httpGet:
            path: /healthz
            port: 9898
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: stock-con
  name: stock-con
  namespace: dok
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 9898
  selector:
    app: stock-con
```
<!--
The final step before we can start development is to configure Skaffold. So, create a file `skaffold.yaml` in the `stock-con/` directory with the following content:
 -->

我們能夠開始開發之前的最後一步是配置 Skaffold。因此，在 `stock-con/` 目錄中建立檔案 `skaffold.yaml`，其中包含以下內容：

```
apiVersion: skaffold/v1alpha2
kind: Config
build:
  artifacts:
  - imageName: quay.io/mhausenblas/stock-con
    workspace: .
    docker: {}
  local: {}
deploy:
  kubectl:
    manifests:
      - app.yaml
```
<!--
Now we’re ready to kick off the development. For that execute the following in the `stock-con/` directory:
 -->

現在我們準備好開始開發了。為此，在 `stock-con/` 目錄中執行以下命令：

```
$ skaffold dev
```
<!--
Above command triggers a build of the `stock-con` image and then a deployment. Once the pod of the `stock-con` deployment is running, we again forward the `stock-con` service for local consumption (in a separate terminal session) and check the response of the `healthz` endpoint:
 -->


上面的命令將觸發 `stock-con` 影象的構建和部署。一旦 `stock-con` 部署的 pod 開始執行，我們再次轉發 `stock-con` 服務以供本地讀取（在單獨的終端視窗中）並檢查 `healthz` 端點的響應：

```bash
$ kubectl get -n dok po --selector=app=stock-con  \
                     -o=custom-columns=:metadata.name --no-headers |  \
                     xargs -IPOD kubectl -n dok port-forward POD 9898:9898 &
$ watch curl localhost:9898/healthz
```
<!--
If you now change the code in the `stock-con`directory, for example, by updating the [`/healthz` endpoint code in `service.js`](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52) by adding a field to the JSON response, you should see Skaffold noticing the change and create a new image as well as deploy it. The resulting screen would look something like this:
 -->
 
現在，如果您修改一下 `stock-con` 目錄中的程式碼，例如 [`service.js` 中定義的 `/healthz` 端點程式碼](https://github.com/kubernauts/dok-example-us/blob/2334ee8fb11f8813370122bd46285cf45bdd4c48/stock-con/service.js#L52)，在其 JSON 形式的響應中新增一個欄位，您應該看到 Skaffold 可以檢測到程式碼改動並建立新影象以及部署它。您的螢幕看起來應該類似這樣：
 
 
![Skaffold Preview](/images/blog/2018-05-01-developing-on-kubernetes/dok-skaffold_preview.png)
<!--
By now you should have a feeling how different tools enable you to develop apps on Kubernetes and if you’re interested to learn more about tools and or methods, check out the following resources:
 -->

至此，您應該對不同的工具如何幫您在 Kubernetes 上開發應用程式有了一定的概念，如果您有興趣瞭解有關工具和/或方法的更多資訊，請檢視以下資源：

* Blog post by Shahidh K Muhammed on [Draft vs Gitkube vs Helm vs Ksonnet vs Metaparticle vs Skaffold](https://blog.hasura.io/draft-vs-gitkube-vs-helm-vs-ksonnet-vs-metaparticle-vs-skaffold-f5aa9561f948) (03/2018)
* Blog post by Gergely Nemeth on [Using Kubernetes for Local Development](https://nemethgergely.com/using-kubernetes-for-local-development/index.html), with a focus on Skaffold (03/2018)
* Blog post by Richard Li on [Locally developing Kubernetes services (without waiting for a deploy)](https://hackernoon.com/locally-developing-kubernetes-services-without-waiting-for-a-deploy-f63995de7b99), with a focus on Telepresence
* Blog post by Abhishek Tiwari on [Local Development Environment for Kubernetes using Minikube](https://abhishek-tiwari.com/local-development-environment-for-kubernetes-using-minikube/) (09/2017)
* Blog post by Aymen El Amri on [Using Kubernetes for Local Development — Minikube](https://medium.com/devopslinks/using-kubernetes-minikube-for-local-development-c37c6e56e3db) (08/2017)
* Blog post by Alexis Richardson on [​GitOps - Operations by Pull Request](https://www.weave.works/blog/gitops-operations-by-pull-request) (08/2017)
* Slide deck [GitOps: Drive operations through git](https://docs.google.com/presentation/d/1d3PigRVt_m5rO89Ob2XZ16bW8lRSkHHH5k816-oMzZo/), with a focus on Gitkube by Tirumarai Selvan (03/2018)
* Slide deck [Developing apps on Kubernetes](https://speakerdeck.com/mhausenblas/developing-apps-on-kubernetes), a talk Michael Hausenblas gave at a CNCF Paris meetup  (04/2018)
* YouTube videos:
    * [TGI Kubernetes 029: Developing Apps with Ksync](https://www.youtube.com/watch?v=QW85Y0Ug3KY )
    * [TGI Kubernetes 030: Exploring Skaffold](https://www.youtube.com/watch?v=McwwWhCXMxc)
    * [TGI Kubernetes 031: Connecting with Telepresence](https://www.youtube.com/watch?v=zezeBAJ_3w8)
    * [TGI Kubernetes 033: Developing with Draft](https://www.youtube.com/watch?v=8B1D7cTMPgA)
* Raw responses to the [Kubernetes Application Survey](https://docs.google.com/spreadsheets/d/12ilRCly2eHKPuicv1P_BD6z__PXAqpiaR-tDYe2eudE/edit) 2018 by SIG Apps

<!--
With that we wrap up this post on how to go about developing apps on Kubernetes, we hope you learned something and if you have feedback and/or want to point out a tool that you found useful, please let us know via Twitter: [Ilya](https://twitter.com/errordeveloper) and [Michael](https://twitter.com/mhausenblas).
-->

有了這些，我們這篇關於如何在 Kubernetes 上開發應用程式的部落格就可以收尾了，希望您有所收穫，如果您有反饋和/或想要指出您認為有用的工具，請透過 Twitter 告訴我們：[Ilya](https://twitter.com/errordeveloper) 和 [Michael](https://twitter.com/mhausenblas)
