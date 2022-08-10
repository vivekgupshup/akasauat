const router = require('express').Router();
const { downloadTicket , LinkShortner} = require('../services/api')

router.post("/bypnr", async (req, res) => {
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

    console.log("user details --> ", details); 
 
    let response = await downloadTicket(details);

    let errorFlag = false;

    if (response.status == 200) {
        let shortRes = await LinkShortner(url);

        res.send({
            status: "success",
            "templateCode": "download_ticket_3533",

            "payload": JSON.stringify({
                "url" : shortRes.data.URL
            })

        })

    } else {
        errorFlag = true
    }
    


    if (errorFlag) {

        res.send({
            status: 'error',
            "templateCode": "download_ticket_3533",
        })
    }

})  

module.exports = router;