---
assignees:
- chrismarino

---

# Installation with kubeadm

Begin by following the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/) and complete steps 1, 2, and 3. Once completed, follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadmin. Kubernetes network policies can then be applied to pods using the NetworkPolicy API.

#### Additional Romana Network Policy Options

In addition to the standard Kubernetes NetworkPolicy API, Romana also supports additional network policy functions.

* [Romana Network Policy Capabilities](https://github.com/romana/romana/wiki/Romana-policies)
* [Example Romana Policies](https://github.com/romana/core/tree/master/policy)

