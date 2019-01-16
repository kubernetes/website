---
title: " Happy Birthday Kubernetes. Oh, the places you’ll go! "
date: 2016-07-21
slug: oh-the-places-you-will-go
url: /blog/2016/07/Oh-The-Places-You-Will-Go
---

<!--
---
title: " Happy Birthday Kubernetes. Oh, the places you’ll go! "
date: 2016-07-21
slug: oh-the-places-you-will-go
url: /blog/2016/07/Oh-The-Places-You-Will-Go
---
-->

<!--
_Editor’s note, Today’s guest post is from an independent Kubernetes contributor, Justin Santa Barbara, sharing his reflection on growth of the project from inception to its future._
-->
编者注：今天的来宾博文来自独立的 Kubernetes 撰稿人 Justin Santa Barbara ，分享他对项目从成立到未来发展的反思


<!--
**Dear K8s,**
-->
**亲爱的 k8s，**

<!--
_It’s hard to believe you’re only one - you’ve grown up so fast. On the occasion of your first birthday, I thought I would write a little note about why I was so excited when you were born, why I feel fortunate to be part of the group that is raising you, and why I’m eager to watch you continue to grow up!_  
-->
很难相信你才一岁-你成长得太快了。在你第一个生日的时候，我想我会写一个关于为什么我在你出生时如此兴奋的一点说明，我为什么觉得很幸运能成为抚养你的一员，以及我为什么渴望看到你继续成长！

<!--
_--Justin_
-->
_--Justin_

<!--
You started with an excellent foundation - good declarative functionality, built around a solid API with a well defined schema and the machinery so that we could evolve going forwards. And sure enough, over your first year you grew so fast: autoscaling, HTTP load-balancing support (Ingress), support for persistent workloads including clustered databases (PetSets). You’ve made friends with more clouds (welcome Azure & OpenStack to the family), and even started to span zones and clusters (Federation). And these are just some of the most visible changes - there’s so much happening inside that brain of yours!  
-->
你开始于一个优秀的基础 - 良好的声明性功能，围绕一个具有良好定义的架构和机制的可靠API构建，以便我们可以向前发展。当然，在第一年，你发展得如此之快：自动扩缩， HTTP 负载均衡（Ingress），支持包括集群数据库（PetSets）在内的持久性工作负载。 你结交了更多云的朋友（欢迎 Azure 和 OpenStack 加入家庭），甚至开始跨越区域和集群（联邦）。这些只是一些最明显的变化-你的内核发生了很多变化！

<!--
I think it’s wonderful you’ve remained so open in all that you do - you seem to write down everything on Github - for better or worse. I think we’ve all learned a lot about that on the way, like the perils of having engineers make scaling statements that are then weighed against claims made without quite the same framework of precision and rigor. But I’m proud that you chose not to lower your standards, but rose to the challenge and just ran faster instead - it might not be the most realistic approach, but it is the only way to move mountains!  
-->
我觉得你在所做的一切中保持如此开放是很棒的 - 你看上去把所有东西都写在 Github 上 - 无论好坏。我认为我们在路上已经学到了很多东西，比如让工程师编写缩放语句并基于不同的精度和准度来评估求值时所带来的风险，然后在没有完全相同的精确和严格框架的情况下权衡索赔。但我很自豪你选择不降低你的标准，但是迎接挑战并且跑得更快 - 它可能不是最现实的方法，但它是解决问题的唯一方法！

<!--
And yet, somehow, you’ve managed to avoid a lot of the common dead-ends that other open source software has fallen into, particularly as those projects got bigger and the developers end up working on it more than they use it directly. How did you do that? There’s a probably-apocryphal story of an employee at IBM that makes a huge mistake, and is summoned to meet with the big boss, expecting to be fired, only to be told “We just spent several million dollars training you. Why would we want to fire you?”. Despite all the investment google is pouring into you (along with Redhat and others), I sometimes wonder if the mistakes we are avoiding could be worth even more. There is a very open development process, yet there’s also an “oracle” that will sometimes course-correct by telling us what happens two years down the road if we make a particular design decision. This is a parent you should probably listen to!  
-->
然而，不知何故，你已经成功地避免了许多其他开源软件陷入困境的常见问题，特别是当这些项目变得更大以至于开发人员总在忙于改进它而不是直接使用它。你是怎么做到的？ 有一个可能是假的故事，IBM 的一名员工犯了一个很大的错误，被传唤与大老板见面，这名员工认为自己会被解雇，但只是被告知“我们刚刚花了几百万美元来训练你。我们为什么要解雇你？“尽管谷歌对你进行了大量的投资（与 Redhat 和其他一起），我有时想知道我们所避免的错误是否值得更多。有一个非常开放的开发过程，但是还有一个“先知”时不时地告诉我们，如果我们作出某个特定的设计决定，两年后会怎样，并通过这种方式来校正我们的路线。这是你应该听从的根源！

