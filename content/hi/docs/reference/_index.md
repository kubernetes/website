---
title: संदर्भ
approvers:
- chenopis
linkTitle: "संदर्भ"
main_menu: true
weight: 70
content_type: concept
no_list: true
---


<!-- overview -->

कुबेरनेट्स प्रलेखन के इस खंड में संदर्भ हैं।



<!-- body -->

## API संदर्भ

* [शब्दकोष](/docs/reference/glossary/) - कुबेरनेट्स शब्दावली की एक व्यापक, मानकीकृत सूची।
* [कुबेरनेट्स API संदर्भ](/docs/reference/kubernetes-api/)
* [कुबेरनेट्स के लिए एक-पृष्ठ API संदर्भ {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
* [कुबेरनेट्स API का उपयोग करना](/docs/reference/using-api/) - कुबेरनेट्स के लिए API का अवलोकन।
* [API अभिगम नियंत्रण](/docs/reference/access-authn-authz/) - कुबेरनेट्स API एक्सेस को कैसे नियंत्रित करता है, इस पर विवरण।
* [जाने-माने लेबल, टिप्पणी और दाग](/docs/reference/labels-annotations-taints/)

## आधिकारिक तौर पर समर्थित ग्राहक पुस्तकालय

कुबेरनेट्स API को प्रोग्रामिंग भाषा से कॉल करने के लिए, आप उपयोग कर सकते हैं
[client libraries](/docs/reference/using-api/client-libraries/). आधिकारिक तौर पर समर्थित
client libraries:

- [कुबेरनेट्स Go client library](https://github.com/kubernetes/client-go/)
- [कुबेरनेट्स Python client library](https://github.com/kubernetes-client/python)
- [कुबेरनेट्स Java client library](https://github.com/kubernetes-client/java)
- [कुबेरनेट्स JavaScript client library](https://github.com/kubernetes-client/javascript)
- [कुबेरनेट्स C# client library](https://github.com/kubernetes-client/csharp)
- [कुबेरनेट्स Haskell client library](https://github.com/kubernetes-client/haskell)

## CLI

* [kubectl](/docs/reference/kubectl/overview/) - Main CLI tool for running commands and managing Kubernetes clusters.
    * [JSONPath](/docs/reference/kubectl/jsonpath/) - Syntax guide for using [JSONPath expressions](https://goessner.net/articles/JsonPath/) with kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/) - CLI tool to easily provision a secure Kubernetes cluster.

## Components

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - The
  primary agent that runs on each node. The kubelet takes a set of PodSpecs
  and ensures that the described containers are running and healthy.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API that validates and configures data for API objects such as  pods,
  services, replication controllers.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Daemon that embeds the core control loops shipped with Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - Can
  do simple TCP/UDP stream forwarding or round-robin TCP/UDP forwarding across
  a set of back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Scheduler that manages availability, performance, and capacity.
  
  * [Scheduler Policies](/docs/reference/scheduling/policies)
  * [Scheduler Profiles](/docs/reference/scheduling/config#profiles)

## Config APIs

This section hosts the documentation for "unpublished" APIs which are used to
configure  kubernetes components or tools. Most of these APIs are not exposed
by the API server in a RESTful way though they are essential for a user or an
operator to use or manage a cluster.

* [kube-apiserver configuration (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)
* [kubelet configuration (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
* [kube-scheduler configuration (v1beta1)](/docs/reference/config-api/kube-scheduler-config.v1beta1/)
* [kube-scheduler configuration (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/)
* [kube-scheduler policy reference (v1)](/docs/reference/config-api/kube-scheduler-policy-config.v1/)
* [kube-proxy configuration (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/)
* [WebhookAdmission configuration (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)

## Config API for kubeadm

* [v1beta2](/docs/reference/config-api/kubeadm-config.v1beta2/)
* [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)

## Design Docs

An archive of the design docs for Kubernetes functionality. Good starting points are
[Kubernetes Architecture](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) and
[Kubernetes Design Overview](https://git.k8s.io/community/contributors/design-proposals).

