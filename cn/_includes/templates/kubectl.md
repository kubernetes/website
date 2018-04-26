{% if command %}

# {% if site.data.kubectl[command].name != "kubectl" %}kubectl {% endif %}{{ site.data.kubectl[command].name }}

{{ site.data.kubectl[command].synopsis }}

## Description

{{ site.data.kubectl[command].description }}

{% if site.data.kubectl[command].options %}
## Options

| Option | Shorthand | Default Value | Usage |
|--------------------|---------------|-------|{% for option in site.data.kubectl[command].options %}
| `{{option.name | strip}}` | {% if option.shorthand %}`{{ option.shorthand | strip }}`{% endif %} | {% if option.default_value %}`{{option.default_value| strip}}`{% endif %} | {% if option.usage %}{{option.usage| strip | replace:'|',', '}}{% endif %} |{% endfor %}
{% endif %}

{% if site.data.kubectl[command].inherited_options %}
## Inherited Options

| Option | Shorthand | Default Value | Usage |
|--------------------|---------------|-------|{% for option in site.data.kubectl[command].inherited_options %}
| `{{option.name | strip}}` | {% if option.shorthand %}`{{ option.shorthand | strip }}`{% endif %} | {% if option.default_value %}`{{option.default_value| strip}}`{% endif %} | {% if option.usage %}{{option.usage| strip | replace:'|',', '}}{% endif %} |{% endfor %}
{% endif %}

## See also

{% for seealso in site.data.kubectl[command].see_also %}
- [`{{ seealso }}`](/docs/kubectl/{% if seealso != "kubectl" %}kubectl_{{seealso}}{% endif %})
{% endfor %}

{% else %}

{% include templates/_errorthrower.md missing_block='command' heading='kubectl (command)' purpose='names the kubectl command, so that the appropriate YAML file (from _data/kubectl) can be transformed into a page.' %}

{% endif %}