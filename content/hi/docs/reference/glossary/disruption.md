---
<<<<<<< HEAD
title: Disruption
=======
title: विघटन (Disruption)
>>>>>>> origin/main
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
<<<<<<< HEAD
  An event that leads to Pod(s) going out of service
=======
   ऐसी घटना जिसके कारण पॉड(पॉड्स) सेवा से बाहर हो जाते हैं।
>>>>>>> origin/main
aka:
tags:
- fundamental
---
<<<<<<< HEAD
 Disruptions are events that lead to one or more
{{< glossary_tooltip term_id="pod" text="Pods" >}} going out of service.
A disruption has consequences for workload resources, such as
{{< glossary_tooltip term_id="deployment" >}}, that rely on the affected
Pods.

<!--more-->

If you, as cluster operator, destroy a Pod that belongs to an application,
Kubernetes terms that a _voluntary disruption_. If a Pod goes offline
because of a Node failure, or an outage affecting a wider failure zone,
Kubernetes terms that an _involuntary disruption_.

See [Disruptions](/docs/concepts/workloads/pods/disruptions/) for more information.
=======
 विघटन वे घटनाएं हैं जिनसे एक या अधिक 
{{< glossary_tooltip term_id="pod" text="पॉड्स" >}} सेवा से बाहर हो जाते हैं। 
विघटन का असर उन संसाधनों पर भी पड़ता है जो प्रभावित पॉड्स पर निर्भर करते हैं, जैसे कि 
{{< glossary_tooltip term_id="deployment" >}}

<!--more-->

अगर आप क्लस्टर ऑपरेटर के रूप में, किसी एप्लिकेशन से संबंधित पॉड को नष्ट करते हैं, 
तो कुबेरनेट्स इसे _स्वैच्छिक विघटन_ कहता है। अगर कोई पॉड नोड फेलियर या व्यापक क्षेत्र 
में आउटेज के कारण ऑफलाइन हो जाता है, तो कुबेरनेट्स इसे _अस्वैच्छिक विघटन_ कहता है।

अधिक जानकारी के लिए [विघटन](/docs/concepts/workloads/pods/disruptions/) देखें।
>>>>>>> origin/main
