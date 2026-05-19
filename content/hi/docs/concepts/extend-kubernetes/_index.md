---
title: Kubernetes को विस्तारित करना
weight: 999 # this section should come last
description: आपके Kubernetes cluster के व्यवहार को बदलने के विभिन्न तरीके।
reviewers:
- erictune
- lavalamp
- cheftako
- chenopis
feature:
  title: विस्तारीकरण के लिए डिज़ाइन किया गया
  description: >
    upstream source code को बदले बिना अपने Kubernetes cluster में features जोड़ें।
content_type: concept
no_list: true
---

<!-- overview -->

Kubernetes अत्यधिक configurable और extensible है। इसके परिणामस्वरूप, शायद ही कभी
Kubernetes project code को fork करने या patches submit करने की आवश्यकता होती है।

यह गाइड Kubernetes cluster को customize करने के विकल्पों का वर्णन करती है। यह
{{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} के लिए है जो यह समझना चाहते हैं
कि अपने Kubernetes cluster को अपने work environment की आवश्यकताओं के अनुसार कैसे adapt करें।
Developers जो संभावित {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} या
Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}} हैं, उन्हें भी यह
उपयोगी लगेगा क्योंकि यह एक परिचय प्रदान करती है कि कौन से extension points और patterns मौजूद हैं,
और उनके trade-offs और limitations क्या हैं।

