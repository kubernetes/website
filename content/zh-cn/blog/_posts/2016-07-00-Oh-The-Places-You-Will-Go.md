---
title: " Kubernetes 生日快乐。哦，这是你要去的地方！ "
date: 2016-07-21
slug: oh-the-places-you-will-go
---

<!--
title: " Happy Birthday Kubernetes. Oh, the places you’ll go! "
date: 2016-07-21
slug: oh-the-places-you-will-go
url: /blog/2016/07/Oh-The-Places-You-Will-Go
-->

<!--
_Editor’s note, Today’s guest post is from an independent Kubernetes contributor, Justin Santa Barbara, sharing his reflection on growth of the project from inception to its future._

**Dear K8s,**

_It’s hard to believe you’re only one - you’ve grown up so fast. On the occasion of your first birthday, I thought I would write a little note about why I was so excited when you were born, why I feel fortunate to be part of the group that is raising you, and why I’m eager to watch you continue to grow up!_
-->

_编者按，今天的嘉宾帖子来自一位独立的 kubernetes 撰稿人 Justin Santa Barbara，分享了他对项目从一开始到未来发展的思考。_

**亲爱的 K8s,**

_很难相信你是唯一的一个 - 成长这么快的。在你一岁生日的时候，我想我可以写一个小纸条，告诉你为什么我在你出生的时候那么兴奋，为什么我觉得很幸运能成为抚养你长大的一员，为什么我渴望看到你继续成长！_

<!--
_--Justin_

You started with an excellent foundation - good declarative functionality, built around a solid API with a well defined schema and the machinery so that we could evolve going forwards. And sure enough, over your first year you grew so fast: autoscaling, HTTP load-balancing support (Ingress), support for persistent workloads including clustered databases (PetSets). You’ve made friends with more clouds (welcome Azure & OpenStack to the family), and even started to span zones and clusters (Federation). And these are just some of the most visible changes - there’s so much happening inside that brain of yours!

I think it’s wonderful you’ve remained so open in all that you do - you seem to write down everything on GitHub - for better or worse. I think we’ve all learned a lot about that on the way, like the perils of having engineers make scaling statements that are then weighed against claims made without quite the same framework of precision and rigor. But I’m proud that you chose not to lower your standards, but rose to the challenge and just ran faster instead - it might not be the most realistic approach, but it is the only way to move mountains!
-->

_--Justin_

你从一个优秀的基础 - 良好的声明性功能开始，它是围绕一个具有良好定义的模式和机制的坚实的 API 构建的，这样我们就可以向前发展了。果然，在你的第一年里，你增长得如此之快：autoscaling、HTTP load-balancing support (Ingress)、support for persistent workloads including clustered databases (PetSets)。你已经和更多的云交了朋友(欢迎 azure 和 openstack 加入家庭)，甚至开始跨越区域和集群(Federation)。这些只是一些最明显的变化 - 在你的大脑里发生了太多的变化！

我觉得你一直保持开放的态度真是太好了 - 你好像把所有的东西都写在 github 上 - 不管是好是坏。我想我们在这方面都学到了很多，比如让工程师做缩放声明的风险，然后在没有完全相同的精确性和严谨性框架的情况下，将这些声明与索赔进行权衡。但我很自豪你选择了不降低你的标准，而是上升到挑战，只是跑得更快 - 这可能不是最现实的办法，但这是唯一的方式能移动山！

<!--
And yet, somehow, you’ve managed to avoid a lot of the common dead-ends that other open source software has fallen into, particularly as those projects got bigger and the developers end up working on it more than they use it directly. How did you do that? There’s a probably-apocryphal story of an employee at IBM that makes a huge mistake, and is summoned to meet with the big boss, expecting to be fired, only to be told “We just spent several million dollars training you. Why would we want to fire you?”. Despite all the investment google is pouring into you (along with Redhat and others), I sometimes wonder if the mistakes we are avoiding could be worth even more. There is a very open development process, yet there’s also an “oracle” that will sometimes course-correct by telling us what happens two years down the road if we make a particular design decision. This is a parent you should probably listen to!
-->

然而，不知何故，你已经设法避免了许多其他开源软件陷入的共同死胡同，特别是当那些项目越来越大，开发人员最终要做的比直接使用它更多的时候。你是怎么做到的？有一个很可能是虚构的故事，讲的是 IBM 的一名员工犯了一个巨大的错误，被传唤去见大老板，希望被解雇，却被告知“我们刚刚花了几百万美元培训你。我们为什么要解雇你？“。尽管谷歌对你进行了大量的投资(包括 redhat 和其他公司)，但我有时想知道，我们正在避免的错误是否更有价值。有一个非常开放的开发过程，但也有一个“oracle”，它有时会通过告诉我们两年后如果我们做一个特定的设计决策会发生什么来纠正错误。这是你应该听的父母！

