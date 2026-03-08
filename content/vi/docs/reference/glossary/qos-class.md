---
title: QoS Class
id: qos-class
full_link: /docs/concepts/workloads/pods/pod-qos/
short_description: >
  QoS Class (Quality of Service Class) giúp Kubernetes phân loại Pod trong cụm thành nhiều lớp khác nhau để đưa ra quyết định trong việc lập lịch và thu hồi các Pod.  

aka: 
tags:
- fundamental
- architecture
related:
 - pod

---
 QoS Class (Quality of Service Class) giúp Kubernetes phân loại Pod trong cụm thành nhiều lớp khác nhau để đưa ra quyết định trong việc lập lịch và thu hồi các Pod.  

<!--more--> 

QoS Class của một Pod được xác định tại thời điểm tạo ra Pod dựa trên yêu cầu và giới hạn 
{{< glossary_tooltip text="tài nguyên hạ tầng" term_id="infrastructure-resource" >}} của nó.
Các QoS Class thường được sử dụng để đưa ra các quyết định liên quan đến lập lịch và thu hồi Pod.
Kubernetes có thể gán cho Pod một trong các QoS class sau: `Guaranteed`, `Burstable` hoặc `BestEffort`.
