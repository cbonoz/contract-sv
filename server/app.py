from chalice import Chalice, CORSConfig, BadRequestError
import io
import os
import hashlib
from chalicelib.document_repository import DocumentRepository
from bitsv import Key


def _get_request_bytes():
    return io.BytesIO(app.current_request.raw_body)


def check_keys_in_object(keys, obj):
    missing_keys = list(filter(lambda k: k not in obj, keys))
    if len(missing_keys) > 0:
        err = "Validation Failed: {} not present in object".format(
            ','.join(missing_keys))
        raise Exception(err)


def get_wallet_key_header():
    wallet_key = app.current_request.headers.get('wallet_key', None)
    if not wallet_key:
        raise BadRequestError('No wallet_key provided')
    return wallet_key


app = Chalice(app_name='contract-sv')

ORIGIN_URL = os.environ.get('ORIGIN_URL', 'http://localhost:3000')
print('origin', ORIGIN_URL)

doc_repo = DocumentRepository()
cors_config = CORSConfig(
    allow_origin=ORIGIN_URL, allow_headers=['wallet_key'])


@ app.route('/', cors=cors_config)
def index():
    return {'hello': 'world', 'origin': ORIGIN_URL}


@ app.route('/documents', cors=cors_config)
def get_docs():
    wallet_key = get_wallet_key_header()
    return doc_repo.fetch_documents(wallet_key)


@ app.route('/document/history/{document_name}', cors=cors_config)
def get_doc_history(document_name):
    wallet_key = get_wallet_key_header()
    return doc_repo.fetch_history(wallet_key, document_name)


@ app.route('/wallet/balance', cors=cors_config)
def get_wallet_balance():
    wallet_key = get_wallet_key_header()
    return Key(wallet_key, network='test').get_balance()


@ app.route('/validate/{transaction_hash}', cors=cors_config)
def validate(transaction_hash):
    return doc_repo.fetch_metadata(transaction_hash)


# https://github.com/aws/chalice/issues/79
@ app.route('/document/hash/{document_name}',
            cors=cors_config,
            methods=['POST'],
            content_types=['application/octet-stream'])
def hash_doc(document_name):
    wallet_key = get_wallet_key_header()
    file_data = _get_request_bytes()
    file_size = len(app.current_request.raw_body)
    data = file_data.getvalue()
    m = hashlib.md5()
    m.update(data)
    file_hash = m.hexdigest()
    if app.current_request.query_params.get('compare', None) == 'true':
        return doc_repo.find_matching_versions(wallet_key, file_hash)
    return doc_repo.save(wallet_key, file_hash, document_name, file_size)


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
