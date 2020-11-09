FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get upgrade -y && apt-get autoremove && apt-get autoclean && apt-get install -y \
    python3-setuptools \
    python3-pkg-resources \
    python-setuptools-doc \
    python3-pip \
    apt-utils \
    build-essential \
    wget \
    git \
    cmake \
    libboost-system-dev \
    libboost-thread-dev \
    libboost-program-options-dev \
    libboost-test-dev \
    libeigen3-dev \
    zlib1g-dev \
    libbz2-dev \
    liblzma-dev


COPY requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

RUN git clone https://github.com/kpu/kenlm.git /kenlm
RUN cd /kenlm && mkdir -p build && cd build; cmake .. && make -j$(nproc)

RUN apt-get install -y locales && locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ENV PYTHONIOENCODING=utf-8

ARG PROJECT=sova-voice-studio-lm
ARG PROJECT_DIR=/${PROJECT}
RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR

EXPOSE 5000

CMD gunicorn --access-logfile - -w 1 --bind 0.0.0.0:5000 app:app --timeout 15000
