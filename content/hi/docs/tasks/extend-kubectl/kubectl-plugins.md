---
title: प्लगइन्स के साथ kubectl का विस्तार करें
reviewers:
- juanvallejo
- soltysh
description: Extend kubectl by creating and installing kubectl plugins.
content_type: task
---

<!-- overview -->

यह मार्गदर्शिका दर्शाती है कि `kubectl` के लिए एक्सटेंशन कैसे इंस्टॉल और लिखें। एक Kubernetes क्लस्टर के साथ बातचीत करने के लिए आवश्यक बिल्डिंग ब्लॉक के रूप में कोर `kubectl` कमांड के बारे में सोचकर, एक क्लस्टर व्यवस्थापक प्लगइन्स को अधिक जटिल व्यवहार बनाने के लिए इन बिल्डिंग ब्लॉक का उपयोग करने के साधन के रूप में सोच सकता है। प्लगइन्स नए उप-कमांड के साथ `kubectl` का विस्तार करते हैं, जिससे `kubectl` के मुख्य वितरण में शामिल नहीं की गई नई और कस्टम सुविधाओं की अनुमति मिलती है।

## {{% heading "prerequisites" %}}

You need to have a working `kubectl` binary installed.

<!-- steps -->

## kubectl प्लगइन्स स्थापित करना

प्लगइन एक स्टैंडअलोन निष्पादन योग्य फ़ाइल है, जिसका नाम `kubectl-` से शुरू होता है। प्लगइन को इंस्टॉल करने के लिए, इसकी निष्पादन योग्य फ़ाइल को अपने `PATH` पर कहीं भी ले जाएँ।

