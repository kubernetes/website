---
reviewers:
- luxas
- jbeda
title: kubeadm config
content_type: concept
weight: 50
---

<!-- overview -->
During `kubeadm init`, kubeadm uploads the `ClusterConfiguration` object to your cluster
in a ConfigMap called `kubeadm-config` in the `kube-system` namespace. This configuration is then read during
`kubeadm join`, `kubeadm reset` and `kubeadm upgrade`.

You can use `kubeadm config print` to print the default static configuration that kubeadm
uses for `kubeadm init` and `kubeadm join`.

{{< note >}}
The output of the command is meant to serve as an example. You must manually edit the output
of this command to adapt to your setup. Remove the fields that you are not certain about and kubeadm
will try to default them on runtime by examining the host.
{{< /note >}}

For more information on `init` and `join` navigate to
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)
or [Using kubeadm join with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file).

For more information on using the kubeadm configuration API navigate to
[Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags).

You can use `kubeadm config migrate` to convert your old configuration files that contain a deprecated
API version to a newer, supported API version.

`kubeadm config validate` can be used for validating a configuration file.

`kubeadm config images list` and `kubeadm config images pull` can be used to list and pull the images
that kubeadm requires.

<!-- body -->
## kubeadm config print {#cmd-config-print}

{{< include "generated/kubeadm_config/kubeadm_config_print.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}

{{< include "generated/kubeadm_config/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}

{{< include "generated/kubeadm_config/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}

{{< include "generated/kubeadm_config/kubeadm_config_migrate.md" >}}

## kubeadm config validate {#cmd-config-validate}

{{< include "generated/kubeadm_config/kubeadm_config_validate.md" >}}

## kubeadm config images list {#cmd-config-images-list}

{{< include "generated/kubeadm_config/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}

{{< include "generated/kubeadm_config/kubeadm_config_images_pull.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a Kubernetes cluster to a newer version
