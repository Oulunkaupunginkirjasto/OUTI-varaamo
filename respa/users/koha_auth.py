import hashlib
import hmac
import requests
from email.utils import formatdate
from django.contrib.auth.backends import ModelBackend
from django.conf import settings

from users.models import KohaUserIdentifier, User


def build_request_headers(method, api_endpoint):
    date = formatdate(timeval=None, localtime=False, usegmt=True)
    return {
        'X-Koha-Date': date,
        'Accept': 'application/json'
    }



def load_user_by_borrowernumber(borrowernumber, first_name=None, last_name=None, email=None):
    user = None
    changed = False
    try:
        identifier = KohaUserIdentifier.objects.get(borrowernumber=borrowernumber)
        user = identifier.user
    except KohaUserIdentifier.DoesNotExist:
        username = 'koha-user-{}'.format(borrowernumber)
        user = User(username=username)
        user.save()
        identifier = KohaUserIdentifier(borrowernumber=borrowernumber, user=user)
        identifier.save()
    if user:
        if first_name and user.first_name != first_name:
            user.first_name = first_name
            changed = True
        if last_name and user.last_name != last_name:
            user.last_name = last_name
            changed = True
        if email and user.email != email:
            user.email = email
            changed = True
        if changed:
            user.save()
        return user
    return None


def request_with_cardnumber_password(cardnumber, password):
    endpoint = '/borrowers/status'
    url = settings.KOHA_API_URL + endpoint
    payload = {'uname': cardnumber, 'passwd': password}
    headers = build_request_headers(method='get', api_endpoint=endpoint)
    try:
        r = requests.get(url, headers=headers, data=payload)
        response_json = r.json()
        if not 'error' in response_json and 'borrowernumber' in response_json:
            return response_json
    except Exception as e:
        return None


class KohaBackend(ModelBackend):
    def authenticate(self, username=None, password=None, **kwargs):
        response = None
        if username and password:
            response = request_with_cardnumber_password(username, password)

        if response:
            if not 'error' in response and 'borrowernumber' in response:
                user = load_user_by_borrowernumber(
                    response['borrowernumber'],
                    first_name=response.get('firstname', None),
                    last_name=response.get('surname', None),
                    email=response.get('email', None)
                )
                return user
        return None
