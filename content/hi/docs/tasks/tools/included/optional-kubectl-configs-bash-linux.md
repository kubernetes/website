---
title: "Linux पर bash ऑटो-कम्पलीशन"
description: "Linux पर bash ऑटो-कम्पलीशन के लिए कुछ वैकल्पिक विन्विन्यास।"
headless: true
---

 ## परिचय

 Bash के लिए kubectl  कम्प्लिशन स्क्रिप्ट `kubectl completion bash` कमांड के साथ उत्पन्न की जा सकती है। आपके शेल में कम्प्लिशन स्क्रिप्ट को सोर्स करने से kubectl ऑटोकम्प्लिशन ऐनेबल हो जाती है।

 हालाँकि, कम्प्लिशन की स्क्रिप्ट इस पर निर्भर करती है [**bash-completion**](https://github.com/scop/bash-completion), जिसका अर्थ है कि आपको पहले इस सॉफ़्टवेयर को स्थापित करना होगा (आप परीक्षण कर  सकते हैं कि क्या आपने `टाइप _init_completion`  चलाकर पहले से ही bash-completion स्थापित की है)।

## Bash-completion को स्थापित करें

कई पैकेज मैनेजर द्वारा bash-`completion` प्रदान की जाती है (देखें [यहाँ](https://github.com/scop/bash-completion#installation)) । आप इसे `apt-get install bash-completion` या `yum install bash-completion` आदि के साथ इंस्टॉल कर सकते हैं।

जो ऊपर के कमांड `/usr/share/bash-completion/bash_completion` बनाते हैं, जो bash-completion की मुख्य स्क्रिप्ट है। आपके पैकेज मैनेजर के आधार पर, आपको इस फाइल को अपनी `~/.bashrc` फाइल में मैन्युअल रूप से सोर्स करना होगा।

यह पता लगाने के लिए, अपना शेल पुनः लोड करें और `type _init_completion` रन करे। यदि कमांड  सफल होता है, तो आप पहले से ही सेट हैं, अन्यथा अपनी `~/.bashrc` फ़ाइल में निम्नलिखित जोड़ें :
```bash
source /usr/share/bash-completion/bash_completion
```

अपना शेल पुनः लोड करें और सत्यापित करें कि `type _init_completion` टाइप करके bash-completion सही ढंग से इंस्टॉल है।

## kubectl ऑटोकम्प्लिशन ऐनेबल करे

अब आपको यह सुनिश्चित करने की आवश्यकता है कि Kubectl  कम्प्लिशन स्क्रिप्ट आपके सभी शेल सत्रों (sourced) में प्राप्त हो जाए। आप ऐसा दो तरीकों से कर सकते हैं:

- अपनी `~/.bashrc` फ़ाइल में  कम्प्लिशन स्क्रिप्ट सॉर्स करें :

   ```bash
  echo 'source <(kubectl completion bash)' >>~/.bashr
  ```
 -  कम्प्लिशन स्क्रिप्ट को `/etc/bash_completion.d` डायरेक्टरी में जोड़ें:
    ```bash
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```
    

यदि आप के पास kubectl के लिए एक अन्य नाम (alias) है, तो आप उस अन्य नाम के साथ काम करने के लिए शेल कम्प्लिशन को बढ़ा सकते हैं:    
```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```
{{< note >}}
बैश- कम्प्लिशन स्रोत सभी कम्प्लिशन स्क्रिप्ट `/etc/bash_completion.d` में ।
{{< /note >}}
दोनों दृष्टिकोण बराबर हैं। आपके शेल को पुनः लोड करने के बाद, Kubectl ऑटोकम्प्लिशन कार्य करना शुरू कर देगा।
