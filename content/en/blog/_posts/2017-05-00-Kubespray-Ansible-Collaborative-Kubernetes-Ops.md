---
title: " Kubespray Ansible Playbooks foster Collaborative Kubernetes Ops "
date: 2017-05-19
slug: kubespray-ansible-collaborative-kubernetes-ops
url: /blog/2017/05/Kubespray-Ansible-Collaborative-Kubernetes-Ops
author: >
   Rob Hirschfeld (RackN)
---

**Why Kubespray?**  

Making Kubernetes operationally strong is a widely held priority and I track many deployment efforts around the project. The [incubated Kubespray project](https://github.com/kubernetes-incubator/kubespray) is of particular interest for me because it uses the popular Ansible toolset to build robust, upgradable clusters on both cloud and physical targets. I believe using tools familiar to operators grows our community.  

We’re excited to see the breadth of platforms enabled by Kubespray and how well it handles a wide range of options like integrating Ceph for [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) persistence and Helm for easier application uploads. Those additions have allowed us to fully integrate the [OpenStack Helm charts](https://github.com/att-comdev/openstack-helm) ([demo video](https://www.youtube.com/watch?v=wZ0vMrdx4a4&list=PLXPBeIrpXjfjabMbwYyDULOX3kZmlxEXK&index=2)).  

By working with the upstream source instead of creating different install scripts, we get the benefits of a larger community. This requires some extra development effort; however, we believe helping share operational practices makes the whole community stronger. That was also the motivation behind the [SIG-Cluster Ops](https://github.com/kubernetes/community/tree/master/sig-cluster-ops).  

**With Kubespray delivering robust installs, we can focus on broader operational concerns.**  

For example, we can now drive parallel deployments, so it’s possible to fully exercise the options enabled by Kubespray simultaneously for development and testing. &nbsp;  

That’s helpful to built-test-destroy coordinated Kubernetes installs on CentOS, Red Hat and Ubuntu as part of an automation pipeline. We can also set up a full classroom environment from a single command using [Digital Rebar’s](https://github.com/digitalrebar/digitalrebar) providers, tenants and cluster definition JSON.  

**Let’s explore the classroom example:**  

First, we define a [student cluster in JSON](https://github.com/digitalrebar/digitalrebar/blob/master/deploy/workloads/cluster/deploy-001.json) like the snippet below  


|
{

 &nbsp;"attribs": {

 &nbsp;&nbsp;&nbsp;"k8s-version": "v1.6.0",

 &nbsp;&nbsp;&nbsp;"k8s-kube\_network\_plugin": "calico",

 &nbsp;&nbsp;&nbsp;"k8s-docker\_version": "1.12"

 &nbsp;},

 &nbsp;"name": "cluster01",

 &nbsp;"tenant": "cluster01",

 &nbsp;"public\_keys": {

 &nbsp;&nbsp;&nbsp;"cluster01": "ssh-rsa AAAAB..... user@example.com"

 &nbsp;},

 &nbsp;"provider": {

 &nbsp;&nbsp;&nbsp;"name": "google-provider"

 &nbsp;},

 &nbsp;"nodes": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"roles": ["etcd","k8s-addons", "k8s-master"],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"count": 1

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"roles": ["k8s-worker"],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"count": 3

 &nbsp;&nbsp;&nbsp;}

 &nbsp;]

}
 |



Then we run the [Digital Rebar workloads Multideploy.sh](https://github.com/digitalrebar/digitalrebar/blob/master/deploy/workloads/multideploy.sh) reference script which inspects the deployment files to pull out key information. &nbsp;Basically, it automates the following steps:  




|
rebar provider create {“name”:“google-provider”, [secret stuff]}

rebar tenants create {“name”:“cluster01”}

rebar deployments create [contents from cluster01 file]
 |



The deployments create command will automatically request nodes from the provider. Since we’re using tenants and SSH key additions, each student only gets access to their own cluster. When we’re done, adding the --destroy flag will reverse the process for the nodes and deployments but leave the providers and tenants.  

**We are invested in operational scripts like this example using Kubespray and Digital Rebar because if we cannot manage variation in a consistent way then we’re doomed to operational fragmentation. &nbsp;**  

I am excited to see and be part of the community progress towards enterprise-ready Kubernetes operations on both cloud and on-premises. That means I am seeing reasonable patterns emerge with sharable/reusable automation. I strongly recommend watching (or better, collaborating in) these efforts if you are deploying Kubernetes even at experimental scale. Being part of the community requires more upfront effort but returns dividends as you get the benefits of shared experience and improvement.  

**When deploying at scale, how do you set up a system to be both repeatable and multi-platform without compromising scale or security?**  

With Kubespray and Digital Rebar as a repeatable base, extensions get much faster and easier. Even better, using upstream directly allows improvements to be quickly cycled back into upstream. That means we’re closer to building a community focused on the operational side of Kubernetes with an [SRE mindset](https://rackn.com/sre).  

If this is interesting, please engage with us in the [Cluster Ops SIG](https://github.com/kubernetes/community/tree/master/sig-cluster-ops), [Kubespray](https://github.com/kubernetes-incubator/kubespray)&nbsp;or [Digital Rebar](http://rebar.digital/) communities.&nbsp;  



- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
