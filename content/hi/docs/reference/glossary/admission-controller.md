---
title: एडमिशन नियंत्रक (Admission Controller)
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  यह कोड का अंश जो ऑब्जेक्ट शुरू होने से पहले कुबेरनेट्स API सर्वर पर किए गए अनुरोध को संसाधित करता है।

aka:
tags:
- extension
- security
---
यह कोड का अंश जो ऑब्जेक्ट शुरू होने से पहले कुबेरनेट्स API सर्वर पर किए गए अनुरोध को संसाधित करता है।

<!--more-->

एडमिशन नियंत्रक कुबेरनेट्स API सर्वर के लिए  विन्यस्त करने योग्य हैं और यह "सत्यापन" (validating), "म्युटेटिंग" (mutating) या दोनों हो सकते हैं।
कोई भी एडमिशन नियंत्रक किसी भी अनुरोध को अस्वीकार कर सकते हैं। म्युटेटिंग नियंत्रक उन ऑब्जेक्ट्स को संशोधित कर सकते हैं जिन्हें वे स्वीकार करते हैं सत्यापनकर्ता नियंत्रक ऐसा नहीं कर सकते।

* [कुबेरनेट्स प्रलेखन में एडमिशन नियंत्रक](/docs/reference/access-authn-authz/admission-controllers/)