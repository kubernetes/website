---
title: Enable Or Disable Feature Gates
content_type: task
weight: 60
---

<!-- overview -->

This page shows how to enable or disable feature gates to control specific Kubernetes 
features in your cluster. Enabling feature gates allows you to test and use Alpha or 
Beta features before they become generally available.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

You also need:

* Administrative access to your cluster
* Knowledge of which feature gate you want to enable (see the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/))

{{< note >}}
GA (stable) features are always enabled. You only configure gates for Alpha or Beta features.
{{< /note >}}

<!-- steps -->

## Identify which components need the feature gate

Different feature gates apply to different Kubernetes components. Before enabling a feature gate:

1. Check the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/) 
   to find the feature's maturity level:
   - **Alpha**: Disabled by default, may be buggy. Use only in test clusters.
   - **Beta**: Usually enabled by default, well-tested.
   - **GA**: Always enabled, cannot be disabled.

2. Determine which components need the feature gate enabled:
   - Some features require enabling the gate on **multiple components** (e.g., API server and controller manager)
   - Other features only need the gate on a **single component** (e.g., only kubelet)

3. Use the component's help flag to verify it supports the feature gate:

   ```shell
   kube-apiserver -h | grep feature-gates
   kubelet -h | grep feature-gates
   ```

{{< note >}}
Each Kubernetes component only accepts feature gates relevant to its functionality. 
The Feature Gates reference page typically indicates which components are affected by each gate.
{{< /note >}}

## Configure for kubeadm clusters

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

Use comma-separated lists for the command-line flag:

```shell
--feature-gates=FeatureA=true,FeatureB=false,FeatureC=true
```

Or in YAML configuration files:

```yaml
featureGates:
  FeatureA: true
  FeatureB: false
  FeatureC: true
```

<!-- discussion -->

## Verify feature gate configuration

After configuring, verify the feature gates are active.

For control plane components:

```shell
kubectl -n kube-system get pod kube-apiserver-<node-name> -o yaml | grep feature-gates
```

For kubelet:

```shell
kubectl proxy --port=8001 &
curl -sSL "http://localhost:8001/api/v1/nodes/<node-name>/proxy/configz" | grep featureGates -A 5
```

Or check the configuration file directly on the node:

```shell
cat /var/lib/kubelet/config.yaml | grep -A 10 featureGates
```

## Understanding component-specific requirements

Some examples of component-specific feature gates:

- **API server only**: Features like `StructuredAuthenticationConfiguration` affect only kube-apiserver
- **Kubelet only**: Features like `GracefulNodeShutdown` affect only kubelet
- **Multiple components**: Features like `TTLAfterFinished` require both kube-apiserver and kube-controller-manager

{{< caution >}}
When a feature requires multiple components, you must enable the gate on **all relevant components**. 
Enabling it on only some components may result in unexpected behavior or errors.
{{< /caution >}}

Always test feature gates in non-production environments first. Alpha features may be removed 
without notice.

## {{% heading "whatsnext" %}}

* Read the [Feature Gates reference](/docs/reference/command-line-tools-reference/feature-gates/)
* Learn about [Feature Stages](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)
* Review [kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta4/)
