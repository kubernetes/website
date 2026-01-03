---
title: " SIG Apps: build apps for and operate them in Kubernetes "
date: 2016-08-16
slug: sig-apps-running-apps-in-kubernetes
url: /blog/2016/08/Sig-Apps-Running-Apps-In-Kubernetes
author: >
  Matt Farina (Hewlett Packard Enterprise)
---
_**Editor's note:** This post is by the Kubernetes SIG-Apps team sharing how they focus on the developer and devops experience of running applications in Kubernetes._  

Kubernetes is an incredible manager for containerized applications. Because of this, [numerous](https://kubernetes.io/blog/2016/02/sharethis-kubernetes-in-production) [companies](https://blog.box.com/blog/kubernetes-box-microservices-maximum-velocity/) [have](http://techblog.yahoo.co.jp/infrastructure/os_n_k8s/) [started](http://www.nextplatform.com/2015/11/12/inside-ebays-shift-to-kubernetes-and-containers-atop-openstack/) to run their applications in Kubernetes.  

Kubernetes Special Interest Groups ([SIGs](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig)) have been around to support the community of developers and operators since around the 1.0 release. People organized around networking, storage, scaling and other operational areas.  

As Kubernetes took off, so did the need for tools, best practices, and discussions around building and operating cloud native applications. To fill that need the Kubernetes [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) came into existence.  

SIG Apps is a place where companies and individuals can:  


- see and share demos of the tools being built to enable app operators
- learn about and discuss needs of app operators
- organize around efforts to improve the experience

Since the inception of SIG Apps we’ve had demos of projects like [KubeFuse](https://github.com/opencredo/kubefuse), [KPM](https://github.com/kubespray/kpm), and [StackSmith](https://stacksmith.bitnami.com/). We’ve also executed on a survey of those operating apps in Kubernetes.  

From the survey results we’ve learned a number of things including:  


- That 81% of respondents want some form of autoscaling
- To store secret information 47% of respondents use built-in secrets. At reset these are not currently encrypted. (If you want to help add encryption there is an [issue](https://github.com/kubernetes/kubernetes/issues/10439) for that.)&nbsp;
- The most responded questions had to do with 3rd party tools and debugging
- For 3rd party tools to manage applications there were no clear winners. There are a wide variety of practices
- An overall complaint about a lack of useful documentation. (Help contribute to the docs [here](https://github.com/kubernetes/kubernetes.github.io).)
- There’s a lot of data. Many of the responses were optional so we were surprised that 935 of all questions across all candidates were filled in. If you want to look at the data yourself it’s [available online](https://docs.google.com/spreadsheets/d/15SUL7QTpR4Flrp5eJ5TR8A5ZAFwbchfX2QL4MEoJFQ8/edit?usp=sharing).

When it comes to application operation there’s still a lot to be figured out and shared. If you've got opinions about running apps, tooling to make the experience better, or just want to lurk and learn about what's going please come join us.  


- Chat with us on SIG-Apps [Slack channel](https://kubernetes.slack.com/messages/sig-apps)
- Email as at SIG-Apps [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-apps)
- Join our open meetings: weekly at 9AM PT on Wednesdays, [full details here](https://github.com/kubernetes/community/blob/master/sig-apps/README.md#meeting).



