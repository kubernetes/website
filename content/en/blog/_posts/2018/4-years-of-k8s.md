---
layout: blog
title: 4 Years of K8s
date: 2018-06-06
author: >
  Joe Beda (Heptio) 
---

On June 6, 2014 I checked in the [first commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56) of what would become the public repository for Kubernetes. Many would assume that is where the story starts. It is the beginning of history, right? But that really doesn’t tell the whole story.

![k8s_first_commit](/images/blog/2018-06-06-4-years-of-k8s/k8s-first-commit.png)

The cast leading up to that commit was large and the success for Kubernetes since then is owed to an ever larger cast.

Kubernetes was built on ideas that had been proven out at Google over the previous ten years with Borg. And Borg, itself, owed its existence to even earlier efforts at Google and beyond.

Concretely, Kubernetes started as some prototypes from Brendan Burns combined with ongoing work from me and Craig McLuckie to better align the internal Google experience with the Google Cloud experience. Brendan, Craig, and I really wanted people to use this, so we made the case to build out this prototype as an open source project that would bring the best ideas from Borg out into the open.

After we got the nod, it was time to actually build the system.  We took Brendan’s prototype (in Java), rewrote it in Go, and built just enough to get the core ideas across.  By this time the team had grown to include Ville Aikas, Tim Hockin, Brian Grant, Dawn Chen and Daniel Smith.  Once we had something working, someone had to sign up to clean things up to get it ready for public launch.  That ended up being me. Not knowing the significance at the time, I created a new repo, moved things over, and checked it in.  So while I have the first public commit to the repo, there was work underway well before that.

The version of Kubernetes at that point was really just a shadow of what it was to become.  The core concepts were there but it was very raw.  For example, Pods were called Tasks.  That was changed a day before we went public.  All of this led up to the public announcement of Kubernetes on June 10th, 2014 in a keynote from Eric Brewer at the first DockerCon.  You can watch that video here:

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/YrxnVKZeqK8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></center>


But, however raw, that modest start was enough to pique the interest of a community that started strong and has only gotten stronger.  Over the past four years Kubernetes has exceeded the expectations of all of us that were there early on. We owe the Kubernetes community a huge debt.  The success the project has seen is based not just on code and technology but also the way that an amazing group of people have come together to create something special.  The best expression of this is the [set of Kubernetes values](https://git.k8s.io/community/values.md) that Sarah Novotny helped curate.

Here is to another 4 years and beyond! 🎉🎉🎉
