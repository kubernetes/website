---
layout: blog
title: "Spotlight on SIG etcd"
slug: sig-etcd-spotlight
canonicalUrl: https://www.kubernetes.dev/blog/2025/02/19/sig-etcd-spotlight
date: 2025-03-04
author: "Frederico Muñoz (SAS Institute)"
---

In this SIG etcd spotlight we talked with [James Blair](https://github.com/jmhbnz), [Marek
Siarkowicz](https://github.com/serathius), [Wenjia Zhang](https://github.com/wenjiaswe), and
[Benjamin Wang](https://github.com/ahrtr) to learn a bit more about this Kubernetes Special Interest
Group.

## Introducing SIG etcd

**Frederico: Hello, thank you for the time! Let’s start with some introductions, could you tell us a
bit about yourself, your role and how you got involved in Kubernetes.**

**Benjamin:** Hello, I am Benjamin. I am a SIG etcd Tech Lead and one of the etcd maintainers. I
work for VMware, which is part of the Broadcom group. I got involved in Kubernetes & etcd & CSI
([Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)) 
because of work and also a big passion for open source. I have been working on Kubernetes & etcd
(and also CSI) since 2020.

**James:** Hey team, I’m James, a co-chair for SIG etcd and etcd maintainer. I work at Red Hat as a
Specialist Architect helping people adopt cloud native technology. I got involved with the
Kubernetes ecosystem in 2019. Around the end of 2022 I noticed how the etcd community and project
needed help so started contributing as often as I could. There is a saying in our community that
"you come for the technology, and stay for the people": for me this is absolutely real, it’s been a
wonderful journey so far and I’m excited to support our community moving forward.

**Marek:** Hey everyone, I'm Marek, the SIG etcd lead. At Google, I lead the GKE etcd team, ensuring
a stable and reliable experience for all GKE users. My Kubernetes journey began with [SIG
Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation), where I
created and led the [Kubernetes Structured Logging effort](https://kubernetes.io/blog/2020/09/04/kubernetes-1-19-introducing-structured-logs/).  
I'm still the main project lead for [Kubernetes Metrics Server](https://kubernetes-sigs.github.io/metrics-server/), 
providing crucial signals for autoscaling in Kubernetes. I started working on etcd 3 years ago,
right around the 3.5 release. We faced some challenges, but I'm thrilled to see etcd now the most
scalable and reliable it's ever been, with the highest contribution numbers in the project's
history. I'm passionate about distributed systems, extreme programming, and testing.

**Wenjia:** Hi there, my name is Wenjia, I am the co-chair of SIG etcd and one of the etcd
maintainers. I work at Google as an Engineering Manager, working on GKE (Google Kubernetes Engine)
and GDC (Google Distributed Cloud).  I have been working in the area of open source Kubernetes and
etcd since the Kubernetes v1.10 and etcd v3.1 releases. I got involved in Kubernetes because of my
job, but what keeps me in the space is the charm of the container orchestration technology, and more
importantly, the awesome open source community.

## Becoming a Kubernetes Special Interest Group (SIG)

**Frederico: Excellent, thank you. I'd like to start with the origin of the SIG itself: SIG etcd is
a very recent SIG, could you quickly go through the history and reasons behind its creation?**
 
**Marek**: Absolutely! SIG etcd was formed because etcd is a critical component of Kubernetes,
serving as its data store. However, etcd was facing challenges like maintainer turnover and
reliability issues. [Creating a dedicated SIG](https://etcd.io/blog/2023/introducing-sig-etcd/)
allowed us to focus on addressing these problems, improving development and maintenance processes,
and ensuring etcd evolves in sync with the cloud-native landscape.

**Frederico: And has becoming a SIG worked out as expected? Better yet, are the motivations you just
described being addressed, and to what extent?**

**Marek**: It's been a positive change overall. Becoming a SIG has brought more structure and
transparency to etcd's development. We've adopted Kubernetes processes like KEPs
([Kubernetes Enhancement Proposals](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) 
and PRRs ([Production Readiness Reviews](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md),
which has improved our feature development and release cycle.

**Frederico: On top of those, what would you single out as the major benefit that has resulted from
becoming a SIG?**

**Marek**: The biggest benefits for me was adopting Kubernetes testing infrastructure, tools like
[Prow](https://docs.prow.k8s.io/) and [TestGrid](https://testgrid.k8s.io/). For large projects like
etcd there is just no comparison to the default GitHub tooling. Having known, easy to use, clear
tools is a major boost to the etcd as it makes it much easier for Kubernetes contributors to also
help etcd.

**Wenjia**: Totally agree, while challenges remain, the SIG structure provides a solid foundation
for addressing them and ensuring etcd's continued success as a critical component of the Kubernetes
ecosystem.

The positive impact on the community is another crucial aspect of SIG etcd's success that I’d like
to highlight. The Kubernetes SIG structure has created a welcoming environment for etcd
contributors, leading to increased participation from the broader Kubernetes community.  We have had
greater collaboration with other SIGs like [SIG API
Machinery](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md), 
[SIG Scalability](https://github.com/kubernetes/community/tree/master/sig-scalability), 
[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-scalability), 
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle), etc. 

This collaboration helps ensure etcd's development aligns with the needs of the wider Kubernetes
ecosystem. The formation of the [etcd Operator Working Group](https://github.com/kubernetes/community/blob/master/wg-etcd-operator/README.md) 
under the joint effort between SIG etcd and SIG Cluster Lifecycle exemplifies this successful
collaboration, demonstrating a shared commitment to improving etcd's operational aspects within
Kubernetes.

**Frederico: Since you mentioned collaboration, have you seen changes in terms of contributors and
community involvement in recent months?**

**James**: Yes -- as showing in our 
[unique PR author data](https://etcd.devstats.cncf.io/d/23/prs-authors-repository-groups?orgId=1&var-period=m&var-repogroup_name=All&from=1422748800000&to=1738454399000)
we recently hit an all time high in March and are trending in a positive direction:

{{< figure src="stats.png" alt="Unique PR author data stats" >}}

Additionally, looking at our 
[overall contributions across all etcd project repositories](https://etcd.devstats.cncf.io/d/74/contributions-chart?orgId=1&from=1422748800000&to=1738454399000&var-period=m&var-metric=contributions&var-repogroup_name=All&var-country_name=All&var-company_name=All&var-company=all) 
we are also observing a positive trend showing a resurgence in etcd project activity:

{{< figure src="stats2.png" alt="Overall contributions stats" >}}

## The road ahead

**Frederico: That's quite telling, thank you. In terms of the near future, what are the current
priorities for SIG etcd?**

**Marek**: Reliability is always top of mind -– we need to make sure etcd is rock-solid. We're also
working on making etcd easier to use and manage for operators. And we have our sights set on making
etcd a viable standalone solution for infrastructure management, not just for Kubernetes. Oh, and of
course, scaling -– we need to ensure etcd can handle the growing demands of the cloud-native world.

**Benjamin**: I agree that reliability should always be our top guiding principle. We need to ensure
not only correctness but also compatibility. Additionally, we should continuously strive to improve
the understandability and maintainability of etcd. Our focus should be on addressing the pain points
that the community cares about the most.

**Frederico: Are there any specific SIGs that you work closely with?**

**Marek**: SIG API Machinery, for sure – they own the structure of the data etcd stores, so we're
constantly working together. And SIG Cluster Lifecycle – etcd is a key part of Kubernetes clusters,
so we collaborate on the newly created etcd operator Working group.

**Wenjia**: Other than SIG API Machinery and SIG Cluster Lifecycle that Marek mentioned above, SIG
Scalability and SIG Testing is another group that we work closely with.

**Frederico: In a more general sense, how would you list the key challenges for SIG etcd in the
evolving cloud native landscape?**

**Marek**: Well, reliability is always a challenge when you're dealing with critical data. The
cloud-native world is evolving so fast that scaling to meet those demands is a constant effort.

## Getting involved

**Frederico: We're almost at the end of our conversation, but for those interested in in etcd, how
can they get involved?**

**Marek**: We'd love to have them! The best way to start is to join our 
[SIG etcd meetings](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md#meetings), 
follow discussions on the [etcd-dev mailing list](https://groups.google.com/g/etcd-dev), and check
out our [GitHub issues](https://github.com/etcd-io/etcd/issues). We're always looking for people to
review proposals, test code, and contribute to documentation.

**Wenjia**: I love this question 😀 . There are numerous ways for people interested in contributing
to SIG etcd to get involved and make a difference. Here are some key areas where you can help:

**Code Contributions**:
 - _Bug Fixes_: Tackle existing issues in the etcd codebase. Start with issues labeled "good first
issue" or "help wanted" to find tasks that are suitable for newcomers.
 - _Feature Development_: Contribute to the development of new features and enhancements. Check the
etcd roadmap and discussions to see what's being planned and where your skills might fit in.
 - _Testing and Code Reviews_: Help ensure the quality of etcd by writing tests, reviewing code
   changes, and providing feedback.
 - _Documentation_: Improve [etcd's documentation](https://etcd.io/docs/) by adding new content,
   clarifying existing information, or fixing errors. Clear and comprehensive documentation is
   essential for users and contributors.
 - _Community Support_: Answer questions on forums, mailing lists, or [Slack  channels](https://kubernetes.slack.com/archives/C3HD8ARJ5). 
   Helping others understand and use etcd is a valuable contribution.

**Getting Started**:
- _Join the community_: Start by joining the etcd community on Slack,
  attending SIG meetings, and following the mailing lists. This will
  help you get familiar with the project, its processes, and the
  people involved.
- _Find a mentor_: If you're new to open source or etcd, consider
  finding a mentor who can guide you and provide support. Stay tuned!
  Our first cohort of mentorship program was very successful. We will
  have a new round of mentorship program coming up.
- _Start small_: Don't be afraid to start with small contributions. Even
  fixing a typo in the documentation or submitting a simple bug fix
  can be a great way to get involved.

By contributing to etcd, you'll not only be helping to improve a
critical piece of the cloud-native ecosystem but also gaining valuable
experience and skills. So, jump in and start contributing!

**Frederico: Excellent, thank you. Lastly, one piece of advice that
you'd like to give to other newly formed SIGs?**

**Marek**: Absolutely! My advice would be to embrace the established
processes of the larger community, prioritize collaboration with other
SIGs, and focus on building a strong community.

**Wenjia**: Here are some tips I myself found very helpful in my OSS
journey:
- _Be patient_: Open source development can take time. Don't get
  discouraged if your contributions aren't accepted immediately or if
  you encounter challenges.
- _Be respectful_: The etcd community values collaboration and
respect. Be mindful of others' opinions and work together to achieve
common goals.
- _Have fun_: Contributing to open source should be
enjoyable. Find areas that interest you and contribute in ways that
you find fulfilling.

**Frederico: A great way to end this spotlight, thank you all!**

---

For more information and resources, please take a look at :

1. etcd website: https://etcd.io/
2. etcd GitHub repository: https://github.com/etcd-io/etcd 
3. etcd community: https://etcd.io/community/
