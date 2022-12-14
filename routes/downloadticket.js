const router = require('express').Router();
const { downloadTicket , LinkShortner} = require('../services/api')
const pdf2base64 = require('pdf-to-base64');
// const base64 = require('base64topdf');



router.post("/bypnr", async (req, res) => {
    console.log("Channel => ", req.body.bot.channel_type);
    let channel = req.body.bot.channel_type
    console.log("dataa -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables
    let flightPnr
    if (workflowVariables.travel_airlines_ticket_pnr_number_with_pnr) {
        flightPnr = workflowVariables.travel_airlines_ticket_pnr_number_with_pnr
    }
    else if (workflowVariables.travel_airlines_ticket_pnr_number_Start) {
        flightPnr = workflowVariables.travel_airlines_ticket_pnr_number_Start
    }
    let userSURNAME = workflowVariables.travel_airlines_passenger_name_last_name

    let url = "https://prod-bl.qp.akasaair.com/api/ibe/booking/eTicket/download?recordLocator={PNR}&lastName={SURNAME}"
    url = url.replace("{PNR}", flightPnr)
    url = url.replace("{SURNAME}", userSURNAME)

    details = {
        url: url,  
        PNR: flightPnr,
        SURNAME: userSURNAME
    }
    


    console.log("user details --> ", details); 
    let response = await downloadTicket(details);
    let errorFlag = false;

    
    if (response.status == 200) {
        if (channel == "gw"){
            console.log( "Response Sent => " , JSON.stringify({
                "messages": [
                    {
                        "type": "file",
                        "testData": [
                            {
                                "image": url,
                                "title": "TICKET",
                                "subtitle": "TICKET",
                                "header": false
                            }
                        ],
                        "content": {
                            "image": url,
                            "title": "TICKET",
                            "subtitle": "TICKET",
                            "header": false
                        }
                    }
                ],
                "status": "success"
        
            }))
            res.send({
                "messages": [
                    {
                        "type": "file",
                        "testData": [
                            {
                                "image": url,
                                "title": "TICKET",
                                "subtitle": "TICKET",
                                "header": false
                            }
                        ],
                        "content": {
                            "image": url,
                            "title": "TICKET",
                            "subtitle": "TICKET",
                            "header": false
                        }
                    }
                ],
                "status": "success"
    
            })
        }
        else if (channel == "W"){
            let pdfBase64
            await pdf2base64(url)
            .then(
                (response) => {
                    pdfBase64 = response
                    // base64.base64Decode(pdfBase64, './ticket.pdf');
                    console.log( "Response Sent => " , JSON.stringify(
                        {
                            status: "success",
                            "templateCode": "imagepdftemplate",
                
                            "payload": JSON.stringify([{
                                "preview": true,
                                "rotate": false,
                                "download": true,
                                "password": false,
                                "pdfs": [{
                                    "name": "Ticket",
                                    "type": "pdf",
                                    "base64": pdfBase64
                                }],
                            }])
                        }
                        ))
                    res.send({
                        status: "success",
                        "templateCode": "imagepdftemplate",
            
                        "payload": JSON.stringify([{
                            "preview": true,
                            "rotate": false,
                            "download": true,
                            "password": false,
                            "pdfs": [{
                                "name": "Ticket",
                                "type": "pdf",
                                "base64": pdfBase64
                            }],
                        }])
                    })
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                }
            )
        }
        

    } else {
        errorFlag = true
    }
    


    if (errorFlag) {

        res.send({
            status: 'error',
        })
    }

})


module.exports = router;