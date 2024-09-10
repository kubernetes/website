---
layout: blog
title: "Spotlight on SIG CLI"
date: 2023-07-20
slug: sig-cli-spotlight-2023
canonicalUrl: https://www.kubernetes.dev/blog/2023/07/20/sig-cli-spotlight-2023/
author: >
  Arpit Agrawal
---

In the world of Kubernetes, managing containerized applications at
scale requires powerful and efficient tools. The command-line
interface (CLI) is an integral part of any developer or operator’s
toolkit, offering a convenient and flexible way to interact with a
Kubernetes cluster.

SIG CLI plays a crucial role in improving the [Kubernetes
CLI](https://github.com/kubernetes/community/tree/master/sig-cli)
experience by focusing on the development and enhancement of
`kubectl`, the primary command-line tool for Kubernetes.

In this SIG CLI Spotlight, Arpit Agrawal, SIG ContribEx-Comms team
member, talked with [Katrina Verey](https://github.com/KnVerey), Tech
Lead & Chair of SIG CLI,and [Maciej
Szulik](https://github.com/soltysh), SIG CLI Batch Lead, about SIG
CLI, current projects, challenges and how anyone can get involved.

So, whether you are a seasoned Kubernetes enthusiast or just getting
started, understanding the significance of SIG CLI will undoubtedly
enhance your Kubernetes journey.

## Introductions

**Arpit**: Could you tell us a bit about yourself, your role, and how
you got involved in SIG CLI?

**Maciej**: I’m one of the technical leads for SIG-CLI. I was working
on Kubernetes in multiple areas since 2014, and in 2018 I got
appointed a lead.

**Katrina**: I’ve been working with Kubernetes as an end-user since
2016, but it was only in late 2019 that I discovered how well SIG CLI
aligned with my experience from internal projects. I started regularly
attending meetings and made a few small PRs, and by 2021 I was working
more deeply with the
[Kustomize](https://github.com/kubernetes-sigs/kustomize) team
specifically. Later that year, I was appointed to my current roles as
subproject owner for Kustomize and KRM Functions, and as SIG CLI Tech
Lead and Chair.

## About SIG CLI

**Arpit**: Thank you! Could you share with us the purpose and goals of SIG CLI?

**Maciej**: Our
[charter](https://github.com/kubernetes/community/tree/master/sig-cli/)
has the most detailed description, but in few words, we handle all CLI
tooling that helps you manage your Kubernetes manifests and interact
with your Kubernetes clusters.

**Arpit**: I see. And how does SIG CLI work to promote best-practices
for CLI development and usage in the cloud native ecosystem?

**Maciej**: Within `kubectl`, we have several on-going efforts that
try to encourage new contributors to align existing commands to new
standards. We publish several libraries which hopefully make it easier
to write CLIs that interact with Kubernetes APIs, such as cli-runtime
and
[kyaml](https://github.com/kubernetes-sigs/kustomize/tree/master/kyaml).

**Katrina**: We also maintain some interoperability specifications for
CLI tooling, such as the [KRM Functions
Specification](https://github.com/kubernetes-sigs/kustomize/blob/master/cmd/config/docs/api-conventions/functions-spec.md)
(GA) and the new ApplySet
Specification
(alpha).

## Current projects and challenges

**Arpit**: Going through the README file, it’s clear SIG CLI has a
number of subprojects, could you highlight some important ones?

**Maciej**: The four most active subprojects that are, in my opinion,
worthy of your time investment would be:

* [`kubectl`](https://github.com/kubernetes/kubectl):  the canonical Kubernetes CLI.
* [Kustomize](https://github.com/kubernetes-sigs/kustomize): a
  template-free customization tool for Kubernetes yaml manifest files.
* [KUI](https://kui.tools) - a GUI interface to Kubernetes, think
   `kubectl` on steroids.
* [`krew`](https://github.com/kubernetes-sigs/krew): a plugin manager for `kubectl`.

**Arpit**: Are there any upcoming initiatives or developments that SIG
CLI is working on?

**Maciej**: There are always several initiatives we’re working on at
any given point in time. It’s best to join [one of our
calls](https://github.com/kubernetes/community/tree/master/sig-cli/#meetings)
to learn about the current ones.

**Katrina**: For major features, you can check out [our open
KEPs](https://www.kubernetes.dev/resources/keps/). For instance, in
1.27 we introduced alphas for [a new pruning mode in kubectl
apply](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning/),
and for kubectl create plugins. Exciting ideas that are currently
under discussion include an interactive mode for `kubectl` delete
([KEP
3895](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning))
and the `kuberc` user preferences file ([KEP
3104](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)).

**Arpit**: Could you discuss any challenges that SIG CLI faces in its
efforts to improve CLIs for cloud-native technologies? What are the
future efforts to solve them?

**Katrina**: The biggest challenge we’re facing with every decision is
backwards compatibility and ensuring we don’t break existing users. It
frequently happens that fixing what's on the surface may seem
straightforward, but even fixing a bug could constitute a breaking
change for some users, which means we need to go through an extended
deprecation process to change it, or in some cases we can’t change it
at all. Another challenge is the need to balance customization with
usability in the flag sets we expose on our tools. For example, we get
many proposals for new flags that would certainly be useful to some
users, but not a large enough subset to justify the increased
complexity having them in the tool entails for everyone. The `kuberc`
proposal may help with some of these problems by giving individual
users the ability to set or override default values we can’t change,
and even create custom subcommands via aliases

**Arpit**: With every new version release of Kubernetes, maintaining
consistency and integrity is surely challenging: how does the SIG CLI
team tackle it?

**Maciej**: This is mostly similar to the topic mentioned in the
previous question: every new change, especially to existing commands
goes through a lot of scrutiny to ensure we don’t break existing
users. At any point in time we have to keep a reasonable balance
between features and not breaking users.

## Future plans and contribution

**Arpit**: How do you see the role of CLI tools in the cloud-native
ecosystem evolving in the future?

**Maciej**: I think that CLI tools were and will always be an
important piece of the ecosystem. Whether used by administrators on
remote machines that don’t have GUI or in every CI/CD pipeline, they
are irreplaceable.

**Arpit**: Kubernetes is a community-driven project. Any
recommendation for anyone looking into getting involved in SIG CLI
work? Where should they start? Are there any prerequisites?

**Maciej**: There are no prerequisites other than a little bit of free
time on your hands and willingness to learn something new :-)

**Katrina**: A working knowledge of [Go](https://go.dev/) often helps,
but we also have areas in need of non-code contributions, such as the
[Kustomize docs consolidation
project](https://github.com/kubernetes-sigs/kustomize/issues/4338).
