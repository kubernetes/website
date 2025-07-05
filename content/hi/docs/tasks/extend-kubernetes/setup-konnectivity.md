---
title: Konnectivity सेटअप
content_type: task
weight: 20
---

<!-- overview -->
Konnectivity एक नेटवर्क प्रॉक्सी है जो कंट्रोल प्लेन और नोड्स के बीच सुरक्षित संचार प्रदान करता है। यह कंट्रोल प्लेन से नोड्स तक सुरक्षित टनल बनाता है।

## {{% heading "prerequisites" %}}

आपके पास एक कुबेरनेटेस क्लस्टर होना चाहिए, और kubectl कमांड-लाइन टूल को आपके क्लस्टर के साथ संवाद करने के लिए कॉन्फ़िगर किया जाना चाहिए। इस ट्यूटोरियल को कम से कम दो नोड्स वाले क्लस्टर पर चलाने की सलाह दी जाती है जो कंट्रोल प्लेन होस्ट के रूप में कार्य नहीं कर रहे हैं। यदि आपके पास पहले से कोई क्लस्टर नहीं है, तो आप इसे minikube का उपयोग करके बना सकते हैं या आप इनमें से किसी एक कुबेरनेटेस प्लेग्राउंड का उपयोग कर सकते हैं:

* Killercoda
* KodeKloud
* Play with कुबेरनेटेस

संस्करण की जांच करने के लिए, `kubectl version` दर्ज करें।

## Konnectivity सेटअप

1. Konnectivity एजेंट को नोड्स पर डिप्लॉय करें:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: konnectivity-agent
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: konnectivity-agent
  template:
    metadata:
      labels:
        app: konnectivity-agent
    spec:
      containers:
      - name: konnectivity-agent
        image: k8s.gcr.io/konnectivity-agent:v0.0.30
        args:
        - --agent-id=$(NODE_NAME)
        - --ca-cert=/etc/kubernetes/pki/ca.crt
        - --client-cert=/etc/kubernetes/pki/konnectivity-agent.crt
        - --client-key=/etc/kubernetes/pki/konnectivity-agent.key
        - --proxy-server-addr=127.0.0.1:8132
        env:
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        volumeMounts:
        - name: k8s-certs
          mountPath: /etc/kubernetes/pki
          readOnly: true
      volumes:
      - name: k8s-certs
        hostPath:
          path: /etc/kubernetes/pki
```

2. Konnectivity सर्वर को कंट्रोल प्लेन पर डिप्लॉय करें:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: konnectivity-server
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: konnectivity-server
  template:
    metadata:
      labels:
        app: konnectivity-server
    spec:
      containers:
      - name: konnectivity-server
        image: k8s.gcr.io/konnectivity-server:v0.0.30
        args:
        - --server-port=8132
        - --server-cert=/etc/kubernetes/pki/konnectivity-server.crt
        - --server-key=/etc/kubernetes/pki/konnectivity-server.key
        - --ca-cert=/etc/kubernetes/pki/ca.crt
        volumeMounts:
        - name: k8s-certs
          mountPath: /etc/kubernetes/pki
          readOnly: true
      volumes:
      - name: k8s-certs
        hostPath:
          path: /etc/kubernetes/pki
```

3. आवश्यक प्रमाणपत्र बनाएं:

```bash
# Konnectivity सर्वर प्रमाणपत्र
kubectl create secret tls konnectivity-server-tls \
  --cert=/etc/kubernetes/pki/konnectivity-server.crt \
  --key=/etc/kubernetes/pki/konnectivity-server.key \
  -n kube-system

# Konnectivity एजेंट प्रमाणपत्र
kubectl create secret tls konnectivity-agent-tls \
  --cert=/etc/kubernetes/pki/konnectivity-agent.crt \
  --key=/etc/kubernetes/pki/konnectivity-agent.key \
  -n kube-system
```

## Konnectivity का उपयोग करें

Konnectivity सेटअप के बाद, आप नोड्स से कंट्रोल प्लेन तक सुरक्षित संचार का उपयोग कर सकते हैं। यह विशेष रूप से उपयोगी है जब नोड्स निजी नेटवर्क में हैं और सीधे कंट्रोल प्लेन तक पहुंच नहीं सकते।

## {{% heading "whatsnext" %}}

* [HTTP प्रॉक्सी का उपयोग करके कुबेरनेटेस API तक पहुंचें](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [SOCKS5 प्रॉक्सी का उपयोग करके कुबेरनेटेस API तक पहुंचें](/docs/tasks/extend-kubernetes/socks5-proxy-access-api/) 