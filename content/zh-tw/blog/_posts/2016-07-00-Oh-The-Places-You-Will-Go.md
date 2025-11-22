---
title: " Kubernetes 生日快樂。哦，這是你要去的地方！ "
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

_編者按，今天的嘉賓帖子來自一位獨立的 kubernetes 撰稿人 Justin Santa Barbara，分享了他對項目從一開始到未來發展的思考。_

**親愛的 K8s,**

_很難相信你是唯一的一個 - 成長這麼快的。在你一歲生日的時候，我想我可以寫一個小紙條，告訴你爲什麼我在你出生的時候那麼興奮，爲什麼我覺得很幸運能成爲撫養你長大的一員，爲什麼我渴望看到你繼續成長！_

<!--
_--Justin_

You started with an excellent foundation - good declarative functionality, built around a solid API with a well defined schema and the machinery so that we could evolve going forwards. And sure enough, over your first year you grew so fast: autoscaling, HTTP load-balancing support (Ingress), support for persistent workloads including clustered databases (PetSets). You’ve made friends with more clouds (welcome Azure & OpenStack to the family), and even started to span zones and clusters (Federation). And these are just some of the most visible changes - there’s so much happening inside that brain of yours!

I think it’s wonderful you’ve remained so open in all that you do - you seem to write down everything on GitHub - for better or worse. I think we’ve all learned a lot about that on the way, like the perils of having engineers make scaling statements that are then weighed against claims made without quite the same framework of precision and rigor. But I’m proud that you chose not to lower your standards, but rose to the challenge and just ran faster instead - it might not be the most realistic approach, but it is the only way to move mountains!
-->

_--Justin_

你從一個優秀的基礎 - 良好的聲明性功能開始，它是圍繞一個具有良好定義的模式和機制的堅實的 API 構建的，這樣我們就可以向前發展了。果然，在你的第一年裏，你增長得如此之快：autoscaling、HTTP load-balancing support (Ingress)、support for persistent workloads including clustered databases (PetSets)。你已經和更多的雲交了朋友(歡迎 azure 和 openstack 加入家庭)，甚至開始跨越區域和叢集(Federation)。這些只是一些最明顯的變化 - 在你的大腦裏發生了太多的變化！

我覺得你一直保持開放的態度真是太好了 - 你好像把所有的東西都寫在 github 上 - 不管是好是壞。我想我們在這方面都學到了很多，比如讓工程師做縮放聲明的風險，然後在沒有完全相同的精確性和嚴謹性框架的情況下，將這些聲明與索賠進行權衡。但我很自豪你選擇了不降低你的標準，而是上升到挑戰，只是跑得更快 - 這可能不是最現實的辦法，但這是唯一的方式能移動山！

<!--
And yet, somehow, you’ve managed to avoid a lot of the common dead-ends that other open source software has fallen into, particularly as those projects got bigger and the developers end up working on it more than they use it directly. How did you do that? There’s a probably-apocryphal story of an employee at IBM that makes a huge mistake, and is summoned to meet with the big boss, expecting to be fired, only to be told “We just spent several million dollars training you. Why would we want to fire you?”. Despite all the investment google is pouring into you (along with Redhat and others), I sometimes wonder if the mistakes we are avoiding could be worth even more. There is a very open development process, yet there’s also an “oracle” that will sometimes course-correct by telling us what happens two years down the road if we make a particular design decision. This is a parent you should probably listen to!
-->

然而，不知何故，你已經設法避免了許多其他開源軟體陷入的共同死衚衕，特別是當那些項目越來越大，開發人員最終要做的比直接使用它更多的時候。你是怎麼做到的？有一個很可能是虛構的故事，講的是 IBM 的一名員工犯了一個巨大的錯誤，被傳喚去見大老闆，希望被解僱，卻被告知“我們剛剛花了幾百萬美元培訓你。我們爲什麼要解僱你？“。儘管谷歌對你進行了大量的投資(包括 redhat 和其他公司)，但我有時想知道，我們正在避免的錯誤是否更有價值。有一個非常開放的開發過程，但也有一個“oracle”，它有時會通過告訴我們兩年後如果我們做一個特定的設計決策會發生什麼來糾正錯誤。這是你應該聽的父母！

