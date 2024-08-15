---
layout: blog
title: "Spotlight on SIG Architecture: Conformance"
slug: sig-architecture-conformance-spotlight-2023
date: 2023-10-05
canonicalUrl: https://www.k8s.dev/blog/2023/10/05/sig-architecture-conformance-spotlight-2023/
author: >
  Frederico Muñoz (SAS Institute)
---

_This is the first interview of a SIG Architecture Spotlight series
that will cover the different subprojects. We start with the SIG
Architecture: Conformance subproject_

In this [SIG
Architecture](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md)
spotlight, we talked with [Riaan
Kleinhans](https://github.com/Riaankl) (ii.nz), Lead for the
[Conformance
sub-project](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#conformance-definition-1).

## About SIG Architecture and the Conformance subproject

**Frederico (FSM)**: Hello Riaan, and welcome! For starters, tell us a
bit about yourself, your role and how you got involved in Kubernetes.

**Riaan Kleinhans (RK)**: Hi! My name is Riaan Kleinhans and I live in
South Africa. I am the Project manager for the [ii.nz](https://ii.nz) team in New
Zealand. When I joined ii the plan was to move to New Zealand in April
2020 and then Covid happened. Fortunately, being a flexible and
dynamic team we were able to make it work remotely and in very
different time zones.

The ii team have been tasked with managing the Kubernetes Conformance
testing technical debt and writing tests to clear the technical
debt. I stepped into the role of project manager to be the link
between monitoring, test writing and the community. Through that work
I had the privilege of meeting [Dan Kohn](https://github.com/dankohn)
in those first months, his enthusiasm about the work we were doing was
a great inspiration.

**FSM**: Thank you - so, your involvement in SIG Architecture started
because of the conformance work?

**RK**: SIG Architecture is the home for the Kubernetes Conformance
subproject. Initially, most of my interactions were directly with SIG
Architecture through the Conformance sub-project. However, as we
began organizing the work by SIG, we started engaging directly with
each individual SIG. These engagements with the SIGs that own the
untested APIs have helped us accelerate our work.

**FSM**: How would you describe the main goals and
areas of intervention of the Conformance sub-project?

**RM**: The Kubernetes Conformance sub-project focuses on guaranteeing
compatibility and adherence to the Kubernetes specification by
developing and maintaining a comprehensive conformance test suite. Its
main goals include assuring compatibility across different Kubernetes
implementations, verifying adherence to the API specification,
supporting the ecosystem by encouraging conformance certification, and
fostering collaboration within the Kubernetes community. By providing
standardised tests and promoting consistent behaviour and
functionality, the Conformance subproject ensures a reliable and
compatible Kubernetes ecosystem for developers and users alike.

## More on the Conformance Test Suite

**FSM**: A part of providing those standardised tests is, I believe,
the [Conformance Test
Suite](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md). Could
you explain what it is and its importance?

**RK**: The Kubernetes Conformance Test Suite checks if Kubernetes
distributions meet the project's specifications, ensuring
compatibility across different implementations. It covers various
features like APIs, networking, storage, scheduling, and
security. Passing the tests confirms proper implementation and
promotes a consistent and portable container orchestration platform.

**FSM**: Right, the tests are important in the way they define the
minimum features that any Kubernetes cluster must support. Could you
describe the process around determining which features are considered
for inclusion? Is there any tension between a more minimal approach,
and proposals from the other SIGs?

**RK**: The requirements for each endpoint that undergoes conformance
testing are clearly defined by SIG Architecture. Only API endpoints
that are generally available and non-optional features are eligible
for conformance. Over the years, there have been several discussions
regarding conformance profiles, exploring the possibility of including
optional endpoints like RBAC, which are widely used by most end users,
in specific profiles. However, this aspect is still a work in
progress.

Endpoints that do not meet the conformance criteria are listed in
[ineligible_endpoints.yaml](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/ineligible_endpoints.yaml),
which is publicly accessible in the Kubernetes repo. This file can be
updated to add or remove endpoints as their status or requirements
change. These ineligible endpoints are also visible on
[APISnoop](https://apisnoop.cncf.io/).

Ensuring transparency and incorporating community input regarding the
eligibility or ineligibility of endpoints is of utmost importance to
SIG Architecture.

**FSM**: Writing tests for new features is something generally
requires some kind of enforcement. How do you see the evolution of
this in Kubernetes? Was there a specific effort to improve the process
in a way that required tests would be a first-class citizen, or was
that never an issue?

**RK**: When discussions surrounding the Kubernetes conformance
programme began in 2018, only approximately 11% of endpoints were
covered by tests. At that time, the CNCF's governing board requested
that if funding were to be provided for the work to cover missing
conformance tests, the Kubernetes Community should adopt a policy of
not allowing new features to be added unless they include conformance
tests for their stable APIs.

SIG Architecture is responsible for stewarding this requirement, and
[APISnoop](https://apisnoop.cncf.io/) has proven to be an invaluable
tool in this regard. Through automation, APISnoop generates a pull
request every weekend to highlight any discrepancies in Conformance
coverage. If any endpoints are promoted to General Availability
without a conformance test, it will be promptly identified. This
approach helps prevent the accumulation of new technical debt.

Additionally, there are plans in the near future to create a release
informing job, which will add an additional layer to prevent any new
technical debt.

**FSM**: I see, tooling and automation play an important role
there. What are, in your opinion, the areas that, conformance-wise,
still require some work to be done? In other words, what are the
current priority areas marked for improvement?

**RK**: We have reached the “100% Conformance Tested” milestone in
release 1.27!

At that point, the community took another look at all the endpoints
that were listed as ineligible for conformance. The list was populated
through community input over several years.  Several endpoints
that were previously deemed ineligible for conformance have been
identified and relocated to a new dedicated list, which is currently
receiving focused attention for conformance test development. Again,
that list can also be checked on apisnoop.cncf.io.

To ensure the avoidance of new technical debt in the conformance
project, there are upcoming plans to establish a release informing job
as an additional preventive measure.

While APISnoop is currently hosted on CNCF infrastructure, the project
has been generously donated to the Kubernetes community. Consequently,
it will be transferred to community-owned infrastructure before the
end of 2023.

**FSM**: That's great news! For anyone wanting to help, what are the
venues for collaboration that you would highlight? Do all of them
require solid knowledge of Kubernetes as a whole, or are there ways
someone newer to the project can contribute?

**RK**: Contributing to conformance testing is akin to the task of
"washing the dishes" – it may not be highly visible, but it remains
incredibly important. It necessitates a strong understanding of
Kubernetes, particularly in the areas where the endpoints need to be
tested. This is why working with each SIG that owns the API endpoint
being tested is so important.

As part of our commitment to making test writing accessible to
everyone, the ii team is currently engaged in the development of a
"click and deploy" solution. This solution aims to enable anyone to
swiftly create a working environment on real hardware within
minutes. We will share updates regarding this development as soon as
we are ready.

**FSM**: That's very helpful, thank you. Any final comments you would
like to share with our readers?

**RK**: Conformance testing is a collaborative community endeavour that
involves extensive cooperation among SIGs. SIG Architecture has
spearheaded the initiative and provided guidance. However, the
progress of the work relies heavily on the support of all SIGs in
reviewing, enhancing, and endorsing the tests.

I would like to extend my sincere appreciation to the ii team for
their unwavering commitment to resolving technical debt over the
years. In particular, [Hippie Hacker](https://github.com/hh)'s
guidance and stewardship of the vision has been
invaluable. Additionally, I want to give special recognition to
Stephen Heywood for shouldering the majority of the test writing
workload in recent releases, as well as to Zach Mandeville for his
contributions to APISnoop.

**FSM**: Many thanks for your availability and insightful comments,
I've personally learned quite a bit with it and I'm sure our readers
will as well.
