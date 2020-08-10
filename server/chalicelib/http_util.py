from functools import wraps
from chalice import Response


def bad_request(e: Exception):
    print('Bad Request', e)
    if 'Decoded checksum' in str(e):
        e = 'Error querying BitcoinSV blockchain provided wallet key. Did you enter it correctly? Please logout and try again.'
    return Response(status_code=400,
                    headers={'Content-Type': 'application/json'},
                    body={'error': str(e)})


def wrap_http(f):
    @wraps(f)
    def wrapper(*args, **kwds):
        try:
            return f(*args, **kwds)
        except Exception as e:
            return bad_request(e)
    return wrapper
