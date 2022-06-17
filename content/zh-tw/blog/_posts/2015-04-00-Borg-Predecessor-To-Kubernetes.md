---
title: "Borg: Kubernetes 的前身"
date: 2015-04-23
slug: borg-predecessor-to-kubernetes
url: /zh-cn/blog/2015/04/Borg-Predecessor-To-Kubernetes
---
<!--
---
title: " Borg: The Predecessor to Kubernetes "
date: 2015-04-23
slug: borg-predecessor-to-kubernetes
url: /zh-cn/blog/2015/04/Borg-Predecessor-To-Kubernetes
---
-->
<!--
Google has been running containerized workloads in production for more than a decade. Whether it's service jobs like web front-ends and stateful servers, infrastructure systems like [Bigtable](http://research.google.com/archive/bigtable.html) and [Spanner](http://research.google.com/archive/spanner.html), or batch frameworks like [MapReduce](http://research.google.com/archive/mapreduce.html) and [Millwheel](http://research.google.com/pubs/pub41378.html), virtually everything at Google runs as a container. Today, we took the wraps off of Borg, Google’s long-rumored internal container-oriented cluster-management system, publishing details at the academic computer systems conference [Eurosys](http://eurosys2015.labri.fr/). You can find the paper [here](https://research.google.com/pubs/pub43438.html).
-->
十多年來，谷歌一直在生產中執行容器化工作負載。
無論是像網路前端和有狀態伺服器之類的工作，像 [Bigtable](http://research.google.com/archive/bigtable.html) 和 
[Spanner](http://research.google.com/archive/spanner.html)一樣的基礎架構系統，或是像
[MapReduce](http://research.google.com/archive/mapreduce.html) 和 [Millwheel](http://research.google.com/pubs/pub41378.html)一樣的批處理框架，
Google 的幾乎一切都是以容器的方式執行的。今天，我們揭開了 Borg 的面紗，Google 傳聞已久的面向容器的內部叢集管理系統，並在學術計算機系統會議 [Eurosys](http://eurosys2015.labri.fr/) 上釋出了詳細資訊。你可以在 [此處](https://research.google.com/pubs/pub43438.html) 找到論文。


<!--
Kubernetes traces its lineage directly from Borg. Many of the developers at Google working on Kubernetes were formerly developers on the Borg project. We've incorporated the best ideas from Borg in Kubernetes, and have tried to address some pain points that users identified with Borg over the years.
-->
Kubernetes 直接繼承自 Borg。
在 Google 的很多從事 Kubernetes 的開發人員以前都是 Borg 專案的開發人員。
我們在 Kubernetes 中結合了 Borg 的最佳創意，並試圖解決使用者多年來在 Borg 中發現的一些痛點。

<!--
To give you a flavor, here are four Kubernetes features that came from our experiences with Borg:
-->
Kubernetes 中的以下四個功能特性源於我們從 Borg 獲得的經驗：

<!--
1) [Pods](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/pods.md). A pod is the unit of scheduling in Kubernetes. It is a resource envelope in which one or more containers run. Containers that are part of the same pod are guaranteed to be scheduled together onto the same machine, and can share state via local volumes.
-->
1) [Pods](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/pods.md). 
Pod 是 Kubernetes 中排程的單位。
它是一個或多個容器在其中執行的資源封裝。
保證屬於同一 Pod 的容器可以一起排程到同一臺計算機上，並且可以透過本地卷共享狀態。

<!--
Borg has a similar abstraction, called an alloc (short for “resource allocation”). Popular uses of allocs in Borg include running a web server that generates logs alongside a lightweight log collection process that ships the log to a cluster filesystem (not unlike fluentd or logstash); running a web server that serves data from a disk directory that is populated by a process that reads data from a cluster filesystem and prepares/stages it for the web server (not unlike a Content Management System); and running user-defined processing functions alongside a storage shard. 
-->
Borg 有一個類似的抽象，稱為 alloc（“資源分配”的縮寫）。
Borg 中 alloc 的常見用法包括執行 Web 伺服器，該伺服器生成日誌，一起部署一個輕量級日誌收集程序，
該程序將日誌傳送到叢集檔案系統（和 fluentd 或 logstash 沒什麼不同 ）；
執行 Web 伺服器，該 Web 伺服器從磁碟目錄提供資料，
該磁碟目錄由從叢集檔案系統讀取資料併為 Web 伺服器準備/暫存的程序填充（與內容管理系統沒什麼不同）；
並與儲存分片一起執行使用者定義的處理功能。
<!--
Pods not only support these use cases, but they also provide an environment similar to running multiple processes in a single VM -- Kubernetes users can deploy multiple co-located, cooperating processes in a pod without having to give up the simplicity of a one-application-per-container deployment model.
-->
Pod 不僅支援這些用例，而且還提供類似於在單個 VM 中執行多個程序的環境 -- Kubernetes 使用者可以在 Pod 中部署多個位於同一地點的協作過程，而不必放棄一個應用程式一個容器的部署模型。



<!--
2) [Services](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/services.md). Although Borg’s primary role is to manage the lifecycles of tasks and machines, the applications that run on Borg benefit from many other cluster services, including naming and load balancing. Kubernetes supports naming and load balancing using the service abstraction: a service has a name and maps to a dynamic set of pods defined by a label selector (see next section). Any container in the cluster can connect to the service using the service name. 
-->
2) [服務](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/services.md)。
儘管 Borg 的主要角色是管理任務和計算機的生命週期，但是在 Borg 上執行的應用程式還可以從許多其它叢集服務中受益，包括命名和負載均衡。
Kubernetes 使用服務抽象支援命名和負載均衡：帶名字的服務，會對映到由標籤選擇器定義的一組動態 Pod 集（請參閱下一節）。
叢集中的任何容器都可以使用服務名稱連結到服務。
<!--
Under the covers, Kubernetes automatically load-balances connections to the service among the pods that match the label selector, and keeps track of where the pods are running as they get rescheduled over time due to failures.
-->
在幕後，Kubernetes 會自動在與標籤選擇器匹配到 Pod 之間對與服務的連線進行負載均衡，並跟蹤 Pod 在哪裡執行，由於故障，它們會隨著時間的推移而重新安排。