<!--
And so although you’re only a year old, you really have an [old soul](http://queue.acm.org/detail.cfm?id=2898444). I’m just one of the [many people raising you](https://kubernetes.io/blog/2016/07/happy-k8sbday-1), but it’s a wonderful learning experience for me to be able to work with the people that have built these incredible systems and have all this domain knowledge. Yet because we started from scratch (rather than taking the existing Borg code) we’re at the same level and can still have genuine discussions about how to raise you. Well, at least as close to the same level as we could ever be, but it’s to their credit that they are all far too nice ever to mention it!

If I would pick just two of the wise decisions those brilliant people made:
-->

所以，儘管你只有一歲，你真的有一個[舊靈魂](http://queue.acm.org/detail.cfm?ID=2898444)。我只是[很多人撫養你](https://kubernetes.io/blog/2016/07/happy-k8sbday-1)中的一員，但對我來說，能夠與那些建立了這些令人難以置信的系統並擁有所有這些領域知識的人一起工作是一次極好的學習經歷。然而，因爲我們是白手起家(而不是採用現有的 Borg 代碼)，我們處於同一水平，仍然可以就如何培養你進行真正的討論。好吧，至少和我們的水平一樣接近，但值得稱讚的是，他們都太好了，從來沒提過！

如果我選擇兩個聰明人做出的明智決定：

<!--
- Labels & selectors give us declarative “pointers”, so we can say “why” we want things, rather than listing the things directly. It’s the secret to how you can scale to [great heights](https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set); not by naming each step, but saying “a thousand more steps just like that first one”.
- Controllers are state-synchronizers: we specify the goals, and your controllers will indefatigably work to bring the system to that state. They work through that strongly-typed API foundation, and are used throughout the code, so Kubernetes is more of a set of a hundred small programs than one big one. It’s not enough to scale to thousands of nodes technically; the project also has to scale to thousands of developers and features; and controllers help us get there.
-->

- 標籤和選擇器給我們聲明性的“pointers”，所以我們可以說“爲什麼”我們想要東西，而不是直接列出東西。這是如何擴展到[偉大高度]的祕密(https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set)；不是命名每一步，而是說“像第一步一樣多走一千步”。
- 控制器是狀態同步器：我們指定目標，您的控制器將不遺餘力地工作，使系統達到該狀態。它們工作在強類型 API 基礎上，並且貫穿整個代碼，因此 Kubernetes 比一個大的程式多一百個小程式。僅僅從技術上擴展到數千個節點是不夠的；這個項目還必須擴展到數千個開發人員和特性；控制器幫助我們達到目的。

<!--
And so on we will go! We’ll be replacing those controllers and building on more, and the API-foundation lets us build anything we can express in that way - with most things just a label or annotation away! But your thoughts will not be defined by language: with third party resources you can express anything you choose. Now we can build Kubernetes without building in Kubernetes, creating things that feel as much a part of Kubernetes as anything else. Many of the recent additions, like ingress, DNS integration, autoscaling and network policies were done or could be done in this way. Eventually it will be hard to imagine you before these things, but tomorrow’s standard functionality can start today, with no obstacles or gatekeeper, maybe even for an audience of one.

So I’m looking forward to seeing more and more growth happen further and further from the core of Kubernetes. We had to work our way through those phases; starting with things that needed to happen in the kernel of Kubernetes - like replacing replication controllers with deployments. Now we’re starting to build things that don’t require core changes. But we’re still still talking about infrastructure separately from applications. It’s what comes next that gets really interesting: when we start building applications that rely on the Kubernetes APIs. We’ve always had the Cassandra example that uses the Kubernetes API to self-assemble, but we haven’t really even started to explore this more widely yet. In the same way that the S3 APIs changed how we build things that remember, I think the k8s APIs are going to change how we build things that think.
-->

等等我們就走！我們將取代那些控制器，建立更多，API 基金會讓我們構建任何我們可以用這種方式表達的東西 - 大多數東西只是標籤或註釋遠離！但你的思想不會由語言來定義：有了第三方資源，你可以表達任何你選擇的東西。現在我們可以不用在 Kubernetes 建造Kubernetes 了，創造出與其他任何東西一樣感覺是 Kubernetes 的一部分的東西。最近添加的許多功能，如ingress、DNS integration、autoscaling and network policies ，都已經完成或可以通過這種方式完成。最終，在這些事情發生之前很難想象你會是怎樣的一個人，但是明天的標準功能可以從今天開始，沒有任何障礙或看門人，甚至對一個聽衆來說也是這樣。

所以我期待着看到越來越多的增長髮生在離 Kubernetes 核心越來越遠的地方。我們必須通過這些階段來工作；從需要在 kubernetes 內核中發生的事情開始——比如用部署替換複製控制器。現在我們開始構建不需要核心更改的東西。但我們仍然在討論基礎設施和應用程式。接下來真正有趣的是：當我們開始構建依賴於 kubernetes api 的應用程式時。我們一直有使用 kubernetes api 進行自組裝的 cassandra 示例，但我們還沒有真正開始更廣泛地探討這個問題。正如 S3 APIs 改變了我們構建記憶事物的方式一樣，我認爲 k8s APIs 也將改變我們構建思考事物的方式。

<!--
So I’m looking forward to your second birthday: I can try to predict what you’ll look like then, but I know you’ll surpass even the most audacious things I can imagine. Oh, the places you’ll go!


_-- Justin Santa Barbara, Independent Kubernetes Contributor_
-->

所以我很期待你的二歲生日：我可以試着預測你那時的樣子，但我知道你會超越我所能想象的最大膽的東西。哦，這是你要去的地方！


_-- Justin Santa Barbara, 獨立的 Kubernetes 貢獻者_
