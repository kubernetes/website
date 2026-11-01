---
layout: blog
title: "Spotlight on SIG Architecture: Code Organization"
slug: sig-architecture-code-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/04/11/sig-architecture-code-spotlight-2024
date: 2024-04-11
author: >
  Frederico Muñoz (SAS Institute)
---

_This is the third interview of a SIG Architecture Spotlight series that will cover the different
subprojects. We will cover [SIG Architecture: Code Organization](https://github.com/kubernetes/community/blob/e44c2c9d0d3023e7111d8b01ac93d54c8624ee91/sig-architecture/README.md#code-organization)._

In this SIG Architecture spotlight I talked with [Madhav Jivrajani](https://github.com/MadhavJivrajani)
(VMware), a member of the Code Organization subproject.

## Introducing the Code Organization subproject

**Frederico (FSM)**: Hello Madhav, thank you for your availability. Could you start by telling us a
bit about yourself, your role and how you got involved in Kubernetes?

**Madhav Jivrajani (MJ)**: Hello! My name is Madhav Jivrajani, I serve as a technical lead for SIG
Contributor Experience and a GitHub Admin for the Kubernetes project. Apart from that I also
contribute to SIG API Machinery and SIG Etcd, but more recently, I’ve been helping out with the work
that is needed to help Kubernetes [stay on supported versions of
Go](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions),
and it is through this that I am involved with the Code Organization subproject of SIG Architecture.

**FSM**: A project the size of Kubernetes must have unique challenges in terms of code organization
-- is this a fair assumption?  If so, what would you pick as some of the main challenges that are
specific to Kubernetes?

**MJ**: That’s a fair assumption! The first interesting challenge comes from the sheer size of the
Kubernetes codebase. We have ≅2.2 million lines of Go code (which is steadily decreasing thanks to
[dims](https://github.com/dims) and other folks in this sub-project!), and a little over 240
dependencies that we rely on either directly or indirectly, which is why having a sub-project
dedicated to helping out with dependency management is crucial: we need to know what dependencies
we’re pulling in, what versions these dependencies are at, and tooling to help make sure we are
managing these dependencies across different parts of the codebase in a consistent manner.

Another interesting challenge with Kubernetes is that we publish a lot of Go modules as part of the
Kubernetes release cycles, one example of this is
[`client-go`](https://github.com/kubernetes/client-go).However, we as a project would also like the
benefits of having everything in one repository to get the advantages of using a monorepo, like
atomic commits... so, because of this, code organization works with other SIGs (like SIG Release) to
automate the process of publishing code from the monorepo to downstream individual repositories
which are much easier to consume, and this way you won’t have to import the entire Kubernetes
codebase!

## Code organization and Kubernetes

**FSM**: For someone just starting contributing to Kubernetes code-wise, what are the main things
they should consider in terms of code organization? How would you sum up the key concepts?

**MJ**: I think one of the key things to keep in mind at least as you’re starting off is the concept
of staging directories. In the [`kubernetes/kubernetes`](https://github.com/kubernetes/kubernetes)
repository, you will come across a directory called
[`staging/`](https://github.com/kubernetes/kubernetes/tree/master/staging). The sub-folders in this
directory serve as a bunch of pseudo-repositories. For example, the
[`kubernetes/client-go`](https://github.com/kubernetes/client-go) repository that publishes releases
for `client-go` is actually a [staging
repo](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/client-go).

**FSM**: So the concept of staging directories fundamentally impact contributions?

**MJ**: Precisely, because if you’d like to contribute to any of the staging repos, you will need to
send in a PR to its corresponding staging directory in `kubernetes/kubernetes`. Once the code merges
there, we have a bot called the [`publishing-bot`](https://github.com/kubernetes/publishing-bot)
that will sync the merged commits to the required staging repositories (like
`kubernetes/client-go`). This way we get the benefits of a monorepo but we also can modularly
publish code for downstream consumption. PS: The `publishing-bot` needs more folks to help out!

For more information on staging repositories, please see the [contributor
documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/staging.md).

**FSM**: Speaking of contributions, the very high number of contributors, both individuals and
companies, must also be a challenge: how does the subproject operate in terms of making sure that
standards are being followed?

**MJ**: When it comes to dependency management in the project, there is a [dedicated
team](https://github.com/kubernetes/org/blob/a106af09b8c345c301d072bfb7106b309c0ad8e9/config/kubernetes/org.yaml#L1329)
that helps review and approve dependency changes. These are folks who have helped lay the foundation
of much of the
[tooling](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/vendor.md)
that Kubernetes uses today for dependency management. This tooling helps ensure there is a
consistent way that contributors can make changes to dependencies. The project has also worked on
additional tooling to signal statistics of dependencies that is being added or removed:
[`depstat`](https://github.com/kubernetes-sigs/depstat)

Apart from dependency management, another crucial task that the project does is management of the
staging repositories. The tooling for achieving this (`publishing-bot`) is completely transparent to
contributors and helps ensure that the staging repos get a consistent view of contributions that are
submitted to `kubernetes/kubernetes`.

Code Organization also works towards making sure that Kubernetes [stays on supported versions of
Go](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions). The
linked KEP provides more context on why we need to do this. We collaborate with SIG Release to
ensure that we are testing Kubernetes as rigorously and as early as we can on Go releases and
working on changes that break our CI as a part of this. An example of how we track this process can
be found [here](https://github.com/kubernetes/release/issues/3076).

## Release cycle and current priorities

**FSM**: Is there anything that changes during the release cycle?

**MJ** During the release cycle, specifically before code freeze, there are often changes that go in
that add/update/delete dependencies, fix code that needs fixing as part of our effort to stay on
supported versions of Go.

Furthermore, some of these changes are also candidates for
[backporting](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)
to our supported release branches.

**FSM**: Is there any major project or theme the subproject is working on right now that you would
like to highlight?

**MJ**: I think one very interesting and immensely useful change that
has been recently added (and I take the opportunity to specifically
highlight the work of [Tim Hockin](https://github.com/thockin) on
this) is the introduction of [Go workspaces to the Kubernetes
repo](https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/). A lot of our
current tooling for dependency management and code publishing, as well
as the experience of editing code in the Kubernetes repo, can be
significantly improved by this change.

## Wrapping up

**FSM**: How would someone interested in the topic start helping the subproject?

**MJ**: The first step, as is the first step with any project in Kubernetes, is to join our slack:
[slack.k8s.io](https://slack.k8s.io), and after that join the `#k8s-code-organization` channel. There is also a
[code-organization office
hours](https://github.com/kubernetes/community/tree/master/sig-architecture#meetings) that takes
place that you can choose to attend. Timezones are hard, so feel free to also look at the recordings
or meeting notes and follow up on slack!

**FSM**: Excellent, thank you! Any final comments you would like to share?

**MJ**: The Code Organization subproject always needs help! Especially areas like the publishing
bot, so don’t hesitate to get involved in the `#k8s-code-organization` Slack channel.
