import configparser
import os
import re
import nltk
import math
from uuid import uuid4


def get_vocabulary(model):
    vocabulary = []
    unigrams = False
    for line in model:
        if r"\\" in line:
            if "1-grams" in line:
                unigrams = True
                continue
            else:
                if unigrams:
                    break
        entries = line.strip().split("\t")
        if len(entries) > 1:
            word = entries[1]
            vocabulary.append(word)
    return vocabulary


def get_ngrams_count(model):
    ngrams_count = {}
    start_index = 0
    for i, line in enumerate(model):
        if r"\\" in line:
            if "data" in line:
                start_index = i
                continue
            else:
                break
        if "ngram" in line:
            n, count = re.findall(r"\d+", line)
            ngrams_count[int(n)] = int(count)
    return ngrams_count, start_index


def get_new_ngrams(texts, n=3, vocabulary=None):
    ngrams = {}
    for item in texts:
        # Processing incoming text:
        text = item.get("text")
        probability = item.get("probability")
        text = re.sub(r"[^а-я\-\s]", "", text.lower().strip())

        for i in range(1, n + 1):
            # Getting i-grams:
            igrams = list(nltk.everygrams(text.split(), i, i))

            # Removing i-grams that do not have any new words
            bad_indeces = []
            for index, igram in enumerate(igrams):
                bad_igram = True
                for word in igram:
                    if word not in vocabulary:
                        bad_igram = False
                        break
                if bad_igram:
                    bad_indeces.append(index)
            for bad_index in bad_indeces[::-1]:
                igrams.pop(bad_index)

            # Collecting i-grams with new words
            if len(igrams) > 0:
                if i not in ngrams:
                    ngrams[i] = {}
                ngrams[i].update({
                    " ".join(igram): probability for igram in igrams if " ".join(igram) not in ngrams[i] or
                                                                        probability > ngrams[i][" ".join(igram)]
                })
    return ngrams


class ModelHandler:
    def __init__(self, config_dir="config.ini"):
        config = configparser.ConfigParser()
        config.read(config_dir)
        self.models_dir = config["ModelHandler"].get("models_dir")
        self.get_models()

    def get_models(self):
        self.models = {
            file: os.path.join(self.models_dir, file) for file in sorted(os.listdir(self.models_dir))
            if file.endswith(".arpa")
        }
        return self.models

    def update_model(self, model_name, texts, build_binary=False):
        model_path = self.models.get(model_name, None)
        if model_path is None:
            response_code = 1
            response = "Wrong model name"
            return response_code, response

        if texts is None:
            response_code = 1
            response = "No texts supplied"
            return response_code, response

        with open(model_path, "r", encoding="utf-8") as model_file:
            model = model_file.readlines()

        ngrams_count, start_index = get_ngrams_count(model)
        vocabulary = get_vocabulary(model)

        n = max(k for k, v in ngrams_count.items())

        ngrams = get_new_ngrams(texts, n, vocabulary)

        if len(ngrams) < 1:
            response_code = 1
            response = "No new n-grams passed"
            return response_code, response

        insert_index = start_index + 5
        insertions = 0
        for i, igrams in ngrams.items():
            insert_index = insert_index + ngrams_count[i] + 2 + insertions
            insertions = 0
            for igram, prob in igrams.items():
                prob /= 100.0
                if prob < 0 or prob > 1:
                    response_code = 1
                    response = "Please provide correct probabilities in range (0.0, 100.0)"
                    return response_code, response
                # Safe math
                if prob == 1:
                    prob -= 1e-7
                elif prob == 0:
                    prob += 1e-7
                # Temporary using these formulae
                scaled_prob = 10 ** (-(6 - 2 * i)) * prob ** 2
                if i == n:
                    insertion = "{:.6f}\t{}\n".format(math.log10(scaled_prob), igram)
                    model.insert(insert_index, insertion)
                else:
                    # Calculating back-off as log10(1 - prob) and using back-offs for every n except the biggest
                    insertion = "{:.6f}\t{}\t{:.6f}\n".format(math.log10(scaled_prob), igram, math.log10(1 - prob))
                    model.insert(insert_index, insertion)
                insertions += 1

            ngrams_count[i] += insertions

        # Updating n-grams count
        for n, count in ngrams_count.items():
            model[start_index + n + 1] = "ngram {}={}\n".format(n, count)

        uuid = uuid4()
        new_model_name = "lm-{}.arpa".format(uuid)
        with open(os.path.join(self.models_dir, new_model_name), "w", encoding="utf-8") as new_model_file:
            new_model_file.writelines(model)

        # Updating lexicon
        new_lexicon_name = "lexicon-{}.txt".format(uuid)
        with open(os.path.join(self.models_dir, new_lexicon_name), "w", encoding="utf-8") as new_lexicon_file:
            check_unigrams = True
            for line in model:
                if check_unigrams:
                    if "1-grams" in line:
                        check_unigrams = False
                    continue
                # Verify the line is a unigram
                if not re.match(r"[-]*[0-9\.]+\t\S+\t*[-]*[0-9\.]*$", line):
                    break
                word = line.split("\t")[1]
                word = word.strip()
                if word == "<unk>" or word == "<s>" or word == "</s>":
                    continue
                new_lexicon_file.write("{w}\t{s} |\n".format(w=word, s=" ".join(word)))

        # Building binary model
        if build_binary:
            os.popen("/kenlm/build/bin/build_binary {}/lm-{}.arpa {}/lm-{}.klm".format(
                self.models_dir, uuid, self.models_dir, uuid))

        response_code = 0
        response = "Model updated successfully and saved to {}".format(os.path.join(self.models_dir, new_model_name))
        return response_code, response


def test():
    model_handler = ModelHandler()
    for model in model_handler.get_models():
        print(model)

    texts = [
        {
            "text": "хайповый",
            "probability": 75.0
        },
        {
            "text": "Хайповый стиль отличается оригинальными, достаточно странными словами",
            "probability": 60.0
        }
    ]

    for model in model_handler.get_models():
        model_handler.update_model(model, texts)


if __name__ == "__main__":
    test()
