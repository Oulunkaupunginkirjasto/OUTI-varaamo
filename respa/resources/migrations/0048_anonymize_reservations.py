# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-07-27 19:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0047_purpose_display_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='has_been_anonymized',
            field=models.BooleanField(default=False, verbose_name='Has been anonymized'),
        ),
        migrations.AddField(
            model_name='resource',
            name='anonymize_after_days',
            field=models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Anonymize reservations after end (days)'),
        ),
    ]
