---
title: एकाधिक क्लस्टर्स तक पहुंच कॉन्फ़िगर करें
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: क्लस्टर्स तक पहुंच कॉन्फ़िगर करें
---

<!-- overview -->

यह पेज कॉन्फ़िगरेशन फ़ाइलों का उपयोग करके एकाधिक क्लस्टर्स तक पहुंच को कॉन्फ़िगर करने का तरीका दिखाता है। एक बार जब आपके क्लस्टर्स, उपयोगकर्ता और कॉन्टेक्स्ट एक या अधिक कॉन्फ़िगरेशन फ़ाइलों में परिभाषित हो जाते हैं, तो आप `kubectl config use-context` कमांड का उपयोग करके क्लस्टर्स के बीच तेज़ी से स्विच कर सकते हैं।

{{< note >}}
एक फ़ाइल जिसका उपयोग क्लस्टर तक पहुंच को कॉन्फ़िगर करने के लिए किया जाता है, उसे कभी-कभी *kubeconfig फ़ाइल* कहा जाता है। यह कॉन्फ़िगरेशन फ़ाइलों को संदर्भित करने का एक सामान्य तरीका है।
इसका मतलब यह नहीं है कि `kubeconfig` नाम की कोई फ़ाइल है।
{{< /note >}}

{{< warning >}}
केवल विश्वसनीय स्रोतों से kubeconfig फ़ाइलों का उपयोग करें। विशेष रूप से तैयार की गई kubeconfig
फ़ाइल का उपयोग दुर्भावनापूर्ण कोड निष्पादन या फ़ाइल एक्सपोज़र का कारण बन सकता है।
यदि आपको एक अविश्वसनीय kubeconfig फ़ाइल का उपयोग करना ही है, तो पहले इसकी सावधानीपूर्वक जांच करें, जैसे आप एक शेल स्क्रिप्ट की करेंगे।
{{< /warning>}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

यह जांचने के लिए कि {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} इंस्टॉल है,
`kubectl version --client` चलाएं। kubectl का वर्जन आपके क्लस्टर के API सर्वर के 
[एक माइनर वर्जन के भीतर](/releases/version-skew-policy/#kubectl) होना चाहिए।

<!-- steps -->

## क्लस्टर्स, उपयोगकर्ता और कॉन्टेक्स्ट को परिभाषित करें

मान लीजिए आपके पास दो क्लस्टर हैं, एक डेवलपमेंट कार्य के लिए और एक टेस्ट कार्य के लिए।
`development` क्लस्टर में, आपके फ्रंटएंड डेवलपर्स `frontend` नामक नेमस्पेस में काम करते हैं,
और आपके स्टोरेज डेवलपर्स `storage` नामक नेमस्पेस में काम करते हैं। आपके `test` क्लस्टर में,
डेवलपर्स डिफ़ॉल्ट नेमस्पेस में काम करते हैं, या वे जैसा उचित समझें वैसे सहायक नेमस्पेस बनाते हैं। डेवलपमेंट क्लस्टर तक पहुंच के लिए सर्टिफिकेट द्वारा प्रमाणीकरण की आवश्यकता होती है। टेस्ट क्लस्टर तक पहुंच के लिए उपयोगकर्ता नाम और पासवर्ड द्वारा प्रमाणीकरण की आवश्यकता होती है।

`config-exercise` नामक एक डायरेक्टरी बनाएं। अपनी
`config-exercise` डायरेक्टरी में, इस सामग्री के साथ `config-demo` नामक एक फ़ाइल बनाएं:

```yaml
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: test

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-test
```

एक कॉन्फ़िगरेशन फ़ाइल क्लस्टर्स, उपयोगकर्ताओं और कॉन्टेक्स्ट का वर्णन करती है। आपकी `config-demo` फ़ाइल
में दो क्लस्टर्स, दो उपयोगकर्ताओं और तीन कॉन्टेक्स्ट का वर्णन करने का ढांचा है।

अपनी `config-exercise` डायरेक्टरी में जाएं। अपनी कॉन्फ़िगरेशन फ़ाइल में क्लस्टर विवरण जोड़ने के लिए ये कमांड दर्ज करें:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster test --server=https://5.6.7.8 --insecure-skip-tls-verify
```

अपनी कॉन्फ़िगरेशन फ़ाइल में उपयोगकर्ता विवरण जोड़ें:

{{< caution >}}
कुबेरनेट्स क्लाइंट कॉन्फ़िग में पासवर्ड स्टोर करना जोखिमपूर्ण है। एक बेहतर विकल्प क्रेडेंशियल प्लगइन का उपयोग करना और उन्हें अलग से स्टोर करना होगा। देखें: [client-go क्रेडेंशियल प्लगइन्स](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
{{< /caution >}}

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< note >}}
- एक उपयोगकर्ता को हटाने के लिए आप `kubectl --kubeconfig=config-demo config unset users.<name>` चला सकते हैं
- एक क्लस्टर को हटाने के लिए, आप `kubectl --kubeconfig=config-demo config unset clusters.<name>` चला सकते हैं
- एक कॉन्टेक्स्ट को हटाने के लिए, आप `kubectl --kubeconfig=config-demo config unset contexts.<name>` चला सकते हैं
{{< /note >}}

अपनी कॉन्फ़िगरेशन फ़ाइल में कॉन्टेक्स्ट विवरण जोड़ें:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-test --cluster=test --namespace=default --user=experimenter
```

जोड़े गए विवरण देखने के लिए अपनी `config-demo` फ़ाइल खोलें। `config-demo` फ़ाइल खोलने के विकल्प के रूप में,
आप `config view` कमांड का उपयोग कर सकते हैं।

```shell
kubectl config --kubeconfig=config-demo view
```

आउटपुट दो क्लस्टर्स, दो उपयोगकर्ताओं और तीन कॉन्टेक्स्ट दिखाता है:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # Documentation note (this comment is NOT part of the command output).
    # Storing passwords in Kubernetes client config is risky.
    # A better alternative would be to use a credential plugin
    # and store the credentials separately.
    # See https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
    password: some-password
    username: exp
```

ऊपर दिए गए `fake-ca-file`, `fake-cert-file` और `fake-key-file` सर्टिफिकेट फ़ाइलों के पाथनेम के लिए प्लेसहोल्डर हैं। आपको इन्हें अपने वातावरण में सर्टिफिकेट फ़ाइलों के वास्तविक पाथनेम में बदलना होगा।

कभी-कभी आप अलग सर्टिफिकेट फ़ाइलों के बजाय यहां एम्बेडेड Base64-एनकोडेड डेटा का उपयोग करना चाह सकते हैं; इस स्थिति में आपको कीज़ में `-data` प्रत्यय जोड़ना होगा, उदाहरण के लिए,
`certificate-authority-data`, `client-certificate-data`, `client-key-data`।

प्रत्येक कॉन्टेक्स्ट एक त्रिक (क्लस्टर, उपयोगकर्ता, नेमस्पेस) है। उदाहरण के लिए,
`dev-frontend` कॉन्टेक्स्ट कहता है, "`development` क्लस्टर के `frontend` नेमस्पेस तक पहुंच के लिए `developer` 
उपयोगकर्ता के क्रेडेंशियल्स का उपयोग करें"।

वर्तमान कॉन्टेक्स्ट सेट करें:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

अब जब भी आप कोई `kubectl` कमांड दर्ज करेंगे, कार्रवाई `dev-frontend` कॉन्टेक्स्ट में सूचीबद्ध क्लस्टर 
और नेमस्पेस पर लागू होगी। और कमांड `dev-frontend` कॉन्टेक्स्ट में सूचीबद्ध उपयोगकर्ता के क्रेडेंशियल्स का उपयोग करेगी।

वर्तमान कॉन्टेक्स्ट से संबंधित केवल कॉन्फ़िगरेशन जानकारी देखने के लिए,
`--minify` फ्लैग का उपयोग करें।

```shell
kubectl config --kubeconfig=config-demo view --minify
```

आउटपुट `dev-frontend` कॉन्टेक्स्ट से संबंधित कॉन्फ़िगरेशन जानकारी दिखाता है:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

अब मान लीजिए कि आप कुछ समय के लिए टेस्ट क्लस्टर में काम करना चाहते हैं।

वर्तमान कॉन्टेक्स्ट को `exp-test` में बदलें:

```shell
kubectl config --kubeconfig=config-demo use-context exp-test
```

अब आप जो भी `kubectl` कमांड देंगे वह `test` क्लस्टर के डिफ़ॉल्ट नेमस्पेस पर लागू होगी। 
और कमांड `exp-test` कॉन्टेक्स्ट में सूचीबद्ध उपयोगकर्ता के क्रेडेंशियल्स का उपयोग करेगी।

नए वर्तमान कॉन्टेक्स्ट, `exp-test` से संबंधित कॉन्फ़िगरेशन देखें।

```shell
kubectl config --kubeconfig=config-demo view --minify
```

अंत में, मान लीजिए कि आप कुछ समय के लिए `development` क्लस्टर के `storage` नेमस्पेस में काम करना चाहते हैं।

वर्तमान कॉन्टेक्स्ट को `dev-storage` में बदलें:

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

नए वर्तमान कॉन्टेक्स्ट, `dev-storage` से संबंधित कॉन्फ़िगरेशन देखें।

```shell
kubectl config --kubeconfig=config-demo view --minify
```

## दूसरी कॉन्फ़िगरेशन फ़ाइल बनाएं

अपनी `config-exercise` डायरेक्टरी में, इस सामग्री के साथ `config-demo-2` नामक एक फ़ाइल बनाएं:

```yaml
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

पूर्ववर्ती कॉन्फ़िगरेशन फ़ाइल एक नया संदर्भ `dev-ramp-up` परिभाषित करती है।

## KUBECONFIG पर्यावरण चर सेट करें

देखें कि क्या आपके पास `KUBECONFIG` नामक कोई पर्यावरण चर है। यदि हां, तो अपने `KUBECONFIG` पर्यावरण चर का वर्तमान मान सहेजें, ताकि आप इसे बाद में पुनर्स्थापित कर सकें। उदाहरण के लिए:

### Linux

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

`KUBECONFIG` पर्यावरण चर कॉन्फ़िगरेशन फ़ाइलों के पथों की एक सूची है। यह सूची Linux और Mac के लिए कॉलन-डिलीमिटेड और Windows के लिए सेमीकोलन-डिलीमिटेड होती है। यदि आपके पास `KUBECONFIG` पर्यावरण चर है, तो सूची में मौजूद कॉन्फ़िगरेशन फ़ाइलों से परिचित हो जाएं।

अपने `KUBECONFIG` पर्यावरण चर में अस्थायी रूप से दो पथ जोड़ें। उदाहरण के लिए:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:config-demo:config-demo-2"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

अपने `config-exercise` डायरेक्टरी में, यह कमांड दर्ज करें:

```shell
kubectl config view
```

आउटपुट आपके `KUBECONFIG` पर्यावरण चर में सूचीबद्ध सभी फ़ाइलों से मिली हुई जानकारी दिखाता है। विशेष रूप से, ध्यान दें कि मिली हुई जानकारी में `config-demo-2` फ़ाइल से `dev-ramp-up` संदर्भ और `config-demo` फ़ाइल से तीन संदर्भ शामिल हैं।

```yaml
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
```

अधिक जानकारी के लिए कि कैसे kubeconfig फाइलों को मर्ज किया जाता है, देखें 
[क्लस्टर एक्सेस को kubeconfig फाइलों का उपयोग करके व्यवस्थित करना](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

## $HOME/.kube डायरेक्टरी का अन्वेषण करें

यदि आपके पास पहले से एक क्लस्टर है, और आप `kubectl` का उपयोग करके क्लस्टर के साथ इंटरैक्ट कर सकते हैं, तो संभवतः आपके पास `$HOME/.kube` डायरेक्टरी में एक `config` नामक फाइल होगी।

`$HOME/.kube` पर जाएं, और देखें कि वहां कौन-कौन सी फाइलें हैं। आमतौर पर, वहां एक `config` नामक फाइल होती है। इस डायरेक्टरी में अन्य कॉन्फ़िगरेशन फाइलें भी हो सकती हैं। इन फाइलों की सामग्री से संक्षेप में परिचित हो जाएं।

## $HOME/.kube/config को अपने KUBECONFIG एनवायरनमेंट वेरिएबल में जोड़ें

यदि आपके पास `$HOME/.kube/config` फाइल है, और यह पहले से आपके `KUBECONFIG` एनवायरनमेंट वेरिएबल में सूचीबद्ध नहीं है, तो इसे अभी अपने `KUBECONFIG` एनवायरनमेंट वेरिएबल में जोड़ें। उदाहरण के लिए:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:${HOME}/.kube/config"
```

### Windows Powershell

```powershell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

उन सभी फाइलों से मर्ज की गई कॉन्फ़िगरेशन जानकारी देखें जो अब आपके `KUBECONFIG` एनवायरनमेंट वेरिएबल में सूचीबद्ध हैं। अपने config-exercise डायरेक्टरी में, निम्नलिखित कमांड दर्ज करें:

```shell
kubectl config view
```

## साफ-सफाई करें

अपने `KUBECONFIG` एनवायरनमेंट वेरिएबल को उसकी मूल मान में वापस करें। उदाहरण के लिए:<br>

### Linux

```shell
export KUBECONFIG="$KUBECONFIG_SAVED"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

## kubeconfig द्वारा दर्शाए गए विषय की जांच करें

यह हमेशा स्पष्ट नहीं होता कि क्लस्टर से प्रमाणित होने के बाद आपको कौन से गुण (उपयोगकर्ता नाम, समूह) प्राप्त होंगे। 
यदि आप एक ही समय में एक से अधिक क्लस्टर प्रबंधित कर रहे हैं, तो यह और भी चुनौतीपूर्ण हो सकता है।

आपके चुने गए Kubernetes क्लाइंट संदर्भ के लिए उपयोगकर्ता नाम जैसे विषय गुणों की जांच करने के लिए एक `kubectl` सब-कमांड है: `kubectl auth whoami`।

इस बारे में अधिक विस्तार से जानने के लिए पढ़ें [क्लाइंट के लिए प्रमाणन जानकारी तक API एक्सेस](/docs/reference/access-authn-authz/authentication/#self-subject-review)।

## {{% heading "whatsnext" %}}

* [क्लस्टर एक्सेस को kubeconfig फाइलों का उपयोग करके व्यवस्थित करना](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)
