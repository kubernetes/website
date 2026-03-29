---
title: अनुमोदकों और समीक्षकों के लिए समीक्षा
linktitle: अनुमोदकों और समीक्षकों के लिए
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs के [समीक्षक](/docs/contribute/participate/#reviewers) और
[अनुमोदक](/docs/contribute/participate/#approvers) किसी भी बदलाव को review करते वक्त
कुछ अलग काम भी करते हैं।

हर हफ्ते एक docs approver pull requests को triage और review करने की जिम्मेदारी लेता है —
उसे उस हफ्ते का "PR Wrangler" कहते हैं। ज्यादा जानकारी के लिए
[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers) देखें।
PR Wrangler बनने के लिए SIG Docs की हफ्तेवारी मीटिंग में आएं और अपना नाम दें।
अगर आप उस हफ्ते schedule पर नहीं हैं, तब भी आप ऐसे PRs देख सकते हैं जिन पर अभी किसी की नजर नहीं है।

इसके अलावा एक bot भी है जो affected files के owners के हिसाब से reviewers और approvers
को PR assign करता है।

<!-- body -->

## PR review करना

Kubernetes documentation
[Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)
को follow करती है।

[pull request review करना](/docs/contribute/review/reviewing-prs) में जो कुछ भी लिखा है
वो सब तो लागू होता ही है, लेकिन reviewers और approvers को ये भी करना चाहिए:

- जरूरत पड़ने पर किसी खास reviewer को PR assign करने के लिए `/assign` Prow command का इस्तेमाल करें।
  खासकर तब जब code contributors से technical review माँगनी हो।

  {{< note >}}
  Markdown file के ऊपर front-matter में `reviewers` field देखें — वहाँ लिखा होता है कि
  technical review कौन दे सकता है।
  {{< /note >}}

- देखें कि PR, [Content](/docs/contribute/style/content-guide/) और
  [Style](/docs/contribute/style/style-guide/) guide को follow कर रहा है या नहीं।
  अगर नहीं कर रहा तो author को उस guide का link दें।
- जहाँ जरूरी लगे, वहाँ GitHub के **Request Changes** option से PR author को changes suggest करें।
- अगर आपके suggestions लागू हो जाएं तो `/approve` या `/lgtm` Prow command से
  GitHub में अपना review status update करें।

## किसी और के PR में commit करना

PR पर comments छोड़ना तो ठीक है, लेकिन कभी-कभी आपको सीधे किसी और के PR में
commit करना पड़ सकता है।

किसी का PR "take over" मत करें जब तक वो खुद न कहे, या फिर PR काफी समय से
पड़ा हो और उसे जगाना जरूरी हो। हाँ, इससे काम जल्दी हो जाता है — लेकिन उस
contributor को सीखने का मौका चला जाता है।

आप क्या करेंगे यह इस बात पर निर्भर करता है — क्या उस file को edit करना है जो
PR में पहले से है, या कोई नई file जोड़नी है।

इन दोनों में से कोई भी स्थिति हो तो आप किसी और के PR में commit नहीं कर सकते:

- PR author ने अपनी branch सीधे
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository में push की हो। ऐसे में सिर्फ वही reviewer commit कर सकता है जिसके पास
  push access हो।

  {{< note >}}
  Author को समझाएं कि अगली बार PR खोलने से पहले branch को अपने fork में push करें।
  {{< /note >}}

- PR author ने approvers को edit करने से मना किया हो।

## Review के लिए Prow commands

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
Kubernetes का CI/CD system है जो PRs पर jobs चलाता है। इससे आप GitHub comments में
chatbot जैसे commands दे सकते हैं — जैसे [labels लगाना और हटाना](#adding-and-removing-issue-labels),
issues बंद करना, या approver assign करना। Commands का format होता है `/<command-name>`।

Reviewers और approvers जो commands सबसे ज्यादा use करते हैं:

{{< table caption="Review के लिए Prow commands" >}}
Prow Command | किसके लिए | क्या करता है
:------------|:------------------|:-----------
`/lgtm` | Organization members | बताता है कि आपने PR review कर लिया और changes ठीक हैं।
`/approve` | Approvers | PR को merge के लिए approve करता है।
`/assign` | कोई भी | किसी को PR review या approve करने के लिए assign करता है।
`/close` | Organization members | कोई issue या PR बंद करता है।
`/hold` | कोई भी | `do-not-merge/hold` label लगाता है — यानी PR अभी auto-merge नहीं होगा।
`/hold cancel` | कोई भी | `do-not-merge/hold` label हटाता है।
{{< /table >}}

PR में use होने वाले सभी commands देखने के लिए
[Prow Command Reference](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite) देखें।

## Issues को triage और categorize करना

SIG Docs आमतौर पर
[Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
process को follow करता है और वही labels use करता है।

यह GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
उन issues को दिखाता है जिन्हें triage की जरूरत हो सकती है।

### किसी issue को triage करना

1. Issue को जाँचें

   - पहले देखें कि issue सच में website documentation से जुड़ा है या नहीं। कुछ issues
     तो बस एक जवाब देने से या सही resource की तरफ भेजने से बंद हो सकते हैं। इसके लिए
     [सहायता अनुरोध या code bug reports](#support-requests-or-code-bug-reports) section देखें।
   - Issue में कोई दम है या नहीं, यह भी तय करें।
   - अगर issue में काम करने लायक जानकारी नहीं है या template ठीक से नहीं भरा गया,
     तो `triage/needs-information` label लगाएं।
   - अगर issue पर `lifecycle/stale` और `triage/needs-information` दोनों labels हों
     तो उसे बंद कर दें।

2. Priority label लगाएं (
   [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)
   में priority labels का पूरा विवरण है)

  {{< table caption="Issue labels" >}}
  Label | मतलब
  :------------|:------------------
  `priority/critical-urgent` | अभी करो।
  `priority/important-soon` | 3 महीने के अंदर करो।
  `priority/important-longterm` | 6 महीने के अंदर करो।
  `priority/backlog` | जब वक्त मिले तब करो, कोई जल्दी नहीं।
  `priority/awaiting-more-evidence` | अच्छा issue लग रहा है, लेकिन अभी और जानकारी चाहिए।
  `help` या `good first issue` | नए contributors के लिए, जिन्हें Kubernetes या SIG Docs का ज्यादा experience नहीं। ज्यादा जानकारी के लिए [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) देखें।

  {{< /table >}}

  अगर issue छोटा है या आप उस काम से पहले से जुड़े हैं, तो खुद उसे ले लें और PR submit करें।

किसी issue को triage करने में कोई उलझन हो तो Slack पर `#sig-docs` में पूछें या
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
पर लिखें।

## Issue labels लगाना और हटाना

Label लगाने के लिए comment में इस तरह लिखें:

- `/<label-to-add>` (जैसे `/good-first-issue`)
- `/<label-category> <label-to-add>` (जैसे `/triage needs-information` या `/language ja`)

Label हटाने के लिए:

- `/remove-<label-to-remove>` (जैसे `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (जैसे `/remove-triage needs-information`)

ध्यान रखें — label पहले से exist करना चाहिए। कोई ऐसा label add करने की कोशिश करेंगे
जो है ही नहीं, तो command बिना कोई error दिए चुपचाप ignore हो जाएगा।

सभी labels की list के लिए [website repository का Labels section](https://github.com/kubernetes/website/labels)
देखें। SIG Docs सब labels use नहीं करता।

### Issue lifecycle labels

Issues आमतौर पर जल्दी खुलते और बंद होते हैं।
लेकिन कभी-कभी issue खुलने के बाद उस पर कोई activity नहीं होती।
और कभी-कभी issue को 90 दिनों से ज्यादा खुला रखना जरूरी होता है।

{{< table caption="Issue lifecycle labels" >}}
Label | मतलब
:------------|:------------------
`lifecycle/stale` | 90 दिन तक कोई activity नहीं हुई तो issue अपने आप stale mark हो जाता है। अगर `/remove-lifecycle stale` command से इसे वापस नहीं किया गया तो issue अपने आप बंद हो जाएगा।
`lifecycle/frozen` | यह label लगा हो तो issue 90 दिन बाद भी stale नहीं होगा। यह label उन issues पर manually लगाते हैं जिन्हें लंबे समय तक खुला रखना हो — जैसे `priority/important-longterm` वाले।
{{< /table >}}

## खास तरह के issues को handle करना

SIG Docs कुछ खास तरह के issues से अक्सर मिलता है, इसलिए उन्हें handle करने का तरीका
यहाँ लिखा गया है।

### Duplicate issues

एक ही समस्या पर कई issues खुले हों तो उन्हें एक में मिला दें। तय करें कि कौन सा issue
खुला रखना है (या चाहें तो नया खोल लें), उसमें सारी जरूरी जानकारी डालें और related issues
को link करें। बाकी सभी issues पर `triage/duplicate` label लगाकर बंद कर दें। एक issue
रहेगा तो confusion नहीं होगी और एक ही काम दो बार नहीं होगा।

### Dead link issues

अगर dead link, API या `kubectl` documentation में है तो समस्या पूरी तरह समझ आने तक
`/priority critical-urgent` assign करें। बाकी dead link issues को
`/priority important-longterm` दें क्योंकि उन्हें manually ठीक करना पड़ता है।

### Blog issues

[Kubernetes Blog](/blog/) की posts समय के साथ पुरानी हो जाती हैं, यह स्वाभाविक है।
इसलिए हम सिर्फ एक साल से कम पुरानी blog posts को maintain करते हैं। अगर issue किसी
एक साल से पुरानी post से जुड़ा हो तो उसे बिना fix किए बंद करना ठीक रहता है।

PR बंद करते वक्त [article updates and maintenance](/docs/contribute/blog/#maintenance)
का link message में शामिल कर सकते हैं।

जहाँ कोई ठोस वजह हो, वहाँ exception बनाना ठीक है।

### सहायता अनुरोध या code bug reports

कुछ docs issues दरअसल code की समस्याएं होती हैं, या फिर कोई tutorial काम न करने पर
मदद का अनुरोध होता है। ऐसे issues को `kind/support` label लगाकर बंद करें और एक comment
में उस व्यक्ति को Slack, Stack Overflow जैसी जगहों पर जाने को कहें। अगर bug किसी
feature में है तो `kubernetes/kubernetes` repository में issue खोलने को कहें।

सहायता अनुरोध के लिए नमूना जवाब:

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

Code bug report के लिए नमूना जवाब:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### Squashing

Approver के तौर पर PRs review करते वक्त आपके सामने कई situations आ सकती हैं:

- Contributor को commits squash करने की सलाह देना
- खुद उनके commits squash करना
- अभी squash न करने को कहना
- Squashing रोकना

**Squash करने की सलाह देना**: नए contributors को अक्सर नहीं पता होता कि PRs में
commits squash करने चाहिए। ऐसे में उन्हें बताएं, useful links दें और जरूरत पड़े तो
मदद करने की पेशकश करें। कुछ helpful links:

- Docs contributors के लिए: [pull requests खोलना और commits squash करना](/docs/contribute/new-content/open-a-pr#squashing-commits)
- Developers के लिए: [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/) (diagrams के साथ)

**खुद squash करना**: अगर contributor को squash करने में दिक्कत हो या PR जल्दी merge
करना हो, तो आप खुद squash कर सकते हैं:

- kubernetes/website repo में
  [pull request merges के लिए squashing on है](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)।
  बस *Squash commits* button दबाएं।
- अगर contributor ने maintainers को PR manage करने दिया हो, तो उनके commits squash
  करके उनके fork में result push करें। Squash करने से पहले उन्हें latest changes save
  और push करने को कहें। Squash के बाद उन्हें squashed commit pull करने को कहें।
- Label लगाकर Tide / GitHub से squash करवा सकते हैं, या merge करते वक्त
  *Squash commits* button click करें।

**Squash न करने की सलाह देना**

- अगर किसी commit ने कुछ गड़बड़ किया हो और आखिरी commit ने उसे ठीक किया हो, तो
  squash मत करें। GitHub पर "Files changed" tab और Netlify preview दोनों ठीक दिखेंगे,
  लेकिन merge करने से दूसरों के लिए rebase या merge conflicts आ सकते हैं। जैसा उचित
  लगे, बीच में आएं।

**कभी squash मत करें**

- अगर आप कोई localization launch कर रहे हों या नए version के लिए docs release कर रहे हों
  और किसी user के fork से नहीं बल्कि किसी branch में merge हो रहा हो — _commits कभी
  squash मत करें_। Commit history बनाए रखना जरूरी है।
