//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CoffeeTracker is ERC1155, AccessControl{
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant MILLER_ROLE = keccak256("MILLER_ROLE");
    bytes32 public constant ROASTER_ROLE = keccak256("ROASTER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    uint256 private _nextBatchId = 1;

    enum Region {
        Kona,
        Kau,
        Puna,
        Hamakua,
        Maui,
        Kauai
    }

    enum Variety {
        Arabica,
        Geisha,
        Typica,
        Caturra,
        Catuai,
        MauiMokka,
        Bourbon,
        Peaberry,
        Maragogype,
        Other
    }

    enum ProcessingMethod {
        Natural,
        Washed,
        Honey,
        Anaerobic
    }

    struct CoffeeBatch {
        // Batch Identification
        uint256 batchId;
        string batchNumber;
        bool verified;
        uint256 mintTimestamp;

        // Origin & Harvesting
        address farmer;
        string farmName;
        Region region;
        uint256 elevation;
        Variety variety;
        uint256 harvestWeight;
        uint256 harvestDate;

        // Processing
        ProcessingMethod processingMethod;
        uint256 moistureContent;
        uint256 scaScore;

        // Milling
        uint256 millWeight;

        // Roasting
        uint256 roastingWeight;
    }

    mapping(uint256 => CoffeeBatch) private batches;

    constructor(
        address admin,
        address farmer,
        address processor,
        address miller,
        address roaster,
        address distributor
    ) ERC1155("https://gray-selected-condor-526.mypinata.cloud/ipfs/bafybeihm357xwzj5casusvs4qaxxxnl2jjlnxmnvczfrdwi75vu7nkfqru/{id}.json") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(FARMER_ROLE, farmer);
        _grantRole(PROCESSOR_ROLE, processor);
        _grantRole(MILLER_ROLE, miller);
        _grantRole(ROASTER_ROLE, roaster);
        _grantRole(DISTRIBUTOR_ROLE, distributor);
    }

    event Harvested(
        uint256 indexed batchId,
        string batchNumber,
        Region region,
        Variety variety,
        address indexed farmer
    );

    event Processed(
        uint256 indexed batchId,
        ProcessingMethod processingMethod,
        uint256 moistureContent,
        address indexed processor
    );

    event Milled(
        uint256 indexed batchId,
        uint256 millWeight,
        address indexed miller
    );

    event Roasted(
        uint256 indexed batchId,
        uint256 roastingWeight,
        uint256 scaScore,
        address indexed roaster
    );

    event Distributed(
        uint256 indexed batchId,
        address indexed distributor
    );

    event Verified(
        uint256 indexed batchId,
        address indexed verifier
    );

    function harvestBatch(
        string memory _batchNumber,
        string memory _farmName,
        Region _region,
        uint256 _elevation,
        Variety _variety,
        uint256 _harvestWeight,
        uint256 _harvestDate
    ) public onlyRole(FARMER_ROLE) {
        uint256 _batchId = _nextBatchId;

        batches[_batchId] = CoffeeBatch({
            batchId: _batchId,
            batchNumber: _batchNumber,
            verified: false,
            mintTimestamp: block.timestamp,

            farmer: msg.sender,
            farmName: _farmName,
            region: _region,
            elevation: _elevation,
            variety: _variety,
            harvestWeight: _harvestWeight,
            harvestDate: _harvestDate,

            processingMethod: ProcessingMethod.Natural,
            moistureContent: 0,
            scaScore: 0,
            millWeight: 0,
            roastingWeight: 0
        });

        emit Harvested(
            _batchId,
            _batchNumber,
            _region,
            _variety,
            msg.sender
        );

        _mint(msg.sender, _batchId, 1, "");

        _nextBatchId++;
    }

    function processBatch(
        uint256 _batchId,
        ProcessingMethod _processingMethod,
        uint256 _moistureContent
    ) public onlyRole(PROCESSOR_ROLE) {
        CoffeeBatch storage batch = batches[_batchId];
        require(batch.batchId != 0, "This coffee batch doesn't exist!");

        batch.processingMethod = _processingMethod;
        batch.moistureContent = _moistureContent;

        emit Processed(
            _batchId,
            _processingMethod,
            _moistureContent,
            msg.sender
        );
    }

    function millBatch(
        uint256 _batchId,
        uint256 _millWeight
    ) public onlyRole(MILLER_ROLE) {
        CoffeeBatch storage batch = batches[_batchId];
        require(batch.batchId != 0, "This coffee batch doesn't exist!");

        batch.millWeight = _millWeight;

        emit Milled(
            _batchId,
            _millWeight,
            msg.sender
        );
    }

    function roastBatch(
        uint256 _batchId,
        uint256 _roastingWeight,
        uint256 _scaScore
    ) public onlyRole(ROASTER_ROLE) {
        CoffeeBatch storage batch = batches[_batchId];
        require(batch.batchId != 0, "This coffee batch doesn't exist!");

        batch.roastingWeight = _roastingWeight;
        batch.scaScore = _scaScore;

        emit Roasted(
            _batchId,
            _roastingWeight,
            _scaScore,
            msg.sender
        );
    }

    function distributeBatch(
        uint256 _batchId
    ) public onlyRole(DISTRIBUTOR_ROLE) {
        CoffeeBatch storage batch = batches[_batchId];
        require(batch.batchId != 0, "This coffee batch doesn't exist!");

        emit Distributed(
            _batchId,
            msg.sender
        );
    }

    function verifyBatch(uint256 _batchId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        CoffeeBatch storage batch = batches[_batchId];
        require(batch.batchId != 0, "This coffee batch doesn't exist!");
        require(!batch.verified, "This coffee batch is already verified!");

        batch.verified = true;

        emit Verified(
            _batchId, 
            msg.sender
        );
    }

    function getBatch(uint256 _batchId) public view returns (CoffeeBatch memory) {
        require(batches[_batchId].batchId != 0, "This coffee batch doesn't exist!");
        return batches[_batchId];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}