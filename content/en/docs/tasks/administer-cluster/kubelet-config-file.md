---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet Parameters Via A Configuration File
content_type: task
weight: 330
---

<!-- overview -->

A subset of the kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.

Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.

<!-- steps -->

## Create the config file

The subset of the kubelet's configuration that can be configured via a file
is defined by the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
struct.

The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the kubelet has read permissions on the file.

Here is an example of what this file might look like:
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
```

In this example, the kubelet is configured with the following settings:

1. `address`: The kubelet will serve on IP address `192.168.0.8`.
2. `port`: The kubelet will serve on port `20250`.
3. `serializeImagePulls`: Image pulls will be done in parallel.
4. `evictionHard`: The kubelet will evict Pods under one of the following conditions:
   - When the node's available memory drops below 100MiB.
   - When the node's main filesystem's available space is less than 10%.
   - When the image filesystem's available space is less than 15%.
   - When more than 95% of the node's main filesystem's inodes are in use.

{{< note >}}
In the example, by changing the default value of only one parameter for
evictionHard, the default values of other parameters will not be inherited and
will be set to zero. In order to provide custom values, you should provide all
the threshold values respectively.
{{< /note >}}

The `imagefs` is an optional filesystem that container runtimes use to store container
images and container writable layers.

## Start a kubelet process configured via the config file

{{< note >}}
If you use kubeadm to initialize your cluster, use the kubelet-config while creating your cluster with `kubeadm init`.
See [configuring kubelet using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) for details.
{{< /note >}}

Start the kubelet with the `--config` flag set to the path of the kubelet's config file.
The kubelet will then load its config from this file.

Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.

Note that relative file paths in the kubelet config file are resolved relative to the
location of the kubelet config file, whereas relative paths in command line flags are resolved
relative to the kubelet's current working directory.

Note that some default values differ between command-line flags and the kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.

## Drop-in directory for kubelet configuration files {#kubelet-conf-d}

As of Kubernetes v1.28.0, the kubelet has been extended to support a drop-in configuration directory. The location of it can be specified with
`--config-dir` flag, and it defaults to `""`, or disabled, by default.

You can only set `--config-dir` if you set the environment variable `KUBELET_CONFIG_DROPIN_DIR_ALPHA` for the kubelet process (the value of that variable does not matter).
For Kubernetes v{{< skew currentVersion >}}, the kubelet returns an error if you specify `--config-dir` without that variable set, and startup fails.
You cannot specify the drop-in configuration directory using the kubelet configuration file; only the CLI argument `--config-dir` can set it.

One can use the kubelet configuration directory in a similar way to the kubelet config file.
{{< note >}}
The suffix of a valid kubelet drop-in configuration file must be `.conf`. For instance: `99-kubelet-address.conf`
{{< /note >}}

For instance, you may want a baseline kubelet configuration for all nodes, but you may want to customize the `address` field. This can be done as follows:

Main kubelet configuration file contents:
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "200Mi"
```

Contents of a file in `--config-dir` directory:
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
```

On startup, the kubelet merges configuration from:

* Command line arguments (lowest precedence).
* the kubelet configuration
* Drop-in configuration files, according to sort order.
* Feature gates specified over the command line (highest precedence).

This produces the same outcome as if you used the [single configuration file](#create-the-config-file) used in the earlier example.


<!-- discussion -->

## {{% heading "whatsnext" %}}

- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.