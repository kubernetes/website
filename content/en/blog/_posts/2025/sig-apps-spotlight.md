---
layout: blog
title: "Spotlight on SIG Apps"
slug: sig-apps-spotlight-2025
canonicalUrl: https://www.kubernetes.dev/blog/2025/03/12/sig-apps-spotlight-2025
date: 2025-03-12
author: "Sandipan Panda (DevZero)"
---

In our ongoing SIG Spotlight series, we dive into the heart of the Kubernetes project by talking to
the leaders of its various Special Interest Groups (SIGs). This time, we focus on 
**[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps#apps-special-interest-group)**,
the group responsible for everything related to developing, deploying, and operating applications on
Kubernetes. [Sandipan Panda](https://www.linkedin.com/in/sandipanpanda)
([DevZero](https://www.devzero.io/)) had the opportunity to interview [Maciej
Szulik](https://github.com/soltysh) ([Defense Unicorns](https://defenseunicorns.com/)) and [Janet
Kuo](https://github.com/janetkuo) ([Google](https://about.google/)), the chairs and tech leads of
SIG Apps. They shared their experiences, challenges, and visions for the future of application
management within the Kubernetes ecosystem.

## Introductions

**Sandipan: Hello, could you start by telling us a bit about yourself, your role, and your journey
within the Kubernetes community that led to your current roles in SIG Apps?**

**Maciej**: Hey, my name is Maciej, and I’m one of the leads for SIG Apps. Aside from this role, you
can also find me helping
[SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli#readme) and also being one of
the Steering Committee members. I’ve been contributing to Kubernetes since late 2014 in various
areas, including controllers, apiserver, and kubectl.

**Janet**: Certainly! I'm Janet, a Staff Software Engineer at Google, and I've been deeply involved
with the Kubernetes project since its early days, even before the 1.0 launch in 2015.  It's been an
amazing journey!

My current role within the Kubernetes community is one of the chairs and tech leads of SIG Apps. My
journey with SIG Apps started organically. I started with building the Deployment API and adding
rolling update functionalities. I naturally gravitated towards SIG Apps and became increasingly
involved. Over time, I took on more responsibilities, culminating in my current leadership roles.

## About SIG Apps

*All following answers were jointly provided by Maciej and Janet.*

**Sandipan: For those unfamiliar, could you provide an overview of SIG Apps' mission and objectives?
What key problems does it aim to solve within the Kubernetes ecosystem?**

As described in our
[charter](https://github.com/kubernetes/community/blob/master/sig-apps/charter.md#scope), we cover a
broad area related to developing, deploying, and operating applications on Kubernetes. That, in
short, means we’re open to each and everyone showing up at our bi-weekly meetings and discussing the
ups and downs of writing and deploying various applications on Kubernetes.

**Sandipan: What are some of the most significant projects or initiatives currently being undertaken
by SIG Apps?**

At this point in time, the main factors driving the development of our controllers are the
challenges coming from running various AI-related workloads. It’s worth giving credit here to two
working groups we’ve sponsored over the past years:

1. [The Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch), which is
   looking at running HPC, AI/ML, and data analytics jobs on top of Kubernetes.
2. [The Serving Working Group](https://github.com/kubernetes/community/tree/master/wg-serving), which
   is focusing on hardware-accelerated AI/ML inference.

## Best practices and challenges

**Sandipan: SIG Apps plays a crucial role in developing application management best practices for
Kubernetes. Can you share some of these best practices and how they help improve application
lifecycle management?**

1. Implementing [health checks and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
ensures that your applications are healthy and ready to serve traffic, leading to improved
reliability and uptime. The above, combined with comprehensive logging, monitoring, and tracing
solutions, will provide insights into your application's behavior, enabling you to identify and
resolve issues quickly.

2. [Auto-scale your application](/docs/concepts/workloads/autoscaling/) based
   on resource utilization or custom metrics, optimizing resource usage and ensuring your
   application can handle varying loads.

3. Use Deployment for stateless applications, StatefulSet for stateful applications, Job
   and CronJob for batch workloads, and DaemonSet for running a daemon on each node. Use
   Operators and CRDs to extend the Kubernetes API to automate the deployment, management, and
   lifecycle of complex applications, making them easier to operate and reducing manual
   intervention.

**Sandipan: What are some of the common challenges SIG Apps faces, and how do you address them?**

The biggest challenge we’re facing all the time is the need to reject a lot of features, ideas, and
improvements. This requires a lot of discipline and patience to be able to explain the reasons
behind those decisions.

**Sandipan: How has the evolution of Kubernetes influenced the work of SIG Apps? Are there any
recent changes or upcoming features in Kubernetes that you find particularly relevant or beneficial
for SIG Apps?**

The main benefit for both us and the whole community around SIG Apps is the ability to extend
kubernetes with [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
and the fact that users can build their own custom controllers leveraging the built-in ones to
achieve whatever sophisticated use cases they might have and we, as the core maintainers, haven’t
considered or weren’t able to efficiently resolve inside Kubernetes.

## Contributing to SIG Apps

**Sandipan: What opportunities are available for new contributors who want to get involved with SIG
Apps, and what advice would you give them?**

We get the question, "What good first issue might you recommend we start with?" a lot :-) But
unfortunately, there’s no easy answer to it. We always tell everyone that the best option to start
contributing to core controllers is to find one you are willing to spend some time with. Read
through the code, then try running unit tests and integration tests focusing on that
controller. Once you grasp the general idea, try breaking it and the tests again to verify your
breakage. Once you start feeling confident you understand that particular controller, you may want
to search through open issues affecting that controller and either provide suggestions, explaining
the problem users have, or maybe attempt your first fix.

Like we said, there are no shortcuts on that road; you need to spend the time with the codebase to
understand all the edge cases we’ve slowly built up to get to the point where we are. Once you’re
successful with one controller, you’ll need to repeat that same process with others all over again.

**Sandipan: How does SIG Apps gather feedback from the community, and how is this feedback
integrated into your work?**

We always encourage everyone to show up and present their problems and solutions during our
bi-weekly [meetings](https://github.com/kubernetes/community/tree/master/sig-apps#meetings). As long
as you’re solving an interesting problem on top of Kubernetes and you can provide valuable feedback
about any of the core controllers, we’re always happy to hear from everyone.

## Looking ahead

**Sandipan: Looking ahead, what are the key focus areas or upcoming trends in application management
within Kubernetes that SIG Apps is excited about? How is the SIG adapting to these trends?**

Definitely the current AI hype is the major driving factor; as mentioned above, we have two working
groups, each covering a different aspect of it.

**Sandipan: What are some of your favorite things about this SIG?**

Without a doubt, the people that participate in our meetings and on
[Slack](https://kubernetes.slack.com/messages/sig-apps), who tirelessly help triage issues, pull
requests and invest a lot of their time (very frequently their private time) into making kubernetes
great!

---

SIG Apps is an essential part of the Kubernetes community, helping to shape how applications are
deployed and managed at scale. From its work on improving Kubernetes' workload APIs to driving
innovation in AI/ML application management, SIG Apps is continually adapting to meet the needs of
modern application developers and operators. Whether you’re a new contributor or an experienced
developer, there’s always an opportunity to get involved and make an impact.

If you’re interested in learning more or contributing to SIG Apps, be sure to check out their [SIG
README](https://github.com/kubernetes/community/tree/master/sig-apps) and join their bi-weekly [meetings](https://github.com/kubernetes/community/tree/master/sig-apps#meetings).

- [SIG Apps Mailing List](https://groups.google.com/a/kubernetes.io/g/sig-apps)
- [SIG Apps on Slack](https://kubernetes.slack.com/messages/sig-apps)
