---
layout: blog
title: Blixt - A load-balancer written in Rust, using eBPF, born from Gateway API
date: 2023-10-26
slug: blixt-load-balancer-rust-ebpf-gateway-api
---

**Author:** Shane Utt (Kong), Andrew Stoycos (Red Hat)

In [SIG Network][signet] we now have a load-balancer named [Blixt][blixt]. This
project started as a fun experiment into emerging technologies and is intended
to become a utility for CI and testing to help facilitate the continued
development of [Gateway API][gwapi]. Are you interested in developing networking
tools in [Rust][rust] and [eBPF][ebpf]? Or perhaps you're specifically
interested in Gateway API? We'll tell you a bit about the project and how it
might benefit you.

[signet]:https://github.com/kubernetes/community/tree/master/sig-network
[blixt]:https://github.com/kubernetes-sigs/blixt
[gwapi]:https://github.com/kubernetes-sigs/gateway-api
[rust]:https://www.rust-lang.org/
[ebpf]:https://www.kernel.org/doc/html/latest/bpf/index.html

## History

[Blixt][blixt] originated at [Kong][kong] as an experiment to test
load-balancing ingress traffic for Kubernetes clusters using eBPF as the
dataplane. Around the time of Kubecon Detroit (2022) we (the [Gateway
API][gwapi] maintainers) realized it had significant potential to help us move
our `TCPRoute` and `UDPRoute` support forward, which had been sort of "stuck in
alpha" at the time due to a lack of conformance tests being developed for them.
At the same time various others in the SIG Network community developed an
interest in the project due to the rapid growth of the eBPF technology space.
Given the potential for benefit to the Kubernetes ecosystem and the growing
interest, Kong decided it would be helpful to [donate the project to Kubernetes
SIGs][donation] to benefit upstream Kubernetes.

Over several months we rewrote the project in [Rust][rust] (from C) due to a
strong contingency of Rust knowledge (and interest) between us developing the
project and an active interest in the burgeoning [Aya project][aya] (a Rust
framework for developing eBPF programs). We did eventually move the
control-plane (specifically) to [Golang][go] however, so that we could take
advantage of the [Kubebuilder][kb] and [controller-runtime][ctrl] ecosystems and
we replaced our custom program loader (in eBPF, you generally write "loaders"
which load your BPF byte code into the Kernel) with [Bpfd][bpfd]: a project
adjacent to us in the Rust + eBPF ecosystem which [solves several security and
ergonomic problems with managing BPF programs on Linux systems][bpfdwhy].

[After the license review process completed recently][lrev] the project became
officially Kubernetes SIGs and interest has been growing. We have several goals
for the project which revolve around the continued development of Gateway API,
with a specific focus on helping mature Layer 4 support (e.g. `UDPRoute` and
`TCPRoute`).

[blixt]:https://github.com/kubernetes-sigs/blixt
[kong]:https://konghq.com
[gwapi]:https://github.com/kubernetes-sigs/gateway-api
[donation]:https://github.com/kubernetes/org/issues/3875
[rust]:https://www.rust-lang.org/
[aya]:https://aya-rs.dev/
[go]:https://go.dev
[kb]:https://book.kubebuilder.io/
[ctrl]:https://github.com/kubernetes-sigs/controller-runtime
[bpfd]:https://bpfd.dev/
[bpfdwhy]:https://bpfd.dev/#what-is-bpfd
[lrev]:https://github.com/cncf/foundation/issues/474

## Goals

Currently the high level goal of the project is to provide a [Gateway
API][gwapi] driven load-balancer for non-production use cases. Those
non-production use cases include:

- Driving conformance tests and adoption for L4 use cases.
- Using this implementation as part of the Gateway API CI testing strategy.
- Having the Blixt control-plane be a reference implementation.

In support of those goals we have some more specific sub-goals we're actively
working towards:

- Support [GatewayClass][gwc] and [Gateway][gw], meeting [conformance
  requirements][gwconf]
- Support [UDPRoute][urt] and [TCPRoute][trt], meanwhile helping to develop the
  conformance requirements for these APIs.

We have some significant progress on the above in that we have a **basic**
level of support for creating a `GatewayClass` and `Gateway` and then attaching
`UDPRoute` and `TCPRoute` resources to them, with the underlying dataplane
receiving corresponding configuration and traffic then flowing as expected. We
emphasize the **basic**: as the project is still quite early on, and being
developed in a highly iterative fashion. That said the fundamentals are there
and you can try them out yourself on a local system using our [usage
documentation][usage] and [sample configurations][samples]. You can see more
about the project's [current status on the README.md][status] including the
milestones and current progress.

One thing that can't be overstated about this project is that it has been at the
center of a lot of learning, community building and fun. We have maintained a
policy with this project that it shall never be intended for production use
cases, and one of the greatest benefits of that is that development of the
project is more of a sandbox and a safe space for people to learn and
experiment. If any of this sounds interesting to you now is a great time to get
involved!

[gwapi]:https://github.com/kubernetes-sigs/gateway-api
[gwc]:https://gateway-api.sigs.k8s.io/api-types/gatewayclass/
[gw]:https://gateway-api.sigs.k8s.io/api-types/gateway/
[gwconf]:https://gateway-api.sigs.k8s.io/concepts/conformance/
[urt]:https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.UDPRoute
[trt]:https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.TCPRoute
[usage]:https://github.com/kubernetes-sigs/blixt#usage
[samples]:https://github.com/kubernetes-sigs/blixt/tree/main/config/samples
[status]:https://github.com/kubernetes-sigs/blixt#current-status
[bliss]:https://github.com/kubernetes-sigs/blixt/issues/new/choose
[bldis]:https://github.com/kubernetes-sigs/blixt/discussions

## Getting involved

If you're interested in networking, Rust, Linux, eBPF (or all of the above)
there's a lot of opportunity here to learn and have fun. We invite you to jump
right in on the [repository][repo] if that's your style, or reach out to us in
the community: You can reach us on [Kubernetes Slack][k8slack] on the
`#sig-network-gateway-api` channel as well as the `#ebpf` channel. Blixt is a
topic of discussion at the [Gateway API community meetings][meets], and the
monthly [SIG Network Code Jam][cjam] as well.

Cheers, and happy holidays!

[repo]:https://github.com/kubernetes-sigs/blixt
[k8slack]:https://kubernetes.slack.com
[meets]:https://gateway-api.sigs.k8s.io/contributing/#meetings
[cjam]:https://github.com/kubernetes/community/tree/master/sig-network#meetings