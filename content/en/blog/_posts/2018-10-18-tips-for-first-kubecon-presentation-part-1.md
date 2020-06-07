---
layout: blog
title: 'Tips for Your First Kubecon Presentation - Part 1'
date: 2018-10-18
---

**Author**: Michael Gasch (VMware)

First of all, let me congratulate you to this outstanding achievement. Speaking at KubeCon, especially if it's your first time, is a tremendous honor and experience. Well done!

<center><blockquote class="twitter-tweet"><p lang="en" dir="ltr">Congrats to everyone who got Kubecon talks accepted! 👏👏👏<br><br>To everyone who got a rejection don&#39;t feel bad. Only 13% could be accepted. Keep trying. There will be other opportunities.</p>&mdash; Justin Garrison (@rothgar) <a href="https://twitter.com/rothgar/status/1044345018490662912?ref_src=twsrc%5Etfw">September 24, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

When I was informed that my [KubeCon talk about Kubernetes Resource Management](https://www.youtube.com/watch?v=8-apJyr2gi0) was accepted for KubeCon EU in Denmark (2018), I really could not believe it. By then, the chances to get your talk accepted were around 10% (or less, don't really remember the exact number). There were over a 1,000 submissions just for that KubeCon (recall that we now have **three KubeCon events during the year** - US, EU and Asia region). The popularity of Kubernetes is ever increasing and so is the number of people trying to get a talk accepted. Once again, **outstanding achievement to get your talk in**!

But now comes the tough part - research, write, practice, repeat, go on stage, perform :) Let me tell you that I went through several sleepless nights preparing for my first KubeCon talk. The day of the presentation, until I got on stage, was a mixture of every emotion I could have possibly gone through. Even though I had presented uncountable times before, including large industry conferences, KubeCon was very different. Different because it was the first time everything was recorded (including the presenter on stage) and I did not really know the audience, or more precisely: I was assuming everyone in the room is a Kubernetes expert and that my presentation not only had to be entertaining but also technically deep and 100% accurate. It's not seldom that maintainers and SIG (Special Interest Group) leads are in the room as well. 

Another challenge for me was squeezing a topic, that can easily fill a full-day workshop, into a 35min presentation (including Q&A). Before KubeCon, I was used to giving breakouts which were typically 60 minutes long. This doesn't say anything about the quality of the presentation but I knew how many slides I can squeeze into 60 minutes, covering important details but not killing people with "Death by PowerPoint".