<!--
3) [Labels](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/labels.md). 
A container in Borg is usually one replica in a collection of identical or nearly identical containers that correspond to one tier of an Internet service (e.g. the front-ends for Google Maps) or to the workers of a batch job (e.g. a MapReduce). The collection is called a Job, and each replica is called a Task. While the Job is a very useful abstraction, it can be limiting. For example, users often want to manage their entire service (composed of many Jobs) as a single entity, or to uniformly manage several related instances of their service, for example separate canary and stable release tracks. 
At the other end of the spectrum, users frequently want to reason about and control subsets of tasks within a Job -- the most common example is during rolling updates, when different subsets of the Job need to have different configurations.
-->
3) [標籤](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/labels.md)。 
Borg 中的容器通常是一組相同或幾乎相同的容器中的一個副本，該容器對應於 Internet 服務的一層（例如 Google Maps 的前端）或批處理作業的工人（例如 MapReduce）。
該集合稱為 Job ，每個副本稱為任務。
儘管 Job 是一個非常有用的抽象，但它可能是有限的。
例如，使用者經常希望將其整個服務（由許多 Job 組成）作為一個實體進行管理，或者統一管理其服務的幾個相關例項，例如單獨的 Canary 和穩定的發行版。
另一方面，使用者經常希望推理和控制 Job 中的任務子集 --最常見的示例是在滾動更新期間，此時作業的不同子集需要具有不同的配置。


