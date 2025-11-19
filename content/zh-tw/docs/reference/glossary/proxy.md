---
title: 代理（Proxy）
id: proxy
date: 2019-09-10
short_description: >
  充當客戶端和伺服器之間的中介的應用程序

aka:
tags:
- networking
---
<!--
---
title: Proxy
id: proxy
date: 2019-09-10
short_description: >
  An application acting as an intermediary beween clients and servers

aka:
tags:
- networking
---
-->
<!--
 In computing, a proxy is a server that acts as an intermediary for a remote
service.
-->
在計算機領域，代理指的是充當遠程服務中介的伺服器。


<!--more-->

<!--
A client interacts with the proxy; the proxy copies the client's data to the
actual server; the actual server replies to the proxy; the proxy sends the
actual server's reply to the client.
-->
客戶端與代理進行交互；代理將客戶端的數據複製到實際伺服器；實際伺服器回覆代理；代理將實際伺服器的回覆發送給客戶端。

<!--
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) is a
network proxy that runs on each node in your cluster, implementing part of
the Kubernetes {{< glossary_tooltip term_id="service">}} concept.
-->
[kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/) 是叢集中每個節點上運行的網路代理，實現了部分 Kubernetes {{< glossary_tooltip term_id="service">}} 概念。

<!--
You can run kube-proxy as a plain userland proxy service. If your operating
system supports it, you can instead run kube-proxy in a hybrid mode that
achieves the same overall effect using less system resources.
-->
你可以將 kube-proxy 作爲普通的使用者態代理服務運行。
如果你的操作系統支持，則可以在混合模式下運行 kube-proxy；該模式使用較少的系統資源即可達到相同的總體效果。

