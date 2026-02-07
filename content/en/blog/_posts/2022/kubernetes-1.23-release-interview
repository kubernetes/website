---
layout: blog
title: "Frontiers, fsGroups and frogs: the Kubernetes 1.23 release interview"
date: 2022-04-29
author: >
   Craig Box (Google)
---

One of the highlights of hosting the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/) is talking to the release managers for each new Kubernetes version. The release team is constantly refreshing. Many working their way from small documentation fixes, step up to shadow roles, and then eventually lead a release.

As we prepare for the 1.24 release next week, [in accordance with long-standing tradition](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog), I'm pleased to bring you a look back at the story of 1.23. The release was led by [Rey Lejano](https://twitter.com/reylejano), a Field Engineer at SUSE. [I spoke to Rey](https://kubernetespodcast.com/episode/167-kubernetes-1.23/) in December, as he was awaiting the birth of his first child.

Make sure you [subscribe, wherever you get your podcasts](https://kubernetespodcast.com/subscribe/), so you hear all our stories from the Cloud Native community, including the story of 1.24 next week.

*This transcript has been lightly edited and condensed for clarity.*

---

**CRAIG BOX: I'd like to start with what is, of course, on top of everyone's mind at the moment. Let's talk African clawed frogs!**

REY LEJANO: [CHUCKLES] Oh, you mean [Xenopus lavis](https://en.wikipedia.org/wiki/African_clawed_frog), the scientific name for the African clawed frog?

**CRAIG BOX: Of course.**

REY LEJANO: Not many people know, but my background and my degree is actually in microbiology, from the University of California Davis. I did some research for about four years in biochemistry, in a biochemistry lab, and I [do have a research paper published](https://www.sciencedirect.com/science/article/pii/). It's actually on glycoproteins, particularly something called "cortical granule lectin". We used frogs, because they generate lots and lots of eggs, from which we can extract the protein. That protein prevents polyspermy. When the sperm goes into the egg, the egg releases a glycoprotein, cortical granule lectin, to the membrane, and prevents any other sperm from going inside the egg.

**CRAIG BOX: Were you able to take anything from the testing that we did on frogs and generalize that to higher-order mammals, perhaps?**

REY LEJANO: Yes. Since mammals also have cortical granule lectin, we were able to analyze both the convergence and the evolutionary pattern, not just from multiple species of frogs, but also into mammals as well.

**CRAIG BOX: Now, there's a couple of different threads to unravel here. When you were young, what led you into the fields of biology, and perhaps more the technical side of it?**

REY LEJANO: I think it was mostly from family, since I do have a family history in the medical field that goes back generations. So I kind of felt like that was the natural path going into college.

**CRAIG BOX: Now, of course, you're working in a more abstract tech field. What led you out of microbiology?**

REY LEJANO: [CHUCKLES] Well, I've always been interested in tech. Taught myself a little programming when I was younger, before high school, did some web dev stuff. Just kind of got burnt out being in a lab. I was literally in the basement. I had a great opportunity to join a consultancy that specialized in [ITIL](https://www.axelos.com/certifications/itil-service-management/what-is-itil). I actually started off with application performance management, went into monitoring, went into operation management and also ITIL, which is aligning your IT asset management and service managements with business services. Did that for a good number of years, actually.

**CRAIG BOX: It's very interesting, as people describe the things that they went through and perhaps the technologies that they worked on, you can pretty much pinpoint how old they might be. There's a lot of people who come into tech these days that have never heard of ITIL. They have no idea what it is. It's basically just SRE with more process.**

REY LEJANO: Yes, absolutely. It's not very cloud native. [CHUCKLES]

**CRAIG BOX: Not at all.**

REY LEJANO: You don't really hear about it in the cloud native landscape. Definitely, you can tell someone's been in the field for a little bit, if they specialize or have worked with ITIL before.

**CRAIG BOX: You mentioned that you wanted to get out of the basement. That is quite often where people put the programmers. Did they just give you a bit of light in the new basement?**

REY LEJANO: [LAUGHS] They did give us much better lighting. Able to get some vitamin D sometimes, as well.

**CRAIG BOX: To wrap up the discussion about your previous career — over the course of the last year, with all of the things that have happened in the world, I could imagine that microbiology skills may be more in demand than perhaps they were when you studied them?**

REY LEJANO: Oh, absolutely. I could definitely see a big increase of numbers of people going into the field. Also, reading what's going on with the world currently kind of brings back all the education I've learned in the past, as well.

**CRAIG BOX: Do you keep in touch with people you went through school with?**

REY LEJANO: Just some close friends, but not in the microbiology field.

**CRAIG BOX: One thing that I think will probably happen as a result of the pandemic is a renewed interest in some of these STEM fields. It will be interesting to see what impact that has on society at large.**

REY LEJANO: Yeah. I think that'll be great.

**CRAIG BOX: You mentioned working at a consultancy doing IT management, application performance monitoring, and so on. When did Kubernetes come into your professional life?**

REY LEJANO: One of my good friends at the company I worked at, left in mid-2015. He went on to a company that was pretty heavily into Docker. He taught me a little bit. I did my first "docker run" around 2015, maybe 2016. Then, one of the applications we were using for the ITIL framework was containerized around 2018 or so, also in Kubernetes. At that time, it was pretty buggy. That was my initial introduction to Kubernetes and containerised applications.

Then I left that company, and I actually joined my friend over at [RX-M](https://rx-m.com/), which is a cloud native consultancy and training firm. They specialize in Docker and Kubernetes. I was able to get my feet wet. I got my CKD, got my CKA as well. And they were really, really great at encouraging us to learn more about Kubernetes and also to be involved in the community.

**CRAIG BOX: You will have seen, then, the life cycle of people adopting Kubernetes and containerization at large, through your own initial journey and then through helping customers. How would you characterize how that journey has changed from the early days to perhaps today?**

REY LEJANO: I think the early days, there was a lot of questions of, why do I have to containerize? Why can't I just stay with virtual machines?

**CRAIG BOX: It's a line item on your CV.**

REY LEJANO: [CHUCKLES] It is. And nowadays, I think people know the value of using containers, of orchestrating containers with Kubernetes. I don't want to say "jumping on the bandwagon", but it's become the de-facto standard to orchestrate containers.

**CRAIG BOX: It's not something that a consultancy needs to go out and pitch to customers that they should be doing. They're just taking it as, that will happen, and starting a bit further down the path, perhaps.**

REY LEJANO: Absolutely.

**CRAIG BOX: Working at a consultancy like that, how much time do you get to work on improving process, perhaps for multiple customers, and then looking at how you can upstream that work, versus paid work that you do for just an individual customer at a time?**

REY LEJANO: Back then, it would vary. They helped me introduce myself, and I learned a lot about the cloud native landscape and Kubernetes itself. They helped educate me as to how the cloud native landscape, and the tools around it, can be used together. My boss at that company, Randy, he actually encouraged us to start contributing upstream, and encouraged me to join the release team. He just said, this is a great opportunity. Definitely helped me with starting with the contributions early on.

**CRAIG BOX: Was the release team the way that you got involved with upstream Kubernetes contribution?**

REY LEJANO: Actually, no. My first contribution was  with SIG Docs. I met Taylor Dolezal — he was the release team lead for 1.19, but he is involved with SIG Docs as well. I met him at KubeCon 2019, I sat at his table during a luncheon. I remember Paris Pittman was hosting this luncheon at the Marriott. Taylor says he was involved with SIG Docs. He encouraged me to join. I started joining into meetings, started doing a few drive-by PRs. That's what we call them — drive-by — little typo fixes. Then did a little bit more, started to send better or higher quality pull requests, and also reviewing PRs.

**CRAIG BOX: When did you first formally take your release team role?**

REY LEJANO: That was in [1.18](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md), in December. My boss at the time encouraged me to apply. I did, was lucky enough to get accepted for the release notes shadow. Then from there, stayed in with release notes for a few cycles, then went into Docs, naturally then led Docs, then went to Enhancements, and now I'm the release lead for 1.23.

**CRAIG BOX: I don't know that a lot of people think about what goes into a good release note. What would you say does?**

REY LEJANO: [CHUCKLES] You have to tell the end user what has changed or what effect that they might see in the release notes. It doesn't have to be highly technical. It could just be a few lines, and just saying what has changed, what they have to do if they have to do anything as well.

**CRAIG BOX: As you moved through the process of shadowing, how did you learn from the people who were leading those roles?**

REY LEJANO: I said this a few times when I was the release lead for this cycle. You get out of the release team as much as you put in, or it directly aligns to how much you put in. I learned a lot. I went into the release team having that mindset of learning from the role leads, learning from the other shadows, as well. That's actually a saying that my first role lead told me. I still carry it to heart, and that was back in 1.18. That was Eddie, in the very first meeting we had, and I still carry it to heart.

**CRAIG BOX: You, of course, were [the release lead for 1.23](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.23). First of all, congratulations on the release.**

REY LEJANO: Thank you very much.

**CRAIG BOX: The theme for this release is [The Next Frontier](https://kubernetes.io/blog/2021/12/07/kubernetes-1-23-release-announcement/). Tell me the story of how we came to the theme and then the logo.**

REY LEJANO: The Next Frontier represents a few things. It not only represents the next enhancements in this release, but Kubernetes itself also has a history of Star Trek references. The original codename for Kubernetes was Project Seven, a reference to Seven of Nine, originally from Star Trek Voyager. Also the seven spokes in the helm in the logo of Kubernetes as well. And, of course, Borg, the predecessor to Kubernetes.

The Next Frontier continues that Star Trek reference. It's a fusion of two titles in the Star Trek universe. One is [Star Trek V, the Final Frontier](https://en.wikipedia.org/wiki/Star_Trek_V:_The_Final_Frontier), and the Star Trek: The Next Generation.

**CRAIG BOX: Do you have any opinion on the fact that Star Trek V was an odd-numbered movie, and they are [canonically referred to as being lesser than the even-numbered ones](https://screenrant.com/star-trek-movies-odd-number-curse-explained/)?**

REY LEJANO: I can't say, because I am such a sci-fi nerd that I love all of them even though they're bad. Even the post-Next Generation movies, after the series, I still liked all of them, even though I know some weren't that great.

**CRAIG BOX: Am I right in remembering that Star Trek V was the one directed by William Shatner?**

REY LEJANO: Yes, that is correct.

**CRAIG BOX: I think that says it all.**

REY LEJANO: [CHUCKLES] Yes.

**CRAIG BOX: Now, I understand that the theme comes from a part of the [SIG Release charter](https://github.com/kubernetes/community/blob/master/sig-release/charter.md)?**

REY LEJANO: Yes. There's a line in the SIG Release charter, "ensure there is a consistent group of community members in place to support the release process across time." With the release team, we have new shadows that join every single release cycle. With this, we're growing with this community. We're growing the release team members. We're growing SIG Release. We're growing the Kubernetes community itself. For a lot of people, this is their first time contributing to open source, so that's why I say it's their new open source frontier.

**CRAIG BOX: And the logo is obviously very Star Trek-inspired. It sort of surprised me that it took that long for someone to go this route.**

REY LEJANO: I was very surprised as well. I had to relearn Adobe Illustrator to create the logo.

**CRAIG BOX: This your own work, is it?**

REY LEJANO: This is my own work.

**CRAIG BOX: It's very nice.**

REY LEJANO: Thank you very much. Funny, the galaxy actually took me the longest time versus the ship. Took me a few days to get that correct. I'm always fine-tuning it, so there might be a final change when this is actually released.

**CRAIG BOX: No frontier is ever truly final.**

REY LEJANO: True, very true.

**CRAIG BOX: Moving now from the theme of the release to the substance, perhaps, what is new in 1.23?**

REY LEJANO: We have 47 enhancements. I'm going to run through most of the stable ones, if not all of them, some of the key Beta ones, and a few of the Alpha enhancements for 1.23.

One of the key enhancements is [dual-stack IPv4/IPv6](https://github.com/kubernetes/enhancements/issues/563), which went GA in 1.23.

Some background info: dual-stack was introduced as Alpha in 1.15. You probably saw a keynote at KubeCon 2019. Back then, the way dual-stack worked was that you needed two services — you needed a service per IP family. You would need a service for IPv4 and a service for IPv6. It was refactored in 1.20. In 1.21, it was in Beta; clusters were enabled to be dual-stack by default.

And then in 1.23 we did remove the IPv6 dual-stack feature flag. It's not mandatory to use dual-stack. It's actually not "default" still. The pods, the services still default to single-stack. There are some requirements to be able to use dual-stack. The nodes have to be routable on IPv4 and IPv6 network interfaces. You need a CNI plugin that supports dual-stack. The pods themselves have to be configured to be dual-stack. And the services need the ipFamilyPolicy field to specify prefer dual-stack, or require dual-stack.

**CRAIG BOX: This sounds like there's an implication in this that v4 is still required. Do you see a world where we can actually move to v6-only clusters?**

REY LEJANO: I think we'll be talking about IPv4 and IPv6 for many, many years to come. I remember a long time ago, they kept saying "it's going to be all IPv6", and that was decades ago.

**CRAIG BOX: I think I may have mentioned on the show before, but there was [a meeting in London that Vint Cerf attended](https://www.youtube.com/watch?v=AEaJtZVimqs), and he gave a public presentation at the time to say, now is the time of v6. And that was 10 years ago at least. It's still not the time of v6, and my desktop still doesn't have Linux on it. One day.**

REY LEJANO: [LAUGHS] In my opinion, that's one of the big key features that went stable for 1.23.

One of the other highlights of 1.23 is [pod security admission going to Beta](/blog/2021/12/09/pod-security-admission-beta/). I know this feature is going to Beta, but I highlight this because as some people might know, PodSecurityPolicy, which was deprecated in 1.21, is targeted to be removed in 1.25. Pod security admission replaces pod security policy. It's an admission controller. It evaluates the pods against a predefined set of pod security standards to either admit or deny the pod for running.

There's three levels of pod security standards. Privileged, that's totally open. Baseline, known privileges escalations are minimized. Or Restricted, which is hardened. And you could set pod security standards either to run in three modes, which is enforce: reject any pods that are in violation; to audit: pods are allowed to be created, but the violations are recorded; or warn: it will send a warning message to the user, and the pod is allowed.

**CRAIG BOX: You mentioned there that PodSecurityPolicy is due to be deprecated in two releases' time. Are we lining up these features so that pod security admission will be GA at that time?**

REY LEJANO: Yes. Absolutely. I'll talk about that for another feature in a little bit as well. There's also another feature that went to GA. It was an API that went to GA, and therefore the Beta API is now deprecated. I'll talk about that a little bit.

**CRAIG BOX: All right. Let's talk about what's next on the list.**

REY LEJANO: Let's move on to more stable enhancements. One is the [TTL controller](https://github.com/kubernetes/enhancements/issues/592). This cleans up jobs and pods after the jobs are finished. There is a TTL timer that starts when the job or pod is finished. This TTL controller watches all the jobs, and ttlSecondsAfterFinished needs to be set. The controller will see if the ttlSecondsAfterFinished, combined with the last transition time, if it's greater than now. If it is, then it will delete the job and the pods of that job.

**CRAIG BOX: Loosely, it could be called a garbage collector?**

REY LEJANO: Yes. Garbage collector for pods and jobs, or jobs and pods.

**CRAIG BOX: If Kubernetes is truly becoming a programming language, it of course has to have a garbage collector implemented.**

REY LEJANO: Yeah. There's another one, too, coming in Alpha. [CHUCKLES]

**CRAIG BOX: Tell me about that.**

REY LEJANO: That one is coming in in Alpha. It's actually one of my favorite features, because there's only a few that I'm going to highlight today. [PVCs for StafeulSet will be cleaned up](https://github.com/kubernetes/enhancements/issues/1847). It will auto-delete PVCs created by StatefulSets, when you delete that StatefulSet.

**CRAIG BOX: What's next on our tour of stable features?**

REY LEJANO: Next one is, [skip volume ownership change goes to stable](https://github.com/kubernetes/enhancements/issues/695). This is from SIG Storage. There are times when you're running a stateful application, like many databases, they're sensitive to permission bits changing underneath. Currently, when a volume is bind mounted inside the container, the permissions of that volume will change recursively. It might take a really long time.

Now, there's a field, the fsGroupChangePolicy, which allows you, as a user, to tell Kubernetes how you want the permission and ownership change for that volume to happen. You can set it to always, to always change permissions, or just on mismatch, to only do it when the permission ownership changes at the top level is different from what is expected.

**CRAIG BOX: It does feel like a lot of these enhancements came from a very particular use case where someone said, "hey, this didn't work for me and I've plumbed in a feature that works with exactly the thing I need to have".**

REY LEJANO: Absolutely. People create issues for these, then create Kubernetes enhancement proposals, and then get targeted for releases.

**CRAIG BOX: Another GA feature in this release — ephemeral volumes.**

REY LEJANO: We've always been able to use empty dir for ephemeral volumes, but now we could actually have [ephemeral inline volumes](https://github.com/kubernetes/enhancements/issues/1698), meaning that you could take your standard CSI driver and be able to use ephemeral volumes with it.

**CRAIG BOX: And, a long time coming, [CronJobs](https://github.com/kubernetes/enhancements/issues/19).**

REY LEJANO: CronJobs is a funny one, because it was stable before 1.23. For 1.23, it was still tracked,but it was just cleaning up some of the old controller. With CronJobs, there's a v2 controller. What was cleaned up in 1.23 is just the old v1 controller.

**CRAIG BOX: Were there any other duplications or major cleanups of note in this release?**

REY LEJANO: Yeah. There were a few you might see in the major themes. One's a little tricky, around FlexVolumes. This is one of the efforts from SIG Storage. They have an effort to migrate in-tree plugins to CSI drivers. This is a little tricky, because FlexVolumes were actually deprecated in November 2020. We're [formally announcing it in 1.23](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors).

**CRAIG BOX: FlexVolumes, in my mind, predate CSI as a concept. So it's about time to get rid of them.**

REY LEJANO: Yes, it is. There's another deprecation, just some [klog specific flags](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#klog), but other than that, there are no other big deprecations in 1.23.

**CRAIG BOX: The buzzword of the last KubeCon, and in some ways the theme of the last 12 months, has been secure software supply chain. What work is Kubernetes doing to improve in this area?**

REY LEJANO: For 1.23, Kubernetes is now SLSA compliant at Level 1, which means that provenance attestation files that describe the staging and release phases of the release process are satisfactory for the SLSA framework.

**CRAIG BOX: What needs to happen to step up to further levels?**

REY LEJANO: Level 1 means a few things — that the build is scripted; that the provenance is available, meaning that the artifacts are verified and they're handed over from one phase to the next; and describes how the artifact is produced. Level 2 means that the source is version-controlled, which it is, provenance is authenticated, provenance is service-generated, and there is a build service. There are four levels of SLSA compliance.

**CRAIG BOX: It does seem like the levels were largely influenced by what it takes to build a big, secure project like this. It doesn't seem like it will take a lot of extra work to move up to verifiable provenance, for example. There's probably just a few lines of script required to meet many of those requirements.**

REY LEJANO: Absolutely. I feel like we're almost there; we'll see what will come out of 1.24. And I do want to give a big shout-out to SIG Release and Release Engineering, primarily to Adolfo García Veytia, who is aka Puerco on GitHub and on Slack. He's been driving this forward.

**CRAIG BOX: You've mentioned some APIs that are being graduated in time to replace their deprecated version. Tell me about the new HPA API.**

REY LEJANO: The [horizontal pod autoscaler v2 API](https://github.com/kubernetes/enhancements/issues/2702), is now stable, which means that the v2beta2 API is deprecated. Just for everyone's knowledge, the v1 API is not being deprecated. The difference is that v2 adds support for multiple and custom metrics to be used for HPA.

**CRAIG BOX: There's also now a facility to validate my CRDs with an expression language.**

REY LEJANO: Yeah. You can use the [Common Expression Language, or CEL](https://github.com/google/cel-spec), to validate your CRDs, so you no longer need to use webhooks. This also makes the CRDs more self-contained and declarative, because the rules are now kept within the CRD object definition.

**CRAIG BOX: What new features, perhaps coming in Alpha or Beta, have taken your interest?**

REY LEJANO: Aside from pod security policies, I really love [ephemeral containers](https://github.com/kubernetes/enhancements/issues/277) supporting kubectl debug. It launches an ephemeral container and a running pod, shares those pod namespaces, and you can do all your troubleshooting with just running kubectl debug.

**CRAIG BOX: There's also been some interesting changes in the way that events are handled with kubectl.**

REY LEJANO: Yeah. kubectl events has always had some issues, like how things weren't sorted. [kubectl events improved](https://github.com/kubernetes/enhancements/issues/1440) that so now you can do `--watch`, and it will also sort with the `--watch` option as well. That is something new. You can actually combine fields and custom columns. And also, you can list events in the timeline with doing the last N number of minutes. And you can also sort events using other criteria as well.

**CRAIG BOX: You are a field engineer at SUSE. Are there any things that are coming in that your individual customers that you deal with are looking out for?**

REY LEJANO: More of what I look out for to help the customers.

**CRAIG BOX: Right.**

REY LEJANO: I really love kubectl events. Really love the PVCs being cleaned up with StatefulSets. Most of it's for selfish reasons that it will improve troubleshooting efforts. [CHUCKLES]

**CRAIG BOX: I have always hoped that a release team lead would say to me, "yes, I have selfish reasons. And I finally got something I wanted in."**

REY LEJANO: [LAUGHS]

**CRAIG BOX: Perhaps I should run to be release team lead, just so I can finally get init containers fixed once and for all.**

REY LEJANO: Oh, init containers, I've been looking for that for a while. I've actually created animated GIFs on how init containers will be run with that Kubernetes enhancement proposal, but it's halted currently.

**CRAIG BOX: One day.**

REY LEJANO: One day. Maybe I shouldn't stay halted.

**CRAIG BOX: You mentioned there are obviously the things you look out for. Are there any things that are coming down the line, perhaps Alpha features or maybe even just proposals you've seen lately, that you're personally really looking forward to seeing which way they go?**

REY LEJANO: Yeah. Oone is a very interesting one, it affects the whole community, so it's not just for personal reasons. As you may have known, Dockershim is deprecated. And we did release a blog that it will be removed in 1.24.

**CRAIG BOX: Scared a bunch of people.**

REY LEJANO: Scared a bunch of people. From a survey, we saw that a lot of people are still using Docker and Dockershim. One of the enhancements for 1.23 is, [kubelet CRI goes to Beta](https://github.com/kubernetes/enhancements/issues/2040). This promotes the CRI API, which is required. This had to be in Beta for Dockershim to be removed in 1.24.

**CRAIG BOX: Now, in the last release team lead interview, [we spoke with Savitha Raghunathan](https://kubernetespodcast.com/episode/157-kubernetes-1.22/), and she talked about what she would advise you as her successor. It was to look out for the mental health of the team members. How were you able to take that advice on board?**

REY LEJANO: That was great advice from Savitha. A few things I've made note of with each release team meeting. After each release team meeting, I stop the recording, because we do record all the meetings and post them on YouTube. And I open up the floor to anyone who wants to say anything that's not recorded, that's not going to be on the agenda. Also, I tell people not to work on weekends. I broke this rule once, but other than that, I told people it could wait. Just be mindful of your mental health.

**CRAIG BOX: It's just been announced that [James Laverack from Jetstack](https://twitter.com/JamesLaverack/status/1466834312993644551) will be the release team lead for 1.24. James and I shared an interesting Mexican dinner at the last KubeCon in San Diego.**

REY LEJANO: Oh, nice. I didn't know you knew James.

**CRAIG BOX: The British tech scene. We're a very small world. What will your advice to James be?**

REY LEJANO: What I would tell James for 1.24 is use teachable moments in the release team meetings. When you're a shadow for the first time, it's very daunting. It's very difficult, because you don't know the repos. You don't know the release process. Everyone around you seems like they know the release process, and very familiar with what the release process is. But as a first-time shadow, you don't know all the vernacular for the community. I just advise to use teachable moments. Take a few minutes in the release team meetings to make it a little easier for new shadows to ramp up and to be familiar with the release process.

**CRAIG BOX: Has there been major evolution in the process in the time that you've been involved? Or do you think that it's effectively doing what it needs to do?**

REY LEJANO: It's always evolving. I remember my first time in release notes, 1.18, we said that our goal was to automate and program our way out so that we don't have a release notes team anymore. That's changed [CHUCKLES] quite a bit. Although there's been significant advancements in the release notes process by Adolfo and also James, they've created a subcommand in krel to generate release notes.

But nowadays, all their release notes are richer. Still not there at the automation process yet. Every release cycle, there is something a little bit different. For this release cycle, we had a production readiness review deadline. It was a soft deadline. A production readiness review is a review by several people in the community. It's actually been required since 1.21, and it ensures that the enhancements are observable, scalable, supportable, and it's safe to operate in production, and could also be disabled or rolled back. In 1.23, we had a deadline to have the production readiness review completed by a specific date.

**CRAIG BOX: How have you found the change of schedule to three releases per year rather than four?**

REY LEJANO: Moving to three releases a year from four, in my opinion, has been an improvement, because we support the last three releases, and now we can actually support the last releases in a calendar year instead of having 9 months out of 12 months of the year.

**CRAIG BOX: The next event on the calendar is a [Kubernetes contributor celebration](https://www.kubernetes.dev/events/kcc2021/) starting next Monday. What can we expect from that event?**

REY LEJANO: This is our second time running this virtual event. It's a virtual celebration to recognize the whole community and all of our accomplishments of the year, and also contributors. There's a number of events during this week of celebration. It starts the week of December 13.

There's events like the Kubernetes Contributor Awards, where SIGs honor and recognize the hard work of the community and contributors. There's also a DevOps party game as well. There is a cloud native bake-off. I do highly suggest people to go to [kubernetes.dev/celebration](https://www.kubernetes.dev/events/past-events/2021/kcc2021/) to learn more.

**CRAIG BOX: How exactly does one judge a virtual bake-off?**

REY LEJANO: That I don't know. [CHUCKLES]

**CRAIG BOX: I tasted my scones. I think they're the best. I rate them 10 out of 10.**

REY LEJANO: Yeah. That is very difficult to do virtually. I would have to say, probably what the dish is, how closely it is tied with Kubernetes or open source or to CNCF. There's a few judges. I know Josh Berkus and Rin Oliver are a few of the judges running the bake-off.

**CRAIG BOX: Yes. We spoke with Josh about his love of the kitchen, and so he seems like a perfect fit for that role.**

REY LEJANO: He is.

**CRAIG BOX: Finally, your wife and yourself are expecting your first child in January. Have you had a production readiness review for that?**

REY LEJANO: I think we failed that review. [CHUCKLES]

**CRAIG BOX: There's still time.**

REY LEJANO: We are working on refactoring. We're going to refactor a little bit in December, and `--apply` again.

---

_[Rey Lejano](https://twitter.com/reylejano) is a field engineer at SUSE, by way of Rancher Labs, and was the release team lead for Kubernetes 1.23. He is now also a co-chair for SIG Docs. His son Liam is now 3 and a half months old._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
