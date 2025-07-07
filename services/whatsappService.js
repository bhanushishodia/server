const fetch = require('node-fetch');
const FormData = require('form-data');

const sendWhatsAppMessage = async (recipientName, recipientNumber, templateName = "Default_Template", parameters = []) => {
  const apiUrl = 'https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=96';
  const apiKey = 'DDD6CBFD-867C-445D-88E1-D63FBC840EEC';

  console.log('Step 1: Preparing to send WhatsApp message.');
  console.log('Recipient Number:', recipientNumber);
  console.log('Recipient Name:', recipientName); // Logging recipient name
  console.log('Template Name:', templateName);
  console.log('Parameters:', parameters);

  try {
    console.log('Step 2: Sending POST request to API.');

    let dataVal = new FormData();
    dataVal.append('ContactName', recipientName);
    dataVal.append('ContactNo', recipientNumber);
    dataVal.append('Attribute1', recipientName); 

    // Add parameters dynamically
    parameters.forEach((param, index) => {
      dataVal.append(`Param${index + 1}`, param.value);
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "accept": "*/*",
        "X-Api-Key": apiKey,
      },
      body: dataVal,
    });

    console.log('Step 3: Received API response.');
    console.log('Response Status:', response.status);

    const data = await response.json();  // Always parse JSON response

    if (!response.ok) {
      console.log('Step 4: API returned an error.');
      console.log('API Error Details:', data);
      throw new Error(`API Error: ${JSON.stringify(data)}`);
    }

    console.log('Step 5: Message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Step 6: Error occurred in sendWhatsAppMessage function.');
    console.error('Error Details:', error.message || error);
    throw error;
  }
};

// Updated function for payment confirmation
const sendPaymentConfirmationMessage = async (recipientNumber, userName, userEmail) => {
  const apiUrl = 'https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=97';
  const apiKey = 'DDD6CBFD-867C-445D-88E1-D63FBC840EEC';

  console.log('Step 1: Preparing to send payment confirmation WhatsApp message.');
  console.log('Recipient Number:', recipientNumber);
  console.log('User Name:', userName);
  console.log('User Email:', userEmail);

  try {
    console.log('Step 2: Sending POST request to API.');

    let dataVal = new FormData();
    dataVal.append('ContactNo', recipientNumber);
    dataVal.append('ContactName', userName);
    dataVal.append('Attribute1', userName);
    dataVal.append('Attribute2', userEmail);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "accept": "*/*",
        "X-Api-Key": apiKey,
      },
      body: dataVal,
    });

    console.log('Step 3: Received API response.');
    console.log('Response Status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.log('Step 4: API returned an error.');
      console.log('API Error Details:', data);
      throw new Error(`API Error: ${JSON.stringify(data)}`);
    }

    console.log('Step 5: Payment confirmation message sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Step 6: Error occurred in sendPaymentConfirmationMessage function.');
    console.error('Error Details:', error.message || error);
    throw error;
  }
};

module.exports = { sendWhatsAppMessage, sendPaymentConfirmationMessage };
