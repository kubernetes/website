---
title: पुल अनुरोधों की समीक्षा करना
content_type: संकल्पना
main_menu: true
weight: 10
---

<!-- overview -->

कोई भी दस्तावेज़ पुल अनुरोध की समीक्षा कर सकता है। यहान जाये [pull requests](https://github.com/kubernetes/website/pulls)
खुले पुल अनुरोधों को देखने के लिए कुबेरनेट्स वेबसाइट रिपॉजिटरी में अनुभाग।

दस्तावेज़ीकरण पुल अनुरोधों की समीक्षा करना कुबेरनेट्स से अपना परिचय देने का एक शानदार तरीका है
समुदाय। यह आपको कोड आधार सीखने और अन्य योगदानकर्ताओं के साथ विश्वास बनाने में मदद करता है।

समीक्षा करने से पहले, यह एक अच्छा विचार है:

- Read the  [content guide](/docs/contribute/style/content-guide/) and
  [style guide](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Understand the different
  [roles and responsibilities](/docs/contribute/participate/roles-and-responsibilities/)
  in the Kubernetes documentation community.

<!-- body -->

## Before you begin

Before you start a review:

- Read the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
  और सुनिश्चित करें कि आप हर समय इसका पालन करते हैं।
- विनम्र, विचारशील और मददगार बनें।
- पीआर के सकारात्मक पहलुओं के साथ-साथ परिवर्तनों पर टिप्पणी करें।
- सहानुभूतिपूर्ण और सावधान रहें कि आपकी समीक्षा कैसे प्राप्त की जा सकती है।
- अच्छा इरादा मानें और स्पष्ट प्रश्न पूछें।
- अनुभवी योगदानकर्ता, नए योगदानकर्ताओं के साथ जुड़ने पर विचार करें जिनके कार्य में व्यापक परिवर्तन की आवश्यकता है।

## Review process

सामान्य तौर पर, अंग्रेज़ी में सामग्री और शैली के लिए पुल अनुरोधों की समीक्षा करें। चित्र 1 के लिए चरणों की रूपरेखा तैयार करता है
समीक्षा प्रक्रिया। प्रत्येक चरण के लिए विवरण का पालन करें।

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[Start review]
    direction TB
    S[ ] -.-
    M[add comments] --> N[review changes]
    N --> O[new contributors should<br>choose Comment]
    end
    subgraph third[Select PR]
    direction TB
    T[ ] -.-
    J[read description<br>and comments]--> K[preview changes in<br>Netlify preview build]
    end
 
  A[Review open PR list]--> B[Filter open PRs<br>by label]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

Figure 1. Review process steps.


1. Go to [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
   You see a list of every open pull request against the Kubernetes website and docs.

2. Filter the open PRs using one or all of the following labels:

   - `cncf-cla: yes` (Recommended): PRs submitted by contributors who have not signed the CLA
     cannot be merged. See [Sign the CLA](/docs/contribute/new-content/#sign-the-cla)
     for more information.
   - `language/en` (Recommended): Filters for english language PRs only.
   - `size/<size>`: filters for PRs of a certain size. If you're new, start with smaller PRs.

   Additionally, ensure the PR isn't marked as a work in progress. PRs using the `work in
   progress` label are not ready for review yet.

3. Once you've selected a PR to review, understand the change by:

   - Reading the PR description to understand the changes made, and read any linked issues
   - Reading any comments by other reviewers
   - Clicking the **Files changed** tab to see the files and lines changed
   - Previewing the changes in the Netlify preview build by scrolling to the PR's build check
     section at the bottom of the **Conversation** tab.
     Here's a screenshot (this shows GitHub's desktop site; if you're reviewing
     on a tablet or smartphone device, the GitHub web UI is slightly different):
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="GitHub pull request details including link to Netlify preview" >}}
     To open the preview, click on the  **Details** link of the **deploy/netlify** line in the
     list of checks.

4. Go to the **Files changed** tab to start your review.

   1. Click on the `+` symbol  beside the line you want to comment on.
   1. Fill in any comments you have about the line and click either **Add single comment**
      (if you have only one comment to make) or **Start a review** (if you have multiple comments to make).
   1. When finished, click **Review changes** at the top of the page. Here, you can add
      a summary of your review (and leave some positive comments for the contributor!).
      Please always use the "Comment"

     - Avoid clicking the "Request changes" button when finishing your review.
       If you want to block a PR from being merged before some further changes are made,
       you can leave a "/hold" comment.
       Mention why you are setting a hold, and optionally specify the conditions under
       which the hold can be removed by you or other reviewers.

     - Avoid clicking the "Approve" button when finishing your review.
       Leaving a "/approve" comment is recommended most of the time.

## Reviewing checklist

When reviewing, use the following as a starting point.

### Language and grammar

- Are there any obvious errors in language or grammar? Is there a better way to phrase something?
- Are there any complicated or archaic words which could be replaced with a simpler word?
- Are there any words, terms or phrases in use which could be replaced with a non-discriminatory alternative?
- Does the word choice and its capitalization follow the [style guide](/docs/contribute/style/style-guide/)?
- Are there long sentences which could be shorter or less complex?
- Are there any long paragraphs which might work better as a list or table?

### Content

- Does similar content exist elsewhere on the Kubernetes site?
- Does the content excessively link to off-site, individual vendor or non-open source documentation?

### Website

- क्या इस पीआर ने पृष्ठ शीर्षक, स्लग/उपनाम या एंकर लिंक को बदल दिया या हटा दिया? यदि हां, तो क्या वहां टूटा हुआ है
  इस पीआर के परिणामस्वरूप लिंक? क्या कोई अन्य विकल्प है, जैसे पृष्ठ शीर्षक को बिना बदले बदलना
  स्लग बदल रहा है?

- क्या पीआर एक नया पेज पेश करता है? यदि ऐसा है तो:

  - Is the page using the right [page content type](/docs/contribute/style/page-content-types/)
    and associated Hugo shortcodes?
  - Does the page appear correctly in the section's side navigation (or at all)?
  - Should the page appear on the [Docs Home](/docs/home/) listing?

- Do the changes show up in the Netlify preview? Be particularly vigilant about lists, code
  blocks, tables, notes and images.

### Other

पीआर के साथ छोटी-छोटी समस्याओं के लिए, जैसे टाइपो या व्हाइटस्पेस, अपनी टिप्पणियों को `नाइट:` के साथ उपसर्ग करें।
इससे लेखक को पता चलता है कि मुद्दा गैर-महत्वपूर्ण है।
