---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
content_template: templates/task
---

{{% capture overview %}}
{{< feature-state state="beta" >}}

A subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.
This functionality is considered beta in v1.10.

Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.

{{% /capture %}}

{{% capture prerequisites %}}

- A v1.10 or higher Kubelet binary must be installed for beta functionality.

{{% /capture %}}

{{% capture steps %}}

## Create the config file

The subset of the Kubelet's configuration that can be configured via a file
is defined by the `KubeletConfiguration` struct
[here (v1beta1)](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go).

The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the Kubelet has read permissions on the file.

Here is an example of what this file might look like:
```
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
evictionHard:
    memory.available:  "200Mi"
```

In the example, the Kubelet is configured to evict Pods when available memory drops below 200Mi.
All other Kubelet configuration values are left at their built-in defaults, unless overridden
by flags. Command line flags which target the same value as a config file will override that value.

For a trick to generate a configuration file from a live node, see
[Reconfigure a Node's Kubelet in a Live Cluster](/docs/tasks/administer-cluster/reconfigure-kubelet).

## Start a Kubelet process configured via the config file

Start the Kubelet with the `--config` flag set to the path of the Kubelet's config file.
The Kubelet will then load its config from this file.

Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.

Note that relative file paths in the Kubelet config file are resolved relative to the
location of the Kubelet config file, whereas relative paths in command line flags are resolved
relative to the Kubelet's current working directory.

Note that some default values differ between command-line flags and the Kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.

{{% /capture %}}

{{% capture discussion %}}

## Relationship to Dynamic Kubelet Config

If you are using the [Dynamic Kubelet Configuration](/docs/tasks/administer-cluster/reconfigure-kubelet)
feature, the combination of configuration provided via `--config` and any flags which override these values
is considered the default "last known good" configuration by the automatic rollback mechanism.

{{% /capture %}}


