// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FacultyRegistry {
    struct Faculty {
        string name;
        address walletId;
        bytes32 passwordHash;
        uint256 numSubjects;
        mapping(uint256 => string) selectedBaskets;
        mapping(uint256 => string) subjectNames;
        mapping(uint256 => uint256) subjectSemesters;
    }

    mapping(address => Faculty) public faculties;

    function registerFaculty(
        string memory _name,
        address _walletId,
        bytes32 _passwordHash,
        uint256 _numSubjects,
        string[] memory _selectedBaskets,
        string[] memory _subjectNames,
        uint256[] memory _subjectSemesters
    ) public {
        require(faculties[_walletId].walletId != _walletId, "Faculty already registered");
        require(_numSubjects == _selectedBaskets.length && _numSubjects == _subjectNames.length && _numSubjects == _subjectSemesters.length, "Invalid number of subjects");
        
        Faculty storage faculty = faculties[_walletId];
        faculty.name = _name;
        faculty.walletId = _walletId;
        faculty.passwordHash = _passwordHash;
        faculty.numSubjects = _numSubjects;

        for (uint256 i = 0; i < _numSubjects; i++) {
            faculty.selectedBaskets[i] = _selectedBaskets[i];
            faculty.subjectNames[i] = _subjectNames[i];
            faculty.subjectSemesters[i] = _subjectSemesters[i];
        }
    }
}