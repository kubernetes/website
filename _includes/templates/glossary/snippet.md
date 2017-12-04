{% assign term_data = site.data.glossary.[include.term_id] %}

{% if include.length == "all" or include.length == "short" %}

{% if term_data.short-description %}

{{ term_data.short-description | liquify | markdownify }}

{% else %}

{% include templates/glossary/_error.md term=term_data.name missing_block='short-description' purpose='concisely describes the key term in 1-2 lines' %}

{% endif %}

{% endif %}

{% if include.length == "all" or include.length == "long" %}

{% if term_data.long-description %}

{{ term_data.long-description | liquify | markdownify }}

{% else %}

{% include templates/glossary/_error.md term=term_data.name missing_block='long-description' purpose='describes the key term in greater depth, supplementing the short-description' %}

{% endif %}

{% endif %}
