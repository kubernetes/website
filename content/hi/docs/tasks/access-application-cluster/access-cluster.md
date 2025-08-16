---
title: क्लस्टर्स तक पहुंच
weight: 20
content_type: concept
---

<!-- अवलोकन -->

यह विषय क्लस्टर्स के साथ इंटरैक्ट करने के कई तरीकों पर चर्चा करता है।

<!-- मुख्य भाग -->

## पहली बार kubectl के साथ पहुंचना

जब पहली बार कुबेरनेट्स API तक पहुंच रहे हों, तो हम कुबेरनेट्स CLI, `kubectl` का उपयोग करने की सलाह देते हैं।

क्लस्टर तक पहुंचने के लिए, आपको क्लस्टर का स्थान और इसे एक्सेस करने के लिए क्रेडेंशियल्स जानने की आवश्यकता होती है। आमतौर पर, यह स्वचालित रूप से सेटअप हो जाता है जब आप [शुरुआती गाइड](/docs/setup/) से गुजरते हैं, या किसी और ने क्लस्टर सेटअप किया है और आपको क्रेडेंशियल्स और स्थान प्रदान किया है।

kubectl के बारे में ज्ञात स्थान और क्रेडेंशियल्स की जांच इस कमांड से करें:

```shell
kubectl config view
```

कई [उदाहरण](/docs/reference/kubectl/quick-reference/) `kubectl` का उपयोग करने का परिचय प्रदान करते हैं, और पूरी डाक्यूमेंटेशन [kubectl संदर्भ](/docs/reference/kubectl/) में पाई जा सकती है।

## REST API तक सीधे पहुंच

Kubectl apiserver को ढूंढने और प्रमाणित करने का कार्य करता है। यदि आप curl या wget जैसे http क्लाइंट, या ब्राउज़र के साथ सीधे REST API तक पहुंचना चाहते हैं, तो इसे ढूंढने और प्रमाणित करने के कई तरीके हैं:

- kubectl को प्रॉक्सी मोड में चलाएं।
  - अनुशंसित तरीका।
  - संग्रहीत apiserver स्थान का उपयोग करता है।
  - स्व-हस्ताक्षरित प्रमाणपत्र का उपयोग करके apiserver की पहचान सत्यापित करता है। MITM संभव नहीं।
  - apiserver को प्रमाणित करता है।
  - भविष्य में, बुद्धिमान क्लाइंट-साइड लोड-बैलेंसिंग और फेलओवर कर सकता है।
- स्थान और क्रेडेंशियल्स को सीधे http क्लाइंट को प्रदान करें।
  - वैकल्पिक तरीका।
  - कुछ प्रकार के क्लाइंट कोड के साथ काम करता है जो प्रॉक्सी का उपयोग करने से भ्रमित हो सकते हैं।
  - MITM से बचाने के लिए अपने ब्राउज़र में एक रूट प्रमाणपत्र आयात करने की आवश्यकता है।

### kubectl प्रॉक्सी का उपयोग करना

निम्नलिखित कमांड kubectl को एक रिवर्स प्रॉक्सी के रूप में चलाने के लिए उपयोग करता है। यह apiserver को ढूंढने और प्रमाणित करने का कार्य करता है। इसे इस तरह चलाएं:

```shell
kubectl proxy --port=8080
```

