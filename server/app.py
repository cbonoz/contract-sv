from chalice import Chalice
import io
import hashlib
from chalice import BadRequestError
from document_repository import DocumentRepository


def _get_request_bytes():
    rfile = io.BytesIO(app.current_request.raw_body)
    return rfile


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
repo = DocumentRepository()


@app.route('/', cors=True)
def index():
    return {'hello': 'world'}


@app.route('/documents', cors=True)
def get_docs():
    wallet_key = get_wallet_key_header()
    return repo.fetch_documents(wallet_key)


@app.route('/document/history/{document_name}', cors=True)
def get_doc_history(document_name):
    wallet_key = get_wallet_key_header()
    return repo.fetch_history(wallet_key, document_name)


@app.route('/wallet/balance', cors=True)
def get_wallet_balance():
    wallet_key = get_wallet_key_header()
    print('key', wallet_key)
    return Key(wallet_key, network='test').get_balance()


# https://github.com/aws/chalice/issues/79
@app.route('/document/hash/{document_name}', cors=True, methods=['POST'], content_types=['application/octet-stream'])
def hash_doc(document_name):
    wallet_key = get_wallet_key_header()
    file_data = _get_request_bytes()
    file_size = len(app.current_request.raw_body)
    data = file_data.getvalue()
    m = hashlib.md5()
    m.update(data)
    file_hash = m.hexdigest()
    repo.save(wallet_key, file_hash, document_name, file_size)
    return {
        'hash': file_hash
    }


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
