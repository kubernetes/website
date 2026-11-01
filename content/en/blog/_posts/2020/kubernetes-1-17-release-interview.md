---
layout: blog
title: "Music and math: the Kubernetes 1.17 release interview"
date: 2020-07-27
author: >
  Adam Glick (Google)
---

Every time the Kubernetes release train stops at the station, we like to ask the release lead to take a moment to reflect on their experience. That takes the form of an interview on the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/) that I co-host with [Craig Box](https://twitter.com/craigbox). If you're not familiar with the show, every week we summarise the new in the Cloud Native ecosystem, and have an insightful discussion with an interesting guest from the broader Kubernetes community.

At the time of the 1.17 release in December, we [talked to release team lead Guinevere Saenger](https://kubernetespodcast.com/episode/083-kubernetes-1.17/). We have [shared](https://kubernetes.io/blog/2018/07/16/how-the-sausage-is-made-the-kubernetes-1.11-release-interview-from-the-kubernetes-podcast/) [the](https://kubernetes.io/blog/2019/05/13/cat-shirts-and-groundhog-day-the-kubernetes-1.14-release-interview/) [transcripts](https://kubernetes.io/blog/2019/12/06/when-youre-in-the-release-team-youre-family-the-kubernetes-1.16-release-interview/) of previous interviews on the Kubernetes blog, and we're very happy to share another today.

Next week we will bring you up to date with the story of Kubernetes 1.18, as we gear up for the release of 1.19 next month. [Subscribe to the show](https://kubernetespodcast.com/subscribe/) wherever you get your podcasts to make sure you don't miss that chat!

---

**ADAM GLICK: You have a nontraditional background for someone who works as a software engineer. Can you explain that background?**

GUINEVERE SAENGER: My first career was as a [collaborative pianist](https://en.wikipedia.org/wiki/Collaborative_piano), which is an academic way of saying "piano accompanist". I was a classically trained pianist who spends most of her time onstage, accompanying other people and making them sound great.

**ADAM GLICK: Is that the piano equivalent of pair-programming?**

GUINEVERE SAENGER: No one has said it to me like that before, but all sorts of things are starting to make sense in my head right now. I think that's a really great way of putting it.

**ADAM GLICK: That's a really interesting background, as someone who also has a background with music. What made you decide to get into software development?**

GUINEVERE SAENGER: I found myself in a life situation where I needed more stable source of income, and teaching music, and performing for various gig opportunities, was really just not cutting it anymore. And I found myself to be working really, really hard with not much to show for it. I had a lot of friends who were software engineers. I live in Seattle. That's sort of a thing that happens to you when you live in Seattle — you get to know a bunch of software engineers, one way or the other.

The ones I met were all lovely people, and they said, hey, I'm happy to show you how to program in Python. And so I did that for a bit, and then I heard about this program called [Ada Developers Academy](https://adadevelopersacademy.org/). That's a year long coding school, targeted at women and non-binary folks that are looking for a second career in tech. And so I applied for that.

**CRAIG BOX: What can you tell us about that program?**

GUINEVERE SAENGER: It's incredibly selective, for starters. It's really popular in Seattle and has gotten quite a good reputation. It took me three tries to get in. They do two classes a year, and so it was a while before I got my response saying 'congratulations, we are happy to welcome you into Cohort 6'. I think what sets Ada Developers Academy apart from other bootcamp style coding programs are three things, I think? The main important one is that if you get in, you pay no tuition. The entire program is funded by company sponsors.

**CRAIG BOX: Right.**

GUINEVERE SAENGER: The other thing that really convinced me is that five months of the 11-month program are an industry internship, which means you get both practical experience, mentorship, and potential job leads at the end of it.

**CRAIG BOX: So very much like a condensed version of the University of Waterloo degree, where you do co-op terms.**

GUINEVERE SAENGER: Interesting. I didn't know about that.

**CRAIG BOX: Having lived in Waterloo for a while, I knew a lot of people who did that. But what would you say the advantages were of going through such a condensed schooling process in computer science?**

GUINEVERE SAENGER: I'm not sure that the condensed process is necessarily an advantage. I think it's a necessity, though. People have to quit their jobs to go do this program. It's not an evening school type of thing.

**CRAIG BOX: Right.**

GUINEVERE SAENGER: And your internship is basically a full-time job when you do it. One thing that Ada was really, really good at is giving us practical experience that directly relates to the workplace. We learned how to use Git. We learned how to design websites using [Rails](https://rubyonrails.org/). And we also learned how to collaborate, how to pair-program. We had a weekly retrospective, so we sort of got a soft introduction to workflows at a real workplace. Adding to that, the internship, and I think the overall experience is a little bit more 'practical workplace oriented' and a little bit less academic.

When you're done with it, you don't have to relearn how to be an adult in a working relationship with other people. You come with a set of previous skills. There are Ada graduates who have previously been campaign lawyers, and veterinarians, and nannies, cooks, all sorts of people. And it turns out these skills tend to translate, and they tend to matter.

**ADAM GLICK: With your background in music, what do you think that that allows you to bring to software development that could be missing from, say, standard software development training that people go through?**

GUINEVERE SAENGER: People tend to really connect the dots when I tell them I used to be a musician. Of course, I still consider myself a musician, because you don't really ever stop being a musician. But they say, 'oh, yeah, music and math', and that's just a similar sort of brain. And that makes so much sense. And I think there's a little bit of a point to that. When you learn a piece of music, you have to start recognizing patterns incredibly quickly, almost intuitively.

And I think that is the main skill that translates into programming— recognizing patterns, finding the things that work, finding the things that don't work. And for me, especially as a collaborative pianist, it's the communicating with people, the finding out what people really want, where something is going, how to figure out what the general direction is that we want to take, before we start writing the first line of code.

**CRAIG BOX: In your experience at Ada or with other experiences you've had, have you been able to identify patterns in other backgrounds for people that you'd recommend, 'hey, you're good at music, so therefore you might want to consider doing something like a course in computer science'?**

GUINEVERE SAENGER: Overall, I think ultimately writing code is just giving a set of instructions to a computer. And we do that in daily life all the time. We give instructions to our kids, we give instructions to our students. We do math, we write textbooks. We give instructions to a room full of people when you're in court as a lawyer.

Actually, the entrance exam to Ada Developers Academy used to have questions from the [LSAT](https://en.wikipedia.org/wiki/Law_School_Admission_Test) on it to see if you were qualified to join the program. They changed that when I applied, but I think that's a thing that happened at one point. So, overall, I think software engineering is a much more varied field than we give it credit for, and that there are so many ways in which you can apply your so-called other skills and bring them under the umbrella of software engineering.

**CRAIG BOX: I do think that programming is effectively half art and half science. There's creativity to be applied. There is perhaps one way to solve a problem most efficiently. But there are many different ways that you can choose to express how you compiled something down to that way.**

GUINEVERE SAENGER: Yeah, I mean, that's definitely true. I think one way that you could probably prove that is that if you write code at work and you're working on something with other people, you can probably tell which one of your co-workers wrote which package, just by the way it's written, or how it is documented, or how it is styled, or any of those things. I really do think that the human character shines through.

**ADAM GLICK: What got you interested in Kubernetes and open source?**

GUINEVERE SAENGER: The honest answer is absolutely nothing. Going back to my programming school— and remember that I had to do a five-month internship as part of my training— the way that the internship works is that sponsor companies for the program get interns in according to how much they sponsored a specific cohort of students.

So at the time, Samsung and SDS offered to host two interns for five months on their [Cloud Native Computing team](https://samsung-cnct.github.io/) and have that be their practical experience. So I go out of a Ruby on Rails full stack web development bootcamp and show up at my internship, and they said, "Welcome to Kubernetes. Try to bring up a cluster." And I said, "Kuber what?"

**CRAIG BOX: We've all said that on occasion.**

**ADAM GLICK: Trial by fire, wow.**

GUINEVERE SAENGER: I will say that that entire team was absolutely wonderful, delightful to work with, incredibly helpful. And I will forever be grateful for all of the help and support that I got in that environment. It was a great place to learn.

**CRAIG BOX: You now work on GitHub's Kubernetes infrastructure. Obviously, there was GitHub before there was a Kubernetes, so a migration happened. What can you tell us about the transition that GitHub made to running on Kubernetes?**

GUINEVERE SAENGER: A disclaimer here— I was not at GitHub at the time that the transition to Kubernetes was made. However, to the best of my knowledge, the decision to transition to Kubernetes was made and people decided, yes, we want to try Kubernetes. We want to use Kubernetes. And mostly, the only decision left was, which one of our applications should we move over to Kubernetes?

**CRAIG BOX: I thought GitHub was written on Rails, so there was only one application.**

GUINEVERE SAENGER: [LAUGHING] We have a lot of supplementary stuff under the covers.

**CRAIG BOX: I'm sure.**

GUINEVERE SAENGER: But yes, GitHub is written in Rails. It is still written in Rails. And most of the supplementary things are currently running on Kubernetes. We have a fair bit of stuff that currently does not run on Kubernetes. Mainly, that is GitHub Enterprise related things. I would know less about that because I am on the platform team that helps people use the Kubernetes infrastructure. But back to your question, leadership at the time decided that it would be a good idea to start with GitHub the Rails website as the first project to move to Kubernetes.

**ADAM GLICK: High stakes!**

GUINEVERE SAENGER: The reason for this was that they decided if they were going to not start big, it really wasn't going to transition ever. It was really not going to happen. So they just decided to go all out, and it was successful, for which I think the lesson would probably be commit early, commit big.

**CRAIG BOX: Are there any other lessons that you would take away or that you've learned kind of from the transition that the company made, and might be applicable to other people who are looking at moving their companies from a traditional infrastructure to a Kubernetes infrastructure?**

GUINEVERE SAENGER: I'm not sure this is a lesson specifically, but I was on support recently, and it turned out that, due to unforeseen circumstances and a mix of human error, a bunch of the namespaces on one of our Kubernetes clusters got deleted.

**ADAM GLICK: Oh, my.**

GUINEVERE SAENGER: It should not have affected any customers, I should mention, at this point. But all in all, it took a few of us a few hours to almost completely recover from this event. I think that, without Kubernetes, this would not have been possible.

**CRAIG BOX: Generally, deleting something like that is quite catastrophic. We've seen a number of other vendors suffer large outages when someone's done something to that effect, which is why we get [#hugops](https://twitter.com/hashtag/hugops) on Twitter all the time.**

GUINEVERE SAENGER: People did send me #hugops, that is a thing that happened. But overall, something like this was an interesting stress test and sort of proved that it wasn't nearly as catastrophic as a worst case scenario.

**CRAIG BOX: GitHub [runs its own data centers](https://githubengineering.com/githubs-metal-cloud/). Kubernetes was largely built for running on the cloud, but a lot of people do choose to run it on their own, bare metal. How do you manage clusters and provisioning of the machinery you run?**

GUINEVERE SAENGER: When I started, my onboarding project was to deprovision an old cluster, make sure all the traffic got moved to somewhere where it would keep running, provision a new cluster, and then move website traffic onto the new cluster. That was a really exciting onboarding project. At the time, we provisioned bare metal machines using Puppet. We still do that to a degree, but I believe the team that now runs our computing resources actually inserts virtual machines as an extra layer between the bare metal and the Kubernetes nodes.

Again, I was not intrinsically part of that decision, but my understanding is that it just makes for a greater reliability and reproducibility across the board. We've had some interesting hardware dependency issues come up, and the virtual machines basically avoid those.

**CRAIG BOX: You've been working with Kubernetes for a couple of years now. How did you get involved in the release process?**

GUINEVERE SAENGER: When I first started in the project, I started at the [special interest group for contributor experience](https://github.com/kubernetes/community/tree/master/sig-contributor-experience#readme), namely because one of my co-workers at the time, Aaron Crickenberger, was a big Kubernetes community person. Still is.

**CRAIG BOX: We've [had him on the show](https://kubernetespodcast.com/episode/046-kubernetes-1.14/) for one of these very release interviews!**

GUINEVERE SAENGER: In fact, this is true! So Aaron and I actually go way back to Samsung SDS. Anyway, Aaron suggested that I should write up a contribution to the Kubernetes project, and I said, me? And he said, yes, of course. You will be [speaking at KubeCon](https://www.youtube.com/watch?v=TkCDUFR6xqw), so you should probably get started with a PR or something. So I tried, and it was really, really hard. And I complained about it [in a public GitHub issue](https://github.com/kubernetes/community/issues/141), and people said, yeah. Yeah, we know it's hard. Do you want to help with that?

And so I started getting really involved with the [process for new contributors to get started](https://github.com/kubernetes/community/tree/master/contributors/guide) and have successes, kind of getting a foothold into a project that's as large and varied as Kubernetes. From there on, I began to talk to people, get to know people. The great thing about the Kubernetes community is that there is so much mentorship to go around.

**ADAM GLICK: Right.**

GUINEVERE SAENGER: There are so many friendly people willing to help. It's really funny when I talk to other people about it. They say, what do you mean, your coworker? And I said, well, he's really a colleague. He really works for another company.

**CRAIG BOX: He's sort-of officially a competitor.**

GUINEVERE SAENGER: Yeah.

**CRAIG BOX: But we're friends.**

GUINEVERE SAENGER: But he totally helped me when I didn't know how to git patch my borked pull request. So that happened. And eventually, somebody just suggested that I start following along in the release process and shadow someone on their release team role. And that, at the time, was Tim Pepper, who was bug triage lead, and I shadowed him for that role.

**CRAIG BOX: Another [podcast guest](https://kubernetespodcast.com/episode/010-kubernetes-1.11/) on the interview train.**

GUINEVERE SAENGER: This is a pattern that probably will make more sense once I explain to you about the shadow process of the release team.

**ADAM GLICK: Well, let's turn to the Kubernetes release and the release process. First up, what's new in this release of 1.17?**

GUINEVERE SAENGER: We have only a very few new things. The one that I'm most excited about is that we have moved [IPv4 and IPv6 dual stack](https://github.com/kubernetes/enhancements/issues/563) support to alpha. That is the most major change, and it has been, I think, a year and a half in coming. So this is the very first cut of that feature, and I'm super excited about that.

**CRAIG BOX: The people who have been promised IPv6 for many, many years and still don't really see it, what will this mean for them?**

**ADAM GLICK: And most importantly, why did we skip IPv5 support?**

GUINEVERE SAENGER: I don't know!

**CRAIG BOX: Please see [the appendix to this podcast](https://softwareengineering.stackexchange.com/questions/185380/ipv4-to-ipv6-where-is-ipv5) for technical explanations.**

GUINEVERE SAENGER: Having a dual stack configuration obviously enables people to have a much more flexible infrastructure and not have to worry so much about making decisions that will become outdated or that may be over-complicated. This basically means that pods can have dual stack addresses, and nodes can have dual stack addresses. And that basically just makes communication a lot easier.

**CRAIG BOX: What about features that didn't make it into the release? We had a conversation with Lachie in the [1.16 interview](https://kubernetespodcast.com/episode/072-kubernetes-1.16/), where he mentioned [sidecar containers](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/sidecarcontainers.md). They unfortunately didn't make it into that release. And I see now that they haven't made this one either.**

GUINEVERE SAENGER: They have not, and we are actually currently undergoing an effort of tracking features that flip multiple releases.

As a community, we need everyone's help. There are a lot of features that people want. There is also a lot of cleanup that needs to happen. And we have started talking at previous KubeCons repeatedly about problems with maintainer burnout, reviewer burnout, have a hard time finding reviews for your particular contributions, especially if you are not an entrenched member of the community. And it has become very clear that this is an area where the entire community needs to improve.

So the unfortunate reality is that sometimes life happens, and people are busy. This is an open source project. This is not something that has company mandated OKRs. Particularly during the fourth quarter of the year in North America, but around the world, we have a lot of holidays. It is the end of the year. Kubecon North America happened as well. This makes it often hard to find a reviewer in time or to rally the support that you need for your enhancement proposal. Unfortunately, slipping releases is fairly common and, at this point, expected. We started out with having 42 enhancements and [landed with roughly half of that](https://docs.google.com/spreadsheets/d/1ebKGsYB1TmMnkx86bR2ZDOibm5KWWCs_UjV3Ys71WIs/edit#gid=0).

**CRAIG BOX: I was going to ask about the truncated schedule due to the fourth quarter of the year, where there are holidays in large parts of the world. Do you find that the Q4 release on the whole is smaller than others, if not for the fact that it's some week shorter?**

GUINEVERE SAENGER: Q4 releases are shorter by necessity because we are trying to finish the final release of the year before the end of the year holidays. Often, releases are under pressure of KubeCons, during which finding reviewers or even finding the time to do work can be hard to do, if you are attending. And even if you're not attending, your reviewers might be attending.

It has been brought up last year to make the final release more of a stability release, meaning no new alpha features. In practice, for this release, this is actually quite close to the truth. We have four features graduating to beta and most of our features are graduating to stable. I am hoping to use this as a precedent to change our process to make the final release a stability release from here on out. The timeline fits. The past experience fits this model.

**ADAM GLICK: On top of all of the release work that was going on, there was also KubeCon that happened. And you were involved in the [contributor summit](https://github.com/kubernetes/community/tree/master/events/2019/11-contributor-summit). How was the summit?**

GUINEVERE SAENGER: This was the first contributor summit where we had an organized events team with events organizing leads, and handbooks, and processes. And I have heard from multiple people— this is just word of mouth— that it was their favorite contributor summit ever.

**CRAIG BOX: Was someone allocated to hat production? [Everyone had sailor hats](https://flickr.com/photos/143247548@N03/49093218951/).**

GUINEVERE SAENGER: Yes, the entire event staff had sailor hats with their GitHub handle on them, and it was pretty fantastic. You can probably see me wearing one in some of the pictures from the contributor summit. That literally was something that was pulled out of a box the morning of the contributor summit, and no one had any idea. But at first, I was a little skeptical, but then I put it on and looked at myself in the mirror. And I was like, yes. Yes, this is accurate. We should all wear these.

**ADAM GLICK: Did getting everyone together for the contributor summit help with the release process?**

GUINEVERE SAENGER: It did not. It did quite the opposite, really. Well, that's too strong.

**ADAM GLICK: Is that just a matter of the time taken up?**

GUINEVERE SAENGER: It's just a completely different focus. Honestly, it helped getting to know people face-to-face that I had currently only interacted with on video. But we did have to cancel the release team meeting the day of the contributor summit because there was kind of no sense in having it happen. We moved it to the Tuesday, I believe.

**CRAIG BOX: The role of the release team leader has been described as servant leadership. Do you consider the position proactive or reactive?**

GUINEVERE SAENGER: Honestly, I think that depends on who's the release team lead, right? There are some people who are very watchful and look for trends, trying to detect problems before they happen. I tend to be in that camp, but I also know that sometimes it's not possible to predict things. There will be last minute bugs sometimes, sometimes not. If there is a last minute bug, you have to be ready to be on top of that. So for me, the approach has been I want to make sure that I have my priorities in order and also that I have backups in case I can't be available.

**ADAM GLICK: What was the most interesting part of the release process for you?**

GUINEVERE SAENGER: A release lead has to have served in other roles on the release team prior to being release team lead. To me, it was very interesting to see what other roles were responsible for, ones that I hadn't seen from the inside before, such as docs, CI signal. I had helped out with CI signal for a bit, but I want to give a big shout out to CI signal lead, Alena Varkockova, who was able to communicate effectively and kindly with everyone who was running into broken tests, failing tests. And she was very effective in getting all of our tests up and running.

So that was actually really cool to see. And yeah, just getting to see more of the workings of the team, for me, it was exciting. The other big exciting thing, of course, was to see all the changes that were going in and all the efforts that were being made.

**CRAIG BOX: The release lead for 1.18 has just been announced as [Jorge Alarcon](https://twitter.com/alejandrox135). What are you going to put in the proverbial envelope as advice for him?**

GUINEVERE SAENGER: I would want Jorge to be really on top of making sure that every Special Interest Group that enters a change, that has an enhancement for 1.18, is on top of the timelines and is responsive. Communication tends to be a problem. And I had hinted at this earlier, but some enhancements slipped simply because there wasn't enough reviewer bandwidth.

Greater communication of timelines and just giving people more time and space to be able to get in their changes, or at least, seemingly give them more time and space by sending early warnings, is going to be helpful. Of course, he's going to have a slightly longer release, too, than I did. This might be related to a unique Q4 challenge. Overall, I would encourage him to take more breaks, to rely more on his release shadows, and split out the work in a fashion that allows everyone to have a turn and everyone to have a break as well.

**ADAM GLICK: What would your advice be to someone who is hearing your experience and is inspired to get involved with the Kubernetes release or contributor process?**

GUINEVERE SAENGER: Those are two separate questions. So let me tackle the Kubernetes release question first. Kubernetes [SIG Release](https://github.com/kubernetes/sig-release/#readme) has, in my opinion, a really excellent onboarding program for new members. We have what is called the [Release Team Shadow Program](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md). We also have the Release Engineering Shadow Program, or the Release Management Shadow Program. Those are two separate subprojects within SIG Release. And each subproject has a team of roles, and each role can have two to four shadows that are basically people who are part of that role team, and they are learning that role as they are doing it.

So for example, if I am the lead for bug triage on the release team, I may have two, three or four people that I closely work with on the bug triage tasks. These people are my shadows. And once they have served one release cycle as a shadow, they are now eligible to be lead in that role. We have an application form for this process, and it should probably be going up in January. It usually happens the first week of the release once all the release leads are put together.

**CRAIG BOX: Do you think being a member of the release team is something that is a good first contribution to the Kubernetes project overall?**

GUINEVERE SAENGER: It depends on what your goals are, right? I believe so. I believe, for me, personally, it has been incredibly helpful looking into corners of the project that I don't know very much about at all, like API machinery, storage. It's been really exciting to look over all the areas of code that I normally never touch.

It depends on what you want to get out of it. In general, I think that being a release team shadow is a really, really great on-ramp to being a part of the community because it has a paved path solution to contributing. All you have to do is show up to the meetings, ask questions of your lead, who is required to answer those questions.

And you also do real work. You really help, you really contribute. If you go across the issues and pull requests in the repo, you will see, 'Hi, my name is so-and-so. I am shadowing the CI signal lead for the current release. Can you help me out here?' And that's a valuable contribution, and it introduces people to others. And then people will recognize your name. They'll see a pull request by you, and they're like oh yeah, I know this person. They're legit.

---

_[Guinevere Saenger](https://twitter.com/guincodes) is a software engineer for GitHub and served as the Kubernetes 1.17 release team lead._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
