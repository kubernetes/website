
kubeadm: easily bootstrap a secure Kubernetes cluster

### Synopsis



kubeadm: easily bootstrap a secure Kubernetes cluster.

    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM IS CURRENTLY IN BETA                             │
    │                                                          │
    │ But please, try it out and give us feedback at:          │
    │ https://github.com/kubernetes/kubeadm/issues             │
    │ and at-mention @kubernetes/sig-cluster-lifecycle-bugs    │
    │ or @kubernetes/sig-cluster-lifecycle-feature-requests    │
    └──────────────────────────────────────────────────────────┘

Example usage:

    Create a two-machine cluster with one master (which controls the cluster),
    and one node (where your workloads, like Pods and Deployments run).

    ┌──────────────────────────────────────────────────────────┐
    │ On the first machine:                                    │
    ├──────────────────────────────────────────────────────────┤
    │ master# kubeadm init                                     │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ On the second machine:                                   │
    ├──────────────────────────────────────────────────────────┤
    │ node# kubeadm join <arguments-returned-from-init>        │
    └──────────────────────────────────────────────────────────┘

    You can then repeat the second step on as many other machines as you like.



### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubeadm</td>
    </tr>

  </tbody>
</table>



