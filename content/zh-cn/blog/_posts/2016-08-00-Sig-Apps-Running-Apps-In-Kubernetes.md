---
layout: blog
title: 'SIG Apps: 为 Kubernetes 构建应用并在 Kubernetes 中进行运维'
date: 2016-08-16
slug: sig-apps-running-apps-in-kubernetes
---
<!--
title: " SIG Apps: build apps for and operate them in Kubernetes "
date: 2016-08-16
slug: sig-apps-running-apps-in-kubernetes
canonicalUrl: https://kubernetes.io/blog/2016/08/sig-apps-running-apps-in-kubernetes/
url: /blog/2016/08/Sig-Apps-Running-Apps-In-Kubernetes
-->

<!--
_Editor’s note: This post is by the Kubernetes SIG-Apps team sharing how they focus on the developer and devops experience of running applications in Kubernetes._  

Kubernetes is an incredible manager for containerized applications. Because of this, [numerous](https://kubernetes.io/blog/2016/02/sharethis-kubernetes-in-production) [companies](https://blog.box.com/blog/kubernetes-box-microservices-maximum-velocity/) [have](http://techblog.yahoo.co.jp/infrastructure/os_n_k8s/) [started](http://www.nextplatform.com/2015/11/12/inside-ebays-shift-to-kubernetes-and-containers-atop-openstack/) to run their applications in Kubernetes.  

Kubernetes Special Interest Groups ([SIGs](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig)) have been around to support the community of developers and operators since around the 1.0 release. People organized around networking, storage, scaling and other operational areas.  

As Kubernetes took off, so did the need for tools, best practices, and discussions around building and operating cloud native applications. To fill that need the Kubernetes [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) came into existence.  

SIG Apps is a place where companies and individuals can:
-->  

**编者注**：这篇文章由 Kubernetes SIG-Apps 团队撰写，分享他们如何关注在 Kubernetes
中运行应用的开发者和 devops 经验。

Kubernetes 是容器化应用程序的出色管理者。因此，[众多](https://kubernetes.io/blog/2016/02/sharethis-kubernetes-in-production)
[公司](https://blog.box.com/blog/kubernetes-box-microservices-maximum-velocity/)
[已经](http://techblog.yahoo.co.jp/infrastructure/os_n_k8s/)
[开始](http://www.nextplatform.com/2015/11/12/inside-ebays-shift-to-kubernetes-and-containers-atop-openstack/) 在 Kubernetes 中运行应用程序。

Kubernetes 特殊兴趣小组 ([SIGs](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig))
自 1.0 版本开始就一直致力于支持开发者和运营商社区。围绕网络、存储、扩展和其他运营领域组织的人员。

随着 Kubernetes 的兴起，对工具、最佳实践以及围绕构建和运营云原生应用程序的讨论的需求也随之增加。为了满足这一需求，
Kubernetes [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 应运而生。

SIG Apps 为公司和个人提供以下支持：

<!--
- see and share demos of the tools being built to enable app operators
- learn about and discuss needs of app operators
- organize around efforts to improve the experience
- -->

- 查看和分享正在构建的、为应用操作人员赋能的工具的演示
- 了解和讨论应用运营人员的需求
- 组织各方努力改善体验

<!--
Since the inception of SIG Apps we’ve had demos of projects like [KubeFuse](https://github.com/opencredo/kubefuse), [KPM](https://github.com/kubespray/kpm), and [StackSmith](https://stacksmith.bitnami.com/). We’ve also executed on a survey of those operating apps in Kubernetes.  

From the survey results we’ve learned a number of things including:
-->  

自从 SIG Apps 成立以来，我们已经进行了项目演示，例如 [KubeFuse](https://github.com/opencredo/kubefuse)、
[KPM](https://github.com/kubespray/kpm)，和 [StackSmith](https://stacksmith.bitnami.com/)。 
我们还对那些负责 Kubernetes 中应用运维的人进行了调查。

从调查结果中，我们学到了很多东西，包括：

<!--
- That 81% of respondents want some form of autoscaling
- To store secret information 47% of respondents use built-in secrets. At reset these are not currently encrypted. (If you want to help add encryption there is an [issue](https://github.com/kubernetes/kubernetes/issues/10439) for that.)&nbsp;
- The most responded questions had to do with 3rd party tools and debugging
- For 3rd party tools to manage applications there were no clear winners. There are a wide variety of practices
- An overall complaint about a lack of useful documentation. (Help contribute to the docs [here](https://github.com/kubernetes/kubernetes.github.io).)
- There’s a lot of data. Many of the responses were optional so we were surprised that 935 of all questions across all candidates were filled in. If you want to look at the data yourself it’s [available online](https://docs.google.com/spreadsheets/d/15SUL7QTpR4Flrp5eJ5TR8A5ZAFwbchfX2QL4MEoJFQ8/edit?usp=sharing).
-->

- 81% 的受访者希望采用某种形式的自动扩缩
- 为了存储秘密信息，47% 的受访者使用内置 Secret。目前这些资料并未实现静态加密。 
  （如果你需要关于加密的帮助，请参见[问题](https://github.com/kubernetes/kubernetes/issues/10439)。)
- 响应最多的问题与第三方工具和调试有关
- 对于管理应用程序的第三方工具，没有明确的赢家。有各种各样的做法
- 总体上对缺乏有用文件有较多抱怨。（请在[此处](https://github.com/kubernetes/kubernetes.github.io)帮助提交文档。）
- 数据量很大。很多回答是可选的，所以我们很惊讶所有候选人的所有问题中有 935 个都被填写了。
  如果你想亲自查看数据，可以[在线](https://docs.google.com/spreadsheets/d/15SUL7QTpR4Flrp5eJ5TR8A5ZAFwbchfX2QL4MEoJFQ8/edit?usp=sharing)查看。

<!--
When it comes to application operation there’s still a lot to be figured out and shared. If you've got opinions about running apps, tooling to make the experience better, or just want to lurk and learn about what's going please come join us.
-->  

就应用运维而言，仍然有很多东西需要解决和共享。如果你对运行应用程序有看法或者有改善体验的工具，
或者只是想潜伏并了解状况，请加入我们。

<!--
- Chat with us on SIG-Apps [Slack channel](https://kubernetes.slack.com/messages/sig-apps)
- Email as at SIG-Apps [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-apps)
- Join our open meetings: weekly at 9AM PT on Wednesdays, [full details here](https://github.com/kubernetes/community/blob/master/sig-apps/README.md#meeting).
-->

- 在 SIG-Apps [Slack 频道](https://kubernetes.slack.com/messages/sig-apps)与我们聊天
- 发送邮件到 SIG-Apps [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-apps)
- 参加我们的公开会议：太平洋时间每周三上午 9 点，[详情点击此处](https://github.com/kubernetes/community/blob/master/sig-apps/README.md#meeting)

<!--
_--Matt Farina, Principal Engineer, Hewlett Packard Enterprise_
-->  
_--Matt Farina ，Hewlett Packard Enterprise 首席工程师_ 