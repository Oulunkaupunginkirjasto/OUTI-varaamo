# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-04-02 14:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0046_add_translation_to_reservation_info'),
    ]

    operations = [
        migrations.AddField(
            model_name='purpose',
            name='display_order',
            field=models.PositiveIntegerField(blank=True, default=0, null=True, verbose_name='Display order'),
        ),
    ]