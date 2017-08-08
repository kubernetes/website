---
approvers:
- bboreham
title: Weave Net for NetworkPolicy
---

{% capture overview %}

This page shows how to use Weave Net for NetworkPolicy.

{% endcapture %}

{% capture prerequisites %}

Complete steps 1, 2, and 3 of the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/).

{% endcapture %}

{% capture steps %}

## Installing Weave Net addon

Follow the [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kube-addon/) guide.

The Weave Net Addon for Kubernetes comes with a [Network Policy Controller](https://www.weave.works/docs/net/latest/kube-addon/#npc) that automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.

{% capture example %}
## Namespace Isolation example

Firstly, create a namespace with `DefaultDeny`

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

Secondly, create 2 pods inside this namespace

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

 After finish this 2 steps,use `kubectl get po -n myns -o wide` to get the ip of to pods.And then, get inside the pods to curl each others.It's easy to find that all curl request are forbbiden.
 
Finally, create a networkpolicy allow pods in namespace can connect with each others.

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
After this apply,you can find that pods out sides `myns` namespace can't connect with the pods inside the namespace

{% endcapture %}


{% capture whatsnext %}

Once you have installed the Weave Net Addon you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.

{% endcapture %}

{% include templates/task.md %}
