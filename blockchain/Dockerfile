FROM dfuse/dfuse-eosio:14063a1
# nodeos v2.0.6

RUN ln -s /app/dfuseeos /bin/dfuseeos
RUN yes | dfuseeos init
RUN sed -i 's/127.0.0.1:8888/0.0.0.0:8888/g' producer/config.ini \
    #    && sed -i '9i plugin = eosio::history_plugin' producer/config.ini \
    #    && sed -i '10i plugin = eosio::history_api_plugin' producer/config.ini \
    && sed -i '9i filter-on=*' producer/config.ini \
    && sed -i '10i filter-out=eosio:onblock:' producer/config.ini \
    && sed -i 'access-control-allow-headers=*' producer/config.ini

# docker-compose build dfuse
# docker-compose run dfuse

# docker build . -f ./Dockerfile-dfuse -t dfuse
# docker run -p 8888:8888 -p 8081:8081 -p 8080:8080 -it dfuse dfuseeos start
# docker run -it dfuse/dfuse-eosio:14063a1 app/dfuseeos init