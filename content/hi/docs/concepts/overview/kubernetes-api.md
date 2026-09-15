---
reviewers:
- chenopis
title: कुबेरनेट्स API (The Kubernetes API)
content_type: concept
weight: 40
description: >
  कुबेरनेट्स API आपको कुबेरनेट्स में ऑब्जेक्ट्स की स्थिति को क्वेरी करने और हेरफेर करने की अनुमति देता है।
  कुबेरनेट्स के कंट्रोल प्लेन का मूल API सर्वर और HTTP API है जिसे यह एक्सपोज़ करता है। उपयोगकर्ता, आपके क्लस्टर के विभिन्न भाग, और बाहरी घटक सभी API सर्वर के माध्यम से एक-दूसरे के साथ संवाद करते हैं।
card:
  name: concepts
  weight: 30
---

<!-- overview -->

कुबेरनेट्स के {{< glossary_tooltip text="कंट्रोल प्लेन (control plane)" term_id="control-plane" >}} का मूल
{{< glossary_tooltip text="API सर्वर (API server)" term_id="kube-apiserver" >}} है। API सर्वर
एक HTTP API एक्सपोज़ करता है जो अंतिम उपयोगकर्ताओं, आपके क्लस्टर के विभिन्न भागों, और
बाहरी घटकों को एक-दूसरे के साथ संवाद करने की अनुमति देता है।

कुबेरनेट्स API आपको कुबेरनेट्स में API ऑब्जेक्ट्स (उदाहरण के लिए: Pods, Namespaces, ConfigMaps, और Events) की स्थिति को क्वेरी करने और हेरफेर करने की अनुमति देता है।

अधिकांश ऑपरेशन [kubectl](/docs/reference/kubectl/) कमांड-लाइन इंटरफ़ेस या अन्य कमांड-लाइन टूल, जैसे
[kubeadm](/docs/reference/setup-tools/kubeadm/) के माध्यम से किए जा सकते हैं, जो बदले में API का उपयोग करते हैं।
हालाँकि, आप REST कॉल का उपयोग करके सीधे API तक भी पहुँच सकते हैं। जो लोग कुबेरनेट्स API का उपयोग करके एप्लिकेशन लिखना चाहते हैं, उनके लिए कुबेरनेट्स [क्लाइंट लाइब्रेरी (client libraries)](/docs/reference/using-api/client-libraries/) का एक सेट प्रदान करता है।

प्रत्येक कुबेरनेट्स क्लस्टर उन APIs के विनिर्देश (specification) को प्रकाशित करता है जो क्लस्टर प्रदान करता है।
कुबेरनेट्स इन API विनिर्देशों को प्रकाशित करने के लिए दो तंत्रों का उपयोग करता है; दोनों ही स्वचालित अंतरसंचालनीयता (interoperability) को सक्षम करने के लिए उपयोगी हैं। उदाहरण के लिए, `kubectl` टूल कमांड-लाइन पूर्णता और अन्य सुविधाओं को सक्षम करने के लिए API विनिर्देश प्राप्त और कैश (cache) करता है।
दो समर्थित तंत्र इस प्रकार हैं:

