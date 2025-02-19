---
layout: blog
title: "Free Katacoda Kubernetes Tutorials Are Shutting Down"
date: 2023-02-14
slug: kubernetes-katacoda-tutorials-stop-from-2023-03-31
evergreen: true
author: >
  Natali Vlatko (SIG Docs Co-Chair for Kubernetes)
---

[Katacoda](https://katacoda.com/kubernetes), the popular learning platform from O’Reilly that has been helping people learn all about 
Java, Docker, Kubernetes, Python, Go, C++, and more, [shut down for public use in June 2022](https://www.oreilly.com/online-learning/leveraging-katacoda-technology.html). 
However, tutorials specifically for Kubernetes, linked from the Kubernetes website for our project’s 
users and contributors, remained available and active after this change. Unfortunately, this will no 
longer be the case, and Katacoda tutorials for learning Kubernetes will cease working after March 31st, 2023.

The Kubernetes Project wishes to thank O'Reilly Media for the many years it has supported the community 
via the Katacoda learning platform. You can read more about [the decision to shutter katacoda.com](https://www.oreilly.com/online-learning/leveraging-katacoda-technology.html) 
on O'Reilly's own site. With this change, we’ll be focusing on the work needed to remove links to 
their various tutorials. We have a general issue tracking this topic at [#33936](https://github.com/kubernetes/website/issues/33936) and [GitHub discussion](https://github.com/kubernetes/website/discussions/38878). We’re also 
interested in researching what other learning platforms could be beneficial for the Kubernetes community, 
replacing Katacoda with a link to a platform or service that has a similar user experience. However, 
this research will take time, so we’re actively looking for volunteers to help with this work. 
If a replacement is found, it will need to be supported by Kubernetes leadership, specifically, 
SIG Contributor Experience, SIG Docs, and the Kubernetes Steering Committee.

The Katacoda shutdown affects 25 tutorial pages, their localizations, as well as the Katacoda 
Scenario repository: [github.com/katacoda-scenarios/kubernetes-bootcamp-scenarios](https://github.com/katacoda-scenarios/kubernetes-bootcamp-scenarios). We recommend 
that any links, guides, or documentation you have that points to the Katacoda learning platform be 
updated immediately to reflect this change. While we have yet to find a replacement learning solution, 
the Kubernetes website contains a lot of helpful documentation to support your continued learning and growth. 
You can find all of our available documentation tutorials for Kubernetes at https://k8s.io/docs/tutorials/.

If you have any questions regarding the Katacoda shutdown, or subsequent link removal from Kubernetes 
tutorial pages, please feel free to comment on the [general issue tracking the shutdown](https://github.com/kubernetes/website/issues/33936), 
or visit the #sig-docs channel on the Kubernetes Slack.
