---
assignees:
- bboreham
title: Weave Net Addon
---

The [Weave Net Addon](https://www.weave.works/docs/net/latest/kube-addon/) for Kubernetes comes with a Network Policy Controller.

This component automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces, and configures `iptables` rules to allow or block traffic as directed by the policies.

Once you have installed the Weave Net Addon you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