- [डिस्कवरी API (The Discovery API)](#discovery-api) कुबेरनेट्स APIs के बारे में जानकारी प्रदान करता है:
  API नाम, संसाधन, संस्करण और समर्थित संचालन। यह एक कुबेरनेट्स विशिष्ट शब्द है क्योंकि यह कुबेरनेट्स OpenAPI से एक अलग API है।
  इसका उद्देश्य उपलब्ध संसाधनों का एक संक्षिप्त सारांश होना है और यह संसाधनों के लिए विशिष्ट स्कीमा का विवरण नहीं देता है। संसाधन स्कीमा के संदर्भ के लिए, कृपया OpenAPI दस्तावेज़ देखें।

- [कुबेरनेट्स OpenAPI दस्तावेज़ (Kubernetes OpenAPI Document)](#openapi-interface-definition) सभी कुबेरनेट्स API एंडपॉइंट्स के लिए (पूर्ण)
  [OpenAPI v2.0 और 3.0 स्कीमा (schemas)](https://www.openapis.org/) प्रदान करता है।
  OpenAPI v3, OpenAPI तक पहुँचने के लिए पसंदीदा तरीका है क्योंकि यह API का अधिक व्यापक और सटीक दृश्य प्रदान करता है। इसमें सभी उपलब्ध API पथ, साथ ही हर एंडपॉइंट पर हर ऑपरेशन के लिए उपयोग किए गए और निर्मित सभी संसाधन शामिल हैं। इसमें ऐसे कोई भी विस्तारणीयता (extensibility) घटक भी शामिल हैं जो एक क्लस्टर समर्थन करता है।
  डेटा एक पूर्ण विनिर्देश है और डिस्कवरी API से काफी बड़ा है।

## डिस्कवरी API (Discovery API)

कुबेरनेट्स डिस्कवरी API के माध्यम से समर्थित सभी समूह संस्करणों और संसाधनों की एक सूची प्रकाशित करता है। इसमें प्रत्येक संसाधन के लिए निम्नलिखित शामिल हैं:

- नाम
- क्लस्टर या नेमस्पेस का दायरा (scope)
- एंडपॉइंट URL और समर्थित वर्ब्स (verbs)
- वैकल्पिक नाम
- समूह, संस्करण, प्रकार (kind)

API समेकित (aggregated) और असमेकित (unaggregated) दोनों रूपों में उपलब्ध है। समेकित डिस्कवरी दो एंडपॉइंट्स प्रदान करती है, जबकि असमेकित डिस्कवरी प्रत्येक समूह संस्करण के लिए एक अलग एंडपॉइंट प्रदान करती है।

### समेकित डिस्कवरी (Aggregated discovery)

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

कुबेरनेट्स _समेकित डिस्कवरी_ के लिए स्थिर समर्थन प्रदान करता है, जो क्लस्टर द्वारा समर्थित सभी संसाधनों को दो एंडपॉइंट्स (`/api` और `/apis`) के माध्यम से प्रकाशित करता है। इस
एंडपॉइंट से अनुरोध करने से क्लस्टर से डिस्कवरी डेटा प्राप्त करने के लिए भेजे गए अनुरोधों की संख्या काफी कम हो जाती है। आप `Accept` हेडर के साथ संबंधित एंडपॉइंट्स से अनुरोध करके डेटा तक पहुँच सकते हैं जो समेकित डिस्कवरी संसाधन को दर्शाता है:
`Accept: application/json;v=v2;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.

`Accept` हेडर का उपयोग करके संसाधन प्रकार को इंगित किए बिना, `/api` और `/apis` एंडपॉइंट के लिए डिफ़ॉल्ट प्रतिक्रिया एक असमेकित डिस्कवरी दस्तावेज़ है।

अंतर्निहित (built-in) संसाधनों के लिए [डिस्कवरी दस्तावेज़ (discovery document)](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2.json) कुबेरनेट्स GitHub रिपॉजिटरी में पाया जा सकता है।
यदि क्वेरी करने के लिए कोई कुबेरनेट्स क्लस्टर उपलब्ध नहीं है, तो इस Github दस्तावेज़ का उपयोग उपलब्ध संसाधनों के आधार सेट के संदर्भ के रूप में किया जा सकता है।

एंडपॉइंट ETag और protobuf एन्कोडिंग का भी समर्थन करता है।

### असमेकित डिस्कवरी (Unaggregated discovery)

डिस्कवरी एकत्रीकरण के बिना, डिस्कवरी को स्तरों (levels) में प्रकाशित किया जाता है, जिसमें रूट एंडपॉइंट्स डाउनस्ट्रीम दस्तावेज़ों के लिए डिस्कवरी जानकारी प्रकाशित करते हैं।

क्लस्टर द्वारा समर्थित सभी समूह संस्करणों की सूची `/api` और `/apis` एंडपॉइंट्स पर प्रकाशित की जाती है। उदाहरण:

```
{
  "kind": "APIGroupList",
  "apiVersion": "v1",
  "groups": [
    {
      "name": "apiregistration.k8s.io",
      "versions": [
        {
          "groupVersion": "apiregistration.k8s.io/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apiregistration.k8s.io/v1",
        "version": "v1"
      }
    },
    {
      "name": "apps",
      "versions": [
        {
          "groupVersion": "apps/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apps/v1",
        "version": "v1"
      }
    },
    ...
}
```

प्रत्येक समूह संस्करण के लिए डिस्कवरी दस्तावेज़ प्राप्त करने के लिए `/apis/<group>/<version>` (उदाहरण के लिए:
`/apis/rbac.authorization.k8s.io/v1alpha1`) पर अतिरिक्त अनुरोधों की आवश्यकता होती है, जो किसी विशेष समूह संस्करण के तहत दिए गए संसाधनों की सूची को विज्ञापित करता है। इन एंडपॉइंट्स का उपयोग क्लस्टर द्वारा समर्थित संसाधनों की सूची प्राप्त करने के लिए kubectl द्वारा किया जाता है।

<!-- body -->

<a id="#api-specification" />

## OpenAPI इंटरफ़ेस परिभाषा (OpenAPI interface definition)

OpenAPI विनिर्देशों के विवरण के लिए, [OpenAPI प्रलेखन (OpenAPI documentation)](https://www.openapis.org/) देखें।

कुबेरनेट्स OpenAPI v2.0 और OpenAPI v3.0 दोनों प्रदान करता है। OpenAPI v3 OpenAPI तक पहुँचने का पसंदीदा तरीका है क्योंकि यह कुबेरनेट्स संसाधनों का अधिक व्यापक (दोषरहित) प्रतिनिधित्व प्रदान करता है। OpenAPI संस्करण 2 की सीमाओं के कारण, प्रकाशित OpenAPI से कुछ फ़ील्ड हटा दिए जाते हैं जिनमें `default`, `nullable`, `oneOf` शामिल हैं, लेकिन ये इन्हीं तक सीमित नहीं हैं।

### OpenAPI V2

कुबेरनेट्स API सर्वर `/openapi/v2` एंडपॉइंट के माध्यम से एक समेकित OpenAPI v2 विनिर्देश प्रदान करता है। आप अनुरोध हेडर का उपयोग करके प्रतिक्रिया प्रारूप (response format) का अनुरोध कर सकते हैं:

<table>
  <caption style="display:none">OpenAPI v2 क्वेरी के लिए मान्य अनुरोध हेडर मान</caption>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">संभावित मान (Possible values)</th>
        <th>नोट (Notes)</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>इस हेडर की आपूर्ति न करना भी स्वीकार्य है</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>मुख्य रूप से इंट्रा-क्लस्टर उपयोग के लिए</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>डिफ़ॉल्ट</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em><code>application/json</code> प्रदान करता है</em></td>
     </tr>
  </tbody>
</table>

{{< warning >}}
OpenAPI स्कीमा के हिस्से के रूप में प्रकाशित सत्यापन (validation) नियम पूर्ण नहीं हो सकते हैं, और आमतौर पर नहीं होते हैं।
अतिरिक्त सत्यापन API सर्वर के भीतर होता है। यदि आप सटीक और पूर्ण सत्यापन चाहते हैं,
तो `kubectl apply --dry-run=server` सभी लागू सत्यापन चलाता है (और प्रवेश-समय (admission-time) जांच को भी सक्रिय करता है)।
{{< /warning >}}

### OpenAPI V3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

कुबेरनेट्स अपने API के विवरण को OpenAPI v3 के रूप में प्रकाशित करने का समर्थन करता है।

उपलब्ध सभी समूहों/संस्करणों की सूची देखने के लिए एक डिस्कवरी एंडपॉइंट `/openapi/v3` प्रदान किया गया है। यह एंडपॉइंट केवल JSON लौटाता है। ये समूह/संस्करण निम्नलिखित प्रारूप में दिए गए हैं:

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- for editors: intentionally use yaml instead of json here, to prevent syntax highlight error. -->

क्लाइंट-साइड कैशिंग में सुधार करने के लिए, संबंधित URL अपरिवर्तनीय (immutable) OpenAPI विवरणों की ओर इशारा कर रहे हैं। उस उद्देश्य के लिए API सर्वर द्वारा उचित HTTP कैशिंग हेडर भी सेट किए गए हैं (भविष्य में 1 वर्ष के लिए `Expires`, और `immutable` के लिए `Cache-Control`)। जब किसी अप्रचलित URL का उपयोग किया जाता है, तो API सर्वर नवीनतम URL पर पुनर्निर्देशन (redirect) लौटाता है।

कुबेरनेट्स API सर्वर `/openapi/v3/apis/<group>/<version>?hash=<hash>` एंडपॉइंट पर प्रति कुबेरनेट्स समूह संस्करण के लिए एक OpenAPI v3 विनिर्देश प्रकाशित करता है।

स्वीकृत अनुरोध हेडर के लिए नीचे दी गई तालिका देखें।

<table>
  <caption style="display:none">OpenAPI v3 क्वेरी के लिए मान्य अनुरोध हेडर मान</caption>
  <thead>
     <tr>
        <th>Header</th>
        <th style="min-width: 50%;">संभावित मान (Possible values)</th>
        <th>नोट (Notes)</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>इस हेडर की आपूर्ति न करना भी स्वीकार्य है</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em>मुख्य रूप से इंट्रा-क्लस्टर उपयोग के लिए</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>डिफ़ॉल्ट</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em><code>application/json</code> प्रदान करता है</em></td>
     </tr>
  </tbody>
</table>

OpenAPI V3 प्राप्त करने के लिए एक Golang कार्यान्वयन [`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3) पैकेज में प्रदान किया गया है।

कुबेरनेट्स {{< skew currentVersion >}} OpenAPI v2.0 और v3.0 प्रकाशित करता है; निकट भविष्य में 3.1 का समर्थन करने की कोई योजना नहीं है।

### Protobuf क्रमांकन (Protobuf serialization)

कुबेरनेट्स एक वैकल्पिक Protobuf आधारित क्रमांकन (serialization) प्रारूप को लागू करता है जो मुख्य रूप से इंट्रा-क्लस्टर संचार के लिए है। इस प्रारूप के बारे में अधिक जानकारी के लिए, [कुबेरनेट्स Protobuf क्रमांकन (Kubernetes Protobuf serialization)](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) डिज़ाइन प्रस्ताव और Go पैकेज में स्थित प्रत्येक स्कीमा के लिए इंटरफ़ेस परिभाषा भाषा (IDL) फ़ाइलें देखें जो API ऑब्जेक्ट को परिभाषित करती हैं।

## दृढ़ता (Persistence)

कुबेरनेट्स ऑब्जेक्ट्स की क्रमबद्ध (serialized) स्थिति को {{< glossary_tooltip term_id="etcd" >}} में लिखकर सहेजता है।

## API समूह और संस्करण (API groups and versioning)

फ़ील्ड को समाप्त करना या संसाधन निरूपण (resource representations) को पुनर्गठित करना आसान बनाने के लिए, कुबेरनेट्स कई API संस्करणों का समर्थन करता है, प्रत्येक एक अलग API पथ पर, जैसे कि `/api/v1` या `/apis/rbac.authorization.k8s.io/v1alpha1`।

संस्करण (Versioning) संसाधन या फ़ील्ड स्तर के बजाय API स्तर पर किया जाता है ताकि यह सुनिश्चित हो सके कि API सिस्टम संसाधनों और व्यवहार का स्पष्ट, सुसंगत दृश्य प्रस्तुत करता है, और एंड-ऑफ़-लाइफ़ और/या प्रायोगिक (experimental) APIs तक पहुँच को नियंत्रित करने में सक्षम बनाता है।

इसके API को विकसित करने और विस्तारित करने में आसान बनाने के लिए, कुबेरनेट्स [API समूह (API groups)](/docs/reference/using-api/#api-groups) लागू करता है जिन्हें [सक्षम या अक्षम (enabled or disabled)](/docs/reference/using-api/#enabling-or-disabling) किया जा सकता है।

API संसाधनों को उनके API समूह, संसाधन प्रकार, नेमस्पेस (नेमस्पेस्ड संसाधनों के लिए), और नाम से अलग किया जाता है। API सर्वर पारदर्शी रूप से API संस्करणों के बीच रूपांतरण को संभालता है: सभी विभिन्न संस्करण वास्तव में एक ही निरंतर (persisted) डेटा का प्रतिनिधित्व करते हैं। API सर्वर कई API संस्करणों के माध्यम से एक ही अंतर्निहित (underlying) डेटा प्रदान कर सकता है।

उदाहरण के लिए, मान लें कि एक ही संसाधन के लिए दो API संस्करण, `v1` और `v1beta1` हैं। यदि आपने मूल रूप से इसके API के `v1beta1` संस्करण का उपयोग करके एक ऑब्जेक्ट बनाया है, तो आप बाद में उस ऑब्जेक्ट को `v1beta1` या `v1` API संस्करण का उपयोग करके पढ़, अपडेट या हटा सकते हैं, जब तक कि `v1beta1` संस्करण को बहिष्कृत (deprecated) और हटा नहीं दिया जाता है। उस समय आप `v1` API का उपयोग करके ऑब्जेक्ट तक पहुँचना और उसे संशोधित करना जारी रख सकते हैं।

### API परिवर्तन (API changes)

कोई भी सिस्टम जो सफल है उसे बढ़ने और बदलने की आवश्यकता होती है क्योंकि नए उपयोग के मामले सामने आते हैं या मौजूदा मामले बदलते हैं। इसलिए, कुबेरनेट्स ने कुबेरनेट्स API को लगातार बदलने और बढ़ने के लिए डिज़ाइन किया है। कुबेरनेट्स प्रोजेक्ट का उद्देश्य मौजूदा क्लाइंट्स के साथ अनुकूलता (compatibility) को _नहीं_ तोड़ना है, और उस अनुकूलता को कुछ समय के लिए बनाए रखना है ताकि अन्य प्रोजेक्ट्स को अनुकूल होने का अवसर मिल सके।

सामान्य तौर पर, नए API संसाधन और नए संसाधन फ़ील्ड अक्सर जोड़े जा सकते हैं। संसाधनों या फ़ील्ड को समाप्त करने के लिए [API बहिष्करण नीति (API deprecation policy)](/docs/reference/using-api/deprecation-policy/) का पालन करना आवश्यक है।

कुबेरनेट्स आधिकारिक कुबेरनेट्स APIs के लिए अनुकूलता बनाए रखने की एक मजबूत प्रतिबद्धता रखता है, एक बार जब वे सामान्य उपलब्धता (GA) तक पहुँच जाते हैं, आमतौर पर API संस्करण `v1` पर। इसके अतिरिक्त, कुबेरनेट्स आधिकारिक कुबेरनेट्स APIs के _beta_ API संस्करणों के माध्यम से सहेजे गए डेटा के साथ अनुकूलता बनाए रखता है, और यह सुनिश्चित करता है कि जब सुविधा स्थिर हो जाती है तो GA API संस्करणों के माध्यम से डेटा को परिवर्तित और एक्सेस किया जा सकता है।

यदि आप एक बीटा API संस्करण अपनाते हैं, तो API के स्नातक (graduates) होने के बाद आपको बाद के बीटा या स्थिर API संस्करण में संक्रमण करना होगा। ऐसा करने का सबसे अच्छा समय तब होता है जब बीटा API अपनी बहिष्करण अवधि (deprecation period) में होता है, क्योंकि ऑब्जेक्ट्स दोनों API संस्करणों के माध्यम से एक साथ सुलभ होते हैं। एक बार जब बीटा API अपनी बहिष्करण अवधि पूरी कर लेता है और अब परोसा नहीं जाता है, तो प्रतिस्थापन API संस्करण का उपयोग किया जाना चाहिए।

{{< note >}}
हालाँकि कुबेरनेट्स _alpha_ APIs संस्करणों के लिए भी अनुकूलता बनाए रखने का लक्ष्य रखता है, लेकिन कुछ परिस्थितियों में यह संभव नहीं है। यदि आप किसी अल्फा API संस्करण का उपयोग करते हैं, तो अपने क्लस्टर को अपग्रेड करते समय कुबेरनेट्स के लिए रिलीज़ नोट्स देखें, यदि API असंगत तरीकों से बदल गया है जिसके लिए अपग्रेड करने से पहले सभी मौजूदा अल्फा ऑब्जेक्ट्स को हटाने की आवश्यकता है।
{{< /note >}}

API संस्करण स्तर की परिभाषाओं के अधिक विवरण के लिए [API संस्करण संदर्भ (API versions reference)](/docs/reference/using-api/#api-versioning) देखें।

## API विस्तार (API Extension)

कुबेरनेट्स API को दो में से एक तरीके से बढ़ाया जा सकता है:

1. [कस्टम संसाधन (Custom resources)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) आपको घोषणात्मक रूप से परिभाषित करने देते हैं कि API सर्वर को आपके चुने हुए संसाधन API को कैसे प्रदान करना चाहिए।
2. आप एक [एग्रीगेशन लेयर (aggregation layer)](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) को लागू करके कुबेरनेट्स API का विस्तार भी कर सकते हैं।

## {{% heading "whatsnext" %}}

- अपना स्वयं का [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) जोड़कर कुबेरनेट्स API का विस्तार करना सीखें।
- [कुबेरनेट्स API तक पहुँच को नियंत्रित करना (Controlling Access To The Kubernetes API)](/docs/concepts/security/controlling-access/) वर्णन करता है कि क्लस्टर API पहुँच के लिए प्रमाणीकरण और प्राधिकरण को कैसे प्रबंधित करता है।
- [API संदर्भ (API Reference)](/docs/reference/kubernetes-api/) पढ़कर API एंडपॉइंट्स, संसाधन प्रकारों और नमूनों के बारे में जानें।
- [API परिवर्तनों (API changes)](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme) से जानें कि एक संगत परिवर्तन क्या होता है, और API को कैसे बदलना है।
