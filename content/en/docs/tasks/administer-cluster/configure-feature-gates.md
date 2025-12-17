---
title: Enable Or Disable Feature Gates
content_type: task
weight: 60
---

<!-- overview -->

This page shows how to enable or disable feature gates to control specific Kubernetes 
features in your cluster. Enabling feature gates allows you to test and use Alpha or 
Beta features before they become generally available.

{{< note >}}
For some stable (GA) gates, you can also disable them, usually for one minor release 
after GA; however if you do that, your cluster may not be conformant as Kubernetes.
{{< /note >}}

<!--
Changes from original PR proposal:
- Added note about conformance implications when disabling stable gates
- Corrected --help behavior: all components show all gates due to shared definitions
- Clarified that not all components support configuration files (e.g., kube-controller-manager)
- Specified that verification methods apply to kubeadm static pod deployments
- Added context about kubeadm's distributed configuration approach
-->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

You also need:

* Administrative access to your cluster
* Knowledge of which feature gate you want to enable (see the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/))

{{< note >}}
GA (stable) features are always enabled by default. You typically configure gates for 
Alpha or Beta features.
{{< /note >}}

<!-- steps -->

## Understand feature gate maturity

Before enabling a feature gate, check the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/) 
for the feature's maturity level:

- **Alpha**: Disabled by default, may be buggy. Use only in test clusters.
- **Beta**: Usually enabled by default, well-tested.
- **GA**: Always enabled by default; can sometimes be disabled for one release after GA.

## Identify which components need the feature gate

Different feature gates affect different Kubernetes components:

- Some features require enabling the gate on **multiple components** (e.g., API server and controller manager)
- Other features only need the gate on a **single component** (e.g., only kubelet)

The [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/) 
typically indicates which components are affected by each gate. All Kubernetes components 
share the same feature gate definitions, so all gates appear in help output, but only 
relevant gates affect each component's behavior.

## Configuration

### During cluster initialization

Create a configuration file to enable feature gates across relevant components:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
apiServer:
  extraArgs:
    feature-gates: "FeatureName=true"
controllerManager:
  extraArgs:
    feature-gates: "FeatureName=true"
scheduler:
  extraArgs:
    feature-gates: "FeatureName=true"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  FeatureName: true
```

Initialize the cluster:

```shell
kubeadm init --config kubeadm-config.yaml
```

### On an existing cluster

For kubeadm clusters, feature gate configuration can be set in several locations 
including manifest files, configuration files, and kubeadm configuration.

Edit control plane component manifests in `/etc/kubernetes/manifests/`:

1. For kube-apiserver, kube-controller-manager, or kube-scheduler, add the flag to the command:

   ```yaml
   spec:
     containers:
     - command:
       - kube-apiserver
       - --feature-gates=FeatureName=true
       # ... other flags
   ```

   Save the file. The pod restarts automatically.

2. For kubelet, edit `/var/lib/kubelet/config.yaml`:

   ```yaml
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   featureGates:
     FeatureName: true
   ```

   Restart kubelet:

   ```shell
   sudo systemctl restart kubelet
   ```

3. For kube-proxy, edit the ConfigMap:

   ```shell
   kubectl -n kube-system edit configmap kube-proxy
   ```

   Add feature gates to the configuration:

   ```yaml
   featureGates:
     FeatureName: true
   ```

   Restart the DaemonSet:

   ```shell
   kubectl -n kube-system rollout restart daemonset kube-proxy
   ```

## Configure multiple feature gates

Use comma-separated lists for command-line flags:

```shell
--feature-gates=FeatureA=true,FeatureB=false,FeatureC=true
```

For components that support configuration files (kubelet, kube-proxy):

```yaml
featureGates:
  FeatureA: true
  FeatureB: false
  FeatureC: true
```

{{< note >}}
In kubeadm clusters, control plane components (kube-apiserver, kube-controller-manager, 
and kube-scheduler) are typically configured via command-line flags in their static pod 
manifests located at `/etc/kubernetes/manifests/`. While these components support 
configuration files via the `--config` flag, kubeadm primarily uses command-line flags.
{{< /note >}}


<!-- discussion -->

## Verify feature gate configuration

After configuring, verify the feature gates are active. The following methods apply 
to kubeadm clusters where control plane components run as static pods.

### Check control plane component manifests

View the feature gates configured in the static pod manifest:
```shell
kubectl -n kube-system get pod kube-apiserver-<node-name> -o yaml | grep feature-gates
```

### Check kubelet configuration

Use the kubelet's configz endpoint:
```shell
kubectl proxy --port=8001 &
curl -sSL "http://localhost:8001/api/v1/nodes/<node-name>/proxy/configz" | grep featureGates -A 5
```

Or check the configuration file directly on the node:
```shell
cat /var/lib/kubelet/config.yaml | grep -A 10 featureGates
```

### Check via metrics endpoint

Feature gate status is exposed in Prometheus-style metrics by Kubernetes components 
(available in Kubernetes 1.26+). Query the metrics endpoint to verify which feature 
gates are enabled:
```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled
```

To check a specific feature gate:
```shell
kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep FeatureName
```

The metric shows `1` for enabled gates and `0` for disabled gates.

{{< note >}}
In kubeadm clusters, verify all relevant locations where feature gates might be 
configured, as the configuration is distributed across multiple files and locations.
{{< /note >}}

### Check via /flagz endpoint

If you have access to a component's debugging endpoints, and the `ComponentFlagz`
feature gate is enabled for that component, you can inspect the command-line flags
that were used to start the component by visiting the `/flagz` endpoint. Feature
gates configured using command-line flags appear in this output.

The `/flagz` endpoint is part of Kubernetes *z-pages*, which provide human-readable
runtime debugging information for core components.

For more information, see the
[z-pages documentation](/docs/reference/instrumentation/zpages/).

## Understanding component-specific requirements

Some examples of component-specific feature gates:

- **API server-focused**: Features like `StructuredAuthenticationConfiguration` primarily affect kube-apiserver
- **Kubelet-focused**: Features like `GracefulNodeShutdown` primarily affect kubelet
- **Multiple components**: Some features require coordination between components

{{< caution >}}
When a feature requires multiple components, you must enable the gate on all relevant 
components. Enabling it on only some components may result in unexpected behavior or errors.
{{< /caution >}}

Always test feature gates in non-production environments first. Alpha features may be 
removed without notice.

## {{% heading "whatsnext" %}}

* Read the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/)
* Learn about [Feature Stages](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)
* Review [kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta4/)
