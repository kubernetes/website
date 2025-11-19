---
title: “基於容器的應用程序設計原理”
date: 2018-03-15
slug: principles-of-container-app-design
---
<!--
title: "Principles of Container-based Application Design"
date: 2018-03-15
slug: principles-of-container-app-design
url: /blog/2018/03/Principles-Of-Container-App-Design
-->

<!--
It's possible nowadays to put almost any application in a container and run it. Creating cloud-native applications, however—containerized applications that are automated and orchestrated effectively by a cloud-native platform such as Kubernetes—requires additional effort. Cloud-native applications anticipate failure; they run and scale reliably even when their infrastructure experiences outages. To offer such capabilities, cloud-native platforms like Kubernetes impose a set of contracts and constraints on applications. These contracts ensure that applications they run conform to certain constraints and allow the platform to automate application management.
-->
如今，可以將幾乎所有應用程序放入容器中並運行它。
但是，創建雲原生應用程序（由 Kubernetes 等雲原生平臺自動有效地編排的容器化應用程序）需要付出額外的努力。
雲原生應用程序會預期失敗；
它們可以可靠的運行和擴展，即使基礎架構出現故障。
爲了提供這樣的功能，像 Kubernetes 這樣的雲原生平臺對應用程序施加了一系列約定和約束。
這些合同確保運行的應用程序符合某些約束條件，並允許平臺自動執行應用程序管理。


<!--
I've outlined [seven principles][1]for containerized applications to follow in order to be fully cloud-native.   
-->
我總結了容器化應用要成爲徹底的雲原生應用所要遵從的[七個原則][1]。

| ----- |
| ![][2]  |
<!--
| Container Design Principles |
-->
| 容器設計原則 |


<!--
These seven principles cover both build time and runtime concerns.  
-->
這七個原則涵蓋了構建時間和運行時問題。

<!--
####  Build time
-->
####  建立時間

<!--
* **Single Concern:** Each container addresses a single concern and does it well.
-->
* **單獨關注點：** 每個容器都解決了一個單獨的關注點，並做到了。
<!--
* **Self-Containment:** A container relies only on the presence of the Linux kernel. Additional libraries are added when the container is built.
-->
* **自包含：** 容器僅依賴於Linux內核的存在。 構建容器時會添加其他庫。
<!--
* **Image Immutability:** Containerized applications are meant to be immutable, and once built are not expected to change between different environments.
-->
* **映像檔不可變性：** 容器化應用程序是不可變的，並且一旦構建，就不會在不同環境之間發生變化。

<!--
####  Runtime
-->
####  運行時

<!--
* **High Observability:** Every container must implement all necessary APIs to help the platform observe and manage the application in the best way possible.
-->
* **高度可觀察性：** 每個容器都必須實現所有必要的API，以幫助平臺以最佳方式觀察和管理應用程序。
<!--
* **Lifecycle Conformance:** A container must have a way to read events coming from the platform and conform by reacting to those events.
-->
* **生命週期一致性：** 容器必須具有讀取來自平臺的事件並通過對這些事件做出反應來進行一致性的方式。
<!--
* **Process Disposability:** Containerized applications must be as ephemeral as possible and ready to be replaced by another container instance at any point in time.
-->
* **進程可丟棄：** 容器化的應用程序必須儘可能短暫，並隨時可以被另一個容器實例替換。
<!--
* **Runtime Confinement:** Every container must declare its resource requirements and restrict resource use to the requirements indicated.
The build time principles ensure that containers have the right granularity, consistency, and structure in place. The runtime principles dictate what functionalities must be implemented in order for containerized applications to possess cloud-native function. Adhering to these principles helps ensure that your applications are suitable for automation in Kubernetes.
-->
* **運行時可約束** 每個容器必須聲明其資源需求，並根據所標明的需求限制其資源使用。
構建時間原則可確保容器具有正確的顆粒度，一致性和適當的結構。
運行時原則規定了必須執行哪些功能才能使容器化的應用程序具有云原生功能。
遵循這些原則有助於確保您的應用程序適合Kubernetes中的自動化。

<!--
The white paper is freely available for download:   
-->
白皮書可以免費下載：

<!--
To read more about designing cloud-native applications for Kubernetes, check out my [Kubernetes Patterns][3] book.
-->
要了解有關爲Kubernetes設計雲原生應用程序的更多信息，請翻閱我的[Kubernetes 模式][3]這本書。

<!--
— [Bilgin Ibryam][4], Principal Architect, Red Hat
-->
— [Bilgin Ibryam][4]，首席架構師，Red Hat

<!--
Twitter:   
Blog: [http://www.ofbizian.com][5]  
Linkedin:
-->
推特：   
博客： [http://www.ofbizian.com][5]  
領英：

<!--
Bilgin Ibryam (@bibryam) is a principal architect at Red Hat, open source committer at ASF, blogger, author, and speaker. He is the author of Camel Design Patterns and Kubernetes Patterns books. In his day-to-day job, Bilgin enjoys mentoring, training and leading teams to be successful with distributed systems, microservices, containers, and cloud-native applications in general.
-->
Bilgin Ibryam（@bibryam）是 Red Hat 的首席架構師，ASF 的開源提交者，博客，作者和發言人。
他是駱駝設計模式和 Kubernetes 模式書籍的作者。
在日常工作中，Bilgin 樂於指導，培訓和領導團隊，以使他們在分佈式系統，微服務，容器和雲原生應用程序方面取得成功。


[1]: https://www.redhat.com/en/resources/cloud-native-container-design-whitepaper
[2]: https://lh5.googleusercontent.com/1XqojkVC0CET1yKCJqZ3-0VWxJ3W8Q74zPLlqnn6eHSJsjHOiBTB7EGUX5o_BOKumgfkxVdgBeLyoyMfMIXwVm9p2QXkq_RRy2mDJG1qEExJDculYL5PciYcWfPAKxF2-DGIdiLw
[3]: http://leanpub.com/k8spatterns/
[4]: http://twitter.com/bibryam
[5]: http://www.ofbizian.com/

