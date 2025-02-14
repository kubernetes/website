---
title: " Kubernetes Release: 0.15.0 "
date: 2015-04-16
slug: kubernetes-release-0150
url: /blog/2015/04/Kubernetes-Release-0150
---

Release Notes:



* Enables v1beta3 API and sets it to the default API version ([#6098][1])
* Added multi-port Services ([#6182][2])
    * New Getting Started Guides
    * Multi-node local startup guide ([#6505][3])
    * Mesos on Google Cloud Platform ([#5442][4])
    * Ansible Setup instructions ([#6237][5])
* Added a controller framework ([#5270][6], [#5473][7])
* The Kubelet now listens on a secure HTTPS port ([#6380][8])
* Made kubectl errors more user-friendly ([#6338][9])
* The apiserver now supports client cert authentication ([#6190][10])
* The apiserver now limits the number of concurrent requests it processes ([#6207][11])
* Added rate limiting to pod deleting ([#6355][12])
* Implement Balanced Resource Allocation algorithm as a PriorityFunction in scheduler package ([#6150][13])
* Enabled log collection from master ([#6396][14])
* Added an api endpoint to pull logs from Pods ([#6497][15])
* Added latency metrics to scheduler ([#6368][16])
* Added latency metrics to REST client ([#6409][17])
* etcd now runs in a pod on the master ([#6221][18])
* nginx now runs in a container on the master ([#6334][19])
* Began creating Docker images for master components ([#6326][20])
* Updated GCE provider to work with gcloud 0.9.54 ([#6270][21])
* Updated AWS provider to fix Region vs Zone semantics ([#6011][22])
* Record event when image GC fails ([#6091][23])
* Add a QPS limiter to the kubernetes client ([#6203][24])
* Decrease the time it takes to run make release ([#6196][25])
* New volume support
    * Added iscsi volume plugin ([#5506][26])
    * Added glusterfs volume plugin ([#6174][27])
    * AWS EBS volume support ([#5138][28])
* Updated to heapster version to v0.10.0 ([#6331][29])
* Updated to etcd 2.0.9 ([#6544][30])
* Updated to Kibana to v1.2 ([#6426][31])
* Bug Fixes
    * Kube-proxy now updates iptables rules if a service's public IPs change ([#6123][32])
    * Retry kube-addons creation if the initial creation fails ([#6200][33])
    * Make kube-proxy more resiliant to running out of file descriptors ([#6727][34])

To download, please visit https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.15.0

[1]: https://github.com/kubernetes/kubernetes/pull/6098 "Enabling v1beta3 api version by default in master"
[2]: https://github.com/kubernetes/kubernetes/pull/6182 "Implement multi-port Services"
[3]: https://github.com/kubernetes/kubernetes/pull/6505 "Docker multi-node"
[4]: https://github.com/kubernetes/kubernetes/pull/5442 "Getting started guide for Mesos on Google Cloud Platform"
[5]: https://github.com/kubernetes/kubernetes/pull/6237 "example ansible setup repo"
[6]: https://github.com/kubernetes/kubernetes/pull/5270 "Controller framework"
[7]: https://github.com/kubernetes/kubernetes/pull/5473 "Add DeltaFIFO (a controller framework piece)"
[8]: https://github.com/kubernetes/kubernetes/pull/6380 "Configure the kubelet to use HTTPS (take 2)"
[9]: https://github.com/kubernetes/kubernetes/pull/6338 "Return a typed error for config validation, and make errors simple"
[10]: https://github.com/kubernetes/kubernetes/pull/6190 "Add client cert authentication"
[11]: https://github.com/kubernetes/kubernetes/pull/6207 "Add a limit to the number of in-flight requests that a server processes."
[12]: https://github.com/kubernetes/kubernetes/pull/6355 "Added rate limiting to pod deleting"
[13]: https://github.com/kubernetes/kubernetes/pull/6150 "Implement Balanced Resource Allocation (BRA) algorithm as a PriorityFunction in scheduler package."
[14]: https://github.com/kubernetes/kubernetes/pull/6396 "Enable log collection from master."
[15]: https://github.com/kubernetes/kubernetes/pull/6497 "Pod log subresource"
[16]: https://github.com/kubernetes/kubernetes/pull/6368 "Add basic latency metrics to scheduler."
[17]: https://github.com/kubernetes/kubernetes/pull/6409 "Add latency metrics to REST client"
[18]: https://github.com/kubernetes/kubernetes/pull/6221 "Run etcd 2.0.5 in a pod"
[19]: https://github.com/kubernetes/kubernetes/pull/6334 "Add an nginx docker image for use on the master."
[20]: https://github.com/kubernetes/kubernetes/pull/6326 "Create Docker images for master components "
[21]: https://github.com/kubernetes/kubernetes/pull/6270 "Updates for gcloud 0.9.54"
[22]: https://github.com/kubernetes/kubernetes/pull/6011 "Fix AWS region vs zone"
[23]: https://github.com/kubernetes/kubernetes/pull/6091 "Record event when image GC fails."
[24]: https://github.com/kubernetes/kubernetes/pull/6203 "Add a QPS limiter to the kubernetes client."
[25]: https://github.com/kubernetes/kubernetes/pull/6196 "Parallelize architectures in both the building and packaging phases of `make release`"
[26]: https://github.com/kubernetes/kubernetes/pull/5506 "add iscsi volume plugin"
[27]: https://github.com/kubernetes/kubernetes/pull/6174 "implement glusterfs volume plugin"
[28]: https://github.com/kubernetes/kubernetes/pull/5138 "AWS EBS volume support"
[29]: https://github.com/kubernetes/kubernetes/pull/6331 "Update heapster version to v0.10.0"
[30]: https://github.com/kubernetes/kubernetes/pull/6544 "Build etcd image (version 2.0.9), and upgrade kubernetes cluster to the new version"
[31]: https://github.com/kubernetes/kubernetes/pull/6426 "Update Kibana to v1.2 which paramaterizes location of Elasticsearch"
[32]: https://github.com/kubernetes/kubernetes/pull/6123 "Fix bug in kube-proxy of not updating iptables rules if a service's public IPs change"
[33]: https://github.com/kubernetes/kubernetes/pull/6200 "Retry kube-addons creation if kube-addons creation fails."
[34]: https://github.com/kubernetes/kubernetes/pull/6727 "pkg/proxy: panic if run out of fd"
