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
* [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) running in the cluster,
  because VPA reads resource metrics from the `metrics.k8s.io` API. For background, see
  [Resource metrics pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server).

{{< caution >}}
The chart in the
[Vertical Pod Autoscaler repository](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler)
is under active development. Review the chart `README` and release notes before using it in production clusters.
{{< /caution >}}

<!-- steps -->

## Add the Autoscaler Helm repository

The Kubernetes Autoscaler project publishes charts, including VPA, at `https://kubernetes.github.io/autoscaler`.

```shell
helm repo add autoscalers https://kubernetes.github.io/autoscaler
helm repo update
```

## Install the VPA chart

Install a release named `vertical-pod-autoscaler`. The following example deploys into the `kube-system` namespace,
which matches the namespace used by the `vpa-up.sh` installation path in the
[VPA documentation](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/docs/installation.md).

```shell
helm upgrade --install vertical-pod-autoscaler autoscalers/vertical-pod-autoscaler \
  --namespace kube-system
```

## Verify the installation

Check that the recommender, updater, and admission controller are running.


```shell
kubectl --namespace=kube-system get pods | grep vertical-pod-autoscaler
```

## {{% heading "whatsnext" %}}

* Read [Vertical Pod Autoscaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) for API objects, update modes, and limitations.
* Follow the [VPA quick start](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/quickstart.md) to create a `VerticalPodAutoscaler` resource.
* For values, webhook TLS modes, and upgrades, see the
  [chart README](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler/README.md)
  in the Autoscaler repository.
