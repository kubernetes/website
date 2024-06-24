---
title: विघटन (Disruption)
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
   ऐसी घटना जिसके कारण पॉड(पॉड्स) सेवा से बाहर हो जाते हैं।
aka:
tags:
- fundamental
---
 विघटन वे घटनाएं हैं जिनसे एक या अधिक 
{{< glossary_tooltip term_id="pod" text="पॉड्स" >}} सेवा से बाहर हो जाते हैं। 
विघटन का असर उन संसाधनों पर भी पड़ता है जो प्रभावित पॉड्स पर निर्भर करते हैं, जैसे कि 
{{< glossary_tooltip term_id="deployment" >}}

<!--more-->

अगर आप क्लस्टर ऑपरेटर के रूप में, किसी एप्लिकेशन से संबंधित पॉड को नष्ट करते हैं, 
तो कुबेरनेट्स इसे _स्वैच्छिक विघटन_ कहता है। अगर कोई पॉड नोड फेलियर या व्यापक क्षेत्र 
में आउटेज के कारण ऑफलाइन हो जाता है, तो कुबेरनेट्स इसे _अस्वैच्छिक विघटन_ कहता है।

अधिक जानकारी के लिए [विघटन](/docs/concepts/workloads/pods/disruptions/) देखें।
