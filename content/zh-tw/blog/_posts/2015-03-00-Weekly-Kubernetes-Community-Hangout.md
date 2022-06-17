---
title: " Kubernetes 社群每週聚會筆記 - 2015年3月27日 "
date: 2015-03-28
slug: weekly-kubernetes-community-hangout
---

<!--
---
title: " Weekly Kubernetes Community Hangout Notes - March 27 2015 "
date: 2015-03-28
slug: weekly-kubernetes-community-hangout
url: /zh-cn/blog/2015/03/Weekly-Kubernetes-Community-Hangout
---
-->

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.
-->
每個星期，Kubernetes 貢獻者社群幾乎都會在谷歌 Hangouts 上聚會。我們希望任何對此感興趣的人都能瞭解這個論壇的討論內容。

<!--
Agenda:
-->
日程安排：

<!--

\- Andy - demo remote execution and port forwarding

\- Quinton - Cluster federation - Postponed

\- Clayton - UI code sharing and collaboration around Kubernetes

-->

\- Andy - 演示遠端執行和埠轉發

\- Quinton - 聯邦叢集 - 延遲

\- Clayton - 圍繞 Kubernetes 的 UI 程式碼共享和協作

<!--
Notes from meeting:
-->
從會議指出：

<!--

1\. Andy from RedHat:

-->

1\. Andy 從 RedHat：

<!--

* Demo remote execution

-->

* 演示遠端執行

<!--

    * kubectl exec -p $POD -- $CMD

    * Makes a connection to the master as proxy, figures out which node the pod is on, proxies connection to kubelet, which does the interesting bit.  via nsenter.

    * Multiplexed streaming over HTTP using SPDY

    * Also interactive mode:

    * Assumes first container.  Can use -c $CONTAINER to pick a particular one.

    * If have gdb pre-installed in container, then can interactively attach it to running process

        * backtrace, symbol tbles, print, etc.  Most things you can do with gdb.

    * Can also with careful flag crafting run rsync over this or set up sshd inside container.

    * Some feedback via chat:

-->

    * kubectl exec -p $POD -- $CMD

    * 作為代理與主機建立連線，找出 pod 所在的節點，代理與 kubelet 的連線，這一點很有趣。透過 nsenter。

    * 使用 SPDY 透過 HTTP 進行多路複用流式傳輸

    * 還有互動模式：

    * 假設第一個容器，可以使用 -c $CONTAINER 一個特定的。

    * 如果在容器中預先安裝了 gdb，則可以互動地將其附加到正在執行的程序中

        * backtrace、symbol tbles、print 等。  使用gdb可以做的大多數事情。

    * 也可以用精心製作的引數在上面執行 rsync 或者在容器內設定 sshd。

    * 一些聊天反饋：

<!--

* Andy also demoed port forwarding
* nsenter vs. docker exec

-->

* Andy 還演示了埠轉發
* nnsenter 與 docker exec

<!--

    * want to inject a binary under control of the host, similar to pre-start hooks

    * socat, nsenter, whatever the pre-start hook needs

-->

    * 想要在主機的控制下注入二進位制檔案，類似於預啟動鉤子

    * socat、nsenter，任何預啟動鉤子需要的

<!--

* would be nice to blog post on this
* version of nginx in wheezy is too old to support needed master-proxy functionality

-->

* 如果能在部落格上發表這方面的文章就太好了
* wheezy 中的 nginx 版本太舊，無法支援所需的主代理功能

<!--

2\. Clayton: where are we wrt a community organization for e.g. kubernetes UI components?

* google-containers-ui IRC channel, mailing list.
* Tim: google-containers prefix is historical, should just do "kubernetes-ui"
* also want to put design resources in, and bower expects its own repo.
* General agreement

-->

2\. Clayton: 我們的社群組織在哪裡，例如 kubernetes UI 元件？

* google-containers-ui IRC 頻道，郵件列表。
* Tim: google-containers 字首是歷史的，應該只做 "kubernetes-ui"
* 也希望將設計資源投入使用，並且 bower 期望自己的倉庫。
* 通用協議

<!--

3\. Brian Grant:

* Testing v1beta3, getting that ready to go in.
* Paul working on changes to commandline stuff.
* Early to mid next week, try to enable v1beta3 by default?
* For any other changes, file issue and CC thockin.

-->

3\. Brian Grant:

* 測試 v1beta3，準備進入。
* Paul 致力於改變命令列的內容。
* 下週初至中旬，嘗試預設啟用v1beta3 ?
* 對於任何其他更改，請發出檔案並抄送 thockin。

<!--

4\. General consensus that 30 minutes is better than 60

-->

4\. 一般認為30分鐘比60分鐘好

<!--

* Shouldn't artificially try to extend just to fill time.

-->

* 不應該為了填滿時間而人為地延長。