<!--
And so although you’re only a year old, you really have an [old soul](http://queue.acm.org/detail.cfm?id=2898444). I’m just one of the [many people raising you](https://kubernetes.io/blog/2016/07/happy-k8sbday-1), but it’s a wonderful learning experience for me to be able to work with the people that have built these incredible systems and have all this domain knowledge. Yet because we started from scratch (rather than taking the existing Borg code) we’re at the same level and can still have genuine discussions about how to raise you. Well, at least as close to the same level as we could ever be, but it’s to their credit that they are all far too nice ever to mention it!

If I would pick just two of the wise decisions those brilliant people made:
-->

所以，尽管你只有一岁，你真的有一个[旧灵魂](http://queue.acm.org/detail.cfm?ID=2898444)。我只是[很多人抚养你](https://kubernetes.io/blog/2016/07/happy-k8sbday-1)中的一员，但对我来说，能够与那些建立了这些令人难以置信的系统并拥有所有这些领域知识的人一起工作是一次极好的学习经历。然而，因为我们是白手起家(而不是采用现有的 Borg 代码)，我们处于同一水平，仍然可以就如何培养你进行真正的讨论。好吧，至少和我们的水平一样接近，但值得称赞的是，他们都太好了，从来没提过！

如果我选择两个聪明人做出的明智决定：

<!--
- Labels & selectors give us declarative “pointers”, so we can say “why” we want things, rather than listing the things directly. It’s the secret to how you can scale to [great heights](https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set); not by naming each step, but saying “a thousand more steps just like that first one”.
- Controllers are state-synchronizers: we specify the goals, and your controllers will indefatigably work to bring the system to that state. They work through that strongly-typed API foundation, and are used throughout the code, so Kubernetes is more of a set of a hundred small programs than one big one. It’s not enough to scale to thousands of nodes technically; the project also has to scale to thousands of developers and features; and controllers help us get there.
-->

- 标签和选择器给我们声明性的“pointers”，所以我们可以说“为什么”我们想要东西，而不是直接列出东西。这是如何扩展到[伟大高度]的秘密(https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set)；不是命名每一步，而是说“像第一步一样多走一千步”。
- 控制器是状态同步器：我们指定目标，您的控制器将不遗余力地工作，使系统达到该状态。它们工作在强类型 API 基础上，并且贯穿整个代码，因此 Kubernetes 比一个大的程序多一百个小程序。仅仅从技术上扩展到数千个节点是不够的；这个项目还必须扩展到数千个开发人员和特性；控制器帮助我们达到目的。

<!--
And so on we will go! We’ll be replacing those controllers and building on more, and the API-foundation lets us build anything we can express in that way - with most things just a label or annotation away! But your thoughts will not be defined by language: with third party resources you can express anything you choose. Now we can build Kubernetes without building in Kubernetes, creating things that feel as much a part of Kubernetes as anything else. Many of the recent additions, like ingress, DNS integration, autoscaling and network policies were done or could be done in this way. Eventually it will be hard to imagine you before these things, but tomorrow’s standard functionality can start today, with no obstacles or gatekeeper, maybe even for an audience of one.

So I’m looking forward to seeing more and more growth happen further and further from the core of Kubernetes. We had to work our way through those phases; starting with things that needed to happen in the kernel of Kubernetes - like replacing replication controllers with deployments. Now we’re starting to build things that don’t require core changes. But we’re still still talking about infrastructure separately from applications. It’s what comes next that gets really interesting: when we start building applications that rely on the Kubernetes APIs. We’ve always had the Cassandra example that uses the Kubernetes API to self-assemble, but we haven’t really even started to explore this more widely yet. In the same way that the S3 APIs changed how we build things that remember, I think the k8s APIs are going to change how we build things that think.
-->

等等我们就走！我们将取代那些控制器，建立更多，API 基金会让我们构建任何我们可以用这种方式表达的东西 - 大多数东西只是标签或注释远离！但你的思想不会由语言来定义：有了第三方资源，你可以表达任何你选择的东西。现在我们可以不用在 Kubernetes 建造Kubernetes 了，创造出与其他任何东西一样感觉是 Kubernetes 的一部分的东西。最近添加的许多功能，如ingress、DNS integration、autoscaling and network policies ，都已经完成或可以通过这种方式完成。最终，在这些事情发生之前很难想象你会是怎样的一个人，但是明天的标准功能可以从今天开始，没有任何障碍或看门人，甚至对一个听众来说也是这样。

所以我期待着看到越来越多的增长发生在离 Kubernetes 核心越来越远的地方。我们必须通过这些阶段来工作；从需要在 kubernetes 内核中发生的事情开始——比如用部署替换复制控制器。现在我们开始构建不需要核心更改的东西。但我们仍然在讨论基础设施和应用程序。接下来真正有趣的是：当我们开始构建依赖于 kubernetes api 的应用程序时。我们一直有使用 kubernetes api 进行自组装的 cassandra 示例，但我们还没有真正开始更广泛地探讨这个问题。正如 S3 APIs 改变了我们构建记忆事物的方式一样，我认为 k8s APIs 也将改变我们构建思考事物的方式。

<!--
So I’m looking forward to your second birthday: I can try to predict what you’ll look like then, but I know you’ll surpass even the most audacious things I can imagine. Oh, the places you’ll go!


_-- Justin Santa Barbara, Independent Kubernetes Contributor_
-->

所以我很期待你的二岁生日：我可以试着预测你那时的样子，但我知道你会超越我所能想象的最大胆的东西。哦，这是你要去的地方！


_-- Justin Santa Barbara, 独立的 Kubernetes 贡献者_
