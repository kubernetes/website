---
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
content_template: templates/task
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.11" state="beta" >}}

[Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/issues/281)
allows you to change the configuration of each Kubelet in a live Kubernetes
cluster by deploying a ConfigMap and configuring each Node to use it.

{{< warning >}}
All Kubelet configuration parameters can be changed dynamically,
but this is unsafe for some parameters. Before deciding to change a parameter
dynamically, you need a strong understanding of how that change will affect your
cluster's behavior. Always carefully test configuration changes on a small set
of nodes before rolling them out cluster-wide. Advice on configuring specific
fields is available in the inline `KubeletConfiguration`
[type documentation](https://github.com/kubernetes/kubernetes/blob/release-1.11/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go).
{{< /warning >}}
{{% /capture %}}

{{% capture prerequisites %}}
- Kubernetes v1.11 or higher on both the Master and the Nodes
- kubectl v1.11 or higher, configured to communicate with the cluster
- The Kubelet's `--dynamic-config-dir` flag must be set to a writable
  directory on the Node.
{{% /capture %}}

{{% capture steps %}}

## Reconfiguring the Kubelet on a Live Node in your Cluster

### Basic Workflow Overview

The basic workflow for configuring a Kubelet in a live cluster is as follows:

1. Write a YAML or JSON configuration file containing the
Kubelet's configuration.
2. Wrap this file in a ConfigMap and save it to the Kubernetes control plane.
3. Update the Kubelet's corresponding Node object to use this ConfigMap.

Each Kubelet watches a configuration reference on its respective Node object.
When this reference changes, the Kubelet downloads the new configuration,
updates a local reference to refer to the file, and exits.
For the feature to work correctly, you must be running an OS-level service
manager (such as systemd), which will restart the Kubelet if it exits. When the
Kubelet is restarted, it will begin using the new configuration.

The new configuration completely overrides configuration provided by `--config`,
and is overridden by command-line flags. Unspecified values in the new configuration
will receive default values appropriate to the configuration version
(e.g. `kubelet.config.k8s.io/v1beta1`), unless overridden by flags.

The status of the Node's Kubelet configuration is reported via 
`Node.Spec.Status.Config`. Once you have updated a Node to use the new
ConfigMap, you can observe this status to confirm that the Node is using the
intended configuration. 

This document describes editing Nodes using `kubectl edit`.
There are other ways to modify a Node's spec, including `kubectl patch`, for
example, which facilitate scripted workflows.

This document only describes a single Node consuming each ConfigMap. Keep in
mind that it is also valid for multiple Nodes to consume the same ConfigMap.

{{< warning >}}
While it is *possible* to change the configuration by
updating the ConfigMap in-place, this causes all Kubelets configured with
that ConfigMap to update simultaneously. It is much safer to treat ConfigMaps
as immutable by convention, aided by `kubectl`'s `--append-hash` option,
and incrementally roll out updates to `Node.Spec.ConfigSource`.
{{< /warning >}}

### Automatic RBAC rules for Node Authorizer

Previously, you were required to manually create RBAC rules
to allow Nodes to access their assigned ConfigMaps. The Node Authorizer now
automatically configures these rules.

### Generating a file that contains the current configuration

The Dynamic Kubelet Configuration feature allows you to provide an override for
the entire configuration object, rather than a per-field overlay. This is a
simpler model that makes it easier to trace the source of configuration values
and debug issues. The compromise, however, is that you must start with knowledge
of the existing configuration to ensure that you only change the fields you
intend to change.

Ideally, the Kubelet would be bootstrapped from a file on disk
and you could edit this file (which could also be version-controlled),
to create the first Kubelet ConfigMap
(see [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file)),
Currently, the Kubelet is bootstrapped with **a combination of this file and command-line flags**
that can override the configuration in the file.
As a workaround, you can generate a config file containing a Node's current
configuration by accessing the Kubelet server's `configz` endpoint via the
kubectl proxy. This endpoint, in its current implementation, is intended to be
used only as a debugging aid. Do not rely on the behavior of this endpoint for
production scenarios. The examples below use the `jq` command to streamline
working with JSON. To follow the tasks as written, you need to have `jq`
installed, but you can adapt the tasks if you prefer to extract the
`kubeletconfig` subobject manually.

#### Generate the configuration file

1.  Choose a Node to reconfigure. In this example, the name of this Node is
    referred to as `NODE_NAME`.
2.  Start the kubectl proxy in the background using the following command: 
      ```bash
      kubectl proxy --port=8001 &
      ```
3.  Run the following command to download and unpack the configuration from the
    `configz` endpoint. The command is long, so be careful when copying and
    pasting. **If you use zsh**, note that common zsh configurations add backslashes
    to escape the opening and closing curly braces around the variable name in the URL.
    For example: `${NODE_NAME}` will be rewritten as `$\{NODE_NAME\}` during the paste.
    You must remove the backslashes before running the command, or the command will fail.

      ```bash
      NODE_NAME="the-name-of-the-node-you-are-reconfiguring"; curl -sSL "http://localhost:8001/api/v1/nodes/${NODE_NAME}/proxy/configz" | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubelet.config.k8s.io/v1beta1"' > kubelet_configz_${NODE_NAME}
      ```

{{< note >}}
You need to manually add the `kind` and `apiVersion` to the downloaded
object, because they are not reported by the `configz` endpoint.
{{< /note >}}

#### Edit the configuration file

Using a text editor, change one of the parameters in the
file generated by the previous procedure. For example, you
might edit the QPS parameter `eventRecordQPS`.

#### Push the configuration file to the control plane

Push the edited configuration file to the control plane with the
following command:

```bash
kubectl -n kube-system create configmap my-node-config --from-file=kubelet=kubelet_configz_${NODE_NAME} --append-hash -o yaml
```

This is an example of a valid response:

```none
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-09-14T20:23:33Z
  name: my-node-config-gkt4c2m4b2
  namespace: kube-system
  resourceVersion: "119980"
  uid: 946d785e-998a-11e7-a8dd-42010a800006
data:
  kubelet: |
    {...}
```

The ConfigMap is created in the `kube-system` namespace because this
ConfigMap configures a Kubelet, which is Kubernetes system component.

The `--append-hash` option appends a short checksum of the ConfigMap contents
to the name. This is convenient for an edit-then-push workflow, because it
automatically, yet deterministically, generates new names for new ConfigMaps.
The name that includes this generated hash is referred to as `CONFIG_MAP_NAME`
in the following examples.

#### Set the Node to use the new configuration

Edit the Node's reference to point to the new ConfigMap with the
following command:

```bash
kubectl edit node ${NODE_NAME}
```

In your text editor, add the following YAML under `spec`:

```yaml
configSource:
    configMap:
        name: CONFIG_MAP_NAME
        namespace: kube-system
        kubeletConfigKey: kubelet
```

You must specify all three of `name`, `namespace`, and `kubeletConfigKey`.
The `kubeletConfigKey` parameter shows the Kubelet which key of the ConfigMap
contains its config.

#### Observe that the Node begins using the new configuration

Retrieve the Node using the `kubectl get node ${NODE_NAME} -o yaml` command and inspect
`Node.Status.Config`. The config sources corresponding to the `active`,
`assigned`, and `lastKnownGood` configurations are reported in the status.

- The `active` configuration is the version the Kubelet is currently running with.
- The `assigned` configuration is the latest version the Kubelet has resolved based on
  `Node.Spec.ConfigSource`.
- The `lastKnownGood` configuration is the version the
  Kubelet will fall back to if an invalid config is assigned in `Node.Spec.ConfigSource`.

The`lastKnownGood` configuration might not be present if it is set to its default value,
the local config deployed with the node. The status will update `lastKnownGood` to
match a valid `assigned` config after the Kubelet becomes comfortable with the config. 
The details of how the Kubelet determines a config should become the `lastKnownGood` are 
not guaranteed by the API, but is currently implemented as a 10-minute grace period.

You can use the following command (using `jq`) to filter down
to the config status:

```bash
kubectl get no ${NODE_NAME} -o json | jq '.status.config'
```

The following is an example response:

```json
{
  "active": {
    "configMap": {
      "kubeletConfigKey": "kubelet",
      "name": "my-node-config-9mbkccg2cc",
      "namespace": "kube-system",
      "resourceVersion": "1326",
      "uid": "705ab4f5-6393-11e8-b7cc-42010a800002"
    }
  },
  "assigned": {
    "configMap": {
      "kubeletConfigKey": "kubelet",
      "name": "my-node-config-9mbkccg2cc",
      "namespace": "kube-system",
      "resourceVersion": "1326",
      "uid": "705ab4f5-6393-11e8-b7cc-42010a800002"
    }
  },
  "lastKnownGood": {
    "configMap": {
      "kubeletConfigKey": "kubelet",
      "name": "my-node-config-9mbkccg2cc",
      "namespace": "kube-system",
      "resourceVersion": "1326",
      "uid": "705ab4f5-6393-11e8-b7cc-42010a800002"
    }
  }
}

```

If an error occurs, the Kubelet reports it in the `Node.Status.Config.Error`
structure. Possible errors are listed in
[Understanding Node.Status.Config.Error messages](#understanding-node-status-config-error-messages).
You can search for the identical text in the Kubelet log for additional details
and context about the error.

#### Make more changes

Follow the workflow above to make more changes and push them again. Each time
you push a ConfigMap with new contents, the --append-hash kubectl option creates
the ConfigMap with a new name. The safest rollout strategy is to first create a
new ConfigMap, and then update the Node to use the new ConfigMap.

#### Reset the Node to use its local default configuration

To reset the Node to use the configuration it was provisioned with, edit the
Node using `kubectl edit node ${NODE_NAME}` and remove the
`Node.Spec.ConfigSource` field.

#### Observe that the Node is using its local default configuration

After removing this subfield, `Node.Status.Config` eventually becomes
empty, since all config sources have been reset to `nil`, which indicates that
the local default config is `assigned`, `active`, and `lastKnownGood`, and no
error is reported.

{{% /capture %}}

{{% capture discussion %}}
## Kubectl Patch Example

You can change a Node's configSource using several different mechanisms.
This example uses `kubectl patch`:

```bash
kubectl patch node ${NODE_NAME} -p "{\"spec\":{\"configSource\":{\"configMap\":{\"name\":\"${CONFIG_MAP_NAME}\",\"namespace\":\"kube-system\",\"kubeletConfigKey\":\"kubelet\"}}}}"
```

## Understanding how the Kubelet checkpoints config

When a new config is assigned to the Node, the Kubelet downloads and unpacks the
config payload as a set of files on the local disk. The Kubelet also records metadata
that locally tracks the assigned and last-known-good config sources, so that the
Kubelet knows which config to use across restarts, even if the API server becomes 
unavailable. After checkpointing a config and the relevant metadata, the Kubelet 
exits if it detects that the assigned config has changed. When the Kubelet is
restarted by the OS-level service manager (such as `systemd`), it reads the new
metadata and uses the new config.

The recorded metadata is fully resolved, meaning that it contains all necessary
information to choose a specific config version - typically a `UID` and `ResourceVersion`.
This is in contrast to `Node.Spec.ConfigSource`, where the intended config is declared
via the idempotent `namespace/name` that identifies the target ConfigMap; the Kubelet 
tries to use the latest version of this ConfigMap.

When you are debugging problems on a node, you can inspect the Kubelet's config
metadata and checkpoints. The structure of the Kubelet's checkpointing directory is:

```none
- --dynamic-config-dir (root for managing dynamic config)
| - meta
  | - assigned (encoded kubeletconfig/v1beta1.SerializedNodeConfigSource object, indicating the assigned config)
  | - last-known-good (encoded kubeletconfig/v1beta1.SerializedNodeConfigSource object, indicating the last-known-good config)
| - checkpoints
  | - uid1 (dir for versions of object identified by uid1)
    | - resourceVersion1 (dir for unpacked files from resourceVersion1 of object with uid1)
    | - ...
  | - ...
```

## Understanding Node.Status.Config.Error messages

The following table describes error messages that can occur
when using Dynamic Kubelet Config. You can search for the identical text
in the Kubelet log for additional details and context about the error.

<table>
<table align="left">
<tr>
    <th>Error Message</th>
    <th>Possible Causes</th>
</tr>
<tr>
    <td><p>failed to load config, see Kubelet log for details</p></td>
    <td><p>The Kubelet likely could not parse the downloaded config payload, or encountered a filesystem error attempting to load the payload from disk.</p></td>
</tr>
<tr>
    <td><p>failed to validate config, see Kubelet log for details</p></td>
    <td><p>The configuration in the payload, combined with any command-line flag overrides, and the sum of feature gates from flags, the config file, and the remote payload, was determined to be invalid by the Kubelet.</p></td>
</tr>
<tr>
    <td><p>invalid NodeConfigSource, exactly one subfield must be non-nil, but all were nil</p></td>
    <td><p>Since Node.Spec.ConfigSource is validated by the API server to contain at least one non-nil subfield, this likely means that the Kubelet is older than the API server and does not recognize a newer source type.</p></td>
</tr>
<tr>
    <td><p>failed to sync: failed to download config, see Kubelet log for details</p></td>
    <td><p>The Kubelet could not download the config. It is possible that Node.Spec.ConfigSource could not be resolved to a concrete API object, or that network errors disrupted the download attempt. The Kubelet will retry the download when in this error state.</p></td>
</tr>
<tr>
    <td><p>failed to sync: internal failure, see Kubelet log for details</p></td>
    <td><p>The Kubelet encountered some internal problem and failed to update its config as a result. Examples include filesystem errors and reading objects from the internal informer cache.</p></td>
</tr>
<tr>
    <td><p>internal failure, see Kubelet log for details</p></td>
    <td><p>The Kubelet encountered some internal problem while manipulating config, outside of the configuration sync loop.</p></td>
</tr>
</table>

{{% /capture %}}
