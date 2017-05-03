---
title: tab test
---

{% assign tab_set_name = "tab_set" %}

{% capture tabspec %}some_tabs
Tab1 Name, tab1_var
Tab2 Name, tab2_var
Tab3 Name, tab3_var
{% endcapture%}
{% capture tab1_var %}Lorem ipsum dolor{% endcapture %}
{% capture tab2_var %}Consectetur adipiscing elit{% endcapture %}
{% capture tab3_var %}Praesent sed lacus augue{% endcapture %}

{% assign tabsraw = tabspec | newline_to_br | split: '<br />' %}
{% assign tab_set_id = tabsraw[0] | slugify %}
<div id="{{tab_set_id}}" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
    <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
        <li class="ui-state-default ui-corner-top ui-tabs-active ui-state-active" role="tab" tabindex="0" aria-controls="{{tab_set_id}}-0" aria-labelledby="ui-id-0" aria-selected="true" aria-expanded="true"><a href="#{{tab_set_id}}-0" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-0">Default</a></li>
{% for tab in tabsraw offset:1 %}
{% assign thisTab = tab | split: ',' %}
{% assign name=thisTab[0] %}
        <li class="ui-state-default ui-corner-top" role="tab" tabindex="-1" aria-controls="{{tab_set_id}}-{{forloop.index}}" aria-labelledby="ui-id-{{forloop.index}}" aria-selected="false" aria-expanded="false"><a href="#{{tab_set_id}}-{{forloop.index}}" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{forloop.index}}">{{ name }}</a></li>
{% endfor %}
    </ul>
    <div id="{{tab_set_id}}-0" aria-labelledby="ui-id-0" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="false" style="display: block;">Select one of the tabs.</div>
{% for tab in tabsraw offset:1 %}
{% assign thisTab = tab | split: ',' %}
{% assign contents={{thisTab[1]}} %}
    <div id="{{tab_set_id}}-{{forloop.index}}" aria-labelledby="ui-id-{{forloop.index}}" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">{{ contents }}</div>
{% endfor %}
</div>
<script>$(function(){$("#{{tab_set_id}}").tabs();});</script>
