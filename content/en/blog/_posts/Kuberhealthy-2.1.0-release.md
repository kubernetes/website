---
layout: blog
title: “Kuberhealthy 2.1.0”
date: 2020-02-28
---

**Authors:** Joshulyne Park (Comcast), Eric Greer (Comcast)

# Kuberhealthy 2.1.0

Last November at KubeCon San Diego 2019, we announced the release of [Kuberhealthy 2.0.0](https://www.youtube.com/watch?v=aAJlWhBtzqY) - transforming Kuberhealthy into a Kubernetes operator for synthetic monitoring. This new ability granted developers the means to create their own Kuberhealthy check containers to monitor their applications and clusters. The community was quick to adopt this new feature and we're grateful for everyone who implemented and tested Kuberhealthy 2.0.0 in their clusters. Thanks to all of you who reported issues and contributed to discussions on the #kuberhealthy Slack channel. We set to work to address all your feedback with our new official 2.1.0 release as well as provide a tutorial of how to install and use Kuberhealthy in your clusters! 

Our 2.1.0 release contains a few new features users can benefit from:
- Check Reaper  
- Check Run Duration 
- Namespace filtering  
- Helm
- Bug Fixes

#### Check Reaper 

<img align="center" src="https://github.com/Comcast/kuberhealthy/raw/master/images/kuberhealthy-check-reaper.gif">

With the initial 2.0.0 release, each time an external check finished running and reported back to Kuberhealthy, the checker Pod would only remain visible in Kubernetes until the next time the check ran. For checks that had shorter run intervals such as the DNS Status check or the Pod Status check, Kubernetes operators weren't given enough time to investigate failed check logs after being alerted. The team decided to retain checker Pods and implement a check reaper CronJob that deletes 'Completed' or 'Failed' Kuberhealthy checker Pods older than a certain time period. Users are now given much more time to investigate failed check runs without having to worry about the Pod in question being cleaned up too quickly.  

#### Kuberhealthy State Run Duration 

<img align="center" src="https://github.com/Comcast/kuberhealthy/raw/master/images/kuberhealthy-json.png" width="500">
  
Kuberhealthy has an integration with Prometheus, giving users the ability to capture Kuberhealthy server state as well as check metrics. The 2.1.0 release has added a new metric that captures the most recent run duration of each check. This is helpful for identifying unexpected slowdowns in check execution. 

#### Namespace filtering 

<img align="center" src="https://github.com/Comcast/kuberhealthy/raw/master/images/kuberhealthy-ns-filter.png">
  
For our JSON status page output that’s available to view all checks’ current state, we added namespace filtering with the `GET` variable `namespace`. To view checks’ states from multiple namespaces, add commas to separate namespaces. For example: `?namespace=kuberhealthy,kube-system`. 

#### Bug Fixes
  
Some of our more complicated checks such as the Deployment check (a synthetic test that ensures that a Kubernetes Deployment and Service can be created, provisioned, and serve traffic within the Kubernetes cluster) required a small refactor to ensure that it properly detects when its resources have been cleaned up. Other checks, such as the Pod Status check and the Pod Restarts check were refactored to run more ephemerally and more often. These two checks now also exclude Kuberhealthy checker Pods in order to prevent duplicate failure reporting. Additionally, the Daemonset check got a PR merge from a community user, addressing its use of deprecated API endpoints. This check now runs in the newest versions of Kubernetes as expected. 
  
## Kuberhealthy Tutorial

This quick tutorial will go over how to install and use Kuberhealthy using Helm 3. 

To install using Helm 3:
1. Create namespace "kuberhealthy" in the desired Kubernetes cluster/context: 
  ```
  kubectl create namespace kuberhealthy
  ```
2. Set your current namespace to "kuberhealthy": 
  ```
  kubectl config set-context --current --namespace=kuberhealthy 
  ```
3. Add the kuberhealthy repo to Helm: 
  ```
  helm repo add kuberhealthy https://comcast.github.io/kuberhealthy/helm-repos
  ```
4. Install kuberhealthy:
  ```
  helm install kuberhealthy kuberhealthy/kuberhealthy 
  ```

Running the Helm command should automatically install Kuberhealthy 2.1.0. Running `kubectl get pods`, you should see two Kuberhealthy pods, and one check-reaper pod come up first. Running
`kubectl get khchecks`, you should see three Kuberhealthy checks installed by default:
- [daemonset](https://github.com/Comcast/kuberhealthy/tree/master/cmd/daemonset-check)
- [deployment](https://github.com/Comcast/kuberhealthy/tree/master/cmd/deployment-check)
- [dns-status-internal](https://github.com/Comcast/kuberhealthy/tree/master/cmd/dns-resolution-check)

To view other available external checks, check out the [external checks registry](https://github.com/Comcast/kuberhealthy/blob/master/docs/EXTERNAL_CHECKS_REGISTRY.md).
This registry should point to the yaml configuration needed to be applied to your cluster to enable these checks. You can also update your Helm values to enable other 
external checks. 

These check pods should start running a bit after Kuberhealthy starts running. The check-reaper cronjob ensures there are no more than 5 completed checker pods left lying around at a time.

To get status page view of these checks, you'll need to expose the Kuberhealthy service by editing the service `kuberhealthy` and set `Type: LoadBalancer`. The service endpoint will display
a JSON status page: 

```json
{
    "OK": true,
    "Errors": [],
    "CheckDetails": {
        "kuberhealthy/daemonset": {
            "OK": true,
            "Errors": [],
            "RunDuration": "22.512278967s",
            "Namespace": "kuberhealthy",
            "LastRun": "2020-04-06T23:20:31.7176964Z",
            "AuthoritativePod": "kuberhealthy-67bf8c4686-mbl2j",
            "uuid": "9abd3ec0-b82f-44f0-b8a7-fa6709f759cd"
        },
        "kuberhealthy/deployment": {
            "OK": true,
            "Errors": [],
            "RunDuration": "29.142295647s",
            "Namespace": "kuberhealthy",
            "LastRun": "2020-04-06T23:20:31.7176964Z",
            "AuthoritativePod": "kuberhealthy-67bf8c4686-mbl2j",
            "uuid": "5f0d2765-60c9-47e8-b2c9-8bc6e61727b2"
        },
        "kuberhealthy/dns-status-internal": {
            "OK": true,
            "Errors": [],
            "RunDuration": "2.43940936s",
            "Namespace": "kuberhealthy",
            "LastRun": "2020-04-06T23:20:44.6294547Z",
            "AuthoritativePod": "kuberhealthy-67bf8c4686-mbl2j",
            "uuid": "c85f95cb-87e2-4ff5-b513-e02b3d25973a"
        }
    },
    "CurrentMaster": "kuberhealthy-7cf79bdc86-m78qr"
}
```
This JSON page displays all Kuberhealthy checks running in your cluster. If you have Kuberhealthy checks running in different namespaces, you can filter them by
using the new namespace filtering feature.  

#### Prometheus Integration

Kuberhealthy provides an intergration with Prometheus and the Prometheus Operator. To implement this, modify your Helm chart values to enable Prometheus. 
```.env
prometheus:
  enabled: true
  name: "prometheus"
  release: prometheus-operator
  enableScraping: true
  serviceMonitor: false
  enableAlerting: false
```
If you're using the Prometheus Operator, make sure to enable the serviceMonitor. This should automatically enable Kuberhealthy metrics to be scraped. 

When enabled, the Kuberhealthy service gets the following annotations added:
```.env
prometheus.io/path: /metrics
prometheus.io/port: "80"
prometheus.io/scrape: "true"
```

In your prometheus configuration, you can use this example scrape_config that scrapes the Kuberhealthy service given the added prometheus annotation:

```      
- job_name: 'kuberhealthy'
  scrape_interval: 1m
  honor_labels: true
  metrics_path: /metrics
  kubernetes_sd_configs:
  - role: service
    namespaces:
      names:
        - kuberhealthy
  relabel_configs:
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
      action: keep
      regex: true
```
Or you can directly specify the target endpoint to be scraped using this example: 
```
- job_name: kuberhealthy
  scrape_interval: 1m
  honor_labels: true
  metrics_path: /metrics
  static_configs:
    - targets:
      - kuberhealthy.kuberhealthy.svc.cluster.local:80
```

Once the prometheus configurations are applied, you should be able to see the following Kuberhealthy metrics:
- kuberhealthy_check 
- kuberhealthy_check_duration_seconds
- kuberhealthy_cluster_states
- kuberhealthy_running



Thanks again to everyone in the community for helping us with our 2.1.0 release! We hope this tutorial was useful in adopting Kuberhealthy and 
we hope to keep hearing even more feedback from you soon! 
