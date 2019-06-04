---
reviewers:
- zparnold
title: Overview of Cloud Native Security
content_template: templates/concept
weight: 1
---

{{< toc >}}

{{% capture overview %}}
Kubernetes Security (and security in general) is an immense topic that has many
highly interrelated parts. In today's era where open source software is
integrated into many of the systems that help web applications run,
there are some overarching concepts that can help guide your intuition about how you can
think about security holistically. This guide will define a mental model for
for some general concepts surrounding Cloud Native Security. The mental model is completely arbitrary
and you should only use it if it helps you think about where to secure your software
stack.
{{% /capture %}}

{{% capture body %}}

## The 4C's of Cloud Native Security
Let's start with a diagram that may help you understand how you can think about security in layers.
{{< note >}}
This layered approach augments the [defense in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))
approach to security, which is widely regarded as a best practice for securing
software systems. The 4C's are Cloud, Clusters, Containers, and Code.
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="The 4C's of Cloud Native Security" >}}


As you can see from the above figure,
each one of the 4C's depend on the security of the squares in which they fit. It
is nearly impossibly to safeguard against poor security standards in Cloud, Containers, and Code
by only addressing security at the code level. However, when these areas are dealt
with appropriately, then adding security to your code augments an already strong
base. These areas of concern will now be described in more detail below.

## Cloud

In many ways, the Cloud (or co-located servers, or the corporate datacenter) is the
[trusted computing base](https://en.wikipedia.org/wiki/Trusted_computing_base)
of a Kubernetes cluster. If these components themselves are vulnerable (or
configured in a vulnerable way) then there's no real way to guarantee the security
of any components built on top of this base. Each cloud provider has extensive
security recommendations they make to their customers on how to run workloads securely
in their environment. It is out of the scope of this guide to give recommendations
on cloud security since every cloud provider and workload is different. Here are some
links to some of the popular cloud providers' documentation
for security as well as give general guidance for securing the infrastructure that
makes up a Kubernetes cluster.

### Cloud Provider Security Table



IaaS Provider        | Link |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |


If you are running on your own hardware or a different cloud provider you will need to
consult your documentation for security best practices.

### General Infrastructure Guidance Table

Area of Concern for Kubernetes Infrastructure | Recommendation |
--------------------------------------------- | ------------ |
Network access to API Server (Masters) | Ideally all access to the Kubernetes Masters is not allowed publicly on the internet and is controlled by network access control lists restricted to the set of IP addresses needed to administer the cluster.|
Network access to Nodes (Worker Servers) | Nodes should be configured to _only_ accept connections (via network access control lists) from the masters on the specified ports, and accept connections for services in Kubernetes of type NodePort and LoadBalancer. If possible, this nodes should not exposed on the public internet entirely.
Kubernetes access to Cloud Provider API | Each cloud provider will need to grant a different set of permissions to the Kubernetes Masters and Nodes, so this recommendation will be more generic. It is best to provide the cluster with cloud provider access that follows the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) for the resources it needs to administer. An example for Kops in AWS can be found here: https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles
Access to etcd | Access to etcd (the datastore of Kubernetes) should be limited to the masters only. Depending on your configuration you should also attempt to use etcd over TLS. More info can be found here: https://github.com/etcd-io/etcd/tree/master/Documentation#security
etcd Encryption | Wherever possible it's a good practice to encrypt all drives at rest, but since etcd holds the state of the entire cluster (including Secrets) its disk should especially be encrypted at rest.

## Cluster

This section will provide links for securing
workloads in Kubernetes. There are two areas of concern for securing
Kubernetes:

* Securing the components that are configurable which make up the cluster
* Securing the components which run in the cluster


### Components _of_ the Cluster

If you want to protect your cluster from accidental or malicious access, and adopt
good information practices, read and follow the advice about
[securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/).

### Components _in_ the Cluster (your application)
Depending on the attack surface of your application, you may want to focus on specific
aspects of security. For example, if you are running a service (Service A) that is critical
in a chain of other resources and a separate workload (Service B) which is
vulnerable to a resource exhaustion attack, by not putting resource limits on
Service B you run the risk of also compromising Service A. Below is a table of
links of things to consider when securing workloads running in Kubernetes.

