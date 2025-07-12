---
reviewers:
- dipesh-rawat
- divya-mohan0209
title: नेटवर्कपॉलिसी के लिए Calico का उपयोग करें
content_type: task
weight: 20
---

<!-- overview -->
यह पेज कुबेरनेट्स पर Calico क्लस्टर बनाने के कुछ त्वरित तरीके दिखाता है।

## {{% heading "prerequisites" %}}

तय करें कि आप [cloud](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) या [local](#creating-a-local-calico-cluster-with-kubeadm) क्लस्टर डिप्लॉय करना चाहते हैं।

<!-- steps -->
## Google कुबेरनेट्स इंजन (GKE) के साथ Calico क्लस्टर बनाना {#creating-a-calico-cluster-with-google-kubernetes-engine-gke}

**पूर्वापेक्षा**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts)।

1.  Calico के साथ GKE क्लस्टर लॉन्च करने के लिए, `--enable-network-policy` फ्लैग शामिल करें।

    **सिंटैक्स**
    ```shell
    gcloud container clusters create [CLUSTER_NAME] --enable-network-policy
    ```

    **उदाहरण**
    ```shell
    gcloud container clusters create my-calico-cluster --enable-network-policy
    ```

1.  डिप्लॉयमेंट को सत्यापित करने के लिए, निम्नलिखित कमांड का उपयोग करें।

    ```shell
    kubectl get pods --namespace=kube-system
    ```

    Calico पॉड्स `calico` से शुरू होते हैं। जांचें कि प्रत्येक की स्थिति `Running` है।

## kubeadm के साथ लोकल Calico क्लस्टर बनाना  {#creating-a-local-calico-cluster-with-kubeadm}

kubeadm का उपयोग करके पंद्रह मिनट में एक लोकल सिंगल-होस्ट Calico क्लस्टर प्राप्त करने के लिए,
[Calico क्विकस्टार्ट](https://projectcalico.docs.tigera.io/getting-started/kubernetes/) देखें।

## {{% heading "whatsnext" %}}

एक बार जब आपका क्लस्टर चल रहा हो, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए [नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/) का पालन कर सकते हैं।
