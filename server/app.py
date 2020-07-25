from chalice import Chalice
import io
import tempfile
import hashlib


def _get_request_bytes():
    rfile = io.BytesIO(app.current_request.raw_body)
    return rfile


def check_keys_in_object(keys, obj):
    missing_keys = list(filter(lambda k: k not in obj, keys))
    if len(missing_keys) > 0:
        err = "Validation Failed: {} not present in object".format(
            ','.join(missing_keys))
        raise Exception(err)


app = Chalice(app_name='contract-sv')


@app.route('/', cors=True)
def index():
    return {'hello': 'world'}


@app.route('/document/history/{document_id}', cors=True)
def get_doc_history(document_id):
    # TODO: get the hash history for the provided document.
    return {'hello': 'world'}


# https://github.com/aws/chalice/issues/79
@app.route('/document/hash/{document_id}', cors=True, methods=['POST'], content_types=['application/octet-stream'])
def hash_doc(document_id):
    file_data = _get_request_bytes()
    data = file_data.getvalue()
    m = hashlib.md5()
    m.update(data)
    file_hash = m.hexdigest()
    return {
        'hash': file_hash
    }

    # with tempfile.NamedTemporaryFile() as temp:
    #     temp.write(body)
    #     temp.flush()
    # TODO: read temp file and store hash to bitcoin sv blockchain.


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
