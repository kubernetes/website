---
assignees:
- chenopis
title: Tabs Example
---

In a markdown page (.md file) on this site, you can add a tab set to display multiple flavors of a given solution. 

## Demo

{% capture default_tab %}
Select one of the tabs.
{% endcapture %}

{% capture calico %}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.0/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
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

## Example Liquid template code for tabs

Below is the [Liquid](https://shopify.github.io/liquid/) template code for the tabs demo above to illustrate how to specify the contents of each tab. The [`/_includes/tabs.md`](https://git.k8s.io/kubernetes.github.io/_includes/tabs.md) file included at the end then uses those elements to render the actual tab set.

### The code

````liquid
{{ "{% capture default_tab " }}%}
Select one of the tabs.
{{ "{% endcapture " }}%}

{{ "{% capture calico " }}%}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.0/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
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

### Capturing tab content

````liquid
{{ "{% capture calico " }}%}
```shell
kubectl apply -f "http://docs.projectcalico.org/v2.0/getting-started/kubernetes/installation/hosted/kubeadm/calico.yaml"
```
{{ "{% endcapture " }}%}
````

The `capture [variable_name]` tags store text or markdown content and assign them to the specified variable.

### Assigning tab names

````liquid
{{ "{% assign tab_names = 'Default,Calico,Flannel,Romana,Weave Net' | split: ',' | compact " }}%}
````

The `assign tab_names` tag takes a list of labels to use for the tabs. Label text can include spaces. The given comma delimited string is split into an array and assigned to the `tab_names` variable. 

### Assigning tab contents

````liquid
{{ "{% assign tab_contents = site.emptyArray | push: default_tab | push: calico | push: flannel | push: romana | push: weave_net " }}%}
````

The `assign tab_contents` tag adds the contents of each tab pane, captured above, as elements to the `tab_contents` array.

### Including the tabs.md template

````liquid
{{ "{% include tabs.md " }}%}
````

`{{ "{% include tabs.md " }}%}` pulls in the tabs template code, which uses the `tab_names` and `tab_contents` variables to render the tab set.
