---
toc_hide: true
title: Job controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="job" >}}
{{< glossary_tooltip term_id="controller" text="controller" >}}$
creates {{< glossary_tooltip term_id="pod" text="Pods" >}} to run each
Job to completion.

As its pods successfully complete, the controller tracks successful completions.
When a specified number of successful completions is reached, the Job
controller updates the Job object to mark it complete.

{{% /capture %}}


{{% capture body %}}

The Job controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.
It creates one or more Pods to run each Job to completion.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [Jobs](/docs/concepts/workloads/controllers/job-run-to-completion/)
* Read about other [workload controllers](/docs/reference/controllers/workload-controllers/)
{{% /capture %}}
