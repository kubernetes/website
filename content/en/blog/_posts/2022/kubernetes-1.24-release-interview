---
layout: blog
title: "Stargazing, solutions and staycations: the Kubernetes 1.24 release interview"
date: 2022-08-18
author: >
  Craig Box (Google)
---

The Kubernetes project has participants from all around the globe. Some are friends, some are colleagues, and some are strangers. The one thing that unifies them, no matter their differences, are that they all have an interesting story. It is my pleasure to be the documentarian for the stories of the Kubernetes community in the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/). With every new Kubernetes release comes an interview with the release team lead, telling the story of that release, but also their own personal story.

With 1.25 around the corner, [the tradition continues](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog) with a look back at the story of 1.24. That release was led by [James Laverack](https://twitter.com/jameslaverack) of Jetstack. [James was on the podcast](https://kubernetespodcast.com/episode/178-kubernetes-1.24/) in May, and while you can read his story below, if you can, please do listen to it in his own voice.

Make sure you [subscribe, wherever you get your podcasts](https://kubernetespodcast.com/subscribe/), so you hear all our stories from the cloud native community, including the story of 1.25 next week.

*This transcript has been lightly edited and condensed for clarity.*

---

**CRAIG BOX: Your journey to Kubernetes went through the financial technology (fintech) industry. Tell me a little bit about how you came to software?**

JAMES LAVERACK: I took a pretty traditional path to software engineering. I went through school and then I did a computer science degree at the University of Bristol, and then I just ended up taking a software engineer job from there. Somewhat rather by accident, I ended up doing fintech work, which is pretty interesting, pretty engaging.

But in my most recent fintech job before I joined [Jetstack](https://www.jetstack.io/), I ended up working on a software project. We needed Kubernetes to solve a technical problem. So we implemented Kubernetes, and as often happens, I ended up as the one person of a team that understood the infrastructure, while everyone else was doing all of the application development.

I ended up enjoying the infrastructure side so much that I decided to move and do that full time. So I looked around and I found Jetstack, whose offices were literally across the road. I could see them out of our office window. And so I decided to just hop across the road and join them, and do all of this Kubernetes stuff more.

**CRAIG BOX: What's the tech scene like in Bristol? You went there for school and never left?**

JAMES LAVERACK: Pretty much. It's happened to a lot of people I know and a lot of my friends, is that you go to University somewhere and you're just kind of stuck there forever, so to speak. It's been known for being quite hot in the area in terms of that part of the UK. It has a lot of tech companies, obviously, it was a fintech company I worked at before. I think some larger companies have offices there. For "not London", it's not doing too bad, I don't think.

**CRAIG BOX: When you say hot, though, that's tech industry, not weather, I'm assuming.**

JAMES LAVERACK: Yeah, weather is the usual UK. It's kind of a nice overcast and rainy, which I quite like. I'm quite fond of it.

**CRAIG BOX: Public transport good?**

JAMES LAVERACK: Buses are all right. We've got a new bus installed recently, which everyone hated while it was being built. And now it's complete, everyone loves. So, standard I think.

**CRAIG BOX: That is the way. As someone who lived in London for a long time, it's very easy for me to say "well, London's kind of like Singapore. It's its own little city-state." But whenever we did go out to that part of the world, Bath especially, a very lovely town**

JAMES LAVERACK: Oh, Bath's lovely. I've been a couple of times.

**CRAIG BOX: Have you been to Box?**

JAMES LAVERACK: To where, sorry?

**CRAIG BOX: There's [a town called Box](https://en.wikipedia.org/wiki/Box,_Wiltshire) just outside Bath. I had my picture taken outside all the buildings. Proclaimed myself the mayor.**

JAMES LAVERACK: Oh, no, I don't think I have.

**CRAIG BOX: Well, look it up if you're ever in the region, everybody. Let's get back to Jetstack, though. They were across the road. Great company, the [two](https://www.jetstack.io/about/mattbarker/) [Matts](https://www.jetstack.io/about/mattbates/), the co-founders there. What was the interview process like for you?**

JAMES LAVERACK: It was pretty relaxed. One lunchtime, I just walked down the road and went to a coffee shop with Matt and we had this lovely conversation talking about my background and Jetstack and what I was looking to achieve in a new role and all this. And I'd applied to be a software engineer. And then they kind of at the end of it, he looked over at me and was like, "well, how about being a solutions engineer instead?" And I was like, what's that?

And he's like, "well, you know, it's just effectively being a software consultant. You go, you help companies implement Kubernetes, users, saying all that stuff you enjoy. But you do it full time." I was like, "well, maybe." And in the end he convinced me. I ended up joining as a solutions engineer with the idea of if I didn't like it, I could transfer to be a software engineer again.

Nearly three years later, I've never taken them up on the offer. I've just [stayed as a solutions engineer](https://www.jetstack.io/blog/life-as-a-solutions-engineer/) the entire time.

**CRAIG BOX: At the company you were working at, I guess you were effectively the consultant between the people writing the software and the deployment in Kubernetes. Did it make sense then for you to carry on in that role, as you moved to Jetstack?**

JAMES LAVERACK: I think so. I think it's something that I enjoyed. Not that I didn't enjoy writing software applications. I always enjoyed it, and we had a really interesting product and a really fun team. But I just found that more interesting. And it was becoming increasingly difficult to justify spending time on it when we had an application to write.

Which was just completely fine, and that made sense for the needs of the team at the time. But it's not what I wanted to do.

**CRAIG BOX: Do you think that talks to the split between Kubernetes being for developers or for operators? Do you think there's always going to be the need to have a different set of people who are maintaining the running infrastructure versus the people who are writing the code that run on it?**

JAMES LAVERACK: I think to some extent, yes, whether or not that's a separate platform team or whether or not that is because the people running it are consultants of some kind. Or whether or not this has been abstracted away from you in some of the more batteries-included versions of Kubernetes — some of the cloud-hosted ones, especially, somewhat remove that need. So I don't think it's absolutely necessary to employ a platform team. But I think someone needs to do it or you need to implicitly or explicitly pay for someone to do it in some way.

**CRAIG BOX: In the three years you have been at Jetstack now, how different are the jobs that you do for the customers? Is this just a case of learning one thing and rolling it out to multiple people, or is there always a different challenge with everyone you come across?**

JAMES LAVERACK: I think there's always a different challenge. My role has varied drastically. For example, a long time ago, I did an Istio install. But it was a relatively complicated, single mesh, multi-cluster install. And that was before multi-cluster support was really as readily available as it is now. Conversely, I've worked building custom orchestration platforms on top of Kubernetes for specific customer use cases.

It's all varied and every single customer engagement is different. That is an element I really like about the job, that variability in how things are and how things go.

**CRAIG BOX: When the platform catches up and does things like makes it easier to manage multi-cluster environments, do you go back to the customers and bring them up to date with the newest methods?**

JAMES LAVERACK: It depends. Most of our engagements are to solve a specific problem. And once we've solved that problem, they may have us back. But typically speaking, in my line of work, it's not an ongoing engagement. There are some within Jetstack that do that, but not so much in my team.

**CRAIG BOX: Your bio suggests that you were once called "the reason any corporate policy evolves." What's the story there?**

JAMES LAVERACK: [CHUCKLES] I think I just couldn't leave things well enough alone. I was talking to our operations director inside of Jetstack, and he once said to me that whenever he's thinking of a new corporate policy, he asks will it pass the James Laverack test. That is, will I look at it and find some horrendous loophole?

For example when I first joined, I took a look at our acceptable use policy for company equipment. And it stated that you're not allowed to have copyrighted material on your laptop. And of course, this makes sense, as you know, you don't want people doing software piracy or anything. But as written, that would imply you're not allowed to have anything that is copyrighted by anyone on your machine.

**CRAIG BOX: Such as perhaps the operating system that comes installed on it?**

JAMES LAVERACK: Such as perhaps the operating system, or anything. And you know, this clearly didn't make any sense. So he adjusted that, and I've kind of been fiddling with that sort of policy ever since.

**CRAIG BOX: The release team is often seen as an administrative role versus a pure coding role. Does that speak to the kind of change you've had in career in previously being a software developer and now being more of a consultant, or was there something else that attracted you to get involved in that particular part of the community?**

JAMES LAVERACK: I wouldn't really consider it less technical. I mean, yes, you do much less coding. This is something that constantly surprises my friends and some of my colleagues, when I tell them more detail about my role. There's not really any coding involved.

I don't think my role has really changed to have less coding. In fact, one of my more recent projects at Jetstack, a client project, involved a lot of coding. But I think that what attracted me to this role within Kubernetes is really the community. I found it really rewarding to engage with SIG Release and to engage with the release team. So I've always just enjoyed doing it, even though there is, as you say, not all that much coding involved.

**CRAIG BOX: Indeed; your wife said to you, ["I don't think your job is to code anymore. You just talk to people all day."](https://twitter.com/JamesLaverack/status/1483201645286678529) How did that make you feel?**

JAMES LAVERACK: Ahh, annoyed, because she was right. This was kind of a couple of months ago when I was in the middle of it with all of the Kubernetes meetings. Also, my client project at the time involved a lot of technical discussion. I was in three or four hours of calls every day. And I don't mind that. But I would come out, in part because of course you're working from home, so she sees me all the time. So I'd come out, I'd grab a coffee and be like, "oh, I've got a meeting, I've got to go." And she'd be like, "do you ever code anymore?"
I think it was in fact just after Christmas when she asked me, "when was the last time you programmed anything?" And I had to think about it. Then I realized that perhaps there was a problem there. Well, not a problem, but I realized that perhaps I don't code as much as I used to.

**CRAIG BOX: Are you the kind of person who will pick up a hobby project to try and fix that?**

JAMES LAVERACK: Absolutely. I've recently started writing [a Kubernetes operator for my Minecraft server](https://github.com/JamesLaverack/kubernetes-minecraft-operator). That probably tells you about the state I'm in.

**CRAIG BOX: If it's got Kubernetes in it, it doesn't sound that much of a hobby.**

JAMES LAVERACK: [LAUGHING] Do you not consider Kubernetes to be a hobby?

**CRAIG BOX: It depends.**

JAMES LAVERACK: I think I do.

**CRAIG BOX: I think by now.**

JAMES LAVERACK: In some extents.

**CRAIG BOX: You mentioned observing the release team in process before you decided to get involved. Was that as part of working with customers and looking to see whether a particular feature would make it into a release, or was there some other reason that that was how you saw the Kubernetes community?**

JAMES LAVERACK: Just after I joined Jetstack, I got the opportunity to go to KubeCon San Diego. I think we actually met there.

**CRAIG BOX: We did.**

JAMES LAVERACK: We had dinner, didn't we? So when I went, I'd only been at Jetstack for a few months. I really wasn't involved in the community in any serious way at all. As a result, I just ended up following around my then colleague, James Munnelly. James is lovely. And, you know, I just kind of went around with him, because he knew everyone.

I ended up in this hotel bar with a bunch of Kubernetes people, including Stephen Augustus, the co-chair of SIG Release and holder of a bunch of other roles within the community. I happened to ask him, I want to get involved. What is a good way to get involved with the Kubernetes community, if I've never been involved before? And he said, oh, you should join the release team.

**CRAIG BOX: So it's all down to where you end up in the bar with someone.**

JAMES LAVERACK: Yeah, pretty much.

**CRAIG BOX: If I'd got to you sooner, you could have been working on Istio.**

JAMES LAVERACK: Yeah, I could've been working on Istio, I could have ended up in some other SIG doing something. I just happened to be talking to Stephen. And Stephen suggested it, and I gave it a go. And here I am three years later.

**CRAIG BOX: I think I remember at the time you were working on an etcd operator?**

JAMES LAVERACK: Yeah, that's correct. That was part of a client project, which they, thankfully [let us open source](https://github.com/improbable-eng/etcd-cluster-operator). This was an operator for etcd, where they had a requirement to run it in Kubernetes, which of course is the opposite way around to how you'd normally want to run it.

**CRAIG BOX: And I remember having you up at the time, like I'm pretty sure those things exist already, and asking what the need was for there to be something different.**

JAMES LAVERACK: It was that they needed something very specific. The ones that existed already were all designed to run clusters that couldn't be shut down. As long as one replica stayed up, you could keep running etcd. But they needed to be able to suspend and restart the entire cluster, which means it needs disk-persistence support, which it turns out is quite complicated.

**CRAIG BOX: It's easier if you just throw all the data away.**

JAMES LAVERACK: It's much easier to throw all the data away. We needed to be a little bit careful about how we managed it. We thought about forking and changing an existing one. But we realized it would probably just be as easy to start from scratch, so we did that.

**CRAIG BOX: You've been a member of every release team since that point, since Kubernetes 1.18 in 2020, in a wide range of roles. Which set of roles have you been through?**

JAMES LAVERACK: I started out as a release notes shadow, and did that for a couple of releases, in 1.18 and 1.19. In 1.20, I was the release notes lead. And then in 1.21, I moved into being a shadow again as an enhancement shadow, before in 1.22 becoming an enhancements lead, but in 1.23 a release lead shadow, and finally in 1.24, release lead as a whole.

**CRAIG BOX: That's quite a long time to be with the release team. You're obviously going to move into an emeritus role after this release. Do you see yourself still remaining involved? Is it something that you're clearly very passionate about?**

JAMES LAVERACK: I think I'm going to be around in SIG Release for as long as people want me there. I find it a really interesting part of the community. And I find the people super-interesting and super-inviting.

**CRAIG BOX: Let's talk then about [Kubernetes 1.24](/blog/2022/05/03/kubernetes-1-24-release-announcement/). First, as always, congratulations on the release.**

JAMES LAVERACK: Thank you.

**CRAIG BOX: This release consists of 46 enhancements. 14 have graduated to stable, 15 have moved to beta, and 13 are in alpha. 2 are deprecated and 2 have been removed. How is that versus other releases recently? Is that an average number? That seems like a lot of stable enhancements, especially.**

JAMES LAVERACK: I think it's pretty similar. Most of the recent releases have been quite similar in the number of enhancements they have and in what categories. For example, in 1.23, the previous release, there were 47. I think 1.22, before that, had 53, so slightly more. But it's around about that number.

**CRAIG BOX: You didn't want to sneak in two extra so you could say you were one more than the last one?**

JAMES LAVERACK: No, I don't think so. I think we had enough going on.

**CRAIG BOX: The release team is obviously beholden to what features the SIGs are developing and what their plans are. Is there ever any coordination between the release process and the SIGs in terms of things like saying, this release is going to be a catch-up release, like the old Snow Leopard releases for macOS, for example, where we say we don't want as many new features, but we really want more stabilization, and could you please work on those kind of things?**

JAMES LAVERACK: Not really. The cornerstone of a Kubernetes organization is the SIGs themselves, so the special interest groups that make up the organization. It's really up to them what they want to do. We don't do any particular coordination on the style of thing that should be implemented. A lot of SIGs have roadmaps that are looking over multiple releases to try to get features that they think are important in.

**CRAIG BOX: Let's talk about some of the new features in 1.24. We have been hearing for many releases now about the impending doom which is the removal of Dockershim. [It is gone in 1.24](https://github.com/kubernetes/enhancements/issues/2221). Do we worry?**

JAMES LAVERACK: I don't think we worry. This is something that the community has been preparing for for a long time. [We've](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) [published](/blog/2022/02/17/dockershim-faq/) a [lot](/blog/2021/11/12/are-you-ready-for-dockershim-removal/) of [documentation](/blog/2022/03/31/ready-for-dockershim-removal/) [about](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) [how](/blog/2022/05/03/dockershim-historical-context/) you need to approach this. The honest truth is that most users, most application developers in Kubernetes, will simply not notice a difference or have to worry about it.

It's only really platform teams that administer Kubernetes clusters and people in very specific circumstances that are using Docker directly, not through the Kubernetes API, that are going to experience any issue at all.

**CRAIG BOX: And I see that Mirantis and Docker have developed a CRI plugin for Docker anyway, so you can just switch over to that and everything continues.**

JAMES LAVERACK: Yeah, absolutely, or you can use one of the many other CRI implementations. There are two in the CNCF, [containerd](https://containerd.io/), and [CRI-O](https://cri-o.io/).

**CRAIG BOX: Having gone through the process of communicating this change over several releases, what has the team learnt in terms of how we will communicate a message like this in future?**

JAMES LAVERACK: I think that this has been really interesting from the perspective that this is the biggest removal that the Kubernetes project has had to date. We've removed features before. In fact, we're removing another one in this release as well. But this is one of the most user-visible changes we've made.

I think there are very good reasons for doing it. But I think we've learned a lot about how and when to communicate, and the importance of having migration guides, the importance of having official documentation that really clarifies the thing. I think that's the real, it's an area in which the Kubernetes project has matured a lot since I've been on the team.

**CRAIG BOX: What is the other feature that's being removed?**

JAMES LAVERACK: The other feature that we're removing is dynamic Kubelet configuration. This is a feature that was in beta for a while. But I believe we decided that it just wasn't being used enough to justify keeping it. So we're removing it. We deprecated it back in 1.22 and we're removing it this release.

**CRAIG BOX: There was a change in policy a few releases ago that talked about features not being allowed to stay in beta forever. Have there been any features that were at risk of being removed due to lack of maintenance, or are all the SIGs pretty good now at keeping their features on track?**

JAMES LAVERACK: I think the SIGs are getting pretty good at it. We had a spate of a long time when a lot of features were kind of perpetually in beta. As you remember, Ingress was in beta for a long, long time.

**CRAIG BOX: I choose to believe it still is.**

JAMES LAVERACK: [LAUGHTER] I think it's really good that we're moving towards that stability approach with things like Kubernetes. I think it's a very positive change.

**CRAIG BOX: The fact that Ingress was in beta for so long, along with things like the main workload controllers, for example, did lead people to believing that beta APIs were stable and production ready, and could and should be used. Something that's changing in this release is that [beta APIs are going to be off by default](https://github.com/kubernetes/enhancements/issues/3136). Why that change?**

JAMES LAVERACK: This is really about encouraging the use of stable APIs. There was a perception, like you say, that beta APIs were actually stable. Because they can be removed very quickly, we often ended up in the state where we wanted to follow the policy and remove a beta API, but were unable to, because it was de facto stable, according to the community. This meant that cluster operators and users had a lot of breaking changes when doing upgrades that could have been avoided. This is really just to help stability as we go through more upgrades in the future.

**CRAIG BOX: I understand that only applies now to new APIs. Things that are in beta at the moment will continue to be available. So there'll be no breaking changes again?**

JAMES LAVERACK: That's correct. There's no breaking changes in beta APIs other than the ones we've documented this release. It's only new things.

**CRAIG BOX: Now in this release, [the artifacts are signed](https://github.com/kubernetes/enhancements/issues/3031) using Cosign signatures, and there is [experimental support for verification of those signatures](/docs/tasks/administer-cluster/verify-signed-artifacts/). What needed to happen to make that process possible?**

JAMES LAVERACK: This was a huge process from the other half of SIG Release. SIG Release has the release team, but it also has the release engineering team that handles the mechanics of actually pushing releases out. They have spent, and one of my friends over there, Adolfo, has spent a lot of time trying to bring us in line with [SLSA](https://slsa.dev/) compliance. I believe we're [looking now at Level 3 compliance](https://github.com/kubernetes/enhancements/issues/3027).

SLSA is a framework that describes software supply chain security. That is, of course, a really big issue in our industry at the moment. And it's really good to see the project adopting the best practices for this.

**CRAIG BOX: I was looking back at [the conversation I had with Rey Lejano about the 1.23 release](https://kubernetespodcast.com/episode/167-kubernetes-1.23/), and we were basically approaching Level 2. We're now obviously stepping up to Level 3. I think I asked Rey at the time was, is it fair to say that SLSA is inspired by large projects like Kubernetes, and in theory, it should be really easy for these projects to tick the boxes to get to that level, because the SLSA framework is written with a project like Kubernetes in mind?**

JAMES LAVERACK: I think so. I think it's been somewhat difficult, just because it's one thing to do it, but it's another thing to prove that you're doing it, which is the whole point around these frameworks — the assertation, that proof.

**CRAIG BOX: As an end user of Kubernetes, whether I install it myself or I take it from a service like GKE, what will this provenance then let me prove? If we think back to [the orange juice example we talked to Santiago about recently](https://kubernetespodcast.com/episode/174-in-toto/), how do I tell that my software is safe to run?**

JAMES LAVERACK: If you're downloading and running Kubernetes yourself, you can use the verifying image signatures feature to verify the thing you've downloaded, and the thing you are running, is actually the thing that the Kubernetes project has released, and that it has been built from the actual source code in the Kubernetes GitHub repository. This can give you a lot of confidence in what you're running, especially if you're running in a highly secure or regulated environment of some kind.

As an end user, this isn't something that will necessarily directly impact you. But it means that service providers that provide managed Kubernetes options, such as Google and GKE, can provide even greater levels of security and safety themselves about the services that they run.

**CRAIG BOX: A lot of people get access to their Kubernetes server just by being granted an API endpoint, and they start running kubectl against it. They're not actually installing their own Kubernetes. They have a provider or a platform team do it for them. Do you think it's feasible to get to a world where there's something that you can run when you're deploying your workloads which queries the API server, for example, and gets access to that same provenance data?**

JAMES LAVERACK: I think it's going to be very difficult to do it that way, simply because this provenance and assertation data implies that you actually have access to the underlying executables, which typically, when you're running in a managed platform, you don't. If you're having Kubernetes provided to you, I think you're still going to have to trust the platform team or the organization that's providing it to you.

**CRAIG BOX: Just like when you go to the hotel breakfast bar, you have to trust that they've been good with their orange juice.**

JAMES LAVERACK: Yeah, I think the orange juice example is great. If you're making it yourself, then you can use assertation. If you're not, if you've just been given a glass, then you're going to have to trust who's pouring it.

**CRAIG BOX: Continuing with our exploration of new stable features, [storage capacity tracking](https://github.com/kubernetes/enhancements/issues/1472) and [volume expansion](https://github.com/kubernetes/enhancements/issues/284) are generally available. What do those features enable me to do?**

JAMES LAVERACK: This is a really great set of stable features coming out of SIG Storage. Storage capacity tracking allows applications on Kubernetes to use the Kubernetes API to understand how much storage is available, which can drive application decisions. With volume expansion, that again allows an application to use the Kubernetes API to request additional storage, which can enable applications to make all kinds of operational decisions.

**CRAIG BOX: SIG Storage are also working through [a project to migrate all of their in-tree storage plugins out to CSI plugins](https://github.com/kubernetes/enhancements/issues/625). How are they going with that process?**

JAMES LAVERACK: In 1.24 we have a couple of them that have been migrated out. The [Azure Disk](https://github.com/kubernetes/enhancements/issues/1490) and [OpenStack Cinder](https://github.com/kubernetes/enhancements/issues/1489) plugins have both been migrated. They're maintaining the original API, but the actual implementation now happens in those CSI plugins.

**CRAIG BOX: Do they have a long way to go, or are they just cutting off a couple every release?**

JAMES LAVERACK: They're just doing a couple every release from what I see. There are a couple of others to go. This is really part of a larger theme within Kubernetes, which is pushing application-specific things out behind interfaces, such as the container storage interface and the container runtime interface.

**CRAIG BOX: That obviously sets up a situation where you have a stable interface and you can have beta implementations of that that are outside of Kubernetes and get around the problem we talked about before with not being able to run beta things.**

JAMES LAVERACK: Yeah, exactly. It also makes it easy to expand Kubernetes. You don't have to try to get code in-tree in order to implement a new storage engine, for example.

**CRAIG BOX: [gRPC probes have graduated to beta in 1.24](https://github.com/kubernetes/enhancements/issues/2727). What does that functionality provide?**

JAMES LAVERACK: This is one of the changes that's going to be most visible to application developers in Kubernetes, I think. Until now, Kubernetes has had the ability to do readiness and liveness checks on containers and be able to make intelligent routing and pod restart decisions based on those. But those checks had to be HTTP REST endpoints. 

With Kubernetes 1.24, we're enabling a beta feature that allows them to use gRPC. This means that if you're building an application that is primarily gRPC-based, as many microservices applications are, you can now use that same technology in order to implement your probes without having to bundle an HTTP server as well.

**CRAIG BOX: Are there any other enhancements that are particularly notable or relevant perhaps to the work you've been doing?**

JAMES LAVERACK: There's a really interesting one from SIG Network which is about [avoiding collisions in IP allocations to services](/blog/2022/05/03/kubernetes-1-24-release-announcement/#avoiding-collisions-in-ip-allocation-to-services). In existing versions of Kubernetes, you can allocate a service to have a particular internal cluster IP, or you can leave it blank and it will generate its own IP.

In Kubernetes 1.24, there's an opt-in feature, which allows you to specify a pool for dynamic IPs to be generated from. This means that you can statically allocate an IP to a service and know that IP can not be accidentally dynamically allocated. This is a problem I've actually had in my local Kubernetes cluster, where I use static IP addresses for a bunch of port forwarding rules. I've always worried that during server start-up, they're going to get dynamically allocated to one of the other services. Now, with 1.24, and this feature, I won't have to worry about it more.

**CRAIG BOX: This is like the analog of allocating an IP in your DHCP server rather than just claiming it statically on your local machine?**

JAMES LAVERACK: Pretty much. It means that you can't accidentally double allocate something.

**CRAIG BOX: Why don't we all just use IPv6?**

JAMES LAVERACK: That is a very deep question I don't think we have time for.

**CRAIG BOX: The margins of this podcast would be unable to contain it even if we did.**

JAMES LAVERACK: [LAUGHING]

**CRAIG BOX: [The theme for Kubernetes 1.24 is Stargazer](/blog/2022/05/03/kubernetes-1-24-release-announcement/#release-theme-and-logo). How did you pick that as the theme?**

JAMES LAVERACK: Every release lead gets to pick their theme, pretty much by themselves. When I started, I asked Rey, the previous release lead, how he picked his theme, because he picked the Next Frontier for Kubernetes 1.23. And he told me that he'd actually picked it before the release even started, which meant for the first couple of weeks and months of the release, I was really worried about it, because I hadn't picked one yet, and I wasn't sure what to pick.

Then again, I was speaking to another former release lead, and they told me that they picked theirs like two weeks out. It seems to really vary. About halfway through the release, I had some ideas down. I thought maybe we could talk about — I live in a city called Bristol in the UK, which has a very famous bridge — and I thought, oh, we could talk about bridges and architectural and a metaphor for community bridging gaps and things like this. I kind of liked the idea, but it didn't really grab me. 

One thing about me is that I am a serious night owl. I cannot work effectively in the mornings. I've always enjoyed the night. And that got me thinking about astronomy and the stars. I think one night I was trying to get to sleep, because I couldn't sleep, and I was watching [PBS Space Time](https://www.youtube.com/channel/UC7_gcs09iThXybpVgjHZ_7g), which is this fantastic YouTube channel talking about physics. And I'm not a physicist. I don't understand any of the maths. But I find it really interesting as a topic. 

I just thought, well, why don't I make a theme about stars. Kubernetes has often had a space theme in many releases. As I'm sure you're aware, its original name was based off of Star Trek. The previous release had a Star Trek-based theme. I thought, well, let's do that. So I came up with the idea of Stargazer.

**CRAIG BOX: Once you have a theme, you then need a release logo. I understand you have a household artist?**

JAMES LAVERACK: [LAUGHS] I don't think she'd appreciate being called that, but, yes. My wife is an artist, and in particular, a digital artist. I had a bit of a conversation with the SIG Release folks to see if they'd be comfortable with my wife doing it, and they said they'd be completely fine with that.

I asked if she would be willing to spend some time creating a logo for us. And thankfully for me, she was. She has produced this — well, I'm somewhat obliged to say — she produced us a beautiful logo, which you can see in our release blog and probably around social media. It is a telescope set over starry skies, and I absolutely love it.

**CRAIG BOX: It is objectively very nice. It obviously has the seven stars or the Seven Sisters of the Pleiades. Do the colors have any particular meaning?**

JAMES LAVERACK: The colors are based on the Kubernetes blue. If you look in the background, that haze is actually in the shape of a Kubernetes wheel from the original Kubernetes logo.

**CRAIG BOX: You must have to squint at it the right way. Very abstract. As is the wont of art.**

JAMES LAVERACK: As is the wont.

**CRAIG BOX: You mentioned before Rey Lejano, the 1.23 release lead. We ask every interview what the person learned from the last lead and what they're going to put in the proverbial envelope for the next. At the time, Rey said that he would encourage you to use teachable moments in the release team meetings. Was that something you were able to do?**

JAMES LAVERACK: Not as much as I would have liked. I think the thing that I really took from Rey was communicate more. I've made a big effort this time to put as much communication in the open as possible. I was actually worried that I was going to be spamming the SIG Release Slack channel too much. I asked our SIG Release chairs Stephen and Sasha about it. And they said, just don't worry about it. Just spam as much as you want.

And so I think the majority of the conversation in SIG Release Slack over the past few months has just been me. [LAUGHING] That seemed to work out pretty well.

**CRAIG BOX: That's what it's for.**

JAMES LAVERACK: It is what it's for. But SIG Release does more than just the individual release process, of course. It's release engineering, too.

**CRAIG BOX: I'm sure they'd be interested in what's going on anyway?**

JAMES LAVERACK: It's true. It's true. It's been really nice to be able to talk to everyone that way, I think.

**CRAIG BOX: We talked before about your introduction to Kubernetes being at a KubeCon, and meeting people in person. How has it been running the release almost entirely virtually?**

JAMES LAVERACK: It's not been so bad. The release team has always been geographically distributed, somewhat by design. It's always been a very virtual engagement, so I don't think it's been impacted too, too much by the pandemic and travel restrictions. Of course, I'm looking forward to KubeCon Valencia and being able to see everyone again. But I think the release team has handled excellently in the current situation.

**CRAIG BOX: What is the advice that you will pass on to [the next release lead](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.25/release-team.md), which has been announced to be Cici Huang from Google?**

JAMES LAVERACK: I would say to Cici that open communication is really important. I made a habit of posting every single week in SIG Release a summary of what's happened. I'm super-glad that I did that, and I'm going to encourage her to do the same if she wants to.

**CRAIG BOX: This release was originally due out two weeks earlier, but [it was delayed](https://groups.google.com/a/kubernetes.io/g/dev/c/9IZaUGVMnmo). What happened?**

JAMES LAVERACK: That delay was the result of a release-blocking bug — an absolute showstopper. This was in the underlying Go implementation of TLS certificate verification. It meant that a lot of clients simply would not be able to connect to clusters or anything else. So we took the decision that we can't release with a bug this big. Thus the term release-blocking.

The fix had to be merged upstream in Go 1.18.1, and then we had to, of course, rebuild and release release candidates. Given the time we like to have things to sit and stabilize after we make a lot of changes like that, we felt it was more prudent to push out the release by a couple of weeks than risk shipping a broken point-zero.

**CRAIG BOX: Go 1.18 is itself quite new. How does the project decide how quickly to upgrade its underlying programming language?**

JAMES LAVERACK: A lot of it is driven by support requirements. We support each release for three releases. So Kubernetes 1.24 will be most likely in support until this time next year, in 2023, as we do three releases per year. That means that right up until May, 2023, we're probably going to be shipping updates for Kubernetes 1.24, which means that the version of Go we're using, and other dependencies, have to be supported as well. My understanding is that the older version of Go, Go 1.17, just wouldn't be supported long enough.

Any underlying critical bug fixes that were coming in, they wouldn't have been back ported to Go 1.17, and therefore we might not be able to adequately support Kubernetes 1.24.

**CRAIG BOX: A side effect of the unfortunate delay was an unfortunate holiday situation, where you were booked to take the week after the release off and instead you ended up taking the week before the release off. Were you able to actually have any holiday and relax in that situation?**

JAMES LAVERACK: Well, I didn't go anywhere, if that's what you're asking.

**CRAIG BOX: No one ever does. This is what the pandemic's been, staycations.**

JAMES LAVERACK: Yeah, staycations. It's been interesting. On the one hand, I've done a lot of Kubernetes work in that time. So you could argue it's not really been a holiday. On the other hand, my highly annoying friends have gotten me into playing an MMO, so I've been spending a lot of time playing that.

**CRAIG BOX: I hear also you have a new vacuum cleaner?**

JAMES LAVERACK: [LAUGHS] You've been following my Twitter. Yes, I couldn't find the charging cord for my old vacuum cleaner. And so I decided just to buy a new one. I decided, at long last, just to buy one of the nice brand-name ones. And it is just better.

**CRAIG BOX: This isn't the BBC. You're allowed to name it if you want.**

JAMES LAVERACK: Yes, we went and bought one of these nice Dyson vacuum cleaners, and the first time I've gotten one so expensive. On the one hand, I feel a little bit bad spending a lot of money on a vacuum cleaner. On the other hand, it's so much easier.

**CRAIG BOX: Is it one of those handheld ones, like a giant Dust-Buster with a long leg?**

JAMES LAVERACK: No, I got one of the corded floor ones, because the problem was, of course, I lost the charger for the last one, so I didn't want that to happen again. So I got a wall plug-in one.

**CRAIG BOX: I must say, going from a standard [Henry Hoover](https://www.myhenry.com/) to — the place we're staying at the moment has what I'll call a knock-off Dyson portable vacuum cleaner — having something that you can just pick up and carry around with you, and not have to worry about the cord, actually does encourage me to keep the place tidier.**

JAMES LAVERACK: Really? I think our last one was corded, but it didn't encourage us to use it anymore, just because it was so useless.

---

_[James Laverack](https://twitter.com/jameslaverack) is a Staff Solutions Engineer at Jetstack, and was the release team lead for Kubernetes 1.24._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
