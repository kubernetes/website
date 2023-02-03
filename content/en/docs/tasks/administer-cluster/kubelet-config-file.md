---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
content_type: task
weight: 330
---

<!-- overview -->

A subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.

Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.

<!-- steps -->

## Create the config file

The subset of the Kubelet's configuration that can be configured via a file
is defined by the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
struct.

The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the Kubelet has read permissions on the file.

Here is an example of what this file might look like:
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "200Mi"
```

In the example, the Kubelet is configured to serve on IP address 192.168.0.8 and port 20250, pull images in parallel,
and evict Pods when available memory drops below 200Mi. Since only one of the four evictionHard thresholds is configured,
other evictionHard thresholds are reset to 0 from their built-in defaults.
All other Kubelet configuration values are left at their built-in defaults, unless overridden
by flags. Command line flags which target the same value as a config file will override that value.

{{< note >}}
In the example, by changing the default value of only one parameter for
evictionHard, the default values of other parameters will not be inherited and
will be set to zero. In order to provide custom values, you should provide all
the threshold values respectively.
{{< /note >}}

## Start a Kubelet process configured via the config file

{{< note >}}
If you use kubeadm to initialize your cluster, use the kubelet-config while creating your cluster with `kubeadm init`.
See [configuring kubelet using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) for details.
{{< /note >}}

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

<!-- discussion -->

## {{% heading "whatsnext" %}}

- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.

