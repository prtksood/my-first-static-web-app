const msal = require('@azure/msal-node');
const axios = require('axios');
module.exports = async function (context, req) {
    // Read incoming data
    const email = (req.query.email || (req.body && req.body.email));
    const msalConfig = {
        auth: {
            clientId: "afe50edf-6d86-42dd-95a8-b443393beaf4",
            authority: "https://login.microsoftonline.com/89d0242e-efe6-4db7-a750-f8adfe340445",
            clientSecret: "IL17Q~ZLJc.a1m12fdCt6MQazR5FlvXz4Nojd",
        }
    };
    const tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
    };
    const apiConfig = {
        // uri: process.env.GRAPH_ENDPOINT + 'v1.0/users',
        uri: 'https://graph.microsoft.com/v1.0/invitations',
    };
    const cca = new msal.ConfidentialClientApplication(msalConfig);
    const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);

    const options = {
        headers: {
            Authorization: `Bearer ${authResponse.accessToken}`
        }
    };

    const invitation = {
        invitedUserEmailAddress: email,
        inviteRedirectUrl: 'https://casestudydev.sharepoint.com/sites/TrainingPortal',
        sendInvitationMessage:true,
        invitedUserMessageInfo: {
            customizedMessageBody: 'Invited By Graph API'
        }
      };
    const response = await axios.default.post(apiConfig.uri, invitation, options);
    const guestInvite =  response.data;
    context.res.json({
        inviteID: guestInvite.id
    });
};