Area of Concern for Workload Security | Recommendation |
------------------------------ | ------------ |
RBAC Authorization (Access to the Kubernetes API) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/
Authentication | https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/
Application secrets management (and encrypting them in etcd at rest) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
Pod Security Policies | https://kubernetes.io/docs/concepts/policy/pod-security-policy/
Quality of Service (and Cluster resource management) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/
Network Policies | https://kubernetes.io/docs/concepts/services-networking/network-policies/
TLS For Kubernetes Ingress | https://kubernetes.io/docs/concepts/services-networking/ingress/#tls



## Container

In order to run software in Kubernetes, it must be in a container. Because of this,
there are certain security considerations that must be taken into account in order
to benefit from the workload security primitives of Kubernetes. Container security
is also outside the scope of this guide, but here is a table of general
recommendations and links for further exploration of this topic.

Area of Concern for Containers | Recommendation |
------------------------------ | ------------ |
Container Vulnerability Scanning and OS Dependency Security | As part of an image build step or on a regular basis you should scan your containers for known vulnerabilities with a tool such as [CoreOS's Clair](https://github.com/coreos/clair/)
Image Signing and Enforcement | Two other CNCF Projects (TUF and Notary) are useful tools for signing container images and maintaining a system of trust for the content of your containers. If you use Docker, it is built in to the Docker Engine as [Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/). On the enforcement piece, [IBM's Portieris](https://github.com/IBM/portieris) project is a tool that runs as a Kubernetes Dynamic Admission Controller to ensure that images are properly signed via Notary before being admitted to the Cluster.
Disallow privileged users | When constructing containers, consult your documentation for how to create users inside of the containers that have the least level of operating system privilege necessary in order to carry out the goal of the container.

## Code

Finally moving down into the application code level, this is one of the primary attack
surfaces over which you have the most control. This is also outside of the scope
of Kubernetes but here are a few recommendations:

### General Code Security Guidance Table

Area of Concern for Code | Recommendation |
--------------------------------------------- | ------------ |
Access over TLS only | If your code needs to communicate via TCP, ideally it would be performing a TLS handshake with the client ahead of time. With the exception of a few cases, the default behavior should be to encrypt everything in transit. Going one step further, even "behind the firewall" in our VPC's it's still a good idea to encrypt network traffic between services. This can be done through a process known as mutual or [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) which performs a two sided verification of communication between two certificate holding services. There are numerous tools that can be used to accomplish this in Kubernetes such as [Linkerd](https://linkerd.io/) and [Istio](https://istio.io/). |
Limiting port ranges of communication | This recommendation may be a bit self-explanatory, but wherever possible you should only expose the ports on your service that are absolutely essential for communication or metric gathering. |
3rd Party Dependency Security | Since our applications tend to have dependencies outside of our own codebases, it is a good practice to ensure that a regular scan of the code's dependencies are still secure with no CVE's currently filed against them. Each language has a tool for performing this check automatically. |
Static Code Analysis | Most languages provide a way for a snippet of code to be analyzed for any potentially unsafe coding practices. Whenever possible you should perform checks using automated tooling that can scan codebases for common security errors. Some of the tools can be found here: https://www.owasp.org/index.php/Source_Code_Analysis_Tools |
Dynamic probing attacks | There are a few automated tools that are able to be run against your service to try some of the well known attacks that commonly befall services. These include SQL injection, CSRF, and XSS. One of the most popular dynamic analysis tools is the OWASP Zed Attack proxy https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project |


## Robust automation

Most of the above mentioned suggestions can actually be automated in your code
delivery pipeline as part of a series of checks in security. To learn about a
more "Continuous Hacking" approach to software delivery, [this article](https://thenewstack.io/beyond-ci-cd-how-continuous-hacking-of-docker-containers-and-pipeline-driven-security-keeps-ygrene-secure/) provides more detail.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [network policies for Pods](/docs/concepts/services-networking/network-policies/)
* Read about [securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* Read about [API access control](/docs/reference/access-authn-authz/controlling-access/)
* Read about [data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* Read about [data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* Read about [Secrets in Kubernetes](/docs/concepts/configuration/secret/)
{{% /capture %}}
