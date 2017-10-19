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

## Install the Weave Net addon

Follow the [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kube-addon/) guide.

The Weave Net addon for Kubernetes comes with a [Network Policy Controller](https://www.weave.works/docs/net/latest/kube-addon/#npc) that automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.

## Namespace isolation example

1. Create a Namespace with `DefaultDeny`.

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

2. Create 2 Pods inside this Namespace.

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

3. Get the IP addresses of the Pods.

```shell
kubectl get po -n myns -o wide
```
**Note:** If your cURL requests to Pods are forbidden, try making cURL requests to other Pods from within a Pod.
{: .note}

4. Create a Kubernetes NetworkPolicy that allows Pods within the same Namespace to connect with each other.

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
**Caution:** After applying the network policy, pods outside the namespace you specify may be unable to connect with pods inside the namespace.
{. :caution}

## Test the installation

1. Verify that the weave works.

Enter the following command:

```shell
kubectl get po -n kube-system -o wide
```

The output is similar to this:

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    workndoe3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

Each Node has a weave Pod, and all Pods are `Running` and `2/2 READY`. (`2/2` means that each Pod has `weave` and `weave-npc`.)

2. Create a Network Policy. 

For more information, see "[Declare Network Policy](https://kubernetes.io/docs/tasks/administer-cluster/declare-network-policy/)".

3. Check the logs.

After creating a NetworkPolicy, check the logs:

```shell
kubectl logs -f  weave-net-pmw8w weave-npc  -n kube-system
```

Log output looks like this:

```log
INFO: 2017/08/14 02:22:32.511992 EVENT AddNetworkPolicy {"metadata":{"name":"aaa","namespace":"myns","selfLink":"/apis/extensions/v1beta1/namespaces/myns/networkpolicies/aaa","uid":"67b229fd-8097-11e7-92f3-005056a3bc75","resourceVersion":"1507955","generation":1,"creationTimestamp":"2017-08-14T02:22:22Z"},"spec":{"podSelector":{"matchExpressions":[{"key":"inns","operator":"In","values":["yes"]}]},"ingress":[{"from":[{"podSelector":{"matchExpressions":[{"key":"inns","operator":"In","values":["yes"]}]}}]}]}}
INFO: 2017/08/14 02:22:32.512103 creating ipset: &npc.selectorSpec{key:"inns in (yes)", selector:labels.internalSelector{labels.Requirement{key:"inns", operator:"in", strValues:[]string{"yes"}}}, ipsetType:"hash:ip", ipsetName:"weave-[T]a=ETzaKA{o*muaFe:2IX(t"}
INFO: 2017/08/14 02:22:32.538003 adding rule: [-m set --match-set weave-[T]a=ETzaKA{o*muaFe:2IX(t src -m set --match-set weave-[T]a=ETzaKA{o*muaFe:2IX(t dst -j ACCEPT]
^[^C
```

4. Finally, check the logs for iptables.

```shell
iptables -L
```

The output is similar to this:

```iptables
Chain WEAVE-NPC (1 references)
target     prot opt source               destination         
ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
ACCEPT     all  --  anywhere             base-address.mcast.net/4 
WEAVE-NPC-DEFAULT  all  --  anywhere             anywhere             state NEW
WEAVE-NPC-INGRESS  all  --  anywhere             anywhere             state NEW
ACCEPT     all  --  anywhere             anywhere             ! match-set weave-local-pods dst

Chain WEAVE-NPC-DEFAULT (1 references)
target     prot opt source               destination         
ACCEPT     all  --  anywhere             anywhere             match-set weave-iuZcey(5DeXbzgRFs8Szo]+@p dst
ACCEPT     all  --  anywhere             anywhere             match-set weave-k?Z;25^M}|1s7P3|H9i;*;MhG dst
ACCEPT     all  --  anywhere             anywhere             match-set weave-4vtqMI+kx/2]jD%_c0S%thO%V dst

Chain WEAVE-NPC-INGRESS (1 references)
target     prot opt source               destination         
ACCEPT     all  --  anywhere             anywhere             match-set weave-[T]a=ETzaKA{o*muaFe:2IX(t src match-set weave-[T]a=ETzaKA{o*muaFe:2IX(t dst
```

The match-set labels have been applied to iptables, so the weave is working correctly.

{% endcapture %}

{% capture whatsnext %}

Once you have installed the Weave Net addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.

{% endcapture %}

{% include templates/task.md %}
