---
title: " Kubernetes 社區每週環聊筆記——2015 年 7 月 31 日 "
date: 2015-08-04
slug: weekly-kubernetes-community-hangout
---
<!--
title: " Weekly Kubernetes Community Hangout Notes - July 31 2015 "
date: 2015-08-04
slug: weekly-kubernetes-community-hangout
url: /blog/2015/08/Weekly-Kubernetes-Community-Hangout
-->

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  

Here are the notes from today's meeting:  
-->

每週，Kubernetes 貢獻社區都會通過Google 環聊虛擬開會。我們希望任何有興趣的人都知道本論壇討論的內容。

這是今天會議的筆記：

<!--
* Private Registry Demo - Muhammed

    * Run docker-registry as an RC/Pod/Service

    * Run a proxy on every node

    * Access as localhost:5000

    * Discussion:

        * Should we back it by GCS or S3 when possible?

        * Run real registry backed by $object_store on each node

        * DNS instead of localhost?

            * disassemble image strings?

            * more like DNS policy?
-->
* 私有鏡像倉庫演示 - Muhammed

    * 將 docker-registry 作爲 RC/Pod/Service 運行

    * 在每個節點上運行代理

    * 以 localhost:5000 訪問

    * 討論：

        * 我們應該在可能的情況下通過 GCS 或 S3 支持它嗎？

        * 在每個節點上運行由 $object_store 支持的真實鏡像倉庫

        * DNS 代替 localhost？

            * 分解 docker 鏡像字符串？

            * 更像 DNS 策略嗎？
<!--
* Running Large Clusters - Joe

    * Samsung keen to see large scale O(1000)

        * Starting on AWS

    * RH also interested - test plan needed

    * Plan for next week: discuss working-groups

    * If you are interested in joining conversation on cluster scalability send mail to [joe@0xBEDA.com][4]
-->

* 運行大型集羣 - Joe

    * 三星渴望看到大規模 O(1000)

        * 從 AWS 開始

    * RH 也有興趣 - 需要測試計劃

    * 計劃下週：討論工作組

    * 如果您有興趣加入有關集羣可擴展性的對話，請發送郵件至[joe@0xBEDA.com][4]

<!--
* Resource API Proposal - Clayton

    * New stuff wants more info on resources

    * Proposal for resources API - ask apiserver for info on pods

    * Send feedback to: #11951

    * Discussion on snapshot vs time-series vs aggregates
-->

* 資源 API 提案 - Clayton

    * 新東西需要更多資源信息

    * 關於資源 API 的提案 - 向 apiserver 詢問有關pod的信息

    * 發送反饋至：#11951

    * 關於快照，時間序列和聚合的討論

<!--
* Containerized kubelet - Clayton

    * Open pull

    * Docker mount propagation - RH carries patches

    * Big issues around whole bootstrap of the system

        * dual: boot-docker/system-docker

    * Kube-in-docker is really nice, but maybe not critical

        * Do the small stuff to make progress

        * Keep pressure on docker
-->
* 容器化 kubelet - Clayton

    * 打開 pull

    * Docker掛載傳播 - RH 帶有補丁

    * 有關整個系統引導程序的大問題

        * 雙：引導docker /系統docker

    * Kube-in-docker非常好，但可能並不關鍵

        * 做些小事以取得進步

        * 對 docker 施加壓力
<!--
* Web UI (preilly)

    * Where does web UI stand?

        * OK to split it back out

        * Use it as a container image

        * Build image as part of kube release process

        * Vendor it back in?  Maybe, maybe not.

    * Will DNS be split out?

        * Probably more tightly integrated, instead

    * Other potential spin-outs:

        * apiserver

        * clients
-->
* Web UI（preilly）

    * Web UI 放在哪裏？

        * 確定將其拆分出去

        * 將其用作容器鏡像

        * 作爲 kube 發佈過程的一部分構建映像

        * vendor回來了嗎？也許吧，也許不是。

    * DNS將被拆分嗎？

        * 可能更緊密地集成在一起，而不是

    * 其他潛在的衍生產品：

        * apiserver

        * clients
