// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EscalationAudit
 * @dev Immutable audit trail for farmer escalation system
 * Records all escalation actions on blockchain for transparency
 */
contract EscalationAudit {

    // Event emitted when escalation is created
    event EscalationCreated(
        string indexed escalationId,
        string userId,
        uint256 timestamp,
        string queryHash
    );

    // Event emitted when officer responds
    event OfficerResponse(
        string indexed escalationId,
        string officerId,
        uint256 timestamp,
        string responseHash,
        string status
    );

    // Event emitted when status changes
    event StatusChanged(
        string indexed escalationId,
        string oldStatus,
        string newStatus,
        uint256 timestamp
    );

    // Struct to store escalation record
    struct EscalationRecord {
        string escalationId;
        string userId;
        string farmerName;
        uint256 createdAt;
        string queryHash; // Hash of the query for privacy
        string status;
        bool exists;
    }

    // Struct to store officer action
    struct OfficerAction {
        string officerId;
        uint256 timestamp;
        string responseHash; // Hash of the response
        string action; // "RESOLVED", "IN_PROGRESS", etc.
    }

    // Mapping: escalationId => EscalationRecord
    mapping(string => EscalationRecord) public escalations;

    // Mapping: escalationId => array of officer actions
    mapping(string => OfficerAction[]) public officerActions;

    // Array to track all escalation IDs
    string[] public escalationIds;

    /**
     * @dev Create new escalation record on blockchain
     * @param _escalationId Unique escalation ID from Firebase
     * @param _userId User/Farmer ID
     * @param _farmerName Farmer's name
     * @param _queryHash Hash of the query (for privacy)
     */
    function createEscalation(
        string memory _escalationId,
        string memory _userId,
        string memory _farmerName,
        string memory _queryHash
    ) public {
        require(!escalations[_escalationId].exists, "Escalation already exists");

        escalations[_escalationId] = EscalationRecord({
            escalationId: _escalationId,
            userId: _userId,
            farmerName: _farmerName,
            createdAt: block.timestamp,
            queryHash: _queryHash,
            status: "PENDING",
            exists: true
        });

        escalationIds.push(_escalationId);

        emit EscalationCreated(
            _escalationId,
            _userId,
            block.timestamp,
            _queryHash
        );
    }

    /**
     * @dev Record officer response
     * @param _escalationId Escalation ID
     * @param _officerId Officer's ID
     * @param _responseHash Hash of officer's response
     * @param _status New status (RESOLVED, IN_PROGRESS, etc.)
     */
    function recordOfficerResponse(
        string memory _escalationId,
        string memory _officerId,
        string memory _responseHash,
        string memory _status
    ) public {
        require(escalations[_escalationId].exists, "Escalation does not exist");

        string memory oldStatus = escalations[_escalationId].status;
        escalations[_escalationId].status = _status;

        OfficerAction memory action = OfficerAction({
            officerId: _officerId,
            timestamp: block.timestamp,
            responseHash: _responseHash,
            action: _status
        });

        officerActions[_escalationId].push(action);

        emit OfficerResponse(
            _escalationId,
            _officerId,
            block.timestamp,
            _responseHash,
            _status
        );

        emit StatusChanged(
            _escalationId,
            oldStatus,
            _status,
            block.timestamp
        );
    }

    /**
     * @dev Get escalation details
     * @param _escalationId Escalation ID
     */
    function getEscalation(string memory _escalationId)
        public
        view
        returns (
            string memory escalationId,
            string memory userId,
            string memory farmerName,
            uint256 createdAt,
            string memory queryHash,
            string memory status
        )
    {
        require(escalations[_escalationId].exists, "Escalation does not exist");

        EscalationRecord memory record = escalations[_escalationId];
        return (
            record.escalationId,
            record.userId,
            record.farmerName,
            record.createdAt,
            record.queryHash,
            record.status
        );
    }

    /**
     * @dev Get all officer actions for an escalation
     * @param _escalationId Escalation ID
     */
    function getOfficerActions(string memory _escalationId)
        public
        view
        returns (OfficerAction[] memory)
    {
        require(escalations[_escalationId].exists, "Escalation does not exist");
        return officerActions[_escalationId];
    }

    /**
     * @dev Get total number of escalations
     */
    function getTotalEscalations() public view returns (uint256) {
        return escalationIds.length;
    }

    /**
     * @dev Get escalation ID by index
     */
    function getEscalationIdByIndex(uint256 index) public view returns (string memory) {
        require(index < escalationIds.length, "Index out of bounds");
        return escalationIds[index];
    }

    /**
     * @dev Verify if escalation exists
     */
    function escalationExists(string memory _escalationId) public view returns (bool) {
        return escalations[_escalationId].exists;
    }
}