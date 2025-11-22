---
title: " Dashboard - Kubernetes 的全功能 Web 界面 "
date: 2016-07-15
slug: dashboard-web-interface-for-kubernetes
---

<!--
title: " Dashboard - Full Featured Web Interface for Kubernetes "
date: 2016-07-15
slug: dashboard-web-interface-for-kubernetes
url: /blog/2016/07/Dashboard-Web-Interface-For-Kubernetes
-->

<!--
_Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2016/07/five-days-of-kubernetes-1-3) on what's new in Kubernetes 1.3_

[Kubernetes Dashboard](http://github.com/kubernetes/dashboard) is a project that aims to bring a general purpose monitoring and operational web interface to the Kubernetes world.&nbsp;Three months ago we [released](https://kubernetes.io/blog/2016/04/building-awesome-user-interfaces-for-kubernetes) the first production ready version, and since then the dashboard has made massive improvements. In a single UI, you’re able to perform majority of possible interactions with your Kubernetes clusters without ever leaving your browser. This blog post breaks down new features introduced in the latest release and outlines the roadmap for the future.&nbsp;
-->

_編者按：這篇文章是[一系列深入的文章](https://kubernetes.io/blog/2016/07/five-days-of-kubernetes-1-3) 中關於Kubernetes 1.3的新內容的一部分_
[Kubernetes Dashboard](http://github.com/kubernetes/dashboard)是一個旨在爲 Kubernetes 世界帶來通用監控和操作 Web 界面的項目。三個月前，我們[發佈](https://kubernetes.io/blog/2016/04/building-awesome-user-interfaces-for-kubernetes)第一個面向生產的版本，從那時起 dashboard 已經做了大量的改進。在一個 UI 中，您可以在不離開瀏覽器的情況下，與 Kubernetes 叢集執行大多數可能的交互。這篇博客文章分解了最新版本中引入的新功能，並概述了未來的路線圖。

<!--
**Full-Featured Dashboard**

Thanks to a large number of contributions from the community and project members, we were able to deliver many new features for [Kubernetes 1.3 release](https://kubernetes.io/blog/2016/07/kubernetes-1.3-bridging-cloud-native-and-enterprise-workloads). We have been carefully listening to all the great feedback we have received from our users (see the [summary infographics](http://static.lwy.io/img/kubernetes_dashboard_infographic.png)) and addressed the highest priority requests and pain points.
-->

**全功能的 Dashboard**

由於社區和項目成員的大量貢獻，我們能夠爲[Kubernetes 1.3發行版](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/)提供許多新功能。我們一直在認真聽取使用者的反饋(參見[摘要資訊圖表](http://static.lwy.io/img/kubernetes_dashboard_infographic.png))，並解決了最高優先級的請求和難點。
-->

<!--
The Dashboard UI now handles all workload resources. This means that no matter what workload type you run, it is visible in the web interface and you can do operational changes on it. For example, you can modify your stateful MySQL installation with [Pet Sets](/docs/user-guide/petset/), do a rolling update of your web server with Deployments or install cluster monitoring with DaemonSets.&nbsp;



 [![](https://lh3.googleusercontent.com/p9bMGxPx4jE6_Z2KB-MktmyuAxyFst-bEk29M_Bn0Bj5ul7uzinH6u5WjHsMmqhGvBwlABZt06dwQ5qkBZiLq_EM1oddCmpwChvXDNXZypaS5l8uzkKuZj3PBUmzTQT4dgDxSXgz) ](https://lh3.googleusercontent.com/p9bMGxPx4jE6_Z2KB-MktmyuAxyFst-bEk29M_Bn0Bj5ul7uzinH6u5WjHsMmqhGvBwlABZt06dwQ5qkBZiLq_EM1oddCmpwChvXDNXZypaS5l8uzkKuZj3PBUmzTQT4dgDxSXgz)
-->

Dashboard UI 現在處理所有工作負載資源。這意味着無論您運行什麼工作負載類型，它都在 web 界面中可見，並且您可以對其進行操作更改。例如，可以使用[Pet Sets](/docs/user-guide/petset/)修改有狀態的 mysql 安裝，使用部署對 web 伺服器進行滾動更新，或使用守護程式安裝叢集監視。



 [![](https://lh3.googleusercontent.com/p9bMGxPx4jE6_Z2KB-MktmyuAxyFst-bEk29M_Bn0Bj5ul7uzinH6u5WjHsMmqhGvBwlABZt06dwQ5qkBZiLq_EM1oddCmpwChvXDNXZypaS5l8uzkKuZj3PBUmzTQT4dgDxSXgz) ](https://lh3.googleusercontent.com/p9bMGxPx4jE6_Z2KB-MktmyuAxyFst-bEk29M_Bn0Bj5ul7uzinH6u5WjHsMmqhGvBwlABZt06dwQ5qkBZiLq_EM1oddCmpwChvXDNXZypaS5l8uzkKuZj3PBUmzTQT4dgDxSXgz)

<!--
In addition to viewing resources, you can create, edit, update, and delete them. This feature enables many use cases. For example, you can kill a failed Pod, do a rolling update on a Deployment, or just organize your resources. You can also export and import YAML configuration files of your cloud apps and store them in a version control system.



 ![](https://lh6.googleusercontent.com/zz-qjNcGgvWXrK1LIipUdIdPyeWJ1EyPVJxRnSvI6pMcLBkxDxpQt-ObsIiZsS_X0RjVBWtXYO5TCvhsymb__CGXFzKuPUnUrB4HKnAMsxtYdWLwMmHEb8c9P9Chzlo5ePHRKf5O)
-->

除了查看資源外，還可以創建、編輯、更新和刪除資源。這個特性支持許多用例。例如，您可以殺死一個失敗的 pod，對部署進行滾動更新，或者只組織資源。您還可以導出和導入雲應用程式的 yaml 設定檔案，並將它們儲存在版本控制系統中。



 ![](https://lh6.googleusercontent.com/zz-qjNcGgvWXrK1LIipUdIdPyeWJ1EyPVJxRnSvI6pMcLBkxDxpQt-ObsIiZsS_X0RjVBWtXYO5TCvhsymb__CGXFzKuPUnUrB4HKnAMsxtYdWLwMmHEb8c9P9Chzlo5ePHRKf5O)

<!--
The release includes a beta view of cluster nodes for administration and operational use cases. The UI lists all nodes in the cluster to allow for overview analysis and quick screening for problematic nodes. The details view shows all information about the node and links to pods running on it.



 ![](https://lh6.googleusercontent.com/3CSTUy-8Tz-yAL9tCqxNUqMcWJYKK0dwk7kidE9zy-L-sXFiD4A4Y2LKEqbJKgI6Fl6xbzYxsziI8dULVXPJbu6eU0ci7hNtqi3tTuhdbVD6CG3EXw151fvt2MQuqumHRbab6g-_)
-->

這個版本包括一個用於管理和操作用例的叢集節點的 beta 視圖。UI 列出叢集中的所有節點，以便進行總體分析和快速篩選有問題的節點。details 視圖顯示有關該節點的所有資訊以及指向在其上運行的 pod 的鏈接。



 ![](https://lh6.googleusercontent.com/3CSTUy-8Tz-yAL9tCqxNUqMcWJYKK0dwk7kidE9zy-L-sXFiD4A4Y2LKEqbJKgI6Fl6xbzYxsziI8dULVXPJbu6eU0ci7hNtqi3tTuhdbVD6CG3EXw151fvt2MQuqumHRbab6g-_)

<!--
There are also many smaller scope new features that the we shipped with the release, namely: support for namespaced resources, internationalization, performance improvements, and many bug fixes (find out more in the [release notes](https://github.com/kubernetes/dashboard/releases/tag/v1.1.0)). All these improvements result in a better and simpler user experience of the product.
-->

我們隨發行版提供的還有許多小範圍的新功能，即：支持命名空間資源、國際化、性能改進和許多錯誤修復(請參閱[發行說明](https://github.com/kubernetes/dashboard/releases/tag/v1.1.0)中的更多內容)。所有這些改進都會帶來更好、更簡單的產品使用者體驗。

<!--
**Future Work**



The team has ambitious plans for the future spanning across multiple use cases. We are also open to all feature requests, which you can post on our [issue tracker](https://github.com/kubernetes/dashboard/issues).
-->

**Future Work**



該團隊對跨越多個用例的未來有着雄心勃勃的計劃。我們還對所有功能請求開放，您可以在我們的[問題跟蹤程式](https://github.com/kubernetes/dashboard/issues)上發佈這些請求。

<!--
Here is a list of our focus areas for the following months:

- [Handle more Kubernetes resources](https://github.com/kubernetes/dashboard/issues/961) - To show all resources that a cluster user may potentially interact with. Once done, Dashboard can act as a complete replacement for CLI.&nbsp;
- [Monitoring and troubleshooting](https://github.com/kubernetes/dashboard/issues/962) - To add resource usage statistics/graphs to the objects shown in Dashboard. This focus area will allow for actionable debugging and troubleshooting of cloud applications.
- [Security, auth and logging in](https://github.com/kubernetes/dashboard/issues/964) - Make Dashboard accessible from networks external to a Cluster and work with custom authentication systems.
-->

以下是我們接下來幾個月的重點領域：

- [Handle more Kubernetes resources](https://github.com/kubernetes/dashboard/issues/961) - 顯示叢集使用者可能與之交互的所有資源。一旦完成，dashboard 就可以完全替代cli。
- [Monitoring and troubleshooting](https://github.com/kubernetes/dashboard/issues/962) - 將資源使用統計資訊/圖表添加到 Dashboard 中顯示的對象。這個重點領域將允許對雲應用程式進行可操作的調試和故障排除。
- [Security, auth and logging in](https://github.com/kubernetes/dashboard/issues/964) - 使儀表板可從叢集外部的網路訪問，並使用自定義身份驗證系統。

<!--
**Connect With Us**



We would love to talk with you and hear your feedback!

- Email us at the [SIG-UI mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-ui)
- Chat with us on the Kubernetes Slack&nbsp;[#SIG-UI channel](https://kubernetes.slack.com/messages/sig-ui/)
- Join our meetings: 4PM CEST. See the [SIG-UI calendar](https://calendar.google.com/calendar/embed?src=google.com_52lm43hc2kur57dgkibltqc6kc%40group.calendar.google.com&ctz=Europe/Warsaw) for details.





_-- Piotr Bryk, Software Engineer, Google_
-->

**聯繫我們**



我們很樂意與您交談並聽取您的反饋！

- 請在[SIG-UI郵件列表](https://groups.google.com/forum/向我們發送電子郵件！論壇/kubernetes sig ui)
- 在 kubernetes slack 上與我們聊天。[#SIG-UI channel](https://kubernetes.slack.com/messages/sig-ui/)
- 參加我們的會議：東部時間下午4點。請參閱[SIG-UI日曆](https://calendar.google.com/calendar/embed?src=google.com_52lm43hc2kur57dgkibltqc6kc%40group.calendar.google.com&ctz=Europe/Warsaw)瞭解詳細資訊。
