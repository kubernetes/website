<!--
---
title: " AppC Support for Kubernetes through RKT "
date: 2015-05-04
slug: appc-support-for-kubernetes-through-rkt
url: /zh-cn/blog/2015/05/Appc-Support-For-Kubernetes-Through-Rkt
---
-->
---
title: " 透過 RKT 對 Kubernetes 的 AppC 支援 "
date: 2015-05-04
slug: appc-support-for-kubernetes-through-rkt
url: /zh-cn/blog/2015/05/Appc-Support-For-Kubernetes-Through-Rkt
---
<!--
We very recently accepted a pull request to the Kubernetes project to add appc support for the Kubernetes community. &nbsp;Appc is a new open container specification that was initiated by CoreOS, and is supported through CoreOS rkt container runtime.
-->
我們最近接受了對 Kubernetes 專案的拉取請求，以增加對 Kubernetes 社群的應用程式支援。 &nbsp;AppC 是由 CoreOS 發起的新的開放容器規範，並透過 CoreOS rkt 容器執行時受到支援。

<!--
This is an important step forward for the Kubernetes project and for the broader containers community. &nbsp;It adds flexibility and choice to the container-verse and brings the promise of &nbsp;compelling new security and performance capabilities to the Kubernetes developer.
-->
對於Kubernetes專案和更廣泛的容器社群而言，這是重要的一步。 &nbsp;它為容器語言增加了靈活性和選擇餘地，併為Kubernetes開發人員帶來了令人信服的新安全性和效能功能。

<!--
Container based runtimes (like Docker or rkt) when paired with smart orchestration technologies (like Kubernetes and/or Apache Mesos) are a legitimate disruption to the way that developers build and run their applications. &nbsp;While the supporting technologies are relatively nascent, they do offer the promise of some very powerful new ways to assemble, deploy, update, debug and extend solutions. &nbsp;I believe that the world has not yet felt the full potential of containers and the next few years are going to be particularly exciting! &nbsp;With that in mind it makes sense for several projects to emerge with different properties and different purposes. It also makes sense to be able to plug together different pieces (whether it be the container runtime or the orchestrator) based on the specific needs of a given application.
-->
與智慧編排技術（例如 Kubernetes 和/或 Apache Mesos）配合使用時，基於容器的執行時（例如 Docker 或 rkt）對開發人員構建和執行其應用程式的方式是一種合法干擾。 &nbsp;儘管支援技術還處於新生階段，但它們確實為組裝，部署，更新，除錯和擴充套件解決方案提供了一些非常強大的新方法。 &nbsp;我相信，世界還沒有意識到容器的全部潛力，未來幾年將特別令人興奮！ &nbsp;考慮到這一點，有幾個具有不同屬性和不同目的的專案才有意義。能夠根據給定應用程式的特定需求將不同的部分（無論是容器執行時還是編排工具）插入在一起也是有意義的。

<!--
Docker has done an amazing job of democratizing container technologies and making them accessible to the outside world, and we expect Kubernetes to support Docker indefinitely. CoreOS has also started to do interesting work with rkt to create an elegant, clean, simple and open platform that offers some really interesting properties. &nbsp;It looks poised deliver a secure and performant operating environment for containers. &nbsp;The Kubernetes team has been working with the appc team at CoreOS for a while and in many ways they built rkt with Kubernetes in mind as a simple pluggable runtime component. &nbsp;
-->
Docker 在使容器技術民主化並使外界可以訪問它們方面做得非常出色，我們希望 Kubernetes 能夠無限期地支援 Docker。CoreOS 還開始與 rkt 進行有趣的工作，以建立一個優雅，乾淨，簡單和開放的平臺，該平臺提供了一些非常有趣的屬性。 &nbsp;這看起來蓄勢待發，可以為容器提供安全，高效能的操作環境。 &nbsp;Kubernetes 團隊已經與 CoreOS 的 appc 團隊合作了一段時間，在許多方面，他們都將 Kubernetes 作為簡單的可插入執行時元件來構建 rkt。 &nbsp;

<!--
The really nice thing is that with Kubernetes you can now pick the container runtime that works best for you based on your workloads’ needs, change runtimes without having the replace your cluster environment, or even mix together applications where different parts are running in different container runtimes in the same cluster. &nbsp;Additional choices can’t help but ultimately benefit the end developer.
-->
真正的好處是，藉助 Kubernetes，您現在可以根據工作負載的需求選擇最適合您的容器執行時，無需替換叢集環境即可更改執行時，甚至可以將在同一叢集中在不同容器中執行的應用程式的不同部分混合在一起。 &nbsp;其他選擇無濟於事，但最終使最終開發人員受益。

<!--
-- Craig McLuckie  
Google Product Manager and Kubernetes co-founder  
-->
-- Craig McLuckie
Google 產品經理和 Kubernetes 聯合創始人
