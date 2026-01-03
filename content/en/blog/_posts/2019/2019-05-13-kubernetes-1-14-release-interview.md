---
layout: blog
title: "Cat shirts and Groundhog Day: the Kubernetes 1.14 release interview"
date: 2019-05-13
author: >
  Craig Box (Google) 
---

Last week we celebrated one year of the [Kubernetes Podcast from Google](https://kubernetespodcast.com/). In this weekly show, my co-host Adam Glick and I focus on all the great things that are happening in the world of Kubernetes and Cloud Native. From the news of the week, to interviews with people in the community, we help you stay up to date on everything Kubernetes.

Every few cycles we check in on the release process for Kubernetes itself.  Last year we [interviewed the release managers for Kubernetes 1.11](https://kubernetespodcast.com/episode/010-kubernetes-1.11/), and shared that transcript on the Kubernetes blog.  We got such great feedback that we wanted to share the transcript of our recent conversation with Aaron Crickenberger, the release manager for Kubernetes 1.14.

As always, the canonical version can be enjoyed by listening to [the podcast version](https://kubernetespodcast.com/episode/046-kubernetes-1.14/). If you like what you hear, [we encourage you to subscribe](https://kubernetespodcast.com/subscribe/)!

<hr/>

<b>CRAIG BOX: We like to start with our guests into digging into their backgrounds a little bit. Kubernetes is built from contributors from many different companies. You worked on Kubernetes at Samsung SDS before joining Google. Does anything change in your position in the community and the work you do, when you change companies?</b>

AARON CRICKENBERGER: Largely, no. I think the food's a little bit better at the current company! But by and large, I have gotten to work with basically the same people doing basically the same thing. I cared about the community first and Google second before I joined Google, and I kind of still operate that way mostly because I believe that Google's success depends upon the community's success, as does everybody else who depends upon Kubernetes. A good and healthy upstream makes a good and healthy downstream. 

So that was largely why Samsung had me working on Kubernetes in the first place was because we thought the technology was legit. But we needed to make sure that the community and project as a whole was also legit. And so that's why you've seen me continue to advocate for transparency and community empowerment throughout my tenure in Kubernetes. 

<b>ADAM GLICK: You co-founded the [Testing SIG](https://github.com/kubernetes/community/tree/master/sig-testing). How did you decide that that was needed, and at what stage in the process did you come to that?</b>

AARON CRICKENBERGER: This was very early on in the Kubernetes project. I'm actually a little hazy on specifically when it happened. But at the time, my boss, Bob Wise, worked with some folks within Google to co-found the Scalability SIG. 

If you remember way, way back when Kubernetes first started, there was concern over whether or not Kubernetes was performance enough. Like, I believe it officially supported something on the order of 100 nodes. And there were some who thought, that's silly. I mean, come on, Google can do way more than that. And who in their right mind is going to use a container orchestrator that only supports 100 nodes? 

And of course the thing is we're being super-conservative. We're trying to iterate, ship early and often. And so we helped push the boundaries to make sure that Kubernetes could prove that it worked up to a thousand nodes before it was even officially supported to say, look, it already does this, we're just trying to make sure we have all of the nuts and bolts tightened. 

OK, so great. We decided we needed to create a thing called a SIG in the very first place to talk about these things and make sure that we were moving in the right direction. I then turned my personal attention to testing as the next thing that I believe needed a SIG. So I believe that testing was the second SIG ever to be created for Kubernetes. It was co-founded initially with [Ike McCreary](https://github.com/ihmccreery) who, at the time I believe, was an SRE for Google, and then eventually it was handed over to some folks who work in the engineering productivity part of Google where I think it aligned really well with testing's interests. 

It is like "I don't know what you people are trying to write here with Kubernetes, but I want to help you write it better, faster, and stronger". And so I want to make sure we, as a community and as a project, are making it easier for you to write tests, easier for you to run tests, and most importantly, easier for you to act based on those test results. 

That came down to, let's make sure that Kubernetes gets tested on more than just Google Cloud. That was super important to me, as somebody who operated not in Google Cloud but in other clouds. I think it really helped sell the story and build confidence in Kubernetes as something that worked effectively on multiple clouds. And I also thought it was really helpful to see SIG Testing in the community's advocacy move us to a world today we can use test grids so that everybody see the same set of test results to understand what is allowed to prevent Kubernetes from going out the door. 

The process was basically just saying, let's do it. The process was finding people who were motivated and suggesting that we meet on a recurring basis and we try to rally around a common set of work. This was sort of well before SIG governance was an official thing. And we gradually, after about a year, I think, settled on the pattern that most SIGs follow where you try to make sure you have a meeting agenda, you have a Slack channel, you have a mailing list, you discuss everything out in the open, you try to use sort a consistent set of milestones and move forward. 

<b>CRAIG BOX: A couple of things I wanted to ask about your life before Kubernetes. Why is there a [Black Hawk flight simulator in a shipping container?](https://www.rockwellcollins.com/Products-and-Services/Defense/Simulation-and-Training/Training-Systems/Transportable-Black-Hawk-Operations-Simulator.aspx)</b>

AARON CRICKENBERGER: As you may imagine, Black Hawk helicopters are flown in a variety of places around the world, not just next to a building that happens to have a parking lot next to it. And so in order to keep your pilots fresh, you may want to make sure they have good training hours and flight time, without spending fuel to fly an actual helicopter. 

I was involved in helping make what's called a operation simulator, to train pilots on a bunch of the procedures using the same exact hardware that was deployed in Black Hawk helicopters, complete with motion seats that would shake to simulate movement and a full-fidelity visual system. This was all packed up in two shipping containers so that the simulator could be deployed wherever needed. 

I definitely had a really fun experience working on this simulator in the field at an Air Force base prior to a conference where I got to experience F-16s doing takeoff drills, which was amazing. They would get off the runway, and then just slam the afterburners to max and go straight up into the air. And I got to work on graphic simulation bugs. It was really cool. 

<b>CRAIG BOX: And for a lot of people, when you click on the web page they have listed in the GitHub link, you get their resume, or you get the list of open source projects they work on. In your case, there is [a SoundCloud page](https://soundcloud.com/spiffxp). What do people find on that page?</b>

AARON CRICKENBERGER: They get to see me living my whole life. I find that music is a very important part of my life. It's a non-verbal voice that I have developed over time. I needed some place to host that. And then it came down between SoundCloud and Bandcamp, and SoundCloud was a much easier place to host my recordings. 

So you get to hear the results of me having picked up a guitar and noodling with that about five years ago. You get to hear what I've learned messing around with Ableton Live. You get to hear some mixes that I've done of ambient music. And I haven't posted anything in a while there because I'm trying to get my recording of drums just right. 

So if you go to [my YouTube channel](https://www.youtube.com/channel/UCfnUO-9Q_gMraUXjbk4p50g), mostly what you'll see are recordings of the various SIG meetings that I've participated in. But if you go back a little bit earlier than that, you'll see that I do, in fact, play the drums. I'm trying to get those folded into my next songs. 

<b>CRAIG BOX: Do you know who [Hugh Padgham](https://en.wikipedia.org/wiki/Hugh_Padgham#The_%22gated_drum%22_sound) is?</b>

AARON CRICKENBERGER: I do not. 

<b>CRAIG BOX: Hugh Padgham was the recording engineer who did the gated reverb drum sound that basically defined Phil Collins in the 1980s. I think you should call him up if you're having problems with your drum sound.</b>

AARON CRICKENBERGER: That is awesome. 

<b>ADAM GLICK: You mentioned you can also find videos of the work that you're doing with the SIG. How did you become the release manager for 1.14?</b>

AARON CRICKENBERGER: I've been involved in the Kubernetes release process way back in the 1.4 days. I started out as somebody who tried to help figure out, how do you write release notes for this thing? How do you take this whole mess and try to describe it in a sane way that makes sense to end users and developers? And I gradually became involved in other aspects of the release over time. 

I helped out with CI Signal. I helped out with issue triage. When I helped out with CI Signal, I wrote the [very first playbook](https://github.com/kubernetes/sig-release/blob/master/release-team/role-handbooks/ci-signal/README.md) to describe what it is I do around here. That's the model that has since been used for the rest of the release team, where every role describes what they do in a playbook that is used not just for their own benefit, but to help them train other people. 

Formally how I became release lead was I served as release shadow in 1.13. And when release leads are looking to figure out who's going to lead the next release, they turn around and they look at their shadows, because those are who they have been helping out and training. 

<b>CRAIG BOX: If they don't have a shadow, do they have to wait another three months and do a release again?</b>

AARON CRICKENBERGER: They do not. The way it works is the release lead can look at their shadows, then they take a look at the rest of their release team leads to see if there is sufficient experience there. And then if not, they consult with the chairs of SIG release. 

So for example, for Kubernetes v1.15, I ended up in an unfortunate situation where neither of my shadows were available to step up and become the leads for 1.15. I consulted with [Claire Lawrence](https://github.com/claurence), who was my enhancements lead for 1.14 and who was on the release team for two quarters, and so met the requirements to become a release lead that way. So she will be the release lead for v1.15. 

<b>CRAIG BOX: That was a fantastic answer to a throwaway [Groundhog Day](https://en.wikipedia.org/wiki/Groundhog_Day) joke. I appreciate that.</b>

AARON CRICKENBERGER: [LAUGHS] 

<b>ADAM GLICK: You can ask it again and see what the answer is, and then another time, and see how it evolves over time.</b>

AARON CRICKENBERGER: I'm short on my Groundhog Day riffs. I'll come back to you. 

<b>ADAM GLICK: What are your responsibilities as the release lead?</b>

AARON CRICKENBERGER: Don't Panic. I mean, essentially, a release lead's job is to make the final call, and then hold the line by making the final call. So what you shouldn't be doing as a release lead is attempting to dive in and fix all of the things, or do all of the things, or second-guess anybody else's work. You are there principally and primarily to listen to everybody else's advice and help them make the best decision. And only in the situations where there's not a clear consensus do you wade in and make the call yourself. 

I feel like I was helped out by a very capable team in this regard, this release cycle. So it was super helpful. But as somebody who has what I like to call an "accomplishment monkey" on my back, it can be very difficult to resist the urge to dive right in and help out, because I have been there before. I have the boots-on-the-ground experience. 

The release lead's job is not to be the boots on the ground, but to help make sure that everybody who is boots on the ground is actually doing what they need to do and unblocked in doing what they need to do. It also involves doing songs and dances and making funny pictures. So I view it more as like it's about effective communication. And doing a lot of songs and dances, and funny pictures, and memes is one way that I do that. 

So one way that I thought it would help people pay attention to the release updates that I gave every week at the Kubernetes community meeting was to make sure that I wore a different cat T-shirt each week. After people riffed and joked out my first cat T-shirt where I said, I really need coffee right "meow", and somebody asked if I got that coffee from a "purr-colator", I decided to up the ante. 

And I've heard that people will await those cat T-shirts. They want to know what the latest one is. I even got a special cat T-shirt just to signify that code freeze was coming. 

We also decided that instead of imposing this crazy process that involved a lot of milestones, and labels, and whatnot that would cause the machinery to impose a bunch of additional friction, I would just post a lot of memes to Twitter about code freeze coming. And that seems to have worked out really well. So by and large, the release lead's job is communication, unblocking, and then doing nothing for as much as possible. 

It's really kind of difficult and terrifying because you always have this feeling that you may have missed something, or that you're just not seeing something that's out there. So I'm sitting in this position with a release that has been extremely stable, and I spent a lot of time thinking, OK, what am I missing? Like, this looks too good. This is too quiet. There's usually something that blows up. Come on, what is it, what is it, what is it? And it's an exercise in keeping that all in and not sharing it with everybody until the release is over. 

<b>ADAM GLICK: [He is here in a cat T-shirt](https://twitter.com/KubernetesPod/status/1110611630180597760/photo/1), as well.

When a new US President takes over the office, it's customary that the outgoing president leaves them a note with advice in it. Aside from the shadow team, is there something similar that exists with Kubernetes release management?</b>

AARON CRICKENBERGER: Yeah, I would say there's a very special-- I don't know what the word is I'm looking for here-- bond, relationship, or something where people who have been release leads in the past are very empathetic and very supportive of those who step into the role as release lead. 

You know, I talked about release lead being a lot of uncertainty and second-guessing yourself, while on the outside you have to pretend like everything is OK. And having the support of people who have been there and who have gone through that experience is tremendously helpful. 

So I was able to reach out to a previous release lead. Not to pull the game with-- what is it, like two envelopes? The first envelope, you blame the outgoing president. The second envelope, you write two letters. It's not quite like that. 

I am totally happy to be blamed for all of the changes we made to the release process that didn't go well, but I'm also happy to help support my successor. I feel like my job as a release lead is, number one, make sure the release gets out the door, number two, make sure I set up my successor for success. 

So I've already been meeting with Claire to describe what I would do as the introductory steps. And I plan on continuing to consult with Claire throughout the release process to make sure that things are going well. 

<b>CRAIG BOX: If you want to hear the perspective from some previous release leads, check out [episode 10](http://kubernetespodcast.com/episode/010-kubernetes-1.11/), where we interview Josh Berkus and Tim Pepper.</b>

<b>ADAM GLICK: What do you plan to put into that set of notes for Claire?</b>

AARON CRICKENBERGER: That's a really good question. I would tell Claire to trust her team first and trust her gut second. Like I said, I think it is super important to establish trust with your team, because the release is this superhuman effort that involves consuming, or otherwise fielding, or shepherding the work of hundreds of contributors. 

And your team is made up of at least 13 people. You could go all the way up to 40 or 50, if you include all of the people that are being trained by those people. There's so much work out there. It's just more work than any one person can possibly handle. 

It's honestly the same thing I will tell new contributors to Kubernetes is that there's no way you can possibly understand all of it. You will not understand the shape of Kubernetes. You will never be the expert who knows literally all of the things, and that's OK. The important part is to make sure that you have people who, when you don't know the answer, you know who to ask for the answer. And it is really helpful if your team are those people. 

<b>CRAIG BOX: The specific version that you've been working on and the release that's just come out is Kubernetes 1.14. What are some of the new things in this release?</b>

AARON CRICKENBERGER: This release of Kubernetes contains more stable enhancements than any other release of Kubernetes ever. And I'm pretty proud of that fact. I know in the past you may have heard other release leads talk about, like, this is the stability release, or this time we're really making things a little more mature. But I feel a lot of confidence in saying that this time around. 

Like, I stood in a room, and it was a leadership summit, I think, back in 2017 where we said, look, we're really going to try and make Kubernetes more stable. And we're going to focus on sort of hardening the core of Kubernetes and defining what the core of Kubernetes is. And we're not going to accept a bunch of new features. And then we kind of went and accepted a bunch of new features. And that was a while ago. And here we are today. 

But I think we are finally starting to see the results of work that was started back then. [Windows Server Container Support](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/20190103-windows-node-support.md) is probably the biggest one. You can hear Michael Michael tell stories about how SIG Windows was started about three years ago. And today, they can finally announce that Windows Server containers have gone GA. That's a huge accomplishment. 

A lot of the heavy lifting for this, I believe, came at the end. It started with a conversation in Kubernetes 1.13, and was really wrapped up this release where we define, what are Windows Server containers, exactly? How do they differ from Docker containers or other container runtimes that run on Linux? 

Because today so much of the assumptions people make about the functionality that Kubernetes offers are also baked in with the functionality that Linux-based containers offer. And so we wanted to enable people to use the awesome Kubernetes orchestration capabilities that they have come to love, but to also use that to orchestrate some applications or capabilities that are only available on Windows. 

So we put together what's called a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) process, or a KEP, for short. And we said that we're going to use these KEPs to describe exactly what the criteria are to call something alpha, or beta, or stable. And so the Windows feature allowed us to use a KEP-- or in getting Windows in here, we used the KEP to describe everything that would and would not work for Windows Server containers. That was super huge. And that really, I think, helped us better understand or define what Kubernetes is in that context. 

But OK, I've spent most of the time answering your question with just one single stable feature. 

<b>CRAIG BOX: Well, let's dig a little bit in to the KEP process then, because this is the first release where there's a new rule. It says, all proposed enhancements for this release must have an associated KEP. So that's a Kubernetes Enhancement Proposal, a one-page document that describes it. What has the process been like of A, getting engineers on-board with using that, and then B, building something based on these documents?</b>

AARON CRICKENBERGER: It is a process of continued improvement. So it is by no means done, but it honestly required a lot of talking, and saying the same thing over and over to the same people or to different people, as is often the case when it comes to things that involve communication and process changes. But by and large, everybody was pretty much on-board with this. 

There was a little bit of confusion, though, over how high the bar would be set and how rigorously or rigidly we would be enforcing these criteria. And that's where I feel like we have room to iterate and improve on. But we have collectively agreed that, yeah, we do like having all of the information about a particular enhancement in one place. Right? 

The way the world used to operate before is we would throw around Google Docs, that were these design proposals, and then we'd comment on those a bunch. And then eventually, those were turned into markdown files. And those would end up in the community repo, 

And then we'd have a bunch of associated issues that talked about that. And then maybe somebody would open up another issue that they'd call an umbrella issue. And then a bunch of comments would be put there. And then there's lots of discussion that goes on in the PRs. There's like seven different things that I just rattled off there. 

So KEPs are about focusing all of the discussion about the design and implementation and reasoning behind enhancements in one single place. And I think there, we are fully on board. Do we have room to improve? Absolutely. Humans are involved, and it's a messy process. We could definitely find places to automate this better, structure it better. And I look forward to seeing those improvements happen. 

You know, I think another one of the big things was a lot of these KEPs were mired across three different SIGs. There was sort of SIG architecture who had the technical vision for these. There was SIG PM, who-- you know, pick your P of choice-- product, project, process, program, people who are better about how to shepherd things forward, and then SIG release, who just wanted to figure out, what's landing in the release, and why, and how, and why is it important? And so taking the responsibilities across all of those three SIGs and putting it in the right place, which is SIG PM, I think really will help us iterate properly, moving forward. 

<b>CRAIG BOX: The other change in this release is that there is no code slush. [What is a code slush, and why don't we have one anymore?](https://github.com/kubernetes/sig-release/issues/269)</b>

AARON CRICKENBERGER: That's a really good question. I had 10 different people ask me that question over the past couple of months, quarters, years. Take your pick. And so I finally decided, if nobody knows what a code slush is, why do we even have it? 

<b>CRAIG BOX: It's like a thawed freeze, but possibly with sugar?</b>

AARON CRICKENBERGER: [LAUGHING] So code slush is about-- we want to slow the rate of change prior to code freeze. Like, let's accept code freeze as this big deadline where nothing's going to happen after a code freeze. 

So while I really want to assume and aspire to live in a world where developers are super productive, and start their changes early, and get them done when they're done, today, I happen to live in a world where developers are driven by deadlines. And they get distracted. And there's other stuff going on. And then suddenly, they realize there's a code freeze ahead of them. 

And this wonderful feature that they've been thinking about implementing over the past two months, they now have to get done in two weeks. And so suddenly, all sorts of code starts to fly in super fast and super quickly. And OK, that's great. I love empowering people to be productive. 

But what we don't want to have happen is somebody decide to land some massive feature or enhancement that changes absolutely everything. Or maybe they decided they want to refactor the world. And if they do that, then they make everybody else's life super difficult because of merge conflicts and rebases. Or maybe all of the test signal that we had kind-of grown accustomed to and gotten used to, completely changes. 

So code slush was about reminding people, hey, don't be jerks. Be kind of responsible. Please try not to land anything super huge at the last minute. But the way that we enforced this was with, like, make sure your PR has a milestone. And make sure that it has priority critical/urgent. In times past, we were like, make sure there is a label called status approved for milestone. 

We were like, what do all these things even mean? People became obsessed with all the labels, and the milestones, and the process. And they never really paid attention to why we're asking people to pay attention to the fact that code freeze was coming soon. 

<b>ADAM GLICK: Process for process sake, they could start to build on top of each other. You mentioned that there is a number of other things in the release. Do you want to talk about some of the other pieces that are in there?</b>

AARON CRICKENBERGER: Sure. I think two of the other stable features that I believe other people will find to be exciting are [readiness gates](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md) and [Pod priority and preemption](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190131-pod-priority-preemption.md). Today, Pods have the concept of liveliness and readiness. A live Pod has an application running in it, but it might not be ready to do anything. And so when a Pod is ready, that means it's ready to receive traffic. 

So if you're thinking of some big application that's scaled out everywhere, you want to make sure your Pods are only handling traffic when they're good and ready to do so. But prior to 1.14, the only ways you could verify that were by using either TCP probes, HTTP probes, or exec probes. Either make sure that ports are open inside of the container, or run a command inside of the container and see what that command says. 

And then you can definitely customize a fair amount there, but that requires that you put all of that information inside of the Pod. And it might be really useful for some cluster operators to signify some more overarching concerns that they have before a Pod could be ready. So just-- I don't know-- make sure a Pod has registered with some other system to make sure that it is authorized to serve traffic, or something of that nature. Pod readiness gates allow that sort of capability to happen-- to transparently extend the conditions that you use to figure out whether a Pod is ready for traffic. We believe this will enable more sophisticated orchestration and deployment mechanisms for people who are trying to manage their applications and services. 

I feel like Pod priority and preemption will be interesting to consumers who like to oversubscribe their Kubernetes clusters. Instead of assuming everything is the same size and is the same priority, and first Pods win, you can now say that certain Pods are more important than other Pods. They get scheduled before other Pods, and maybe even so that they kick out other Pods to make room for the really important Pods. 

You could think of it as if you have any super important agents or daemons that have to run on your cluster. Those should always be there. Now, you can describe them as high-priority to make sure that they are definitely always there and always scheduled before anything else is. 

<b>ADAM GLICK: Are there any other new features that are in alpha or beta that you're keeping your eye on?</b>

AARON CRICKENBERGER: Yeah. So I feel like, on the beta side of things, a lot of what I am interested in-- if I go back to my theme of maturity, and stability, and defining the core of Kubernetes, I think that the storage SIG has been doing amazing work. They continue to ship out, quarter, after quarter, after quarter, after quarter, new and progressive enhancements to storage-- mostly these days through the CSI, Container Storage Interface project, which is fantastic. It allows you to plug in arbitrary pieces of storage functionality. 

They have a number of things related to that that are in beta this time around, such as topology support. So you're going to be able to more accurately express how and where your CSI volumes need to live relative to your application. Block storage support is something I've heard a number of people asking for, as well as the ability to define [durable local volumes](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20190124-local-persistent-volumes.md). 

Let's say you're running a Pod on a node, and you want to make sure it's writing directly to the node's local volumes. And that way, it could be super performant. Cool. Give it an emptydir. It'll be fine. 

But if you destroy the Pod, then you lose all the data that the Pod wrote. And so again, I go back to the example of maybe it's an agent, and it's writing a bunch of useful, stateful information to disk. And you'd love for the agent to be able to go away and something to replace it, and be able to get all of that information off of disk. Local durable volumes allow you to do that. And you get to do that in the same way that you're used to specifying durable or persistent volumes that are given to you by a cloud provider, for example. 

Since I did co-found SIG testing, I think I have to call out a testing feature that I like. It's really tiny and silly, but it has always bugged me that when you try to download the tests, you download something that's over a gigabyte in size. That's the way things used work for Kubernetes back in the old days for Kubernetes client and server stuff as well. And we have since broken that up into-- you only need to download the binaries that makes sense for your platform. 

So say I'm developing Kubernetes on my MacBook. I probably don't need to download the Linux test binaries, or the Windows test binaries, or the ARM64 test binaries, or the s390x test binaries. Did I mention Kubernetes supports a lot of different architectures? 

<b>CRAIG BOX: I hadn't noticed s390 was a supported platform until now.</b>

AARON CRICKENBERGER: It is definitely something that we build binaries for. I'm not sure if we've actually seen a certified conformant Kubernetes that runs on s390, but it is definitely one of the things we build Kubernetes against. 

Not having to download an entire gigabyte plus of binaries just to run some tests is super great. I like to live in a world where I don't have to build the tests from scratch. Can I please just run a program that has all the tests? Maybe I can use that to soak test or sanity test my cluster to make sure that everything is OK. And downloading just the thing that I need is super great. 

<b>CRAIG BOX: You're talking about the idea of Kubernetes having a core and the idea of releases and stability. If you think back to Linux distributions maybe even 10 years ago, we didn't care so much about the version number releases of the kernel anymore, but we cared when there was a new feature in a Red Hat release. Do you think we're getting to that point with Kubernetes at the moment?</b>

AARON CRICKENBERGER: I think that is one model that people really hope to see Kubernetes move toward. I'm not sure if it is the model that we will move toward, but I think it is an ongoing discussion. So you know, we've created a working group called [WG LTS](https://github.com/kubernetes/community/tree/master/wg-lts). I like to call it by its longer name-- WG "to LTS, or not to LTS". What does LTS even mean? What are we trying to release and support? 

Because I think that when people think about distributions, they do naturally gravitate towards some distributions have higher velocity release cadences, and others have slower release cadences. And that's cool and great for people who want to live on a piece of software that never ever changes. But those of us who run software at scale find that you can't actually prevent change from happening. There will always be pieces of your infrastructure, or your environment, or your software, that are not under your control. 

And so anything we can do to achieve what I like to call a dynamic stability is probably better for everybody involved. Make the cost of change as low as you possibly can. Make the pain of changing and upgrade as low as you possibly can, and accept that everything will always be changing all the time. 

So yeah. Maybe that's where Linux lives, where the Kernel is always changing. And you can either care about that, or not. And you can go with a distribution that is super up-to-date with the Linux Kernel, or maybe has a slightly longer upgrade cadence. But I think it's about enabling both of those options. Because I think if we try to live in a world where there are only distributions and nothing else, that's going to actually harm everybody in the long term and maybe bring us away from all of these cloud-native ideals that we have, trying to accept change as a constant. 

<b>ADAM GLICK: We can't let you go without talking about the Beard. What is SIG Beard, and how critical was it in you becoming the 1.14 release manager?</b>

AARON CRICKENBERGER: I feel like it's a new requirement for all release leads to be a member of SIG Beard. SIG Beard happened because, one day, I realized I had gotten lazy, and I had this just ginormous and magnificent beard. It was really flattering to have Brendan Burns up on stage at KubeCon Seattle compliment my beard in front of an audience of thousands of people. I cannot tell you what that feels like. 

But to be serious for a moment, like OK, I'm a dude. I have a beard. There are a lot of dudes who work in tech, and many dudes are bearded. And this is by no means a way of being exclusionary, or calling that out, or anything like that. It was just noticing that while I was on camera, there seemed to be more beard than face at times. And what is that about? 

And I had somebody start referring to me as "The Beard" in my company. It turns out they read Neil Stevenson's "[Cryptonomicon](https://en.wikipedia.org/wiki/Cryptonomicon)," if you're familiar with that book at all. 

<b>ADAM GLICK: It's a great book.</b>

AARON CRICKENBERGER: Yeah. It talks about how you have the beard, and you have the suit. The suit is the person who's responsible for doing all the talking, and the beard is responsible for doing all the walking. And I guess I have gained a reputation for doing an awful lot of walking and showing up in an awful lot of places. And so I thought I would embrace that. 

When I showed up to Google my first day at work where I was looking for the name tag that shows what desk is mine, and my name tag was SIG Beard. And I don't know who did it, but I was like, all right, I'm running with it. And so I referred to myself as "Aaron of SIG Beard" from then on. 

And so to me, the beard is not so much about being bearded on my face, but being bearded at heart-- being welcoming, being fun, embracing this community for all of the awesomeness that it has, and encouraging other people to do the same. So in that regard, I would like to see more people be members of SIG Beard. I'm trying to figure out ways to make that happen. And yeah, it's great. 

<hr/>

<i>[Aaron Crickenberger](http://twitter.com/spiffxp) is a senior test engineer with [Google Cloud](https://cloud.google.com/). He co-founded the Kubernetes Testing SIG, has participated in every Kubernetes release since version 1.4, has served on the [Kubernetes steering committee](https://github.com/kubernetes/steering) since its inception in 2017, and most recently served as the Kubernetes 1.14 release lead.

You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@kubernetespod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode.  Please come and say Hello to us at KubeCon EU!</i>
