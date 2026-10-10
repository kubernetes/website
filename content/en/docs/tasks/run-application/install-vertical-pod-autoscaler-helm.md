---
reviewers:
- adrianmoisey
- omerap12
title: Install the Vertical Pod Autoscaler Using Helm
content_type: task
weight: 98
min-kubernetes-server-version: 1.28
---

<!-- overview -->

The [VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA)
is provided as a separate component; it is not included in the core Kubernetes release.
This task shows how to install the VPA control plane using [Helm](https://helm.sh/docs/).

For how VPA adjusts workload resource requests and limits, see
[Vertical Pod Autoscaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [Helm](https://helm.sh/docs/intro/install/) 3.
* A working [resource metrics pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
  that serves the [Metrics API](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api)
  (`metrics.k8s.io`), which VPA uses for CPU and memory data. Many clusters run
  [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme); any other implementation
  of that API is also valid.

<!-- steps -->

## Add the Autoscaler Helm repository

The Kubernetes project publishes charts, including VPA, at `https://kubernetes.github.io/autoscaler`.

```shell
helm repo add autoscalers https://kubernetes.github.io/autoscaler
helm repo update
```

## Install the VPA chart

Install a release named `vertical-pod-autoscaler`. The following example deploys into the `kube-system` namespace,
a common choice for cluster add-ons. Use another namespace if your organization standardizes components elsewhere.

```shell
helm upgrade --install vertical-pod-autoscaler autoscalers/vertical-pod-autoscaler \
  --namespace kube-system
```

## Admission webhook TLS

By default, the chart provisions TLS for the VPA admission webhook by running a Job that uses the
`registry.k8s.io/ingress-nginx/kube-webhook-certgen` image to generate certificates and configure the
webhook. For other TLS modes or customization (for example, supplying your own certificates or using
cert-manager), see
[Webhook management](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler/README.md#webhook-management)
in the chart README.

## Verify the installation

Check that the recommender, updater, and admission controller are running.
The label value matches the Helm release name from the install command above.

```shell
kubectl --namespace=kube-system get pods -l app.kubernetes.io/instance=vertical-pod-autoscaler
```

## {{% heading "whatsnext" %}}

* Read [Vertical Pod Autoscaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) to create and configure a `VerticalPodAutoscaler` object: the API, [update modes](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/#update-modes), [resource policies](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/#resource-policies), and limitations of the feature.
* For Helm chart values and upgrades, see the
  [chart README](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler/README.md)
  in the Autoscaler repository.
