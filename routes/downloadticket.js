const router = require('express').Router();
const { downloadTicket , LinkShortner} = require('../services/api')

router.post("/bypnr", async (req, res) => {
    console.log("Channel => ", req.body.bot.channel_type);
    let channel = req.body.bot.channel_type
    console.log("dataa -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables
    let flightPnr = workflowVariables.travel_airlines_ticket_pnr_number_with_pnr;
    let userSURNAME = workflowVariables.travel_airlines_passenger_name_last_name

    let url = "https://prod-bl.qp.akasaair.com/api/ibe/booking/eTicket/download?recordLocator={PNR}&lastName={SURNAME}"
    url = url.replace("{PNR}", flightPnr)
    url = url.replace("{SURNAME}", userSURNAME)

    details = {
        url: url,  
        PNR: flightPnr,
        SURNAME: userSURNAME
    }

    const data = url;
    console.log('---ORIGINAL-----', data)
    const encode = Buffer.from(data).toString('base64')
    console.log('\n---ENCODED-----', encode)
    const decode = Buffer.from(encode, 'base64').toString('utf-8')
    console.log('\n---DECODED-----', decode)  


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
            console.log( "Response Sent => " , JSON.stringify(
                {
                    status: "success",
                    "templateCode": "download_ticket_3533",
        
                    "payload": JSON.stringify({
                        "preview": true,
                        "rotate": false,
                        "download": true,
                        "password": false,
                        "pdfs": [{
                            "name": "Ticket",
                            "type": "pdf",
                            "base64": encode
                        }],
                    })
                }
                ))
            res.send({
                status: "success",
                "templateCode": "download_ticket_3533",
    
                "payload": JSON.stringify({
                    "preview": true,
                    "rotate": false,
                    "download": true,
                    "password": false,
                    "pdfs": [{
                        "name": "Ticket",
                        "type": "pdf",
                        "base64": encode
                    }],
                })
            })
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

router.post("/bypnrHardCoded", async (req, res) => {
    console.log("dataa -", req.body.workflow);

    let flightPnr = "Q7QF8G";
    let userSURNAME = "Iyer"

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