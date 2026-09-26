---
title: "Kubernetes 社区每周聚会笔记 - 2015 年 3 月 27 日"
date: 2015-03-28
slug: weekly-kubernetes-community-hangout
---
<!--
title: " Weekly Kubernetes Community Hangout Notes - March 27 2015 "
date: 2015-03-28
slug: weekly-kubernetes-community-hangout
url: /blog/2015/03/Weekly-Kubernetes-Community-Hangout
-->

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.
-->
每个星期，Kubernetes 贡献者社区几乎都会在谷歌 Hangouts 上聚会。我们希望任何对此感兴趣的人都能了解这个论坛的讨论内容。

<!--
Agenda:
-->
日程安排：

<!--

\- Andy - demo remote execution and port forwarding

\- Quinton - Cluster federation - Postponed

\- Clayton - UI code sharing and collaboration around Kubernetes

-->

\- Andy - 演示远程执行和端口转发

\- Quinton - 联邦集群 - 延迟

\- Clayton - 围绕 Kubernetes 的 UI 代码共享和协作

<!--
Notes from meeting:
-->
从会议指出：

<!--

1\. Andy from RedHat:

-->

1\. Andy 从 RedHat：

<!--

* Demo remote execution

-->

* 演示远程执行

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

    * 作为代理与主机建立连接，找出 pod 所在的节点，代理与 kubelet 的连接，这一点很有趣。通过 nsenter。

    * 使用 SPDY 通过 HTTP 进行多路复用流式传输

    * 还有互动模式：

    * 假设第一个容器，可以使用 -c $CONTAINER 一个特定的。

    * 如果在容器中预先安装了 gdb，则可以交互地将其附加到正在运行的进程中

        * backtrace、symbol tbles、print 等。  使用gdb可以做的大多数事情。

    * 也可以用精心制作的参数在上面运行 rsync 或者在容器内设置 sshd。

    * 一些聊天反馈：

<!--

* Andy also demoed port forwarding
* nsenter vs. docker exec

-->

* Andy 还演示了端口转发
* nnsenter 与 docker exec

<!--

    * want to inject a binary under control of the host, similar to pre-start hooks

    * socat, nsenter, whatever the pre-start hook needs

-->

    * 想要在主机的控制下注入二进制文件，类似于预启动钩子

    * socat、nsenter，任何预启动钩子需要的

<!--

* would be nice to blog post on this
* version of nginx in wheezy is too old to support needed master-proxy functionality

-->

* 如果能在博客上发表这方面的文章就太好了
* wheezy 中的 nginx 版本太旧，无法支持所需的主代理功能

<!--

2\. Clayton: where are we wrt a community organization for e.g. kubernetes UI components?

* google-containers-ui IRC channel, mailing list.
* Tim: google-containers prefix is historical, should just do "kubernetes-ui"
* also want to put design resources in, and bower expects its own repo.
* General agreement

-->

2\. Clayton: 我们的社区组织在哪里，例如 kubernetes UI 组件？

* google-containers-ui IRC 频道，邮件列表。
* Tim: google-containers 前缀是历史的，应该只做 "kubernetes-ui"
* 也希望将设计资源投入使用，并且 bower 期望自己的仓库。
* 通用协议

<!--

3\. Brian Grant:

* Testing v1beta3, getting that ready to go in.
* Paul working on changes to commandline stuff.
* Early to mid next week, try to enable v1beta3 by default?
* For any other changes, file issue and CC thockin.

-->

3\. Brian Grant:

* 测试 v1beta3，准备进入。
* Paul 致力于改变命令行的内容。
* 下周初至中旬，尝试默认启用v1beta3 ?
* 对于任何其他更改，请发出文件并抄送 thockin。

<!--

4\. General consensus that 30 minutes is better than 60

-->

4\. 一般认为30分钟比60分钟好

<!--

* Shouldn't artificially try to extend just to fill time.

-->

* 不应该为了填满时间而人为地延长。
