---
title: Admission Controller

id: admission-controller

date: 2019-06-28

full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >

यह कोड का अंश object का कार्य शुरू होने से पहले Kubernetes API server पर object द्वारा किये हुए अनुरोध को अवरोध करता है|

aka:
tags:
- extension
- security

---
यह कोड का अंश object का कार्य शुरू होने से पहले Kubernetes API server पर object द्वारा किये हुए अनुरोध को अवरोध करता है|

<!--more-->

Kubernetes API server के लिए Admission controllers विन्यस्त किये जा सकते है| Admission controllers, "validating", "mutating" या दोनों भी हो सकते हैं| कोई भी Admission controller, request को अस्वीकार कर सकते हैं| Controllers को स्वचालित रूप से परिवर्तित करने पर जोड़े हुए objects भी बदल सकते हैं परन्तु controllers की पुष्टि या मान्यता करने पर नहीं

* [Kubernetes documentation में Admission controllers](/docs/reference/access-authn-authz/admission-controllers/)