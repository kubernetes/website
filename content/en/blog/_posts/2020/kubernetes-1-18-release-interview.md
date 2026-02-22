---
layout: blog
title: "Physics, politics and Pull Requests: the Kubernetes 1.18 release interview"
date: 2020-08-03
author: >
   Craig Box (Google)
---

The start of the COVID-19 pandemic couldn't delay the release of Kubernetes 1.18, but unfortunately [a small bug](https://github.com/kubernetes/utils/issues/141) could — thankfully only by a day.  This was the last cat that needed to be herded by 1.18 release lead [Jorge Alarcón](https://twitter.com/alejandrox135) before the [release on March 25](https://kubernetes.io/blog/2020/03/25/kubernetes-1-18-release-announcement/).

One of the best parts about co-hosting the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/) is the conversations we have with the people who help bring Kubernetes releases together. [Jorge was our guest on episode 96](https://kubernetespodcast.com/episode/096-kubernetes-1.18/) back in March, and [just like last week](https://kubernetes.io/blog/2020/07/27/music-and-math-the-kubernetes-1.17-release-interview/) we are delighted to bring you the transcript of this interview.

If you'd rather enjoy the "audiobook version", including another interview when 1.19 is released later this month, [subscribe to the show](https://kubernetespodcast.com/subscribe/) wherever you get your podcasts.

In the last few weeks, we've talked to long-time Kubernetes contributors and SIG leads [David Oppenheimer](https://kubernetespodcast.com/episode/114-scheduling/), [David Ashpole](https://kubernetespodcast.com/episode/113-instrumentation-and-cadvisor/) and [Wojciech Tyczynski](https://kubernetespodcast.com/episode/111-scalability/). All are worth taking the dog for a longer walk to listen to!

---

**ADAM GLICK: You're a former physicist. I have to ask, what kind of physics did you work on?**

JORGE ALARCÓN: Back in my days of math and all that, I used to work in [computational biology](https://en.wikipedia.org/wiki/Computational_biology) and a little bit of high energy physics. Computational biology was, for the most part, what I spent most of my time on. And it was essentially exploring the big idea of we have the structure of proteins. We know what they're made of. Now, based on that structure, we want to be able to predict [how they're going to fold](https://en.wikipedia.org/wiki/Protein_folding) and how they're going to behave, which essentially translates into the whole idea of designing pharmaceuticals, designing vaccines, or anything that you can possibly think of that has any connection whatsoever to a living organism.

**ADAM GLICK: That would seem to ladder itself well into maybe going to something like bioinformatics. Did you take a tour into that, or did you decide to go elsewhere directly?**

JORGE ALARCÓN: It is related, and I worked a little bit with some people that did focus on bioinformatics on the field specifically, but I never took a detour into it. Really, my big idea with computational biology, to be honest, it wasn't even the biology. That's usually what sells it, what people are really interested in, because protein engineering, all the cool and amazing things that you can do.

Which is definitely good, and I don't want to take away from it. But my big thing is because biology is such a real thing, it is amazingly complicated. And the math— the models that you have to design to study those systems, to be able to predict something that people can actually experiment and measure, it just captivated me. The level of complexity, the beauty, the mechanisms, all the structures that you see once you got through the math and look at things, it just kind of got to me.

**ADAM GLICK: How did you go from that world into the world of Kubernetes?**

JORGE ALARCÓN: That's both a really boring story and an interesting one.

[LAUGHING]

I did my thing with physics, and it was good. It was fun. But at some point, I wanted— working in academia— at least my feeling for it is that generally all the people that you're surrounded with are usually academics. Just another bunch of physics, a bunch of mathematicians.

But very seldom do you actually get the opportunity to take what you're working on and give it to someone else to use. Even with the mathematicians and physicists, the things that we're working on are super specialized, and you can probably find three, four, five people that can actually understand everything that you're saying. A lot of people are going to get the gist of it, but understanding the details, it's somewhat rare.

One of the things that I absolutely love about tech, about software engineering, coding, all that, is how open and transparent everything is. You can write your library in Python, you can publish it, and suddenly the world is going to actually use it, actually consume it. And because normally, I've seen that it has a large avenue where you can work in something really complicated, you can communicate it, and people can actually go ahead and take it and run with it in their given direction. And that is kind of what happened.

At some point, by pure accident and chance, I came across this group of people on the internet, and they were in the stages of making up this new group that's called [Data for Democracy](https://datafordemocracy.org/), a non-profit. And the whole idea was the internet, especially Twitter— that's how we congregated— Twitter, the internet. We have a ton of data scientists, people who work as software engineers, and the like. What if we all come together and try to solve some issues that actually affect the daily lives of people. And there were a ton of projects. Helping the ACLU gather data for something interesting that they were doing, gather data and analyze it for local governments— where do you have potholes, how much water is being consumed.

Try to apply all the science that we knew, combined with all the code that we could write, and offer a good and digestible idea for people to say, OK, this makes sense, let's do something about it— policy, action, whatever. And I started working with this group, Data for Democracy— wonderful set of people. And the person who I believe we can blame for Data for Democracy— the one who got the idea and got it up and running, his name is Jonathan Morgan. And eventually, we got to work together. He started a startup, and I went to work with the startup. And that was essentially the thing that took me away from physics and into the world of software engineering— Data for Democracy, definitely.

**ADAM GLICK: Were you using Kubernetes as part of that work there?**

JORGE ALARCÓN: No, it was simple as it gets. You just try to get some data. You create a couple [IPython notebooks](https://ipython.org/), some setting up of really simple MySQL databases, and that was it.

**ADAM GLICK: Where did you get started using Kubernetes? And was it before you started contributing to it and being a part, or did you decide to jump right in?**

JORGE ALARCÓN: When I first started using Kubernetes, it was also on my first job. So there wasn't a lot of specific training in regards to software engineering or anything of the sort that I did before I actually started working as a software engineer. I just went from physicist to engineer. And in my days of physics, at least on the computer side, I was completely trained in the super old school system administrator, where you have your 10, 20 computers. You know physically where they are, and you have to connect the cables.

**ADAM GLICK: All pets— all pets all the time.**

JORGE ALARCÓN: [LAUGHING] You have to have your huge Python, bash scripts, three, five major versions, all because doing an upgrade will break something really important and you have no idea how to work on it. And that was my training. That was the way that I learned how to do things. Those were the kind of things that I knew how to do.

And when I got to this company— startup— we were pretty much starting from scratch. We were building a couple applications. We work testing them, we were deploying them on a couple of managed instances. But like everything, there was a lot of toil that we wanted to automate. The whole issue of, OK, after days of work, we finally managed to get this version of the application up and running in these machines.

It's open to the internet. People can test it out. But it turns out that it is now two weeks behind the latest on all the master branches for this repo, so now we want to update. And we have to go through the process of bringing it back up, creating new machines, do that whole thing. And I had no idea what Kubernetes was, to be honest. My boss at the moment mentioned it to me like, hey, we should use Kubernetes because apparently, Kubernetes is something that might be able to help us here. And we did some— I want to call it research and development.

It was actually just making— again, startup, small company, small team, so really me just playing around with Kubernetes trying to get it to work, trying to get it to run. I was so lost. I had no idea what I was doing— not enough. I didn't have an idea of how Kubernetes was supposed to help me. And at that point, I did the best Googling that I could manage. Didn't really find a lot of examples. Didn't find a lot of blog posts. It was early.

**ADAM GLICK: What time frame was this?**

JORGE ALARCÓN: Three, four years ago, so definitely not 1.13. That's the best guesstimate that I can give at this point. But I wasn't able to find any good examples, any tutorials. The only book that I was able to get my hands on was the one written by Joe Beda, Kelsey Hightower, and I forget the other author. But what is it? "[Kubernetes— Up and Running](http://shop.oreilly.com/product/0636920223788.do)"?

And in general, right now I use it as reference— it's really good. But as a beginner, I still was lost. They give all these amazing examples, they provide the applications, but I had no idea why someone might need a Pod, why someone might need a Deployment. So my last resort was to try and find someone who actually knew Kubernetes.

By accident, during my eternal Googling, I actually found a link to the [Kubernetes Slack](http://slack.kubernetes.io/). I jumped into the Kubernetes Slack hoping that someone might be able to help me out. And that was my entry point into the Kubernetes community. I just kept on exploring the Slack, tried to see what people were talking about, what they were asking to try to make sense of it, and just kept on iterating. And at some point, I think I got the hang of it.

**ADAM GLICK: What made you decide to be a release lead?**

JORGE ALARCÓN: The answer to this is my answer to why I have been contributing to Kubernetes. I really just want to be able to help out the community. Kubernetes is something that I absolutely adore.

Comparing Kubernetes to old school system administration, a handful of years ago, it took me like a week to create a node for an application to run. It took me months to get something that vaguely looked like an Ingress resource— just setting up the Nginx, and allowing someone else to actually use my application. And the fact that I could do all of that in five minutes, it really captivated me. Plus I've got to blame it on the physics. The whole idea with physics, I really like the patterns, and I really like the design of Kubernetes.

Once I actually got the hang of it, I loved the idea of how everything was designed, and I just wanted to learn a lot more about it. And I wanted to help the contributors. I wanted to help the people who actually build it. I wanted to help maintain it, and help provide the information for new contributors or new users. So instead of taking months for them to be up and running, let's just chat about what your issue is, and let's try to get a fix within the next hour or so.

**ADAM GLICK: You work for a stealth startup right now. Is it fair to assume that they're using Kubernetes?**

JORGE ALARCÓN: Yes—

[LAUGHING]

—for everything.

**ADAM GLICK: Are you able to say what [Searchable](https://www.searchable.ai/) does?**

JORGE ALARCÓN: The thing that we are trying to build is kind of like a search engine for your documents. Usually, if people have a question, they jump on Google. And for the most part, you're going to be able to get a good answer. You can ask something really random, like 'what is the weight of an elephant?'

Which, if you think about it, it's kind of random, but Google is going to give you an answer. And the thing that we are trying to build is something similar to that, but for files. So essentially, a search engine for your files. And most people, you have your local machine loaded up with— at least mine, I have a couple tens of gigabytes of different files.

I have Google Drive. I have a lot of documents that live in my email and the like. So the idea is to kind of build a search engine that is going to be able to connect all of those pieces. And besides doing simple word searches— for example, 'Kubernetes interview', and bring me the documents that we're looking at with all the questions— I can also ask things like what issue did I find last week while testing Prometheus. And it's going to be able to read my files, like through natural language processing, understand it, and be able to give me an answer.

**ADAM GLICK: It is a Google for your personal and non-public information, essentially?**

JORGE ALARCÓN: Hopefully.

**ADAM GLICK: Is the work that you do with Kubernetes as the release lead— is that part of your day job, or is that something that you're doing kind of nights and weekends separate from your day job?**

JORGE ALARCÓN: Both. Strictly speaking, my day job is just keep working on the application, build the things that it needs, maintain the infrastructure, and all that. When I started working at the company— which by the way, the person who brought me into the company was also someone that I met from my days in Data for Democracy— we started talking about the work.

I mentioned that I do a lot of work with the Kubernetes community and if it was OK that I continue doing it. And to my surprise, the answer was not only a yes, but yeah, you can do it during your day work. And at least for the time being, I just balance— I try to keep things organized.

Some days I just focus on Kubernetes. Some mornings I do Kubernetes. And then afternoon, I do Searchable, vice-versa, or just go back and forth, and try to balance the work as much as possible. But being release lead, definitely, it is a lot, so nights and weekends.

**ADAM GLICK: How much time does it take to be the release lead?**

JORGE ALARCÓN: It varies, but probably, if I had to give an estimate, at the very least you have to be able to dedicate four hours most days.

**ADAM GLICK: Four hours a day?**

JORGE ALARCÓN: Yeah, most days. It varies a lot. For example, at the beginning of the release cycle, you don't need to put in that much work because essentially, you're just waiting and helping people get set up, and people are writing their [Kubernetes Enhancement Proposals](https://github.com/kubernetes/enhancements/tree/master/keps), they are implementing it, and you can answer some questions. It's relatively easy, but for the most part, a lot of the time the four hours go into talking with people, just making sure that, hey, are people actually writing their enhancements, do we have all the enhancements that we want. And most of those fours hours, going around, chatting with people, and making sure that things are being done. And if, for some reason, someone needs help, just directing them to the right place to get their answer.

**ADAM GLICK: What does Searchable get out of you doing this work?**

JORGE ALARCÓN: Physically, nothing. The thing that we're striving for is to give back to the community. My manager/boss/homeslice— I told him I was going to call him my homeslice— both of us have experience working in open source. At some point, he was also working on a project that I'm probably going to mispronounce, but Mahout with Apache.

And he also has had this experience. And both of us have this general idea and strive to build something for Searchable that's going to be useful for people, but also build knowledge, build guides, build applications that are going to be useful for the community. And at least one of the things that I was able to do right now is be the lead for the Kubernetes team. And this is a way of giving back to the community. We're using Kubernetes to run our things, so let's try to balance how things work.

**ADAM GLICK: Lachlan Evenson was the release lead on 1.16 as well as [our guest back in episode 72](https://kubernetespodcast.com/episode/072-kubernetes-1.16/), and he's returned on this release as the [emeritus advisor](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/emeritus-adviser). What did you learn from him?**

JORGE ALARCÓN: Oh, everything. And it actually all started back on 1.16. So like you said, an amazing person— he's an amazing individual. And it's truly an opportunity to be able to work with him. During 1.16, I was the CI Signal lead, and Lachie is very hands on.

He's not the kind of person to just give you a list of things and say, do them. He actually comes to you, has a conversation, and he works with you more than anything. And when we were working together on 1.16, I got to learn a lot from him in terms of CI Signal. And especially because we talked about everything just to make sure that 1.16 was ready to go, I also got to pick up a couple of things that a release lead has to know, has to be able to do, has to work on to get a release out the door.

And now, during this release, there is a lot of information that's really useful, and there's a lot of advice and general wisdom that comes in handy. For most of the things that impact a lot of things, we are always in communication. Like, I'm doing this, you're doing that, advice. And essentially, every single thing that we do is pretty much a code review. You do it, and then you wait for someone else to give you comments. And that's been a strong part of our relationship working.

**ADAM GLICK: What would you say the theme for this release is?**

JORGE ALARCÓN: I think one of the themes is "fit and finish". There are a lot of features that we are bumping from alpha to beta, from beta to stable. And we want to make sure that people have a good user experience. Operators and developers alike just want to get rid of as many bugs as possible, improve the flow of things.

But the other really cool thing is we have about an equal distribution between alpha, beta, and stable. We are also bringing up a lot of new features. So besides making Kubernetes more stable for all the users that are already using it, we are working on bringing up new things that people can try out for the next release and see how it goes in the future.

**ADAM GLICK: Did you have a release team mascot?**

JORGE ALARCÓN: Kind of.

**ADAM GLICK: Who/what was it?**

JORGE ALARCÓN: [LAUGHING] I say kind of because I'm using the mascot in the [logo](https://twitter.com/KubernetesPod/status/1242953121380392963), and the logo is inspired by the Large Hadron Collider.

**ADAM GLICK: Oh, fantastic.**

JORGE ALARCÓN: Being the release lead, I really had to take a chance on this opportunity to use the LHC as the mascot.

**ADAM GLICK: We've had [some of the folks from the LHC on the show](https://kubernetespodcast.com/episode/062-cern/), and I know they listen, and they will be thrilled with that.**

JORGE ALARCÓN: [LAUGHING] Hopefully, they like the logo.

**ADAM GLICK: If you look at this release, what part of this release, what thing that has been added to it are you personally most excited about?**

JORGE ALARCÓN: Like a parent can't choose which child is his or her favorite, you really can't choose a specific thing.

**ADAM GLICK: We have been following online and in the issues an enhancement that's called [sidecar containers](https://github.com/kubernetes/enhancements/issues/753). You'd be able to mark the order of containers starting in a pod. Tim Hockin posted [a long comment on behalf of a number of SIG Node contributors](https://github.com/kubernetes/enhancements/issues/753#issuecomment-597372056) citing social, procedural, and technical concerns about what's going on with that— in particular, that it moved out of 1.18 and is now moving to 1.19. Did you have any thoughts on that?**

JORGE ALARCÓN: The sidecar enhancement has definitely been an interesting one. First off, thank you very much to Joseph Irving, the author of the KEP. And thank you very much to Tim Hockin, who voiced out the point of view of the approvers, maintainers of SIG Node. And I guess a little bit of context before we move on is, in the Kubernetes community, we have contributors, we have reviewers, and we have approvers.

Contributors are people who write PRs, who file issues, who troubleshoot issues. Reviewers are contributors who focus on one or multiple specific areas within the project, and then approvers are maintainers for the specific area, for one or multiple specific areas, of the project. So you can think of approvers as people who have write access in a repo or someplace within a repo.

The issue with the sidecar enhancement is that it has been deferred for multiple releases now, and that's been because there hasn't been a lot of collaboration between the KEP authors and the approvers for specific parts of the project. Something worthwhile to mention— and this was brought up during the original discussion— is this can obviously be frustrating for both contributors and for approvers. From the contributor's side of things, you are working on something. You are doing your best to make sure that it works.

And to build something that's going to be used by people, both from the approver side of things and, I think, for the most part, every single person in the Kubernetes community, we are all really excited to see this project grow. We want to help improve it, and we love when new people come in and work on new enhancements, bug fixes, and the like.

But one of the limitations is the day only has so many hours, and there are only so many things that we can work on at a time. So people prioritize in whatever way works best, and some things just fall behind. And a lot of the time, the things that fall behind are not because people don't want them to continue moving forward, but it's just a limited amount of resources, a limited amount of people.

And I think this discussion around the sidecar enhancement proposal has been very useful, and it points us to the need for more standardized mentoring programs. This is something that multiple SIGs are working on. For example, SIG Contribex, SIG Cluster Lifecycle, SIG Release. The idea is to standardize some sort of mentoring experience so that we can better prepare new contributors to become reviewers and ultimately approvers.

Because ultimately at the end of the day, if we have more people who are knowledgeable about Kubernetes, or even some specific area of Kubernetes, we can better distribute the load, and we can better collaborate on whatever new things come up. I think the sidecar enhancement has shown us mentoring is something worthwhile, and we need a lot more of it. Because as much work as we do, more things are going to continue popping in throughout the project. And the more people we have who are comfortable working in these really complicated areas of Kubernetes, the better off that we are going to be.

**ADAM GLICK: Was there any talk of delaying 1.18 due to the current worldwide health situation?**

JORGE ALARCÓN: We thought about it, and the plan was to just wait and see how people felt. Tried make sure that people were comfortable continuing to work and all the people were landing in new enhancements, or fixing tests, or members of the release team who were making sure that things were happening. We wanted to see that people were comfortable, that they could continue doing their job. And for a moment, I actually thought about delaying just outright— we're going to give it more time, and hopefully at some point, things are going to work out.

But people just continue doing their amazing work. There was no delay. There was no hitch throughout the process. So at some point, I just figured we stay with the current timeline and see how we went. And at this point, things are more or less set.

**ADAM GLICK: Amazing power of a distributed team.**

JORGE ALARCÓN: Yeah, definitely.

[LAUGHING]

**ADAM GLICK: [Taylor Dolezal was announced as the 1.19 release lead](https://twitter.com/alejandrox135/status/1239629281766096898). Do you know how that choice was made, and by whom?**

JORGE ALARCÓN: I actually got to choose the lead. The practice is the current lead for the release team is going to look at people and see, first off, who's interested and out of the people interested, who can do the job, who's comfortable enough with the release team, with the Kubernetes community at large who can actually commit the amount of hours throughout the next, hopefully, three months.

And for one, I think Taylor has been part of my team. So there is the release team. Then the release team has multiple subgroups. One of those subgroups is actually just for me and my shadows. So for this release, it was mrbobbytables and Taylor. And Taylor volunteered to take over 1.19, and I'm sure that he will do an amazing job.

**ADAM GLICK: I am as well. What advice will you give Taylor?**

JORGE ALARCÓN: Over-communicate as much as possible. Normally, if you made it to the point that you are the lead for a release, or even the shadow for a release, you more or less are familiar with a lot of the work— CI Signal, enhancements, documentation, and the like. And a lot of people, if they know how to do their job, they might tell themselves, yeah, I could do it— no need to worry about it. I'm just going to go ahead and sign this PR, debug this test, whatever.

But one of the interesting aspects is whenever we are actually working in a release, 50% of the work has to go into actually making the release happen. The other 50% of the work has to go into mentoring people, and making sure the newcomers, new members are able to learn everything that they need to learn to do your job, you being in the lead for a subgroup or the entire team. And whenever you actually see that things need to happen, just over-communicate.

Try to provide the opportunity for someone else to do the work, and over-communicate with them as much as possible to make sure that they are learning whatever it is that they need to learn. If neither you or the other person knows what's going on, then I can over-communicate, so someone hopefully will see your messages and come to the rescue. That happens a lot. There's a lot of really nice and kind people who will come out and tell you how something works, help you fix it.

**ADAM GLICK: If you were to sum up your experience running this release, what would it be?**

JORGE ALARCÓN: It's been super fun and a little bit stressing, to be honest. Being the release lead is definitely amazing. You're kind of sitting at the center of Kubernetes.

You not only see the people who are working on things— the things that are broken, and the users filling out issues, and saying what broke, and the like. But you also get the opportunity to work with a lot of people who do a lot of non-code related work. Docs is one of the most obvious things. There's a lot of work that goes into communications, contributor experience, public relations.

And being connected, getting to talk with those people mostly every other day, it's really fun. It's a really good experience in terms of becoming a better contributor to the community, but also taking some of that knowledge home with you and applying it somewhere else. If you are a software engineer, if you are a project manager, whatever, it's amazing how much you can learn.

**ADAM GLICK: I know the community likes to rotate around who are the release leads. But if you were given the opportunity to be a release lead for a future release of Kubernetes, would you do it again?**

JORGE ALARCÓN: Yeah, it's a fun job. To be honest, it can be really stressing. Especially, as I mentioned, at some point, most of that work is just going to be talking with people, and talking requires a lot more thought and effort than just sitting down and thinking about things sometimes. And some of that can be really stressful.

But the job itself, it is definitely fun. And at some distant point in the future, if for some reason it was a possibility, I will think about it. But definitely, as you mentioned, one thing that we try to do is cycle out, because I can have fun in it, and that's all good and nice. And hopefully I can help another release go out the door. But providing the opportunity for other people to learn I think is a lot more important than just being the lead itself.

---

_[Jorge Alarcón](https://twitter.com/alejandrox135) is a site reliability engineer with Searchable AI and served as the Kubernetes 1.18 release team lead._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._