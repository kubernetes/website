# कुबेरनेट्स दस्तावेज़

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

इस रिपॉजिटरी में [कुबेरनेट्स वेबसाइट और दस्तावेज़](https://kubernetes.io/) बनाने के लिए ज़रूरी फाइलें और संसाधन मौजूद हैं। योगदान करने की आपकी रुचि हमारे लिए महत्वपूर्ण है।

## इस रिपॉजिटरी का उपयोग

आप इस वेबसाइट को [Hugo (Extended version)](https://gohugo.io/) से स्थानीय रूप से चला सकते हैं, या किसी कंटेनर रनटाइम में भी चला सकते हैं। हम कंटेनर रनटाइम का उपयोग करने की सलाह देते हैं, क्योंकि इससे आपकी लोकल प्रीव्यू साइट का व्यवहार लाइव वेबसाइट के अधिक करीब रहता है।

## आवश्यकताएँ

इस रिपॉजिटरी पर काम करने के लिए अपने सिस्टम पर ये चीज़ें इंस्टॉल रखें:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- कोई कंटेनर रनटाइम, जैसे [Docker](https://www.docker.com/)

> [!NOTE]
> वही Hugo Extended version इंस्टॉल करें जो [`netlify.toml`](../../netlify.toml) में `HUGO_VERSION` के रूप में तय की गई है।

शुरू करने से पहले रिपॉजिटरी क्लोन करें:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

कुबेरनेट्स वेबसाइट [Docsy Hugo theme](https://github.com/google/docsy#readme) का उपयोग करती है। इसके अलावा, रेफरेंस दस्तावेज़ बनाने के लिए एक Git submodule भी इस्तेमाल होता है।

### Windows

```powershell
# submodule dependencies प्राप्त करें
git submodule update --init --recursive --depth 1
```

### Linux / अन्य Unix

```bash
# submodule dependencies प्राप्त करें
make module-init
```

## कंटेनर के साथ वेबसाइट चलाना

कंटेनर में वेबसाइट चलाने के लिए यह कमांड उपयोग करें:

```bash
# पूरी वेबसाइट रेंडर करें
make container-serve

# केवल हिंदी सेगमेंट रेंडर करें
make container-serve segments=hi

# एक से अधिक भाषा सेगमेंट रेंडर करें
make container-serve segments=en,hi
```

अगर build के दौरान त्रुटि दिखे, तो अक्सर इसका कारण यह होता है कि कंटेनर को पर्याप्त CPU या memory नहीं मिली। ऐसी स्थिति में Docker की resource limits बढ़ाएँ।

ब्राउज़र में <http://localhost:1313> खोलें। जैसे-जैसे आप source files में बदलाव करेंगे, Hugo साइट को दोबारा रेंडर करेगा और ब्राउज़र refresh हो जाएगा।

## Hugo के साथ वेबसाइट चलाना

अगर आप वेबसाइट को सीधे Hugo से चलाना चाहते हैं, तो पहले dependencies इंस्टॉल करें:

- macOS और Linux

  ```bash
  npm ci

  # पूरी साइट रेंडर करें
  make serve

  # केवल हिंदी सेगमेंट रेंडर करें
  make serve segments=hi

  # एक से अधिक भाषा सेगमेंट रेंडर करें
  make serve segments=en,hi
  ```

- Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

इसके बाद Hugo सर्वर `1313` पोर्ट पर शुरू हो जाएगा। साइट देखने के लिए <http://localhost:1313> खोलें।

## API reference pages बनाना

`content/en/docs/reference/kubernetes-api` में मौजूद API reference pages, Swagger specification (OpenAPI specification) से बनती हैं। नई Kubernetes release के लिए इन्हें अपडेट करने का सामान्य तरीका यह है:

1. `api-ref-generator` submodule प्राप्त करें:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger specification अपडेट करें:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. `api-ref-assets/config/` के अंदर मौजूद `toc.yaml` और `fields.yaml` को नई release के अनुसार अपडेट करें।

4. पेज जनरेट करें:

   ```bash
   make api-reference
   ```

5. लोकल प्रीव्यू के लिए साइट चलाएँ:

   ```bash
   make container-serve
   ```

API reference देखने के लिए <http://localhost:1313/docs/reference/kubernetes-api/> खोलें।

## समस्या निवारण

अगर लोकल प्रीव्यू चलाने में दिक्कत आए, तो [Troubleshooting guide](https://kubernetes.io/docs/contribute/new-content/preview-locally/#troubleshooting) देखें।

## हिंदी स्थानीयकरण से जुड़ें

हिंदी स्थानीयकरण टीम के समीक्षकों और अनुमोदकों की सूची इन फाइलों में उपलब्ध है:

- [OWNERS](./OWNERS)
- [OWNERS_ALIASES](../../OWNERS_ALIASES)

चर्चा के लिए आप इन माध्यमों का उपयोग कर सकते हैं:

- [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-hi)
- [SIG Docs Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## SIG Docs से जुड़ें

[SIG Docs community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) पर जाकर आप SIG Docs समुदाय, उसकी बैठकों, और योगदान प्रक्रिया के बारे में अधिक जान सकते हैं।

## दस्तावेज़ों में योगदान

GitHub पर ऊपर दाईं ओर दिए गए **Fork** बटन पर क्लिक करके आप इस रिपॉजिटरी की अपनी कॉपी बना सकते हैं। इस कॉपी को *fork* कहा जाता है। अपने fork में बदलाव करने के बाद, उन्हें साझा करने के लिए एक नया pull request खोलें।

जब आपका pull request बन जाता है, तब कुबेरनेट्स समीक्षक उसकी समीक्षा करता है और स्पष्ट, उपयोगी सुझाव देता है। pull request के लेखक के रूप में **मिले हुए सुझावों के आधार पर अपने बदलाव अपडेट करना आपकी ज़िम्मेदारी है।**

कभी-कभी एक से अधिक समीक्षक भी सुझाव दे सकते हैं। कुछ स्थितियों में technical review की भी ज़रूरत पड़ सकती है। समीक्षक समय पर जवाब देने की कोशिश करते हैं, लेकिन जवाब आने में लगने वाला समय परिस्थिति के अनुसार बदल सकता है।

कुबेरनेट्स दस्तावेज़ों में योगदान के बारे में अधिक जानकारी यहाँ मिल सकती है:

- [Kubernetes docs में योगदान](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Kubernetes documentation localization](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)

### नए contributors के लिए सहायता

अगर योगदान करते समय आपको मदद चाहिए, तो [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) से संपर्क किया जा सकता है। ये SIG Docs approvers होते हैं, जो नए contributors को शुरुआती pull requests में मार्गदर्शन देते हैं।

वर्तमान SIG Docs New Contributor Ambassador:

| नाम | Slack | GitHub |
| --- | --- | --- |
| Sreeram Venkitesh | @sreeram.venkitesh | @sreeram-venkitesh |

## स्थानीयकरण README

| भाषा | भाषा |
| --- | --- |
| [बांग्ला](../bn/README.md) | [कोरियाई](../ko/README.md) |
| [चीनी](../zh-cn/README.md) | [पोलिश](../pl/README.md) |
| [फ़्रेंच](../fr/README.md) | [पुर्तगाली](../pt-br/README.md) |
| [जर्मन](../de/README.md) | [रूसी](../ru/README.md) |
| [अंग्रेज़ी](../../README.md) | [स्पेनिश](../es/README.md) |
| [इंडोनेशियाई](../id/README.md) | [यूक्रेनी](../uk/README.md) |
| [इतालवी](../it/README.md) | [वियतनामी](../vi/README.md) |
| [जापानी](../ja/README.md) | |

## आचार संहिता

कुबेरनेट्स समुदाय में भागीदारी [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) के अनुसार संचालित होती है।

## धन्यवाद

कुबेरनेट्स समुदाय की भागीदारी से आगे बढ़ता है। हमारी वेबसाइट और दस्तावेज़ों में आपके योगदान के लिए धन्यवाद।
