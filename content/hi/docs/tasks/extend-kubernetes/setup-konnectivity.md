---
title: Konnectivity सेवा सेटअप करें
content_type: task
weight: 70
---

<!-- overview -->

Konnectivity सेवा कंट्रोल प्लेन से क्लस्टर संचार के लिए TCP स्तर का प्रॉक्सी प्रदान करती है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Konnectivity सेवा को कॉन्फ़िगर करें

निम्नलिखित चरणों के लिए एक egress कॉन्फ़िगरेशन की आवश्यकता होती है, उदाहरण के लिए:

{{% code_sample file="admin/konnectivity/egress-selector-configuration.yaml" %}}

आपको API सर्वर को Konnectivity सेवा का उपयोग करने और नेटवर्क ट्रैफ़िक को क्लस्टर नोड्स की ओर निर्देशित करने के लिए कॉन्फ़िगर करना होगा:

1. सुनिश्चित करें कि आपके क्लस्टर में [Service Account Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection) फ़ीचर सक्षम है। यह डिफ़ॉल्ट रूप से कुबेरनेट्स v1.20 से सक्षम है।
1. एक egress कॉन्फ़िगरेशन फ़ाइल बनाएं, जैसे `admin/konnectivity/egress-selector-configuration.yaml`।
1. API सर्वर के `--egress-selector-config-file` फ्लैग को अपनी egress कॉन्फ़िगरेशन फ़ाइल के पथ पर सेट करें।
1. यदि आप UDS कनेक्शन का उपयोग करते हैं, तो kube-apiserver में वॉल्यूम्स कॉन्फ़िग जोड़ें:
   ```yaml
   spec:
     containers:
       volumeMounts:
       - name: konnectivity-uds
         mountPath: /etc/kubernetes/konnectivity-server
         readOnly: false
     volumes:
     - name: konnectivity-uds
       hostPath:
         path: /etc/kubernetes/konnectivity-server
         type: DirectoryOrCreate
   ```

Konnectivity-server के लिए प्रमाणपत्र और kubeconfig जनरेट या प्राप्त करें। उदाहरण के लिए, आप OpenSSL कमांड लाइन टूल का उपयोग करके X.509 प्रमाणपत्र जारी कर सकते हैं, क्लस्टर CA प्रमाणपत्र `/etc/kubernetes/pki/ca.crt` का उपयोग करते हुए:

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -nodes -out konnectivity.csr -keyout konnectivity.key
openssl x509 -req -in konnectivity.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out konnectivity.crt -days 375 -sha256
SERVER=$(kubectl config view -o jsonpath='{.clusters..server}')
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-credentials system:konnectivity-server --client-certificate konnectivity.crt --client-key konnectivity.key --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-cluster kubernetes --server "$SERVER" --certificate-authority /etc/kubernetes/pki/ca.crt --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-context system:konnectivity-server@kubernetes --cluster kubernetes --user system:konnectivity-server
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config use-context system:konnectivity-server@kubernetes
rm -f konnectivity.crt konnectivity.key konnectivity.csr
```

अब, आपको Konnectivity सर्वर और एजेंट्स को डिप्लॉय करना होगा।
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy) एक रेफरेंस इम्प्लीमेंटेशन है।

कंट्रोल प्लेन नोड पर Konnectivity सर्वर डिप्लॉय करें। दिया गया `konnectivity-server.yaml` मैनिफेस्ट मानता है कि कुबेरनेट्स घटक आपके क्लस्टर में एक {{< glossary_tooltip text="static Pod" term_id="static-pod" >}} के रूप में डिप्लॉय किए गए हैं। यदि नहीं, तो आप Konnectivity सर्वर को DaemonSet के रूप में डिप्लॉय कर सकते हैं।

{{% code_sample file="admin/konnectivity/konnectivity-server.yaml" %}}

फिर अपने क्लस्टर में Konnectivity एजेंट्स डिप्लॉय करें:

{{% code_sample file="admin/konnectivity/konnectivity-agent.yaml" %}}

अंत में, यदि आपके क्लस्टर में RBAC सक्षम है, तो संबंधित RBAC नियम बनाएं:

{{% code_sample file="admin/konnectivity/konnectivity-rbac.yaml" %}}

## Konnectivity का उपयोग करें

Konnectivity सेटअप के बाद, आप नोड्स से कंट्रोल प्लेन तक सुरक्षित संचार का उपयोग कर सकते हैं। यह विशेष रूप से उपयोगी है जब नोड्स निजी नेटवर्क में हैं और सीधे कंट्रोल प्लेन तक पहुंच नहीं सकते।

## {{% heading "whatsnext" %}}

* [HTTP प्रॉक्सी का उपयोग करके कुबेरनेट्स API तक पहुंचें](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [SOCKS5 प्रॉक्सी का उपयोग करके कुबेरनेट्स API तक पहुंचें](/docs/tasks/extend-kubernetes/socks5-proxy-access-api/) 