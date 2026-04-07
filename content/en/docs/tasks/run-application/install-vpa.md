---
title: Install Vertical Pod Autoscaler using Helm
content_type: task
min-kubernetes-server-version: 1.28
weight: 115
---

<!-- overview -->

This page shows how to install the [Vertical Pod Autoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA)
using the Helm chart published by the Kubernetes Autoscaler project.

{{< caution >}}
At the time of writing, the upstream Kubernetes Autoscaler project marks the VPA Helm chart as under development and not ready for production use. Review the upstream project status before adopting this installation method for production clusters.
{{< /caution >}}

The VPA chart installs the three VPA components:

- the recommender
- the updater
- the admission controller

The chart version shown in the examples on this page can change over time as the Kubernetes Autoscaler project publishes new releases.

After you install the chart, you can create `VerticalPodAutoscaler` resources for workloads that you
want VPA to manage.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Before you begin:

- Install [Helm](https://helm.sh/docs/intro/install/).
- Make sure that [Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server)
  is deployed in your cluster. VPA uses the `metrics.k8s.io` API to make recommendations.
- Verify that your cluster is running Kubernetes v1.28 or later.

## Add the Kubernetes Autoscaler Helm repository

Add the Helm repository that publishes the VPA chart:

```shell
helm repo add autoscalers https://kubernetes.github.io/autoscaler
helm repo update
```

## Install the Helm chart

Install the VPA chart in the `kube-system` namespace:

```shell
helm upgrade --install vpa autoscalers/vertical-pod-autoscaler \
  --namespace kube-system \
  --create-namespace
```

By default, the chart configures Helm to manage the VPA admission webhook and to generate the
required TLS certificates for that webhook.

If you want to review the chart values before installing, run:

```shell
helm show values autoscalers/vertical-pod-autoscaler
```

## Verify the installation

Check that the Helm release is deployed:

```shell
helm list --namespace kube-system
```

The output is similar to:

```none
NAME  	NAMESPACE   	REVISION	UPDATED                                 	STATUS  	CHART                         	APP VERSION
vpa   	kube-system	1       	2026-04-07 12:00:00.000000 +0000 UTC	deployed	vertical-pod-autoscaler-0.8.1	1.6.0
```

Check that the VPA Pods are running:

```shell
kubectl get pods -n kube-system
```

The output is similar to:

```none
NAME                                                         READY   STATUS    RESTARTS   AGE
vpa-vertical-pod-autoscaler-admission-controller-xxxxx       1/1     Running   0          1m
vpa-vertical-pod-autoscaler-recommender-xxxxx                1/1     Running   0          1m
vpa-vertical-pod-autoscaler-updater-xxxxx                    1/1     Running   0          1m
```

If your release name is different from `vpa`, adjust the Pod names accordingly.

Confirm that the `VerticalPodAutoscaler` custom resource definition exists:

```shell
kubectl get customresourcedefinitions verticalpodautoscalers.autoscaling.k8s.io
```

## Create a VerticalPodAutoscaler resource

After you install VPA, create a `VerticalPodAutoscaler` resource that targets a workload.
The following manifest configures VPA for a Deployment named `my-app`. The example uses the explicit `Recreate` update mode because the `Auto` mode is deprecated:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: Recreate
```

Apply the manifest:

```shell
kubectl apply -f my-app-vpa.yaml
```

To inspect the recommendation that VPA produces, run:

```shell
kubectl describe vpa my-app-vpa
```

## Configure the chart

To customize the chart, provide your own values file when you install or upgrade the release:

```shell
helm upgrade --install vpa autoscalers/vertical-pod-autoscaler \
  --namespace kube-system \
  --create-namespace \
  --values vpa-values.yaml
```

For example, you can use chart values to:

- change the number of recommender, updater, or admission controller replicas
- set Pod scheduling constraints such as node selectors, affinity rules, and tolerations
- configure how the admission webhook is managed
- override container image tags or pull policies for the VPA components

For the full set of chart values, see the
[VPA Helm chart README](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler#readme).

## Uninstall VPA

To remove the Helm release:

```shell
helm uninstall vpa --namespace kube-system
```

If you no longer need the VPA custom resource definitions, you can remove them separately:

```shell
kubectl delete customresourcedefinition verticalpodautoscalers.autoscaling.k8s.io
```

## {{% heading "whatsnext" %}}

- Learn more about [Vertical Pod Autoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/).
- Read the [HorizontalPodAutoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Review the upstream [VPA installation documentation](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/installation.md).
