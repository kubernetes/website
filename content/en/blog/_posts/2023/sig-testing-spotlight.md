---
layout: blog
title: "Spotlight on SIG Testing"
slug: sig-testing-spotlight-2023
date: 2023-11-24
canonicalUrl: https://www.kubernetes.dev/blog/2023/11/24/sig-testing-spotlight-2023/
author: >
  Sandipan Panda
---

Welcome to another edition of the _SIG spotlight_ blog series, where we
highlight the incredible work being done by various Special Interest
Groups (SIGs) within the Kubernetes project. In this edition, we turn
our attention to [SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing#readme),
a group interested in effective testing of Kubernetes and automating
away project toil. SIG Testing focus on creating and running tools and
infrastructure that make it easier for the community to write and run
tests, and to contribute, analyze and act upon test results.

To gain some insights into SIG Testing, [Sandipan
Panda](https://github.com/sandipanpanda) spoke with [Michelle Shepardson](https://github.com/michelle192837),
a senior software engineer at Google and a chair of SIG Testing, and
[Patrick Ohly](https://github.com/pohly), a software engineer and architect at
Intel and a SIG Testing Tech Lead.

## Meet the contributors

**Sandipan:** Could you tell us a bit about yourself, your role, and
how you got involved in the Kubernetes project and SIG Testing?

**Michelle:** Hi! I'm Michelle, a senior software engineer at
Google. I first got involved in Kubernetes through working on tooling
for SIG Testing, like the external instance of TestGrid. I'm part of
oncall for TestGrid and Prow, and am now a chair for the SIG.

**Patrick:** Hello! I work as a software engineer and architect in a
team at Intel which focuses on open source Cloud Native projects. When
I ramped up on Kubernetes to develop a storage driver, my very first
question was "how do I test it in a cluster and how do I log
information?" That interest led to various enhancement proposals until
I had (re)written enough code that also took over official roles as
SIG Testing Tech Lead (for the [E2E framework](https://github.com/kubernetes-sigs/e2e-framework)) and
structured logging WG lead.

## Testing practices and tools

**Sandipan:** Testing is a field in which multiple approaches and
tools exist; how did you arrive at the existing practices?

**Patrick:** I can’t speak about the early days because I wasn’t
around yet 😆, but looking back at some of the commit history it’s
pretty obvious that developers just took what was available and
started using it. For E2E testing, that was
[Ginkgo+Gomega](https://github.com/onsi/ginkgo). Some hacks were
necessary, for example around cleanup after a test run and for
categorising tests. Eventually this led to Ginkgo v2 and [revised best
practices for E2E testing](https://www.kubernetes.dev/blog/2023/04/12/e2e-testing-best-practices-reloaded/).
Regarding unit testing opinions are pretty diverse: some maintainers
prefer to use just the Go standard library with hand-written
checks. Others use helper packages like stretchr/testify. That
diversity is okay because unit tests are self-contained - contributors
just have to be flexible when working on many different areas.
Integration testing falls somewhere in the middle. It’s based on Go
unit tests, but needs complex helper packages to bring up an apiserver
and other components, then runs tests that are more like E2E tests.

## Subprojects owned by SIG Testing

**Sandipan:** SIG Testing is pretty diverse. Can you give a brief
overview of the various subprojects owned by SIG Testing?

**Michelle:** Broadly, we have subprojects related to testing
frameworks, and infrastructure, though they definitely overlap.  So
for the former, there's
[e2e-framework](https://pkg.go.dev/sigs.k8s.io/e2e-framework) (used
externally),
[test/e2e/framework](https://pkg.go.dev/k8s.io/kubernetes/test/e2e/framework)
(used for Kubernetes itself) and kubetest2 for end-to-end testing,
as well as boskos (resource rental for e2e tests),
[KIND](https://kind.sigs.k8s.io/) (Kubernetes-in-Docker, for local
testing and development), and the cloud provider for KIND.  For the
latter, there's [Prow](https://docs.prow.k8s.io/) (K8s-based CI/CD and
chatops), and a litany of other tools and utilities for triage,
analysis, coverage, Prow/TestGrid config generation, and more in the
test-infra repo.

*If you are willing to learn more and get involved with any of the SIG
Testing subprojects, check out the [SIG Testing README](https://github.com/kubernetes/community/tree/master/sig-testing#subprojects).*

## Key challenges and accomplishments

**Sandipan:** What are some of the key challenges you face?

**Michelle:** Kubernetes is a gigantic project in every aspect, from
contributors to code to users and more. Testing and infrastructure
have to meet that scale, keeping up with every change from every repo
under Kubernetes while facilitating developing, improving, and
releasing the project as much as possible, though of course, we're not
the only SIG involved in that.  I think another other challenge is
staffing subprojects. SIG Testing has a number of subprojects that
have existed for years, but many of the original maintainers for them
have moved on to other areas or no longer have the time to maintain
them. We need to grow long-term expertise and owners in those
subprojects.

**Patrick:** As Michelle said, the sheer size can be a challenge. It’s
not just the infrastructure, also our processes must scale with the
number of contributors. It’s good to document best practices, but not
good enough: we have many new contributors, which is good, but having
reviewers explain best practices doesn’t scale - assuming that the
reviewers even know about them! It also doesn’t help that existing
code cannot get updated immediately because there is so much of it, in
particular for E2E testing. The initiative to [apply stricter linting to new or modified code](https://groups.google.com/a/kubernetes.io/g/dev/c/myGiml72IbM/m/QdO5bgQiAQAJ)
while accepting that existing code doesn’t pass those same linter
checks helps a bit.

**Sandipan:** Any SIG accomplishments that you are proud of and would
like to highlight?

**Patrick:** I am biased because I have been driving this, but I think
that the [E2E framework](https://github.com/kubernetes-sigs/e2e-framework) and linting are now in a much better shape than
they used to be. We may soon be able to run integration tests with
race detection enabled, which is important because we currently only
have that for unit tests and those tend to be less complex.

**Sandipan:** Testing is always important, but is there anything
specific to your work in terms of the Kubernetes release process?

**Patrick:** [test flakes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/flaky-tests.md)…
if we have too many of those, development velocity goes down because
PRs cannot be merged without clean test runs and those become less
likely. Developers also lose trust in testing and just "retest" until
they have a clean run, without checking whether failures might indeed
be related to a regression in their current change.

## The people and the scope

**Sandipan:** What are some of your favourite things about this SIG?

**Michelle:** The people, of course 🙂. Aside from that, I like the
broad scope SIG Testing has. I feel like even small changes can make a
big difference for fellow contributors, and even if my interests
change over time, I'll never run out of projects to work on.

**Patrick:** I can work on things that make my life and the life of my
fellow developers better, like the tooling that we have to use every
day while working on some new feature elsewhere.

**Sandipan:** Are there any funny / cool / TIL anecdotes that you
could tell us?

**Patrick:** I started working on E2E framework enhancements five
years ago, then was less active there for a while. When I came back
and wanted to test some new enhancement, I asked about how to write
unit tests for the new code and was pointed to some existing tests
which looked vaguely familiar, as if I had *seen* them before. I
looked at the commit history and found that I had *written* them! I’ll
let you decide whether that says something about my failing long-term
memory or simply is normal… Anyway, folks, remember to write good
commit messages and comments; someone will need them at some point -
it might even be yourself!

## Looking ahead

**Sandipan:** What areas and/or subprojects does your SIG need help with?

**Michelle:** Some subprojects aren't staffed at the moment and could
use folks willing to learn more about
them. [boskos](https://github.com/kubernetes-sigs/boskos#boskos) and
[kubetest2](https://github.com/kubernetes-sigs/kubetest2#kubetest2)
especially stand out to me, since both are important for testing but
lack dedicated owners.

**Sandipan:** Are there any useful skills that new contributors to SIG
Testing can bring to the table? What are some things that people can
do to help this SIG if they come from a background that isn’t directly
linked to programming?

**Michelle:** I think user empathy, writing clear feedback, and
recognizing patterns are really useful. Someone who uses the test
framework or tooling and can outline pain points with clear examples,
or who can recognize a wider issue in the project and pull data to
inform solutions for it.

**Sandipan:** What’s next for SIG Testing?

**Patrick:** Stricter linting will soon become mandatory for new
code. There are several E2E framework sub-packages that could be
modernised, if someone wants to take on that work. I also see an
opportunity to unify some of our helper code for E2E and integration
testing, but that needs more thought and discussion.

**Michelle:** I'm looking forward to making some usability
improvements for some of our tools and infra, and to supporting more
long-term contributions and growth of contributors into long-term
roles within the SIG. If you're interested, hit us up!

Looking ahead, SIG Testing has exciting plans in store. You can get in
touch with the folks at SIG Testing in their [Slack channel](https://kubernetes.slack.com/messages/sig-testing) or attend
one of their regular [bi-weekly meetings on Tuesdays](https://github.com/kubernetes/community/tree/master/sig-testing#meetings). If
you are interested in making it easier for the community to run tests
and contribute test results, to ensure Kubernetes is stable across a
variety of cluster configurations and cloud providers, join the SIG
Testing community today!
