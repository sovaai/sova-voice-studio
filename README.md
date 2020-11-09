# SOVA Voice Studio

This service is designed to update [SOVA ASR](https://github.com/sovaai/sova-asr) language models and [SOVA TTS](https://github.com/sovaai/sova-tts) pronunciation dictionaries. SOVA ASR language models are compiled [KenLM](https://github.com/kpu/kenlm) binaries of [ARPA](https://cmusphinx.github.io/wiki/arpaformat/) language models. ARPA language models are created using large text corpora and to get a decent model you have to collect, keep and update a lot of data. SOVA Voice Studio provides a solution to edit existing ARPA language models manually without an initial text corpus by adding new words or sentences to the model via web interface. The approximate frequency of occurance for each word or sentence is provided by the end user. This toolkit is handy in case you don't have the initial text corpora. SOVA TTS pronunciation dictionaries is a new feature that is used to customize the pronunciation of abbreviations, correct word stress for standalone words and short phrases, etc. SOVA Voice Studio can be used as a service to edit such dictionaries with ease and deploy them instantly to SOVA TTS.

## Installation

This repository is supplied with a `Dockerfile` that includes all of the installation procedures. So you have to get Docker and docker-compose first (or Docker Desktop for Windows/macOS).

*	Install Docker (here's a brief instruction for Ubuntu):
```bash
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
$ sudo usermod -aG docker $(whoami)
```
You might need to re-login in order to use docker commands without sudo.

*   Install docker-compose:
```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

*   Deploy the repository:
```bash
$ git clone --recursive https://github.com/sovaai/sova-voice-studio.git
$ cd sova-voice-studio
```

*   (Optional) If you're going to use the service to update the language model for SOVA ASR - put your `.arpa` file to `Data/` folder and set the correct path to it in `config.ini` (or download an existing [Vosk](https://alphacephei.com/vosk/models) Russian ARPA model):
```bash
$ wget http://dataset.sova.ai/SOVA-ASR/vosk.tar.gz
$ mkdir -p Data/ && tar -xvzf vosk.tar.gz -C Data/ && rm vosk.tar.gz
```
You can also get a small language model for testing purposes:
```bash
$ wget http://dataset.sova.ai/SOVA-ASR/vosk-small.tar.gz
$ mkdir -p Data/ && tar -xvzf vosk-small.tar.gz -C Data/ && rm vosk-small.tar.gz
```

*   (Optional) If you're going to use the service to update SOVA TTS pronunciation dictionaries - make sure you provide the correct SOVA TTS URL in the `.env` file in this repository. If you have deployed SOVA Voice Studio on the same server SOVA TTS is located and SOVA TTS is running on port 8899 - you can keep the `http://localhost:8899/` URL.

*   Build docker image:
```bash
$ sudo docker-compose build
```

## Testing

*   (Optional) If you have deployed SOVA Voice Studio on a remote server and willing to use your client device browser for web interface interaction make sure you forward ports to the server provided in `.env` file for correct DNS resolving or open ports if you provide FQDN or correct IP address in `.env` file.

*	Start the service:
```bash
$ sudo docker-compose up -d
```

*   Go to http://localhost:8000. You can choose whether you want to edit a SOVA ASR language model or a SOVA TTS pronunciation dictionary. Choose the model to update, add words or phrases and click the update button.

*   In order to use the updated model with SOVA ASR you have to put the generated language model `.klm` and lexicon `.txt` files to the corresponding SOVA ASR Data directory and choose those files in SOVA ASR `config.ini` and then restart the service. SOVA TTS is updated instantly.
