---
title: Kubernetes 这四年
layout: blog
date: 2018-06-06
slug: 4-years-of-k8s
---
<!-- 
layout: blog
title: 4 Years of K8s
date: 2018-06-06
-->

<!--
**Author**: Joe Beda (CTO and Founder, Heptio)

On June 6, 2014 I checked in the [first commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56) of what would become the public repository for Kubernetes. Many would assume that is where the story starts. It is the beginning of history, right? But that really doesn’t tell the whole story.
-->
**作者**：Joe Beda（Heptio 首席技术官兼创始人）

2014 年 6 月 6 日，我检查了 Kubernetes 公共代码库的[第一次 commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56) 。许多人会认为这是故事开始的地方。这难道不是一切开始的地方吗？但这的确不能把整个过程说清楚。

![k8s_first_commit](/images/blog/2018-06-06-4-years-of-k8s/k8s-first-commit.png)
 
<!--
The cast leading up to that commit was large and the success for Kubernetes since then is owed to an ever larger cast.

Kubernetes was built on ideas that had been proven out at Google over the previous ten years with Borg. And Borg, itself, owed its existence to even earlier efforts at Google and beyond.

Concretely, Kubernetes started as some prototypes from Brendan Burns combined with ongoing work from me and Craig McLuckie to better align the internal Google experience with the Google Cloud experience. Brendan, Craig, and I really wanted people to use this, so we made the case to build out this prototype as an open source project that would bring the best ideas from Borg out into the open.

After we got the nod, it was time to actually build the system.  We took Brendan’s prototype (in Java), rewrote it in Go, and built just enough to get the core ideas across.  By this time the team had grown to include Ville Aikas, Tim Hockin, Brian Grant, Dawn Chen and Daniel Smith.  Once we had something working, someone had to sign up to clean things up to get it ready for public launch.  That ended up being me. Not knowing the significance at the time, I created a new repo, moved things over, and checked it in.  So while I have the first public commit to the repo, there was work underway well before that.

The version of Kubernetes at that point was really just a shadow of what it was to become.  The core concepts were there but it was very raw.  For example, Pods were called Tasks.  That was changed a day before we went public.  All of this led up to the public announcement of Kubernetes on June 10th, 2014 in a keynote from Eric Brewer at the first DockerCon.  You can watch that video here:
-->

第一次 commit 涉及的人员众多，自那以后 Kubernetes 的成功归功于更大的开发者阵容。

Kubernetes 建立在过去十年曾经在 Google 的 Borg 集群管理系统中验证过的思路之上。而 Borg 本身也是 Google 和其他公司早期努力的结果。

具体而言，Kubernetes 最初是从 Brendan Burns 的一些原型开始，结合我和 Craig McLuckie 正在进行的工作，以更好地将 Google 内部实践与 Google Cloud 的经验相结合。 Brendan，Craig 和我真的希望人们使用它，所以我们建议将这个原型构建为一个开源项目，将 Borg 的最佳创意带给大家。

在我们所有人同意后，就开始着手构建这个系统了。我们采用了 Brendan 的原型（Java 语言），用 Go 语言重写了它，并且以上述核心思想去构建该系统。到这个时候，团队已经成长为包括 Ville Aikas，Tim Hockin，Brian Grant，Dawn Chen 和 Daniel Smith。一旦我们有了一些工作需求，有人必须承担一些脱敏的工作，以便为公开发布做好准备。这个角色最终由我承担。当时，我不知道这件事情的重要性，我创建了一个新的仓库，把代码搬过来，然后进行了检查。所以在我第一次提交 public commit 之前，就有工作已经启动了。

那时 Kubernetes 的版本只是现在版本的简单雏形。核心概念已经有了，但非常原始。例如，Pods 被称为 Tasks，这在我们推广前一天就被替换。2014年6月10日 Eric Brewe 在第一届 DockerCon 上的演讲中正式发布了 Kubernetes。你可以在此处观看该视频：

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/YrxnVKZeqK8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></center>  

<!--
But, however raw, that modest start was enough to pique the interest of a community that started strong and has only gotten stronger.  Over the past four years Kubernetes has exceeded the expectations of all of us that were there early on. We owe the Kubernetes community a huge debt.  The success the project has seen is based not just on code and technology but also the way that an amazing group of people have come together to create something special.  The best expression of this is the [set of Kubernetes values](https://git.k8s.io/community/values.md) that Sarah Novotny helped curate.

Here is to another 4 years and beyond! 🎉🎉🎉
-->

但是，无论多么原始，这小小的一步足以激起一个开始强大而且变得更强大的社区的兴趣。在过去的四年里，Kubernetes 已经超出了我们所有人的期望。我们对 Kubernetes 社区的所有人员表示感谢。该项目所取得的成功不仅基于代码和技术，还基于一群出色的人聚集在一起所做的有意义的事情。Sarah Novotny 策划的一套 [Kubernetes 价值观](https://github.com/kubernetes/steering/blob/master/values.md)是以上最好的表现形式。

让我们一起期待下一个 4 年！🎉🎉🎉
