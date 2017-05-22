import datetime
from collections import namedtuple
import calendar, datetime

import requests
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from psycopg2.extras import DateRange
import delorean
from django.contrib import messages
from django.db import transaction
from django.db.models import Q

from ..models import Unit, UnitIdentifier
from ..importer import kirjastot

from raven import Client

from django.conf import settings


def update_timetables(modeladmin, request, queryset):
    """
    Find varaamo libraries' Units from the queryset,
    ask their data from kirjastot.fi and
    process resulting opening hours if found
    into their Unit object

    Asks the span of opening hours from get_time_range

    :return: None
    """
    in_namespaces = Q(identifiers__namespace="helmet") | Q(identifiers__namespace="kirjastot.fi")
    varaamo_units = queryset.filter(in_namespaces)

    start, end = kirjastot.get_time_range()
    problems = []
    successes = []
    for varaamo_unit in varaamo_units:
        data = kirjastot.timetable_fetcher(varaamo_unit, start, end)
        if data:
            try:
                with transaction.atomic():
                    varaamo_unit.periods.all().delete()
                    kirjastot.process_periods(data, varaamo_unit)
                    successes.append(" ".join(["Periods processed for:", str(varaamo_unit)]))
            except Exception as e:
                problems.append(" ".join(["Problem in processing data of library ", str(varaamo_unit), str(e)]))
        else:
            problems.append(" ".join(["Failed data fetch on library: ", str(varaamo_unit)]))

    try:
        if successes:
            modeladmin.message_user(request, "\n".join(successes))
        if problems:
            modeladmin.message_user(request, "\n".join(problems), level=messages.ERROR)
        if problems and settings.RAVEN_DSN:
            # Report problems to Raven/Sentry
            client = Client(settings.RAVEN_DSN)
            client.captureMessage("\n".join(problems))
    except AttributeError:
        pass