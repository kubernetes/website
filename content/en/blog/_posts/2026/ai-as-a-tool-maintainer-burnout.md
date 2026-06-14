---
layout: blog
title: "Open source maintainership in the age of AI"
draft: true
slug: open-source-maintainership-in-the-age-of-ai
author: >
  Kevin Hannon (Red Hat)
---


AI has really changed the game around software development.
More people are leveraging AI than ever to contribute patches to projects they use.
To me, this is a good thing as more folks will contribute patches rather than fork or not fix them.
The main problem is that AI has made generating code fast but there has been very little improvement in maintaining code bases.
In this post, we will highlight the ways the Kubernetes community is adapting to the world of AI assisted coding.

The first step of this journey was to develop an AI policy. This seems mundane and bureaucratic but there were many PRs that derailed into discussions around AI usage.
The AI policy helps steer the conversation around the project's stance on AI and provides a clear signal to contributors on how to use these tools responsibly.

## Kubernetes AI Policy

The Kubernetes project has established [clear guidelines for AI-assisted contributions](https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance) that balance innovation with accountability.
These policies are designed to maintain code quality and ensure human oversight while acknowledging that AI tools can be valuable aids in the development process.

### Transparency First

Contributors must disclose when AI tools have been used to assist with a pull request. A simple statement in the PR description such as "This PR was written in part with the assistance of generative AI" is sufficient. This transparency helps reviewers understand the context and apply appropriate scrutiny.

### Human Accountability

While AI tools can assist, the human contributor remains fully responsible for every change. The policy explicitly prohibits:

- Listing AI as a co-author on commits
- Using AI co-signing on commits
- Adding trailers like "assisted-by" or "co-developed" that attribute work to AI

This isn't about diminishing AI's role as a tool—it's about maintaining clear accountability. If something breaks, there needs to be a human who understands why and can fix it.

### CLA enforcement for co-authors

The CNCF provides a [tool](https://github.com/cncf/cla) for verifying the contributor license agreements on each pull request.
AI agents are not able to solve these contributor license agreements so one enforcement the project made is to enable the CLA check for co-authors.
This provides a flag to reviewers that the PR is not ready to merge.

### Human Engagement Required

Perhaps the most critical aspect of the policy: reviewers expect to engage with humans, not with AI.
Contributors cannot rely on AI to respond to review comments.
If you cannot personally explain changes that AI helped generate, your PR will be closed.
This requirement ensures that knowledge transfer happens and that contributors genuinely understand the code they're submitting.

### Verification Obligations

Contributors must verify AI-generated changes through code review, testing, and personal understanding.
It's not enough for the code to work—you need to know why it works and be able to maintain it.

These policies reflect a mature approach to AI: embrace it as a tool, but never let it replace human judgment, understanding, or responsibility.

## Automated AI Reviews

There exist many tools to aid in reviewing code. AI pull request tools introduce governance challenges so one of the first tasks the community took on was to [document the process](https://github.com/kubernetes/community/blob/main/github-management/ai-code-review-tools.md) for what is needed to bring in new AI tools.
One of the major evaluation criteria for these tools is to find maintainers willing to test drive them in kubernetes-sigs repositories. Kueue, JobSet and Agent-Sandbox have been experimenting with these tools to provide more support for maintainers.

### Copilot

One tool that many maintainers started using was GitHub Copilot.
The CNCF provides [access for maintainers](https://contribute.cncf.io/blog/2025/12/16/github-copilot-enterprise-for-maintainers/) so this ended up being the first tool many started using.
It provides some good experience on tuning reviews but there were some growing pains with this tool.
The biggest blocker for community adoption is relying on contributors to have a copilot license. Only maintainers were able to request copilot reviews and automated reviews of pull requests was out of reach for the community.
One of the goals of AI review tools is to provide an automated review tool that maintainers don't need to request.
This demonstrated the need for organization control rather than relying on contributors having access.

### CodeRabbit

In mid 2026, the Kubernetes community has rolled out CodeRabbit to a few projects.
As with copilot, some tuning has been required to provide better reviews but the overall feedback has been positive.
There is a lot of configuration available for this tool and one of the most interesting uses of this tool comes from agent-sandbox.

AI pull request tools can be a quality gate. Contributors can at least get a quick spot check review without waiting for a maintainer.
Agent-sandbox has added a label on PRs to reflect that there is still a need to resolve some of the comments from AI tools.

## Next steps

The reality is that leveraging AI in open source projects is an area of active exploration.
The community could use your help in tuning reviews tools, evaluating tools or evaluating emerging technologies in the AI space.

Some areas we are exploring more:

- The use of AI skills to reduce maintainer burnout.
- AI assisted triage of failing tests.
- Skills to aid the operational aspects of Kubernetes.
