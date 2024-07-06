---
title: Garbage Collection
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  क्लस्टर संसाधनों को साफ करने के लिए कुबेरनेट्स द्वारा उपयोग किए जाने वाले विभिन्न तंत्रों के लिए एक सामूहिक शब्द।

aka: 
tags:
- fundamental
- operation
---

गार्बेज कलेक्शन विभिन्न तंत्रों के लिए एक सामूहिक शब्द है जिसका उपयोग कुबेरनेट्स क्लस्टर संसाधनों को साफ करने के लिए करता है।

<!--more-->

कुबेरनेट्स [अप्रयुक्त कंटेनरों और छवियों](/docs/concepts/architecture/garbage-collection/#containers-images), [विफल पॉड्स](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), [लक्षित संसाधन के स्वामित्व वाली वस्तुओं](/docs/concepts/overview/working-with-objects/owners-dependents/), [पूर्ण नौकरियों](/docs/concepts/workloads/controllers/ttlafterfinished/), और समाप्त हो चुके या विफल हो चुके संसाधनों जैसे संसाधनों को साफ करने के लिए कचरा संग्रहण का उपयोग करता है।
