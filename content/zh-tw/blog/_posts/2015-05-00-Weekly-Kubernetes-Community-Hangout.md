---
title: " Kubernetes 社群每週聚會筆記- 2015年5月1日 "
date: 2015-05-11
slug: weekly-kubernetes-community-hangout
---

<!--
---
title: " Weekly Kubernetes Community Hangout Notes - May 1 2015 "
date: 2015-05-11
slug: weekly-kubernetes-community-hangout
url: /zh-cn/blog/2015/05/Weekly-Kubernetes-Community-Hangout
---
-->

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.
-->
每個星期，Kubernetes 貢獻者社群幾乎都會在谷歌 Hangouts 上聚會。我們希望任何對此感興趣的人都能瞭解這個論壇的討論內容。

<!--

* Simple rolling update - Brendan

    * Rolling update = nice example of why RCs and Pods are good.

    * ...pause… (Brendan needs demo recovery tips from Kelsey)

    * Rolling update has recovery: Cancel update and restart, update continues from where it stopped.

    * New controller  gets name of old controller, so appearance is pure update.

    * Can also name versions in update (won't do rename at the end).

-->

* 簡單的滾動更新 - Brendan

    * 滾動更新 = RCs和Pods很好的例子。

    * ...pause… (Brendan 需要 Kelsey 的演示恢復技巧)

    * 滾動更新具有恢復功能:取消更新並重新啟動，更新從停止的地方繼續。

    * 新控制器獲取舊控制器的名稱，因此外觀是純粹的更新。

    * 還可以在 update 中命名版本(最後不會重新命名)。

<!--

* Rocket demo - CoreOS folks

    * 2 major differences between rocket & docker: Rocket is daemonless & pod-centric.

    * Rocket has AppContainer format as native, but also supports docker image format.

    * Can run AppContainer and docker containers in same pod.

    * Changes are close to merged.

-->

* Rocket 演示 - CoreOS 的夥計們

    * Rocket 和 docker 之間的主要區別: Rocket 是無守護程序和以 pod 為中心。。

    * Rocket 具有原生的 AppContainer 格式，但也支援 docker 映象格式。

    * 可以在同一個 pod 中執行 AppContainer 和 docker 容器。

    * 變更接近於合併。

<!--

* demo service accounts and secrets being added to pods - Jordan

    * Problem: It's hard to get a token to talk to the API.

    * New API object: "ServiceAccount"

    * ServiceAccount is namespaced, controller makes sure that at least 1 default service account exists in a namespace.

    * Typed secret "ServiceAccountToken", controller makes sure there is at least 1 default token.

    * DEMO

    *     * Can create new service account with ServiceAccountToken. Controller will create token for it.

    * Can create a pod with service account, pods will have service account secret mounted at /var/run/secrets/kubernetes.io/…

-->

* 演示 service accounts 和 secrets 被新增到 pod - Jordan

    * 問題：很難獲得與API通訊的令牌。

    * 新的API物件："ServiceAccount"

    * ServiceAccount 是名稱空間，控制器確保名稱空間中至少存在一個個預設 service account。

    * 鍵入 "ServiceAccountToken"，控制器確保至少有一個預設令牌。

    * 演示

    *     * 可以使用 ServiceAccountToken 建立新的 service account。控制器將為它建立令牌。

    * 可以建立一個帶有 service account 的 pod, pod 將在 /var/run/secrets/kubernetes.io/…

<!--

* Kubelet running in a container - Paul

    * Kubelet successfully ran pod w/ mounted secret.

-->

* Kubelet 在容器中執行 - Paul

    * Kubelet 成功地運行了帶有 secret 的 pod。

