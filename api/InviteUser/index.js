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
    const extSuffix = "#EXT#@casestudydev.onmicrosoft.com";
    const apiConfig = {
        // uri: process.env.GRAPH_ENDPOINT + 'v1.0/users',
        inviteuri: 'https://graph.microsoft.com/v1.0/invitations',
        getuserbymailuri: 'https://graph.microsoft.com/v1.0/users/' + email,
        addmembergroupuri: 'https://graph.microsoft.com/v1.0/groups/1f870b01-52f5-4315-94fb-45b841b45886/members/$ref'
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
    //invite user to tenant
    const response = await axios.default.post(apiConfig.inviteuri, invitation, options);
    const guestInvite =  response.data;
    if(guestInvite.id != null){
        //get guest user id by email
        const userResponse = await axios.default.get(apiConfig.getuserbymailuri.replace("@","_") + extSuffix, options);
        const userObject = userResponse.data;
        const userId = userObject.id;
        const addMember = {
            '@odata.id': 'https://graph.microsoft.com/v1.0/directoryObjects/' + userId
          }
        //add guest to guests group  
        //await axios.default.post(apiConfig.addmembergroupuri, addMember, options);
    }
    context.res.json({
        inviteID: guestInvite.id,
        userID: userId
    });
};