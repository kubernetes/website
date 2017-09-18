---
approvers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
---

{% capture overview %}
As of Kubernetes 1.8, the new [Dynamic Kubelet Configuration](https://github.com/kubernetes/features/issues/281) feature is available in alpha. This allows you to change the configuration of Kubelets in a live Kubernetes cluster via first-class Kubernetes concepts. Specifically, this feature allows you to configure individual Nodes' Kubelets via ConfigMaps.

**Warning:** The organization of the Kubelet's configuration type is still considered alpha, and it is likely to be restructured with breaking changes before graduating from alpha.

**Warning:** All Kubelet configuration parameters may be changed dynamically, but not all parameters are safe to change dynamically. This feature is intended for system experts who have a strong understanding of how configuration changes will affect behavior. No documentation currently exists which plainly lists "safe to change" fields, but we plan to add it before this feature graduates from alpha.
{% endcapture %}

{% capture prerequisites %}
- A live Kubernetes cluster at version 1.8 or higher must be running, with the `DynamicKubeletConfig` feature gate enabled.
- The kubectl command-line tool (also v1.8 or higher) must be configured to communicate with the cluster.
{% endcapture %}

{% capture steps %}

## Reconfiguring the Kubelet on a Live Node in your Cluster

### Basic Workflow Overview

The basic workflow for configuring a Kubelet in a live cluster is as follows:
1. Write a yaml or json configuration file containing the Kubelet's configuration.
2. Wrap this file in a ConfigMap and save it to the Kubernetes control plane.
3. Update the Kubelet's correspoinding Node object to use this ConfigMap.

The status of the Node's Kubelet configuration is reported via the `ConfigOK` condition in the Node status. Once you have updated a Node to use the new ConfigMap, you can observe this condition to confirm that the Node is using the intended configuration. A table describing the possible conditions can be found at the end of this article.

This document describes editing Nodes using `kubectl edit`. There are other ways to modify a Node's spec, including `kubectl patch`, for example, which facilitate scripted workflows.

This document only describes a single Node consuming each ConfigMap. Keep in mind that it is also valid for multiple Nodes to consume the same ConfigMap.

### Workaround: Add system:Nodes subject to the system:Node ClusterRoleBinding 

The Node authorizer does not yet pay attention to which ConfigMaps are assigned to which Nodes. If you currently use the Node authorizer, your Kubelets will not be automatically granted permission to download their respective ConfigMaps. The temporary workaround used in this document is to add the system:Nodes subject to the system:Node ClusterRoleBinding, which will grant the required permissions. The Node authorizer will be extended before the Dynamic Kubelet Configuration feature graduates from alpha, so doing this in production should never be necessary.

Edit the `system:Node` ClusterRoleBinding with `kubectl edit clusterrolebinding system:Node` and add the following subject under `subjects`:

```
subjects:                                                                       
- apiGroup: rbac.authorization.k8s.io                                           
  kind: Group                                                                   
  name: system:Nodes 
```


### Generating a file that contains the current configuration

The Dynamic Kubelet Configuration feature allows you to provide an override for the entire configuration object, rather than a per-field overlay. This is a simpler model that makes it easier to trace the source of configuration values and debug issues. The compromise, however, is that you must start with knowledge of the existing configuration to ensure that you only change the fields you intend to change.

In the future, the Kubelet will be bootstrapped from a file on disk, and you will simply edit a copy of this file (which, as a best practice, should live in version control) while creating the first Kubelet ConfigMap. Today, however, the Kubelet is still bootstrapped with command-line flags. Fortunately, there is a dirty trick you can use to generate a config file containing a Node's current configuration. The trick involves hitting the Kubelet server's `configz` endpoint via the kubectl proxy. This endpoint, in its current implementation, is intended to be used only as a debugging aid, which is part of why this is a dirty trick. There is ongoing work to improve the endpoint, and in the future this will be a less "dirty" operation. This trick also requires the `jq` command to be installed on your machine, for unpacking and editing the json response from the endpoint.

Do the following to generate the file:
1. Pick a Node to reconfigure. We will refer to this Node's name as NODE_NAME.
2. Start the kubectl proxy in the background with `kubectl proxy --port=8001 &`
3. Run the following command to download and unpack the configuration from the configz endpoint: 

```
curl http://localhost:8001/api/v1/proxy/Nodes/NODE_NAME/configz | jq '.kubeletconfig|.kind="KubeletConfiguration"|.apiVersion="kubeletconfig/v1alpha1"' > kubelet
```

Note that we have to manually add the `kind` and `apiVersion` to the downloaded object, as these are not reported by the configz endpoint. This is one of the limitations of the endpoint that is planned to be fixed in the future.

### Edit the configuration file

Using your editor of choice, change one of the parameters in the `kubelet` file from the previous step. A QPS parameter, `eventRecordQPS` for example, is a good candidate.

### Push the configuration file to the control plane

Push the edited configuration file to the control plane with the following command:

```
kubectl create configmap my-Node-config --namespace=kube-system --from-file kubelet --append-hash -o yaml
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
  name: my-Node-config-gkt4c2m4b2
  namespace: kube-system
  resourceVersion: "119980"
  selfLink: /api/v1/namespaces/kube-system/configmaps/my-Node-config-gkt4c2m4b2
  uid: 946d785e-998a-11e7-a8dd-42010a800006
```

Note that the configuration must be in a file named `kubelet`, so that the data appears under the `kubelet` key of the ConfigMap.

We create the ConfigMap in the `kube-system` namespace, which is appropriate because this ConfigMap configures a Kubernetes system component - the Kubelet.

The `--append-hash` option appends a short checksum of the ConfigMap contents to the name. This is convenient for an edit->push workflow, as it will automatically, yet deterministically, generate new names for new ConfigMaps. 

We use the `-o yaml` output format so that the name, namespace, and uid are all reported following creation. We will need these in the next step. We will refer to the name as CONFIG_MAP_NAME and the uid as CONFIG_MAP_UID.

### Set the Node to use the new configuration

Each Kubelet watches a configuration reference on its respective Node object. When this reference changes, the Kubelet downloads the new configuration and restarts to begin using it. Edit the Node's reference to point to the new ConfigMap with the following command:

`kubectl edit Node NODE_NAME`

Once in your editor, add the following under `spec`:

```
configSource:
    configMapRef:
        name: CONFIG_MAP_NAME
        namespace: kube-system
        uid: CONFIG_MAP_UID
```

Be sure to specify all three of `name`, `namespace`, and `uid`.

### Observe that the Node begins using the new configuration

Retrieve the Node with `kubectl get node NODE_NAME -o yaml`, and look for the `ConfigOK` condition in `status.conditions`. You should the message `Using current (UID: CONFIG_MAP_UID)` when the Kubelet starts using the new configuration.

For convenience, you can use the following command (using `jq`) to filter down to the `ConfigOK` condition:

```
kubectl get no NODE_NAME -o json | jq '.status.conditions|map(select(.type=="ConfigOK"))'
```

If something goes wrong, you may see one of several different error conditions, detailed in the Table of ConfigOK Conditions, below. When this happens, you should check the Kubelet's log for more details.

### Edit the configuration file again

To change the configuration again, we simply repeat the above workflow. Try editing the `kubelet` file, changing the previously changed parameter to a new value.

### Push the newly edited configuration to the control plane

Push the new configuration to the control plane in a new ConfigMap with the following command:

`kubectl create configmap my-Node-config --namespace=kube-system --from-file kubelet --append-hash -o yaml`

This new ConfigMap will get a new name, as we have changed the contents. We will refer to the new name as NEW_CONFIG_MAP_NAME and the new uid as NEW_CONFIG_MAP_UID.

### Once more configure the Node to use the new configuration

Once more, edit the Node's `spec.configSource` with `kubectl edit Node NODE_NAME`. Your new `spec.configSource` should look like the following, with names substituted as necessary:

```
configSource:
    configMapRef:
        name: NEW_CONFIG_MAP_NAME
        namespace: kube-system
        uid: NEW_CONFIG_MAP_UID
```

### Once more observe that the Kubelet is using the new configuration

Once more, retrieve the Node with `kubectl get node NODE_NAME -o yaml`, and look for the `ConfigOK` condition in `status.conditions`. You should the message `Using current (UID: NEW_CONFIG_MAP_UID)` when the Kubelet starts using the new configuration.

### Reset the Node to use the default configuration again

Finally, if you wish to reset the Node to use the configuration it was provisioned with, simply edit the Node with `kubectl edit Node NODE_NAME` and remove the `spec.configSource` subfield.

After removing this subfield, you should eventually observe that the ConfigOK condition's message reverts to either `using current (default)` or `using current (init)`, depending on how the Node was provisioned.
{% endcapture %}

{% capture discussion %}
## Understanding ConfigOK Conditions

The following table describes several of the `ConfigOK` Node conditions you might encounter in a cluster that has Dynamic Kubelet Config enabled. If you observe a condition with `status=False`, you should check the Kubelet log for more error details by searching for the message or reason text.

<table>


<table align="left">
<tr>
    <th>Possible Messages</th>
    <th>Possible Reasons</th>
    <th>Status</th>
</tr>
<tr>
    <td>using current (default)</td>
    <td>current is set to the local default, and no init config was provided</td>
    <td>True</td>
</tr>
<tr>
    <td>using current (init)</td>
    <td>current is set to the local default, and an init config was provided</td>
    <td>True</td>
</tr>
<tr>
    <td>using current (UID: CURRENT_CONFIG_MAP_UID)</td>
    <td>passing all checks</td>
    <td>True</td>
</tr>
<tr>
    <td>using last-known-good (default)</td>
    <td>
        <ul>
            <li>failed to load current (UID: CURRENT_CONFIG_MAP_UID)</li>
            <li>failed to parse current (UID: CURRENT_CONFIG_MAP_UID)</li>
            <li>failed to validate current (UID: CURRENT_CONFIG_MAP_UID)</li>
        </ul>
    </td>
    <td>False</td>
</tr>
<tr>
    <td>using last-known-good (init)</td>
    <td>
        <ul>
            <li>failed to load current (UID: CURRENT_CONFIG_MAP_UID)</li>
            <li>failed to parse current (UID: CURRENT_CONFIG_MAP_UID)</li>
            <li>failed to validate current (UID: CURRENT_CONFIG_MAP_UID)</li>
        </ul>
    </td>
    <td>False</td>
</tr>
<tr>
    <td>using last-known-good (UID: LAST_KNOWN_GOOD_CONFIG_MAP_UID)</td>
    <td>
        <ul>
            <li>failed to load current (UID: CURRENT_CONFIG_MAP_UID)</li>
            <li>failed to parse current (UID: CURRENT_CONFIG_MAP_UID)</li>
            <li>failed to validate current (UID: CURRENT_CONFIG_MAP_UID)</li>
        </ul>
    </td>
    <td>False</td>
</tr>
<tr>
    <td>
        <p>The reasons in the next column could potentially appear for any of the above messages.</p>
        <p>This condition indicates that the Kubelet is having trouble reconciling `spec.configSource`, and thus no change to the in-use configuration has occurred.</p>
        <p>The "failed to sync" reasons are specific to the failure that occurred, and the next column does not necessarily contain all possible failure reasons.</p>
    </td>
    <td>
    failed to sync, reason:
    <ul>
        <li>failed to read Node from informer object cache</li>
        <li>failed to reset to local (default or init) config</li>
        <li>invalid NodeConfigSource, exactly one subfield must be non-nil, but all were nil</li>
        <li>invalid ObjectReference, all of UID, Name, and Namespace must be specified</li>
        <li>invalid ObjectReference, UID SOME_UID does not match UID of downloaded ConfigMap SOME_OTHER_UID</li>
        <li>failed to determine whether object with UID SOME_UID was already checkpointed</li>
        <li>failed to download ConfigMap with name SOME_NAME from namespace SOME_NAMESPACE</li>
        <li>failed to save config checkpoint for object with UID SOME_UID</li>
        <li>failed to set current config checkpoint to default</li>
        <li>failed to set current config checkpoint to object with UID SOME_UID</li>
    </ul>
    </td>
    <td>False</td>
</tr>
</table>
{% endcapture %}


{% include templates/task.md %}