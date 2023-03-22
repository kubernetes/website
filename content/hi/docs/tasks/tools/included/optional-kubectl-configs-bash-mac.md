---
title: "macOS पर bash ऑटो-कम्पलीशन"
description: "macOS पर bash ऑटो-कम्पलीशन के लिए कुछ वैकल्पिक कॉन्फ़िगरेशन।"
headless: true
---

### परिचय

Bash के लिए kubectl समापन स्क्रिप्ट `kubectl completion bash` कमांड के साथ उत्पन्न की जा सकती है। आपके शेल में समापन स्क्रिप्ट को सोर्स करने से kubectl ऑटोकम्पलीशन सक्षम हो जाती है।```

हालाँकि, समापन की स्क्रिप्ट [**bash-completion**](https://github.com/scop/bash-completion) पर निर्भर हैं जिसका अर्थ है कि आपको पहले इस सॉफ़्टवेयर को इंस्टॉल करना होगा।

{{< warning >}}
Bash-completion के लिये दो संस्करण हैं  v1 और v2। v1 bash 3.2 के लिये हैं (जो macOS के लिए डिफ़ॉल्ट है), और v2 bash 4.1+ के लिए है।kubectl कम्पलीशन स्क्रिप्ट Bash-completion v1 और Bash 3.2 के साथ ठीक से **काम नहीं करती है**। इसके लिए **Bash-completion v2** और बैश 4.1+ की आवश्यकता है। इसलिए macOS पर kubectl कम्पलीशन को सही तरीके से इस्तेमाल करने के लिए , आपको bash 4.1+ इनस्टॉल और उपयोग करना होगा ([*निर्देश*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba))। निम्नलिखित निर्देश मानते हैं कि आप बैश का उपयोग करते हैं (अर्थात 4.1  का कोई भी बैश संस्करण या इससे नया)।
{{< /warning >}}

### अपग्रेड बैश 

निम्नलिखित निर्देश मानते हैं कि आप बैश 4.1+ का उपयोग करते हैं। आप अपने बैश के संस्करण को यह चलाकर देख सकते हैं:

```bash
echo $BASH_VERSION
```

यदि यह बहुत पुराना है, तो आप Homebrew का उपयोग करके इसे इनस्टॉल/अपग्रेड कर सकते हैं:

```bash
brew install bash
```

अपने शेल को पुनः लोड करें और सत्यापित करें कि इच्छित संस्करण का उपयोग किया जा रहा है:

```bash
echo $BASH_VERSION $SHELL
```

Homebrew आमतौर पर इसे `/usr/local/bin/bash` पर इनस्टॉल करता है।

### इनस्टॉल bash-completion

{{< note >}}
जैसा कि उल्लेख किया गया है, ये निर्देश मानते हैं कि आप Bash 4.1+ का उपयोग करते हैं, जिसका अर्थ है कि आप bash-completion v2 इनस्टॉल  करेंगे (Bash 3.2 और bash-completion v1 पर kubectl  पूर्णता काम नहीं करेगी)।
{{< /note >}}

आप `type_init_completion` से सत्यापित कर सकते हैं कि क्या आपके पास bash-completion v2 पहले से इनस्टॉल है। यदि नहीं, तो आप इसे Homebrew से इनस्टॉल कर सकते हैं

```bash
brew install bash-completion@2
```

जैसा कि इस कमांड के आउटपुट में बताया गया है, अपनी `~/.bash_profile` फ़ाइल में निम्नलिखित जोड़ें:

```bash
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"

[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```
  
अपने शेल को पुनः लोड करें और `type_init_completion` से सत्यापित करें कि bash-completion  v2 सही ढंग से इनस्टॉल है।

### kubectl ऑटोकम्पलीशन सक्षम करें

अब आपको यह सुनिश्चित करने की आवश्यकता है कि kubectl समापन स्क्रिप्ट आपके सभी शेल सत्रों (sourced) में प्राप्त हो जाए। इसे हासिल करने के कई तरीके हैं:

- अपने कम्पलीशन स्क्रिप्ट को  `~/.bash_profile`  में सोर्स करें:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- कम्पलीशन स्क्रिप्ट को `/usr/local/etc/bash_completion.d` डायरेक्टरी में जोड़ें:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- यदि आपके पास kubectl के लिए एक नाम (alias) है, तो आप उस उपनाम के साथ काम करने के लिए शेल कम्पलीशन को बढ़ा सकते हैं:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -F __start_kubectl k' >>~/.bash_profile
    ```

- यदि आपने Homebrew के साथ kubectl इनस्टॉल किया है (जैसा कि यहां बताया गया है), तो kubectl कम्पलीशन स्क्रिप्ट पहले से ही `/usr/local/etc/bash_completion.d/kubectl` में होनी चाहिए। ऐसे में आपको कुछ भी करने की जरूरत नहीं है।

{{< note >}}
bash-completion Homebrew से इनस्टॉल होने पर, सारे फाइल्स को `BASH_COMPLETION_COMPAT_DIR` डायरेक्टरी में सोर्स कर देता है। इसलिए आखरी दो तरीके काम करते हैं।
{{< /note >}}
किसी भी स्थिति में, आपके शेल को पुनः लोड करने के बाद, Kubectl पूर्णता कार्य करना चाहिए।
