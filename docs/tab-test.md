---
title: tab test
---
{% capture default_tab %}Select one of the tabs.{% endcapture %}
{% capture tab1 %}Lorem ipsum dolor{% endcapture %}
{% capture tab2 %}Consectetur adipiscing elit{% endcapture %}
{% capture tab3 %}Praesent sed lacus augue{% endcapture %}

{% assign tab_set_name = "some_tabs" %}
{% assign tab_names = "Default,Calico,Flannel,Weave Net" | split: ',' | compact %}
{% assign tab_contents = "Select one of the tabs.;" | split: ';' | compact | push: tab1 | push: tab2 | push: tab3 %}

{% include tabs.html %}
