---
title: " Weekly Kubernetes Community Hangout Notes - May 22 2015 "
date: 2015-06-02
slug: weekly-kubernetes-community-hangout
url: /blog/2015/06/Weekly-Kubernetes-Community-Hangout
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  


Discussion / Topics

* Code Freeze
* Upgrades of cluster
* E2E test issues

Code Freeze process starts EOD 22-May, including

* Code Slush -- draining PRs that are active. If there are issues for v1 to raise, please do so today.
* Community PRs -- plan is to reopen in ~6 weeks.
* Key areas for fixes in v1 -- docs, the experience.

E2E issues and LGTM process

* Seen end-to-end tests go red.
* Plan is to limit merging to on-call. Quinton to communicate.
* Can we expose Jenkins runs to community? (Paul)

    * Question/concern to work out is securing Jenkins. Short term conclusion: Will look at pushing Jenkins logs into GCS bucket. Lavalamp will follow up with Jeff Grafton.

    * Longer term solution may be a merge queue, where e2e runs for each merge (as opposed to multiple merges). This exists in OpenShift today.

Cluster Upgrades for Kubernetes as final v1 feature

* GCE will use Persistent Disk (PD) to mount new image.
* OpenShift will follow a tradition update model, with "yum update".
* A strawman approach is to have an analog of "kube-push" to update the master, in-place. Feedback in the meeting was

    * Upgrading Docker daemon on the master will kill the master's pods. Agreed. May consider an 'upgrade' phase or explicit step.

    * How is this different than HA master upgrade? See HA case as a superset. The work to do an upgrade would be a prerequisite for HA master upgrade.
* Mesos scheduler implements a rolling node upgrade.

Attention requested for v1 in the Hangout

* * Discussed that it's an eventually consistent design.*

    * In the meeting, the outcome was: seeking a pattern for atomicity of update across multiple piece. Paul to ping Tim when ready to review.
* Regression in e2e [#8499][1] (Eric Paris)
* Asking for review of direction, if not review. [#8334][2] (Mark)
* Handling graceful termination (e.g. sigterm to postgres) is not implemented. [#2789][3] (Clayton)

    * Need is to bump up grace period or finish plumbing. In API, client tools, missing is kubelet does use and we don't set the timeout (>0) value.

    * Brendan will look into this graceful term issue.
* Load balancer almost ready by JustinSB.

[1]: https://github.com/GoogleCloudPlatform/kubernetes/issues/8499
[2]: https://github.com/GoogleCloudPlatform/kubernetes/pull/8334
[3]: https://github.com/GoogleCloudPlatform/kubernetes/issues/2789
