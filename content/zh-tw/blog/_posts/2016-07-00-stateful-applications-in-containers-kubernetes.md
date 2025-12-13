---
title: "容器中運行有狀態的應用！？ Kubernetes 1.3 說 “是！” "
date: 2016-07-13
slug: stateful-applications-in-containers-kubernetes
---
<!--
title: " Stateful Applications in Containers!? Kubernetes 1.3 Says “Yes!” "
date: 2016-07-13
slug: stateful-applications-in-containers-kubernetes
url: /blog/2016/07/stateful-applications-in-containers-kubernetes
-->

<!--
_Editor's note: today’s guest post is from Mark Balch, VP of Products at Diamanti, who’ll share more about the contributions they’ve made to Kubernetes._    
-->
_編者注： 今天的來賓帖子來自 Diamanti 產品副總裁 Mark Balch，他將分享有關他們對 Kubernetes 所做的貢獻的更多資訊。_ 

<!--

Congratulations to the Kubernetes community on another [value-packed release](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/). A focus on stateful applications and federated clusters are two reasons why I’m so excited about 1.3. Kubernetes support for stateful apps such as Cassandra, Kafka, and MongoDB is critical. Important services rely on databases, key value stores, message queues, and more. Additionally, relying on one data center or container cluster simply won’t work as apps grow to serve millions of users around the world. Cluster federation allows users to deploy apps across multiple clusters and data centers for scale and resiliency.

-->
祝賀 Kubernetes 社區發佈了另一個[有價值的版本](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/)。
專注於有狀態應用程式和聯邦叢集是我對 1.3 如此興奮的兩個原因。
Kubernetes 對有狀態應用程式（例如 Cassandra、Kafka 和 MongoDB）的支持至關重要。
重要服務依賴於資料庫、鍵值儲存、消息隊列等。
此外，隨着應用程式的發展爲全球數百萬使用者提供服務，僅依靠一個資料中心或容器叢集將無法正常工作。
聯邦叢集允許使用者跨多個叢集和資料中心部署應用程式，以實現規模和彈性。

