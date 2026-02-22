---
layout: blog
title: "Contribution, containers and cricket: the Kubernetes 1.22 release interview"
date: 2021-12-01
author: >
   Craig Box (Google)
---

The Kubernetes release train rolls on, and we look ahead to the release of 1.23 next week. [As is our tradition](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog), I'm pleased to bring you a look back at the process that brought us the previous version.

The release team for 1.22 was led by [Savitha Raghunathan](https://twitter.com/coffeeartgirl), who was, at the time, a Senior Platform Engineer at MathWorks. [I spoke to Savitha](https://kubernetespodcast.com/episode/157-kubernetes-1.22/) on the [Kubernetes Podcast from Google](https://kubernetespodcast.com/), the weekly<super>*</super> show covering the Kubernetes and Cloud Native ecosystem.

Our release conversations shine a light on the team that puts together each Kubernetes release. Make sure you [subscribe, wherever you get your podcasts](https://kubernetespodcast.com/subscribe/) so you catch the story of 1.23.

And in case you're interested in why the show has been on a hiatus the last few weeks, all will be revealed in the next episode!

*This transcript has been lightly edited and condensed for clarity.*

---

**CRAIG BOX: Welcome to the show, Savitha.**

SAVITHA RAGHUNATHAN: Hey, Craig. Thanks for having me on the show. How are you today?

**CRAIG BOX: I'm very well, thank you. I've interviewed a lot of people on the show, and you're actually the first person who's asked that of me.**

SAVITHA RAGHUNATHAN: I'm glad. It's something that I always do. I just want to make sure the other person is good and happy.

**CRAIG BOX: That's very kind of you. Thank you for kicking off on a wonderful foot there. I want to ask first of all — you grew up in Chennai. My association with Chennai is the [Super Kings cricket team](https://en.wikipedia.org/wiki/Chennai_Super_Kings). Was cricket part of your upbringing?**

SAVITHA RAGHUNATHAN: Yeah. Actually, a lot. My mom loves watching cricket. I have a younger brother, and when we were growing up, we used to play cricket on the terrace. Everyone surrounding me, my best friends — and even now, my partner — loves watching cricket, too. Cricket is a part of my life.

I stopped watching it a while ago, but I still enjoy a good game.

**CRAIG BOX: It's probably a bit harder in the US. Everything's in a different time zone. I find, with my cricket team being on the other side of the world, that it's a lot easier when they're playing near me, as opposed to trying to keep up with what they're doing when they're playing at 3:00 in the morning.**

SAVITHA RAGHUNATHAN: That is actually one of the things that made me lose touch with cricket. I'm going to give you a piece of interesting information. I never supported Chennai Super Kings. I always supported [Royal Challengers of Bangalore](https://en.wikipedia.org/wiki/Royal_Challengers_Bangalore).

I once went to the stadium, and it was a match between the Chennai Super Kings and the RCB. I was the only one who was cheering whenever the RCB hit a 6, or when they were scoring. I got the stares of thousands of people looking at me. I'm like, "what are you doing?" My friends are like, "you're going to get us killed! Just stop screaming!"

**CRAIG BOX: I hear you. As a New Zealander in the UK, there are a lot of international cricket matches I've been to where I am one of the few people dressed in the full beige kit. But I have to ask, why an affiliation with a different team?**

SAVITHA RAGHUNATHAN: I'm not sure. When the IPL came out, I really liked Virat Kohli. He was playing for RCB at that time, and I think pretty much that's it.

**CRAIG BOX: Well, what I know about the Chennai Super Kings is that their coach is New Zealand's finest batsmen and [air conditioning salesman](https://www.youtube.com/watch?v=vSZAaUCAclw), [Stephen Fleming](https://en.wikipedia.org/wiki/Stephen_Fleming).**

SAVITHA RAGHUNATHAN: Oh, really?

**CRAIG BOX: Yeah, he's a dead ringer for the guy who played the [yellow Wiggle](https://s1.reutersmedia.net/resources/r/?m=02&d=20061130&t=2&i=153531&w=&fh=545px&fw=&ll=&pl=&sq=&r=153531) back in the day.**

SAVITHA RAGHUNATHAN: Oh, interesting. I remember the name, but I cannot put the picture and the name together. I stopped watching cricket once I moved to the States. Then, all my focus was on studies and extracurriculars. I have always been an introvert. The campus — it was a new thing for me — they had international festivals.

And every week, they'd have some kind of new thing going on, so I'd go check them out. I wouldn't participate, but I did go out and check them out. That was a big feat for me around that time because a lot of people — and still, even now, a lot of people — they kind of scare me. I don't know how to make a conversation with everyone.

I'll just go and say, "hi, how are you? OK, I'm good. I'm just going to move on". And I'll just go to the next person. And after two hours, I'm out of that place.

**CRAIG BOX: Perhaps a pleasant side effect of the last 12 months — a lot fewer gatherings of people.**

SAVITHA RAGHUNATHAN: Could be that, but I'm so excited about KubeCon. But when I think about it, I'm like "oh my God. There's going to be a lot of people. What am I going to do? I'm going to meet all my friends over there".

Sometimes I have social anxiety like, what's going to happen?

**CRAIG BOX: What's going to happen is you're going to ask them how they are at the beginning, and they're immediately going to be set at ease.**

SAVITHA RAGHUNATHAN: *laughs* I hope so.

**CRAIG BOX: Let's talk a little bit, then, about your transition from India to the US. You did your undergraduate degree in computer science at the SSN College of Engineering. How did you end up at Arizona State?**

SAVITHA RAGHUNATHAN: I always wanted to pursue higher studies when I was in India, and I didn't have the opportunity immediately. Once I graduated from my school there, I went and I worked for a couple of years. My aim was always to get out of there and come here, do my graduate studies.

Eventually, I want to do a PhD. I have an idea of what I want to do. I always wanted to keep studying. If there's an option that I could just keep studying and not do work or anything of that sort, I'd just pick that other one — I'll just keep studying.

But unfortunately, you need money and other things to live and sustain in this world. So I'm like, OK, I'll take a break from studies, and I will work for a while.

**CRAIG BOX: The road to success is littered with dreams of PhDs. I have a lot of friends who thought that that was the path they were going to take, and they've had a beautiful career and probably aren't going to go back to study. Did you use the [Matlab](https://en.wikipedia.org/wiki/MATLAB) software at all while you were going through your schooling?**

SAVITHA RAGHUNATHAN: No, unfortunately. That is a question that everyone asks. I have not used Matlab. I haven't used it even now. I don't use it for work. I didn't have any necessity for my school work. I didn't have anything to do with Matlab. I never analysed, or did data processing, or anything, with Matlab. So unfortunately, no.

Everyone asks me like, you're working at [MathWorks](https://en.wikipedia.org/wiki/MathWorks). Have you used Matlab? I'm like, no.

**CRAIG BOX: Fair enough. Nor have I. But it's been around since the late 1970s, so I imagine there are a lot of people who will have come across it at some point. Do you work with a lot of people who have been working on it that whole time?**

SAVITHA RAGHUNATHAN: Kind of. Not all the time, but I get to meet some folks who work on the product itself. Most of my interactions are with the infrastructure team and platform engineering teams at MathWorks. One other interesting fact is that when I joined the company — MathWorks has an extensive internal curriculum for training and learning, which I really love. They have an "Intro to Matlab" course, and that's on my bucket of things to do.

It was like 500 years ago. I added it, and I never got to it. I'm like, OK, maybe this year at least I want to get to it and I want to learn something new. My partner used Matlab extensively. He misses it right now at his current employer. And he's like, "you have the entire licence! You have access to the entire suite and you haven't used it?" I'm like, "no!"

**CRAIG BOX: Well, I have bad news for the idea of you doing a PhD, I'm sorry.**

SAVITHA RAGHUNATHAN: Another thing is that none of my family knew about the company MathWorks and Matlab. The only person who knew was my younger brother. He was so proud. He was like, "oh my God".

When he was 12 years old, he started getting involved in robotics and all that stuff. That's how he got introduced to Matlab. He goes absolutely bananas for the swag. So all the t-shirts, all the hoodies — any swag that I get from MathWorks goes to him, without saying.

Over the five, six years, the things that I've got — there was only one sweatshirt that I kept for myself. Everything else I've just given to him. And he cherishes it. He's the only one in my family who knew about Matlab and MathWorks.

Now, everyone knows, because I'm working there. They were initially like, I don't even know that company name. Is it like Amazon? I'm like, no, we make software that can send people to the moon. And we also make software that can do amazing robotic surgeries and even make a car drive on its own. That's something that I take immense pride in.

I know I don't directly work on the product, but I'm enabling the people who are creating the product. I'm really, really proud of that.

**CRAIG BOX: I think Jeff Bezos is working on at least two out of three of those disciplines that you mentioned before, so it's maybe a little bit like Amazon. One thing I've always thought about Matlab is that, because it's called Matlab, it solves that whole problem where [Americans call it math, and the rest of the world call it maths](https://www.grammar.com/math_vs._maths). Why do Americans think there's only one math?**

SAVITHA RAGHUNATHAN: Definitely. I had trouble — growing up in India, it's always British English. And I had so much trouble when I moved here. So many things changed.

One of the things is maths. I always got used to writing maths, physics, and everything.

**CRAIG BOX: They don't call it "physic" in the US, do they?**

SAVITHA RAGHUNATHAN: No, no, they don't. Luckily, they don't. That still stays "physics". But math — I had trouble. It's maths. Even when you do the full abbreviations like mathematics and you are still calling it math, I'm like, mm.

**CRAIG BOX: They can do the computer science abbreviation thing and call it math-7-S or whatever the number of letters is.**

SAVITHA RAGHUNATHAN: Just like Kubernetes. K-8-s.

**CRAIG BOX: Your path to Kubernetes is through MathWorks. They started out as a company making software which was distributed in a physical sense — boxed copies, if you will. I understand now there is a cloud version. Can I assume that that is where the two worlds intersect?**

SAVITHA RAGHUNATHAN: Kind of. I have interaction with the team that supports Matlab on the cloud, but I don't get to work with them on a day-to-day basis. They use Docker containers, and they are building the platform using Kubernetes. So yeah, a little bit of that.

**CRAIG BOX: So what exactly is the platform that you are engineering day to day?**

SAVITHA RAGHUNATHAN: Providing Kubernetes as a platform, obviously — that goes without saying — to some of the internal development teams. In the future we might expand it to more teams within the company. That is a focus area right now, so that's what we are doing. In the process, we might even get to work with the people who are deploying Matlab on the cloud, which is exciting.

**CRAIG BOX: Now, your path to contribution to Kubernetes, you've said before, was through [fixing a 404 error on the Kubernetes.io website](https://github.com/kubernetes/website/pull/15588). Do you remember what the page was?**

SAVITHA RAGHUNATHAN: I do. I was going to something for work, and I came across this changelog. In Kubernetes there's a nice page — once you got to the release page, there would be a long list of changelogs.

One of the things that I fixed was, the person who worked on the feature had changed their GitHub handle, and that wasn't reflected on this page. So that was my first. I got curious and clicked on the links. One of the links was the handle, and that went to a 404. And I was like "Yeah, I'll just fix that. They have done all the hard work. They can get the credit that's due".

It was easy. It wasn't overwhelming for me to pick it up as my first issue. Before that I logged on around Kubernetes for about six to eight months without doing anything because it was just a lot.

**CRAIG BOX: One of the other things that you said about your initial contribution is that you had to learn how to use Git. As a very powerful tool, I find Git is a high barrier to entry for even contributing code to a project. When you want to contribute a blog post or documentation or a fix like you did before, I find it almost impossible to think how a new user would come along and do that. What was your process? Do you think that there's anything we can do to make that barrier lower for new contributors?**

SAVITHA RAGHUNATHAN: Of course. There are more and more tutorials available these days. There is a new contributor workshop. They actually have a [GitHub workflow section](https://www.kubernetes.dev/docs/guide/github-workflow/), [how to do a pull request](https://www.kubernetes.dev/docs/guide/pull-requests/) and stuff like that. I know a couple of folks from SIG Docs that are working on which Git commands that you need, or how to get to writing something small and getting it committed. But more tutorials or more links to intro to Git would definitely help.

The thing is also, someone like a documentation writer — they don't actually want to know the entirety of Git. Honestly, it's an ocean. I don't know how to do it. Most of the time, I still ask for help even though I work with Git on a day to day basis. There are several articles and a lot of help is available already within the community. Maybe we could just add a couple more to [kubernetes.dev](https://kubernetes.dev/). That is an amazing site for all the new contributors and existing contributors who want to build code, who want to write documentation.

We could just add a tutorial there like, "hey, don't know Git, you are new to Git? You just need to know these main things".

**CRAIG BOX: I find it a shame, to be honest, that people need to use Git for that, by comparison to Wikipedia where you can come along, and even though it might be written in Markdown or something like it, it seems like the barrier is a lot lower. Similar to you, I always have to look up anything more complicated than the five or six Git commands that I use on a day to day basis. Even to do simple things, I basically just go and follow a recipe which I find on the internet.**

SAVITHA RAGHUNATHAN: This is how I got introduced to one of the amazing mentors in Kubernetes. Everyone knows him by his handle, Dims. It was my second PR to the Kubernetes website, and I made a mistake. I destroyed the Git history. I could not push my reviews and comments — I addressed them. I couldn't push them back.

My immediate thought was to delete it and recreate, do another pull request. But then I was like, "what happens to others who have already put effort into reviewing them?" I asked for help, and Dims was there.

I would say I just got lucky he was there. And he was like, "OK, let me walk you through". We did troubleshooting through Slack messages. I copied and pasted all the errors. Every single command that he said, I copied and pasted. And then he was like, "OK, run this one. Try this one. And do this one".

Finally, I got it fixed. So you know what I did? I went and I stored the command history somewhere local for the next time when I run into this problem. Luckily, I haven't. But I find the contributors so helpful. They are busy. They have a lot of things to do, but they take moments to stop and help someone who's new.

That is also another part of the reason why I stay — I want to contribute more. It's mainly the community. It's the Kubernetes community. I know you asked me about Git, and I just took the conversation to the Kubernetes community. That's how my brain works.

**CRAIG BOX: A lot of people in the community do that and think that's fantastic, obviously, people like Dims who are just floating around on Slack and seem to have endless time. I don't know how they do it.**

SAVITHA RAGHUNATHAN: I really want to know the secret for endless time. If I only had 48 hours in a day. I would sleep for 16 hours, and I would use the rest of the time for doing the things that I want.

**CRAIG BOX: If I had a chance to sleep up to 48 hours a day, I think it'd be a lot more than 16.**

**Now, one of the areas that you've been contributing to Kubernetes is in the release team. In 1.18, you were a shadow for the docs role. You led that role in 1.19. And you were a release lead shadow for versions 1,20 and 1.21 before finally leading this release, 1.22, which we will talk about soon.**

**How did you get involved? And how did you decide which roles to take as you went through that process?**

SAVITHA RAGHUNATHAN: That is a topic I love to talk about. This was fresh when I started learning about Kubernetes and using Kubernetes at work. And I got so much help from the community, I got interested in contributing back.

At the first KubeCon that I attended in 2018, in Seattle, they had a speed mentoring session. Now they call it "pod mentoring". I went to the session, and said, "hey, I want to contribute. I don't know where to start". And I got a lot of information on how to get started.

One of the places was SIG Release and the release team. I came back and diligently attended all the SIG Release meetings for four to six months. And in between, I applied to the Kubernetes release team — 1.14 and 1.15. I didn't get through. So I took a little bit of a break, and I focused on doing some documentation work. Then I applied for 1.18.

Since I was already working on some kinds of — not like full fledged "documentation" documentation, I still don't write. I eventually want to write something really nice and full fledged documentation like other awesome folks.

**CRAIG BOX: You'll need a lot more than 48 hours in your day to do that.**

SAVITHA RAGHUNATHAN: *laughing* That's how I applied for the docs role, because I know a little bit about the website. I've done a few pull requests and commits. That's how I got started. I applied for that one role, and I got selected for the 1.18 team. That's how my journey just took off.

And the next release, I was leading the documentation team. And as everyone knows, the pandemic hit. It was one of the longest releases. I could lean back on the community. I would just wait for the release team meetings.

It was my way of coping with the pandemic. It took my mind off. It was actually more than a release team, they were people. They were all people first, and we took care of each other. So it felt good.

And then, I became a release lead shadow for 1.20 and 1.21 because I wanted to know more. I wanted to learn more. I wasn't ready. I still don't feel ready, but I have led 1.22. So if I could do it, anyone could do it.

**CRAIG BOX: How much of this work is day job?**

SAVITHA RAGHUNATHAN: I am lucky to be blessed with an awesome team. I do most of my work after work, but there have been times where I have to take meetings and attend to immediate urgent stuff. During the time of exception requests and stuff like that, I take a little bit of time from my work.

My team has been wonderful: they support me in all possible ways, and the management as well. Other than the meetings, I don't do much of the work during the day job. It just takes my focus and attention away too much, and I end up having to spend a lot of time sitting in front of the computer, which I don't like.

Before the pandemic I had a good work life balance. I'd just go to work at 7:00, 7:30, and I'd be back by 4 o'clock. I never touched my laptop ever again. I left all work behind when I came home. So right now, I'm still learning how to get through.

I try to limit the amount of open source work that I do during work time. The release lead shadow and the release lead job — they require a lot of time, effort. So on average, I'd be spending two to three hours post work time on the release activities.

**CRAIG BOX: Before the pandemic, everyone was worried that if we let people work from home, they wouldn't work enough. I think the opposite has actually happened, is that now we're worried that if we let people work from home, they will just get on the computer in the morning and you'll have to pry it out of their hands at midnight.**

SAVITHA RAGHUNATHAN: Yeah, I think the productivity has increased at least twofold, I would say, for everyone, once they started working from home.

**CRAIG BOX: But at the expense of work-life balance, though, because as you say, when you're sitting in the same chair in front of, perhaps, the same computer doing your MathWorks work and then your open source work, they kind of can blur into one perhaps?**

SAVITHA RAGHUNATHAN: That is a challenge. I face it every day. But so many others are also facing it. I implemented a few little tricks to help me. When I used to come back home from work, the first thing I would do is remove my watch. That was an indication that OK, I'm done.

That's the thing that I still do. I just remove my watch, and I just keep it right where my workstation is. And I just close the door so that I never look back. Even going past the room, I don't get a glimpse of my work office. I start implementing tiny little things like that to avoid burnout.

I think I'm still facing a little bit of burnout. I don't know if I have fully recovered from it. I constantly feel like I need a vacation. And I could just take a vacation for like a month or two. If it's possible, I will just do it.

**CRAIG BOX: I do hope that travel opens up for everyone as an opportunity because I know that, for a lot of people, it's not so much they've been working from home but they've been living at work. The idea of taking vacation effectively means, well, I've been stuck in the same place, if I've been under a lockdown. It's hard to justify that. It will be good as things improve worldwide for us to be able to start focusing more on mental health and perhaps getting away from the "everything room," as I sometimes call it.**

SAVITHA RAGHUNATHAN: I'm totally looking forward to it. I hope that travel opens up and I could go home and I could meet my siblings and my aunt and my parents.

**CRAIG BOX: Catch a cricket match?**

SAVITHA RAGHUNATHAN: Yeah. Probably yes, if I have company and if there is anything interesting happening around the time. I don't mind going back to the Chepauk Stadium and catching a match or two.

**CRAIG BOX: Let's turn now to the recently released [Kubernetes 1.22](https://kubernetes.io/blog/2021/08/04/kubernetes-1-22-release-announcement/). Congratulations on the launch.**

SAVITHA RAGHUNATHAN: Thank you.

**CRAIG BOX: Each launch comes with a theme and a mascot or a logo. What is the theme for this release?**

SAVITHA RAGHUNATHAN: The theme for the release is reaching new peaks. I am fascinated with a lot of space travel and chasing stars, the Milky Way. The best place to do that is over the top of a mountain. So that is the release logo, basically. It's a mountain — Mount Rainier. On top of that, there is a Kubernetes flag, and it's overlooking the Milky Way.

It's also symbolic that with every release, that we are achieving something new, bigger, and better, and we are making the release awesome. So I just wanted to incorporate that into the team as to say, we are achieving new things with every release. That's the "reaching new peaks" theme.

**CRAIG BOX: The last couple of releases have both been incrementally larger — as a result, perhaps, of the fact there are now only three releases per year rather than four. There were also changes to the process, where the work has been driven a lot more by the SIGs than by the release team having to go and ask the SIGs what was going on. What can you say about the size and scope of the 1.22 release?**

SAVITHA RAGHUNATHAN: The 1.22 release is the largest release to date. We have 56 enhancements if I'm not wrong, and we have a good amount of features that's graduated as stable. You can now say that Kubernetes as a project has become more mature because you see new features coming in. At the same time, you see the features that weren't used getting deprecated — we have like three deprecations in this release.

Aside from that fact, we also have a big team that's supporting one of the longest releases. This is the first official release cycle after the cadence KEP got approved. Officially, we are at four months, even though 1.19 was six months, and 1.21 was like 3 and 1/2 months, I think, this is the first one after the official KEP approval.

**CRAIG BOX: What changes did you make to the process knowing that you had that extra month?**

SAVITHA RAGHUNATHAN: One of the things the community had asked for is more time for development. We tried to incorporate that in the release schedule. We had about six weeks between the enhancements freeze and the code freeze. That's one.

It might not be visible to everyone, but one of the things that I wanted to make sure of was the health of the team — since it was a long, long release, we had time to plan out, and not have everyone work during the weekends or during their evenings or time off. That actually helped everyone keep their sanity, and also in making good progress and delivering good results at the end of the release. That's one of the process improvements that I'd call out.

We got better by making a post during the exception request process. Everyone works around the world. People from the UK start a little earlier than the people in the US East Coast. The West Coast starts three hours later than the East Coast. We used to make a post every Friday evening saying "hey, we actually received this many requests. We have addressed a number of them. We are waiting on a couple, or whatever. All the release team members are done for the day. We will see you around on Monday. Have a good weekend." Something like that.

We set the expectations from the community as well. We understand things are really important and urgent, but we are done. This gave everyone their time back. They don't have to worry over the weekend thinking like, hey, what's happening? What's happening in the release? They could spend time with their family, or they could do whatever they want to do, like go on a hike, or just sit and watch TV.

There have been weekends that I just did that. I just binge-watched a series. That's what I did.

**CRAIG BOX: Any recommendations?**

SAVITHA RAGHUNATHAN: I'm a big fan of Marvel, so I have watched the new [Loki](https://en.wikipedia.org/wiki/Loki_(TV_series)), which I really love. Loki is one of my favourite characters in Marvel. And I also liked [WandaVision](https://en.wikipedia.org/wiki/WandaVision). That was good, too.

**CRAIG BOX: I've not seen Loki yet, but I've heard it described as the best series of Doctor Who in the last few years.**

SAVITHA RAGHUNATHAN: Really?

**CRAIG BOX: There must be an element of time-travelling in there if that's how people are describing it.**

SAVITHA RAGHUNATHAN: You should really go and watch it whenever you have time. It's really amazing. I might go back and watch it again because I might have missed bits and pieces. That always happens in Marvel movies and the episodes; you need to watch them a couple of times to catch, "oh, this is how they relate".

**CRAIG BOX: Yes, the mark of good media that you want to immediately go back and watch it again once you've seen it.**

**Let's look now at some of the new features in Kubernetes 1.22. A couple of things that have graduated to general availability — server-side apply, external credential providers, a couple of new security features — the replacement for pod security policy has been announced, and seccomp is now available by default.**

**Do you have any favourite features in 1.22 that you'd like to discuss?**

SAVITHA RAGHUNATHAN: I have a lot of them. All my favourite features are related to security. OK, one of them is not security, but a major theme of my favourite KEPs is security. I'll start with the [default seccomp](https://github.com/kubernetes/enhancements/issues/2413). I think it will help make clusters secure by default, and may assist in preventing more vulnerabilities, which means less headaches for the cluster administrators.

This is close to my heart because the base of the MathWorks platform is provisioning Kubernetes clusters. Knowing that they are secure by default will definitely provide me with some good sleep. And also, I'm paranoid about security most of the time. I'm super interested in making everything secure. It might get in the way of making the users of the platform angry because it's not usable in any way.

My next one is [rootless Kubelet](https://github.com/kubernetes/enhancements/issues/2033). That feature's going to enable the cluster admin, the platform developers to deploy Kubernetes components to run in a user namespace. And I think that is also a great addition.

Like you mention, the most awaited drop in for the PSP replacement is here. It's [pod admission control](https://github.com/kubernetes/enhancements/issues/2579). It lets cluster admins apply the pod security standards. And I think it's just not related to the cluster admins. I might have to go back and check on that. Anyone can probably use it — the developers and the admins alike.

It also supports various modes, which is most welcome. There are times where you don't want to just cut the users off because they are trying to do something which is not securely correct. You just want to warn them, hey, this is what you are doing. This might just cause a security issue later, so you might want to correct it. But you just don't want to cut them off from using the platform, or them trying to attempt to do something — deploy their workload and get their day-to-day job done. That is something that I really like, that it also supports a warning mechanism.

Another one which is not security is [node swap support](https://github.com/kubernetes/enhancements/issues/2400). Kubernetes didn't have support for swap before, but it is taken into consideration now. This is an alpha feature. With this, you can take advantage of the swap, which is provisioned on the Linux VMs.

Some of the workloads — when they are deployed, they might need a lot of swap for the start-up — example, like Node and Java applications, which I just took out of their KEP user stories. So if anyone's interested, they can go and look in the KEP. That's useful. And it also increases the node stability and whatnot. So I think it's going to be beneficial for a lot of folks.

We know how Java and containers work. I think it has gotten better, but five years ago, it was so hard to get a Java application to fit in a small container. It always needed a lot of memory, swap, and everything to start up and run. I think this will help the users and help the admins and keep the cost low, and it will tie into so many other things as well. I'm excited about that feature.

Another feature that I want to just call out — I don't use Windows that much, but I just want to give a shout out to the folks who are doing an amazing job bringing all the Kubernetes features to Windows as well, to give a seamless experience.

One of the things is [Windows privileged containers](https://github.com/kubernetes/enhancements/issues/1981). I think it went alpha this release. And that is a wonderful addition, if you ask me. It can take advantage of whatever that's happening on the Linux side. And they can also port it over and see, OK, I can now run Windows containers in a privileged mode.

So whatever they are trying to achieve, they can do it. So that's a noteworthy mention. I need to give a shout out for the folks who work and make things happen in the Windows ecosystem as well.

**CRAIG BOX: One of the things that's great about the release process is the continuity between groups and teams. There's always an emeritus advisor who was a lead from a previous release. One thing that I always ask when I do these interviews is, what is the advice that you give to the next person? When [we talked to Nabarun for the 1.21 interview](https://kubernetespodcast.com/episode/146-kubernetes-1.21/), he said that his advice to you would be "do, delegate, and defer". Figure out what you can do, figure out what you can ask other people to do, and figure out what doesn't need to be done. Were you able to take that advice on board?**

SAVITHA RAGHUNATHAN: Yeah, you won't believe it. [I have it right here stuck to my monitor.](https://twitter.com/KubernetesPod/status/1423188323347177474/photo/3)

**CRAIG BOX: Next to your Git cheat sheet?**

SAVITHA RAGHUNATHAN: *laughs* Absolutely. I just have it stuck there. I just took a look at it.

**CRAIG BOX: Someone that you will have been able to delegate and defer to is Rey Lejano from Rancher Labs and SUSE, who is the release lead to be for 1.23.**

SAVITHA RAGHUNATHAN: I want to tell Rey to beware of the team's mental health. Schedule in such a way that it avoids burnout. Check in, and make sure that everyone is doing good. If they need some kind of help, create a safe space where they can actually ask for help, if they want to step back, if they need someone to cover.

I think that is most important. The releases are successful based on the thousands and thousands of contributors. But when it comes to a release team, you need to have a healthy team where people feel they are in a good place and they just want to make good contributions, which means they want to be heard. That's one thing that I want to tell Rey.

Also collaborate and learn from each other. I constantly learn. I think the team was 39 folks, including me. Every day I learned something or the other, even starting from how to interact.

Sometimes I have learned more leadership skills from my release lead shadows. They are awesome, and they are mature. I constantly learn from them, and I admire them a lot.

It also helps to have good, strong individuals in the team who can step up and help when needed. For example, unfortunately, we lost one of our teammates after the start of the release cycle. That was tragic. His name was [Peeyush Gupta](https://github.com/cncf/memorials/blob/main/peeyush-gupta.md). He was an awesome and wonderful human — very warm.

I didn't get more of a chance to interact with him. I had exchanged a few Slack messages, but I got his warm personality. I just want to take a couple of seconds to remember him. He was awesome.

After we lost him, we had this strong person from the team step up and lead the communications, who had never been a part of the release team before at all. He was a shadow for the first time. His name is Jesse Butler. So he stepped up, and he just took it away. He ran the comms show for 1.22.

That's what the community is about. You take care of team members, and the team will take care of you. So that's one other thing that I want to let Rey know, and maybe whoever — I think it's applicable overall.

**CRAIG BOX: There's a link to a [family education fund for Peeyush Gupta](https://milaap.org/fundraisers/support-peeyush-gupta-family-education), which you can find in the show notes.**

**Five releases in a row now you've been a member of the release team. Will you be putting your feet up now for 1.23?**

SAVITHA RAGHUNATHAN: I am going to take a break for a while. In the future, I want to be contributing, if not the release team, the SIG Release and the release management effort. But right now, I have been there for five releases. And I feel like, OK, I just need a little bit of fresh air.

And also the pandemic and the burnout has caught up, so I'm going to take a break from certain contributions. You will see me in the future. I will be around, but I might not be actively participating in the release team activities. I will be around the community. Anyone can reach out to me. They all know my Slack, so they can just reach out to me via Slack or Twitter.

**CRAIG BOX: Yes, your Twitter handle is CoffeeArtGirl. Does that mean that you'll be spending some time working on your lattes?**

SAVITHA RAGHUNATHAN: I am very bad at making lattes. The coffee art means that I used to [make art with coffee](https://twitter.com/KubernetesPod/status/1423188323347177474/photo/1). You get  instant coffee powder and just mix it with water. You get the colours, very beautiful brown colours. I used to make art using that.

And I love coffee. So I just combined all the words together. And I had to come up with it in a span of one hour or so because I was joining this 'meet our contributors' panel. And Paris asked me, "do you have a Twitter handle?" I was planning to create one, but I didn't have the time.

I'm like, well, let me just think what I could just come up with real quick. So I just came up with that. So that's the story behind my Twitter handle. Everyone's interested in it. You are not the first person you have asked me or mentioned about it. So many others are like, why coffee art?

**CRAIG BOX: And you are also interested in art with perhaps other materials?**

SAVITHA RAGHUNATHAN: Yes. My interests keep changing. I used to do pebble art. It's just collecting pebbles from wherever I go, and I used to paint on them. I used to use watercolour, but I want to come back to watercolour sometime.

My recent interests are coloured pencils, which came back. When I was very young, I used to do a lot of coloured pencils. And then I switched to watercolours and oil painting. So I just go around in circles.

One of the hobbies that I picked up during a pandemic is crochet. I made a scarf for Mother's Day. My mum and my dad were here last year. They got stuck because of the pandemic, and they couldn't go back home. So they stayed with me for 10 months. That is the jackpot that I had, that I got to spend so much time with my parents after I moved to the US.

**CRAIG BOX: And they got rewarded with a scarf.**

SAVITHA RAGHUNATHAN: Yeah.

**CRAIG BOX: One to share between them.**

SAVITHA RAGHUNATHAN: I started making a blanket for my dad. And it became so heavy, I might have to just pick up some lighter yarn. I still don't know the differences between different kinds of yarns, but I'm getting better.

I started out because I wanted to make these little toys. They call them [amigurumi](https://en.wikipedia.org/wiki/Amigurumi) in the crochet world. I wanted to make them. That's why I started out. I'm trying. I made [a little cat](https://twitter.com/KubernetesPod/status/1423188323347177474/photo/2) which doesn't look like a cat, but it is a cat. I have to tell everyone that it's a cat so that they don't mock me later, but.

**CRAIG BOX: It's an artistic interpretation of a cat.**

SAVITHA RAGHUNATHAN: It definitely is!

---

_[Savitha Raghunathan](https://twitter.com/coffeeartgirl), now a Senior Software Engineer at Red Hat, served as the Kubernetes 1.22 release team lead._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
