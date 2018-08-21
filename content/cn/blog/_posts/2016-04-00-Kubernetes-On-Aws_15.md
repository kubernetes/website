---
title: " 如何在AWS上部署安全，可审计，可重现的k8s集群 "
date: 2016-04-15
slug: kubernetes-on-aws_15
url: /blog/2016/04/Kubernetes-On-Aws_15
---

_今天的客座文章是由Colin Hom撰写，[CoreOS](https://coreos.com/)的基础架构工程师。CoreOS致力于推广谷歌的基础架构模式（Google’s Infrastructure for Everyone Else， #GIFEE），让全世界的容器都能在CoreOS Linux, Tectonic 和 Quay上安全运行。_

_加入到我们的[柏林CoreOS盛宴](https://coreos.com/fest/)，这是一个开源分布式系统主题的会议，在这里可以了解到更多关于CoreOS和Kubernetes的信息。_

在CoreOS, 我们一直都是在生产环境中大规模部署Kubernetes。今天我们非常兴奋地想分享一款工具，它能让你的Kubernetes生产环境大规模部署更加的轻松。Kube-aws这个工具可以用来在AWS上部署可审计，可重现的k8s集群，而CoreOS本身就在生产环境中使用它。

也许今天，你更多的可能是用手工的方式来拼接Kubernetes组件。但有了这个工具之后，Kubernetes可以流水化地打包、交付，节省时间，减少了相互间的依赖，更加快捷地实现生产环境的部署。

借助于一个简单的模板系统，来生成集群配置，这么做是因为一套声明式的配置模板可以版本控制，审计以及重复部署。而且，由于整个创建过程只用到了[AWS CloudFormation](https://aws.amazon.com/cloudformation/) 和 cloud-init，你也就不需要额外用到其它的配置管理工具。开箱即用！

如果要跳过演讲，直接了解这个项目，可以看看[kube-aws的最新发布](https://github.com/coreos/coreos-kubernetes/releases)，支持Kubernetes 1.2.x。如果要部署集群，可以参考[文档]](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html).

**Why kube-aws? Security, auditability and reproducibility**
为什么是kube-aws？安全，可审计，可重现

Kube-aws设计初衷有三个目标。

**安全** : TLS 资源在嵌入到CloudFormation JSON之前，通过[AWS 秘钥管理服务](https://aws.amazon.com/kms/)加密。通过单独管理KMS密钥的[IAM 策略](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)，可以将CloudFormation栈的访问与TLS秘钥的访问分离开。

**可审计** : kube-aws是围绕集群资产的概念来创建。这些配置和账户资产是对集群的完全描述。由于KMS被用来加密TLS资产，因而可以无所顾忌地将未加密的CloudFormation栈 JSON签入到版本控制服务中。

**可重复** : _--export_ 选项将参数化的集群定义打包成一整个JSON文件，对应一个CloudFormation栈。这个文件可以版本控制，然后，如果需要的话，通过现有的部署工具直接提交给CloudFormation API。

**如何开始用kube-aws**

在此基础之上，kube-aws也实现了一些功能，使得在AWS上部署Kubernetes集群更加容易，灵活。下面是一些例子。

**Route53集成** : Kube-aws 可以管理你的集群DNS记录，作为配置过程的一部分。

cluster.yaml
```
externalDNSName: my-cluster.kubernetes.coreos.com

createRecordSet: true

hostedZone: kubernetes.coreos.com

recordSetTTL: 300
```

**现有VPC支持** : 将集群部署到现有的VPC上。

cluster.yaml
```
vpcId: vpc-xxxxx

routeTableId: rtb-xxxxx
```

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

考虑如何起步？看看[kube-aws 文档](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)！

**w未来的工作**

一如既往，kube-aws的目标是让生产环境部署更加的简单。尽管我们现在在AWS下使用kube-aws进行生产环境部署，但是这个项目还是pre-1.0，所以还有很多的地方，kube-aws需要考虑、扩展。

**容错** : CoreOS坚信 Kubernetes on AWS是强健的平台，适于容错、自恢复部署。在接下来的几个星期，kube-aws将会迎接新的考验：混世猴子（[Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey)）测试 - 控制平面以及全部！

**零停机更新** : 更新CoreOS节点和Kubernetes组件不需要停机，也不需要考虑实例更新策略（instance replacement strategy）的影响。

有一个[github issue](https://github.com/coreos/coreos-kubernetes/issues/340)来追踪这些工作进展。我们期待你的参与，提交issue，或是直接贡献。

_想要更多地了解Kubernetes，来[柏林CoreOS盛宴](https://coreos.com/fest/)看看，- 五月 9-10, 2016_

_– Colin Hom, 基础架构工程师, CoreOS_
