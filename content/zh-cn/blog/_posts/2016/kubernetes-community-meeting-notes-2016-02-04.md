---
title: " Kubernetes 社区会议记录 - 20160204 "
date: 2016-02-09
slug: kubernetes-community-meeting-notes
---
<!--
title: " Kubernetes community meeting notes - 20160204 "
date: 2016-02-09
slug: kubernetes-community-meeting-notes
url: /blog/2016/02/Kubernetes-Community-Meeting-Notes
-->

<!--
####  February 4th - rkt demo (congratulations on the 1.0, CoreOS!), eBay puts k8s on Openstack and considers Openstack on k8s, SIGs, and flaky test surge makes progress.
-->
####  2 月 4 日 - rkt 演示（祝贺 1.0 版本，CoreOS！），eBay 将 k8s 放在 Openstack 上并认为 Openstack 在 k8s，SIG 和片状测试激增方面取得了进展。

<!--
The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via a videoconference. Here are the notes from the latest meeting.
-->
Kubernetes 贡献社区在每周四 10:00 PT 开会,通过视频会议讨论项目状态。以下是最近一次会议的笔记。

<!--
* Note taker: Rob Hirschfeld
* Demo (20 min): CoreOS rkt + Kubernetes [Shaya Potter]
    * expect to see integrations w/ rkt & k8s in the coming months ("rkt-netes"). not integrated into the v1.2 release.
    * Shaya gave a demo (8 minutes into meeting for video reference)
        * CLI of rkt shown spinning up containers
        * [note: audio is garbled at points]
        * Discussion about integration w/ k8s & rkt
        * rkt community sync next week: https://groups.google.com/forum/#!topic/rkt-dev/FlwZVIEJGbY
        * Dawn Chen:
            * The remaining issues of integrating rkt with kubernetes: 1) cadivsor 2) DNS 3) bugs related to logging
            * But need more work on e2e test suites
-->
* 书记员：Rob Hirschfeld
* 演示视频（20 分钟）：CoreOS rkt + Kubernetes [Shaya Potter]
    * 期待在未来几个月内看到与rkt和k8s的整合（“rkt-netes”）。 还没有集成到 v1.2 版本中。
    * Shaya 做了一个演示（8分钟的会议视频参考）
        * rkt 的 CLI 显示了旋转容器
        * [注意：音频在点数上是乱码]
        * 关于 k8s&rkt 整合的讨论
        * 下周 rkt 社区同步： https://groups.google.com/forum/#!topic/rkt-dev/FlwZVIEJGbY
        * Dawn Chen:
            * 将 rkt 与 kubernetes 集成的其余问题：1）cadivsor 2） DNS 3）与日志记录相关的错误
            * 但是需要在 e2e 测试套件上做更多的工作
<!--
* Use Case (10 min): eBay k8s on OpenStack and OpenStack on k8s [Ashwin Raveendran]
    * eBay is currently running Kubernetes on OpenStack
    * Goal for eBay is to manage the OpenStack control plane w/ k8s.  Goal would be to achieve upgrades
    * OpenStack Kolla creates containers for the control plane.  Uses Ansible+Docker for management of the containers.
    * Working on k8s control plan management - Saltstack is proving to be a management challenge at the scale they want to operate.  Looking for automated management of the k8s control plane.
-->
* 用例（10分钟）：在 OpenStack 上的 eBay k8s 和 k8s 上的 OpenStack [Ashwin Raveendran]
    * eBay 目前正在 OpenStack 上运行 Kubernetes
    * eBay 的目标是管理带有 k8s 的 OpenStack 控制平面。目标是实现升级。
    * OpenStack Kolla 为控制平面创建容器。使用 Ansible+Docker 来管理容器。
    * 致力于 k8s 控制计划管理 - Saltstack 被证明是他们想运营的规模的管理挑战。寻找 k8s 控制平面的自动化管理。
<!--
* SIG Report
* Testing update [Jeff, Joe, and Erick]
    * Working to make the workflow about contributing to K8s easier to understanding
        * [pull/19714][1] has flow chart of the bot flow to help users understand
    * Need a consistent way to run tests w/ hacking config scripts (you have to fake a Jenkins process right now)
    * Want to create necessary infrastructure to make test setup less flaky
    * want to decouple test start (single or full) from Jenkins
    * goal is to get to point where you have 1 script to run that can be pointed to any cluster
    * demo included Google internal views - working to try get that external.
    * want to be able to collect test run results
    * Bob Wise calls for testing infrastructure to be a blocker on v1.3
    * Long discussion about testing practices…
        * consensus that we want to have tests work over multiple platforms.
        * would be helpful to have a comprehensive state dump for test reports
        * "phone-home" to collect stack traces - should be available
-->
*  SIG 报告
*  测试更新 [Jeff, Joe, 和 Erick]
    *  努力使有助于 K8s 的工作流程更容易理解
        * [pull/19714][1]有 bot 流程图来帮助用户理解
    *  需要一种一致的方法来运行测试 w/hacking 配置脚本（你现在必须伪造一个 Jenkins 进程）
    *  想要创建必要的基础设施，使测试设置不那么薄弱
    *  想要将测试开始（单次或完整）与 Jenkins分离
    *  目标是指出你有一个可以指向任何集群的脚本
    *  演示包括 Google 内部视图 - 努力尝试获取外部视图。
    *  希望能够收集测试运行结果
    *  Bob Wise 不赞同在 v1.3 版本进行测试方面的基础设施建设。
    *  关于测试实践的长期讨论…
       * 我们希望在多个平台上进行测试的共识。
       * 为测试报告提供一个全面转储会很有帮助
       * 可以使用"phone-home"收集异常


<!--
* 1.2 Release Watch
* CoC [Sarah]
* GSoC [Sarah]
-->
* 1.2发布观察
* CoC [Sarah]
* GSoC [Sarah]

<!--
To get involved in the Kubernetes community consider joining our [Slack channel][2], taking a look at the [Kubernetes project][3] on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation -- February 11th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].
-->
要参与 Kubernetes 社区，请考虑加入我们的 [Slack 频道][2]，查看 GitHub 上的
[Kubernetes 项目][3]，或加入 [Kubernetes-dev Google 小组][4]。
如果你真的很兴奋，你可以完成上述所有工作并加入我们的下一次社区对话 - 2016 年 2 月 11 日。
请将你自己或你想要了解的主题添加到[议程][5]并通过加入[此组][6]来获取日历邀请。

 "https://youtu.be/IScpP8Cj0hw?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ"


[1]: https://github.com/kubernetes/kubernetes/pull/19714
[2]: https://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
