---
reviewers:
- dcbw
- freehan
- thockin
title: नेटवर्क प्लगइन
content_type: concept
weight: 10
---


<!-- overview -->

कुबरनेट्स (वर्शन 1.3 से लेटेस्ट {{< skew latestVersion >}} तक, और शायद आगे भी) आपको क्लस्टर
नेटवर्किंग के लिए [Container Network Interface](https://github.com/containernetworking/cni) (CNI)
प्लगइन का उपयोग करने देता है। आपको ऐसा CNI प्लगइन उपयोग करना चाहिए जो आपके क्लस्टर के साथ कॉम्पेटिबल हो
और आपकी आवश्यकताओं के अनुकूल हो। कुबरनेट्स इकोसिस्टम में कई अलग-अलग प्लगइन उपलब्ध हैं (ओपन-सोर्स और
क्लोज़्ड-सोर्स दोनों)।

CNI प्लगइन के लिए
[कुबरनेट्स नेटवर्क मॉडल](/docs/concepts/services-networking/#the-kubernetes-network-model) को
लागू करना आवश्यक है।

आपको ऐसा CNI प्लगइन उपयोग करना चाहिए जो CNI स्पेसिफ़िकेशन के
[v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) या उसके बाद के
रिलीज़ के साथ कॉम्पेटिबल हो। कुबरनेट्स प्रोजेक्ट यह सुझाव देता है कि ऐसे प्लगइन का उपयोग करें जो
[v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md) CNI स्पेसिफ़िकेशन के
साथ कॉम्पेटिबल हो (प्लगइन कई स्पेक वर्शन के साथ कॉम्पेटिबल हो सकते हैं)।

<!-- body -->

## इंस्टॉलेशन

नेटवर्किंग के संदर्भ में, एक कंटेनर रनटाइम एक ऐसा डेमन है जो किसी नोड पर kubelet के लिए CRI सेवाएँ
प्रदान करने के लिए कॉन्फ़िगर किया जाता है। विशेष रूप से, कंटेनर रनटाइम को कुबरनेट्स नेटवर्क मॉडल को
लागू करने के लिए आवश्यक CNI प्लगइन लोड करने के लिए कॉन्फ़िगर किया जाना चाहिए।

{{< note >}}
कुबरनेट्स 1.24 से पहले, CNI प्लगइन को `cni-bin-dir` और `network-plugin` कमांड-लाइन पैरामीटर का
उपयोग करके kubelet द्वारा भी प्रबंधित किया जा सकता था। ये कमांड-लाइन पैरामीटर कुबरनेट्स 1.24 में हटा दिए
गए, और CNI का प्रबंधन अब kubelet के दायरे में नहीं है।

अगर dockershim को हटाने के बाद आपको समस्याएँ आ रही हैं, तो देखें
[CNI प्लगइन से संबंधित एरर का ट्रबलशूटिंग](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)।
{{< /note >}}

किसी कंटेनर रनटाइम द्वारा CNI प्लगइन को प्रबंधित करने के तरीके के बारे में विशेष जानकारी के लिए, उस
कंटेनर रनटाइम का डॉक्यूमेंटेशन देखें, उदाहरण के लिए:

- [containerd](https://github.com/containerd/containerd/blob/main/script/setup/install-cni)
- [CRI-O](https://github.com/cri-o/cri-o/blob/main/contrib/cni/README.md)

किसी CNI प्लगइन को इंस्टॉल और प्रबंधित करने के तरीके के बारे में विशेष जानकारी के लिए, उस प्लगइन या
[नेटवर्किंग प्रोवाइडर](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)
का डॉक्यूमेंटेशन देखें।

## नेटवर्क प्लगइन आवश्यकताएँ

### लूपबैक CNI

कुबरनेट्स नेटवर्क मॉडल को लागू करने के लिए नोड पर इंस्टॉल्ड CNI प्लगइन के अलावा, कुबरनेट्स को
यह भी आवश्यकता होती है कि कंटेनर रनटाइम एक लूपबैक इंटरफ़ेस `lo` प्रदान करे, जिसका उपयोग हर सैंडबॉक्स
(पॉड सैंडबॉक्स, vm सैंडबॉक्स, ...) के लिए किया जाता है। लूपबैक इंटरफ़ेस को लागू करना
[CNI loopback plugin](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go)
का फिर से उपयोग करके, या इसे हासिल करने के लिए अपना स्वयं का कोड डेवलप करके पूरा किया जा सकता है (देखें
[CRI-O का यह उदाहरण](https://github.com/cri-o/ocicni/blob/release-1.24/pkg/ocicni/util_linux.go#L91))।

### hostPort का समर्थन

CNI नेटवर्किंग प्लगइन `hostPort` का समर्थन करता है। आप CNI प्लगइन टीम द्वारा प्रदान किया गया आधिकारिक
[portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap) प्लगइन
उपयोग कर सकते हैं या portMapping फ़ंक्शनैलिटी वाला अपना स्वयं का प्लगइन उपयोग कर सकते हैं।

अगर आप `hostPort` समर्थन एनेबल करना चाहते हैं, तो आपको अपने `cni-conf-dir` में `portMappings capability`
निर्दिष्ट करना होगा। उदाहरण के लिए:

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true},
      "externalSetMarkChain": "KUBE-MARK-MASQ"
    }
  ]
}
```

### ट्रैफ़िक शेपिंग का समर्थन

**एक्सपेरिमेंटल फ़ीचर**

CNI नेटवर्किंग प्लगइन पॉड ingress और egress ट्रैफ़िक शेपिंग का भी समर्थन करता है। आप CNI प्लगइन टीम
द्वारा प्रदान किया गया आधिकारिक
[bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth) प्लगइन
उपयोग कर सकते हैं या बैंडविड्थ कंट्रोल फ़ंक्शनैलिटी वाला अपना स्वयं का प्लगइन उपयोग कर सकते हैं।

अगर आप ट्रैफ़िक शेपिंग समर्थन एनेबल करना चाहते हैं, तो आपको अपनी CNI कॉन्फ़िगरेशन फ़ाइल (डिफ़ॉल्ट
`/etc/cni/net.d`) में `bandwidth` प्लगइन जोड़ना होगा और सुनिश्चित करना होगा कि बाइनरी आपके CNI bin
डायरेक्टरी (डिफ़ॉल्ट `/opt/cni/bin`) में शामिल हो।

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

अब आप अपने Pod में `kubernetes.io/ingress-bandwidth` और `kubernetes.io/egress-bandwidth` एनोटेशन
जोड़ सकते हैं। उदाहरण के लिए:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

## {{% heading "whatsnext" %}}

- [क्लस्टर नेटवर्किंग](/docs/concepts/cluster-administration/networking/) के बारे में अधिक जानें
- [नेटवर्क पॉलिसी](/docs/concepts/services-networking/network-policies/) के बारे में अधिक जानें
- [CNI प्लगइन से संबंधित एरर का ट्रबलशूटिंग](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/) के बारे में जानें