<!--
And so although you’re only a year old, you really have an [old soul](http://queue.acm.org/detail.cfm?id=2898444). I’m just one of the [many people raising you](https://kubernetes.io/blog/2016/07/happy-k8sbday-1), but it’s a wonderful learning experience for me to be able to work with the people that have built these incredible systems and have all this domain knowledge. Yet because we started from scratch (rather than taking the existing Borg code) we’re at the same level and can still have genuine discussions about how to raise you. Well, at least as close to the same level as we could ever be, but it’s to their credit that they are all far too nice ever to mention it!  
-->
因此，虽然你只有一岁，但你真的有一个[老的灵魂](http://queue.acm.org/detail.cfm?id=2898444)。 我只是[很多抚养你的人](https://kubernetes.io/blog/2016/07/happy-k8sbday-1)中的一员，但对我来说与已建立这些令人难以置信的系统并具备所有这些领域知识的人一起工作，这是一次很棒的学习经历。 然而，因为我们是从头开始（而不是采用现有的 Borg 代码），我们处于同一水平，并且仍然可以就如何开发你进行真正的讨论。 好吧，至少和我们以往一样接近同一水平，但值得赞扬的是，他们都非常好，无论如何都要提到这些！

<!--
If I would pick just two of the wise decisions those brilliant people made:  
-->
如果我从那些聪明人所做出的明智决定中只选两个：

<!--
- Labels & selectors give us declarative “pointers”, so we can say “why” we want things, rather than listing the things directly. It’s the secret to how you can scale to [great heights](https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set); not by naming each step, but saying “a thousand more steps just like that first one”.
-->
标签和选择器给了我们声明性的“指针”，所以我们可以对于我们想要的东西说“为什么”，而不是直接列出事物。 这是你如何扩展到[高峰](https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set)的秘诀；不是通过命名每一步，而是说“和第一步一样，再走一千步”。
<!--
- Controllers are state-synchronizers: we specify the goals, and your controllers will indefatigably work to bring the system to that state. They work through that strongly-typed API foundation, and are used throughout the code, so Kubernetes is more of a set of a hundred small programs than one big one. It’s not enough to scale to thousands of nodes technically; the project also has to scale to thousands of developers and features; and controllers help us get there.
-->
- 控制器是状态同步器：我们指定目标，并且你的控制器将不知疲倦地工作以使系统进入该状态。它们通过强类型的API基础工作，并在整个代码中使用，因此 Kubernetes 更多的是一百个小程序而不是一个大程序。仅从技术上扩展到数千个节点是不够的; 该项目还必须扩展到数千个开发人员和功能和控制器帮助我们到达那个目标。

<!--
And so on we will go! We’ll be replacing those controllers and building on more, and the API-foundation lets us build anything we can express in that way - with most things just a label or annotation away! But your thoughts will not be defined by language: with third party resources you can express anything you choose. Now we can build Kubernetes without building in Kubernetes, creating things that feel as much a part of Kubernetes as anything else. Many of the recent additions, like ingress, DNS integration, autoscaling and network policies were done or could be done in this way. Eventually it will be hard to imagine you before these things, but tomorrow’s standard functionality can start today, with no obstacles or gatekeeper, maybe even for an audience of one.  
-->
这种例子不胜枚举！ 我们将取代那些控制器并在更多基础上构建，而 API-foundation 让我们可以构建我们可以用这种方式表达的任何东西 - 大多数东西只是标签或注释！但是你的想法不必受语言约束：使用第三方资源，你可以表达你要表达的任何内容。 现在我们在 Kubernetes 之外继续构造 Kubernetes ，创造出与 Kubernetes 一样多的东西。 许多最近的新增功能，如 ingress ， DNS 集成，自动扩展和网络策略都已完成或可以通过这种方式完成。 最终在这些事情之前很难想象你，但明天的标准功能可以从今天开始，没有任何障碍或看门人，甚或只有唯一受众。

<!--
So I’m looking forward to seeing more and more growth happen further and further from the core of Kubernetes. We had to work our way through those phases; starting with things that needed to happen in the kernel of Kubernetes - like replacing replication controllers with deployments. Now we’re starting to build things that don’t require core changes. But we’re still still talking about infrastructure separately from applications. It’s what comes next that gets really interesting: when we start building applications that rely on the Kubernetes APIs. We’ve always had the Cassandra example that uses the Kubernetes API to self-assemble, but we haven’t really even started to explore this more widely yet. In the same way that the S3 APIs changed how we build things that remember, I think the k8s APIs are going to change how we build things that think.  
-->
因此，我期待看到越来越多的增长从 Kubernetes 的核心进一步发展。 我们必须努力完成这些阶段; 从需要在 Kubernetes 内核中发生的事情开始 - 比如用 deployments 替换 replication controllers 。 现在我们开始构建不需要核心更改的东西。 但我们仍然在与应用程序分开讨论基础架构。 下一步真正有趣的是：当我们开始构建依赖于 Kubernetes API 的应用程序时。 我们一直有使用 Kubernetes API 进行自组装的 Cassandra 示例，但我们还没有真正开始更广泛地探索这个问题。 就像 S3 API 改变我们构建记忆内容的方式一样，我认为 k8s API 将改变我们构建思考事物的方式。

<!--
So I’m looking forward to your second birthday: I can try to predict what you’ll look like then, but I know you’ll surpass even the most audacious things I can imagine. Oh, the places you’ll go!  
-->
所以我很期待你的第二个生日：我可以尝试预测你的样子，但我知道你甚至会超越我能想象到的最大胆的事情。 哦，那个你将会到达的地方！

<!--
_-- Justin Santa Barbara, Independent Kubernetes Contributor_  
-->
_-- Justin Santa Barbara ，独立的 Kubernetes 贡献者_
