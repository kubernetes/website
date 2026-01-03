---
layout: blog
title: "Reviewing 2019 in Docs"
date: 2020-01-21
slug: reviewing-2019-in-docs
author: >
  Zach Corleissen (Cloud Native Computing Foundation)
---

Hi, folks! I'm one of the co-chairs for the Kubernetes documentation special interest group (SIG Docs). This blog post is a review of SIG Docs in 2019. Our contributors did amazing work last year, and I want to highlight their successes. 

Although I review 2019 in this post, my goal is to point forward to 2020. I observe some trends in SIG Docs–some good, others troubling. I want to raise visibility before those challenges increase in severity.

## The good

There was much to celebrate in SIG Docs in 2019.

Kubernetes docs started the year with three localizations in progress. By the end of the year, we ended with ten localizations available, four of which (Chinese, French, Japanese, Korean) are reasonably complete. The Korean and French teams deserve special mentions for their contributions to git best practices across all localizations (Korean team) and help bootstrapping other localizations (French team).

Despite significant transition over the year, SIG Docs [improved its review velocity](https://k8s.devstats.cncf.io/d/44/pr-time-to-approve-and-merge?orgId=1&var-period=w&var-repogroup_name=SIG%20Docs&var-apichange=All&var-size_name=All&var-kind_name=All), with a median review time from PR open to merge of just over 24 hours. 

Issue triage improved significantly in both volume and speed, largely due to the efforts of GitHub users @sftim, @tengqm, and @kbhawkey. 

Doc sprints remain valuable at KubeCon contributor days, introducing new contributors to Kubernetes documentation.

The docs component of Kubernetes quarterly releases improved over 2019, thanks to iterative playbook improvements from release leads and their teams.

Site traffic increased over the year. The website ended the year with ~6 million page views per month in December, up from ~5M page views in January. The kubernetes.io website had 851k site visitors in October, a new all-time high. Reader satisfaction [remains general](https://kubernetes.io/blog/2019/10/29/kubernetes-documentation-end-user-survey/).

We onboarded a new SIG chair: @jimangel, a Cloud Architect at General Motors. Jim was a docs contributor for a year, during which he led the 1.14 docs release, before stepping up as chair.



## The not so good

While reader satisfaction is decent, **most respondents indicated dissatisfaction with stale content** in every area: concepts, tasks, tutorials, and reference. Additionally, readers requested more diagrams, advanced conceptual content, and code samples&mdash;things that technical writers excel at providing.

SIG Docs continues to solve how best to handle [third-party content](https://github.com/kubernetes/enhancements/pull/1327). **There's too much vendor content on kubernetes.io**, and guidelines for adding or rejecting third-party content remain unclear. The discussion so far has been powerful, including pushback demanding greater collaborative input&mdash;a powerful reminder that Kubernetes is in all ways a communal effort.


We're in the middle of our third chair transition in 18 months. Each chair transition has been healthy and collegial, but it's still a lot of turnover in a short time. Chairing any open source project is difficult, but especially so with SIG Docs. Chairship of SIG Docs requires a steep learning curve across multiple domains: docs (both written and generated from spec), information architecture, specialized contribution paths (for example, localization), how to run a release cycle, website development, CI/CD, community management, on and on. It's a role that requires multiple people to function successfully without burning people out. Training replacements is time-intensive.

Perhaps most pressing in the Not So Good category is that SIG Docs currently has only one technical writer dedicated full-time to Kubernetes docs. This has impacts on Kubernetes docs: some obvious, some less so.

## Impacts of understaffing on Kubernetes docs

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Me today: <a href="https://t.co/cDpHOWEsjf">pic.twitter.com/cDpHOWEsjf</a></p>&mdash; Benjamin Elder (@BenTheElder) <a href="https://twitter.com/BenTheElder/status/1215453579651104768?ref_src=twsrc%5Etfw">January 10, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If Kubernetes continues through 2020 without more technical writers dedicated to the docs, here's what I see as the most likely possibilities.

### But first, a disclaimer

{{< caution >}}

It is very hard to predict, especially the future.
-Niels Bohr

{{< /caution >}}


Some of my predictions are almost certainly wrong. Any errors are mine alone. 

That said...

### Effects in 2020

Current levels of function aren't self-sustaining. Even with a strong playbook, the release cycle still requires expert support from at least one (and usually two) chairs during every cycle. Without fail, each release breaks in new and unexpected ways, and it requires familiarity and expertise to diagnose and resolve. As chairs continue to cycle&mdash;and to be clear, regular transitions are part of a healthy project&mdash;we accrue the risks associated with a pool lacking sufficient professional depth and employer support.

Oddly enough, one of the challenges to staffing is that the docs appear good enough. Based on site analytics and survey responses, readers are pleased with the quality of the docs. When folks visit the site, they generally find what they need and behave like satisfied visitors.

The danger is that this will change over time: slowly with occasional losses of function, annoying at first, then increasingly critical. The more time passes without adequate staffing, the more difficult and costly fixes will become.

I suspect this is true because the challenges we face now at decent levels of reader satisfaction are already difficult to fix. API reference generation is complex and brittle; the site's UI is outdated; and our most consistent requests are for more tutorials, advanced concepts, diagrams, and code samples, all of which require ongoing, dedicated time to create.

**Release support remains strong.**

The release team continues a solid habit of leaving each successive team with better support than the previous release. This mostly takes the form of iterative improvements to the [docs release playbook](https://github.com/kubernetes/community/tree/master/sig-release#docs-lead), producing better documentation and reducing siloed knowledge.

**Staleness accelerates.**

Conceptual content becomes less accurate or relevant as features change or deprecate. Tutorial content degrades for the same reason.

The content structure will also degrade: the categories of concepts, tasks, and tutorials are legacy categories that may not best fit the needs of current readers, let alone future ones.

Cruft accumulates for both readers and contributors. Reference docs become increasingly brittle without intervention. 

**Critical knowledge vanishes.**

As I mentioned previously, SIG Docs has a wide range of functions, some with a steep learning curve. As contributors change roles or jobs, their expertise and availability will diminish or reduce to zero. Contributors with specific knowledge may not be available for consultation, exposing critical vulnerabilities in docs function. Specific examples include reference generation and chair leadership.

### That's a lot to take in

It's difficult to strike a balance between the importance of SIG Docs' work to the community and our users, the joy it brings me personally, and the fact that things can't remain as they are without significant negative impacts (eventually). SIG Docs is by no means dying; it's a vibrant community with active contributors doing cool things. It's also a community with some critical knowledge and capacity shortages that can only be remedied with trained, paid staff dedicated to documentation.

## What the community can do for healthy docs

Hire technical writers dedicated to Kubernetes docs. Support advanced content creation, not just release docs and incremental feature updates.

Thanks, and Happy 2020.
