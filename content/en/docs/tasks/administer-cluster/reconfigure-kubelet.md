---
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
content_template: templates/task
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.11" state="beta" >}}

The [Dynamic Kubelet Configuration](https://github.com/kubernetes/features/issues/281)
feature allows you to change the configuration of each Kubelet in a live Kubernetes
cluster by deploying a ConfigMap and configuring each Node to use it.

**Warning:** All Kubelet configuration parameters may be changed dynamically,
but not all parameters are safe to change dynamically. This feature is intended
for system experts who have a strong understanding of how configuration changes
will affect behavior. In general, you should always carefully test config changes
on a small set of nodes before rolling them out to your entire cluster.
Additional per-config-field advice can be found in the inline `KubeletConfiguration`
[type documentation](https://github.com/kubernetes/kubernetes/blob/release-1.11/pkg/kubelet/apis/kubeletconfig/v1beta1/types.go).
{{% /capture %}}

{{% capture prerequisites %}}
- A live Kubernetes cluster with both Master and Node at v1.11 or higher must
be running and the Kubelet's `--dynamic-config-dir` flag must be set to a
writable directory on the Node.
This flag must be set to enable Dynamic Kubelet Configuration.
- The kubectl command-line tool must be v1.11 or higher, and must be
configured to communicate with the cluster.
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
For the feature to work correctly, you must be running a process manager
(like systemd) which will restart the Kubelet when it exits. When the Kubelet is
restarted, it will begin using the new configuration.

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

**Warning:** Note that while it is *possible* to change the configuration by
updating the ConfigMap in-place, this will cause all Kubelets configured with
that ConfigMap to update simultaneously. It is much safer to treat ConfigMaps
as immutable by convention, aided by `kubectl`'s `--append-hash` option,
and incrementally roll out updates to `Node.Spec.ConfigSource`.

### Note Regarding the Node Authorizer

Old versions of this document required users to manually create RBAC rules
for Nodes to access their assigned ConfigMaps. The Node Authorizer now
automatically configures these rules, so this step is no longer necessary.

### Generating a file that contains the current configuration

The Dynamic Kubelet Configuration feature allows you to provide an override for
the entire configuration object, rather than a per-field overlay. This is a
simpler model that makes it easier to trace the source of configuration values
and debug issues. The compromise, however, is that you must start with knowledge
of the existing configuration to ensure that you only change the fields you
intend to change.

In the future, the Kubelet will be bootstrapped from just a file on disk
(see [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file)),
and you will simply edit a copy of this file (which, as a best practice, should
live in version control) while creating the first Kubelet ConfigMap. Today,
however, the Kubelet is bootstrapped with a combination of this file and command-line flags
that can override the configuration in the file.
Fortunately, there is a dirty trick you can use to generate a config file containing a Node's
current configuration. The trick involves accessing the Kubelet server's `configz`
endpoint via the kubectl proxy. This endpoint, in its current implementation, is
intended to be used only as a debugging aid, which is part of why this is a
dirty trick. The endpoint may be improved in the future, but until then
it should not be relied on for production scenarios.
This trick also requires the `jq` command to be installed on your machine,
for unpacking and editing the JSON response from the endpoint.

Do the following to generate the file:

1. Pick a Node to reconfigure. We will refer to this Node's name as NODE_NAME.
2. Start the kubectl proxy in the background with `kubectl proxy --port=8001 &`
3. Run the following command to download and unpack the configuration from the
configz endpoint:

```
$ export NODE_NAME=the-name-of-the-node-you-are-reconfiguring
$ curl -sSL http://localhost:8001/api/v1/nodes/${NODE_NAME}/proxy/configz | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubelet.config.k8s.io/v1beta1"' > kubelet_configz_${NODE_NAME}
```

Note that we have to manually add the `kind` and `apiVersion` to the downloaded
object, as these are not reported by the configz endpoint. This is one of the
limitations of the endpoint.

### Edit the configuration file

Using your editor of choice, change one of the parameters in the
`kubelet_configz_${NODE_NAME}` file from the previous step. A QPS parameter,
`eventRecordQPS` for example, is a good candidate.

### Push the configuration file to the control plane

Push the edited configuration file to the control plane with the
following command:

```
$ kubectl -n kube-system create configmap my-node-config --from-file=kubelet=kubelet_configz_${NODE_NAME} --append-hash -o yaml
```

You should see a response similar to:

```
apiVersion: v1
data:
  kubelet: |
    {...}
kind: ConfigMap
metadata:
  creationTimestamp: 2017-09-14T20:23:33Z
  name: my-node-config-gkt4c2m4b2
  namespace: kube-system
  resourceVersion: "119980"
  selfLink: /api/v1/namespaces/kube-system/configmaps/my-node-config-gkt4c2m4b2
  uid: 946d785e-998a-11e7-a8dd-42010a800006
```

We create the ConfigMap in the `kube-system` namespace, which is appropriate
because this ConfigMap configures a Kubernetes system component - the Kubelet.

The `--append-hash` option appends a short checksum of the ConfigMap contents
to the name. This is convenient for an edit->push workflow, as it will
automatically, yet deterministically, generate new names for new ConfigMaps.
We will refer to the name that includes this generated hash as
`CONFIG_MAP_NAME` below.

### Set the Node to use the new configuration

Edit the Node's reference to point to the new ConfigMap with the
following command:

```
kubectl edit node ${NODE_NAME}
```

Once in your editor, add the following YAML under `spec`:

```
configSource:
    configMap:
        name: CONFIG_MAP_NAME
        namespace: kube-system
        kubeletConfigKey: kubelet
```

Be sure to specify all three of `name`, `namespace`, and `kubeletConfigKey`.
The last parameter tells the Kubelet which key of the ConfigMap it can find
its config in.

### Observe that the Node begins using the new configuration

Retrieve the Node with `kubectl get node ${NODE_NAME} -o yaml`, and inspect
`Node.Status.Config`. You should see the config sources corresponding to the `active`,
`assigned`, and `lastKnownGood` configurations reported in the status. The `active`
configuration is the version the Kubelet is currently running with, the `assigned`
configuration is the latest version the Kubelet has resolved based on
`Node.Spec.ConfigSource`, and the `lastKnownGood` configuration is the version the
Kubelet will fall back to if an invalid config is assigned in `Node.Spec.ConfigSource`.

You might not see `lastKnownGood` appear in the status if it is set to its default value,
the local config deployed with the node. The status will update `lastKnownGood` to
match a valid `assigned` config after the Kubelet becomes comfortable with the config. 
The details of how the Kubelet determines a config should become the `lastKnownGood` are 
not guaranteed by the API, though it may be useful, for debugging purposes, to know that
this is presently implemented as a 10-minute grace period. 

For convenience, you can use the following command (using `jq`) to filter down
to the config status:

```
$ kubectl get no ${NODE_NAME} -o json | jq '.status.config'
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

If something goes wrong, the Kubelet will report any configuration related errors
in `Node.Status.Config.Error`. You may see one of several possible errors, which
are detailed in a table at the end of this article. If you see any of these errors,
you can search for the same error message in the Kubelet's log for additional details.

### Edit the configuration file again

To change the configuration again, we simply repeat the above workflow.
Try editing the `kubelet_configz_${NODE_NAME}` file, changing the previously changed parameter to a
new value.

### Push the newly edited configuration to the control plane

Push the new configuration to the control plane in a new ConfigMap with the
following command:

```
$ kubectl -n kube-system create configmap my-node-config --from-file=kubelet=kubelet_configz_${NODE_NAME} --append-hash -o yaml
```

This new ConfigMap will get a new name, as we have changed the contents.
We will refer to the new name as `NEW_CONFIG_MAP_NAME`.

### Configure the Node to use the new configuration

Once more, edit `Node.Spec.ConfigSource` via `kubectl edit node ${NODE_NAME}`.
Your new `Node.Spec.ConfigSource` should look like the following,
with `${NEW_CONFIG_MAP_NAME}` substituted as necessary:

```
configSource:
    configMap:
        name: ${NEW_CONFIG_MAP_NAME}
        namespace: kube-system
        kubeletConfigKey: kubelet
```

### Observe that the Kubelet is using the new configuration

Once more, retrieve the Node with `kubectl get node ${NODE_NAME} -o yaml`, and
look for a `Node.Status.Config` that reports the new configuration as `assigned`
and `active`, with no errors.

### Reset the Node to use its local default configuration

Finally, if you wish to reset the Node to use the configuration it was
provisioned with, simply edit the Node with `kubectl edit node ${NODE_NAME}` and
remove the `Node.Spec.ConfigSource` field.

### Observe that the Node is using its local default configuration

After removing this subfield, you should eventually observe that `Node.Status.Config`
has become empty, as all config sources have been reset to `nil` (indicating the local
default config is `assigned`, `active`, and `lastKnownGood`), and no error is reported.

{{% /capture %}}

{{% capture discussion %}}
## Kubectl Patch Example
As mentioned above, there are many ways to change a Node's configSource.
Here is an example command that uses `kubectl patch`:

```
kubectl patch node ${NODE_NAME} -p "{\"spec\":{\"configSource\":{\"configMap\":{\"name\":\"${CONFIG_MAP_NAME}\",\"namespace\":\"kube-system\",\"kubeletConfigKey\":\"kubelet\"}}}}"
```

## Understanding how the Kubelet checkpoints config

When a new config is assigned to the Node, the Kubelet downloads and unpacks the
config payload as a set of files on local disk. The Kubelet also records metadata
that locally tracks the assigned and last-known-good config sources, so that the
Kubelet knows which config to use across restarts, even if the API server becomes 
unavailable. After checkpointing a config and the relevant metadata, the Kubelet 
will exit if the assigned config has changed. When the Kubelet is restarted by the
babysitter process, it will read the new metadata, and use the new config.

The recorded metadata is fully resolved, meaning that it contains all necessary
information to choose a specific config version - typically a `UID` and `ResourceVersion`.
This is in contrast to `Node.Spec.ConfigSource`, where the intended config is declared
via the idempotent `namespace/name` that identifies the target ConfigMap; the Kubelet 
tries to use the latest version of this ConfigMap.

It can sometimes be useful to inspect the Kubelet's config metadata and checkpoints
when debugging a Node. The structure of the Kubelet's checkpointing directory is as follows:

```
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

The following table describes the error messages you might encounter
when using Dynamic Kubelet Config. You can search for the same text
as the error message in the Kubelet log for additional details
on the error.

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
