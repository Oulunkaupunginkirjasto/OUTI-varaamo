from django.db import models
from django.utils.translation import ugettext_lazy as _

# Create your models here.
from resources.models import Purpose, Resource, Unit
from resources.models.base import AutoIdentifiedModel, ModifiableModel


class Configuration(AutoIdentifiedModel, ModifiableModel):
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(verbose_name=_('Name'), max_length=200)
    key = models.CharField(verbose_name=_('Key'), max_length=200, unique=True)
    default_route = models.CharField(_('Default route'), max_length=500, null=True, blank=True)
    purposes = models.ManyToManyField(Purpose, verbose_name="Purposes", blank=True)
    resources = models.ManyToManyField(Resource, verbose_name="Resources", blank=True)
    units = models.ManyToManyField(Unit, verbose_name="Units", blank=True)
