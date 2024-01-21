---
title: "Kubernetes 社区会议记录 - 20160218"
date: 2016-02-23
slug: kubernetes-community-meeting-notes_23
---

<!--
---
title: " Kubernetes Community Meeting Notes - 20160218 "
date: 2016-02-23
slug: kubernetes-community-meeting-notes_23
url: /blog/2016/02/Kubernetes-community-meeting-notes-20160128
---
-->

<!--
#####  February 18th - kmachine demo, clusterops SIG formed, new k8s.io website preview, 1.2 update and planning 1.3
The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via videoconference. Here are the notes from the latest meeting.
-->
##### 2月18号 - kmachine 演示、SIG clusterops 成立、新的 k8s.io 网站预览、1.2 版本更新和 1.3 版本计划
Kubernetes 贡献社区会议大多在星期四的 10:00 召开，通过视频会议讨论项目现有情况。这里是最近一次会议的笔记。

<!--
* Note taker: Rob Hirschfeld
* Demo (10 min): [kmachine][1] [Sebastien Goasguen]
    * started :01 intro video
    * looking to create mirror of Docker tools for Kubernetes (similar to machine, compose, etc)
    * kmachine (forked from Docker Machine, so has the same endpoints)
-->
* 记录员: Rob Hirschfeld
* 示例 (10 min): [kmachine][1] [Sebastien Goasguen]
    * 开始 :01 视频介绍
    * 为 Kubernetes 创建 Docker tools 的镜像 （例如 machine,compose 等等）
    * kmachine （ 它是 Docker Machine的一个分叉, 因此两者有相同的 endpoints）


<!--
* Use Case (10 min): started at :15
-->
* 演示案例 (10 min): 开始时间 :15

<!--
* SIG Report starter
    * Cluster Ops launch meeting Friday ([doc][2]). [Rob Hirschfeld]
-->
* SIG 汇报启动会
    * 周五进行 Cluster Ops 启动会 ([doc][2]). [Rob Hirschfeld]

<!--
* Time Zone Discussion [:22]
    * This timezone does not work for Asia.  
    * Considering rotation - once per month
    * Likely 5 or 6 PT
    * Rob suggested moving the regular meeting up a little
-->
* 时区讨论 [:22]
    * 当前时区不适合亚洲。
    * 考虑轮转时间 - 每一个月一次
    * 大约 5 或者 6 PT
    * Rob 建议把例会时间上调一些

<!--
* k8s.io website preview [John Mulhausen] [:27]
    * using github for docs.  you can fork and do a pull request against the site
    * will be its own kubernetes organization BUT not in the code repo
    * Google will offer a "doc bounty" where you can get GCP credits for working on docs
    * Uses Jekyll to generate the site (e.g. the ToC)
    * Principle will be to 100% GitHub Pages; no script trickery or plugins, just fork/clone, edit, and push
    * Hope to launch at Kubecon EU
    * Home Page Only Preview: http://kub.unitedcreations.xyz
-->
* k8s.io 网站 概述 [John Mulhausen] [:27]
    * 使用 github 进行文档操作。你可以通过网站进行 fork 操作并且做一个 pull request 请求
    * Google 将会提供一个 "doc bounty"，"doc bounty" 是一个让你得到 GCP 积分来为你的文档使用的地方
    * 使用 Jekyll 创建网站 (例如 the ToC)
    * 100% 使用 GitHub 页面原则; 没有脚本或者插件外挂, 仅仅只有 fork/clone，edit，和 push 操作
    * 希望能在 Kubecon EU 启动
    * 主页唯一概述地址: http://kub.unitedcreations.xyz

<!--
* 1.2 Release Watch [T.J. Goltermann] [:38]
* 1.3 Planning update [T.J. Goltermann]
* GSoC participation -- deadline 2/19  [Sarah Novotny]
* March 10th meeting? [Sarah Novotny]
-->
* 1.2 版本观看 [T.J. Goltermann] [:38]
* 1.3 版本更新计划 [T.J. Goltermann]
* GSoC 分享会 -- 截止日期 2月19号  [Sarah Novotny]
* 3月10号 会议? [Sarah Novotny]

<!--
To get involved in the Kubernetes community consider joining our [Slack channel][3], taking a look at the [Kubernetes project][4] on GitHub, or join the [Kubernetes-dev Google group][5]. 
-->
想要加入 Kubernetes 社区的人，考虑加入 [Slack channel] [3]频道，
在 GitHub 上看看[Kubernetes project][4]，
或者加入[Kubernetes-dev Google group][5]。


<!--
If you're really excited, you can do all of the above and join us for the next community conversation — February 25th, 2016. 
-->
如果你对此真的充满激情，你可以做完上述所有事情并加入我们的下一次社区对话 - 在2016年2月25日。

<!--
Please add yourself or a topic you want to know about to the [agenda][6] and get a calendar invitation by joining [this group][7]. 
-->
请将您自己或您想了解的主题添加到[agenda][6]，加入[this group][7]组即可获得日历邀请。


<!--
 "https://youtu.be/L5BgX2VJhlY?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ"
-->
"https://youtu.be/L5BgX2VJhlY?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ"

<!--
_\-- Kubernetes Community_

[1]: https://github.com/skippbox/kmachine
[2]: https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit#
[3]: http://slack.k8s.io/
[4]: https://github.com/kubernetes/
[5]: https://groups.google.com/forum/#!forum/kubernetes-dev
[6]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[7]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
-->
_\-- Kubernetes 社区 _

[1]: https://github.com/skippbox/kmachine
[2]: https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit#
[3]: http://slack.k8s.io/
[4]: https://github.com/kubernetes/
[5]: https://groups.google.com/forum/#!forum/kubernetes-dev
[6]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[7]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat


