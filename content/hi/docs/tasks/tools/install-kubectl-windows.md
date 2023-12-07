---
title: Windows पर kubectl इंस्टॉल और सेटअप करें
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Windows पर kubectl इंस्टॉल करें
---

## {{% heading "prerequisites" %}}

आप kubectl संस्करण का उपयोग करे जो आपके क्लस्टर के एक माइनर संस्करण भीतर हो। उदाहरण के लिए, v{{< skew latestVersion >}} क्लाइंट v{{< skew prevMinorVersion >}}, v{{< skew latestVersion >}} और v{{< skew nextMinorVersion >}} कण्ट्रोल प्लेन के साथ कम्युनिकेट कर सकते हैं।
kubectl के नए संस्करण का उपयोग करने से समस्या से बचत हो सकती है।

## Windows पर kubectl इंस्टॉल करें

Windows पर kubectl संस्थापित करने के लिए निम्नलिखित विधियाँ मौजूद हैं:

- [Windows पर curl के माध्यम से kubectl बाइनरी इंस्टॉल करें](#Windows-पर-curl-के-माध्यम-से-kubectl-बाइनरी-इंस्टॉल-करें)
- [Chocolatey या Scoop का उपयोग करके Windows पर इंस्टॉल करें](#Chocolatey-या-Scoop-का-उपयोग-करके-Windows-पर-इंस्टॉल-करें)

### Windows पर curl के माध्यम से kubectl बाइनरी इंस्टॉल करें

1. [latest release {{< skew currentPatchVersion >}}](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe) डाउनलोड करें।

   या यदि आपके पास `curl` है, तो इस कमांड का उपयोग करें:

   ```powershell
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe
   ```

   {{< note >}}
   नवीनतम स्थिर संस्करण का पता लगाने के लिए (जैसे, स्क्रिप्टिंग के लिए), [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt) पर एक नज़र डालें।
   {{< /note >}}

1. बाइनरी को मान्य करें (वैकल्पिक)

   kubectl चेकसम फाइल डाउनलोड करें:

   ```powershell
   curl -LO https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256
   ```

   चेकसम फ़ाइल से kubectl बाइनरी को मान्य करें:

   - मैन्युअल रूप से कमांड प्रॉम्प्ट का उपयोग करके `CertUtil` के आउटपुट की तुलना डाउनलोडेड चेकसम फ़ाइल से करें:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - `True` या `False` परिणाम प्राप्त करने के लिए `-eq` ऑपरेटर का उपयोग करके सत्यापन को ऑटोमेट करने के लिए powershell का उपयोग करें:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. अपने `PATH` में बाइनरी जोड़ें।

1. यह सुनिश्चित करने के लिए परीक्षण करें कि `kubectl` संस्करण डाउनलोड के समान है:

   ```cmd
   kubectl version --client
   ```

{{< note >}}
[Windows के लिए Docker Desktop](https://docs.docker.com/docker-for-windows/#kubernetes) `kubectl` का अपना संस्करण `PATH` में जोड़ता है।
यदि आपने पहले Docker Desktop स्थापित किया है, तो आपको Docker Desktop इंस्टॉलर द्वारा जोड़े गए एक `PATH` से पहले अपनी `PATH` प्रविष्टि डालने की आवश्यकता हो सकती है या Docker Desktop के `kubectl` को हटा दें।
{{< /note >}}

### Chocolatey या Scoop का उपयोग करके Windows पर इंस्टॉल करें

1. Windows पर kubectl इंस्टॉल करने के लिए आप या तो [Chocolatey](https://chocolatey.org) पैकेज मैनेजर अथवा [Scoop](https://scoop.sh) कमांड-लाइन इंस्टॉलर का उपयोग कर सकते हैं।

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. यह सुनिश्चित करने के लिए परीक्षण करें कि आपके द्वारा इंस्टॉल किया गया संस्करण उप-टू-डेट है:

   ```powershell
   kubectl version --client
   ```

1. अपनी होम डायरेक्टरी पर जाएं:

   ```powershell
   # यदि आप cmd.exe का प्रयोग कर रहे हैं, तो: cd %USERPROFILE%
   cd ~
   ```

1. `.kube` डायरेक्टरी बनाएं:

   ```powershell
   mkdir .kube
   ```

1. आपके द्वारा अभी बनाई गई `.kube` डायरेक्टरी में जाएं:

   ```powershell
   cd .kube
   ```

1. दूरस्थ कुबेरनेट्स क्लस्टर का उपयोग करने के लिए kubectl को कॉन्फ़िगर करें:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
अपनी पसंद के टेक्स्ट एडिटर जैसे नोटपैड का उपयोग कर कॉन्फिग फाइल को एडिट करें।
{{< /note >}}

## kubectl कॉन्फ़िगरेशन सत्यापित करें

{{< include "included/verify-kubectl.md" >}}

## वैकल्पिक kubectl कॉन्फ़िगरेशन और प्लगइन्स

### शेल ऑटोकम्प्लेशन सक्षम करें

kubectl Bash और Zsh के लिए ऑटोकम्प्लेशन का सपोर्ट प्रदान करता है, जो आपको बहुत सारी टाइपिंग बचा सकता है।

नीचे Zsh के लिए ऑटोकम्प्लेशन स्थापित करने की प्रक्रियाएँ हैं, यदि आप इसे Windows पर चला रहे हैं।

{{< include "included/optional-kubectl-configs-zsh.md" >}}

### इंस्टॉल `kubectl convert` प्लगइन

{{< include "included/kubectl-convert-overview.md" >}}

1. इस कमांड से नवीनतम रिलीज डाउनलोड करें:

   ```powershell
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe
   ```

1. बाइनरी को मान्य करें (वैकल्पिक)

   kubectl-convert चेकसम फ़ाइल डाउनलोड करें:

   ```powershell
   curl -LO https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256
   ```

   चेकसम फ़ाइल से kubectl-convert बाइनरी को मान्य करें:

   - मैन्युअल रूप से कमांड प्रॉम्प्ट का उपयोग करके `CertUtil` के आउटपुट की तुलना डाउनलोड किये गये चेकसम फ़ाइल से करें:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - `True` या `False` परिणाम प्राप्त करने और `-eq` ऑपरेटर का उपयोग करके सत्यापन को ऑटोमेट करने के लिए Powershell का उपयोग करें:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. अपने `PATH` में बाइनरी जोड़ें।

1. सत्यापित करें कि प्लगइन सफलतापूर्वक इंस्टॉल हो गया है।

   ```shell
   kubectl convert --help
   ```

   यदि आपको कोई त्रुटि नहीं दिखाई देती है, तो इसका मतलब है कि प्लगइन सफलतापूर्वक इंस्टॉल हो गया है।

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
