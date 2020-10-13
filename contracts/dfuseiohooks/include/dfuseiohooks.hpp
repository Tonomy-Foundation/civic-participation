#pragma once

#include <string>

#include <eosio/eosio.hpp>

using eosio::datastream;
using eosio::name;
using std::string;

class [[eosio::contract("dfuseiohooks")]] dfuseiohooks : public eosio::contract
{
public:
    dfuseiohooks(name receiver, name code, datastream<const char *> ds)
        : eosio::contract(receiver, code, ds)
    {
    }

    [[eosio::action]] void event(const string &auth_key, const string &data);
};
