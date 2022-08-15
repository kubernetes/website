---
title: "Kubernetes Release: 0.16.0"
date: 2015-05-11
slug: kubernetes-release-0160
url: /blog/2015/05/Kubernetes-Release-0160
evergreen: true
---
Release Notes:

- Bring up a kuberenetes cluster using coreos image as worker nodes [#7445](https://github.com/GoogleCloudPlatform/kubernetes/pull/7445) (dchen1107)
- Cloning v1beta3 as v1 and exposing it in the apiserver [#7454](https://github.com/GoogleCloudPlatform/kubernetes/pull/7454) (nikhiljindal)
- API Conventions for Late-initializers [#7366](https://github.com/GoogleCloudPlatform/kubernetes/pull/7366) (erictune)
- Upgrade Elasticsearch to 1.5.2 for cluster logging [#7455](https://github.com/GoogleCloudPlatform/kubernetes/pull/7455) (satnam6502)
- Make delete actually stop resources by default. [#7210](https://github.com/GoogleCloudPlatform/kubernetes/pull/7210) (brendandburns)
- Change kube2sky to use token-system-dns secret, point at https endpoint ... [#7154](https://github.com/GoogleCloudPlatform/kubernetes/pull/7154)(cjcullen)
- Updated CoreOS bare metal docs for 0.15.0 [#7364](https://github.com/GoogleCloudPlatform/kubernetes/pull/7364) (hvolkmer)
- Print named ports in 'describe service' [#7424](https://github.com/GoogleCloudPlatform/kubernetes/pull/7424) (thockin)
- AWS
- Return public & private addresses in GetNodeAddresses [#7040](https://github.com/GoogleCloudPlatform/kubernetes/pull/7040) (justinsb)
- Improving getting existing VPC and subnet [#6606](https://github.com/GoogleCloudPlatform/kubernetes/pull/6606) (gust1n)
- Set hostname\_override for minions, back to fully-qualified name [#7182](https://github.com/GoogleCloudPlatform/kubernetes/pull/7182) (justinsb)
- Conversion to v1beta3
- Convert node level logging agents to v1beta3 [#7274](https://github.com/GoogleCloudPlatform/kubernetes/pull/7274) (satnam6502)
- Removing more references to v1beta1 from pkg/ [#7128](https://github.com/GoogleCloudPlatform/kubernetes/pull/7128) (nikhiljindal)
- update examples/cassandra to api v1beta3 [#7258](https://github.com/GoogleCloudPlatform/kubernetes/pull/7258) (caesarxuchao)
- Convert Elasticsearch logging to v1beta3 and de-salt [#7246](https://github.com/GoogleCloudPlatform/kubernetes/pull/7246) (satnam6502)
- Update examples/storm for v1beta3 [#7231](https://github.com/GoogleCloudPlatform/kubernetes/pull/7231) (bcbroussard)
- Update examples/spark for v1beta3 [#7230](https://github.com/GoogleCloudPlatform/kubernetes/pull/7230) (bcbroussard)
- Update Kibana RC and service to v1beta3 [#7240](https://github.com/GoogleCloudPlatform/kubernetes/pull/7240) (satnam6502)
- Updating the guestbook example to v1beta3 [#7194](https://github.com/GoogleCloudPlatform/kubernetes/pull/7194) (nikhiljindal)
- Update Phabricator to v1beta3 example [#7232](https://github.com/GoogleCloudPlatform/kubernetes/pull/7232) (bcbroussard)
- Update Kibana pod to speak to Elasticsearch using v1beta3 [#7206](https://github.com/GoogleCloudPlatform/kubernetes/pull/7206) (satnam6502)
- Validate Node IPs; clean up validation code [#7180](https://github.com/GoogleCloudPlatform/kubernetes/pull/7180) (ddysher)
- Add PortForward to runtime API. [#7391](https://github.com/GoogleCloudPlatform/kubernetes/pull/7391) (vmarmol)
- kube-proxy uses token to access port 443 of apiserver [#7303](https://github.com/GoogleCloudPlatform/kubernetes/pull/7303) (erictune)
- Move the logging-related directories to where I think they belong [#7014](https://github.com/GoogleCloudPlatform/kubernetes/pull/7014) (a-robinson)
- Make client service requests use the default timeout now that external load balancers are created asynchronously [#6870](https://github.com/GoogleCloudPlatform/kubernetes/pull/6870) (a-robinson)
- Fix bug in kube-proxy of not updating iptables rules if a service's public IPs change [#6123](https://github.com/GoogleCloudPlatform/kubernetes/pull/6123)(a-robinson)
- PersistentVolumeClaimBinder [#6105](https://github.com/GoogleCloudPlatform/kubernetes/pull/6105) (markturansky)
- Fixed validation message when trying to submit incorrect secret [#7356](https://github.com/GoogleCloudPlatform/kubernetes/pull/7356) (soltysh)
- First step to supporting multiple k8s clusters [#6006](https://github.com/GoogleCloudPlatform/kubernetes/pull/6006) (justinsb)
- Parity for namespace handling in secrets E2E [#7361](https://github.com/GoogleCloudPlatform/kubernetes/pull/7361) (pmorie)
- Add cleanup policy to RollingUpdater [#6996](https://github.com/GoogleCloudPlatform/kubernetes/pull/6996) (ironcladlou)
- Use narrowly scoped interfaces for client access [#6871](https://github.com/GoogleCloudPlatform/kubernetes/pull/6871) (ironcladlou)
- Warning about Critical bug in the GlusterFS Volume Plugin [#7319](https://github.com/GoogleCloudPlatform/kubernetes/pull/7319) (wattsteve)
- Rolling update
- First part of improved rolling update, allow dynamic next replication controller generation. [#7268](https://github.com/GoogleCloudPlatform/kubernetes/pull/7268) (brendandburns)
- Further implementation of rolling-update, add rename [#7279](https://github.com/GoogleCloudPlatform/kubernetes/pull/7279) (brendandburns)
- Added basic apiserver authz tests. [#7293](https://github.com/GoogleCloudPlatform/kubernetes/pull/7293) (ashcrow)
- Retry pod update on version conflict error in e2e test. [#7297](https://github.com/GoogleCloudPlatform/kubernetes/pull/7297) (quinton-hoole)
- Add "kubectl validate" command to do a cluster health check. [#6597](https://github.com/GoogleCloudPlatform/kubernetes/pull/6597) (fabioy)
- coreos/azure: Weave version bump, various other enhancements [#7224](https://github.com/GoogleCloudPlatform/kubernetes/pull/7224) (errordeveloper)
- Azure: Wait for salt completion on cluster initialization [#6576](https://github.com/GoogleCloudPlatform/kubernetes/pull/6576) (jeffmendoza)
- Tighten label parsing [#6674](https://github.com/GoogleCloudPlatform/kubernetes/pull/6674) (kargakis)
- fix watch of single object [#7263](https://github.com/GoogleCloudPlatform/kubernetes/pull/7263) (lavalamp)
- Upgrade go-dockerclient dependency to support CgroupParent [#7247](https://github.com/GoogleCloudPlatform/kubernetes/pull/7247) (guenter)
- Make secret volume plugin idempotent [#7166](https://github.com/GoogleCloudPlatform/kubernetes/pull/7166) (pmorie)
- Salt reconfiguration to get rid of nginx on GCE [#6618](https://github.com/GoogleCloudPlatform/kubernetes/pull/6618) (roberthbailey)
- Revert "Change kube2sky to use token-system-dns secret, point at https e... [#7207](https://github.com/GoogleCloudPlatform/kubernetes/pull/7207) (fabioy)
- Pod templates as their own type [#5012](https://github.com/GoogleCloudPlatform/kubernetes/pull/5012) (smarterclayton)
- iscsi Test: Add explicit check for attach and detach calls. [#7110](https://github.com/GoogleCloudPlatform/kubernetes/pull/7110) (swagiaal)
- Added field selector for listing pods [#7067](https://github.com/GoogleCloudPlatform/kubernetes/pull/7067) (ravigadde)
- Record an event on node schedulable changes [#7138](https://github.com/GoogleCloudPlatform/kubernetes/pull/7138) (pravisankar)
- Resolve [#6812](https://github.com/GoogleCloudPlatform/kubernetes/issues/6812), limit length of load balancer names [#7145](https://github.com/GoogleCloudPlatform/kubernetes/pull/7145) (caesarxuchao)
- Convert error strings to proper validation errors. [#7131](https://github.com/GoogleCloudPlatform/kubernetes/pull/7131) (rjnagal)
- ResourceQuota add object count support for secret and volume claims [#6593](https://github.com/GoogleCloudPlatform/kubernetes/pull/6593)(derekwaynecarr)
- Use Pod.Spec.Host instead of Pod.Status.HostIP for pod subresources [#6985](https://github.com/GoogleCloudPlatform/kubernetes/pull/6985) (csrwng)
- Prioritize deleting the non-running pods when reducing replicas [#6992](https://github.com/GoogleCloudPlatform/kubernetes/pull/6992) (yujuhong)
- Kubernetes UI with Dashboard component [#7056](https://github.com/GoogleCloudPlatform/kubernetes/pull/7056) (preillyme)

To download, please visit https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.16.0
