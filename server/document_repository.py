from bitsv import Key
from whatsonchain import api


class InsufficientBalanceError(Exception):
    def __init__(self):
        super().__init__('Insufficient wallet balance')


class DocumentRepository:
    def __init__(self, network='test'):
        self.network = network
        self.api = api.Whatsonchain(network=network)

    def _extract_metadata(self, txs):
        # TODO: bulk tx lookup
        results = []
        for tx_id in txs:
            tx = self.api.get_transaction_by_hash(tx_id)
            outputs = tx['vout']
            for output in outputs:  
                pub_key = output['scriptPubKey']
                if pub_key:
                    op_return_data = pub_key['opReturn']
                    if op_return_data:
                        doc_hash, doc_name = op_return_data['parts'][0].split(':')
                        # time should always be present, this shouldn't be necessary
                        time = None
                        if 'time' in tx:
                            time = tx['time']
                        results.append({'name': doc_name, 'hash': doc_hash, 'timestamp': time or 0})
        return results

    def fetch_documents(self, wallet_key):
        p_key = Key(wallet_key, network=self.network)
        txs = p_key.get_transactions()
        metadata_list = self._extract_metadata(txs)
        # TODO: get last modified timestamp
        return sorted(set(map(lambda m: m['name'], metadata_list)))

    def fetch_history(self, wallet_key, doc_name):
        p_key = Key(wallet_key, network=self.network)
        txs = p_key.get_transactions()
        return list(filter(lambda m: m['name'] == doc_name, self._extract_metadata(txs)))

    def save(self, wallet_key, doc_name, doc_hash):
        p_key = Key(wallet_key, network=self.network)
        try:
            p_key.send_op_return(list_of_pushdata=[(doc_name + ':' + doc_hash, 'utf-8')])
            return True
        except ValueError as err:
            if str(err) == 'Transactions must have at least one unspent.':
                raise InsufficientBalanceError
            else:
                print(err)
                return False

