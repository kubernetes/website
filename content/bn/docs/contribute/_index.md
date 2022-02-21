---
content_type: ধারণা
title: অবদান রাখো K8s ডকুমেনটেশন
linktitle: অবদান
main_menu: true
no_list: true
weight: 80
card:
  name: অবদান
  weight: 10
  title: K8s এ অবদান রাখা শুরু করুন
---

<!-- overview -->

*Kubernetes নতুন এবং অভিজ্ঞ সকল অবদানকারীদের থেকে উন্নতিকে (immprovements) স্বাগত জানায়!*

{{< note >}}
সাধারণভাবে Kubernetes অবদান সম্পর্কে আরও জানতে, দেখুন
[অবদানকারীদের জন্য ডকুমেন্টেশন](https://www.kubernetes.dev/docs/)।
{{< /note >}}

এই ওয়েবসাইটটি [Kubernetes SIG ডক্স](/docs/contribute/#get-involved-with-sig-docs) দ্বারা রক্ষণাবেক্ষণ করা হয় ।

Kubernetes ডকুমেন্টেশন অবদানকারী:

- বিদ্যমান সামগ্রী উন্নত করুন
- নতুন কন্টেন্ট তৈরি করুন
- ডকুমেন্টেশন অনুবাদ করুন
- Kubernetes রিলিজ চক্রের ডকুমেন্টেশন অংশগুলি পরিচালনা এবং প্রকাশ করুন

<!-- body -->

## শুরু করুন 

যে কেউ ডকুমেন্টেশন সম্পর্কে একটি সমস্যা (issue)  খুলতে পারে, বা   পরিবর্তন করতে পারে
 পুল রিকুয়েস্ট(Pull Request) দেয়ার মাধ্যমে
[`kubernetes/website` GitHub সংগ্রহস্থল](https://github.com/kubernetes/website) এ। আপনাকে 
[git](https://git-scm.com/) এবং
[GitHub](https://lab.github.com/) সম্পর্কে জানতে হবে 
কুবারনেটস সম্প্রদায়ে কার্যকরভাবে কাজ করার জন্য।


ডকুমেন্টেশনের সাথে জড়িত হতে:

1. CNCF [কন্ট্রিবিউটর লাইসেন্স চুক্তি](https://github.com/kubernetes/community/blob/master/CLA.md) স্বাক্ষর করুন।
2. [ডকুমেন্টেশন রিপোজিটরি](https://github.com/kubernetes/website) এবং ওয়েবসাইটের [স্ট্যাটিক সাইট জেনারেটর](https://gohugo.io) এর সাথে নিজেকে পরিচিত করুন । 
3. নিশ্চিত করুন যে আপনি প্রাথমিক প্রক্রিয়াগুলি বুঝতে পেরেছেন৷
   [একটি পুল অনুরোধ খোলার](/docs/contribute/new-content/open-a-pr/) এবং
   [পরিবর্তন পর্যালোচনা করার](/docs/contribute/review/reviewing-prs/)।


<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[পুল রিকোয়েস্ট খুলুন]
direction TB
U[ ] -.-
Q[বিষয়বস্তু উন্নত] --- N[সামগ্রী তৈরি করুন]
N --- O[Translate docs]
O --- P[ডক্সের অংশগুলি পরিচালনা/প্রকাশ করুন<br>K8s রিলিজ চক্রের থেকে]

end

subgraph second[পুনঃমূল্যায়ন]
direction TB
   T[ ] -.-
   D[দেখুন<br>K8s/website<br>ভান্ডার] --- E[দেখুন<br>Hugo static সাইট<br>generator]
   E --- F[মৌলিক <br>GitHub কমান্ড বুঝুন]
   F --- G[পর্যালোচনা করো খোলা পুল রিকোয়েস্ট<br>এবং পর্যালোচনা পরিবর্তন করুন <br>প্রসেস]
end

subgraph first[Sign up]
    direction TB
    S[ ] -.-
    B[স্বাক্ষর করুন CNCF<br>অবদানকারী<br>লাইসেন্স চুক্তি] --- C[সিগ-ডক্সে যোগ দিন<br>Slack channel] 
    C --- V[kubernetes-sig-docs-এ যোগ দিন<br>মেইলিং তালিকা]
    V --- M[সাপ্তাহিকভাবে যোগদান করুন<br>সিগ-ডক্স কল<br>অথবা slack বৈঠক]
end

A([fa:fa-user নতুন<br>অবদানকারী]) --> first
A --> second
A --> third
A --> H[প্রশ্ন করো!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
***চিত্র - একজন নতুন অবদানকারীর জন্য শুরু করা***

উপরের চিত্রটি নতুন অবদানকারীদের জন্য একটি রোডম্যাপের রূপরেখা দেয়৷ আপনি `Sign up` এবং `Review` এর জন্য কিছু বা সমস্ত ধাপ অনুসরণ করতে পারেন। এখন আপনি 'Open PR'-এর অধীনে তালিকাভুক্ত কিছু সহ আপনার অবদানের উদ্দেশ্যগুলি অর্জনকারী PR খুলতে প্রস্তুত। আবার,আমরা প্রশ্ন সবসময় স্বাগত জানাই!



কিছু কাজের জন্য Kubernetes সংস্থায় আরও বিশ্বাস এবং আরও অ্যাক্সেসের প্রয়োজন।
এ সম্পর্কে আরো বিস্তারিত জানার জন্য [SIG ডক্সে অংশগ্রহণ করে](/docs/contribute/participate/) দেখুন
ভূমিকা এবং অনুমতি সমুহ।




## আপনার প্রথম অবদান 

আপনি আগে থেকে বেশ কয়েকটি ধাপ পর্যালোচনা করে আপনার প্রথম অবদানের জন্য প্রস্তুত করতে পারেন। নীচের চিত্রটি ধাপগুলিকে রূপরেখা দেয় এবং বিশদগুলি অনুসরণ করে৷

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[প্রথম অবদান]
    direction TB
    S[ ] -.-
    G[অন্যদের থেকে পুল রিকোয়েস্ট পর্যালোচনা করুন<br>K8s সদস্যদের মধ্য থেকে] -->
    A[K8s/website চেক করুন<br> সমস্যা তালিকার জন্য<br>ভাল প্রথম পুল রিকোয়েস্ট (good first PRs)] --> B[একটি পুল রিকোয়েস্ট খুলুন!!]
    end
    subgraph first[প্রস্তাবিত প্রস্তুতি]
    direction TB
       T[ ] -.-
       D[অবদান ওভারভিউ পড়ুন] -->E[K8s বিষয়বস্তু পড়ুন<br>এবং শৈলী গাইড]
       E --> F[Hugo পাতা সম্পর্কে জানুন<br>বিষয়বস্তুর প্রকার<br>এবং শর্টকোড]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
***চিত্র - আপনার প্রথম অবদানের জন্য প্রস্তুতি***


- [কন্ট্রিবিউশন ওভারভিউ](/docs/contribute/new-content/overview/) পড়ুন এবং
  আপনি  যেসব উপায়ে অবদান রাখতে পারেন সেসব সম্পর্কে জানুন । 
- [`kubernetes/website` সমস্যা তালিকা](https://github.com/kubernetes/website/issues/) চেক করুন যা
  ভালো এন্ট্রি পয়েন্ট তৈরি করে এমন সমস্যার জন্য।
- [GitHub ব্যবহার করে একটি পুল অনুরোধ খুলুন](/docs/contribute/new-content/open-a-pr/#changes-using-github)
  বিদ্যমান ডকুমেন্টেশনে এবং GitHub-এ ফাইল করা সমস্যা ( filing issues in GitHub) সম্পর্কে আরও জানুন।
- অন্য Kubernetes সম্প্রদায়ের সদস্যসদের  থেকে
  সঠিকতা এবং ভাষার জন্য [পুলের অনুরোধ পর্যালোচনা করুন](/docs/contribute/review/reviewing-prs/)  
- Kubernetes [content](/docs/contribute/style/content-guide/)  এবং [শৈলী নির্দেশিকা](/docs/contribute/style/style-guide/) পড়ুন
   যাতে আপনি অবহিত মন্তব্য করতে পারেন।
- [পৃষ্ঠা বিষয়বস্তুর প্রকার](/docs/contribute/style/page-content-types/) সম্পর্কে জানুন
  এবং [Hugo শর্ট কোডস](/docs/contribute/style/hugo-shortcodes/)।

## পরবর্তী পদক্ষেপ 

- ভান্ডার থেকে শিখুন  [একটি স্থানীয় ক্লোন (local clone) থেকে কাজ করা](/docs/contribute/new-content/open-a-pr/#fork-the-repo) ।
-  ডকুমেনটেশন কর [একটি রিলিজের বৈশিষ্ট্য](/docs/contribute/new-content/new-features/)।
- [SIG ডক্স](/docs/contribute/participate/) এ অংশগ্রহণ করুন এবং একজন 
  [সদস্য বা পর্যালোচক](/docs/contribute/participate/roles-and-responsibilities/) হন।
                       
- একটি [স্থানীয়করণ](/docs/contribute/localization/) দিয়ে শুরু করুন বা সাহায্য করুন।

## SIG ডক্সের সাথে জড়িত হন 

[SIG ডক্স](/docs/contribute/participate/) হল অবদানকারীদের গ্রুপ যারা
Kubernetes ডকুমেন্টেশন এবং ওয়েবসাইট প্রকাশ এবং বজায় রাখে । কুবারনেটিস অবদানকারীদের জন্য একটি দুর্দান্ত উপায়  
SIG ডক্সের সাথে জড়িত (বৈশিষ্ট্য
উন্নয়ন বা অন্যথায়) হওয়া যা কুবারনেটিস প্রকল্পে একটি বড় প্রভাব ফেলতে পারে।

SIG ডক্স বিভিন্ন পদ্ধতির সাথে যোগাযোগ করে:

- [Kubernetes Slack উদাহরণ হিসেবে `#sig-docs`-এ যোগ দিন](https://slack.k8s.io/)। নিশ্চিত করবে
  তোমার পরিচিতি যাতে দেয়া হয় । 
- [`kubernetes-sig-docs` মেইলিং তালিকায় যোগ দিন](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  যেখানে বিস্তৃত আলোচনা সঞ্চালিত হয় এবং অফিসিয়াল সিদ্ধান্ত রেকর্ড করা হয়।
- [সাপ্তাহিক SIG ডক্স ভিডিও মিটিং](https://github.com/kubernetes/community/tree/master/sig-docs) যোগ দিন। মিটিংগুলি সর্বদা `#sig-docs`-এ ঘোষণা করা হয় এবং [Kubernetes সম্প্রদায় মিটিং ক্যালেন্ডার](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/-এ যোগ করা হয়) লস এঞ্জেলেস). আপনাকে [জুম ক্লায়েন্ট](https://zoom.us/download) ডাউনলোড করতে হবে বা ফোন ব্যবহার করে ডায়াল করতে হবে।
- সেই সপ্তাহগুলিতে যখন ব্যক্তিগত জুম ভিডিও মিটিং হয় না তখন SIG ডক্স অ্যাসিঙ্ক স্ল্যাক স্ট্যান্ডআপ মিটিংয়ে যোগ দিন। সভাগুলি সর্বদা `#sig-docs`-এ ঘোষণা করা হয়। আপনি মিটিংয়ের ঘোষণার 24 ঘন্টা পর্যন্ত থ্রেডের যেকোনো একটিতে অবদান রাখতে পারেন।

## অবদান রাখার অন্যান্য উপায় 
- [Kubernetes কমিউনিটি সাইট](/community/) দেখুন। টুইটার বা স্ট্যাক ওভারফ্লোতে অংশগ্রহণ করুন, স্থানীয় কুবারনেট মিটআপ এবং ইভেন্ট এবং আরও অনেক কিছু সম্পর্কে জানুন।
- Kubernetes ফিচার ডেভেলপমেন্টের সাথে যুক্ত হতে [কন্ট্রিবিউটর চিটশীট](https://www.kubernetes.dev/docs/contributor-cheatsheet/) পড়ুন।
- [Kubernetes Contributors](https://www.kubernetes.dev/) এবং [অতিরিক্ত অবদানকারী সংস্থান](https://www.kubernetes.dev/resources/) সম্পর্কে আরও জানতে অবদানকারীর সাইটে যান।
- একটি [ব্লগ পোস্ট বা কেস স্টাডি](/docs/contribute/new-content/blogs-case-studies/) জমা দিন।
