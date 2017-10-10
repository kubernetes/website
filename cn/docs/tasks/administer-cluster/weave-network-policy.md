---
approvers:
- bboreham
title: 使用 Weave 网络来提供 NetworkPolicy
---

{% capture overview %}


本页展示怎么样使用 Weave 网络来提供 NetworkPolicy

{% endcapture %}

{% capture prerequisites %}


完成 [kubeadm 入门指南](/docs/getting-started-guides/kubeadm/)中的步骤1、2和3

{% endcapture %}

{% capture steps %}


## 安装 Weave 网络插件


按照[通过插件方式集成到 Kubernetes ](https://www.weave.works/docs/net/latest/kube-addon/)指南完成安装


Kubernetes 的 Weave 网络插件配有一个[网络策略控制器](https://www.weave.works/docs/net/latest/kube-addon/#npc)，它监控所有命名空间下 NetworkPolicy 相关的注解，然后配置 iptables 规则生成允许或者阻断通信的策略

{% endcapture %}

{% capture example %}


## 命名空间隔离示例


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


3. 获取 pod 的 IP 地址

```shell
kubectl get po -n myns -o wide
```

**注意：** 如果您对 pod 的 cURL 请求是被禁止的，请尝试在 pod 中访问其它的 pod


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

Weave 网络插件安装完成之后，您可以通过 [NetworkPolicy 入门指南](/docs/getting-started-guides/network-policy/walkthrough)去尝试使用 Kubernetes NetworkPolicy

{% endcapture %}

{% include templates/task.md %}
