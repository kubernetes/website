---
layout: blog
title: " Kubernetes Release: 0.15.0 "
date:  Friday, April 16, 2015 

---
Release Notes:
  

- Enables v1beta3 API and sets it to the default API version ([#6098](https://github.com/GoogleCloudPlatform/kubernetes/pull/6098 "Enabling v1beta3 api version by default in master"))

  - See the&nbsp;[v1beta3 conversion guide](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/api.md#v1beta3-conversion-tips)
- Added multi-port Services ([#6182](https://github.com/GoogleCloudPlatform/kubernetes/pull/6182 "Implement multi-port Services"))

  - New Getting Started Guides
  - Multi-node local startup guide ([#6505](https://github.com/GoogleCloudPlatform/kubernetes/pull/6505 "Docker multi-node"))

  - JUJU ([#5414](https://github.com/GoogleCloudPlatform/kubernetes/pull/5414 "Adds JUJU to the Kubernetes Provider listing"))

  - Mesos on Google Cloud Platform ([#5442](https://github.com/GoogleCloudPlatform/kubernetes/pull/5442 "Getting started guide for Mesos on Google Cloud Platform"))

  - Ansible Setup instructions ([#6237](https://github.com/GoogleCloudPlatform/kubernetes/pull/6237 "example ansible setup repo"))

- Added a controller framework ([#5270](https://github.com/GoogleCloudPlatform/kubernetes/pull/5270 "Controller framework"),&nbsp;[#5473](https://github.com/GoogleCloudPlatform/kubernetes/pull/5473 "Add DeltaFIFO (a controller framework piece)"))
- The Kubelet now listens on a secure HTTPS port ([#6380](https://github.com/GoogleCloudPlatform/kubernetes/pull/6380 "Configure the kubelet to use HTTPS (take 2)"))
- Made kubectl errors more user-friendly ([#6338](https://github.com/GoogleCloudPlatform/kubernetes/pull/6338 "Return a typed error for config validation, and make errors simple"))
- The apiserver now supports client cert authentication ([#6190](https://github.com/GoogleCloudPlatform/kubernetes/pull/6190 "Add client cert authentication"))
- The apiserver now limits the number of concurrent requests it processes ([#6207](https://github.com/GoogleCloudPlatform/kubernetes/pull/6207 "Add a limit to the number of in-flight requests that a server processes."))
- Added rate limiting to pod deleting ([#6355](https://github.com/GoogleCloudPlatform/kubernetes/pull/6355 "Added rate limiting to pod deleting"))
- Implement Balanced Resource Allocation algorithm as a PriorityFunction in scheduler package ([#6150](https://github.com/GoogleCloudPlatform/kubernetes/pull/6150 "Implement Balanced Resource Allocation (BRA) algorithm as a PriorityFunction in scheduler package."))
- Enabled log collection from master ([#6396](https://github.com/GoogleCloudPlatform/kubernetes/pull/6396 "Enable log collection from master."))
- Added an api endpoint to pull logs from Pods ([#6497](https://github.com/GoogleCloudPlatform/kubernetes/pull/6497 "Pod log subresource"))
- Added latency metrics to scheduler ([#6368](https://github.com/GoogleCloudPlatform/kubernetes/pull/6368 "Add basic latency metrics to scheduler."))
- Added latency metrics to REST client ([#6409](https://github.com/GoogleCloudPlatform/kubernetes/pull/6409 "Add latency metrics to REST client"))
- etcd now runs in a pod on the master ([#6221](https://github.com/GoogleCloudPlatform/kubernetes/pull/6221 "Run etcd 2.0.5 in a pod"))
- nginx now runs in a container on the master ([#6334](https://github.com/GoogleCloudPlatform/kubernetes/pull/6334 "Add an nginx docker image for use on the master."))
- Began creating Docker images for master components ([#6326](https://github.com/GoogleCloudPlatform/kubernetes/pull/6326 "Create Docker images for master components "))
- Updated GCE provider to work with gcloud 0.9.54 ([#6270](https://github.com/GoogleCloudPlatform/kubernetes/pull/6270 "Updates for gcloud 0.9.54"))
- Updated AWS provider to fix Region vs Zone semantics ([#6011](https://github.com/GoogleCloudPlatform/kubernetes/pull/6011 "Fix AWS region vs zone"))
- Record event when image GC fails ([#6091](https://github.com/GoogleCloudPlatform/kubernetes/pull/6091 "Record event when image GC fails."))
- Add a QPS limiter to the kubernetes client ([#6203](https://github.com/GoogleCloudPlatform/kubernetes/pull/6203 "Add a QPS limiter to the kubernetes client."))
- Decrease the time it takes to run make release ([#6196](https://github.com/GoogleCloudPlatform/kubernetes/pull/6196 "Parallelize architectures in both the building and packaging phases of `make release`"))
- New volume support

  - Added iscsi volume plugin ([#5506](https://github.com/GoogleCloudPlatform/kubernetes/pull/5506 "add iscsi volume plugin"))

  - Added glusterfs volume plugin ([#6174](https://github.com/GoogleCloudPlatform/kubernetes/pull/6174 "implement glusterfs volume plugin"))

  - AWS EBS volume support ([#5138](https://github.com/GoogleCloudPlatform/kubernetes/pull/5138 "AWS EBS volume support"))

- Updated to heapster version to v0.10.0 ([#6331](https://github.com/GoogleCloudPlatform/kubernetes/pull/6331 "Update heapster version to v0.10.0"))
- Updated to etcd 2.0.9 ([#6544](https://github.com/GoogleCloudPlatform/kubernetes/pull/6544 "Build etcd image (version 2.0.9), and upgrade kubernetes cluster to the new version"))
- Updated to Kibana to v1.2 ([#6426](https://github.com/GoogleCloudPlatform/kubernetes/pull/6426 "Update Kibana to v1.2 which paramaterizes location of Elasticsearch"))
- Bug Fixes

  - Kube-proxy now updates iptables rules if a service's public IPs change ([#6123](https://github.com/GoogleCloudPlatform/kubernetes/pull/6123 "Fix bug in kube-proxy of not updating iptables rules if a service's public IPs change"))

  - Retry kube-addons creation if the initial creation fails ([#6200](https://github.com/GoogleCloudPlatform/kubernetes/pull/6200 "Retry kube-addons creation if kube-addons creation fails."))

  - Make kube-proxy more resiliant to running out of file descriptors ([#6727](https://github.com/GoogleCloudPlatform/kubernetes/pull/6727 "pkg/proxy: panic if run out of fd"))
  
To download, please visit https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.15.0