---
title: Workload
id: workload
date: 2019-02-12
full_link: /docs/concepts/workloads/
short_description: >
  A set of applications for processing information to serve a purpose that is valuable to a single user or group of users.

aka:
tags:
- workload
---
A workload consists of a system of services or applications that can run to fulfill a
task or carry out a business process.

<!--more-->

Alongside the computer code that runs to carry out the task, a workload also entails
the infrastructure resources that actually run that code.

For example, a workload that has a web element and a database element might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} of
{{< glossary_tooltip text="pods" term_id="pod" >}} and the webserver via
a {{< glossary_tooltip term_id="Deployment" >}} that consists of many web app
{{< glossary_tooltip text="pods" term_id="pod" >}}, all alike.

The organisation running this workload may well have other workloads that together
provide a valuable outcome to its users.
