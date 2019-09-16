---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm config
content_template: templates/concept
weight: 50
---
{{% capture overview %}}
Beginning with v1.8.0, kubeadm uploads the configuration of your cluster to a ConfigMap called
`kubeadm-config` in the `kube-system` namespace, and later reads the ConfigMap when upgrading.
This enables correct configuration of system components, and provides a seamless user experience.

You can execute `kubeadm config view` to view the ConfigMap. If you initialized your cluster using
kubeadm v1.7.x or lower, you must use `kubeadm config upload` to create the ConfigMap before you
may use `kubeadm upgrade`.

You can use `kubeadm config print` to print the default configuration and `kubeadm config migrate` to
convert your old configuration files to a newer version. `kubeadm config images list` and
`kubeadm config images pull` can be used to list and pull the images that kubeadm requires.

In Kubernetes v1.13.0 and later to list/pull kube-dns images instead of the CoreDNS image
the `--config` method described [here](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)
has to be used.

{{% /capture %}}

{{% capture body %}}
## kubeadm config view {#cmd-config-view}
{{< include "generated/kubeadm_config_view.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}
{{< include "generated/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}
{{< include "generated/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}
{{< include "generated/kubeadm_config_migrate.md" >}}

## kubeadm config images list {#cmd-config-images-list}
{{< include "generated/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}
{{< include "generated/kubeadm_config_images_pull.md" >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
{{% /capture %}}
