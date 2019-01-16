<!-- ---
title: " How to deploy secure, auditable, and reproducible Kubernetes clusters on AWS "
date: 2016-04-15
slug: kubernetes-on-aws_15
url: /blog/2016/04/Kubernetes-On-Aws_15
--- -->

---
title: " 如何在AWS上部署安全，可审计，可复现的k8s集群 "
date: 2016-04-15
slug: kubernetes-on-aws_15
url: /blog/2016/04/Kubernetes-On-Aws_15
---

<!-- _Today’s guest post is written by Colin Hom, infrastructure engineer at [CoreOS](https://coreos.com/), the company delivering Google’s Infrastructure for Everyone Else (#GIFEE) and running the world's containers securely on CoreOS Linux, Tectonic and Quay._

_Join us at [CoreOS Fest Berlin](https://coreos.com/fest/), the Open Source Distributed Systems Conference, and learn more about CoreOS and Kubernetes._ -->

_今天的客座文章是由Colin Hom撰写，[CoreOS](https://coreos.com/)的基础架构工程师。CoreOS致力于推广谷歌的基础架构模式（Google’s Infrastructure for Everyone Else， #GIFEE），让全世界的容器都能在CoreOS Linux, Tectonic 和 Quay上安全运行。_

_加入到我们的[柏林CoreOS盛宴](https://coreos.com/fest/)，这是一个开源分布式系统主题的会议，在这里可以了解到更多关于CoreOS和Kubernetes的信息。_

<!-- At CoreOS, we're all about deploying Kubernetes in production at scale. Today we are excited to share a tool that makes deploying Kubernetes on Amazon Web Services (AWS) a breeze. Kube-aws is a tool for deploying auditable and reproducible Kubernetes clusters to AWS, currently used by CoreOS to spin up production clusters. -->

在CoreOS, 我们一直都是在生产环境中大规模部署Kubernetes。今天我们非常兴奋地想分享一款工具，它能让你的Kubernetes生产环境大规模部署更加的轻松。Kube-aws这个工具可以用来在AWS上部署可审计，可复现的k8s集群，而CoreOS本身就在生产环境中使用它。

<!-- Today you might be putting the Kubernetes components together in a more manual way. With this helpful tool, Kubernetes is delivered in a streamlined package to save time, minimize interdependencies and quickly create production-ready deployments. -->

也许今天，你更多的可能是用手工的方式来拼接Kubernetes组件。但有了这个工具之后，Kubernetes可以流水化地打包、交付，节省时间，减少了相互间的依赖，更加快捷地实现生产环境的部署。

<!-- A simple templating system is leveraged to generate cluster configuration as a set of declarative configuration templates that can be version controlled, audited and re-deployed. Since the entirety of the provisioning is by [AWS CloudFormation](https://aws.amazon.com/cloudformation/) and cloud-init, there’s no need for external configuration management tools on your end. Batteries included! -->

借助于一个简单的模板系统，来生成集群配置，这么做是因为一套声明式的配置模板可以版本控制，审计以及重复部署。而且，由于整个创建过程只用到了[AWS CloudFormation](https://aws.amazon.com/cloudformation/) 和 cloud-init，你也就不需要额外用到其它的配置管理工具。开箱即用！

<!-- To skip the talk and go straight to the project, check out [the latest release of kube-aws](https://github.com/coreos/coreos-kubernetes/releases), which supports Kubernetes 1.2.x. To get your cluster running, [check out the documentation](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html). -->

如果要跳过演讲，直接了解这个项目，可以看看[kube-aws的最新发布](https://github.com/coreos/coreos-kubernetes/releases)，支持Kubernetes 1.2.x。如果要部署集群，可以参考[文档]](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html).

<!-- **Why kube-aws? Security, auditability and reproducibility** -->
**为什么是kube-aws？安全，可审计，可复现**

<!-- Kube-aws is designed with three central goals in mind. -->
Kube-aws设计初衷有三个目标。

<!-- **Secure** : TLS assets are encrypted via the [AWS Key Management Service (KMS)](https://aws.amazon.com/kms/) before being embedded in the CloudFormation JSON. By managing [IAM policy](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html) for the KMS key independently, an operator can decouple operational access to the CloudFormation stack from access to the TLS secrets. -->

**安全** : TLS 资源在嵌入到CloudFormation JSON之前，通过[AWS 秘钥管理服务](https://aws.amazon.com/kms/)加密。通过单独管理KMS密钥的[IAM 策略](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)，可以将CloudFormation栈的访问与TLS秘钥的访问分离开。

<!-- **Auditable** : kube-aws is built around the concept of cluster assets. These configuration and credential assets represent the complete description of the cluster. Since KMS is used to encrypt TLS assets, you can feel free to check your unencrypted stack JSON into version control as well! -->

**可审计** : kube-aws是围绕集群资产的概念来创建。这些配置和账户资产是对集群的完全描述。由于KMS被用来加密TLS资产，因而可以无所顾忌地将未加密的CloudFormation栈 JSON签入到版本控制服务中。

<!-- **Reproducible** : The _--export_ option packs your parameterized cluster definition into a single JSON file which defines a CloudFormation stack. This file can be version controlled and submitted directly to the CloudFormation API via existing deployment tooling, if desired. -->

**可重复** : _--export_ 选项将参数化的集群定义打包成一整个JSON文件，对应一个CloudFormation栈。这个文件可以版本控制，然后，如果需要的话，通过现有的部署工具直接提交给CloudFormation API。

<!-- **How to get started with kube-aws** -->
**如何开始用kube-aws**

<!-- On top of this foundation, kube-aws implements features that make Kubernetes deployments on AWS easier to manage and more flexible. Here are some examples. -->
在此基础之上，kube-aws也实现了一些功能，使得在AWS上部署Kubernetes集群更加容易，灵活。下面是一些例子。

<!-- **Route53 Integration** : Kube-aws can manage your cluster DNS records as part of the provisioning process. -->
**Route53集成** : Kube-aws 可以管理你的集群DNS记录，作为配置过程的一部分。

cluster.yaml
```
externalDNSName: my-cluster.kubernetes.coreos.com

createRecordSet: true

hostedZone: kubernetes.coreos.com

recordSetTTL: 300
```

<!-- **Existing VPC Support** : Deploy your cluster to an existing VPC. -->
**现有VPC支持** : 将集群部署到现有的VPC上。

cluster.yaml
```
vpcId: vpc-xxxxx

routeTableId: rtb-xxxxx
```

<!-- **Validation** : Kube-aws supports validation of cloud-init and CloudFormation definitions, along with any external resources that the cluster stack will integrate with. For example, here’s a cloud-config with a misspelled parameter: -->
**验证** : kube-aws 支持验证 cloud-init 和 CloudFormation定义，以及集群栈会集成用到的外部资源。例如，下面就是一个cloud-config，外带一个拼写错误的参数：

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

<!-- To get started, check out the [kube-aws documentation](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html). -->
考虑如何起步？看看[kube-aws 文档](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)！

<!-- **Future Work** -->
**未来的工作**

<!-- As always, the goal with kube-aws is to make deployments that are production ready. While we use kube-aws in production on AWS today, this project is pre-1.0 and there are a number of areas in which kube-aws needs to evolve. -->
一如既往，kube-aws的目标是让生产环境部署更加的简单。尽管我们现在在AWS下使用kube-aws进行生产环境部署，但是这个项目还是pre-1.0，所以还有很多的地方，kube-aws需要考虑、扩展。

<!-- **Fault tolerance** : At CoreOS we believe Kubernetes on AWS is a potent platform for fault-tolerant and self-healing deployments. In the upcoming weeks, kube-aws will be rising to a new challenge: surviving the [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey) – control plane and all! -->
**容错** : CoreOS坚信 Kubernetes on AWS是强健的平台，适于容错、自恢复部署。在接下来的几个星期，kube-aws将会迎接新的考验：混世猴子（[Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey)）测试 - 控制平面以及全部！

<!-- **Zero-downtime updates** : Updating CoreOS nodes and Kubernetes components can be done without downtime and without interdependency with the correct instance replacement strategy. -->
**零停机更新** : 更新CoreOS节点和Kubernetes组件不需要停机，也不需要考虑实例更新策略（instance replacement strategy）的影响。

<!-- A [github issue](https://github.com/coreos/coreos-kubernetes/issues/340) tracks the work towards this goal. We look forward to seeing you get involved with the project by filing issues or contributing directly. -->
有一个[github issue](https://github.com/coreos/coreos-kubernetes/issues/340)来追踪这些工作进展。我们期待你的参与，提交issue，或是直接贡献。

<!-- _Learn more about Kubernetes and meet the community at [CoreOS Fest Berlin](https://coreos.com/fest/) - May 9-10, 2016_ -->
_想要更多地了解Kubernetes，来[柏林CoreOS盛宴](https://coreos.com/fest/)看看，- 五月 9-10, 2016_

<!-- _– Colin Hom, infrastructure engineer, CoreOS_ -->
_– Colin Hom, 基础架构工程师, CoreOS_