<!--
Kubernetes supports more flexible collections than Borg by organizing pods using labels, which are arbitrary key/value pairs that users attach to pods (and in fact to any object in the system). Users can create groupings equivalent to Borg Jobs by using a “job:\<jobname\>” label on their pods, but they can also use additional labels to tag the service name, service instance (production, staging, test), and in general, any subset of their pods. A label query (called a “label selector”) is used to select which set of pods an operation should be applied to. Taken together, labels and [replication controllers](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/replication-controller.md) allow for very flexible update semantics, as well as for operations that span the equivalent of Borg Jobs.
-->
透過使用標籤組織 Pod ，Kubernetes 比 Borg 支援更靈活的集合，標籤是使用者附加到 Pod（實際上是系統中的任何物件）的任意鍵/值對。
使用者可以透過在其 Pod 上使用 “job:\<jobname\>” 標籤來建立與 Borg Jobs 等效的分組，但是他們還可以使用其他標籤來標記服務名稱，服務例項（生產，登臺，測試）以及一般而言，其 pod 的任何子集。
標籤查詢（稱為“標籤選擇器”）用於選擇操作應用於哪一組 Pod 。
結合起來，標籤和[複製控制器](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/replication-controller.md) 允許非常靈活的更新語義，以及跨等效項的操作 Borg Jobs。



<!--
4) IP-per-Pod. In Borg, all tasks on a machine use the IP address of that host, and thus share the host’s port space. While this means Borg can use a vanilla network, it imposes a number of burdens on infrastructure and application developers: Borg must schedule ports as a resource; tasks must pre-declare how many ports they need, and take as start-up arguments which ports to use; the Borglet (node agent) must enforce port isolation; and the naming and RPC systems must handle ports as well as IP addresses.
-->
4) 每個 Pod 一個 IP。在 Borg 中，計算機上的所有任務都使用該主機的 IP 地址，從而共享主機的埠空間。
雖然這意味著 Borg 可以使用普通網路，但是它給基礎結構和應用程式開發人員帶來了許多負擔：Borg 必須將埠作為資源進行排程；任務必須預先宣告它們需要多少個埠，並將要使用的埠作為啟動引數；Borglet（節點代理）必須強制埠隔離；命名和 RPC 系統必須處理埠以及 IP 地址。


<!--
Thanks to the advent of software-defined overlay networks such as [flannel](https://coreos.com/blog/introducing-rudder/) or those built into [public clouds](https://cloud.google.com/compute/docs/networking), Kubernetes is able to give every pod and service its own IP address. This removes the infrastructure complexity of managing ports, and allows developers to choose any ports they want rather than requiring their software to adapt to the ones chosen by the infrastructure. The latter point is crucial for making it easy to run off-the-shelf open-source applications on Kubernetes--pods can be treated much like VMs or physical hosts, with access to the full port space, oblivious to the fact that they may be sharing the same physical machine with other pods.
-->
多虧了軟體定義的覆蓋網路，例如 [flannel](https://coreos.com/blog/introducing-rudder/) 或內置於[公有云](https://cloud.google.com/compute/docs/networking)網路的出現，Kubernetes 能夠為每個 Pod 提供服務併為其提供自己的 IP 地址。
這消除了管理埠的基礎架構的複雜性，並允許開發人員選擇他們想要的任何埠，而不需要其軟體適應基礎架構選擇的埠。
後一點對於使現成的易於執行 Kubernetes 上的開源應用程式至關重要 -- 可以將 Pod 視為 VMs 或物理主機，可以訪問整個埠空間，他們可能與其他 Pod 共享同一臺物理計算機，這一事實已被忽略。


<!--
With the growing popularity of container-based microservice architectures, the lessons Google has learned from running such systems internally have become of increasing interest to the external DevOps community. By revealing some of the inner workings of our cluster manager Borg, and building our next-generation cluster manager as both an open-source project (Kubernetes) and a publicly available hosted service ([Google Container Engine](http://cloud.google.com/container-engine)), we hope these lessons can benefit the broader community outside of Google and advance the state-of-the-art in container scheduling and cluster management. 
-->
隨著基於容器的微服務架構的日益普及，Google 從內部執行此類系統所汲取的經驗教訓已引起外部 DevOps 社群越來越多的興趣。
透過揭示叢集管理器 Borg 的一些內部工作原理，並將下一代叢集管理器構建為一個開源專案（Kubernetes）和一個公開可用的託管服務（[Google Container Engine]（http://cloud.google.com/container-engine)) ，我們希望這些課程可以使 Google 之外的廣大社群受益，並推動容器排程和叢集管理方面的最新技術發展。


