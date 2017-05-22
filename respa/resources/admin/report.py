import calendar
import datetime
import io


import xlsxwriter
from collections import defaultdict
from functools import partial
from django import forms
from django.contrib import admin, messages
from django.contrib.admin import helpers
from django.contrib.admin import widgets
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.template.response import TemplateResponse
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from resources.models import Purpose
from resources.models import Reservation
from resources.models import Resource


class FakeReportModel(object):
    class _meta:
        app_label = 'resources'
        model_name = 'reports'
        verbose_name_plural = 'Reservation report'
        object_name = 'ReportObject'

        swapped = False
        abstract = False


def get_initial_start_date():
    return datetime.date.today().replace(day=1, month=1)

def get_initial_end_date():
    date = datetime.date.today().replace(day=31, month=12)
    return date.replace(day=calendar.monthrange(date.year, date.month)[1])


class ReportForm(forms.Form):
    start = forms.DateField(widget=widgets.AdminDateWidget, initial=get_initial_start_date)
    end = forms.DateField(widget=widgets.AdminDateWidget, initial=get_initial_end_date)


def report_view(request):
    if 'do_action' in request.POST:
        form = ReportForm(request.POST)
        if form.is_valid():
            response = HttpResponse(generate_report(start=form.cleaned_data['start'], end=form.cleaned_data['end']),
                                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-disposition'] = 'attachment; filename=report.xlsx'
            return response
    else:
        form = ReportForm()

    return render(request, 'admin/resources/action_reservations_report.html',
                  {'title': u'Report',
                   'form': form})


class ReportAdmin(admin.ModelAdmin):
    def changelist_view(self, request, extra_context=None):
        return HttpResponseRedirect(reverse('admin-reservation-report'))


def generate_report(start, end):
    reservation_counts = defaultdict(partial(defaultdict, int))
    reservations = Reservation.objects.filter(begin__gte=start, end__lte=end, state=Reservation.CONFIRMED)
    for reservation in reservations:
        begin_date = reservation.begin.date()
        begin_key = '{0}-{1}'.format(begin_date.year, begin_date.month)
        year_sum_key = 'sum-{0}'.format(begin_date.year)
        reservation_counts[reservation.resource.pk][begin_key] += 1
        reservation_counts[reservation.resource.pk][year_sum_key] += 1

    purposes_by_id = dict()
    resources = Resource.objects.all()
    resources_by_purpose = defaultdict(list)
    for resource in resources:
        if reservation_counts[resource.pk]:
            first_purpose = resource.purposes.first()
            while first_purpose.parent:
                first_purpose = first_purpose.parent
            if first_purpose.pk not in purposes_by_id:
                purposes_by_id[first_purpose.pk] = first_purpose
            resources_by_purpose[first_purpose.pk].append(resource)

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()

    rows = []
    year_row = ['', '']
    month_row = ['', '']
    month_keys = []
    for year in range(start.year, end.year + 1):
        start_month = 1
        if year == start.year:
            start_month = start.month
        end_month = 12
        if year == end.year:
            end_month = end.month
        for month in range(start_month, end_month + 1):
            if month == start_month:
                year_row.append(year)
            else:
                year_row.append('')
            month_row.append(month)
            month_keys.append('{0}-{1}'.format(year, month))
        year_row.append('')
        month_row.append('\u2211')
        month_keys.append('sum-{0}'.format(year))
    rows.append(year_row)
    rows.append(month_row)

    for purpose_id, ress in resources_by_purpose.items():
        purpose = purposes_by_id[purpose_id]
        rows.append([purpose.name])
        for res in ress:
            row = [res.name, res.unit.name]
            for key in month_keys:
                row.append(reservation_counts[res.pk][key])
            rows.append(row)

    for row_num, row in enumerate(rows):
        for col_num, cell in enumerate(row):
            worksheet.write(row_num, col_num, cell)

    workbook.close()
    return output.getvalue()
