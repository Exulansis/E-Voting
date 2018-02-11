pragma solidity ^0.4.15;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Ballot.sol";

contract TestBallot {
  event Hello(uint a, bytes32 b, uint8 c);

  string MNEMONIC = "mytestphrase5a4cf1";
  string PASSPORT_NR = "123ab67cd";

  address[] stationAddresses;
  Ballot ballot;

  // TODO find a better way to initialize the array.
  function beforeAll() {
    stationAddresses.push(0x0000000000000000000000000000000000000000);
    stationAddresses.push(0x0000000000000000000000000000000000000023);
    stationAddresses.push(address(this));
  }

  function beforeEach() {
    ballot = new Ballot(stationAddresses);
  }

  function testBallotCreation() {
    address intruder = 0x0000000000000000000000000000000000000005;

    for (uint8 i = 0; i < stationAddresses.length; i++) {
      Assert.isTrue(ballot.wasStationRegistered(stationAddresses[i]),
        "Supplied addresses should register correctly.");
    }

    Assert.isFalse(ballot.wasStationRegistered(intruder),
      "Bogus address should not be registered");
  }

  function testVoteCasting() {
    bytes32 mnemonicHash = keccak256(MNEMONIC);

    ballot.addCandidate("John Smith");
    ballot.addCandidate("Sam Alex");
    ballot.startBallot();

    ballot.vote(
      mnemonicHash,
      0
    );

    /* 
      Partial assigning pattern in the form of var (, totalVotesFirst, nameFirst) 
      should be possible, but the solidity parser used by truffle is currently bugged.

      candidateId and totalVotes need to be casted, otherwise the "equal" function
      signature can't be matched.
    */

    var (candidateIdFirst, totalVotesFirst, nameFirst) = ballot.getCandidateById(0);
    Assert.equal(nameFirst, "John Smith", "Candidate name should be correct");
    Assert.equal(uint(candidateIdFirst), uint(0), "Should have the correct candidate id");
    Assert.equal(uint(totalVotesFirst), uint(1), "The vote should be registered");

    var (candidateIdSecond, totalVotesSecond, nameSecond) = ballot.getCandidateById(1);
    Assert.equal(nameSecond, "Sam Alex", "Candidate name should be correct");
    Assert.equal(uint(candidateIdSecond), uint(1), "Should have the correct candidate id");
    Assert.equal(uint(totalVotesSecond), uint(0), "Vote count for second candidate should stay unchanged");
  }
}
