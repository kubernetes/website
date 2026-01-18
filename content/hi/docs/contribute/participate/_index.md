---
title: SIG Docs में भाग लेना
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG Docs, कुबेरनेट्स प्रोजेक्ट के
[विशेष रुचि समूहों](https://github.com/kubernetes/community/blob/master/sig-list.md) (special interest groups)
में से एक है, जो समग्र रूप से कुबेरनेट्स के लिए
दस्तावेज़ीकरण लिखने, अपडेट करने और रखरखाव करने पर केंद्रित है।
SIG के बारे में अधिक जानकारी के लिए
[community github repo से SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs)
देखें।

SIG Docs सभी योगदानकर्ताओं से सामग्री और समीक्षा का स्वागत करता है। कोई भी
pull request (PR) खोल सकता है, और कोई भी सामग्री के बारे में issues दर्ज कर सकता है
या प्रगति में pull requests पर टिप्पणी कर सकता है।

आप [सदस्य (member)](/docs/contribute/participate/roles-and-responsibilities/#members),
[समीक्षक](/docs/contribute/participate/roles-and-responsibilities/#reviewers), या
[अनुमोदक](/docs/contribute/participate/roles-and-responsibilities/#approvers) भी बन सकते हैं।
इन भूमिकाओं के लिए अधिक पहुंच की आवश्यकता होती है और परिवर्तनों को
अनुमोदित करने और commit करने की कुछ जिम्मेदारियां होती हैं।
कुबेरनेट्स समुदाय में सदस्यता कैसे काम करती है, इसके बारे में अधिक जानकारी के लिए
[community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
देखें।

इस दस्तावेज़ का शेष भाग कुछ अनूठे तरीकों की रूपरेखा प्रस्तुत करता है जिनसे ये भूमिकाएं
SIG Docs के भीतर कार्य करती हैं, जो कुबेरनेट्स के सबसे सार्वजनिक-सामना वाले
पहलुओं में से एक -- कुबेरनेट्स वेबसाइट और दस्तावेज़ीकरण -- को बनाए रखने के लिए जिम्मेदार है।

<!-- body -->

## SIG Docs अध्यक्ष

प्रत्येक SIG, जिसमें SIG Docs शामिल है, एक या अधिक SIG सदस्यों को
अध्यक्षों के रूप में चुनता है। ये SIG Docs और कुबेरनेट्स संगठन के
अन्य भागों के बीच संपर्क बिंदु हैं। उन्हें समग्र रूप से कुबेरनेट्स प्रोजेक्ट की
संरचना और इसके भीतर SIG Docs कैसे काम करता है, इसका व्यापक ज्ञान होना आवश्यक है।
अध्यक्षों की वर्तमान सूची के लिए
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
देखें।

## SIG Docs टीमें और स्वचालन

SIG Docs में स्वचालन दो अलग-अलग तंत्रों पर निर्भर करता है:
GitHub टीमें और OWNERS फ़ाइलें।

### GitHub टीमें

GitHub पर SIG Docs [टीमों](https://github.com/orgs/kubernetes/teams?query=sig-docs) की दो श्रेणियां हैं:

- `@sig-docs-{language}-owners` अनुमोदक और लीड हैं
- `@sig-docs-{language}-reviews` समीक्षक हैं

प्रत्येक को उस समूह में सभी के साथ संवाद करने के लिए
GitHub टिप्पणियों में उनके `@name` के साथ संदर्भित किया जा सकता है।

कभी-कभी Prow और GitHub टीमें बिना सटीक मिलान के ओवरलैप करती हैं।
issues, pull requests के असाइनमेंट और PR अनुमोदन का समर्थन करने के लिए,
स्वचालन `OWNERS` फ़ाइलों से जानकारी का उपयोग करता है।

### OWNERS फ़ाइलें और front-matter

कुबेरनेट्स प्रोजेक्ट GitHub issues और pull requests से संबंधित स्वचालन के लिए
prow नामक एक स्वचालन उपकरण का उपयोग करता है।
[कुबेरनेट्स वेबसाइट रिपॉजिटरी](https://github.com/kubernetes/website)
दो [prow plugins](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins) का उपयोग करती है:

- blunderbuss
- approve

ये दोनों plugins `kubernetes/website` GitHub रिपॉजिटरी के शीर्ष स्तर पर
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) और
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
फ़ाइलों का उपयोग करते हैं ताकि यह नियंत्रित किया जा सके कि रिपॉजिटरी के भीतर prow कैसे काम करता है।

एक OWNERS फ़ाइल में उन लोगों की सूची होती है जो SIG Docs समीक्षक और
अनुमोदक हैं। OWNERS फ़ाइलें उपनिर्देशिकाओं में भी मौजूद हो सकती हैं, और
उस उपनिर्देशिका और उसके वंशजों में फ़ाइलों के समीक्षक या अनुमोदक के रूप में
कौन कार्य कर सकता है, इसे ओवरराइड कर सकती हैं।
सामान्य रूप से OWNERS फ़ाइलों के बारे में अधिक जानकारी के लिए,
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md) देखें।

इसके अलावा, एक व्यक्तिगत Markdown फ़ाइल अपने front-matter में समीक्षकों और अनुमोदकों को
सूचीबद्ध कर सकती है, या तो व्यक्तिगत GitHub usernames या GitHub groups को सूचीबद्ध करके।

OWNERS फ़ाइलों और Markdown फ़ाइलों में front-matter का संयोजन निर्धारित करता है कि
PR मालिकों को स्वचालित प्रणालियों से अपने PR की तकनीकी और संपादकीय समीक्षा के लिए
किससे पूछना है, इस बारे में क्या सलाह मिलती है।

## मिलाना कैसे काम करता है

जब एक pull request को सामग्री प्रकाशित करने के लिए उपयोग की जाने वाली branch में मिलाया जाता है,
तो वह सामग्री https://kubernetes.io पर प्रकाशित होती है। यह सुनिश्चित करने के लिए कि
हमारी प्रकाशित सामग्री की गुणवत्ता उच्च है, हम pull requests को मिलाने को
SIG Docs अनुमोदकों तक सीमित रखते हैं। यहां बताया गया है कि यह कैसे काम करता है।

- जब एक pull request में `lgtm` और `approve` दोनों labels होते हैं, कोई `hold`
  labels नहीं होते, और सभी tests पास हो जाते हैं, तो pull request स्वचालित रूप से मिल जाता है।
- कुबेरनेट्स संगठन के सदस्य और SIG Docs अनुमोदक किसी दिए गए pull request के
  स्वचालित मिलाने को रोकने के लिए टिप्पणियां जोड़ सकते हैं (`/hold` टिप्पणी जोड़कर
  या `/lgtm` टिप्पणी रोककर)।
- कोई भी कुबेरनेट्स सदस्य `/lgtm` टिप्पणी जोड़कर `lgtm` label जोड़ सकता है।
- केवल SIG Docs अनुमोदक `/approve` टिप्पणी जोड़कर pull request को मिला सकते हैं।
  कुछ अनुमोदक अतिरिक्त विशिष्ट भूमिकाएं भी निभाते हैं, जैसे
  [PR Wrangler](/docs/contribute/participate/pr-wranglers/) या
  [SIG Docs अध्यक्ष](#sig-docs-अध्यक्ष)।



## {{% heading "whatsnext" %}}


कुबेरनेट्स दस्तावेज़ीकरण में योगदान के बारे में अधिक जानकारी के लिए, देखें:

- [नई सामग्री का योगदान](/docs/contribute/new-content/)
- [सामग्री की समीक्षा](/docs/contribute/review/reviewing-prs)
- [दस्तावेज़ीकरण शैली मार्गदर्शिका](/docs/contribute/style/)
