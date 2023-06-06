---
title: macOS पर kubectl इंस्टॉल और सेटअप करें
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: macOS पर kubectl इंस्टॉल करें
---

## {{% heading "prerequisites" %}}

आप kubectl संस्करण का उपयोग करे जो आपके क्लस्टर के एक माइनर संस्करण भीतर हो। उदाहरण के लिए, v{{< skew latestVersion >}} क्लाइंट v{{< skew prevMinorVersion >}}, v{{< skew latestVersion >}} और v{{< skew nextMinorVersion >}} कण्ट्रोल प्लेन के साथ कम्युनिकेट कर सकते हैं।
kubectl के नए संस्करण का उपयोग करने से समस्या से बचत हो सकती है।

## macOS पर kubectl इंस्टॉल करें

macOS पर kubectl संस्थापित करने के लिए निम्नलिखित विधियाँ मौजूद हैं:

- [macOS पर curl के माध्यम से kubectl बाइनरी इंस्टॉल करें](#macOS-पर-curl-के-माध्यम-से-kubectl-बाइनरी-इंस्टॉल-करें)
- [Homebrew के माध्यम से macOS पर इंस्टॉल करें](#Homebrew-के-माध्यम-से-macOS-पर-इंस्टॉल-करें)
- [Macports के माध्यम से macOS पर इंस्टॉल करें](#Macports-के-माध्यम-से-macOS-पर-इंस्टॉल-करें)

### macOS पर curl के माध्यम से kubectl बाइनरी इंस्टॉल करें

1. नवीनतम रिलीज़ डाउनलोड करें:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   एक विशिष्ट संस्करण डाउनलोड करने के लिए, कमांड के इस हिस्से `$(curl -L -s https://dl.k8s.io/release/stable.txt)` को विशिष्ट संस्करण से बदलें।
   
   उदाहरण के लिए, Intel macOS पर {{< skew currentPatchVersion >}} संस्करण डाउनलोड करने के लिए, टाइप करें:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   और Apple Silicon macOS के लिए, टाइप करें:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. बाइनरी को मान्य करें (वैकल्पिक))

   kubectl चेकसम फाइल डाउनलोड करें:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   चेकसम फ़ाइल से kubectl बाइनरी को मान्य करें:

   ```bash
   echo "$(<kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   यदि मान्य है, तो आउटपुट है:

   ```console
   kubectl: OK
   ```

   अगर चेक फेल हो जाता है, तो `shasum` nonzero स्थिति के साथ बाहर निकलता है और इस आउटपुट के समान प्रिंट करता है:

   ```bash
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   बाइनरी और चेकसम का एक ही संस्करण डाउनलोड करें।
   {{< /note >}}

1. kubectl बाइनरी को एक्सेक्यूट करने योग्य बनायें।

   ```bash
   chmod +x ./kubectl
   ```

1. kubectl बाइनरी को अपने सिस्टम `PATH` के फ़ाइल स्थान पर ले जाएँ।

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   सुनिश्चित करें कि `/usr/local/bin` आपके पाथ एनवायरनमेंट वेरिएबल में है।
   {{< /note >}}

1. यह सुनिश्चित करने के लिए परीक्षण करें कि आपके द्वारा इंस्टॉल किया गया संस्करण उप-टू-डेट  है:

   ```bash
   kubectl version --client
   ```

### Homebrew के माध्यम से macOS पर इंस्टॉल करें

यदि आप macOS पर हैं और [Homebrew](https://brew.sh/) पैकेज मैनेजर का उपयोग कर रहे हैं, आप Homebrew के साथ kubectl इंस्टॉल कर सकते हैं।

1. इंस्टालेशन कमांड रन करें:

   ```bash
   brew install kubectl 
   ```

   या

   ```bash
   brew install kubernetes-cli
   ```

1. यह सुनिश्चित करने के लिए परीक्षण करें कि आपके द्वारा इंस्टॉल किया गया संस्करण उप-टू-डेट है:

   ```bash
   kubectl version --client
   ```

### Macports के माध्यम से macOS पर इंस्टॉल करें

यदि आप macOS पर हैं और [Macports](https://macports.org/) पैकेज मैनेजर का उपयोग कर रहे हैं, आप Macports के साथ kubectl इंस्टॉल कर सकते हैं।

1. इंस्टालेशन कमांड रन करें:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. यह सुनिश्चित करने के लिए परीक्षण करें कि आपके द्वारा इंस्टॉल किया गया संस्करण उप-टू-डेट है:

   ```bash
   kubectl version --client
   ```

## kubectl कॉन्फ़िगरेशन सत्यापित करें

{{< include "included/verify-kubectl.md" >}}

## वैकल्पिक Kubectl कॉन्फ़िगरेशन और प्लगइन्स

### शेल ऑटोकम्प्लेशन सक्षम करें

kubectl Bash और Zsh के लिए ऑटोकम्प्लेशन का सपोर्ट प्रदान करता है, जो आपका काफी समय बचा सकता है।

नीचे Bash और Zsh के लिए ऑटोकम्प्लेशन स्थापित करने की प्रक्रियाएँ हैं।

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl convert` प्लगइन इंस्टॉल करें

{{< include "included/kubectl-convert-overview.md" >}}

1. इस कमांड से नवीनतम रिलीज डाउनलोड करें:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. बाइनरी को मान्य करें (वैकल्पिक)

   kubectl-convert चेकसम फ़ाइल डाउनलोड करें:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   चेकसम फ़ाइल से kubectl-convert बाइनरी को मान्य करें:

   ```bash
   echo "$(<kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   यदि मान्य है, तो आउटपुट है:

   ```console
   kubectl-convert: OK
   ```

   अगर चेक फेल हो जाता है, तो `sha256` nonzero स्थिति के साथ बाहर निकलता है और इस आउटपुट के समान प्रिंट करता है:

   ```bash
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   बाइनरी और चेकसम का एक ही संस्करण डाउनलोड करें।
   {{< /note >}}

1. Kubectl-कन्वर्ट बाइनरी को एक्सेक्यूट करने योग्य बनाएं

   ```bash
   chmod +x ./kubectl-convert
   ```

1. kubectl-convert binary बाइनरी को अपने सिस्टम `PATH` के फ़ाइल स्थान पर ले जाएँ।

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   सुनिश्चित करें कि `/usr/local/bin` आपके पाथ एनवायरनमेंट वेरिएबल में है।
   {{< /note >}}

1. सत्यापित करें कि प्लगइन सफलतापूर्वक इंस्टॉल हो गया है

   ```shell
   kubectl convert --help
   ```

   यदि आपको कोई त्रुटि नहीं दिखाई देती है, तो इसका मतलब है कि प्लगइन सफलतापूर्वक इंस्टॉल हो गया है।

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