So I learned a lot going through this endless cycle of preparation, practicing, these doubts of failing and time pressure finishing your deck, and of course giving the talk. When I left Copenhagen, I took some notes based on my speaker experience during the flight, which my friend [Bjoern](https://twitter.com/bbrundert) encouraged me to share. Not all of them might apply to you, but I still hope some of them are useful for your first KubeCon talk.

## Submitting a Good Talk

Some of you might read these lines even though you did not submit a talk or it wasn't accepted. I found these resources (not specifically targeted at KubeCon) for writing a good proposal very useful:

- [How to write with Style](http://www.novelr.com/2008/08/16/vonnegut-how-to-write-with-style)
- [Talk Framework](https://docs.google.com/document/d/16llwMgq38wIt19Oj-TrunrPsfczrCNgvIqioslcdb6Q/edit) by the incredible [goinggodotnet](https://twitter.com/goinggodotnet)
- [Lachie’s 7 step guide to writing a winning tech conference CFP](https://medium.com/@LachlanEvenson/lachies-7-step-guide-to-writing-a-winning-tech-conference-cfp-4fa36a0d2672)

Believe it or not, mine went through several reviews by Justin Garrison, Liz Rice, Bill Kennedy, Emad Benjamin and Kelsey Hightower (yes, THE Kelsey Hightower)! Some of them didn't know me before, they just live by our community values to grow newcomers and thus drive this great community forward every day. 

I think, without their feedback my proposal wouldn't have been on point to be selected. Their feedback was often direct and required me to completely change the first revisions. But they were right and their feedback was useful to stay within the character limit while still standing out with the proposal. 

Feel free to reach out for professional and/or experienced speakers. They know this stuff. And I was surprised by the support and help offered. Many had their DMs in Twitter open, so ask for help and you will be helped :) Besides Twitter, related forums to ask for assistance might be [Discuss](https://discuss.kubernetes.io/) and [Reddit](https://www.reddit.com/r/kubernetes/).

## Preparing for your Presentation

**Tip #1 - Appreciate that you were selected** and don't be upset about the slot your presentation was scheduled in. For example, my talk was put as second last presentation of final KubeCon day (Friday). I was like, who's going to stay there and not catch his/her flight or hang out and relax after this crazy week? The session stats, where speakers can see who signed up, were slowly increasing until the week of KubeCon. I think at the beginning of the week it showed ~80 people interested in my session (there is no mandatory sign-up). I was so happy, especially since there were some interesting talks running at the same time as my presentation.

Without spoiling (see below), the KubeCon community and attendees fully leverage the time and effort they've put into traveling to KubeCon. Rest assured that even if you have the last presentation at KubeCon, people will show up!

**Tip #2 - Study the Masters on [Youtube](https://www.youtube.com/channel/UCvqbFHwN-nwalWPjPUKpvTA/playlists)**. Get some inspirations from great speakers (some of them already mentioned above) and top rated sessions of previous KubeCons. Observe how they present and interact with the audience, while still keeping the tough timing throughout the presentation.

**Tip #3 - Find reviewers**. Having experienced or professional speakers review your slides is super critical. Not only to check for language/translation (see below) but also to improve the flow of your presentation and get feedback on whether the content is logically structured and not too dense (too many slides, timing). They will help you to leave out less important information while also making the presentation fit for your audience (not everyone has the level of knowledge as you in your specific area).

**Tip #4 - Language barriers**. Nobody is perfect and the community encourages diversity. This makes us all better and is what I probably like the most about the Kubernetes community. However, make sure that the audience understands the message of your talk. For non-native speakers, it can be really hard to present in English (e.g. at the US/EU conferences), especially if you're not used to it. Add to that the tension during the talk and it can become really hard for the audience to follow. 

I am not saying that everyone has to present in perfect business English. Nobody expects that, let me be very clear. But if you feel that this could be an issue for you, reach out for help. Reviewers can help fix grammar and wording in your slide deck. Practicing and recording yourself (see below) are helpful to reflect yourself. The slides should reflect your message so people can read along if they lost you. Simple, less busy slides are definitely recommended. Make sure to add speaker notes to your presentation. Not only does this help with getting better every time you run through your presentation (memory effect and the flow). It also serves as a safety net when you think language will definitely be an issue, or when you're suddenly completely lost during the presentation on stage. 

**Tip #5 - Study the Speaker Guidelines**. Nothing to add here, take them seriously and reach out to the (fantastic) speaker support if you have questions. Also submit your presentation in time (plan ahead accordingly) to not risk any trouble with the committee.

**Tip #6 - Practice like never before**. Practicing is probably the most important tip I can give you. I don't know how many times I practiced my talk, e.g. at home but also at some local Meetups to get some early feedback. First I was shocked with timing. Even though I had my deck down to 40min in my dry runs at home, at the Meetup I completely run out of time (50min). I was shocked, as I didn't know what to leave out. 

The feedback from these sessions helped me to trim down content as it helped me to understand what to leave out/shorten. Keep in mind to also leave room for questions as a best practice (requirement?) by the speaker guidelines.

**Tip #7 - The Demo Gods are not always with you**. Demos can and will go wrong. Not just because of the typical suspect like slow WiFi, etc. I heard horror stories about expired certificates, daylight saving times (for those traveling through time zones on their way to KubeCon) affecting deployments, the content of a variable in your BASH script changing (e.g. when curling stuff from the web), keyboards breaking (Mac lovers, can you believe that?), hard disks crashing (even the backup disk not working), and so on. 

Never ever rely on the demo gods, especially when you're not Kelsey Hightower :) Take [video recordings](https://asciinema.org/) of your demos so you not only have a backup when the live demo breaks. But also in case you're afraid of running out of time. In order to avoid the primary and backup disks crashing (yes, it happened at that KubeCon I was told), store a copy at your trusted cloud provider.

**Tip #8 - The right Tools for the job**. Sometimes you want to highlight something on your slide. This has two potentially issues. First, you have to constantly turn away from the audience which does not necessarily look good (if you can avoid it). Second, it might not always work depending on the (laser) pointer and room equipment (light, background). 

[This presenter](https://www.logitech.com/en-us/product/spotlight-presentation-remote) from Logitech has really served me well. It has several useful features, the "Spotlight" (that's why the name) being my favorite feature. You'll never want to go back.

**Tip #9 - Being recorded**. I am not sure if you can opt-out from being recorded (please check with speaker support on the latest guidelines here) if you don't want to appear on Youtube for the rest of your life. But audio definitely will be recorded so chose your words (jokes) wisely. Again, practicing and reviewing helps. If you're ok with being recorded, at least think about which shirt (logos and "art") you want to be remembered by the internet ;)

**Tip #10 - Social media**. Social media is great for promoting your session and you should definitely send out reminders on various channels for your presentation. Something that is missing almost every time in the presentation templates (if you want to use them) is placeholders for your social media account and, more importantly, for your session ID. Even if the conference does not use session IDs externally (in the schedule builder), you might still want to add a handle to every slide so people can refer to your presentation (or particular slide) on social media with a hashtag that you then can search for feedback, questions, etc.

**Tip #11 - Be yourself**. Be authentic and don't try to sound super smart or funny (unless you are ;)). Seriously. Just be yourself and people will love you. Authenticity is key for a great presentation and the audience will smell when you try to fool them. It also makes practicing and the live performance easier as you don't have to pay attention on acting like somebody else. 

From a content perspective make sure that **you** own and develop the content and you did not copy and paste like crazy from the Kubernetes docs or other presentations. It's absolutely ok to reference other sources, but please give them credit. Again, the audience will smell if you make things up. You should know what you're speaking about (not saying that you have to be an expert, but experience is what makes your talk unique). The final proof is during Q&A and KubeCon is a sharp audience ;)

**Tip #12 - Changes to the proposal**. The committee, based on your proposal description and details, might change the audience level. For example, I put my talk in as intermediate, but it was changed to all skill levels. This is not bad per se. Just watch out for changes and adapt your presentation accordingly or reach out to speaker support. If you were not expecting beginners or architects in your talk (because you had chosen another skill level and target group), you might lose parts of your audience. This could also negatively affect your session feedback/scores. 

## Wrapping up

I hope some of these tips are already useful and will help you getting started to work on your presentation. In the next post we are going to cover speaker tips when you are finally at the KubeCon event.
