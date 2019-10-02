
### Synopsis




    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM                                                  │
    │ Easily bootstrap a secure Kubernetes cluster             │
    │                                                          │
    │ Please give us feedback at:                              │
    │ https://github.com/kubernetes/kubeadm/issues             │
    └──────────────────────────────────────────────────────────┘

Example usage:

    Create a two-machine cluster with one control-plane node
    (which controls the cluster), and one worker node
    (where your workloads, like Pods and Deployments run).

    ┌──────────────────────────────────────────────────────────┐
    │ On the first machine:                                    │
    ├──────────────────────────────────────────────────────────┤
    │ control-plane# kubeadm init                              │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ On the second machine:                                   │
    ├──────────────────────────────────────────────────────────┤
    │ worker# kubeadm join &lt;arguments-returned-from-init&gt;      │
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

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



SEE ALSO

* [kubeadm alpha](kubeadm_alpha.md)	 - Kubeadm experimental sub-commands
* [kubeadm completion](kubeadm_completion.md)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubeadm config](kubeadm_config.md)	 - Manage configuration for a kubeadm cluster persisted in a ConfigMap in the cluster
* [kubeadm init](kubeadm_init.md)	 - Run this command in order to set up the Kubernetes control plane
* [kubeadm join](kubeadm_join.md)	 - Run this on any machine you wish to join an existing cluster
* [kubeadm reset](kubeadm_reset.md)	 - Performs a best effort revert of changes made to this host by 'kubeadm init' or 'kubeadm join'
* [kubeadm token](kubeadm_token.md)	 - Manage bootstrap tokens
* [kubeadm upgrade](kubeadm_upgrade.md)	 - Upgrade your cluster smoothly to a newer version with this command
* [kubeadm version](kubeadm_version.md)	 - Print the version of kubeadm

