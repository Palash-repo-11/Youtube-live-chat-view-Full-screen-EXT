console.log('inject.js')
const GROUP_TYPES = {
    DEFAULT: 'DEFAULT',
    LINKED_ANNOUNCEMENT_GROUP: 'LINKED_ANNOUNCEMENT_GROUP',
    COMMUNITY: 'COMMUNITY'
};

const excludeCommunity = group => {
    const metadata = window.Store.GroupMetadata.get(group.id);
    if ([GROUP_TYPES.COMMUNITY].includes(metadata?.groupType)) return false;
    return true;
};

const getgroupDetails = () => {
    console.log("qqqqqqqqqqqqqqqqq")

    const groups = window.Store.Contact.getGroupContacts().filter(excludeCommunity).map(c => ({
        name: c.name,
        id: c.id._serialized,
        count: window.Store.GroupMetadata.get(c.id._serialized).participants.length
    }));
    window.dispatchEvent(new CustomEvent('GROUPS_INFO_FETCHED', {
        detail: groups
    }))
}


const getGroupContacts = (groupId, groupName) => {
    try {
        let groupWithContactInfo = {}
        groupWithContactInfo['groupName'] = groupName
        let contactArray = []
        let groupMetaDetails = window.Store.GroupMetadata.get(groupId)
        let groupParticipants = groupMetaDetails?.participants._index
        console.log(groupParticipants)
        Object.values(groupParticipants).map(groupParticipant => {
            let obj = {}
            console.log(groupParticipant)
            let phoneNumber;
            let name;
            if (groupParticipant.id.server === 'lid') {
                phoneNumber = groupParticipant?.phoneNumber?.user || 'HIDDEN_BY_PRIVACY_SETTINGS';
            } else {
                phoneNumber = groupParticipant?.id?.user;
            }
            console.log(phoneNumber, "phoneNumber")
            name = groupParticipant?.contact?.name || groupParticipant?.contact?.pushname
            if (!name) name = 'UNKNOWN CONTACT OR HIDDEN_BY_PRIVACY_SETTINGS'
            console.log(name, "name")
            obj['phoneNumber'] = phoneNumber
            obj['name'] = name
            contactArray.push(obj)
        })
        groupWithContactInfo['contacts'] = contactArray
        window.dispatchEvent(new CustomEvent('GROUP_CONTACT_FETCHED', {
            detail: groupWithContactInfo
        }))
    } catch (error) {
        console.log(error)
    }
}



window.addEventListener('GET_GROUPS_INFO', (event) => {
    console.log("jkgkgjlhk")
    getgroupDetails()
})
window.addEventListener('GET_GROUP_CONTACTS', (event) => {
    getGroupContacts(event.detail.id, event.detail.name)
})