<!--
You may have [heard me say before](https://www.diamanti.com/blog/the-next-great-application-platform/) that containers are the next great application platform. Diamanti is accelerating container adoption for stateful apps in production - where performance and ease of deployment really matter.&nbsp;  
-->
您可能[之前聽過我說過](https://www.diamanti.com/blog/the-next-great-application-platform/)，容器是下一個出色的應用程式平臺。
Diamanti 正在加速在生產中使用有狀態應用程式的容器-在這方面，性能和易於部署非常重要。

<!--
**Apps Need More Than Cattle**  
-->
**應用程式不僅僅需要牛**  

<!--
Beyond stateless containers like web servers (so-called “cattle” because they are interchangeable), users are increasingly deploying stateful workloads with containers to benefit from “build once, run anywhere” and to improve bare metal efficiency/utilization. These “pets” (so-called because each requires special handling) bring new requirements including longer life cycle, configuration dependencies, stateful failover, and performance sensitivity. Container orchestration must address these needs to successfully deploy and scale apps.  
-->
除了諸如Web伺服器之類的無狀態容器（因爲它們是可互換的，因此被稱爲“牛”）之外，使用者越來越多地使用容器來部署有狀態工作負載，以從“一次構建，隨處運行”中受益並提高裸機效率/利用率。
這些“寵物”（之所以稱爲“寵物”，是因爲每個寵物都需要特殊的處理）帶來了新的要求，包括更長的生命週期，設定依賴項，有狀態故障轉移以及性能敏感性。
容器編排必須滿足這些需求，才能成功部署和擴展應用程式。

<!--
Enter [Pet Set](/docs/user-guide/petset/), a new object in Kubernetes 1.3 for improved stateful application support. Pet Set sequences through the startup phase of each database replica (for example), ensuring orderly master/slave configuration. Pet Set also simplifies service discovery by leveraging ubiquitous DNS SRV records, a well-recognized and long-understood mechanism.  
-->
輸入 [Pet Set](/docs/user-guide/petset/)，這是 Kubernetes 1.3 中的新對象，用於改進對狀態應用程式的支持。
Pet Set 在每個資料庫副本的啓動階段進行排序（例如），以確保有序的主/從設定。
Pet Set 還利用普遍存在的 DNS SRV 記錄簡化了服務發現，DNS SRV 記錄是一種廣爲人知且長期瞭解的機制。

<!--
Diamanti’s [FlexVolume contribution](https://github.com/kubernetes/kubernetes/pull/13840) to Kubernetes enables stateful workloads by providing persistent volumes with low-latency storage and guaranteed performance, including enforced quality-of-service from container to media.  
-->
Diamanti 對 Kubernetes 的 [FlexVolume 貢獻](https://github.com/kubernetes/kubernetes/pull/13840) 通過爲持久卷提供低延遲儲存並保證性能來實現有狀態工作負載，包括從容器到媒體的強制服務質量。

<!--
**A Federalist**  
-->
**聯邦主義者** 

<!--
Users who are planning for application availability must contend with issues of failover and scale across geography. Cross-cluster federated services allows containerized apps to easily deploy across multiple clusters. Federated services tackles challenges such as managing multiple container clusters and coordinating service deployment and discovery across federated clusters.  
-->
爲應用可用性作規劃的使用者必須應對故障遷移問題並在整個地理區域內擴展。
跨叢集聯邦服務允許容器化的應用程式輕鬆跨多個叢集進行部署。
聯邦服務解決了諸如管理多個容器叢集以及協調跨聯邦叢集的服務部署和發現之類的挑戰。

<!--
Like a strictly centralized model, federation provides a common app deployment interface. With each cluster retaining autonomy, however, federation adds flexibility to manage clusters locally during network outages and other events. Cross-cluster federated services also applies consistent service naming and adoption across container clusters, simplifying DNS resolution.  
-->
像嚴格的集中式模型一樣，聯邦身份驗證提供了通用的應用程式部署界面。
但是，由於每個叢集都具有自治權，因此聯邦會增加了在網路中斷和其他事件期間在本地管理叢集的靈活性。
跨叢集聯邦服務還可以提供跨容器叢集應用一致的服務命名和採用，簡化 DNS 解析。

<!--
It’s easy to imagine powerful multi-cluster use cases with cross-cluster federated services in future releases. An example is scheduling containers based on governance, security, and performance requirements. Diamanti’s scheduler extension was developed with this concept in mind. Our [first implementation](https://github.com/kubernetes/kubernetes/pull/13580) makes the Kubernetes scheduler aware of network and storage resources local to each cluster node. Similar concepts can be applied in the future to broader placement controls with cross-cluster federated services.&nbsp;  
-->
很容易想象在將來的版本中具有跨叢集聯邦服務的強大多叢集用例。
一個示例是根據治理，安全性和性能要求調度容器。
Diamanti 的調度程式擴展是在考慮了這一概念的基礎上開發的。
我們的[第一個實現](https://github.com/kubernetes/kubernetes/pull/13580)使 Kubernetes 調度程式意識到每個叢集節點本地的網路和儲存資源。
將來，類似的概念可以應用於跨叢集聯邦服務的更廣泛的放置控件。

<!--
**Get Involved**  
-->
**參與其中**  

<!--
With interest growing in stateful apps, work has already started to further enhance Kubernetes storage. The Storage Special Interest Group is discussing proposals to support local storage resources. Diamanti is looking forward to extend FlexVolume to include richer APIs that enable local storage and storage services including data protection, replication, and reduction. We’re also working on proposals for improved app placement, migration, and failover across container clusters through Kubernetes cross-cluster federated services.  
-->
隨着對有狀態應用的興趣日益濃厚，人們已經開始進一步增強 Kubernetes 儲存的工作。
儲存特別興趣小組正在討論支持本地儲存資源的提案。
Diamanti 期待將 FlexVolume 擴展到包括更豐富的 API，這些 API 可以啓用本地儲存和儲存服務，包括資料保護，複製和縮減。
我們還正在研究有關通過 Kubernetes 跨叢集聯邦服務改善應用程式放置，遷移和跨容器叢集故障轉移的建議。

<!--
Join the conversation and contribute! Here are some places to get started:  
-->
加入對話並做出貢獻！
這裏是一些入門的地方：

<!--
- Product Management [group](https://groups.google.com/forum/#!forum/kubernetes-sig-pm)
- Kubernetes [Storage SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-storage)&nbsp;
- Kubernetes [Cluster Federation SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)
-->
- 產品管理 [組](https://groups.google.com/forum/#!forum/kubernetes-sig-pm)
- Kubernetes [儲存 SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-storage)&nbsp;
- Kubernetes [叢集聯邦 SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)

<!--
_-- Mark Balch, VP Products, [Diamanti](https://diamanti.com/). Twitter [@markbalch](https://twitter.com/markbalch)_  
-->
_-- [Diamanti](https://diamanti.com/) 產品副總裁 Mark Balch。 Twitter [@markbalch](https://twitter.com/markbalch)_
