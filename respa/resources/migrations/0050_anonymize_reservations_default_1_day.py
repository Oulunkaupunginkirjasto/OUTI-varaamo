# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-08-30 12:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0049_add_ordering_to_resources_units'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='anonymize_after_days',
            field=models.PositiveSmallIntegerField(default=1, verbose_name='Anonymize reservations after end (days)'),
        ),
    ]
