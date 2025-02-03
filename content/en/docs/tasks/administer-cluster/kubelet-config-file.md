---
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet Parameters Via A Configuration File
content_type: task
weight: 330
---

## {{% heading "prerequisites" %}}

Some steps in this page use the `jq` tool. If you don't have `jq`, you can
install it via your operating system's software sources, or fetch it from
[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

Some steps also involve installing `curl`, which can be installed via your
operating system's software sources.


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
1. `port`: The kubelet will serve on port `20250`.
1. `serializeImagePulls`: Image pulls will be done in parallel.
1. `evictionHard`: The kubelet will evict Pods under one of the following conditions:

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

{{<feature-state for_k8s_version="v1.30" state="beta" >}}

You can specify a drop-in configuration directory for the kubelet. By default, the kubelet does not look
for drop-in configuration files anywhere - you must specify a path.
For example: `--config-dir=/etc/kubernetes/kubelet.conf.d`

For Kubernetes v1.28 to v1.29, you can only specify `--config-dir` if you also set
the environment variable `KUBELET_CONFIG_DROPIN_DIR_ALPHA` for the kubelet process (the value
of that variable does not matter).

{{< note >}}
The suffix of a valid kubelet drop-in configuration file **must** be `.conf`. For instance: `99-kubelet-address.conf`
{{< /note >}}

The kubelet processes files in its config drop-in directory by sorting the **entire file name** alphanumerically.
For instance, `00-kubelet.conf` is processed first, and then overridden with a file named `01-kubelet.conf`.

These files may contain partial configurations but should not be invalid and must include type metadata, specifically `apiVersion` and `kind`. 
Validation is only performed on the final resulting configuration structure stored internally in the kubelet. 
This offers flexibility in managing and merging kubelet configurations from different sources while preventing undesirable configurations. 
However, it is important to note that behavior varies based on the data type of the configuration fields.

Different data types in the kubelet configuration structure merge differently. See the
[reference document](/docs/reference/node/kubelet-config-directory-merging/)
for more information.

### Kubelet configuration merging order

On startup, the kubelet merges configuration from:

* Feature gates specified over the command line (lowest precedence).
* The kubelet configuration.
* Drop-in configuration files, according to sort order.
* Command line arguments excluding feature gates (highest precedence).

{{< note >}}
The config drop-in dir mechanism for the kubelet is similar but different from how the `kubeadm` tool allows you to patch configuration.
The `kubeadm` tool uses a specific [patching strategy](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)
for its configuration, whereas the only patch strategy for kubelet configuration drop-in files is `replace`.
The kubelet determines the order of merges based on sorting the **suffixes** alphanumerically,
and replaces every field present in a higher priority file.
{{< /note >}}

## Viewing the kubelet configuration

Since the configuration could now be spread over multiple files with this feature, if someone wants to inspect the final actuated configuration,
they can follow these steps to inspect the kubelet configuration:

1. Start a proxy server using [`kubectl proxy`](/docs/reference/kubectl/generated/kubectl_proxy/) in your terminal.

   ```bash
   kubectl proxy
   ```

   Which gives output like:

   ```none
   Starting to serve on 127.0.0.1:8001
   ```

1. Open another terminal window and use `curl` to fetch the kubelet configuration.
   Replace `<node-name>` with the actual name of your node:

   ```bash
   curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
   ```

   ```json
   {
     "kubeletconfig": {
       "enableServer": true,
       "staticPodPath": "/var/run/kubernetes/static-pods",
       "syncFrequency": "1m0s",
       "fileCheckFrequency": "20s",
       "httpCheckFrequency": "20s",
       "address": "192.168.1.16",
       "port": 10250,
       "readOnlyPort": 10255,
       "tlsCertFile": "/var/lib/kubelet/pki/kubelet.crt",
       "tlsPrivateKeyFile": "/var/lib/kubelet/pki/kubelet.key",
       "rotateCertificates": true,
       "authentication": {
         "x509": {
           "clientCAFile": "/var/run/kubernetes/client-ca.crt"
         },
         "webhook": {
           "enabled": true,
           "cacheTTL": "2m0s"
         },
         "anonymous": {
           "enabled": true
         }
       },
       "authorization": {
         "mode": "AlwaysAllow",
         "webhook": {
           "cacheAuthorizedTTL": "5m0s",
           "cacheUnauthorizedTTL": "30s"
         }
       },
       "registryPullQPS": 5,
       "registryBurst": 10,
       "eventRecordQPS": 50,
       "eventBurst": 100,
       "enableDebuggingHandlers": true,
       "healthzPort": 10248,
       "healthzBindAddress": "127.0.0.1",
       "oomScoreAdj": -999,
       "clusterDomain": "cluster.local",
       "clusterDNS": [
         "10.0.0.10"
       ],
       "streamingConnectionIdleTimeout": "4h0m0s",
       "nodeStatusUpdateFrequency": "10s",
       "nodeStatusReportFrequency": "5m0s",
       "nodeLeaseDurationSeconds": 40,
       "imageMinimumGCAge": "2m0s",
       "imageMaximumGCAge": "0s",
       "imageGCHighThresholdPercent": 85,
       "imageGCLowThresholdPercent": 80,
       "volumeStatsAggPeriod": "1m0s",
       "cgroupsPerQOS": true,
       "cgroupDriver": "systemd",
       "cpuManagerPolicy": "none",
       "cpuManagerReconcilePeriod": "10s",
       "memoryManagerPolicy": "None",
       "topologyManagerPolicy": "none",
       "topologyManagerScope": "container",
       "runtimeRequestTimeout": "2m0s",
       "hairpinMode": "promiscuous-bridge",
       "maxPods": 110,
       "podPidsLimit": -1,
       "resolvConf": "/run/systemd/resolve/resolv.conf",
       "cpuCFSQuota": true,
       "cpuCFSQuotaPeriod": "100ms",
       "nodeStatusMaxImages": 50,
       "maxOpenFiles": 1000000,
       "contentType": "application/vnd.kubernetes.protobuf",
       "kubeAPIQPS": 50,
       "kubeAPIBurst": 100,
       "serializeImagePulls": true,
       "evictionHard": {
         "imagefs.available": "15%",
         "memory.available": "100Mi",
         "nodefs.available": "10%",
         "nodefs.inodesFree": "5%"
       },
       "evictionPressureTransitionPeriod": "1m0s",
       "enableControllerAttachDetach": true,
       "makeIPTablesUtilChains": true,
       "iptablesMasqueradeBit": 14,
       "iptablesDropBit": 15,
       "featureGates": {
         "AllAlpha": false
       },
       "failSwapOn": false,
       "memorySwap": {},
       "containerLogMaxSize": "10Mi",
       "containerLogMaxFiles": 5,
       "configMapAndSecretChangeDetectionStrategy": "Watch",
       "enforceNodeAllocatable": [
         "pods"
       ],
       "volumePluginDir": "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/",
       "logging": {
         "format": "text",
         "flushFrequency": "5s",
         "verbosity": 3,
         "options": {
           "json": {
             "infoBufferSize": "0"
           }
         }
       },
       "enableSystemLogHandler": true,
       "enableSystemLogQuery": false,
       "shutdownGracePeriod": "0s",
       "shutdownGracePeriodCriticalPods": "0s",
       "enableProfilingHandler": true,
       "enableDebugFlagsHandler": true,
       "seccompDefault": false,
       "memoryThrottlingFactor": 0.9,
       "registerNode": true,
       "localStorageCapacityIsolation": true,
       "containerRuntimeEndpoint": "unix:///var/run/crio/crio.sock"
     }
   }
   ```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.
- Learn more about kubelet configuration merging in the
  [reference document](/docs/reference/node/kubelet-config-directory-merging).
