---
layout: blog
title: "Kubernetes is Moving on From Dockershim: Commitments and Next Steps"
date: 2022-01-07
slug: kubernetes-is-moving-on-from-dockershim
author: >
  Sergey Kanzhelev (Google),
  Jim Angel (Google),
  Davanum Srinivas (VMware),
  Shannon Kularathna (Google),
  Chris Short (AWS),
  Dawn Chen (Google)
---

Kubernetes is removing dockershim in the upcoming v1.24 release. We're excited
to reaffirm our community values by supporting open source container runtimes,
enabling a smaller kubelet, and increasing engineering velocity for teams using
Kubernetes. If you [use Docker Engine as a container runtime](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)
for your Kubernetes cluster, get ready to migrate in 1.24! To check if you're
affected, refer to [Check whether dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/).

## Why we’re moving away from dockershim

Docker was the first container runtime used by Kubernetes. This is one of the
reasons why Docker is so familiar to many Kubernetes users and enthusiasts.
Docker support was hardcoded into Kubernetes – a component the project refers to
as dockershim.
As containerization became an industry standard, the Kubernetes project added support
for additional runtimes. This culminated in the implementation of the
container runtime interface (CRI), letting system components (like the kubelet)
talk to container runtimes in a standardized way. As a result, dockershim became
an anomaly in the Kubernetes project. 
Dependencies on Docker and dockershim have crept into various tools
and projects in the CNCF ecosystem ecosystem, resulting in fragile code.

By removing the
dockershim CRI, we're embracing the first value of CNCF: "[Fast is better than
slow](https://github.com/cncf/foundation/blob/master/charter.md#3-values)".
Stay tuned for future communications on the topic!

## Deprecation timeline

We [formally announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/) the dockershim deprecation in December 2020. Full removal is targeted
in Kubernetes 1.24, in April 2022. This timeline
aligns with our [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior),
which states that deprecated behaviors must function for at least 1 year
after their announced deprecation.

We'll support Kubernetes version 1.23, which includes
dockershim, for another year in the Kubernetes project. For managed
Kubernetes providers, vendor support is likely to last even longer, but this is
dependent on the companies themselves. Regardless, we're confident all cluster operations will have
time to migrate. If you have more questions about the dockershim removal, refer
to the [Dockershim Deprecation FAQ](/dockershim).

We asked you whether you feel prepared for the migration from dockershim in this
survey: [Are you ready for Dockershim removal](/blog/2021/11/12/are-you-ready-for-dockershim-removal/).
We had over 600 responses. To everybody who took time filling out the survey,
thank you.

The results show that we still have a lot of ground to cover to help you to
migrate smoothly. Other container runtimes exist, and have been promoted
extensively. However, many users told us they still rely on dockershim,
and sometimes have dependencies that need to be re-worked. Some of these
dependencies are outside of your control. Based on your feedback, here are some
of the steps we are taking to help.

## Our next steps

Based on the feedback you provided:

- CNCF and the 1.24 release team are committed to delivering documentation in
  time for the 1.24 release. This includes more informative blog posts like this
  one, updating existing code samples, tutorials, and tasks, and producing a
  migration guide for cluster operators.
- We are reaching out to the rest of the CNCF community to help prepare them for
  this change.

If you're part of a project with dependencies on dockershim, or if you're
interested in helping with the migration effort, please join us! There's always
room for more contributors, whether to our transition tools or to our
documentation. To get started, say hello in the
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G)
channel on [Kubernetes Slack](https://slack.kubernetes.io/)!

## Final thoughts

As a project, we've already seen cluster operators increasingly adopt other
container runtimes through 2021. 
We believe there are no major blockers to migration. The steps we're taking to
improve the migration experience will light the path more clearly for you.

We understand that migration from dockershim is yet another action you may need to
do to keep your Kubernetes infrastructure up to date. For most of you, this step
will be straightforward and transparent. In some cases, you will encounter
hiccups or issues. The community has discussed at length whether postponing the
dockershim removal would be helpful. For example, we recently talked about it in
the [SIG Node discussion on November 11th](https://docs.google.com/document/d/1Ne57gvidMEWXR70OxxnRkYquAoMpt56o75oZtg-OeBg/edit#bookmark=id.r77y11bgzid)
and in the [Kubernetes Steering committee meeting held on December 6th](https://docs.google.com/document/d/1qazwMIHGeF3iUh5xMJIJ6PDr-S3bNkT8tNLRkSiOkOU/edit#bookmark=id.m0ir406av7jx).
We already [postponed](https://github.com/kubernetes/enhancements/pull/2481/) it
once in 2021 because the adoption rate of other
runtimes was lower than we wanted, which also gave us more time to identify
potential blocking issues.

At this point, we believe that the value that you (and Kubernetes) gain from
dockershim removal makes up for the migration effort you'll have. Start planning
now to avoid surprises. We'll have more updates and guides before Kubernetes
1.24 is released.
