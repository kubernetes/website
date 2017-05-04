{% assign tab_set_id = tab_set_name | default: "tabset" | slugify %}
<div id="{{tab_set_id}}">
    <ul>
{% for name in tab_names %}
        <li><a href="#{{tab_set_id}}-{{forloop.index0}}" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{forloop.index0}}">{{ name | strip }}</a></li>
{% endfor %}
    </ul>
{% for content in tab_contents %}
    <div id="{{tab_set_id}}-{{forloop.index0}}" aria-labelledby="ui-id-{{forloop.index0}}" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">
    {{ content | markdownify }}
    </div>
{% endfor %}
</div>
<script>$(function(){$("#{{tab_set_id}}").tabs();});</script>
