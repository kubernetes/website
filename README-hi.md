# कुबरनेट्स प्रलेखन

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

स्वागत है! इस रिपॉजिटरी में [कुबरनेट्स वेबसाइट और दस्तावेज](https://kubernetes.io/) बनाने के लिए आवश्यक सभी संपत्तियाँ हैं। हम बहुत खुश हैं कि आप योगदान करना चाहते हैं!

## डॉक्स में योगदान देना

आप अपने GitHub खाते में इस रिपॉजिटरी की एक copy बनाने के लिए स्क्रीन के ऊपरी-दाएँ क्षेत्र में **Fork** बटन पर क्लिक करें। इस copy को *Fork* कहा जाता है। अपने fork में परिवर्तन करने के बाद जब आप उनको हमारे पास भेजने के लिए तैयार हों, तो अपने fork पर जाएँ और हमें इसके बारे में बताने के लिए एक नया pull request बनाएं।

एक बार जब आपका pull request बन जाता है, तो एक कुबरनेट्स समीक्षक स्पष्ट, कार्रवाई योग्य प्रतिक्रिया प्रदान करने की जिम्मेदारी लेगा। pull request के मालिक के रूप में, **यह आपकी जिम्मेदारी है कि आप कुबरनेट्स समीक्षक द्वारा प्रदान की गई प्रतिक्रिया को संबोधित करने के लिए अपने pull request को संशोधित करें।**

यह भी ध्यान दें कि आप एक से अधिक कुबरनेट्स समीक्षक आपको प्रतिक्रिया प्रदान कर सकते हैं या आप एक कुबरनेट्स समीक्षक से प्रतिक्रिया प्राप्त कर सकते हैं जो मूल रूप से आपको प्रतिक्रिया प्रदान करने के लिए दिए गए एक से भिन्न है। इसके अलावा, कुछ मामलों में, आपका एक समीक्षक जरूरत पड़ने पर [कुबेरनेट्स टेक समीक्षक](https://github.com/kubernetes/website/wiki/Tech-reviewers) से तकनीकी समीक्षा प्राप्त कर सकता है। समीक्षक समय पर प्रतिक्रिया देने के लिए पूरी कोशिश करेंगे, लेकिन परिस्थितियों के आधार पर प्रतिक्रिया समय अलग-अलग हो सकता है।

कुबरनेट्स प्रलेखन में योगदान देने के बारे में अधिक जानकारी के लिए, देखें:

* [योगदान देना शुरू करें](https://kubernetes.io/docs/contribute/start/)
* [परिवर्तनों को अंतिम चरण में लेजाएं](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [पेज टेम्पलेट](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [प्रलेखन शैली गाइड](http://kubernetes.io/docs/contribute/style/style-guide/)
* [स्थानीयकरण कुबरनेट्स प्रलेखन](https://kubernetes.io/docs/contribute/localization/)

## `README.md`'s स्थानीयकरण कुबरनेट्स प्रलेखन

आप हिंदी स्थानीयकरण के मैन्टेनरों तक पहुँच सकते हैं:

* Anubhav Vardhan ([Slack](https://kubernetes.slack.com/archives/D0261C0A3R8), [Twitter](https://twitter.com/anubha_v_ardhan), [GitHub](https://github.com/anubha-v-ardhan))
* Divya Mohan ([Slack](https://kubernetes.slack.com/archives/D027R7BE804), [Twitter](https://twitter.com/Divya_Mohan02), [GitHub](https://github.com/divya-mohan0209))
* Yashu Mittal ([Twitter](https://twitter.com/mittalyashu77), [GitHub](https://github.com/mittalyashu))

* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-hi)

## स्थानीय रूप से डॉकर का उपयोग करके साइट चलाना

कुबरनेट्स वेबसाइट को स्थानीय रूप से चलाने के लिए अनुशंसित तरीका एक विशेष [डॉकर](https://docker.com) image को चलाना है, जिसमें [Hugo](https://gohugo.io) स्टेटिक साइट जनरेटर शामिल है।

> यदि आप विंडोज पर हैं, तो आपको कुछ और टूल्स की आवश्यकता होगी जिन्हें आप [Chocolatey](https://chocolatey.org) के साथ इंस्टॉल कर सकते हैं।

यदि आप डॉकर के बिना स्थानीय रूप से वेबसाइट चलाना पसंद करते हैं, तो नीचे दिए गए Hugo का उपयोग करके स्थानीय रूप से [साइट को चलाने](#hugo-का-उपयोग-करते-हुए-स्थानीय-रूप-से-साइट-चलाना) का तरीका देखें।

यदि आप [डॉकर](https://www.docker.com/get-started) चला रहे हैं, तो स्थानीय रूप से `कुबेरनेट्स-ह्यूगो` Docker image बनाएँ:

```bash
make container-image
```

एक बार image बन जाने के बाद, आप साइट को स्थानीय रूप से चला सकते हैं:

```bash
make container-serve
```

साइट देखने के लिए अपने browser को `http://localhost:1313` पर खोलें। जैसा कि आप source फ़ाइलों में परिवर्तन करते हैं, Hugo साइट को अपडेट करता है और browser को refresh करने पर मजबूर करता है।

## Hugo का उपयोग करते हुए स्थानीय रूप से साइट चलाना

Hugo निर्देशों के लिए [आधिकारिक Hugo प्रलेखन](https://gohugo.io/getting-started/installing/) देखें। [`Netlify.toml`](netlify.toml#L9) फ़ाइल में `HUGO_VERSION` environment variable द्वारा निर्दिष्ट Hugo version को install करना सुनिश्चित करें।

जब आप Hugo को install करते हैं तो स्थानीय रूप से साइट को चलाने के लिए:

```bash
make serve
```

यह पोर्ट `1313` पर Hugo सर्वर को शुरू करेगा। साइट देखने के लिए अपने browser को `http://localhost:1313` पर खोलें। जैसा कि आप source फ़ाइलों में परिवर्तन करते हैं, Hugo साइट को अपडेट करता है और एक browser को refresh करने पर मजबूर करता है।

## समुदाय, चर्चा, योगदान और समर्थन

[Community page](http://kubernetes.io/community/) पर कुबरनेट्स समुदाय के साथ जुड़ना सीखें।

आप इस परियोजना के स्थानीयकरण तक पहुँच सकते हैं:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## कोड ओफ़ कंडक्ट

कुबरनेट्स समुदाय में भागीदारी [कुबरनेट्स कोड ओफ़ कंडक्ट](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/hi.md) द्वारा शासित है.

## धन्यवाद!

कुबरनेट्स सामुदायिक भागीदारी पर पनपती है, और हम वास्तव में हमारी साइट और हमारे प्रलेखन में आपके योगदान की सराहना करते हैं!

कुबरनेट्स आपकी भागीदारी पर निर्भर है, और हम हमारी साइट और प्रलेखन में आपके योगदान का मान करते हैं!
