---
title: “SIG-Networking：1.3 版本引入 Kubernetes 網路策略 API”
date: 2016-04-18
slug: kubernetes-network-policy-apis
---
<!--
title: " SIG-Networking: Kubernetes Network Policy APIs Coming in 1.3 "
date: 2016-04-18
slug: kubernetes-network-policy-apis
url: /blog/2016/04/Kubernetes-Network-Policy-APIs
-->

<!--
_Editor’s note: This week we’re featuring [Kubernetes Special Interest Groups](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)); Today’s post is by the Network-SIG team describing network policy APIs coming in 1.3 - policies for security, isolation and multi-tenancy._  
-->
_編者注：本週我們將推出 [Kubernetes 特殊興趣小組](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs))、
Network-SIG 小組今天的帖子描述了 1.3 版中的網路策略 API-安全，隔離和多租戶策略。_


<!--
The [Kubernetes network SIG](https://kubernetes.slack.com/messages/sig-network/) has been meeting regularly since late last year to work on bringing network policy to Kubernetes and we’re starting to see the results of this effort.  
-->
自去年下半年以來，[Kubernetes SIG-Networking](https://kubernetes.slack.com/messages/sig-network/) 一直在定期開會，致力於將網路策略引入 Kubernetes，我們開始看到這個努力的結果。

<!--
One problem many users have is that the open access network policy of Kubernetes is not suitable for applications that need more precise control over the traffic that accesses a pod or service. Today, this could be a multi-tier application where traffic is only allowed from a tier’s neighbor. But as new Cloud Native applications are built by composing microservices, the ability to control traffic as it flows among these services becomes even more critical.  
-->
許多使用者面臨的一個問題是，Kubernetes 的開放訪問網路策略不適用於需要對訪問容器或服務的流量進行更精確控制的應用程序。
如今，這種應用可能是多層應用，其中僅允許來自某個相鄰層的流量。
但是，隨着新的雲原生應用不斷通過組合微服務構建出來，對服務間流動的數據進行控制的能力變得更加重要。

<!--
In most IaaS environments (both public and private) this kind of control is provided by allowing VMs to join a ‘security group’ where traffic to members of the group is defined by a network policy or Access Control List (ACL) and enforced by a network packet filter.  
-->
在大多數 IaaS 環境（公共和私有）中，通過允許 VM 加入“安全組（Security Group）”來提供這種控制，
其中“安全組”成員的流量由網路策略或訪問控制列表（ ACL ）定義，並由網路數據包過濾器實施。

<!--
The Network SIG started the effort by identifying [specific use case scenarios](https://docs.google.com/document/d/1blfqiH4L_fpn33ZrnQ11v7LcYP0lmpiJ_RaapAPBbNU/edit?pref=2&pli=1#) that require basic network isolation for enhanced security. Getting the API right for these simple and common use cases is important because they are also the basis for the more sophisticated network policies necessary for multi-tenancy within Kubernetes.
-->
SIG-Networking 開始這項工作時的第一步是辯識需要特定網路隔離以增強安全性的
[特定用例場景](https://docs.google.com/document/d/1blfqiH4L_fpn33ZrnQ11v7LcYP0lmpiJ_RaapAPBbNU/edit?pref=2&pli=1#)。
確保所定義的 API 適用於這些簡單和常見的用例非常重要，因爲它們爲在 Kubernetes 內
實現更復雜的網路策略以支持多租戶奠定了基礎。

<!--
From these scenarios several possible approaches were considered and a minimal [policy specification](https://docs.google.com/document/d/1qAm-_oSap-f1d6a-xRTj6xaH1sYQBfK36VyjB5XOZug/edit) was defined. The basic idea is that if isolation were enabled on a per namespace basis, then specific pods would be selected where specific traffic types would be allowed.  
-->
基於這些場景，團隊考慮了幾種可能的方法，並定義了一個最小的
[策略規範](https://docs.google.com/document/d/1qAm-_oSap-f1d6a-xRTj6xaH1sYQBfK36VyjB5XOZug/edit) 。
基本思想是，如果按命名空間啓用了隔離，則特定流量類型被允許時會選擇特定的 Pod。

<!--
The simplest way to quickly support this experimental API is in the form of a ThirdPartyResource extension to the API Server, which is possible today in Kubernetes 1.2. 
-->
快速支持此實驗性 API 的最簡單方法是對 API 伺服器的 ThirdPartyResource 擴展，今天在 Kubernetes 1.2 中就可以實現。

<!--
If you’re not familiar with how this works, the Kubernetes API can be extended by defining ThirdPartyResources that create a new API endpoint at a specified URL.  
-->
如果您不熟悉它的工作方式，則可以通過定義 ThirdPartyResources 來擴展 Kubernetes API ，ThirdPartyResources 在指定的 URL 上創建一個新的 API 端點。

#### third-party-res-def.yaml 

```
kind: ThirdPartyResource
apiVersion: extensions/v1beta1
metadata:
name: network-policy.net.alpha.kubernetes.io
description: "Network policy specification"
versions:
- name: v1alpha1
 ```

```
$kubectl create -f third-party-res-def.yaml
 ```

<!--
This will create an API endpoint (one for each namespace):
-->
這將創建一個 API 端點（每個名稱空間一個）：

```
/net.alpha.kubernetes.io/v1alpha1/namespace/default/networkpolicys/
 ```
 
<!--
Third party network controllers can now listen on these endpoints and react as necessary when resources are created, modified or deleted. _Note: With the upcoming release of Kubernetes 1.3 - when the Network Policy API is released in beta form - there will be no need to create a ThirdPartyResource API endpoint as shown above._&nbsp;
-->
第三方網路控制器現在可以在這些端點上進行偵聽，並在創建，修改或刪除資源時根據需要做出反應。
_注意：在即將發佈的 Kubernetes 1.3 版本中-當網路政策 API 以 beta 形式發佈時-無需創建如上所示的 ThirdPartyResource API 端點。_


<!--
Network isolation is off by default so that all pods can communicate as they normally do. However, it’s important to know that once network isolation is enabled, all traffic to all pods, in all namespaces is blocked, which means that enabling isolation is going to change the behavior of your pods
-->
默認情況下，網路隔離處於關閉狀態，以便所有Pod都能正常通信。
但是，重要的是要知道，啓用網路隔離後，所有命名空間中所有容器的所有流量都會被阻止，這意味着啓用隔離將改變容器的行爲


<!--
Network isolation is enabled by defining the _network-isolation_ annotation on namespaces as shown below:
-->
通過在名稱空間上定義 _network-isolation_ 註解來啓用網路隔離，如下所示：

```
net.alpha.kubernetes.io/network-isolation: [on | off]
 ```
 
<!--
Once network isolation is enabled, explicit network policies **must be applied** to enable pod communication.
-->
啓用網路隔離後，**必須應用**顯式網路策略才能啓用 Pod 通信。

<!--
A policy specification can be applied to a namespace to define the details of the policy as shown below:
-->
可以將策略規範應用於命名空間，以定義策略的詳細信息，如下所示：

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
{ "pods": { "segment": "frontend" } }
],
"toPorts": [
{ "port": 80, "protocol": "TCP" }
]
},
"podSelector": { "segment": "backend" }
}
}
 ```
 
<!--
In this example, the ‘ **tenant-a** ’ namespace would get policy ‘ **pol1** ’ applied as indicated. Specifically, pods with the **segment** label ‘ **backend** ’ would allow TCP traffic on port 80 from pods with the **segment** label ‘ **frontend** ’ to be received.
-->
在此示例中，‘ **tenant-a** ’名稱空間將按照指示應用策略‘ **pol1** ’。
具體而言，帶有**segment**標籤 ‘ **後端** ’ 的容器將允許接收來自帶有“segment**標籤‘ **frontend** ’的容器的端口80上的TCP流量。

<!--
Today, [Romana](http://romana.io/), [OpenShift](https://www.openshift.com/), [OpenContrail](http://www.opencontrail.org/) and [Calico](http://projectcalico.org/) support network policies applied to namespaces and pods. Cisco and VMware are working on implementations as well. Both Romana and Calico demonstrated these capabilities with Kubernetes 1.2 recently at KubeCon. You can watch their presentations here: [Romana](https://www.youtube.com/watch?v=f-dLKtK6qCs) ([slides](http://www.slideshare.net/RomanaProject/kubecon-london-2016-ronana-cloud-native-sdn)), [Calico](https://www.youtube.com/watch?v=p1zfh4N4SX0) ([slides](http://www.slideshare.net/kubecon/kubecon-eu-2016-secure-cloudnative-networking-with-project-calico)).&nbsp;
-->
現今，[Romana](http://romana.io/), [OpenShift](https://www.openshift.com/), [OpenContrail](http://www.opencontrail.org/) 和 [Calico](http://projectcalico.org/) 支持應用於名稱空間和容器的網路策略。
思科和 VMware 也在努力實施。
Romana 和 Calico 最近都在 KubeCon 上使用 Kubernetes 1.2 演示了這些功能。
你可以在此處觀看他們的演講：[Romana](https://www.youtube.com/watch?v=f-dLKtK6qCs) ([slides](http://www.slideshare.net/RomanaProject/kubecon-london-2016-ronana-cloud-native-sdn))， [Calico](https://www.youtube.com/watch?v=p1zfh4N4SX0) ([slides](http://www.slideshare.net/kubecon/kubecon-eu-2016-secure-cloudnative-networking-with-project-calico))。&nbsp;

<!--
**How does it work?**
-->
**它是如何工作的？**

<!--
Each solution has their their own specific implementation details. Today, they rely on some kind of on-host enforcement mechanism, but future implementations could also be built that apply policy on a hypervisor, or even directly by the network itself.&nbsp;
-->
每個解決方案都有其自己的特定實現細節。
今天，他們依靠某種形式的主機執行機制，但是將來的實現也可以構建爲在虛擬機管理程序上，甚至直接由網路本身應用策略構建。&nbsp;

<!--
External policy control software (specifics vary across implementations) will watch the new API endpoint for pods being created and/or new policies being applied. When an event occurs that requires policy configuration, the listener will recognize the change and a controller will respond by configuring the interface and applying the policy. &nbsp;The diagram below shows an API listener and policy controller responding to updates by applying a network policy locally via a host agent. The network interface on the pods is configured by a CNI plugin on the host (not shown).
-->
外部策略控制軟件（具體情況因實現而異）將監視新 API 終結點是否正在創建容器和/或正在應用新策略。
當發生需要設定策略的事件時，偵聽器將識別出更改，並且控制器將通過設定接口並應用策略來做出響應。&nbsp;
下圖顯示了 API 偵聽器和策略控制器，它通過主機代理在本地應用網路策略來響應更新。
主機上的網路接口由主機上的 CNI 插件設定（未顯示）。

 ![controller.jpg](https://lh5.googleusercontent.com/zMEpLMYmask-B-rYWnbMyGb0M7YusPQFPS6EfpNOSLbkf-cM49V7rTDBpA6k9-Zdh2soMul39rz9rHFJfL-jnEn_mHbpg0E1WlM-wjU-qvQu9KDTQqQ9uBmdaeWynDDNhcT3UjX5)

<!--
If you’ve been holding back on developing applications with Kubernetes because of network isolation and/or security concerns, these new network policies go a long way to providing the control you need. No need to wait until Kubernetes 1.3 since network policy is available now as an experimental API enabled as a ThirdPartyResource.
-->
如果您由於網路隔離和/或安全性問題而一直拒絕使用 Kubernetes 開發應用程序，那麼這些新的網路策略將爲您提供所需的控制功能大有幫助。
無需等到 Kubernetes 1.3，因爲網路策略現在作爲實驗性 API 可用，已啓用 ThirdPartyResource。

<!--
If you’re interested in Kubernetes and networking, there are several ways to participate - join us at:
-->
如果您對 Kubernetes 和網路感興趣，有幾種參與方式-請通過以下方式加入我們：

<!--
- Our [Networking slack channel](https://kubernetes.slack.com/messages/sig-network/)&nbsp;
-->
- 我們的 [Networking Slack 頻道](https://kubernetes.slack.com/messages/sig-network/)&nbsp;
<!--
- Our [Kubernetes 網路特別興趣小組](https://groups.google.com/forum/#!forum/kubernetes-sig-network) email list&nbsp;
-->
- 我們的 [Kubernetes Networking Special Interest Group](https://groups.google.com/forum/#!forum/kubernetes-sig-network) 電子郵件列表&nbsp;


<!--
The Networking “Special Interest Group,” which meets bi-weekly at 3pm (15h00) Pacific Time at [SIG-Networking hangout](https://zoom.us/j/5806599998).&nbsp;
-->
網路“特殊興趣小組”，每兩週一次，在太平洋時間下午 3 點（15：00）在[SIG-Networking 環聊](https://zoom.us/j/5806599998)開會。&nbsp;


<!--
_--Chris Marino, Co-Founder, Pani Networks_  
-->
_--Pani Networks 聯合創始人 Chris Marino_  