आप [Krew](https://krew.dev/) का उपयोग करके ओपन सोर्स में उपलब्ध kubectl प्लगइन्स को भी खोज और इंस्टॉल कर सकते हैं। Krew एक प्लगइन मैनेजर है जिसे Kubernetes SIG CLI समुदाय द्वारा बनाए रखा जाता है।

{{< caution >}}
Krew [प्लगइन इंडेक्स](https://krew.sigs.k8s.io/plugins/) के ज़रिए उपलब्ध Kubectl प्लगइन्स की सुरक्षा के लिए ऑडिट नहीं की जाती है। आपको अपने जोखिम पर थर्ड-पार्टी प्लगइन्स इंस्टॉल और चलाना चाहिए, क्योंकि वे आपकी मशीन पर चलने वाले मनमाने प्रोग्राम हैं।
{{< /caution >}}

### प्लगइन्स की खोज

`kubectl` एक कमांड `kubectl plugin list` प्रदान करता है जो आपके `PATH` में वैध प्लगइन निष्पादनयोग्य फ़ाइलों की खोज करता है। इस कमांड को निष्पादित करने से आपके `PATH` में सभी फ़ाइलों का ट्रैवर्सल होता है। कोई भी फ़ाइल जो निष्पादनयोग्य है, और `kubectl-` से शुरू होती है, वह इस कमांड के आउटपुट में *उसी क्रम में दिखाई देगी जिस क्रम में वे आपके `PATH` में मौजूद हैं*। `kubectl-` से शुरू होने वाली किसी भी फ़ाइल के लिए एक चेतावनी शामिल की जाएगी जो *निष्पादनयोग्य* नहीं है। एक चेतावनी उन सभी वैध प्लगइन फ़ाइलों के लिए भी शामिल की जाएगी जो एक दूसरे के नाम को ओवरलैप करती हैं।

आप समुदाय द्वारा क्यूरेट किए गए [प्लगइन इंडेक्स (https://krew.sigs.k8s.io/plugins/) से `kubectl`
प्लगइन्स को खोजने और इंस्टॉल करने के लिए [Krew](https://krew.dev/) का उपयोग कर सकते हैं।

#### प्लगइन्स बनाएं

`kubectl` प्लगइन्स को `PATH` में `kubectl-create-something` बाइनरी प्रदान करके `kubectl create something` आकार के कस्टम क्रिएट कमांड जोड़ने की अनुमति देता है।

#### Limitations

वर्तमान में ऐसे प्लगइन बनाना संभव नहीं है जो मौजूदा `kubectl` कमांड को अधिलेखित कर दें या `create` के अलावा अन्य कमांड का विस्तार करें। उदाहरण के लिए, `kubectl-version` प्लगइन बनाने से वह प्लगइन कभी निष्पादित नहीं होगा, क्योंकि मौजूदा `kubectl version` कमांड हमेशा उस पर प्राथमिकता लेगा। इस सीमा के कारण, मौजूदा `kubectl` कमांड में नए उपकमांड जोड़ने के लिए प्लगइन का उपयोग करना भी *संभव* नहीं है। उदाहरण के लिए, अपने प्लगइन को `kubectl-attach-vm` नाम देकर उपकमांड `kubectl attach vm` जोड़ने से उस प्लगइन को अनदेखा कर दिया जाएगा।

`kubectl plugin list` shows warnings for any valid plugins that attempt to do this.

## kubectl प्लगइन्स लिखना

आप किसी भी प्रोग्रामिंग भाषा या स्क्रिप्ट में प्लगइन लिख सकते हैं जो आपको कमांड-लाइन कमांड लिखने की अनुमति देता है।

प्लगइन इंस्टॉलेशन या प्री-लोडिंग की कोई आवश्यकता नहीं है। प्लगइन निष्पादन योग्य `kubectl` बाइनरी से विरासत में मिला वातावरण प्राप्त करते हैं। एक प्लगइन यह निर्धारित करता है कि वह अपने नाम के आधार पर किस कमांड पथ को लागू करना चाहता है।
उदाहरण के लिए, `kubectl-foo` नामक एक प्लगइन एक कमांड `kubectl foo` प्रदान करता है। आपको अपने `PATH` में कहीं प्लगइन निष्पादन योग्य स्थापित करना होगा।

### उदाहरण प्लगइन

```bash
#!/bin/bash

# optional argument handling
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# optional argument handling
if [[ "$1" == "config" ]]
then
    echo "$KUBECONFIG"
    exit 0
fi

echo "I am a plugin named kubectl-foo"
```

### प्लगइन का उपयोग करना

प्लगइन का उपयोग करने के लिए, प्लगइन को निष्पादन योग्य बनाएं:

```shell
sudo chmod +x ./kubectl-foo
```

और इसे अपने `PATH` में कहीं भी रखें:

```shell
sudo mv ./kubectl-foo /usr/local/bin
```

अब आप अपने प्लगइन को `kubectl` कमांड के रूप में लागू कर सकते हैं:

```shell
kubectl foo
```

```
I am a plugin named kubectl-foo
```

सभी आर्ग्स और फ्लैग्स को निष्पादनयोग्य में यथावत पास कर दिया जाता है:

```shell
kubectl foo version
```

```
1.0.0
```

सभी पर्यावरण चर भी निष्पादनयोग्य फ़ाइल में यथावत पारित कर दिए जाते हैं:

```bash
export KUBECONFIG=~/.kube/config
kubectl foo config
```

```
/home/<user>/.kube/config
```

```shell
KUBECONFIG=/etc/kube/config kubectl foo config
```

```
/etc/kube/config
```

इसके अतिरिक्त, किसी प्लगइन को दिया जाने वाला पहला तर्क हमेशा उस स्थान का पूर्ण पथ होगा जहां पर उसे लागू किया गया था (उपर्युक्त उदाहरण में `$0`, `/usr/local/bin/kubectl-foo` के बराबर होगा)।

### Naming a plugin

जैसा कि ऊपर दिए गए उदाहरण में देखा गया है, एक प्लगइन अपने फ़ाइल नाम के आधार पर उस कमांड पथ को निर्धारित करता है जिसे वह लागू करेगा। प्लगइन द्वारा लक्षित कमांड पथ में प्रत्येक उप-कमांड को डैश (`-`) द्वारा अलग किया जाता है। उदाहरण के लिए, एक प्लगइन जो उपयोगकर्ता द्वारा कमांड `kubectl foo bar baz` को लागू किए जाने पर लागू होना चाहता है, उसका फ़ाइल नाम `kubectl-foo-bar-baz` होगा।

#### झंडे और तर्क प्रबंधन

{{< note >}}
प्लगइन तंत्र किसी प्लगइन प्रक्रिया के लिए कोई कस्टम, प्लगइन-विशिष्ट मान या पर्यावरण चर नहीं बनाता है।

एक पुराना kubectl प्लगइन तंत्र `KUBECTL_PLUGINS_CURRENT_NAMESPACE` जैसे पर्यावरण चर प्रदान करता था; अब ऐसा नहीं होता है।
{{< /note >}}

kubectl प्लगइन्स को उनके पास भेजे गए सभी तर्कों को पार्स और मान्य करना चाहिए। प्लगइन लेखकों के उद्देश्य से गो लाइब्रेरी के विवरण के लिए [कमांड लाइन रनटाइम पैकेज का उपयोग करना](#using-the-command-line-runtime-package) देखें।

यहाँ कुछ अतिरिक्त मामले दिए गए हैं जहाँ उपयोगकर्ता अतिरिक्त फ़्लैग और तर्क प्रदान करते हुए आपके प्लगइन को आमंत्रित करते हैं। यह ऊपर दिए गए परिदृश्य से `kubectl-foo-bar-baz` प्लगइन पर आधारित है।

यदि आप `kubectl foo bar baz arg1 --flag=value arg2` चलाते हैं, तो kubectl का प्लगइन तंत्र सबसे पहले सबसे लंबे संभावित नाम वाले प्लगइन को खोजने का प्रयास करेगा, जो इस मामले में `kubectl-foo-bar-baz-arg1` होगा। उस प्लगइन को न खोजने पर, kubectl अंतिम डैश-सेपरेटेड मान को एक तर्क (इस मामले में `arg1`) के रूप में मानता है, और अगला सबसे लंबा संभावित नाम, `kubectl-foo-bar-baz` खोजने का प्रयास करता है। इस नाम के साथ एक प्लगइन मिलने पर, kubectl फिर उस प्लगइन को आमंत्रित करता है, प्लगइन के नाम के बाद सभी args और फ़्लैग को प्लगइन प्रक्रिया में तर्क के रूप में पास करता है।

उदाहरण:

```bash
# create a plugin
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# "install" your plugin by moving it to a directory in your $PATH
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# check that kubectl recognizes your plugin
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```

```
# test that calling your plugin via a "kubectl" command works
# even when additional arguments and flags are passed to your
# plugin executable by the user.
kubectl foo bar baz arg1 --meaningless-flag=true
```

```
My first command-line argument was arg1
```

जैसा कि आप देख सकते हैं, आपका प्लगइन उपयोगकर्ता द्वारा निर्दिष्ट `kubectl` कमांड के आधार पर पाया गया था, और सभी अतिरिक्त तर्क और झंडे प्लगइन निष्पादन योग्य को उसी तरह से पास कर दिए गए थे, जैसे ही यह पाया गया था।

#### डैश और अंडरस्कोर वाले नाम

हालाँकि `kubectl` प्लगइन तंत्र प्लगइन द्वारा संसाधित उप-कमांडों के अनुक्रम को अलग करने के लिए प्लगइन फ़ाइल नामों में डैश (`-`) का उपयोग करता है, फिर भी इसके फ़ाइल नाम में अंडरस्कोर (`_`) का उपयोग करके इसके कमांडलाइन इनवोकेशन में डैश युक्त प्लगइन कमांड बनाना संभव है।

उदाहरण:

```bash
# create a plugin containing an underscore in its filename
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar

# move the plugin into your $PATH
sudo mv ./kubectl-foo_bar /usr/local/bin

# You can now invoke your plugin via kubectl:
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

ध्यान दें कि प्लगइन फ़ाइल नाम में अंडरस्कोर का परिचय आपको `kubectl foo_bar` जैसे कमांड रखने से नहीं रोकता है।
ऊपर दिए गए उदाहरण से कमांड को डैश (`-`) या अंडरस्कोर (`_`) का उपयोग करके लागू किया जा सकता है:

```bash
# You can invoke your custom command with a dash
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

```bash
# You can also invoke your custom command with an underscore
kubectl foo_bar
```

```
I am a plugin with a dash in my name
```

#### नाम संघर्ष और ओवरशैडोइंग

आपके `PATH` में अलग-अलग स्थानों पर एक ही फ़ाइल नाम वाले कई प्लगइन्स होना संभव है।
उदाहरण के लिए, निम्न मान वाला `PATH` दिया गया है: `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`, प्लगइन `kubectl-foo` की एक प्रति `/usr/local/bin/plugins` और `/usr/local/bin/moreplugins` में मौजूद हो सकती है, जैसे कि `kubectl plugin list` कमांड का आउटपुट है:

```bash
PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/plugins/kubectl-foo
/usr/local/bin/moreplugins/kubectl-foo
  - warning: /usr/local/bin/moreplugins/kubectl-foo is overshadowed by a similarly named plugin: /usr/local/bin/plugins/kubectl-foo

error: one plugin warning was found
```

उपरोक्त परिदृश्य में, `/usr/local/bin/moreplugins/kubectl-foo` के अंतर्गत चेतावनी आपको बताती है कि यह प्लगइन कभी भी निष्पादित नहीं होगा। इसके बजाय, आपके `PATH` में सबसे पहले दिखाई देने वाला निष्पादन योग्य, `/usr/local/bin/plugins/kubectl-foo`, हमेशा `kubectl` प्लगइन तंत्र द्वारा सबसे पहले पाया और निष्पादित किया जाएगा।

इस समस्या को हल करने का एक तरीका यह सुनिश्चित करना है कि जिस प्लगइन का आप `kubectl` के साथ उपयोग करना चाहते हैं उसका स्थान हमेशा आपके `PATH` में सबसे पहले आए। उदाहरण के लिए, यदि आप हमेशा `/usr/local/bin/moreplugins/kubectl-foo` का उपयोग करना चाहते हैं, जब भी `kubectl` कमांड `kubectl foo` को लागू किया जाता है, तो अपने `PATH` का मान बदलकर `/usr/local/bin/moreplugins:/usr/local/bin/plugins` कर दें।

#### सबसे लंबे निष्पादन योग्य फ़ाइल नाम का आह्वान

प्लगइन फ़ाइल नामों के साथ एक और तरह की ओवरशैडिंग हो सकती है। किसी उपयोगकर्ता के `PATH` में मौजूद दो प्लगइन्स को देखते हुए: `kubectl-foo-bar` और `kubectl-foo-bar-baz`, `kubectl` प्लगइन तंत्र हमेशा किसी दिए गए उपयोगकर्ता कमांड के लिए सबसे लंबा संभव प्लगइन नाम चुनेगा। नीचे कुछ उदाहरण दिए गए हैं, जो इसे और स्पष्ट करते हैं:

```bash
# for a given kubectl command, the plugin with the longest possible filename will always be preferred
kubectl foo bar baz
```

```
Plugin kubectl-foo-bar-baz is executed
```

```bash
kubectl foo bar
```

```
Plugin kubectl-foo-bar is executed
```

```bash
kubectl foo bar baz buz
```

```
Plugin kubectl-foo-bar-baz is executed, with "buz" as its first argument
```

```bash
kubectl foo bar buz
```

```
Plugin kubectl-foo-bar is executed, with "buz" as its first argument
```

यह डिज़ाइन विकल्प सुनिश्चित करता है कि यदि आवश्यक हो तो प्लगइन उप-कमांड को एकाधिक फ़ाइलों में क्रियान्वित किया जा सकता है, तथा इन उप-कमांडों को "पैरेंट" प्लगइन कमांड के अंतर्गत नेस्ट किया जा सकता है:

```bash
ls ./plugin_command_tree
```

```
kubectl-parent
kubectl-parent-subcommand
kubectl-parent-subcommand-subsubcommand
```

### प्लगइन चेतावनियों की जाँच करना

आप यह सुनिश्चित करने के लिए कि आपका प्लगइन `kubectl` द्वारा दृश्यमान है, उपर्युक्त `kubectl प्लगइन सूची` कमांड का उपयोग कर सकते हैं, और सत्यापित कर सकते हैं कि कोई चेतावनी नहीं है जो इसे `kubectl` कमांड के रूप में कॉल करने से रोकती है।

```bash
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

test/fixtures/pkg/kubectl/plugins/kubectl-foo
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo is overshadowed by a similarly named plugin: test/fixtures/pkg/kubectl/plugins/kubectl-foo
plugins/kubectl-invalid
  - warning: plugins/kubectl-invalid identified as a kubectl plugin, but it is not executable

error: 2 plugin warnings were found
```

### कमांड लाइन रनटाइम पैकेज का उपयोग करना

यदि आप kubectl के लिए प्लगइन लिख रहे हैं और आप Go का उपयोग कर रहे हैं, तो आप [cli-runtime](https://github.com/kubernetes/cli-runtime) यूटिलिटी लाइब्रेरी का उपयोग कर सकते हैं।

ये लाइब्रेरी उपयोगकर्ता की
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) फ़ाइल को पार्स या अपडेट करने, API सर्वर पर REST-स्टाइल अनुरोध करने या कॉन्फ़िगरेशन और प्रिंटिंग से जुड़े फ़्लैग को बाँधने के लिए सहायक प्रदान करती हैं।

CLI रनटाइम रेपो में दिए गए टूल के उपयोग के उदाहरण के लिए [सैंपल CLI प्लगइन](https://github.com/kubernetes/sample-cli-plugin) देखें।

## kubectl प्लगइन वितरित करना

यदि आपने दूसरों के उपयोग के लिए कोई प्लगइन विकसित किया है, तो आपको इस बात पर विचार करना चाहिए कि आप इसे कैसे पैकेज करते हैं, इसे कैसे वितरित करते हैं और अपने उपयोगकर्ताओं को अपडेट कैसे देते हैं।

### Krew {#distributing-krew}

[Krew](https://krew.dev/) आपके प्लगइन को पैकेज और वितरित करने के लिए एक क्रॉस-प्लेटफ़ॉर्म तरीका प्रदान करता है। इस तरह, आप सभी लक्षित प्लेटफ़ॉर्म (Linux, Windows, macOS आदि) के लिए एक ही पैकेजिंग फ़ॉर्मेट का उपयोग करते हैं और अपने उपयोगकर्ताओं को अपडेट डिलीवर करते हैं। Krew एक [प्लगइन इंडेक्स](https://krew.sigs.k8s.io/plugins/) भी बनाए रखता है ताकि अन्य लोग आपके प्लगइन को खोज सकें और उसे इंस्टॉल कर सकें।

### मूल / प्लेटफ़ॉर्म विशिष्ट पैकेज प्रबंधन {#distributing-native}

वैकल्पिक रूप से, आप Linux पर `apt` या `yum`, Windows पर Chocolatey और macOS पर Homebrew जैसे पारंपरिक पैकेज मैनेजर का उपयोग कर सकते हैं। कोई भी पैकेज मैनेजर उपयुक्त होगा यदि वह उपयोगकर्ता के `PATH` में कहीं भी नए निष्पादन योग्य रख सकता है।
एक प्लगइन लेखक के रूप में, यदि आप यह विकल्प चुनते हैं तो आपके पास प्रत्येक रिलीज़ के लिए कई प्लेटफ़ॉर्म पर अपने kubectl प्लगइन के वितरण पैकेज को अपडेट करने का बोझ भी है।

### स्रोत कोड {#distributing-source-code}

आप स्रोत कोड प्रकाशित कर सकते हैं; उदाहरण के लिए, Git रिपॉजिटरी के रूप में। यदि आप यह विकल्प चुनते हैं, तो कोई व्यक्ति जो उस प्लगइन का उपयोग करना चाहता है, उसे कोड प्राप्त करना होगा, एक बिल्ड वातावरण सेट करना होगा (यदि इसे संकलित करने की आवश्यकता है), और प्लगइन को तैनात करना होगा।
यदि आप संकलित पैकेज भी उपलब्ध कराते हैं, या Krew का उपयोग करते हैं, तो इससे इंस्टॉल करना आसान हो जाएगा।

## {{% heading "whatsnext" %}}

* Go में लिखे गए प्लगइन के [विस्तृत उदाहरण](https://github.com/kubernetes/sample-cli-plugin) के लिए सैंपल CLI प्लगइन रिपॉजिटरी देखें। किसी भी प्रश्न के मामले में, [SIG CLI टीम](https://github.com/kubernetes/community/tree/master/sig-cli) से संपर्क करने में संकोच न करें।
* kubectl प्लगइन्स के लिए पैकेज मैनेजर [Krew](https://krew.dev/) के बारे में पढ़ें।