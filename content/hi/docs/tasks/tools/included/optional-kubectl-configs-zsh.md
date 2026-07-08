---
title: "zsh ऑटो-कम्पलीशन"
description: "zsh ऑटो-कम्पलीशन के लिए कुछ वैकल्पिक कॉन्फ़िगरेशन।"
headless: true
---

Zsh के लिए kubectl कम्पलीशन स्क्रिप्ट `kubectl completion zsh` कमांड के साथ उत्पन्न की जा सकती है। आपके शेल में कम्पलीशन स्क्रिप्ट को सोर्स करने से kubectl ऑटो-कम्पलीशन सक्षम हो जाती है।

अपने सभी शेल सत्रों में ऐसा करने के लिए, निम्नलिखित को अपनी `~/.zshrc` फ़ाइल में जोड़ें:

```zsh
source <(kubectl completion zsh)
```

यदि आपके पास kubectl के लिए एक उपनाम है, तो आप उस उपनाम के साथ काम करने के लिए शेल कम्पलीशन को बढ़ा सकते हैं:

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

अपने शेल को पुनः लोड करने के बाद, kubectl ऑटो-कम्पलीशन कार्य करना चाहिए।

यदि आपको कोई त्रुटि मिलती है जैसे `complete:13: command not found: compdef`, तो अपनी `~/.zshrc` फ़ाइल की शुरुआत में निम्नलिखित जोड़ें:

```zsh
autoload -Uz compinit
compinit
```