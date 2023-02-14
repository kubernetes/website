---
title: एडमिशन कंट्रोलर (Admission Controller)

id: admission-controller

date: 2019-06-28

full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >

यह कोड का अंश ऑब्जेक्ट का कार्य शुरू होने से पहले Kubernetes API सर्वर पर ऑब्जेक्ट द्वारा किये हुए अनुरोध को अवरोध करता है|

aka:
tags:
- extension
- security

---
यह कोड का अंश ऑब्जेक्ट का कार्य शुरू होने से पहले Kubernetes API सर्वर पर ऑब्जेक्ट द्वारा किये हुए अनुरोध को अवरोध करता है|

<!--more-->

Kubernetes API सर्वर के लिए एडमिशन कंट्रोलर विन्यस्त किये जा सकते है| एडमिशन कंट्रोलर, "मान्य करने", "स्वचालित रूप से परिवर्तित करने" या दोनों भी हो सकते हैं| कोई भी एडमिशन कंट्रोलर, ऑब्जेक्ट के अनुरोध को अस्वीकार कर सकते हैं| कंट्रोलर्स को स्वचालित रूप से परिवर्तित करने पर जोड़े हुए ऑब्जेक्ट भी बदल सकते हैं परन्तु कंट्रोलर्स की पुष्टि या मान्यता करने पर नहीं|

* [Kubernetes प्रलेखन में एडमिशन कंट्रोलर](/docs/reference/access-authn-authz/admission-controllers/)