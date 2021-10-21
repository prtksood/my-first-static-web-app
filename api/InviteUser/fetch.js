const axios = require('axios');

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint 
 * @param {string} accessToken 
 */
async function callApi(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    const invitation = {
        invitedUserEmailAddress: 'prtksood@yahoo.co.in',
        inviteRedirectUrl: 'https://casestudydev.sharepoint.com/sites/TrainingPortal',
        sendInvitationMessage:true,
        invitedUserMessageInfo: {
            customizedMessageBody: 'Invited By Graph API'
        }
      };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        // const response = await axios.default.get(endpoint, options);
        const response = await axios.default.post(endpoint, invitation, options);
        return response.data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

module.exports = {
    callApi: callApi
};