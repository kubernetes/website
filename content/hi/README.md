# कुबरनेट्स प्रलेखन

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

आपका स्वागत है! इस रिपॉजिटरी में [कुबरनेट्स वेबसाइट और उसके दस्तावेज़](https://kubernetes.io/) बनाने के लिए जो कुछ भी आवश्यक है, वह सब यहाँ उपलब्ध है। और अगर आप योगदान (contribute) करना चाहते हैं,  तो बहुत बढ़िया — हम उसका स्वागत करते हैं!

## डॉक्स में योगदान देना

सबसे पहले स्क्रीन के ऊपर दाईं तरफ **Fork** बटन दबाएँ — इससे इस रिपॉजिटरी की एक copy आपके GitHub account पर बन जाएगी, जिसे *Fork* कहते हैं। अपने fork में जो भी बदलाव करने हों वो करें, और जब तैयार हों तो एक नया pull request बनाकर हमें बताएं।

pull request बनने के बाद, कुबरनेट्स का कोई reviewer उसे देखकर बताएगा कि क्या सुधार करना है। **आपकी ज़िम्मेदारी है कि उनके feedback के हिसाब से अपना pull request update करते रहें।**

यह भी ध्यान दें कि, कभी-कभी एक से ज़्यादा reviewer हो सकते हैं, या पहले वाला reviewer बदल भी सकता है। कुछ मामलों में तकनीकी चीज़ों के लिए [कुबरनेट्स टेक समीक्षक](https://github.com/kubernetes/website/wiki/Tech-reviewers) से भी review ली जा सकती है। Reviewers आमतौर पर जल्दी प्रतिक्रिया देने की कोशिश करते हैं, पर परिस्थितियों के आधार पर प्रतिक्रिया समय अलग-अलग हो सकता है — थोड़ा patience रखें!

कुबरनेट्स प्रलेखन में योगदान देने के बारे में अधिक जानकारी के लिए, देखें:

* [योगदान देना शुरू करें](https://kubernetes.io/docs/contribute/start/)
* [परिवर्तनों को अंतिम चरण में लेजाएं](https://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [पेज टेम्पलेट](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [प्रलेखन शैली गाइड](https://kubernetes.io/docs/contribute/style/style-guide/)
* [स्थानीयकरण कुबरनेट्स प्रलेखन](https://kubernetes.io/docs/contribute/localization/)

## README.md का हिंदी स्थानीयकरण

हिंदी localization के maintainers से directly बात करनी हो तो यहाँ पहुँच सकते हैं:

* Anubhav Vardhan ([Slack](https://kubernetes.slack.com/archives/D0261C0A3R8), [Twitter](https://twitter.com/anubha_v_ardhan), [GitHub](https://github.com/anubha-v-ardhan))
* Divya Mohan ([Slack](https://kubernetes.slack.com/archives/D027R7BE804), [Twitter](https://twitter.com/Divya_Mohan02), [GitHub](https://github.com/divya-mohan0209))
* Yashu Mittal ([Twitter](https://twitter.com/mittalyashu77), [GitHub](https://github.com/mittalyashu))

* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-hi)

## Docker की मदद से साइट locally चलाना

कुबरनेट्स वेबसाइट को locally चलाने का सबसे आसान तरीका है एक special [Docker](https://docker.com) image run करना, जिसमें [Hugo](https://gohugo.io) static site generator पहले से शामिल है।

> अगर आप Windows पर हैं, तो कुछ extra tools की ज़रूरत पड़ेगी जिन्हें आप [Chocolatey](https://chocolatey.org) से इंस्टॉल कर सकते हैं।

Docker के बिना चलाना हो तो नीचे [Hugo वाला तरीका](#hugo-का-उपयोग-करते-हुए-स्थानीय-रूप-से-साइट-चलाना) देखें।

अगर [Docker](https://www.docker.com/get-started) पहले से चल रहा है, तो पहले `कुबेरनेट्स-ह्यूगो` Docker image बनाएँ:

```bash
make container-image
```

Image बनने के बाद साइट को locally start करें:

```bash
make container-serve
```

अब browser में `http://localhost:1313` खोलें और साइट देखें। जब भी source files में कोई बदलाव होगा, Hugo अपने आप update कर देगा और browser refresh हो जाएगा।

## Hugo की मदद से साइट locally चलाना

Hugo इंस्टॉल करने के लिए [आधिकारिक Hugo प्रलेखन](https://gohugo.io/getting-started/installing/) देखें। बस ध्यान रखें कि [`Netlify.toml`](netlify.toml#L9) फ़ाइल में जो `HUGO_VERSION` लिखा है, वही version इंस्टॉल करें।

Hugo इंस्टॉल हो जाने के बाद साइट चलाने के लिए:

```bash
make serve
```

इससे port `1313` पर Hugo server शुरू हो जाएगा। Browser में `http://localhost:1313` खोलें और काम शुरू करें। Source files में बदलाव करते ही Hugo साइट update कर देगा।

## समुदाय, चर्चा, योगदान और समर्थन

कुबरनेट्स community से जुड़ने के लिए [Community page](https://kubernetes.io/community/) पर जाएँ — वहाँ बहुत सारे लोग मिलेंगे जो मदद करने के लिए तैयार हैं।

इस प्रोजेक्ट की localization टीम से आप नीचे दिए गए माध्यमों के माध्यम से संपर्क कर सकते हैं:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## आचार संहिता (Code of Conduct)

कुबरनेट्स community का हिस्सा बनने के लिए [कुबरनेट्स आचार संहिता](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/hi.md) का पालन करना ज़रूरी है।

## शुक्रिया! 🙌

कुबरनेट्स community लोगों की भागीदारी से ही आगे बढ़ती है — और हम सच में खुश हैं कि आप इस project में contribute कर रहे हैं। आपका हर छोटा-बड़ा योगदान मायने रखता है!
