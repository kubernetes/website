---
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
---

{% capture overview %}
{% include feature-state-alpha.md %}
As of Kubernetes 1.8, the new
[Dynamic Kubelet Configuration](https://github.com/kubernetes/features/issues/281)
feature is available in alpha. This allows you to change the configuration of
Kubelets in a live Kubernetes cluster via first-class Kubernetes concepts.
Specifically, this feature allows you to configure individual Nodes' Kubelets
via ConfigMaps.

**Warning:** All Kubelet configuration parameters may be changed dynamically,
but not all parameters are safe to change dynamically. This feature is intended
for system experts who have a strong understanding of how configuration changes
will affect behavior. No documentation currently exists which plainly lists
"safe to change" fields, but we plan to add it before this feature graduates
from alpha.
{% endcapture %}

{% capture prerequisites %}
- A live Kubernetes cluster with both Master and Node at v1.8 or higher must be
running, with the `DynamicKubeletConfig` feature gate enabled and the Kubelet's
`--dynamic-config-dir` flag set to a writeable directory on the Node.
This flag must be set to enable Dynamic Kubelet Configuration.
- The kubectl command-line tool must be also v1.8 or higher, and must be
configured to communicate with the cluster.
{% endcapture %}

{% capture steps %}

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

The status of the Node's Kubelet configuration is reported via the `KubeletConfigOK`
condition in the Node status. Once you have updated a Node to use the new
ConfigMap, you can observe this condition to confirm that the Node is using the
intended configuration. A table describing the possible conditions can be found
at the end of this article.

This document describes editing Nodes using `kubectl edit`.
There are other ways to modify a Node's spec, including `kubectl patch`, for
example, which facilitate scripted workflows.

This document only describes a single Node consuming each ConfigMap. Keep in
mind that it is also valid for multiple Nodes to consume the same ConfigMap.

### Node Authorizer Workarounds

The Node Authorizer does not yet pay attention to which ConfigMaps are assigned
to which Nodes. If you currently use the Node authorizer, your Kubelets will not
be automatically granted permission to download their respective ConfigMaps.

The temporary workaround used in this document is to manually create the RBAC
Roles and RoleBindings for each ConfigMap. The Node Authorizer will be extended
before the Dynamic Kubelet Configuration feature graduates from alpha, so doing
this in production should never be necessary.

### Generating a file that contains the current configuration

The Dynamic Kubelet Configuration feature allows you to provide an override for
the entire configuration object, rather than a per-field overlay. This is a
simpler model that makes it easier to trace the source of configuration values
and debug issues. The compromise, however, is that you must start with knowledge
of the existing configuration to ensure that you only change the fields you
intend to change.

In the future, the Kubelet will be bootstrapped from a file on disk
(see [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file)),
and you will simply edit a copy of this file (which, as a best practice, should
live in version control) while creating the first Kubelet ConfigMap. Today,
however, the Kubelet is still bootstrapped with command-line flags. Fortunately,
there is a dirty trick you can use to generate a config file containing a Node's
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
$ curl -sSL http://localhost:8001/api/v1/proxy/nodes/${NODE_NAME}/configz | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubelet.config.k8s.io/v1beta1"' > kubelet_configz_${NODE_NAME}
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

Note that the configuration data must appear under the ConfigMap's
`kubelet` key.

We create the ConfigMap in the `kube-system` namespace, which is appropriate
because this ConfigMap configures a Kubernetes system component - the Kubelet.

The `--append-hash` option appends a short checksum of the ConfigMap contents
to the name. This is convenient for an edit->push workflow, as it will
automatically, yet deterministically, generate new names for new ConfigMaps. 

We use the `-o yaml` output format so that the name, namespace, and uid are all
reported following creation. We will need these in the next step. We will refer
to the name as CONFIG_MAP_NAME and the uid as CONFIG_MAP_UID.

### Authorize your Node to read the new ConfigMap

Now that you've created a new ConfigMap, you need to authorize your node to
read it. First, create a Role for your new ConfigMap with the 
following commands:

```
$ export CONFIG_MAP_NAME=name-from-previous-output
$ kubectl -n kube-system create role ${CONFIG_MAP_NAME}-reader --verb=get --resource=configmap --resource-name=${CONFIG_MAP_NAME}
```

Next, create a RoleBinding to associate your Node with the new Role:

```
$ kubectl -n kube-system create rolebinding ${CONFIG_MAP_NAME}-reader --role=${CONFIG_MAP_NAME}-reader --user=system:node:${NODE_NAME}
```

Once the Node Authorizer is updated to do this automatically, you will
be able to skip this step. 

### Set the Node to use the new configuration

Edit the Node's reference to point to the new ConfigMap with the
following command:

```
kubectl edit node ${NODE_NAME}
```

Once in your editor, add the following YAML under `spec`:

```
configSource:
    configMapRef:
        name: CONFIG_MAP_NAME
        namespace: kube-system
        uid: CONFIG_MAP_UID
```

Be sure to specify all three of `name`, `namespace`, and `uid`.

### Observe that the Node begins using the new configuration

Retrieve the Node with `kubectl get node ${NODE_NAME} -o yaml`, and look for the
`KubeletConfigOK` condition in `status.conditions`. You should see the message
`Using current (UID: CONFIG_MAP_UID)` when the Kubelet starts using the new
configuration.

For convenience, you can use the following command (using `jq`) to filter down
to the `KubeletConfigOK` condition:

```
$ kubectl get no ${NODE_NAME} -o json | jq '.status.conditions|map(select(.type=="KubeletConfigOK"))'
[
  {
    "lastHeartbeatTime": "2017-09-20T18:08:29Z",
    "lastTransitionTime": "2017-09-20T18:08:17Z",
    "message": "using current: /api/v1/namespaces/kube-system/configmaps/my-node-config-gkt4c2m4b2",
    "reason": "passing all checks",
    "status": "True",
    "type": "KubeletConfigOK"
  }
]
```

If something goes wrong, you may see one of several different error conditions,
detailed in the table of KubeletConfigOK conditions, below. When this happens, you
should check the Kubelet's log for more details.

### Edit the configuration file again

To change the configuration again, we simply repeat the above workflow.
Try editing the `kubelet` file, changing the previously changed parameter to a
new value.

### Push the newly edited configuration to the control plane

Push the new configuration to the control plane in a new ConfigMap with the
following command:

```
$ kubectl create configmap my-node-config --namespace=kube-system --from-file=kubelet=kubelet_configz_${NODE_NAME} --append-hash -o yaml
```

This new ConfigMap will get a new name, as we have changed the contents.
We will refer to the new name as NEW_CONFIG_MAP_NAME and the new uid
as NEW_CONFIG_MAP_UID.

### Authorize your Node to read the new ConfigMap

Now that you've created a new ConfigMap, you need to authorize your node to
read it. First, create a Role for your new ConfigMap with the 
following commands:

```
$ export NEW_CONFIG_MAP_NAME=name-from-previous-output
$ kubectl -n kube-system create role ${NEW_CONFIG_MAP_NAME}-reader --verb=get --resource=configmap --resource-name=${NEW_CONFIG_MAP_NAME}
```

Next, create a RoleBinding to associate your Node with the new Role:

```
$ kubectl -n kube-system create rolebinding ${NEW_CONFIG_MAP_NAME}-reader --role=${NEW_CONFIG_MAP_NAME}-reader --user=system:node:${NODE_NAME}
```

Once the Node Authorizer is updated to do this automatically, you will
be able to skip this step. 

### Configure the Node to use the new configuration

Once more, edit the Node's `spec.configSource` with
`kubectl edit node ${NODE_NAME}`. Your new `spec.configSource` should look like
the following, with `name` and `uid` substituted as necessary:

```
configSource:
    configMapRef:
        name: ${NEW_CONFIG_MAP_NAME}
        namespace: kube-system
        uid: ${NEW_CONFIG_MAP_UID}
```

### Observe that the Kubelet is using the new configuration

Once more, retrieve the Node with `kubectl get node ${NODE_NAME} -o yaml`, and
look for the `KubeletConfigOK` condition in `status.conditions`. You should see the message
`using current: /api/v1/namespaces/kube-system/configmaps/${NEW_CONFIG_MAP_NAME}` when the Kubelet starts using the
new configuration.

### Deauthorize your Node fom reading the old ConfigMap

Once you know your Node is using the new configuration and are confident that
the new configuration has not caused any problems, it is a good idea to
deauthorize the node from reading the old ConfigMap. Run the following
commands to remove the RoleBinding and Role:

```
$ kubectl -n kube-system delete rolebinding ${CONFIG_MAP_NAME}-reader
$ kubectl -n kube-system delete role ${CONFIG_MAP_NAME}-reader
```

Note that this does not necessarily prevent the Node from reverting to the old
configuration, as it may locally cache the old ConfigMap for an indefinite
period of time.

You may optionally also choose to remove the old ConfigMap:

```
$ kubectl -n kube-system delete configmap ${CONFIG_MAP_NAME}
```

Once the Node Authorizer is updated to do this automatically, you will
be able to skip this step.

### Reset the Node to use its local default configuration

Finally, if you wish to reset the Node to use the configuration it was
provisioned with, simply edit the Node with `kubectl edit node ${NODE_NAME}` and
remove the `spec.configSource` subfield.

### Observe that the Node is using its local default configuration

After removing this subfield, you should eventually observe that the KubeletConfigOK
condition's message reverts to `using current: local`.

### Deauthorize your Node fom reading the old ConfigMap

Once you know your Node is using the default configuration again, it is a good
idea to deauthorize the node from reading the old ConfigMap. Run the following
commands to remove the RoleBinding and Role:

```
$ kubectl -n kube-system delete rolebinding ${NEW_CONFIG_MAP_NAME}-reader
$ kubectl -n kube-system delete role ${NEW_CONFIG_MAP_NAME}-reader
```

Note that this does not necessarily prevent the Node from reverting to the old
ConfigMap, as it may locally cache the old ConfigMap for an indefinite
period of time.

You may optionally also choose to remove the old ConfigMap:

```
$ kubectl -n kube-system delete configmap ${NEW_CONFIG_MAP_NAME}
```

Once the Node Authorizer is updated to do this automatically, you will
be able to skip this step.

{% endcapture %}

{% capture discussion %}
## Kubectl Patch Example
As mentioned above, there are many ways to change a Node's configSource.
Here is an example command that uses `kubectl patch`:

```
kubectl patch node ${NODE_NAME} -p "{\"spec\":{\"configSource\":{\"configMapRef\":{\"name\":\"${CONFIG_MAP_NAME}\",\"namespace\":\"kube-system\",\"uid\":\"${CONFIG_MAP_UID}\"}}}}"
```

## Understanding KubeletConfigOK Conditions

The following table describes several of the `KubeletConfigOK` Node conditions you
might encounter in a cluster that has Dynamic Kubelet Config enabled. If you
observe a condition with `status=False`, you should check the Kubelet log for
more error details by searching for the message or reason text.

<table>


<table align="left">
<tr>
    <th>Possible Messages</th>
    <th>Possible Reasons</th>
    <th>Status</th>
</tr>
<tr>
    <td><p>using current: local</p></td>
    <td><p>when the config source is nil, the Kubelet uses its local config</p></td>
    <td><p>True</p></td>
</tr>
<tr>
    <td><p>using current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</p></td>
    <td><p>passing all checks</p></td>
    <td><p>True</p></td>
</tr>
<tr>
    <td><p>using last-known-good: local</p></td>
    <td>
        <ul>
            <li>failed to load current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</li>
            <li>failed to parse current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</li>
            <li>failed to validate current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</li>
        </ul>
    </td>
    <td><p>False</p></td>
</tr>
<tr>
    <td><p>using last-known-good: /api/v1/namespaces/${LAST_KNOWN_GOOD_CONFIG_MAP_NAMESPACE}/configmaps/${LAST_KNOWN_GOOD_CONFIG_MAP_NAME}</p></td>
    <td>
        <ul>
            <li>failed to load current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</li>
            <li>failed to parse current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</li>
            <li>failed to validate current: /api/v1/namespaces/${CURRENT_CONFIG_MAP_NAMESPACE}/configmaps/${CURRENT_CONFIG_MAP_NAME}</li>
        </ul>
    </td>
    <td><p>False</p></td>
</tr>
<tr>
    <td>
        <p>
            The reasons in the next column could potentially appear for any of
            the above messages.
        </p>
        <p>
            This condition indicates that the Kubelet is having trouble
            reconciling `spec.configSource`, and thus no change to the in-use
            configuration has occurred.
        </p>
        <p>
            The "failed to sync" reasons are specific to the failure that
            occurred, and the next column does not necessarily contain all
            possible failure reasons.
        </p>
    </td>
    <td>
    <p>failed to sync, reason:</p>
    <ul>
        <li>failed to read Node from informer object cache</li>
        <li>failed to reset to local config</li>
        <li>invalid NodeConfigSource, exactly one subfield must be non-nil, but all were nil</li>
        <li>invalid ObjectReference, all of UID, Name, and Namespace must be specified</li>
        <li>invalid ConfigSource.ConfigMapRef.UID: ${UID} does not match ${API_PATH}.UID: ${UID_OF_CONFIG_MAP_AT_API_PATH}</li>
        <li>failed to determine whether object ${API_PATH} with UID ${UID} was already checkpointed</li>
        <li>failed to download ConfigMap with name ${NAME} from namespace ${NAMESPACE}</li>
        <li>failed to save config checkpoint for object ${API_PATH} with UID ${UID}</li>
        <li>failed to set current config checkpoint to local config</li>
        <li>failed to set current config checkpoint to object ${API_PATH} with UID ${UID}</li>
    </ul>
    </td>
    <td><p>False</p></td>
</tr>
</table>
{% endcapture %}


{% include templates/task.md %}
