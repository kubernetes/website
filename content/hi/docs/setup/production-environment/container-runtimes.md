---
title: कंटेनर रनटाइम
content_type: concept
weight: 20
---

<!-- overview -->

आपको क्लस्टर में प्रत्येक नोड में एक {{< glossary_tooltip text="कंटेनर रनटाइम" term_id="container-runtime" >}} 
इंस्टॉल करना होगा ताकि पॉड वहां चल सकें। 
यह पृष्ठ बताता है कि क्या शामिल है और 
नोड्स की स्थापना के लिए संबंधित कार्यों का वर्णन करता है।

<!-- body -->

कुबेरनेट्स {{< skew currentVersion >}} के लिए आवश्यक है कि आप एक रनटाइम का उपयोग करें जो
{{< glossary_tooltip term_id="cri" text="कंटेनर रनटाइम इंटरफ़ेस">}} (CRI)
के अनुरूप है।

अधिक जानकारी के लिए [CRI  version support](#cri-versions) देखें।

यह पृष्ठ Linux पर कुबेरनेट्स के साथ कई सामान्य कंटेनर रनटाइम का उपयोग करने के विवरण सूचीबद्ध करता है: 

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
अन्य ऑपरेटिंग सिस्टम के लिए, अपने प्लेटफ़ॉर्म के अनुसार विशिष्ट प्रलेखन देखें।
{{< /note >}}

## Cgroup ड्राइवर 

प्रक्रियाओं के लिए आवंटित संसाधनों को सीमित करने के लिए कंट्रोल ग्रुप का उपयोग किया जाता है।

जब Linux वातावरण के लिए init सिस्टम, [systemd](https://www.freedesktop.org/wiki/Software/systemd/)
को चुना जाता है, तब init प्रक्रिया रुट(root) control group (`cgroup`) उत्पन्न करती है और उपभोग करती है तथा cgroup मैनेजर की तरह काम करता है।
Systemd और cgroups एकीकृत हैं और प्रत्येक systemd यूनिट को एक cgroup आवंटित होता है। अपने कन्टैनर रनटाइम और kubelet को `cgroupfs` प्रयोग करने के लिए कॉन्फ़िगर करना संभव है। systemd के साथ `cgroupfs` प्रयोग करने के कारण दो अलग cgroup मैनेजर होंगे।

एक एकल cgroup प्रबंधक इस दृष्टिकोण को सरल बनाता है कि कौन से संसाधन आवंटित किए जा रहे हैं और डिफ़ॉल्ट रूप से उपलब्ध और उपयोग में आने वाले संसाधनों के बारे में अधिक सुसंगत दृश्य होगा।
जब एक सिस्टम पर दो cgroup मैनेजर होते हैं, तो आपको उन रिसोर्सेज के दो व्यू मिलते हैं। क्षेत्र में, लोगों ने ऐसे मामलों की सूचना दी है जहां नोड्स जो kubelet और डॉकर के लिए `cgroupfs` का उपयोग करने के लिए कॉन्फ़िगर किए गए हैं, लेकिन बाकी प्रक्रियाओं के लिए `systemd` संसाधन दबाव के कारण अस्थिर हो जाते हैं। 

सेटिंग्स को इस तरह बदलना कि आपका कंटेनर रनटाइम और kubelet `systemd` का उपयोग करें क्योंकि cgroup ड्राइवर सिस्टम को स्थिर करता है। डॉकर के लिए इसे कॉन्फ़िगर करने के लिए, `native.cgroupdriver=systemd` सेट करें। 

{{< caution >}}
क्लस्टर में शामिल होने वाले नोड के cgroup ड्राइवर को बदलना एक संवेदनशील ऑपरेशन है। यदि kubelet ने एक सीग्रुप ड्राइवर के सिमेंटिक्स (semantics) का उपयोग करके पॉड्स बनाए हैं, तो कंटेनर रनटाइम को दूसरे सीग्रुप ड्राइवर में बदलने से मौजूदा पॉड्स के पॉड सैंडबॉक्स को फिर से बनाते समय त्रुटियां हो सकती हैं। kubelet को पुनरारंभ करने से ऐसी त्रुटियों का समाधान नहीं हो सकता है। 

यदि आपके पास स्वचालन है जो इसे व्यवहार्य बनाता है, तो अद्यतन किए गए कॉन्फ़िगरेशन का उपयोग करके नोड को दूसरे के साथ बदलें, या स्वचालन का उपयोग करके इसे पुनर्स्थापित करें।
{{< /caution >}}

## Cgroup v2

Cgroup v2, cgroup Linux API का अगला संस्करण है। Cgroup v1 से अलग, प्रत्येक कंट्रोलर के लिए एक अलग अनुक्रम के बजाय एक पदानुक्रम है। 

नया संस्करण cgroup v1 पर कई सुधार प्रदान करता है, इनमें से कुछ सुधार हैं:

- API का उपयोग करने का स्पष्ट और आसान तरीका
- कंटेनरों के लिए सुरक्षित उप-वृक्ष प्रतिनिधिमंडल
- प्रेशर स्टॉल की जानकारी जैसी नई सुविधाएँ

भले ही कर्नेल हाइब्रिड कॉन्फ़िगरेशन का समर्थन करता हो, जहां कुछ नियंत्रक cgroup v1 द्वारा प्रबंधित किए जाते हैं और कुछ अन्य cgroup v2 द्वारा, Kubernetes सभी नियंत्रकों को प्रबंधित करने के लिए केवल उसी cgroup संस्करण का समर्थन करता है।

यदि सिस्टमड (Systemd) डिफ़ॉल्ट रूप से cgroup v2 का उपयोग नहीं करता है, तो आप कर्नेल कमांड लाइन में `systemd.unified_cgroup_hierarchy=1` जोड़कर सिस्टम को इसका उपयोग करने के लिए कॉन्फ़िगर कर सकते हैं।

```shell
# यह उदाहरण एक Linux OS के लिए है जो DNF पैकेज मैनेजर का उपयोग करता है
# आपका सिस्टम कमांड लाइन सेट करने के लिए एक अलग विधि का उपयोग कर सकता है
# लिनक्स कर्नेल का उपयोग करता है।
sudo dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args="systemd.unified_cgroup_hierarchy=1"
```

यदि आप कर्नेल के लिए कमांड लाइन बदलते हैं, तो आपको अपने से पहले नोड को रिबूट करना होगा
परिवर्तन प्रभावी होता है।

Cgroup v2 में स्विच करते समय उपयोगकर्ता अनुभव में कोई उल्लेखनीय अंतर नहीं होना चाहिए, जब तक कि उपयोगकर्ता सीग्रुप फाइल सिस्टम को सीधे नोड पर या कंटेनरों के भीतर से एक्सेस कर रहे हैं। 

इसका उपयोग करने के लिए, Cgroup v2 को CRI रनटाइम द्वारा भी सपोर्टेड (supported) होना चाहिए। 

### Kubeadm प्रबंधित क्लस्टर में `systemd` ड्राइवर में माइग्रेट करना

यदि आप मौजूदा kubeadm प्रबंधित क्लस्टर में `systemd` cgroup ड्राइवर में माइग्रेट करना चाहते हैं, तो [माइग्रेशन गाइड](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) का पालन करें।

## CRI संस्करण समर्थन {#cri-versions}

आपके कंटेनर रनटाइम को कंटेनर रनटाइम इंटरफ़ेस के कम से कम v1alpha2 का समर्थन करना चाहिए।

कुबेरनेट्स {{< skew currentVersion >}} डिफ़ॉल्ट रूप से CRI API के v1 का उपयोग करता है।
यदि कंटेनर रनटाइम v1 API का समर्थन नहीं करता है, तो क्यूबलेट वापस आ जाता है
इसके बजाय (बहिष्कृत) v1alpha2 API का उपयोग करना।

## कंटेनर रनटाइम

{{% thirdparty-content %}}


### कंटेनरडी {#containerd}

यह खंड कंटेनरडी को CRI रनटाइम के रूप में उपयोग करने के लिए आवश्यक कदम है।

अपने सिस्टम पर containerd इंस्टॉल करने के लिए निम्नलिखित कमांड का उपयोग करें:

पूर्वापेक्षाएँ इंस्टॉल और कॉन्फ़िगर करें:

```shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
# सेटअप आवश्यक sysctl params, ये रिबूट के दौरान बने रहते हैं।
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
# रिबूट के बिना sysctl params लागू करें
sudo sysctl --system
```

कंटेनरडी इंस्टॉल करें:

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. आधिकारिक डॉकर रिपॉजिटरी से `containerd.io` पैकेज इंस्टॉल करें।  
अपने संबंधित लिनक्स वितरण के लिए डॉकर रिपॉजिटरी इंस्टॉल करने और `containerd.io` पैकेज इंस्टॉल करने के निर्देश यहां देखे जा सकते हैं
[डॉकर इंजन इंस्टॉल  करें](https://docs.docker.com/engine/install/#server).

2. कंटेनरडी कॉन्फ़िगर करें:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

3. कंटेनरडी को पुनरारंभ करें:

   ```shell
   sudo systemctl restart containerd
   ```

 {{% /tab %}}
 {{% tab name="Windows (PowerShell)" %}}

 Powershell सत्र प्रारंभ करें, `$Version` को वांछित संस्करण पर सेट करें (उदाहरण: `$Version=1.4.3`), और फिर निम्न आदेश चलाएँ: 

1. कंटेनरडी डाउनलोड करें: 

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz                  
   ```

2. एक्सट्रेक्ट एंड कॉन्फ़िगर:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd"    -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding         ascii
   # कॉन्फ़िगरेशन की समीक्षा करें। सेटअप के आधार पर आप समायोजित करना चाह सकते हैं:
   # - सैंडबॉक्स_इमेज (कुबेरनेट्स पॉज़ इमेज)
   # - cni bin_dir और conf_dir स्थान
   Get-Content config.toml
   # (वैकल्पिक - लेकिन अत्यधिक अनुशंसित) विंडोज डिफेंडर स्कैन से कंटेनर को बाहर करें
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. कंटेनरडी शुरू करें:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

#### systemd` cgroup ड्राइवर का उपयोग करें {#containerd-systemd}
`systemd` cgroup ड्राइवर {#containerd-systemd} का उपयोग करना
`runc` के साथ `/etc/containerd/config.toml` में `systemd` cgroup ड्राइवर का उपयोग करने के लिए, सेट करें
```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```
यदि आप इस परिवर्तन को लागू करते हैं,तो सुनिश्चित करें कि आप फिर से कंटेनरडी को पुनरारंभ करें: 
```shell
sudo systemctl restart containerd
```

जब आप kubeadm का उपयोग करें, मैन्युअल रूप से कॉन्फ़िगर करें
[क्यूबलेट के लिए cgroup ड्राइवर](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node) मैन्युअल रूप से कॉन्फ़िगर करें।

### CRI-O

इस खंड में CRI-O को कंटेनर रनटाइम के रूप में इंस्टॉल करने के लिए आवश्यक जानकारी है।

अपने सिस्टम पर CRI-O इंस्टॉल करने के लिए निम्नलिखित कमांड का उपयोग करें: 

{{< note >}}
CRI-O के प्रमुख और छोटे संस्करणों को Kubernetes के प्रमुख और छोटे संस्करणों से मेल खाना चाहिए। 
अधिक जानकारी के लिए [CRI-O compatibility matrix](https://github.com/cri-o/cri-o#compatibility-matrix-cri-o--kubernetes) देखें।
{{< /note >}}

पूर्वापेक्षाएँ इंस्टॉल और कॉन्फ़िगर करें:

```shell
# बूटअप पर मॉड्यूल लोड करने के लिए .conf फाइल बनाएं
cat <<EOF | sudo tee /etc/modules-load.d/crio.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
# आवश्यक sysctl params सेट करें, ये रिबूट के दौरान बने रहते हैं।
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
sudo sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

निम्नलिखित ऑपरेटिंग सिस्टम पर CRI-O स्थापित करने के लिए, एनवायरनमेंट वेरिएबल`OS` को निम्न तालिका से उपयुक्त मान पर सेट करें: 

| ऑपरेटिंग सिस्टम       | `$OS`             |
| ---------------- | ----------------- |
| Debian Unstable  | `Debian_Unstable` |
| Debian Testing   | `Debian_Testing`  |

<br />
फिर, सेट करें  `$VERSION`CRI-O संस्करण में जो आपके Kubernetes संस्करण से मेल खाता है। 
उदाहरण के लिए, यदि आप CRI-O 1.20 इंस्टॉल करना चाहते हैं, तो `VERSION=1.20` सेट करें।
आप अपनी स्थापना को किसी विशिष्ट रिलीज़ पर पिन कर सकते हैं।
संस्करण 1.20.0 स्थापित करने के लिए, `VERSION=1.20:1.20.0` सेट करें।
<br />

कृपया यह करें
```shell
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /
EOF
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /
EOF
curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg add -
sudo apt-get update
sudo apt-get install cri-o cri-o-runc
```

{{% /tab %}}

{{% tab name="Ubuntu" %}}

निम्नलिखित ऑपरेटिंग सिस्टम पर स्थापित करने के लिए, एनवायरनमेंट वेरिएबल `OS` सेट करें
निम्न तालिका में उपयुक्त फ़ील्ड के लिए: 

| ऑपरेटिंग सिस्टम       | `$OS`             |
| ---------------- | ----------------- |
| Ubuntu 20.04     | `xUbuntu_20.04`   |
| Ubuntu 19.10     | `xUbuntu_19.10`   |
| Ubuntu 19.04     | `xUbuntu_19.04`   |
| Ubuntu 18.04     | `xUbuntu_18.04`   |

<br />
फिर, `$VERSION` को CRI-O संस्करण में सेट करें जो आपके Kubernetes संस्करण से मेल खाता हो। 
उदाहरण के लिए, यदि आप CRI-O 1.20 इंस्टॉल करना चाहते हैं, तो `VERSION=1.20` सेट करें।
आप अपनी स्थापना को किसी विशिष्ट रिलीज़ पर पिन कर सपर पिन कर सकते हैं।
संस्करण 1.20.0 स्थापित करने के लिए, `VERSION=1.20:1.20.0` सेट करें।    
<br />

कृपया यह करें
```shell
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /
EOF
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /
EOF
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg add -
curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers-cri-o.gpg add -
sudo apt-get update
sudo apt-get install cri-o cri-o-runc
```
{{% /tab %}}

{{% tab name="CentOS" %}}

निम्नलिखित ऑपरेटिंग सिस्टम पर स्थापित करने के लिए, एनवायरनमेंट वे वेरिएबल
`OS` सेट करें निम्न तालिका में उपयुक्त फ़ील्ड के लिए: 
| ऑपरेटिंग सिस्टम       | `$OS`             |
| ---------------- | ----------------- |
| Centos 8         | `CentOS_8`        |
| Centos 8 Stream  | `CentOS_8_Stream` |
| Centos 7         | `CentOS_7`        |

<br />
फिर, `$VERSION` को CRI-O संस्करण में सेट करें जो आपके Kubernetes संस्करण से मेल खाता हो।
उदाहरण के लिए, यदि आप CRI-O 1.20 इंस्टॉल करना चाहते हैं, तो `VERSION=1.20` सेट करें। 
आप अपनी स्थापना को किसी विशिष्ट रिलीज़ पर पिन कर सकते हैं।
संस्करण 1.20.0 स्थापित करने के लिए, `VERSION=1.20:1.20.0` सेट करें।
<br />

कृपया यह करें
```shell
sudo curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable.repo https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/devel:kubic:libcontainers:stable.repo
sudo curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo
sudo yum install cri-o
```

{{% /tab %}}

{{% tab name="openSUSE Tumbleweed" %}}

```shell
sudo zypper install cri-o
```
{{% /tab %}}
{{% tab name="Fedora" %}}

`$VERSION` को CRI-O संस्करण में सेट करें जो आपके Kubernetes संस्करण से मेल खाता हो।
उदाहरण के लिए, यदि आप CRI-O 1.20, `VERSION=1.20` स्थापित करना चाहते हैं।

आप इसके साथ उपलब्ध संस्करण पा सकते हैं: 
```shell
sudo dnf module list cri-o
```
CRI-O फेडोरा पर विशिष्ट रिलीज के लिए पिनिंग का समर्थन नहीं करता है। 

तब इसे करें:
```shell
sudo dnf module enable cri-o:$VERSION
sudo dnf install cri-o
```

{{% /tab %}}
{{< /tabs >}}

CRI-O शुरू करें :

```shell
sudo systemctl daemon-reload
sudo systemctl enable crio --now
```

अधिक जानकारी के लिए [CRI-O इंस्टॉलेशन गाइड](https://github.com/cri-o/cri-o/blob/master/install.md) देखें।


#### cgroup ड्राइवर

CRI-O डिफ़ॉल्ट रूप से systemd cgroup ड्राइवर का उपयोग करता है।
`cgroupfs` cgroup ड्राइवर पर स्विच करने के लिए, या तो `/etc/crio/crio.conf` संपादित करें या `/etc/crio/crio.conf.d/02-cgroup-manager.conf` में ड्रॉप-इन कॉन्फ़िगरेशन रखें। उदाहरण के लिए:  

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```
कृपया बदले हुए `conmon_cgroup` पर भी ध्यान दें, जिसे `cgroupfs` के साथ CRI-O का उपयोग करते समय `पॉड` मान पर सेट करना होगा।
आमतौर पर क्यूबलेट के cgroup ड्राइवर कॉन्फ़िगरेशन (आमतौर पर kubeadm के माध्यम से किया जाता है) और CRI-O को सिंक में रखना आवश्यक है। 

### डॉकर इंजन {#docker}

डॉकर इंजन कंटेनर रनटाइम है जिसने यह सब शुरू किया। पूर्व में सिर्फ डॉकर के रूप में जाना जाता था,यह कंटेनर रनटाइम विभिन्न रूपों में उपलब्ध है। [डॉकर इंजन इंस्टॉल करें](https://docs.docker.com/engine/install/) आपके विकल्पों की व्याख्या करता है
इस रनटाइम को इंस्टॉल करने के लिए।

डॉकर इंजन कुबेरनेट्स {{< skew currentVersion >}} के साथ सीधे संगत है, जो कि बहिष्कृत `dockershim` घटक का उपयोग करता है। अधिक जानकारी के लिए
और संदर्भ, [Dockershim deprecation FAQ](/dockershim) देखें।

आप तृतीय-पक्ष एडेप्टर भी पा सकते हैं जो आपको कुबेरनेट्स के साथ डॉकर इंजन का उपयोग करने देता है, समर्थित {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} के माध्यम से
(CRI)।

निम्नलिखित CRI एडेप्टर डॉकर इंजन के साथ काम करने के लिए डिज़ाइन किए गए हैं:

- [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) Mirantis से

### मिरांटिस कंटेनर रनटाइम {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) एक व्यावसायिक रूप से है उपलब्ध कंटेनर रनटाइम जिसे पहले डॉकर एंटरप्राइज एडिशन के नाम से जाना जाता था।

आप खुले स्रोत का उपयोग करके कुबेरनेट्स के साथ मिरांटिस कंटेनर रनटाइम का उपयोग कर सकते हैं [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) घटक, MCR के साथ शामिल है।