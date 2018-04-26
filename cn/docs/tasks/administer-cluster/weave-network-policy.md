---
approvers:
- bboreham
title: 为了 NetworkPolicy 使用 Weave 网络
---

{% capture overview %}

<!--
This page shows how to use Weave Net for NetworkPolicy.
-->
本页展示怎么样为了 NetworkPolicy 使用 Weave 网络

{% endcapture %}

{% capture prerequisites %}

<!--
Complete steps 1, 2, and 3 of the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/).
-->
完成 [kubeadm 入门指南](/docs/getting-started-guides/kubeadm/)中的步骤1、2和3

{% endcapture %}

{% capture steps %}

<!--
## Installing Weave Net addon
-->
## 安装 Weave 网络插件

<!--
Follow the [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kube-addon/) guide.
-->
按照[通过插件方式集成到 Kubernetes 指南](https://www.weave.works/docs/net/latest/kube-addon/)完成安装

<!--
The Weave Net Addon for Kubernetes comes with a [Network Policy Controller](https://www.weave.works/docs/net/latest/kube-addon/#npc) that automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.
-->
Kubernetes 的 Weave 网络插件配有一个[网络策略控制器](https://www.weave.works/docs/net/latest/kube-addon/#npc)，它监控所有命名空间下 NetworkPolicy 相关的注解，然后配置 iptables 规则生成允许或者阻断通信的策略

{% endcapture %}

{% capture example %}

<!--
## Namespace isolation example
-->
## 命名空间隔离示例

<!--
1. Create a namespace with `DefaultDeny`.
-->
1. 创建携带 `DefaultDeny` 标识的命名空间

```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: myns
  annotations:
    net.beta.kubernetes.io/network-policy: |
      {
        "ingress": {
          "isolation": "DefaultDeny"
        }
      }
```

<!--
2. Create 2 pods inside this namespace.
-->
2. 在命名空间下创建2个 pod

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: pod1
  namespace: myns
  labels:
    inns: "yes"
spec:
  containers:
  - name: pod1
    image: nginx
---
kind: Pod
apiVersion: v1
metadata:
  name: pod2
  namespace: myns
  labels:
    inns: "yes"
spec:
  containers:
  - name: pod2
    image: nginx
```

<!--
3. Get the IP addresses of the pods.
-->
3. 获取 pod 的 IP 地址

```shell
kubectl get po -n myns -o wide
```
<!--
**Note:** If your cURL requests to pods are forbidden, try making cURL requests to other pods from within a pod.
{: .note}
-->
**注意：** 如果您对 pod 的 cURL 请求是被禁止的，请尝试在 pod 中访问其它的 pod

<!--
4. Create a Kubernetes NetworkPolicy that allows pods within the same namespace to connect with each other.
-->
4. 创建一个允许 pod 访问命名空间内其它 pod 的 Kubernetes NetworkPolicy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: aaa
  namespace: myns
spec:
  podSelector:
    matchExpressions:
      - {key: inns, operator: In, values: ["yes"]}
  ingress:
    - from:
        - podSelector:
             matchExpressions:
               - {key: inns, operator: In, values: ["yes"]}
```
<!--
**Caution:** After applying the network policy, pods outside the namespace you specify may be unable to connect with pods inside the namespace.
{. :caution}
->
**警告：** 在应用网络策略之后，您指定的命名空间之外的 pod 可能无法与命名空间内的 pod 连接

{% endcapture %}

{% capture whatsnext %}

<!--
Once you have installed the Weave Net Addon you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
-->
Weave 网络插件安装完成之后，您可以通过 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough)去尝试使用 Kubernetes NetworkPolicy

{% endcapture %}

{% include templates/task.md %}
