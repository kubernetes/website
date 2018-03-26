---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
---

{% capture overview %}
{% include feature-state-alpha.md %}

As of Kubernetes 1.8, a subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags. In the
future, most of the existing command-line flags will be deprecated in favor of
providing parameters via a config file, which simplifies node deployment.

{% endcapture %}

{% capture prerequisites %}

- A v1.8 or higher Kubelet binary must be installed.

{% endcapture %}

{% capture steps %}

## Create the config file

The subset of the Kubelet's configuration that can be configured via a file
is defined by the `KubeletConfiguration` struct
[here (v1alpha1)](https://github.com/kubernetes/kubernetes/blob/release-1.9/pkg/kubelet/apis/kubeletconfig/v1alpha1/types.go).
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Note that this structure, and thus the config file API,
is still considered alpha and is not subject to stability guarantees.

Create a file named `kubelet` in its own directory and make sure the directory
and file are both readable by the Kubelet. You should write your intended
Kubelet configuration in this `kubelet` file.

For a trick to generate a configuration file from a live node, see
[Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet).

## Start a Kubelet process configured via the config file

Start the Kubelet with the `KubeletConfigFile` feature gate enabled and the 
Kubelet's `--init-config-dir` flag set to the location of the directory
containing the `kubelet` file. The Kubelet will then load the parameters defined
by `KubeletConfiguration` from the `kubelet` file, rather than from their 
associated command-line flags.

{% endcapture %}

{% capture discussion %}

## Relationship to Dynamic Kubelet Config

If you are using the [Dynamic Kubelet Configuration](/docs/tasks/administer-cluster/reconfigure-kubelet)
feature, the configuration provided via `--init-config-dir` will be considered
the "last known good" configuration by the automatic rollback mechanism.

Note that the layout of the files in the `--init-config-dir` mirrors the layout
of data in the ConfigMaps used for Dynamic Kubelet Config; the file names are
the same as the keys of the ConfigMap, and the file contents are JSON or YAML
representations of the same structures. Today, the only pair is 
`kubelet:KubeletConfiguration`, though more may emerge in the future.
See [Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet)
for more information.

{% endcapture %}

{% include templates/task.md %}
