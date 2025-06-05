/* global chrome */

import React, { useState } from 'react';
import './Group.css';

function Groups({ groupsInfo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const filteredGroups = groupsInfo.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const exportSelectedGroup = async () => {
    if (selectedGroup) {
      let tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      if (tabs[0].url.includes('https://web.whatsapp.com/')) {
        chrome.tabs.sendMessage(tabs[0].id, { msg: 'GET_GROUP_CONTACTS', id: selectedGroup.id, name: selectedGroup.name })
      }
    }
  };

  return (
    <div className="groups-wrapper">
      {selectedGroup && (
        <div className="selected-groups">
          <strong>Selected Group:</strong>
          <p>{selectedGroup.name} ({selectedGroup.count})</p>
        </div>
      )}

      <input
        className="group-search"
        type="text"
        placeholder="Search groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="group-list">
        {filteredGroups.length === 0 ? (
          <div className="no-groups">No groups found.</div>
        ) : (
          filteredGroups.map((group, index) => (
            <label key={index} className="group-item">
              <input
                type="radio"
                name="group-select"
                checked={selectedGroup?.name === group.name}
                onChange={() => handleSelectGroup(group)}
              />
              {group.name} ({group.count})
            </label>
          ))
        )}
      </div>

      <button
        className="export-btn"
        disabled={!selectedGroup}
        onClick={exportSelectedGroup}
      >
        Export Selected
      </button>
    </div>
  );
}

export default Groups;
