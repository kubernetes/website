---
layout: blog
title: "Roorkee robots, releases and racing: the Kubernetes 1.21 release interview"
date: 2021-07-29
author: >
  Craig Box (Google)
---

With Kubernetes 1.22 due out next week, now is a great time to look back on 1.21. The release team for that version was led by [Nabarun Pal](https://twitter.com/theonlynabarun) from VMware.

Back in April I [interviewed Nabarun](https://kubernetespodcast.com/episode/146-kubernetes-1.21/) on the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/); the latest in a series of release lead conversations that started back with 1.11, not long after the show started back in 2018.

In these interviews we learn a little about the release, but also about the process behind it, and the story behind the person chosen to lead it. Getting to know a community member is my favourite part of the show each week, and so I encourage you to [subscribe wherever you get your podcasts](https://kubernetespodcast.com/subscribe/). With a release coming next week, you can probably guess what our next topic will be!

*This transcript has been edited and condensed for clarity.*

---

**CRAIG BOX: You have a Bachelor of Technology in Metallurgical and Materials Engineering. How are we doing at turning lead into gold?**

NABARUN PAL: Well, last I checked, we have yet to find the philosopher's stone!

**CRAIG BOX: One of the more important parts of the process?**

NABARUN PAL: We're not doing that well in terms of getting alchemists up and running. There is some improvement in nuclear technology, where you can turn lead into gold, but I would guess buying gold would be much more efficient.

**CRAIG BOX: Or Bitcoin? It depends what you want to do with the gold.**

NABARUN PAL: Yeah, seeing the increasing prices of Bitcoin, you'd probably prefer to bet on that. But, don't take this as a suggestion. I'm not a registered investment advisor, and I don't give investment advice!

**CRAIG BOX: But you are, of course, a trained materials engineer. How did you get into that line of education?**

NABARUN PAL: We had a graded and equated exam structure, where you sit a single exam, and then based on your performance in that exam, you can try any of the universities which take those scores into account. I went to the Indian Institute of Technology, Roorkee.

Materials engineering interested me a lot. I had a passion for computer science since childhood, but I also liked material science, so I wanted to explore that field. I did a lot of exploration around material science and metallurgy in my freshman and sophomore years, but then computing, since it was a passion, crept into the picture.

**CRAIG BOX: Let's dig in there a little bit. What did computing look like during your childhood?**

NABARUN PAL: It was a very interesting journey. I started exploring computers back when I was seven or eight. For my first programming language, if you call it a programming language, I explored LOGO.

You have a turtle on the screen, and you issue commands to it, like move forward or rotate or pen up or pen down. You basically draw geometric figures. I could visually see how I could draw a square and how I could draw a triangle. It was an interesting journey after that. I learned BASIC, then went to some amount of HTML, JavaScript.

**CRAIG BOX: It's interesting to me because Logo and BASIC were probably my first two programming languages, but I think there was probably quite a gap in terms of when HTML became a thing after those two! Did your love of computing always lead you down the path towards programming, or were you interested as a child in using computers for games or application software? What led you specifically into programming?**

NABARUN PAL: Programming came in late. Not just in computing, but in life, I'm curious with things. When my parents got me my first computer, I was curious. I was like, "how does this operating system work?" What even is running it? Using a television and using a computer is a different experience, but usability is kind of the same thing. The HCI device for a television is a remote, whereas with a computer, I had a keyboard and a mouse. I used to tinker with the box and reinstall operating systems.

We used to get magazines back then. They used to bundle OpenSuse or Debian, and I used to install them. It was an interesting experience, 15 years back, how Linux used to be. I have been a tinkerer all around, and that's what eventually led me to programming.

**CRAIG BOX: With an interest in both the physical and ethereal aspects of technology, you did a lot of robotics challenges during university. That's something that I am not surprised to hear from someone who has a background in Logo, to be honest. There's Mindstorms, and a lot of other technology that is based around robotics that a lot of LOGO people got into. How was that something that came about for you?**

NABARUN PAL: When I joined my university, apart from studying materials, one of the things they used to really encourage was to get involved in a lot of extracurricular activities. One which interested me was robotics. I joined [my college robotics team](https://github.com/marsiitr) and participated in a lot of challenges.

Predominantly, we used to participate in this competition called [ABU Robocon](https://en.wikipedia.org/wiki/ABU_Robocon), which is an event conducted by the Asia-Pacific Broadcasting Union. What they used to do was, every year, one of the participating countries in the contest would provide a problem statement. For example, one year, they asked us to build a badminton-playing robot.  They asked us to build a rugby playing robot or a Frisbee thrower, and there are some interesting problem statements around the challenge: you can't do this. You can't do that. Weight has to be like this. Dimensions have to be like that.

I got involved in that, and most of my time at university, I used to spend there. Material science became kind of a backburner for me, and my hobby became my full time thing.

**CRAIG BOX: And you were not only involved there in terms of the project and contributions to it, but you got involved as a secretary of the team, effectively, doing a lot of the organization, which is a thread that will come up as we speak about Kubernetes.**

NABARUN PAL: Over the course of time, when I gained more knowledge into how the team works, it became very natural that I graduated up the ladder and then managed juniors. I became the joint secretary of the robotics club in our college. This was more of a broad, engaging role in evangelizing robotics at the university, to promote events, to help students to see the value in learning robotics - what you gain out of that mechanically or electronically, or how do you develop your logic by programming robots.

**CRAIG BOX: Your first job after graduation was working at a company called Algoshelf, but you were also an intern there while you were at school?**

NABARUN PAL: Algoshelf was known as Rorodata when I joined them as an intern. This was also an interesting opportunity for me in the sense that I was always interested in writing programs which people would use. One of the things that I did there was  build an open source Function as a Service framework, if I may call it that - it was mostly turning Python functions into web servers without even writing any code. The interesting bit there was that it was targeted toward data scientists, and not towards programmers. We had to understand the pain of data scientists, that they had to learn a lot of programming in order to even deploy their machine learning models, and we wanted to solve that problem.

They offered me a job after my internship, and I kept on working for them after I graduated from university. There, I got introduced to Kubernetes, so we pivoted into a product structure where the very same thing I told you, the Functions as a Service thing, could be deployed in Kubernetes. I was exploring Kubernetes to use it as a scalable platform. Instead of managing pets, we wanted to manage cattle, as in, we wanted to have a very highly distributed architecture.

**CRAIG BOX: Not actual cattle. I've been to India. There are a lot of cows around.**

NABARUN PAL: Yeah, not actual cattle. That is a bit tough.

**CRAIG BOX: When Algoshelf we're looking at picking up Kubernetes, what was the evaluation process like? Were you looking at other tools at the time? Or had enough time passed that Kubernetes was clearly the platform that everyone was going to use?**

NABARUN PAL: Algoshelf was a natural evolution. Before Kubernetes, we used to deploy everything on a single big AWS server, using systemd. Everything was a systemd service, and everything was deployed using Fabric. Fabric is a Python package which essentially is like Ansible, but much leaner, as it does not have all the shims and things that Ansible has.

Then we asked "what if we need to scale out to different machines?" Kubernetes was in the hype. We hopped onto the hype train to see whether Kubernetes was worth it for us. And that's where my journey started, exploring the ecosystem, exploring the community. How can we improve the community in essence?

**CRAIG BOX: A couple of times now you've mentioned as you've grown in a role, becoming part of the organization and the arranging of the group. You've talked about working in Python. You had submitted some talks to Pycon India. And I understand you're now a tech lead for that conference. What does the tech community look like in India and how do you describe your involvement in it?**

NABARUN PAL: My involvement with the community began when I was at university. When I was working as an intern at Algoshelf, I was introduced to this-- I never knew about PyCon India, or tech conferences in general.

The person that I was working with just asked me, like hey, did you submit a talk to PyCon India? It's very useful, the library that we were making. So I [submitted a talk](https://www.nabarun.in/talk/2017/pyconindia/#1) to PyCon India in 2017. Eventually the talk got selected. That was not my first speaking opportunity, it was my second. I also spoke at PyData Delhi on a similar thing that I worked on in my internship.

It has been a journey since then. I talked about the same thing at FOSSASIA Summit in Singapore, and got really involved with the Python community because it was what I used to work on back then.

After giving all those talks at conferences, I got also introduced to this amazing group called [dgplug](https://dgplug.org/), which is an acronym for the Durgapur Linux Users Group. It is a group started in-- I don't remember the exact year, but it was around 12 to 13 years back, by someone called Kushal Das, with the ideology of [training students into being better open source contributors](https://foss.training/).

I liked the idea and got involved with in teaching last year. It is not limited to students. Professionals can also join in. It's about making anyone better at upstream contributions, making things sustainable. I started training people on Vim, on how to use text editors. so they are more efficient and productive. In general life, text editors are a really good tool.

The other thing was the shell. How do you navigate around the Linux shell and command line? That has been a fun experience.

**CRAIG BOX: It's very interesting to think about that, because my own involvement with a Linux User Group was probably around the year 2000. And back then we were teaching people how to install things-- Linux on CD was kinda new at that point in time. There was a lot more of, what is this new thing and how do we get involved? When the internet took off around that time, all of that stuff moved online - you no longer needed to go meet a group of people in a room to talk about Linux. And I haven't really given much thought to the concept of a LUG since then, but it's great to see it having turned into something that's now about contributing, rather than just about how you get things going for yourself.**

NABARUN PAL: Exactly. So as I mentioned earlier, my journey into Linux was installing SUSE from DVDs that came bundled with magazines. Back then it was a pain installing things because you did not get any instructions. There has certainly been a paradigm shift now. People are more open to reading instructions online, downloading ISOs, and then just installing them. So we really don't need to do that as part of LUGs.

We have shifted more towards enabling people to contribute to whichever project that they use. For example, if you're using Fedora, contribute to Fedora; make things better. It's just about giving back to the community in any way possible.

**CRAIG BOX: You're also involved in the [Kubernetes Bangalore meetup group](https://www.meetup.com/Bangalore-Kubernetes-Meetup/). Does that group have a similar mentality?**

NABARUN PAL: The Kubernetes Bangalore meetup group is essentially focused towards spreading the knowledge of Kubernetes and the aligned products in the ecosystem, whatever there is in the Cloud Native Landscape, in various ways. For example, to evangelize about using them in your company or how people use them in existing ways.

So a few months back in February, we did something like a [Kubernetes contributor workshop](https://www.youtube.com/watch?v=FgsXbHBRYIc). It was one of its kind in India. It was the first one if I recall correctly. We got a lot of traction and community members interested in contributing to Kubernetes and a lot of other projects. And this is becoming a really valuable thing.

I'm not much involved in the organization of the group. There are really great people already organizing it. I keep on being around and attending the meetups and trying to answer any questions if people have any.

**CRAIG BOX: One way that it is possible to contribute to the Kubernetes ecosystem is through the release process. You've [written a blog](https://blog.naba.run/posts/release-enhancements-journey/) which talks about your journey through that. It started in Kubernetes 1.17, where you took a shadow role for that release. Tell me about what it was like to first take that plunge.**

NABARUN PAL: Taking the plunge was a big step, I would say. It should not have been that way. After getting into the team, I saw that it is really encouraged that you should just apply to the team - but then write truthfully about yourself. What do you want? Write your passionate goal, why you want to be in the team.

So even right now the shadow applications are open for the next release. I wanted to give that a small shoutout. If you want to contribute to the Kubernetes release team, please do apply. The form is pretty simple. You just need to say why do you want to contribute to the release team.

**CRAIG BOX: What was your answer to that question?**

NABARUN PAL: It was a bit tricky. I have this philosophy of contributing to projects that I use in my day-to-day life. I use a lot of open source projects daily, and I started contributing to Kubernetes primarily because I was using the Kubernetes Python client. That was one of my first contributions.

When I was contributing to that, I explored the release team and it interested me a lot, particularly how interesting and varied the mechanics of releasing Kubernetes are. For most software projects, it's usually whenever you decide that you have made meaningful progress in terms of features, you release it. But Kubernetes is not like that. We follow a regular release cadence. And all those aspects really interested me. I actually applied for the first time in Kubernetes 1.16, but got rejected.

But I still applied to Kubernetes 1.17, and I got into the enhancements team. That team was led by [MrBobbyTables, Bob Killen](https://kubernetespodcast.com/episode/126-research-steering-honking/), back then, and [Jeremy Rickard](https://kubernetespodcast.com/episode/131-kubernetes-1.20/) was one of my co-shadows in the team. I shadowed enhancements again. Then I lead enhancements in 1.19. I then shadowed the lead in 1.20 and eventually led the 1.21 team. That's what my journey has been.

My suggestion to people is don't be afraid of failure. Even if you don't get selected, it's perfectly fine. You can still contribute to the release team. Just hop on the release calls, raise your hand, and introduce yourself.

**CRAIG BOX: Between the 1.20 and 1.21 releases, you moved to work on the upstream contribution team at VMware. I've noticed that VMware is hiring a lot of great upstream contributors at the moment. Is this something that [Stephen Augustus](https://kubernetespodcast.com/episode/130-kubecon-na-2020/) had his fingerprints all over? Is there something in the water?**

NABARUN PAL: A lot of people have fingerprints on this process. Stephen certainly had his fingerprints on it, I would say. We are expanding the team of upstream contributors primarily because the product that we are working for is based on Kubernetes. It helps us a lot in driving processes upstream and helping out the community as a whole, because everyone then gets enabled and benefits from what we contribute to the community.

**CRAIG BOX: I understand that the Tanzu team is being built out in India at the moment, but I guess you probably haven't been able to meet them in person yet?**

NABARUN PAL: Yes and no. I did not meet any of them after joining VMware, but I met a lot of my teammates, before I joined VMware, at KubeCons. For example, I met Nikhita, I met Dims, I met Stephen at KubeCon. I am yet to meet other members of the team and I'm really excited to catch up with them once everything comes out of lockdown and we go back to our normal lives.

**CRAIG BOX: Yes, everyone that I speak to who has changed jobs in the pandemic says it's a very odd experience, just nothing really being different. And the same perhaps for people who are working on open source moving companies as well. They're doing the same thing, perhaps just for a different employer.**

NABARUN PAL: As we say in the community, see you in another Slack in some time.

**CRAIG BOX: We now turn to the recent release of Kubernetes 1.21. First of all, congratulations on that.**

NABARUN PAL: Thank you.

**CRAIG BOX: [The announcement](https://kubernetes.io/blog/2021/04/08/kubernetes-1-21-release-announcement/) says the release consists of 51 enhancements, 13 graduating to stable, 16 moving to beta, 20 entering alpha, and then two features that have been deprecated. How would you summarize this release?**

NABARUN PAL: One of the big points for this release is that it is the largest release of all time.

**CRAIG BOX: Really?**

NABARUN PAL: Yep. 1.20 was the largest release back then, but 1.21 got more enhancements, primarily due to a lot of changes that we did to the process.

In the 1.21 release cycle, we did a few things differently compared to other release cycles-- for example, in the enhancement process. An enhancement, in the Kubernetes context, is basically a feature proposal. You will hear the terminology [Kubernetes Enhancement Proposals](https://github.com/kubernetes/enhancements/blob/master/keps/README.md), or KEP, a lot in the community. An enhancement is a broad thing encapsulated in a specific document.

**CRAIG BOX: I like to think of it as a thing that's worth having a heading in the release notes.**

NABARUN PAL: Indeed. Until the 1.20 release cycle, what we used to do was-- the release team has a vertical called enhancements. The enhancements team members used to ping each of the enhancement issues and ask whether they want to be part of the release cycle or not. The authors would decide, or talk to their SIG, and then come back with the answer, as to whether they wanted to be part of the cycle.

In this release, what we did was we eliminated that process and asked the SIGs proactively to discuss amongst themselves, what they wanted to pitch in for this release cycle. What set of features did they want to graduate this release? They may introduce things in alpha, graduate things to beta or stable, or they may also deprecate features.

What this did was promote a lot of async processes, and at the same time, give power back to the community. The community decides what they want in the release and then comes back collectively. It also reduces a lot of stress on the release team who previously had to ask people consistently what they wanted to pitch in for the release. You now have a deadline. You discuss amongst your SIG what your roadmap is and what it looks like for the near future. Maybe this release, and the next two. And you put all of those answers into a Google spreadsheet. Spreadsheets are still a thing.

**CRAIG BOX: The Kubernetes ecosystem runs entirely on Google Spreadsheets.**

NABARUN PAL: It does, and a lot of Google Docs for meeting notes! We did a lot of process improvements, which essentially led to a better release. This release cycle we had 13 enhancements graduating to stable, 16 which moved to beta, and 20 enhancements which were net new features into the ecosystem, and came in as alpha.

Along with that are features set for deprecation. One of them was PodSecurityPolicy. That has been a point of discussion in the Kubernetes user base and we also published [a blog post about it](https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/). All credit to SIG Security who have been on top of things as to find a replacement for PodSecurityPolicy even before this release cycle ended, so that they could at least have a proposal of what will happen next.

**CRAIG BOX: Let's talk about some old things and some new things. You mentioned PodSecurityPolicy there. That's a thing that's been around a long time and is being deprecated. Two things that have been around a long time and that are now being promoted to stable are CronJobs and PodDisruptionBudgets, both of which were introduced in Kubernetes 1.4, which came out in 2016. Why do you think it took so long for them both to go stable?**

NABARUN PAL: I might not have a definitive answer to your question. One of the things that I feel is they might be already so good that nobody saw that they were beta features, and just kept on using them.

One of the things that I noticed when reading for the CronJobs graduation from beta to stable was the new controller. Users might not see this, but there has been a drastic change in the CronJob controller v2. What it essentially does is goes from a poll-based method of checking what users have defined as CronJobs to a queue architecture, which is the modern method of defining controllers. That has been one of the really good improvements in the case of CronJobs. Instead of the controller working in O(N) time, you now have constant time complexity.

**CRAIG BOX: A lot of these features that have been in beta for a long time, like you say, people have an expectation that they are complete. With PodSecurityPolicy, it's being deprecated, which is allowed because it's a feature that never made it out of beta. But how do you think people will react to it going away? And does that say something about the need for the process to make sure that features don't just languish in beta forever, which has been introduced recently?**

NABARUN PAL: That's true. One of the driving factors, when contributors are thinking of graduating beta features has been the ["prevention of perma-beta" KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/1635-prevent-permabeta/README.md). Back in 1.19 we [introduced this process](https://kubernetes.io/blog/2020/08/21/moving-forward-from-beta/) where each of the beta resources were marked for deprecation and removal in a certain time frame-- three releases for deprecation and another  release for removal. That's also a motivating factor for eventually rethinking as to how beta resources work for us in the community. That is also very effective, I would say.

**CRAIG BOX: Do remember that Gmail was in beta for eight years.**

NABARUN PAL: I did not know that!

**CRAIG BOX: Nothing in Kubernetes is quite that old yet, but we'll get there. Of the 20 new enhancements, do you have a favorite or any that you'd like to call out?**

NABARUN PAL: There are two specific features in 1.21 that I'm really interested in, and are coming as net new features. One of them is the [persistent volume health monitor](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor), which gives the users the capability to actually see whether the backing volumes, which power persistent volumes in Kubernetes, are deleted or not. For example, the volumes may get deleted due to an inadvertent event, or they may get corrupted. That information is basically surfaced out as a field so that the user can leverage it in any way.

The other feature is the proposal for [adding headers with the command name to kubectl requests](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cli/859-kubectl-headers). We have always set the user-agent information when doing those kind of requests, but the proposal is to add what command the user put in so that we can enable more telemetry, and cluster administrators can determine the usage patterns of how people are using the cluster. I'm really excited about these kind of features coming into play.

**CRAIG BOX: You're the first release lead from the Asia-Pacific region, or more accurately, outside of the US and Europe. Most meetings in the Kubernetes ecosystem are traditionally in the window of overlap between the US and Europe, in the morning in California and the evening here in the UK. What's it been like to work outside of the time zones that the community had previously been operating in?**

NABARUN PAL: It has been a fun and a challenging proposition, I would say. In the last two-ish years that I have been contributing to Kubernetes, the community has also transformed from a lot of early morning Pacific calls to more towards async processes. For example, we in the release team have transformed our processes so we don't do updates in the calls anymore. What we do is ask for updates ahead of time, and then in the call, we just discuss things which need to be discussed synchronously in the team.

We leverage the meetings right now more for discussions. But we also don't come to decisions in those discussions, because if any stakeholder is not present on the call, it puts them at a disadvantage. We are trying to talk more on Slack, publicly, or talk on mailing lists. That's where most of the discussion should happen, and also to gain lazy consensus. What I mean by lazy consensus is come up with a pre-decision kind of thing, but then also invite feedback from the broader community about what people would like them to see about that specific thing being discussed. This is where we as a community are also transforming a lot, but there is a lot more headroom to grow.

The release team also started to have EU/APAC burndown meetings. In addition to having one meeting focused towards the US and European time zones, we also do a meeting which is more suited towards European and Asia-Pacific time zones. One of the driving factors for those decisions was that the release team is seeing a lot of participation from a variety of time zones. To give you one metric, we had release team members this cycle from UTC+8 all through UTC-8 - 16 hours of span. It's really difficult to accommodate all of those zones in a single meeting. And it's not just those 16 hours of span - what about the other eight hours?

**CRAIG BOX: Yeah, you're missing New Zealand. You could add another 5 hours of span right there.**

NABARUN PAL: Exactly. So we will always miss people in meetings, and that's why we should also innovate more, have different kinds of meetings. But that also may not be very sustainable in the future. Will people attend duplicate meetings? Will people follow both of the meetings? More meetings is one of the solutions.

The other solution is you have threaded discussions on some medium, be it Slack or be it a mailing list. Then, people can just pitch in whenever it is work time for them. Then, at the end of the day, a 24-hour rolling period, you digest it, and then push it out as meeting notes. That's what the Contributor Experience Special Interest Group is doing - shout-out to them for moving to that process. I may be wrong here, but I think once every two weeks, they do async updates on Slack. And that is a really nice thing to have, improving variety of geographies that people can contribute from.

**CRAIG BOX: Once you've put everything together that you hope to be in your release, you create a release candidate build. How do you motivate people to test those?**

NABARUN PAL: That's a very interesting question. It is difficult for us to motivate people into trying out these candidates. It's mostly people who are passionate about Kubernetes who try out the release candidates and see for themselves what the bugs are. I remember [Dims tweeting out a call](https://twitter.com/dims/status/1377272238420934656) that if somebody tries out the release candidate and finds a good bug or caveat, they could get a callout in the KubeCon keynote. That's one of the incentives - if you want to be called out in a KubeCon keynote, please try our release candidates.

**CRAIG BOX: Or get a new pair of Kubernetes socks?**

NABARUN PAL: We would love to give out goodies to people who try out our release candidates and find bugs. For example, if you want the brand new release team logo as a sticker, just hit me up. If you find a bug in a 1.22 release candidate, I would love to be able to send you some coupon codes for the store. Don't quote me on this, but do reach out.

**CRAIG BOX: Now the release is out, is it time for you to put your feet up? What more things do you have to do, and how do you feel about the path ahead for yourself?**

NABARUN PAL: I was discussing this with the team yesterday. Even after the release, we had kind of a water-cooler conversation. I just pasted in a Zoom link to all the release team members and said, hey, do you want to chat? One of the things that I realized that I'm really missing is the daily burndowns right now. I will be around in the release team and the SIG Release meetings, helping out the new lead in transitioning. And even my job, right now, is not over. I'm working with Taylor, who is the emeritus advisor for 1.21, on figuring out some of the mechanics for the next release cycle. I'm also documenting what all we did as part of the process and as part of the process changes, and making sure the next release cycle is up and running.

**CRAIG BOX: We've done a lot of these release lead interviews now, and there's a question which we always like to ask, which is, what will you write down in the transition envelope? Savitha Raghunathan is the release lead for 1.22. What is the advice that you will pass on to her?**

NABARUN PAL: Three words-- **Do, Delegate, and Defer**. Categorize things into those three buckets as to what you should do right away, what you need to defer, and things that you can delegate to your shadows or other release team members. That's one of the mantras that works really well when leading a team. It is not just in the context of the release team, but it's in the context of managing any team.

The other bit is **over-communicate**. No amount of communication is enough. What I've realized is the community is always willing to help you. One of the big examples that I can give is the day before release was supposed to happen, we were seeing a lot of test failures, and then one of the community members had an idea-- why don't you just send an email? I was like, "that sounds good. We can send an email mentioning all the flakes and call out for help to the broader Kubernetes developer community." And eventually, once we sent out the email, lots of people came in to help us in de-flaking the tests and trying to find out the root cause as to why those tests were failing so often. Big shout out to Antonio and all the SIG Network folks who came to pitch in.

No matter how many names I mention, it will never be enough. A lot of people, even outside the release team, have helped us a lot with this release. And that's where the release theme comes in - **Power to the Community**. I'm really stoked by how this community behaves and how people are willing to help you all the time. It's not about what they're telling you to do, but it's what they're also interested in, they're passionate about.

**CRAIG BOX: One of the things you're passionate about is Formula One. Do you think Lewis Hamilton is going to take it away this year?**

NABARUN PAL: It's a fair probability that Lewis will win the title this year as well.

**CRAIG BOX: Which would take him to eight all time career wins. And thus-- [he's currently tied with Michael Schumacher](https://www.nytimes.com/2020/11/15/sports/autoracing/lewis-hamilton-schumacher-formula-one-record.html)-- would pull him ahead.**

NABARUN PAL: Yes. Michael Schumacher was my first favorite F1 driver, I would say. It feels a bit heartbreaking to see someone break Michael's record.

**CRAIG BOX: How do you feel about [Michael Schumacher's son joining the contest?](https://www.formula1.com/en/latest/article.breaking-mick-schumacher-to-race-for-haas-in-2021-as-famous-surname-returns.66XTVfSt80GrZe91lvWVwJ.html)**

NABARUN PAL: I feel good. Mick Schumacher is in the fray right now. And I wish we could see him, in a few years, in a Ferrari. The Schumacher family back to Ferrari would be really great to see. But then, my fan favorite has always been McLaren, partly because I like the chemistry of Lando and Carlos over the last two years. It was heartbreaking to see Carlos go to Ferrari. But then we have Lando and Daniel Ricciardo in the team. They're also fun people.

---

_[Nabarun Pal](https://twitter.com/theonlynabarun) is on the Tanzu team at VMware and served as the Kubernetes 1.21 release team lead._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
