---
layout: blog
title: 'How You Can Help Localize Kubernetes Docs'
date: 2019-04-26
---

**Author: Zach Corleissen (Linux Foundation)**

Last year we optimized the Kubernetes website for [hosting multilingual content](/blog/2018/11/08/kubernetes-docs-updates-international-edition/). Contributors responded by adding multiple new localizations: as of April 2019, Kubernetes docs are partially available in nine different languages, with six added in 2019 alone. You can see a list of available languages in the language selector at the top of each page.

By _partially available_, I mean that localizations are ongoing projects. They range from mostly complete ([Chinese docs for 1.12](https://v1-12.docs.kubernetes.io/zh/)) to brand new (1.14 docs in [Portuguese](https://kubernetes.io/pt/)). If you're interested in helping an existing localization, read on!

## What is a localization?

Translation is about words and meaning. Localization is about words, meaning, process, and design.

A localization is like a translation, but more thorough. Instead of just translating words, a localization optimizes the framework for writing and publishing words. For example, most site navigation features (button text) on kubernetes.io are strings contained in a [single file](https://github.com/kubernetes/website/tree/master/i18n). Part of creating a new localization involves adding a language-specific version of that file and translating the strings it contains.

Localization matters because it reduces barriers to adoption and support. When we can read Kubernetes docs in our own language, it's easier to get started using Kubernetes and contributing to its development.

## How do localizations happen?

The availability of docs in different languages is a feature&mdash;and like all Kubernetes features, contributors develop localized docs in a SIG, share them for review, and add them to the project. 

Contributors work in teams to localize content. Because folks can't approve their own PRs, localization teams have a minimum size of two&mdash;for example, the Italian localization has two contributors. Teams can also be quite large: the Chinese team has several dozen contributors. 

Each team has its own workflow. Some teams localize all content manually; others use editors with translation plugins and review machine output for accuracy. SIG Docs focuses on standards of output; this leaves teams free to adopt the workflow that works best for them. That said, teams frequently collaborate with each other on best practices, and sharing abounds in the best spirit of the Kubernetes community.

## Helping with localizations

If you're interested in starting a new localization for Kubernetes docs, the [Kubernetes contribution guide](https://kubernetes.io/docs/contribute/localization/) shows you how.

Existing localizations also need help. If you'd like to contribute to an existing project, join the localization team's Slack channel and introduce yourself. Folks on that team can help you get started. 

Localization | Slack channel
---|---
Chinese (中文) | [#kubernetes-docs-zh](https://kubernetes.slack.com/messages/CE3LNFYJ1/)
English | [#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/)
French (Français) | [#kubernetes-docs-fr](https://kubernetes.slack.com/messages/CG838BFT9/)
German (Deutsch) | [#kubernetes-docs-de](https://kubernetes.slack.com/messages/CH4UJ2BAL/)
Hindi | [#kubernetes-docs-hi](https://kubernetes.slack.com/messages/CJ14B9BDJ/)
Indonesian | [#kubernetes-docs-id](https://kubernetes.slack.com/messages/CJ1LUCUHM/)
Italian | [#kubernetes-docs-it](https://kubernetes.slack.com/messages/CGB1MCK7X/)
Japanese (日本語) | [#kubernetes-docs-ja](https://kubernetes.slack.com/messages/CAG2M83S8/)
Korean (한국어) | [#kubernetes-docs-ko](https://kubernetes.slack.com/messages/CA1MMR86S/)
Portuguese (Português) | [#kubernetes-docs-pt](https://kubernetes.slack.com/messages/CJ21AS0NA/)
Spanish (Español) | [#kubernetes-docs-es](https://kubernetes.slack.com/messages/CH7GB2E3B/)


## What's next?

There's a new [Hindi localization](https://kubernetes.slack.com/messages/CJ14B9BDJ/) beginning. Why not add your language, too?

As a chair of SIG Docs, I'd love to see localization spread beyond the docs and into Kubernetes components. Is there a Kubernetes component you'd like to see supported in a different language? Consider making a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps) to support the change.

