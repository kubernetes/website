---
title: "Linux पर bash ऑटो-कम्पलीशन"
description: "Linux पर bash ऑटो-कम्पलीशन के लिए कुछ वैकल्पिक कॉन्फ़िगरेशन।"
headless: true
---

## परिचय

Bash के लिए kubectl समापन स्क्रिप्ट `kubectl completion bash` कमांड के साथ उत्पन्न की जा सकती है। आपके शेल में समापन स्क्रिप्ट को सोर्स करने से kubectl ऑटोकम्पलीशन सक्षम हो जाती है।

हालाँकि, समापन की स्क्रिप्ट [**bash-completion**](https://github.com/scop/bash-completion) पर निर्भर हैं जिसका अर्थ है कि आपको पहले इस सॉफ़्टवेयर को इंस्टॉल करना होगा (आप `type _init_completion`  चलाकर परीक्षण कर सकते हैं कि आपने पहले से bash-completion इंस्टॉल की है या नहीं)।

## Bash-completion को इंस्टॉल करें

कई पैकेज मैनेजर द्वारा bash-completion प्रदान की जाती है ([यहाँ](https://github.com/scop/bash-completion#installation) देखें)। आप इसे `apt-get install bash-completion` या `yum install bash-completion` आदि के साथ इंस्टॉल कर सकते हैं।

यह कमांड `/usr/share/bash-completion/bash_completion` उत्त्पन्न करता है, जो bash-completion की मुख्य स्क्रिप्ट है। आपके पैकेज मैनेजर के आधार पर, आपको इस फाइल को अपनी `~/.bashrc` फाइल में मैन्युअल रूप से सोर्स करना होगा।

यह पता लगाने के लिए, अपना शेल पुनः लोड करें और `type _init_completion` रन करे। यदि कमांड सफल होता है, तो आप पहले से ही तैयार हैं, अन्यथा अपनी `~/.bashrc` फ़ाइल में निम्नलिखित जोड़ें:

```bash
source /usr/share/bash-completion/bash_completion
```

अपना शेल पुनः लोड करें और `type _init_completion` टाइप करके सत्यापित करें कि बैश-कम्पलीशन सही ढंग से इंस्टॉल है।

## kubectl ऑटोकम्पलीशन सक्षम करे

अब आपको यह सुनिश्चित करने की आवश्यकता है कि kubectl समापन स्क्रिप्ट आपके सभी शेल सत्रों (sourced) में प्राप्त हो जाए। आप ऐसा दो तरीकों से कर सकते हैं:

- अपनी `~/.bashrc` फ़ाइल में समापन स्क्रिप्ट सॉर्स करें:

   ```bash
  echo 'source <(kubectl completion bash)' >>~/.bashr
  ```
 -   समापन स्क्रिप्ट को `/etc/bash_completion.d` डायरेक्टरी में जोड़ें:
    ```bash
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```
    

यदि आप के पास kubectl के लिए एक अन्य नाम (alias) है, तो आप उस अन्य नाम के साथ काम करने के लिए शेल समापन को बढ़ा सकते हैं:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```
{{< note >}}
bash-completion सभी समापन स्क्रिप्ट को `/etc/bash_completion.d` में सोर्स करता है।
{{< /note >}}

दोनों दृष्टिकोण बराबर हैं। आपके शेल को पुनः लोड करने के बाद, Kubectl ऑटोकम्पलीशन कार्य करना शुरू कर देगा।