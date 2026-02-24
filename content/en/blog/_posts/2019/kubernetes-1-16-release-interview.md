---
layout: blog
title: "When you're in the release team, you're family: the Kubernetes 1.16 release interview"
date: 2019-12-06
author: >
  Craig Box (Google)
---

It is a pleasure to co-host the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/) with Adam Glick.  We get to talk to friends old and new from the community, as well as give people a download on the Cloud Native news every week.

It was also a pleasure to see Lachlan Evenson, the release team lead for Kubernetes 1.16, [win the CNCF "Top Ambassador" award](https://www.cncf.io/announcement/2019/11/19/cloud-native-computing-foundation-announces-2019-community-awards-winners/) at KubeCon.  We [talked with Lachie](https://kubernetespodcast.com/episode/072-kubernetes-1.16/) when 1.16 was released, and as is [becoming](https://kubernetes.io/blog/2018/07/16/how-the-sausage-is-made-the-kubernetes-1.11-release-interview-from-the-kubernetes-podcast/) a [tradition](https://kubernetes.io/blog/2019/05/13/cat-shirts-and-groundhog-day-the-kubernetes-1.14-release-interview/), we are delighted to share an abridged version of that interview with the readers of the Kubernetes Blog.

If you're paying attention to the release calendar, you'll see 1.17 is due out soon. [Subscribe to our show](https://kubernetespodcast.com/subscribe/) in your favourite podcast player for another release interview!

<hr/>

<b>CRAIG BOX: Lachie, I've been looking forward to chatting to you for some time. We first met at KubeCon Berlin in 2017 when you were with Deis. Let's start with a question on everyone's ears-- which part of England are you from?</b>

LACHLAN EVENSON: The prison part! See, we didn't have a choice about going to Australia, but I'd like to say we got the upper hand in the long run. We got that beautiful country, so yes, from Australia, the southern part of England-- the southern tip. 

<b>CRAIG BOX: We did set that question up a little bit. I'm actually in Australia this week, and I'll let you know it's quite a nice place. I can't imagine why you would have left.</b>

LACHLAN EVENSON: Yeah, it seems fitting that you're interviewing an Australian from Australia, and that Australian is in San Francisco. 

<b>CRAIG BOX: Oh, well, thank you very much for joining us and making it work. This is the third in our occasional series of release lead interviews. We talked to Josh and Tim from Red Hat and VMware, respectively, in [episode 10](https://kubernetespodcast.com/episode/010-kubernetes-1.11/), and we talked to Aaron from Google in [episode 46](https://kubernetespodcast.com/episode/046-kubernetes-1.14/). And we asked all three how their journey in cloud-native started. What was your start in cloud-native?</b>

LACHLAN EVENSON: I remember back in early 2014, I was working for a company called Lithium Technologies. We'd been using containers for quite some time, and my boss at the time had put a challenge out to me-- go and find a way to orchestrate these containers, because they seem to be providing quite a bit of value to our developer velocity. 

He gave me a week, and he said, go and check out both Mesos and Kubernetes. And at the end of that week, I had Kubernetes up and running, and I had workloads scheduled. I was a little bit more challenged on the Mesos side, but Kubernetes was there, and I had it up and running. And from there, I actually went and was offered to speak at the Kubernetes 1.0 launch in OSCOM in Portland in 2014, I believe. 

<b>CRAIG BOX: So, a real early adopter?</b>

LACHLAN EVENSON: Really, really early. I remember, I think, I started in 0.8, before CrashLoopBackOff was a thing. I remember writing that thing myself. 

[LAUGHING] 

<b>CRAIG BOX: You were contributing to the code at that point as well?</b>

LACHLAN EVENSON: I was just a user. I was part of the community at that point, but from a user perspective. I showed up to things like the community meeting. I remember meeting Sarah Novotny in the very early years of the community meeting, and I spent some time in SIG Apps, so really looking at how people were putting workloads onto Kubernetes-- so going through that whole process. 

It turned out we built some tools like Helm, before Helm existed, to facilitate rollout and putting applications onto Kubernetes. And then, once Helm existed, that's when I met the folks from Deis, and I said, hey, I think you want to get rid of this code that we've built internally and then go and use the open-source code that Helm provided. 

So we got into the Helm ecosystem there, and I subsequently went and worked for Deis, specifically on professional services-- helping people out in the community with their Kubernetes journey. And that was when we actually met, Craig, back in Berlin. It seems, you know, I say container years are like dog years; it's 7:1. 

<b>CRAIG BOX: Right.</b>

LACHLAN EVENSON: Seven years ago, we were about 50 years-- much younger.

<b>CRAIG BOX: That sounds like the same ratio as kangaroos to people in Australia.</b>

LACHLAN EVENSON: It's much the same arithmetic, yes. 

<b>ADAM GLICK: What was the most interesting implementation that you ran into at that time?</b>

LACHLAN EVENSON: There wasn't a lot of the workload APIs. Back in 1.0, there wasn't even Deployments. There wasn't Ingress. Back in the day, there were a lot of people in those points trying to build those workload APIs on top of Kubernetes, but they didn't actually have any way to extend Kubernetes itself. There were no third-party resources. There were no operators, no custom resources. 

A lot of people are actually trying to figure out how to interact with the Kubernetes API and deliver things like deployments, because you just had-- in those days, you didn't have replica sets. You had a ReplicationController that we called the RC, back in the day. You didn't have a lot of these things that we take for granted today. There wasn't RBAC. There wasn't a lot of the things that we have today. 

So it's great to have seen and been a part of the Kubernetes community from 0.8 to 1.16, and actually leading that release. So I've seen a lot, and it's been a wonderful part of my adventures in open-source. 

<b>ADAM GLICK: You were also part of the Deis team that transitioned and became a part of the Microsoft team. What was that transition like, from small startup to joining a large player in the cloud and technology community?</b>

LACHLAN EVENSON: It was fantastic. When we came on board with Microsoft, they didn't have a managed Kubernetes offering, and we were brought on to try and seed that. There was also a bigger part that we were actually building open-source tools to help people in the community integrate. We had the autonomy with-- Brendan Burns was on the team. We had Gabe Monroy. And we really had that top-down autonomy that was believing and placing a bet on open-source and helping us build tools and give us that autonomy to go and solve problems in open-source, along with contributing to things like Kubernetes. 

I'm part of the upstream team from a PM perspective, and we have a bunch of engineers, a bunch of PMs that are actually working on these things in the Cloud Native Compute Foundation to help folks integrate their workloads into things like Kubernetes and build and aid their cloud-native journeys. 

<b>CRAIG BOX: There are a number of new tools, and specifications, and so on that are still coming out from Microsoft under the Deis brand. That must be exciting to you as one of the people who joined from Deis initially.</b>

LACHLAN EVENSON: Yeah, absolutely. We really took that Deis brand-- it's now Deis Labs-- but we really wanted this a home to signal to the community that we were building things in the hope to put them out into foundation. You may see things like CNAB, Cloud Native Application Bundles. I know [you've had both Ralph and Jeremy on the show before](https://kubernetespodcast.com/episode/061-cnab/) talking about CNAB, SMI - Service Mesh Interface, other tooling in the ecosystem where we want to signal to the community that we want to go give that to a foundation. We really want a neutral place to begin that nascent work, but then things, for example, Virtual Kubelet started there as well, and it went out into the Cloud Native Compute Foundation. 

<b>ADAM GLICK: Is there any consternation about the fact that Phippy has become the character people look to rather than the actual "Captain Kube" owl, in the [family of donated characters](https://www.cncf.io/phippy/)?</b>

LACHLAN EVENSON: Yes, so it's interesting because I didn't actually work on that project back at Deis, but the Deis folks, Karen Chu and Matt Butcher actually created "The Children's Guide to Kubernetes," which I thought was fantastic. 

<b>ADAM GLICK: Totally.</b>

LACHLAN EVENSON: Because I could sit down and read it to my parents, as well, and tell them-- it wasn't for children. It was more for the adults in my life, I like to say. And so when I give out a copy of that book, I'm like, take it home and read it to mum. She might actually understand what you do by the end of that book. 

But it was really a creative way, because this was back in that nascent Kubernetes where people were trying to get their head around those concepts-- what is a pod? What is a secret? What is a namespace? Having that vehicle of a fun set of characters-- 

<b>ADAM GLICK: Yep.</b>

LACHLAN EVENSON: And Phippy is a PHP app. Remember them? So yeah, it's totally in line with the things that we're seeing people want to containerize and put onto Kubernetes at that. But Phippy is still cute. I was questioned last week about Captain Kube, as well, on the release logo, so we could talk about that a little bit more. But there's a swag of characters in there that are quite cute and illustrate the fun concept behind the Kubernetes community. 

<b>CRAIG BOX: [1.16 has just been released](https://kubernetes.io/blog/2019/09/18/kubernetes-1-16-release-announcement/). You were the release team lead for that-- congratulations.</b>

LACHLAN EVENSON: Thank you very much. It was a pleasure to serve the community. 

<b>CRAIG BOX: What are the headline announcements in Kubernetes 1.16?</b>

LACHLAN EVENSON: Well, I think there are a few. Custom Resources hit GA. Now, that is a big milestone for extensibility and Kubernetes. I know we've spoken about them for some time-- custom resources were introduced in 1.7, and we've been trying to work through that ecosystem to bring the API up to a GA standard. So it hit GA, and I think a lot of the features that went in as part of the GA release will help people in the community that are writing operators. 

There's a lot of lifecycle management, a lot of tooling that you can put into the APIs themselves. Doing strict dependency checks-- you can do typing, you can do validation, you can do pruning superfluous fields, and allowing for that ecosystem of operators and extensibility in the community to exist on top of Kubernetes. 

It's been a long road to get to GA for Custom Resources, but it's great now that they're here and people can really bank on that being an API they can use to extend Kubernetes. So I'd say that's a large headline feature. The metrics overhaul, as well-- I know this was on the release blog. 

The metrics team have actually tried to standardize the metrics in Kubernetes and put them through the same paces as all other enhancements that go into Kubernetes. So they're really trying to put through, what are the criteria? How do we make them standard? How do we test them? How to make sure that they're extensible? So it was great to see that team actually step up and create stable metrics that everybody can build and stack on. 

Finally, there were some other additions to CSI, as well. Volume resizing was added. This is a maturity story around the Container Storage Interface, which was introduced several releases ago in GA. But really, you've seen volume providers actually build on that interface and that interface get a little bit more broader to adopt things like "I want to resize dynamically at runtime on my storage volume".  That's a great story as well, for those providers out there. 

I think they're the big headline features for 1.16, but there are a slew. There were 31 enhancements that went into Kubernetes 1.16. And I know there have been questions out there in the community saying, well, how do we decide what's stable? Eight of those were stable, eight of those were beta, and the rest of those features, the 15 remaining, were actually in alpha. There were quite a few things that went from alpha into beta and beta into stable, so I think that's a good progression for the release, as well. 

<b>ADAM GLICK: As you've looked at all these, which of them is your personal favorite?</b>

LACHLAN EVENSON: I probably have two. One is a little bit biased, but I personally worked on, with the [dual-stack](https://kubernetes.io/docs/concepts/services-networking/dual-stack/) team in the community. Dual-stack is the ability to give IPv4 and IPv6 addresses to both pods and services. And I think where this is interesting in the community is Kubernetes is becoming a runtime that is going to new spaces. Think IoT, think edge, think cloud edge. 

When you're pushing Kubernetes into these new operational environments, things like addressing may become a problem, where you might want to run thousands and thousands of pods which all need IP addresses. So, having that same crossover point where I can have v4 and v6 at the same time, get comfortable with v6, I think Kubernetes may be an accelerator to v6 adoption through things like IoT workloads on top of Kubernetes. 

The other one is [Endpoint Slices](https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/). Endpoint slices is about scaling. As you may know, services have endpoints attached to them, and endpoints are all the pod IPs that actually match that label selector on a service. Now, when you have large clusters, you can imagine the number of pod IPs being attached to that service growing to tens of thousands. And when you update that, everything that actually watches those service endpoints needs to get an update, which is the delta change over time, which gets rather large as things are being attached, added, and removed, as is the dynamic nature of Kubernetes. 

But what endpoint slices makes available is you can actually slice those endpoints up into groups of 100 and then only update the ones that you really need to worry about, which means as a scaling factor, we don't need to update everybody listening into tens of thousands of updates. We only need to update a subsection. So I'd say they're my two highlights, yeah. 

<b>CRAIG BOX: Are there any early stage or alpha features that you're excited to see where they go personally?</b>

LACHLAN EVENSON: Personally, [ephemeral containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/). The tooling that you have available at runtime in a pod is dependent on the constituents or the containers that are part of that pod. And what we've seen in containers being built by scratch and tools like [distroless](https://github.com/GoogleContainerTools/distroless) from the folks out of Google, where you can build scratch containers that don't actually have any tooling inside them but just the raw compiled binaries, if you want to go in and debug that at runtime, it's incredibly difficult to insert something in. 

And this is where ephemeral containers come in. I can actually insert a container into a running pod-- and let's just call that a debug container-- that has all my slew of tools that I need to debug that running workload, and I can insert that into a pod at runtime. So I think ephemeral containers is a really interesting feature that's been included in 1.16 in alpha, which allows a greater debugging story for the Kubernetes community. 

<b>ADAM GLICK: What feature that slipped do you wish would have made it into the release?</b>

LACHLAN EVENSON: The feature that slipped that I was a little disappointed about was [sidecar containers](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/sidecarcontainers.md). 

<b>ADAM GLICK: Right.</b>

LACHLAN EVENSON: In the world of service meshes, you may want to order the start of some containers, and it's very specific to things like service meshes in the case of the data plane. I need the Envoy sidecar to start before everything else so that it can wire up the networking. 

The inverse is true as well. I need it to stop last. Sidecar containers gave you that ordered start. And what we see a lot of people doing in the ecosystem is just laying down one sidecar per node as a DaemonSet, and they want that to start before all the other pods on the machine. Or if it's inside the pod, or the context of one pod, they want to say that sidecar needs to stop before all the other containers in a pod. So giving you that ordered guarantee, I think, is really interesting and is really hot, especially given the service mesh ecosystem heating up. 

<b>CRAIG BOX: This release [deprecates a few beta API groups](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/), for things like ReplicaSets and Deployments. That will break deployment for the group of people who have just taken example code off the web and don't really understand it. The GA version of these APIs were released in 1.9, so it's obviously a long time ago. There's been a lot of preparation going into this. But what considerations and concerns have we had about the fact that these are now being deprecated in this particular release?</b>

LACHLAN EVENSON: Let me start by saying that this is the first release that we've had a big API deprecation, so the proof is going to be in the pudding. And we do have an API deprecation policy. So as you mentioned, Craig, the apps/v1 group has been around since 1.9. If you go and read the [API deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/), you can see that we have a three-release announcement. Around the 1.12, 1.13 time frame, we actually went and announced this deprecation, and over the last few releases, we've been reiterating that. 

But really, what we want to do is get the whole community on those stable APIs because it really starts to become a problem when we're supporting all these many now-deprecated APIs, and people are building tooling around them and trying to build reliable tooling. So this is the first test for us to move people, and I'm sure it will break a lot of tools that depend on things. But I think in the long run, once we get onto those stable APIs, people can actually guarantee that their tools work, and it's going to become easier in the long run. 

So we've put quite a bit of work in announcing this. There was a blog sent out about six months ago by Valerie Lancey in the Kubernetes community which said, hey, go use 'kubectl convert', where you can actually say, I want to convert this resource from this API version to that API version, and it actually makes that really easy. But I think there'll be some problems in the ecosystem, but we need to do this going forward, pruning out the old APIs and making sure that people are on the stable ones. 

<b>ADAM GLICK: Congratulations on the release of 1.16. Obviously, that's a big thing. It must have been a lot of work for you. Can you talk a little bit about what went into leading this release?</b>

LACHLAN EVENSON: The job of the release lead is to oversee throughout the process of the release and make sure that the release gets out the door on a specific schedule. So really, what that is is wrangling a lot of different resources and a lot of different people in the community, and making sure that they show up and do the things that they are committed to as part of their duties as either SIG chairs or other roles in the community, and making sure that enhancements are in the right state, and code shows up at the right time, and that things are looking green. 

A lot of it is just making sure you know who to contact and how to contact them, and ask them to actually show up. But when I was asked at the end of the 1.15 release cycle if I would lead, you have to consider how much time it's going to take and the scheduling, where hours a week are dedicated to making sure that this release actually hits the shelves on time and is of a certain quality. So there is lots of pieces to that. 

<b>ADAM GLICK: Had you been on the path through the shadow program for release management?</b>

LACHLAN EVENSON: Yeah, I had. I actually joined the shadow program-- so the shadow program for the release team. The Kubernetes release team is tasked with staffing a specific release, and I came in the 1.14 release under the lead of Aaron Crickenberger. And I was an enhancement shadow at that point. I was really interested in how KEPs worked, so the Kubernetes Enhancement Proposal work. I wanted to make sure that I understood that part of the release team, and I came in and helped in that release. 

And then, in 1.15, I was asked if I could be a lead shadow. And the lead shadow is to stand alongside the lead and help the lead fill their duties. So if they're out, if they need people to wrangle different parts of the community, I would go out and do that. I've served on three releases at this point-- 1.14, 1.15, and 1.16. 

<b>CRAIG BOX: Thank you for your service.</b>

LACHLAN EVENSON: Absolutely, it's my pleasure. 

<b>ADAM GLICK: Release lead emeritus is the next role for you, I assume?</b>

LACHLAN EVENSON: [LAUGHS] Yes. We also have a new role on the release lead team called Emeritus Advisors, which are actually to go back and help answer the questions of, why was this decision made? How can we do better? What was this like in the previous release? So we do have that continuity, and in 1.17, we have the old release lead from 1.15. Claire Lawrence is coming back to fill in as emeritus advisor. So that is something we do take. 

And I think for the shadow program in general, the release team is a really good example of how you can actually build continuity across releases in an open-source fashion. We [actually have a session at KubeCon San Diego](https://www.youtube.com/watch?v=ritHCLd2xeE) on how that shadowing program works. But it's really to get people excited about how we can do mentoring in open-source communities and make sure that the project goes on after all of us have rolled on and off the team. 

<b>ADAM GLICK: Speaking of the team, [there were 32 people involved](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.16), including yourself, in this release. What is it like to coordinate that group? That sounds like a full time job.</b>

LACHLAN EVENSON: It is a full time job. And let me say that this release team in 1.16 represented five different continents. We can count Antarctica as not having anybody, but we didn't have anybody from South America for that release, which was unfortunate. But we had people from Australia, China, India, Tanzania. We have a good spread-- Europe, North America. It's great to have that spread and that continuity, which allowed for us to get things done throughout the day. 

<b>CRAIG BOX: Until you want to schedule a meeting.</b>

LACHLAN EVENSON: Scheduling a meeting was extremely difficult. Typically, on the release team, we run one Europe, Western Europe, and North American-friendly meeting, and then we ask the team if they would like to hold another meeting. Now, in the case of 1.16, they didn't want to hold another meeting. We actually put it out to survey. But in previous releases, we held an EU in the morning so that people in India, as well, or maybe even late-night in China, could be involved. 

<b>ADAM GLICK: Any interesting facts about the team, besides the incredible geographic diversity that you had, to work around that?</b>

LACHLAN EVENSON: I really appreciate about the release team that we're from all different backgrounds, from all different parts of the world and all different companies. There are people who are doing this on their own time, There are people who are doing this on company time, but we all come together with that shared common goal of shipping that release. 

This release was we had the five continents. It was really exciting in 1.17 that we have in the lead roles, it was represented mainly by women. So 1.17, watch out-- most of the leads for 1.17 are women, which is a great result, and that's through that shadow program that we can foster different types of talent. I'm excited to see future releases benefiting from different diverse groups of people from the Kubernetes community. 

<b>CRAIG BOX: What are you going to put in the proverbial envelope for the 1.17 team?</b>

LACHLAN EVENSON: We've had this theme of a lot of roles in the release team being cut and dry, right? We have these release handbooks, so for each of the members of the team, they're cut into different roles. There's seven different roles on the team. There's the lead. There's the CI signal role. There's bug triage. There's comms. There's docs. And there's release notes. And there's also the release branch managers who actually cut the code and make sure that they have shipped and it ends up in all the repositories. 

What we did in the previous 1.15, we actually had a role call the test-infra role. And thanks to the wonderful work of the folks of the test-infra team out of Google-- [Katharine Berry](https://kubernetespodcast.com/episode/077-eng-prod-and-testing/), and [Ben Elder](https://kubernetespodcast.com/episode/069-kind/), and other folks-- they actually automated this role completely that we could get rid of it in the 1.16 release and still have our same-- and be able to get a release out the door. 

I think a lot of these things are ripe for automation, and therefore, we can have a lot less of a footprint going forward. Let's automate the bits of the process that we can and actually refine the process to make sure that the people that are involved are not doing the repetitive tasks over and over again. In the era of enhancements, we could streamline that process. CI signal and bug triage, there are places we could actually go in and automate that as well. I think one place that's been done really well in 1.16 was in the release notes. 

I don't know if you've seen [relnotes.k8s.io](https://relnotes.k8s.io), but you can go and check out the release notes and now, basically, annotated PRs show up as release notes that are searchable and sortable, all through an automated means, whereas that was previously some YAML jockeying to make sure that that would actually happen and be digestible to the users. 

<b>CRAIG BOX: Come on, Lachie, all Kubernetes is just YAML jockeying.</b>

[LAUGHING] 

LACHLAN EVENSON: Yeah, but it's great to have an outcome where we can actually make that searchable and get people out of the mundaneness of things like, let's make sure we're copying and pasting YAML from left to right. 

<b>ADAM GLICK: After the release, you had a [retrospective meeting](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#heading=h.ipohe1hgr315). What was the takeaway from that meeting?</b>

LACHLAN EVENSON: At the end of each release, we do have a retrospective. It's during the community meeting. That retrospective, it was good. I was just really excited to see that there were so many positives. It's a typical retrospective where we go, what did we say we were going to do last release? Did we do that? What was great? What can we do better? And some actions out of that. 

It was great to see people giving other people on the team so many compliments. It was really, really deep and rich, saying, thank you for doing this, thank you for doing that. People showed up and pulled their weight in the release team, and other people were acknowledging that. That was great. 

I think one thing we want to do is-- we have a code freeze as part of the release process, which is where we make sure that code basically stops going into master in Kubernetes. Only things destined for the release can actually be put in there. But we don't actually stop the test infrastructure from changing, so the test infrastructure has a lifecycle of its own. 

One of the things that was proposed was that we actually code freeze the test infrastructure as well, to make sure that we're not actually looking at changes in the test-infra causing jobs to fail while we're trying to stabilize the code. I think that's something we have some high level agreement about, but getting down into the low-level nitty-gritty would be great in 1.17 and beyond. 

<b>ADAM GLICK: We talked about sidecar containers slipping out of this release. Most of the features are on a release train, and are put in when they're ready. What does it mean for the process of managing a release when those things happen?</b>

LACHLAN EVENSON: Basically, we have an enhancements freeze, and that says that enhancements-- so the KEPs that are backing these enhancements-- so the sidecar containers would have had an enhancement proposal. And the SIG that owns that code would then need to sign off and say that this is in a state called "implementable." When we've agreed on the high-level details, you can go and proceed and implement that. 

Now, that had actually happened in the case of sidecar containers. The challenge was you still need to write the code and get the code actually implemented, and there's a month gap between enhancement freeze and code freeze. If the code doesn't show up, or the code shows up and needs to be reviewed a little bit more, you may miss that deadline. 

I think that's what happened in the case of this specific feature. It went all the way through to code freeze, the code wasn't complete at that time, and we basically had to make a call-- do we want to grant it an exception? In this case, they didn't ask for an exception. They said, let's just move it to 1.17. 

There's still a lot of people and SIGs show up at the start of a new release and put forward the whole release of all the things they want to ship, and obviously, throughout the release, a lot of those things get plucked off. I think we started with something like 60 enhancements, and then what we got out the door was 31. They either fall off as part of the enhancement freeze or as part of the code freeze, and that is absolutely typical of any release. 

<b>ADAM GLICK: Do you think that a three-month wait is acceptable for something that might have had a one- or two-week slip, or would you like to see enhancements be able to be released in point releases between the three-month releases?</b>

LACHLAN EVENSON: Yeah, there's back and forth about this in the community, about how can we actually roll things at different cadences, I think, is the high-level question. Tim Hockin actually put out, how about we do stability cycles as well? Because there are a lot of new features going in, and there are a lot of stability features going in. But if you look at it, half of the features were beta or stable, and the other half were alpha, which means we're still introducing a lot more complexity and largely untested code into alpha state-- which, as much as we wouldn't like to admit, it does affect the stability of the system. 

There's talk of LTS. There's talk of stability releases as well. I think they're all things that are interesting now that Kubernetes has that momentum, and you are seeing a lot of things go to GA. People are like, "I don't need to be drinking from the firehose as fast. I have CRDs in GA. I have all these other things in GA. Do I actually need to consume this at the rate?" So I think-- stay tuned. If you're interested in those discussions, the upstream community is having those. Show up there and voice your opinion. 

<b>CRAIG BOX: Is this the first release with its own [release mascot](https://raw.githubusercontent.com/kubernetes/sig-release/master/releases/release-1.16/116_unlimited_breadsticks_for_all.png)?</b>

LACHLAN EVENSON: I think that release mascot goes back to-- I would like to say 1.11? If you [go back to 1.11](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.11/README.md), you can actually see the different mascots. I remember 1.11 being "The Hobbit." So it's the Hobbiton front door of Bilbo Baggins with the Kubernetes Helm on the front of it, and that was called 11ty-one-- 

<b>CRAIG BOX: Uh-huh.</b>

LACHLAN EVENSON: A long-expected release. So they go through from each release, and you can actually go check them out on the SIG release repository upstream. 

<b>CRAIG BOX: I do think this is the first time that's managed to make it into a blog post, though.</b>

LACHLAN EVENSON: I do think it is the case. I wanted to have a little bit of fun with the release team, so typically you will see the release teams have a t-shirt. I have, [from 1.14, the Caternetes](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.14/README.md), which Aaron designed, which has a bunch of cats kind of trying to look at a Kubernetes logo. 

<b>CRAIG BOX: We had a fun conversation with Aaron about his love of cats.</b>

LACHLAN EVENSON: [LAUGHS] And it becomes a token of, hey, remember this hard work that you put together? It becomes a badge of honor for everybody that participated in the release.  I wanted to highlight it as a release mascot. I don't think a lot of people knew that we did have those across the last few releases. But it's just a bit of fun, and I wanted to put my own spin on things just so that the team could come together. A lot of it was around the laughs that we had as a team throughout this release-- and my love of Olive Garden. 

<b>CRAIG BOX: Your love of Olive Garden feels like it may have become a meme to a community which might need a little explanation for our audience. For those who are not familiar with American fine dining, can we start with-- what exactly is Olive Garden?</b>

LACHLAN EVENSON: Olive Garden is the finest Italian dining experience you will have in the continental United States. I see everybody's faces saying, is he sure about that? I'm sure. 

<b>CRAIG BOX: That might require a slight justification on behalf of some of our Italian-American listeners.</b>

<b>ADAM GLICK: Is it the unlimited breadsticks and salad that really does it for you, or is the plastic boat that it comes in?</b>

LACHLAN EVENSON: I think it's a combination of all three things. You know, the tour of Italy, you can't go past. The free breadsticks are fantastic. But Olive Garden just represents the large chain restaurant and that kind of childhood I had growing up and thinking about these large-scale chain restaurants. You don't get to choose your meme. And the legacy-- I would have liked to have had a different mascot. 

But I just had a run with the meme of Olive Garden. And this came about, I would like to say, about three or four months ago. Paris Pittman from Google, who is another member of the Kubernetes community, kind of put out there, what's your favorite sit-down large-scale restaurant? And of course, I pitched in very early and said, it's got to be the Olive Garden. 

And then everybody kind of jumped onto that. And my inbox is full of free Olive Garden gift certificates now, and it's taken on a life of its own. And at this point, I'm just embracing it-- so much so that we might even have the 1.16 release party at an Olive Garden in San Diego, if it can accommodate 10,000 people. 

<b>ADAM GLICK: [When you're there, are you family?](https://www.youtube.com/watch?v=9ZJF5-EyjXs)</b>

LACHLAN EVENSON: Yes. Absolutely, absolutely. And I would have loved to put that. I think the release name was "unlimited breadsticks for all." I would have liked to have done, "When you're here, you're family," but that is, sadly, trademarked. 

<b>ADAM GLICK: Aww. What's next for you in the community?</b>

LACHLAN EVENSON: I've really been looking at Cluster API a lot-- so building Kubernetes clusters on top of a declarative approach. I've been taking a look at what we can do in the Cluster API ecosystem. I'm also a chair of SIG PM, so helping foster the KEP process as well-- making sure that that continues to happen and continues to be fruitful for the community. 

<hr/>

<i>[Lachlan Evenson](https://twitter.com/lachlanevenson) is a Principal Program Manager at Microsoft and an Australian living in the US, and most recently served as the Kubernetes 1.16 release team lead.

You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@kubernetespod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode.</i>
