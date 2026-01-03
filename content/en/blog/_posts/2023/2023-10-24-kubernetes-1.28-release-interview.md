---
layout: blog
title: "Plants, process and parties: the Kubernetes 1.28 release interview"
date: 2023-10-24
author: >
  Craig Box
---

Since 2018, one of my favourite contributions to the Kubernetes community has been to [share the story of each release](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog). Many of these stories were told on behalf of a past employer; by popular demand, I've brought them back, now under my own name. If you were a fan of the old show, I would be delighted if you would [subscribe](https://craigbox.substack.com/about).

Back in August, [we welcomed the release of Kubernetes 1.28](/blog/2023/08/15/kubernetes-v1-28-release/). That release was led by [Grace Nguyen](https://twitter.com/gracenng), a CS student at the University of Waterloo. Grace joined me for the traditional release interview, and while you can read her story below, [I encourage you to listen to it if you can](https://craigbox.substack.com/p/the-kubernetes-128-release-interview).

*This transcript has been lightly edited and condensed for clarity.*

---

**You're a student at the University of Waterloo, so I want to spend the first two minutes of this interview talking about the Greater Kitchener-Waterloo region. It's August, so this is one of the four months of the year when there's no snow visible on the ground?**<br>
Well, it's not that bad. I think the East Coast has it kind of good. I grew up in Calgary, but I do love summer here in Waterloo. We have a [petting zoo](https://goo.gl/maps/W1nM7LjNZPv) close to our university campus, so I go and see the llamas sometimes. 

**Is that a new thing?**<br>
I'm not sure, it seems like it's been around five-ish years, the Waterloo Park?

**I lived there in 2007, for a couple of years, just to set the scene for why we're talking about this. I think they were building a lot of the park then. I do remember, of course, that [Kitchener holds the second largest Oktoberfest in the world](https://www.oktoberfest.ca/). Is that something you've had a chance to check out?**<br>
I have not. I actually didn't know that was a fact.

**The local civic organization is going to have to do a bit more work, I feel. Do you like ribs?**<br>
I have mixed feelings about ribs. It's kind of a hit or miss situation for me so far. 

**Again, that might be something that's changed over the last few years. The Ribfests used to have a lot of trophies with little pigs on top of them, but I feel that the shifting dining habits of the world might mean they have to offer some vegan or vegetarian options, to please the modern palette.**<br>
[LAUGHS] For sure. Do you recommend the Oktoberfest here? Have you been?

**I went a couple of times.  It was a lot of fun.**<br>
Okay.

**It's basically just drinking. I would have recommended it back then; I'm not sure it would be quite what I'd be doing today.**<br>
All right, good to know.

**The Ribfest, however, I would go back just for that.**<br>
Oh, ok.

**And the great thing about Ribfests as a concept is that they have one in every little town. [The Kitchener Ribfest](https://kitchenerribandbeerfest.com/), I looked it up, it's in July; you've just missed that. But, you could go to the [Waterloo Ribfest](https://northernheatribseries.ca/waterloo/) in September.**<br>
Oh, it is in September? They have their own Ribfest?

**They do. I think Guelph has one, and Cambridge has one. That's the advantage of the region — there are lots of little cities. Kitchener and Waterloo are two cities that grew into each other — they do call them the Twin Cities. I hear that they finally built the light rail link between the two of them?**<br>
It is fantastic, and makes the city so much more walkable.

**Yes, you can go from one mall to the other. That's Canada for you.**<br>
Well, Uptown is really nice. I quite like it. It's quite cozy.

**Do you ever cross the border over into Kitchener? Or only when you've lost a bet?**<br>
Yeah, not a lot. Only for farmer's market, I say. 

**It's worthwhile. There's a lot of good food there, I remember.**<br>
Yeah. Quite lovely.

**Now we've got all that out of the way, let's travel back in time a little bit. You mentioned there that you went to high school in Calgary?**<br>
I did. I had not been to Ontario before I went to university. Calgary was frankly too cold and not walkable enough for me. 

**I basically say the same thing about Waterloo and that's why I moved to England.**<br>
Fascinating. Gets better. 

**How did you get into tech?**<br>
I took a computer science class in high school. I was one of maybe only three women in the class, and I kind of stuck with it since.

**Was the gender distribution part of your thought process at the time?**<br>
Yeah, I think I was drawn to it partially because I didn't see a lot of people who looked like me in the class. 

**You followed it through to university. What is it that you're studying?**<br>
I am studying computer engineering, so a lot of hardware stuff. 

**You're involved in the [UW Cybersecurity Club](https://www.facebook.com/groups/uwcyber/). What can you tell me about that without having to kill me?**<br>
Oh, we are very nice and friendly people! I told myself I'm going to have a nice and chill summer and then I got chosen to lead the release and also ended up running the Waterloo Cybersecurity Club. The club kind of died out during the pandemic, because we weren't on campus, but we have so many smart and amazing people who are in cybersecurity, so it's great to get them together and I learned so many things. 

**Is that like the modern equivalent of the [LAN party](https://en.wikipedia.org/wiki/LAN_party)? You're all getting into a dark room and trying to hack the Gibson?**<br>
[LAUGHS] Well, you'll have to explain to me again what a LAN party is. Do you bring your own PC?

**You used to. Back in the day it was incomprehensible that you could communicate with a different person in a different place at a fast enough speed, so you had to physically sit next to somebody and plug a cable in between you.**<br>
Okay, well kind of the same, I guess. We bring our own laptop and we go to CTF competitions together.

**They didn't have laptops back in the days of LAN parties. You'd bring a giant 19-inch square monitor, and everything. It was a badge of honor what you could carry.**<br>
Okay. Can't relate, but good to know. [LAUGHS]

**One of the more unique aspects of UW is its [co-op system](https://uwaterloo.ca/future-students/co-op). Tell us a little bit about that?**<br>
As part of my degree, I am required to do minimum five and maximum six co-ops. I've done all six of them. Two of them were in Kubernetes and that's how I got started.

**A co-op is a placement, as opposed to something you do on campus?**<br>
Right, so co-op is basically an internship. My first one was at the Canada Revenue Agency. We didn't have wifi and I had my own cubicle, which is interesting. They don't do that anymore, they have open office space. But my second was at Ericsson, where I learned about Kubernetes. It was during the pandemic. KubeCon offered virtual attendance for students and I signed up and I poked around and I have been around since. 

**What was it like going through university during the COVID years? What did that mean in terms of the fact you would previously have traveled to these internships? Did you do them all from home?**<br>
I'm not totally sure what I missed out on. For sure, a lot of relationship building, but also that we do have to move a lot as part of the co-op experience. Last fall I was in San Francisco, I was in Palo Alto earlier this year. A lot of that dynamic has already been the case.

**Definitely different weather systems, Palo Alto versus Waterloo.**<br>
Oh, for sure. Yes, yes. Really glad I was there over the winter. 

**The first snow would fall in Ontario about the end of October and it would pile up over the next few months. There were still piles that hadn't melted by June. That's why I say, there were only four months of the year, July through September, where there was no snow on the ground.**<br>
 That's true. Didn't catch any snow in Palo Alto, and honestly, that's great. [CHUCKLES]

**Thank you, global warming, I guess.**<br>
Oh no! [LAUGHS]

**Tell me about the co-op term that you did working with Kubernetes at Ericsson?**<br>
This was such a long time ago, but we were trying to build some sort of pipeline to deploy testing. It was running inside a cluster, and I learned Helm charts and all that good stuff. And then, for the co-op after that, I worked at a Canadian startup in FinTech. It was 24/7 Kubernetes, [building their secret injection system, using ArgoCD to automatically pull secrets from 1Password](https://medium.com/@nng.grace/automated-kubernetes-secret-injection-with-1password-secret-automation-and-hashicorp-vault-8db826c50c1d). 

**How did that lead you on to involvement with the release team?**<br>
It was over the pandemic, so I didn't have a lot to do, I went to the conference, saw so many cool talks. One that really stuck out to me was [a Kubernetes hacking talk by Tabitha Sable and V Korbes](https://www.youtube.com/watch?v=-4W3ChRVeLI). I thought it was the most amazing thing and it was so cool. One of my friends was on the release team at the time, and she showed me what she does. I applied and thankfully got in. I didn't have any open source experience. It was fully like one of those things where someone took a chance on me. 

**How would you characterize the experience that you've had to date? You have had involvement with pretty much every release since then.**<br>
Yeah, I think it was a really formative experience, and the community has been such a big part of it.

**You started as an enhancement shadow with Kubernetes 1.22, eventually moving up to enhancements lead, then you moved on to be the release lead shadow. Obviously, you are the lead for 1.28, but for 1.27 you did something a bit different. What was that, and why did you do it?**<br>
For 1.25 and 1.26, I was release lead shadow, so I had an understanding of what that role was like. I wanted to shadow another team, and at that time I thought CI Signal was a big black box to me. I joined the team, but I also had capacity for other things, I joined as a branch manager associate as well. 

**What is the difference between that role and the traditional release team roles we think about?**<br>
Yeah, that's a great question. So the branch management role is a more constant role. They don't necessarily get swapped out every release. You shadow as an associate, so you do things like cut releases, distribute them, update distros, things like that. It's a really important role, and the folks that are in there are more technical. So if you have been on the release team for a long time and are looking for more permanent role, I recommend looking into that. 

**Congratulations again on [the release of 1.28 today](/blog/2023/08/15/kubernetes-v1-28-release/).**<br>
Yeah, thank you.

**What is the best new feature in Kubernetes 1.28, and why is it [sidecar container support](/blog/2023/08/25/native-sidecar-containers/)?**<br>
Great question. I am as excited as you. In 1.28, we have a new feature in alpha, which is sidecar container support. We introduced a new field called restartPolicy for init containers, that allows the containers to live throughout the life cycle of the pod and not block the pod from terminating. Craig, you know a lot about this, but there are so many use cases for this. It is a very common pattern. You use it for logging, monitoring, metrics; also configs and secrets as well.

**And the service mesh!**<br>
And the service mesh.

**Very popular. I will say that the Sidecar pattern was called out very early on, in [a blog post Brendan Burns wrote](/blog/2015/06/the-distributed-system-toolkit-patterns/), talking about how you can achieve some of the things you just mentioned. Support for it in Kubernetes has been— it's been a while, shall we say. I've been doing these interviews since 2018, and September 2019 was when [I first had a conversation with a release manager](/blog/2019/12/06/when-youre-in-the-release-team-youre-family-the-kubernetes-1.16-release-interview/) who felt they had to apologize for Sidecar containers not shipping in that release.**<br>
Well, here we are!

**Thank you for not letting the side down.**<br>
[LAUGHS]

**There are a bunch of other features that are going to GA in 1.28. Tell me about what's new with [kubectl events](https://github.com/kubernetes/enhancements/issues/1440)?**<br>
It got a new CLI and now it is separate from kubectl get. I think that changes in the CLI are always a little bit more apparent because they are user-facing. 

**Are there a lot of other user-facing changes, or are most of the things in the release very much behind the scenes?**<br>
I would say it's a good mix of both; it depends on what you're interested in. 

**I am interested, of course, in [non-graceful node shutdown support](https://github.com/kubernetes/enhancements/issues/2268). What can you tell us about that?**<br>
Right, so for situations where you have a hardware failure or a broken OS, we have added additional support for a better graceful shutdown.

**If someone trips over the power cord at your LAN party and your cluster goes offline as a result?**<br>
Right, exactly. More availability! That's always good. 

**And if it's not someone tripping over your power cord, it's probably DNS that broke your cluster. What's changed in terms of DNS configuration?**<br>
Oh, we introduced [a new feature gate to allow more DNS search path](https://github.com/kubernetes/enhancements/issues/2595).

**Is that all there is to it?**<br>
That's pretty much it. [LAUGHING] Yeah, you can have more and longer DNS search path.

**It can never be long enough. Just search everything! If .com doesn't work, try .net and try .io after that.**<br>
Surely.

**Those are a few of the big features that are moving to stable. Obviously, over the course of the last few releases, features come in, moving from Alpha to Beta and so on. New features coming in today might not be available to people for a while. As you mentioned, there are feature gates that you can enable to allow people to have access to these. What are some of the newest features that have been introduced that are in Alpha, that are particularly interesting to you personally?**<br>
I have two. The first one is [`kubectl delete --interactive`](https://github.com/kubernetes/enhancements/issues/3895). I'm always nervous when I delete something, you know, it's going to be a typo or it's going to be on the wrong tab. So we have an `--interactive` flag for that now.

**So you can get feedback on what you're about to delete before you do it?**<br>
Right; confirmation is good!

**You mentioned two there, what was the second one?**<br>
Right; this one is close to my heart. It is a SIG Release KEP, [publishing on community infrastructure](https://github.com/kubernetes/enhancements/issues/1731). I'm not sure if you know, but as part of my branch management associate role in 1.27, I had the opportunity to cut a few releases. It takes up to 12 hours sometimes. And now, we are hoping that the process only includes release managers, so we don't have to call up the folks at Google and, you know, lengthen that process anymore.

**Is 12 hours the expected length for software of this size, or is there work in place to try and bring that down?**<br>
There's so much work in place to bring that down. I think 12 hours is on the shorter end of it. Unfortunately, we have had a situation where we have to, you know, switch the release manager because it's just so late at night for them. 

**They've fallen asleep halfway through?**<br>
Exactly, yeah. 6 to 12 hours, I think, is our status quo. 

**The theme for this release is "[Planternetes](/blog/2023/08/15/kubernetes-v1-28-release/#release-theme-and-logo)". That's going to need some explanation, I feel.**<br>
Okay. I had full creative control over this. It is summer in the northern hemisphere, and I am a big house plant fanatic. It's always a little sad when I have to move cities for co-op and can't take my plants with me. 

**Is that a border control thing? They don't let you take them over the border?**<br>
It's not even that; they're just so clunky and fragile. It's usually not worth the effort. But I think our community is very much like a garden. We have very critical roles in the ecosystem and we all have to work together.

**Will you be posting seeds out to contributors and growing something together all around the world?**<br>
That would be so cool if we had merch, like a little card with seeds embedded in it. I don't think we have the budget for that though. [LAUGHS]

**You say that. There are people who are inspired in many different areas. I love talking to the release managers and hearing the things that they're interested in. You should think about taking some seeds off one of your plants, and just spreading them around the world. People can take pictures, and tag you in them on Instagram.**<br>
That's cool. You know how we have a SIG Beard? We can have a SIG Plant.

**You worked for a long time with the release lead for 1.27. Xander Grzywinski. One of the benefits of having [done my interview with him in writing](https://craigbox.substack.com/p/kubernetes-and-chill) and not as a podcast is I didn't have to try and butcher pronouncing his surname. Can you help me out here?**<br>
I unfortunately cannot. I don't want to butcher it either!

**Anyway, Xander told me that he suspected that in this release you would have to deal with some very last-minute PRs, as is tradition. Was that the case?**<br>
I vividly remember the last minute PRs from last release because I was trying to cut the releases, as part of the branch management team. Thankfully, that was not the case this release. We have had other challenges, of course. 

**Can you tell me some of those challenges?**<br>
I think improvement on documentation is always a big part. The KEP process can be very daunting to new contributors. How do you get people to review your KEPs? How do you opt in? All that stuff. We're improving documentations for that. 

**As someone who has been through a lot of releases, I've been feeling, like you've said, that the last minute nature has slowed down a little. The process is perhaps improving. Do you see that, or do you think there's still a long way to go for the leads to improve it?**<br>
I think we've come very far. When I started in 1.22, we were using spreadsheets to track a hundred enhancements. It was a monster; I was terrified to touch it. Now, we're on GitHub boards. As a result of that, we are actually merging the bug triage and CI Signal team in 1.29. 

**What's the impact of that?**<br>
The bug triage team is now using the GitHub board to track issues, which is much more efficient. We are able to merge the two teams together.

**I have heard a rumor that GitHub boards are powered by spreadsheets underneath.**<br>
Honestly, even if that's true, the fact that it's on the same platform and it has better version control is just magical. 

**At this time, the next release lead has not yet been announced, but tradition dictates that you write down your feelings, best wishes and instructions to them in an envelope, which you'll leave in their desk drawer. What are you going to put inside that envelope?**<br>
Our 1.28 release lead is fantastic and they're so capable of handling the release—

**That's you, isn't it?**<br>
1.29? [LAUGHS] No, I'm too tired. I need to catch up on my sleep. My advice for them? It's going to be okay. It's all going to be okay. I was going to echo Leo's and Cici's words, to overcommunicate, but I think that has been said enough times already. 

**You've communicated enough. Stop! No more communication!**<br>
Yeah, no more communication. [LAUGHS] It's going to be okay. And honestly, shout out to my emeritus advisor, Leo, for reminding me that. Sometimes there are a lot of fires and it can be overwhelming, but it will be okay. 

**As we've alluded to a little bit throughout our conversation, there are a lot of people in the Kubernetes community who, for want of a better term, have had "a lot of experience" at running these systems. Then there are, of course, a lot of people who are just at the beginning of their careers; like yourself, at university. How do you see the difference between how those groups interact? Is there one team throughout, or what do you think that each can learn from the other?**<br>
I think the diversity of the team is one of its strengths and I really enjoy it. I learn so much from folks who have been doing this for 20 years or folks who are new to the industry like I am. 

**I know the CNCF goes to a lot of effort to enable new people to take part. Is there anything that you can say about how people might get involved?**<br>
Firstly, I think SIG Release has started a wonderful tradition, or system, of [helping new folks join the release team as a shadow](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md), and helping them grow into bigger positions, like leads. I think other SIGs are also following that template as well. But a big part of me joining and sticking with the community has been the ability to go to conferences. As I said, my first conference was KubeCon, when I was not involved in the community at all. And so a big shout-out to the CNCF and the companies that sponsor the Dan Kohn and the speaker scholarships. They have been the sole reason that I was able to attend KubeCon, meet people, and feel the power of the community. 

**Last year's KubeCon in North America was in Detroit?**<br>
Detroit, [I was there, yeah](https://medium.com/@nng.grace/kubecon-in-the-motor-city-4e23e0446751).

**That's quite a long drive?**<br>
I was in SF, so I flew over.

**You live right next door! If only you'd been in Waterloo.**<br>
Yeah, but who knows? Maybe I'll do a road trip from Waterloo to Chicago this year. 

---

_[Grace Nguyen](https://twitter.com/GraceNNG) is a student at the University of Waterloo, and was the release team lead for Kubernetes 1.28. Subscribe to [Let's Get To The News](https://craigbox.substack.com/about#§follow-the-podcast), or search for it wherever you get your podcasts._