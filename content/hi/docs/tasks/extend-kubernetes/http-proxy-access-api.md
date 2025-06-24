---
title: HTTP प्रॉक्सी का उपयोग करके कुबेरनेट्स API तक पहुँचें
content_type: task
weight: 40
---

<!-- overview -->
यह पेज दिखाता है कि कुबेरनेट्स API तक पहुँचने के लिए HTTP प्रॉक्सी का उपयोग कैसे करें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

यदि आपके क्लस्टर में पहले से कोई एप्लिकेशन नहीं चल रहा है, तो इस कमांड को दर्ज करके एक Hello world एप्लिकेशन शुरू करें:

```shell
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

<!-- steps -->

## kubectl का उपयोग करके प्रॉक्सी सर्वर शुरू करें

यह कमांड कुबेरनेट्स API सर्वर के लिए एक प्रॉक्सी शुरू करता है:

```
kubectl proxy --port=8080
```

## कुबेरनेट्स API का अन्वेषण करें

जब प्रॉक्सी सर्वर चल रहा हो, तो आप `curl`, `wget`, या ब्राउज़र का उपयोग करके API का अन्वेषण कर सकते हैं।

API वर्शन प्राप्त करें:

```
curl http://localhost:8080/api/
```

आउटपुट कुछ इस तरह दिखेगा:

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

आउटपुट कुछ इस तरह दिखेगा:

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

[kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy) के बारे में और जानें। 