---
title: " Enforcing Network Policies in Kubernetes "
date: 2017-10-30
slug: enforcing-network-policies-in-kubernetes
url: /blog/2017/10/Enforcing-Network-Policies-In-Kubernetes
author: >
   Ahmet Alp Balkan (Google) 
---
_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2017/10/five-days-of-kubernetes-18) on what's new in Kubernetes 1.8._



Kubernetes now offers functionality to enforce rules about which pods can communicate with each other using [network policies](/docs/concepts/services-networking/network-policies/). This feature is has become stable Kubernetes 1.7 and is ready to use with supported networking plugins. The Kubernetes 1.8 release has added better capabilities to this feature.


## Network policy: What does it mean?
In a Kubernetes cluster configured with default settings, all pods can discover and communicate with each other without any restrictions. The new Kubernetes object type NetworkPolicy lets you allow and block traffic to pods.  

If you’re running multiple applications in a Kubernetes cluster or sharing a cluster among multiple teams, it’s a security best practice to create firewalls that permit pods to talk to each other while blocking other network traffic. Networking policy corresponds to the Security Groups concepts in the Virtual Machines world.



## How do I add Network Policy to my cluster?
Networking Policies are implemented by networking plugins. These plugins typically install an overlay network in your cluster to enforce the Network Policies configured. A number of networking plugins, including [Calico](/docs/tasks/configure-pod-container/calico-network-policy/), [Romana](/docs/tasks/configure-pod-container/romana-network-policy/) and [Weave Net](/docs/tasks/configure-pod-container/weave-network-policy/), support using Network Policies.  

Google Container Engine (GKE) also provides beta support for [Network Policies](https://cloud.google.com/container-engine/docs/network-policy) using the Calico networking plugin when you create clusters with the following command:  

gcloud beta container clusters create --enable-network-policy  

##   

## How do I configure a Network Policy?
Once you install a networking plugin that implements Network Policies, you need to create a Kubernetes resource of type NetworkPolicy. This object describes two set of label-based pod selector fields, matching:  

1. a set of pods the network policy applies to (required)
2. a set of pods allowed access to each other (optional). If you omit this field, it matches to no pods; therefore, no pods are allowed. If you specify an empty pod selector, it matches to all pods; therefore, all pods are allowed.

## Example: restricting traffic to a pod
The following example of a network policy blocks all in-cluster traffic to a set of web server pods, except the pods allowed by the policy configuration.   

 ![](https://lh4.googleusercontent.com/e8JzhKYICOzh44sHcedjt4IRRpw2zpFNbJ2UY83fBdWYCIvFVSlHJNmIwLzIHVxrScc2eNCyv37mm903TVT9VkMuHPxe_5Hk8CvJTqGsSK7WtEDCbn1Q25S-o_kHcEiKUUl1NV9g)


To achieve this setup, create a NetworkPolicy with the following manifest:  


```
kind: NetworkPolicy

apiVersion: networking.k8s.io/v1

metadata:

  name: access-nginx

spec:

  podSelector:

    matchLabels:

      app: nginx

  ingress:

  - from:

    - podSelector:

        matchLabels:

          app: foo
 ```


Once you apply this configuration, only pods with label **app: foo** can talk to the pods with the label **app: nginx**. For a more detailed tutorial, see the [Kubernetes documentation](/docs/tasks/administer-cluster/declare-network-policy/).  


## Example: restricting traffic between all pods by default
If you specify the spec.podSelector field as empty, the set of pods the network policy matches to all pods in the namespace, blocking all traffic between pods by default. In this case, you must explicitly create network policies whitelisting all communication between the pods.  

 ![](https://lh6.googleusercontent.com/FYmu74F7fW7DabtzBd6PULsgzKz0WmCli2Sw0SW8zVr0U7m-P6eGvov0mZGv9ngxncGXJmPxzapL3yQXXSBKTHsI8zw5kh-2hqzK6fW7YuqU6X5ofb5ilbis2KUJ2HvF3IHXsMcK)  

You can enable a policy like this by applying the following manifest in your Kubernetes cluster:  


```
apiVersion: networking.k8s.io/v1

kind: NetworkPolicy

metadata:

  name: default-deny

spec:

  podSelector:
 ```



## Other Network Policy features
In addition to the previous examples, you can make the Network Policy API enforce more complicated rules:



- Egress network policies: Introduced in Kubernetes 1.8, you can restrict your workloads from establishing connections to resources outside specified IP ranges.
- IP blocks support: In addition to using podSelector/namespaceSelector, you can specify IP ranges with CIDR blocks to allow/deny traffic in ingress or egress rules.
- Cross-namespace policies: Using the ingress.namespaceSelector field, you can enforce Network Policies for particular or for all namespaces in the cluster. For example, you can create privileged/system namespaces that can communicate with pods even though the default policy is to block traffic.
- Restricting traffic to port numbers: Using the ingress.ports field, you can specify port numbers for the policy to enforce. If you omit this field, the policy matches all ports by default. For example, you can use this to allow a monitoring pod to query only the monitoring port number of an application.
- Multiple ingress rules on a single policy: Because spec.ingress field is an array, you can use the same NetworkPolicy object to give access to different ports using different pod selectors. For example, a NetworkPolicy can have one ingress rule giving pods with the kind: monitoring label access to port 9000, and another ingress rule for the label app: foo giving access to port 80, without creating an additional NetworkPolicy resource.

## Learn more

- Read more: [Networking Policy documentation](/docs/concepts/services-networking/network-policies/)
- Read more: [Unofficial Network Policy Guide](https://ahmet.im/blog/kubernetes-network-policy/)
- Hands-on: [Declare a Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
- Try: [Network Policy Recipes](https://github.com/ahmetb/kubernetes-networkpolicy-tutorial)
