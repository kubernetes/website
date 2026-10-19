---
layout: blog
title: "Dockershim removal is coming. Are you ready?"
date: 2021-11-12
slug: are-you-ready-for-dockershim-removal
author: >
   Sergey Kanzhelev (Google)
---

**Reviewers:** Davanum Srinivas, Elana Hashman, Noah Kantrowitz, Rey Lejano.

{{% alert color="info" title="Poll closed" %}}
This poll closed on January 7, 2022.
{{% /alert %}}

Last year we [announced](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
that Kubernetes' dockershim component (which provides a built-in integration for
Docker Engine) is deprecated.

_Update: There's a [Dockershim Deprecation FAQ](/blog/2020/12/02/dockershim-faq/)
with more information, and you can also discuss the deprecation via a dedicated
[GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)._

Our current plan is to remove dockershim from the Kubernetes codebase soon.
We are looking for feedback from you whether you are ready for dockershim
removal and to ensure that you are ready when the time comes.

<del>Please fill out this survey: https://forms.gle/svCJmhvTv78jGdSx8</del>

The dockershim component that enables Docker as a Kubernetes container runtime is
being deprecated in favor of runtimes that directly use the [Container Runtime Interface](/blog/2016/12/container-runtime-interface-cri-in-kubernetes/)
created for Kubernetes. Many Kubernetes users have migrated to
other container runtimes without problems. However we see that dockershim is
still very popular. You may see some public numbers in recent [Container Report](https://www.datadoghq.com/container-report/#8) from DataDog.
Some Kubernetes hosting vendors just recently enabled other runtimes support
(especially for Windows nodes). And we know that many third party tools vendors
are still not ready: [migrating telemetry and security agents](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/#telemetry-and-security-agent-vendors).

At this point, we believe that there is feature parity between Docker and the
other runtimes. Many end-users have used our [migration guide](/docs/tasks/administer-cluster/migrating-from-dockershim/)
and are running production workload using these different runtimes. The plan of
record today is that dockershim will be removed in version 1.24, slated for
release around April of next year. For those developing or running alpha and
beta versions, dockershim will be removed in December at the beginning of the
1.24 release development cycle.

There is only one month left to give us feedback. We want you to tell us how
ready you are.

<del>We are collecting opinions through this survey: https://forms.gle/svCJmhvTv78jGdSx8</del>
To better understand preparedness for the dockershim removal, our survey is
asking the version of Kubernetes you are currently using, and an estimate of
when you think you will adopt Kubernetes 1.24. All the aggregated information
on dockershim removal readiness will be published.
Free form comments will be reviewed by SIG Node leadership. If you want to
discuss any details of migrating from dockershim, report bugs or adoption
blockers, you can use one of the SIG Node contact options any time:
https://github.com/kubernetes/community/tree/master/sig-node#contact

Kubernetes is a mature project. This deprecation is another
step in the effort to get away from permanent beta features and providing more
stability and compatibility guarantees. With the migration from dockershim you
will get more flexibility and choice of container runtime features as well as
less dependencies of your apps on specific underlying technology. Please take
time to review the [dockershim migration documentation](/docs/tasks/administer-cluster/migrating-from-dockershim/)
and consult your Kubernetes hosting vendor (if you have one) what container runtime options are available for you.
Read up [container runtime documentation with instructions on how to use containerd and CRI-O](/docs/setup/production-environment/container-runtimes/#container-runtimes)
to help prepare you when you're ready to upgrade to 1.24. CRI-O, containerd, and
Docker with [Mirantis cri-dockerd](https://mirantis.github.io/cri-dockerd/) are
not the only container runtime options, we encourage you to explore the [CNCF landscape on container runtimes](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#runtime--container-runtime)
in case another suits you better.

Thank you!
