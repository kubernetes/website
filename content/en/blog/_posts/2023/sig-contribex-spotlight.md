---
layout: blog
title: "Spotlight on SIG ContribEx"
date: 2023-08-14
slug: sig-contribex-spotlight-2023
canonicalUrl: https://www.kubernetes.dev/blog/2023/08/14/sig-contribex-spotlight-2023/
author: >
  Fyka Ansari
---

Welcome to the world of Kubernetes and its vibrant contributor
community! In this blog post, we'll be shining a spotlight on the
[Special Interest Group for Contributor
Experience](https://github.com/kubernetes/community/blob/master/sig-contributor-experience/README.md)
(SIG ContribEx), an essential component of the Kubernetes project.

SIG ContribEx in Kubernetes is responsible for developing and
maintaining a healthy and productive community of contributors to the
project. This involves identifying and addressing bottlenecks that may
hinder the project's growth and feature velocity, such as pull request
latency and the number of open pull requests and issues.

SIG ContribEx works to improve the overall contributor experience by
creating and maintaining guidelines, tools, and processes that
facilitate collaboration and communication among contributors. They
also focus on community building and support, including outreach
programs and mentorship initiatives to onboard and retain new
contributors.

Ultimately, the role of SIG ContribEx is to foster a welcoming and
inclusive environment that encourages contribution and supports the
long-term sustainability of the Kubernetes project.

In this blog post, [Fyka Ansari](https://twitter.com/1fyka) interviews
[Kaslin Fields](https://twitter.com/kaslinfields), a DevRel Engineer
at Google, who is a chair of SIG ContribEx, and [Madhav
Jivrajani](https://twitter.com/MadhavJivrajani), a Software Engineer
at VMWare who serves as a SIG ContribEx Tech Lead. This interview
covers various aspects of SIG ContribEx, including current
initiatives, exciting developments, and how interested individuals can
get involved and contribute to the group. It provides valuable
insights into the workings of SIG ContribEx and highlights the
importance of its role in the Kubernetes ecosystem.

### Introductions

**Fyka:** Let's start by diving into your background and how you got
involved in the Kubernetes ecosystem. Can you tell us more about that
journey?

**Kaslin:** I first got involved in the Kubernetes ecosystem through
my mentor, Jonathan Rippy, who introduced me to containers during my
early days in tech. Eventually, I transitioned to a team working with
containers, which sparked my interest in Kubernetes when it was
announced. While researching Kubernetes in that role, I eagerly sought
opportunities to engage with the containers/Kubernetes community. It
was not until my subsequent job that I found a suitable role to
contribute consistently. I joined SIG ContribEx, specifically in the
Contributor Comms subproject, to both deepen my knowledge of
Kubernetes and support the community better.

**Madhav:** My journey with Kubernetes began when I was a student,
searching for interesting and exciting projects to work on. With my
peers, I discovered open source and attended The New Contributor
Workshop organized by the Kubernetes community. The workshop not only
provided valuable insights into the community structure but also gave
me a sense of warmth and welcome, which motivated me to join and
remain involved. I realized that collaboration is at the heart of
open-source communities, and to get answers and support, I needed to
contribute and do my part. I started working on issues in ContribEx,
particularly focusing on GitHub automation, despite not fully
understanding the task at first. I continued to contribute for various
technical and non-technical aspects of the project, finding it to be
one of the most professionally rewarding experiences in my life.

**Fyka:** That's such an inspiration in itself! I'm sure beginners who
are reading this got the ultimate motivation to take their first
steps. Embracing the Learning journey, seeking mentorship, and
engaging with the Kubernetes community can pave the way for exciting
opportunities in the tech industry. Your stories proved the importance
of starting small and being proactive, just like Madhav said Don't be
afraid to take on tasks, even if you're uncertain at first.

###  Primary goals and scope

**Fyka:** Given your experience as a member of SIG ContribEx, could
you tell us a bit about the group's primary goals and initiatives? Its
current focus areas? What do you see as the scope of SIG ContribEx and
the impact it has on the Kubernetes community?

**Kaslin:** SIG ContribEx's primary goals are to simplify the
contributions of Kubernetes contributors and foster a welcoming
community. It collaborates with other Kubernetes SIGs, such as
planning the Contributor Summit at KubeCon, ensuring it meets the
needs of various groups. The group's impact is evident in projects
like updating org membership policies and managing critical platforms
like Zoom, YouTube, and Slack. Its scope encompasses making the
contributor experience smoother and supporting the overall Kubernetes
community.

**Madhav:** The Kubernetes project has vertical SIGs and cross-cutting
SIGs, ContribEx is a deeply cross-cutting SIG, impacting virtually
every area of the Kubernetes community. Adding to Kaslin,
sustainability in the Kubernetes project and community is critical now
more than ever, it plays a central role in addressing critical issues,
such as maintainer succession, by facilitating cohorts for SIGs to
train experienced community members to take on leadership
roles. Excellent examples include SIG CLI and SIG Apps, leading to the
onboarding of new reviewers. Additionally, SIG ContribEx is essential
in managing GitHub automation tools, including bots and commands used
by contributors for interacting with [Prow](https://docs.prow.k8s.io/)
and other automation (label syncing, group and GitHub team management,
etc).

### Beginner's guide!

**Fyka:** I'll never forget talking to Kaslin when I joined the
community and needed help with contributing. Kaslin, your quick and
clear answers were a huge help in getting me started. Can you both
give some tips for people new to contributing to Kubernetes? What
makes SIG ContribEx a great starting point? Why should beginners and
current contributors consider it? And what cool opportunities are
there for newbies to jump in?

**Kaslin:** If you want to contribute to Kubernetes for the first
time, it can be overwhelming to know where to start. A good option is
to join SIG ContribEx as it offers great opportunities to know and
serve the community. Within SIG ContribEx, various subprojects allow
you to explore different parts of the Kubernetes project while you
learn how contributions work. Once you know a bit more, it’s common
for you to move to other SIGs within the project, and we think that’s
wonderful. While many newcomers look for "good first issues" to start
with, these opportunities can be scarce and get claimed
quickly. Instead, the real benefit lies in attending meetings and
getting to know the community. As you learn more about the project and
the people involved, you'll be better equipped to offer your help, and
the community will be more inclined to seek your assistance when
needed. As a co-lead for the Contributor Comms subproject, I can
confidently say that it's an excellent place for beginners to get
involved. We have supportive leads and particularly beginner-friendly
projects too.

**Madhav:** To begin, read the [SIG
README](https://github.com/kubernetes/community/tree/master#readme) on
GitHub, which provides an overview of the projects the SIG
manages. While attending meetings is beneficial for all SIGs, it's
especially recommended for SIG ContribEx, as each subproject gets
dedicated slots for updates and areas that need help. If you can't
attend in real-time due to time zone differences, you can catch the
meeting recordings or
[Notes](https://docs.google.com/document/d/1K3vjCZ9C3LwYrOJOhztQtFuDQCe-urv-ewx1bI8IPVQ/edit?usp=sharing)
later.

### Skills you learn!

**Fyka:** What skills do you look for when bringing in new
contributors to SIG ContribEx, from passion to expertise?
Additionally, what skills can contributors expect to develop while
working with SIG ContribEx?

**Kaslin:** Skills folks need to have or will acquire vary depending
on what area of ContribEx they work upon. Even within a subproject, a
range of skills can be useful and/or developed. For example, the tech
lead role involves technical tasks and overseeing automation, while
the social media lead role requires excellent communication
skills. Working with SIG ContribEx allows contributors to acquire
various skills based on their chosen subproject. By participating in
meetings, listening, learning, and taking on tasks related to their
interests, they can develop and hone these skills. Some subprojects
may require more specialized skills, like program management for the
mentoring project, but all contributors can benefit from offering
their talents to help teach others and contribute to the community.

### Sub-projects under SIG ContribEx

**Fyka:** SIG ContribEx has several smaller projects. Can you tell me
about the aims of these projects and how they've impacted the
Kubernetes community?

**Kaslin:** Some SIGs have one or two subprojects and some have none
at all, but in SIG ContribEx, we have ELEVEN!

Here’s a list of them and their respective mission statements

1.  **Community**: Manages the community repository, documentation,
    and operations.
2.  **Community management**: Handles communication platforms and
    policies for the community.
3.  **Contributor-comms**: Focuses on promoting the success of
    Kubernetes contributors through marketing.
4.  **Contributors-documentation**: Writes and maintains documentation
    for contributing to Kubernetes.
5.  **Devstats**: Maintains and updates the [Kubernetes
    statistics](https://k8s.devstats.cncf.io) website.
6.  **Elections**: Oversees community elections and maintains related
    documentation and software.
7.  **Events**: Organizes contributor-focused events like the
    Contributor Summit.
8.  **Github management**: Manages permissions, repositories, and
    groups on GitHub.
9.  **Mentoring**: Develop programs to help contributors progress in
    their contributions.
10.  **Sigs-GitHub-actions**: Repository for GitHub actions related to
     all SIGs in Kubernetes.
11.  **Slack-infra**: Creates and maintains tools and automation for
     Kubernetes Slack.


**Madhav:** Also, Devstats is critical from a sustainability
standpoint!

_(If you are willing to learn more and get involved with any of these
sub-projects, check out the_ [SIG ContribEx
README](https://github.com/kubernetes/community/blob/master/sig-contributor-experience/README.md#subprojects))._

### Accomplishments

**Fyka:** With that said, any SIG-related accomplishment that you’re
proud of?

**Kaslin:** I'm proud of the accomplishments made by SIG ContribEx and
its contributors in supporting the community. Some of the recent
achievements include:

1.  _Establishment of the elections subproject_: Kubernetes is a massive
    project, and ensuring smooth leadership transitions is
    crucial. The contributors in this subproject organize fair and
    consistent elections, which helps keep the project running
    effectively.
2.  _New issue triage proces_: With such a large open-source project
    like Kubernetes, there's always a lot of work to be done. To
    ensure things progress safely, we implemented new labels and
    updated functionality for issue triage using our PROW tool. This
    reduces bottlenecks in the workflow and allows leaders to
    accomplish more.
3.  _New org membership requirements_: Becoming an org member in
    Kubernetes can be overwhelming for newcomers. We view org
    membership as a significant milestone for contributors aiming to
    take on leadership roles. We recently updated the rules to
    automatically remove privileges from inactive members, making sure
    that the right people have access to the necessary tools and
    responsibilities.

Overall, these accomplishments have greatly benefited our fellow
contributors and strengthened the Kubernetes community.

### Upcoming initiatives

**Fyka:** Could you give us a sneak peek into what's next for the
group? We're excited to hear about upcoming projects and initiatives
from this dynamic team.

**Madhav:** We’d love for more groups to sign up for mentoring
cohorts! We’re probably going to have to spend some time polishing the
process around that.

### Final thoughts

**Fyka:** As we wrap up our conversation, would you like to share some
final thoughts for those interested in contributing to SIG ContribEx
or getting involved with Kubernetes?

**Madhav**: Kubernetes is meant to be overwhelming and difficult
initially! You’re coming into something that’s taken multiple people,
from multiple countries, multiple years to build. Embrace that
diversity! Use the high entropy initially to collide around and gain
as much knowledge about the project and community as possible before
you decide to settle in your niche.

**Fyka:** Thank You Madhav and Kaslin, it was an absolute pleasure
chatting about SIG ContribEx and your experiences as a member. It's
clear that the role of SIG ContribEx in Kubernetes is significant and
essential, ensuring scalability, growth and productivity, and I hope
this interview inspires more people to get involved and contribute to
Kubernetes. I wish SIG ContribEx all the best, and can't wait to see
what exciting things lie ahead!

## What next?

We love meeting new contributors and helping them in investigating
different Kubernetes project spaces. If you are interested in getting
more involved with SIG ContribEx, here are some resources for you to
get started:

* [GitHub](https://github.com/kubernetes/community/tree/master/sig-contributor-experience#contributor-experience-special-interest-group)
* [Mailing list](https://groups.google.com/g/kubernetes-sig-contribex)
* [Open Community
  Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fcontributor-experience)
* [Slack](https://slack.k8s.io/)
* [Slack channel
  #sig-contribex](https://kubernetes.slack.com/messages/sig-contribex)
* SIG Contribex also hosted a [KubeCon
    talk](https://youtu.be/5Bs1bs6iFmY) about studying Kubernetes
    Contributor experiences.
