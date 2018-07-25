# -*- coding: utf-8 -*-
"""
Management command to remove personal information from old reservations
"""
from datetime import timedelta
from optparse import make_option
import io

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.db import models
from django.db import transaction
from django.db.models import Q
from django.utils.translation import override
from modeltranslation.translator import translator, NotRegistered
from django.apps import apps
from django.utils import timezone


class Command(BaseCommand):
    args = ''
    help = "Anonymize old reservations"

    clear_fields = (
        'user',
        'reserver_name',
        'reserver_phone_number',
        'reserver_address_street',
        'reserver_address_zip',
        'reserver_address_city',
        'reserver_id',
        'billing_address_street',
        'billing_address_zip',
        'billing_address_city',
        'company',
        'reserver_email_address',
    )

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action="store_true", dest="dry_run", default=False, help='Do not make changes to the database')

    def handle(self, *args, **options):

        # Activate the default language for the duration of the import
        # to make sure translated fields are populated correctly.

        resp = []

        do_update = not options.get('dry_run')
        verbosity = options.get('verbosity')

        Resource = apps.get_model('resources', 'Resource')
        Reservation = apps.get_model('resources', 'Reservation')

        end_of_today = timezone.now().replace(hour=23, minute=59, second=59, microsecond=999999)

        # Find resources with anonymization enabled
        resources_cursor = Resource.objects.filter(anonymize_after_days__gt=0)
        resources = [resource for resource in resources_cursor if resource.anonymize_after_days > 0]
        if verbosity >= 2:
            self.stdout.write(self.style.SUCCESS('Anonymization enabled on {} resources'.format(len(resources))))

        if not resources:
            self.stdout.write(self.style.SUCCESS('No reservations to anonymize'.format(len(resources))))
            return

        # Query unanonymized resources
        resource_end_combos = []
        for res in resources:
            delta = timedelta(days=res.anonymize_after_days)
            must_end_before = end_of_today - delta
            query = Q(resource=res.pk, end__lt=must_end_before)
            resource_end_combos.append(query)

        if not resource_end_combos:
            self.stdout.write(self.style.SUCCESS('No reservations to anonymize'.format(len(resources))))
            return
        resource_end_query = resource_end_combos.pop()
        while resource_end_combos:
            resource_end_query |= resource_end_combos.pop()

        reservations_to_anonymize = Reservation.objects.filter(resource_end_query).exclude(has_been_anonymized=True)

        # Anonymize
        count = 0
        for reservation in reservations_to_anonymize:
            if verbosity >= 2:
                self.stdout.write('{}'.format(reservation.pk))
            for field in self.clear_fields:
                if getattr(reservation, field):
                    field_def = Reservation._meta.get_field(field)
                    if field_def.null:
                        setattr(reservation, field, None)
                    elif isinstance(field_def, models.CharField) and field_def.blank:
                        setattr(reservation, field, '')
                    else:
                        setattr(reservation, field, field_def.default)
            reservation.has_been_anonymized = True
            if do_update:
                reservation.save()
            count += 1

        self.stdout.write(self.style.SUCCESS('{} reservations anonymized'.format(count)))
