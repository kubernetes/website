{% if command %}

# {% if site.data.kubectl[command].name != "kubectl" %}kubectl {% endif %}{{ site.data.kubectl[command].name }}

{{ site.data.kubectl[command].synopsis }}

## Description

{{ site.data.kubectl[command].description }}

{% if site.data.kubectl[command].options %}
## Options

| Option | Usage | Default | Shorthand |
|--------|-------|---------|-----------|{% for option in site.data.kubectl[command].options %}
| `{{option.name | strip}}` | {% if option.usage %}{{option.usage| strip | replace:'|',', '}}{% endif %} | {% if option.default_value %}`{{option.default_value| strip}}`{% endif %} | {% if option.shorthand %}`{{ option.shorthand | strip }}`{% endif %} |{% endfor %}
{% endif %}

{% if site.data.kubectl[command].inherited_options %}
## Inherited Options

| Option | Usage | Default | Shorthand |
|--------|-------|---------|-----------|{% for option in site.data.kubectl[command].inherited_options %}
| `{{option.name | strip}}` | {% if option.usage %}{{option.usage| strip | replace:'|',', '}}{% endif %} | {% if option.default_value %}`{{option.default_value| strip}}`{% endif %} | {% if option.shorthand %}`{{ option.shorthand | strip }}`{% endif %} |{% endfor %}
{% endif %}

## See also

{% assign seealsos = site.data.kubectl[command].see_also | sort %}
{% for seealso in seealsos %}
  {% if seealso != "kubectl" %}
    {% capture fullseealsoname %}kubectl_{{seealso}}{% endcapture %}
    {% capture fullcommandname %}kubectl {{seealso}}{% endcapture %}
    {% capture linkurl %}{{ fullseealsoname }}{% endcapture %}
  {% else %}
    {% capture fullseealsoname %}{{seealso}}{% endcapture %}
    {% capture fullcommandname %}{{seealso}}{% endcapture %}
    {% capture linkurl %}{% endcapture %}
  {% endif %}
{% if site.data.kubectl[fullseealsoname].synopsis %}
- [`{{ fullcommandname }}`](/docs/kubectl/{{ linkurl }}) - {{ site.data.kubectl[fullseealsoname].synopsis }}
{% endif %}
{% endfor %}

{% else %}

{% include templates/_errorthrower.md missing_block='command' heading='kubectl (command)' purpose='names the kubectl command, so that the appropriate YAML file (from _data/kubectl) can be transformed into a page.' %}

{% endif %}
