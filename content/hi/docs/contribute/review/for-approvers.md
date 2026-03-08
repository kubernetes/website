---
title: अनुमोदकों और समीक्षकों के लिए समीक्षा
linktitle: अनुमोदकों और समीक्षकों के लिए
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs के [समीक्षक](/docs/contribute/participate/#reviewers) और
[अनुमोदक](/docs/contribute/participate/#approvers) किसी बदलाव की समीक्षा करते समय
कुछ अतिरिक्त कार्य करते हैं।

हर हफ्ते एक विशिष्ट docs अनुमोदक pull requests को ट्राइएज और समीक्षा करने के लिए
स्वेच्छा से आगे आता है। इस व्यक्ति को उस सप्ताह का "PR Wrangler" कहा जाता है। अधिक
जानकारी के लिए [PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
देखें। PR Wrangler बनने के लिए, साप्ताहिक SIG Docs बैठक में भाग लें और स्वेच्छा से आगे आएं।
भले ही आप वर्तमान सप्ताह के शेड्यूल में न हों, फिर भी आप ऐसे pull requests (PRs) की समीक्षा
कर सकते हैं जो अभी तक सक्रिय समीक्षा में नहीं हैं।

रोटेशन के अलावा, एक बॉट प्रभावित फ़ाइलों के owners के आधार पर PR के लिए समीक्षकों
और अनुमोदकों को नियुक्त करता है।

<!-- body -->

## PR की समीक्षा करना

Kubernetes दस्तावेज़ीकरण
[Kubernetes कोड समीक्षा प्रक्रिया](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)
का पालन करता है।

[pull request की समीक्षा](/docs/contribute/review/reviewing-prs) में वर्णित सब कुछ
लागू होता है, लेकिन समीक्षकों और अनुमोदकों को निम्नलिखित भी करना चाहिए:

- आवश्यकतानुसार किसी विशिष्ट समीक्षक को PR सौंपने के लिए `/assign` Prow कमांड का उपयोग करें।
  यह विशेष रूप से महत्वपूर्ण है जब कोड योगदानकर्ताओं से तकनीकी समीक्षा का अनुरोध करना हो।

  {{< note >}}
  Markdown फ़ाइल के शीर्ष पर front-matter में `reviewers` फ़ील्ड देखें ताकि पता चले
  कि तकनीकी समीक्षा कौन प्रदान कर सकता है।
  {{< /note >}}

- यह सुनिश्चित करें कि PR [सामग्री](/docs/contribute/style/content-guide/) और
  [शैली](/docs/contribute/style/style-guide/) गाइड का पालन करता है; यदि नहीं करता,
  तो लेखक को गाइड के संबंधित भाग का लिंक दें।
- PR लेखक को बदलाव सुझाने के लिए जब भी उपयुक्त हो, GitHub के **Request Changes** विकल्प का
  उपयोग करें।
- यदि आपके सुझाव लागू किए गए हैं, तो `/approve` या `/lgtm` Prow कमांड का उपयोग करके
  GitHub में अपनी समीक्षा स्थिति बदलें।

## किसी अन्य व्यक्ति के PR में commit करना

PR पर टिप्पणियां छोड़ना उपयोगी है, लेकिन कभी-कभी आपको किसी अन्य व्यक्ति के PR में
commit करने की आवश्यकता हो सकती है।

किसी अन्य व्यक्ति का "कार्यभार न लें" जब तक कि वे स्पष्ट रूप से आपसे न कहें,
या आप किसी लंबे समय से छोड़े गए PR को पुनर्जीवित करना चाहते हों। हालांकि यह
अल्पकाल में तेज़ हो सकता है, यह उस व्यक्ति को योगदान करने के अवसर से वंचित करता है।

आप जिस प्रक्रिया का उपयोग करते हैं वह इस बात पर निर्भर करती है कि आपको PR के दायरे में
पहले से मौजूद किसी फ़ाइल को संपादित करना है, या कोई ऐसी फ़ाइल जिसे PR ने अभी तक छुआ नहीं है।

यदि निम्नलिखित में से कोई भी बात सच है, तो आप किसी अन्य के PR में commit नहीं कर सकते:

- यदि PR लेखक ने अपनी branch सीधे
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository में push की है। केवल push access वाला समीक्षक किसी अन्य उपयोगकर्ता के
  PR में commit कर सकता है।

  {{< note >}}
  लेखक को PR खोलने से पहले अपनी branch को अपने fork में push करने के लिए प्रोत्साहित करें।
  {{< /note >}}

- PR लेखक ने स्पष्ट रूप से अनुमोदकों द्वारा संपादन की अनुमति नहीं दी है।

## समीक्षा के लिए Prow कमांड

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
Kubernetes-आधारित CI/CD सिस्टम है जो pull requests (PRs) के विरुद्ध jobs चलाता है।
Prow, Kubernetes संगठन में GitHub actions को संभालने के लिए chatbot-शैली के कमांड
सक्षम करता है, जैसे [लेबल जोड़ना और हटाना](#adding-and-removing-issue-labels),
issues बंद करना और अनुमोदक नियुक्त करना। Prow कमांड को GitHub टिप्पणियों में
`/<command-name>` प्रारूप का उपयोग करके दर्ज करें।

समीक्षकों और अनुमोदकों द्वारा उपयोग किए जाने वाले सबसे सामान्य Prow कमांड हैं:

{{< table caption="समीक्षा के लिए Prow कमांड" >}}
Prow कमांड | भूमिका प्रतिबंध | विवरण
:------------|:------------------|:-----------
`/lgtm` | संगठन सदस्य | संकेत देता है कि आपने PR की समीक्षा पूरी कर ली है और बदलावों से संतुष्ट हैं।
`/approve` | अनुमोदक | PR को merge के लिए अनुमोदित करता है।
`/assign` | कोई भी | किसी व्यक्ति को PR की समीक्षा या अनुमोदन के लिए नियुक्त करता है।
`/close` | संगठन सदस्य | किसी issue या PR को बंद करता है।
`/hold` | कोई भी | `do-not-merge/hold` लेबल जोड़ता है, जो दर्शाता है कि PR को स्वचालित रूप से merge नहीं किया जा सकता।
`/hold cancel` | कोई भी | `do-not-merge/hold` लेबल हटाता है।
{{< /table >}}

PR में उपयोग किए जा सकने वाले कमांड देखने के लिए,
[Prow Command Reference](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite) देखें।

## Issues को ट्राइएज और वर्गीकृत करना

सामान्य तौर पर, SIG Docs
[Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
प्रक्रिया का पालन करता है और समान लेबल का उपयोग करता है।

यह GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
ऐसे issues खोजता है जिन्हें ट्राइएज की आवश्यकता हो सकती है।

### किसी issue को ट्राइएज करना

1. Issue को सत्यापित करें

   - सुनिश्चित करें कि issue वेबसाइट दस्तावेज़ीकरण के बारे में है। कुछ issues को किसी
     प्रश्न का उत्तर देकर या रिपोर्टर को किसी संसाधन की ओर इंगित करके शीघ्रता से बंद किया
     जा सकता है। विवरण के लिए
     [सहायता अनुरोध या कोड बग रिपोर्ट](#support-requests-or-code-bug-reports) अनुभाग देखें।
   - मूल्यांकन करें कि issue में दम है या नहीं।
   - यदि issue में कार्रवाई योग्य पर्याप्त विवरण नहीं है या टेम्पलेट पर्याप्त रूप से
     भरा नहीं गया है, तो `triage/needs-information` लेबल जोड़ें।
   - यदि issue में `lifecycle/stale` और `triage/needs-information` दोनों लेबल हैं तो
     issue बंद करें।

2. एक priority लेबल जोड़ें (
   [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)
   priority लेबल को विस्तार से परिभाषित करता है)

  {{< table caption="Issue लेबल" >}}
  लेबल | विवरण
  :------------|:------------------
  `priority/critical-urgent` | अभी करें।
  `priority/important-soon` | 3 महीने के भीतर करें।
  `priority/important-longterm` | 6 महीने के भीतर करें।
  `priority/backlog` | अनिश्चित काल के लिए स्थगित। जब संसाधन उपलब्ध हों तब करें।
  `priority/awaiting-more-evidence` | संभावित रूप से अच्छे issue के लिए placeholder ताकि वह गुम न हो।
  `help` या `good first issue` | बहुत कम Kubernetes या SIG Docs अनुभव वाले किसी व्यक्ति के लिए उपयुक्त। अधिक जानकारी के लिए [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) देखें।

  {{< /table >}}

  अपने विवेक से, किसी issue का स्वामित्व लें और उसके लिए PR सबमिट करें
  (विशेष रूप से यदि यह त्वरित है या उस काम से संबंधित है जो आप पहले से कर रहे हैं)।

यदि किसी issue को ट्राइएज करने के बारे में आपके प्रश्न हैं, तो Slack पर `#sig-docs` में
या [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
पर पूछें।

## Issue लेबल जोड़ना और हटाना

लेबल जोड़ने के लिए, निम्नलिखित प्रारूपों में से किसी एक में टिप्पणी छोड़ें:

- `/<label-to-add>` (उदाहरण के लिए, `/good-first-issue`)
- `/<label-category> <label-to-add>` (उदाहरण के लिए, `/triage needs-information` या `/language ja`)

लेबल हटाने के लिए, निम्नलिखित प्रारूपों में से किसी एक में टिप्पणी छोड़ें:

- `/remove-<label-to-remove>` (उदाहरण के लिए, `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (उदाहरण के लिए, `/remove-triage needs-information`)

दोनों मामलों में, लेबल पहले से मौजूद होना चाहिए। यदि आप कोई ऐसा लेबल जोड़ने का प्रयास करते हैं
जो मौजूद नहीं है, तो कमांड को चुपचाप अनदेखा कर दिया जाता है।

सभी लेबलों की सूची के लिए, [website repository का Labels अनुभाग](https://github.com/kubernetes/website/labels)
देखें। सभी लेबल SIG Docs द्वारा उपयोग नहीं किए जाते।

### Issue lifecycle लेबल

Issues आमतौर पर जल्दी खोले और बंद किए जाते हैं।
हालांकि, कभी-कभी खुलने के बाद कोई issue निष्क्रिय हो जाता है।
अन्य बार, किसी issue को 90 दिनों से अधिक समय तक खुला रहने की आवश्यकता हो सकती है।

{{< table caption="Issue lifecycle लेबल" >}}
लेबल | विवरण
:------------|:------------------
`lifecycle/stale` | 90 दिनों तक कोई गतिविधि न होने के बाद, किसी issue को स्वचालित रूप से stale के रूप में लेबल किया जाता है। यदि lifecycle को `/remove-lifecycle stale` कमांड का उपयोग करके मैन्युअल रूप से वापस नहीं किया जाता है तो issue स्वचालित रूप से बंद हो जाएगा।
`lifecycle/frozen` | इस लेबल वाला issue 90 दिनों की निष्क्रियता के बाद stale नहीं होगा। कोई उपयोगकर्ता मैन्युअल रूप से उन issues में यह लेबल जोड़ता है जिन्हें 90 दिनों से अधिक समय तक खुला रहना है, जैसे कि `priority/important-longterm` लेबल वाले।
{{< /table >}}

## विशेष issue प्रकारों को संभालना

SIG Docs इन प्रकार के issues से अक्सर मिलता है, इसलिए इन्हें संभालने के तरीके को
दस्तावेज़ीकृत किया गया है।

### डुप्लिकेट issues

यदि किसी एकल समस्या के लिए एक या अधिक issues खुले हैं, तो उन्हें एक ही issue में मिलाएं।
आपको यह तय करना चाहिए कि कौन सा issue खुला रखना है (या एक नया issue खोलना है), फिर सभी
प्रासंगिक जानकारी ले जाएं और संबंधित issues को लिंक करें। अंत में, उसी समस्या का वर्णन करने
वाले अन्य सभी issues को `triage/duplicate` से लेबल करें और उन्हें बंद करें। केवल एक ही
issue होने से भ्रम कम होता है और एक ही समस्या पर डुप्लिकेट काम से बचा जाता है।

### Dead link issues

यदि dead link issue API या `kubectl` दस्तावेज़ीकरण में है, तो समस्या पूरी तरह समझ आने
तक उन्हें `/priority critical-urgent` असाइन करें। अन्य सभी dead link issues को
`/priority important-longterm` असाइन करें, क्योंकि उन्हें मैन्युअल रूप से ठीक किया
जाना चाहिए।

### Blog issues

हम उम्मीद करते हैं कि [Kubernetes Blog](/blog/) प्रविष्टियां समय के साथ पुरानी हो जाएंगी।
इसलिए, हम केवल एक वर्ष से कम पुरानी blog प्रविष्टियों को बनाए रखते हैं। यदि कोई issue
एक वर्ष से अधिक पुरानी blog प्रविष्टि से संबंधित है, तो आपको आमतौर पर बिना ठीक किए
issue बंद कर देना चाहिए।

PR बंद करते समय आप जो संदेश भेजते हैं उसके हिस्से के रूप में आप
[article updates and maintenance](/docs/contribute/blog/#maintenance) का लिंक भेज सकते हैं।

जहां प्रासंगिक औचित्य लागू हो वहां अपवाद बनाना ठीक है।

### सहायता अनुरोध या कोड बग रिपोर्ट

कुछ docs issues वास्तव में अंतर्निहित कोड के साथ issues हैं, या तब सहायता के अनुरोध हैं
जब कुछ, उदाहरण के लिए एक tutorial, काम नहीं करता। docs से असंबंधित issues के लिए,
issue को `kind/support` लेबल के साथ बंद करें और एक टिप्पणी के साथ अनुरोधकर्ता को
सहायता स्थलों (Slack, Stack Overflow) और यदि प्रासंगिक हो, तो features के bugs के
लिए issue file करने के लिए repository की ओर निर्देशित करें
(`kubernetes/kubernetes` शुरू करने के लिए एक बेहतरीन जगह है)।

सहायता अनुरोध के लिए नमूना प्रतिक्रिया:

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](https://slack.k8s.io/). You can also search
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

कोड बग रिपोर्ट के लिए नमूना प्रतिक्रिया:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### Squashing

एक अनुमोदक के रूप में, जब आप pull requests (PRs) की समीक्षा करते हैं, तो विभिन्न
मामले होते हैं जहां आप निम्नलिखित कर सकते हैं:

- योगदानकर्ता को उनके commits squash करने की सलाह देना।
- योगदानकर्ता के लिए commits squash करना।
- योगदानकर्ता को अभी squash न करने की सलाह देना।
- Squashing को रोकना।

**योगदानकर्ताओं को squash करने की सलाह देना**: एक नए योगदानकर्ता को पता नहीं हो सकता कि
उन्हें अपने pull requests (PRs) में commits squash करने चाहिए। यदि ऐसा है, तो उन्हें
ऐसा करने की सलाह दें, उपयोगी जानकारी के लिंक प्रदान करें और यदि उन्हें आवश्यकता हो तो
सहायता की व्यवस्था करने की पेशकश करें। कुछ उपयोगी लिंक:

- docs योगदानकर्ताओं के लिए [pull requests खोलना और commits squash करना](/docs/contribute/new-content/open-a-pr#squashing-commits)।
- Developers के लिए diagrams सहित [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/)।

**योगदानकर्ताओं के लिए commits squash करना**: यदि किसी योगदानकर्ता को commits squash करने
में कठिनाई हो सकती है या PR merge करने के लिए समय का दबाव है, तो आप उनके लिए squash
कर सकते हैं:

- kubernetes/website repo
  [pull request merges के लिए squashing की अनुमति देने के लिए configured है](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)।
  बस *Squash commits* बटन चुनें।
- PR में, यदि योगदानकर्ता maintainers को PR प्रबंधित करने में सक्षम बनाता है, तो आप उनके
  commits squash कर सकते हैं और परिणाम के साथ उनके fork को update कर सकते हैं। Squash करने
  से पहले, उन्हें अपने नवीनतम बदलाव PR में save और push करने की सलाह दें। Squash करने के
  बाद, उन्हें squashed commit को अपने local clone में pull करने की सलाह दें।
- आप GitHub को एक label का उपयोग करके commits squash करवा सकते हैं ताकि Tide / GitHub
  squash करे या PR merge करते समय *Squash commits* बटन पर क्लिक करके।

**योगदानकर्ताओं को squashing से बचने की सलाह देना**

- यदि एक commit कुछ टूटा हुआ या अविवेकपूर्ण करता है, और अंतिम commit इस त्रुटि को
  वापस करता है, तो commits को squash न करें। भले ही GitHub पर PR में "Files changed" tab
  और Netlify preview दोनों ठीक दिखेंगे, इस PR को merge करने से अन्य लोगों के लिए rebase
  या merge conflicts हो सकते हैं। अन्य योगदानकर्ताओं के लिए उस जोखिम से बचने के लिए
  जैसा उचित लगे हस्तक्षेप करें।

**कभी squash न करें**

- यदि आप localization launch कर रहे हैं या किसी नए version के लिए docs release कर रहे हैं,
  तो आप किसी उपयोगकर्ता के fork से नहीं बल्कि किसी branch में merge कर रहे हैं,
  _commits को कभी squash न करें_।
  Squash न करना आवश्यक है क्योंकि आपको उन फ़ाइलों के लिए commit history बनाए रखनी होगी।
