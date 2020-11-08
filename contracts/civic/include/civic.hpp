#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT civic : public contract
{
public:
  using contract::contract;

  // microseconds vote_period = eosio::days(30);
  // static constexpr uint32_t vote_yes_pass_count = 5; // 5 yes votes

  ACTION propcreate(name creator, string title, string description, uint8_t category, float budget, uint8_t type, string location, eosio::checksum256 photo);

  ACTION propupdate(name updater, uint64_t proposal_id, string title, string description, uint8_t category, float budget,
                    uint8_t type, string location, uint8_t new_status, string regulations, string comment, eosio::checksum256 photo);

  ACTION propupdate2(name updater, uint64_t proposal_id, string title, string description, uint8_t category, float budget,
                    uint8_t type, string location, uint8_t new_status, string regulations, string comment);

  // ACTION propvote(name voter, uint64_t proposal_id, bool vote);

  // Updates votes passed the voting period that have not passed to status = Rejected

  // ACTION propupdfailed(name authorizer);

  // Default actions
  // ACTION hi(name from, string message);
  // ACTION clear();

  ACTION clear();

private:
  enum ProposalCategory
  {
    Green,
    Kids,
    Road,
    Accessibility,
    Art,
    Safety,
    Health,
    Residential
  };

  enum ProposalType
  {
    Create,
    Remove,
    Update
  };

  enum ProposalStatus
  {
    Proposed,
    Reviewing,
    Approved,
    Rejected,
    VotePassed,
    VoteFailed,
    Actioned,
    Closed
  };

  TABLE proposal
  {
    // primary key automatically added by EOSIO method
    uint64_t proposal_id;
    string title;
    string description;
    uint8_t category;
    float budget;
    // Since the enums are not accepted in eosio we are using uint8_t
    uint8_t type;
    // vector<string> photos;
    // Since the enums are not accepted in eosio we are using uint8_t
    uint8_t status;
    string regulations;
    string location;
    // automatically added by EOSIO method
    time_point created;
    time_point approved;
    time_point updated;
    // vector<eosio::name> voted;
    // uint8_t yes_vote_count;
    // Instead of storing image directly on blockchain
    // 1. we convert image to base64 and store it in middleware (NodeJS), calculate sha256 hash of image send that to blockchain
    // 2. we store sha256 hash of the image in blockchain.
    // 3. while retreving also we use sha256 hash as a key and retrive image based on sha256 hash from middelware
    eosio::checksum256 photo;

    auto primary_key() const
    {
      return proposal_id;
    }
  };

  typedef multi_index<name("proposals"), proposal> proposals_table;

  // Default table
  // TABLE messages {
  //   name    user;
  //   string  text;
  //   auto primary_key() const { return user.value; }
  // };
  // typedef multi_index<name("messages"), messages> messages_table;

  void proposal_event(uint64_t proposal_id);
};