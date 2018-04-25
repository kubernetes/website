---
approvers:
- chenopis
title: Custom Jekyll Include Snippets
---

{% capture overview %}
This page explains the custom Jekyll include snippets that can be used in
Kubernetes documentation markdown.

Read more about includes in the [Jekyll documentation](https://jekyllrb.com/docs/includes/).
{% endcapture %}

{% capture body %}
## Feature state

In a markdown page (.md file) on this site, you can add a tag to display
version and state of the documented feature.

### Feature state demo

Below is a demo of the feature state snippet. Here it is used to display the feature as stable in Kubernetes version 1.6.

{% assign for_k8s_version = "1.6" %}
{% include feature-state-stable.md %}

### Feature state code

Below is the template code for each available feature state.

The displayed Kubernetes version defaults to that of the page. This can be
changed by setting the <code>for_k8s_version</code> variable.

````liquid
{{ "{% assign for_k8s_version = " }} "1.6" %}
{{ "{% include feature-state-stable.md " }}%}
````

#### Alpha feature

````liquid
{{ "{% include feature-state-alpha.md " }}%}
````

#### Beta feature

````liquid
{{ "{% include feature-state-beta.md " }}%}
````

#### Stable feature

````liquid
{{ "{% include feature-state-stable.md " }}%}
````

#### Deprecated feature

````liquid
{{ "{% include feature-state-deprecated.md " }}%}
````

## Glossary

You can reference glossary terms with an inclusion that will automatically update and replace content with the relevant links from [our glossary](/docs/reference/glossary/). When the term is moused-over by someone
using the online documentation, the glossary entry will display a tooltip.

The raw data for glossary terms is stored at [https://github.com/kubernetes/website/tree/master/_data/glossary](https://github.com/kubernetes/website/tree/master/_data/glossary), with a YAML file for each glossary term.

### Glossary Demo

For example, the following include within the markdown will render to {% glossary_tooltip text="cluster" term_id="cluster" %} with a tooltip:

````liquid
{{ "{% glossary_tooltip text=" }}"cluster" term_id="cluster" %}
````

## Tabs

In a markdown page (`.md` file) on this site, you can add a tab set to display multiple flavors of a given solution.

### Tabs demo

Below is a demo of the tabs snippet. Here it is used to display each of the installation commands for the various Kubernetes network solutions.

{% capture default_tab %}
Select one of the tabs.
{% endcapture %}

{% capture calico %}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.4/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
```
{% endcapture %}

{% capture flannel %}
```shell
kubectl apply -f "https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml?raw=true"
```
{% endcapture %}

{% capture romana %}
```shell
kubectl apply -f "https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml"
```
{% endcapture %}

{% capture weave_net %}
```shell
kubectl apply -f "https://git.io/weave-kube"
```
{% endcapture %}

{% assign tab_names = "Default,Calico,Flannel,Romana,Weave Net" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: default_tab | push: calico | push: flannel | push: romana | push: weave_net %}

{% include tabs.md %}

### Example Liquid template code for tabs

Below is the [Liquid](https://shopify.github.io/liquid/) template code for the tabs demo above to illustrate how to specify the contents of each tab. The [`/_includes/tabs.md`](https://git.k8s.io/website/_includes/tabs.md) file included at the end then uses those elements to render the actual tab set.

The following sections break down each of the individual features used.

````liquid
{{ "{% capture default_tab " }}%}
Select one of the tabs.
{{ "{% endcapture " }}%}

{{ "{% capture calico " }}%}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.4/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
```
{{ "{% endcapture " }}%}

{{ "{% capture flannel " }}%}
```shell
kubectl apply -f "https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml?raw=true"
```
{{ "{% endcapture " }}%}

{{ "{% capture romana " }}%}
```shell
kubectl apply -f "https://raw.githubusercontent.com/romana/romana/master/containerize/specs/romana-kubeadm.yml"
```
{{ "{% endcapture " }}%}

{{ "{% capture weave_net " }}%}
```shell
kubectl apply -f "https://git.io/weave-kube"
```
{{ "{% endcapture " }}%}

{{ "{% assign tab_names = 'Default,Calico,Flannel,Romana,Weave Net' | split: ',' | compact " }}%}
{{ "{% assign tab_contents = site.emptyArray | push: default_tab | push: calico | push: flannel | push: romana | push: weave_net " }}%}

{{ "{% include tabs.md " }}%}
````

#### Capturing tab content

````liquid
{{ "{% capture calico " }}%}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.4/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
```
{{ "{% endcapture " }}%}
````

The `capture [variable_name]` tags store text or markdown content and assign them to the specified variable.

#### Assigning tab names

````liquid
{{ "{% assign tab_names = 'Default,Calico,Flannel,Romana,Weave Net' | split: ',' | compact " }}%}
````

The `assign tab_names` tag takes a list of labels to use for the tabs. Label text can include spaces. The given comma delimited string is split into an array and assigned to the `tab_names` variable.

#### Assigning tab contents

````liquid
{{ "{% assign tab_contents = site.emptyArray | push: default_tab | push: calico | push: flannel | push: romana | push: weave_net " }}%}
````

The `assign tab_contents` tag adds the contents of each tab pane, captured above, as elements to the `tab_contents` array.

#### Including the tabs.md template

````liquid
{{ "{% include tabs.md " }}%}
````

`{{ "{% include tabs.md " }}%}` pulls in the tabs template code, which uses the `tab_names` and `tab_contents` variables to render the tab set.
{% endcapture %}

{% capture whatsnext %}
* Learn about [Jekyll](https://jekyllrb.com/docs).
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/)
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
{% endcapture %}

{% include templates/concept.md %}
