---
title: " Kubernetes in Rancher: the further evolution "
date: 2016-07-12
slug: kubernetes-in-rancher-further-evolution
url: /blog/2016/07/Kubernetes-In-Rancher-Further-Evolution
author: >
  [Alena Prokharchyk](https://github.com/alena1108) (Rancher Labs)
---

Kubernetes was the first external orchestration platform supported by [Rancher](http://rancher.com/kubernetes), and since its release, it has become one of the most widely used among our users, and continues to grow rapidly in adoption. As Kubernetes has evolved, so has Rancher in terms of adapting new Kubernetes features. We’ve started with supporting Kubernetes version 1.1, then switched to 1.2 as soon as it was released, and now we’re working on supporting the exciting new features in 1.3. I’d like to walk you through the features that we’ve been adding support for during each of these stages.  


### Rancher and Kubernetes 1.2

Kubernetes 1.2 introduced enhanced Ingress object to simplify allowing inbound connections to reach the cluster services: here’s an excellent [blog post about ingress](https://kubernetes.io/blog/2016/03/kubernetes-1-2-and-simplifying-advanced-networking-with-ingress/) policies. Ingress resource allows users to define host name routing rules and TLS config for the Load Balancer in a user friendly way. Then it should be backed up by an Ingress controller that would configure a corresponding cloud provider’s Load Balancer with the Ingress rules. Since Rancher already included a software defined Load Balancer based on HAproxy, we already supported all of the configuration requirements of the Ingress resource, and didn’t have to do any changes on the Rancher side to adopt Ingress. What we had to do was write an Ingress controller that would listen to Kubernetes ingress specific events, configure the Rancher Load Balancer accordingly, and propagate the Load Balancer public entry point back to Kubernetes:



 ![Screen-Shot-2016-05-13-at-11.15.56-AM.png](https://lh3.googleusercontent.com/C8wg_8Vih0evMIAEvCaX3IAbARddxhk5S_Mzv9jdpt87njQR9cbEEGZnFiWrKx7TPm-uPO1V4TP4LDOKvLg7gJ-19-esVMNhbkSf6fXSrbE3nS3Sr45rdP1c-VBuzShgpn9jDCiQ)

Now, the ingress controller gets deployed as a part of our Rancher Kubernetes system stack, and is managed by Rancher. Rancher monitors Ingress controller health, and recreates it in case of any failures. In addition to standard ingress features, Rancher also lets you to horizontally scale the Load Balancer supporting the ingress service by specifying scale via Ingress annotations. For example:  


```
apiVersion: extensions/v1beta1

kind: Ingress

metadata:

 name: scalelb

 annotations:

 scale: "2"

spec:

  rules:

  - host: foo.bar.com

    http:

      paths:

      - path: /foo

        backend:

          serviceName: nginx-service

          servicePort: 80
 ```



As a result of the above, 2 instances of Rancher Load Balancer will get started on separate hosts, and Ingress will get updated with 2 public ip addresses:  





```
kubectl get ingress

NAME      RULE          BACKEND   ADDRESS

scalelb      -                    104.154.107.202, 104.154.107.203  // hosts ip addresses where Rancher LB instances are deployed

          foo.bar.com

          /foo           nginx-service:80
 ```




More details on Rancher Ingress Controller implementation for Kubernetes can be found here:

- [Blog post](http://rancher.com/rancher-controller-for-the-kubernetes-ingress-feature/)
- [Rancher documentation on Ingress](http://docs.rancher.com/rancher/latest/en/kubernetes/ingress/)
- [Rancher ingress controller repo](https://github.com/rancher/ingress-controller)

### Rancher and Kubernetes 1.3


We’ve very excited about Kubernetes 1.3 release, and all the new features that are included with it. There are two that we are especially interested in: Stateful Apps and Cluster Federation.  


#### Kubernetes Stateful Apps

Stateful Apps is a new resource to Kubernetes to represent a set of pods in stateful application. This is an alternative to the using Replication Controllers, which are best leveraged for running stateless apps. This feature is specifically useful for apps that rely on quorum with leader election (such as MongoDB, Zookeeper, etcd) and decentralized quorum (Cassandra). Stateful Apps create and maintains a set of pods, each of which have a stable network identity. In order to provide the network identity, it must be possible to have a resolvable DNS name for the pod that is tied to the pod identity as per [Kubernetes design doc](https://github.com/smarterclayton/kubernetes/blob/961f1f94c35d4979ac83bbad482090cb6c22781c/docs/proposals/petset.md):





```
# service mongo pointing to pods created by PetSet mdb, with identities mdb-1, mdb-2, mdb-3


dig mongodb.namespace.svc.cluster.local +short A

172.130.16.50


dig mdb-1.mongodb.namespace.svc.cluster.local +short A

# IP of pod created for mdb-1


dig mdb-2.mongodb.namespace.svc.cluster.local +short A

# IP of pod created for mdb-2


dig mdb-3.mongodb.namespace.svc.cluster.local +short A

# IP of pod created for mdb-3
 ```



The above is implemented via an annotation on pods, which is surfaced to endpoints, and finally surfaced as DNS on the service that exposes those pods. Currently Rancher simplifies DNS configuration by leveraging Rancher DNS as a drop-in replacement for SkyDNS. Rancher DNS is fast, stable, and scalable - every host in cluster gets DNS server running. Kubernetes services get programmed to Rancher DNS, and being resolved to either service’s cluster IP from 10,43.x.x address space, or to set of Pod ip addresses for headless service. To make PetSet work with Kubernetes via Rancher, we’ll have to add support for Pod Identities to Rancher DNS configuration. We’re working on this now and should have it supported in one of the upcoming Rancher releases.  


#### Cluster Federation
Cluster Federation is a control plane of cluster federation in Kubernetes. It offers improved application availability by spreading applications across multiple clusters (the image below is a courtesy of Kubernetes):  



 ![Screen Shot 2016-07-07 at 1.46.55 PM.png](https://lh6.googleusercontent.com/jJjQ6wbYYG1y7rS7SXFNj1dsLrTEBbiOB9TfrkJAqayHVzBZwLguxMB6HLObCgpVGLKF7xdPd3wfdvQzB2a7Cq6cuqqXRRl3L5OfVPwKB34BxdpRUc1g7EgOdEkILH9E4sAfzHyb)

Each Kubernetes cluster exposes an API endpoint and gets registered to Cluster Federation as a part of Federation object. Then using Cluster Federation API, you can create federated services.  Those objects are comprised of multiple equivalent underlying Kubernetes resources. Assuming that the 3 clusters on the picture above belong to the same Federation object, each Service created via Cluster Federation, will get equivalent service created in each of the clusters. Besides that, a Cluster Federation service will get publicly resolvable DNS name resolvable to Kubernetes service’s public ip addresses (DNS record gets programmed to a one of the public DNS providers below):



 ![Screen Shot 2016-07-07 at 1.24.18 PM.png](https://lh6.googleusercontent.com/gmL0eoE2Z_m-KQbidAxrHA_gL8EDoflYuu_DKSxRiSm2RqTde-nYwGD65YBWzZWkCnbEG6NJ_NHCo0oHTP-PxNqWXt7k5Vp76JBOTNawsmlTeehOrPVY6nTZnEMl2ZH0V73_7f9E)





To support Cluster Federation via Kubernetes in Rancher, certain changes need to be done. Today each Kubernetes cluster is represented as a Rancher environment. In each Kubernetes environment, we create a full Kubernetes system stack comprised of several services: Kubernetes API server, Scheduler, Ingress controller, persistent etcd, Controller manager, Kubelet and Proxy (2 last ones run on every host). To setup Cluster Federation, we will create one extra environment where Cluster Federation stack is going to run:




 ![Screen Shot 2016-07-07 at 1.23.14 PM.png](https://lh6.googleusercontent.com/_76MDeSl_ac2AqN2lvEKgmvrFuV9Mtt9qHngsKKBAy-rcpdMcyo_UyNYdK2z5POoZwBGptVXUoX-11UDHD4axY8Lco15KydIwVd_PlLC0xJ2GZ_-4JN7bkP4pj8SY7mQ4JUXGIL6)




Then every underlying Kubernetes cluster represented by Rancher environment, should be registered to a specific Cluster Federation. Potentially each cluster can be auto-discovered by Rancher Cluster Federation environment via label representing federation name on Kubernetes cluster. We’re still working through finalizing our design, but we’re very excited by this feature, and see a lot of use cases it can solve. Cluster Federation doc references:  


- Kubernetes [cluster federation design doc](https://github.com/kubernetes/kubernetes/blob/master/docs/design/federation-phase-1.md)
- Kubernetes [blog post on multi zone clusters](https://kubernetes.io/blog/2016/03/building-highly-available-applications-using-kubernetes-new-multi-zone-clusters-aka-ubernetes-lite/)
- Kubernetes [federated services design doc](https://github.com/kubernetes/kubernetes/blob/master/docs/design/federated-services.md)


### Plans for Kubernetes 1.4


When we launched Kubernetes support in Rancher we decided to maintain our own distribution of Kubernetes in order to support Rancher’s native networking. We were aware that by having our own distribution, we’d need to update it every time there were changes made to Kubernetes, but we felt it was necessary to support the use cases we were working on for users. As part of our work for 1.4 we looked at our networking approach again, and re-analyzed the initial need for our own fork of Kubernetes. Other than the networking integration, all of the work we’ve done with Kubernetes has been developed as a Kubernetes plugin:

- Rancher as a CloudProvider (to support Load Balancers).
- Rancher as a CredentialProvider (to support Rancher private registries).
- Rancher Ingress controller to back up Kubernetes ingress resource.

So we’ve decided to eliminate the need of Rancher Kubernetes distribution, and try to upstream all our changes to the Kubernetes repo. To do that, we will be reworking our networking integration, and support Rancher networking as a [CNI plugin for Kubernetes](/docs/admin/network-plugins/#cni). More details on that will be shared as soon as the feature design is finalized, but expect it to come in the next 2-3 months. We will also continue investing in Rancher’s core capabilities integrated with Kubernetes, including, but not limited to:

- Access rights management via Rancher environment that represents Kubernetes cluster
- Credential management and easy web-based access to standard kubectl cli
- Load Balancing support
- Rancher internal DNS support
- Catalog support for Kubernetes templates
- Enhanced UI to represent even more Kubernetes objects like: Deployment, Ingress, Daemonset.

All of that is to make Kubernetes experience even more powerful and user intuitive. We’re so excited by all of the progress in the Kubernetes community, and thrilled to be participating. Kubernetes 1.3 is an incredibly significant release, and you’ll be able to upgrade to it very soon within Rancher.


 ![Rancher-and-Kubernetes.png](https://lh4.googleusercontent.com/isAt46fnmGerA0uPoTUlUS7y5MtmOYfMvKoTC52CK0ckUfFKVO_coY78jgLoQuxe4J3GVf3N2_IWCuKwxpRT6q_h4ek4yepfyWBmN_WSqyB2v7rRaZrpG4hPpuH0hIbIcmTDgUul)
