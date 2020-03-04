---
layout: blog
title: “Kuberhealthy 2.1.0 - Check Reaper and Bug Fixes Galore”
date: 2020-02-28
---

**Authors:** Joshulyne Park (Comcast), Eric Greer (Comcast)

# Kuberhealthy 2.1.0 - Check Reaper and Bug Fixes Galore

Last November at KubeCon San Diego 2019, we announced the release of [Kuberhealthy 2.0.0](https://www.youtube.com/watch?v=aAJlWhBtzqY) - transforming Kuberhealthy into a Kubernetes operator for synthetic monitoring. This new ability granted developers the means to create their own Kuberhealthy check containers to monitor their applications and clusters. The community was quick to adopt this new feature and we're grateful for everyone who implemented and tested Kuberhealthy 2.0.0 in their clusters. Thanks to all of you who reported issues and contributed to discussions on the #kuberhealthy Slack channel. We set to work to address all your feedback and today we're excited to announce the release of Kuberhealthy 2.1.0!  
  
#### Check Reaper 

<img align="center" src="https://github.com/Comcast/kuberhealthy/raw/master/images/kuberhealthy-check-reaper.gif">

With the initial 2.0.0 release, each time an external check finished running and reported back to Kuberhealthy, the checker pod would only remain visible in Kubernetes until the next time the check ran. For checks that had shorter run intervals such as the DNS Status check or the Pod Status check, Kubernetes operators weren't given enough time to investigate failed check logs after being alerted. The team decided to retain checker pods and implement a check reaper cron job that deletes 'Completed' or 'Failed' Kuberhealthy checker pods older than a certain time period. Users are now given much more time to investigate failed check runs without having to worry about the pod in question being cleaned up too quickly.  
  
#### Squashing Bugs 
  
Some of our more complicated checks such as the deployment check (a synthetic test that ensures that a Kubernetes deployment and service can be created, provisioned, and serve traffic within the Kubernetes cluster) required a small refactor to ensure that it properly detects when its resources have been cleaned up. Other checks, such as the Pod Status check and the Pod Restarts check were refactored to run more ephemerally and more often. These two checks now also exclude Kuberhealthy checker pods in order to prevent duplicate failure reporting. Additionally, the daemonset check got a PR merge from a community user, addressing its use of deprecated API endpoints. This check now runs in the newest versions of Kubernetes as expected. 
  
Community users also reported issues with deploying Kuberhealthy onto their clusters with the Helm chart. As of now, the Helm chart installed by default by Helm ("helm/charts/kuberhealthy") should not be used and has been removed from the README. Until we register a private Helm repository upstream, we recommend using the flat files specified in the project readme to install Kuberhealthy.  This is being tracked in [issue #288](https://github.com/Comcast/kuberhealthy/issues/288). 
  
#### Kuberhealthy State Run Duration 

<img align="center" src="https://github.com/Comcast/kuberhealthy/raw/master/images/kuberhealthy-json.png" width="500">
  
Kuberhealthy has an integration with Prometheus, giving users the ability to capture Kuberhealthy server state as well as check metrics. The 2.1.0 release has added a new metric that captures the most recent run duration of each check. This is helpful for identifying unexpected slowdowns in check execution. 
  
#### Namespace filtering 

<img align="center" src="https://github.com/Comcast/kuberhealthy/raw/master/images/kuberhealthy-ns-filter.png">
  
For our JSON status page output that’s available to view all checks’ current state, we added namespace filtering with the `GET` variable `namespace`. To view checks’ states from multiple namespaces, add commas to separate namespaces. For example: `?namespace=kuberhealthy,kube-system`. 



Thanks again to everyone in the community for helping us with our 2.1.0 release and we hope to keep hearing even more feedback from you soon! 
