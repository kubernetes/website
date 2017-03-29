---
title: Reviewing Documentation Issues
---

{% capture overview %}

This page explains how documentation issues are reviewed and prioritized for the [kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io){: target="_blank"} repository. The purpose is to provide a way to organize issues and make it easier to contribute to Kubernetes documentation. The following should be used as the standard way of prioritizing, labeling, and interacting with issues.
{% endcapture %}

{% capture body %}

## Categorizing issues
Issues should be sorted into different buckets of work using the following labels and definitions. If an issue doesn't have enough information to identify a problem that can be researched, reviewed, or worked on (i.e. the issue doesn't fit into any of the categories below) you should close the issue with a comment explaining why it is being closed.

### Needs Clarification
* Issues that need more information from the original submitter to make them actionable.  Issues with this label that aren't followed up within a week may be closed. 

### Actionable
* Issues that can be worked on with current information (or may need a comment to explain what needs to be done to make it more clear)
* Allows contributors to have easy to find issues to work on


### Needs Tech Review
* Issues that need more information in order to be worked on (the proposed solution needs to be proven, a subject matter expert needs to be involved, work needs to be done to understand the problem/resolution and if the issue is still relevant)
* Promotes transparency about level of work needed for the issue and that issue is in progress

### Needs Docs Review
* Issues that are suggestions for better processes or site improvements that require community agreement to be implemented
* Topics can be brought to SIG meetings as agenda items

### Needs UX Review
* Issues that are suggestions for improving the user interface of the site.
* Fixing broken site elements. 


## Prioritizing Issues
The following labels and definitions should be used to prioritize issues. If you change the priority of an issues, please comment on the issue with your reasoning for the change.

### P1
* Major content errors affecting more than 1 page
* Broken code sample on a heavily trafficked page
* Errors on a “getting started” page
* Well known or highly publicized customer pain points
* Automation issues

### P2
* Default for all new issues
* Broken code for sample that is not heavily used
* Minor content issues in a heavily trafficked page
* Major content issues on a lower-trafficked page

### P3
* Typos and broken anchor links

## Handling special issue types

### Duplicate issues
If a single problem has one or more issues open for it, the problem should be consolodated into a single issue. You should decide which issue to keep open (or open a new issue), port over all relevant information, link related issues, and close all the other issues that describe the same problem. Only having a single issue to work on will help reduce confusion and avoid duplicating work on the same problem.

### Dead link issues
Depending on where the dead link is reported, different actions are required to resolve the issue. Dead links in the API and Kubectl docs are automation issues and should be assigned a P1 until the problem can be fully understood. All other dead links are issues that need to be manually fixed and can be assigned a P3.

{% endcapture %}



{% capture whatsnext %}
* Learn about [writing a new topic](/docs/contribute/write-new-topic).
* Learn about [using page templates](/docs/contribute/page-templates/).
* Learn about [staging your changes](/docs/contribute/stage-documentation-changes).
{% endcapture %}

{% include templates/concept.md %}