Customization approaches को मोटे तौर पर [configuration](#configuration) में विभाजित किया जा सकता है,
जिसमें केवल command line arguments, local configuration files, या API resources को बदलना शामिल है;
और [extensions](#extensions), जिसमें अतिरिक्त programs चलाना, अतिरिक्त network services, या दोनों शामिल हैं।
यह document मुख्य रूप से _extensions_ के बारे में है।

<!-- body -->

## Configuration

*Configuration files* और *command arguments* को online documentation के [Reference](/docs/reference/)
section में document किया गया है, प्रत्येक binary के लिए एक page के साथ:

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)

Command arguments और configuration files हमेशा hosted Kubernetes service या managed installation के
साथ distribution में changeable नहीं हो सकते हैं। जब वे changeable होते हैं, तो वे आमतौर पर केवल
cluster operator द्वारा ही changeable होते हैं। इसके अलावा, वे भविष्य के Kubernetes versions में
बदलाव के अधीन हैं, और उन्हें set करने के लिए processes को restart करने की आवश्यकता हो सकती है।
इन कारणों से, उनका उपयोग केवल तभी किया जाना चाहिए जब कोई अन्य विकल्प न हो।

Built-in *policy APIs*, जैसे [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) और Role-based Access Control
([RBAC](/docs/reference/access-authn-authz/rbac/)), built-in Kubernetes APIs हैं जो declaratively configured
policy settings प्रदान करती हैं। APIs आमतौर पर hosted Kubernetes services और managed Kubernetes installations
के साथ भी उपयोग करने योग्य हैं। Built-in policy APIs वही conventions follow करती हैं जो अन्य Kubernetes
resources जैसे Pods follow करते हैं। जब आप एक policy API का उपयोग करते हैं जो [stable](/docs/reference/using-api/#api-versioning)
है, तो आप अन्य Kubernetes APIs की तरह एक [defined support policy](/docs/reference/using-api/deprecation-policy/)
से लाभान्वित होते हैं। इन कारणों से, *configuration files* और *command arguments* की तुलना में policy APIs
की सिफारिश की जाती है जहां उपयुक्त हो।

## Extensions

Extensions वे software components हैं जो Kubernetes को extend और deeply integrate करते हैं।
वे इसे नए types और नए kinds के hardware को support करने के लिए adapt करते हैं।

कई cluster administrators hosted या distribution instance of Kubernetes का उपयोग करते हैं।
ये clusters pre-installed extensions के साथ आते हैं। इसके परिणामस्वरूप, अधिकांश Kubernetes
users को extensions install करने की आवश्यकता नहीं होगी और और भी कम users को नए extensions
author करने की आवश्यकता होगी।

### Extension patterns

Kubernetes को client programs लिखकर automate करने के लिए design किया गया है। कोई भी
program जो Kubernetes API को reads और/या writes, उपयोगी automation प्रदान कर सकता है।
*Automation* cluster पर या इसके बाहर चल सकता है। इस doc में guidance follow करके आप
highly available और robust automation लिख सकते हैं। Automation आम तौर पर किसी भी
Kubernetes cluster के साथ काम करता है, जिसमें hosted clusters और managed installations शामिल हैं।

Client programs लिखने के लिए एक specific pattern है जो Kubernetes के साथ अच्छी तरह से काम करता है
जिसे {{< glossary_tooltip term_id="controller" text="controller" >}} pattern कहा जाता है।
Controllers आमतौर पर एक object के `.spec` को read करते हैं, संभवतः कुछ चीजें करते हैं, और फिर
object के `.status` को update करते हैं।

एक controller Kubernetes API का client है। जब Kubernetes client है और एक remote service को call
करता है, तो Kubernetes इसे *webhook* कहता है। Remote service को *webhook backend* कहा जाता है।
Custom controllers की तरह, webhooks failure का एक point add करते हैं।

{{< note >}}
Kubernetes के बाहर, "webhook" term आमतौर पर asynchronous notifications के लिए एक mechanism को refer
करता है, जहां webhook call दूसरे system या component को एक one-way notification के रूप में serve करता है।
Kubernetes ecosystem में, synchronous HTTP callouts को भी अक्सर "webhooks" के रूप में describe किया जाता है।
{{< /note >}}

Webhook model में, Kubernetes एक remote service को network request करता है।
Alternative *binary Plugin* model के साथ, Kubernetes एक binary (program) execute करता है।
Binary plugins kubelet द्वारा उपयोग किए जाते हैं (उदाहरण के लिए,
[CSI storage plugins](https://kubernetes-csi.github.io/docs/) और
[CNI network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)),
और kubectl द्वारा ([Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) देखें)।

### Extension points

यह diagram एक Kubernetes cluster में extension points और clients को दिखाता है जो इसे access करते हैं।

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png"
    alt="Kubernetes के लिए सात numbered extension points का symbolic representation"
    class="diagram-large" caption="Kubernetes extension points" >}}

#### Figure की key

1. Users अक्सर `kubectl` का उपयोग करके Kubernetes API के साथ interact करते हैं। [Plugins](#client-extensions)
   clients के behaviour को customize करते हैं। ऐसे generic extensions हैं जो विभिन्न clients पर apply हो सकते हैं,
   साथ ही `kubectl` को extend करने के specific तरीके भी हैं।

1. API server सभी requests को handle करता है। API server में कई प्रकार के extension points requests को
   authenticate करने, या उनकी content के आधार पर उन्हें block करने, content को edit करने, और deletion को
   handle करने की अनुमति देते हैं। इन्हें [API Access Extensions](#api-access-extensions) section में describe किया गया है।

1. API server विभिन्न प्रकार के *resources* serve करता है। *Built-in resource kinds*, जैसे
   `pods`, Kubernetes project द्वारा defined किए गए हैं और बदले नहीं जा सकते।
   Kubernetes API को extend करने के बारे में जानने के लिए [API extensions](#api-extensions) पढ़ें।

1. Kubernetes scheduler [decides](/docs/concepts/scheduling-eviction/assign-pod-node/)
   करता है कि pods को किन nodes पर place करना है। Scheduling को extend करने के कई तरीके हैं, जिन्हें
   [Scheduling extensions](#scheduling-extensions) section में describe किया गया है।

1. Kubernetes के अधिकांश behaviour को programs द्वारा implement किया जाता है जिन्हें
   {{< glossary_tooltip term_id="controller" text="controllers" >}} कहा जाता है, जो
   API server के clients हैं। Controllers अक्सर custom resources के साथ conjunction में उपयोग किए जाते हैं।
   अधिक जानने के लिए [combining new APIs with automation](#combining-new-apis-with-automation) और
   [Changing built-in resources](#changing-built-in-resources) पढ़ें।

1. Kubelet servers (nodes) पर run होता है, और pods को अपने IPs के साथ virtual servers की तरह
   cluster network पर दिखने में मदद करता है। [Network Plugins](#network-plugins) pod networking के
   विभिन्न implementations के लिए allow करते हैं।

1. आप custom hardware या अन्य special node-local facilities को integrate करने के लिए
   [Device Plugins](#device-plugins) का उपयोग कर सकते हैं, और इन्हें आपके cluster में running Pods के लिए
   उपलब्ध करा सकते हैं। Kubelet में device plugins के साथ काम करने के लिए support शामिल है।

   Kubelet pods और उनके containers के लिए {{< glossary_tooltip text="volume" term_id="volume" >}}
   को mount और unmount भी करता है। आप नए kinds के storage और अन्य volume types के लिए support
   जोड़ने के लिए [Storage Plugins](#storage-plugins) का उपयोग कर सकते हैं।

#### Extension point choice flowchart {#extension-flowchart}

यदि आप unsure हैं कि कहां से शुरू करें, तो यह flowchart मदद कर सकता है। ध्यान दें कि कुछ solutions में
कई प्रकार के extensions शामिल हो सकते हैं।

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/docs/concepts/extend-kubernetes/flowchart.svg"
    alt="Use cases के बारे में questions और implementers के लिए guidance के साथ flowchart। Green circles हां indicate करते हैं; red circles नहीं indicate करते हैं।"
    class="diagram-large" caption="Extension approach select करने के लिए flowchart guide" >}}

---

## Client extensions

kubectl के लिए plugins अलग binaries हैं जो specific subcommands के behaviour को add या replace करते हैं।
`kubectl` tool [credential plugins](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
के साथ भी integrate हो सकता है। ये extensions केवल individual user के local environment को affect करते हैं,
और इसलिए site-wide policies को enforce नहीं कर सकते।

यदि आप `kubectl` tool को extend करना चाहते हैं, तो [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) पढ़ें।

## API extensions

### Custom resource definitions

यदि आप नए controllers, application configuration objects या अन्य declarative APIs को define करना चाहते हैं,
और उन्हें Kubernetes tools, जैसे `kubectl` का उपयोग करके manage करना चाहते हैं, तो Kubernetes में
_Custom Resource_ जोड़ने पर विचार करें।

Custom Resources के बारे में अधिक जानकारी के लिए,
[Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) concept guide देखें।

### API aggregation layer

आप [metrics](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/) जैसी अतिरिक्त services के साथ
Kubernetes API को integrate करने के लिए Kubernetes की
[API Aggregation Layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) का उपयोग कर सकते हैं।

### Combining new APIs with automation

Custom resource API और control loop का combination
{{< glossary_tooltip term_id="controller" text="controllers" >}} pattern कहलाता है। यदि आपका controller
एक human operator की जगह लेता है जो desired state के आधार पर infrastructure deploy कर रहा है, तो controller
{{< glossary_tooltip text="operator pattern" term_id="operator-pattern" >}} को भी follow कर सकता है।
Operator pattern का उपयोग specific applications को manage करने के लिए किया जाता है; आमतौर पर, ये applications
जो state maintain करते हैं और उन्हें manage करने में सावधानी की आवश्यकता होती है।

आप अपनी खुद की custom APIs और control loops भी बना सकते हैं जो अन्य resources, जैसे storage को manage करते हैं,
या policies (जैसे access control restriction) define करते हैं।

### Changing built-in resources

जब आप custom resources add करके Kubernetes API को extend करते हैं, तो added resources हमेशा एक नए
API Groups में आते हैं। आप existing API groups को replace या change नहीं कर सकते।
API add करना सीधे existing APIs (जैसे Pods) के behaviour को affect नहीं करता है, जबकि
_API Access Extensions_ करते हैं।

## API access extensions

जब एक request Kubernetes API Server पर पहुंचती है, तो इसे पहले _authenticated_ किया जाता है,
फिर _authorized_, और फिर विभिन्न प्रकार के _admission control_ के अधीन किया जाता है
(कुछ requests वास्तव में authenticated नहीं होती हैं, और special treatment प्राप्त करती हैं)।
इस flow के बारे में अधिक जानकारी के लिए
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/) देखें।

Kubernetes authentication / authorization flow में प्रत्येक step extension points प्रदान करता है।

### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) सभी requests में headers या certificates
को request करने वाले client के लिए username में map करता है।

Kubernetes में कई built-in authentication methods हैं जिन्हें यह support करता है। यह एक authenticating
proxy के पीछे भी sit कर सकता है, और verification के लिए `Authorization:` header से एक token को remote
service को send कर सकता है (एक [authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication))
यदि वे आपकी आवश्यकताओं को पूरा नहीं करते हैं।

### Authorization

[Authorization](/docs/reference/access-authn-authz/authorization/) determine करता है कि specific users
API resources पर read, write, और अन्य operations कर सकते हैं या नहीं। यह पूरे resources के level पर
काम करता है -- यह arbitrary object fields के आधार पर discriminate नहीं करता है।

यदि built-in authorization options आपकी आवश्यकताओं को पूरा नहीं करते हैं, तो एक
[authorization webhook](/docs/reference/access-authn-authz/webhook/)
custom code को call करने की अनुमति देता है जो authorization decision लेता है।

### Dynamic admission control

Request authorized होने के बाद, यदि यह एक write operation है, तो यह
[Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps से भी गुजरती है।
Built-in steps के अलावा, कई extensions हैं:

* [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  restrict करता है कि containers में कौन सी images run हो सकती हैं।
* Arbitrary admission control decisions लेने के लिए, एक सामान्य
  [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  का उपयोग किया जा सकता है। Admission webhooks creations या updates को reject कर सकते हैं।
  कुछ admission webhooks incoming request data को Kubernetes द्वारा आगे handle किए जाने से पहले modify करते हैं।

## Infrastructure extensions

### Device plugins

_Device plugins_ एक node को नए Node resources (built-in ones जैसे cpu और memory के अलावा)
discover करने की अनुमति देते हैं एक [Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) के माध्यम से।

### Storage plugins

{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins
Kubernetes को नए kinds के volumes के लिए supports के साथ extend करने का एक तरीका प्रदान करते हैं।
Volumes durable external storage द्वारा backed हो सकते हैं, या ephemeral storage प्रदान कर सकते हैं,
या वे filesystem paradigm का उपयोग करके information के लिए read-only interface प्रदान कर सकते हैं।

Kubernetes में [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) plugins के लिए भी support शामिल है,
जो Kubernetes v1.23 से deprecated हैं (CSI के पक्ष में)।

FlexVolume plugins users को ऐसे volume types mount करने की अनुमति देते हैं जो Kubernetes द्वारा natively
supported नहीं हैं। जब आप एक Pod run करते हैं जो FlexVolume storage पर निर्भर करता है, तो kubelet volume को
mount करने के लिए एक binary plugin को call करता है। Archived
[FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md) design proposal
में इस approach के बारे में अधिक detail है।

[Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
में storage plugins के बारे में सामान्य जानकारी शामिल है।

### Network plugins

आपके Kubernetes cluster को working Pod network और Kubernetes network model के अन्य aspects को support
करने के लिए _network plugin_ की आवश्यकता होती है।

[Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
Kubernetes को विभिन्न networking topologies और technologies के साथ काम करने की अनुमति देते हैं।

### Kubelet image credential provider plugins

{{< feature-state for_k8s_version="v1.26" state="stable" >}}
Kubelet image credential providers kubelet के लिए plugins हैं जो dynamically image registry credentials
retrieve करते हैं। Credentials का उपयोग तब किया जाता है जब container image registries से images pull
की जाती हैं जो configuration से match करती हैं।

Plugins external services के साथ communicate कर सकते हैं या credentials प्राप्त करने के लिए local files
का उपयोग कर सकते हैं। इस तरह, kubelet को प्रत्येक registry के लिए static credentials रखने की
आवश्यकता नहीं है, और विभिन्न authentication methods और protocols को support कर सकता है।

Plugin configuration details के लिए,
[Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/) देखें।

## Scheduling extensions

Scheduler एक special प्रकार का controller है जो pods को watch करता है, और nodes को pods assign करता है।
Default scheduler को पूरी तरह से replace किया जा सकता है, जबकि अन्य Kubernetes components का उपयोग जारी रखा जा सकता है,
या [multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
एक ही समय में run हो सकते हैं।

यह एक महत्वपूर्ण undertaking है, और लगभग सभी Kubernetes users को पता चलता है कि
उन्हें scheduler को modify करने की आवश्यकता नहीं है।

आप control कर सकते हैं कि कौन से [scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins)
active हैं, या plugins के sets को विभिन्न named [scheduler profiles](/docs/reference/scheduling/config/#multiple-profiles)
के साथ associate कर सकते हैं। आप अपना खुद का plugin भी लिख सकते हैं जो kube-scheduler के एक या अधिक
[extension points](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points) के साथ integrates होता है।

अंत में, built in `kube-scheduler` component एक
[webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)
को support करता है जो एक remote HTTP backend (scheduler extension) को उन nodes को filter और / या prioritize
करने की अनुमति देता है जिन्हें kube-scheduler एक pod के लिए choose करता है।

{{< note >}}
आप केवल scheduler extender webhook के साथ node filtering
और node prioritization को affect कर सकते हैं; अन्य extension points webhook integration के माध्यम से उपलब्ध नहीं हैं।
{{< /note >}}

## {{% heading "whatsnext" %}}

* Infrastructure extensions के बारे में अधिक जानें
  * [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [storage plugins](https://kubernetes-csi.github.io/docs/)
* [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) के बारे में जानें
* [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) के बारे में अधिक जानें
* [Extension API Servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) के बारे में अधिक जानें
* [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/) के बारे में जानें
* [Operator pattern](/docs/concepts/extend-kubernetes/operator/) के बारे में जानें
