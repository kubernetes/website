---
title: " Kubernetes 社区会议记录 - 20160114 "
date: 2016-01-28
slug: kubernetes-community-meeting-notes
---
<!--
---
title: " Kubernetes Community Meeting Notes - 20160114 "
date: 2016-01-28
slug: kubernetes-community-meeting-notes
url: /zh/blog/2016/01/Kubernetes-Community-Meeting-Notes
---
-->
<!--
#####  January 14 - RackN demo, testing woes, and KubeCon EU CFP.
---
 Note taker: Joe Beda
---
-->
#####  1 月 14 日 - RackN 演示、测试问题和 KubeCon EU CFP。
---
 记录者：Joe Beda
---
<!--
* Demonstration: Automated Deploy on Metal, AWS and others w/ Digital Rebar, Rob Hirschfeld  and Greg Althaus from RackN

    * Greg Althaus. CTO.  Digital Rebar is the product.  Bare metal provisioning tool.

    * Detect hardware, bring it up, configure raid, OS and get workload deployed.

    * Been working on Kubernetes workload.

    * Seeing trend to start in cloud and then move back to bare metal.

    * New provider model to use provisioning system on both cloud and bare metal.

    * UI, REST API, CLI

    * Demo: Packet -- bare metal as a service

        * 4 nodes running grouped into a "deployment"

        * Functional roles/operations selected per node.

        * Decomposed the kubernetes bring up into units that can be ordered and synchronized.  Dependency tree -- things like wait for etcd to be up before starting k8s master.

        * Using the Ansible playbook under the covers.

        * Demo brings up 5 more nodes -- packet will build those nodes

        * Pulled out basic parameters from the ansible playbook.  Things like the network config, dns set up, etc.

        * Hierarchy of roles pulls in other components -- making a node a master brings in a bunch of other roles that are necessary for that.

        * Has all of this combined into a command line tool with a simple config file.

    * Forward: extending across multiple clouds for test deployments.  Also looking to create split/replicated across bare metal and cloud.

    * Q: secrets?   
A: using ansible playbooks.  Builds own certs and then distributes them.  Wants to abstract them out and push that stuff upstream.

    * Q: Do you support bringing up from real bare metal with PXE boot?   
A: yes -- will discover bare metal systems and install OS, install ssh keys, build networking, etc.
-->
* 演示：在 Metal，AWS 和其他平台上使用 Digital Rebar 自动化部署，来自 RackN 的 Rob Hirschfeld 和 Greg Althaus。

    * Greg Althaus。首席技术官。Digital Rebar 是产品。裸机置备工具。

    * 检测硬件，启动硬件，配置 RAID、操作系统并部署工作负载。

    * 处理 Kubernetes 的工作负载。

    * 看到始于云，然后又回到裸机的趋势。

    * 新的提供商模型可以在云和裸机上使用预配置系统。

    * UI, REST API, CLI

    * 演示：数据包--裸机即服务

        * 4个正在运行的节点归为一个“部署”

        * 每个节点选择的功能性角色/操作。

        * 分解的 kubernetes 带入可以订购和同步的单元。依赖关系树--诸如在启动 k8s master 之前等待 etcd 启动的事情。

        * 在封面下使用 Ansible。

        * 演示带来了另外5个节点--数据包将构建这些节点

        * 从 ansible 中提取基本参数。诸如网络配置，DNS 设置等内容。

        * 角色层次结构引入了其他组件--使节点成为主节点会带来一系列其他必要的角色。

        * 通过简单的配置文件将所有这些组合到命令行工具中。

    * 转发：扩展到多个云以进行测试部署。还希望在裸机和云之间创建拆分/复制。

    * 问：秘密？  
答：使用 Ansible。构建自己的证书，然后分发它们。想要将它们抽象出来并将其推入上游。

    * 问：您是否支持使用 PXE 引导从真正的裸机启动？   
答：是的--将发现裸机系统并安装操作系统，安装 ssh 密钥，建立网络等。
<!--
* [from SIG-scalability] Q: What is the status of moving to golang 1.5?  
A: At HEAD we are 1.5 but will support 1.4 also. Some issues with flakiness but looks like things are stable now.  

    * Also looking to use the 1.5 vendor experiment.  Move away from godep.  But can't do that until 1.5 is the baseline.

    * Sarah: one of the things we are working on is rewards for doing stuff like this.  Cloud credits, tshirts, poker chips, ponies.
