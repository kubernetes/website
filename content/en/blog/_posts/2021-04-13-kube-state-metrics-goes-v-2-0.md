---
layout: blog
title: "kube-state-metrics goes v2.0"
date: 2021-04-13
slug: kube-state-metrics-v-2-0
---

**Authors:** Lili Cosic (Red Hat), Frederic Branczyk (Polar Signals), Manuel Rüger (Sony Interactive Entertainment), Tariq Ibrahim (Salesforce)

## What?

[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics), a project under the Kubernetes organization, generates Prometheus format metrics based on the current state of the Kubernetes native resources. It does this by listening to the Kubernetes API and gathering information about resources and objects, e.g. Deployments, Pods, Services, and StatefulSets. A full list of resources is available in the [documentation](https://github.com/kubernetes/kube-state-metrics/tree/master/docs) of kube-state-metrics.

## Why?

There are numerous useful metrics and insights provided by `kube-state-metrics` right out of the box! These metrics can be used to serve as an insight into your cluster: Either through metrics alone, in the form of dashboards, or through an alerting pipeline. To provide a few examples:

* `kube_pod_container_status_restarts_total` can be used to alert on a crashing pod.
* `kube_deployment_status_replicas` which together with `kube_deployment_status_replicas_available` can be used to alert on whether a deployment is rolled out successfully or stuck.
* `kube_pod_container_resource_requests` and `kube_pod_container_resource_limits` can be used in capacity planning dashboards.

And there are many more metrics available! To learn more about the other metrics and their details, please check out the [documentation](https://github.com/kubernetes/kube-state-metrics/tree/master/docs#readme).

## What is new in v2.0?

So now that we know what kube-state-metrics is, we are excited to announce the next release: kube-state-metrics v2.0! This release was long-awaited and started with an alpha release in September 2020. To ease maintenance we removed tech debt and also adjusted some confusing wording around user-facing flags and APIs. We also removed some metrics that caused unnecessarily high cardinality in Prometheus! For the 2.0 release, we took the time to set up scale and performance testing. This allows us to better understand if we hit any issues in large clusters and also to document resource request recommendations for your clusters. In this release (and v1.9.8) container builds providing support for multiple architectures were introduced allowing you to run kube-state-metrics on ARM, ARM64, PPC64 and S390x as well!

So without further ado, here is the list of more noteworthy user-facing breaking changes. A full list of changes, features and bug fixes is available in the changelog at the end of this post.

* Flag `--namespace` was renamed to `--namespaces`. If you are using the former, please make sure to update the flag before deploying the latest release.
* Flag `--collectors` was renamed to `--resources`.
* Flags `--metric-blacklist` and `--metric-whitelist` were renamed to `--metric-denylist` and `--metric-allowlist`.
* Flag `--metric-labels-allowlist` allows you to specify a list of Kubernetes labels that get turned into the dimensions of the `kube_<resource-name>_labels` metrics. By default, the metric contains only name and namespace labels.
* All metrics with a prefix of `kube_hpa_*` were renamed to `kube_horizontalpodautoscaler_*`.
* Metric labels that relate to Kubernetes were converted to snake_case.
* If you are importing kube-state-metrics as a library, we have updated our go module path to `k8s.io/kube-state-metrics/v2`
* All deprecated stable metrics were removed as per the [notice in the v1.9 release](https://github.com/kubernetes/kube-state-metrics/tree/release-1.9/docs#metrics-deprecation).
* `quay.io/coreos/kube-state-metrics` images will no longer be updated. `k8s.gcr.io/kube-state-metrics/kube-state-metrics` is the new canonical location.
* The helm chart that is part of the kubernetes/kube-state-metrics repository is deprecated. https://github.com/prometheus-community/helm-charts will be its new location. 

For the full list of v2.0 release changes includes features, bug fixes and other breaking changes see the full [CHANGELOG](https://github.com/kubernetes/kube-state-metrics/blob/master/CHANGELOG.md).

## Found a problem?

Thanks to all our users for testing so far and thank you to all our contributors for your issue reports as well as code and documentation changes! If you find any problems, we the [maintainers](https://github.com/kubernetes/kube-state-metrics/blob/master/OWNERS) are more than happy to look into them, so please report them by opening a [GitHub issue](https://github.com/kubernetes/kube-state-metrics/issues/new/choose).
