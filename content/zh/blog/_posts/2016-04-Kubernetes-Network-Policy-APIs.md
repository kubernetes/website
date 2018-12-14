<!-- ---
title: " SIG-Networking: Kubernetes Network Policy APIs Coming in 1.3 "
date: 2016-04-18
slug: kubernetes-network-policy-apis
url: /blog/2016/04/Kubernetes-Network-Policy-APIs
--- -->

---
title: "SIG-Networking: Kubernetes Network Policy APIs Coming in 1.3 "
date: 2016-04-18
slug: kubernetes-network-policy-apis
url: /blog/2016/04/Kubernetes-Network-Policy-APIs
---

<!-- _Editor’s note: This week we’re featuring [Kubernetes Special Interest Groups](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)); Today’s post is by the Network-SIG team describing network policy APIs coming in 1.3 - policies for security, isolation and multi-tenancy._ -->

编者按：这一周，我们的封面主题是 [Kubernetes 特别兴趣小组](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs))；今天的文章由网络兴趣小组撰写，来谈谈 1.3 版本中即将出现的网络策略 API - 针对安全，隔离和多租户的策略。

<!-- The [Kubernetes network SIG](https://kubernetes.slack.com/messages/sig-network/) has been meeting regularly since late last year to work on bringing network policy to Kubernetes and we’re starting to see the results of this effort. -->

自去年下半年起，[Kubernetes 网络特别兴趣小组](https://kubernetes.slack.com/messages/sig-network/)经常定期开会，讨论如何将网络策略带入到 Kubernetes 之中，现在，我们也将慢慢看到这些工作的成果。

<!-- One problem many users have is that the open access network policy of Kubernetes is not suitable for applications that need more precise control over the traffic that accesses a pod or service. Today, this could be a multi-tier application where traffic is only allowed from a tier’s neighbor. But as new Cloud Native applications are built by composing microservices, the ability to control traffic as it flows among these services becomes even more critical. -->

很多用户经常会碰到的一个问题是， Kubernetes 的开放访问网络策略并不能很好地满足那些需要对 pod 或服务( service )访问进行更为精确控制的场景。今天，这个场景可以是在多层应用中，只允许临近层的访问。然而，随着组合微服务构建原生应用程序潮流的发展，如何控制流量在不同服务之间的流动会别的越发的重要。

<!-- In most IaaS environments (both public and private) this kind of control is provided by allowing VMs to join a ‘security group’ where traffic to members of the group is defined by a network policy or Access Control List (ACL) and enforced by a network packet filter. -->

在大多数的（公共的或私有的） IaaS 环境中，这种网络控制通常是将 VM 和“安全组”结合，其中安全组中成员的通信都是通过一个网络策略或者访问控制表（ Access Control List, ACL ）来定义，以及借助于网络包过滤器来实现。

<!-- The Network SIG started the effort by identifying [specific use case scenarios](https://docs.google.com/document/d/1blfqiH4L_fpn33ZrnQ11v7LcYP0lmpiJ_RaapAPBbNU/edit?pref=2&pli=1#) that require basic network isolation for enhanced security. Getting the API right for these simple and common use cases is important because they are also the basis for the more sophisticated network policies necessary for multi-tenancy within Kubernetes. -->

“网络特别兴趣小组”刚开始的工作是确定 [特定的使用场景](https://docs.google.com/document/d/1blfqiH4L_fpn33ZrnQ11v7LcYP0lmpiJ_RaapAPBbNU/edit?pref=2&pli=1#) ，这些用例需要基本的网络隔离来提升安全性。
让这些API恰如其分地满足简单、共通的用例尤其重要，因为它们将为那些服务于 Kubernetes 内多租户，更为复杂的网络策略奠定基础。

<!-- From these scenarios several possible approaches were considered and a minimal [policy specification](https://docs.google.com/document/d/1qAm-_oSap-f1d6a-xRTj6xaH1sYQBfK36VyjB5XOZug/edit) was defined. The basic idea is that if isolation were enabled on a per namespace basis, then specific pods would be selected where specific traffic types would be allowed. -->

根据这些应用场景，我们考虑了集中不同的方法，然后定义了一个最简[策略规范](https://docs.google.com/document/d/1qAm-_oSap-f1d6a-xRTj6xaH1sYQBfK36VyjB5XOZug/edit)。
基本的想法是，如果是根据命名空间的不同来进行隔离，那么就会根据所被允许的流量类型的不同，来选择特定的 pods 。

<!-- The simplest way to quickly support this experimental API is in the form of a ThirdPartyResource extension to the API Server, which is possible today in Kubernetes 1.2. -->

快速支持这个实验性 API 的办法是往 API 服务器上加入一个 `ThirdPartyResource` 扩展，这在 Kubernetes 1.2 就能办到。

<!-- If you’re not familiar with how this works, the Kubernetes API can be extended by defining ThirdPartyResources that create a new API endpoint at a specified URL. -->

如果你还不是很熟悉这其中的细节， Kubernetes API 是可以通过定义 `ThirdPartyResources` 扩展在特定的 URL 上创建一个新的 API 端点。

#### third-party-res-def.yaml

```
kind: ThirdPartyResource
apiVersion: extensions/v1beta1
metadata:
	- name: network-policy.net.alpha.kubernetes.io
description: "Network policy specification"
versions:
	- name: v1alpha1
```

```
$kubectl create -f third-party-res-def.yaml
```

<!-- This will create an API endpoint (one for each namespace): -->
这条命令会创建一个 API 端点（每个命名空间各一个）:

```
/net.alpha.kubernetes.io/v1alpha1/namespace/default/networkpolicys/
```

<!-- Third party network controllers can now listen on these endpoints and react as necessary when resources are created, modified or deleted. _Note: With the upcoming release of Kubernetes 1.3 - when the Network Policy API is released in beta form - there will be no need to create a ThirdPartyResource API endpoint as shown above._ -->


第三方网络控制器可以监听这些端点，根据资源的创建，修改或者删除作出必要的响应。
_注意：在接下来的 Kubernetes 1.3 发布中， Network Policy API 会以 beta API 的形式出现，这也就不需要像上面那样，创建一个 `ThirdPartyResource` API 端点了。_

<!-- Network isolation is off by default so that all pods can communicate as they normally do. However, it’s important to know that once network isolation is enabled, all traffic to all pods, in all namespaces is blocked, which means that enabling isolation is going to change the behavior of your pods -->

网络隔离默认是关闭的，因而，所有的 pods 之间可以自由地通信。
然而，很重要的一点是，一旦开通了网络隔离，所有命名空间下的所有 pods 之间的通信都会被阻断，换句话说，开通隔离会改变 pods 的行为。

<!-- Network isolation is enabled by defining the _network-isolation_ annotation on namespaces as shown below: -->

网络隔离可以通过定义命名空间， `net.alpha.kubernetes.io` 里的 `network-isolation` 注释来开通关闭:

```
net.alpha.kubernetes.io/network-isolation: [on | off]
```

<!-- Once network isolation is enabled, explicit network policies **must be applied** to enable pod communication. -->

一旦开通了网络隔离，**一定需要使用** 显示的网络策略来允许 pod 间的通信。

<!-- A policy specification can be applied to a namespace to define the details of the policy as shown below: -->

一个策略规范可以被用到一个命名空间中，来定义策略的细节（如下所示）：

```
POST /apis/net.alpha.kubernetes.io/v1alpha1/namespaces/tenant-a/networkpolicys/
{
  "kind": "NetworkPolicy",
  "metadata": {
    "name": "pol1"
  },
  "spec": {
    "allowIncoming": {
      "from": [
        {
          "pods": {
            "segment": "frontend"
          }
        }
      ],
      "toPorts": [
        {
          "port": 80,
          "protocol": "TCP"
        }
      ]
    },
    "podSelector": {
      "segment": "backend"
    }
  }
}
```

<!-- In this example, the ‘ **tenant-a** ’ namespace would get policy ‘ **pol1** ’ applied as indicated. Specifically, pods with the **segment** label ‘ **backend** ’ would allow TCP traffic on port 80 from pods with the **segment** label ‘ **frontend** ’ to be received. -->

在这个例子中，**tenant-a** 空间将会使用 **pol1** 策略。
具体而言，带有 **segment** 标签为 **backend** 的 pods 会允许 **segment** 标签为 **frontend** 的 pods 访问其端口 80 。


<!-- Today, [Romana](http://romana.io/), [OpenShift](https://www.openshift.com/), [OpenContrail](http://www.opencontrail.org/) and [Calico](http://projectcalico.org/) support network policies applied to namespaces and pods. Cisco and VMware are working on implementations as well. Both Romana and Calico demonstrated these capabilities with Kubernetes 1.2 recently at KubeCon. You can watch their presentations here: [Romana](https://www.youtube.com/watch?v=f-dLKtK6qCs) ([slides](http://www.slideshare.net/RomanaProject/kubecon-london-2016-ronana-cloud-native-sdn)), [Calico](https://www.youtube.com/watch?v=p1zfh4N4SX0) ([slides](http://www.slideshare.net/kubecon/kubecon-eu-2016-secure-cloudnative-networking-with-project-calico)).&nbsp; -->


今天，[Romana](http://romana.io/), [OpenShift](https://www.openshift.com/), [OpenContrail](http://www.opencontrail.org/) 以及 [Calico](http://projectcalico.org/) 都已经支持在命名空间和pods中使用网络策略。
而 Cisco 和 VMware 也在努力实现支持之中。
Romana 和 Calico 已经在最近的 KubeCon 中展示了如何在 Kubernetes 1.2 下使用这些功能。
你可以在这里看到他们的演讲：
[Romana](https://www.youtube.com/watch?v=f-dLKtK6qCs) ([幻灯片](http://www.slideshare.net/RomanaProject/kubecon-london-2016-ronana-cloud-native-sdn)),
[Calico](https://www.youtube.com/watch?v=p1zfh4N4SX0) ([幻灯片](http://www.slideshare.net/kubecon/kubecon-eu-2016-secure-cloudnative-networking-with-project-calico)).

<!-- **How does it work?** -->

**这是如何工作的**

<!-- Each solution has their their own specific implementation details. Today, they rely on some kind of on-host enforcement mechanism, but future implementations could also be built that apply policy on a hypervisor, or even directly by the network itself.&nbsp; -->

每套解决方案都有自己不同的具体实现。尽管今天，他们都借助于每种主机上（ on-host ）的实现机制，但未来的实现可以通过将策略使用在 hypervisor 上，亦或是直接使用到网络本身上来达到同样的目的。

<!-- External policy control software (specifics vary across implementations) will watch the new API endpoint for pods being created and/or new policies being applied. When an event occurs that requires policy configuration, the listener will recognize the change and a controller will respond by configuring the interface and applying the policy. &nbsp;The diagram below shows an API listener and policy controller responding to updates by applying a network policy locally via a host agent. The network interface on the pods is configured by a CNI plugin on the host (not shown). -->

外部策略控制软件（不同实现各有不同）可以监听 pods 创建以及新加载策略的 API 端点。
当产生一个需要策略配置的事件之后，监听器会确认这个请求，相应的，控制器会配置接口，使用该策略。
下面的图例展示了 API 监视器和策略控制器是如何通过主机代理在本地应用网络策略的。
这些 pods 的网络接口是使用过主机上的 CNI 插件来进行配置的（并未在图中注明）。

 ![controller.jpg](https://lh5.googleusercontent.com/zMEpLMYmask-B-rYWnbMyGb0M7YusPQFPS6EfpNOSLbkf-cM49V7rTDBpA6k9-Zdh2soMul39rz9rHFJfL-jnEn_mHbpg0E1WlM-wjU-qvQu9KDTQqQ9uBmdaeWynDDNhcT3UjX5)


<!-- If you’ve been holding back on developing applications with Kubernetes because of network isolation and/or security concerns, these new network policies go a long way to providing the control you need. No need to wait until Kubernetes 1.3 since network policy is available now as an experimental API enabled as a ThirdPartyResource. -->

如果你一直受网络隔离或安全考虑的困扰，而犹豫要不要使用 Kubernetes 来开发应用程序，这些新的网络策略将会极大地解决你这方面的需求。并不需要等到 Kubernetes 1.3 ，现在就可以通过 `ThirdPartyResource` 的方式来使用这个实现性 API 。


<!-- If you’re interested in Kubernetes and networking, there are several ways to participate - join us at:

- Our [Networking slack channel](https://kubernetes.slack.com/messages/sig-network/)
- Our [Kubernetes Networking Special Interest Group](https://groups.google.com/forum/#!forum/kubernetes-sig-network) email list -->

如果你对 Kubernetes 和网络感兴趣，可以通过下面的方式参与、加入其中：

- 我们的[网络 slack channel](https://kubernetes.slack.com/messages/sig-network/)
- 我们的[Kubernetes 特别网络兴趣小组](https://groups.google.com/forum/#!forum/kubernetes-sig-network) 邮件列表

<!-- The Networking “Special Interest Group,” which meets bi-weekly at 3pm (15h00) Pacific Time at [SIG-Networking hangout](https://zoom.us/j/5806599998). -->

网络“特别兴趣小组”每两周下午三点（太平洋时间）开会，地址是[SIG-Networking hangout](https://zoom.us/j/5806599998).

_--Chris Marino, Co-Founder, Pani Networks_
