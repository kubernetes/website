---
title: " Happy Birthday Kubernetes. Oh, the places you’ll go! "
date: 2016-07-21
slug: oh-the-places-you-will-go
url: /blog/2016/07/Oh-The-Places-You-Will-Go
---
_Editor’s note, Today’s guest post is from an independent Kubernetes contributor, Justin Santa Barbara, sharing his reflection on growth of the project from inception to its future._  

**Dear K8s,**  

_It’s hard to believe you’re only one - you’ve grown up so fast. On the occasion of your first birthday, I thought I would write a little note about why I was so excited when you were born, why I feel fortunate to be part of the group that is raising you, and why I’m eager to watch you continue to grow up!_  

_--Justin_  

You started with an excellent foundation - good declarative functionality, built around a solid API with a well defined schema and the machinery so that we could evolve going forwards. And sure enough, over your first year you grew so fast: autoscaling, HTTP load-balancing support (Ingress), support for persistent workloads including clustered databases (PetSets). You’ve made friends with more clouds (welcome Azure & OpenStack to the family), and even started to span zones and clusters (Federation). And these are just some of the most visible changes - there’s so much happening inside that brain of yours!  

I think it’s wonderful you’ve remained so open in all that you do - you seem to write down everything on GitHub - for better or worse. I think we’ve all learned a lot about that on the way, like the perils of having engineers make scaling statements that are then weighed against claims made without quite the same framework of precision and rigor. But I’m proud that you chose not to lower your standards, but rose to the challenge and just ran faster instead - it might not be the most realistic approach, but it is the only way to move mountains!  

And yet, somehow, you’ve managed to avoid a lot of the common dead-ends that other open source software has fallen into, particularly as those projects got bigger and the developers end up working on it more than they use it directly. How did you do that? There’s a probably-apocryphal story of an employee at IBM that makes a huge mistake, and is summoned to meet with the big boss, expecting to be fired, only to be told “We just spent several million dollars training you. Why would we want to fire you?”. Despite all the investment google is pouring into you (along with Redhat and others), I sometimes wonder if the mistakes we are avoiding could be worth even more. There is a very open development process, yet there’s also an “oracle” that will sometimes course-correct by telling us what happens two years down the road if we make a particular design decision. This is a parent you should probably listen to!  

And so although you’re only a year old, you really have an [old soul](http://queue.acm.org/detail.cfm?id=2898444). I’m just one of the [many people raising you](https://kubernetes.io/blog/2016/07/happy-k8sbday-1), but it’s a wonderful learning experience for me to be able to work with the people that have built these incredible systems and have all this domain knowledge. Yet because we started from scratch (rather than taking the existing Borg code) we’re at the same level and can still have genuine discussions about how to raise you. Well, at least as close to the same level as we could ever be, but it’s to their credit that they are all far too nice ever to mention it!  

If I would pick just two of the wise decisions those brilliant people made:  


- Labels & selectors give us declarative “pointers”, so we can say “why” we want things, rather than listing the things directly. It’s the secret to how you can scale to [great heights](https://kubernetes.io/blog/2016/07/thousand-instances-of-cassandra-using-kubernetes-pet-set); not by naming each step, but saying “a thousand more steps just like that first one”.
- Controllers are state-synchronizers: we specify the goals, and your controllers will indefatigably work to bring the system to that state. They work through that strongly-typed API foundation, and are used throughout the code, so Kubernetes is more of a set of a hundred small programs than one big one. It’s not enough to scale to thousands of nodes technically; the project also has to scale to thousands of developers and features; and controllers help us get there.

And so on we will go! We’ll be replacing those controllers and building on more, and the API-foundation lets us build anything we can express in that way - with most things just a label or annotation away! But your thoughts will not be defined by language: with third party resources you can express anything you choose. Now we can build Kubernetes without building in Kubernetes, creating things that feel as much a part of Kubernetes as anything else. Many of the recent additions, like ingress, DNS integration, autoscaling and network policies were done or could be done in this way. Eventually it will be hard to imagine you before these things, but tomorrow’s standard functionality can start today, with no obstacles or gatekeeper, maybe even for an audience of one.  

So I’m looking forward to seeing more and more growth happen further and further from the core of Kubernetes. We had to work our way through those phases; starting with things that needed to happen in the kernel of Kubernetes - like replacing replication controllers with deployments. Now we’re starting to build things that don’t require core changes. But we’re still still talking about infrastructure separately from applications. It’s what comes next that gets really interesting: when we start building applications that rely on the Kubernetes APIs. We’ve always had the Cassandra example that uses the Kubernetes API to self-assemble, but we haven’t really even started to explore this more widely yet. In the same way that the S3 APIs changed how we build things that remember, I think the k8s APIs are going to change how we build things that think.  

So I’m looking forward to your second birthday: I can try to predict what you’ll look like then, but I know you’ll surpass even the most audacious things I can imagine. Oh, the places you’ll go!  


_-- Justin Santa Barbara, Independent Kubernetes Contributor_  
