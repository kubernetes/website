---
title: "उत्पादन वातावरण"
description: एक उत्पादन-गुणवत्ता वाला कुबेरनेट्स क्लस्टर बनाएं
weight: 30
no_list: true
---
<!-- overview -->

उत्पादन-गुणवत्ता वाले कुबेरनेट्स क्लस्टर के लिए योजना और तैयारी की आवश्यकता होती है।
यदि आपका कुबेरनेट क्लस्टर महत्वपूर्ण कार्यभार चलाने के लिए है, तो इसे लचीला होने के लिए कॉन्फ़िगर किया जाना चाहिए।
यह पेज उन चरणों के बारे में बताता है जो आप उत्पादन के लिए तैयार क्लस्टर स्थापित करने के लिए,
या उत्पादन के उपयोग के लिए मौजूदा क्लस्टर को अपग्रेड करने के लिए उठा सकते हैं।
यदि आप पहले से ही उत्पादन सेटअप से परिचित हैं और लिंक चाहते हैं, तो यहां जाएं
[आगे क्या होगा](#what-s-next).

<!-- body -->

## उत्पादन विचार

आमतौर पर, उत्पादन कुबेरनेट्स क्लस्टर वातावरण में व्यक्तिगत सीखने, विकास या परीक्षण वातावरण कुबेरनेट्स की तुलना में अधिक आवश्यकताएं होती हैं। एक उत्पादन वातावरण की आवश्यकता ये हो सकती है, जैसे: कई उपयोगकर्ताओं द्वारा सुरक्षित पहुंच, लगातार उपलब्धता, और बदलती मांगों के लिए संसाधनों को अनुकूलित करना।

जैसा कि आप तय करते हैं कि आप अपने उत्पादन कुबेरनेट्स वातावरण को कहाँ रखना चाहते हैं (परिसर या क्लाउड में) और प्रबंधन की मात्रा जिसे आप दूसरों को देना या सौंपना चाहते हैं, विचार करें कि कुबेरनेट्स क्लस्टर के लिए आपकी आवश्यकताएं निम्नलिखित मुद्दों से कैसे प्रभावित होती हैं:

- *उपलब्धता*: सिंगल-मशीन कुबेरनेट्स [सीखने का माहौल](/docs/setup/#learning-environment) में विफलता का एक बिंदु है। अत्यधिक उपलब्ध क्लस्टर बनाने का अर्थ है:
  - कण्ट्रोल प्लेन को वर्कर नोड्स से अलग करना।
  - कई नोड्स पर कण्ट्रोल प्लेन घटकों की प्रतिकृति।
  - क्लस्टर के लिए संतुलन यातायात लोड करें{{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}.
  - पर्याप्त वर्कर नोड्स उपलब्ध होना, या जल्दी से उपलब्ध होने में सक्षम होना, क्योंकि बदलते वर्कलोड इसे वारंट करते हैं।

- *स्केल*: यदि आप उम्मीद करते हैं कि आपके उत्पादन कुबेरनेट्स पर्यावरण को मांग की एक स्थिर मात्रा प्राप्त होगी, तो आप उस क्षमता के लिए सेटअप करने में सक्षम हो सकते हैं जिसकी आपको आवश्यकता है और किया जा सकता है। हालाँकि, यदि आप समय के साथ मांग बढ़ने की उम्मीद करते हैं या मौसम या विशेष घटनाओं जैसी चीजों के आधार पर अचानक से बदलते हैं, तो आपको योजना बनाने की आवश्यकता है कि कंट्रोल प्लेन और कार्यकर्ता नोड्स के लिए अधिक अनुरोधों से बढ़े दबाव को कैसे दूर किया जाए या अप्रयुक्त संसाधनों को कम करने के लिए स्केल किया जाए।

- *सुरक्षा और एक्सेस मैनेजमेंट*: आपके अपने कुबेरनेट्स लर्निंग क्लस्टर पर पूर्ण व्यवस्थापकीय विशेषाधिकार हैं। लेकिन महत्वपूर्ण कार्यभार के साथ साझा क्लस्टर, और एक या दो से अधिक उपयोगकर्ता, को क्लस्टर संसाधनों तक कौन और क्या एक्सेस कर सकता है, इसके लिए अधिक परिष्कृत दृष्टिकोण की आवश्यकता होती है। आप यह सुनिश्चित करने के लिए ([भूमिका-आधारित एक्सेस कण्ट्रोल](/docs/reference/access-authn-authz/rbac/)) और अन्य सुरक्षा तंत्रों का उपयोग कर सकते हैं कि उपयोगकर्ता और कार्यभार उन संसाधनों तक पहुँच प्राप्त कर सकते हैं जिनकी उन्हें आवश्यकता है, साथ ही में कार्यभार और क्लस्टर को साथ में सुरक्षित रख सके।
आप [नीतियों](/docs/concepts/policy/) और [कंटेनर संसाधन](/docs/concepts/configuration/manage-resources-containers/) को प्रबंधित करके उन संसाधनों की सीमा निर्धारित कर सकते हैं जिन तक उपयोगकर्ता और कार्यभार पहुंच सकते हैं।

कुबेरनेट्स उत्पादन वातावरण को स्वयं बनाने से पहले, इस कार्य में से कुछ या सभी को सौंपने पर विचार करें
[टर्नकी क्लाउड सॉल्यूशंस](/docs/setup/production-environment/turnkey-solutions/) प्रदाता या अन्य [कुबेरनेट्स पार्टनर्स](https://kubernetes.io/partners/) विकल्पों में शामिल हैं:

- *सर्वरलेस*: किसी क्लस्टर को प्रबंधित किए बिना केवल तृतीय-पक्ष उपकरण पर कार्यभार चलाएं। आपसे सीपीयू उपयोग, मेमोरी और डिस्क अनुरोध जैसी चीज़ों के लिए शुल्क लिया जाएगा।
- *व्यवस्थित कण्ट्रोल प्लेन*: प्रदाता को क्लस्टर के कंट्रोल प्लेन के पैमाने और उपलब्धता का प्रबंधन करने दें, साथ ही पैच और अपग्रेड को भी संभालें।
- *व्यवस्थित वर्कर नोड्स*: अपनी आवश्यकताओं को पूरा करने के लिए नोड्स के पूल को कॉन्फ़िगर करें, फिर प्रदाता सुनिश्चित करता है कि वे नोड उपलब्ध हैं और जरूरत पड़ने पर अपग्रेड को लागू करने के लिए तैयार हैं।
- *एकीकरण*: ऐसे प्रदाता हैं जो कुबेरनेट्स को अन्य सेवाओं के साथ एकीकृत करते हैं जिनकी आपको आवश्यकता हो सकती है, जैसे भंडारण, कंटेनर रजिस्ट्रियां, प्रमाणीकरण तरीके, और विकास उपकरण।

चाहे आप कुबेरनेट्स क्लस्टर का निर्माण स्वयं करें या भागीदारों के साथ काम करें, अपनी आवश्यकताओं का मूल्यांकन करने के लिए निम्नलिखित अनुभागों की समीक्षा करें क्योंकि वे आपके क्लस्टर से संबंधित हैं *कण्ट्रोल प्लेन*, *वर्कर नोड्स*, *यूज़र एक्सेस*, और *वर्कलोड रिसोर्सस*.

## उत्पादन क्लस्टर सेटअप

उत्पादन-गुणवत्ता वाले कुबेरनेट्स क्लस्टर में, कंट्रोल प्लेन क्लस्टर को उन सेवाओं से प्रबंधित करता है जिन्हें विभिन्न तरीकों से कई कंप्यूटरों में फैलाया जा सकता है। हालाँकि, प्रत्येक कार्यकर्ता नोड एक एकल इकाई का प्रतिनिधित्व करता है जिसे कुबेरनेट्स पॉड चलाने के लिए कॉन्फ़िगर किया गया है।

### उत्पादन कण्ट्रोल प्लेन

सबसे सरल कुबेरनेट्स क्लस्टर में एक ही मशीन पर चलने वाले संपूर्ण कण्ट्रोल प्लेन और कार्यकर्ता नोड सेवाएं होती हैं। आप कार्यकर्ता नोड्स को जोड़कर उस वातावरण को विकसित कर सकते हैं, जैसा कि [कुबेरनेट्स कंपोनेंट्स](/docs/concepts/overview/components/) के डायग्राम में दर्शाया गया है। यदि क्लस्टर थोड़े समय के लिए उपलब्ध होने के लिए है, या अगर कुछ गंभीर रूप से गलत हो जाता है, तो इसे छोड़ दिया जा सकता है, यह आपकी आवश्यकताओं को पूरा कर सकता है।

यदि आपको अधिक स्थायी, अत्यधिक उपलब्ध क्लस्टर की आवश्यकता है, तो आपको कण्ट्रोल प्लेन को विस्तारित करने के तरीकों पर विचार करना चाहिए। डिजाइन के अनुसार, एक मशीन पर चलने वाली एक-मशीन कंट्रोल प्लेन सेवाएं अत्यधिक उपलब्ध नहीं हैं। यदि क्लस्टर को चालू रखना और यह सुनिश्चित करना कि कुछ गलत होने पर इसकी मरम्मत की जा सकती है, महत्वपूर्ण है, तो इन चरणों पर विचार करें:

- *डिप्लॉयमेंट टूल्स चुनें*: आप kubeadm, kops, और kubespray जैसे टूल का उपयोग करके एक कंट्रोल प्लेन को तैनात कर सकते हैं। उनमें से प्रत्येक परिनियोजन विधियों का उपयोग करके उत्पादन-गुणवत्ता परिनियोजन के लिए युक्तियों को जानने के लिए [डिप्लॉयमेंट टूल्स के साथ कुबेरनेट्स स्थापित करना](/docs/setup/production-environment/tools/) देखें। आपके डिप्लॉयमेंट के साथ उपयोग करने के लिए विभिन्न [कंटेनर रनटाइम](/docs/setup/production-environment/container-runtimes/) उपलब्ध हैं।
- *सर्टिफ़िकेट प्रबंधित करे*: कण्ट्रोल प्लेन सेवाओं के बीच सुरक्षित संचार सर्टिफ़िकेटस का उपयोग करके कार्यान्वित किया जाता है। डिप्लॉयमेंट के दौरान सर्टिफ़िकेट स्वचालित रूप से उत्पन्न होते हैं या आप अपने स्वयं के सर्टिफ़िकेट अथॉरिटी का उपयोग करके उन्हें उत्पन्न कर सकते हैं।
विवरण के लिए [PKI सर्टिफ़िकेटस और आवश्यकताएं](/docs/setup/best-practices/certificates/) देखें।
- *एपिसर्वर के लिए लोड बैलेंसर कॉन्फ़िगर करें*: विभिन्न नोड्स पर चल रहे एपिसर्वर सर्विस इंस्टेंस के लिए बाहरी एपीआई अनुरोधों को वितरित करने के लिए लोड बैलेंसर को कॉन्फ़िगर करें। 
विवरण के लिए [एक बाहरी लोड बैलेंसर बनाना](/docs/tasks/access-application-cluster/create-external-load-balancer/) देखें।
- *अलग और बैकअप etcd सेवा*: अतिरिक्त सुरक्षा और उपलब्धता के लिए etcd सेवाएं या तो अन्य कंट्रोल प्लेन सेवाओं के समान मशीनों पर चल सकती हैं या अलग मशीनों पर चल सकती हैं। क्योंकि etcd क्लस्टर कॉन्फ़िगरेशन डेटा संग्रहीत करता है, etcd डेटाबेस का बैकअप नियमित रूप से किया जाना चाहिए ताकि यह सुनिश्चित हो सके कि यदि आवश्यक हो तो आप उस डेटाबेस की मरम्मत कर सकते हैं।
etcd को कॉन्फ़िगर करने और उपयोग करने के विवरण के लिए [etcd अक्सर पूछे जाने वाले प्रश्न](https://etcd.io/docs/v3.4/faq/) देखें।
विवरण के लिए [कुबेरनेट्स के लिए ऑपरेटिंग etcd क्लस्टर](/docs/tasks/administer-cluster/configure-upgrade-etcd/) और [kubeadm के साथ एक उच्च उपलब्धता etcd क्लस्टर स्थापित करें](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) देखें।
- *मल्टीपल कंट्रोल प्लेन सिस्टम बनाएं*: उच्च उपलब्धता के लिए, कंट्रोल प्लेन एक मशीन तक सीमित नहीं होना चाहिए। यदि कंट्रोल प्लेन सेवाएं एक init सेवा (जैसे systemd) द्वारा चलाई जाती हैं, तो प्रत्येक सेवा को कम से कम तीन मशीनों पर चलना चाहिए। हालाँकि, कुबेरनेट्स में पॉड्स के रूप में कंट्रोल प्लेन सेवाएं चलाना सुनिश्चित करता है कि आपके द्वारा अनुरोधित सेवाओं की प्रतिकृति संख्या हमेशा उपलब्ध रहेगी।
अनुसूचक फॉल्ट सहने वाला होना चाहिए, लेकिन अत्यधिक उपलब्ध नहीं होना चाहिए। कुबेरनेट्स सेवाओं के नेता चुनाव करने के लिए कुछ डिप्लॉयमेंट उपकरण [राफ्ट](https://raft.github.io/) सर्वसम्मति एल्गोरिथ्म की स्थापना करते हैं। यदि प्राथमिक चला जाता है, तो दूसरी सेवा स्वयं को चुनती है और कार्यभार संभालती है।
- *कई क्षेत्रों में विस्तार करना*: यदि अपने क्लस्टर को हर समय उपलब्ध रखना महत्वपूर्ण है, तो एक ऐसा क्लस्टर बनाने पर विचार करें, जो कई डेटा केंद्रों पर चलता हो, जिसे क्लाउड वातावरण में ज़ोन के रूप में संदर्भित किया जाता है। ज़ोन(zone) के समूहों को रीजन(region) कहा जाता है। एक ही क्षेत्र में कई क्षेत्रों में एक क्लस्टर फैलाकर, यह इस संभावना में सुधार कर सकता है कि एक क्षेत्र अनुपलब्ध होने पर भी आपका क्लस्टर कार्य करना जारी रखेगा।
विवरण के लिए [Running in multiple zones](/docs/setup/best-practices/multiple-zones/) देखें।
- *चल रही सुविधाओं का प्रबंधन*: यदि आप अपने क्लस्टर को समय के साथ रखने की योजना बनाते हैं, तो इसके स्वास्थ्य और सुरक्षा को बनाए रखने के लिए आपको कुछ कार्य करने होंगे। उदाहरण के लिए, यदि आपने kubeadm के साथ स्थापित किया है, तो आपको [सर्टिफिकेट प्रबंधन](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/) और [kubeadm क्लस्टर्स को अपग्रेड करने](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) में मदद करने के लिए निर्देश दिए गए हैं, कुबेरनेट्स प्रशासनिक कार्यों की लंबी सूची के लिए [क्लस्टर का एडमिनिस्टर](/docs/tasks/administer-cluster/) देखें।

जब आप कंट्रोल प्लेन सेवाएं चलाते हैं, तो उपलब्ध विकल्पों के बारे में जानने के लिए, [क्यूब-एपिसर्वर](/docs/reference/command-line-tools-reference/kube-apiserver/), [क्यूब-कंट्रोलर-मैनेजर](/docs/reference/command-line-tools-reference/kube-controller-manager/), देखें।
और [क्यूब-शेड्यूलर](/docs/reference/command-line-tools-reference/kube-scheduler/) कॉम्पोनेन्ट पेज। अत्यधिक उपलब्ध कंट्रोल प्लेन उदाहरणों के लिए [अत्यधिक उपलब्ध टोपोलॉजी के लिए विकल्प](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[kubeadm के साथ अत्यधिक उपलब्ध क्लस्टर बनाना](/docs/setup/production-environment/tools/kubeadm/high-availability/), और [कुबेरनेट्स के लिए ऑपरेटिंग etcd क्लस्टर](/docs/tasks/administer-cluster/configure-upgrade-etcd/)। etcd बैकअप योजना बनाने के बारे में जानकारी के लिए [etcd क्लस्टर का बैकअप लेना](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster) देखें।

### Production worker nodes

Production-quality workloads need to be resilient and anything they rely
on needs to be resilient (such as CoreDNS). Whether you manage your own
control plane or have a cloud provider do it for you, you still need to
consider how you want to manage your worker nodes (also referred to
simply as *nodes*).  

- *Configure nodes*: Nodes can be physical or virtual machines. If you want to
create and manage your own nodes, you can install a supported operating system,
then add and run the appropriate
[Node services](/docs/concepts/overview/components/#node-components). Consider:
  - The demands of your workloads when you set up nodes by having appropriate memory, CPU, and disk speed and storage capacity available.
  - Whether generic computer systems will do or you have workloads that need GPU processors, Windows nodes, or VM isolation.
- *Validate nodes*: See [Valid node setup](/docs/setup/best-practices/node-conformance/)
for information on how to ensure that a node meets the requirements to join
a Kubernetes cluster.
- *Add nodes to the cluster*: If you are managing your own cluster you can
add nodes by setting up your own machines and either adding them manually or
having them register themselves to the cluster’s apiserver. See the
[Nodes](/docs/concepts/architecture/nodes/) section for information on how to set up Kubernetes to add nodes in these ways.
- *Add Windows nodes to the cluster*: Kubernetes offers support for Windows
worker nodes, allowing you to run workloads implemented in Windows containers. See
[Windows in Kubernetes](/docs/setup/production-environment/windows/) for details.
- *Scale nodes*: Have a plan for expanding the capacity your cluster will
eventually need. See [Considerations for large clusters](/docs/setup/best-practices/cluster-large/)
to help determine how many nodes you need, based on the number of pods and
containers you need to run. If you are managing nodes yourself, this can mean
purchasing and installing your own physical equipment.
- *Autoscale nodes*: Most cloud providers support
[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
to replace unhealthy nodes or grow and shrink the number of nodes as demand requires. See the
[Frequently Asked Questions](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
for how the autoscaler works and
[Deployment](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#deployment)
for how it is implemented by different cloud providers. For on-premises, there
are some virtualization platforms that can be scripted to spin up new nodes
based on demand.
- *Set up node health checks*: For important workloads, you want to make sure
that the nodes and pods running on those nodes are healthy. Using the
[Node Problem Detector](/docs/tasks/debug-application-cluster/monitor-node-health/)
daemon, you can ensure your nodes are healthy.

## Production user management

In production, you may be moving from a model where you or a small group of
people are accessing the cluster to where there may potentially be dozens or
hundreds of people. In a learning environment or platform prototype, you might have a single
administrative account for everything you do. In production, you will want
more accounts with different levels of access to different namespaces.

Taking on a production-quality cluster means deciding how you
want to selectively allow access by other users. In particular, you need to
select strategies for validating the identities of those who try to access your
cluster (authentication) and deciding if they have permissions to do what they
are asking (authorization):

- *Authentication*: The apiserver can authenticate users using client
certificates, bearer tokens, an authenticating proxy, or HTTP basic auth.
You can choose which authentication methods you want to use.
Using plugins, the apiserver can leverage your organization’s existing
authentication methods, such as LDAP or Kerberos. See
[Authentication](/docs/reference/access-authn-authz/authentication/)
for a description of these different methods of authenticating Kubernetes users.
- *Authorization*: When you set out to authorize your regular users, you will probably choose between RBAC and ABAC authorization. See [Authorization Overview](/docs/reference/access-authn-authz/authorization/) to review different modes for authorizing user accounts (as well as service account access to your cluster):
  - *Role-based access control* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Lets you assign access to your cluster by allowing specific sets of permissions to authenticated users. Permissions can be assigned for a specific namespace (Role) or across the entire cluster (ClusterRole). Then using RoleBindings and ClusterRoleBindings, those permissions can be attached to particular users.
  - *Attribute-based access control* ([ABAC](/docs/reference/access-authn-authz/abac/)): Lets you create policies based on resource attributes in the cluster and will allow or deny access based on those attributes. Each line of a policy file identifies versioning properties (apiVersion and kind) and a map of spec properties to match the subject (user or group), resource property, non-resource property (/version or /apis), and readonly. See [Examples](/docs/reference/access-authn-authz/abac/#examples) for details.

As someone setting up authentication and authorization on your production Kubernetes cluster, here are some things to consider:

- *Set the authorization mode*: When the Kubernetes API server
([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
starts, the supported authentication modes must be set using the *--authorization-mode*
flag. For example, that flag in the *kube-adminserver.yaml* file (in */etc/kubernetes/manifests*)
could be set to Node,RBAC. This would allow Node and RBAC authorization for authenticated requests.
- *Create user certificates and role bindings (RBAC)*: If you are using RBAC
authorization, users can create a CertificateSigningRequest (CSR) that can be
signed by the cluster CA. Then you can bind Roles and ClusterRoles to each user.
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
for details.
- *Create policies that combine attributes (ABAC)*: If you are using ABAC
authorization, you can assign combinations of attributes to form policies to
authorize selected users or groups to access particular resources (such as a
pod), namespace, or apiGroup. For more information, see
[Examples](/docs/reference/access-authn-authz/abac/#examples).
- *Consider Admission Controllers*: Additional forms of authorization for
requests that can come in through the API server include
[Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
Webhooks and other special authorization types need to be enabled by adding
[Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
to the API server.

## Set limits on workload resources

Demands from production workloads can cause pressure both inside and outside
of the Kubernetes control plane. Consider these items when setting up for the
needs of your cluster's workloads:

- *Set namespace limits*: Set per-namespace quotas on things like memory and CPU. See
[Manage Memory, CPU, and API Resources](/docs/tasks/administer-cluster/manage-resources/)
for details. You can also set
[Hierarchical Namespaces](/blog/2020/08/14/introducing-hierarchical-namespaces/)
for inheriting limits.
- *Prepare for DNS demand*: If you expect workloads to massively scale up,
your DNS service must be ready to scale up as well. See
[Autoscale the DNS service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- *Create additional service accounts*: User accounts determine what users can
do on a cluster, while a service account defines pod access within a particular
namespace. By default, a pod takes on the default service account from its namespace.
See [Managing Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
for information on creating a new service account. For example, you might want to:
  - Add secrets that a pod could use to pull images from a particular container registry. See [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/) for an example.
  - Assign RBAC permissions to a service account. See [ServiceAccount permissions](/docs/reference/access-authn-authz/rbac/#service-account-permissions) for details.

## {{% heading "whatsnext" %}}

- Decide if you want to build your own production Kubernetes or obtain one from
available [Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
or [Kubernetes Partners](https://kubernetes.io/partners/).
- If you choose to build your own cluster, plan how you want to
handle [certificates](/docs/setup/best-practices/certificates/)
and set up high availability for features such as
[etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
and the
[API server](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- Choose from [kubeadm](/docs/setup/production-environment/tools/kubeadm/), [kops](/docs/setup/production-environment/tools/kops/) or [Kubespray](/docs/setup/production-environment/tools/kubespray/)
deployment methods.
- Configure user management by determining your
[Authentication](/docs/reference/access-authn-authz/authentication/) and
[Authorization](/docs/reference/access-authn-authz/authorization/) methods.
- Prepare for application workloads by setting up
[resource limits](/docs/tasks/administer-cluster/manage-resources/),
[DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
and [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/).
