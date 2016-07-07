{% if purpose %}

### Purpose

{{ purpose }}

{% else %}

{% include templates/_errorthrower.md missing_block='purpose' heading='Purpose' purpose='states, in one sentence, what the purpose of this document is, so that the user will know what they are able to achieve if they follow the provided steps.' %}

{% endif %}

{% if recommended_background %}

### Recommended background

{{ recommended_background }}

{% else %}

{% include templates/_errorthrower.md missing_block='recommended_background' heading='Recommended background' purpose='lists assumptions of baseline knowledge that you expect the user to have before reading ahead.' %}

{% endif %}


{% if step_by_step %}

### Step by step

{{ step_by_step }}

{% else %}

{% include templates/_errorthrower.md missing_block='step_by_step' heading='Step by step' purpose='lists a series of linear, numbered steps that accomplish the described task.' %}

{% endif %}