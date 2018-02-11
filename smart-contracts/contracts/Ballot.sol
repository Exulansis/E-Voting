pragma solidity ^0.4.15;
/*
TODO list:
  Constants / View / Pure
  Overflows, underflows and secure casting uint -> uint8
      Don't register new candidate if < 255
  Handling in case called with bogus arguments
*/

contract Ballot {

  event EventNotification(address sender,uint8 eventType);
  enum States {
    PROVISIONING,
    RUNNING,
    FINISHED
  }

  address owner;
  uint8 currentState;

  struct Vote {
    bytes32 mnemonic;
    uint8 candidateId;
  }

  struct Candidate {
    uint8 candidateId;
    bytes32 displayName;
    uint16 totalVotes;
  }

  mapping(address => bool) isStationRegistered;
  mapping(bytes32 => bool) wasPassportHashUsed;
  mapping(bytes32 => uint16) voteIdByMnemonic;

  Candidate[] registeredCandidates;
  Vote[] votes;

  modifier isProvisioning() {
    require(currentState == uint(States.PROVISIONING));
    _;
  }

  modifier isRunning() {
    require(currentState == uint(States.RUNNING));
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyRegistered() {
    require(isStationRegistered[msg.sender]);
    _;
  }

  // TODO minimum running time.
  function Ballot(address[] _stationAddresses) public {
    owner = msg.sender;
    currentState = uint8(States.PROVISIONING);

    for (uint i = 0; i < _stationAddresses.length; i++) {
      addVotingStation(_stationAddresses[i]);
     }
  }

  function addVotingStation(address _stationAddress) onlyOwner() isProvisioning() public {
    require(isStationRegistered[_stationAddress] == false);
    isStationRegistered[_stationAddress] = true;
  }

    // TODO check if already added.
  function addCandidate(bytes32 _displayName) onlyOwner() isProvisioning() public {
    uint8 candidateId = uint8(registeredCandidates.length);

    registeredCandidates.push(Candidate({
      displayName: _displayName,
      totalVotes: 0,
      candidateId: candidateId
    }));
  }

  function startBallot() onlyOwner() isProvisioning() public {
    currentState = uint8(States.RUNNING);
  }

  /*
    Register a vote casted from a voting station.
    @param _mnemHash - 32 byte keccak256 hash of the mnemonic supplied
      by the user when voting.
    @param _passportHash - 32 byte keccak256 hash of the passport number
      of the voting citizen.
    @param _candidateId - a numeric identifier of the chosen candidate.

    @throws Will revert in case the passport hash has already been registered.
    @throws Will revert in case the candidate id is out of bounds.
    @throws Will revert in case the calling ethereum account is not a voting station.
  */

  function vote(bytes32 _mnemHash, uint8 _candidateId) public
   // isRunning()
   // onlyRegistered()
  {
    // require(_candidateId < registeredCandidates.length);

    uint16 index = uint16(votes.length);

    votes.push(Vote({
      mnemonic: _mnemHash,
      candidateId: _candidateId
    }));

    registeredCandidates[_candidateId].totalVotes ++;
    voteIdByMnemonic[_mnemHash] = index;
  }

  function registerPassportHash(bytes32 _passportHash) 
    isRunning()
    onlyRegistered()
    public
  {
    require(!wasPassportHashUsed[_passportHash]);
    wasPassportHashUsed[_passportHash] = true;
  }

  function stopBallot () isRunning() public {
    currentState = uint8(States.FINISHED);
  }

  // RETRIEVAL FUNCTIONS

  function getCandidateById (uint8 _candidateId) constant public returns(uint8 candidateId, uint16 totalVotes, bytes32 candidateName) {
    return (
      registeredCandidates[_candidateId].candidateId,
      registeredCandidates[_candidateId].totalVotes,
      registeredCandidates[_candidateId].displayName
    );
  }

  function getVoteByMnemonic(bytes32 _mnemonic) constant public returns (bytes32 mnemonic, uint8 candidateId) {
    Vote memory castedVote = votes[voteIdByMnemonic[_mnemonic]];
    return (
      castedVote.mnemonic,
      castedVote.candidateId
    );
  }

  function getNrOfCandidates() constant public returns (uint nr) {
    return uint8(registeredCandidates.length);
  }

  // Usefull for tests, any other reason to keep?
  function wasStationRegistered(address _stationAddress) constant public returns(bool) {
    return isStationRegistered[_stationAddress];
  }
}
