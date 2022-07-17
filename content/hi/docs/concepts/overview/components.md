---
reviewers:
-
title: कुबेरनेट्स घटक
content_type: concept
description: >
  कुबेरनेट्स क्लस्टर में ऐसे घटक होते हैं जो नियंत्रण विमान का प्रतिनिधित्व करते हैं और मशीनों का एक सेट जिसे नोड्स कहा जाता है।
weight: 20
card:
  name: concepts
  weight: 20
---

<!-- overview -->
जब आप कुबेरनेट्स को तैनात करते हैं, तो आपको एक क्लस्टर मिलता है।

कुबेरनेट्स क्लस्टर में वर्कर मशीनों का एक सेट होता है, जिसे कहा जाता हैनोड्स, जो कंटेनरीकृत अनुप्रयोग चलाते हैं। प्रत्येक क्लस्टर में कम से कम एक कार्यकर्ता नोड होता है।

कार्यकर्ता नोड होस्ट करता हैफलीजो अनुप्रयोग कार्यभार के घटक हैं। विमान नियंत्रणक्लस्टर में वर्कर नोड्स और पॉड्स का प्रबंधन करता है। उत्पादन वातावरण में, नियंत्रण विमान आमतौर पर कई कंप्यूटरों पर चलता है और एक क्लस्टर आमतौर पर कई नोड्स चलाता है, जो दोष-सहिष्णुता और उच्च उपलब्धता प्रदान करता है।

यह दस्तावेज़ एक पूर्ण और कार्यशील कुबेरनेट क्लस्टर के लिए आवश्यक विभिन्न घटकों की रूपरेखा तैयार करता है।

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="कुबेरनेट्स के घटक" caption="कुबेरनेट्स क्लस्टर के घटक" class="diagram-large" >}}

<!-- body -->
## नियंत्रण विमान अवयव

ननियंत्रण विमान के घटक क्लस्टर के बारे में वैश्विक निर्णय लेते हैं (उदाहरण के लिए, शेड्यूलिंग), साथ ही क्लस्टर घटनाओं का पता लगाना और उनका जवाब देना (उदाहरण के लिए, एक नया शुरू करनापॉडजब एक परिनियोजन का replicasक्षेत्र असंतुष्ट होता है)।

नियंत्रण विमान घटकों को क्लस्टर में किसी भी मशीन पर चलाया जा सकता है। हालांकि, सरलता के लिए, सेट अप स्क्रिप्ट आमतौर पर एक ही मशीन पर सभी नियंत्रण विमान घटकों को शुरू करते हैं, और इस मशीन पर उपयोगकर्ता कंटेनर नहीं चलाते हैं। कई मशीनों पर चलने वाले नियंत्रण विमान सेटअप के उदाहरण के लिए कुबेदम [के साथ अत्यधिक उपलब्ध क्लस्टर बनाना](/docs/setup/production-environment/tools/kubeadm/high-availability/) देखें ।

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Some types of these controllers are:

  * Node controller: Responsible for noticing and responding when nodes go down.
  * Job controller: Watches for Job objects that represent one-off tasks, then creates
    Pods to run those tasks to completion.
  * Endpoints controller: Populates the Endpoints object (that is, joins Services & Pods).
  * Service Account & Token controllers: Create default accounts and API access tokens for new namespaces.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can
scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

  * Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route controller: For setting up routes in the underlying cloud infrastructure
  * Service controller: For creating, updating and deleting cloud provider load balancers

## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc)
to implement cluster features. Because these are providing cluster-level features, namespaced resources
for addons belong within the `kube-system` namespace.

Selected addons are described below; for an extended list of available addons, please
see [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.

### Container Resource Monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.

### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.


## {{% heading "whatsnext" %}}

* Learn about [Nodes](/docs/concepts/architecture/nodes/)
* Learn about [Controllers](/docs/concepts/architecture/controller/)
* Learn about [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read etcd's official [documentation](https://etcd.io/docs/)
