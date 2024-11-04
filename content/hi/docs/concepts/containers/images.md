---
title: इमेजेस
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

कंटेनर इमेज बाइनरी डेटा का प्रतिनिधित्व करती है जो किसी एप्लिकेशन और उसकी सभी सॉफ़्टवेयर निर्भरताओं को समाहित करती है। कंटेनर इमेज निष्पादन योग्य सॉफ़्टवेयर बंडल हैं जो स्टैंडअलोन चल सकते हैं और जो अपने रनटाइम वातावरण के बारे में बहुत अच्छी तरह से परिभाषित धारणाएँ बनाते हैं।

आप आमतौर पर अपने एप्लिकेशन की एक कंटेनर इमेज बनाते हैं और इसे 
{{<glossary_tooltip text="पॉड" term_id="pod">}}  में संदर्भित करने से पहले रजिस्ट्री में धकेल देते हैं।

यह पृष्ठ कंटेनर इमेज अवधारणा की रूपरेखा प्रदान करता है।

{{< note >}}

यदि आप Kubernetes रिलीज़ (जैसे v{{< skew latestVersion >}}, नवीनतम माइनर रिलीज़) के लिए कंटेनर इमेज की तलाश कर रहे हैं, तो [Download Kubernetes](https://kubernetes.io/releases/download/) पर जाएँ।

{{< /note >}}

<!-- body -->

## इमेज नाम

कंटेनर इमेज को आम तौर पर `pause`, `example/mycontainer`, या `kube-apiserver` जैसे नाम दिए जाते हैं।

इमेज में रजिस्ट्री होस्टनाम भी शामिल हो सकता है; उदाहरण के लिए: `fictional.registry.example/imagename`, और संभवतः पोर्ट नंबर भी ; उदाहरण के लिए: `fictional.registry.example:10443/imagename`।

यदि आप रजिस्ट्री होस्टनाम निर्दिष्ट नहीं करते हैं, तो Kubernetes मान लेता है कि आपका मतलब [Docker सार्वजनिक रजिस्ट्री](https://hub.docker.com/) है।

आप [कंटेनर रनटाइम](/docs/setup/production-environment/container-runtimes/) कॉन्फ़िगरेशन में डिफ़ॉल्ट इमेज रजिस्ट्री सेट करके इस व्यवहार को बदल सकते हैं।

इमेज नाम वाले भाग के बाद आप _tag_ या _digest_ जोड़ सकते हैं (ठीक उसी तरह जैसे आप `docker` या `podman` जैसे कमांड के साथ उपयोग करते समय करते हैं)। टैग आपको इमेज की एक ही श्रृंखला के विभिन्न संस्करणों की पहचान करने देते हैं। डाइजेस्ट किसी इमेज के विशिष्ट संस्करण के लिए एक अद्वितीय पहचानकर्ता हैं। डाइजेस्ट इमेज की सामग्री के हैश होते हैं, और अपरिवर्तनीय होते हैं। टैग को अलग-अलग इमेज की ओर इंगित करने के लिए स्थानांतरित किया जा सकता है, लेकिन डाइजेस्ट स्थिर होते हैं। इमेज टैग में लोअरकेस और अपरकेस अक्षर, अंक, अंडरस्कोर (`_`), अवधि (`.`), और डैश (`-`) होते हैं। यह 128 वर्णों तक लंबा हो सकता है और इसे निम्नलिखित रेगेक्स पैटर्न का पालन करना चाहिए: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`।

आप [OCI वितरण विनिर्देश](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories) में सत्यापन रेगेक्स के बारे में अधिक पढ़ सकते हैं और पा सकते हैं।

यदि आप कोई टैग निर्दिष्ट नहीं करते हैं, तो Kubernetes मान लेता है कि आपका मतलब `latest` टैग से है।

इमेज डाइजेस्ट में एक हैश एल्गोरिदम (जैसे `sha256`) और एक हैश मान होता है। उदाहरण के लिए: `sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`

आप [OCI इमेज विनिर्देश](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests) में डाइजेस्ट प्रारूप के बारे में अधिक जानकारी पा सकते हैं।

कुछ इमेज नाम उदाहरण जिनका Kubernetes उपयोग कर सकता है:

- `busybox` - केवल इमेज नाम, कोई टैग या डाइजेस्ट नहीं। Kubernetes Docker पब्लिक रजिस्ट्री और नवीनतम टैग का उपयोग करेगा। (`docker.io/library/busybox:latest` के समान)
- `busybox:1.32.0` - टैग के साथ इमेज नाम। Kubernetes Docker पब्लिक रजिस्ट्री का उपयोग करेगा। (`docker.io/library/busybox:1.32.0` के समान)
- `registry.k8s.io/pause:latest` - कस्टम रजिस्ट्री और नवीनतम टैग के साथ इमेज का नाम।
- `registry.k8s.io/pause:3.5` - कस्टम रजिस्ट्री और गैर-नवीनतम टैग के साथ इमेज का नाम।
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - डाइजेस्ट के साथ इमेज का नाम।
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - टैग और डाइजेस्ट के साथ इमेज का नाम। खींचने के लिए केवल डाइजेस्ट का उपयोग किया जाएगा।

## इमेज को अपडेट करना

जब आप पहली बार {{<glossary_tooltip text="डिप्लॉयमेंट" term_id="deployment" >}},   {{<glossary_tooltip text="स्टैटेफूलसेट" term_id="statefulset" >}}, पॉड या अन्य ऑब्जेक्ट बनाते हैं जिसमें पॉड टेम्पलेट शामिल होता है, तो डिफ़ॉल्ट रूप से उस पॉड में सभी कंटेनरों की पुल नीति `IfNotPresent` पर सेट हो जाएगी यदि यह स्पष्ट रूप से निर्दिष्ट नहीं है। यह नीति
{{<glossary_tooltip text="कुबलेट" term_id="kubelet">}}  को किसी इमेज को खींचने से रोकती है 
यदि वह पहले से मौजूद है।

### इमेज पुल नीति

जब [कुबलेट](/docs/reference/command-line-tools-reference/kubelet/) निर्दिष्ट इमेज को खींचने (डाउनलोड करने) का प्रयास करता है, तो कंटेनर के लिए `imagePullPolicy` और इमेज का टैग प्रभावित होता है।

यहाँ उन मानों की सूची दी गई है जिन्हें आप `imagePullPolicy` के लिए सेट कर सकते हैं और इन मानों के क्या प्रभाव होते हैं:

`IfNotPresent`
: इमेज तभी खींची जाती है जब वह पहले से स्थानीय रूप से मौजूद न हो।

`Always`
: जब भी कुबलेट कंटेनर लॉन्च करता है, तो कुबलेट नाम को इमेज [डाइजेस्ट](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier) ​​में हल करने के लिए कंटेनर इमेज रजिस्ट्री से क्वेरी करता है। यदि क्यूबलेट में स्थानीय रूप से कैश की गई उस सटीक डाइजेस्ट वाली कंटेनर इमेज है, तो क्यूबलेट अपनी कैश की गई इमेज का उपयोग करता है; अन्यथा, क्यूबलेट हल किए गए डाइजेस्ट के साथ इमेज को खींचता है, और कंटेनर को लॉन्च करने के लिए उस इमेज का उपयोग करता है।

`कभी नहीं`
: क्यूबलेट इमेज को लाने का प्रयास नहीं करता है। यदि इमेज किसी तरह पहले से ही स्थानीय रूप से मौजूद है, तो क्यूबलेट कंटेनर को शुरू करने का प्रयास करता है; अन्यथा, स्टार्टअप विफल हो जाता है। अधिक विवरण के लिए [प्री-पुलड इमेज](#pre-pulled-images) देखें।

अंतर्निहित इमेज प्रदाता के कैशिंग शब्दार्थ `imagePullPolicy: Always` को भी कुशल बनाते हैं, जब तक कि रजिस्ट्री विश्वसनीय रूप से सुलभ हो।

आपका कंटेनर रनटाइम यह नोटिस कर सकता है कि इमेज परतें पहले से ही नोड पर मौजूद हैं, ताकि उन्हें फिर से डाउनलोड करने की आवश्यकता न हो।

{{< note >}}
उत्पादन में कंटेनरों को तैनात करते समय आपको `:latest` टैग का उपयोग करने से बचना चाहिए क्योंकि यह ट्रैक करना कठिन है कि इमेज का कौन सा संस्करण चल रहा है और ठीक से रोल बैक करना अधिक कठिन है।

इसके बजाय, `v1.42.0` और/या डाइजेस्ट जैसे सार्थक टैग निर्दिष्ट करें।
{{< /note >}}

यह सुनिश्चित करने के लिए कि पॉड हमेशा कंटेनर इमेज के समान संस्करण का उपयोग करता है, 
आप इमेज के डाइजेस्ट को निर्दिष्ट कर सकते हैं; `<image-name>:<tag>` को 
`<image-name>@<digest>` से बदलें।

(उदाहरण के लिए, 
`image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`)।

इमेज टैग का उपयोग करते समय, यदि इमेज रजिस्ट्री उस कोड को बदल देती है जिसे उस इमेज पर टैग दर्शाता है, तो आपको पुराने और नए कोड को चलाने वाले पॉड का मिश्रण मिल सकता है। एक इमेज डाइजेस्ट
इमेज के एक विशिष्ट संस्करण को विशिष्ट रूप से पहचानता है, इसलिए कुबेरनेटेस हर बार उस इमेज नाम और डाइजेस्ट के साथ कंटेनर शुरू करने पर एक ही कोड चलाता है। डाइजेस्ट द्वारा इमेज निर्दिष्ट करना
आपके द्वारा चलाए जाने वाले कोड को ठीक करता है ताकि रजिस्ट्री में कोई परिवर्तन संस्करणों के उस मिश्रण को जन्म न दे सके।

ऐसे तृतीय-पक्ष [प्रवेश नियंत्रक](/docs/reference/access-authn-authz/admission-controllers/) हैं,
जो पॉड्स (और पॉड टेम्प्लेट) को बनाते समय उन्हें बदल देते हैं, ताकि चल रहे कार्यभार को टैग के बजाय इमेज डाइजेस्ट के आधार पर परिभाषित किया जा सके।
यह उपयोगी हो सकता है यदि आप यह सुनिश्चित करना चाहते हैं कि आपका सारा कार्यभार एक ही कोड चला रहा है, चाहे रजिस्ट्री में कोई भी टैग परिवर्तन क्यों न हो।

#### डिफ़ॉल्ट इमेज पुल नीति {#imagepullpolicy-defaulting}

जब आप (या कोई नियंत्रक) API सर्वर पर कोई नया पॉड सबमिट करते हैं, तो आपका क्लस्टर विशिष्ट शर्तें पूरी होने पर `imagePullPolicy` फ़ील्ड सेट करता है:

- यदि आप `imagePullPolicy` फ़ील्ड को छोड़ देते हैं, और आप कंटेनर इमेज के लिए डाइजेस्ट निर्दिष्ट करते हैं, तो `imagePullPolicy` स्वचालित रूप से `IfNotPresent` पर सेट हो जाती है।
- यदि आप `imagePullPolicy` फ़ील्ड को छोड़ देते हैं, और कंटेनर इमेज के लिए टैग `:latest` है, तो `imagePullPolicy` स्वचालित रूप से `Always` पर सेट हो जाती है;
- यदि आप `imagePullPolicy` फ़ील्ड को छोड़ देते हैं, और आप कंटेनर इमेज के लिए टैग निर्दिष्ट नहीं करते हैं, तो `imagePullPolicy` स्वचालित रूप से `Always` पर सेट हो जाती है;
- यदि आप `imagePullPolicy` फ़ील्ड को छोड़ देते हैं, और आप कंटेनर इमेज के लिए टैग निर्दिष्ट करते हैं जो `:latest` नहीं है, तो `imagePullPolicy` स्वचालित रूप से `IfNotPresent` पर सेट हो जाती है।

{{< note >}}
कंटेनर के `imagePullPolicy` का मान हमेशा तब सेट होता है जब ऑब्जेक्ट पहली बार _बनाया_ जाता है, और यदि इमेज का टैग या डाइजेस्ट बाद में बदलता है तो अपडेट नहीं होता है।

उदाहरण के लिए, यदि आप ऐसी इमेज के साथ परिनियोजन बनाते हैं जिसका टैग _नहीं_ `:latest` है, और बाद में उस परिनियोजन की इमेज को `:latest` टैग में अपडेट करते हैं, तो `imagePullPolicy` फ़ील्ड _नहीं_ बदलकर `Always` हो जाएगी। आपको किसी भी ऑब्जेक्ट की प्रारंभिक रचना के बाद उसकी पुल नीति को मैन्युअल रूप से बदलना होगा।
{{< /note >}}

#### आवश्यक इमेज पुल

यदि आप हमेशा पुल को बाध्य करना चाहते हैं, तो आप निम्न में से कोई एक कर सकते हैं:

- कंटेनर के `imagePullPolicy` को `Always` पर सेट करें।

- `imagePullPolicy` को छोड़ दें और उपयोग की जाने वाली इमेज के लिए टैग के रूप में `:latest` का उपयोग करें; जब आप पॉड सबमिट करेंगे, तो Kubernetes नीति को `Always` पर सेट कर देगा।

- `imagePullPolicy` और उपयोग की जाने वाली इमेज के लिए टैग को छोड़ दें;

जब आप पॉड सबमिट करेंगे, तो Kubernetes नीति को `Always` पर सेट कर देगा।

- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) एडमिशन कंट्रोलर को सक्षम करें।

### ImagePullBackOff

जब कोई क्यूबलेट कंटेनर रनटाइम का उपयोग करके पॉड के लिए कंटेनर बनाना शुरू करता है, तो यह संभव है कि कंटेनर `ImagePullBackOff` के कारण [प्रतीक्षा](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting) स्थिति में हो।

स्थिति `ImagePullBackOff` का अर्थ है कि कंटेनर शुरू नहीं हो सका क्योंकि Kubernetes कंटेनर इमेज को खींच नहीं सका (अमान्य इमेज नाम, या `imagePullSecret` के बिना निजी रजिस्ट्री से खींचने जैसे कारणों से)। `BackOff` भाग इंगित करता है कि Kubernetes इमेज को खींचने का प्रयास करता रहेगा, जिसमें बैक-ऑफ विलंब बढ़ता रहेगा।

Kubernetes प्रत्येक प्रयास के बीच विलंब को तब तक बढ़ाता है जब तक कि यह संकलित-सीमा तक नहीं पहुँच जाता, जो 300 सेकंड (5 मिनट) है।

### Image pull per runtime class

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}
Kubernetes includes alpha support for performing image pulls based on the RuntimeClass of a Pod.

If you enable the `RuntimeClassInImageCriApi` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the kubelet references container images by a tuple of (image name, runtime handler) rather than just the
image name or digest. Your {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
may adapt its behavior based on the selected runtime handler.
Pulling images based on runtime class will be helpful for VM based containers like windows hyperV containers.

## Serial and parallel image pulls

By default, kubelet pulls images serially. In other words, kubelet sends only
one image pull request to the image service at a time. Other image pull requests
have to wait until the one being processed is complete.

Nodes make image pull decisions in isolation. Even when you use serialized image
pulls, two different nodes can pull the same image in parallel.

If you would like to enable parallel image pulls, you can set the field
`serializeImagePulls` to false in the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
With `serializeImagePulls` set to false, image pull requests will be sent to the image service immediately,
and multiple images will be pulled at the same time.

When enabling parallel image pulls, please make sure the image service of your
container runtime can handle parallel image pulls.

The kubelet never pulls multiple images in parallel on behalf of one Pod. For example,
if you have a Pod that has an init container and an application container, the image
pulls for the two containers will not be parallelized. However, if you have two
Pods that use different images, the kubelet pulls the images in parallel on
behalf of the two different Pods, when parallel image pulls is enabled.

### Maximum parallel image pulls

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

When `serializeImagePulls` is set to false, the kubelet defaults to no limit on the
maximum number of images being pulled at the same time. If you would like to
limit the number of parallel image pulls, you can set the field `maxParallelImagePulls`
in kubelet configuration. With `maxParallelImagePulls` set to _n_, only _n_ images
can be pulled at the same time, and any image pull beyond _n_ will have to wait
until at least one ongoing image pull is complete.

Limiting the number parallel image pulls would prevent image pulling from consuming
too much network bandwidth or disk I/O, when parallel image pulling is enabled.

You can set `maxParallelImagePulls` to a positive number that is greater than or
equal to 1. If you set `maxParallelImagePulls` to be greater than or equal to 2, you
must set the `serializeImagePulls` to false. The kubelet will fail to start with invalid
`maxParallelImagePulls` settings.

## Multi-architecture images with image indexes

As well as providing binary images, a container registry can also serve a
[container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md).
An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
for architecture-specific versions of a container. The idea is that you can have a name for an image
(for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to
fetch the right binary image for the machine architecture they are using.

Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward
compatibility, please generate the older images with suffixes. The idea is to generate say `pause`
image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards
compatible for older configurations or YAML files which may have hard coded the images with
suffixes.

## Using a private registry

Private registries may require keys to read images from them.  
Credentials can be provided in several ways:

- Configuring Nodes to Authenticate to a Private Registry
  - all pods can read any configured private registries
  - requires node configuration by cluster administrator
- Kubelet Credential Provider to dynamically fetch credentials for private registries
  - kubelet can be configured to use credential provider exec plugin 
    for the respective private registry.
- Pre-pulled Images
  - all pods can use any images cached on a node
  - requires root access to all nodes to set up
- Specifying ImagePullSecrets on a Pod
  - only pods which provide own keys can access the private registry
- Vendor-specific or local extensions
  - if you're using a custom node configuration, you (or your cloud
    provider) can implement your mechanism for authenticating the node
    to the container registry.

These options are explained in more detail below.

### Configuring nodes to authenticate to a private registry

Specific instructions for setting credentials depends on the container runtime and registry you
chose to use. You should refer to your solution's documentation for the most accurate information.

For an example of configuring a private container image registry, see the
[Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)
task. That example uses a private registry in Docker Hub.

### Kubelet credential provider for authenticated image pulls {#kubelet-credential-provider}

{{< note >}}
This approach is especially suitable when kubelet needs to fetch registry credentials dynamically.
Most commonly used for registries provided by cloud providers where auth tokens are short-lived. 
{{< /note >}}

You can configure the kubelet to invoke a plugin binary to dynamically fetch registry credentials for a container image.
This is the most robust and versatile way to fetch credentials for private registries, but also requires kubelet-level configuration to enable.

See [Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/) for more details.

### Interpretation of config.json {#config-json}

The interpretation of `config.json` varies between the original Docker
implementation and the Kubernetes interpretation. In Docker, the `auths` keys
can only specify root URLs, whereas Kubernetes allows glob URLs as well as
prefix-matched paths. The only limitation is that glob patterns (`*`) have to
include the dot (`.`) for each subdomain. The amount of matched subdomains has
to be equal to the amount of glob patterns (`*.`), for example:

- `*.kubernetes.io` will *not* match `kubernetes.io`, but `abc.kubernetes.io`
- `*.*.kubernetes.io` will *not* match `abc.kubernetes.io`, but `abc.def.kubernetes.io`
- `prefix.*.io` will match `prefix.kubernetes.io`
- `*-good.kubernetes.io` will match `prefix-good.kubernetes.io`

This means that a `config.json` like this is valid:

```json
{
    "auths": {
        "my-registry.io/images": { "auth": "…" },
        "*.my-registry.io/images": { "auth": "…" }
    }
}
```

Image pull operations would now pass the credentials to the CRI container
runtime for every valid pattern. For example the following container image names
would match successfully:

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`

But not:

- `a.sub.my-registry.io/images/my-image`
- `a.b.sub.my-registry.io/images/my-image`

The kubelet performs image pulls sequentially for every found credential. This
means, that multiple entries in `config.json` for different paths are possible, too:

```json
{
    "auths": {
        "my-registry.io/images": {
            "auth": "…"
        },
        "my-registry.io/images/subpath": {
            "auth": "…"
        }
    }
}
```

If now a container specifies an image `my-registry.io/images/subpath/my-image`
to be pulled, then the kubelet will try to download them from both
authentication sources if one of them fails.

### Pre-pulled images

{{< note >}}
This approach is suitable if you can control node configuration.  It
will not work reliably if your cloud provider manages nodes and replaces
them automatically.
{{< /note >}}

By default, the kubelet tries to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).

If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a
private registry.

All pods will have read access to any pre-pulled images.

### Specifying imagePullSecrets on a Pod

{{< note >}}
This is the recommended approach to run containers based on images
in private registries.
{{< /note >}}

Kubernetes supports specifying container image registry keys on a Pod.
`imagePullSecrets` must all be in the same namespace as the Pod. The referenced
Secrets must be of type `kubernetes.io/dockercfg` or `kubernetes.io/dockerconfigjson`.

#### Creating a Secret with a Docker config

You need to know the username, registry password and client email address for authenticating
to the registry, as well as its hostname.
Run the following command, substituting the appropriate uppercase values:

```shell
kubectl create secret docker-registry <name> \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-password=DOCKER_PASSWORD \
  --docker-email=DOCKER_EMAIL
```

If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
explains how to set this up.

This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.

{{< note >}}
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
{{< /note >}}

#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a Pod definition. Each item in the `imagePullSecrets` array can only
reference a Secret in the same namespace.

For example:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

This needs to be done for each pod that is using a private registry.

However, setting of this field can be automated by setting the imagePullSecrets
in a [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/) resource.

Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.

## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.

1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images from a public registry
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves
       availability and reduces the time to pull images.
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private registry
     - Manual configuration may be required on the nodes that need to access to private registry
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Use a hosted container image registry service that controls image access
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
     is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each
     tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.

If you need access to multiple registries, you can create one secret for each registry.

## Legacy built-in kubelet credential provider

In older versions of Kubernetes, the kubelet had a direct integration with cloud provider credentials.
This gave it the ability to dynamically fetch credentials for image registries.

There were three built-in implementations of the kubelet credential provider integration:
ACR (Azure Container Registry), ECR (Elastic Container Registry), and GCR (Google Container Registry).

For more information on the legacy mechanism, read the documentation for the version of Kubernetes that you
are using. Kubernetes v1.26 through to v{{< skew latestVersion >}} do not include the legacy mechanism, so
you would need to either:
- configure a kubelet image credential provider on each node
- specify image pull credentials using `imagePullSecrets` and at least one Secret

## {{% heading "whatsnext" %}}

* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md).
* Learn about [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Learn more about [pulling an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry).