अधिक विवरण के लिए [kubectl प्रॉक्सी](/docs/reference/generated/kubectl/kubectl-commands/#proxy) देखें।

फिर आप curl, wget, या ब्राउज़र के साथ API का पता लगा सकते हैं, IPv6 के लिए localhost को [::1] से बदलते हुए, इस प्रकार:

```shell
curl http://localhost:8080/api/
```

आउटपुट इस प्रकार होगा:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

### kubectl प्रॉक्सी के बिना

`kubectl apply` और `kubectl describe secret...` का उपयोग करके डिफ़ॉल्ट सेवा खाता के लिए एक टोकन बनाएं और grep/cut का उपयोग करें:

पहले, डिफ़ॉल्ट ServiceAccount के लिए टोकन का अनुरोध करते हुए Secret बनाएं:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: default-token
  annotations:
    कुबेरनेट्स.io/service-account.name: default
type: कुबेरनेट्स.io/service-account-token
EOF
```

अगला, टोकन नियंत्रक को Secret को टोकन से भरने के लिए प्रतीक्षा करें:

```shell
while ! kubectl describe secret default-token | grep -E '^token' >/dev/null; do
  echo "waiting for token..." >&2
  sleep 1
done
```

जनरेट किए गए टोकन को कैप्चर करें और उपयोग करें:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
TOKEN=$(kubectl describe secret default-token | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

आउटपुट इस प्रकार होगा:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

`jsonpath` का उपयोग करते हुए:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
TOKEN=$(kubectl get secret default-token -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

आउटपुट इस प्रकार होगा:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

ऊपर दिए गए उदाहरण `--insecure` फ्लैग का उपयोग करते हैं। यह इसे MITM हमलों के लिए असुरक्षित बनाता है। जब kubectl क्लस्टर तक पहुंचता है तो यह संग्रहीत रूट प्रमाणपत्र और क्लाइंट प्रमाणपत्रों का उपयोग करता है। (ये `~/.kube` निर्देशिका में स्थापित होते हैं)। चूंकि क्लस्टर प्रमाणपत्र आमतौर पर स्व-हस्ताक्षरित होते हैं, आपके http क्लाइंट को रूट प्रमाणपत्र का उपयोग करने के लिए विशेष कॉन्फ़िगरेशन की आवश्यकता हो सकती है।

कुछ क्लस्टर्स पर, apiserver को प्रमाणीकरण की आवश्यकता नहीं होती है; यह localhost पर सेवा दे सकता है, या फ़ायरवॉल द्वारा संरक्षित हो सकता है। इसके लिए कोई मानक नहीं है। [API तक पहुंच को नियंत्रित करना](/docs/concepts/security/controlling-access) वर्णन करता है कि क्लस्टर एडमिन इसे कैसे कॉन्फ़िगर कर सकता है।

## API तक प्रोग्रामेटिक पहुंच

कुबेरनेट्स आधिकारिक तौर पर [Go](#go-client) और [Python](#python-client) क्लाइंट लाइब्रेरी का समर्थन करता है।

### Go क्लाइंट

* लाइब्रेरी प्राप्त करने के लिए, निम्नलिखित कमांड चलाएं: `go get k8s.io/client-go@कुबेरनेट्स-<कुबेरनेट्स-version-number>`,
  विस्तृत इंस्टॉलेशन निर्देशों के लिए [INSTALL.md](https://github.com/कुबेरनेट्स/client-go/blob/master/INSTALL.md#for-the-casual-user) देखें। समर्थित संस्करणों को देखने के लिए [https://github.com/कुबेरनेट्स/client-go](https://github.com/कुबेरनेट्स/client-go#compatibility-matrix) देखें।
* क्लाइंट-go क्लाइंट्स के ऊपर एक एप्लिकेशन लिखें। ध्यान दें कि client-go अपनी API ऑब्जेक्ट्स को परिभाषित करता है, इसलिए यदि आवश्यक हो, तो कृपया मुख्य रिपॉजिटरी के बजाय client-go से API परिभाषाओं को आयात करें, जैसे `import "k8s.io/client-go/कुबेरनेट्स"` सही है।

Go क्लाइंट kubectl CLI के समान [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग apiserver को ढूंढने और प्रमाणित करने के लिए कर सकता है। इस [उदाहरण](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go) को देखें।

यदि एप्लिकेशन क्लस्टर में एक Pod के रूप में तैनात है, तो कृपया [अगला अनुभाग](#accessing-the-api-from-a-pod) देखें।

### Python क्लाइंट

[Python क्लाइंट](https://github.com/कुबेरनेट्स-client/python) का उपयोग करने के लिए, निम्नलिखित कमांड चलाएं: `pip install कुबेरनेट्स`। अधिक इंस्टॉलेशन विकल्पों के लिए [Python क्लाइंट लाइब्रेरी पेज](https://github.com/कुबेरनेट्स-client/python) देखें।

Python क्लाइंट kubectl CLI के समान [kubeconfig फ़ाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) का उपयोग apiserver को ढूंढने और प्रमाणित करने के लिए कर सकता है। इस [उदाहरण](https://github.com/कुबेरनेट्स-client/python/tree/master/examples) को देखें।

### अन्य भाषाएं

अन्य भाषाओं से API तक पहुंचने के लिए [क्लाइंट लाइब्रेरीज़](/docs/reference/using-api/client-libraries/) हैं। वे कैसे प्रमाणित करते हैं, इसके लिए अन्य लाइब्रेरीज़ की डाक्यूमेंटेशन देखें।

## Pod से API तक पहुंच

जब Pod से API तक पहुंच रहे हों, तो API सर्वर को ढूंढने और प्रमाणित करने का तरीका थोड़ा अलग होता है।

कृपया अधिक विवरण के लिए [Pod से API तक पहुंच](/docs/tasks/run-application/access-api-from-pod/) देखें।

## क्लस्टर पर चल रही सेवाओं तक पहुंच

पिछला अनुभाग कुबेरनेट्स API सर्वर से कनेक्ट करने का वर्णन करता है। कुबेरनेट्स क्लस्टर पर चल रही अन्य सेवाओं से कनेक्ट करने के बारे में जानकारी के लिए, [क्लस्टर सेवाओं तक पहुंच](/docs/tasks/access-application-cluster/access-cluster-services/) देखें।

## रीडायरेक्ट्स का अनुरोध करना

रीडायरेक्ट क्षमताओं को हटा दिया गया है। कृपया इसके बजाय प्रॉक्सी का उपयोग करें (नीचे देखें)।

## इतने सारे प्रॉक्सी

कुबेरनेट्स का उपयोग करते समय आप कई प्रकार के प्रॉक्सी का सामना कर सकते हैं:

1. [kubectl प्रॉक्सी](#directly-accessing-the-rest-api):

   - उपयोगकर्ता के डेस्कटॉप या एक Pod में चलता है
   - localhost पते से कुबेरनेट्स apiserver तक प्रॉक्सी करता है
   - क्लाइंट से प्रॉक्सी HTTP का उपयोग करता है
   - प्रॉक्सी से apiserver HTTPS का उपयोग करता है
   - apiserver को ढूंढता है
   - प्रमाणीकरण हेडर जोड़ता है

1. [apiserver प्रॉक्सी](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

   - apiserver में निर्मित एक बास्टियन है
   - क्लस्टर के बाहर के उपयोगकर्ता को क्लस्टर IPs से कनेक्ट करता है जो अन्यथा पहुंच योग्य नहीं हो सकते
   - apiserver प्रक्रियाओं में चलता है
   - क्लाइंट से प्रॉक्सी HTTPS (या यदि apiserver इस प्रकार कॉन्फ़िगर किया गया है तो http) का उपयोग करता है
   - प्रॉक्सी से लक्ष्य तक HTTP या HTTPS का उपयोग कर सकता है जैसा कि उपलब्ध जानकारी का उपयोग करके प्रॉक्सी द्वारा चुना गया है
   - Node, Pod, या Service तक पहुंचने के लिए उपयोग किया जा सकता है
   - Service तक पहुंचने के लिए लोड बैलेंसिंग करता है

1. [kube प्रॉक्सी](/docs/concepts/services-networking/service/#ips-and-vips):

   - प्रत्येक नोड पर चलता है
   - UDP और TCP को प्रॉक्सी करता है
   - HTTP को नहीं समझता
   - लोड बैलेंसिंग प्रदान करता है
   - केवल सेवाओं तक पहुंचने के लिए उपयोग किया जाता है

1. apiserver(s) के सामने एक प्रॉक्सी/लोड-बैलेंसर:

   - अस्तित्व और कार्यान्वयन क्लस्टर से क्लस्टर में भिन्न होता है (जैसे nginx)
   - सभी क्लाइंट्स और एक या अधिक apiservers के बीच बैठता है
   - यदि कई apiservers हैं तो लोड बैलेंसर के रूप में कार्य करता है।

1. बाहरी सेवाओं पर क्लाउड लोड बैलेंसर:

   - कुछ क्लाउड प्रदाताओं द्वारा प्रदान किए जाते हैं (जैसे AWS ELB, Google Cloud Load Balancer)
   - स्वचालित रूप से बनाए जाते हैं जब कुबेरनेट्स सेवा का प्रकार `LoadBalancer` होता है
   - केवल UDP/TCP का उपयोग करते हैं
   - कार्यान्वयन क्लाउड प्रदाता द्वारा भिन्न होता है।

कुबेरनेट्स उपयोगकर्ताओं को आमतौर पर पहले दो प्रकारों के अलावा किसी और चीज़ की चिंता करने की आवश्यकता नहीं होती है। क्लस्टर एडमिन आमतौर पर यह सुनिश्चित करेगा कि बाद के प्रकार सही ढंग से सेटअप किए गए हैं।
