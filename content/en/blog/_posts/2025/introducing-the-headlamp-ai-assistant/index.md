---
layout: blog
title: "Introducing Headlamp AI Assistant"
date: 2025-08-07T20:00:00+01:00
slug: introducing-headlamp-ai-assistant
author: >
  Joaquim Rocha (Microsoft)
canonicalUrl: "https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant"
---

_This announcement originally [appeared](https://headlamp.dev/blog/2025/08/07/introducing-the-headlamp-ai-assistant) on the Headlamp blog._

To simplify Kubernetes management and troubleshooting, we're thrilled to
introduce [Headlamp AI Assistant](https://github.com/headlamp-k8s/plugins/tree/main/ai-assistant#readme): a powerful new plugin for Headlamp that helps
you understand and operate your Kubernetes clusters and applications with
greater clarity and ease.

Whether you're a seasoned engineer or just getting started, the AI Assistant offers:
* **Fast time to value:** Ask questions like _"Is my application healthy?"_ or
  _"How can I fix this?"_ without needing deep Kubernetes knowledge.
* **Deep insights:** Start with high-level queries and dig deeper with prompts
  like _"List all the problematic pods"_ or _"How can I fix this pod?"_
* **Focused & relevant:** Ask questions in the context of what you're viewing
  in the UI, such as _"What's wrong here?"_
* **Action-oriented:** Let the AI take action for you, like _"Restart that
  deployment"_, with your permission.

Here is a demo of the AI Assistant in action as it helps troubleshoot an
application running with issues in a Kubernetes cluster:

{{< youtube id="GzXkUuCTcd4" title="Headlamp AI Assistant" class="youtube-quote-sm" >}}

## Hopping on the AI train

Large Language Models (LLMs) have transformed not just how we access data but
also how we interact with it. The rise of tools like ChatGPT opened a world of
possibilities, inspiring a wave of new applications. Asking questions or giving
commands in natural language is intuitive, especially for users who aren't deeply
technical. Now everyone can quickly ask how to do X or Y, without feeling awkward
or having to traverse pages and pages of documentation like before.

Therefore, Headlamp AI Assistant brings a conversational UI to [Headlamp](https://headlamp.dev),
powered by LLMs that Headlamp users can configure with their own API keys.
It is available as a Headlamp plugin, making it easy to integrate into your
existing setup. Users can enable it by installing the plugin and configuring
it with their own LLM API keys, giving them control over which model powers
the assistant. Once enabled, the assistant becomes part of the Headlamp UI,
ready to respond to contextual queries and perform actions directly from the
interface.

## Context is everything

As expected, the AI Assistant is focused on helping users with Kubernetes
concepts. Yet, while there is a lot of value in responding to Kubernetes
related questions from Headlamp's UI, we believe that the great benefit of such
an integration is when it can use the context of what the user is experiencing
in an application. So, the Headlamp AI Assistant knows what you're currently
viewing in Headlamp, and this makes the interaction feel more like working
with a human assistant.

For example, if a pod is failing, users can simply ask _"What's wrong here?"_
and the AI Assistant will respond with the root cause, like a missing
environment variable or a typo in the image name. Follow-up prompts like
_"How can I fix this?"_ allow the AI Assistant to suggest a fix, streamlining
what used to take multiple steps into a quick, conversational flow.

Sharing the context from Headlamp is not a trivial task though, so it's
something we will keep working on perfecting.

## Tools

Context from the UI is helpful, but sometimes additional capabilities are
needed. If the user is viewing the pod list and wants to identify problematic
deployments, switching views should not be necessary. To address this, the AI
Assistant includes support for a Kubernetes tool. This allows asking questions
like "Get me all deployments with problems" prompting the assistant to fetch
and display relevant data from the current cluster. Likewise, if the user
requests an action like "Restart that deployment" after the AI points out what
deployment needs restarting, it can also do that. In case of "write"
operations, the AI Assistant does check with the user for permission to run them.

## AI Plugins

Although the initial version of the AI Assistant is already useful for
Kubernetes users, future iterations will expand its capabilities. Currently,
the assistant supports only the Kubernetes tool, but further integration with
Headlamp plugins is underway. Similarly, we could get richer insights for
GitOps via the Flux plugin, monitoring through Prometheus, package management
with Helm, and more.

And of course, as the popularity of MCP grows, we are looking into how to
integrate it as well, for a more plug-and-play fashion.

## Try it out!

We hope this first version of the AI Assistant helps users manage Kubernetes
clusters more effectively and assist newcomers in navigating the learning
curve. We invite you to try out this early version and give us your feedback.
The AI Assistant plugin can be installed from Headlamp's Plugin Catalog in the
desktop version, or by using the container image when deploying Headlamp.
Stay tuned for the future versions of the Headlamp AI Assistant!
