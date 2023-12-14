# कुबरनेट्स प्रलेखन

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

स्वागत है! इस रिपॉजिटरी में [कुबरनेट्स वेबसाइट और दस्तावेज](https://kubernetes.io/) बनाने के लिए आवश्यक सभी संपत्तियाँ हैं। हम बहुत खुश हैं कि आप योगदान करना चाहते हैं!

## डॉक्स में योगदान देना

अगर आप इस रिपॉजिटरी की एक अपनी copy बनाना चाहते हैं, तो स्क्रीन के ऊपरी-दाएँ क्षेत्र में **Fork** बटन पर क्लिक करें। इसको हम Fork कहते हैं, जो आपकी खुद की एक नई copy होती है। जब आप इस fork में कुछ बदलाव करके हमें भेजने के लिए तैयार हो जाएं, तो अपने fork पर जाएं और एक नया pull request बनाएं, ताकि हमें आपके किए गए परिवर्तन के बारे में पता चल सके।

एक बार जब आपका pull request तैयार हो जाता है, तो हमारे कुबरनेट्स समीक्षक आपके सुझाव और प्रतिक्रिया को ध्यान से देखेंगे। आपकी pull request की मालिकी के रूप में, **यह आपकी जिम्मेदारी है कि आप हमारे समीक्षकों द्वारा दी गई प्रतिक्रिया का उचित रूप से संबोधित करने के लिए अपने पुल रिक्वेस्ट को संशोधित करें। हम साथ में काम करेंगे ताकि हमारा कोड सही और बेहतर हो सके।**

यह भी ध्यान दें कि एक से अधिक कुबरनेट्स समीक्षक आपको प्रतिक्रिया देने के लिए आ सकते हैं या फिर आप एक समीक्षक से प्रतिक्रिया प्राप्त कर सकते हैं, जो मूल रूप से आपके पुल रिक्वेस्ट की जांच कर रहे हैं। इसके अलावा, कुछ मामलों में, आपको आपके प्रोजेक्ट के लिए [कुबेरनेट्स टेक समीक्षक](https://github.com/kubernetes/website/wiki/Tech-reviewers) से तकनीकी समीक्षा प्राप्त करने की आवश्यकता हो सकती है। समीक्षक समय पर प्रतिक्रिया देने के लिए पूरी कोशिश करेंगे, लेकिन हम समझते हैं कि सभी के पास व्यस्तता होती है और परिस्थितियों के आधार पर प्रतिक्रिया में विलंब हो सकता है।

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

कुबरनेट्स वेबसाइट को स्थानीय रूप से चलाने के लिए, हम आपको एक विशेष [डॉकर](https://docker.com) image का इस्तेमाल करने की सिफारिश करते हैं, जिसमें [Hugo](https://gohugo.io) स्टेटिक साइट जनरेटर शामिल है।

> अगर आप विंडोज पर हैं, तो आपको कुछ और उपकरणों की आवश्यकता है, जिन्हें आप [Chocolatey](https://chocolatey.org) का इस्तेमाल करके आसानी से इंस्टॉल कर सकते हैं। यह आपको चलने के लिए एक सरल प्रक्रिया प्रदान करेगा।

अगर आप डॉकर का इस्तेमाल किए बिना ही स्थानीय रूप से वेबसाइट चलाना पसंद करते हैं, तो आप नीचे दिए गए Hugo का उपयोग करके स्थानीय रूप से [साइट को चलाने](#hugo-का-उपयोग-करते-हुए-स्थानीय-रूप-से-साइट-चलाना) का तरीका देख सकते हैं। यह आपको एक सुगम अनुभव प्रदान करेगा जिसमें डॉकर की जरूरत नहीं होगी।

अगर आप [डॉकर](https://www.docker.com/get-started) का इस्तेमाल कर रहे हैं, तो स्थानीय रूप से `कुबेरनेट्स-ह्यूगो` Docker image बनाने की कदमों को देखें:

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


कुबरनेट्स सामुदायिक भागीदारी में बढ़ता है, और हम सचमुच हमारी साइट और प्रलेखन में आपके योगदान की सराहना करते हैं!

कुबरनेट्स आपकी भागीदारी की कड़ी से जुड़ा हुआ है, और हम हमेशा आपके सहयोग के लिए आभारी हैं।
