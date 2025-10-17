---
title: Konnectivity सेटअप
content_type: task
weight: 20
---

<!-- overview -->

Konnectivity सेवा कंट्रोल प्लेन से क्लस्टर संचार के लिए TCP स्तर का प्रॉक्सी प्रदान करती है।

## {{% heading "prerequisites" %}}

आपके पास एक कुबेरनेटेस क्लस्टर होना चाहिए, और kubectl कमांड-लाइन टूल को आपके क्लस्टर के साथ संवाद करने के लिए कॉन्फ़िगर किया जाना चाहिए। इस ट्यूटोरियल को कम से कम दो नोड्स वाले क्लस्टर पर चलाने की सलाह दी जाती है जो कंट्रोल प्लेन होस्ट के रूप में कार्य नहीं कर रहे हैं। यदि आपके पास पहले से कोई क्लस्टर नहीं है, तो आप इसे [minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/) का उपयोग करके बना सकते हैं।

<!-- steps -->

## Konnectivity सेवा कॉन्फ़िगर करें

निम्नलिखित चरणों के लिए एक egress कॉन्फ़िगरेशन की आवश्यकता है, उदाहरण के लिए:

{{% code_sample file="admin/konnectivity/egress-selector-configuration.yaml" %}}

आपको API सर्वर को Konnectivity सेवा का उपयोग करने और नेटवर्क ट्रैफ़िक को क्लस्टर नोड्स की ओर निर्देशित करने के लिए कॉन्फ़िगर करना होगा:

1. सुनिश्चित करें कि आपके क्लस्टर में
[Service Account Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection)
फ़ीचर सक्षम है। यह Kubernetes v1.20 से डिफ़ॉल्ट रूप से सक्षम है।
1. `admin/konnectivity/egress-selector-configuration.yaml` जैसी एक egress कॉन्फ़िगरेशन फ़ाइल बनाएं।
1. API सर्वर के `--egress-selector-config-file` फ़्लैग को आपकी API सर्वर egress कॉन्फ़िगरेशन फ़ाइल के पथ पर सेट करें।
1. यदि आप UDS कनेक्शन का उपयोग करते हैं, तो kube-apiserver में volumes कॉन्फ़िगरेशन जोड़ें:
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

konnectivity-server के लिए एक प्रमाणपत्र और kubeconfig जेनरेट करें या प्राप्त करें।
उदाहरण के लिए, आप एक X.509 प्रमाणपत्र जारी करने के लिए OpenSSL कमांड लाइन टूल का उपयोग कर सकते हैं,
कंट्रोल-प्लेन होस्ट से क्लस्टर CA प्रमाणपत्र `/etc/kubernetes/pki/ca.crt` का उपयोग करके।

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

इसके बाद, आपको Konnectivity सर्वर और एजेंट्स को डिप्लॉय करना होगा।
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)
एक संदर्भ कार्यान्वयन है।

अपने कंट्रोल प्लेन नोड पर Konnectivity सर्वर को डिप्लॉय करें। प्रदान किया गया
`konnectivity-server.yaml` मैनिफेस्ट मानता है
कि Kubernetes कंपोनेंट्स आपके क्लस्टर में एक {{< glossary_tooltip text="static Pod"
term_id="static-pod" >}} के रूप में डिप्लॉय किए गए हैं। यदि नहीं, तो आप Konnectivity
सर्वर को एक DaemonSet के रूप में डिप्लॉय कर सकते हैं।

{{% code_sample file="admin/konnectivity/konnectivity-server.yaml" %}}

फिर अपने क्लस्टर में Konnectivity एजेंट्स को डिप्लॉय करें:

{{% code_sample file="admin/konnectivity/konnectivity-agent.yaml" %}}

अंत में, यदि आपके क्लस्टर में RBAC सक्षम है, तो संबंधित RBAC नियम बनाएं:

{{% code_sample file="admin/konnectivity/konnectivity-rbac.yaml" %}}

## {{% heading "whatsnext" %}}

* [HTTP प्रॉक्सी का उपयोग करके कुबेरनेटेस API तक पहुंचें](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [SOCKS5 प्रॉक्सी का उपयोग करके कुबेरनेटेस API तक पहुंचें](/docs/tasks/extend-kubernetes/socks5-proxy-access-api/) 