---
layout: blog
title:  'The Machines Can Do the Work, a Story of Kubernetes Testing, CI, and Automating the Contributor Experience'
date:   2018-08-29
---

**Author**: Aaron Crickenberger (Google) and Benjamin Elder (Google)

_“Large projects have a lot of less exciting, yet, hard work. We value time spent automating repetitive work more highly than toil. Where that work cannot be automated, it is our culture to recognize and reward all types of contributions. However, heroism is not sustainable.”_ - [Kubernetes Community Values](https://git.k8s.io/community/values.md#automation-over-process)

Like many open source projects, Kubernetes is hosted on GitHub. We felt the barrier to participation would be lowest if the project lived where developers already worked, using tools and processes developers already knew. Thus the project embraced the service fully: it was the basis of our workflow, our issue tracker, our documentation, our blog platform, our team structure, and more.

This strategy worked. It worked so well that the project quickly scaled past its contributors’ capacity as humans. What followed was an incredible journey of automation and innovation. We didn’t just need to rebuild our airplane mid-flight without crashing, we needed to convert it into a rocketship and launch into orbit. We needed machines to do the work.

## The Work

Initially, we focused on the fact that we needed to support the sheer volume of tests mandated by a complex distributed system such as Kubernetes. Real world failure scenarios had to be exercised via end-to-end (e2e) tests to ensure proper functionality. Unfortunately, e2e tests were susceptible to flakes (random failures) and took anywhere from an hour to a day to complete.

Further experience revealed other areas where machines could do the work for us:

* PR Workflow
  * Did the contributor sign our CLA?
  * Did the PR pass tests?
  * Is the PR mergeable?
  * Did the merge commit pass tests?
* Triage
  * Who should be reviewing PRs?
  * Is there enough information to route an issue to the right people?
  * Is an issue still relevant?
* Project Health
  * What is happening in the project?
  * What should we be paying attention to?

As we developed automation to improve our situation, we followed a few guiding principles:

* Follow the push/poll control loop patterns that worked well for Kubernetes
* Prefer stateless loosely coupled services that do one thing well
* Prefer empowering the entire community over empowering a few core contributors
* Eat our own dogfood and avoid reinventing wheels

## Enter Prow

This led us to create [Prow](https://git.k8s.io/test-infra/prow) as the central component for our automation. Prow is sort of like an [If This, Then That](https://ifttt.com/) for GitHub events, with a built-in library of [commands](https://prow.k8s.io/command-help), [plugins](https://prow.k8s.io/plugins), and utilities. We built Prow on top of Kubernetes to free ourselves from worrying about resource management and scheduling, and ensure a more pleasant operational experience.

Prow lets us do things like:

* Allow our community to triage issues/PRs by commenting commands such as “/priority critical-urgent”, “/assign mary” or “/close”
* Auto-label PRs based on how much code they change, or which files they touch
* Age out issues/PRs that have remained inactive for too long
* Auto-merge PRs that meet our PR workflow requirements
* Run CI jobs defined as [Knative Builds](https://github.com/knative/build), Kubernetes Pods, or Jenkins jobs
* Enforce org-wide and per-repo GitHub policies like [branch protection](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/branchprotector) and [GitHub labels](https://github.com/kubernetes/test-infra/tree/master/label_sync)

Prow was initially developed by the engineering productivity team building Google Kubernetes Engine, and is actively contributed to by multiple members of Kubernetes SIG Testing. Prow has been adopted by several other open source projects, including Istio, JetStack, Knative and OpenShift. [Getting started with Prow](https://github.com/kubernetes/test-infra/blob/master/prow/getting_started.md) takes a Kubernetes cluster and `kubectl apply starter.yaml` (running pods on a Kubernetes cluster).

Once we had Prow in place, we began to hit other scaling bottlenecks, and so produced additional tooling to support testing at the scale required by Kubernetes, including:

- [Boskos](https://github.com/kubernetes/test-infra/tree/master/boskos): manages job resources (such as GCP projects) in pools, checking them out for jobs and cleaning them up automatically ([with monitoring](http://velodrome.k8s.io/dashboard/db/boskos-dashboard?orgId=1))
- [ghProxy](https://github.com/kubernetes/test-infra/tree/master/ghproxy): a reverse proxy HTTP cache optimized for use with the GitHub API, to ensure our token usage doesn’t hit API limits ([with monitoring](http://velodrome.k8s.io/dashboard/db/github-cache?refresh=1m&orgId=1))
- [Greenhouse](https://github.com/kubernetes/test-infra/tree/master/greenhouse): allows us to use a remote bazel cache to provide faster build and test results for PRs ([with monitoring](http://velodrome.k8s.io/dashboard/db/bazel-cache?orgId=1))
- [Splice](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/splice): allows us to test and merge PRs in a batch, ensuring our merge velocity is not limited to our test velocity
- [Tide](https://github.com/kubernetes/test-infra/tree/master/prow/cmd/tide): allows us to merge PRs selected via GitHub queries rather than ordered in a queue, allowing for significantly higher merge velocity in tandem with splice

## Scaling Project Health

With workflow automation addressed, we turned our attention to project health. We chose to use Google Cloud Storage (GCS) as our source of truth for all test data, allowing us to lean on established infrastructure, and allowed the community to contribute results. We then built a variety of tools to help individuals and the project as a whole make sense of this data, including:

* [Gubernator](https://github.com/kubernetes/test-infra/tree/master/gubernator): display the results and test history for a given PR
* [Kettle](https://github.com/kubernetes/test-infra/tree/master/kettle): transfer data from GCS to a publicly accessible bigquery dataset
* [PR dashboard](https://k8s-gubernator.appspot.com/pr): a workflow-aware dashboard that allows contributors to understand which PRs require attention and why
* [Triage](https://storage.googleapis.com/k8s-gubernator/triage/index.html): identify common failures that happen across all jobs and tests
* [Testgrid](https://k8s-testgrid.appspot.com/): display test results for a given job across all runs, summarize test results across groups of jobs

We approached the Cloud Native Computing Foundation (CNCF) to develop DevStats to glean insights from our GitHub events such as:

* [Which prow commands are people most actively using](https://k8s.devstats.cncf.io/d/5/bot-commands-repository-groups?orgId=1)
* [PR reviews by contributor over time](https://k8s.devstats.cncf.io/d/46/pr-reviews-by-contributor?orgId=1&var-period=d7&var-repo_name=All&var-reviewers=All)
* [Time spent in each phase of our PR workflow](https://k8s.devstats.cncf.io/d/44/pr-time-to-approve-and-merge?orgId=1)

## Into the Beyond

Today, the Kubernetes project spans over 125 repos across five orgs. There are 31 Special Interests Groups and 10 Working Groups coordinating development within the project. In the last year the project has had [participation from over 13,800 unique developers](https://k8s.devstats.cncf.io/d/13/developer-activity-counts-by-repository-group?orgId=1&var-period_name=Last%20year&var-metric=contributions&var-repogroup_name=All) on GitHub.

On any given weekday our Prow instance [runs over 10,000 CI jobs](http://velodrome.k8s.io/dashboard/db/bigquery-metrics?panelId=10&fullscreen&orgId=1&from=now-6M&to=now); from March 2017 to March 2018 it ran 4.3 million jobs. Most of these jobs involve standing up an entire Kubernetes cluster, and exercising it using real world scenarios. They allow us to ensure all supported releases of Kubernetes work across cloud providers, container engines, and networking plugins. They make sure the latest releases of Kubernetes work with various optional features enabled, upgrade safely, meet performance requirements, and work across architectures.

With today’s [announcement from CNCF](https://www.cncf.io/announcement/2018/08/29/cncf-receives-9-million-cloud-credit-grant-from-google) – noting that Google Cloud has begun transferring ownership and management of the Kubernetes project’s cloud resources to CNCF community contributors, we are excited to embark on another journey. One that allows the project infrastructure to be owned and operated by the community of contributors, following the same open governance model that has worked for the rest of the project. Sound exciting to you? Come talk to us at #sig-testing on kubernetes.slack.com.

Want to find out more? Come check out these resources:

* [Prow: Testing the way to Kubernetes Next](https://bentheelder.io/posts/prow)
* [Automation and the Kubernetes Contributor Experience](https://www.youtube.com/watch?v=BsIC7gPkH5M)
