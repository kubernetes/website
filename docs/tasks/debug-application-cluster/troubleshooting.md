---
assignees:
- brendandburns
- davidopp
title: Troubleshooting
---

Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:

   * [Troubleshooting your application](/docs/tasks/debug-application-cluster/debug-application/) - Useful for users who are deploying code into Kubernetes and wondering why it is not working.
   * [Troubleshooting your cluster](/docs/tasks/debug-application-cluster/debug-cluster/) - Useful for cluster administrators and people whose Kubernetes cluster is unhappy.

You should also check the known issues for the [release](https://github.com/kubernetes/kubernetes/releases)
you're using.

## Getting help

If your problem isn't answered by any of the guides above, there are variety of
ways for you to get help from the Kubernetes team.

### Questions

The documentation on this site has been structured to provide answers to a wide
range of questions. [Concepts](/docs/concepts/) explain the Kubernetes
architecture and how each component works, while [Setup](/docs/setup/) provides
practical instructions for getting started. [Tasks](/docs/tasks/) show how to
accomplish commonly used tasks, and [Tutorials](/docs/tutorials/) are more
comprehensive walkthroughs of real-world, industry-specific, or end-to-end
development scenarios. The [Reference](/docs/reference/) section provides
detailed documentation on the [Kubernetes API](/docs/api-reference/{{page.version}}/)
and command-line interfaces (CLIs), such as [`kubectl`](/docs/user-guide/kubectl-overview/).

We also have a number of FAQ pages:

   * [User FAQ](https://github.com/kubernetes/kubernetes/wiki/User-FAQ)
   * [Debugging FAQ](https://github.com/kubernetes/kubernetes/wiki/Debugging-FAQ)
   * [Services FAQ](https://github.com/kubernetes/kubernetes/wiki/Services-FAQ)

You may also find the Stack Overflow topics relevant:

   * [Kubernetes](http://stackoverflow.com/questions/tagged/kubernetes)
   * [Google Container Engine - GKE](http://stackoverflow.com/questions/tagged/google-container-engine)

## Help! My question isn't covered!  I need help now!

### Stack Overflow

Someone else from the community may have already asked a similar question or may
be able to help with your problem. The Kubernetes team will also monitor
[posts tagged Kubernetes](http://stackoverflow.com/questions/tagged/kubernetes).
If there aren't any existing questions that help, please [ask a new one](http://stackoverflow.com/questions/ask?tags=kubernetes)!

### Slack

The Kubernetes team hangs out on Slack in the `#kubernetes-users` channel. You
can participate in discussion with the Kubernetes team [here](https://kubernetes.slack.com).
Slack requires registration, but the Kubernetes team is open invitation to
anyone to register [here](http://slack.kubernetes.io). Feel free to come and ask
any and all questions.

Once registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
`#kubernetes-novice` channel. As another example, developers should join the
`#kubernetes-dev` channel.

There are also many country specific/local language channels. Feel free to join
these channels for localized support and info:

- France: `#fr-users`, `#fr-events`
- Germany: `#de-users`, `#de-events`
- Japan: `#jp-users`, `#jp-events`

### Mailing List

The Kubernetes / Google Container Engine mailing list is [kubernetes-users@googlegroups.com](https://groups.google.com/forum/#!forum/kubernetes-users)

### Bugs and Feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [Github issue tracking system](https://github.com/kubernetes/kubernetes/issues).

Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:

* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and Docker version
* Steps to reproduce the problem
