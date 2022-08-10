const router = require('express').Router();
const { getLegkeyByPNR, getLegKeyByflightNum, getLegKeyByOriDestin, getStatusByLegKey } = require('../services/api')
// const roomlevel = require('../model/roomlevel');


router.post("/bypnr", async (req, res) => {
    console.log("dataaaa - ");
    // console.log("dataa -", req.body.workflow.requestVariables.sys_email);
    console.log("dataa -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables

    let flightPnr = workflowVariables.travel_airlines_ticket_pnr_number_with_pnr;
    let userEmail = "";

    let details = {};
    if (workflowVariables.sys_email_Email_ID) {
        userEmail = workflowVariables.sys_email_Email_ID
        details = {
            pnr: flightPnr,
            emailid: userEmail
        }
    } else {
        details = {
            pnr: flightPnr,
            lastname: workflowVariables.any_freetext_last_name
        }
    }

    console.log("user details --> ", details);

    let response = await getLegkeyByPNR(details);

    let errorFlag = false;

    if (!response.errors || response !== "error") {

        let flightLegKey = response.data.journeys[0].segments[0].legs[0].legKey

        let resp = await getStatusByLegKey(flightLegKey)

        console.log("active flight status --> ", resp);

        if (resp !== "error") {

            res.send({
                status: "success",
                "messageCode": "status_message",

                "messageParams": [
                    resp.scheduled
                ]

            })

        } else {
            errorFlag = true
        }

    } else {
        errorFlag = true
    }



    if (errorFlag) {

        res.send({
            status: 'error'
        })
    }

})


router.post("/byflightnum", async (req, res) => {

    console.log("dataa -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables

    let details = {
        date:workflowVariables.sys_date_departure_dd ,
        flightNum: workflowVariables.any_freetext_flight_number
    }

    let response = await getLegKeyByflightNum(details)

    let errorFlag = false;

    console.log("----> ", JSON.stringify(response));
    if (!response.errors && response !== "error" && response.data.length !=0 ) {

        let flightLegKey = response.data[0].journeys[0].segments[0].legs[0].legKey

        let resp = await getStatusByLegKey(flightLegKey)

        console.log("active flight status --> ", resp);

        if (!resp.errors || resp !== "error") {

            res.send({
                status: "success",
                "messageCode": "status_message",

                "messageParams": [
                    resp.scheduled
                ]

            })
        } else {
            errorFlag = true
        }

    } else {
        errorFlag = true
    }



    if (errorFlag) {

        res.send({
            status: "success",
            "messageCode": "status_error",
        })
    }
})




router.post("/byOriginDestin", async (req, res) => {

    console.log("dataa  -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables

    let details = {
        date : workflowVariables.sys_date_departure_date,
        origin: cityCodes[workflowVariables.sys_city_departure_city.toLowerCase()],
        destination: cityCodes[workflowVariables.sys_city_arrival_city.toLowerCase()]
    }

    console.log("details --->",details);
    let response = await getLegKeyByOriDestin(details)

    let errorFlag = false;

    console.log("origin  -> ",cityCodes[workflowVariables.sys_city_departure_city]);
    console.log("origin destin ----> ", JSON.stringify(response));
    if (!response.errors && response !== "error" && response.data.length != 0 ) {

        let flightLegKey = response.data[0].journeys[0].segments[0].legs[0].legKey

        let resp = await getStatusByLegKey(flightLegKey)

        console.log("active flight status --> ", resp);

        if (!resp.errors || resp !== "error") {

            res.send({
                status: "success",
                "messageCode": "status_message",

                "messageParams": [
                    resp.scheduled  
                ]

            })
        } else {
            errorFlag = true
        }

    } else {      
        errorFlag = true
    }



    if (errorFlag) {

        res.send({
            status: "success",
            "messageCode": "status_error",
        })
    }
})







let cityCodes ={
    "bombay" : "BOM",
    "ahmedabad" : "AMD"
}


module.exports = router;