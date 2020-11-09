import json
from flask import Flask, request
from flask_cors import CORS, cross_origin
from handler import ModelHandler


model_handler = ModelHandler()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/get_models/', methods=['GET'])
@cross_origin()
def get_models():
    return model_handler.get_models()


@app.route('/update_model/', methods=['POST'])
@cross_origin()
def update_model():
    request_json = request.get_json()
    if request_json is None:
        response_code, response = 1, "Incorrect request body or content type"
    else:
        model_name = request_json.get('model_name')
        texts = request_json.get('texts')
        response_code, response = model_handler.update_model(model_name=model_name, texts=texts, build_binary=True)

    output_dict = {
        'response_code': response_code,
        'response': response
    }

    return json.dumps(output_dict, ensure_ascii=False)
