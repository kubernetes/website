---
title: अनुमोदकों और समीक्षकों के लिए समीक्षा
linktitle: अनुमोदकों और समीक्षकों के लिए
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs के [समीक्षकों](/docs/contribute/participate/#reviewers) और
[अनुमोदकों](/docs/contribute/participate/#approvers) को किसी बदलाव की समीक्षा करते
समय कुछ अतिरिक्त काम भी करने होते हैं।

हर हफ्ते कोई एक docs अनुमोदक PRs को ट्राइएज और समीक्षा करने की जिम्मेदारी स्वेच्छा से
लेता है। इस व्यक्ति को उस हफ्ते का "PR रैंगलर" कहा जाता है। ज्यादा जानकारी के लिए
[PR रैंगलर शेड्यूलर](https://github.com/kubernetes/website/wiki/PR-Wranglers) देखें।
PR रैंगलर बनने के लिए साप्ताहिक SIG Docs मीटिंग में शामिल हों और अपना नाम आगे रखें।
अगर आप इस हफ्ते के शेड्यूल में नहीं भी हैं, तो भी आप उन PRs की समीक्षा कर सकते हैं
जिन पर अभी किसी और की सक्रिय समीक्षा नहीं चल रही।

इस रोटेशन के अलावा, एक बॉट भी है जो प्रभावित फ़ाइलों के owners के आधार पर PR को
समीक्षक और अनुमोदक अपने-आप असाइन करता है।

<!-- body -->

## PR की समीक्षा करना

कुबेरनेट्स का प्रलेखन
[कुबेरनेट्स कोड समीक्षा प्रक्रिया](https://github.com/kubernetes/community/blob/main/contributors/guide/owners.md#the-code-review-process)
का पालन करता है।

[pull request की समीक्षा करना](/docs/contribute/review/reviewing-prs) में लिखी हर बात
यहाँ भी लागू होती है, लेकिन समीक्षकों और अनुमोदकों को इसके अलावा यह भी करना चाहिए:

- जरूरत पड़ने पर किसी खास समीक्षक को PR पर असाइन करने के लिए `/assign` प्रो कमांड का
  इस्तेमाल करें। यह खासतौर पर तब जरूरी होता है जब code contributors से तकनीकी समीक्षा
  मांगी जा रही हो।

  {{< note >}}
  यह जानने के लिए कि तकनीकी समीक्षा कौन दे सकता है, Markdown फ़ाइल के ऊपर front-matter
  में दिए `reviewers` field को देखें।
  {{< /note >}}

- यह सुनिश्चित करें कि PR [सामग्री](/docs/contribute/style/content-guide/) और
  [स्टाइल](/docs/contribute/style/style-guide/) गाइड्स का पालन कर रहा है; अगर नहीं
  कर रहा तो author को गाइड के संबंधित हिस्से का लिंक दें।
- जहाँ जरूरी हो, PR author को बदलाव सुझाने के लिए GitHub के **Request Changes**
  विकल्प का इस्तेमाल करें।
- अगर आपके सुझाव लागू कर दिए गए हैं, तो `/approve` या `/lgtm` प्रो कमांड से GitHub
  में अपनी समीक्षा की स्थिति बदलें।

## किसी और के PR में commit करना

PR पर comment छोड़ना मदद करता है, लेकिन कभी-कभी आपको किसी और के PR में सीधे commit
करना पड़ सकता है।

जब तक कोई खुद न कहे, तब तक उसका काम "टेकओवर" न करें — हां, अगर कोई PR लंबे समय से पड़ा
हो और उसे फिर से शुरू करना जरूरी हो, तो यह अलग बात है। इससे काम तो तेज़ी से हो जाता है,
लेकिन उस व्यक्ति से सीखने का मौका छिन जाता है।

आप जो प्रक्रिया अपनाएंगे, यह इस पर निर्भर करता है कि आपको ऐसी फ़ाइल edit करनी है जो PR
के दायरे में पहले से है, या ऐसी फ़ाइल जिसे PR ने अभी छुआ ही नहीं।

नीचे दी गई किसी भी स्थिति में आप किसी और के PR में commit नहीं कर सकते:

- अगर PR author ने अपनी branch सीधे
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository में push की हो। ऐसे में सिर्फ push access वाला समीक्षक ही उस PR में
  commit कर सकता है।

  {{< note >}}
  Author को समझाएं कि अगली बार PR खोलने से पहले अपनी branch को अपने fork में push करें।
  {{< /note >}}

- PR author ने साफ़ तौर पर अनुमोदकों को edit करने से मना किया हो।

## समीक्षा के लिए प्रो कमांड्स

[प्रो (Prow)](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
कुबेरनेट्स-आधारित वह CI/CD सिस्टम है जो pull requests (PRs) पर jobs चलाता है। प्रो की
मदद से कुबेरनेट्स organization में GitHub actions को chatbot जैसे कमांड्स से चलाया जा
सकता है — जैसे [लेबल जोड़ना और हटाना](#adding-and-removing-issue-labels), इशू बंद
करना, या अनुमोदक असाइन करना। प्रो कमांड्स को GitHub comments में `/<command-name>`
फॉर्मेट में लिखा जाता है।

समीक्षकों और अनुमोदकों द्वारा सबसे ज्यादा इस्तेमाल किए जाने वाले प्रो कमांड्स ये हैं:

{{< table caption="समीक्षा के लिए प्रो कमांड्स" >}}
प्रो कमांड | भूमिका पर पाबंदी | विवरण
:------------|:------------------|:-----------
`/lgtm` | Organization के सदस्य | बताता है कि आपने PR की समीक्षा पूरी कर ली है और बदलावों से संतुष्ट हैं।
`/approve` | अनुमोदक | PR को merge करने के लिए अप्रूव करता है।
`/assign` | कोई भी | किसी व्यक्ति को PR की समीक्षा या अप्रूवल के लिए असाइन करता है।
`/close` | Organization के सदस्य | किसी इशू या PR को बंद करता है।
`/hold` | कोई भी | `do-not-merge/hold` लेबल जोड़ता है, यानी PR अपने-आप merge नहीं हो सकता।
`/hold cancel` | कोई भी | `do-not-merge/hold` लेबल हटाता है।
{{< /table >}}

किसी PR में आप कौन-कौन से कमांड्स इस्तेमाल कर सकते हैं, यह देखने के लिए
[प्रो कमांड संदर्भ](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite) देखें।

## इशू को ट्राइएज और वर्गीकृत करना

आमतौर पर SIG Docs
[कुबेरनेट्स इशू ट्राइएज](https://github.com/kubernetes/community/blob/main/contributors/guide/issue-triage.md)
प्रक्रिया का पालन करता है और वही लेबल इस्तेमाल करता है।

यह GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
उन इशूज़ को दिखाता है जिन्हें ट्राइएज की जरूरत हो सकती है।

### किसी इशू को ट्राइएज करना

1. इशू को जांचें

   - पहले देखें कि इशू वाकई website के प्रलेखन से जुड़ा है या नहीं। कुछ इशू सिर्फ
     जवाब देकर या reporter को किसी उपयोगी resource की तरफ भेजकर जल्दी बंद किए जा
     सकते हैं। ज्यादा जानकारी के लिए
     [सहायता संबंधी अनुरोध या कोड बग रिपोर्ट](#support-requests-or-code-bug-reports)
     सेक्शन देखें।
   - आंकें कि इशू में कोई दम है या नहीं।
   - अगर इशू में काम करने लायक पर्याप्त जानकारी नहीं है, या template ठीक से नहीं
     भरा गया, तो `triage/needs-information` लेबल लगाएं।
   - अगर इशू पर `lifecycle/stale` और `triage/needs-information` दोनों लेबल लगे हों,
     तो इशू बंद कर दें।

2. एक priority लेबल जोड़ें (priority लेबल्स की पूरी जानकारी
   [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/main/contributors/guide/issue-triage.md#define-priority)
   में दी गई है)

  {{< table caption="इशू लेबल" >}}
  लेबल | विवरण
  :------------|:------------------
  `priority/critical-urgent` | अभी करें।
  `priority/important-soon` | 3 महीनों के भीतर करें।
  `priority/important-longterm` | 6 महीनों के भीतर करें।
  `priority/backlog` | जब समय मिले तब करें, कोई जल्दी नहीं।
  `priority/awaiting-more-evidence` | एक संभावित रूप से अच्छे इशू के लिए प्लेसहोल्डर, ताकि वह नज़रों से न छूट जाए।
  `help` या `good first issue` | उन लोगों के लिए उपयुक्त जिन्हें कुबेरनेट्स या SIG Docs का बहुत कम अनुभव है। ज्यादा जानकारी के लिए [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) देखें।

  {{< /table >}}

  अपने विवेक से, किसी इशू का जिम्मा लें और उसके लिए PR सबमिट करें (खासकर अगर वह छोटा
  काम है या आप वैसे भी उससे जुड़े काम पर लगे हैं)।

अगर किसी इशू को ट्राइएज करने में कोई सवाल हो, तो Slack पर `#sig-docs` में पूछें या
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
पर लिखें।

## इशू लेबल जोड़ना और हटाना {#adding-and-removing-issue-labels}

लेबल जोड़ने के लिए, इनमें से किसी एक फॉर्मेट में comment करें:

- `/<label-to-add>` (उदाहरण के लिए, `/good-first-issue`)
- `/<label-category> <label-to-add>` (उदाहरण के लिए, `/triage needs-information` या `/language ja`)

लेबल हटाने के लिए, इनमें से किसी एक फॉर्मेट में comment करें:

- `/remove-<label-to-remove>` (उदाहरण के लिए, `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (उदाहरण के लिए, `/remove-triage needs-information`)

दोनों ही मामलों में, लेबल का पहले से मौजूद होना जरूरी है। अगर आप ऐसा लेबल जोड़ने की
कोशिश करते हैं जो मौजूद ही नहीं है, तो कमांड बिना कोई error दिए चुपचाप नज़रअंदाज़ हो
जाता है।

सभी लेबल्स की सूची के लिए [website repository के Labels सेक्शन](https://github.com/kubernetes/website/labels)
देखें। SIG Docs सभी लेबल्स इस्तेमाल नहीं करता।

### इशू lifecycle लेबल

इशू आमतौर पर जल्दी खुलते और बंद होते हैं। लेकिन कभी-कभी कोई इशू खुलने के बाद निष्क्रिय
पड़ा रह जाता है। और कभी-कभी किसी इशू को 90 दिनों से ज्यादा समय तक खुला रखना जरूरी होता है।

{{< table caption="इशू lifecycle लेबल" >}}
लेबल | विवरण
:------------|:------------------
`lifecycle/stale` | 90 दिनों तक कोई activity न होने पर इशू को अपने-आप stale के तौर पर लेबल कर दिया जाता है। अगर `/remove-lifecycle stale` कमांड से इसे मैन्युअली वापस नहीं किया गया, तो इशू अपने-आप बंद हो जाएगा।
`lifecycle/frozen` | यह लेबल लगे होने पर इशू 90 दिनों की निष्क्रियता के बाद भी stale नहीं होगा। ऐसे इशू पर यह लेबल मैन्युअली लगाया जाता है जिन्हें 90 दिनों से कहीं ज्यादा समय तक खुला रखना हो — जैसे `priority/important-longterm` लेबल वाले इशू।
{{< /table >}}

## खास तरह के इशू को संभालना

SIG Docs को कुछ खास तरह के इशू इतनी बार मिलते हैं कि उन्हें संभालने का तरीका यहाँ दर्ज
करना जरूरी लगा।

### डुप्लीकेट इशू

अगर किसी एक समस्या पर एक से ज्यादा इशू खुले हों, तो उन्हें मिलाकर एक कर दें। यह तय करें
कि किस इशू को खुला रखना है (या चाहें तो एक नया इशू खोलें), फिर सारी जरूरी जानकारी उसमें
ले जाएं और related इशू लिंक करें। आखिर में, एक ही समस्या बताने वाले बाकी सभी इशू पर
`triage/duplicate` लेबल लगाकर उन्हें बंद कर दें। सिर्फ एक ही इशू पर काम करने से भ्रम
कम होता है और एक ही समस्या पर दोबारा काम नहीं होता।

### डेड लिंक इशू

अगर डेड लिंक की समस्या API या `kubectl` प्रलेखन में है, तो समस्या पूरी तरह समझ आने तक
उसे `/priority critical-urgent` दें। बाकी सभी डेड लिंक इशू को `/priority
important-longterm` दें, क्योंकि उन्हें मैन्युअली ठीक करना पड़ता है।

### ब्लॉग इशू

[कुबेरनेट्स Blog](/blog/) की पोस्ट्स का समय के साथ पुरानी पड़ जाना स्वाभाविक है। इसलिए
हम सिर्फ एक साल से कम पुरानी ब्लॉग पोस्ट्स को मेंटेन करते हैं। अगर कोई इशू किसी एक साल
से ज्यादा पुरानी ब्लॉग पोस्ट से जुड़ा है, तो आमतौर पर उसे ठीक किए बिना बंद कर देना ही
सही रहता है।

PR बंद करते समय भेजे जाने वाले मैसेज में
[article updates and maintenance](/docs/contribute/blog/#maintenance) का लिंक शामिल
किया जा सकता है।

जहां कोई ठोस वजह लागू होती हो, वहां अपवाद बनाना ठीक है।

### सहायता संबंधी अनुरोध या कोड बग रिपोर्ट {#support-requests-or-code-bug-reports}

कुछ docs इशू असल में underlying कोड की समस्याएं होते हैं, या किसी चीज़ के काम न करने
पर मदद का अनुरोध होते हैं — जैसे कोई tutorial काम न करना। docs से न जुड़े इशू को
`kind/support` लेबल के साथ बंद करें, और एक comment में अनुरोध करने वाले व्यक्ति को सही
जगह भेजें (Slack, Stack Overflow) — और अगर बात किसी feature के bug की हो, तो उसके लिए
इशू खोलने का सही रिपॉजिटरी बताएं (`kubernetes/kubernetes` एक अच्छी शुरुआत है)।

सहायता के अनुरोध के लिए नमूना जवाब:

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

कोड बग रिपोर्ट के लिए नमूना जवाब:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### स्क्वाशिंग

अनुमोदक के तौर पर PRs की समीक्षा करते समय आपको कई तरह की स्थितियों का सामना करना पड़
सकता है, जैसे:

- Contributor को अपने commits स्क्वाश करने की सलाह देना।
- Contributor की तरफ से खुद commits स्क्वाश करना।
- Contributor को अभी स्क्वाश न करने की सलाह देना।
- स्क्वाशिंग को रोकना।

**स्क्वाश करने की सलाह देना**: किसी नए contributor को यह पता न हो कि उसे अपने PR में
commits स्क्वाश करने चाहिए। ऐसा हो, तो उन्हें यह सलाह दें, काम के लिंक दें, और जरूरत
पड़ने पर मदद देने की पेशकश करें। कुछ काम के लिंक:

- Docs contributors के लिए:
  [pull requests खोलना और अपने commits स्क्वाश करना](/docs/contribute/new-content/open-a-pr#squashing-commits)
- Developers के लिए: [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/) (डायग्राम्स के साथ)

**Contributors की तरफ से commits स्क्वाश करना**: अगर किसी contributor को commits
स्क्वाश करने में दिक्कत हो, या PR को जल्दी merge करने का दबाव हो, तो आप खुद उनके लिए
स्क्वाश कर सकते हैं:

- kubernetes/website रिपॉजिटरी में
  [pull request merges के लिए squashing की सुविधा ऑन है](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)।
  सिर्फ *Squash commits* बटन चुनें।
- PR में अगर contributor ने maintainers को PR मैनेज करने की अनुमति दी हो, तो आप उनके
  commits स्क्वाश कर सकते हैं और नतीजे को उनके fork में अपडेट कर सकते हैं। स्क्वाश
  करने से पहले उन्हें अपने latest बदलाव PR में save और push करने को कहें। स्क्वाश
  करने के बाद उन्हें squashed commit अपने local clone में pull करने को कहें।
- आप लेबल की मदद से Tide / GitHub से commits स्क्वाश करवा सकते हैं, या PR merge करते
  समय *Squash commits* बटन क्लिक करके भी स्क्वाश कर सकते हैं।

**Contributors को स्क्वाशिंग से बचने की सलाह देना**

- अगर कोई commit कुछ गड़बड़ करता है और आखिरी commit उस गलती को ठीक करता है, तो
  commits को स्क्वाश न करें। GitHub पर PR का "Files changed" टैब और Netlify preview
  दोनों ठीक दिखेंगे, लेकिन इस PR को merge करने से बाकी लोगों के लिए rebase या merge
  conflicts हो सकते हैं। दूसरे contributors को इस जोखिम से बचाने के लिए जैसा उचित
  लगे, बीच में आएं।

**कभी स्क्वाश न करें**

- अगर आप कोई localization launch कर रहे हैं, या किसी नए version के लिए docs release
  कर रहे हैं, और आप किसी user के fork से नहीं बल्कि किसी branch में merge कर रहे हैं
  — तो _commits को कभी स्क्वाश न करें_। इन फ़ाइलों के लिए commit history बनाए रखना
  जरूरी है।
