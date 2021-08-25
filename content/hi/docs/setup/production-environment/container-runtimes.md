---

title: कंटेनर रनटाइम
content_type: concept
weight: 20
---
<!-- overview -->

आपको स्क्लस्टर के प्रत्येक नोड पे
{{< glossary_tooltip text="कंटेनर रनटाइम " term_id="container-runtime" >}}
इंस्टॉल करने की आवयशकता है ताकि पॉड वहां वहाँ चल सकें।
यह पृष्ठ नोड्स की स्थापना के लिए संबंधित कार्यों का वर्णन करता है।
<!-- body -->

यह पृष्ठ कुबेरनेट्स Linux पर कई सामान्य कंटेनर रनटाइम का उपयोग करने के लिए विवरण सूचीबद्ध करता है: 

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker](#docker)

{{< note >}}
अन्य ऑपरेटिंग सिस्टम के लिए, अपने प्लेटफ़ॉर्म के लिए विअनुसार विशिष्ट प्रलेखन देखें देखें।
{{< /note >}}

## Cgroup ड्राइवर 

Control groups प्रक्रियाओं को आवंटित संसाधनों को बाधित करने के लिए उपयोग किया जाता है। 

जब Linux वातावरण के लिए init सिस्टम, [systemd](https://www.freedesktop.org/wiki/Software/systemd/)
को चुना जाता है, तब init प्रक्रिया root control group(`cgroup`) उत्पन्न करती है और उपभोग करती है 
तथा cgroup मैनेजर की तरह कार्य करती है।



Systemd और cgroups एकीकृत हैं और प्रत्येक systemd यूनिट को एक cgroup आवंटित होता है। अपने कन्टैनर रनटाइम और kubelet
को `cgroupfs` प्रयोग करने के लिए कॉन्फ़िगर करना संभव है। systemd के साथ `cgroupfs` प्रयोग करने के कारण दो 
अलग cgroup मैनेजर होंगे।

एक एकल cgroup प्रबंधक इस दृष्टिकोण को सरल बनाता है कि कौन से संसाधन आवंटित किए जा रहे हैं और डिफ़ॉल्ट रूप से उपलब्ध और उपयोग में आ
और उपयोग में आने वाले संसाधनों के बारे में अधिक सुसंगत दृश्य होगा।
जब एक सिस्टम पर दो cgroup प्रबंधक होते हैं, तो आपको उन संसाधनों के दो दृश्य मिदोदृश्य मिलते हैं। तेक्षेत्र में, लोऐसा देखा गया है की नोड्स जो क्यूबलेट और डॉकर के लिए cgroupfs परन्तु बाकि
प्रोसेस के लिए systemd उपयोग करने को कॉन्फ़िगर किये गए है, वो दबाव में अस्थिर हो जाते हैं। टिंग्स को इस तरहसेटिंग्स को इस तरह बदलें कि आपका कंटेनर रनटाइम और क्यूबलेट `systemd` का उप
 योग करें क्योंकि cgroup ड्राइवर सिस्टम को स्थिर करता है।
डॉकर के लिए इसे कॉन्फ़िगर करने के लिए, `native.cgroupdriver=systemd` सेट करें। 

{{< caution >}}
क्लस्टर में शामिल होने वाले नोड के cgroup ड्राइवर को बदलना एक संवेसंवेदनशील ऑपरेशन है। 
यदि क्यूबलेट ने एक cgroup ड्राइवर के शब्दार्थ का उपयोग करके पॉड्स बनाए हैं, तो कंटेनर रनटाइम को दूसरे cgroup ड्राइवर में बदलने से ऐसे मौजूदा पॉड्स के   
मौजूदा पॉपॉड्स के लिए पॉड सैंडबॉक्स को फिर से बनाने का प्रयास करते समय त्रुटियाँ हो सकती हैं। 
यदि आपके पास स्वचालन है जो इसे व्यवहार्य बनाता है, तो अद्यतन किए गए
कॉन्फ़िगरेशन का उपयोग करके नोड को दूसरे के साथ बदलें, या स्वचालन का उपयोग
करके इसे पुनर्स्थापित करें।
{{< /caution >}}

## Cgroup v2

Cgroup v2 cgroup Linux API का अगला संस्करण है।
cgroup v1 से अलग, प्रत्येक नियंत्रक के लिए एक अलग पदानुक्रम के बजाय एक एकल पदानुक्रम है। 

नया संस्करण cgroup v1 पर कई सुधार प्रदान करता है, इनमें से कुछ सुधार हैं:

- एपीआई का उपयोग कर करने का स्वच्छ और आसान तरीकारीका
- कंटेनरों के लिए सुरक्षित उप-वृक्ष प्रतिनिधिमंडल  
- प्रेशर स्टॉल की जानकारी जैसी नई सुविधाएँ 

भले ही कर्नेल हाइब्रिड कॉन्फ़िगरेशन का समर्थन करता है जबकि कुछ
कंट्रोलर  cgroup v1 द्वारा प्रबंधित किए जाते हैं और कुछ अन्य cgroup v2 द्वारा प्प्रबंधितकि किए जाते हैं, लेकिन Kuberbernetes सभी 
कंट्रोलरस को प्रबंधित करने के लिए केवल एक ही cgroup संस्करण का समर्थन करता है। nel su

यदि सिस्टमड डिफ़ॉल्ट रूप से cgroup v2 का उपयोग नहीं करता है, तो आप सिस्टम को इसके द्वारा कॉन्फ़िगर कर सकते हैं
systemd.unified_cgroup_hierarchy=1` कर्नेल कमांड लाइन के लिए। 

```shell
# dnf install -y grubby && \
  sudo grubby \
  --update-kernel=ALL \
  --args=”systemd.unified_cgroup_hierarchy=1"
```

कॉन्फ़िगरेशन को लागू करने के लिए, नोड को रीबूट करना आवश्यक है।

cgroup v2 में स्विच करते समय उपयोगकर्ता अनुभव में कोई ध्यान देने योग्य अंतर नहीं होना चाहिए
होना चाहिए,  जब तक कि उपयोगकर्ता cgroup फ़ाइल सिस्टम को सीधे नोड पर या कंटेनरों के भीतर से एक्सेस नहीं कर रहे हों। 

इसका उपयोग करने के लिए, cgroup v2 को CRI रनटाइम द्वारा भी समर्थित होना चाहिए।

### Migrating to the `systemd` driver in kubeadm managed clusters

इस पेज को फॉलो करें  [Migration guide](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)
यदि आप मौजूदा kubeadm प्रबंधित क्लस्टर में `systemd` cgroup ड्राइवर में माइग्रेट करना चाहते हैं। .

## Container runtimes

{{% thirdparty-content %}}

### containerd

इस खंड में कंटेनरड को सीआरआई रनटाइम के रूप में उपयोग करने के लिए आवश्यक जानकारी है। 

अपने सिस्टम पर कंटेनर्ड को स्थापित करने के लिए निम्नलिखित कमांड का उपयोग करें:

पूर्वापेक्षाएँ स्थापित और कॉन्फ़िगर करें: 


```shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

इंस्टॉलI कंटेनरड :

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. आधिकारिक डॉकर रिपॉजिटरी से `containerd.io` पैकेज स्थापित करें।  
अपने संबंधित लिनक्स वितरण के लिए डॉकर रिपॉजिटरी स्थापित करने और `containerd.io` पैकेज स्थापित करने के निर्देश यहां देखे जा सकते हैं
[Install Docker Engine](https://docs.docker.com/engine/install/#server).

2. कॉन्फ़िगर  cकंटेनरड:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

3. Restart कंटेनरड: 

   ```shell
   sudo systemctl restart containerd
   ```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

एक पॉवरशेल शुरू करें, और सेट करें `$Version` वांछित संस्करण के लिए (ex: `$Version=1.4.3`), 
और उसके बाद निम्न आदेश चलाएँ: 

1. डाउनलोड coकंटेनरड: 

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

2. Extract and configure:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # Review the configuration. Depending on setup you may want to adjust:
   # - the sandbox_image (Kubernetes pause image)
   # - cni bin_dir and conf_dir locations
   Get-Content config.toml

   # (Optional - but highly recommended) Exclude containerd from Windows Defender Scans
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. Start containerd:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

#### Using the `systemd` cgroup driver {#containerd-systemd}

`systemd` cgroup ड्राइवर का`etc/containerd/config.toml` के भीतर
उपयोग करने के लिलिए , `runc` कोसेको
सेट करे
```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

यदि आप इस परिवर्तन को लागू करते हैं तो फिर से कंटेन्डर कंटेनरड आरंभ करना सुनिश्चित करें: 

```shell
sudo systemctl restart containerd
```

Kubeadm का उपयोग करते समय, मैन्युअल रूप से कॉन्फ़िगर करें
[cgroup driver for kubelet](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node).

### CRI-O

इस खंड में CRI-O को कंटेनर रनटाइम के रूप में स्थापित करने के लिए आवश्यक जानकारी है।

अपने सिस्टम पर CRI-O स्थापित करने के लिए निम्नलिखित कमांड का उपयोग करें: 

{{< note >}}
CRI-O के प्रमुख और छोटे संस्करणों को Kubernetes के प्रमुख और छोटे संस्करणों से मेल खाना चाहिए। 
अधिक जानकारी के लिए देखें  [CRI-O compatibility matrix](https://github.com/cri-o/cri-o#compatibility-matrix-cri-o--kubernetes).
{{< /note >}}

पूर्वापेक्षाएँ स्थापित और कॉन्फ़िगर करें:

```shell
# बूटअप पर मॉड्यूल लोड क करने के लिए .conf फाइल बनाएं Cr
cat <<EOF | sudo tee /etc/modules-load.d/crio.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Set up required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sudo sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

निम्नलिखित ऑपरेटिंग सिस्टम पर CRI-O स्थापित करने के लिए, एनवायरनमेंट वेरिएबल`OS` को निम्न तालिका से उपयुक्त मान पर सेट करें:  To install CRI-

	| Operating system | `$OS`             |
| ---------------- | ----------------- |
| Debian Unstable  | `Debian_Unstable` |
| Debian Testing   | `Debian_Testing`  |

<br />
फिर, सेट करें  `$VERSION`CRI-O संस्करण में जो आपके Kubernetes संस्करण से मेल खाता है। 
उदाहरण के लिए, यदि आप CRI-O 1.20 इंस्टॉल करना चाहते हैं, तो `VERSION=1.20` सेट करें।
आप अपनी स्थापना को किसी विशिष्ट रिलीज़ पर पिन कर सकते हैं।
संस्करण 1.20.0 स्थापित करने के लिए, `VERSION=1.20:1.20.0` सेट करें।

<br />

Then run
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

निम्नलिखित ऑपरेटिंग सिस्टम पर स्थापित करने के लिए, एनवायरनमेंट वेरिएबल  `OS` सेट करें
निम्न तालिका में उपयुक्त फ़ील्ड के लिए:  To in

| Operating system | `$OS`             |
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

Then run
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
`OS` सेट करें निम्न तालिका में उपयुक्त फ़ील्ड के लिए:    To i

| Operating system | `$OS`             |
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

Then run
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
सीआरआई-ओ फेडोरा पर विशिष्ट रिलीज के लिए पिनिंग का समर्थन नहीं करता है। 

Then run
```shell
sudo dnf module enable cri-o:$VERSION
sudo dnf install cri-o
```

{{% /tab %}}
{{< /tabs >}}

Start CRI-O:

```shell
sudo systemctl daemon-reload
sudo systemctl enable crio --now
```

Refer to the [CRI-O installation guide](https://github.com/cri-o/cri-o/blob/master/install.md)
for more information.


#### cgroup driver

CRI-O डिफ़ॉल्ट रूप से systemd cgroup ड्राइवर का उपयोग करता है।
CRI-O uses the systemd cgroup driver per default.`cgroupfs` cgroup ड्राइवर पर स्विच करने के लिए, या तो `
/etc/crio/crio.conf` संपादित करें या `/etc/crio/crio.conf.d/02-cgroup-manager.conf` में ड्रॉप-इन कॉन्फ़िगरेशन रखें। , उदाहरण के लिए:  

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```
कृपया बदले हुए `conmon_cgroup` पर भी ध्यान दें, जिसे `cgroupfs` के साथ CRI-O का उपयोग करते समय `पॉड` मान पर सेट करना होगा।
आमतौर पर क्यूबलेट के cgroup ड्राइवर कॉन्फ़िगरेशन (आमतौर पर kubeadm के माध्यम से किया जाता है) और CRI-O को सिंक में रखना आवश्यक है। 

### Docker

1.अपने प्रत्येक नोड पर, अपने लिनक्स वितरण के लि लिलिए डॉकर को
निम्नानुसार स्थापित करें
[Install Docker Engine](https://docs.docker.com/engine/install/#server). 
आप इसमें डॉकर का नवीनतम मान्य संस्करण पा सकते हैं 
[dependencies](https://git.k8s.io/kubernetes/build/dependencies.yaml) file.

2. डॉकर डेमॉन को कॉन्फ़िगर करें, विशेष रूप से कंटेनर के cgroups के प्रबंधन के लिए systemd का उपयोग करने के लिए। Configure
   ```shell
   sudo mkdir /etc/docker
   cat <<EOF | sudo tee /etc/docker/daemon.json
   {
     "exec-opts": ["native.cgroupdriver=systemd"],
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "100m"
     },
     "storage-driver": "overlay2"
   }
   EOF
   ```

   {{< note >}}
   `overlay2` is the preferred storage driver for systems running Linux kernel version 4.0 or higher, 
   or RHEL or CentOS using version 3.10.0-514 and above.
   {{< /note >}}

3. डॉकर को पुनरारंभ करें और बूट पर सक्षम करें:  Re

   ```shell
   sudo systemctl enable docker
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

{{< note >}}
अधिक जानकारी के लिए देखें 
  - [Configure the Docker daemon](https://docs.docker.com/config/daemon/)
  - [Control Docker with systemd](https://docs.docker.com/config/daemon/systemd/)
{{< /note >}}
