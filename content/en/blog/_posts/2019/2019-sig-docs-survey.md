---
layout: blog
title: "Kubernetes Documentation Survey"
date: 2019-10-29
slug: kubernetes-documentation-end-user-survey
author: >
  [Aimee Ukasick](https://www.linkedin.com/in/aimee-ukasick/),
  and Kubernetes SIG Docs
---

In September, SIG Docs conducted its first survey about the [Kubernetes
documentation](https://kubernetes.io/docs/). We'd like to thank the CNCF's Kim
McMahon for helping us create the survey and access the results.

# Key takeaways

Respondents would like more example code, more detailed content, and more
diagrams in the Concepts, Tasks, and Reference sections.

74% of respondents would like the Tutorials section to contain advanced content.

69.70% said the Kubernetes documentation is the first place they look for
information about Kubernetes.

# Survey methodology and respondents

We conducted the survey in English. The survey was only available for 4 days due
to time constraints. We announced the survey on Kubernetes mailing lists, in
Kubernetes Slack channels, on Twitter, and in Kube Weekly. There were 23
questions, and respondents took an average of 4 minutes to complete the survey.

## Quick facts about respondents:

- 48.48% are experienced Kubernetes users, 26.26% expert, and 25.25% beginner
- 57.58% use Kubernetes in both administrator and developer roles
- 64.65% have been using the Kubernetes documentation for more than 12 months
- 95.96% read the documentation in English

# Question and response highlights

## Why people access the Kubernetes documentation

The majority of respondents stated that they access the documentation for the Concepts.

{{< figure
    src="/images/blog/2019-sig-docs-survey/Q9-k8s-docs-use.png"
    alt="Why respondents access the Kubernetes documentation"
>}}

This deviates only slightly from what we see in Google Analytics: of the top 10
most viewed pages this year, #1 is the kubectl cheatsheet in the Reference section,
followed overwhelmingly by pages in the Concepts section.

## Satisfaction with the documentation

We asked respondents to record their level of satisfaction with the detail in
the Concepts, Tasks, Reference, and Tutorials sections:

- Concepts: 47.96% Moderately Satisfied
- Tasks: 50.54% Moderately Satisfied
- Reference: 40.86% Very Satisfied
- Tutorial: 47.25% Moderately Satisfied

## How SIG Docs can improve each documentation section

We asked how we could improve each section, providing respondents with
selectable answers as well as a text field. The clear majority would like more
example code, more detailed content, more diagrams, and advanced tutorials:

```text
- Personally, would like to see more analogies to help further understanding.
- Would be great if corresponding sections of code were explained too
- Expand on the concepts to bring them together - they're a bucket of separate eels moving in different directions right now
- More diagrams, and more example code
 ```

Respondents used the "Other" text box to record areas causing frustration:

```text
- Keep concepts up to date and accurate
- Keep task topics up to date and accurate. Human testing.
- Overhaul the examples. Many times the output of commands shown is not actual.
- I've never understood how to navigate or interpret the reference section
- Keep the tutorials up to date, or remove them
```

## How SIG Docs can improve the documentation overall

We asked respondents how we can improve the Kubernetes documentation
overall. Some took the opportunity to tell us we are doing a good job:

```text
- For me, it is the best documented open source project.
- Keep going!
- I find the documentation to be excellent.
- You [are] doing a great job. For real.
```

Other respondents provided feedback on the content:

```text
-  ...But since we're talking about docs, more is always better. More
advanced configuration examples would be, to me, the way to go. Like a Use Case page for each
configuration topic with beginner to advanced example scenarios. Something like that would be
awesome....
- More in-depth examples and use cases would be great. I often feel that the Kubernetes
documentation scratches the surface of a topic, which might be great for new users, but it leaves
more experienced users without much "official" guidance on how to implement certain things.
- More production like examples in the resource sections (notably secrets) or links to production like
examples
- It would be great to see a very clear "Quick Start" A->Z up and running like many other tech
projects. There are a handful of almost-quick-starts, but no single guidance. The result is
information overkill.
```

A few respondents provided technical suggestions:

```text
- Make table columns sortable and filterable using a ReactJS or Angular component.
- For most, I think creating documentation with Hugo - a system for static site generation - is not
appropriate. There are better systems for documenting large software project. Specifically, I would
like to see k8s switch to Sphinx for documentation. It has an excellent built-in search, it is easy to
learn if you know markdown, it is widely adopted by other projects (e.g. every software project in
readthedocs.io, linux kernel, docs.python.org etc).
```

Overall, respondents provided constructive criticism focusing on the need for
advanced use cases as well as more in-depth examples, guides, and walkthroughs.

# Where to see more

Survey results summary, charts, and raw data are available in `kubernetes/community` sig-docs [survey](https://github.com/kubernetes/community/tree/master/sig-docs/survey) directory.
