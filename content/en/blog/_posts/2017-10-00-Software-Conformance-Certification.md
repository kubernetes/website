---
title: " Introducing Software Certification for Kubernetes "
date: 2017-10-19
slug: software-conformance-certification
url: /blog/2017/10/Software-Conformance-Certification
author: >
  William Denniss (Google)
---

Over the last three years, Kubernetes® has seen wide-scale adoption by a vibrant and diverse community of providers. In fact, there are now more than [60](https://docs.google.com/spreadsheets/d/1LxSqBzjOxfGx3cmtZ4EbB_BGCxT_wlxW_xgHVVa23es/edit#gid=0) known Kubernetes platforms and distributions. From the start, one goal of Kubernetes has been consistency and portability.  

In order to better serve this goal, today the Kubernetes community and the Cloud Native Computing Foundation® (CNCF®) announce the availability of the beta Certified Kubernetes Conformance Program. The Kubernetes conformance certification program gives users the confidence that when they use a Certified Kubernetes™ product, they can rely on a high level of common functionality. Certification provides Independent Software Vendors (ISVs) confidence that if their customer is using a Certified Kubernetes product, their software will behave as expected.  

CNCF and the Kubernetes Community invites all vendors to [run the conformance test suite](https://github.com/cncf/k8s-conformance/blob/master/instructions.md), and submit conformance testing results for review and certification by the CNCF. When the program graduates to GA (generally available) later this year, all vendors receiving certification during the beta period will be listed in the launch announcement.  

Just like Kubernetes itself, conformance certification is an evolving program managed by contributors in our community. Certification is versioned alongside Kubernetes, and certification requirements receive updates with each version of Kubernetes as features are added and the architecture changes. The Kubernetes community, through [SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture), controls changes and overseers what it means to be Certified Kubernetes. The [Testing SIG](https://github.com/kubernetes/community/tree/master/sig-testing) works on the mechanics of conformance tests, while the [Conformance Working Group](https://github.com/cncf/k8s-conformance) develops process and policy for the certification program.  

 ![](https://lh3.googleusercontent.com/-seEomiDY4syaWVbl0KT7k9fcJmylYK1n9_VANKyo5oIP5gH9MuIq_dcB_q3qvjE5YzOdM2HthMyc_wduC4xLmPStsb6Q6ASPBfOWi7ssGylfy1I7Pbd64THobytWa_1JX-pscH4)


Once the program moves to GA, certified products can proudly display the new Certified Kubernetes logo mark with stylized version information on their marketing materials. Certified products can also take advantage of a new combination trademark rule the CNCF adopted for Certified Kubernetes providers that keep their certification up to date.  

Products must complete a recertification each year for the current or previous version of Kubernetes to remain certified. This ensures that when you see the Certified Kubernetes™ mark on a product, you’re not only getting something that’s proven conformant, but also contains the latest features and improvements from the community.  

Visit [https://github.com/cncf/k8s-conformance](https://github.com/cncf/k8s-conformance) for more information about the Certified Kubernetes Conformance Program, and learn how you can include your product in a growing list of Certified Kubernetes providers.  

_“Cloud Native Computing Foundation”, “CNCF” and “Kubernetes” are registered trademarks of The Linux Foundation in the United States and other countries. “Certified Kubernetes” and the Certified Kubernetes design are trademarks of The Linux Foundation in the United States and other countries._
