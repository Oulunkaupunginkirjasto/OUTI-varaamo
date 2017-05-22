"""
kirjastot.fi importer for Units
"""

import dateutil.parser
import functools
import requests
from django.contrib.gis.geos import Point
from django.db import transaction

from ..models import Unit, UnitIdentifier
from .base import Importer, register_importer
from munigeo.models import Municipality


@functools.lru_cache()
def get_muni(muni_id):
    if muni_id:
        return Municipality.objects.get(name__iexact=muni_id)
    return None

def generate_tprek_id(obj):
    return obj.identifiers.get(namespace='tprek').value


@register_importer
class KirjastotUnitsImporter(Importer):
    name = "kirjastot_units"

    def import_units(self, url=None):
        print("Fetching units")
        if not url:
            raise ValueError("Query is required")

        data = units_fetcher(url)

        if not data:
            print("No units found with query: " + url)

        for unit_data in data:

            existing_units = Unit.objects.filter(identifiers__namespace='kirjastot.fi', identifiers__value=unit_data['id']).all()
            if existing_units:
                print("Unit already exists with kirjastot.fi id: %d" % unit_data['id'])
                continue
            unit = create_unit_and_identifiers(unit_data)
            print(str(unit))


@transaction.atomic
def create_unit_and_identifiers(data):
    def dict_from_translated(name, obj, fill_missing=True):
        languages = ("fi", "en", "sv")
        result = dict()
        for language in languages:
            key = name + "_" + language
            if obj[language]:
                result[key] = obj[language]
            elif fill_missing:
                    for fallback in languages:
                        if obj[fallback]:
                            result[key] = obj[fallback]
                    if not result.get(key, None):
                        result[key] = ""
        return result

    def one_from_translated(obj):
        languages = ("fi", "en", "sv")
        result = None
        for language in languages:
            if obj[language]:
                result = obj[language]
        return result

    create_args = dict()
    name = data.get("name", dict())
    create_args.update(dict_from_translated("name", name))
    address = data.get("address", dict())
    street_address = address.get("street", dict())
    create_args.update(dict_from_translated("street_address", street_address))

    create_args["address_zip"] = address.get("zipcode", None)

    www_url = data.get("homepage", dict())
    create_args.update(dict_from_translated("www_url", www_url))

    location = address.get("coordinates")
    if location is not None and location.get("lon", None) and location.get("lat"):
        point = Point(x=float(location["lon"]), y=float(location["lat"]), srid=4326)
        create_args["location"] = point

    with transaction.atomic():
        unit = Unit.objects.create(**create_args)

        unit.identifiers.create(namespace="kirjastot.fi", value=data["id"])
        unit.municipality = get_muni(address.get("city", dict()).get("fi"))
        unit.save()

    return unit


def units_fetcher(query):
    """
    Fetch periods using kirjastot.fi's new v3 API

    :param query: Query to send to API
    :return: dict|None
    """

    base = "https://api.kirjastot.fi/v3/organisation"
    resp = requests.get(base + "?" + query)

    if resp.status_code == 200:
        data = resp.json()
        if data["total"] > 0:
            return data["items"]
    else:
        return list()

    # No units were found :(
    return list()