* [from SIG-scalability] Q: What is the status of cleaning up the jenkins based submit queue? What can the community do to help out?  
A: It has been rocky the last few days.  There should be issues associated with each of these. There is a [flake label][1] on those issues.  

    * Still working on test federation.  More test resources now.  Happening slowly but hopefully faster as new people come up to speed.  Will be great to having lots of folks doing e2e tests on their environments.

    * Erick Fjeta is the new test lead

    * Brendan is happy to help share details on Jenkins set up but that shouldn't be necessary.

    * Federation may use Jenkins API but doesn't require Jenkins itself.

    * Joe bitches about the fact that running the e2e tests in the way Jenkins is tricky.  Brendan says it should be runnable easily.  Joe will take another look.

    * Conformance tests? etune did this but he isn't here.  - revisit 20150121
-->
* [来自 SIG-scalability]问：转到 golang 1.5 的状态如何？  
答：在 HEAD，我们是1.5，但也会支持1.4。有一些跟稳定性相关的问题，但看起来现在情况稳定了。  

    * 还希望使用1.5供应商实验。不再使用 godep。但只有在基线为1.5之前，才能这样做。

    * Sarah：现在我们正在工作的事情之一就是提供做这些事的小奖品。云积分，T恤，扑克筹码，小马。
* [来自可伸缩性兴趣小组]问：清理基于 jenkins 的提交队列的状态如何？社区可以做些什么来帮助您？  
答：最近几天一直很艰难。每个方面都应该有相关的问题。在这些问题上有一个[片状标签][1]。  

    * 仍在进行联盟测试。现在有更多测试资源。随着新人们的进步，事情有希望进展的更快。这对让很多人在他们的环境中进行端到端测试非常有用。

    * Erick Fjeta 是新的测试负责人

    * Brendan很乐意帮助分享有关 Jenkins 设置的详细信息，但这不是必须的。

    * 联盟可以使用 Jenkins API，但不需要 Jenkins 本身。

    * Joe 嘲笑以 Jenkins 的方式运行 e2e 测试是一件棘手的事实。布伦丹说，它应该易于运行。乔再看一眼。

    * 符合性测试？ etune 做到了，但他不在。 -重新访问20150121
<!--
*     * March 10-11 in London.  Venue to be announced this week.

    * Please send talks!  CFP deadline looks to be Feb 5.

    * Lots of excitement.  Looks to be 700-800 people.  Bigger than SF version (560 ppl).

    * Buy tickets early -- early bird prices will end soon and price will go up 100 GBP.

    * Accommodations provided for speakers?

    * Q from Bob @ Samsung: Can we get more warning/planning for stuff like this:

        * A: Sarah -- I don't hear about this stuff much in advance but will try to pull together a list.  Working to make the events page on kubernetes.io easier to use.

        * A: JJ -- we'll make sure we give more info earlier for the next US conf.
-->
*     * 3月10日至11日在伦敦举行。地点将于本周宣布。

    * 请发送讲话！CFP 截止日期为2月5日。

    * 令人兴奋。看起来是700-800人。比SF版本大（560 人）。

    * 提前购买门票--早起的鸟儿价格将很快结束，价格将上涨到100英镑。

    * 为演讲者提供住宿吗？

    * 三星 Bob 的提问：我们可以针对以下问题获得更多警告/计划吗：

        * 答：Sarah -- 我不太早就听说过这些东西，但会尝试整理一下清单。努力使 kubernetes.io 上的事件页面更易于使用。

        * 答：JJ -- 我们将确保我们早日为下届美国会议提供更多信息。
<!--
* Scale tests [Rob Hirschfeld from RackN] -- if you want to help coordinate on scale tests we'd love to help.

    * Bob invited Rob to join the SIG-scale group.

    * There is also a big bare metal cluster through the CNCF (from Intel) that will be useful too.  No hard dates yet on that.
* Notes/video going to be posted on k8s blog. (Video for 20150114 wasn't recorded.  Fail.)

To get involved in the Kubernetes community consider joining our [Slack channel][2], taking a look at the [Kubernetes project][3] on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation - January 27th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].
-->
* 规模测试[RackN 的 Rob Hirschfeld] -- 如果您想帮助进行规模测试，我们将非常乐意为您提供帮助。

    * Bob 邀请 Rob 加入规模特别兴趣小组。

    * 还有一个大型的裸机集群，通过 CNCF（来自 Intel）也很有用。尚无确切日期。
* 笔记/视频将发布在 k8s 博客上。（未录制20150114的视频。失败。）

要加入 Kubernetes 社区，请考虑加入我们的[Slack 频道][2]，看看GitHub上的[Kubernetes 项目][3]，或加入[Kubernetes-dev Google 论坛][4]。如果您真的对此感到兴奋，则可以完成上述所有操作，并加入我们的下一次社区对话-2016年1月27日。请将您自己或您想了解的话题添加到[议程][5]中，并获得一个加入[此群组][6]进行日历邀请。    



[1]: https://github.com/kubernetes/kubernetes/labels/kind%2Fflake
[2]: http://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
