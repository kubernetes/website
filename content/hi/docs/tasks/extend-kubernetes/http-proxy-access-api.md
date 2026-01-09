---
title: HTTP प्रॉक्सी का उपयोग करके कुबेरनेटेस API तक पहुंचें
content_type: task
weight: 20
---

<!-- overview -->
यह पेज दिखाता है कि कुबेरनेटेस API तक पहुंचने के लिए HTTP प्रॉक्सी का उपयोग कैसे करें।

## {{% heading "prerequisites" %}}

आपके पास एक कुबेरनेटेस क्लस्टर होना चाहिए, और kubectl कमांड-लाइन टूल को आपके क्लस्टर के साथ संवाद करने के लिए कॉन्फ़िगर किया जाना चाहिए। इस ट्यूटोरियल को कम से कम दो नोड्स वाले क्लस्टर पर चलाने की सलाह दी जाती है जो कंट्रोल प्लेन होस्ट के रूप में कार्य नहीं कर रहे हैं। यदि आपके पास पहले से कोई क्लस्टर नहीं है, तो आप इसे minikube का उपयोग करके बना सकते हैं या आप इनमें से किसी एक कुबेरनेटेस प्लेग्राउंड का उपयोग कर सकते हैं:

* Killercoda
* KodeKloud
* Play with कुबेरनेटेस

संस्करण की जांच करने के लिए, `kubectl version` दर्ज करें।

यदि आपके क्लस्टर में पहले से कोई एप्लिकेशन नहीं चल रहा है, तो इस कमांड को दर्ज करके एक Hello world एप्लिकेशन शुरू करें:

```shell
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

## kubectl का उपयोग करके प्रॉक्सी सर्वर शुरू करें

यह कमांड कुबेरनेटेस API सर्वर के लिए एक प्रॉक्सी शुरू करता है:

```
kubectl proxy --port=8080
```

## कुबेरनेटेस API का अन्वेषण करें

जब प्रॉक्सी सर्वर चल रहा हो, तो आप `curl`, `wget`, या ब्राउज़र का उपयोग करके API का अन्वेषण कर सकते हैं।

API संस्करण प्राप्त करें:

```
curl http://localhost:8080/api/
```

आउटपुट इस तरह दिखना चाहिए:

```
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.2.15:8443"
    }
  ]
}
```

पॉड्स की सूची प्राप्त करें:

```
curl http://localhost:8080/api/v1/namespaces/default/pods
```

आउटपुट इस तरह दिखना चाहिए:

```
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "33074"
  },
  "items": [
    {
      "metadata": {
        "name": "kubernetes-bootcamp-2321272333-ix8pt",
        "generateName": "kubernetes-bootcamp-2321272333-",
        "namespace": "default",
        "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
        "resourceVersion": "33003",
        "creationTimestamp": "2016-08-25T23:43:30Z",
        "labels": {
          "pod-template-hash": "2321272333",
          "run": "kubernetes-bootcamp"
        },
        ...
}
```

## {{% heading "whatsnext" %}}

kubectl proxy के बारे में और जानें। 