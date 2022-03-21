// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Calendar {
    uint256 rate;
    address payable public owner;

    struct Appointment {
        string title;
        address attendee;
        uint256 startTime;
        uint256 endTime;
        uint256 amountPaid;
    }

    Appointment[] appointments;

    constructor() {
        owner = payable(msg.sender);
    }

    function getRate() public view returns (uint256) {
        return rate;
    }

    function setRate(uint256 _rate) public {
        require(
            msg.sender == owner,
            "Only the owner who can set (adjust) the rate"
        );
        rate = _rate;
    }

    function getAppointments() public view returns (Appointment[] memory) {
        return appointments;
    }

    function createAppointment(
        string memory title,
        uint256 startTime,
        uint256 endTime
    ) public payable {
        Appointment memory appointment;
        appointment.title = title;
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        unchecked {
            appointment.amountPaid = ((startTime - endTime) / 60) * rate;
        }

        require(msg.value >= appointment.amountPaid, "It need more eth");
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Failed to send eth");

        appointments.push(appointment);
    }
}
