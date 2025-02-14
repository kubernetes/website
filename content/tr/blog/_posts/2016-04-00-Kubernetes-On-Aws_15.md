---
title: " How to deploy secure, auditable, and reproducible Kubernetes clusters on AWS "
date: 2016-04-15
slug: kubernetes-on-aws_15
url: /blog/2016/04/Kubernetes-On-Aws_15
author: >
  Colin Hom (CoreOS)
---

At CoreOS, we're all about deploying Kubernetes in production at scale. Today we are excited to share a tool that makes deploying Kubernetes on Amazon Web Services (AWS) a breeze. Kube-aws is a tool for deploying auditable and reproducible Kubernetes clusters to AWS, currently used by CoreOS to spin up production clusters.  

Today you might be putting the Kubernetes components together in a more manual way. With this helpful tool, Kubernetes is delivered in a streamlined package to save time, minimize interdependencies and quickly create production-ready deployments.  

A simple templating system is leveraged to generate cluster configuration as a set of declarative configuration templates that can be version controlled, audited and re-deployed. Since the entirety of the provisioning is by [AWS CloudFormation](https://aws.amazon.com/cloudformation/) and cloud-init, there’s no need for external configuration management tools on your end. Batteries included!  

To skip the talk and go straight to the project, check out [the latest release of kube-aws](https://github.com/coreos/coreos-kubernetes/releases), which supports Kubernetes 1.2.x. To get your cluster running, [check out the documentation](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html).  

**Why kube-aws? Security, auditability and reproducibility**  

Kube-aws is designed with three central goals in mind.  


**Secure** : TLS assets are encrypted via the [AWS Key Management Service (KMS)](https://aws.amazon.com/kms/) before being embedded in the CloudFormation JSON. By managing [IAM policy](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html) for the KMS key independently, an operator can decouple operational access to the CloudFormation stack from access to the TLS secrets.



**Auditable** : kube-aws is built around the concept of cluster assets. These configuration and credential assets represent the complete description of the cluster. Since KMS is used to encrypt TLS assets, you can feel free to check your unencrypted stack JSON into version control as well!



**Reproducible** : The _--export_ option packs your parameterized cluster definition into a single JSON file which defines a CloudFormation stack. This file can be version controlled and submitted directly to the CloudFormation API via existing deployment tooling, if desired.


**How to get started with kube-aws**



On top of this foundation, kube-aws implements features that make Kubernetes deployments on AWS easier to manage and more flexible. Here are some examples.



**Route53 Integration** : Kube-aws can manage your cluster DNS records as part of the provisioning process.



cluster.yaml
```
externalDNSName: my-cluster.kubernetes.coreos.com

createRecordSet: true

hostedZone: kubernetes.coreos.com

recordSetTTL: 300
```



**Existing VPC Support** : Deploy your cluster to an existing VPC.



cluster.yaml


```
vpcId: vpc-xxxxx

routeTableId: rtb-xxxxx
 ```



**Validation** : Kube-aws supports validation of cloud-init and CloudFormation definitions, along with any external resources that the cluster stack will integrate with. For example, here’s a cloud-config with a misspelled parameter:



userdata/cloud-config-worker


```
#cloud-config

coreos:

  flannel:  
    interrface: $private\_ipv4  
    etcd\_endpoints: {{ .ETCDEndpoints }}
 ```



 $ kube-aws validate


 \> Validating UserData...  
     Error: cloud-config validation errors:  
     UserDataWorker: line 4: warning: unrecognized key "interrface"



To get started, check out the [kube-aws documentation](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html).


**Future Work**  

As always, the goal with kube-aws is to make deployments that are production ready. While we use kube-aws in production on AWS today, this project is pre-1.0 and there are a number of areas in which kube-aws needs to evolve.  

**Fault tolerance** : At CoreOS we believe Kubernetes on AWS is a potent platform for fault-tolerant and self-healing deployments. In the upcoming weeks, kube-aws will be rising to a new challenge: surviving the [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey) – control plane and all!  

**Zero-downtime updates** : Updating CoreOS nodes and Kubernetes components can be done without downtime and without interdependency with the correct instance replacement strategy.  

A [github issue](https://github.com/coreos/coreos-kubernetes/issues/340) tracks the work towards this goal. We look forward to seeing you get involved with the project by filing issues or contributing directly.  


_Learn more about Kubernetes and meet the community at [CoreOS Fest Berlin](https://coreos.com/fest/) - May 9-10, 2016_
