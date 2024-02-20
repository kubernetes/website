---
title: "Monitoring, Logging, and Debugging"
description: Set up monitoring and logging to troubleshoot a cluster, or debug a containerized application.
weight: 40
reviewers:
- brendandburns
- davidopp
content_type: concept
no_list: true
card:
  name: tasks
  weight: 999
  title: Getting help
---

<!-- overview -->

Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:

* [Debugging your application](/docs/tasks/debug/debug-application/) - Useful
  for users who are deploying code into Kubernetes and wondering why it is not working.
* [Debugging your cluster](/docs/tasks/debug/debug-cluster/) - Useful
  for cluster administrators and people whose Kubernetes cluster is unhappy.

You should also check the known issues for the [release](https://github.com/kubernetes/kubernetes/releases)
you're using.

<!-- body -->

## Getting help

If your problem isn't answered by any of the guides above, there are variety of
ways for you to get help from the Kubernetes community.

### Questions

The documentation on this site has been structured to provide answers to a wide
range of questions. [Concepts](/docs/concepts/) explain the Kubernetes
architecture and how each component works, while [Setup](/docs/setup/) provides
practical instructions for getting started. [Tasks](/docs/tasks/) show how to
accomplish commonly used tasks, and [Tutorials](/docs/tutorials/) are more
comprehensive walkthroughs of real-world, industry-specific, or end-to-end
development scenarios. The [Reference](/docs/reference/) section provides
detailed documentation on the [Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
and command-line interfaces (CLIs), such as [`kubectl`](/docs/reference/kubectl/).

## Help! My question isn't covered!  I need help now!

### Stack Exchange, Stack Overflow, or Server Fault {#stack-exchange}

If you have questions related to *software development* for your containerized app,
you can ask those on [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes).

If you have Kubernetes questions related to *cluster management* or *configuration*,
you can ask those on
[Server Fault](https://serverfault.com/questions/tagged/kubernetes).

There are also several more specific Stack Exchange network sites which might
be the right place to ask Kubernetes questions in areas such as
[DevOps](https://devops.stackexchange.com/questions/tagged/kubernetes), 
[Software Engineering](https://softwareengineering.stackexchange.com/questions/tagged/kubernetes),
or [InfoSec](https://security.stackexchange.com/questions/tagged/kubernetes).

Someone else from the community may have already asked a similar question or 
may be able to help with your problem.

The Kubernetes team will also monitor
[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, **please ensure that your question 
is [on-topic on Stack Overflow](https://stackoverflow.com/help/on-topic),
[Server Fault](https://serverfault.com/help/on-topic), or the Stack Exchange 
Network site you're asking on**, and read through the guidance on 
[how to ask a new question](https://stackoverflow.com/help/how-to-ask),
before asking a new one!

### Slack

Many people from the Kubernetes community hang out on Kubernetes Slack in the `#kubernetes-users` channel.
Slack requires registration; you can [request an invitation](https://slack.kubernetes.io),
and registration is open to everyone). Feel free to come and ask any and all questions.
Once registered, access the [Kubernetes organisation in Slack](https://kubernetes.slack.com)
via your web browser or via Slack's own dedicated app.

Once you are registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) channel. As another example, developers should join the
[`#kubernetes-contributors`](https://kubernetes.slack.com/messages/kubernetes-contributors) channel.

There are also many country specific / local language channels. Feel free to join
these channels for localized support and info:

{{< table caption="Country / language specific Slack channels" >}}
Country | Channels
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finland | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
France | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Germany | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italy | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japan | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Korea | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Netherlands | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Norway | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Poland | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Russia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Spain | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Sweden | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turkey | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Forum

You're welcome to join the official Kubernetes Forum: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Bugs and feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [GitHub issue tracking system](https://github.com/kubernetes/kubernetes/issues).

Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:

* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and container runtime version
* Steps to reproduce the problem


