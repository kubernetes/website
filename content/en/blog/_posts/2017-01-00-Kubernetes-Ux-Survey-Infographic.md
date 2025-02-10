---
title: " Kubernetes UX Survey Infographic "
date: 2017-01-09
slug: kubernetes-ux-survey-infographic
url: /blog/2017/01/Kubernetes-Ux-Survey-Infographic
author: >
  Dan Romlein (UX Designer)
---
The following infographic summarizes the findings of a survey that the team behind [Dashboard](https://github.com/kubernetes/dashboard), the official web UI for Kubernetes, sent during KubeCon in November 2016. Following the KubeCon launch of the survey, it was promoted on Twitter and various Slack channels over a two week period and generated over 100 responses. We’re delighted with the data it provides us to now make feature and roadmap decisions more in-line with the needs of you, our users.  

**Satisfaction with Dashboard**  


[![](https://1.bp.blogspot.com/-aSAimiXhbkw/WHPgEveTIzI/AAAAAAAAA5s/BMa-6jVzW4Ir-JExg-njJJge2tQg6QSOwCLcB/s640/satisfaction-with-dashboard.png)](https://1.bp.blogspot.com/-aSAimiXhbkw/WHPgEveTIzI/AAAAAAAAA5s/BMa-6jVzW4Ir-JExg-njJJge2tQg6QSOwCLcB/s1600/satisfaction-with-dashboard.png)

Less than a year old, Dashboard is still very early in its development and we realize it has a long way to go, but it was encouraging to hear it’s tracking on the axis of MVP and even with its basic feature set is adding value for people. Respondents indicated that they like how quickly the Dashboard project is moving forward and the activity level of its contributors. Specific appreciation was given for the value Dashboard brings to first-time Kubernetes users and encouraging exploration. Frustration voiced around Dashboard centered on its limited capabilities: notably, the lack of RBAC and limited visualization of cluster objects and their relationships.  

**Respondent Demographics**  


[![](https://2.bp.blogspot.com/-f4lRiYxQ6Pg/WHPggSKpt7I/AAAAAAAAA5w/uThW4NAPiokHJ_Av721SRN4FThd2THAIQCLcB/s640/respondent-demographics.png)](https://2.bp.blogspot.com/-f4lRiYxQ6Pg/WHPggSKpt7I/AAAAAAAAA5w/uThW4NAPiokHJ_Av721SRN4FThd2THAIQCLcB/s1600/respondent-demographics.png)


**Kubernetes Usage**  

[![](https://4.bp.blogspot.com/-iQD8MEPL7nA/WHPgEensPbI/AAAAAAAAA5o/nRAVMQpcxmM9llFJyC-pVD16emtagnxgwCEw/s640/kubernetes-usage.png)](https://4.bp.blogspot.com/-iQD8MEPL7nA/WHPgEensPbI/AAAAAAAAA5o/nRAVMQpcxmM9llFJyC-pVD16emtagnxgwCEw/s1600/kubernetes-usage.png)

People are using Dashboard in production, which is fantastic; it’s that setting that the team is focused on optimizing for.



**Feature Priority**  

[![](https://1.bp.blogspot.com/-gGKQKRwgOto/WHPgEdVMqQI/AAAAAAAAA5k/MiTVQtKLuHkAMmSjpvAsmiBezAdQV4zCwCEw/s640/feature-priority.png)](https://1.bp.blogspot.com/-gGKQKRwgOto/WHPgEdVMqQI/AAAAAAAAA5k/MiTVQtKLuHkAMmSjpvAsmiBezAdQV4zCwCEw/s1600/feature-priority.png)



In building Dashboard, we want to continually make alignments between the needs of Kubernetes users and our product. Feature areas have intentionally been kept as high-level as possible, so that UX designers on the Dashboard team can creatively transform those use cases into specific features. While there’s nothing wrong with “[faster horses](http://www.goodreads.com/quotes/15297-if-i-had-asked-people-what-they-wanted-they-would)”, we want to make sure we’re creating an environment for the best possible innovation to flourish.



Troubleshooting & Debugging as a strong frontrunner in requested feature area is consistent with the [previous KubeCon survey](http://static.lwy.io/img/kubernetes_dashboard_infographic.png), and this is now our top area of investment. Currently in-progress is the ability to be able to exec into a Pod, and next up will be providing aggregated logs views across objects. One of a UI’s strengths over a CLI is its ability to show things, and the troubleshooting and debugging feature area is a prime application of this capability.



In addition to a continued ongoing investment in troubleshooting and debugging functionality, the other focus of the Dashboard team’s efforts currently is RBAC / IAM within Dashboard. Though #4 on the ranking of feature areas, In various conversations at KubeCon and the days following, this emerged as a top-requested feature of Dashboard, and the one people were most passionate about. This is a deal-breaker for many companies, and we’re confident its enablement will open many doors for Dashboard’s use in production.



**Conclusion**



It’s invaluable to have data from Kubernetes users on how they’re putting Dashboard to use and how well it’s serving their needs. If you missed the survey response window but still have something you’d like to share, we’d love to connect with you and hear feedback or answer questions:&nbsp;

- Email us at the [SIG-UI mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-ui)
- Chat with us on the Kubernetes Slack [#SIG-UI channel](https://kubernetes.slack.com/messages/sig-ui/)
- Join our weekly meetings at 4PM CEST. See the [SIG-UI calendar](https://calendar.google.com/calendar/embed?src=google.com_52lm43hc2kur57dgkibltqc6kc%40group.calendar.google.com&ctz=Europe/Warsaw) for details.
