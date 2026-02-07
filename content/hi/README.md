# कुबरनेट्स प्रलेखन

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

स्वागत है! इस रिपॉजिटरी में [कुबरनेट्स वेबसाइट और प्रलेखन](https://kubernetes.io/) बनाने के लिए आवश्यक सभी संपत्तियाँ हैं। हम बहुत खुश हैं कि आप योगदान करना चाहते हैं!

## इस रिपॉजिटरी का उपयोग करना

आप [Hugo (Extended version)](https://gohugo.io/) का उपयोग करके वेबसाइट को स्थानीय रूप से चला सकते हैं, या आप इसे container runtime में चला सकते हैं। हम दृढ़ता से container runtime का उपयोग करने की सलाह देते हैं, क्योंकि यह live वेबसाइट के साथ deployment consistency प्रदान करता है।

## पूर्व आवश्यकताएं

इस रिपॉजिटरी का उपयोग करने के लिए, आपको निम्नलिखित को स्थानीय रूप से install करना होगा:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- एक container runtime, जैसे [Docker](https://www.docker.com/)

> **नोट**: सुनिश्चित करें कि आप [netlify.toml](netlify.toml#L11) फ़ाइल में `HUGO_VERSION` environment variable द्वारा निर्दिष्ट Hugo extended version को install करें।

शुरू करने से पहले, dependencies install करें। रिपॉजिटरी को clone करें और directory में navigate करें:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

कुबरनेट्स वेबसाइट Docsy Hugo theme का उपयोग करती है, जिसे npm के माध्यम से install किया जा सकता है। आप एक पूर्व-configured development container image भी download कर सकते हैं जिसमें Hugo और Docsy शामिल हैं। इसके अतिरिक्त, reference प्रलेखन generate करने वाले tools के लिए एक Git submodule का उपयोग किया जाता है।

### Windows

```bash
# submodule dependencies fetch करें
git submodule update --init --recursive --depth 1
```

### Linux / other Unix

```bash
# submodule dependencies fetch करें
make module-init
```

## स्थानीय रूप से container का उपयोग करके साइट चलाना

साइट को container में build करने के लिए, निम्नलिखित चलाएं:

```bash
# आप $CONTAINER_ENGINE को किसी भी Docker-जैसे container tool के नाम पर set कर सकते हैं

# पूरी वेबसाइट render करें
make container-serve

# केवल एक विशिष्ट भाषा segment render करें (उदाहरण के लिए, अंग्रेजी)
make container-serve segments=en

# एकाधिक भाषाएँ render करें (उदाहरण के लिए, अंग्रेजी और कोरियाई)
make container-serve segments=en,ko
```

> 💡 **टिप**: Hugo segments का उपयोग करने से local preview builds तेज़ हो जाते हैं, क्योंकि यह केवल चयनित भाषा(ओं) को render करता है।

यदि आपको errors दिखाई देती हैं, तो इसका मतलब है कि Hugo container के पास पर्याप्त computing resources उपलब्ध नहीं थे। इसे solve करने के लिए, अपनी machine पर Docker के लिए allowed CPU और memory usage की मात्रा बढ़ाएं ([macOS](https://docs.docker.com/docker-for-mac/#resources) और [Windows](https://docs.docker.com/docker-for-windows/#resources))।

वेबसाइट देखने के लिए अपने browser को http://localhost:1313 पर खोलें। जैसे ही आप source files में changes करते हैं, Hugo वेबसाइट को update करता है और browser को refresh करने के लिए force करता है।

## Hugo का उपयोग करते हुए स्थानीय रूप से साइट चलाना

Dependencies install करने, deploy करने और साइट को locally test करने के लिए, चलाएं:

### macOS और Linux के लिए

```bash
npm ci

# पूरी साइट render करें (default)
make serve

# केवल एक विशिष्ट भाषा segment render करें
make serve segments=en

# एकाधिक भाषा segments render करें
make serve segments=en,ko
```

> 💡 **टिप**: Hugo segments `hugo.toml` में defined हैं और विशिष्ट भाषा(ओं) तक scope को सीमित करके तेज़ rendering की अनुमति देते हैं।

### Windows के लिए (PowerShell)

```bash
npm ci
hugo.exe server --buildFuture --environment development
```

यह local Hugo server को port 1313 पर start करेगा। वेबसाइट देखने के लिए अपने browser को http://localhost:1313 पर खोलें। जैसे ही आप source files में changes करते हैं, Hugo वेबसाइट को update करता है और browser को refresh करने के लिए force करता है।

## API reference pages बनाना

`content/en/docs/reference/kubernetes-api` में स्थित API reference pages [Swagger specification](https://swagger.io/), जिसे [OpenAPI specification](https://www.openapis.org/) के रूप में भी जाना जाता है, से https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs का उपयोग करके built किए गए हैं।

नई कुबरनेट्स release के लिए reference pages को update करने के लिए इन steps का पालन करें:

1. `api-ref-generator` submodule को pull करें:

```bash
git submodule update --init --recursive --depth 1
```

2. Swagger specification को update करें:

```bash
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
```

3. `api-ref-assets/config/` में, नई release के changes को reflect करने के लिए `toc.yaml` और `fields.yaml` files को adapt करें।

4. अगला, pages build करें:

```bash
make api-reference
```

आप container से साइट को build और serve करके locally results test कर सकते हैं:

```bash
make container-serve
```

एक web browser में, API reference देखने के लिए http://localhost:1313/docs/reference/kubernetes-api/ पर जाएं।

जब नई contract के सभी changes configuration files `toc.yaml` और `fields.yaml` में reflect हो जाएं, तो नए generated API reference pages के साथ एक Pull Request बनाएं।

## समस्या निवारण

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo तकनीकी कारणों से binaries के दो sets में shipped किया जाता है। वर्तमान वेबसाइट केवल **Hugo Extended** version पर आधारित है। [Release page](https://github.com/gohugoio/hugo/releases) में `extended` नाम वाले archives देखें। Confirm करने के लिए, `hugo version` चलाएं और `extended` शब्द देखें।

### macOS पर "too many open files" समस्या निवारण

यदि आप macOS पर `make serve` चलाते हैं और निम्नलिखित error प्राप्त करते हैं:

```
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Open files के लिए current limit check करने का प्रयास करें:

```bash
launchctl limit maxfiles
```


फिर निम्नलिखित commands चलाएं ([https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c](https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c) से adapted):


```bash
#!/bin/sh

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```


यह Catalina और Mojave macOS दोनों के लिए काम करता है।

## SIG Docs के साथ शामिल हों

[Community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) पर SIG Docs कुबरनेट्स समुदाय और meetings के बारे में अधिक जानें।

आप इस परियोजना के maintainers तक भी पहुँच सकते हैं:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [इस Slack के लिए invite प्राप्त करें](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## डॉक्स में योगदान देना

आप अपने GitHub account में इस रिपॉजिटरी की एक copy बनाने के लिए screen के upper-right area में **Fork** बटन पर click कर सकते हैं। इस copy को fork कहा जाता है। अपने fork में कोई भी changes करें जो आप चाहते हैं, और जब आप उन changes को हमें भेजने के लिए तैयार हों, तो अपने fork पर जाएं और हमें इसके बारे में बताने के लिए एक नया pull request बनाएं।

एक बार जब आपका pull request बन जाता है, तो एक कुबरनेट्स reviewer स्पष्ट, actionable feedback प्रदान करने की ज़िम्मेदारी लेगा। Pull request के owner के रूप में, यह आपकी ज़िम्मेदारी है कि आप कुबरनेट्स reviewer द्वारा प्रदान की गई feedback को address करने के लिए अपने pull request को modify करें।

यह भी note करें कि आपको एक से अधिक कुबरनेट्स reviewer से feedback मिल सकती है या आपको एक कुबरनेट्स reviewer से feedback मिल सकती है जो originally आपको feedback प्रदान करने के लिए assigned किए गए reviewer से अलग है।

इसके अलावा, कुछ मामलों में, आपके reviewers में से एक ज़रूरत पड़ने पर कुबरनेट्स tech reviewer से technical review मांग सकता है। Reviewers समय पर feedback प्रदान करने की पूरी कोशिश करेंगे, लेकिन परिस्थितियों के आधार पर response time अलग-अलग हो सकता है।

कुबरनेट्स प्रलेखन में योगदान देने के बारे में अधिक जानकारी के लिए, देखें:

- [कुबरनेट्स docs में योगदान करें](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [कुबरनेट्स प्रलेखन का स्थानीयकरण](https://kubernetes.io/docs/contribute/localization/)
- [कुबरनेट्स Docs का परिचय](https://www.youtube.com/watch?v=pprMgmNzDcw)

## नए योगदानकर्ता राजदूत

यदि आपको योगदान करते समय किसी भी समय मदद की आवश्यकता है, तो [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) एक अच्छा संपर्क बिंदु हैं। ये SIG Docs approvers हैं जिनकी ज़िम्मेदारियों में नए योगदानकर्ताओं को mentor करना और उनके पहले कुछ pull requests में मदद करना शामिल है। New Contributors Ambassadors से संपर्क करने के लिए सबसे अच्छी जगह [Kubernetes Slack](https://slack.k8s.io/) है। SIG Docs के लिए वर्तमान New Contributors Ambassadors:

| नाम | Slack | GitHub |
|-----|-------|--------|
| Sreeram Venkitesh | @sreeram.venkitesh | @sreeram-venkitesh |

## README.md's स्थानीयकरण कुबरनेट्स प्रलेखन

आप हिंदी स्थानीयकरण के maintainers तक पहुँच सकते हैं:

- Anubhav Vardhan ([Slack](https://kubernetes.slack.com/archives/D0261C0A3R8), [Twitter](https://twitter.com/anubha_v_ardhan), [GitHub](https://github.com/anubha-v-ardhan))
- Divya Mohan ([Slack](https://kubernetes.slack.com/archives/D027R7BE804), [Twitter](https://twitter.com/Divya_Mohan02), [GitHub](https://github.com/divya-mohan0209))
- Yashu Mittal ([Twitter](https://twitter.com/mittalyashu77), [GitHub](https://github.com/mittalyashu))
- [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-hi)

## कोड ऑफ़ कंडक्ट

कुबरनेट्स समुदाय में भागीदारी [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) द्वारा शासित है।

## धन्यवाद!

कुबरनेट्स समुदाय की भागीदारी पर निर्भर करता है, और हम हमारी वेबसाइट और प्रलेखन में आपके योगदान की सराहना करते हैं!
