---
layout: blog 
title: 'Increasing the Kubernetes Support Window to One Year'
date: 2020-08-31 
slug: kubernetes-1-19-feature-one-year-support
author: >
  Tim Pepper (VMware),
  Nick Young (VMware)
---

Starting with Kubernetes 1.19, the support window for Kubernetes versions [will increase from 9 months to one year](https://github.com/kubernetes/enhancements/issues/1498). The longer support window is intended to allow organizations to perform major upgrades at a time of the year that works the best for them.

This is a big change. For many years, the Kubernetes project has delivered a new minor release (e.g.: 1.13 or 1.14) every 3 months. The project provides bugfix support via patch releases (e.g.: 1.13.Y) for three parallel branches of the codebase. Combined, this led to each minor release (e.g.: 1.13) having a patch release stream of support for approximately 9 months. In the end, a cluster operator had to upgrade at least every 9 months to remain supported. 

A survey conducted in early 2019 by the WG LTS showed that a significant subset of Kubernetes end-users fail to upgrade within the 9-month support period. 

![Versions in Production](/images/blog/2020-08-31-increase-kubernetes-support-one-year/versions-in-production-text-2.png)

This, and other responses from the survey, suggest that a considerable portion of our community would better be able to manage their deployments on supported versions if the patch support period were extended to 12-14 months. It appears to be true regardless of whether the users are on DIY builds or commercially vendored distributions. An extension in the patch support length of time would thus lead to a larger percentage of our user base running supported versions compared to what we have now.

A yearly support period provides the cushion end-users appear to desire, and is more aligned with familiar annual planning cycles.
There are many unknowns about changing the support windows for a project with as many moving parts as Kubernetes. Keeping the change relatively small (relatively being the important word), gives us the chance to find out what those unknowns are in detail and address them.
From Kubernetes version 1.19 on, the support window will be extended to one year. For Kubernetes versions 1.16, 1.17, and 1.18, the story is more complicated.

All of these versions still fall under the older “three releases support” model, and will drop out of support when 1.19, 1.20 and 1.21 are respectively released. However, because the 1.19 release has been delayed due to the events of 2020, they will end up with close to a year of support (depending on their exact release dates).

For example, 1.19 was released on the 26th of August 2020, which is 11 months since the release of 1.16. Since 1.16 is still under the old release policy, this means that it is now out of support.

![Support Timeline](/images/blog/2020-08-31-increase-kubernetes-support-one-year/support-timeline.png)

If you’ve got thoughts or feedback, we’d love to hear them. Please contact us on [#wg-lts](https://kubernetes.slack.com/messages/wg-lts/) on the Kubernetes Slack, or to the [kubernetes-wg-lts mailing list](https://groups.google.com/g/kubernetes-wg-lts).
